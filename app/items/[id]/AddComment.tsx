"use client";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";

interface IProps {
  itemId: string;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const ADD_COMMENT = gql`
  mutation AddComment($itemId: ID!, $text: String!) {
    addComment(itemId: $itemId, text: $text) {
      _id
      text
    }
  }
`;

const AddComment = ({ itemId, setComments }: IProps) => {
  const [commentText, setCommentText] = useState("");

  const [addComment, { loading, error, client }] = useMutation(ADD_COMMENT, {
    variables: { itemId, text: commentText },
    onCompleted: (data) => {
      console.log(data.addComment);
      setComments((state) => {
        const newState = state.push(...data.addComment);
        console.log(newState);
        return [data.addComment];
      });
    },
  });

  const handleAddComment = async () => {
    try {
      await addComment();
      await client.refetchQueries({
        include: "active",
      });
      // Optionally, you can perform additional actions after a successful comment addition.
      // Example: Clear the input field or show a success message.
      setCommentText("");
    } catch (error: any) {
      console.error("Error adding comment:", error.message);
    }
  };

  return (
    <div>
      {itemId}
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <button onClick={handleAddComment} disabled={loading}>
        Add Comment
      </button>
      {error && <p>Error adding comment: {error.message}</p>}
    </div>
  );
};

export default AddComment;
