"use client";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";

interface IProps {
  itemId: string;
}

const ADD_COMMENT = gql`
  mutation ADD_COMMENT($id: ID!, $text: String!) {
    addComment(id: $id, text: $text) {
      id
      text
    }
  }
`;

const AddComment = ({ itemId }: IProps) => {
  const [commentText, setCommentText] = useState("");

  const [addComment, { loading, error, client }] = useMutation(ADD_COMMENT, {
    variables: { id: itemId, text: commentText },
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
