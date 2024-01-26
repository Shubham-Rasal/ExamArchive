import { IRating } from "@/actions/filePreview/data/UPDATE/updateRatings";
import { RATING_TYPE } from "@/constants/constants";

export const isRatingArrayValid = (ratingArray: number[]): boolean => {
  if (ratingArray.length !== 3) return false;
  return ratingArray.every((rating) => rating >= 0 && rating <= 5);
};

export const getRatingArrayValues = (ratingArray: IRating[]) => {
  const ratingArrayValues = ratingArray.map(({ value }) => value);

  const [helpfulRating, standardRating, relevanceRating] = Object.values(
    RATING_TYPE
  ).map(
    (type) => ratingArray.find((rating) => rating.type === type)?.value || 0
  );

  return { ratingArrayValues, helpfulRating, standardRating, relevanceRating };
};

export const calculateRating = ({
  totalRating,
  avgRating,
  newRating,
}: {
  totalRating: number;
  avgRating: number;
  newRating: number;
}) => {
  if (totalRating < 0 || avgRating < 0 || newRating < 0) return avgRating;
  return (avgRating * totalRating + newRating) / (totalRating + newRating);
};