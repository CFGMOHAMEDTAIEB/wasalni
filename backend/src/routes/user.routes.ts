import express, { Router } from "express";
import {
  getProfile,
  updateProfile,
  upgradeToOwner,
  getAllUsers,
  getUserById,
  rateDriver,
} from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router: Router = express.Router();

// Protected routes
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.post("/upgrade-to-owner", authenticate, upgradeToOwner);
router.post("/:id/rate", authenticate, rateDriver); // Rate a driver after a ride

// Public routes (for search/discovery)
router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;
