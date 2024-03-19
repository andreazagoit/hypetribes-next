export const dynamic = "force-dynamic";
import ItemCard from "@/app/CardItem";
import CollectionCard from "@/app/CollectionCard";
import FollowCollectionButton from "@/components/FollowCollectionButton";
import Page from "@/components/Page";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import { cookies } from "next/headers";
import Image from "next/image";
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
      following
      author {
        id
        name
        picture
      }
      collections {
        id
        key
        name
      }
      items {
        id
        key
        name
        images
      }
    }
  }
`;

const CollectionsPage = async ({ params }: IProps) => {
  const { collectionKey } = params;
  const session = cookies().get("__session")?.value;
  const { data } = await getClient().query({
    query: GET_COLLECTION,
    variables: { key: collectionKey },
    fetchPolicy: "cache-first",
    context: {
      headers: {
        authorization: `Bearer ${session}`,
      },
    },
  });

  return (
    <Page
      title={
        <div style={{ marginBottom: 20 }}>
          <h2
            style={{ fontSize: 48, fontWeight: "bold", lineHeight: "normal" }}
          >
            {data.collection.name}
          </h2>
          <div
            className="flex"
            style={{ alignItems: "center", gap: 4, fontSize: 12 }}
          >
            <p>Created by</p>
            {data.collection.author && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <p style={{ fontWeight: "bold" }}>
                  {data.collection.author.name}
                </p>
                <Image
                  src={data.collection.author.picture}
                  width={64}
                  height={64}
                  alt="Picture of the author"
                  className="h-4 w-4 rounded-full"
                />
              </div>
            )}
          </div>
        </div>
      }
      actions={
        <>
          {session && (
            <FollowCollectionButton
              following={data.collection.following}
              collectionKey={collectionKey}
              session={session}
            />
          )}
        </>
      }
    >
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
