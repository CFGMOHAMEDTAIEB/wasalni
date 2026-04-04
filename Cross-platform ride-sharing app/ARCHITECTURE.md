# Architecture: Role-Based Access Control System

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        App Entry Point                          │
│                      (App.tsx - Wrapped)                        │
│                       ▼                                          │
│                  ┌─────────────┐                                │
│                  │ AuthProvider│                                │
│                  │  context    │                                │
│                  └──────┬──────┘                                │
│                         │                                        │
│          ┌──────────────┼──────────────┐                        │
│          ▼              ▼              ▼                        │
│      ┌────────┐    ┌────────┐    ┌────────┐                    │
│      │ Guest  │    │ Normal │    │ Owner  │                    │
│      │        │    │ User   │    │        │                    │
│      └────────┘    └────────┘    └────────┘                    │
│          │              │              │                        │
│          │ Auto-login   │   Login      │   Login               │
│          │ on load      │   /login     │   /login              │
│          └──────────────┴──────────────┘                        │
└─────────────────────────────────────────────────────────────────┘

                        NAVIGATION ROUTING

┌────────────────────────────────────────────────────────────────┐
│                       Protected Routes                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Route          Guest      Normal     Owner                    │
│  ───────────────────────────────────────────                  │
│  /              ✅ Home   ✅ Home     ✅ Home                  │
│  /search        ✅ View   ✅ Search  ✅ Search                │
│  /ride/:id      ✅ View   ✅ Detail  ✅ Detail                │
│  /login         ✅ Form   ✅ Form    ✅ Form                  │
│  /dashboard     ❌ Alert  ✅ User    ✅ Owner                 │
│  /publish       ❌ Alert  ❌ Alert   ✅ Form                  │
│  /premium       ✅ View   ✅ View    ✅ View                  │
│                                                                │
│  ✅ = Access     ❌ = Denied                                   │
└────────────────────────────────────────────────────────────────┘

                      USER CONTEXT STRUCTURE

┌────────────────────────────────────────────────────────────────┐
│                      useAuth() Hook                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  user: {                                                       │
│    id: string                                                  │
│    name: string                                                │
│    email: string                                               │
│    role: "guest" | "normal" | "owner"                         │
│    avatar?: string                                             │
│    verified: boolean                                           │
│    rating?: number (owners only)                              │
│    reviews?: number (owners only)                             │
│  }                                                             │
│                                                                │
│  isAuthenticated: boolean                                      │
│  login(user: User): void                                       │
│  logout(): void                                                │
│  setUserRole(role: UserRole): void                            │
│  updateUser(updates: Partial<User>): void                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘

                    FEATURE MATRIX BY ROLE

┌─────────────────────────────────────────────────────────────────┐
│ Feature                     │ Guest │ Normal │ Owner │          │
├─────────────────────────────│───────│────────│───────│          │
│ Browse Rides                │  ✅   │   ✅   │  ✅   │          │
│ View Ride Details           │  ✅   │   ✅   │  ✅   │          │
│ Make Reservations           │  ❌   │   ✅   │  ✅   │          │
│ View Notifications          │  ❌   │   ✅   │  ✅   │          │
│ Messages                    │  ❌   │   ✅   │  ✅   │          │
│ Publish Rides               │  ❌   │   ❌   │  ✅   │          │
│ Edit Own Rides              │  ❌   │   ❌   │  ✅   │          │
│ Delete Own Rides            │  ❌   │   ❌   │  ✅   │          │
│ View Ride Requests          │  ❌   │   ❌   │  ✅   │          │
│ Manage Requests             │  ❌   │   ❌   │  ✅   │          │
│ View Earnings               │  ❌   │   ❌   │  ✅   │          │
│ Premium Upgrade             │  ✅   │   ✅   │  ✅   │          │
│ Lower Commission (5%)        │  N/A  │   ❌   │  ✅*  │          │
│                             │       │        │ (*if │          │
│                             │       │        │ verified)│      │
└─────────────────────────────────────────────────────────────────┘

                   COMPONENT HIERARCHY

┌── App (wrapped with AuthProvider)
│
├── Header (adapts based on user role)
│   ├── Guest Navigation
│   ├── Normal User Navigation
│   └── Owner Navigation
│
├── Router
│   ├── Home
│   ├── Login (role selector)
│   │   ├── Normal User Form
│   │   └── Owner Form
│   ├── SearchResults
│   ├── RideDetails
│   ├── Dashboard (role-adaptive)
│   │   ├── If Guest → AccessDeniedView
│   │   ├── If Normal → UserDashboard
│   │   │   ├── Reservations Tab
│   │   │   ├── Messages Tab
│   │   │   └── Profile Tab
│   │   └── If Owner → OwnerDashboard
│   │       ├── Rides Tab (CRUD)
│   │       ├── Requests Tab (manage)
│   │       └── Earnings Tab (analytics)
│   ├── PublishRide (protected for owners)
│   │   ├── If not Owner → AccessDeniedView
│   │   └── If Owner → RidePublishForm
│   ├── Premium
│   └── 404
│
└── Toaster (notifications)

                      DATA FLOW

User Action (Login)
        ▼
   ┌─────────┐
   │  Login  │  Select Role (Normal/Owner)
   │  Form   │
   └────┬────┘
        ▼
   ┌─────────────┐
   │ useAuth()   │  
   │ .login()    │  Update Context
   └────┬────────┘
        ▼
   ┌─────────────┐
   │ AuthContext │  
   │ user state  │  Stored in memory
   │ updated     │
   └────┬────────┘
        ▼
   ┌─────────────┐
   │ Components  │  Re-render based on role
   │ re-render   │
   └─────────────┘

Header changes → Dashboard adapts → Routes guard → Features unlock

                    ERROR HANDLING

└─ ProtectedRoute
   │
   ├─ No role check → GuestOnlyView
   │   "Please Sign In"
   │
   └─ Wrong role → AccessDeniedView
       "You don't have permission"

```

## State Management

### AuthContext State
```typescript
const [user, setUser] = useState<User | null>(guestUser)
```

**Initial State:** Guest user (auto-logged in)

**State Transitions:**
- Guest → Normal User: `login()` with role="normal"
- Guest → Owner: `login()` with role="owner"  
- Any → Guest: `logout()`
- Role Change: `setUserRole()`
- Profile Update: `updateUser()`

## Permission Checks

### useAuthRole() Hook
```
Input: required role(s)
Check: user.role in required array
Output: boolean (has access)
```

### Protected Routes
```
RouteAccess = ProtectedRoute
  └─ Check: user.role OR isAuthenticated
  └─ If denied: Show fallback view
```

## Commission Structure

**Normal User / New Owner:**
- Commission: 10% of ride price
- Featured fee: +5 DT

**Premium Owner / Verified Owner:**
- Commission: 5% of ride price (50% savings!)
- Featured fee: +5 DT (waived in some cases)

---

## Integration Points (Ready for Backend)

1. **Authentication Service**
   - Replace simulated login with real API calls
   - JWT token management
   - Session persistence

2. **User Database**
   - Store user profiles with roles
   - Verification status
   - Driver credentials

3. **Ride Management Service**
   - Create/Update/Delete rides in database
   - Query rides with filters
   - Handle availability

4. **Request/Booking System**
   - Store passenger requests
   - Approval workflow
   - Status notifications

5. **Messaging System**
   - Real-time messages between users
   - Message history
   - Push notifications

6. **Payment Processing**
   - Process bookings
   - Calculate commissions
   - Payout system

