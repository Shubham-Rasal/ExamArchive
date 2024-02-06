"use server";

import RedisClient from "@/lib/config/redis.config";

const addValuesToCache = async ({
  setName,
  value,
}: {
  setName: string;
  value: string;
}) => {
  try {
    const client = RedisClient();
    await client.zadd(setName, 0, value);
  } catch (error: any) {
    console.error(error.message);
  }
};

export default addValuesToCache;
