# WASALNI Advanced Features - Implementation Roadmap

**Date:** April 5, 2026  
**Status:** Planning Phase  
**Remaining Tasks:** 7 major features

---

## 📋 Features Overview & Priority Matrix

### Feature 1: **Colis (Parcel Delivery)** ⭐⭐⭐ HIGH PRIORITY
**Complexity:** Medium (3-4 days)  
**Impact:** Revenue stream + high engagement

**What It Does:**
- Users can send parcels between cities
- Drivers can deliver parcels alongside passengers
- Real-time tracking with tracking code
- Commission: 5% of delivery price

**Backend Required:**
- Colis Model (MongoDB)
- Parcel tracking routes
- Matching algorithm (driver routes match parcel routes)
- Status management (pending → picked → delivered)

**Frontend Required:**
- Colis page with 2 tabs: "Envoyer" (send) + "Suivre" (track)
- Parcel details form (weight, dimensions, fragility)
- Tracking interface
- Driver notifications

---

### Feature 2: **Leaflet Map + Live Location** ⭐⭐⭐ HIGH PRIORITY
**Complexity:** Medium (2-3 days)  
**Impact:** Essential UX feature

**What It Does:**
- Show live driver location on map
- Real-time updates via Socket.io
- Route visualization
- Multi-stop routes

**Backend Required:**
- Location update endpoint: `PUT /api/rides/:id/live-location`
- Socket.io event: `driver:location-update`

**Frontend Required:**
- Leaflet map component
- Live marker tracking
- Route polyline drawing
- Map integration on:
  - Ride details page
  - Booking tracking page
  - Driver dashboard

---

### Feature 3: **Demande d'Achat (Shopping Proxy)** ⭐⭐ MEDIUM PRIORITY
**Complexity:** Medium (2-3 days)  
**Impact:** Additional revenue + brand differentiation

**What It Does:**
- Users request items to be purchased from stores
- Drivers deliver purchased items
- Shopping list → Price quote → Order → Delivery

**Backend Required:**
- ShoppingRequest Model
- Shopping matching algorithm
- Payment integration

**Frontend Required:**
- Shopping request form
- Item browsing
- Delivery tracking

---

### Feature 4: **Reclamation/Report System** ⭐⭐⭐ HIGH PRIORITY
**Complexity:** Low-Medium (1-2 days)  
**Impact:** Safety + Trust

**What It Does:**
- Report issues with rides/drivers
- Report problems with colis/shopping
- Admin dashboard to manage reports
- Resolution tracking

**Backend Required:**
- Reclamation Model
- Report routes & admin endpoints
- Status workflow

**Frontend Required:**
- Report button on relevant pages
- Modal to fill report details
- Admin dashboard

---

### Feature 5: **Push Notifications + In-app Toasts** ⭐⭐⭐ HIGH PRIORITY
**Complexity:** Low (1-2 days)  
**Impact:** User engagement + real-time updates

**What It Does:**
- Browser push notifications (for bookings, messages, etc.)
- In-app toasts (using Sonner - already integrated)
- Notification preferences
- Web Workers for background notifications

**Backend Required:**
- Notification endpoint improvements
- Web push service configuration

**Frontend Required:**
- Push notification permission request
- Service Worker registration
- Notification event listeners

---

### Feature 6: **Louage (Fixed-Route Taxi) Mode** ⭐ LOWER PRIORITY
**Complexity:** High (3-4 days)  
**Impact:** New market segment

**What It Does:**
- Fixed routes (e.g., Tunis ↔ Sfax)
- Scheduled departures
- No seat selection (linear fill)
- Frequent service

**Backend Required:**
- Louage Model
- Fixed route management
- Departure scheduling

**Frontend Required:**
- Louage page with route directory
- Booking simplified (pick seats only)
- Driver dashboard for frequent routes

---

### Feature 7: **Pro UI Redesign (CityGo-style)** ⭐ LOWER PRIORITY
**Complexity:** High (4-5 days)  
**Impact:** Market positioning

**What It Does:**
- Modern, professional UI overhaul
- CityGo design inspiration
- Better visual hierarchy
- Improved mobile experience

---

## 📊 Implementation Timeline

### Week 1 (Priority Features)
```
Day 1-2: Colis Backend + Frontend
Day 2-3: Leaflet Map Integration
Day 3-4: Push Notifications
Day 4-5: Reclamation System
```

### Week 2 (Secondary Features)
```
Day 1-2: Louage Mode
Day 2-3: Demande d'Achat
Day 3-5: Pro UI Redesign
```

---

## 🎯 Quick Feature Descriptions

### Colis Flow
```
Sender:
1. Go to /colis (Envoyer tab)
2. Enter receiver name, phone, cities, item details, dimensions
3. System shows available drivers with matching routes
4. Choose driver
5. Pay (including commission)
6. Get tracking code

Receiver:
1. Go to /colis (Suivre tab)
2. Enter tracking code
3. See real-time driver location
4. Track status: pending → picked → in-transit → delivered

Driver:
1. Dashboard shows "New Colis Available"
2. Accept colis
3. Pickup item at sender location
4. Deliver to receiver
5. Mark delivered
6. Get commission (5% of delivery price)
```

---

### Leaflet Map Flow
```
User on Ride Details:
1. See "View Live Location" button
2. Click → Map opens (Leaflet)
3. See driver's current location (real-time)
4. Watch driver move towards pickup
5. See pickup and destination markers
6. See route polyline
```

---

### Demande d'Achat Flow
```
Buyer:
1. Go to /shopping (Demander tab)
2. List items needed (store, items, budget)
3. Browse shopping offers from drivers
4. Accept driver's quote
5. Driver purchases + delivers
6. Pay driver commission (10%)

Seller:
1. Go to /shopping (Offres tab)
2. See shopping requests
3. Submit quote for items + delivery fee
4. If accepted, purchase and deliver
5. Get commission
```

---

### Reclamation Flow
```
User experiences issue:
1. Click "Signaler un problème" button anywhere (ride, parcel, shopping)
2. Select category (comportement, sécurité, qualité, etc.)
3. Write description + upload photo if needed
4. Submit

Admin:
1. Dashboard: /admin/reclamations
2. See all complaints with status
3. Review details
4. Take action (warn driver, refund, etc.)
5. Mark resolved
```

---

### Push Notification Flow
```
Setup (on first visit):
1. App requests notification permission
2. User grants or denies
3. Register Service Worker
4. Save subscription endpoint

Events:
- New booking request → Browser notification + in-app toast
- Message received → Notification + sound
- Parcel picked up → Notification
- Driver nearby → Notification
- Special events → Toast only (if page is open)
```

---

### Louage Flow
```
User:
1. Go to /louage
2. Select route (Tunis → Sfax)
3. Select departure time
4. Select seats (no pre-selection needed)
5. Book

Driver:
1. Post Louage "route" (not individual rides)
2. Set departure times (recurring or one-time)
3. Dashboard shows occupancy per departure
4. Mark departed when 80% full or time reached
5. Get income from all bookings
```

---

## 🛠️ Technical Stack

### New Dependencies to Add
```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.3",
  "web-push": "^3.6.7",
  "socket.io-client": "^4.7.0"
}
```

### Backend Models to Create
1. **Colis** - Parcel delivery
2. **ShoppingRequest** - Shopping proxy requests
3. **Reclamation** - Reports/complaints
4. **Louage** - Fixed-route taxis
5. **PushSubscription** - User notification endpoints

### Frontend Pages/Components to Create
1. **/colis** - Parcel delivery page
2. **/shopping** - Shopping proxy page
3. **Map Component** - Leaflet map with live tracking
4. **ReportModal** - Generic report modal
5. **/louage** - Fixed-route taxi page
6. **PushNotificationService** - Service Worker + notifications

---

## ⚠️ Implementation Questions for You

Before I start implementation, please clarify:

1. **Priority Order:** Which features should I build in which order?
   - Suggestion: Colis → Map → Reclamation → Push → Louage → Shopping → UI

2. **Map Library:** Confirm Leaflet.js + react-leaflet?
   - Alternative: Google Maps API (costs money but richer features)

3. **Push Notifications:** Browser notifications only, or also in-app?
   - I recommend: Browser + in-app toasts (already have Sonner)

4. **Louage Routes:** How many fixed routes to hardcode initially?
   - Suggestion: 5-10 popular routes (Tunis-Sfax, Tunis-Sousse, etc.)

5. **Shopping Proxy:** Minimum viable feature or full implementation?
   - Sketch: Just send request + accept offer, or full shopping cart?

6. **UI Redesign:** CityGo inspiration or complete overhaul?
   - Sketch: Partial update (header, cards) or total rebuild?

---

## 📊 Effort Estimation

| Feature | Days | Complexity | Type |
|---------|------|-----------|------|
| Colis | 3-4 | Medium | Both |
| Map | 2-3 | Medium | Frontend-heavy |
| Reclamation | 1-2 | Low | Both |
| Push Notif | 1-2 | Low | Both |
| Louage | 3-4 | High | Both |
| Shopping | 2-3 | Medium | Both |
| UI Design | 4-5 | High | Frontend |
| **TOTAL** | **17-23** | - | - |

---

## ✅ Next Steps

1. **Confirm priorities** from you
2. **Start implementation** in priority order
3. **Build backend API endpoints** for each feature
4. **Create frontend components & pages**
5. **Integrate real-time features** (Socket.io)
6. **Testing & deployment**

---

## 📌 Current Status

- **Backend:** 60% complete (authentication, rides, bookings, users)
- **Frontend:** 50% complete (pages, components, navigation)
- **Assets:** All UI components ready (Button, Card, Dialog, etc.)
- **Build:** ✅ Passing (488 KB bundle)

**Ready to add:** All 7 new features with existing architecture
