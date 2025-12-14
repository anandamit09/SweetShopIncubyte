import React from 'react';
import './ProductCard.css';

function ProductCard({ product }) {
  const handleAddToCart = () => {
    // functionality here
  };

  const handleImageError = (e) => {
    // Fallback to a placeholder if image fails to load
    e.target.src = 'https://via.placeholder.com/400x400?text=' + encodeURIComponent(product.name);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
          onError={handleImageError}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price}</p>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;

