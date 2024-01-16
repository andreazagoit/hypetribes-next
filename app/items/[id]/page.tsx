import Container from "@/components/Container";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import React from "react";
import AddComment from "./AddComment";
import Comments from "./Comments";

interface IProps {
  params: {
    id: string;
  };
}

const query = gql`
  query item($itemId: ID!) {
    item(itemId: $itemId) {
      _id
      name
      description
      price
      releaseDate
      comments {
        _id
        text
      }
    }
  }
`;

const ItemsPage = async ({ params }: IProps) => {
  const { id } = params;
  const { data } = await getClient().query({
    query: query,
    variables: { itemId: id },
    context: { fetchOptions: { cache: "force-cache" } },
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
        <Comments itemId={item._id} comments={item.comments} />
      </Container>
    </>
  );
};

export default ItemsPage;
