# Phase 3-5: Comprehensive Feature Implementation Plan
## 10 New Major Features for WASALNI

**Date:** April 5, 2026  
**Scope:** 10 interconnected features spanning safety, payments, matching, and recurring rides  
**Estimated Timeline:** 2-3 weeks full implementation | 1 week MVP (features 1-5)

---

## Feature Priority Matrix

| # | Feature | Priority | MVP? | Complexity | Dependencies |
|---|---------|----------|------|-----------|--------------|
| 1 | Immédiat Mode | HIGH | ✅ | Low | None |
| 2 | Women-Only Mode | HIGH | ✅ | Medium | Gender field (User) |
| 3 | Driver GPS Guidance | HIGH | ✅ | Medium | Leaflet, Geolocation |
| 4 | Passenger Rating | HIGH | ✅ | Medium | Booking.ratings array |
| 5 | Virtual Wallet/Payment | HIGH | ✅ | Medium | Booking.paymentMethod |
| 6 | Loyalty/Rewards | MEDIUM | ⏳ | Low | User.completedTrips |
| 7 | AI/ML Ride Matching | MEDIUM | ⏳ | High | SearchAlert collection |
| 8 | Eco-Impact Tracker | LOW | ⏳ | Low | Haversine math library |
| 9 | Safety Stop Button | MEDIUM | ⏳ | Medium | SafetyAlert collection |
| 10 | Recurring/Scheduled Rides | MEDIUM | ⏳ | High | Recurring scheduling logic |

---

## Backend Schema Changes Required

### 1. User Model (`backend/src/models/User.ts`)
```typescript
// Add fields:
gender?: 'male' | 'female' | 'prefer_not_to_say' // For women-only rides
passengerAverageRating?: number // Passenger rating (avg of all bookings where user was passenger)
passengerTotalReviews?: number // Count of passenger ratings
completedTrips?: number // For loyalty rewards (increment when booking → 'completed')
loyaltyTier?: 'bronze' | 'silver' | 'gold' // Auto-calculated: bronze 0-4, silver 5-14, gold 15+
referralCode?: string // Unique code for loyalty referrals
referredBy?: string // User ID of who referred this user
walletBalance?: number // Virtual wallet balance in TND

Indexes:
- loyaltyTier, completedTrips (for filtering/sorting)
```

### 2. Ride Model (`backend/src/models/Ride.ts`)
```typescript
// Add fields:
immediateMode?: boolean // For last-minute rides (departing within 90 min)
womenOnly?: boolean // Female drivers only - female passengers only
isRecurring?: boolean // Part of a recurring route
recurringDays?: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] // Which days
recurringUntil?: Date // End date for recurring series
recurringGroupId?: string // Links all instances of a recurring ride
paymentMethods?: ['cash', 'wallet'] // Which payment types driver accepts

Indexes:
- immediateMode, departureTime (for immediate ride searches)
- womenOnly (for filtering)
- recurringGroupId (for finding all instances)
```

### 3. Booking Model (`backend/src/models/Booking.ts`)
```typescript
// Add fields:
paymentMethod?: 'cash' | 'wallet' // How passenger is paying
ratings?: [
  {
    by: 'driver' | 'passenger'
    stars: 1-5
    comment?: string
    createdAt: Date
  }
] // Mutual ratings after ride completes
co2Saved?: number // Grams of CO2 saved (calculated at completion)

Indexes:
- ratings.by (for finding unrated bookings)
```

### 4. New Collections

#### SearchAlert (for ride matching suggestions)
```typescript
{
  userId: ObjectId
  fromCity: string
  toCity: string
  createdAt: Date
  lastUpdated: Date
}
```

#### SafetyAlert (for emergency stop button)
```typescript
{
  userId: ObjectId
  rideId: ObjectId
  type: 'uncomfortable' | 'emergency'
  timestamp: Date
  location: { lat, lng } // GPS coordinates
  message?: string
  resolved: boolean
}
```

---

## Backend API Endpoints to Create/Update

### Feature 1: Immediate Mode
```
GET /api/rides?immediate=true
  - Returns rides departing now to now+90min
  - Sorted by departureTime (soonest first)
  - Response includes "isImmediate" flag on cards

GET /api/rides?immediate=true&department=Tunis&destination=Sfax
  - Combined with existing location filters
```

### Feature 2: Women-Only Mode
```
POST /api/rides (update existing)
  - Add womenOnly: boolean field on create

POST /api/requests (update existing)
  - Check if ride.womenOnly && requester.gender !== 'female' → 403
  - Error: "Ce trajet est réservé aux femmes"
```

### Feature 3: Driver GPS Guidance
```
GET /api/bookings/:id/passenger-location
  - Returns { meetingPoint: { lat, lng }, distance: m, duration: min }
```

### Feature 4: Passenger Rating
```
POST /api/bookings/:id/rate
  - { by: 'driver'|'passenger', stars: 1-5, comment?: string }
  - Auto-update passengerAverageRating if by = 'driver'
  - Push to ratings array

GET /api/bookings?unrated=true
  - Returns bookings status='completed' with no rating by current user
```

### Feature 5: Virtual Wallet/Payment
```
POST /api/bookings (update existing)
  - Accept paymentMethod: 'cash' | 'wallet'
  - If wallet: check user.walletBalance >= ridePrice
  - Create pending transaction record

POST /api/wallet/recharge
  - Set up Stripe/Konnect integration point (mark as 'pending_integration')

GET /api/users/me/wallet
  - { balance: number, transactions: [...] }
```

### Feature 6: Loyalty/Rewards
```
GET /api/users/me/loyalty
  - { tier, completedTrips, nextTierAt, discount, referralCode }

POST /api/loyalty/redeem-referral
  - { referralCode: string }
  - Add +1 bonus trip credit, link to referredBy
```

### Feature 7: AI/ML Ride Matching
```
GET /api/rides/suggested?from=Tunis&to=Sfax&time=2026-04-06T10:00Z
  - Returns rides ranked by match score (50+30+10+5+5 points)
  - Response: [{ ...ride, matchScore: 85 }]

GET /api/passengers/on-your-route
  - For drivers: returns SearchAlerts matching their upcoming ride

POST /api/search-alerts
  - Store search query: { fromCity, toCity }
  - Used for "Vous pourriez aimer" suggestions
```

### Feature 8: Eco-Impact Tracker
```
GET /api/users/me/eco-stats
  - { co2Saved: grams, tripsCompleted, leafScore }

GET /api/community/eco-stats
  - { totalCo2Saved: grams, totalTrips }
```

### Feature 9: Safety Stop Button
```
POST /api/safety-alerts
  - { rideId, type: 'uncomfortable'|'emergency', location: { lat, lng } }
  - Creates SafetyAlert record
  - Notifies admin dashboard

GET /api/admin/safety-alerts?status=open
  - Dashboard: show all unresolved safety alerts
```

### Feature 10: Recurring Rides
```
POST /api/rides (update existing)
  - Accept isRecurring, recurringDays, recurringUntil
  - Auto-generate individual Ride docs for each matching date
  - All linked by recurringGroupId

PUT /api/rides/recurring/:groupId
  - { action: 'pause' | 'resume' }
  - Updates all instances in the recurring group
```

---

## Frontend Components to Create

### Feature 1: Immediate Mode
- `ImmediateModeToggle.tsx` - Toggle "Maintenant" vs "Planifié"
- `ImmediateBadge.tsx` - Green/amber badge on ride cards
- Update `SearchResults.tsx` - Show imminent departures

### Feature 2: Women-Only Mode
- `WomenOnlyToggle.tsx` - Toggle on publish ride form
- `WomenOnlyBadge.tsx` - Pink badge on ride cards
- `WomenOnlyFilter.tsx` - Checkbox in search filters
- Update `User Profile` - Show gender field

### Feature 3: Driver GPS Guidance
- `DriverMapNavigation.tsx` - Leaflet map component
- `NavigateToPassengerButton.tsx` - Button on active ride card
- `CallPassengerButton.tsx` - Call button (tel: link)
- `DistanceCalculator.ts` - Haversine formula utility

### Feature 4: Passenger Rating
- `PassengerRatingModal.tsx` - 5-star rating dialog
- `RatingHistoryCard.tsx` - Show passenger ratings on profile
- Update `Dashboard.tsx` - Show "Notez votre trajet" prompt
- `RatingFilter.tsx` - Filter booking requests by passenger rating

### Feature 5: Virtual Wallet/Payment
- `PaymentMethodSelector.tsx` - Cash vs Wallet radio
- `WalletBalanceCard.tsx` - Display wallet balance
- `RechargeWalletButton.tsx` - Link to Stripe/Konnect
- `PaymentPendingBanner.tsx` - "Le paiement sera disponible prochainement"
- Update `BookingFlow.tsx` - Add payment method step

### Feature 6: Loyalty/Rewards
- `LoyaltyTierCard.tsx` - Display bronze/silver/gold with progress bar
- `ReferralCodeCard.tsx` - Show referral code and "Parrainez un ami"
- `LoyaltyBadge.tsx` - Star icon badge on profile/ride cards
- `RewardsSection.tsx` - Dashboard section with tier, trips, discount

### Feature 7: AI/ML Ride Matching
- `SuggestedRidesSection.tsx` - "Vous pourriez aimer" carousel
- Update `Dashboard.tsx` - Show suggested rides based on history

### Feature 8: Eco-Impact Tracker
- `EcoSavingsCard.tsx` - Show CO2 saved on ride details
- `EcoStatsProfile.tsx` - Total CO2 and leaf icon on profile
- `CommunityEcoCounter.tsx` - Global counter on homepage

### Feature 9: Safety Stop Button
- `SafetyStopButton.tsx` - Red button on active ride screen
- `SafetyStopSheet.tsx` - Bottom sheet with 3 options
- `AdminSafetyAlerts.tsx` - Admin dashboard page for alerts

### Feature 10: Recurring Rides
- `RecurringRidesForm.tsx` - Day selector and end date picker
- `RecurringBadge.tsx` - "Lun · Mar · Mer" badge on cards
- `RecurringManagementPanel.tsx` - Driver dashboard section
- `SubscribeToRecurringButton.tsx` - Auto-renew booking option

---

## Implementation Phases

### Phase 3A (MVP Week 1): Immediate + Women-Only
1. Update User, Ride Mongoose models
2. Create immediate mode endpoints
3. Create women-only endpoints
4. Build UI components
5. Test and deploy

### Phase 3B (MVP Week 2): Driver GPS + Passenger Rating
1. Create Leaflet integration
2. Add passenger rating to Booking model
3. Create rating endpoints
4. Build GPS navigation UI
5. Test and deploy

### Phase 3C (MVP Week 3): Virtual Wallet
1. Add payment fields to Booking
2. Create wallet endpoints
3. Build payment UI flow
4. Integrate payment provider (Stripe UI)
5. Test and deploy

### Phase 4A (Advanced Week 4): Loyalty + Eco-Tracker
1. Add loyalty fields to User
2. Create searchAlert management
3. Build loyalty UI dashboard
4. Calculate CO2 for completed bookings
5. Test and deploy

### Phase 4B (Advanced Week 5): Safety + AI Matching
1. Create SafetyAlert collection
2. Implement matching algorithm
3. Build safety button UI
4. Add admin alerts dashboard
5. Test and deploy

### Phase 5 (Complex Week 6): Recurring Rides
1. Implement recurring ride creation logic
2. Add scheduling engine
3. Build recurring form UI
4. Create pause/resume functionality
5. Test and deploy

---

## Implementation Order (Recommended)

**Start with:** Feature 1 (Immediate Mode) - simplest, high impact
**Then:** Feature 2 (Women-Only) - safety feature, fast to implement
**Then:** Feature 5 (Wallet) - payment UX, no real integration yet
**Then:** Feature 4 (Passenger Rating) - mutual rating system
**Then:** Feature 3 (GPS Guidance) - map integration
**Then:** Feature 6 (Loyalty) - rewards gamification
**Then:** Feature 8 (Eco-Tracker) - simple math, high visibility
**Then:** Feature 9 (Safety) - emergency feature
**Then:** Feature 7 (AI Matching) - most complex algorithm
**Then:** Feature 10 (Recurring) - most complex scheduling

---

## Key Technical Decisions

### 1. Haversine Formula Library
- Option A: Use `geolib` npm package
- Option B: Implement custom (simpler, smaller bundle)
- **Recommendation:** Use custom (3-line function, easier debugging)

### 2. Recurring Ride Generation
- Option A: Generate all instances upfront on publish
- Option B: Generate instances dynamically on search
- **Recommendation:** Upfront (simpler queries, predictable)

### 3. Matching Algorithm
- Option A: Database aggregation pipeline (complex)
- Option B: JavaScript scoring in Node.js
- **Recommendation:** JavaScript (easier to adjust scoring)

### 4. GPS Tracking
- Option A: Real-time updates via Socket.io
- Option B: Fetch location on-demand
- **Recommendation:** Socket.io (real-time experience)

### 5. Payment Integration
- Option A: Integrate Stripe immediately
- Option B: Just UX, mark as pending
- **Recommendation:** Pending (UI ready, wired later)

---

## Database Migration Strategy

1. **User model:** Add 6 new fields with defaults
2. **Ride model:** Add 7 new fields with defaults
3. **Booking model:** Add 3 new fields with defaults
4. **New collections:** SafetyAlert, SearchAlert (empty on init)

**Migration script:** Will update all existing docs with defaults

---

## Testing Strategy

- Unit tests for scoring algorithm and Haversine formula
- Integration tests for booking with ratings
- E2E tests for immediate ride search
- Load tests for recurring ride generation

---

## Deployment Strategy

1. Migr all models + collections → Deploy to production
2. Create all backend API endpoints (behind feature flags if needed)
3. Build all frontend components (hidden until flagged)
4. Release features in waves (1) Immediate, (2) Women-Only, etc.

---

## Success Metrics

| Feature | KPI |
|---------|-----|
| Immediate rides | % of rides published with immediateMode=true |
| Women-only | % of female drivers using womenOnly toggle |
| GPS guidance | Time saved before first booking cancellation |
| Passenger rating | Average passenger rating (should be high) |
| Wallet | % of bookings using wallet payment |
| Loyalty | Retention rate improvement from rewards |
| Matching | CTR on "Vous pourriez aimer" cards |
| Eco-tracker | User engagement with CO2 counter |
| Safety stop | # of safety alerts (lower is better) |
| Recurring | % of daily commuters using recurring |

---

## Estimated Effort

| Phase | Backend Work | Frontend Work | Total Hours |
|-------|------------|-------------|------------|
| 3A (Immediate + Women) | 4h | 6h | 10h |
| 3B (GPS + Rating) | 6h | 8h | 14h |
| 3C (Wallet) | 4h | 7h | 11h |
| 4A (Loyalty + Eco) | 5h | 5h | 10h |
| 4B (Safety + Matching) | 8h | 6h | 14h |
| 5 (Recurring) | 10h | 8h | 18h |
| **TOTAL** | **37h** | **40h** | **77h** |

**Team capacity:** 1 developer → 2 weeks full-time  
**Timeline at ASAP pace:** 10 working days (both features in parallel)

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-----------|--------|-----------|
| Recurring ride generation crashes | Medium | High | Thorough testing of date logic |
| GPS tracking drains battery | Low | Medium | Optimize geolocation polling |
| Payment UX confusion | Medium | Medium | Clear messaging about pending integration |
| Matching algorithm too slow | Low | High | Index optimization, caching |
| Database migration fails | Low | Critical | Backup before migration |

---

## Go-Live Checklist

- [ ] All models migrated to production DB
- [ ] All API endpoints tested with Postman
- [ ] All components tested in Storybook
- [ ] E2E tests passing for critical flows
- [ ] Feature flags implemented (can disable any feature)
- [ ] Admin dashboard updated with safety alerts
- [ ] Documentation updated for new endpoints
- [ ] User guide prepared for new features
- [ ] Customer support trained on new features
- [ ] Analytics tracking added for new features
- [ ] Performance monitoring set up
- [ ] Rollback plan in place

