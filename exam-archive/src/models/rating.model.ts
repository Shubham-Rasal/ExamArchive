import { RATING_TYPE } from "@/constants/constants";
import mongoose, { Schema } from "mongoose";
import Question from "./question.model";
import User from "./user.model";

const RatingSchema: Schema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
      ref: Question,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
      ref: User,
    },
    rating: {
      type: [Number],
      validate: {
        validator: function (ratingArray: number[]) {
          const isPositive = ratingArray.every((rating) => rating >= 0);
          return ratingArray.length === 3 && isPositive;
        },
      },
      required: true,
    },
  },
  { strict: true, timestamps: true }
);

const Rating = mongoose.models.rating || mongoose.model("rating", RatingSchema);

export default Rating;
