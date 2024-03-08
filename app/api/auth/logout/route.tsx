import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "../../models/UserModel";
import { generateUserToken } from "@/utils/user";

export async function GET(request: NextRequest) {
  const sessionCookie = cookies().get("__session")?.value;

  if (!sessionCookie)
    return NextResponse.json({ success: false }, { status: 400 });

  cookies().set("__session", "", {
    maxAge: 0,
    httpOnly: true,
    secure: true,
    domain: `${
      process.env.NODE_ENV === "production"
        ? `hypetribes.com`
        : "http://localhost:3000"
    }`,
  });

  return NextResponse.json({
    success: true,
  });
}
