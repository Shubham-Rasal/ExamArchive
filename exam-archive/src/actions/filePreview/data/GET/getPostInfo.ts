"use server";

import { MONGO_READ_QUERY_TIMEOUT, RATING_TYPE } from "@/constants/constants";
import { ERROR_CODES, SUCCESS_CODES } from "@/constants/statuscode";
import ErrorHandler, { errorResponse } from "@/helpers/errorHandler";
import connectDB from "@/lib/config/database.config";
import Question from "@/models/question.model";
import Rating from "@/models/rating.model";

export type TRating = keyof typeof RATING_TYPE;

interface IRating {
  ratingType: TRating;
  totalRating: number;
  avgRating: number;
}

export interface IDocumentInfo extends IServerActionResponse {
  docInfo: string;
  hasUserRated: boolean;
}

export const getPostInfo = async ({
  postId,
  userId,
}: {
  postId: string;
  userId: string;
}): Promise<IDocumentInfo | IServerActionResponse> => {
  try {
    await connectDB();
    const readFromDBPromises = [
      Question.findOne({ _id: postId })
        .populate({ path: "uploaded_by", select: { username: 1, _id: 0 } })
        .select({
          no_of_downloads: 0,
          no_of_views: 0,
          "filename.filename": 0,
          "filename.public_id": 0,
          "uploaded_by._id": 0,
        })
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .lean()
        .exec(),
      Rating.findOne({ userId })
        .select({ _id: 1 })
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .lean()
        .exec(),
    ];

    const [docInfo, ratingInfo] = await Promise.all(readFromDBPromises);

    if (!docInfo) {
      throw new ErrorHandler(
        `No document found with the given postId`,
        ERROR_CODES["NOT FOUND"]
      );
    }

    return {
      hasError: false,
      statusCode: SUCCESS_CODES.OK,
      docInfo: JSON.stringify(docInfo),
      hasUserRated: ratingInfo !== null,
    };
  } catch (error: any) {
    console.error(error?.message);
    return errorResponse(error);
  }
};
