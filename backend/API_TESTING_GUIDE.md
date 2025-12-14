# Backend API Testing Guide

## Quick Check: Is the Backend Running?

### Method 1: Run the Test Script
```bash
cd backend
node test-api.js
```

This will test:
- ✅ Server health check
- ✅ User registration
- ✅ User login
- ✅ Get all sweets
- ✅ Add a new sweet

### Method 2: Check Health Endpoint
Open your browser or use curl:
```
http://localhost:3001/health
```

Or in PowerShell:
```powershell
Invoke-WebRequest -Uri http://localhost:3001/health
```

### Method 3: Check if Port is Open
```powershell
Test-NetConnection -ComputerName localhost -Port 3001
```

## Starting the Server

### Development Mode (with auto-reload):
```bash
cd backend
npm run dev
```

### Production Mode:
```bash
cd backend
npm start
```

You should see:
```
Server running on port 3001
Connected to SQLite database
```

## Viewing Logs

The server logs will show:
- Server startup messages
- Database connection status
- Request logs (if you add logging middleware)
- Error messages

## Testing Individual Endpoints

### 1. Health Check
```bash
curl http://localhost:3001/health
```

### 2. Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### 3. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

Save the token from the response!

### 4. Get All Sweets (replace YOUR_TOKEN)
```bash
curl http://localhost:3001/api/sweets \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Add a Sweet
```bash
curl -X POST http://localhost:3001/api/sweets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Matcha Mochi\",\"category\":\"Mochi\",\"price\":3.50,\"quantity\":10,\"image\":\"/images/MatchaMochi.jpg\"}"
```

## Using Postman

1. **Import Collection**: Create a new collection in Postman
2. **Set Base URL**: `http://localhost:3001`
3. **Add Requests**:
   - POST `/api/auth/register`
   - POST `/api/auth/login`
   - GET `/api/sweets` (add Authorization header)
   - POST `/api/sweets` (add Authorization header)

4. **Set Environment Variables**:
   - `base_url`: `http://localhost:3001`
   - `token`: (set after login)

## Common Issues & Solutions

### Issue: "Cannot GET /"
**Solution**: Make sure you're using the correct endpoint. Try `/health` first.

### Issue: "Port 3001 already in use"
**Solution**: 
```powershell
# Find process using port 3001
Get-NetTCPConnection -LocalPort 3001 | Select-Object OwningProcess

# Kill the process (replace PID)
Stop-Process -Id <PID>
```

### Issue: "SQLITE_ERROR: no such table"
**Solution**: The database wasn't initialized. Start the server once to create tables.

### Issue: "Invalid or expired token"
**Solution**: Login again to get a new token. Tokens expire after 24 hours.

### Issue: "Admin access required"
**Solution**: Make sure you're logged in as admin:
```bash
npm run create-admin
# Then login with username: admin, password: admin123
```

## Making Changes

### Key Files to Modify:

1. **Routes** (`routes/` folder):
   - `auth.js` - Authentication logic
   - `sweets.js` - Sweets CRUD operations
   - `inventory.js` - Purchase/restock logic

2. **Middleware** (`middleware/auth.js`):
   - JWT token validation
   - Admin authorization

3. **Database** (`config/database.js`):
   - Database schema
   - Initial data setup

4. **Server** (`server.js`):
   - Main server configuration
   - Route mounting

### After Making Changes:

1. **If using `npm run dev`**: Changes auto-reload
2. **If using `npm start`**: Restart the server manually
3. **Test your changes**: Run `node test-api.js` or use Postman

## Database Inspection

To view the database directly:
```bash
# Install SQLite CLI (if not installed)
# Then:
sqlite3 backend/sweetshop.db

# In SQLite:
.tables                    # List all tables
SELECT * FROM users;       # View users
SELECT * FROM sweets;      # View sweets
.schema                    # View table schemas
.quit                      # Exit
```

## Monitoring

### Check Server Status:
```powershell
# Check if Node.js is running
Get-Process -Name node

# Check port 3001
Test-NetConnection -ComputerName localhost -Port 3001
```

### View Real-time Logs:
The server logs appear in the terminal where you ran `npm run dev` or `npm start`.

## Next Steps

1. ✅ Verify server is running: `node test-api.js`
2. ✅ Test all endpoints with Postman or curl
3. ✅ Connect frontend to backend
4. ✅ Test full user flow (register → login → browse → purchase)

