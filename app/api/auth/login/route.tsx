import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "../../models/UserModel";
import { generateUserToken } from "@/utils/user";
import { initAdmin } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  initAdmin();
  const reqBody = (await request.json()) as { idToken: string };
  const idToken = reqBody.idToken;

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    const ticket = (await getAuth().verifyIdToken(idToken)) || null;

    if (!ticket) {
      throw new Error("Wrong recipient");
    }

    const { email, name, picture } = ticket;

    // Check if user exist, and create a new one if it doesn't exist
    let user = await UserModel.findOneAndUpdate(
      { email },
      { $setOnInsert: { email } }, // Set email if the document is inserted (user doesn't exist)
      { new: true, upsert: true }
    );

    if (user.entity) {
      const token = generateUserToken({
        id: user.id,
        email: user.email,
        entity: user.entity,
        role: user.role,
      });

      cookies().set("__session", token, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
        domain: `${
          process.env.NODE_ENV === "production" ? `hypetribes.com` : "localhost"
        }`,
      });

      return NextResponse.json({
        status: "logged",
        data: {
          id: user.id,
          email: user.email,
          entity: user.entity,
          role: user.role,
          token,
        },
      });
    } else {
      return NextResponse.json({
        status: "require-entity",
        data: { name: name, picture: picture, idToken },
      });
    }
  } catch (error: any) {
    throw new Error(`Error creating user ${error.message}`);
  }
}
