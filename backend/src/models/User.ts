import mongoose, { Schema, Document } from "mongoose";
import bcryptjs from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "guest" | "normal" | "owner";
  profileImage?: string;
  address?: string;
  city?: string;
  country?: string;
  isVerified: boolean;
  isPremium: boolean;
  commissionRate: number;
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
  // Authentication fields
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  // Owner specific fields
  vehicleDetails?: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    image: string;
  };
  bankDetails?: {
    accountHolder: string;
    accountNumber: string;
    bankCode: string;
  };
  totalEarnings: number;
  totalCommissionPaid: number;
  completedRides: number;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ["guest", "normal", "owner"],
      default: "normal",
    },
    profileImage: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    isVerified: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    commissionRate: { type: Number, default: 0.1 }, // 10% by default, 5% if verified/premium
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    lastLogin: { type: Date },
    vehicleDetails: {
      make: String,
      model: String,
      year: Number,
      licensePlate: String,
      image: String,
    },
    bankDetails: {
      accountHolder: String,
      accountNumber: String,
      bankCode: String,
    },
    totalEarnings: { type: Number, default: 0 },
    totalCommissionPaid: { type: Number, default: 0 },
    completedRides: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcryptjs.genSalt(parseInt(process.env.BCRYPT_ROUNDS || "10"));
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Index for efficient searching
UserSchema.index({ email: 1 });
UserSchema.index({ emailVerificationToken: 1 });
UserSchema.index({ passwordResetToken: 1 });

// Compare password method
UserSchema.methods.comparePassword = async function (password: string) {
  return bcryptjs.compare(password, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
