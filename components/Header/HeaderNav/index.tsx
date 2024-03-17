"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./styles.module.scss";

interface IProps {
  user: User | undefined;
}

const links = [
  { name: "Relases", path: "/" },
  { name: "Categories", path: "/collections" },
];

const HeaderNav = ({ user }: any) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger Menu Icon for Mobile */}
      <button
        className="block sm:hidden text-gray-300 hover:text-white"
        onClick={() => setOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
      <nav className="hidden sm:block">
        <ul className="flex space-x-4 items-center">
          {links.map(({ name, path }) => (
            <li key={path}>
              <Link
                href={path}
                className={`${styles.headerNavLink} ${
                  path === pathname ? styles.active : ""
                }`}
              >
                {name}
              </Link>
            </li>
          ))}
          {/* Display User Avatar or Login Link */}
          {!user ? (
            <li>
              <Link
                href="/account/login"
                className={`${styles.headerNavLink} ${
                  "/account/login" === pathname ? styles.active : ""
                }`}
                prefetch
              >
                Login
              </Link>
            </li>
          ) : (
            <li>
              <Link href="/account" prefetch>
                <Image
                  src={user.entity.picture}
                  width={64}
                  height={64}
                  alt="Picture of the author"
                  className="h-10 w-10 rounded-full"
                />
              </Link>
            </li>
          )}
        </ul>
      </nav>
      {open && (
        <div
          className="bg-gray-800"
          style={{
            width: "100%",
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <div style={{ margin: "10vw", paddingTop: "10vh" }}>
            <div
              className="bg-gray-700"
              style={{
                position: "absolute",
                width: 48,
                height: 48,
                borderRadius: 99,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                right: "5vw",
                top: "5vw",
                cursor: "pointer",
              }}
              onClick={() => setOpen(false)}
            >
              X
            </div>
            <h2 style={{ textTransform: "uppercase", fontSize: 14 }}>
              Navigator
            </h2>
            <div
              style={{
                height: 1,
                width: "100%",
                marginTop: 8,
                background: "#ccc",
              }}
            />
            <ul
              style={{
                listStyle: "none",
                marginTop: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {links.map(({ name, path }) => (
                <li key={path} style={{ fontSize: 24 }}>
                  <Link href={path} onClick={() => setOpen(false)} prefetch>
                    {name}
                  </Link>
                </li>
              ))}
              <li key="account" style={{ fontSize: 24 }}>
                <Link href="/account" onClick={() => setOpen(false)} prefetch>
                  Account
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderNav;
