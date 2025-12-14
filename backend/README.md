# Sweet Shop Backend API

Backend API for the Sweet Shop Management System built with Node.js, Express, and SQLite.

## Features

- **Authentication**: JWT-based user authentication with role-based access control
- **Sweets Management**: CRUD operations for sweets
- **Search & Filter**: Search sweets by name, category, and price range
- **Inventory Management**: Purchase and restock functionality

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
PORT=3001
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

3. Start the server:
```bash
npm run dev
```

4. Create admin user:
```bash
npm run create-admin
```
Default admin credentials:
- Username: `admin`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Sweets (Protected - requires JWT token)
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search?name=...&category=...&minPrice=...&maxPrice=...` - Search sweets
- `POST /api/sweets` - Add a new sweet
- `PUT /api/sweets/:id` - Update a sweet
- `DELETE /api/sweets/:id` - Delete a sweet (Admin only)

### Inventory (Protected - requires JWT token)
- `POST /api/sweets/:id/purchase` - Purchase a sweet (decreases quantity)
- `POST /api/sweets/:id/restock` - Restock a sweet (Admin only, increases quantity)

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Request/Response Examples

### Register
```json
POST /api/auth/register
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```json
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@sweetshop.com",
    "role": "admin"
  }
}
```

### Add Sweet
```json
POST /api/sweets
Authorization: Bearer <token>
{
  "name": "Matcha Mochi",
  "category": "Mochi",
  "price": 3.50,
  "quantity": 10,
  "image": "/images/MatchaMochi.jpg"
}
```

### Purchase Sweet
```json
POST /api/sweets/1/purchase
Authorization: Bearer <token>
{
  "quantity": 2  // optional, defaults to 1
}
```

### Restock Sweet (Admin only)
```json
POST /api/sweets/1/restock
Authorization: Bearer <admin-token>
{
  "quantity": 20
}
```

## Database Schema

### Users Table
- `id` (INTEGER PRIMARY KEY)
- `username` (TEXT UNIQUE)
- `email` (TEXT UNIQUE)
- `password` (TEXT - hashed)
- `role` (TEXT - 'user' or 'admin')
- `created_at` (DATETIME)

### Sweets Table
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT)
- `category` (TEXT)
- `price` (REAL)
- `quantity` (INTEGER)
- `image` (TEXT)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

## Testing

Run tests:
```bash
npm test
```

Watch mode:
```bash
npm run test:watch
```

