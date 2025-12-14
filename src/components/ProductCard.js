import React, { useState } from 'react';
import './ProductCard.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function ProductCard({ product, onUpdate }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Please log in to add items to cart.');
      return;
    }

    if (product.quantity < quantity) {
      alert(`Only ${product.quantity} items available in stock.`);
      return;
    }

    addToCart(product, quantity);
    setQuantity(1); // Reset quantity after adding
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
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
        
        {!isOutOfStock && isAuthenticated && (
          <div className="quantity-selector">
            <button
              className="qty-btn"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="qty-value">{quantity}</span>
            <button
              className="qty-btn"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product.quantity}
            >
              +
            </button>
          </div>
        )}

        <button 
          className={`purchase-btn ${isOutOfStock || !isAuthenticated ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock || !isAuthenticated}
        >
          {!isAuthenticated ? 'Login to Add to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;

