import Container from "@/components/Container";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import React from "react";
import Comments from "./Comments";
import Page from "@/components/Page";

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
    }
  }
`;

const ItemsPage = async ({ params }: IProps) => {
  const { itemKey } = params;
  const { data } = await getClient().query({
    query: GET_ITEM,
    variables: { key: itemKey },
  });

  const { item } = data satisfies Item;
  return (
    <Page>
      <div className="bg-blue-500 dark:bg-blue-900 text-white dark:text-gray-200 py-8">
        <Container>
          <div className="flex gap-4">
            {/* <img src={item.images[0]} className="h-64 w-64 object-cover" /> */}
            <div>
              <h1 className="text-3xl font-bold my-4">{item.name}</h1>
              {/* <p className="mb-4">{item.description}</p>
              <p className="mb-4">{item.releaseDate}</p>
              <p className="mb-4">{item.price}</p> */}
            </div>
          </div>
        </Container>
      </div>
      {/* <Container>
        <Comments itemId={item.id} />
      </Container> */}
    </Page>
  );
};

export default ItemsPage;
