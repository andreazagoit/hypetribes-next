import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/api/graphql/resolvers/user";
import LoginWithGoogleButton from "./components/LoginWithGoogleButton";

const LoginPage = () => {
  const user = getCurrentUser();
  if (user) redirect("/account");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white py-8 px-6 text-center rounded-t-lg">
          <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg">Login to access your account.</p>
        </div>
        <div className="p-6 flex justify-center">
          <LoginWithGoogleButton />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
