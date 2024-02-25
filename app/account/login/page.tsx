import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/api/graphql/resolvers/user";
import LoginWithGoogleButton from "./components/LoginWithGoogleButton";

const LoginPage = async () => {
  const user = getCurrentUser();
  if (user) redirect("/account");

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        marginTop: "150px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "blue",
          minWidth: 400,
          minHeight: 300,
          padding: 20,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
        }}
      >
        <h1>Login</h1>
        <LoginWithGoogleButton />
      </div>
    </div>
  );
};

export default LoginPage;
