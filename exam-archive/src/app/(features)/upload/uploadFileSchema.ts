import {
  EXAM_TYPES,
  SEMESTER,
  MAX_FILE_SIZE,
  ALLOWED_FILE_FORMATS,
} from "@/constants/constants";
import convertSizeToMB from "@/helpers/upload/convertToMB";
import { z } from "zod";

function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

const baseSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file && file.size <= MAX_FILE_SIZE, {
      message: `Max image file size allowed is ${convertSizeToMB(
        MAX_FILE_SIZE
      )} MB`,
    })
    .refine(
      (file) =>
        file && ALLOWED_FILE_FORMATS.includes(file.type.split("/")[1] as any),
      {
        message: "Only .pdf format is supported.",
      }
    ),
});

const uploadFileSchema = z.discriminatedUnion("examType", [
  z
    .object({
      examType: z.enum(getValues(EXAM_TYPES.INSTITUTIONAL)),
      institution: z.string().trim().min(1).max(50),
      branch: z.string().trim().min(1).max(50),
      year: z
        .string()
        .trim()
        .refine(
          (inputtedYear) => {
            const digitRegex = /^[0-9]{4}$/;
            const currentYear = new Date().getFullYear();
            const yearFifteenYearsBack = currentYear - 15;

            if (digitRegex.test(inputtedYear) === false) return false;
            if (
              Number(inputtedYear) > currentYear ||
              Number(inputtedYear) < yearFifteenYearsBack
            )
              return false;
            return true;
          },
          {
            message: `Year should be between ${
              new Date().getFullYear() - 15
            } and ${new Date().getFullYear()}`,
          }
        ),
      semester: z
        .string()
        .trim()
        .refine(
          (inputtedSemester) => {
            const semesters = Object.values(SEMESTER);
            const isPresent = semesters.find(
              (semester) => semester === inputtedSemester
            );
            return isPresent === undefined ? false : true;
          },
          { message: "Invalid semester provided" }
        ),
      subjectCode: z
        .string()
        .trim()
        .min(1)
        .max(10)
        .transform((subjectCode) => subjectCode.toUpperCase()),
      subjectName: z
        .string()
        .trim()
        .min(1)
        .max(50)
        .transform((subjectName) => subjectName.toUpperCase()),
      tags: z
        .string()
        .trim()
        .min(1)
        .max(100)
        .transform((tags) => tags.toLowerCase())
        .refine(
          (value) => {
            return (
              value &&
              !value.endsWith(",") &&
              !value.startsWith(",") &&
              value.split(",").every((tag) => tag.trim() !== "" && tag !== ",")
            );
          },
          {
            message:
              "The tags should be seperated by single comma with no space in between",
          }
        ),
    })
    .merge(baseSchema),
]);

export default uploadFileSchema;
