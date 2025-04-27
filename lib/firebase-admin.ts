import * as admin from "firebase-admin";

/**
 * Initializes the Firebase Admin SDK if not already initialized
 * @returns {Object} Object containing admin app instances
 */
export const initializeFirebaseAdmin = () => {
  if (admin.apps.length) {
    return {
      adminApp: admin.app(),
      adminAuth: admin.auth(),
      adminDB: admin.firestore(),
    };
  }

  // Validate required environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error(
      `Firebase credentials missing: ${!projectId ? "FIREBASE_PROJECT_ID " : ""}${
        !clientEmail ? "FIREBASE_CLIENT_EMAIL " : ""
      }${!privateKeyRaw ? "FIREBASE_PRIVATE_KEY" : ""}`
    );
  }

  // Process private key to handle potential format issues
  const privateKey = privateKeyRaw
    .replace(/\\n/g, "\n") // Handle common case
    .replace(/\\\\n/g, "\n") // Handle double-escaped
    .replace(/\r\n/g, "\n"); // Normalize Windows line endings

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    console.log("Firebase Admin SDK initialized successfully");

    return {
      adminApp: admin.app(),
      adminAuth: admin.auth(),
      adminDB: admin.firestore(),
    };
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
    throw new Error(`Firebase initialization failed: ${error}`);
  }
};

// Export the initialized Firebase admin instances
const { adminApp, adminAuth, adminDB } = initializeFirebaseAdmin();
export { adminApp, adminAuth, adminDB };

/**
 * Verifies a Firebase ID token
 * @param {string} token - The ID token to verify
 * @returns {Promise<DecodedIdToken|null>} The decoded token or null if invalid
 */
export const verifyIdToken = async (token: string) => {
  if (!token) {
    console.error("No token provided for verification");
    return null;
  }

  try {
    return await adminAuth.verifyIdToken(token);
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};
