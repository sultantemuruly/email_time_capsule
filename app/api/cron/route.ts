import { NextResponse } from "next/server";
import { scheduleCronJob } from "@/lib/cron";

export async function GET() {
  try {
    scheduleCronJob();
    return NextResponse.json({
      success: true,
      message: "Cron job is running",
      status: "active",
    });
  } catch (error) {
    console.error("Failed to schedule cron job:", error);
    return NextResponse.json(
      { success: false, message: "Failed to schedule cron job" },
      { status: 500 }
    );
  }
}
