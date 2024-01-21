import { gql } from "graphql-tag";

const typeDefs = gql`
  type Query {
    items: [Item]!
    item(id: ID!): Item!
    collections: [Collection]!
    collection(key: String): Collection!
    comments(id: ID!): [Comment]!
  }

  type Mutation {
    addItem(
      name: String!
      description: String
      price: Float
      releaseDate: String
      collections: [String]!
    ): Item
    addComment(id: ID!, text: String!): Comment
    addCollection(
      key: String!
      name: String!
      collections: [String]!
    ): Collection
    addTestData: AddTestData
  }

  type Collection {
    id: ID!
    key: String!
    name: String!
    items: [Item]!
    collections: [Collection]!
  }

  type Item {
    id: ID!
    name: String!
    description: String
    price: Float
    releaseDate: String
    images: [String]
    collections: [Collection]
    comments: [Comment]
  }

  type Comment {
    id: ID!
    text: String!
  }

  type AddTestData {
    collections: [Collection]
    items: [Item]
  }
`;

export default typeDefs;
