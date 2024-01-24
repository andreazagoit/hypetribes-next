import Container from "@/components/Container";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import React from "react";

const AccountPage = () => {
  return (
    <div>
      <Container>
        <h1>Account</h1>
        <Link href="/account/wishlist">Wishlist</Link>
        <LogoutButton />
      </Container>
    </div>
  );
};

export default AccountPage;
