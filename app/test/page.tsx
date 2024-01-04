import React from "react";
import CardItem from "./CardItem";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import Regular from "./Regular";
import Container from "@/components/Container";

const TestPage = async () => {
  const query = gql`
    query {
      items {
        id
        name
        description
        price
        releaseDate
      }
    }
  `;

  /* const { data } = await getClient().query({ query: query }); */

  return (
    <div style={{ background: "blue" }}>
      <Container style={{ padding: 20 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
          }}
        >
          {/* {data.items.map((item: Item) => (
            <CardItem key={item.id} item={item} />
          ))} */}
        </div>
        <Regular />
      </Container>
    </div>
  );
};

export default TestPage;
