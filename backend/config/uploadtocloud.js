import cloudinary from "./cloudinary.js";
const uploadToCloud = async (file, folder) => {
  try {
    console.log(file);
    console.log(folder);
    
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
    });
    console.log(result.secure_url);
    
    return result.secure_url;
  } catch (error) {
    throw new Error("Failed to upload file to cloud");
  }
}
export default uploadToCloud;