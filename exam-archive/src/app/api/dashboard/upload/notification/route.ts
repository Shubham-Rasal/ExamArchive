import { SUCCESS_CODES } from "@/constants/statuscode";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const req = await request.json();
  console.log("test", req);
  return NextResponse.json(
    { message: "Everything seems good" },
    { status: SUCCESS_CODES.OK }
  );
}
