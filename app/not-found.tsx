import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div>
      <h1>Page not found</h1>
      <Link href="/">
        <button>Back to home</button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
