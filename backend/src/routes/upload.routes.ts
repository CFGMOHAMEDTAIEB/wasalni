import express, { Router } from "express";
import { uploadProfileImage, uploadVehicleImage } from "../controllers/upload.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { uploadSingle } from "../middleware/upload.js";

const router: Router = express.Router();

// Upload profile image
router.post("/profile-image", authenticate, uploadSingle, uploadProfileImage);

// Upload vehicle image (owner only)
router.post("/vehicle-image", authenticate, authorize("owner"), uploadSingle, uploadVehicleImage);

export default router;
