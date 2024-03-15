import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "../../models/UserModel";
import { generateUserToken } from "@/utils/user";
import { initAdmin } from "@/lib/firebase/admin";
import e from "cors";
import EntityModel from "../../models/EntityModel";
import { addEntity } from "../../graphql/resolvers";

interface IProps {
  idToken: string;
  key: string;
  bio: string;
}

export async function POST(request: NextRequest) {
  const reqBody = (await request.json()) as IProps;
  const { idToken, key, bio } = reqBody;

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    const ticket = (await getAuth().verifyIdToken(idToken)) || null;

    if (!ticket) {
      throw new Error("Wrong recipient");
    }

    const { email, name, picture = "" } = ticket;

    // Check if user exist
    let user = await UserModel.findOne({ email });

    console.log("user", user);

    // Create Entity
    const newEntity = await addEntity({ data: { key, name, bio, picture } });

    user.entity = newEntity.key;

    await user.save();

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

    /* if (user.entity) {
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
        data: { id: user.id, email: user.email, role: user.role, token },
      });
    } else {
      return NextResponse.json({
        status: "require-entity",
        data: { name: name, picture: picture },
      });
    } */
  } catch (error: any) {
    throw new Error(`Error creating user ${error.message}`);
  }
}
