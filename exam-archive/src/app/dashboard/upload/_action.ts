"use server";

import fs from "fs";
import path from "path";
import os from "os";
import { uploadToCloudinary } from "@/helpers/cloudinary";
import { IForm } from "./page";
import sanitizeInput from "@/helpers/upload/sanitizeInput";
import connectDB from "@/lib/config/database.config";
import Question from "@/models/question.model";

export interface ITempFilePathResponse {
  id: string | null;
  path: string;
  name: string;
}

const uploadFilesToCloudinary = async (
  tempFilePathArray: ITempFilePathResponse[]
) => {
  try {
    const uploadFilePromises = tempFilePathArray.map((file) =>
      uploadToCloudinary(file.path)
    );

    return await Promise.all(uploadFilePromises);
  } catch (error) {
    throw error;
  }
};

const saveToLocalDirectory = async (fileArray: IForm[]) => {
  const uploadFilePromises = fileArray.map((file) => {
    return new Promise((resolve, reject) => {
      if (!file.file) {
        reject(new Error("File data is missing"));
        return;
      }
      file.file.arrayBuffer().then((data) => {
        const filename = file.file?.name.split(" ").join("_") ?? "file.pdf";
        const uploadDir = path.join(os.tmpdir(), `/${file.id}_${filename}`);

        const buffer = Buffer.from(data);

        fs.writeFile(uploadDir, buffer, (error) => {
          if (error) reject(new Error(error.message));
          else
            resolve({
              name: `${file.id}_${filename}`,
              path: uploadDir,
              id: file.id,
            });
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

    await Promise.allSettled(writeToDBPromises);
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
    tempFilePathArray = await saveToLocalDirectory(fileArray);

    const res = await Promise.all([
      saveToDatabase(fileArray, tempFilePathArray),
      uploadFilesToCloudinary(tempFilePathArray),
    ]);
  } catch (error: any) {
    console.error(error.message);
    res.isError = true;
  } finally {
    tempFilePathArray.forEach((tempPath) => {
      if (fs.existsSync(tempPath.path))
        fs.unlink(tempPath.path, (error) => {
          if (error) {
            console.error(error.message);
            res.isError = true;
          }
        });
    });
  }
  return JSON.stringify(res);
}
