# Role-Based Access Control - User Guide

## 🎯 System Overview

Your ride-sharing app now has **3 distinct user roles** with different capabilities:

### 👥 Guest User
- **Auto-logged in** when app loads
- Can browse all published rides from home
- Cannot access protected features
- Can view ride details
- Prompt to sign in to book

### 👤 Normal User  
- **Account creation** with login
- View all available rides
- **Make reservations** on rides
- **Notifications** & **Messages** system
- View booking history
- Option to become a vehicle owner

### 🚗 Vehicle Owner
- All normal user features PLUS:
- **Publish new rides** (trajectories)
- Full **CRUD operations** on rides (Create, Read, Update, Delete)
- **View passenger requests** on published rides
- **Approve/Reject** passenger bookings
- **Track earnings** and revenue
- Lower commission rates (5% instead of 10%)
- Priority support

---

## 🔧 How to Test

### Test Guest Flow
1. Open app → You're logged in as Guest
2. Click "Rechercher" (Search) → Can view all rides
3. Try to access `/dashboard` → Redirected with login prompt
4. Click "Connexion" (Login) → Go to login page

### Test Normal User Flow
1. Go to `/login` 
2. Select **"Normal User"** (👥 icon)
3. Enter any email & password
4. Click "Sign In"
5. Now you can:
   - Click "Mes Réservations" → See booking history
   - Click bell icon → See notifications
   - Click message icon → View messages
   - Go to Dashboard → Different stats & booking management
   - Try `/publish` → Alert saying you need to be owner

### Test Vehicle Owner Flow
1. Go to `/login`
2. Select **"Vehicle Owner"** (🚗 icon)
3. Enter any email & password
4. Click "Sign In"
5. Now you can:
   - Click "Publier un trajet" → Full ride posting form
   - Click "Mes trajets" → Manage your rides
   - Go to Dashboard → 
     - See your published rides with CRUD buttons
     - See pending requests from passengers
     - View earnings breakdown
   - Different commission rate shown in fees

---

## 📊 Feature Breakdown

### Header Navigation Changes by Role

**Guest:**
```
Rechercher | Premium
```

**Normal User:**
```
Rechercher | Mes Réservations | Premium | [User Avatar ▼]
```

**Owner:**
```
Rechercher | Publier un trajet | Mes trajets | Premium | [User Avatar ▼]
```

---

### Dashboard Tab Changes

**Normal User Tabs:**
- My Reservations (active bookings)
- Messages (driver communication)
- My Profile

**Owner Tabs:**
- My Rides (manage published rides with edit/delete)
- Requests (pending passenger acknowledgments)
- Revenue (earnings breakdown)

---

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `AuthContext.tsx` | User role management & state |
| `ProtectedRoute.tsx` | Route protection wrapper |
| `Login.tsx` | 2-role login form |
| `Dashboard.tsx` | Role-adaptive dashboard |
| `Header.tsx` | Role-based navigation |
| `PublishRide.tsx` | Owner-only ride posting |

---

## 🚀 Next Steps to Complete

1. **Backend Integration**
   - Replace simulated login with real authentication
   - Store user data in database
   - Implement persistent sessions

2. **Messages System**
   - Real messaging between drivers & passengers
   - Message notifications

3. **Request Management**
   - Approve/reject passenger requests
   - Automatic notifications

4. **Payment**
   - Integrate payment gateway
   - Process commission deductions

5. **Verification**
   - Document verification for owners
   - License & insurance checks

---

## 🎨 UI Components Used

- Tabs for multi-section views
- Cards for content grouping
- Badges for status indicators
- Dropdown menus for user actions
- Protected route wrapper
- Toast notifications for feedback

---

## 💬 Example Interactions

### Publishing a Ride (Owner Only)
1. Click "Publier un trajet"
2. Fill in: From → To → Date → Time → Price → Seats → Car
3. Choose preferences (music, pets, luggage)
4. Optionally make "Featured" (costs 5 DT extra)
5. Submit → Toast notification with fee breakdown
6. Redirected to Dashboard to see new ride

### Making a Reservation (Normal User)
1. Search for rides (Home page)
2. Click ride card
3. See ride details with driver info
4. Click "Request" or "Reserve"
5. Confirmation toast
6. Can now see in "Mes Réservations" tab

### Managing Requests (Owner)
1. Go to Dashboard → "Demandes" tab
2. See pending passenger requests
3. Click "Accepter" or "Refuser"
4. Passenger gets notified of decision

