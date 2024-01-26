"use server";

import {
  MONGO_READ_QUERY_TIMEOUT,
  MONGO_WRITE_QUERY_TIMEOUT,
  RATING_TYPE,
} from "@/constants/constants";
import { ERROR_CODES, SUCCESS_CODES } from "@/constants/statuscode";
import ErrorHandler, { errorResponse } from "@/helpers/errorHandler";
import {
  getRatingArrayValues,
  isRatingArrayValid,
  calculateRating,
} from "@/helpers/filePreview/rating";
import connectDB from "@/lib/config/database.config";
import Question from "@/models/question.model";
import Rating from "@/models/rating.model";
import mongoose from "mongoose";

export interface IRating {
  type: (typeof RATING_TYPE)[keyof typeof RATING_TYPE];
  value: number;
}

export interface IRatingInfo {
  rating_type: (typeof RATING_TYPE)[keyof typeof RATING_TYPE];
  total_rating: number;
  average_rating: number;
}

const updateRatings = async ({
  postId,
  userId,
  ratingArray,
}: {
  postId: string;
  userId: string;
  ratingArray: IRating[];
}): Promise<IServerActionResponse> => {
  await connectDB();
  const session = await mongoose.startSession();

  const { ratingArrayValues, helpfulRating, standardRating, relevanceRating } =
    getRatingArrayValues(ratingArray);

  try {
    if (isRatingArrayValid(ratingArrayValues) === false)
      throw new ErrorHandler(
        "Invalid rating array",
        ERROR_CODES["BAD REQUEST"]
      );

    await session.withTransaction(async () => {
      let { rating }: { rating: IRatingInfo[] | null } =
        (await Question.findById({ _id: postId })
          .select({ rating: 1, _id: 0 })
          .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
          .session(session)
          .lean()
          .exec()) as any;

      if (rating === null) {
        await session.abortTransaction();
        throw new ErrorHandler(
          "No document found with the given Id",
          ERROR_CODES["NOT FOUND"]
        );
      }

      rating = rating.map((item, i) => ({
        ...item,
        average_rating: calculateRating({
          totalRating: item.total_rating,
          avgRating: item.average_rating,
          newRating: ratingArrayValues[i],
        }),
        total_rating: item.total_rating + ratingArrayValues[i],
      }));

      const updateDataInDBPromises = [
        Rating.findOneAndUpdate(
          { postId, userId },
          { $setOnInsert: { postId, userId, rating: ratingArrayValues } },
          { upsert: true, new: false }
        )
          .select({ rating: 1, _id: 0 })
          .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
          .session(session)
          .lean()
          .exec(),
        Question.findByIdAndUpdate(
          { _id: postId },
          { rating },
          { upsert: false, new: true }
        )
          .select({ _id: 1 })
          .session(session)
          .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
          .lean()
          .exec(),
      ];
      const [updatedRatings, _] = await Promise.all(updateDataInDBPromises);

      if (updatedRatings !== null) {
        await session.abortTransaction();
        throw new ErrorHandler(
          "You have already rated this post",
          ERROR_CODES.CONFLICT
        );
      }
    });

    return {
      hasError: false,
      statusCode: SUCCESS_CODES.CREATED,
    };
  } catch (error: any) {
    console.error(error?.message);
    return errorResponse(error);
  } finally {
    session.endSession();
  }
};

export default updateRatings;
