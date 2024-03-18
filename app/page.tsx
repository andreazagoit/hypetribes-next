export const dynamic = "force-dynamic";
import Page from "@/components/Page";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import TimelineSection from "@/components/TimelineSection";

const GET_COLLECTION_TIMELINE = gql`
  query CollectionTimeline($key: String!) {
    collectionTimeline(key: $key) {
      id
      date
      items {
        id
        key
        name
        images
        releaseDate
      }
    }
  }
`;

export default async function Home() {
  const { data } = await getClient().query({
    query: GET_COLLECTION_TIMELINE,
    variables: { key: "movies" },
    fetchPolicy: "cache-first",
  });

  return (
    <Page title="Prossime uscite">
      {data.collectionTimeline.map((timelineElement: TimelineElement) => (
        <TimelineSection
          key={timelineElement.id}
          timelineElement={timelineElement}
        />
      ))}
    </Page>
  );
}
