import * as admin from "firebase-admin";

// Initialize Firebase Admin if not already initialized
const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    })
  : admin.app();

// Export services
export const adminAuth = app.auth();
export const adminDB = app.firestore();
export const adminApp = app; // Export the app itself

export const verifyIdToken = async (token: string) => {
  try {
    return await adminAuth.verifyIdToken(token);
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};
