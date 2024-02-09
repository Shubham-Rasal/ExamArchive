"use server";

import {
  AUTH_TOKEN,
  COOKIES_TTL,
  JWT_MAX_AGE,
  MONGO_READ_QUERY_TIMEOUT,
} from "@/constants/constants";
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from "@/constants/statuscode";
import { signTokens } from "@/helpers/auth/jsonwebtokens";
import ErrorHandler, { errorResponse } from "@/helpers/errorHandler";
import connectDB from "@/lib/config/database.config";
import User from "@/models/user.model";
import mongoose from "mongoose";
import { cookies } from "next/headers";

interface IRegisterNewUserPayload {
  email: string;
  username: string;
  password: string;
}

export const registerNewUser = async ({
  username,
  email,
  password,
}: IRegisterNewUserPayload): Promise<IServerActionResponse> => {
  try {
    await connectDB();

    const doesUserExists = await User.findOne({
      $or: [{ username }, { email }],
    })
      .select({ _id: 1 })
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec();

    if (doesUserExists)
      throw new ErrorHandler(
        "Username or email already exists",
        ERROR_CODES.CONFLICT
      );

    const userId = new mongoose.Types.ObjectId();

    const JWTPayload = { username, email, userId: userId.toString() };

    const token = await signTokens({ JWTPayload, JWT_MAX_AGE });

    if (token === null)
      throw new ErrorHandler(
        "Couldn't generate a JWT token",
        SERVER_ERROR["INTERNAL SERVER ERROR"]
      );

    const user = new User({
      username,
      email,
      password,
      _id: userId,
    });
    await user.save();

    cookies().set(AUTH_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: COOKIES_TTL,
      path: "/",
    });

    return {
      message: "User registered",
      statusCode: SUCCESS_CODES.CREATED,
      hasError: false,
    };
  } catch (error: any) {
    console.error(error.message);
    return errorResponse(error);
  }
};
