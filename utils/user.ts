"use server";
import jwt from "jsonwebtoken";

export const generateUserToken = async (user) => {
  try {
    return jwt.sign(user, process.env.NEXT_PUBLIC_JWT_SECRET!, {
      expiresIn: "1h",
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
