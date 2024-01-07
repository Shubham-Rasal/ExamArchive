import { MONGO_WRITE_QUERY_TIMEOUT } from "@/constants/constants";
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from "@/constants/statuscode";
import connectDB from "@/lib/config/database.config";
import Question from "@/models/question.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const req = await request.json();

  const { public_id, secure_url, original_filename } = req as {
    public_id?: string;
    secure_url?: string;
    original_filename?: string;
  };

  if (!(public_id && secure_url && original_filename))
    return NextResponse.json(
      { message: "Couldn't update doc URL" },
      { status: ERROR_CODES["BAD REQUEST"] }
    );

  try {
    await connectDB();

    await Question.findOneAndUpdate(
      { "file.filename": original_filename },
      { "file.public_id": public_id, "file.url": secure_url },
      { upsert: false, new: true }
    )
      .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
      .lean()
      .exec();

    return NextResponse.json(
      { message: "Doc URL was updated successfully" },
      { status: SUCCESS_CODES.ACCEPTED }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: SERVER_ERROR["INTERNAL SERVER ERROR"] }
    );
  }
}
