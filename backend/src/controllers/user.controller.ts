import { Response } from "express";
import User from "../models/User.js";
import { AuthRequest } from "../middleware/auth.js";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.profileImage,
        address: user.address,
        city: user.city,
        country: user.country,
        verified: user.isVerified,
        premium: user.isPremium,
        rating: user.rating,
        reviews: user.totalReviews,
        vehicleDetails: user.vehicleDetails,
        totalEarnings: user.totalEarnings,
        completedRides: user.completedRides,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, address, city, country, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      {
        name,
        phone,
        address,
        city,
        country,
        profileImage,
      },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user?._id,
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        role: user?.role,
        avatar: user?.profileImage,
        address: user?.address,
        city: user?.city,
        country: user?.country,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

export const upgradeToOwner = async (req: AuthRequest, res: Response) => {
  try {
    const { vehicleDetails, bankDetails } = req.body;

    if (!vehicleDetails || !vehicleDetails.make || !vehicleDetails.licensePlate) {
      return res.status(400).json({
        message: "Vehicle details (make, licensePlate) are required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      {
        role: "owner",
        vehicleDetails,
        bankDetails,
      },
      { new: true }
    ).select("-password");

    res.json({
      message: "Successfully upgraded to owner",
      user: {
        id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        vehicleDetails: user?.vehicleDetails,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error upgrading to owner", error: error.message });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ role: "owner" })
      .select("-password -bankDetails")
      .limit(limit)
      .skip(skip);

    const total = await User.countDocuments({ role: "owner" });

    res.json({
      users: users.map((user) => ({
        id: user._id,
        name: user.name,
        profileImage: user.profileImage,
        rating: user.rating,
        totalReviews: user.totalReviews,
        completedRides: user.completedRides,
        vehicleDetails: user.vehicleDetails,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password -bankDetails");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        rating: user.rating,
        totalReviews: user.totalReviews,
        completedRides: user.completedRides,
        vehicleDetails: user.vehicleDetails,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

// Rate a driver after a completed ride
export const rateDriver = async (req: AuthRequest, res: Response) => {
  try {
    const { stars, comment, rideId } = req.body;
    const driverId = req.params.id;

    // Validation
    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Rating stars must be between 1 and 5" });
    }

    if (!driverId) {
      return res.status(400).json({ message: "Driver ID is required" });
    }

    const driver = await User.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Calculate new average rating
    const currentTotal = driver.rating * driver.totalReviews;
    const newTotal = currentTotal + stars;
    const newReviewCount = driver.totalReviews + 1;
    const newAverageRating = newTotal / newReviewCount;

    // Update driver's rating
    driver.rating = Math.round(newAverageRating * 10) / 10; // Round to 1 decimal
    driver.totalReviews = newReviewCount;
    await driver.save();

    res.json({
      message: "Rating submitted successfully",
      rating: {
        driverId: driver._id,
        stars,
        comment,
        averageRating: driver.rating,
        totalReviews: driver.totalReviews,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error submitting rating", error: error.message });
  }
};
