import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";

import { TRegister } from "@/app/auth/newUser/page";
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
  JWT_MAX_AGE,
  MONGO_READ_QUERY_TIMEOUT,
} from "@/constants/constants";
import { signTokens } from "@/helpers/jsonwebtokens";

export async function POST(request: NextRequest) {
  try {
    const { username, password, email } = (await request.json()) as TRegister;

    await connectDB();

    const doesUserExists = await User.findOne({
      $or: [{ username }, { email }],
    })
      .select({ _id: 1 })
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec();

    if (doesUserExists) {
      return NextResponse.json(
        { message: "Username or email already exists" },
        { status: ERROR_CODES.CONFLICT }
      );
    }

    const JWTPayload = { username, email };

    const token = await signTokens({ JWTPayload, JWT_MAX_AGE });

    if (token === null) throw new Error("Couldn't generate a JWT token");

    const user = new User({ username, email, password });
    await user.save();

    cookies().set(AUTH_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: COOKIES_TTL,
      path: "/",
    });

    return NextResponse.json(
      { message: "User registered" },
      { status: SUCCESS_CODES.CREATED }
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later" },
      { status: SERVER_ERROR["INTERNAL SERVER ERROR"] }
    );
  } finally {
    await mongoose.disconnect();
  }
}
