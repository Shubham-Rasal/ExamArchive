import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import isEmail from "validator/lib/isEmail";

import { TLogin } from "@/app/auth/signIn/page";
import connectDB from "@/lib/config/database.config";
import User from "@/models/user.model";
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from "@/constants/statuscode";
import {
  AUTH_TOKEN,
  COOKIES_TTL,
  MONGO_READ_QUERY_TIMEOUT,
} from "@/constants/constants";
import { signTokens } from "@/helpers/jsonwebtokens";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = (await request.json()) as TLogin;
    const email = isEmail(username) ? username : undefined;

    await connectDB();

    const user = await User.findOne({
      $or: [{ email }, { username }],
    })
      .select({ _id: 1 })
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .exec();

    if (!user) {
      return NextResponse.json(
        {
          message: "Username doesn't exists",
        },
        { status: ERROR_CODES["NOT FOUND"] }
      );
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (isPasswordCorrect === false) {
      return NextResponse.json(
        {
          message:
            "Invalid username or password. Please check your credentials and try again",
        },
        { status: ERROR_CODES["NOT FOUND"] }
      );
    }

    const jwtPayload = { username: email ? undefined : username, email };
    const token = await signTokens(jwtPayload);
    if (token === null) throw new Error("Couldn't generate a JWT token");

    cookies().set(AUTH_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: COOKIES_TTL,
      path: "/",
    });

    return NextResponse.json(
      { message: "User logged in" },
      { status: SUCCESS_CODES.OK }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later" },
      { status: SERVER_ERROR["INTERNAL SERVER ERROR"] }
    );
  } finally {
    await mongoose.disconnect();
  }
}
