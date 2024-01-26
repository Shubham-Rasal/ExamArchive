"use server";

import { MONGO_WRITE_QUERY_TIMEOUT } from "@/constants/constants";
import { ERROR_CODES, SUCCESS_CODES } from "@/constants/statuscode";
import ErrorHandler, { errorResponse } from "@/helpers/errorHandler";
import connectDB from "@/lib/config/database.config";
import Question from "@/models/question.model";

const sanitizedTags = (tags: string[]) => {
  const sanitizedTags = tags
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  return sanitizedTags;
};

export const updateQuestionTags = async ({
  postId,
  newTags,
}: {
  postId: string;
  newTags: string[];
}): Promise<IServerActionResponse> => {
  try {
    newTags = sanitizedTags(newTags);

    if (newTags.length === 0)
      return { hasError: false, statusCode: SUCCESS_CODES.OK };

    await connectDB();

    const res = await Question.findByIdAndUpdate(
      { _id: postId },
      { $addToSet: { tags: { $each: newTags } } },
      { upsert: false, new: true }
    )
      .select({ _id: 1 })
      .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
      .lean()
      .exec();

    if (!res)
      throw new ErrorHandler(
        `No question paper found with the id ${postId}`,
        ERROR_CODES["NOT FOUND"]
      );

    return {
      hasError: false,
      statusCode: SUCCESS_CODES.OK,
      message: "New tags were added to the post",
    };
  } catch (error: any) {
    console.error(error?.message);
    return errorResponse(error);
  }
};
