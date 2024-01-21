import CardItem from "@/app/CardItem";
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
    }
  }
`;

const ItemsPage = async ({ params }: IProps) => {
  const { id } = params;
  const { data } = await getClient().query({
    query: GET_COLLECTION,
    variables: { id },
  });

  return (
    <main style={{ background: "blue" }}>
      <Container style={{ padding: 20 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
          }}
        >
          {data.collection.items.map((item: Item) => (
            <CardItem key={item.id} item={item} />
          ))}
          {JSON.stringify(data)}
        </div>
      </Container>
    </main>
  );
};

export default ItemsPage;
