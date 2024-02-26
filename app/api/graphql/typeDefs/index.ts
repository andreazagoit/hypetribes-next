import { gql } from "graphql-tag";

const typeDefs = gql`
  type Query {
    items: [Item]!
    item(id: ID!): Item!
    collections: [Collection]!
    collection(key: String!): Collection!
    comments(id: ID!): [Comment]!
    user: User!
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
    registerWithCredentials(
      name: String!
      email: String!
      password: String!
    ): User!
    loginWithCredentials(email: String!, password: String!): User!
    loginWithGoogle(accessToken: String!): User
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

  type User {
    id: ID!
    name: String!
    email: String!
    picture: String
    token: String!
  }
`;

export default typeDefs;
