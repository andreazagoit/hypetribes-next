"use client";
import React, { useState } from "react";
import AddComment from "./AddComment";

interface IProps {
  itemId: string;
  comments: Comment[];
}

const Comments = ({ itemId, comments: commentsList }: IProps) => {
  const [comments, setComments] = useState(commentsList);
  return (
    <div>
      {comments.map((comment: Comment) => (
        <div key={comment._id} style={{ border: "1px solid blue", padding: 8 }}>
          <p>{comment.text}</p>
        </div>
      ))}
      <AddComment itemId={itemId} setComments={setComments} />
    </div>
  );
};

export default Comments;
