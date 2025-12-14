# Quick Start Guide

## Starting the Application

### Step 1: Start the Backend Server

Open a terminal and run:
```bash
cd backend
npm start
```

You should see:
```
Connected to SQLite database
Server running on port 3001
```

**Keep this terminal open!** The backend must be running for the frontend to work.

### Step 2: Start the Frontend

Open a **NEW terminal** (keep the backend terminal running) and run:
```bash
npm start
```

The frontend will open automatically in your browser at `http://localhost:3000`

## Default Login Credentials

- **Username:** `admin`
- **Password:** `admin123`

## Troubleshooting

### "ERR_CONNECTION_REFUSED" Error

This means the backend server is not running. 

**Solution:**
1. Make sure you've started the backend server (Step 1 above)
2. Check that it's running on port 3001
3. Verify by visiting: http://localhost:3001/health
   - You should see: `{"status":"OK","message":"Sweet Shop API is running"}`

### Backend Won't Start

1. Make sure you're in the `backend` directory
2. Install dependencies: `npm install`
3. Check for errors in the terminal

### Frontend Can't Connect to Backend

1. Verify backend is running (check http://localhost:3001/health)
2. Check that both servers are running:
   - Backend: `http://localhost:3001`
   - Frontend: `http://localhost:3000`
3. Make sure no firewall is blocking the connection

## Testing the Connection

1. Open the website
2. Click the "🔧 API Tester / Debug Tool" button
3. Click "Test Health Check" - should show success
4. Click "Test Login (Admin)" - should authenticate successfully
5. After login, sweets should appear on the main page

## What's Already Set Up

✅ Admin user created (admin/admin123)
✅ 5 initial sweets seeded in database
✅ API Tester accessible without login
✅ Frontend connected to backend

