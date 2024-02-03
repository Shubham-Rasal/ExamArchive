"use server";

import { MONGO_READ_QUERY_TIMEOUT } from "@/constants/constants";
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
}

const getSearchedPapers = async (
  filters: Record<string, string[] | string>
): Promise<IServerActionResponse | IFilteredPapers> => {
  try {
    await connectDB();
    const filteredQuestions = await Question.find(filters)
      .select({ file: 0, rating: 0 })
      .maxTimeMS(MONGO_READ_QUERY_TIMEOUT)
      .lean()
      .exec();

    if (!filteredQuestions)
      throw new ErrorHandler(
        "No paper found with the provided filters",
        ERROR_CODES["NOT FOUND"]
      );

    return {
      hasError: false,
      statusCode: SUCCESS_CODES.OK,
      papers: filteredQuestions,
    };
  } catch (error: any) {
    console.error(error.message);
    return errorResponse(error);
  }
};

export default getSearchedPapers;
