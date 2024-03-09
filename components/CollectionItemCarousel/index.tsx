import ItemCard from "@/app/CardItem";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import Link from "next/link";
import React from "react";

interface IProps {
  collectionKey: string;
}

const GET_COLLECTION = gql`
  query Collection($key: String!) {
    collection(key: $key) {
      id
      key
      name
      items {
        id
        key
        name
      }
    }
  }
`;

const CollectionItemCarousel = async ({ collectionKey }: IProps) => {
  const { data } = await getClient().query({
    query: GET_COLLECTION,
    variables: { key: collectionKey },
  });

  return (
    <div>
      <div
        className="flex"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h3 style={{ fontSize: 40, fontWeight: "bold", marginBottom: 10 }}>
          {data.collection.name}
        </h3>
        <Link href={`/collections/${data.collection.key}`}>Vedi tutto</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {data.collection.items.map((item, index) => (
          <ItemCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CollectionItemCarousel;
