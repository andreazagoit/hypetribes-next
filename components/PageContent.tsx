"use client";

import { useRouter } from "next/navigation";

export default function PageContent({
  variant,
  currentUser,
}: {
  variant: "sign-in" | "dashboard";
  currentUser?: any;
}) {
  const router = useRouter();

  const handleSignIn = async () => {
    /* if (isOk) router.push("/dashboard"); */
    router.refresh();
  };

  const handleSignOut = async () => {
    router.refresh();
    /* if (isOk) router.push("/sign-in"); */
  };

  const buttonStyle = "bg-slate-500 mt-2 px-2 py-1 rounded-md text-slate-50";

  if (variant === "sign-in")
    return (
      <>
        <h1>Sing In Page</h1>
        <button className={buttonStyle} onClick={handleSignIn}>
          Sign In with Google
        </button>
      </>
    );
  else if (variant === "dashboard")
    return (
      <>
        <h1>Dashboard Page</h1>
        <p>Welcome, {currentUser?.displayName}</p>
        <button className={buttonStyle} onClick={handleSignOut}>
          Sign Out
        </button>
        {JSON.stringify(currentUser)}
      </>
    );
  else return null;
}
