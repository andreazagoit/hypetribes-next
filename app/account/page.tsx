import React from "react";
import { getCurrentUser } from "../api/graphql/resolvers/user";
import { redirect } from "next/navigation";
import LogoutButton from "./components/LogoutButton";
import Page from "@/components/Page";
import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import { cookies } from "next/headers";

const GET_USER = gql`
  query User {
    user {
      id
      name
      email
      picture
    }
  }
`;

const AccountPage = async () => {
  const session = cookies().get("__session")?.value;

  const { data } = await getClient().query({
    query: GET_USER,
    context: {
      headers: {
        authorization: `Bearer ${session}`,
      },
    },
  });

  const user = getCurrentUser();
  if (!user) redirect("/account/login");

  return (
    <Page title="Account">
      <div className="flex flex-col items-start gap-6">
        {user && (
          <>
            <h1 className="text-3xl font-semibold">
              {/* Welcome back {JSON.stringify(data)} */}
            </h1>
            <p className="text-gray-600">{user.email}</p>
            <div className="mt-4">
              <h2 className="text-xl font-semibold">Settings</h2>
              <div className="flex flex-col">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Receive Notifications
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Dark Mode
                </label>
                <div className="mt-2">
                  Language:
                  <select className="ml-2 bg-gray-100 dark:bg-gray-800 rounded px-2 py-1">
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <LogoutButton />
            </div>
          </>
        )}
      </div>
    </Page>
  );
};

export default AccountPage;
