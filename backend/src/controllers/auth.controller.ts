import { Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "../models/User.js";
import { AuthRequest } from "../middleware/auth.js";

const generateToken = (userId: string, email: string, role: string) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRY || "7d") as string | number
  };
  return jwt.sign(
    { id: userId, email, role },
    (process.env.JWT_SECRET || "secret") as string,
    options
  );
};

const generateRefreshToken = (userId: string) => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRY || "30d") as string | number
  };
  return jwt.sign(
    { id: userId },
    (process.env.JWT_REFRESH_SECRET || "refresh_secret") as string,
    options
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
