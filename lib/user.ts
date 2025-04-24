import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const createUserDoc = async (user: { uid: string; email: string }) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      userId: user.uid,
      email: user.email,
      createdAt: serverTimestamp(),
    });
  }
};
