export const dynamic = "force-dynamic";
import Container from "@/components/Container";
import Link from "next/link";
import React from "react";
import { getCurrentUser } from "../api/graphql/resolvers/user";
import { redirect } from "next/navigation";
import LogoutButton from "./components/LogoutButton";

const AccountPage = async () => {
  const user = getCurrentUser();
  if (!user) redirect("/account/login");

  return (
    <div>
      <Container>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 10,
            marginTop: 20,
          }}
        >
          <h1>Welcome back {user.name}</h1>
          <p>{user.email}</p>
          <LogoutButton />
        </div>
      </Container>
    </div>
  );
};

export default AccountPage;
