import React from 'react';
import './SearchFilter.css';

function SearchFilter() {
  const handleFilterClick = () => {
    // functionality here
  };

  const handleSearchChange = (e) => {
    // functionality here
  };

  return (
    <div className="search-filter-container">
      <button className="filter-btn" onClick={handleFilterClick}>
        <span className="filter-icon">☰</span>
        <span>Filter</span>
      </button>
      <div className="search-bar-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search sweets..."
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
}

export default SearchFilter;

