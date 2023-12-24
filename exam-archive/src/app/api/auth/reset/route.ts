import bcrypt from "bcrypt";
import {
  ACTION,
  AUTH_TOKEN,
  COOKIES_TTL,
  JWT_MAX_AGE,
  MONGO_READ_QUERY_TIMEOUT,
  MONGO_WRITE_QUERY_TIMEOUT,
  RESET_LINK_EXP_TIME,
} from "@/constants/constants";
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from "@/constants/statuscode";
import { signTokens } from "@/helpers/auth/jsonwebtokens";
import resetPasswordMail from "@/helpers/mailTemplate/resetPassword";
import sendMail from "@/helpers/nodemailer";
import connectDB from "@/lib/config/database.config";
import User from "@/models/user.model";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { PageRoutes } from "@/constants/route";

type TAction = (typeof ACTION)[keyof typeof ACTION];

interface IReset {
  email: string;
  password?: string;
  action: TAction;
}

export async function POST(request: NextRequest) {
  const { action, email, password } = (await request.json()) as IReset;

  if (action === ACTION.EMAIL) {
    try {
      await connectDB();

      const user = await User.findOne({ email })
        .select({ _id: 1 })
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .lean()
        .exec();

      if (!user) {
        return NextResponse.json(
          { message: `User not registered` },
          { status: ERROR_CODES["NOT FOUND"] }
        );
      }

      const resetToken = await signTokens({
        JWTPayload: { email },
        JWT_MAX_AGE: RESET_LINK_EXP_TIME,
      });

      if (!resetToken) throw new Error(`Couldn't generate reset token`);

      if (process.env.DOMAIN_URL === undefined)
        throw new Error("Specify your domain to generate a reset link");

      const resetLink = `${process.env.DOMAIN_URL}${PageRoutes.auth.reset}?${AUTH_TOKEN}=${resetToken}`;

      const { subject, html } = resetPasswordMail(resetLink);

      const isSend = await sendMail({ email, subject, html });
      if (isSend === false) throw new Error();

      return NextResponse.json(
        { message: "Please check your inbox" },
        { status: SUCCESS_CODES.OK }
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
  } else if (action === ACTION.RESET) {
    try {
      await connectDB();

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password as string, salt);

      const user = await User.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true, upsert: false }
      )
        .select({ _id: 1 })
        .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
        .lean()
        .exec();

      if (!user) {
        return NextResponse.json(
          { message: `Email address doesn't exists` },
          { status: ERROR_CODES["NOT FOUND"] }
        );
      }

      const token = await signTokens({ JWTPayload: { email }, JWT_MAX_AGE });

      if (token === null) throw new Error("Couldn't generate a JWT token");

      cookies().set(AUTH_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: COOKIES_TTL,
        path: "/",
      });

      return NextResponse.json(
        { message: "Password successfully changed" },
        { status: SUCCESS_CODES.OK }
      );
    } catch (error: any) {
      console.error(error.message);
      return NextResponse.json(
        {
          message: "Something went wrong. Please try again later",
        },
        { status: SERVER_ERROR["INTERNAL SERVER ERROR"] }
      );
    } finally {
      await mongoose.disconnect();
    }
  } else {
    return NextResponse.json(
      { message: "Invalid action type" },
      { status: ERROR_CODES["BAD REQUEST"] }
    );
  }
}
