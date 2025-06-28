import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if(!localFilePath) return null;

    // Upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image"
    });

    // File has been uploaded successfully
    fs.unlinkSync(localFilePath); // Delete the file from storage

    console.log("Cloudinary upload successful:", response.secure_url);
    return response;
  } catch (error) {
    // Remove the locally saved temporary file as the upload operation failed
    console.error("❌ Cloudinary upload failed:", error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

// Deleting using url
const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) {
      throw new Error("Image URL is required for deletion from cloudinary");
    }

    // Extract public_id from URL
    // Cloudinary URLs typically look like:
    // https://res.cloudinary.com/[cloud_name]/image/upload/v1234567890/folder/public_id.jpg
    const splitUrl = imageUrl.split('/');
    const publicIdWithExtension = splitUrl[splitUrl.length - 1];

    // Remove the file extension and get just the public_id
    const publicId = publicIdWithExtension.split('.')[0];

    // Handle URLs that might contain transformation parameters
    const cleanPublicId = publicId.split('?')[0];

    const response = await cloudinary.uploader.destroy(cleanPublicId, {
      resource_type: "image",
    });

    if (response.result === "ok" || response.result === "not found") {
      return response;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Error deleting file from Cloudinary: " + error.message);
  }
};

export {
  uploadOnCloudinary,
  deleteFromCloudinary,
};
