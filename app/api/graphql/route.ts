import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import mongoose from "mongoose"; // Import Mongoose

console.log("initialize");

mongoose
  .connect(
    "mongodb+srv://admin:h1LxqZ3rv0skoBZT@cluster0.sdbpxio.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("mongoose ok");
  })
  .catch((error) => console.log("error", error));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

// Typescript: req has the type NextRequest
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

export { handler as GET, handler as POST };
