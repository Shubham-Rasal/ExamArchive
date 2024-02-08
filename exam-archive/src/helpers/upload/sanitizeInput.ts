import {
  ITempFilePathResponse,
  TUploadFileExtended,
} from "./../../actions/upload/POST/uploadFiles";
import { AUTH_TOKEN, SEMESTER } from "@/constants/constants";
import { decodeJwt } from "jose";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

const getKey = (object: Record<string, string>, value: string) => {
  return Object.keys(object).find((key) => object[key] === value);
};

const sanitizeInput = (
  fileArray: TUploadFileExtended[],
  tempFilePathArray: ITempFilePathResponse[]
) => {
  const sanitizedFileArray = [];
  const authToken = cookies().get(AUTH_TOKEN) as RequestCookie;
  const { userId } = decodeJwt(authToken.value) as { userId: string };

  for (let file of fileArray) {
    const tags = file.tags.split(" ");
    const uploaded_by = userId;
    const filename = tempFilePathArray.find(
      (filepath) => filepath.id === file.id
    )?.name;
    const fileObj = Object.assign(
      {},
      {
        tags,
        uploaded_by,
        file: { filename },
        year: file.year,
        exam_type: file.examType,
      }
    );

    if (file.semester)
      Object.assign(fileObj, { semester: getKey(SEMESTER, file.semester) });

    if (file.branch) Object.assign(fileObj, { branch: file.branch });

    if (file.subjectName)
      Object.assign(fileObj, { subject_name: file.subjectName });

    if (file.subjectCode)
      Object.assign(fileObj, { subject_code: file.subjectCode });

    if (file.institution)
      Object.assign(fileObj, { institution_name: file.institution });

    sanitizedFileArray.push(fileObj);
  }

  return sanitizedFileArray;
};

export default sanitizeInput;
