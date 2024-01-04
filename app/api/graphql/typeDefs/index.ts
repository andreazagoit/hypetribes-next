import { gql } from "graphql-tag";

const typeDefs = gql`
  type Query {
    hello: String
    items: [Item]
  }

  type Mutation {
    logItem(item: ItemInput!): Item
  }

  input ItemInput {
    name: String!
    description: String
    price: Float
    releaseDate: String
  }

  type Item {
    id: ID!
    name: String!
    description: String
    price: Float
    releaseDate: String
  }
`;

export default typeDefs;
