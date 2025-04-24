import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase-admin";
import { verifyIdToken } from "@/lib/firebase-admin";
import { EmailStatus } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await verifyIdToken(idToken);

    if (!decodedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const uid = decodedToken.uid;

    const body = await req.json();
    const { recipient, title, content, date, time } = body;

    if (!recipient || !title || !content || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await adminDB.collection("emails").add({
      userId: uid,
      recipient,
      title,
      content,
      date,
      time,
      status: "Pending" as EmailStatus,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/emails error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
