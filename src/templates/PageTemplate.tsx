import React from "react";
import MobileNavigator from "../organisms/MobileNavigator";

interface IProps {
  children: React.ReactNode;
}

const PageTemplate = ({ children }: IProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <meta name="theme-color" content="rebeccapurple" />
      <MobileNavigator />
      <div style={{ height: "calc(100vh - calc(100vh - 100%))" }}>
        {children}
      </div>
    </div>
  );
};

export default PageTemplate;
