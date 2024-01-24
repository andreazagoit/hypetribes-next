"use client";

import React from "react";
import Container from "./Container";
import { usePathname } from "next/navigation";

import "./header.scss";
import Link from "next/link";

const Header = () => {
  const pathname = usePathname();

  const menuOptions = [
    { path: "/", name: "Home" },
    { path: "/about-us", name: "About Us" },
    { path: "account", name: "Account" },
  ];

  return (
    <div className="header">
      <Container>
        <Link className="header__branding" href="/">
          HypeTribes
        </Link>
        <ul className="header__menu">
          {menuOptions.map((option) => (
            <li key={option.path}>
              <Link
                href={option.path}
                style={{
                  textDecoration:
                    pathname === option.path ? "underline" : "none",
                }}
              >
                {option.name}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
};

export default Header;
