export const dynamic = "force-dynamic";
import Container from "@/components/Container";
import Link from "next/link";
import React from "react";
import Login from "./components/Login";

const AccountPage = () => {
  return (
    <div>
      <Container>
        <h1>Account</h1>
        <Link href="/account/wishlist">Wishlist</Link>
        <Login />
      </Container>
    </div>
  );
};

export default AccountPage;
