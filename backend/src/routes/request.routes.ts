import express, { Router } from "express";
import {
  createBooking,
  getBookingRequests,
  respondToBooking,
  getMyBookings,
  getBookingDetails,
} from "../controllers/booking.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router: Router = express.Router();

// Passenger routes
router.post("/", authenticate, createBooking);
router.get("/my-bookings", authenticate, getMyBookings);
router.get("/:id", authenticate, getBookingDetails);

// Owner routes
router.get("/requests", authenticate, authorize("owner"), getBookingRequests);
router.put("/:id/respond", authenticate, authorize("owner"), respondToBooking);

export default router;
