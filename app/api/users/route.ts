import { adminDB } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { UserData } from "@/lib/types";

export async function POST(req: Request) {
  const body: UserData = await req.json();
  const { uid, email } = body;

  const userRef = adminDB.collection("users").doc(uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    await userRef.set({
      userId: uid,
      email,
      createdAt: new Date(),
    });
  }

  return NextResponse.json({ success: true });
}
