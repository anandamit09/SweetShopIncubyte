import React, { useState } from 'react';
import './Cart.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { inventoryAPI } from '../services/api';

function Cart({ onClose, onCheckoutComplete }) {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setMessage('Please log in to complete purchase');
      return;
    }

    if (cartItems.length === 0) {
      setMessage('Cart is empty');
      return;
    }

    setProcessing(true);
    setMessage('');

    try {
      // Process each item in cart
      const promises = cartItems.map(item =>
        inventoryAPI.purchase(item.id, item.quantity)
      );

      await Promise.all(promises);
      
      setMessage('Purchase successful! Thank you for your order.');
      clearCart();
      
      // Notify parent to refresh products
      if (onCheckoutComplete) {
        onCheckoutComplete();
      }
      
      // Close cart after 2 seconds
      setTimeout(() => {
        onClose();
        setMessage('');
      }, 2000);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="cart-close-btn" onClick={onClose}>×</button>
        </div>

        {message && (
          <div className={`cart-message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty</p>
            <button className="continue-shopping-btn" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image || '/images/placeholder.jpg'} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="cart-item-category">{item.category}</p>
                    <p className="cart-item-price">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="cart-item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={processing}
                    >
                      −
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={processing}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-total">
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button
                    className="remove-item-btn"
                    onClick={() => removeFromCart(item.id)}
                    disabled={processing}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <h3>Total: ${getTotalPrice().toFixed(2)}</h3>
              </div>
              <div className="cart-actions">
                <button
                  className="clear-cart-btn"
                  onClick={clearCart}
                  disabled={processing}
                >
                  Clear Cart
                </button>
                <button
                  className="checkout-btn"
                  onClick={handleCheckout}
                  disabled={processing || !isAuthenticated}
                >
                  {processing ? 'Processing...' : 'Checkout'}
                </button>
              </div>
              {!isAuthenticated && (
                <p className="login-required">Please log in to checkout</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;

