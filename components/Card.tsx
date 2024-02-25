import React from "react";

const Card = ({ title, content }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
      <h2 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">
        {title}
      </h2>
      <p className="text-gray-700">{content}</p>
    </div>
  );
};

export default Card;
