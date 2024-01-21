import Container from "@/components/Container";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import React from "react";
import Comments from "./Comments";

interface IProps {
  params: {
    id: string;
  };
}

const GET_ITEM = gql`
  query GET_ITEM($id: ID!) {
    item(id: $id) {
      id
      name
      description
      price
      releaseDate
      collections {
        id
        name
      }
      comments {
        id
        text
      }
    }
  }
`;

const ItemsPage = async ({ params }: IProps) => {
  const { id } = params;
  const { data } = await getClient().query({
    query: GET_ITEM,
    variables: { id },
  });
  const { item } = data satisfies Item;
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
        <Comments itemId={item.id} />
      </Container>
    </>
  );
};

export default ItemsPage;
