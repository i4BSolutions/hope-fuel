import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  cookies().delete("hopefuel-client");
  cookies().delete("hopefuel-server");
  //   deleteCookie("hopefuel-client");
  //     deleteCookie("hopefuel-server");
  return NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  );
}
