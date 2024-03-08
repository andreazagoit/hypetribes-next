export const dynamic = "force-dynamic";
import Page from "@/components/Page";
import CollectionItemCarousel from "@/components/CollectionItemCarousel";

export default async function Home() {
  const collections = ["luxury", "gucci"];

  return (
    <Page title="Homepage">
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {collections.map((collection) => (
          <CollectionItemCarousel key={collection} collectionKey={collection} />
        ))}
      </div>
    </Page>
  );
}
