import { Response } from "express";
import Ride from "../models/Ride.js";
import User from "../models/User.js";
import { AuthRequest } from "../middleware/auth.js";

export const createRide = async (req: AuthRequest, res: Response) => {
  try {
    const {
      origin,
      originCoordinates,
      destination,
      destinationCoordinates,
      date,
      departureTime,
      totalSeats,
      pricePerSeat,
      vehicleType,
      vehicleDetails,
      description,
      amenities,
      isFeatured,
    } = req.body;

    // Validation
    if (!origin || !destination || !date || !departureTime || !totalSeats || !pricePerSeat) {
      return res.status(400).json({
        message: "Origin, destination, date, departureTime, totalSeats, and pricePerSeat are required",
      });
    }

    const ride = new Ride({
      ownerId: req.user?.id,
      origin,
      originCoordinates,
      destination,
      destinationCoordinates,
      date,
      departureTime,
      totalSeats,
      seatsAvailable: totalSeats,
      pricePerSeat,
      vehicleType,
      vehicleDetails,
      description,
      amenities,
      isFeatured: isFeatured || false,
    });

    await ride.save();

    // If featured, add fee to user earnings (deduct from account or handle via payment)
    if (isFeatured) {
      const featuredFee = parseFloat(process.env.FEATURED_RIDE_FEE || "5");
      // In production, handle payment processing here
    }

    res.status(201).json({
      message: "Ride created successfully",
      ride: {
        id: ride._id,
        origin: ride.origin,
        destination: ride.destination,
        date: ride.date,
        departureTime: ride.departureTime,
        seatsAvailable: ride.seatsAvailable,
        pricePerSeat: ride.pricePerSeat,
        isFeatured: ride.isFeatured,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating ride", error: error.message });
  }
};

export const getAllRides = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const rides = await Ride.find({ status: "active" })
      .populate("ownerId", "name profileImage rating totalReviews vehicleDetails")
      .sort({ date: 1 })
      .limit(limit)
      .skip(skip);

    const total = await Ride.countDocuments({ status: "active" });

    res.json({
      rides: rides.map((ride) => ({
        id: ride._id,
        from: ride.origin,
        to: ride.destination,
        date: ride.date,
        time: ride.departureTime,
        driver: {
          id: (ride.ownerId as any)._id,
          name: (ride.ownerId as any).name,
          image: (ride.ownerId as any).profileImage,
          rating: (ride.ownerId as any).rating,
          reviews: (ride.ownerId as any).totalReviews,
        },
        totalSeats: ride.totalSeats,
        seatsAvailable: ride.seatsAvailable,
        price: ride.pricePerSeat,
        status: ride.status,
        isFeatured: ride.isFeatured,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching rides", error: error.message });
  }
};

export const getRideById = async (req: AuthRequest, res: Response) => {
  try {
    const ride = await Ride.findById(req.params.id).populate(
      "ownerId",
      "name profileImage rating totalReviews vehicleDetails phone"
    );

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.json({
      ride: {
        id: ride._id,
        from: ride.origin,
        to: ride.destination,
        date: ride.date,
        time: ride.departureTime,
        driver: {
          id: (ride.ownerId as any)._id,
          name: (ride.ownerId as any).name,
          image: (ride.ownerId as any).profileImage,
          rating: (ride.ownerId as any).rating,
          reviews: (ride.ownerId as any).totalReviews,
          phone: (ride.ownerId as any).phone,
          vehicle: (ride.ownerId as any).vehicleDetails,
        },
        totalSeats: ride.totalSeats,
        seatsAvailable: ride.seatsAvailable,
        price: ride.pricePerSeat,
        description: ride.description,
        amenities: ride.amenities,
        vehicleDetails: ride.vehicleDetails,
        status: ride.status,
        isFeatured: ride.isFeatured,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching ride", error: error.message });
  }
};

export const updateRide = async (req: AuthRequest, res: Response) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check ownership
    if (ride.ownerId.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updateData = req.body;
    Object.assign(ride, updateData);
    await ride.save();

    res.json({
      message: "Ride updated successfully",
      ride: {
        id: ride._id,
        origin: ride.origin,
        destination: ride.destination,
        date: ride.date,
        departureTime: ride.departureTime,
        seatsAvailable: ride.seatsAvailable,
        pricePerSeat: ride.pricePerSeat,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating ride", error: error.message });
  }
};

export const deleteRide = async (req: AuthRequest, res: Response) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check ownership
    if (ride.ownerId.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    ride.status = "cancelled";
    await ride.save();

    res.json({ message: "Ride cancelled successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting ride", error: error.message });
  }
};

export const searchRides = async (req: AuthRequest, res: Response) => {
  try {
    const { origin, destination, date } = req.query;

    const query: any = { status: "active" };

    if (origin) {
      query.origin = { $regex: origin, $options: "i" };
    }

    if (destination) {
      query.destination = { $regex: destination, $options: "i" };
    }

    if (date) {
      const searchDate = new Date(date as string);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);

      query.date = { $gte: searchDate, $lt: nextDay };
    }

    const rides = await Ride.find(query)
      .populate("ownerId", "name profileImage rating totalReviews")
      .sort({ date: 1 });

    res.json({
      rides: rides.map((ride) => ({
        id: ride._id,
        from: ride.origin,
        to: ride.destination,
        date: ride.date,
        time: ride.departureTime,
        driver: {
          id: (ride.ownerId as any)._id,
          name: (ride.ownerId as any).name,
          image: (ride.ownerId as any).profileImage,
          rating: (ride.ownerId as any).rating,
        },
        seatsAvailable: ride.seatsAvailable,
        price: ride.pricePerSeat,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error searching rides", error: error.message });
  }
};
