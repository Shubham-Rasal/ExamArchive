import { ERROR_CODES, SUCCESS_CODES } from "@/constants/statuscode";
import { verifyTokens } from "@/helpers/jsonwebtokens";
import { JWTPayload } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { authToken } = (await request.json()) as { authToken: string };

  const isTokenValid = await verifyTokens({ token: authToken });

  return isTokenValid === false
    ? NextResponse.json(
        { message: "The auth token has expired or is not valid" },
        { status: ERROR_CODES.FORBIDDEN }
      )
    : NextResponse.json(
        {
          message: "Auth token is valid",
          email: (isTokenValid as JWTPayload).email,
        },
        { status: SUCCESS_CODES.ACCEPTED }
      );
}
