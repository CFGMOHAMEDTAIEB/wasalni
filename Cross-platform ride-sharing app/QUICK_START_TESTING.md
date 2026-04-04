# Quick Start: Testing the Role-Based System

## 🚀 Getting Started

Your app is now running at **http://localhost:5173/**

---

## 📋 Test Scenarios

### Scenario 1: Guest User (Automatic)
**What happens when you first visit the app:**

1. ✅ You're automatically logged in as a **Guest**
2. ✅ Header shows: "Connexion | S'inscrire"
3. ✅ You can click "Rechercher" → See all rides (home)
4. ❌ Try to access `/dashboard` → See "Please Sign In" alert
5. ❌ Try to access `/publish` → Redirected with alert

**Expected behavior:**
- Guest can browse but can't book, publish, or access protected areas
- Click "Connexion" anywhere → Taken to login page

---

### Scenario 2: Login as Normal User
**Steps:**

1. Click **"Connexion"** (top-right or mobile menu)
2. On login form, enter:
   - Email: `user@example.com`
   - Password: `any-password`
3. **Select "Normal User"** (👥 icon with user symbol)
4. Click **"Sign In"**

**What changes:**
- Header now shows: `Rechercher | Mes Réservations | Premium | [Avatar ▼]`
- Click your avatar → See dropdown with profile & logout
- Go to `/dashboard` → See **User Dashboard** with:
  - **Tabs:** Mes réservations | Messages | Mon profil
  - Active reservations from mock data
  - Messages from drivers
  - Profile section + "Devenir propriétaire" button
- Try to access `/publish` → See alert: "You need a vehicle owner account"

**Key features:**
- 📬 Notifications icon (shows "2")
- 💬 Messages icon (shows "1")
- 💾 Can view booking history
- 🔄 Can upgrade to owner from dashboard

---

### Scenario 3: Login as Vehicle Owner
**Steps:**

1. Click **"Connexion"**
2. Enter same credentials
3. **Select "Vehicle Owner"** (🚗 car icon)
4. Click **"Sign In"**

**What changes:**
- Header: `Rechercher | Publier un trajet | Mes trajets | Premium | [Avatar ▼]`
- Dashboard shows **Owner Dashboard** with:
  - **Tabs:** Mes trajets | Demandes | Revenus
  - Stats cards show: Published rides, Pending requests, Earnings, Status ✅
  - Premium banner: "Reduce fees to 5%"

**Mes trajets Tab:**
- See published rides with **Edit** & **Delete** buttons
- Fee breakdown: 5% commission (instead of 10%)
- Can click "+ Publier un trajet"

**Demandes Tab:**
- See passenger requests pending
- "Accepter" & "Refuser" buttons
- Mock data shows 2 pending requests

**Revenus Tab:**
- Total earnings: 456.50 DT
- Commissions paid: 12.30 DT
- Revenue history by ride

**Complete access:**
- ✅ Click "Publier un trajet" → Full ride publishing form
- ✅ Click "Mes trajets" → See & manage published rides
- ✅ Dashboard shows request management tab
- ✅ Higher earning potential (5% commission)

---

## 🧪 Testing Matrix

| Test | Expected Result |
|------|-----------------|
| Open app as guest → Try `/dashboard` | ✅ AccessDenied alert |
| Guest → Click "Connexion" | ✅ Go to `/login` |
| Login as Normal → Go to `/publish` | ✅ Alert: Need owner |
| Login as Owner → Click "Publier trajet" | ✅ Open publish form |
| Owner publishes ride → Go to dashboard | ✅ New ride in "Mes trajets" |
| Click user avatar (logged in) | ✅ Dropdown menu appears |
| Click "Déconnexion" | ✅ Logout & redirect home |
| Logout → Try `/dashboard` | ✅ Access denied |
| Toggle Normal→Owner in same session | ❌ Not yet (logout/login needed) |

---

## 🎛️ Form Testing

### Test Publishing a Ride (As Owner)

1. Click: **"Publier un trajet"**
2. Fill not empty fields:
   - **Départ:** Tunis
   - **Destination:** Sousse
   - **Date:** Any future date
   - **Heure:** 14:30
   - **Prix:** 25
   - **Places:** 4
   - **Modèle:** Renault Clio

3. Toggle preferences:
   - Musique: ON ✓
   - Fumage: OFF
   - Animaux: ON ✓
   - Bagages: ON ✓
   - **Mise en vedette:** ON ✓

4. Click **"Publier"**
5. ✅ Toast shows: "Trajet publié avec succès! Frais: 7.50 DT"
6. ✅ Redirects to dashboard → New ride visible

**Fee Calculation Verification:**
- Base: 25 DT × 10% = 2.50 DT
- Featured fee: +5 DT
- Total: 7.50 DT ✅

---

## 🔍 Feature Checklist

### Guest Features
- [ ] Browse home page
- [ ] Search rides
- [ ] See ride details
- [ ] Redirected from protected pages
- [ ] Can access login

### Normal User Features
- [ ] Reservations tab with mock bookings
- [ ] Messages tab with driver messages
- [ ] Profile tab with user info
- [ ] Notifications icon (shows count)
- [ ] Messages icon (shows count)
- [ ] Can logout
- [ ] Cannot access `/publish`
- [ ] Dashboard adapts to normal user

### Owner Features
- [ ] All normal user features
- [ ] Publish ride form works
- [ ] Dashboard shows published rides
- [ ] Edit/Delete buttons on rides
- [ ] Requests tab shows pending bookings
- [ ] Revenue tab shows earnings
- [ ] Fee calculation shows 5-10% correctly
- [ ] Premium banner present
- [ ] Featured ride option works

---

## 🛠️ Troubleshooting

**Issue: Changes not reflecting?**
→ Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

**Issue: Previous session still active?**
→ Click logout → Refresh → Should be guest again

**Issue: Form validation errors?**
→ Check browser console: `F12 → Console tab`
→ Fill all required fields (marked with *)

**Issue: Wrong role after login?**
→ Logout first, then login with correct role selection

---

## 📱 Mobile Testing

Click hamburger menu (☰) on mobile to see:
- Responsive navigation
- Avatar section at bottom
- Message/notification badges
- Role-specific options

---

## 🎬 Demo Workflow

**Complete user journey:**

1. Start as Guest → Browse rides ✅
2. Click "Connexion" → Go to login ✅
3. Login as Normal User → See booking dashboard ✅
4. Logout → Back to guest ✅
5. Login as Owner → Switch tabs to see requests & earnings ✅
6. Publish a new ride → See it in "Mes trajets" ✅
7. Go to "Demandes" → See pending requests ✅
8. Logout → Verify redirect to guest ✅

---

## 📊 Analytics to Check

**In Owner Dashboard → Revenus Tab:**
- Total earnings calculation
- Commission deduction verification
- Ride history with individual earnings

**Example verifications:**
- If ride price = 20 DT, 2 passengers reserved
- Revenue = 40 DT (2 × 20)
- Commission = 4 DT (10%) or 2 DT (5% for premium)
- Net = 36 DT or 38 DT

---

## 🔗 Important Routes

| Route | Requires | Shows |
|-------|----------|-------|
| `/` | None | Home page |
| `/login` | None | Login form |
| `/search` | None | Search results |
| `/ride/:id` | None | Ride details |
| `/dashboard` | Auth | Role-specific |
| `/publish` | Owner | Publish form |
| `/premium` | None | Premium info |

---

## 💡 Common Actions

**As Guest:**
```
Click "Rechercher" → see rides list
Click ride → see details
Try "/dashboard" → DENIED
Click "Connexion" → Go to login
```

**As Normal:**
```
Click "Mes Réservations" → see bookings
Click notification bell → (UI ready)
Click message icon → see driver messages
Go to "/publish" → DENIED with message
```

**As Owner:**
```
Click "Publier un trajet" → fill form → publish
Click "Mes trajets" → see published + manage buttons
Click "Demandes" → approve/reject requests  
Click "Revenus" → see earnings breakdown
```

---

## ✅ Ready for Next Phase?

After testing, you can proceed with:
1. Backend API integration
2. Real authentication (JWT)
3. Database for users & rides
4. Payment processing
5. Real-time messaging
6. File uploads (vehicle docs, photos)

