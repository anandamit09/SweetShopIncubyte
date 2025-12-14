# 🚀 Quick Start Guide - Backend Monitoring

## ✅ Your Backend is Running!

The server is currently running on **http://localhost:3001**

## 🔍 How to Check if Backend is Running

### Method 1: Quick Test Script (Easiest)
```bash
cd backend
npm run test-api
```

This will show you:
- ✅ Server status
- ✅ All endpoints working
- ✅ Any errors

### Method 2: Browser Check
Open in your browser:
```
http://localhost:3001/health
```

You should see:
```json
{
  "status": "OK",
  "message": "Sweet Shop API is running"
}
```

### Method 3: PowerShell Check
```powershell
Invoke-WebRequest -Uri http://localhost:3001/health
```

## 📊 Where to See Backend Activity

### 1. **Terminal/Console Window**
   - Where you ran `npm run dev` or `npm start`
   - Shows all server logs
   - Shows incoming requests
   - Shows errors

### 2. **Test Script Output**
   ```bash
   npm run test-api
   ```
   - Shows endpoint test results
   - Shows if everything is working

### 3. **Browser Developer Tools**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Make API requests
   - See request/response details

## 🛠️ Making Changes to Backend

### Files You Can Edit:

1. **`routes/auth.js`** - Login/Register logic
2. **`routes/sweets.js`** - Product CRUD operations
3. **`routes/inventory.js`** - Purchase/Restock logic
4. **`middleware/auth.js`** - Authentication rules
5. **`config/database.js`** - Database schema
6. **`server.js`** - Main server configuration

### After Editing:

- **If using `npm run dev`**: Changes auto-reload! ✨
- **If using `npm start`**: Restart manually (Ctrl+C, then `npm start`)

## 🧪 Testing Your Changes

1. **Run test script:**
   ```bash
   npm run test-api
   ```

2. **Or test specific endpoint:**
   ```bash
   # Login
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
   ```

## 📝 Common Commands

```bash
# Start server (development with auto-reload)
npm run dev

# Start server (production)
npm start

# Test all endpoints
npm run test-api

# Create admin user
npm run create-admin

# Run unit tests
npm test
```

## 🐛 Troubleshooting

### Server Not Running?
```bash
cd backend
npm run dev
```

### Port Already in Use?
```powershell
# Find what's using port 3001
Get-NetTCPConnection -LocalPort 3001

# Kill the process
Stop-Process -Id <PID>
```

### Database Issues?
```bash
# Delete database and restart (will recreate)
rm sweetshop.db
npm run dev
```

### Can't Login?
```bash
# Recreate admin user
npm run create-admin
```

## 📚 More Information

- **Full API Documentation**: See `README.md`
- **Testing Guide**: See `API_TESTING_GUIDE.md`
- **Setup Instructions**: See `SETUP.md`

## 🎯 Next Steps

1. ✅ Backend is running - Verified!
2. 🔗 Connect frontend to backend
3. 🧪 Test full user flow
4. 🚀 Deploy when ready

