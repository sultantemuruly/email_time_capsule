import { NextResponse } from "next/server";
import { scheduleEmailInRedis } from "@/lib/email-scheduler";

export async function POST(req: Request) {
  const body = await req.json();
  const { documentId, date, time } = body;

  try {
    await scheduleEmailInRedis(documentId, date, time);

    return NextResponse.json(
      { success: true, message: "Email job scheduled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error scheduling email job:", error);
    return NextResponse.json(
      { success: false, message: "Failed to schedule email job" },
      { status: 500 }
    );
  }
}
