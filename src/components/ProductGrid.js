import React, { useState, useEffect } from 'react';
import './ProductGrid.css';
import ProductCard from './ProductCard';
import { sweetsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Always fetch products, regardless of authentication status
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching sweets (public endpoint, no auth required)...');
      const data = await sweetsAPI.getAll();
      console.log('Sweets fetched successfully:', data.length, 'items');
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleProductUpdate = () => {
    // Refresh products after purchase/update
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="loading-message">
        <p>Loading sweets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
        <button onClick={fetchProducts}>Retry</button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="no-products-message">
        <p>No sweets available. Add some sweets to get started!</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product}
          onUpdate={handleProductUpdate}
        />
      ))}
    </div>
  );
}

export default ProductGrid;

