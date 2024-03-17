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
      <div
        className="bg-blue-900 bg-opacity-75 backdrop-filter backdrop-blur-lg text-white dark:bg-gray-800 dark:bg-opacity-75 dark:text-white py-4 px-6"
        style={{ borderRadius: 20 }}
      >
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row">
            <img
              src={data.item.images[0]}
              className="h-auto w-full object-cover rounded-lg sm:w-64"
              alt={data.item.name}
            />
            <div>
              <h1 className="text-3xl font-bold my-4">{data.item.name}</h1>
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
        </Container>
      </div>
    </Page>
  );
};

export default ItemsPage;
