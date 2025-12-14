const request = require('supertest');
const app = require('../server');
const db = require('../config/database');

let authToken;
let adminToken;
let sweetId;

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

beforeEach(async () => {
  db.run('DELETE FROM sweets', () => {
    // Create a test sweet
    request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Sweet',
        category: 'Test',
        price: 5.00,
        quantity: 10
      })
      .then(res => {
        sweetId = res.body.id;
      });
  });
});

describe('Inventory Endpoints', () => {
  describe('POST /api/sweets/:id/purchase', () => {
    it('should purchase a sweet (default quantity 1)', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.sweet.quantity).toBe(9);
      expect(res.body.purchased).toBe(1);
    });

    it('should purchase multiple quantities', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 3 });

      expect(res.statusCode).toBe(200);
      expect(res.body.sweet.quantity).toBe(7);
      expect(res.body.purchased).toBe(3);
    });

    it('should not allow purchase if insufficient quantity', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 100 });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Insufficient quantity available');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    it('should restock a sweet (admin only)', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 20 });

      expect(res.statusCode).toBe(200);
      expect(res.body.sweet.quantity).toBe(30);
      expect(res.body.restocked).toBe(20);
    });

    it('should not allow non-admin to restock', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ quantity: 20 });

      expect(res.statusCode).toBe(403);
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .send({ quantity: 20 });

      expect(res.statusCode).toBe(401);
    });
  });
});

