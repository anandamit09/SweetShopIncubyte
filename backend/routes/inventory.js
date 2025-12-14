const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Purchase sweet (Protected)
router.post('/:id/purchase', authenticateToken, [
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const purchaseQuantity = req.body.quantity || 1;

  // Get current sweet
  db.get('SELECT * FROM sweets WHERE id = ?', [id], (err, sweet) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    if (sweet.quantity < purchaseQuantity) {
      return res.status(400).json({ 
        error: 'Insufficient quantity available',
        available: sweet.quantity,
        requested: purchaseQuantity
      });
    }

    // Update quantity
    const newQuantity = sweet.quantity - purchaseQuantity;
    db.run(
      'UPDATE sweets SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newQuantity, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        db.get('SELECT * FROM sweets WHERE id = ?', [id], (err, updatedSweet) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({
            message: 'Purchase successful',
            sweet: updatedSweet,
            purchased: purchaseQuantity
          });
        });
      }
    );
  });
});

// Restock sweet (Admin only)
router.post('/:id/restock', authenticateToken, requireAdmin, [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { quantity } = req.body;

  // Get current sweet
  db.get('SELECT * FROM sweets WHERE id = ?', [id], (err, sweet) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    // Update quantity
    const newQuantity = sweet.quantity + quantity;
    db.run(
      'UPDATE sweets SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newQuantity, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        db.get('SELECT * FROM sweets WHERE id = ?', [id], (err, updatedSweet) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.json({
            message: 'Restock successful',
            sweet: updatedSweet,
            restocked: quantity
          });
        });
      }
    );
  });
});

module.exports = router;

