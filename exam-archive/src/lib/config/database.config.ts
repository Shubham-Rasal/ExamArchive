import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const { MONGO_URI } = process.env;

    if (!MONGO_URI) throw new Error("Database connection string is required");

    const MONGO_MAX_POOLSIZE = !process.env.MONGO_MAX_POOLSIZE
      ? 2500
      : Number(process.env.MONGO_MAX_POOLSIZE);

    const MONGO_TIMEOUT_MS = !process.env.MONGO_TIMEOUT_MS
      ? 5000
      : Number(process.env.MONGO_TIMEOUT_MS);

    await mongoose.connect(MONGO_URI, {
      maxPoolSize: MONGO_MAX_POOLSIZE,
      connectTimeoutMS: MONGO_TIMEOUT_MS,
    });

    console.log("Connected to database!🚀");
  } catch (error: any) {
    console.log(error.message);
  }
};

export default connectDB;
