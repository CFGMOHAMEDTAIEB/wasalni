import mongoose, { Schema, Document } from "mongoose";

export interface ISafetyAlert extends Document {
  userId: mongoose.Types.ObjectId;
  rideId: mongoose.Types.ObjectId;
  type: 'uncomfortable' | 'emergency';
  timestamp: Date;
  location?: {
    lat: number;
    lng: number;
  };
  message?: string;
  resolved: boolean;
  resolvedAt?: Date;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SafetyAlertSchema = new Schema<ISafetyAlert>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rideId: { type: Schema.Types.ObjectId, ref: "Ride", required: true },
    type: {
      type: String,
      enum: ['uncomfortable', 'emergency'],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
    location: {
      lat: Number,
      lng: Number,
    },
    message: String,
    resolved: { type: Boolean, default: false },
    resolvedAt: Date,
    adminNotes: String,
  },
  { timestamps: true }
);

// Indexes for admin dashboard
SafetyAlertSchema.index({ resolved: 1, createdAt: -1 });
SafetyAlertSchema.index({ userId: 1 });
SafetyAlertSchema.index({ rideId: 1 });

export default mongoose.model<ISafetyAlert>("SafetyAlert", SafetyAlertSchema);
