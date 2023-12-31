import mongoose, { Schema } from "mongoose";
import User from "./user.model";
import {
  BRANCH,
  EXAM_TYPES,
  RATING_TYPE,
  SEMESTER,
} from "@/constants/constants";
import { examNames } from "@/helpers/examNames";

const QuestionSchema: Schema = new mongoose.Schema(
  {
    uploaded_by: { type: String, required: true, ref: User },
    year: {
      type: String,
      validate: {
        validator: function (year: string) {
          const digitRegex = /\d/;
          const yearInt = Number(year);
          const date = new Date();
          const presentYear = date.getFullYear();
          if (digitRegex.test(year) === false || year.length !== 4)
            return false;
          if (yearInt < 1950 || yearInt > presentYear) return false;
        },
      },
      required: true,
      index: true,
    },
    file: {
      filename: { type: String, index: true },
      public_id: { type: String },
      url: { type: String },
    },
    exam_type: {
      type: String,
      required: true,
      enum: examNames(EXAM_TYPES),
      index: true,
    },
    rating: [
      {
        rating_type: {
          type: String,
          enum: Object.values(RATING_TYPE),
          required: true,
        },
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
      },
    ],
    no_of_downloads: { type: Number, default: 0 },
    no_of_views: { type: Number, default: 0 },
    tags: [{ type: String, index: true }],
    institution_name: { type: String, index: true },
    semester: { type: String, enum: Object.keys(SEMESTER), index: true },
    branch: { type: String, enum: Object.keys(BRANCH), index: true },
    subject_code: { type: String, index: true },
    subject_name: { type: String, index: true },
  },
  { timestamps: true, strict: true }
);

const Question =
  mongoose.models.question || mongoose.model("question", QuestionSchema);

export default Question;
