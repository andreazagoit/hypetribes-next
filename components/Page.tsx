import React, { ReactNode } from "react";
import Container from "./Container";
import NotificationProvider from "./NotificationProvider";

interface PageProps {
  title?: string;
  actions?: React.ReactNode;
  children: ReactNode;
}

const Page = ({ title, actions, children }: PageProps) => {
  return (
    <main className="pt-24 pb-20">
      <NotificationProvider />
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          {title && <h1 className="text-5xl font-bold mb-8">{title}</h1>}
          <div>{actions}</div>
        </div>
        <div>{children}</div>
      </Container>
    </main>
  );
};

export default Page;
