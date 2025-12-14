import React, { useState } from 'react';
import './ProductCard.css';
import { inventoryAPI } from '../services/api';

function ProductCard({ product, onUpdate }) {
  const [purchasing, setPurchasing] = useState(false);
  const [message, setMessage] = useState('');

  const handlePurchase = async () => {
    try {
      setPurchasing(true);
      setMessage('');
      await inventoryAPI.purchase(product.id, 1);
      setMessage('Purchase successful!');
      // Refresh product list
      if (onUpdate) {
        setTimeout(() => {
          onUpdate();
          setMessage('');
        }, 1000);
      }
    } catch (error) {
      setMessage(error.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  const handleImageError = (e) => {
    // Fallback to a placeholder if image fails to load
    e.target.src = 'https://via.placeholder.com/400x400?text=' + encodeURIComponent(product.name);
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `$${price.toFixed(2)}`;
    }
    return price;
  };

  const isOutOfStock = product.quantity === 0;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image || '/images/placeholder.jpg'} 
          alt={product.name}
          className="product-image"
          onError={handleImageError}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.category && (
          <p className="product-category">{product.category}</p>
        )}
        <p className="product-price">{formatPrice(product.price)}</p>
        <p className="product-quantity">
          {isOutOfStock ? 'Out of Stock' : `In Stock: ${product.quantity}`}
        </p>
        {message && (
          <p className={`product-message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
        <button 
          className={`purchase-btn ${isOutOfStock ? 'disabled' : ''}`}
          onClick={handlePurchase}
          disabled={isOutOfStock || purchasing}
        >
          {purchasing ? 'Purchasing...' : 'Purchase'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;

