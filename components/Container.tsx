import React from "react";

interface IProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Container = ({ children, style }: IProps) => {
  return (
    <div
      className="container"
      style={{ margin: "0 auto", maxWidth: 1400, ...style }}
    >
      {children}
    </div>
  );
};

export default Container;
