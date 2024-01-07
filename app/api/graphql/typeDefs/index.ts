import { gql } from "graphql-tag";

const typeDefs = gql`
  type Query {
    hello: String
    item(id: ID!): Item
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
    comments: [Comment]
  }

  type Comment {
    id: ID!
    user: User!
    text: String!
  }

  type User {
    id: ID!
    name: String
  }
`;

export default typeDefs;
