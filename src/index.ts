import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import dotenv from "dotenv";
import cors from "cors";
import { prisma } from "./db/index";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createApolloGraphqlServer from "./graphql";
import cookieParser from "cookie-parser";
import authenticateToken from "./graphql/userAuth";

export const jwtsecret = process.env.JWT_SECRET as string;
async function init() {
  const app = express();
  const PORT = process.env.PORT || 8000;

  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:3000"],
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  const gqlServer = await createApolloGraphqlServer();
  app.use(
    "/graphql",
    expressMiddleware(gqlServer, {
      context: async ({ req, res }) => {
        const token = req.cookies.token;
        let user = null;
  
        if (token) {
          try {
            user = jwt.verify(token, jwtsecret);
          } catch (err) {
            console.error("Invalid token");
          }
        }
  
        return { req, res, user };
      },
    })
  );

  app.get("/home", authenticateToken, (req, res) => {
    res.json({ mssg: "hello from home server" });
  });

  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

init().catch((error) => {
  console.error("Error starting server:", error);
  prisma.$disconnect();
});
