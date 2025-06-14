import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        // console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const getPublicIdFromUrl = (url) => {
  try {
    const parts = url.split("/");
    const fileWithExt = parts.pop(); // e.g., "user123.jpg"
    const version = parts.pop(); // e.g., "v1680000000"
    const folder = parts.slice(parts.indexOf("upload") + 1).join("/"); // e.g., "avatars"
    const fileName = fileWithExt.split(".")[0]; // "user123"
    return `${folder}${fileName}`;
  } catch (error) {
    console.error("Failed to extract public_id:", error);
    return null;
  }
};


const deleteCloudinary = async (urlOrPublicId) => {
  try {
    let publicId = urlOrPublicId;
    if (urlOrPublicId.startsWith("http")) {
      publicId = getPublicIdFromUrl(urlOrPublicId);
    }
    if (!publicId) return;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image"
    });
    console.log("Deleted:", result);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
};
const deleteCloudinaryVideo = async (urlOrPublicId) => {
  try {
    let publicId = urlOrPublicId;
    if (urlOrPublicId.startsWith("http")) {
      publicId = getPublicIdFromUrl(urlOrPublicId);
    }
    if (!publicId) return;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video"
    });
    console.log("Deleted:", result);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
};




export {uploadOnCloudinary,deleteCloudinary, deleteCloudinaryVideo}