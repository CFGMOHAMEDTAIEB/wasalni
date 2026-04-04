import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResponse {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

/**
 * Upload file to Cloudinary from buffer
 */
export const uploadToCloudinary = async (
  buffer: Buffer,
  filename: string,
  folder: string = "wasalni"
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        public_id: filename.split(".")[0],
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          resolve({
            url: result!.secure_url,
            publicId: result!.public_id,
            width: result!.width,
            height: result!.height,
          });
        }
      }
    );

    // Convert buffer to stream
    Readable.from(buffer).pipe(stream);
  });
};

/**
 * Delete file from Cloudinary
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error: any) {
    console.error(`Failed to delete ${publicId}:`, error.message);
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

/**
 * Generate optimized image URL with transformations
 */
export const getOptimizedImageUrl = (
  publicId: string,
  width: number = 400,
  height: number = 400
): string => {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: "fill",
    quality: "auto",
    fetch_format: "auto",
  });
};
