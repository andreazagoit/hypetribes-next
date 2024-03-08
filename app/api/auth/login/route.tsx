import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "../../models/UserModel";
import { generateUserToken } from "@/utils/user";
import { initAdmin } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  const reqBody = (await request.json()) as { idToken: string };
  const idToken = reqBody.idToken;

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  const ticket = (await getAuth().verifyIdToken(idToken)) || null;

  if (!ticket) {
    throw new Error("Wrong recipient");
  }

  const { email, name, picture } = ticket;

  // Check if user exist
  let user = await UserModel.findOne({ email });
  console.log("user", user);

  if (user) {
    user.name = name; // Update name
    user.picture = picture; // Update picture
    await user.save();
  } else {
    // If user does not exist, create a new one
    user = await UserModel.create({ name, email, picture });
  }

  const token = generateUserToken({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    picture: user.picture,
  });

  cookies().set("__session", token, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,
    path: "/",
    domain: `${
      process.env.NODE_ENV === "production"
        ? `hypetribes.com`
        : "http://localhost:3000"
    }`,
  });

  return NextResponse.json({
    success: true,
    token,
  });
}
