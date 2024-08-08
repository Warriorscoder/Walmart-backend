export const queries = `#graphql
    customers: [Customer!]!
    products: [Product!]!
    sales: [Sale!]!
    validateToken(token: String!): TokenValidationResponse!
`;
