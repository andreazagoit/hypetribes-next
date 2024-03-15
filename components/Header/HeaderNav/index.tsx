"use client";
import React from "react";
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

  return (
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
            >
              Login
            </Link>
          </li>
        ) : (
          <li>
            <Link href="/account">
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
  );
};

export default HeaderNav;
