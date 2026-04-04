import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../services/cloudinary.js";
import User from "../models/User.js";

export const uploadProfileImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    // Delete old image if exists
    const user = await User.findById(req.user?.id);
    if (user?.profileImage) {
      try {
        const publicId = user.profileImage.split("/").pop()?.split(".")[0];
        if (publicId) {
          await deleteFromCloudinary(`wasalni/${publicId}`);
        }
      } catch (error) {
        console.error("Error deleting old image:", error);
      }
    }

    // Upload new image
    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname, "wasalni/profiles");

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      { profileImage: result.url },
      { new: true }
    );

    res.json({
      message: "Profile image uploaded successfully",
      imageUrl: result.url,
      user: {
        id: updatedUser?._id,
        profileImage: updatedUser?.profileImage,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
};

export const uploadVehicleImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    // Upload vehicle image
    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname, "wasalni/vehicles");

    // Update user vehicle details
    const user = await User.findById(req.user?.id);
    if (!user?.vehicleDetails) {
      return res.status(400).json({ message: "Vehicle details not found. Please upgrade to owner first." });
    }

    user.vehicleDetails.image = result.url;
    await user.save();

    res.json({
      message: "Vehicle image uploaded successfully",
      imageUrl: result.url,
      vehicleDetails: user.vehicleDetails,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
};
