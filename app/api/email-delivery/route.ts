import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase-admin";
import { EmailData } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { documentId } = body;

    if (!documentId) {
      return NextResponse.json(
        { success: false, message: "Document ID is required" },
        { status: 400 }
      );
    }

    const emailDoc = await adminDB.collection("emails").doc(documentId).get();

    if (!emailDoc.exists) {
      return NextResponse.json(
        { success: false, message: "Email not found" },
        { status: 404 }
      );
    }

    const emailData = emailDoc.data() as EmailData;

    console.log(
      `Processing email to ${emailData.recipient} with title "${emailData.title}"`
    );

    await adminDB.collection("emails").doc(documentId).update({
      status: "Sent",
    });

    console.log(`Email status updated to "Sent" for ${documentId}`);

    return NextResponse.json({
      success: true,
      message: "Email processed successfully",
      email: {
        recipient: emailData.recipient,
        title: emailData.title,
        status: "Sent",
      },
    });
  } catch (error) {
    console.error("Error processing email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process email" },
      { status: 500 }
    );
  }
}
