import CardItem from "@/app/CardItem";
import CollectionCard from "@/app/CollectionCard";
import Page from "@/components/Page";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import React from "react";
import EditorTools from "../components/EditorTools";

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
        images
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
    <Page>
      <div className="flex flex-col gap-4">
        <h1 className="text-white text-4xl">{collection.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collection.collections.map((collection: Collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
        <h1>Items</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collection.items.map((item: Item) => (
            <CardItem key={item.id} item={item} />
          ))}
        </div>
      </div>
      <EditorTools collectionKey={collection.key} />
    </Page>
  );
};

export default CollectionsPage;
