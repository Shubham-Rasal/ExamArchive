"use server";

import {
  MAX_PAPERS_FETCH_LIMIT,
  MONGO_READ_QUERY_TIMEOUT,
} from "@/constants/constants";
import { ERROR_CODES, SUCCESS_CODES } from "@/constants/statuscode";
import ErrorHandler, { errorResponse } from "@/helpers/errorHandler";
import connectDB from "@/lib/config/database.config";
import Question from "@/models/question.model";

type TFilteredPapers = Record<
  string,
  string | string[] | Record<string, string>
>;

interface IFilteredPapers extends IServerActionResponse {
  papers: TFilteredPapers[];
  hasMore: boolean;
  totalRecords: number;
}

const getSearchedPapers = async ({
  filters,
  page,
}: {
  filters: Record<string, string[]> | undefined;
  page: number;
}): Promise<IServerActionResponse | IFilteredPapers> => {
  try {
    const skipCount = (page - 1) * MAX_PAPERS_FETCH_LIMIT;

    await connectDB();
    const query = filters ?? {};

    const [filteredQuestions, totalRecords]: [
      filteredQuestions: TFilteredPapers[],
      totalRecords: number
    ] = await Promise.all([
      Question.find(query)
        .select({ file: 0, rating: 0 })
        .sort({ updatedAt: -1 })
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .lean()
        .skip(skipCount)
        .limit(MAX_PAPERS_FETCH_LIMIT),
      Question.countDocuments(query)
        .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
        .lean()
        .exec(),
    ]);

    if (!filteredQuestions)
      throw new ErrorHandler(
        "No paper found with the provided filters",
        ERROR_CODES["NOT FOUND"]
      );

    const totalPages = Math.ceil(Number(totalRecords) / MAX_PAPERS_FETCH_LIMIT);
    const hasMore = totalPages > page;

    return {
      hasError: false,
      statusCode: SUCCESS_CODES.OK,
      papers: filteredQuestions,
      totalRecords,
      hasMore,
    };
  } catch (error: any) {
    console.error(error.message);
    return errorResponse(error);
  }
};

export default getSearchedPapers;
