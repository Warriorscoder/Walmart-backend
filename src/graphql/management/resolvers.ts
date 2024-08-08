import { jwtsecret } from "../..";
import { prisma } from "../../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SaleType as PrismaSaleType } from "@prisma/client";

async function hashPassword(plainPassword: string) {
  const saltRounds = 10;
  const salt = await bcrypt.genSaltSync(saltRounds);
  const hash = await bcrypt.hashSync(plainPassword, salt);
  return hash;
}
interface SalesDetail {
  productId: string;
  sellingPrice: number;
  quantitySold: number;
}

const fetchProductDetailsAndCalculateTotalAmount = async (salesDetails: SalesDetail[]) => {
  // Extract product IDs from salesDetails
  const productIds = salesDetails.map(detail => detail.productId);

  // Fetch products for each productId in salesDetails
  const fetchedProducts = await prisma.product.findMany({
    where: {
      productId: { in: productIds },
    },
    select: {
      productId: true,
      offerPrice: true,
      customerId: true,
    },
  });

  // Create a map of productId to fetched product details
  const productIdToProductDetails = fetchedProducts.reduce((map, product) => {
    map[product.productId] = product;
    return map;
  }, {} as Record<string, { offerPrice: number; customerId: string }>);

  // Calculate the total amount based on the offer prices and quantities sold
  const totalAmount = salesDetails.reduce((total, detail) => {
    const productDetails = productIdToProductDetails[detail.productId];
    return total + productDetails.offerPrice * detail.quantitySold;
  }, 0);

  return totalAmount;
};

// In your resolvers file
const queries = {
  customers: async (_: any, __: any, { user }: any) => {
    if (!user) throw new Error("Not authenticated");
    return await prisma.customer.findMany({
      where: { customerId: user.userId },
    });
  },
  products: async (_: any, __: any, { user }: any) => {
    if (!user) throw new Error("Not authenticated");
    return await prisma.product.findMany({
      where: { customerId: user.userId },
    });
  },
  sales: async (_: any, __: any, { user }: any) => {
    if (!user) throw new Error("Not authenticated");
    return await prisma.sale.findMany({
      where: { customerId: user.userId },
    });
  },
  validateToken: async (_: any, { token }: { token: string }) => {
    try {
      const decoded = jwt.verify(token, jwtsecret);
      return {
        valid: true,
        message: "Token is valid",
      };
    } catch (error) {
      return {
        valid: false,
        message: "Token is invalid",
      };
    }
  },
};

enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY",
}

enum SaleType {
  BUY,
  SALE,
}

const mutations = {
  createCustomer: async (
    parent: any,
    args: { gender: Gender; name: string; password: string; email: string },
    context: any
  ) => {
    try {
      const hashedPassword = await hashPassword(args.password);
      const newCustomer = await prisma.customer.create({
        data: {
          gender: args.gender,
          name: args.name,
          password: hashedPassword,
          email: args.email,
        },
      });
  
      const { password, ...customerWithoutPassword } = newCustomer;
      const token = jwt.sign({ userId: newCustomer.customerId }, jwtsecret, {
        expiresIn: "1h",
      });
  
      context.res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      });
  
      return { token, customer: customerWithoutPassword, message: "Registration successful" };
    } catch (error) {
      console.error("Error creating customer: ", error);
      throw new Error("Unable to create customer");
    }
  }
  
  
,  

  login: async (
    _: any,
    { email, password }: { email: string; password: string },
    context: any
  ) => {
    const user = await prisma.customer.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user.customerId }, jwtsecret, {
      expiresIn: "1h",
    });

    context.res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    return { token, message: "Login successful" };
  },

  createProduct: async (
    parent: any,
    args: {
      productName: string;
      description: string;
      costPrice: number;
      expiry?: string; // Change Date to string for input type
      manufactureDate?: string; // Change Date to string for input type
      sellingPrice: number;
      batchId: string;
      categoryName: string;
      weight: number;
      images: string[];
      customerRating?: number;
      offerPercentage: number;
      quantity: number;
    },
    context: any
  ) => {
    if (!context.user) throw new Error("Not authenticated");
  
    const offerPrice = args.sellingPrice * (1 - args.offerPercentage / 100);
    const productData: any = {
      productName: args.productName,
      description: args.description,
      costPrice: args.costPrice,
      offerPrice: offerPrice,
      sellingPrice: args.sellingPrice,
      batchId: args.batchId,
      categoryName: args.categoryName,
      weight: args.weight,
      images: args.images,
      customerRating: args.customerRating,
      offerPercentage: args.offerPercentage,
      quantity: args.quantity,
      customerId: context.user.userId, // Include customer ID
      expiry: args.expiry ? new Date(args.expiry) : null,
      manufactureDate: args.manufactureDate ? new Date(args.manufactureDate) : null,
    };
  
    return await prisma.product.create({
      data: productData,
    });
  }
,  

  createPriceHistory: async (
    _: any,
    args: { price: number; productId: string }
  ) => {
    await prisma.priceHistory.create({
      data: {
        price: args.price,
        date: new Date(Date.now()),
        productId: args.productId,
      },
    });
  },

  createSale: async (
    _: any,
    args: {
      totalAmount: number;
      cumulativeDiscount: number;
      freightPrice: number;
      storeId: string;
      address: string;
      userId: string;
      paymentType: string;
      saleType: PrismaSaleType;
      salesDetails: {
        productId: string;
        sellingPrice: number;
        quantitySold: number;
      }[];
    },
    context: any
  ) => {
    if (!context.user) throw new Error("Not authenticated");
  
    const productIds = args.salesDetails.map(detail => detail.productId);
  const fetchedProducts = await prisma.product.findMany({
    where: {
      productId: { in: productIds },
    },
    select: {
      productId: true,
      customerId: true,
    },
  });

  // Create a map of productId to customerId
  const productIdToCustomerId = fetchedProducts.reduce((map, product) => {
    map[product.productId] = product.customerId;
    return map;
  }, {} as Record<string, string>);

  // Check if all productIds have corresponding customerIds
  const allCustomerIdsExist = args.salesDetails.every(detail =>
    productIdToCustomerId.hasOwnProperty(detail.productId)
  );
  if (!allCustomerIdsExist) throw new Error("Some products do not have associated customerIds");

  const totalAmountt = await fetchProductDetailsAndCalculateTotalAmount(args.salesDetails);
  // Create the sale
  const sale = await prisma.sale.create({
    data: {
      userId: args.userId,
      totalAmount: totalAmountt,
      cumulativeDiscount: args.cumulativeDiscount,
      freightPrice: args.freightPrice,
      storeId: args.storeId,
      address: args.address,
      customerId: productIdToCustomerId[args.salesDetails[0].productId], // Assuming all details have the same customerId
      paymentType: args.paymentType,
      saleType: args.saleType,
      saleDate: new Date(),
      salesDetails: {
        create: args.salesDetails.map((detail) => ({
          productId: detail.productId,
          sellingPrice: detail.sellingPrice,
          quantitySold: detail.quantitySold,// Associate customerId with each sale detail
        })),
      },
    },
    include: {
      salesDetails: true,
      },
    });
  
    return sale;
  },
  

  createCompetitorPrice: async (
    parent: any,
    args: {
      productId: string;
      companyName: string;
      price: number;
      freight: number;
      customerRating: number;
    }
  ) => {
    return await prisma.competitorPrice.create({
      data: {
        productId: args.productId,
        companyName: args.companyName,
        price: args.price,
        freight: args.freight,
        customerRating: args.customerRating,
      },
    });
  },
};

export const resolvers = { queries, mutations };
