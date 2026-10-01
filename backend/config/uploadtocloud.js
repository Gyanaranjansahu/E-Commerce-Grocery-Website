import cloudinary from "./cloudinary.js";

const uploadToCloud = async (file, folder = "general") => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message || error);
    throw new Error(`Failed to upload asset to cloud: ${error.message || "Unknown Cloudinary Error"}`);
  }
};

export default uploadToCloud;