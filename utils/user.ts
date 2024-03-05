"use server";
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
    cookies().delete("__session");
    throw new Error("Invalid token");
  }
};
