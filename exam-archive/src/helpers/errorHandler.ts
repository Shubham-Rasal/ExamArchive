import { SERVER_ERROR } from "@/constants/statuscode";

class ErrorHandler extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorResponse = (error: any): IServerActionResponse => {
  if (error.statusCode && error.statusCode >= 500)
    return {
      hasError: true,
      message: "Something went wrong. Please try again later",
      statusCode: error.statusCode,
    };
  if (error.statusCode && error.statusCode >= 400)
    return {
      hasError: true,
      message: error.message,
      statusCode: error.statusCode,
    };
  return {
    hasError: true,
    message: "Something went wrong. Please try again later",
    statusCode: SERVER_ERROR["INTERNAL SERVER ERROR"],
  };
};

export default ErrorHandler;
