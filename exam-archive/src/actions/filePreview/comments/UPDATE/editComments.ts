"use server";

import {
  MAX_COMMENT_LENGTH,
  MONGO_WRITE_QUERY_TIMEOUT,
} from "@/constants/constants";
import { ERROR_CODES, SUCCESS_CODES } from "@/constants/statuscode";
import ErrorHandler, { errorResponse } from "@/helpers/errorHandler";
import connectDB from "@/lib/config/database.config";
import Comment from "@/models/comment.model";

export const editComment = async ({
  commentId,
  message,
}: {
  commentId: string;
  message: string;
}): Promise<IServerActionResponse> => {
  try {
    message = message.trim();

    if (message.length > MAX_COMMENT_LENGTH)
      throw new ErrorHandler(
        `Message is too big. Try to fit it within a length of ${MAX_COMMENT_LENGTH} characters`,
        ERROR_CODES["PAYLOAD TOO LARGE"]
      );

    if (message.length === 0)
      return { hasError: false, statusCode: SUCCESS_CODES.OK };

    await connectDB();

    const res = await Comment.findByIdAndUpdate(
      { _id: commentId },
      { isEdited: true, message },
      { upsert: false, new: true }
    )
      .select({ _id: 1 })
      .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
      .lean()
      .exec();

    if (!res)
      throw new ErrorHandler(
        `No comments found with the given comment id: ${commentId}`,
        ERROR_CODES["NOT FOUND"]
      );

    return { hasError: false, statusCode: SUCCESS_CODES.ACCEPTED };
  } catch (error: any) {
    console.error(error?.message);
    return errorResponse(error);
  }
};
