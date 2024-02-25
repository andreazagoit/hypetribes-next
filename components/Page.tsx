import React, { ReactNode } from "react";
import Container from "./Container";

interface PageProps {
  title?: string;
  children: ReactNode;
}

const Page = ({ title, children }: PageProps) => {
  return (
    <main className={`pt-${title ? "32" : "20"} pb-20`}>
      <Container>
        {title && ( // Rendering title only if it's present
          <h1 className="text-5xl font-bold mb-8">
            <span className="text-blue-500 px-2">{title}</span>
          </h1>
        )}
        <div>{children}</div>
      </Container>
    </main>
  );
};

export default Page;
