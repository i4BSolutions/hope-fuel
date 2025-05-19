import { serialize } from "cookie";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import prisma from "../../utilites/prisma";

export const dynamic = "force-dynamic";
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req) {
  try {
    const { awsId, email } = await req.json();

    if (!awsId || !email) {
      return NextResponse.json(
        { error: "Missing awsId or email in request body" },
        { status: 400 }
      );
    }

    const agent = await prisma.agent.upsert({
      where: { AwsId: awsId, Username: email.split("@")[0] },
      update: {},
      create: {
        AwsId: awsId,
        UserRoleId: 1,
      },
      include: { UserRole: true },
    });

    const payload = {
      roleId: agent.UserRoleId,
      username: email.split("@")[0],
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(secret);

    const secure = process.env.NODE_ENV === "production";

    const res = NextResponse.json(
      { success: true, message: "Agent authenticated successfully" },
      { status: 200 }
    );

    res.headers.append(
      "Set-Cookie",
      serialize("hopefuel-server", token, {
        httpOnly: true,
        secure,
        sameSite: "Strict",
        path: "/",
        maxAge: 60 * 60 * 24,
      })
    );

    res.headers.append(
      "Set-Cookie",
      serialize("hopefuel-client", token, {
        httpOnly: false,
        secure,
        sameSite: "Strict",
        path: "/",
        maxAge: 60 * 60 * 24,
      })
    );

    return res;
  } catch (error) {
    console.error("[check-or-create-agent] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
