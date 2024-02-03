"use server";

import { MONGO_WRITE_QUERY_TIMEOUT } from "@/constants/constants";
import { ERROR_CODES, SUCCESS_CODES } from "@/constants/statuscode";
import ErrorHandler, { errorResponse } from "@/helpers/errorHandler";
import connectDB from "@/lib/config/database.config";
import Comment from "@/models/comment.model";
import mongoose from "mongoose";

export const deleteComment = async ({
  commentId,
  parentId,
}: {
  commentId: string;
  parentId?: string;
}): Promise<IServerActionResponse> => {
  const session = await mongoose.startSession();
  await connectDB();

  try {
    if (parentId && parentId === commentId)
      throw new ErrorHandler(
        "Parent and child comment ids are same",
        ERROR_CODES.CONFLICT
      );
    await session.withTransaction(async () => {
      const updatePromises = [
        Comment.findOneAndUpdate(
          { _id: commentId, isDeleted: false },
          { isDeleted: true },
          { upsert: false, new: true }
        )
          .select({ _id: 1 })
          .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
          .session(session)
          .lean()
          .exec(),
      ];
      if (parentId)
        updatePromises.push(
          Comment.findByIdAndUpdate(
            { _id: parentId },
            { $inc: { replyCount: -1 } },
            { upsert: false, new: true }
          )
            .select({ _id: 1 })
            .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
            .session(session)
            .lean()
            .exec()
        );
      const [updateState, updateReplyCount] = await Promise.all(updatePromises);
      if (!updateState) {
        await session.abortTransaction();
        throw new ErrorHandler(
          "Comment was either already deleted or no comment exists with the given id",
          ERROR_CODES["NOT FOUND"]
        );
      }
      if (!updateReplyCount) {
        await session.abortTransaction();
        throw new ErrorHandler(
          "No comment found with the given id",
          ERROR_CODES["NOT FOUND"]
        );
      }
    });

    return { hasError: false, statusCode: SUCCESS_CODES.OK };
  } catch (error: any) {
    console.error(error?.message);
    return errorResponse(error);
  } finally {
    await session.endSession();
  }
};
