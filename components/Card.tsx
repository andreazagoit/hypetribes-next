import React from "react";

interface IProps {
  children: React.ReactNode;
}

const Card = ({ children }: IProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 md:p-4 border border-gray-300 dark:border-gray-700">
      {children}
    </div>
  );
};

export default Card;
