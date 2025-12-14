require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const sweetsRoutes = require('./routes/sweets');
const inventoryRoutes = require('./routes/inventory');

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);
app.use('/api/sweets', inventoryRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sweet Shop API is running' });
});

// API Info endpoint (public, no auth required)
app.get('/api', (req, res) => {
  res.json({
    message: 'Sweet Shop API',
    version: '1.0.0',
    endpoints: {
      public: [
        'GET /health - Health check',
        'GET /api - API information (this endpoint)',
        'POST /api/auth/register - Register new user',
        'POST /api/auth/login - Login user',
        'GET /api/sweets - Get all sweets (public)',
        'GET /api/sweets/search - Search sweets (public)'
      ],
      protected: [
        'POST /api/sweets - Add sweet (requires auth)',
        'PUT /api/sweets/:id - Update sweet (requires auth)',
        'DELETE /api/sweets/:id - Delete sweet (admin only)',
        'POST /api/sweets/:id/purchase - Purchase sweet (requires auth)',
        'POST /api/sweets/:id/restock - Restock sweet (admin only)'
      ],
      note: 'Protected endpoints require JWT token in Authorization header: Bearer <token>'
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

