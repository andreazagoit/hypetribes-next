export const dynamic = "force-dynamic";
import Container from "@/components/Container";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import CardItem from "./CardItem";
import CategoryCard from "./CategoryCard";

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

const GET_CATEGORIES = gql`
  query GET_CATEGORIES {
    categories {
      id
      name
      items {
        id
        name
      }
      categories {
        id
        name
      }
    }
  }
`;

export default async function Home() {
  const { data } = await getClient().query({ query: GET_CATEGORIES });
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
          {data.categories.map((category: Category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
          {JSON.stringify(data)}
        </div>
      </Container>
    </main>
  );
}
