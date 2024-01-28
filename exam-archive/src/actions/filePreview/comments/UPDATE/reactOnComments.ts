"use server";

import { MONGO_WRITE_QUERY_TIMEOUT } from "@/constants/constants";
import { ERROR_CODES, SUCCESS_CODES } from "@/constants/statuscode";
import ErrorHandler, { errorResponse } from "@/helpers/errorHandler";
import connectDB from "@/lib/config/database.config";
import Comment from "@/models/comment.model";

type TCommentReact = "UPVOTE" | "DOWNVOTE";
type TReaction = "LIKE" | "UNLIKE";

export interface IReactOnComment {
  commentId: string;
  voterId: string;
  action: TCommentReact;
  reaction: TReaction;
}

export interface IReactResponse extends IServerActionResponse {
  hasLiked: boolean;
}

export const reactOnComment = async ({
  commentId,
  voterId,
  action,
  reaction,
}: IReactOnComment): Promise<IServerActionResponse | IReactResponse> => {
  try {
    action = action.toUpperCase() as TCommentReact;
    reaction = reaction.toUpperCase() as TReaction;

    if (action !== "DOWNVOTE" && action !== "UPVOTE")
      throw new ErrorHandler(
        `Invalid update action: ${action} was passed`,
        ERROR_CODES["BAD REQUEST"]
      );

    if (reaction !== "LIKE" && reaction !== "UNLIKE")
      throw new ErrorHandler(
        `Invalid update reaction: ${reaction} was passed`,
        ERROR_CODES["BAD REQUEST"]
      );

    const filter =
      reaction === "UNLIKE"
        ? { _id: commentId }
        : action === "DOWNVOTE"
        ? { _id: commentId, "downVotes.voters": { $ne: voterId } }
        : { _id: commentId, "upVotes.voters": { $ne: voterId } };

    let updateOperator;

    if (reaction === "LIKE") {
      updateOperator =
        action === "DOWNVOTE"
          ? {
              $addToSet: { "downVotes.voters": voterId },
              $inc: { "downVotes.count": 1 },
            }
          : {
              $addToSet: { "upVotes.voters": voterId },
              $inc: { "upVotes.count": 1 },
            };
    } else {
      updateOperator =
        action === "DOWNVOTE"
          ? {
              $pull: { "downVotes.voters": voterId },
              $inc: { "downVotes.count": -1 },
            }
          : {
              $pull: { "upVotes.voters": voterId },
              $inc: { "upVotes.count": -1 },
            };
    }

    const updateOptions = { new: true, upsert: false };
    
    await connectDB();

    const res = await Comment.findOneAndUpdate(
      filter,
      updateOperator,
      updateOptions
    )
      .select({ _id: 1 })
      .maxTimeMS(MONGO_WRITE_QUERY_TIMEOUT)
      .lean()
      .exec();

    if (!res)
      throw new ErrorHandler(
        `No comments found with the given comment id: ${commentId} or the vote already exists`,
        ERROR_CODES["NOT FOUND"]
      );

    return {
      hasError: false,
      statusCode: SUCCESS_CODES.OK,
      hasLiked: reaction === "LIKE",
    };
  } catch (error: any) {
    console.error(error?.message);
    return errorResponse(error);
  }
};
