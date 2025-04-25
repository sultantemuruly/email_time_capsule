import { CronJob } from "cron";
import { adminDB } from "./firebase-admin";

export const scheduleCronJob = () => {
  const job = new CronJob(
    "* * * * *", // Every minute
    async () => {
      try {
        console.log("Checking for scheduled emails...");

        const now = new Date();
        const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
        const currentTime = now.toTimeString().split(" ")[0].substring(0, 5); // HH:MM

        // Verify Firebase is initialized
        if (!adminDB) {
          throw new Error("Firebase Admin not initialized");
        }

        const emailsSnapshot = await adminDB
          .collection("emails")
          .where("date", "==", currentDate)
          .where("time", "==", currentTime)
          .where("status", "==", "Pending")
          .get();

        if (emailsSnapshot.empty) {
          console.log("No emails to send at this time");
          return;
        }

        console.log(`Found ${emailsSnapshot.size} email(s) to send`);

        for (const doc of emailsSnapshot.docs) {
          const documentId = doc.id;

          try {
            const response = await fetch(
              "http://localhost:3000/api/email-delivery",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ documentId }),
              }
            );

            if (!response.ok) {
              console.error(
                `Failed to process email ${documentId}:`,
                await response.text()
              );
              // Consider updating status to "Failed" in Firestore
            } else {
              console.log(
                `Successfully triggered email delivery for ${documentId}`
              );
              // Consider updating status to "Sent" in Firestore
            }
          } catch (error) {
            console.error(
              `Error calling email-delivery API for email ${documentId}:`,
              error
            );
          }
        }
      } catch (error) {
        console.error("Error in email cron job:", error);
      }
    },
    null,
    true,
    "Asia/Almaty"
  );

  return job;
};
