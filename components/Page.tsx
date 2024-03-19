import React, { ReactNode } from "react";
import Container from "./Container";
import NotificationProvider from "./NotificationProvider";

interface PageProps {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  children: ReactNode;
}

const Page = ({ title, actions, children }: PageProps) => {
  return (
    <main className="pt-24 pb-20">
      <NotificationProvider />
      <Container>
        {(title || actions) && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <div>{title}</div>
            <div>{actions}</div>
          </div>
        )}
        <div>{children}</div>
      </Container>
    </main>
  );
};

export default Page;
