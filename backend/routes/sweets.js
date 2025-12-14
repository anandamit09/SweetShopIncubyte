const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all sweets (Public - anyone can view)
router.get('/', (req, res) => {
  db.all('SELECT * FROM sweets ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Search sweets (Public - anyone can search)
router.get('/search', [
  query('name').optional().trim(),
  query('category').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, category, minPrice, maxPrice } = req.query;
  let query = 'SELECT * FROM sweets WHERE 1=1';
  const params = [];

  if (name) {
    query += ' AND name LIKE ?';
    params.push(`%${name}%`);
  }
  if (category) {
    query += ' AND category LIKE ?';
    params.push(`%${category}%`);
  }
  if (minPrice) {
    query += ' AND price >= ?';
    params.push(minPrice);
  }
  if (maxPrice) {
    query += ' AND price <= ?';
    params.push(maxPrice);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Add sweet (Protected)
router.post('/', authenticateToken, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('image').optional().trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, category, price, quantity, image } = req.body;

  db.run(
    'INSERT INTO sweets (name, category, price, quantity, image) VALUES (?, ?, ?, ?, ?)',
    [name, category, price, quantity, image || null],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error creating sweet' });
      }

      db.get('SELECT * FROM sweets WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json(row);
      });
    }
  );
});

// Update sweet (Protected)
router.put('/:id', authenticateToken, [
  body('name').optional().trim().notEmpty(),
  body('category').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('quantity').optional().isInt({ min: 0 }),
  body('image').optional().trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, category, price, quantity, image } = req.body;

  // Build update query dynamically
  const updates = [];
  const params = [];

  if (name !== undefined) {
    updates.push('name = ?');
    params.push(name);
  }
  if (category !== undefined) {
    updates.push('category = ?');
    params.push(category);
  }
  if (price !== undefined) {
    updates.push('price = ?');
    params.push(price);
  }
  if (quantity !== undefined) {
    updates.push('quantity = ?');
    params.push(quantity);
  }
  if (image !== undefined) {
    updates.push('image = ?');
    params.push(image);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(id);

  const query = `UPDATE sweets SET ${updates.join(', ')} WHERE id = ?`;

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    db.get('SELECT * FROM sweets WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(row);
    });
  });
});

// Delete sweet (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM sweets WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    res.json({ message: 'Sweet deleted successfully' });
  });
});

module.exports = router;

