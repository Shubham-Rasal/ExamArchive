"use server";

import {
  MAX_COMMENT_LENGTH,
  MONGO_WRITE_QUERY_TIMEOUT,
} from "@/constants/constants";
import {
  ERROR_CODES,
  SERVER_ERROR,
  SUCCESS_CODES,
} from "@/constants/statuscode";
import ErrorHandler, { errorResponse } from "@/helpers/errorHandler";
import connectDB from "@/lib/config/database.config";
import Comment from "@/models/comment.model";
import mongoose from "mongoose";

interface IPostCommentResponse extends IServerActionResponse {
  parentId?: string;
  commentId?: string;
}

export interface ICommentPayload {
  parentId?: string;
  postId: string;
  isEdited?: boolean;
  userId: string;
  message: string;
}

export const postComment = async (
  commentPayload: ICommentPayload
): Promise<IServerActionResponse | IPostCommentResponse> => {
  const { parentId, postId, isEdited, userId, message } = commentPayload;
  const sanitizedMessage = message.trim();

  await connectDB();
  const session = await mongoose.startSession();

  try {
    let commentId: any;
    await session.withTransaction(async () => {
      if (sanitizedMessage.length > MAX_COMMENT_LENGTH) {
        await session.abortTransaction();
        throw new ErrorHandler(
          `Message is too big. Try to fit it within a length of ${MAX_COMMENT_LENGTH} characters`,
          ERROR_CODES["PAYLOAD TOO LARGE"]
        );
      }
      if (sanitizedMessage.length === 0) {
        await session.abortTransaction();
        throw new ErrorHandler(
          `Message parameter is empty`,
          ERROR_CODES["NOT ACCEPTABLE"]
        );
      }
      const docs = {
        postId,
        isEdited: isEdited ?? false,
        userId,
        message: sanitizedMessage,
      };

      if (parentId) Object.assign(docs, { parentId });
      const writeToDBPromises = [Comment.create([docs], { session: session })];

      if (parentId)
        writeToDBPromises.push(
          Comment.findOneAndUpdate(
            { _id: parentId, isDeleted: false },
            { $inc: { replyCount: 1 } },
            { upsert: false, new: true }
          )
            .select({ _id: 1 })
            .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
            .session(session)
            .lean()
            .exec() as Promise<any[]>
        );

      const [[res], updateRes] = await Promise.all(writeToDBPromises);
      if (!updateRes) {
        await session.abortTransaction();
        throw new ErrorHandler(
          "No comment found with the given id",
          ERROR_CODES["NOT FOUND"]
        );
      }
      if (!res) {
        await session.abortTransaction();
        throw new ErrorHandler(
          "Something went wrong. Please try again later",
          SERVER_ERROR["INTERNAL SERVER ERROR"]
        );
      }
      commentId = res._id;
    });
    return {
      hasError: false,
      statusCode: SUCCESS_CODES.CREATED,
      message: "Your comment was successfully posted",
      parentId: parentId?.toString(),
      commentId: commentId === undefined ? commentId : commentId.toString(),
    };
  } catch (error: any) {
    console.error(error?.message);
    return errorResponse(error);
  } finally {
    await session.endSession();
  }
};
