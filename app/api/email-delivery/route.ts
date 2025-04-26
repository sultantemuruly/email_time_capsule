import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase-admin";
import { EmailData, EmailStatus, UserData } from "@/lib/types";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY); // Server-side only

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

    // 👇 Add this check here
    if (emailData.status !== "Pending") {
      console.log(`Email ${documentId} already ${emailData.status}, skipping.`);
      return NextResponse.json(
        { success: false, message: `Email already ${emailData.status}` },
        { status: 400 }
      );
    }

    const userSnapshot = await adminDB
      .collection("users")
      .doc(emailData.userId)
      .get();
    const fullData = userSnapshot.data();

    if (!fullData) {
      await adminDB
        .collection("emails")
        .doc(documentId)
        .update({
          status: "Failed" as EmailStatus,
        });

      console.log(
        `Email status updated to "Failed" for ${documentId} due to missing user data`
      );

      return NextResponse.json(
        { success: false, message: "User data incomplete or missing" },
        { status: 404 }
      );
    }

    const userData: UserData = {
      uid: fullData.uid,
      email: fullData.email,
    };

    console.log(
      `Processing email to ${emailData.recipient} with title "${emailData.title}"`
    );

    try {
      await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: emailData.recipient,
        subject: emailData.title,
        text: `${userData.email} is sending you:\n\n${emailData.content}`,
      });

      await adminDB
        .collection("emails")
        .doc(documentId)
        .update({
          status: "Sent" as EmailStatus,
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
    } catch (sendError) {
      console.error("Error sending email:", sendError);

      await adminDB
        .collection("emails")
        .doc(documentId)
        .update({
          status: "Failed" as EmailStatus,
        });

      console.log(`Email status updated to "Failed" for ${documentId}`);

      return NextResponse.json(
        { success: false, message: "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing email:", error);
    return NextResponse.json(
      { success: false, message: "Server error while processing email" },
      { status: 500 }
    );
  }
}
