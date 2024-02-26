import React from "react";

const Card = ({ children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-300 dark:border-gray-700">
      {children}
    </div>
  );
};

export default Card;
