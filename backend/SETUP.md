# Backend Setup Instructions

## Quick Start

1. **Create `.env` file** in the `backend` directory:
```env
PORT=3001
JWT_SECRET=sweet-shop-secret-key-change-in-production
NODE_ENV=development
```

2. **Start the server** (this will initialize the database):
```bash
cd backend
npm run dev
```

3. **Create admin user** (in a new terminal):
```bash
cd backend
npm run create-admin
```

Default admin credentials:
- Username: `admin`
- Password: `admin123`

## Testing the API

### 1. Register a new user:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### 2. Login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Save the token from the response.

### 3. Get all sweets (requires token):
```bash
curl http://localhost:3001/api/sweets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Add a sweet:
```bash
curl -X POST http://localhost:3001/api/sweets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Matcha Mochi","category":"Mochi","price":3.50,"quantity":10,"image":"/images/MatchaMochi.jpg"}'
```

## Running Tests

```bash
cd backend
npm test
```

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database setup and initialization
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── sweets.js            # Sweets CRUD routes
│   └── inventory.js         # Purchase and restock routes
├── scripts/
│   └── createAdmin.js       # Admin user creation script
├── tests/
│   ├── auth.test.js         # Auth endpoint tests
│   ├── sweets.test.js       # Sweets endpoint tests
│   └── inventory.test.js    # Inventory endpoint tests
├── server.js                # Main server file
├── package.json
└── README.md
```

