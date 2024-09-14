import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File uploaded successfully, log the URL
    console.log("File uploaded on Cloudinary successfully:", response.url);

    // Remove the local file after successful upload
    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.error("Failed to remove local file:", err);
      } else {
        console.log("Local file removed successfully:", localFilePath);
      }
    });

    // Return the response from Cloudinary
    return response;
  } catch (error) {
    // Handle Cloudinary upload error
    console.error("Cloudinary Error:", error);

    // Ensure local file is removed if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlink(localFilePath, (err) => {
        if (err) console.error("Failed to remove local file:", err);
      });
    }

    return null;
  }
};

export { cloudinary, uploadOnCloudinary };
