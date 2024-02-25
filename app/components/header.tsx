import Container from "@/components/Container";
import Link from "next/link";
import React from "react";
import { getCurrentUser } from "../api/graphql/resolvers/user";

const Header = () => {
  const user: User = getCurrentUser()!;

  return (
    <div style={{ background: "blue" }}>
      <Container>
        <div
          style={{
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 24 }}>
            <Link href="/">Hypetribes</Link>
          </div>
          <div>
            <Link href="/account">
              {!user ? (
                "account"
              ) : (
                <img
                  src={user.picture}
                  style={{ height: 40, width: 40, borderRadius: "50%" }}
                />
              )}
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;
