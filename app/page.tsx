export const dynamic = "force-dynamic";
import Page from "@/components/Page";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import ItemCard from "./CardItem";
import moment from "moment";

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
      {data.collectionTimeline.map((timelineElement) => (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {moment(timelineElement.date).format("YYYY-MM-DD")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
            {timelineElement.items.map((item) => (
              <ItemCard key={item.key} item={item} />
            ))}
          </div>
        </div>
      ))}
    </Page>
  );
}
