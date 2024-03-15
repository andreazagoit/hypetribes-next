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
    entity(key: String!): Entity!
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

    addEntity(
      key: String!
      name: String!
      bio: String
      picture: String
    ): Entity!
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
    author: Entity
    items: [Item]!
    collections: [Collection]!
  }

  type Item {
    id: ID!
    key: String!
    name: String!
    description: String
    author: Entity
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
    email: String!
    entity: Entity!
    role: String!
  }

  type Entity {
    id: ID!
    key: String!
    name: String!
    bio: String!
    picture: String!
    collections: [String]!
  }
`;

export default typeDefs;
