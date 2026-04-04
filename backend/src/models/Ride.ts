import mongoose, { Schema, Document } from "mongoose";

export interface IRide extends Document {
  ownerId: mongoose.Types.ObjectId;
  origin: string;
  originCoordinates?: {
    latitude: number;
    longitude: number;
  };
  destination: string;
  destinationCoordinates?: {
    latitude: number;
    longitude: number;
  };
  date: Date;
  departureTime: string;
  totalSeats: number;
  seatsAvailable: number;
  pricePerSeat: number;
  vehicleType: string;
  vehicleDetails: {
    make: string;
    model: string;
    licensePlate: string;
    color: string;
  };
  description?: string;
  amenities: string[];
  status: "active" | "completed" | "cancelled";
  isFeatured: boolean;
  bookedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const RideSchema = new Schema<IRide>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    origin: { type: String, required: true },
    originCoordinates: {
      latitude: Number,
      longitude: Number,
    },
    destination: { type: String, required: true },
    destinationCoordinates: {
      latitude: Number,
      longitude: Number,
    },
    date: { type: Date, required: true },
    departureTime: { type: String, required: true },
    totalSeats: { type: Number, required: true, min: 1, max: 8 },
    seatsAvailable: { type: Number, required: true },
    pricePerSeat: { type: Number, required: true, min: 0 },
    vehicleType: { type: String, required: true },
    vehicleDetails: {
      make: String,
      model: String,
      licensePlate: String,
      color: String,
    },
    description: String,
    amenities: [String],
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    isFeatured: { type: Boolean, default: false },
    bookedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Index for efficient searching
RideSchema.index({ date: 1, status: 1 });
RideSchema.index({ ownerId: 1 });

export default mongoose.model<IRide>("Ride", RideSchema);
