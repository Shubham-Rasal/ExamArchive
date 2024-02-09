"use server";

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
import connectDB from "@/lib/config/database.config";
import User from "@/models/user.model";
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from "@/constants/statuscode";
import { signTokens } from "@/helpers/auth/jsonwebtokens";
import ErrorHandler, { errorResponse } from "@/helpers/errorHandler";
import { PageRoutes } from "@/constants/route";
import resetPasswordMail from "@/helpers/mailTemplate/resetPassword";
import sendMail from "@/helpers/nodemailer";
import { cookies } from "next/headers";

export type TAction = (typeof ACTION)[keyof typeof ACTION];

interface IReset {
  email: string;
  password?: string;
  action: TAction;
}

const resetAction = async ({
  action,
  email,
  password,
}: IReset): Promise<IServerActionResponse> => {
  if (action === ACTION.EMAIL) {
    try {
      await connectDB();

      const user = await User.findOne({ email })
        .select({ _id: 1 })
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .lean()
        .exec();

      if (!user)
        throw new ErrorHandler("User not registered", ERROR_CODES["NOT FOUND"]);

      const resetToken = await signTokens({
        JWTPayload: { email },
        JWT_MAX_AGE: RESET_LINK_EXP_TIME,
      });

      if (!resetToken)
        throw new ErrorHandler(
          `Couldn't generate reset token`,
          SERVER_ERROR["INTERNAL SERVER ERROR"]
        );

      if (process.env.DOMAIN_URL === undefined)
        throw new ErrorHandler(
          "Specify your domain to generate a reset link",
          SERVER_ERROR["INTERNAL SERVER ERROR"]
        );

      const resetLink = `${process.env.DOMAIN_URL}${PageRoutes.auth.reset}?${AUTH_TOKEN}=${resetToken}`;

      const { subject, html } = resetPasswordMail(resetLink);

      const isSend = await sendMail({ email, subject, html });
      if (isSend === false) throw new Error();

      return {
        message: "Please check your inbox",
        statusCode: SUCCESS_CODES.OK,
        hasError: false,
      };
    } catch (error: any) {
      console.error(error.message);
      return errorResponse(error);
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

      if (!user)
        throw new ErrorHandler(
          `Email address doesn't exists`,
          ERROR_CODES["NOT FOUND"]
        );

      const token = await signTokens({
        JWTPayload: { email, userId: (user as any)._id.toString() },
        JWT_MAX_AGE,
      });

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
        message: "Password successfully changed",
        statusCode: SUCCESS_CODES.OK,
      };
    } catch (error: any) {
      console.error(error.message);
      return errorResponse(error);
    }
  } else {
    return {
      hasError: true,
      message: "Invalid action type",
      statusCode: ERROR_CODES["BAD REQUEST"],
    };
  }
};

export default resetAction;
