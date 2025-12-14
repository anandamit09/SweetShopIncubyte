import React, { useState } from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import SearchFilter from './components/SearchFilter';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import APITester from './components/APITester';

function App() {
  const [showAPITester, setShowAPITester] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCheckoutComplete = () => {
    // Trigger refresh of ProductGrid by changing key
    setRefreshKey(prev => prev + 1);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
        <Header onCheckoutComplete={handleCheckoutComplete} />
        <div className="main-container">
          <div style={{ textAlign: 'right', marginBottom: '10px' }}>
            <button 
              onClick={() => setShowAPITester(!showAPITester)}
              style={{
                padding: '8px 16px',
                background: showAPITester ? '#666' : '#7b2cbf',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                marginRight: '10px'
              }}
            >
              {showAPITester ? '← Back to Shop' : '🔧 API Tester / Debug Tool'}
            </button>
          </div>
          {showAPITester ? (
            <APITester />
          ) : (
            <>
              <SearchFilter />
              <ProductGrid key={refreshKey} />
            </>
          )}
        </div>
        <Footer />
      </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

