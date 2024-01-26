import mongoose, { Schema } from "mongoose";
import User from "./user.model";
import { BRANCH, EXAM_TYPES, SEMESTER } from "@/constants/constants";
import { examNames } from "@/helpers/examNames";

const QuestionSchema: Schema = new mongoose.Schema(
  {
    uploaded_by: { type: mongoose.Types.ObjectId, required: true, ref: User },
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
        rating_type: { type: String, default: "helpful" },
        total_rating: { type: Number, default: 0 },
        average_rating: { type: Number, default: 0, min: 0, max: 5 },
      },
      {
        rating_type: { type: String, default: "standard" },
        total_rating: { type: Number, default: 0 },
        average_rating: { type: Number, default: 0, min: 0, max: 5 },
      },
      {
        rating_type: { type: String, default: "relevance" },
        total_rating: { type: Number, default: 0 },
        average_rating: { type: Number, default: 0, min: 0, max: 5 },
      },
    ],
    no_of_downloads: {
      count: { type: Number, default: 0 },
      userIds: [mongoose.Types.ObjectId],
    },
    no_of_views: {
      count: { type: Number, default: 0 },
      userIds: [mongoose.Types.ObjectId],
    },
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
