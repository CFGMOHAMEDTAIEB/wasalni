# New Backend Models - Implementation Guide

## Overview
This document details the 5 new MongoDB models added to support advanced Wasalni features beyond traditional ride-sharing.

---

## Models Summary

### 1. Parcel Model (`src/models/Parcel.ts`)
**Use Case:** Delivery service using ride-sharing network for courier services

**When to Use:**
- Users want to send packages/parcels to others
- Integration with rides (share vehicle space)
- Sender doesn't need to be on ride

**Key Features:**
- Photo evidence at pickup and delivery
- Multiple drivers can be offered the job
- Insurance value tracking
- Special handling flags (fragile, etc.)
- COD (Cash on Delivery) support

**Database Size:** ~2KB per parcel (without photos)

**Common Queries:**
```typescript
// Find parcels by driver
Parcel.find({ driverId: driverId, status: 'in_transit' })

// Find pending parcels in a region
Parcel.find({ 
  status: 'pending',
  'pickupLocation': { 
    $near: { $geometry: { type: "Point", coordinates: [lng, lat] } }
  }
})
```

---

### 2. Reclamation Model (`src/models/Reclamation.ts`)
**Use Case:** Quality assurance and complaint management system

**When to Use:**
- Users report bad driver behavior
- Damage to goods during transport
- Safety concerns
- Payment disputes
- Any quality issue

**Key Features:**
- Detailed categorization (behavior, safety, damage, etc.)
- Priority levels for admin triage
- Evidence photos support
- Admin investigation workflow
- Resolution tracking
- Both users and admins can take action

**Database Size:** ~1KB per report (without photos)

**Common Queries:**
```typescript
// Critical reports needing attention
Reclamation.find({ 
  priority: 'critical', 
  status: 'open' 
}).sort({ createdAt: -1 })

// User's complaint history
Reclamation.find({ reporterId: userId })
```

---

### 3. ShoppingRequest Model (`src/models/ShoppingRequest.ts`)
**Use Case:** Shopping proxy service - users request items be purchased and delivered

**When to Use:**
- User can't shop personally but wants items delivered
- Healthy elderly users get groceries delivered
- Emergency shopping needs
- Bulk purchases with delivery

**Key Features:**
- Budget-based shopping (handler stays within budget)
- Change return mechanism
- Delivery proof with photo
- Requester can rate handler
- Pre-defined budget prevents overspending
- COD option available

**Database Size:** ~1.5KB per request (without photos)

**Common Queries:**
```typescript
// Available shopping requests for handlers
ShoppingRequest.find({ 
  status: 'pending',
  'deliveryLocation': { 
    $near: { $geometry: { type: "Point", coordinates: [lng, lat] } }
  }
}).limit(20)

// User's shopping request history
ShoppingRequest.find({ requesterId: userId })
```

---

### 4. Louage Model (`src/models/Louage.ts`)
**Use Case:** Fixed-route intercity shared taxis (common in North Africa)

**When to Use:**
- Departing for another city with fixed schedule
- Intercity travel marketplace
- Group transportation coordination
- Budget transport between cities

**Key Features:**
- Multiple stops support for route optimization
- Recurring schedules for fixed routes
- Real-time location tracking
- Passenger manifest tracking
- Amenities listing (WiFi, AC, USB)
- Accessibility information

**Database Size:** ~3KB per louage journey

**Common Queries:**
```typescript
// Find available louages from city A to B
Louage.find({
  status: { $in: ['available', 'not_full'] },
  'startPoint.name': 'Tunis',
  'endPoint.name': 'Sfax'
})

// Fixed routes for today
Louage.find({
  fixedRoute: true,
  'schedule.day': 'monday', // or current day
  status: { $ne: 'cancelled' }
})
```

---

### 5. PushSubscription Model (`src/models/PushSubscription.ts`)
**Use Case:** Web Push API integration for browser notifications

**When to Use:**
- Sending real-time notifications to web users
- Users have opted into push notifications
- Background sync for notifications
- PWA support

**Key Features:**
- Granular notification preferences (ride/message/promo/alerts)
- Device tracking (web/mobile_web/pwa)
- Unique endpoint per device
- Encryption keys stored (p256dh, auth)
- Last used timestamp for cleanup

**Database Size:** ~400 bytes per subscription

**Common Queries:**
```typescript
// Get all active subscriptions for a user
PushSubscription.find({
  userId: userId,
  isActive: true
})

// Find subscriptions for notification campaign
PushSubscription.find({
  isActive: true,
  'notificationPreferences.promotions': true
})
```

---

## Integration Points

### With Ride Service
- **Parcel:** Can be added to ride routes for sharing delivery load
- **Louage:** Alternative to Ride for intercity journeys

### With User Service
- All models reference User model for sender/receiver/handler
- PushSubscription directly stores user notification preferences

### With Notification Service
- Reclamations trigger admin notifications
- ShoppingRequest status changes send notifications
- Louage departures generate reminders

### With Message Service
- Communication during parcel delivery
- Handler-Requester messages in shopping service
- Passenger coordination in louage

---

## Controllers to Implement

For production, you'll need controllers for:

### Parcel Controller (`parcel.controller.ts`)
```typescript
- createParcel()        // Sender creates delivery request
- getParcelById()       // Get parcel details
- updateParcelStatus()  // Driver updates status
- getMyParcels()        // Sender's parcel history
- getAssignedParcels()  // Driver's deliveries
- acceptParcel()        // Driver accepts job
- declineParcel()       // Driver refuses
- rateDelivery()        // Sender rates delivery
```

### Reclamation Controller (`reclamation.controller.ts`)
```typescript
- fileComplaint()       // User files complaint
- getComplaints()       // User's complaints
- getAdminDashboard()   // All complaints for admin
- updateComplaintStatus() // Admin action
- addAdminNotes()       // Investigation notes
- resolveComplaint()    // Admin resolves
```

### Shopping Controller (`shopping.controller.ts`)
```typescript
- createRequest()       // User creates shopping request
- getAvailableRequests() // Nearby requests for handlers
- acceptRequest()       // Handler takes job
- submitReceipt()       // Handler submits purchase
- completeDelivery()    // Delivery proof
- rateService()         // User rates handler
```

### Louage Controller (`louage.controller.ts`)
```typescript
- createLouage()        // Driver creates route
- getLouages()          // Search available
- bookSeat()            // Passenger reserves seat
- updateLocation()      // Real-time tracking
- departureNotification() // Notify passengers
- completeLouage()      // Mark as completed
```

### Push Subscription Controller (`pushSubscription.controller.ts`)
```typescript
- subscribe()           // Browser registers for push
- unsubscribe()         // User opts out
- updatePreferences()   // Change notification settings
- sendNotification()    // Admin: send to subscribers
```

---

## Database Indexes for Performance

### Critical Indexes (already in models)
- `status` + `createdAt` for listing queries
- `userId` for user-specific queries
- Geospatial indexes for location-based searches
- `isActive` for filtering active subscriptions

### Consider Adding
```typescript
// Reclamation: for admin dashboard
db.reclamations.createIndex({ priority: 1, status: 1, createdAt: -1 })

// ShoppingRequest: for handler discovery
db.shoppingrequests.createIndex({ status: 1, createdAt: -1 })

// Louage: for route searches
db.louages.createIndex({ 
  'startPoint.name': 1, 
  'endPoint.name': 1, 
  status: 1 
})
```

---

## API Route Structure

Once controllers are implemented:

```
/api/parcels
  POST /                    # Create delivery request
  GET /                     # List (filtered by role)
  GET /:id                  # Get details
  PUT /:id/status           # Update status
  POST /:id/accept          # Driver accepts
  POST /:id/decline         # Driver declines
  POST /:id/rate            # Rate delivery

/api/complaints
  POST /                    # File complaint
  GET /                     # User's complaints
  GET /admin                # Admin dashboard
  PUT /:id                  # Update status
  POST /:id/resolve         # Resolve

/api/shopping
  POST /                    # Create request
  GET /available            # Search for handlers
  POST /:id/accept          # Handler accepts
  POST /:id/receipt         # Submit receipt
  POST /:id/complete        # Deliver
  POST /:id/rate            # Rate handler

/api/louage
  POST /                    # Create route
  GET /                     # Search routes
  POST /:id/book            # Book seat
  PUT /:id/location         # Update location
  POST /:id/complete        # Mark completed

/api/push
  POST /subscribe           # Register for push
  DELETE /subscribe         # Unsubscribe
  PUT /preferences          # Update preferences
  POST /send-notification   # Admin send
```

---

## Real-Time Features

### Socket.io Namespaces to Add

```typescript
// Parcel delivery tracking
socket.on('parcel:location-update', (parcelId, location) => {})

// Louage passenger coordination
socket.on('louage:seat-booked', (louageId, seat) => {})

// Shopping proxy communication
socket.on('shopping:status-update', (requestId, status) => {})

// Complaint investigation updates
socket.on('complaint:status-changed', (complaintId, status) => {})
```

---

## Security Considerations

1. **Parcel:** Verify sender identity before delivery
2. **Reclamation:** Prevent abuse (false complaints limit per user)
3. **Shopping:** Validate budget constraints
4. **Louage:** License verification for drivers
5. **PushSubscription:** Validate subscription ownership

---

## Testing Checklist

- [ ] Create parcel with all required fields
- [ ] Update parcel status transitions (pending → assigned → in_transit → delivered)
- [ ] Multiple drivers approaching parcel
- [ ] File complaint with evidence photos
- [ ] Admin resolution workflow
- [ ] Shopping request with budget enforcement
- [ ] Louage creation with fixed schedule
- [ ] Real-time location updates
- [ ] Push notification subscription on browser
- [ ] Notification preferences update

---

## Deployment Notes

1. Ensure MongoDB indexes are created before production
2. Add rate limiting to complaint filing (prevent spam)
3. Implement admin approval for large refunds
4. Archive old reclamations quarterly
5. Set TTL for expired shopping requests
6. Validate SSL certificate for push service endpoint

---

## Next Steps

1. Implement controllers for each model
2. Create route handlers
3. Add Socket.io event handlers
4. Implement frontend components for each service
5. Add comprehensive error handling
6. Set up monitoring/logging
