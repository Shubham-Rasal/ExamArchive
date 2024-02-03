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
import { cookies } from "next/headers";
import isEmail from "validator/lib/isEmail";

interface ISignInProps {
  username: string;
  password: string;
}

const signInAction = async ({
  username,
  password,
}: ISignInProps): Promise<IServerActionResponse> => {
  try {
    await connectDB();
    const email = isEmail(username) ? username : undefined;

    const user = await User.findOne({
      $or: [{ email }, { username }],
    })
      .select({ _id: 1, password: 1 })
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .exec();

    if (!user)
      throw new ErrorHandler(
        "Username doesn't exists",
        ERROR_CODES["NOT FOUND"]
      );

    const isPasswordCorrect = await user.comparePassword(
      password,
      user.password
    );

    if (!isPasswordCorrect)
      throw new ErrorHandler(
        "Invalid username or password. Please check your credentials and try again",
        ERROR_CODES["NOT FOUND"]
      );

    const JWTPayload = { userId: user._id.toString() };
    email === undefined
      ? Object.assign(JWTPayload, { username })
      : Object.assign(JWTPayload, { email });

    const token = await signTokens({ JWTPayload, JWT_MAX_AGE });
    if (token === null)
      throw new ErrorHandler(
        "Couldn't generate a JWT token",
        SERVER_ERROR["INTERNAL SERVER ERROR"]
      );

    cookies().set(AUTH_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: COOKIES_TTL,
      path: "/",
    });

    return {
      hasError: false,
      message: "User logged in",
      statusCode: SUCCESS_CODES.OK,
    };
  } catch (error: any) {
    console.error(error.message);
    return errorResponse(error);
  }
};

export default signInAction;
