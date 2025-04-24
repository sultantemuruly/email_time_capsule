import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { EmailData } from "./types";

export const addEmail = async ({
  userId,
  recipient,
  title,
  content,
  date,
  time,
  status,
}: EmailData) => {
  const emailsRef = collection(db, "emails");
  await addDoc(emailsRef, {
    userId,
    recipient,
    title,
    content,
    date,
    time,
    status,
  });
};

export const getUserEmails = async (userId: string) => {
  const q = query(collection(db, "emails"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
