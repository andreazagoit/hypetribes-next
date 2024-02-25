import Container from "@/components/Container";
import Link from "next/link";
import React from "react";
import { getCurrentUser } from "../api/graphql/resolvers/user";

const Header = async () => {
  const user: User = (await getCurrentUser()) as User;

  return (
    <header className="bg-blue-900 bg-opacity-75 backdrop-filter backdrop-blur-lg text-white py-4 px-6 fixed top-0 w-full z-10">
      <Container>
        <div className="flex justify-between items-center h-12">
          <Link href="/">
            <h1 className="text-xl font-semibold">HypeTribes</h1>
          </Link>
          <nav className="mt-1">
            <ul className="flex space-x-4 items-center">
              <li>
                <a href="#" className="hover:text-gray-300">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Contact
                </a>
              </li>
              {!user?.picture ? (
                <li>
                  <Link href="/account" className="hover:text-gray-300">
                    Login
                  </Link>
                </li>
              ) : (
                <li>
                  <Link href="/account">
                    <img
                      src={user.picture}
                      alt="Avatar"
                      className="h-8 w-8 rounded-full"
                    />
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  );
};

export default Header;
