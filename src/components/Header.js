import React, { useState, useEffect } from 'react';
import './Header.css';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import AdminPanel from './AdminPanel';
import Cart from './Cart';

function Header() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { getTotalItems } = useCart();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // Debug: Log admin status
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Header - User:', user);
      console.log('Header - User Role:', user?.role);
      console.log('Header - Is Admin:', isAdmin());
    }
  }, [isAuthenticated, user]);

  const handleAdminClick = (e) => {
    e.preventDefault();
    setShowAdminPanel(true);
  };

  const handleSignInClick = () => {
    setShowLogin(true);
  };

  const handleSignUpClick = () => {
    setShowRegister(true);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <span className="logo-icon">🍃</span>
          <span className="logo-text">Kyoto Sweets</span>
        </div>
        <div className="header-center">
          <h1 className="main-title">Sweet Shop</h1>
        </div>
        <div className="header-right">
          <button className="cart-icon-btn" onClick={() => setShowCart(true)}>
            🛒
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </button>
          {isAuthenticated ? (
            <>
              {user && (user.role === 'admin' || isAdmin()) && (
                <a 
                  href="#" 
                  className="admin-link" 
                  onClick={handleAdminClick}
                  title="Open Admin Panel"
                >
                  🔧 Admin Panel
                </a>
              )}
              <span className="user-info">
                Hello, {user?.username || 'User'}
                {user?.role === 'admin' && (
                  <span style={{ color: '#7b2cbf', marginLeft: '5px', fontWeight: '600' }}>(Admin)</span>
                )}
              </span>
              <button className="sign-in-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="sign-in-btn" onClick={handleSignInClick}>
                Sign In
              </button>
              <button className="sign-up-btn" onClick={handleSignUpClick}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
      {showCart && (
        <Cart 
          onClose={() => setShowCart(false)} 
        />
      )}
    </>
  );
}

export default Header;

