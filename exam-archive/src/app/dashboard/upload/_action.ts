"use server";

import { v2 as cloudinary } from "cloudinary";
import { uploadToCloudinary } from "@/helpers/cloudinary";
import { IForm } from "./page";
import sanitizeInput from "@/helpers/upload/sanitizeInput";
import connectDB from "@/lib/config/database.config";
import Question from "@/models/question.model";

export interface ITempFilePathResponse {
  id: string | null;
  dataURI: string;
  name: string;
  type: string;
}

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

const createFileBuffer = async (fileArray: IForm[]) => {
  const uploadFilePromises = fileArray.map((file) => {
    return new Promise((resolve, reject) => {
      if (!file.file) {
        reject(new Error("File data is missing"));
        return;
      }
      file.file.arrayBuffer().then((data) => {
        const filename = file.file?.name.split(" ").join("_") ?? "file.pdf";

        const buffer = Buffer.from(data).toString("base64");
        const dataURI = `data:${file.file?.type};base64,${buffer}`;

        resolve({
          name: `${file.id}_${filename}`,
          type: file.file?.type,
          dataURI,
          id: file.id,
        });
      });
    });
  });

  try {
    return await Promise.all(uploadFilePromises);
  } catch (error) {
    throw error;
  }
};

const saveToDatabase = async (
  fileArray: IForm[],
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

export async function handleUpload(formdata: FormData) {
  const data = Object.fromEntries(formdata.entries());

  const fileArray: IForm[] = [];

  Object.entries(data).forEach(([key, value]) => {
    const [field, index] = key.split(":");
    if (!fileArray[Number(index)])
      fileArray[Number(index)] = {} as unknown as IForm;
    Object.assign(fileArray[Number(index)], { [field]: value });
  });

  let tempFilePathArray: any[] = [];

  const res = { isError: false };
  try {
    tempFilePathArray = await createFileBuffer(fileArray);

    await Promise.all([
      saveToDatabase(fileArray, tempFilePathArray),
      uploadFilesToCloudinary(tempFilePathArray),
    ]);
  } catch (error: any) {
    console.error(error.message);
    res.isError = true;
  }
  return res;
}
