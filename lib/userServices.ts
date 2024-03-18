"use server";
import { verifyUserToken } from "@/utils/user";
import { cookies } from "next/headers";

export const getCurrentUser = () => {
  try {
    const session = cookies().get("__session")?.value;
    const user = verifyUserToken(session!);
    return user as User;
  } catch (error) {
    return undefined;
  }
};
