import { gql } from "graphql-tag";

const typeDefs = gql`
  type Query {
    items: [Item]!
    item(id: ID!): Item!
    categories: [Category]!
    category(id: ID!): Category!
    comments(id: ID!): [Comment]!
  }

  type Mutation {
    addItem(
      name: String!
      description: String
      price: Float
      releaseDate: String
      categories: [String]!
    ): Item
    addComment(id: ID!, text: String!): Comment
    addCategory(name: String!, categories: [String]!): Category
    addTestData: AddTestData
  }

  type Category {
    id: ID!
    name: String!
    items: [Item]!
    categories: [Category]!
  }

  type Item {
    id: ID!
    name: String!
    description: String
    price: Float
    releaseDate: String
    categories: [Category]
    comments: [Comment]
  }

  type Comment {
    id: ID!
    text: String!
  }

  type AddTestData {
    categories: [Category]
    items: [Item]
  }
`;

export default typeDefs;
