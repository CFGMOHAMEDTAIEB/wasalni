# 🚗 WASALNI - Complete Application Description

## 📋 Overview

**WASALNI** (Arabic: "وَصَلْنِي" meaning "connect me" or "reach me") is a **modern ride-sharing platform** that connects drivers and passengers in real-time. It's built as a full-stack web application with a professional React frontend and Node.js/Express backend, using MongoDB for data persistence.

Think of it as **Uber/Careem for Tunisia** - a complete carpooling marketplace where users can share rides, reduce travel costs, and build community.

---

## 🎯 Core Purpose

- **For Passengers:** Find affordable rides, book seats from drivers going to the same destination
- **For Drivers:** Post available rides, earn money by filling empty car seats  
- **Community:** Reduce traffic congestion, lower transportation costs, meet people

---

## 👥 User Roles

### 1. **Guest** (No Account)
- Browse available rides
- View ride details
- Search for destinations
- Cannot: Make bookings, send messages, view profile

### 2. **Passenger (Normal User)**
- Register and login
- Browse & search available rides
- Book seats on rides
- View booking history
- Send messages to drivers
- Receive notifications
- Upgrade to Premium (5% commission discount)

### 3. **Driver (Owner)**
- All passenger capabilities PLUS:
- Post/publish rides with route details
- Manage ride requests from passengers
- View earnings & trip history
- Upload vehicle documents
- Get verified badge (reduce commission to 5%)
- Premium features for better visibility

---

## 🏗️ Technology Stack

### **Frontend**
```
├── React 18.3.1              # UI framework
├── TypeScript 5.6            # Type safety
├── Vite 6.3.5               # Build tool
├── React Router v7          # Navigation
├── Tailwind CSS              # Styling
├── Shadcn/ui Components     # Pre-built components
├── Lucide Icons             # 300+ icons
├── Axios                    # HTTP client
└── Context API              # State management
```

**Deployment:** Vercel (serverless)  
**URL:** `https://wasalni-taieb.vercel.app`

### **Backend**
```
├── Node.js v22.18.0         # Runtime
├── Express.js               # Web server
├── TypeScript               # Type safety
├── MongoDB 7.x              # Database
├── Mongoose                 # ODM
├── JWT (jsonwebtoken)       # Auth tokens
├── Bcrypt                   # Password hashing
├── Socket.io                # Real-time messaging
├── Multer                   # File uploads
└── Cloudinary               # Image storage
```

**Deployment:** Render (free tier)  
**URL:** `https://wasalni.onrender.com`

### **Database**
```
MongoDB Atlas (Cloud)
├── Host: cluster0.ycqw9dq.mongodb.net
├── Tier: M0 (Free tier - 512MB)
└── Collections:
    ├── users               # User profiles
    ├── rides               # Published trips
    ├── bookings/requests   # Ride requests
    ├── messages            # User conversations
    └── notifications       # Real-time alerts
```

---

## 📱 Features

### **Authentication System** ✅
- Register with email, password, name, phone
- Dual login (Passenger vs Driver mode)
- JWT token-based authentication
- Persistent login (localStorage)
- Password recovery/reset
- Real-time email validation (password not taken)
- Auto-redirect to dashboard after login

### **Rides Management** ✅
- **Browse Rides:** Search by departure, destination, date
- **Ride Details:** Driver info, vehicle details, available seats, price
- **Book Seats:** Select number of seats, confirm booking
- **Publish Rides:** Post your own trips (drivers only)
- **Manage Requests:** Approve/reject passenger bookings
- **Trip History:** View past and upcoming rides

### **User Communication** ✅
- Direct messaging between driver and passenger
- Real-time message sync via Socket.io
- Conversation history
- User status (online/offline)

### **Notifications System** ✅
- Booking confirmations
- New ride requests (driver)
- Message alerts  
- Ride cancellations
- Automatic notification updates

### **User Profiles** ✅
- Avatar upload
- Bio and personal info
- Rating system (1-5 stars)
- Review history
- Verification badge
- Premium status

### **Premium System** ✅
- Regular commission: 10% per ride
- Premium: 5% commission (verified drivers)
- Lower fees for frequent users

### **Search & Discovery** ✅
- Filter by date, time, route
- Sort by price, rating, availability
- Real-time ride availability map
- Related rides suggestions

### **Professional UI/UX** ✅
- Beautiful gradient design (blue #3b82f6)
- Smooth animations & transitions
- Responsive design (mobile/tablet/desktop)
- Light & dark mode support
- Loading states & error handling
- Form validation with user feedback

---

## 🗄️ Database Schema

### **Users Collection**
```typescript
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  password: string (hashed),
  phone: string,
  role: "normal" | "owner",
  profileImage: string (URL),
  bio: string,
  isVerified: boolean,
  isPremium: boolean,
  rating: number (0-5),
  totalReviews: number,
  joinedDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### **Rides Collection**
```typescript
{
  _id: ObjectId,
  driver: ObjectId (User),
  departure: string,
  destination: string,
  departureTime: Date,
  departureDate: Date,
  availableSeats: number,
  totalSeats: number,
  pricePerSeat: number,
  description: string,
  vehicleType: string,
  passengers: [ObjectId],
  route: {
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  },
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **Bookings Collection**
```typescript
{
  _id: ObjectId,
  ride: ObjectId,
  passenger: ObjectId (User),
  numberOfSeats: number,
  totalPrice: number,
  status: "pending" | "accepted" | "rejected" | "completed",
  requestedAt: Date,
  respondedAt: Date,
  createdAt: Date
}
```

### **Messages Collection**
```typescript
{
  _id: ObjectId,
  conversationId: ObjectId,
  sender: ObjectId (User),
  recipient: ObjectId (User),
  content: string,
  attachments: [string],
  isRead: boolean,
  sentAt: Date,
  createdAt: Date
}
```

### **Notifications Collection**
```typescript
{
  _id: ObjectId,
  recipient: ObjectId (User),
  type: "booking" | "message" | "cancelled" | "approved",
  title: string,
  message: string,
  relatedId: ObjectId,
  isRead: boolean,
  createdAt: Date
}
```

---

## 🔌 API Endpoints

### **Authentication**
```
POST   /api/auth/register           # Create new account
POST   /api/auth/login              # Login with credentials
POST   /api/auth/logout             # Logout
POST   /api/auth/refresh-token      # Refresh JWT token
POST   /api/auth/request-password-reset  # Send reset email
POST   /api/auth/reset-password     # Confirm password reset
POST   /api/auth/check-email        # Verify email exists
```

### **Users**
```
GET    /api/users/profile           # Get current user
PUT    /api/users/profile           # Update profile
GET    /api/users/:id               # Get user by ID
POST   /api/users/avatar            # Upload avatar
POST   /api/users/verify-email      # Email verification
```

### **Rides**
```
GET    /api/rides                   # List all rides (with filters)
POST   /api/rides                   # Create new ride (drivers only)
GET    /api/rides/:id               # Get ride details
PUT    /api/rides/:id               # Edit ride (owner only)
DELETE /api/rides/:id               # Cancel ride (owner only)
GET    /api/rides/driver/:driverId  # Get driver's rides
GET    /api/rides/my-rides          # Get current user's rides
```

### **Bookings/Requests**
```
GET    /api/requests/my-bookings    # Get user's bookings
POST   /api/requests                # Request a seat
PUT    /api/requests/:id            # Respond to booking request
DELETE /api/requests/:id            # Cancel booking
GET    /api/requests/ride/:rideId   # Get ride's booking requests
```

### **Messages**
```
GET    /api/messages/:conversationId  # Get conversation messages
POST   /api/messages                   # Send message
GET    /api/conversations              # List all conversations
```

### **Notifications**
```
GET    /api/notifications            # Get user's notifications
GET    /api/notifications/unread     # Get unread count
PUT    /api/notifications/:id        # Mark as read
DELETE /api/notifications/:id        # Delete notification
```

### **Health Check**
```
GET    /api/health                   # Server status
```

---

## 🖥️ Frontend Pages

### **Public Pages**
- **`/`** - Home: Hero, featured rides, call to action
- **`/login`** - Role-based login (Passenger or Driver)
- **`/register`** - Account creation with validation
- **`/forgot-password`** - Password recovery flow
- **`/search`** - Advanced ride search & filtering
- **`/ride/:id`** - Ride details with booking
- **`/premium`** - Premium features & pricing

### **Protected Pages** (Login Required)
- **`/dashboard`** - User profile & booking history
- **`/publish`** - Post a new ride (drivers only)

### **Error Pages**
- **`/404`** - Page not found
- **Access Denied** - Role-based access restrictions

---

## 🔒 Security Features

✅ **Password Hashing** - Bcrypt with salt rounds  
✅ **JWT Tokens** - Secure authentication  
✅ **CORS** - Cross-origin protection  
✅ **Rate Limiting** - Prevent abuse  
✅ **Input Validation** - Server & client-side  
✅ **SQL Injection Prevention** - Using MongoDB/Mongoose  
✅ **HTTPS** - Encrypted communications  
✅ **Email Verification** - Optional 2FA  
✅ **Role-Based Access Control** - Protected routes  

---

## ⚡ Performance

- **Frontend:** Vite optimized, ~460KB gzipped
- **Backend:** Node.js async/await, connection pooling
- **Database:** MongoDB indexes on common queries
- **API Response:** <200ms average for cached content
- **Real-time:** Socket.io for instant messaging

---

## 📈 Recent Enhancements (Latest Build)

✅ **Professional Animation System**
- Smooth slide-in animations on auth pages
- Button hover effects and transitions
- Loading spinner animations
- Success/error message transitions

✅ **Advanced Authentication**
- Real-time email validation during signup
- Password strength requirements (8+ characters)
- Forgot password recovery with email verification
- Session persistence with localStorage

✅ **Auto-Redirect System**
- Automatic redirect to dashboard after login
- Automatic redirect to login if not authenticated
- Intelligent protected route handling

✅ **Enhanced UI Design**
- Professional blue color scheme (#3b82f6)
- Gradient backgrounds and modern styling
- Better form inputs with focus states
- Info cards and benefit callouts
- Responsive grid layouts

✅ **Real API Integration**
- Actual backend API calls (not mocked)
- Proper JWT token handling
- MongoDB database connection
- Error handling and user feedback

---

## 🚀 How to Get Started

### **Prerequisites**
- Node.js v22+
- MongoDB Atlas account (or local MongoDB)
- Git & GitHub

### **Local Development**

**1. Clone & Setup**
```bash
git clone https://github.com/CFGMOHAMEDTAIEB/wasalni
cd wasalni
```

**2. Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB URI
npm run dev
# Starts on http://localhost:5000
```

**3. Frontend Setup**
```bash
cd "Cross-platform ride-sharing app"
npm install
npm run dev
# Starts on http://localhost:5175
```

**4. Test It**
- Go to http://localhost:5175
- Register a new account
- Login as Passenger or Driver
- Create a ride (if driver)
- Search for rides

### **Production Deployment**

**Backend (Render):**
- Deployed at `https://wasalni.onrender.com`
- Automatically builds from GitHub commits
- Connected to MongoDB Atlas

**Frontend (Vercel):**
- Deployed at `https://wasalni-taieb.vercel.app`
- Auto-deploys on main branch push
- Environment: `VITE_API_BASE_URL=https://wasalni.onrender.com/api`

---

## 📊 User Statistics

Once deployed:
- Track total users (passengers + drivers)
- Monitor active rides per day
- Calculate total earnings
- Rating distribution
- Most popular routes

---

## 🎓 Learning Resources

Built with:
- React Hooks & Context API
- TypeScript for type safety
- REST API best practices
- Database design patterns
- Authentication & authorization
- Real-time communication (Socket.io)
- Production deployment strategies

---

## 🔄 Development Workflow

### **Git Workflow**
```bash
git checkout -b feature/feature-name
# Make changes
git add -A
git commit -m "feat: description"
git push origin feature/feature-name
# Create Pull Request on GitHub
```

### **Code Quality**
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component reusability
- Props validation

---

## 📞 Contact & Support

- **Repository:** https://github.com/CFGMOHAMEDTAIEB/wasalni
- **Backend:** https://wasalni.onrender.com
- **Frontend:** https://wasalni-taieb.vercel.app

---

## ✨ Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Payment integration (Stripe/PayPal)
- [ ] Real-time location tracking (Google Maps)
- [ ] In-app video chat
- [ ] AI-powered matching
- [ ] Multilingual support
- [ ] Analytics dashboard
- [ ] Insurance integration

---

**Made with ❤️ using React, Node.js, and MongoDB**
