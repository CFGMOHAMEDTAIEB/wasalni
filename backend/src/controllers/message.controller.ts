import { Response } from "express";
import Message from "../models/Message.js";
import { AuthRequest } from "../middleware/auth.js";
import { io } from "../server.js";

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { recipientId, content, rideId } = req.body;

    if (!recipientId || !content) {
      return res.status(400).json({
        message: "RecipientId and content are required",
      });
    }

    const message = new Message({
      senderId: req.user?.id,
      recipientId,
      content,
      rideId,
    });

    await message.save();

    // Emit real-time message via Socket.io
    io.to(recipientId).emit("new_message", {
      id: message._id,
      senderId: req.user?.id,
      content,
      timestamp: message.createdAt,
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: {
        id: message._id,
        senderId: message.senderId,
        recipientId: message.recipientId,
        content: message.content,
        timestamp: message.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      $or: [
        { senderId: req.user?.id, recipientId: conversationId },
        { senderId: conversationId, recipientId: req.user?.id },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate("senderId", "name profileImage");

    res.json({
      messages: messages.map((msg) => ({
        id: msg._id,
        sender: {
          id: (msg.senderId as any)._id,
          name: (msg.senderId as any).name,
          image: (msg.senderId as any).profileImage,
        },
        content: msg.content,
        isRead: msg.isRead,
        timestamp: msg.createdAt,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.json({
      message: "Message marked as read",
      data: {
        id: message?._id,
        isRead: message?.isRead,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error marking message as read", error: error.message });
  }
};
