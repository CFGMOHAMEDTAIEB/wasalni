import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: "booking_request" | "booking_accepted" | "booking_rejected" | "message" | "earnings" | "ride_completed";
  title: string;
  message: string;
  data?: {
    rideId?: string;
    bookingId?: string;
    userId?: string;
  };
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["booking_request", "booking_accepted", "booking_rejected", "message", "earnings", "ride_completed"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: {
      rideId: String,
      bookingId: String,
      userId: String,
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1 });
NotificationSchema.index({ isRead: 1 });

export default mongoose.model<INotification>("Notification", NotificationSchema);
