import { adminDB } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { EmailData } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body: EmailData = await req.json();
    console.log("Received email body:", body);

    const { userId, recipient, title, content, date, time, status } = body;

    if (
      !userId ||
      !recipient ||
      !title ||
      !content ||
      !date ||
      !time ||
      !status
    ) {
      return NextResponse.json(
        { error: "Missing required email fields" },
        { status: 400 }
      );
    }

    await adminDB.collection("emails").add({
      userId,
      recipient,
      title,
      content,
      date,
      time,
      status,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding email:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const snapshot = await adminDB
    .collection("emails")
    .where("userId", "==", userId)
    .get();

  const emails = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json({ emails });
}
