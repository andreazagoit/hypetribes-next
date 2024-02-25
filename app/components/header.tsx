import Container from "@/components/Container";
import Link from "next/link";
import React from "react";
import { getCurrentUser } from "../api/graphql/resolvers/user";

const Header = () => {
  const user: User = getCurrentUser()!;

  return (
    <header className="bg-blue-900 bg-opacity-75 backdrop-filter backdrop-blur-lg text-white dark:bg-gray-800 dark:bg-opacity-75 dark:text-white py-4 px-6 fixed top-0 w-full z-10">
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
        <nav className="hidden sm:block">
          <ul className="flex space-x-4 items-center">
            <li>
              <a
                href="#"
                className="hover:text-gray-300 dark:hover:text-gray-400"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-300 dark:hover:text-gray-400"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-300 dark:hover:text-gray-400"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-gray-300 dark:hover:text-gray-400"
              >
                Contact
              </a>
            </li>
            {/* Display User Avatar or Login Link */}
            {!user?.picture ? (
              <li>
                <Link
                  href="/account"
                  className="hover:text-gray-300 dark:hover:text-gray-400"
                >
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
    </header>
  );
};

export default Header;
