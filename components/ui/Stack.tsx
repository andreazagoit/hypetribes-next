import React from "react";

interface IProps {
  children: React.ReactNode;
}

const Stack = ({ children }: IProps) => {
  return <div>{children}</div>;
};

export default Stack;
