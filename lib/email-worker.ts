import redis from "./redis";
import { adminDB } from "./firebase-admin";

console.log("EMAIL WORKER STARTING - " + new Date().toISOString());

// Function to check scheduled emails and trigger delivery
const checkScheduledEmails = async () => {
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const currentTime = now.toTimeString().split(" ")[0].substring(0, 5); // HH:MM

  const keys = await redis.keys("email:*");

  for (const key of keys) {
    const emailDataString = await redis.get(key);
    if (!emailDataString) continue;

    const emailData = JSON.parse(emailDataString);

    if (
      emailData.date === currentDate &&
      emailData.time === currentTime &&
      emailData.status === "Pending"
    ) {
      const documentId = key.split(":")[1];

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await fetch(`${apiUrl}/api/email-delivery`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId }),
        });

        if (response.ok) {
          console.log(`Email sent for documentId: ${documentId}`);

          emailData.status = "Sent";
          await redis.set(key, JSON.stringify(emailData));

          const docRef = adminDB.collection("emails").doc(documentId);
          await docRef.update({ status: "Sent" });

          console.log(`Firestore status updated for documentId: ${documentId}`);
        } else {
          console.error(`Failed to send email for documentId: ${documentId}`);
        }
      } catch (error) {
        console.error(
          `Error processing email for documentId: ${documentId}:`,
          error
        );
      }
    }
  }
};

// Check every minute
setInterval(checkScheduledEmails, 60 * 1000); // 60 * 1000 ms = 1 minute
