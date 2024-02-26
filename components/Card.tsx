import React from "react";

const Card = ({ title, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-300 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 border-b border-gray-300 dark:border-gray-700 pb-2 text-gray-800 dark:text-white">
        {title}
      </h2>
      <p className="text-gray-700 dark:text-gray-300">{children}</p>
    </div>
  );
};

export default Card;
