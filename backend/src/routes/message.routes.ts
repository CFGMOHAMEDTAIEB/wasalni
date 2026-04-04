import express, { Router } from "express";
import { sendMessage, getMessages, markAsRead } from "../controllers/message.controller.js";
import { authenticate } from "../middleware/auth.js";

const router: Router = express.Router();

router.post("/", authenticate, sendMessage);
router.get("/:conversationId", authenticate, getMessages);
router.put("/:id/read", authenticate, markAsRead);

export default router;
