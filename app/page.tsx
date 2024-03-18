export const dynamic = "force-dynamic";
import Page from "@/components/Page";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import TimelineSection from "@/components/TimelineSection";
import { getCurrentUser } from "@/lib/userServices";

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
  const user = getCurrentUser();
  const { data } = await getClient().query({
    query: GET_COLLECTION_TIMELINE,
    variables: { key: `@${user?.entity}` },
    fetchPolicy: "cache-first",
  });

  return (
    <Page title="Prossime uscite">
      {user ? (
        <>
          {data.collectionTimeline.map((timelineElement: TimelineElement) => (
            <TimelineSection
              key={timelineElement.id}
              timelineElement={timelineElement}
            />
          ))}
        </>
      ) : (
        <p>Accedi per create salvare le tue uscite</p>
      )}
    </Page>
  );
}
