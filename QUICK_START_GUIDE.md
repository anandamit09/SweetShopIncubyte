# Quick Start Guide - See Your Sweets!

## Current Issue
You're seeing "Please log in to view sweets" because:
1. You need to log in first
2. The database is empty (no sweets added yet)

## Step-by-Step Solution

### Step 1: Make Sure Backend is Running
Open a terminal and run:
```bash
cd backend
npm run dev
```
You should see: `Server running on port 3001`

### Step 2: Make Sure Frontend is Running
Open another terminal and run:
```bash
npm start
```
Frontend should open at `http://localhost:3000`

### Step 3: Log In
1. On the main page, click **"Sign In"** button (top right)
2. Use admin credentials:
   - **Username:** `admin`
   - **Password:** `admin123`
3. Click **"Sign In"**
4. Modal should close and you should see "Hello, admin" in the header

### Step 4: Add Sweets to Database
1. Click **"🔧 API Tester / Debug Tool"** button (purple button, top right)
2. You should see "✓ Authenticated as: admin (admin)" in green
3. Scroll to **"Sweets API"** section
4. Click **"🌱 Seed Initial 5 Sweets"** button (purple button)
5. Wait for all 5 sweets to be added (you'll see success messages)
6. Click **"← Back to Shop"** button

### Step 5: View Sweets
Now you should see all 5 sweets displayed on the main page!

## Troubleshooting

### If Login Doesn't Work:
- Make sure backend is running on port 3001
- Check browser console (F12) for errors
- Try creating admin user: `cd backend && npm run create-admin`

### If Sweets Don't Appear After Login:
- Make sure you clicked "Seed Initial 5 Sweets" button
- Check if you see success messages in API Tester
- Try clicking "Get All Sweets" in API Tester to verify they're in database

### If You See "No sweets available":
- This means database is empty
- Go to API Tester and click "Seed Initial 5 Sweets"

## What You Should See After Success

✅ Header shows: "Hello, admin" and "Logout" button
✅ All 5 sweets displayed in a grid:
   - Matcha Mochi - $3.50
   - Sakura Dango - $4.00
   - Yuzu Cheesecake - $5.50
   - Anmitsu Bowl - $6.00
   - Red Bean Taiyaki - $3.00
✅ Each sweet shows: Image, Name, Category, Price, Quantity, Purchase button


