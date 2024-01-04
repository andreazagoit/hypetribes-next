import React from "react";
import Container from "./Container";

import "./header.scss";
import Link from "next/link";

const Header = () => {
  return (
    <div className="header">
      <Container>
        <Link className="header__branding" href="/">
          HypeTribes
        </Link>
        <ul className="header__menu">
          <li>
            <Link href="/test">Home</Link>
          </li>
          <li>
            <Link href="/about-us">About us</Link>
          </li>
        </ul>
      </Container>
    </div>
  );
};

export default Header;
