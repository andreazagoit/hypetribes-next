import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "../../models/UserModel";
import { generateUserToken } from "@/utils/user";

export async function GET(request: NextRequest) {
  const sessionCookie = cookies().get("__session")?.value;

  if (!sessionCookie)
    return NextResponse.json({ success: false }, { status: 400 });

  cookies().delete("__session");

  return NextResponse.json({
    success: true,
  });
}
