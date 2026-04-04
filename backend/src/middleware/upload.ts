import multer, { StorageEngine } from "multer";
import { Request } from "express";
import path from "path";

// Memory storage for Multer (will send to Cloudinary)
const storage: StorageEngine = multer.memoryStorage();

// File filter
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Export upload middleware for single file
export const uploadSingle = upload.single("file");
export const uploadMultiple = upload.array("files", 5); // Max 5 files
