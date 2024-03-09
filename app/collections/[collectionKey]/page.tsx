import ItemCard from "@/app/CardItem";
import CollectionCard from "@/app/CollectionCard";
import Page from "@/components/Page";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import React from "react";

interface IProps {
  params: {
    collectionKey: string;
  };
}

const GET_COLLECTION = gql`
  query Collection($key: String!) {
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
        key
        name
      }
    }
  }
`;

const CollectionsPage = async ({ params }: IProps) => {
  const { collectionKey } = params;
  const { data } = await getClient().query({
    query: GET_COLLECTION,
    variables: { key: collectionKey },
  });

  return (
    <Page title={data.collection.name}>
      {data.collection.collections.length > 0 && (
        <>
          <h3 className="text-xl font-bold mb-4">Collections</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {data.collection.collections.map((collection) => (
              <CollectionCard key={collection.key} collection={collection} />
            ))}
          </div>
        </>
      )}
      {data.collection.items.length > 0 && (
        <>
          <h3 className="text-xl font-bold mb-4">Items</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            {data.collection.items.map((item) => (
              <ItemCard key={item.key} item={item} />
            ))}
          </div>
        </>
      )}
    </Page>
  );
};

export default CollectionsPage;
