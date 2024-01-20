"use client";
import React, { useState } from "react";
import AddComment from "./AddComment";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import gql from "graphql-tag";

interface IProps {
  itemId: string;
}

const GET_COMMENTS = gql`
  query GET_COMMENTS($id: ID!) {
    comments(id: $id) {
      id
      text
    }
  }
`;

const Comments = ({ itemId }: IProps) => {
  const { loading, error, data } = useQuery(GET_COMMENTS, {
    variables: { id: itemId },
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <div>
      {data.comments.map((comment: Comment) => (
        <div key={comment.id} style={{ border: "1px solid blue", padding: 8 }}>
          <p>{comment.text}</p>
        </div>
      ))}
      <AddComment itemId={itemId} />
    </div>
  );
};

export default Comments;
