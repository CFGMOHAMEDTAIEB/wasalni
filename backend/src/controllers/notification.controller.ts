import { Response } from "express";
import Notification from "../models/Notification.js";
import { AuthRequest } from "../middleware/auth.js";

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({
      userId: req.user?.id,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Notification.countDocuments({
      userId: req.user?.id,
    });

    const unread = await Notification.countDocuments({
      userId: req.user?.id,
      isRead: false,
    });

    res.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        unread,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error marking notification as read", error: error.message });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany(
      { userId: req.user?.id, isRead: false },
      { isRead: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error: any) {
    res.status(500).json({ message: "Error marking all as read", error: error.message });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);

    res.json({ message: "Notification deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting notification", error: error.message });
  }
};
