export const dynamic = "force-dynamic";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import CollectionCard from "./CollectionCard";
import Page from "@/components/Page";
import Carousel from "@/components/Carousel";

const GET_COLLECTIONS = gql`
  query GET_COLLECTIONS {
    collections {
      key
      name
      items {
        id
        name
      }
      collections {
        id
        name
      }
    }
  }
`;

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

export default async function Home() {
  const { data } = await getClient().query({ query: GET_COLLECTIONS });
  const { data: testData } = await getClient().query({
    query: GET_COLLECTION,
    variables: { key: "movie" },
  });

  const collection: Collection = testData.collection;

  return (
    <Page title="Homepage">
      <div className="grid grid-cols-3 gap-8">
        {data.collections.map((collection: Collection) => (
          <CollectionCard key={collection.key} collection={collection} />
        ))}
      </div>

      <Carousel title={collection.name}>
        {collection.collections.map((collection) => (
          <CollectionCard key={collection.key} collection={collection} />
        ))}
      </Carousel>
    </Page>
  );
}
