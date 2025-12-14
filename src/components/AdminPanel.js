import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import { sweetsAPI, inventoryAPI } from '../services/api';

function AdminPanel({ onClose }) {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSweet, setEditingSweet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    image: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const data = await sweetsAPI.getAll();
      setSweets(data);
    } catch (err) {
      setError('Failed to fetch sweets: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sweet) => {
    setEditingSweet(sweet.id);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
      image: sweet.image || ''
    });
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditingSweet(null);
    setFormData({ name: '', category: '', price: '', quantity: '', image: '' });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    try {
      setError('');
      setSuccess('');

      const updates = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        image: formData.image
      };

      await sweetsAPI.update(editingSweet, updates);
      setSuccess('Sweet updated successfully!');
      setEditingSweet(null);
      fetchSweets();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update sweet: ' + err.message);
    }
  };

  const handleRestock = async (id, currentQuantity) => {
    const addQuantity = prompt(`Current quantity: ${currentQuantity}\nHow many to add?`);
    if (addQuantity === null || addQuantity === '') return;

    const quantity = parseInt(addQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      setError('Please enter a valid positive number');
      return;
    }

    try {
      setError('');
      setSuccess('');
      await inventoryAPI.restock(id, quantity);
      setSuccess(`Restocked ${quantity} items successfully!`);
      fetchSweets();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to restock: ' + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await sweetsAPI.delete(id);
      setSuccess('Sweet deleted successfully!');
      fetchSweets();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete sweet: ' + err.message);
    }
  };

  const handleAddNew = () => {
    setEditingSweet('new');
    setFormData({ name: '', category: '', price: '', quantity: '', image: '' });
    setError('');
    setSuccess('');
  };

  const handleSaveNew = async () => {
    try {
      setError('');
      setSuccess('');

      const newSweet = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        image: formData.image || '/images/placeholder.jpg'
      };

      await sweetsAPI.add(newSweet);
      setSuccess('New sweet added successfully!');
      setEditingSweet(null);
      setFormData({ name: '', category: '', price: '', quantity: '', image: '' });
      fetchSweets();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add sweet: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-panel-overlay">
        <div className="admin-panel">
          <div className="loading-message">Loading sweets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel-overlay" onClick={onClose}>
      <div className="admin-panel" onClick={(e) => e.stopPropagation()}>
        <div className="admin-panel-header">
          <h2>Admin Panel</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="admin-message error">{error}</div>}
        {success && <div className="admin-message success">{success}</div>}

        <div className="admin-actions">
          <button className="add-new-btn" onClick={handleAddNew}>
            + Add New Sweet
          </button>
        </div>

        {editingSweet === 'new' && (
          <div className="edit-form">
            <h3>Add New Sweet</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Sweet name"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Category"
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/images/sweet.jpg"
              />
            </div>
            <div className="form-actions">
              <button className="save-btn" onClick={handleSaveNew}>Save</button>
              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        )}

        <div className="sweets-list">
          <h3>Manage Sweets ({sweets.length})</h3>
          {sweets.length === 0 ? (
            <p className="no-sweets">No sweets in database</p>
          ) : (
            <div className="sweets-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sweets.map((sweet) => (
                    <tr key={sweet.id}>
                      {editingSweet === sweet.id ? (
                        <>
                          <td>{sweet.id}</td>
                          <td>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="edit-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                              className="edit-input"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.price}
                              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                              className="edit-input"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={formData.quantity}
                              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                              className="edit-input"
                            />
                          </td>
                          <td>
                            <button className="save-btn-small" onClick={handleSave}>Save</button>
                            <button className="cancel-btn-small" onClick={handleCancel}>Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{sweet.id}</td>
                          <td>{sweet.name}</td>
                          <td>{sweet.category}</td>
                          <td>${sweet.price.toFixed(2)}</td>
                          <td>{sweet.quantity}</td>
                          <td>
                            <div className="action-buttons">
                              <button className="edit-btn" onClick={() => handleEdit(sweet)}>Edit</button>
                              <button className="restock-btn" onClick={() => handleRestock(sweet.id, sweet.quantity)}>Restock</button>
                              <button className="delete-btn" onClick={() => handleDelete(sweet.id, sweet.name)}>Delete</button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;

