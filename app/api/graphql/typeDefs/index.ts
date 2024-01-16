import { gql } from "graphql-tag";

const typeDefs = gql`
  type Query {
    item(itemId: ID!): Item
    items: [Item]
    comments(itemId: ID!): [Comment]
  }

  type Mutation {
    addItem(itemData: ItemInput!): Item
    addComment(itemId: ID!, text: String!): Comment
  }

  type Item {
    _id: ID!
    name: String!
    description: String
    price: Float
    releaseDate: String
    comments: [Comment]
  }

  type Comment {
    _id: ID!
    text: String!
  }

  input ItemInput {
    name: String!
    description: String
    price: Float
    releaseDate: String
  }
`;

export default typeDefs;
