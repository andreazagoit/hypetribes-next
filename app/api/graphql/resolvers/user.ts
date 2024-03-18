import { generateUserToken, verifyUserToken } from "@/utils/user";
import UserModel from "../../models/UserModel";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";

/* const { OAuth2Client } = require("google-auth-library"); */

export const getUser = async ({ context }) => {
  const user = getUserFromContext(context);
  return user;
};

export const getUserFromContext = (context) => {
  try {
    const authorizationHeader = context.req.headers.get("authorization");
    const token = authorizationHeader.replace("Bearer ", "");
    const user = verifyUserToken(token);
    return user as User;
  } catch (error) {
    throw new Error("Wrong user");
  }
};

export const getUserFromToken = (token) => {
  try {
    const user = verifyUserToken(token);
    return user as User;
  } catch (error) {
    throw new Error("Wrong user");
  }
};

interface LoginWithGoogle {
  accessToken: string;
}

export const loginWithGoogle = async (data: LoginWithGoogle) => {
  const { accessToken } = data;

  const ticket = (await getAuth().verifyIdToken(accessToken)) || null;

  if (!ticket) {
    throw new Error("Wrong recipient");
  }

  const { email, name, picture } = ticket;

  // Check if user exist
  let user = await UserModel.findOne({ email });

  if (user) {
    user.name = name; // Update name
    user.picture = picture; // Update picture
    await user.save();
  } else {
    // If user does not exist, create a new one
    user = await UserModel.create({ name, email, picture });
  }

  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    token: generateUserToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture,
    }),
  };

  return userData;
};

export const getCurrentUser = () => {
  const cookie = cookies().get("__session")?.value;
  if (!cookie) return;
  return verifyUserToken(cookie) as User;
};
