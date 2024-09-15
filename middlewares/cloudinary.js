import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises"; // Using fs/promises for async/await support
import dotenv from "dotenv"
dotenv.config({});

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
});


// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Log the secure URL from Cloudinary
    console.log("File uploaded on Cloudinary successfully:", response.secure_url);

    // Remove the local file after successful upload
    await fs.unlink(localFilePath);
    console.log("Local file removed successfully:", localFilePath);

    // Return the response from Cloudinary
    return response;
  } catch (error) {
    // Handle Cloudinary upload error
    console.error("Cloudinary Error:", error);

    // Ensure local file is removed if upload fails
    try {
      if (await fs.stat(localFilePath)) {
        await fs.unlink(localFilePath);
        console.log("Local file removed successfully after error:", localFilePath);
      }
    } catch (err) {
      console.error("Failed to remove local file after upload error:", err);
    }

    return null;
  }
};

export default uploadOnCloudinary;
