import Container from "@/components/Container";
import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <Container>
      <h1>Page not found</h1>
      <Link href="/">
        <button>Back to home</button>
      </Link>
    </Container>
  );
};

export default NotFoundPage;
