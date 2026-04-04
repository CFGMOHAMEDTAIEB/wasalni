import express, { Router } from "express";
import {
  createRide,
  getAllRides,
  getRideById,
  updateRide,
  deleteRide,
  searchRides,
} from "../controllers/ride.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router: Router = express.Router();

// Public routes
router.get("/", getAllRides);
router.get("/search", searchRides);
router.get("/:id", getRideById);

// Protected routes (owner only)
router.post("/", authenticate, authorize("owner"), createRide);
router.put("/:id", authenticate, authorize("owner"), updateRide);
router.delete("/:id", authenticate, authorize("owner"), deleteRide);

export default router;
