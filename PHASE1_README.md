# 🚀 PHASE 1: Connect Backend to Database

## Overview
This phase sets up MongoDB Atlas connection and seeds the database with realistic test data.

---

## ✅ What's Been Completed

### 1. **Updated .env Configuration**
- File: `backend/.env`
- Contains MongoDB Atlas connection string placeholder
- All required environment variables for development

### 2. **Enhanced User Model**
- Added `commissionRate` field (10% default, 5% for verified/premium owners)
- Added `emailVerificationToken` and `emailVerificationExpires` for email verification
- Added `passwordResetToken` and `passwordResetExpires` for password recovery
- Added `lastLogin` timestamp for tracking
- Added `totalCommissionPaid` to track paid commissions
- Added database indexes for efficient querying

### 3. **Created Seed Script**
- File: `backend/src/scripts/seed.ts`
- Clears all collections and repopulates with realistic test data
- Creates 5 test users with different roles and statuses
- Creates 3 test rides with various configurations
- Creates test bookings, messages, and notifications
- Provides test credentials for manual testing

---

## 📋 Step-by-Step Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account (M0 cluster)
3. Create a new project called "WASALNI"
4. Create a new cluster (free tier is fine)

### Step 2: Create Database User

1. In MongoDB Atlas, go to **Database Access**
2. Click **"Add New Database User"**
3. Create a user:
   - **Username:** `wasalni_user`
   - **Password:** Generate a secure password (e.g., `Wasalni123!Secure`)
   - **Role:** `Atlas Admin` (for development only)
4. Click **"Add User"**

### Step 3: Get Connection String

1. Go to your cluster page
2. Click **"Connect"**
3. Select **"Connect your application"**
4. Choose **"Node.js"** and version **"4.1 or later"**
5. Copy the connection string

The connection string looks like:
```
mongodb+srv://wasalni_user:YOUR_PASSWORD@cluster-name.mongodb.net/wasalni?retryWrites=true&w=majority
```

### Step 4: Update .env File

1. Open `backend/.env`
2. Replace the `MONGODB_URI` value with your connection string:
```bash
MONGODB_URI=mongodb+srv://wasalni_user:YOUR_PASSWORD@cluster-name.mongodb.net/wasalni?retryWrites=true&w=majority
```

**Important:** Replace `YOUR_PASSWORD` with the actual password you created in Step 2

### Step 5: Install Dependencies (if not already done)

```bash
cd backend
npm install
```

### Step 6: Run the Seed Script

```bash
npm run seed
```

**Expected Output:**
```
✅ MongoDB connected for seeding
🧹 Collections cleared
✅ Created 5 users
✅ Created 3 rides
✅ Created 3 bookings
✅ Created 3 messages
✅ Created 3 notifications

📊 Database seeded successfully!

📝 Test User Credentials:
  Passenger: ahmed@wasalni.com / password123
  Driver (Premium/Verified): fatima@wasalni.com / password123
  Driver (Verified): mohamed@wasalni.com / password123
  Passenger: leila@wasalni.com / password123
  Driver (Premium): khalid@wasalna.com / password123
```

---

## 🧪 Testing Phase 1

### Test 1: Verify Database Connection

```bash
npm run dev
```

You should see:
```
✅ Server running on port 5000
✅ MongoDB connected successfully
```

### Test 2: Verify Collections in MongoDB Atlas

1. Go to MongoDB Atlas Dashboard
2. Click on your cluster
3. Go to **Collections**
4. You should see these collections:
   - `users` (5 documents)
   - `rides` (3 documents)
   - `bookings` (3 documents)
   - `messages` (3 documents)
   - `notifications` (3 documents)

### Test 3: Verify User Commission Rates

In MongoDB Atlas Charts or Compass, query the users collection:

```javascript
db.users.find({}, { name: 1, isPremium: 1, isVerified: 1, commissionRate: 1 });
```

**Expected Results:**
```
Ahmed Slim               | Premium: false | Verified: false | Commission: 10%
Fatima Amara           | Premium: true  | Verified: true  | Commission: 5%
Mohamed Ben Ali        | Premium: false | Verified: true  | Commission: 10%
Leila Ghali            | Premium: false | Verified: false | Commission: 10%
Khalid Hamza           | Premium: true  | Verified: false | Commission: 5%
```

### Test 4: Check Ride-User Relationships

In MongoDB Compass, expand a ride document and verify:
- `ownerId` references a valid user
- `bookedBy` contains passenger user IDs
- `seatsAvailable` is less than `totalSeats`

### Test 5: Check Booking Status

Query bookings:
```javascript
db.bookings.find({}, { status: 1, paymentStatus: 1, totalPrice: 1 });
```

You should see:
- 1 accepted booking
- 1 pending booking
- 1 completed booking (with rating)

---

## 📊 Database Schema Summary

### Users Collection
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  password: string (hashed),
  phone: string,
  role: "guest" | "normal" | "owner",
  profileImage: string,
  isVerified: boolean,
  isPremium: boolean,
  commissionRate: number,
  totalEarnings: number,
  totalCommissionPaid: number,
  completedRides: number,
  rating: number,
  totalReviews: number,
  vehicleDetails: { make, model, year, licensePlate, image },
  bankDetails: { accountHolder, accountNumber, bankCode },
  createdAt: Date,
  updatedAt: Date
}
```

### Rides Collection
```typescript
{
  _id: ObjectId,
  ownerId: ObjectId (ref: User),
  origin: string,
  destination: string,
  date: Date,
  departureTime: string,
  totalSeats: number,
  seatsAvailable: number,
  pricePerSeat: number,
  status: "active" | "completed" | "cancelled",
  isFeatured: boolean,
  bookedBy: ObjectId[] (ref: User),
  amenities: string[],
  vehicleDetails: { make, model, licensePlate, color },
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection
```typescript
{
  _id: ObjectId,
  rideId: ObjectId (ref: Ride),
  passengerId: ObjectId (ref: User),
  driverId: ObjectId (ref: User),
  seatsBooked: number,
  totalPrice: number,
  status: "pending" | "accepted" | "rejected" | "cancelled" | "completed",
  paymentStatus: "pending" | "completed" | "failed" | "refunded",
  rating: number (1-5),
  review: string,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔑 Key Features in Phase 1

✅ MongoDB Atlas cloud database connected
✅ All Mongoose models with proper schemas
✅ User commission rate system ready (10% standard, 5% premium)
✅ Email verification fields for future auth features
✅ Password reset fields for future recovery
✅ Realistic seed data for development & testing
✅ Database indexes for efficient queries
✅ Proper relationships between collections

---

## 🐛 Troubleshooting

### Error: "MongoDB connection failed"
- Check your MONGODB_URI in .env
- Verify username and password are correct
- Ensure IP whitelist in MongoDB Atlas includes your current IP
- Click "Allow access from anywhere" (only for development)

### Error: "Cannot find module 'tsx'"
- Run `npm install` again in the backend directory

### Error: "Password contains special characters"
- If your password has special characters, URL-encode them
- Example: `@` becomes `%40`, `!` becomes `%21`

### Seed script hangs indefinitely
- Check your internet connection
- Verify MongoDB Atlas IP whitelist
- Try running seed script with debug: `npm run seed 2>&1 | tee seed.log`

---

## ✨ Next Steps

Once Phase 1 is complete:
1. Start the backend: `npm run dev`
2. You'll see database is connected
3. Ready to move to **Phase 2: Complete All Missing API Endpoints**

---

## 📝 Commands Reference

```bash
# Start development server
npm run dev

# Run database seeding
npm run seed

# Reseed database (clears and repopulates)
npm run seed

# Build TypeScript
npm build

# Run production build
npm start
```

---

## 📚 Files Modified/Created in Phase 1

| File | Action | Purpose |
|------|--------|---------|
| `backend/.env` | Created | Environment configuration with MongoDB Atlas |
| `backend/src/models/User.ts` | Modified | Added commissionRate, verification, and reset tokens |
| `backend/src/scripts/seed.ts` | Created | Database seeding script with test data |
| `backend/package.json` | Modified | Added seed script commands |

---

## ✅ Phase 1 Completion Checklist

- [ ] Created MongoDB Atlas account and cluster
- [ ] Created database user in MongoDB Atlas
- [ ] Updated .env with MongoDB URI connection string
- [ ] Run `npm run seed` successfully
- [ ] Verified collections in MongoDB Atlas
- [ ] Confirmed test user credentials display correctly
- [ ] Seed script completes without errors

**Once all checks are complete, you're ready for Phase 2!**
