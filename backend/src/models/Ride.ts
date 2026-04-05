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
  meetingPoint?: string; // "Lieu de rendez-vous"
  totalSeats: number;
  seatsAvailable: number;
  pricePerSeat?: number; // Keep for backward compatibility
  priceMode: 'free' | 'negotiable' | 'fixed'; // Price mode selector
  priceAmount?: number; // Used when priceMode is 'fixed'
  vehicleType: string;
  vehicleDetails: {
    make: string;
    model: string;
    licensePlate: string;
    color: string;
  };
  description?: string;
  amenities: string[];
  // Passenger comfort options (driver preferences)
  allowSmoking?: 'no' | 'yes' | 'outside';
  preferredSeats?: ('front' | 'back-left' | 'back-right' | 'back-middle')[];
  maxLuggageItems?: number; // 0-5
  maxLuggageDimension?: 'small' | 'medium' | 'large' | 'oversized';
  // Feature 1: Immediate mode (last-minute rides)
  immediateMode?: boolean;
  // Feature 2: Women-only rides
  womenOnly?: boolean;
  // Feature 10: Recurring rides
  isRecurring?: boolean;
  recurringDays?: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  recurringUntil?: Date;
  recurringGroupId?: string; // Links all instances of a recurring ride
  // Payment methods accepted by driver
  paymentMethods?: ('cash' | 'wallet')[];
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
    meetingPoint: { type: String }, // New field for pickup location
    totalSeats: { type: Number, required: true, min: 1, max: 8 },
    seatsAvailable: { type: Number, required: true },
    pricePerSeat: { type: Number, min: 0 },
    priceMode: {
      type: String,
      enum: ['free', 'negotiable', 'fixed'],
      default: 'fixed',
    },
    priceAmount: { type: Number, min: 0 }, // Used when priceMode is 'fixed'
    vehicleType: { type: String, required: true },
    vehicleDetails: {
      make: String,
      model: String,
      licensePlate: String,
      color: String,
    },
    description: String,
    amenities: [String],
    // Passenger comfort options
    allowSmoking: {
      type: String,
      enum: ['no', 'yes', 'outside'],
      default: 'no',
    },
    preferredSeats: [{
      type: String,
      enum: ['front', 'back-left', 'back-right', 'back-middle'],
    }],
    maxLuggageItems: { type: Number, min: 0, max: 5, default: 2 },
    maxLuggageDimension: {
      type: String,
      enum: ['small', 'medium', 'large', 'oversized'],
      default: 'medium',
    },
    immediateMode: { type: Boolean, default: false },
    womenOnly: { type: Boolean, default: false },
    isRecurring: { type: Boolean, default: false },
    recurringDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    }],
    recurringUntil: { type: Date },
    recurringGroupId: { type: String },
    paymentMethods: [{
      type: String,
      enum: ['cash', 'wallet'],
    }],
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
RideSchema.index({ immediateMode: 1, departureTime: 1 });
RideSchema.index({ womenOnly: 1 });
RideSchema.index({ recurringGroupId: 1 });
RideSchema.index({ ownerId: 1 });
RideSchema.index({ priceMode: 1 }); // For price filtering

export default mongoose.model<IRide>("Ride", RideSchema);
