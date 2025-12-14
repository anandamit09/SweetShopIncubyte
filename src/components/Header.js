import React from 'react';
import './Header.css';

function Header() {
  const handleAdminClick = () => {
    // functionality here
  };

  const handleSignInClick = () => {
    // functionality here
  };

  const handleSignUpClick = () => {
    // functionality here
  };

  return (
    <header className="header">
      <div className="header-left">
        <span className="logo-icon">🍃</span>
        <span className="logo-text">Kyoto Sweets</span>
      </div>
      <div className="header-center">
        <h1 className="main-title">Sweet Shop</h1>
      </div>
      <div className="header-right">
        <a href="#" className="admin-link" onClick={handleAdminClick}>Admin</a>
        <button className="sign-in-btn" onClick={handleSignInClick}>Sign In</button>
        <button className="sign-up-btn" onClick={handleSignUpClick}>Sign Up</button>
      </div>
    </header>
  );
}

export default Header;

