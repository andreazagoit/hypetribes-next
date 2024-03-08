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
    <div className="mt-4">
      <textarea
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-900"
        rows={4}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Enter your comment..."
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        onClick={handleAddComment}
        disabled={loading || commentText.trim() === ""}
      >
        {loading ? "Adding Comment..." : "Add Comment"}
      </button>
      {error && (
        <p className="mt-2 text-red-500">
          Error adding comment: {error.message}
        </p>
      )}
    </div>
  );
};

export default AddComment;
