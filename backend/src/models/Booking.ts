import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  rideId: mongoose.Types.ObjectId;
  passengerId: mongoose.Types.ObjectId;
  driverId: mongoose.Types.ObjectId;
  seatsBooked: number;
  totalPrice: number;
  // Passenger preferences
  preferredSeat?: 'front' | 'back-left' | 'back-right' | 'back-middle';
  luggageItems?: number; // 0-5
  luggageDimension?: 'small' | 'medium' | 'large' | 'oversized';
  specialLuggageRequest?: boolean;
  passengeSmokePreference?: 'no' | 'yes' | 'outside';
  // Feature 5: Payment method
  paymentMethod?: 'cash' | 'wallet';
  // Feature 4: Mutual rating system
  ratings?: Array<{
    by: 'driver' | 'passenger';
    stars: number;
    comment?: string;
    createdAt: Date;
  }>;
  // Feature 8: Eco-impact
  co2Saved?: number; // grams of CO2 saved
  status: "pending" | "accepted" | "rejected" | "cancelled" | "completed";
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  rating?: number;
  review?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    rideId: { type: Schema.Types.ObjectId, ref: "Ride", required: true },
    passengerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seatsBooked: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    // Passenger comfort preferences
    preferredSeat: {
      type: String,
      enum: ['front', 'back-left', 'back-right', 'back-middle'],
    },
    luggageItems: { type: Number, min: 0, max: 5 },
    luggageDimension: {
      type: String,
      enum: ['small', 'medium', 'large', 'oversized'],
    },
    specialLuggageRequest: { type: Boolean, default: false },
    passengeSmokePreference: {
      type: String,
      enum: ['no', 'yes', 'outside'],
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'wallet'],
    },
    ratings: [{
      by: {
        type: String,
        enum: ['driver', 'passenger'],
      },
      stars: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: { type: Date, default: Date.now },
    }],
    co2Saved: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    rating: { type: Number, min: 1, max: 5 },
    review: String,
  },
  { timestamps: true }
);

BookingSchema.index({ rideId: 1 });
BookingSchema.index({ passengerId: 1 });
BookingSchema.index({ driverId: 1 });
BookingSchema.index({ status: 1, 'ratings.by': 1 }); // For finding unrated bookings
BookingSchema.index({ paymentMethod: 1 });

export default mongoose.model<IBooking>("Booking", BookingSchema);
