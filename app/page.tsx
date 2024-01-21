export const dynamic = "force-dynamic";
import Container from "@/components/Container";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import CollectionCard from "./CollectionCard";

const GET_ITEMS = gql`
  query GET_ITEMS {
    items {
      id
      name
      description
      price
      releaseDate
    }
  }
`;

const GET_COLLECTIONS = gql`
  query GET_COLLECTIONS {
    collections {
      id
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
    <main style={{ background: "blue" }}>
      <Container style={{ padding: 20 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
          }}
        >
          {data.collections.map((collection: Collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </Container>
    </main>
  );
}
