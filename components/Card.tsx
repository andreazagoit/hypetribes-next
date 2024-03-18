import React from "react";

interface IProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Card = ({ children, style }: IProps) => {
  return (
    <div
      className="bg-white dark:bg-gray-800 shadow-md border border-gray-300 dark:border-gray-700"
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;
