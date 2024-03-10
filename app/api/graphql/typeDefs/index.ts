import { gql } from "graphql-tag";

const typeDefs = gql`
  type Query {
    items: [Item]!
    item(key: String!): Item!
    mainCollections: [Collection]!
    collections: [Collection]!
    collection(key: String!): Collection!
    collectionTimeline(key: String!): Collection!
    comments(id: ID!): [Comment]!
    user: User!
  }

  type Mutation {
    addItem(
      key: String!
      name: String!
      collections: [String]!
      description: String
      images: [String]
      releaseDate: String
      releasePlatforms: [RelasePlatformInput]
    ): Item!
    addComment(id: ID!, text: String!): Comment

    addCollection(
      key: String!
      name: String!
      collections: [String]
    ): Collection!

    addTestData: String!
    registerWithCredentials(
      name: String!
      email: String!
      password: String!
    ): User!
  }

  input RelasePlatformInput {
    name: String!
    url: String
    price: String
  }

  type RelasePlatform {
    name: String!
    url: String
    price: String
  }

  type Collection {
    id: ID!
    key: String!
    name: String!
    author: User
    items: [Item]!
    collections: [Collection]!
  }

  type Item {
    id: ID!
    key: String!
    name: String!
    description: String
    author: User
    images: [String]!
    releaseDate: String
    releasePlatforms: [RelasePlatform]!
  }

  type Comment {
    id: ID!
    text: String!
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
