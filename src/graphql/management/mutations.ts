export const mutations = `#graphql

    login(email: String!, password: String!): AuthPayload!

    createCustomer(
      gender: Gender!
      name: String!
      password: String!
      email: String!
    ): customerPayload!

    createProduct(
      productName:String!
      description: String!
      costPrice: Float!
      expiry:String!
      manufactureDate:String!
      sellingPrice: Float!
      batchId: String!
      categoryName: String!
      weight: Float!
      images: [String!]!
      customerRating: Float
      offerPercentage: Float
      quantity: Int!
    ): Product!

    createPriceHistory(
      price:Float!
      productId: String!
    ): PriceHistory!

    createSale(
    cumulativeDiscount: Float!
    freightPrice: Float!
    storeId: String!
    address: String!
    userId: String!
    paymentType: String!
    saleType: SaleType!
    salesDetails: [SalesDetailInput!]!
  ): Sale!

  createCompetitorPrice(
      productId: String!
      companyName: String!
      price: Float!
      freight:Float!
      customerRating: Float
    ): CompetitorPrice!
    

    
`;


