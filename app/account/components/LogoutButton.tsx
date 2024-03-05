"use client";

import PrimaryButton from "@/components/Button";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resBody = await response.json();

    if (resBody.success === true) {
      router.push("/account/login");
      router.refresh();
    }
  };

  return <PrimaryButton onClick={handleLogout}>Logout</PrimaryButton>;
};

export default LogoutButton;
