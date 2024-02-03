"use server";

import { SUCCESS_CODES } from "@/constants/statuscode";
import { errorResponse } from "@/helpers/errorHandler";
import RedisClient from "@/lib/config/redis.config";

interface ICacheServerActionResponse {
  statusCode: number;
  message?: string;
  values?: Array<{ label: string }>;
  hasError: boolean;
}

export const getInitalValuesFromCache = async ({
  setName,
  lowerLimit,
  upperLimit,
}: {
  setName: string;
  lowerLimit: number;
  upperLimit: number;
}): Promise<ICacheServerActionResponse> => {
  try {
    const client = RedisClient();
    const values = await client.zrange(setName, lowerLimit, upperLimit);
    const transformedValues = values.map((value) => ({ label: value }));
    return {
      hasError: false,
      statusCode: SUCCESS_CODES.OK,
      values: transformedValues,
    };
  } catch (error: any) {
    console.log(error.message);
    return errorResponse(error);
  }
};
