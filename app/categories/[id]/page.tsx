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

const GET_CATEGORY = gql`
  query GET_CATEGORY($id: ID!) {
    category(id: $id) {
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
    query: GET_CATEGORY,
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
          {data.category.items.map((item: Item) => (
            <CardItem key={item.id} item={item} />
          ))}
          {JSON.stringify(data)}
        </div>
      </Container>
    </main>
  );
};

export default ItemsPage;
