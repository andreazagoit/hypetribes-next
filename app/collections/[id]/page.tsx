import CardItem from "@/app/CardItem";
import CollectionCard from "@/app/CollectionCard";
import Container from "@/components/Container";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import React from "react";

interface IProps {
  params: {
    id: string;
  };
}

const GET_COLLECTION = gql`
  query GET_COLLECTION($id: ID!) {
    collection(id: $id) {
      id
      name
      items {
        id
        name
        description
      }
      collections {
        id
        name
      }
    }
  }
`;

const ItemsPage = async ({ params }: IProps) => {
  const { id } = params;
  const { data } = await getClient().query({
    query: GET_COLLECTION,
    variables: { id },
  });

  const { collection }: { collection: Collection } = data;

  return (
    <main style={{ background: "blue" }}>
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "1rem 0",
        }}
      >
        <h1 style={{ color: "white", fontSize: 100 }}>{collection.name}</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
          }}
        >
          {collection.collections.map((collection: Collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </Container>
    </main>
  );
};

export default ItemsPage;
