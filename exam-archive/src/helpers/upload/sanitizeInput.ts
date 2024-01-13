import { ITempFilePathResponse } from "@/app/dashboard/upload/_action";
import { IForm } from "@/app/dashboard/upload/page";
import { AUTH_TOKEN, BRANCH, SEMESTER } from "@/constants/constants";
import { decodeJwt } from "jose";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

const getKey = (object: Record<string, string>, value: string) => {
  return Object.keys(object).find((key) => object[key] === value);
};

const sanitizeInput = (
  fileArray: IForm[],
  tempFilePathArray: ITempFilePathResponse[]
) => {
  const sanitizedFileArray = [];
  const authToken = cookies().get(AUTH_TOKEN) as RequestCookie;
  const { username } = decodeJwt(authToken.value) as { username: string };

  for (let file of fileArray) {
    const tags = file.tag.split(" ");
    const uploaded_by = username;
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

    if (file.branch)
      Object.assign(fileObj, { branch: getKey(BRANCH, file.branch) });

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
