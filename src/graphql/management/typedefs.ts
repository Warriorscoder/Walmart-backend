export const typedefs = `#graphql
input SalesDetailInput {
  productId: String!
  sellingPrice: Float!
  quantitySold: Int!
  }
  type AuthPayload {
      token: String!
      message: String!
    }
    type customerPayload {
  token: String!
  message: String!
  customer: Customer!  # Correct field name
}
    type TokenValidationResponse {
  valid: Boolean!
  message: String!
}
    enum Gender {
    MALE
    FEMALE
    PREFER_NOT_TO_SAY
  }

  enum SaleType {
  BUY
  SALE
}

  type Customer {
    customerId: String!
    gender: Gender!
    name: String!
    income: Float!
    email: String!
    sales: [Sale!]!
  }

  type Product {
    productId: String!
    productName:String!
    description: String!
    costPrice: Float!
    sellingPrice: Float!
    expiry: String
    batchId: String
    manufactureDate: String
    categoryName: String!
    weight: Float!
    images: [String!]!
    customerRating: Float
    offerPercentage: Float
    customerId:String!
    quantity: Float
  salesDetails: [SalesDetail!]!
  }

  type PriceHistory {
    id:String!
    price:Float!
    date:String!
    productId:String!
  }

  type Sale {
  saleId: String!
  totalAmount: Float!
  cumulativeDiscount: Float!
  freightPrice: Float!
  storeId: String!
  address: String!
  customerId: String!
  saleDate: String!
  paymentType: String!
  saleType: SaleType!
  salesDetails: [SalesDetail!]!
}

type SalesDetail {
  salesDetailId: String!
  saleId: String!
  productId: String!
  sellingPrice: Float!
  quantitySold: Int!
}

type CompetitorPrice {
    competitorPriceId: String!
    productId: String!
    product: Product!
    companyName: String!
    price: Float!
    customerRating: Float
  }

  
`;
