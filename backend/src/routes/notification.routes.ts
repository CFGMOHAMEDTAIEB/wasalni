import express, { Router } from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.js";

const router: Router = express.Router();

router.get("/", authenticate, getNotifications);
router.put("/:id/read", authenticate, markAsRead);
router.put("/mark-all/read", authenticate, markAllAsRead);
router.delete("/:id", authenticate, deleteNotification);

export default router;
