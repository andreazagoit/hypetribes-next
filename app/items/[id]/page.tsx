import Container from "@/components/Container";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import React from "react";

interface IProps {
  params: {
    id: string;
  };
}

const query = gql`
  query item($id: ID!) {
    item(id: $id) {
      id
      name
      description
      price
      releaseDate
      comments {
        id
        user {
          id
          name
        }
        text
      }
    }
  }
`;

const ItemsPage = async ({ params }: IProps) => {
  const { id } = params;
  const { data } = await getClient().query({ query: query, variables: { id } });
  const { item }: { item: Item } = data;
  return (
    <>
      <div
        style={{
          background: "blue",
          color: "white",
          paddingTop: 30,
          paddingBottom: 30,
        }}
      >
        <Container>
          <h1>{item.name}</h1>
          <p>{item.description}</p>
          <p>{item.releaseDate}</p>
          <p>{item.price}</p>
        </Container>
      </div>
      <Container
        style={{
          paddingTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {item.comments.map((comment) => (
          <div style={{ border: "1px solid blue", padding: 8 }}>
            <h4>{comment.user.name}</h4>
            <p>{comment.text}</p>
          </div>
        ))}
      </Container>
    </>
  );
};

export default ItemsPage;
