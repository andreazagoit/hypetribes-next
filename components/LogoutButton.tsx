"use client";

import { signOut } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";

const LogoutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    const isOk = await signOut();
    if (isOk) router.push("/sign-in");
  };

  return (
    <div>
      <button onClick={handleSignOut}>Log out</button>
    </div>
  );
};

export default LogoutButton;
