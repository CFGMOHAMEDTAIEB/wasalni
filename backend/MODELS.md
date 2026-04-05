# Wasalni Backend Models Documentation

## Overview
This document describes all MongoDB models used in the Wasalni ride-sharing application. The backend supports multiple services: ride-sharing, parcel delivery, shopping proxies, fixed-route taxis (louage), and reporting system.

## Models

### 1. User Model (`User.ts`)
Core user model for all app users (drivers, passengers, handlers).

**Key Fields:**
- `email`: Unique email address
- `password`: Hashed password
- `phoneNumber`: Phone number with country code
- `name`, `firstName`, `lastName`: User identification
- `profilePhoto`: URL to profile image
- `role`: 'driver', 'passenger', 'shopping_handler', or 'admin'
- `isActive`: Account status
- `isVerified`: Email/phone verification status
- `rating`: Average rating (1-5)
- `totalTrips`: Number of completed rides
- `bankDetails`: For payment transfers
- `emergencyContacts`: Safety feature
- `preferences`: Notification and privacy settings

**Relationships:** Referenced by Ride, Booking, Message, Notification, Parcel, etc.

---

### 2. Ride Model (`Ride.ts`)
Represents ride-sharing requests and journeys.

**Key Fields:**
- `driverId`: Driver's user ID
- `pickupLocation`: Origin with coordinates
- `dropoffLocation`: Destination with coordinates
- `route`: Polyline or waypoints
- `scheduledTime`: For scheduled rides
- `pricePerSeat`: Cost for each passenger
- `totalSeats`: Vehicle capacity
- `availableSeats`: Current availability
- `status`: 'pending', 'active', 'in_progress', 'completed', 'cancelled'
- `passengers`: Array of passenger bookings
- `totalDistance`: Calculated distance
- `estimatedDuration`: ETA in minutes
- `actualDuration`: Final duration after completion
- `paymentMethod`: 'cash', 'card', 'wallet'
- `ratings`: Passenger and driver ratings

**Relationships:** Driver (User), Passengers (through Booking), Messages, Notifications

---

### 3. Booking Model (`Booking.ts`)
Represents passenger bookings for rides.

**Key Fields:**
- `rideId`: Reference to the ride
- `passengerId`: Reference to the passenger
- `driverId`: Reference to the driver
- `status`: 'confirmed', 'active', 'completed', 'cancelled'
- `pickupLocation`: Where passenger boards
- `dropoffLocation`: Where passenger gets off
- `bookedSeats`: Number of seats reserved
- `pricePerSeat`: Price agreed
- `paymentMethod`: Payment type
- `paymentStatus`: 'pending', 'completed', 'refunded'
- `pickupCode`: For passenger verification
- `actualPickupTime`: When passenger was picked up
- `actualDropoffTime`: When passenger was dropped off
- `passengerRating`: Rating given to driver
- `driverRating`: Rating given to passenger

**Relationships:** Ride, Passenger (User), Driver (User)

---

### 4. Parcel Model (`Parcel.ts`)
Represents parcel/package delivery requests.

**Key Fields:**
- `senderId`: Who is sending the parcel
- `recipientName`: Recipient's name
- `recipientPhone`: Recipient's phone
- `pickupLocation`: Sender's address
- `deliveryLocation`: Recipient's address
- `description`: What's being sent
- `weight`: Parcel weight in kg
- `dimensions`: Height, width, depth
- `value`: Estimated value for insurance
- `photos`: Images of the parcel
- `fragile`: Whether it's fragile
- `specialInstructions`: Delivery notes
- `driverId`: Driver handling delivery
- `status`: 'pending', 'assigned', 'in_transit', 'delivered', 'failed', 'returned'
- `deliveryProof`: Photo at delivery
- `driversApproached`: Drivers who've been offered
- `paymentMethod`: 'cash', 'card', 'wallet'
- `estimatedDeliveryTime`: ETA
- `rating`: Rating after delivery

**Relationships:** Sender (User), Driver (User)

---

### 5. Message Model (`Message.ts`)
Real-time messaging between users during rides or services.

**Key Fields:**
- `senderId`: User sending message
- `recipientId`: User receiving message
- `rideId`: Context (optional)
- `parcelId`: Context (optional)
- `content`: Message text
- `attachments`: Images/files
- `readAt`: When recipient read it
- `status`: 'sent', 'delivered', 'read'
- `messageType`: 'text', 'image', 'location', 'system'

**Relationships:** Sender/Recipient (User), Ride, Parcel

---

### 6. Notification Model (`Notification.ts`)
In-app and push notifications for all services.

**Key Fields:**
- `userId`: Who receives it
- `title`: Notification title
- `message`: Notification text
- `type`: 'ride_update', 'booking_confirmation', 'message', 'promotion', 'safety_alert'
- `relatedId`: Reference to ride/booking/parcel
- `data`: Extra context (JSON)
- `readAt`: When user read it
- `actionUrl`: Deep link if clickable
- `sentVia`: 'push', 'in_app', 'email', 'sms'
- `priority`: 'low', 'normal', 'high'

**Relationships:** User, Ride, Booking, etc.

---

### 7. Parcel Model (Delivery Proxy) - See Parcel.ts

---

### 8. Reclamation Model (`Reclamation.ts`)
Report/complaint system for quality monitoring.

**Key Fields:**
- `reporterId`: Who filed the complaint
- `type`: What's being reported ('ride', 'parcel', 'shopping', 'driver', 'passenger')
- `rideId`/`parcelId`/`shoppingRequestId`: Context reference
- `reportedUserId`: Who is being reported
- `category`: 'behavior', 'safety', 'quality', 'damage', 'payment', 'other'
- `title`: Complaint title
- `description`: Detailed description
- `evidencePhotos`: Supporting images
- `status`: 'open', 'investigating', 'resolved', 'dismissed'
- `priority`: 'low', 'medium', 'high', 'critical'
- `adminNotes`: Admin investigation notes
- `resolution`: How it was resolved
- `resolutionType`: 'refund', 'warning', 'ban', 'other'
- `resolvedBy`: Admin who resolved it

**Relationships:** Reporter (User), Reported User, Admin, related service (Ride/Parcel/ShoppingRequest)

---

### 9. ShoppingRequest Model (`ShoppingRequest.ts`)
Shopping proxy service - users request items be purchased and delivered.

**Key Fields:**
- `requesterId`: User requesting shopping
- `description`: What to buy (detailed)
- `budget`: Maximum budget
- `deliveryLocation`: Where to deliver
- `storeLocation`: Where to shop (optional)
- `status`: 'pending', 'assigned', 'in_progress', 'completed', 'cancelled'
- `handlerId`: Shopping proxy (User)
- `actualCost`: What was actually spent
- `returnedChange`: Change returned to requester
- `deliveryProofPhoto`: Proof of delivery
- `rating`: Rating after completion
- `paymentStatus`: 'pending', 'completed', 'refunded'
- `isCOD`: Cash on delivery option
- `expiresAt`: Request expiration time

**Relationships:** Requester (User), Handler (User)

---

### 10. Louage Model (`Louage.ts`)
Fixed-route taxi service (common in North Africa for intercity travel).

**Key Fields:**
- `driverId`: Driver operating the louage
- `startPoint`: Departure city/location
- `endPoint`: Destination city/location
- `intermediaryStops`: Stops along the route
- `distance`: Total distance in km
- `estimatedDuration`: Travel time in minutes
- `vehicleType`: 'minibus', 'van', 'station_wagon'
- `totalSeats`: Vehicle capacity
- `availableSeats`: Current availability
- `pricePerSeat`: Cost per seat
- `fixedRoute`: Whether it's a recurring fixed route
- `schedule`: Days/times for fixed routes
- `status`: 'available', 'full', 'in_transit', 'completed', 'cancelled'
- `currentLocation`: Real-time location
- `passengers`: Array of boarded passengers
- `amenities`: Features offered ('AC', 'WiFi', 'USB charger', etc.)
- `wheelchairAccessible`: Accessibility info

**Relationships:** Driver (User), Passengers (Users through passengers array)

---

### 11. PushSubscription Model (`PushSubscription.ts`)
Web Push API subscriptions for browser notifications.

**Key Fields:**
- `userId`: User opted into notifications
- `endpoint`: Push service endpoint URL
- `keys`: Encryption keys (p256dh, auth)
- `deviceType`: 'web', 'mobile_web', 'pwa'
- `userAgent`: Browser/device info
- `isActive`: Subscription status
- `lastUsed`: When notification was last sent
- `notificationPreferences`: Granular opt-ins
  - `rideUpdates`
  - `messages`
  - `promotions`
  - `systemAlerts`

**Relationships:** User

---

## Relationships Map

```
┌─────────┐
│  User   │ (All users - drivers, passengers, handlers)
└────┬────┘
     │
     ├─→ Ride (multiple rides created/participated)
     │    ├─→ Booking (passengers book seats)
     │    ├─→ Message (communication during ride)
     │    └─→ Notification (ride updates)
     │
     ├─→ Parcel (sender or driver)
     │
     ├─→ ShoppingRequest (requester or handler)
     │
     ├─→ Louage (driver or passenger)
     │
     ├─→ Message (sender/recipient)
     │
     ├─→ Reclamation (reporter or reported user)
     │
     └─→ PushSubscription (notification preferences)
```

## Field Validation Standards

### Coordinates
- Latitude: -90 to 90
- Longitude: -180 to 180

### Ratings
- Range: 1-5 stars
- Decimal: 0.5 increments allowed

### Distances
- Unit: Kilometers (km)
- Precision: Float with 2 decimals

### Prices
- Unit: Local currency (configurable)
- Precision: 2 decimal places

### Phone Numbers
- Format: +[country code][number]
- Validation: Libphonenumber or similar

## Indexing Strategy

### High-frequency queries:
- Status-based: indexed
- Time-based (createdAt, updatedAt): indexed
- Location-based (coordinates): 2D indexed for geo queries
- User-based (userId, driverId, etc.): indexed
- Foreign keys: indexed

### Compound indexes:
- (status, createdAt) for listing
- (userId, createdAt) for user history

## Timestamps

All models include:
- `createdAt`: Document creation time (auto)
- `updatedAt`: Last modification time (auto)

Some models may include:
- Service-specific timestamps (pickupTime, deliveryTime, etc.)

## Notes

1. **Privacy**: Messages, PushSubscriptions, and Reclamations follow GDPR principles
2. **Scalability**: Location-based queries use geospatial indexes
3. **Real-time**: Message and Notification models optimized for frequent updates
4. **Audit Trail**: All modifications tracked via updatedAt timestamp
5. **Soft Deletes**: Consider implementing soft deletes for sensitive data instead of hard deletes

## Future Enhancements

- Implement versioning for audit trails
- Add encryption for sensitive fields (bank details)
- Implement data archiving for old records
- Add machine learning fields for fraud detection
