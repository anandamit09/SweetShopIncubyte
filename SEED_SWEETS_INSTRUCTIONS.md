# How to Add Initial Sweets to Database

## Quick Method: Using API Tester (Easiest)

1. **Start backend:** `cd backend && npm run dev`
2. **Start frontend:** `npm start`
3. **Open frontend:** `http://localhost:3000`
4. **Click "🔧 API Tester / Debug Tool"**
5. **Click "Test Login (Admin)"** to login as admin
6. **Click "Add Sweet (Admin)"** button 5 times (once for each sweet)

The sweets will be added automatically with test data. Then manually update each one with the correct data below.

## Method 2: Using Seed Script

1. **Make sure backend server is running** (to initialize database)
2. **Run seed script:**
   ```bash
   cd backend
   npm run seed-sweets
   ```

## Method 3: Using API Directly (via curl or Postman)

### Step 1: Login as Admin
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

Save the token from the response.

### Step 2: Add Each Sweet

Replace `YOUR_TOKEN` with the token from step 1.

```bash
# Matcha Mochi
curl -X POST http://localhost:3001/api/sweets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Matcha Mochi\",\"category\":\"Mochi\",\"price\":3.50,\"quantity\":10,\"image\":\"/images/MatchaMochi.jpg\"}"

# Sakura Dango
curl -X POST http://localhost:3001/api/sweets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Sakura Dango\",\"category\":\"Dango\",\"price\":4.00,\"quantity\":8,\"image\":\"/images/SakuraDango.jpg\"}"

# Yuzu Cheesecake
curl -X POST http://localhost:3001/api/sweets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Yuzu Cheesecake\",\"category\":\"Cheesecake\",\"price\":5.50,\"quantity\":6,\"image\":\"/images/YUzuCheeseCake.jpg\"}"

# Anmitsu Bowl
curl -X POST http://localhost:3001/api/sweets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Anmitsu Bowl\",\"category\":\"Dessert Bowl\",\"price\":6.00,\"quantity\":5,\"image\":\"/images/AnmitsuBowl.jpg\"}"

# Red Bean Taiyaki
curl -X POST http://localhost:3001/api/sweets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Red Bean Taiyaki\",\"category\":\"Taiyaki\",\"price\":3.00,\"quantity\":12,\"image\":\"/images/taiyakifish.jpg\"}"
```

## Sweets to Add

1. **Matcha Mochi** - $3.50 - Category: Mochi - Quantity: 10
2. **Sakura Dango** - $4.00 - Category: Dango - Quantity: 8
3. **Yuzu Cheesecake** - $5.50 - Category: Cheesecake - Quantity: 6
4. **Anmitsu Bowl** - $6.00 - Category: Dessert Bowl - Quantity: 5
5. **Red Bean Taiyaki** - $3.00 - Category: Taiyaki - Quantity: 12

## Verify Sweets Are Added

1. **Login to frontend**
2. **You should see all 5 sweets displayed**
3. **Or use API Tester:** Click "Get All Sweets" - should show 5 items


