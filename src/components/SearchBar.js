// File: SearchBar.jsx
import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');

  const handleSearch = () => {
    if (term.trim()) {
      onSearch(term);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="search" style={{ marginRight: '8px' }}>Search:</label>
      <input
        id="search"
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type artist or track name..."
      />
      <button onClick={handleSearch} style={{ marginLeft: '10px' }}>Search</button>
    </div>
  );
}

export default SearchBar;