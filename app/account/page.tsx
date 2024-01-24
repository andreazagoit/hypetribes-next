import Container from "@/components/Container";
import Link from "next/link";
import React from "react";

const AccountPage = () => {
  return (
    <div>
      <Container>
        <h1>Account</h1>
        <Link href="/account/wishlist">Wishlist</Link>
      </Container>
    </div>
  );
};

export default AccountPage;
