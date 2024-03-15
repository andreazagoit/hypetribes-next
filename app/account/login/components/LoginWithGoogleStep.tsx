"use client";

import { auth } from "@/lib/firebase/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";
import { Step } from "./AuthCard";

interface IProps {
  changeStep: React.Dispatch<React.SetStateAction<Step>>;
}

const LoginWithGoogleStep = ({ changeStep }: IProps) => {
  const router = useRouter();

  const signInWithGoogle = async () => {
    try {
      const userData: any = await signInWithPopup(
        auth,
        new GoogleAuthProvider()
      );

      const idToken = userData.user.accessToken!;

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const resBody = await response.json();

      return resBody;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignInWithGoogle = async () => {
    const data = await signInWithGoogle();
    console.log(data);
    if (data.status === "logged") {
      router.push("/account");
      router.refresh();
    }
    if (data.status === "require-entity") {
      changeStep(data);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
      <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white py-8 px-6 text-center rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">Welcome!</h1>
        <p className="text-lg">Login to access your account.</p>
      </div>
      <div className="p-6 flex justify-center">
        <button
          onClick={() => handleSignInWithGoogle()}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-red-300"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginWithGoogleStep;
