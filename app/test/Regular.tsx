"use client";

import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";

// Define mutation
const LOG_ITEM = gql`
  mutation LogItem($item: ItemInput!) {
    logItem(item: $item) {
      id
      name
      description
      price
      releaseDate
    }
  }
`;

const Regular = () => {
  const [counter, setCounter] = useState(0);
  const [logItem, { data, loading, error }] = useMutation(LOG_ITEM);

  const handleIncrement = async () => {
    try {
      // Call the logItem mutation when incrementing the counter
      const result = await logItem({
        variables: {
          item: {
            name: "Test Item",
            description: "This is a test item",
            price: 49.99,
            releaseDate: "2022-03-01",
          },
        },
      });

      // Handle the result if needed
      console.log("Mutation Result:", result);
    } catch (error) {
      // Handle errors if the mutation fails
      console.error("Mutation Error:", error);
    }

    // Increment the counter locally
    setCounter((count) => count + 1);
  };

  return (
    <div style={{ background: "white", color: "red" }}>
      {counter} {JSON.stringify(data)}
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};

export default Regular;
