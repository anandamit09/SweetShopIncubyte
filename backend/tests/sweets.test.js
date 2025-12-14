const request = require('supertest');
const app = require('../server');
const db = require('../config/database');
const jwt = require('jsonwebtoken');

let authToken;
let adminToken;

beforeAll(async () => {
  // Create test user and get token
  await request(app)
    .post('/api/auth/register')
    .send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      username: 'testuser',
      password: 'password123'
    });

  authToken = loginRes.body.token;

  // Get admin token
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({
      username: 'admin',
      password: 'admin123'
    });

  adminToken = adminRes.body.token;
});

beforeEach((done) => {
  db.run('DELETE FROM sweets', done);
});

describe('Sweets Endpoints', () => {
  describe('GET /api/sweets', () => {
    it('should get all sweets', async () => {
      // Add a sweet first
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Sweet',
          category: 'Test',
          price: 5.00,
          quantity: 10
        });

      const res = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .get('/api/sweets');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/sweets', () => {
    it('should create a new sweet', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Matcha Mochi',
          category: 'Mochi',
          price: 3.50,
          quantity: 10,
          image: '/images/MatchaMochi.jpg'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('Matcha Mochi');
      expect(res.body.category).toBe('Mochi');
      expect(res.body.price).toBe(3.50);
      expect(res.body.quantity).toBe(10);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '',
          price: -5
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Matcha Mochi',
          category: 'Mochi',
          price: 3.50,
          quantity: 10
        });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Sakura Dango',
          category: 'Dango',
          price: 4.00,
          quantity: 5
        });
    });

    it('should search by name', async () => {
      const res = await request(app)
        .get('/api/sweets/search?name=Matcha')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Matcha Mochi');
    });

    it('should search by category', async () => {
      const res = await request(app)
        .get('/api/sweets/search?category=Mochi')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].category).toBe('Mochi');
    });

    it('should filter by price range', async () => {
      const res = await request(app)
        .get('/api/sweets/search?minPrice=3.5&maxPrice=4.0')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Sweet',
          category: 'Test',
          price: 5.00,
          quantity: 10
        });
      sweetId = res.body.id;
    });

    it('should update a sweet', async () => {
      const res = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Sweet',
          price: 6.00
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated Sweet');
      expect(res.body.price).toBe(6.00);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Sweet',
          category: 'Test',
          price: 5.00,
          quantity: 10
        });
      sweetId = res.body.id;
    });

    it('should delete a sweet (admin only)', async () => {
      const res = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Sweet deleted successfully');
    });

    it('should not allow non-admin to delete', async () => {
      const res = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(403);
    });
  });
});

