import CardItem from "@/app/CardItem";
import CollectionCard from "@/app/CollectionCard";
import Container from "@/components/Container";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import React from "react";

interface IProps {
  params: {
    key: string;
  };
}

const GET_COLLECTION = gql`
  query GET_COLLECTION($key: String!) {
    collection(key: $key) {
      id
      key
      name
      collections {
        id
        key
        name
      }
      items {
        id
        name
        description
        releaseDate
      }
    }
  }
`;

const CollectionsPage = async ({ params }: IProps) => {
  const { key } = params;
  const { data } = await getClient().query({
    query: GET_COLLECTION,
    variables: { key },
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
        <h1>Items</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
            alignItems: "stretch",
            gridAutoRows: "1fr",
          }}
        >
          {collection.items.map((item: Item) => (
            <CardItem key={item.id} item={item} />
          ))}
        </div>
      </Container>
    </main>
  );
};

export default CollectionsPage;
