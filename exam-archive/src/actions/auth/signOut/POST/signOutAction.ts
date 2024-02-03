"use server";

import { AUTH_TOKEN } from "@/constants/constants";
import { ERROR_CODES, SUCCESS_CODES } from "@/constants/statuscode";
import ErrorHandler, { errorResponse } from "@/helpers/errorHandler";
import { cookies } from "next/headers";

const signOutAction = (): IServerActionResponse => {
  try {
    if (!cookies().get(AUTH_TOKEN))
      throw new ErrorHandler(
        "Unauthenticated user. Your IP has been logged.",
        ERROR_CODES.UNAUTHORIZED
      );

    cookies().set(AUTH_TOKEN, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });
    return {
      hasError: false,
      message: "You are logged out",
      statusCode: SUCCESS_CODES.OK,
    };
  } catch (error: any) {
    console.error(error.message);
    return errorResponse(error);
  }
};

export default signOutAction;
