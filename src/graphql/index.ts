import { ApolloServer } from "@apollo/server";
import { graphqlDeatils } from "./management";
import { ExpressContext } from "apollo-server-express"; // Import the type for context
import { Request, Response } from 'express';

// interface Context extends ExpressContext {}
interface Context {
  req: Request;
  res: Response;
  
}


async function createApolloGraphqlServer() {
  const gqlServer = new ApolloServer<Context>({
    typeDefs: `
            ${graphqlDeatils.typedefs}
            type Query {
               ${graphqlDeatils.queries}
            }

            type Mutation {
               ${graphqlDeatils.mutations}
            }
        `,
    resolvers: {
      Query: {
        ...graphqlDeatils.resolvers.queries,
      },
      Mutation: {
        ...graphqlDeatils.resolvers.mutations,
      },
    },
  });

  // Start the gql server
  await gqlServer.start();

  return gqlServer;
}

export default createApolloGraphqlServer;