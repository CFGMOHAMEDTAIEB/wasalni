import { Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { AuthRequest } from "../middleware/auth.js";

const generateToken = (userId: string, email: string, role: string): string => {
  const secret: Secret = process.env.JWT_SECRET || "secret";
  const expiresIn = process.env.JWT_EXPIRY || "7d";
  return jwt.sign(
    { id: userId, email, role },
    secret,
    { expiresIn }
  );
};

const generateRefreshToken = (userId: string): string => {
  const secret: Secret = process.env.JWT_REFRESH_SECRET || "refresh_secret";
  const expiresIn = process.env.JWT_REFRESH_EXPIRY || "30d";
  return jwt.sign(
    { id: userId },
    secret,
    { expiresIn }
  );
};

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, phone, role = "normal" } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      phone,
      role,
      isVerified: false,
      isPremium: false,
      rating: 0,
      totalReviews: 0,
    });

    await user.save();

    const token = generateToken(user._id.toString(), user.email, user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    res.status(201).json({
      message: "User registered successfully",
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.profileImage,
        verified: user.isVerified,
        rating: user.rating,
        reviews: user.totalReviews,
      },
    });
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If role is specified and different, update user role
    if (role && role !== user.role) {
      user.role = role;
      await user.save();
    }

    const token = generateToken(user._id.toString(), user.email, user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    res.json({
      message: "Login successful",
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.profileImage,
        verified: user.isVerified,
        rating: user.rating,
        reviews: user.totalReviews,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    // In a real application, you would invalidate the token
    // For now, just acknowledge the logout
    res.json({ message: "Logout successful" });
  } catch (error: any) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

export const refreshToken = async (req: AuthRequest, res: Response) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || "refresh_secret") as any;
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const newToken = generateToken(user._id.toString(), user.email, user.role);
    const newRefreshToken = generateRefreshToken(user._id.toString());

    res.json({
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error: any) {
    res.status(401).json({ message: "Invalid refresh token", error: error.message });
  }
};

// Generate 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash OTP for storage
const hashOTP = (otp: string): string => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

export const checkEmailExists = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    
    res.json({
      exists: !!user,
      message: user ? "Email already registered" : "Email is available",
    });
  } catch (error: any) {
    res.status(500).json({ message: "Email check failed", error: error.message });
  }
};

export const requestPasswordReset = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Security: don't reveal if email exists
      return res.json({ 
        message: "Si cet email existe, vous recevrez un lien de réinitialisation" 
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save OTP to user
    user.passwordResetToken = hashedOTP;
    user.passwordResetExpires = otpExpiry;
    await user.save();

    // Send email
    const emailService = (await import("../services/email.js")).default;
    await emailService.sendPasswordResetEmail(email, otp, user.name);

    res.json({ 
      message: "Code de réinitialisation envoyé par email",
      // Don't expose OTP in response; frontend just confirms email was sent
    });
  } catch (error: any) {
    console.error("Password reset request error:", error);
    res.status(500).json({ message: "Error processing request", error: error.message });
  }
};

export const resetPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ 
        message: "Email, OTP, and new password are required" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify OTP
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

    if (!user.passwordResetToken || user.passwordResetToken !== hashedOTP) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    // Check expiry
    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      return res.status(400).json({ message: "Code has expired. Request a new one." });
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ 
      message: "Password reset successful. Please login with your new password." 
    });
  } catch (error: any) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};
