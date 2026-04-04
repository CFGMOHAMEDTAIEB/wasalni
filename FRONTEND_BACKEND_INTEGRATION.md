# Frontend-Backend Integration Guide

## Complete Setup for Real API Connection

This guide walks you through connecting your React frontend to the Node.js backend API.

---

## Part 1: Backend Setup

### 1.1 Start Backend Server

```bash
cd backend
npm install
npm run dev
```

Expected output:
```
✅ Server running on port 5000
✅ MongoDB connected successfully
```

### 1.2 Verify Backend is Working

```bash
curl http://localhost:5000/health
# Response: {"status":"OK","timestamp":"..."}
```

---

## Part 2: Frontend Setup

### 2.1 Install Dependencies

```bash
cd "Cross-platform ride-sharing app"
npm install axios socket.io-client
```

### 2.2 Create API Service

Create file: `src/services/api.ts`

```typescript
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token expiry
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            { refreshToken }
          );

          const { token } = response.data;
          localStorage.setItem('token', token);
          
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2.3 Create Socket.io Service

Create file: `src/services/socket.ts`

```typescript
import io, { Socket } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketManager {
  private socket: Socket | null = null;

  connect(userId: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to server');
      this.socket?.emit('join_room', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Event listeners
  onNewBookingRequest(callback: (data: any) => void) {
    this.socket?.on('new_booking_request', callback);
  }

  onBookingAccepted(callback: (data: any) => void) {
    this.socket?.on('booking_accepted', callback);
  }

  onBookingRejected(callback: (data: any) => void) {
    this.socket?.on('booking_rejected', callback);
  }

  onNewMessage(callback: (data: any) => void) {
    this.socket?.on('new_message', callback);
  }
}

export const socketManager = new SocketManager();
```

### 2.4 Update AuthContext

Replace `src/app/context/AuthContext.tsx`:

```typescript
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { socketManager } from '../../services/socket';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'guest' | 'normal' | 'owner';
  avatar?: string;
  verified: boolean;
  rating: number;
  reviews: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string, role: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      // Auto-login as guest
      setUser({
        id: 'guest',
        name: 'Guest User',
        email: '',
        role: 'guest',
        verified: false,
        rating: 0,
        reviews: 0,
      });
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/users/profile');
      const userData = response.data.user;
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        avatar: userData.avatar,
        verified: userData.verified,
        rating: userData.rating,
        reviews: userData.reviews,
      });
      setIsAuthenticated(true);

      // Connect to socket with user ID
      socketManager.connect(userData.id);
    } catch (error) {
      console.error('Profile fetch failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  };

  const login = async (email: string, password: string, role: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/auth/login', {
        email,
        password,
        role,
      });

      const { token, refreshToken, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: userData.avatar,
        verified: userData.verified,
        rating: userData.rating,
        reviews: userData.reviews,
      });

      setIsAuthenticated(true);

      // Connect to socket
      socketManager.connect(userData.id);
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone: string, role: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/auth/register', {
        name,
        email,
        password,
        phone,
        role,
      });

      const { token, refreshToken, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: userData.avatar,
        verified: userData.verified,
        rating: userData.rating,
        reviews: userData.reviews,
      });

      setIsAuthenticated(true);

      // Connect to socket
      socketManager.connect(userData.id);
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
    socketManager.disconnect();
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function useAuthRole() {
  const { user } = useAuth();
  return {
    isGuest: user?.role === 'guest',
    isNormalUser: user?.role === 'normal',
    isOwner: user?.role === 'owner',
    hasRole: (role: string | string[]) => {
      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(user?.role || '');
    },
  };
}
```

### 2.5 Update Dashboard to Fetch Real Data

Replace `src/app/pages/Dashboard.tsx` home content:

```typescript
import { useEffect, useState } from 'react';
import apiClient from '../../services/api';
import { useAuth } from '../context/AuthContext';
import { socketManager } from '../../services/socket';

export function Dashboard() {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role === 'guest') return;

    const fetchData = async () => {
      try {
        if (user.role === 'owner') {
          // Fetch owner's rides
          const ridesRes = await apiClient.get('/rides?page=1&limit=10');
          const ownerRides = ridesRes.data.rides.filter((r: any) => r.driver.id === user.id);
          setRides(ownerRides);

          // Fetch booking requests
          const requestsRes = await apiClient.get('/requests/requests');
          setRequests(requestsRes.data.bookings || []);
        } else {
          // Fetch normal user bookings
          const bookingsRes = await apiClient.get('/requests/my-bookings');
          setBookings(bookingsRes.data.bookings || []);
        }

        // Fetch notifications
        const notifRes = await apiClient.get('/notifications?page=1&limit=10');
        setNotifications(notifRes.data.notifications || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Setup real-time listeners
    socketManager.onNewBookingRequest((data) => {
      console.log('New booking request:', data);
      setRequests(prev => [data, ...prev]);
    });

    socketManager.onBookingAccepted((data) => {
      console.log('Booking accepted:', data);
    });

    return () => {
      // Cleanup listeners
    };
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // ... rest of component using real data
}
```

### 2.6 Add Environment File

Create `.env.local` in frontend root:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## Part 3: Test the Integration

### 3.1 Test Registration

1. Go to frontend: `http://localhost:5173`
2. Click "Connexion"
3. Register a new account
4. Check browser console for Socket connection message

### 3.2 Test Login

1. Use registered credentials
2. Should redirect to dashboard
3. Should see real user data from backend

### 3.3 Test Ride Creation (Owner)

1. Login as owner
2. Go to "Publier un trajet"
3. Create a ride using the form
4. Check MongoDB to verify ride was saved

### 3.4 Test Real-Time Updates

1. In one browser, login as owner
2. In another browser, login as normal user
3. Normal user requests a seat
4. Owner should see new notification in real-time

### 3.5 Test File Upload

1. Update profile
2. Upload a profile image
3. Check Cloudinary dashboard to verify upload

---

## Part 4: API Testing Examples

### Create a Ride

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

### Search Rides

```bash
curl 'http://localhost:5000/api/rides/search?origin=Tunis&destination=Sousse&date=2024-01-20'
```

### Make a Booking Request

```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rideId": "ride-id-here",
    "seatsBooked": 2
  }'
```

### Accept/Reject Request

```bash
curl -X PUT http://localhost:5000/api/requests/request-id/respond \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "status": "accepted" }'
```

---

## Part 5: Troubleshooting

### Common Issues

**Frontend can't connect to backend**
- Check backend is running on port 5000
- Verify FRONTEND_URL in backend .env
- Check CORS errors in browser console

**JWT token expired**
- Frontend automatically uses refresh token to get new one
- If fails, user is logged out automatically

**Socket.io not connecting**
- Check Socket.io is enabled in server.ts
- Verify socket events are emitted correctly
- Check browser dev tools Network tab for ws connections

**File uploads not working**
- Verify Cloudinary credentials in .env
- Check file size isn't exceeding 5MB limit
- Ensure file format is JPEG, PNG, WebP, or GIF

**Database connection failed**
- Check MongoDB is running
- Verify MONGODB_URI is correct
- For MongoDB Atlas, check IP whitelist

---

## Part 6: Security Checklist

- [ ] Never commit .env files
- [ ] Use strong JWT secrets (min 32 characters)
- [ ] Enable HTTPS in production
- [ ] Setup CORS properly for your domain
- [ ] Use rate limiting (already enabled)
- [ ] Validate all inputs on backend
- [ ] Hash passwords (already using bcrypt)
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Test with various invalid inputs

---

## Next Steps

1. **Test all features thoroughly**
2. **Add more validation**
3. **Setup error logging (Sentry, LogRocket)**
4. **Add analytics tracking**
5. **Implement payment processing**
6. **Setup CI/CD pipeline**
7. **Deploy to production**

---

**Integration Status:** ✅ Complete  
**Last Updated:** April 4, 2026
