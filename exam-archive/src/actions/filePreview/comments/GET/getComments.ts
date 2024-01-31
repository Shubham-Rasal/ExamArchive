"use server";

import {
  MONGO_READ_QUERY_TIMEOUT,
  MAX_COMMENT_FETCH_LIMIT,
} from "@/constants/constants";
import { ERROR_CODES, SUCCESS_CODES } from "@/constants/statuscode";
import ErrorHandler, { errorResponse } from "@/helpers/errorHandler";
import connectDB from "@/lib/config/database.config";
import Comment from "@/models/comment.model";
import mongoose, { SortOrder } from "mongoose";

export interface IComment {
  postId: string;
  commentId: string;
  parentId?: string;
  userId: { _id: string; username: string };
  message: string;
  timestamp: string;
  upVotes?: number;
  downVotes?: number;
  hasUpVoted?: number;
  hasDownVoted?: number;
  isEdited?: boolean;
  isDeleted: boolean;
  isFlagged: boolean;
  replyCount: number;
}

export interface IGetCommentResponse extends IServerActionResponse {
  comments: IComment[];
  totalComments: number;
  hasMore: boolean;
}

export type TCommentType = "COMMENTS" | "REPLIES";

const getSanitizedComments = (
  comments: any,
  currentUserId: mongoose.Types.ObjectId
) => {
  const sanitizedComments: IComment[] = comments.map((comment: any) => {
    const {
      isDeleted,
      isFlagged,
      isEdited,
      _id: commentId,
      message,
      postId,
      userId,
      updatedAt: timestamp,
      upVotes,
      downVotes,
      replyCount,
      parentId,
    } = comment;

    const commentObj = {
      replyCount,
      timestamp,
      userId: {
        _id: userId._id.toString(),
        username: userId.username.toString(),
      },
      postId: postId.toString(),
      commentId: commentId.toString(),
      parentId: parentId === undefined ? undefined : parentId.toString(),
    };

    const hasUpVoted = upVotes.voters.find((id: string) => {
      return id.toString() === currentUserId.toString();
    })
      ? true
      : false;
    const hasDownVoted = downVotes.voters.find(
      (id: string) => id.toString() === currentUserId.toString()
    )
      ? true
      : false;

    if (isDeleted === true)
      Object.assign(commentObj, {
        isDeleted: true,
        message: "This message was deleted by the user",
      });
    else if (isFlagged === true)
      Object.assign(commentObj, {
        isFlagged: true,
        message: "This comment was removed by the admin",
      });
    else
      Object.assign(commentObj, {
        isEdited,
        message,
        upVotes: { count: upVotes.count, hasUpVoted },
        downVotes: { count: downVotes.count, hasDownVoted },
      });

    return commentObj as IComment;
  });
  return sanitizedComments;
};

export const getComments = async ({
  postId,
  page = 1,
  commentType = "COMMENTS",
  parentId,
  userId,
}: {
  postId: string;
  page?: number;
  commentType?: TCommentType;
  parentId?: string;
  userId: string;
}): Promise<IGetCommentResponse | IServerActionResponse> => {
  try {
    const skipCount = (page - 1) * MAX_COMMENT_FETCH_LIMIT;

    if (commentType !== "COMMENTS" && commentType !== "REPLIES")
      throw new ErrorHandler(
        "Invalid comment type",
        ERROR_CODES["BAD REQUEST"]
      );

    const query =
      commentType === "COMMENTS"
        ? { postId, parentId: undefined }
        : { postId, parentId };

    const sortOrder: { [key: string]: SortOrder } | null =
      commentType === "COMMENTS"
        ? { "upVotes.count": "descending", updatedAt: "descending" }
        : null;

    const getDataFromDBPromises = [
      Comment.find(query)
        .populate({ path: "userId", select: { username: 1 } })
        .select({ createdAt: 0 })
        .sort(sortOrder)
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .lean()
        .skip(skipCount)
        .limit(MAX_COMMENT_FETCH_LIMIT),
      Comment.countDocuments(query)
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .lean()
        .exec(),
    ];

    await connectDB();

    const [comments, totalComments] = await Promise.all(getDataFromDBPromises);

    const sanitizedComments = getSanitizedComments(
      comments,
      new mongoose.Types.ObjectId(userId)
    );
    const totalPages = Math.ceil(
      Number(totalComments) / MAX_COMMENT_FETCH_LIMIT
    );
    const hasMore = totalPages > page;

    return {
      hasError: false,
      statusCode: SUCCESS_CODES.OK,
      comments: sanitizedComments,
      totalComments: Number(totalComments),
      hasMore,
    };
  } catch (error: any) {
    console.error(error.message);
    return errorResponse(error);
  }
};
