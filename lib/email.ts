import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const addEmail = async ({
  userId,
  recipient,
  title,
  content,
  date,
  time,
}: {
  userId: string;
  recipient: string;
  title: string;
  content: string;
  date: string;
  time: string;
}) => {
  const emailsRef = collection(db, "emails");
  await addDoc(emailsRef, {
    userId,
    recipient,
    title,
    content,
    date,
    time,
  });
};

export const getUserEmails = async (userId: string) => {
  const q = query(collection(db, "emails"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
