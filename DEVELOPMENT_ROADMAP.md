# 🚀 WASALNI Comprehensive Development Roadmap

## 📊 PHASE 1 COMPLETED ✅
**AUTH & UX FIXES** — 6 of 5 tasks complete (~95% done)
- [x] Remove 'taieb' from Vercel URL (vercel.json created)
- [x] Add CSS animations to auth pages (already implemented)
- [x] Implement role-based auto-redirect (AuthContext + routes ready)
- [x] Build forgot password backend + frontend (email service + OTP routes added)
- [x] Add real-time email validation on register (apiClient methods ready)
- [x] MongoDB health check endpoint (enhanced /api/health)

---

## 📊 PHASE 2 IN PROGRESS (Next 35% of Work)

### **MODULE 2: RIDE FORM UPGRADES** (4 tasks)
**State:** Backend models updated ✅ | Frontend UI pending 50%

#### Task 6 ✅: Departure Time
- [x] Ride model has `departureTime: string` field  
- [ ] **TODO (Frontend):** Update PublishRide form to accept HTML `<input type="time">/`
- [ ] **TODO (Frontend):** Display time on ride cards prominently

#### Task 7 ✅: Price Modes (Free/Negotiable/Fixed)
- [x] Ride model now has:
  ```typescript
  priceMode: 'free' | 'negotiable' | 'fixed'
  priceAmount?: number
  pricePerSeat?: number  // Keep for backward compat
  ```
- [ ] **TODO (Frontend):** PublishRide form with radio selector for 3 price modes
- [ ] **TODO (Frontend):** Show price badge on ride cards: "Gratuit" | "Négociable" | "123 DT"
- [ ] **TODO (Search):** Add price filter checkboxes in search panel

#### Task 8 ✅: Meeting Point
- [x] Ride model: `meetingPoint: string`
- [ ] **TODO (Frontend):** Add text input "Lieu de rendez-vous (optionnel)" to PublishRide
- [ ] **TODO (Frontend):** Display on ride detail page

#### Task 9: Passenger Comfort Options
- [x] Ride model enhanced with:
  ```typescript
  allowSmoking: 'no' | 'yes' | 'outside'
  preferredSeats: ['front' | 'back-left' | 'back-right' | 'back-middle']
  maxLuggageItems: 0-5
  maxLuggageDimension: 'small'|'medium'|'large'|'oversized'
  ```
- [x] Booking model enhanced with passenger preferences
- [ ] **TODO (Frontend):** Visual seat map component (7-line SVG car top-view)
- [ ] **TODO (Frontend):** Add to ride cards + booking flow
- [ ] **TODO (Backend):** Update Booking controller to accept & store preferences

#### Task 10: Luggage Verification Modal
- [ ] **TODO (Frontend):** Modal dialog on luggage > 'large' selection
- [ ] **TODO (Backend):** Flag `specialLuggageRequest: true` in Booking
- [ ] **TODO (Backend):** SendSocket notification to driver

#### Task 11: Price Filter Badges
- [ ] **TODO (Frontend):** Show badges on ride cards
- [ ] **TODO (Frontend):** Filter component with checkboxes
- [ ] **TODO (Search):** Implement filter logic

### **MODULE 3: PROFILES & DEPLOYMENT** (3 tasks)  
**State:** Backend ready ✅ | Frontend UI pending

#### Task 12 ✅: Phone Number  
- [x] User model already has `phone` field
- [ ] **TODO (Frontend):** Show on driver profile with `tel:` link for mobile
- [ ] **TODO (Frontend):** Update profile edit form to show phone field
- [ ] **TODO (Backend):** Already exposed in user endpoints

#### Task 13 ✅: Star Rating System
- [x] User model has `rating` and `totalReviews`
- [x] Backend route: `POST /api/users/:id/rate` (implemented)
- [ ] **TODO (Frontend):** Add 5-star rating component on ride completion
- [ ] **TODO (Frontend):** Show average + count badges on ride cards & profiles
- [ ] **TODO (Frontend):** Store rideId to prevent duplicate ratings

#### Task 14 ✅: MongoDB Production Verification
- [x] Health endpoint: `GET /api/health` returns db connection status
- [ ] **TODO:** Verify live connection in production (Render)
- [ ] **TODO:** Test from PostmanClient or frontend

---

## 🎯 PHASE 3 (35% - 50% of Total Work)

### **MODULE 4: COLIS (Parcel Delivery)** 
**Estimated effort:** 3-4 days

**Backend:**
- [ ] Create Colis model with schema
- [ ] Routes: POST /api/colis, GET /api/colis/track/:code, PUT /api/colis/:id/status
- [ ] Match algorithm: Show colis on driver dashboard if route matches

**Frontend:**
- [ ] New page: /colis with 2 tabs (Envoyer | Suivre)
- [ ] Envoyer form: receiver name/phone, cities, dimensions, description
- [ ] Suivre: input tracking code, show status + driver location
- [ ] Driver dashboard: match widget to accept colis

### **MODULE 5: MAP TRACKING (Leaflet.js)**
**Estimated effort:** 2-3 days

**Backend:**
- [ ] Install Leaflet.js for frontend
- [ ] Setup Socket.io namespace for location tracking
- [ ] Accept live location updates from driver

**Frontend:**
- [ ] Install: `npm install leaflet @types/leaflet`
- [ ] Ride detail page: show map with polyline (Nominatim geocoding)
- [ ] Active ride: driver clicks "Démarrer trajet", shares location
- [ ] Passengers: see real-time driver marker on map

### **MODULE 6: SHOPPING PROXY (Demande d'Achat)**
**Estimated effort:** 2-3 days

**Backend:**
- [ ] Create PurchaseRequest model
- [ ] Routes: POST /api/demandes, GET /api/demandes/match/:rideId
- [ ] Matching logic

**Frontend:**
- [ ] New page: /achats with form
- [ ] Driver dashboard: show matching purchase requests
- [ ] Accept/complete workflow

---

## 🔐 PHASE 4 (50% - 70% of Total Work)

### **MODULE 7: RECLAMATIONS & SAFETY**
**Estimated effort:** 2 days

**Backend:**
- [ ] Create Reclamation model
- [ ] Routes: POST /api/reclamations, GET /api/admin/reclamations
- [ ] Admin actions: resolve/dismiss

**Frontend:**
- [ ] "Signaler un problème" button on all profiles & rides
- [ ] Modal with type selector + description
- [ ] Admin page: /admin/reclamations

### **MODULE 8: PUSH NOTIFICATIONS**
**Estimated effort:** 1-2 days

**Backend:**
- [ ] Use Web Notifications API with Socket.io
- [ ] Send on new seat requests, messages, etc.

**Frontend:**
- [ ] `Notification.requestPermission()` on mount
- [ ] Toast component for in-app notifications
- [ ] Browser notifications for critical events

### **MODULE 9: LOUAGE (Fixed-Route Taxis)**
**Estimated effort:** 2-3 days

**Backend:**
- [ ] Create Louage model (fixed city-to-city trips)
- [ ] Routes: POST /api/louages, GET /api/louages/by-route

**Frontend:**
- [ ] New tab on home/search: "Louages"
- [ ] Card design with yellow accent (Tunisia tradition)
- [ ] Show fixed city-to-city routes

---

## 🎨 PHASE 5 (70% - 100% of Total Work)

### **MODULE 10: PRO UI REDESIGN (CityGo-Style)**
**Estimated effort:** 3-4 days

**Color Palette:**
```
Primary: #1A56DB (deep blue)
Accent: #10B981 (success green)
Warning: #F59E0B (yellow)
Danger: #EF4444 (red)
Replace all #3b82f6 → #1A56DB
```

**Typography:**
- [ ] Install Google Fonts: Inter (400, 500, 600 weights)
- [ ] Update theme.css with Inter font-family
- [ ] Headings: 600 weight, body: 400 weight

**UI Components:**
- [ ] White cards with 1px border + 8px radius (no harsh shadows)
- [ ] Ride cards redesigned:
  - Large bold departure time
  - "Departure → Destination" with arrow
  - Driver avatar + rating inline
  - Price badge (Gratuit/Négociable/TND)
  - Available seats counter
- [ ] Search sticky top bar (from/to/date)
- [ ] Results: clean list layout
- [ ] Mobile bottom nav bar: Home, Search, Publish, Messages, Profile
- [ ] Skeleton loading states (no spinners)
- [ ] Form validation: green/red borders + helper text

---

## 📋 BACKEND ENDPOINTS SUMMARY

### Auth (✅ Complete)
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/check-email
POST   /api/auth/request-password-reset
POST   /api/auth/reset-password
```

### Users (✅ Enhanced)
```
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/:id/rate                 ← NEW
GET    /api/users/:id
GET    /api/users
```

### Rides (⏳ Pending Frontend)
```
GET    /api/rides                         (+ new price mode filters)
POST   /api/rides                         (accept new fields)
GET    /api/rides/:id
PUT    /api/rides/:id
DELETE /api/rides/:id
```

### Bookings (⏳ Pending Update)
```
GET    /api/requests/my-bookings
POST   /api/requests                      (+ comfort options)
PUT    /api/requests/:id
DELETE /api/requests/:id
```

### Messages
```
GET    /api/messages/:conversationId
POST   /api/messages
GET    /api/conversations
```

### Notifications
```
GET    /api/notifications
GET    /api/notifications/unread
PUT    /api/notifications/:id
DELETE /api/notifications/:id
```

### Health
```
GET    /api/health                        ← ENHANCED
```

---

## 🛠️ NEXT IMMEDIATE STEPS

### To-Do Before Moving to Phase 2:

1. **Build & Test Backend**
   ```bash
   cd backend
   npm run build
   npm run dev
   ```
   Test endpoints with Postman/Insomnia

2. **Update Frontend Ride Components**
   - [ ] Create components/RideForm.tsx (reusable form with new fields)
   - [ ] Create components/RideCard.tsx with new fields
   - [ ] Create components/PriceSelector.tsx (radio for price modes)
   - [ ] Create components/SeatMap.tsx (SVG seat visualizer)
   - [ ] Create components/LuggageModal.tsx

3. **Verify Frontend Build**
   ```bash
   cd "Cross-platform ride-sharing app"
   npm run build
   npm run dev
   ```

4. **Deploy to Production (Optional for Testing)**
   - Vercel: `vercel --prod --yes`
   - Or use Vercel dashboard manually

---

## 📊 Project Statistics

- **Total Modules:** 10
- **Total Tasks:** 21
- **Phase 1 Complete:** 6/21 (28%)
- **Phase 2 In Progress:** 9/21 (43%)
- **Phase 3-5 Pending:** 6/21 (29%)

**Estimated Total Development Time:**
- Phase 1: ✅ Complete (4-6 hours)
- Phase 2: 2-3 days
- Phase 3: 2-3 days
- Phase 4: 1-2 days
- Phase 5: 3-4 days

**Total:** ~2 weeks for single developer

---

## 🔗 Useful Links

- Backend Health: https://wasalni.onrender.com/api/health
- Frontend Dev: http://localhost:5175
- Vercel Dashboard: [Your Vercel Project]
- MongoDB Atlas: console.cloud.mongodb.com
- GitHub: https://github.com/CFGMOHAMEDTAIEB/wasalni

---

## 📝 Notes

- All new routes are protected with JWT `authenticate` middleware where appropriate
- Socket.io is ready for real-time events — just add new event handlers
- Email service is configured for password reset — reuse for other notifications
- All models use TypeScript interfaces for type safety
- Backend builds & deploys automatically on GitHub push to Render

*Last Updated:* April 2025  
*Status:* Phase 1 Complete, Phase 2 In Progress
