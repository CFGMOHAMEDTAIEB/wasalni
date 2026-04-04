# Wasalni Backend - Quick Start

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with MongoDB URI and JWT secrets
```

### 3. Start MongoDB
```bash
# Local: mongod
# Or use MongoDB Atlas (cloud)
```

### 4. Run Server
```bash
npm run dev
# Server starts at http://localhost:5000
```

### 5. Test It Works
```bash
curl http://localhost:5000/health
# Response: {"status":"OK","timestamp":"..."}
```

---

## 📄 API Quick Reference

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | `/api/auth/register` | No | - |
| POST | `/api/auth/login` | No | - |
| GET | `/api/users/profile` | Yes | All |
| GET | `/api/rides` | No | All |
| POST | `/api/rides` | Yes | Owner |
| GET | `/api/requests/my-bookings` | Yes | All |
| POST | `/api/requests` | Yes | All |
| GET | `/api/messages/:conversationId` | Yes | All |
| GET | `/api/notifications` | Yes | All |

---

## 🔗 Connect Frontend

### 1. Create API Service (frontend/src/services/api.ts)
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

### 2. Update AuthContext Login
```typescript
import api from '../../services/api';

export const login = async (email: string, password: string, role: string) => {
  const response = await api.post('/auth/login', { email, password, role });
  const { token, user } = response.data;
  
  localStorage.setItem('token', token);
  setUser(user);
  setIsAuthenticated(true);
};
```

---

## 📦 Project Structure

```
backend/
├── src/
│   ├── config/          # Database config
│   ├── controllers/      # Business logic
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth, error handling
│   ├── services/         # Utilities
│   └── server.ts         # App entry point
├── dist/                 # Compiled JS
├── package.json
├── tsconfig.json
├── .env                  # Local config
└── BACKEND_SETUP.md      # Full docs
```

---

## 🛠️ Development Commands

```bash
npm run dev         # Start with auto-reload
npm run build       # Build TypeScript
npm start           # Run production build
npm run seed        # Seed demo data (coming soon)
```

---

## 🔑 Key Features Implemented

✅ JWT Authentication with refresh tokens
✅ Role-based access control (Guest, Normal, Owner)
✅ Ride CRUD operations
✅ Booking/Request management
✅ Real-time Socket.io for notifications
✅ Message system
✅ Commission calculation (10% standard, 5% premium)
✅ MongoDB integration
✅ Error handling & validation
✅ CORS & security headers

---

## 🚀 Deployment

### Heroku
```bash
npx heroku create wasalni-backend
git push heroku main
```

### Railway / Render
Connect GitHub repo → auto-deploy on push

### Production Checklist
- [ ] Update .env with production values
- [ ] Enable HTTPS
- [ ] Set secure JWT secrets
- [ ] Configure MongoDB Atlas
- [ ] Set FRONTEND_URL to production domain
- [ ] Test all endpoints
- [ ] Setup monitoring/logging

---

## 📚 Full Documentation

See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for:
- Complete API reference
- Database schema details
- Socket.io events
- Frontend integration guide
- Troubleshooting

---

## 💡 Example: Create a Ride with Real Frontend

### Backend (Ride Creation)
```bash
POST /api/rides
Authorization: Bearer your_jwt_token
{
  "origin": "Tunis",
  "destination": "Sousse",
  "date": "2024-01-20T08:00:00Z",
  "departureTime": "08:00",
  "totalSeats": 4,
  "pricePerSeat": 45
}
```

### Frontend (PublishRide.tsx Update)
```typescript
import api from '../../services/api';

const handlePublish = async (formData) => {
  try {
    const response = await api.post('/rides', {
      origin: formData.from,
      destination: formData.to,
      date: formData.date,
      departureTime: formData.time,
      totalSeats: formData.seats,
      pricePerSeat: formData.price,
      // ... other fields
    });
    
    console.log('Ride published:', response.data);
    navigate('/dashboard');
  } catch (error) {
    console.error('Publish failed:', error);
  }
};
```

---

**Status:** ✅ Ready for Development  
**Environment:** Node.js + Express + MongoDB  
**Last Updated:** April 4, 2026
