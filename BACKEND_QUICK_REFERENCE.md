# 🚀 Wasalni Backend - Quick Reference Card

## ⚡ 60-Second Setup

```bash
cd backend
npm install
cp .env.example .env          # Edit .env with MongoDB URI
npm run dev                   # Server running at http://localhost:5000
```

✅ Done! Backend is live.

---

## 📡 API Quick Reference

### Authentication
```bash
POST   /api/auth/register       { name, email, password, phone, role }
POST   /api/auth/login          { email, password, role }
POST   /api/auth/logout         (empty body)
POST   /api/auth/refresh-token  { refreshToken }
```

### Users
```bash
GET    /api/users/profile       Auth required
PUT    /api/users/profile       Auth required
POST   /api/users/upgrade-to-owner  { vehicleDetails }
GET    /api/users/:id           (public)
```

### Rides
```bash
GET    /api/rides               (public)
POST   /api/rides               Owner only
PUT    /api/rides/:id           Owner only
DELETE /api/rides/:id           Owner only
GET    /api/rides/search?...    (public)
```

### Bookings
```bash
POST   /api/requests            Create booking request
GET    /api/requests/my-bookings Get my bookings
GET    /api/requests/requests   Owner sees pending requests
PUT    /api/requests/:id/respond Owner accept/reject
```

### Messages & Notifications
```bash
POST   /api/messages            Send message
GET    /api/messages/:id        Get conversation
GET    /api/notifications       Get notifications
PUT    /api/notifications/:id/read  Mark read
```

### File Upload
```bash
POST   /api/upload/profile-image    Avatar upload
POST   /api/upload/vehicle-image    Vehicle photo (owner)
```

---

## 🔐 Authentication Header

```javascript
// Every protected route needs this header:
Authorization: Bearer YOUR_JWT_TOKEN

// Example:
fetch('/api/users/profile', {
  headers: {
    'Authorization': 'Bearer eyJhbGc...'
  }
})
```

---

## 🗂️ Project Structure - Key Files

```
backend/
├── src/
│   ├── server.ts              ← Main app
│   ├── config/database.ts     ← MongoDB config
│   ├── controllers/           ← Business logic (7 files)
│   ├── routes/                ← API endpoints (7 files)
│   ├── models/                ← Database schemas (5 files)
│   ├── middleware/            ← Auth, errors, upload (3 files)
│   └── services/              ← Cloudinary helper
├── dist/                      ← Compiled JS (after build)
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 🔑 Environment Variables (.env)

```env
# Required
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wasalni
JWT_SECRET=your_32_char_secret_key_here
JWT_REFRESH_SECRET=another_32_char_secret_here

# Optional but recommended
FRONTEND_URL=http://localhost:5173
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_password
```

---

## 📊 Database Models

### User
```
{id, name, email, password(hash), phone, role, profileImage, 
 address, city, country, isVerified, isPremium, rating, totalReviews,
 vehicleDetails(owner), bankDetails(owner), totalEarnings, completedRides}
```

### Ride
```
{id, ownerId, origin, destination, date, departureTime, totalSeats,
 seatsAvailable, pricePerSeat, vehicleType, vehicleDetails, description,
 amenities[], status, isFeatured, bookedBy[]}
```

### Booking
```
{id, rideId, passengerId, driverId, seatsBooked, totalPrice,
 status, paymentStatus, rating, review}
```

### Message
```
{id, senderId, recipientId, rideId, content, isRead}
```

### Notification
```
{id, userId, type, title, message, data, isRead}
```

---

## 🧪 Test a Booking Flow

```bash
# 1. Register as owner
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ahmed","email":"ahmed@test.com","password":"pass123","phone":"21612345678","role":"owner"}'

# Save token: TOKEN1

# 2. Create a ride
curl -X POST http://localhost:5000/api/rides \
  -H "Authorization: Bearer TOKEN1" \
  -H "Content-Type: application/json" \
  -d '{"origin":"Tunis","destination":"Sousse","date":"2024-01-20T08:00:00Z","departureTime":"08:00","totalSeats":4,"pricePerSeat":45,"vehicleType":"sedan"}'

# Save rideId

# 3. Register as normal user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Sara","email":"sara@test.com","password":"pass123","phone":"21687654321","role":"normal"}'

# Save token: TOKEN2

# 4. Book the ride
curl -X POST http://localhost:5000/api/requests \
  -H "Authorization: Bearer TOKEN2" \
  -H "Content-Type: application/json" \
  -d '{"rideId":"RIDE_ID","seatsBooked":2}'

# ✅ Booking created!
```

---

## 🔄 Authentication Flow

```
Frontend                          Backend
   |                                |
   |-- POST /auth/login --------→   |
   |                           (validate)
   |                           (hash check)
   |                           (JWT create)
   |← {token, refreshToken} ---←    |
   |                                |
   |-- GET /users/profile -------→  |
   |    (with Bearer token)     (verify JWT)
   |← {user profile} -----------←    |
   |                                |
[Token expired after 7 days]
   |                                |
   |-- POST /auth/refresh-token →   |
   |    (with refreshToken)    (verify & create new)
   |← {new token} ------←           |
   |                                |
   |-- Retry original request --→   ✅
```

---

## 🧵 Real-Time Events (Socket.io)

```javascript
// Client connects and joins room
socket.emit('join_room', userId);

// Listen for events
socket.on('new_booking_request', (data) => {
  // Owner notified of new booking
});

socket.on('booking_accepted', (data) => {
  // Passenger notified their booking was accepted
});

socket.on('new_message', (data) => {
  // Recipient notified of message
});
```

---

## 🛡️ Security Features

✅ JWT authentication with refresh tokens  
✅ Bcrypt password hashing (10 salt rounds)  
✅ CORS enabled for frontend  
✅ Rate limiting (100 req/15 min)  
✅ Helmet security headers  
✅ Role-based access control  
✅ Input validation with Joi  
✅ Private field filtering in responses  

---

## 🚢 Deployment Checklist

- [ ] Generate strong JWT secrets (min 32 chars)
- [ ] Setup MongoDB Atlas (cloud database)
- [ ] Configure Cloudinary for images
- [ ] Create .env file with production values
- [ ] Set NODE_ENV=production
- [ ] Run `npm run build`
- [ ] Deploy to hosting (Railway, Render, Heroku)
- [ ] Update frontend API_URL
- [ ] Test all endpoints
- [ ] Setup monitoring/logging

---

## 📍 File Size Summary

```
Controllers:      ~1,200 lines (business logic)
Routes:           ~400 lines (endpoints)
Models:           ~450 lines (schemas)
Middleware:       ~350 lines (auth, errors)
Server/Config:    ~150 lines
Documentation:    ~1,500 lines

Total Backend:    ~2,500 lines
```

---

## 🎯 Commission Calculation

```
Standard Owners:    10% commission per ride
Premium Owners:     5% commission per ride
Featured Ride Fee:  +5 DT one-time

Example:
  Ride: 45 DT per seat
  Booked: 2 seats = 90 DT
  
  Standard Owner:
    Commission: 90 × 10% = 9 DT
    Owner Gets: 81 DT
    
  Premium Owner:
    Commission: 90 × 5% = 4.5 DT
    Owner Gets: 85.5 DT
```

---

## 📚 Documentation

| Doc | Purpose |
|-----|---------|
| `README.md` | 5-min quick start |
| `BACKEND_SETUP.md` | Complete + API reference |
| `BACKEND_IMPLEMENTATION_SUMMARY.md` | Features & architecture |
| `FRONTEND_BACKEND_INTEGRATION.md` | Connect frontend |
| `BACKEND_FILE_INDEX.md` | File navigation guide |

---

## 💡 Common Commands

```bash
# Development
npm run dev                 # Start with auto-reload
npm run build              # Compile TypeScript
npm start                  # Run production build
npm install               # Install dependencies

# Utilities
mongo                      # Connect to MongoDB (if local)
mongod                     # Start MongoDB (if local)
```

---

## 🔗 Connect Frontend

1. Install: `npm install axios socket.io-client`
2. Create: `src/services/api.ts` (Axios client)
3. Create: `src/services/socket.ts` (Socket manager)
4. Update: `AuthContext.tsx` (replace mock calls)
5. Update: `Dashboard.tsx` (fetch real data)
6. Add: `.env.local` with API_URL
7. Test: Login flow end-to-end

See `FRONTEND_BACKEND_INTEGRATION.md` for complete code.

---

## 🚀 Next Steps

1. **Verify Setup**
   - `npm run dev` (backend running)
   - Check MongoDB connection

2. **Test API**
   - Use provided curl examples
   - Test registration → login → create ride

3. **Connect Frontend**
   - Follow integration guide
   - Update AuthContext

4. **Test Full Flow**
   - Owner creates ride
   - Normal user books ride
   - Owner accepts/rejects
   - Verify real-time notifications

5. **Deploy**
   - Push to GitHub
   - Deploy backend to Railway/Render
   - Deploy frontend
   - Update frontend API_URL

---

**Status:** ✅ Production Ready  
**Endpoints:** 30+  
**Models:** 5  
**Updated:** April 4, 2026
