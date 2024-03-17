import { getClient } from "@/lib/client";
import gql from "graphql-tag";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const generateUserToken = (user) => {
  try {
    return jwt.sign(user, process.env.NEXT_PUBLIC_JWT_SECRET!, {
      expiresIn: "1y",
    });
  } catch {
    throw new Error("Invalid user data");
  }
};

export const verifyUserToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!);
  } catch {
    throw new Error("Invalid token");
  }
};

const GET_USER = gql`
  query User {
    user {
      id
      email
      entity {
        id
        key
        name
        bio
        picture
      }
      role
    }
  }
`;

export const getUserFromSession = async () => {
  const session = cookies().get("__session")?.value;

  const { data } = await getClient().query({
    query: GET_USER,
    context: {
      headers: {
        authorization: `Bearer ${session}`,
      },
    },
  });

  return data.user as User;
};
