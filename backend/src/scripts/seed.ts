import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Ride from "../models/Ride.js";
import Booking from "../models/Booking.js";
import Message from "../models/Message.js";
import Notification from "../models/Notification.js";

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/wasalni";
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected for seeding");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Clear all collections
const clearCollections = async () => {
  try {
    await User.deleteMany({});
    await Ride.deleteMany({});
    await Booking.deleteMany({});
    await Message.deleteMany({});
    await Notification.deleteMany({});
    console.log("🧹 Collections cleared");
  } catch (error) {
    console.error("❌ Error clearing collections:", error);
  }
};

// Create test users
const createUsers = async () => {
  const users = [
    {
      name: "Ahmed Slim",
      email: "ahmed@wasalni.com",
      password: "password123", // Will be hashed
      phone: "+216 92 123 456",
      role: "normal",
      city: "Tunis",
      country: "Tunisia",
      isVerified: false,
      isPremium: false,
      commissionRate: 0.1,
      rating: 4.5,
      totalReviews: 12,
    },
    {
      name: "Fatima Amara",
      email: "fatima@wasalni.com",
      password: "password123",
      phone: "+216 95 234 567",
      role: "owner",
      city: "Sousse",
      country: "Tunisia",
      isVerified: true,
      isPremium: true,
      commissionRate: 0.05,
      rating: 4.8,
      totalReviews: 35,
      vehicleDetails: {
        make: "Toyota",
        model: "Corolla",
        year: 2022,
        licensePlate: "TN-123-45",
        image: "https://via.placeholder.com/400x300?text=Toyota+Corolla",
      },
      bankDetails: {
        accountHolder: "Fatima Amara",
        accountNumber: "1234567890",
        bankCode: "STBKTN",
      },
      totalEarnings: 5200,
      totalCommissionPaid: 260,
      completedRides: 35,
    },
    {
      name: "Mohamed Ben Ali",
      email: "mohamed@wasalni.com",
      password: "password123",
      phone: "+216 98 345 678",
      role: "owner",
      city: "Sfax",
      country: "Tunisia",
      isVerified: true,
      isPremium: false,
      commissionRate: 0.1,
      rating: 4.2,
      totalReviews: 18,
      vehicleDetails: {
        make: "Renault",
        model: "Megane",
        year: 2021,
        licensePlate: "TN-234-56",
        image: "https://via.placeholder.com/400x300?text=Renault+Megane",
      },
      bankDetails: {
        accountHolder: "Mohamed Ben Ali",
        accountNumber: "9876543210",
        bankCode: "ATTBK",
      },
      totalEarnings: 3850,
      totalCommissionPaid: 385,
      completedRides: 18,
    },
    {
      name: "Leila Ghali",
      email: "leila@wasalni.com",
      password: "password123",
      phone: "+216 99 456 789",
      role: "normal",
      city: "Monastir",
      country: "Tunisia",
      isVerified: false,
      isPremium: false,
      commissionRate: 0.1,
      rating: 4.0,
      totalReviews: 5,
    },
    {
      name: "Khalid Hamza",
      email: "khalid@wasalni.com",
      password: "password123",
      phone: "+216 93 567 890",
      role: "owner",
      city: "Gafsa",
      country: "Tunisia",
      isVerified: false,
      isPremium: true,
      commissionRate: 0.05,
      rating: 3.9,
      totalReviews: 8,
      vehicleDetails: {
        make: "Peugeot",
        model: "308",
        year: 2023,
        licensePlate: "TN-345-67",
        image: "https://via.placeholder.com/400x300?text=Peugeot+308",
      },
      totalEarnings: 1650,
      totalCommissionPaid: 82.5,
      completedRides: 8,
    },
  ];

  const createdUsers = await User.insertMany(users);
  console.log(`✅ Created ${createdUsers.length} users`);
  return createdUsers;
};

// Create test rides
const createRides = async (users: any[]) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const rides = [
    {
      ownerId: users[1]._id, // Fatima (owner, verified, premium)
      origin: "Tunis",
      originCoordinates: { latitude: 36.8065, longitude: 10.1815 },
      destination: "Sousse",
      destinationCoordinates: { latitude: 35.8256, longitude: 10.6369 },
      date: tomorrow,
      departureTime: "08:00",
      totalSeats: 4,
      seatsAvailable: 2,
      pricePerSeat: 45,
      vehicleType: "sedan",
      vehicleDetails: {
        make: "Toyota",
        model: "Corolla",
        licensePlate: "TN-123-45",
        color: "White",
      },
      description: "Comfortable ride with AC, friendly driver",
      amenities: ["AC", "WiFi", "USB Charger", "Water"],
      status: "active",
      isFeatured: true,
      bookedBy: [],
    },
    {
      ownerId: users[2]._id, // Mohamed (owner, verified, not premium)
      origin: "Sfax",
      originCoordinates: { latitude: 34.7406, longitude: 10.7606 },
      destination: "Gafsa",
      destinationCoordinates: { latitude: 34.4269, longitude: 8.7738 },
      date: nextWeek,
      departureTime: "06:00",
      totalSeats: 5,
      seatsAvailable: 3,
      pricePerSeat: 35,
      vehicleType: "sedan",
      vehicleDetails: {
        make: "Renault",
        model: "Megane",
        licensePlate: "TN-234-56",
        color: "Black",
      },
      description: "Early morning ride, express service",
      amenities: ["AC"],
      status: "active",
      isFeatured: false,
      bookedBy: [],
    },
    {
      ownerId: users[4]._id, // Khalid (owner, not verified, but premium)
      origin: "Tunis",
      originCoordinates: { latitude: 36.8065, longitude: 10.1815 },
      destination: "Monastir",
      destinationCoordinates: { latitude: 35.7863, longitude: 10.8276 },
      date: tomorrow,
      departureTime: "10:30",
      totalSeats: 4,
      seatsAvailable: 4,
      pricePerSeat: 30,
      vehicleType: "sedan",
      vehicleDetails: {
        make: "Peugeot",
        model: "308",
        licensePlate: "TN-345-67",
        color: "Blue",
      },
      description: "New car, safe and modern",
      amenities: ["AC", "USB Charger"],
      status: "active",
      isFeatured: false,
      bookedBy: [],
    },
  ];

  const createdRides = await Ride.insertMany(rides);
  console.log(`✅ Created ${createdRides.length} rides`);
  return createdRides;
};

// Create test bookings
const createBookings = async (users: any[], rides: any[]) => {
  const bookings = [
    {
      rideId: rides[0]._id,
      passengerId: users[0]._id, // Ahmed
      driverId: users[1]._id, // Fatima
      seatsBooked: 2,
      totalPrice: 90,
      status: "accepted",
      paymentStatus: "completed",
    },
    {
      rideId: rides[0]._id,
      passengerId: users[3]._id, // Leila
      driverId: users[1]._id, // Fatima
      seatsBooked: 1,
      totalPrice: 45,
      status: "pending",
      paymentStatus: "pending",
    },
    {
      rideId: rides[1]._id,
      passengerId: users[0]._id, // Ahmed
      driverId: users[2]._id, // Mohamed
      seatsBooked: 1,
      totalPrice: 35,
      status: "completed",
      paymentStatus: "completed",
      rating: 5,
      review: "Great experience! Comfortable and on time.",
    },
  ];

  const createdBookings = await Booking.insertMany(bookings);
  console.log(`✅ Created ${createdBookings.length} bookings`);
  return createdBookings;
};

// Create test messages
const createMessages = async (users: any[], rides: any[]) => {
  const messages = [
    {
      senderId: users[0]._id, // Ahmed
      recipientId: users[1]._id, // Fatima
      rideId: rides[0]._id,
      content: "Hi, I'd like to book 2 seats for tomorrow. Is that possible?",
      isRead: true,
    },
    {
      senderId: users[1]._id, // Fatima
      recipientId: users[0]._id, // Ahmed
      rideId: rides[0]._id,
      content: "Sure! No problem. See you tomorrow at 8:00 AM.",
      isRead: true,
    },
    {
      senderId: users[3]._id, // Leila
      recipientId: users[1]._id, // Fatima
      rideId: rides[0]._id,
      content: "Hi Fatima, can I book 1 seat?",
      isRead: false,
    },
  ];

  const createdMessages = await Message.insertMany(messages);
  console.log(`✅ Created ${createdMessages.length} messages`);
  return createdMessages;
};

// Create test notifications
const createNotifications = async (users: any[], bookings: any[]) => {
  const notifications = [
    {
      userId: users[1]._id, // Fatima (driver)
      type: "booking_request",
      title: "New Booking Request",
      message: "Ahmed Slim wants to book 2 seats on your Tunis-Sousse ride",
      data: {
        rideId: bookings[0].rideId.toString(),
        bookingId: bookings[0]._id.toString(),
        userId: users[0]._id.toString(),
      },
      isRead: true,
    },
    {
      userId: users[0]._id, // Ahmed (passenger)
      type: "booking_accepted",
      title: "Booking Confirmed",
      message: "Your booking has been accepted by Fatima Amara",
      data: {
        bookingId: bookings[0]._id.toString(),
        userId: users[1]._id.toString(),
      },
      isRead: true,
    },
    {
      userId: users[3]._id, // Leila
      type: "message",
      title: "New Message",
      message: "Fatima sent you a message",
      data: {
        userId: users[1]._id.toString(),
      },
      isRead: false,
    },
  ];

  const createdNotifications = await Notification.insertMany(notifications);
  console.log(`✅ Created ${createdNotifications.length} notifications`);
  return createdNotifications;
};

// Main seed function
const seed = async () => {
  try {
    await connectDB();
    await clearCollections();

    const users = await createUsers();
    const rides = await createRides(users);
    const bookings = await createBookings(users, rides);
    await createMessages(users, rides);
    await createNotifications(users, bookings);

    console.log("\n📊 Database seeded successfully!");
    console.log("\n📝 Test User Credentials:");
    console.log("  Passenger: ahmed@wasalni.com / password123");
    console.log("  Driver (Premium/Verified): fatima@wasalni.com / password123");
    console.log("  Driver (Verified): mohamed@wasalni.com / password123");
    console.log("  Passenger: leila@wasalni.com / password123");
    console.log("  Driver (Premium): khalid@wasalni.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();
