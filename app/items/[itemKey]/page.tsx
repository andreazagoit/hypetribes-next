import Container from "@/components/Container";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import React from "react";
import Page from "@/components/Page";
import moment from "moment";

interface IProps {
  params: {
    itemKey: string;
  };
}

const GET_ITEM = gql`
  query Item($key: String!) {
    item(key: $key) {
      id
      key
      name
      description
      author {
        id
        name
        picture
      }
      images
      releaseDate
      releasePlatforms {
        name
        price
        url
      }
    }
  }
`;

const ItemsPage = async ({ params }: IProps) => {
  const { itemKey } = params;
  const { data } = await getClient().query({
    query: GET_ITEM,
    variables: { key: itemKey },
    fetchPolicy: "cache-first",
  });

  return (
    <Page>
      <Container>
        <div className="bg-blue-900 bg-opacity-75 backdrop-filter backdrop-blur-lg text-white dark:bg-gray-800 dark:bg-opacity-75 dark:text-white">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div
              style={{
                height: 360,
                width: 360,
                position: "relative", // Add this line to make the overlay position relative to the container
                padding: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: `url(${data.item.images[0]})`,
                backgroundSize: "cover",
                backdropFilter: "blur(8px)", // Apply blur to the entire container including overlay
              }}
            >
              {/* Add the overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.6)", // Adjust the opacity as needed
                  backdropFilter: "blur(4px)", // Apply blur to the overlay only
                }}
              ></div>
              <img
                src={data.item.images[0]}
                alt={data.item.name}
                style={{ height: "100%", zIndex: 1 }} // Ensure the image appears above the overlay
              />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h1 className="text-3xl font-bold my-4">{data.item.name}</h1>
                <div>In arrivo {moment(data.item.releaseDate).fromNow()}</div>
              </div>
              <p className="mb-4">{data.item.description}</p>
              <p className="mb-4">
                Release Date:{" "}
                {moment(data.item.releaseDate).format("MMMM DD, YYYY")}
              </p>
              <div className="flex items-center mb-4">
                <p className="font-bold mr-2">Release Platforms:</p>
                <ul>
                  {data.item.releasePlatforms.map((platform, index) => (
                    <li key={index}>
                      <a
                        href={platform.url}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {platform.name} - ${platform.price}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Page>
  );
};

export default ItemsPage;
