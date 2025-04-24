import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyIdToken } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    const decoded = await verifyIdToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cookieStore = cookies();

    // Set session cookie
    (await cookieStore).set("__session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    );
  }
}
