import { SUCCESS_CODES } from "@/constants/statuscode";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  console.log(
    "test",
    request.body.secure_url,
    request.body.url,
    request.body.public_id
  );
  return NextResponse.json(
    { message: "Everything seems good" },
    { status: SUCCESS_CODES.OK }
  );
}
