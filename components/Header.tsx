import React from "react";
import Container from "./Container";
import { usePathname } from "next/navigation";

import "./header.scss";
import Link from "next/link";

const Header = async () => {
  const menuOptions = [
    { path: "/", name: "Home" },
    { path: "/sign-in", name: "SignIn" },
  ];

  const loggedMenuOptions = [{ path: "/dashboard", name: "Dashboard" }];

  return (
    <div className="header">
      {/* <Container>
        <Link className="header__branding" href="/">
          HypeTribes
        </Link>
        <ul className="header__menu">
          {!currentUser ? (
            <>
              {menuOptions.map((option) => (
                <li key={option.path}>
                  <Link href={option.path}>{option.name}</Link>
                </li>
              ))}
            </>
          ) : (
            <>
              {loggedMenuOptions.map((option) => (
                <li key={option.path}>
                  <Link href={option.path}>{option.name}</Link>
                </li>
              ))}
              <Link href="/account">
                <div
                  style={{
                    background: "blue",
                    padding: 2,
                    borderRadius: "50%",
                  }}
                >
                  <div
                    style={{
                      background: "white",
                      padding: 2,
                      borderRadius: "50%",
                    }}
                  >
                    <div
                      style={{
                        minHeight: 40,
                        minWidth: 40,
                        background: `url("${currentUser.photoURL}")`,
                        backgroundSize: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                </div>
              </Link>
            </>
          )}
        </ul>
      </Container> */}
    </div>
  );
};

export default Header;
