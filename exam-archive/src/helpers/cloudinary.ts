import {
  ALLOWED_FILE_FORMATS,
  TRANSFORMED_FORMAT,
} from "@/constants/constants";
import { ApiRoutes } from "@/constants/route";
import { ERROR_CODES } from "@/constants/statuscode";
import { v2 as cloudinary } from "cloudinary";

(function () {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: process.env.NODE_ENV === "production",
  });

  const doPresetExists = cloudinary.api.upload_preset(
    process.env.CLOUDINARY_PRESET
  );

  doPresetExists.catch((error: any) => {
    if (error.error.http_code === ERROR_CODES["NOT FOUND"]) {
      cloudinary.api.create_upload_preset({
        name: process.env.CLOUDINARY_PRESET,
        folder: process.env.CLOUDINARY_FOLDER,
        allowed_formats: ALLOWED_FILE_FORMATS.join(", "),
        unsigned: true,
        format: TRANSFORMED_FORMAT,
        async: true,
        notification_url: `${process.env.PRODUCTION_URL}${ApiRoutes.uploadNotification}`,
      });
      console.log("New upload preset created");
    } else console.error(error);
  });
})();

export const uploadToCloudinary = (dataURI: string, filename: string) =>
  cloudinary.uploader.upload(dataURI, {
    upload_preset: process.env.CLOUDINARY_PRESET,
    public_id: filename,
    resource_type: "auto",
  });
