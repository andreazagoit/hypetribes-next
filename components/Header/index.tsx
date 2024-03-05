import Link from "next/link";
import React from "react";
import { getCurrentUser } from "@/app/api/graphql/resolvers/user";
import HeaderNav from "./HeaderNav";
import Container from "../Container";

const Header = () => {
  const user: User | undefined = getCurrentUser();

  return (
    <header className="bg-blue-900 bg-opacity-75 backdrop-filter backdrop-blur-lg text-white dark:bg-gray-800 dark:bg-opacity-75 dark:text-white py-4 px-6 fixed top-0 w-full z-10">
      <Container>
        <div className="flex justify-between items-center h-12">
          <Link href="/">
            <h1 className="text-xl font-semibold">HypeTribes</h1>
          </Link>
          {/* Hamburger Menu Icon for Mobile */}
          <button className="block sm:hidden text-gray-300 hover:text-white">
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
          {/* Navigation Links */}
          <HeaderNav user={user} />
        </div>
      </Container>
    </header>
  );
};

export default Header;
