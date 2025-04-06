// File: components/SearchResults.jsx
import React from 'react';
import Tracklist from './Tracklist';

function SearchResults({ searchResults, onAdd }) {
  return (
    <div>
      <h2>Results</h2>
      <Tracklist tracks={searchResults} onAdd={onAdd} isRemoval={false} />
    </div>
  );
}

export default SearchResults;