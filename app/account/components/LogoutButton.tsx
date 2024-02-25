"use client";

import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Set the expiry date of the cookie to a past date
    document.cookie =
      "__session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Optionally, perform any other logout actions (e.g., redirecting the user)
    router.push("/account/login");
    router.refresh();
  };

  return (
    <button
      style={{
        padding: "8px 16px",
        borderRadius: 4,
        background: "blue",
        border: "1px solid #fff6",
        color: "white",
      }}
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
