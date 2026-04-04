import { Response } from "express";
import Booking from "../models/Booking.js";
import Ride from "../models/Ride.js";
import Notification from "../models/Notification.js";
import { AuthRequest } from "../middleware/auth.js";
import { io } from "../server.js";

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { rideId, seatsBooked } = req.body;

    if (!rideId || !seatsBooked) {
      return res.status(400).json({
        message: "RideId and seatsBooked are required",
      });
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.seatsAvailable < seatsBooked) {
      return res.status(400).json({
        message: `Only ${ride.seatsAvailable} seats available`,
      });
    }

    const totalPrice = ride.pricePerSeat * seatsBooked;

    const booking = new Booking({
      rideId,
      passengerId: req.user?.id,
      driverId: ride.ownerId,
      seatsBooked,
      totalPrice,
      status: "pending",
      paymentStatus: "pending",
    });

    await booking.save();

    // Notify driver
    const notification = new Notification({
      userId: ride.ownerId,
      type: "booking_request",
      title: "New Booking Request",
      message: `${seatsBooked} seat(s) requested for your ride`,
      data: {
        rideId: rideId.toString(),
        bookingId: booking._id.toString(),
      },
    });

    await notification.save();

    // Emit real-time notification via Socket.io
    io.to(ride.ownerId.toString()).emit("new_booking_request", {
      bookingId: booking._id,
      rideSummary: {
        from: ride.origin,
        to: ride.destination,
        seats: seatsBooked,
        price: totalPrice,
      },
    });

    res.status(201).json({
      message: "Booking request sent",
      booking: {
        id: booking._id,
        rideId: booking.rideId,
        seatsBooked: booking.seatsBooked,
        totalPrice: booking.totalPrice,
        status: booking.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};

export const getBookingRequests = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({
      driverId: req.user?.id,
      status: "pending",
    })
      .populate("rideId", "origin destination date departureTime")
      .populate("passengerId", "name profileImage rating");

    res.json({
      bookings: bookings.map((booking) => ({
        id: booking._id,
        passenger: {
          id: (booking.passengerId as any)._id,
          name: (booking.passengerId as any).name,
          image: (booking.passengerId as any).profileImage,
          rating: (booking.passengerId as any).rating,
        },
        ride: {
          id: (booking.rideId as any)._id,
          from: (booking.rideId as any).origin,
          to: (booking.rideId as any).destination,
          date: (booking.rideId as any).date,
          time: (booking.rideId as any).departureTime,
        },
        seatsBooked: booking.seatsBooked,
        totalPrice: booking.totalPrice,
        status: booking.status,
        createdAt: booking.createdAt,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching booking requests", error: error.message });
  }
};

export const respondToBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body; // "accepted" or "rejected"

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: 'Status must be "accepted" or "rejected"',
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check ownership
    if (booking.driverId.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    booking.status = status;
    booking.paymentStatus = status === "accepted" ? "completed" : "pending";

    await booking.save();

    if (status === "accepted") {
      // Update ride seats
      const ride = await Ride.findById(booking.rideId);
      if (ride) {
        ride.seatsAvailable -= booking.seatsBooked;
        ride.bookedBy.push(booking.passengerId);
        await ride.save();
      }

      // Notify passenger
      const notification = new Notification({
        userId: booking.passengerId,
        type: "booking_accepted",
        title: "Booking Accepted",
        message: "Your booking request has been accepted",
        data: {
          bookingId: booking._id.toString(),
        },
      });

      await notification.save();

      // Emit real-time notification
      io.to(booking.passengerId.toString()).emit("booking_accepted", {
        bookingId: booking._id,
      });
    } else {
      // Notify passenger of rejection
      const notification = new Notification({
        userId: booking.passengerId,
        type: "booking_rejected",
        title: "Booking Rejected",
        message: "Your booking request has been rejected",
        data: {
          bookingId: booking._id.toString(),
        },
      });

      await notification.save();

      // Emit real-time notification
      io.to(booking.passengerId.toString()).emit("booking_rejected", {
        bookingId: booking._id,
      });
    }

    res.json({
      message: `Booking ${status} successfully`,
      booking: {
        id: booking._id,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error responding to booking", error: error.message });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({
      passengerId: req.user?.id,
    })
      .populate("rideId", "origin destination date departureTime")
      .populate("driverId", "name profileImage rating");

    res.json({
      bookings: bookings.map((booking) => ({
        id: booking._id,
        driver: {
          id: (booking.driverId as any)._id,
          name: (booking.driverId as any).name,
          image: (booking.driverId as any).profileImage,
          rating: (booking.driverId as any).rating,
        },
        ride: {
          id: (booking.rideId as any)._id,
          from: (booking.rideId as any).origin,
          to: (booking.rideId as any).destination,
          date: (booking.rideId as any).date,
          time: (booking.rideId as any).departureTime,
        },
        seatsBooked: booking.seatsBooked,
        totalPrice: booking.totalPrice,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

export const getBookingDetails = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("rideId")
      .populate("driverId", "name profileImage rating phone")
      .populate("passengerId", "name profileImage");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      booking: {
        id: booking._id,
        rideDetails: booking.rideId,
        driver: {
          id: (booking.driverId as any)._id,
          name: (booking.driverId as any).name,
          image: (booking.driverId as any).profileImage,
          rating: (booking.driverId as any).rating,
          phone: (booking.driverId as any).phone,
        },
        passenger: {
          id: (booking.passengerId as any)._id,
          name: (booking.passengerId as any).name,
          image: (booking.passengerId as any).profileImage,
        },
        seatsBooked: booking.seatsBooked,
        totalPrice: booking.totalPrice,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching booking details", error: error.message });
  }
};
