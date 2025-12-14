# How to Test Frontend-Backend API Connection

## Prerequisites

1. **Backend must be running** on `http://localhost:3001`
   ```bash
   cd backend
   npm run dev
   ```

2. **Frontend must be running** on `http://localhost:3000`
   ```bash
   npm start
   ```

## Testing Steps

### Step 1: Check Backend is Running

Open in browser or use curl:
```
http://localhost:3001/health
```

Should see:
```json
{
  "status": "OK",
  "message": "Sweet Shop API is running"
}
```

### Step 2: Test Frontend Connection

1. **Open the frontend** in browser: `http://localhost:3000`

2. **You should see**: "Please log in to view sweets" message
   - This confirms the frontend is checking authentication

### Step 3: Test Registration

1. Click **"Sign Up"** button in header
2. Fill in the form:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
3. Click **"Sign Up"**
4. **Expected**: Modal closes, you're logged in, sweets appear

**Check Browser Console (F12)**:
- Should see successful API call to `/api/auth/register`
- No errors

### Step 4: Test Login

1. Click **"Logout"** (if logged in)
2. Click **"Sign In"** button
3. Use admin credentials:
   - Username: `admin`
   - Password: `admin123`
4. Click **"Sign In"**
5. **Expected**: Modal closes, you're logged in, sweets appear

**Check Browser Console (F12)**:
- Should see successful API call to `/api/auth/login`
- Token stored in localStorage

### Step 5: Test Fetching Sweets

1. After logging in, **sweets should load automatically**
2. **Expected**: Either:
   - List of sweets (if any exist in database)
   - "No sweets available" message (if database is empty)

**Check Browser Console (F12)**:
- Should see API call to `/api/sweets`
- Response with sweets array

**Check Network Tab (F12 → Network)**:
- Look for request to `http://localhost:3001/api/sweets`
- Status should be `200 OK`
- Response should contain sweets data

### Step 6: Test Purchase Functionality

1. If sweets are displayed, click **"Purchase"** button on any sweet
2. **Expected**: 
   - Button shows "Purchasing..." briefly
   - Success message appears
   - Quantity decreases by 1
   - Product list refreshes

**Check Browser Console (F12)**:
- Should see API call to `/api/sweets/:id/purchase`
- Success response

**Check Network Tab**:
- POST request to `http://localhost:3001/api/sweets/:id/purchase`
- Status `200 OK`

### Step 7: Test Out of Stock

1. Purchase a sweet until quantity reaches 0
2. **Expected**:
   - "Purchase" button becomes disabled
   - Shows "Out of Stock" message
   - Button is grayed out

## Debugging Tips

### If Sweets Don't Load:

1. **Check Browser Console (F12)**:
   - Look for error messages
   - Check if API calls are being made

2. **Check Network Tab**:
   - See if requests are reaching the backend
   - Check response status codes
   - Look at response data

3. **Common Issues**:
   - **CORS Error**: Backend CORS is configured, but check if backend is running
   - **401 Unauthorized**: Token not being sent, check localStorage
   - **404 Not Found**: Wrong API URL, check `src/services/api.js`
   - **500 Server Error**: Check backend logs

### Check localStorage:

1. Open Browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Local Storage** → `http://localhost:3000`
4. Should see:
   - `token`: JWT token string
   - `user`: User object with username, email, role

### Check API Service:

Open `src/services/api.js` and verify:
- `API_BASE_URL` is correct: `http://localhost:3001/api`
- All functions are exported correctly

### Test API Directly:

Use curl or Postman to test backend directly:

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"

# Get sweets (use token from login response)
curl http://localhost:3001/api/sweets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Expected Behavior Summary

✅ **Working Correctly**:
- Login/Register modals appear
- After login, sweets load from API
- Purchase button works and updates quantity
- Out of stock items show disabled button
- User info appears in header when logged in
- Logout works and clears session

❌ **Not Working**:
- Sweets don't load → Check API connection
- Login fails → Check backend is running
- Purchase fails → Check authentication token
- CORS errors → Check backend CORS configuration

## Quick Verification Checklist

- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Sweets load after login
- [ ] Purchase button works
- [ ] Quantity updates after purchase
- [ ] Out of stock items are disabled
- [ ] No console errors
- [ ] Network requests show 200 status

## Need Help?

If something isn't working:
1. Check browser console for errors
2. Check network tab for failed requests
3. Check backend terminal for errors
4. Verify both servers are running
5. Check localStorage for token

