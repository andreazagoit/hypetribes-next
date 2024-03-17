import React from "react";

interface IProps {
  children: React.ReactNode;
}

const Card = ({ children }: IProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md border border-gray-300 dark:border-gray-700">
      {children}
    </div>
  );
};

export default Card;
