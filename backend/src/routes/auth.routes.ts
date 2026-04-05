import express, { Router } from "express";
import { 
  register, 
  login, 
  logout, 
  refreshToken,
  checkEmailExists,
  requestPasswordReset,
  resetPassword 
} from "../controllers/auth.controller.js";

const router: Router = express.Router();

// Existing routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

// New password reset & verification routes
router.post("/check-email", checkEmailExists);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
