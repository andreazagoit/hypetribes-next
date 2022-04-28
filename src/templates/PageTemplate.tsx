import React from "react";
import MobileNavigator from "../organisms/MobileNavigator";

interface IProps {
  children: React.ReactNode;
}

const PageTemplate = ({ children }: IProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ height: "calc(100vh - 64px)" }}>{children}</div>
      <MobileNavigator />
    </div>
  );
};

export default PageTemplate;
