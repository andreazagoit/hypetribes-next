import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import mongoose from "mongoose"; // Import Mongoose

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://admin:h1LxqZ3rv0skoBZT@cluster0.sdbpxio.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.log("error", error));

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

// Start server and create request handler
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

export { handler as GET, handler as POST };
