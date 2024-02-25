export const dynamic = "force-dynamic";
import Container from "@/components/Container";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import CollectionCard from "./CollectionCard";
import Page from "@/components/Page";

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

export default async function Home() {
  const { data } = await getClient().query({ query: GET_COLLECTIONS });
  return (
    <Page title="Homepage">
      <div className="grid grid-cols-3 gap-8" style={{ height: "200vh" }}>
        {data.collections.map((collection: Collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
      ciao!
    </Page>
  );
}
