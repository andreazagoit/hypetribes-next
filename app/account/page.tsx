export const dynamic = "force-dynamic";
import Container from "@/components/Container";
import Link from "next/link";
import React from "react";
import { getCurrentUser } from "../api/graphql/resolvers/user";
import { redirect } from "next/navigation";
import LogoutButton from "./components/LogoutButton";
import Page from "@/components/Page";

const AccountPage = () => {
  console.log("Try to log");
  const user = getCurrentUser();
  console.log("user", user);

  if (!user) redirect("/account/login");

  return (
    <Page title="Account">
      <div className="flex flex-col items-start gap-6">
        <h1 className="text-3xl font-semibold">Welcome back {user.name}</h1>
        <p className="text-gray-600">{user.email}</p>
        <LogoutButton />
      </div>
    </Page>
  );
};

export default AccountPage;
