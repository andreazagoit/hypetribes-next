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
      <button
        onClick={handleSignOut}
        style={{
          padding: "12px 20px",
          textTransform: "uppercase",
          background: "white",
          border: "1px solid white",
          cursor: "pointer",
        }}
      >
        Log out
      </button>
    </div>
  );
};

export default LogoutButton;
