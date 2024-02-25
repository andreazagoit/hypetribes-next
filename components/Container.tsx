import React from "react";

interface IProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Container = ({ children }: IProps) => {
  return <div className="container mx-auto px-4 max-w-7xl">{children}</div>;
};

export default Container;
