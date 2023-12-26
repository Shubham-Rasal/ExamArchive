import { AUTH_TOKEN } from "@/constants/constants";
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from "@/constants/statuscode";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    if (!cookies().get(AUTH_TOKEN)) {
      return NextResponse.json(
        {
          message: "Unauthenticated user. Your IP has been logged.",
        },
        { status: ERROR_CODES.UNAUTHORIZED }
      );
    }
    cookies().set(AUTH_TOKEN, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });
    return NextResponse.json(
      { message: "You are logged out" },
      { status: SUCCESS_CODES.OK }
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      {
        message: "Something went wrong! Please try again later",
      },
      { status: SERVER_ERROR["INTERNAL SERVER ERROR"] }
    );
  }
}
