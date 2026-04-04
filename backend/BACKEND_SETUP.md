# Wasalni Backend - Complete Setup Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Installation & Setup](#installation--setup)
3. [API Endpoints](#api-endpoints)
4. [Database Schema](#database-schema)
5. [Authentication System](#authentication-system)
6. [Real-Time Features](#real-time-features)
7. [Frontend Integration](#frontend-integration)
8. [Deployment](#deployment)

---

## Project Overview

**Backend Stack:**
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Real-Time:** Socket.io
- **File Storage:** Cloudinary (for media uploads)
- **Email:** Nodemailer
- **Input Validation:** Joi
- **Password Security:** Bcrypt

**Architecture:** MVC (Model-View-Controller) pattern with middleware-based request processing

---

## Installation & Setup

### Step 1: Clone and Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual values
```

**Required Environment Variables:**

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/wasalni

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRY=7d
JWT_REFRESH_EXPIRY=30d

# Cloudinary (for file uploads)
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Email Service
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Step 3: Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env to your Atlas connection string
```

### Step 4: Run the Backend

```bash
# Development (with auto-reload)
npm run dev

# Production build
npm run build
npm start
```

**Expected Output:**
```
✅ Server running on port 5000
🌍 Environment: development
✅ MongoDB connected successfully
```

---

## API Endpoints

### Authentication Routes

#### Register
- **POST** `/api/auth/register`
- **Body:** `{ name, email, password, phone, role }`
- **Returns:** Token, RefreshToken, User data

#### Login
- **POST** `/api/auth/login`
- **Body:** `{ email, password, role? }`
- **Returns:** Token, RefreshToken, User data

#### Refresh Token
- **POST** `/api/auth/refresh-token`
- **Body:** `{ refreshToken }`
- **Returns:** New token, new refresh token

#### Logout
- **POST** `/api/auth/logout`
- **Returns:** Success message

### User Routes

#### Get Profile
- **GET** `/api/users/profile`
- **Auth:** Required (JWT)
- **Returns:** User profile data

#### Update Profile
- **PUT** `/api/users/profile`
- **Auth:** Required
- **Body:** `{ name, phone, address, city, country, profileImage }`
- **Returns:** Updated user data

#### Upgrade to Owner
- **POST** `/api/users/upgrade-to-owner`
- **Auth:** Required
- **Body:** `{ vehicleDetails, bankDetails }`
- **Returns:** Updated user with owner role

#### Get All Users (Owners)
- **GET** `/api/users?page=1&limit=10`
- **Returns:** Paginated list of owners

#### Get User by ID
- **GET** `/api/users/:id`
- **Returns:** User public profile

### Ride Routes

#### Create Ride (Owner Only)
- **POST** `/api/rides`
- **Auth:** Required (owner role)
- **Body:** Ride details
- **Returns:** Created ride

#### Get All Rides
- **GET** `/api/rides?page=1&limit=10`
- **Returns:** Paginated active rides

#### Search Rides
- **GET** `/api/rides/search?origin=Tunis&destination=Sousse&date=2024-01-15`
- **Returns:** Matching rides

#### Get Ride Details
- **GET** `/api/rides/:id`
- **Returns:** Complete ride info with driver details

#### Update Ride (Owner Only)
- **PUT** `/api/rides/:id`
- **Auth:** Required (owner)
- **Body:** Updated ride fields
- **Returns:** Updated ride

#### Delete Ride (Owner Only)
- **DELETE** `/api/rides/:id`
- **Auth:** Required (owner)
- **Returns:** Success message

### Booking/Request Routes

#### Create Booking Request
- **POST** `/api/requests`
- **Auth:** Required
- **Body:** `{ rideId, seatsBooked }`
- **Returns:** Booking details

#### Get Booking Requests (Owner)
- **GET** `/api/requests/requests`
- **Auth:** Required (owner)
- **Returns:** Pending booking requests for owner's rides

#### Respond to Booking
- **PUT** `/api/requests/:id/respond`
- **Auth:** Required (owner)
- **Body:** `{ status: "accepted" | "rejected" }`
- **Returns:** Updated booking

#### Get My Bookings
- **GET** `/api/requests/my-bookings`
- **Auth:** Required
- **Returns:** All passenger bookings

### Message Routes

#### Send Message
- **POST** `/api/messages`
- **Auth:** Required
- **Body:** `{ recipientId, content, rideId? }`
- **Returns:** Message details

#### Get Messages (Conversation)
- **GET** `/api/messages/:conversationId?page=1&limit=50`
- **Auth:** Required
- **Returns:** Conversation messages

#### Mark Message as Read
- **PUT** `/api/messages/:id/read`
- **Auth:** Required
- **Returns:** Updated message

### Notification Routes

#### Get Notifications
- **GET** `/api/notifications?page=1&limit=20`
- **Auth:** Required
- **Returns:** User notifications with unread count

#### Mark as Read
- **PUT** `/api/notifications/:id/read`
- **Auth:** Required
- **Returns:** Updated notification

#### Mark All as Read
- **PUT** `/api/notifications/mark-all/read`
- **Auth:** Required
- **Returns:** Success message

#### Delete Notification
- **DELETE** `/api/notifications/:id`
- **Auth:** Required
- **Returns:** Success message

---

## Database Schema

### User Model
```typescript
{
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  phone: String,
  role: "guest" | "normal" | "owner" (default: "normal"),
  profileImage: String,
  address: String,
  city: String,
  country: String,
  isVerified: Boolean (default: false),
  isPremium: Boolean (default: false),
  rating: Number (default: 0),
  totalReviews: Number (default: 0),
  // Owner-specific
  vehicleDetails?: {
    make, model, year, licensePlate, image
  },
  bankDetails?: {
    accountHolder, accountNumber, bankCode
  },
  totalEarnings: Number (default: 0),
  completedRides: Number (default: 0),
  timestamps: true
}
```

### Ride Model
```typescript
{
  ownerId: ObjectId (ref: User),
  origin: String (required),
  destination: String (required),
  date: Date (required),
  departureTime: String (required),
  totalSeats: Number (required),
  seatsAvailable: Number (required),
  pricePerSeat: Number (required),
  vehicleType: String,
  vehicleDetails: { make, model, licensePlate, color },
  description: String,
  amenities: [String],
  status: "active" | "completed" | "cancelled" (default: "active"),
  isFeatured: Boolean (default: false),
  bookedBy: [ObjectId] (ref: User),
  indexes: [date, status], [ownerId]
}
```

### Booking Model
```typescript
{
  rideId: ObjectId (ref: Ride),
  passengerId: ObjectId (ref: User),
  driverId: ObjectId (ref: User),
  seatsBooked: Number (required),
  totalPrice: Number (required),
  status: "pending" | "accepted" | "rejected" | "completed" (default: "pending"),
  paymentStatus: "pending" | "completed" | "failed" | "refunded",
  rating: Number (1-5, optional),
  review: String (optional),
  indexes: [rideId], [passengerId], [driverId]
}
```

### Message Model
```typescript
{
  senderId: ObjectId (ref: User),
  recipientId: ObjectId (ref: User),
  rideId: ObjectId (ref: Ride, optional),
  content: String (required),
  isRead: Boolean (default: false),
  indexes: [senderId], [recipientId], [rideId]
}
```

### Notification Model
```typescript
{
  userId: ObjectId (ref: User),
  type: "booking_request" | "booking_accepted" | "booking_rejected" | "message" | "earnings",
  title: String,
  message: String,
  data?: { rideId, bookingId, userId },
  isRead: Boolean (default: false),
  indexes: [userId], [isRead]
}
```

---

## Authentication System

### JWT Flow

1. **Registration/Login** → Generate JWT + Refresh Token
2. **API Requests** → Include JWT in Authorization header
3. **Token Expiry** → Use Refresh Token to get new JWT
4. **Password Security** → Bcrypt hashing with salt rounds

### Using JWT in Requests

```javascript
// Frontend example
const token = localStorage.getItem('token');
const response = await fetch('/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Protected Route Usage

```typescript
// Routes that require auth
router.get('/profile', authenticate, getProfile);

// Routes that require specific role
router.post('/publish', authenticate, authorize("owner"), publishRide);
```

---

## Real-Time Features (Socket.io)

### Connection Events

```javascript
// Client-side
const socket = io('http://localhost:5000');

// Join specific room (e.g., driver's ID)
socket.emit('join_room', 'driver-id-123');

// Listen for new booking request
socket.on('new_booking_request', (data) => {
  console.log('New booking!', data);
});

// Listen for booking acceptance
socket.on('booking_accepted', (data) => {
  console.log('Your booking was accepted!', data);
});

// Listen for messages
socket.on('new_message', (data) => {
  console.log('New message:', data);
});
```

### Real-Time Notifications Emitted

1. **new_booking_request** - Driver receives passenger request
2. **booking_accepted** - Passenger notified of acceptance
3. **booking_rejected** - Passenger notified of rejection
4. **new_message** - Recipient notified of new message

---

## Frontend Integration

### Step 1: Install Axios

```bash
cd ../Cross-platform\ ride-sharing\ app
npm install axios
```

### Step 2: Create API Service

Create `src/services/api.ts`:

```typescript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### Step 2: Update AuthContext

Replace mock login in `src/app/context/AuthContext.tsx`:

```typescript
import apiClient from '../../services/api';

export const login = async (email: string, password: string, role: string) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
      role,
    });
    
    const { token, refreshToken, user } = response.data;
    
    // Save tokens
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Update auth state
    setUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      verified: user.verified,
      rating: user.rating,
      reviews: user.reviews,
    });
    
    setIsAuthenticated(true);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (name: string, email: string, password: string, phone: string, role: string) => {
  try {
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password,
      phone,
      role,
    });
    
    const { token, refreshToken, user } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    
    setUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      verified: user.verified,
    });
    
    setIsAuthenticated(true);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};
```

### Step 4: Fetch Real Data in Dashboard

Update `src/app/pages/Dashboard.tsx`:

```typescript
import { useEffect, useState } from 'react';
import apiClient from '../../services/api';

export function Dashboard() {
  const [rides, setRides] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === 'owner') {
          const response = await apiClient.get('/rides?page=1&limit=5');
          setRides(response.data.rides.filter((r: any) => r.driver.id === user.id));
        } else {
          const response = await apiClient.get('/requests/my-bookings');
          setBookings(response.data.bookings);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, user]);

  // ... rest of component
}
```

### Step 5: Setup Socket.io in Frontend

Create `src/services/socket.ts`:

```typescript
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';
let socket: Socket;

export const initializeSocket = (userId: string) => {
  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  // Join user-specific room
  socket.emit('join_room', userId);

  return socket;
};

export const getSocket = () => socket;

export const onBookingRequest = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('new_booking_request', callback);
  }
};

export const onBookingAccepted = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('booking_accepted', callback);
  }
};

export const onNewMessage = (callback: (data: any) => void) => {
  if (socket) {
    socket.on('new_message', callback);
  }
};
```

---

## Testing the API

### Using Postman/cURL

#### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ahmed Ben Salem",
    "email": "ahmed@example.com",
    "password": "password123",
    "phone": "21612345678",
    "role": "owner"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com",
    "password": "password123",
    "role": "owner"
  }'
```

#### 3. Create Ride (as Owner)
```bash
curl -X POST http://localhost:5000/api/rides \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "Tunis",
    "destination": "Sousse",
    "date": "2024-01-20T08:00:00Z",
    "departureTime": "08:00",
    "totalSeats": 4,
    "pricePerSeat": 45,
    "vehicleType": "sedan",
    "vehicleDetails": {
      "make": "Toyota",
      "model": "Corolla",
      "licensePlate": "TN-123-ABD",
      "color": "silver"
    }
  }'
```

#### 4. Search Rides
```bash
curl http://localhost:5000/api/rides/search?origin=Tunis&destination=Sousse&date=2024-01-20
```

---

## Deployment Checklist

- [ ] Set production environment variables
- [ ] Update JWT_SECRET and JWT_REFRESH_SECRET
- [ ] Configure MongoDB Atlas (cloud database)
- [ ] Setup Cloudinary account for file uploads
- [ ] Configure email service credentials
- [ ] Update FRONTEND_URL to production domain
- [ ] Set NODE_ENV=production
- [ ] Run npm run build
- [ ] Deploy to hosting (Heroku, Railway, Render, etc.)
- [ ] Update frontend API_URL to production backend URL
- [ ] Enable HTTPS
- [ ] Setup SSL certificate

---

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- For Atlas, verify IP whitelist

### "JWT validation failed"
- Token may have expired - use refresh endpoint
- Check token is being sent correctly in Authorization header
- Verify JWT_SECRET matches between generations

### "CORS errors"
- Ensure FRONTEND_URL in .env matches frontend origin
- Check socket.io cors settings

### "Files not uploading"
- Verify Cloudinary credentials
- Check file size limits (max 50MB)
- Ensure multer middleware is configured

---

## Next Steps

1. **Real Payment Integration** - Stripe or PayPal
2. **Email Notifications** - Send confirmations via email
3. **Map Integration** - Google Maps API
4. **Admin Dashboard** - Monitor platform activity
5. **Analytics** - Track metrics and user behavior
6. **Mobile App** - React Native version
7. **Advanced Search** - Filters by price, amenities, rating

---

**Backend Status:** ✅ Production Ready  
**Last Updated:** April 4, 2026
