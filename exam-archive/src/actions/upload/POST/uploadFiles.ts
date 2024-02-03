"use server";

import { v2 as cloudinary } from "cloudinary";
import { uploadToCloudinary } from "@/helpers/cloudinary";
import sanitizeInput from "@/helpers/upload/sanitizeInput";
import connectDB from "@/lib/config/database.config";
import Question from "@/models/question.model";
import { TUploadFile } from "@/app/(features)/upload/page";
import { errorResponse } from "@/helpers/errorHandler";
import { SUCCESS_CODES } from "@/constants/statuscode";

export interface ITempFilePathResponse {
  id: string | null;
  dataURI: string;
  name: string;
  type?: string;
}

export type TUploadFileExtended = { id: string } & TUploadFile;

const uploadFilesToCloudinary = async (
  tempFilePathArray: ITempFilePathResponse[]
) => {
  try {
    const { status } = await cloudinary.api.ping();

    if (status !== "ok")
      throw new Error("Couldn't connect to cloudinary instance");

    const uploadFilePromises = tempFilePathArray.map((file) =>
      uploadToCloudinary(file.dataURI, file.name)
    );

    await Promise.all(uploadFilePromises);
  } catch (error) {
    throw error;
  }
};

const createFileBuffer = async (fileArray: TUploadFileExtended[]) => {
  const uploadFilePromises: Promise<ITempFilePathResponse>[] = fileArray.map(
    (file) => {
      return new Promise((resolve, reject) => {
        if (file.file === null) {
          reject(new Error("File data is missing"));
          return;
        }
        file.file
          .arrayBuffer()
          .then(
            (data: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) => {
              const filename =
                file.file?.name.split(" ").join("_") ?? "file.pdf";

              const buffer = Buffer.from(data).toString("base64");
              const dataURI = `data:${file.file?.type};base64,${buffer}`;

              resolve({
                name: `${file.id}_${filename}`,
                type: file.file?.type,
                dataURI,
                id: file.id,
              });
            }
          );
      });
    }
  );

  try {
    return await Promise.all(uploadFilePromises);
  } catch (error) {
    throw error;
  }
};

const saveToDatabase = async (
  fileArray: TUploadFileExtended[],
  tempFilePathArray: ITempFilePathResponse[]
) => {
  const sanitizedFileArray = sanitizeInput(fileArray, tempFilePathArray);

  try {
    await connectDB();

    const writeToDBPromises = sanitizedFileArray.map((file) =>
      Question.create(file)
    );

    await Promise.all(writeToDBPromises);
  } catch (error) {
    throw error;
  }
};

const uploadfileAction = async (
  formdata: FormData
): Promise<IServerActionResponse> => {
  const data = Object.fromEntries(formdata.entries());

  const fileArray: TUploadFileExtended[] = [];

  Object.entries(data).forEach(([key, value]) => {
    const [field, index] = key.split(":");
    if (!fileArray[Number(index)])
      fileArray[Number(index)] = {
        id: Date.now().toString(),
      } as unknown as TUploadFileExtended;
    Object.assign(fileArray[Number(index)], { [field]: value });
  });

  let fileInfoArray: ITempFilePathResponse[] = [];

  try {
    fileInfoArray = await createFileBuffer(fileArray);

    await Promise.all([
      saveToDatabase(fileArray, fileInfoArray),
      uploadFilesToCloudinary(fileInfoArray),
    ]);
    return { hasError: false, statusCode: SUCCESS_CODES.CREATED };
  } catch (error: any) {
    console.error(error.message);
    return errorResponse(error);
  }
};

export default uploadfileAction;
