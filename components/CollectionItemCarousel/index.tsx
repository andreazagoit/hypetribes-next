"use client";
import ItemCard from "@/app/CardItem";
import { getClient } from "@/lib/client";
import { useQuery } from "@apollo/client";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import gql from "graphql-tag";
import Link from "next/link";
import React, { useState } from "react";

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
        images
        releaseDate
      }
    }
  }
`;

const CollectionItemCarousel = ({ collectionKey }: IProps) => {
  const { error, data } = useSuspenseQuery<any>(GET_COLLECTION, {
    variables: { key: collectionKey },
  });
  const [page, setPage] = useState(1);

  if (error) return <p>Error: {error.message}</p>;

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
