import CollectionItemCarousel from "@/components/CollectionItemCarousel";
import Page from "@/components/Page";
import React from "react";

const CollectionsPage = () => {
  const collections = ["luxury", "movies"];

  return (
    <Page title="Categories">
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {collections.map((collection) => (
          <CollectionItemCarousel key={collection} collectionKey={collection} />
        ))}
      </div>
    </Page>
  );
};

export default CollectionsPage;
