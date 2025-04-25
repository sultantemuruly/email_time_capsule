import redis from "./redis";

export const scheduleEmailInRedis = async (
  documentId: string,
  date: string,
  time: string
) => {
  const key = `email:${documentId}`;
  const emailData = { date, time, status: "Pending" };

  await redis.set(key, JSON.stringify(emailData));
  console.log(`Email scheduled for documentId: ${documentId}`);
};
