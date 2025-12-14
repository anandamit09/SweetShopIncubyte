import React from 'react';
import './App.css';
import Header from './components/Header';
import SearchFilter from './components/SearchFilter';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="main-container">
        <SearchFilter />
        <ProductGrid />
      </div>
      <Footer />
    </div>
  );
}

export default App;

