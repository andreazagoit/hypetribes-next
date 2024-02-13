export const dynamic = "force-dynamic";
import Container from "@/components/Container";
import LogoutButton from "@/components/LogoutButton";
import { getCurrentUser } from "@/lib/firebase/firebase-admin";
import Link from "next/link";
import React from "react";

const AccountPage = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div>
      <Container style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <h1 style={{ fontSize: "4rem", marginTop: "1rem" }}>Dashboard</h1>
        <table>
          <tbody>
            <tr>
              <th style={{ textAlign: "left" }}>Email</th>
              <th style={{ textAlign: "left" }}>{currentUser?.email}</th>
            </tr>
            <tr>
              <th style={{ textAlign: "left" }}>DisplayName</th>
              <th style={{ textAlign: "left" }}>{currentUser?.displayName}</th>
            </tr>
          </tbody>
        </table>
        {JSON.stringify(currentUser)}
        <Link href="/account/wishlist">Wishlist</Link>
        <LogoutButton />
      </Container>
    </div>
  );
};

export default AccountPage;
