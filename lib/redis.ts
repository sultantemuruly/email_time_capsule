import { createClient } from "redis";

const redis = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redis.on("error", (err) => console.log("Redis Client Error", err));

try {
  console.log("redis started");
  await redis.connect();
  console.log("Successfully connected to Redis");

  await redis.set("foo", "bar");
  const result = await redis.get("foo");
  console.log(result);
} catch (error) {
  console.error("Redis operation failed:", error);
}

export default redis;
