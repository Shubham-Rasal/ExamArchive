import Redis from "ioredis";

const RedisClient = (): Redis => {
  let client: Redis | undefined = undefined;

  try {
    const { REDIS_URL } = process.env;
    if (REDIS_URL === undefined)
      throw new Error(
        "Redis URL is missing. Please provide it to connect to the redis instance."
      );
    client = new Redis(process.env.REDIS_URL as string);
  } catch (error: any) {
    console.error(error.message);
  }
  return client as Redis;
};

export default RedisClient;
