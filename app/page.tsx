export const dynamic = "force-dynamic";
import Container from "@/components/Container";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import CardItem from "./CardItem";

const query = gql`
  query items {
    items {
      id
      name
      description
      price
      releaseDate
      comments {
        id
        text
      }
    }
  }
`;

export default async function Home() {
  const { data } = await getClient().query({ query });
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
          {data.items.map((item: Item) => (
            <CardItem key={item.id} item={item} />
          ))}
        </div>
      </Container>
    </main>
  );
}
