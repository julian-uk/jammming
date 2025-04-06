// src/components/Search.js
import React, { useState } from 'react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);

  const handleSearch = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please log in to Spotify first.');
      return;
    }
    console.log(query);
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = await response.json();
      console.log('Search Response:', data);
      setTracks(data.tracks?.items || []);
    } catch (err) {
      console.error('Search failed:', err);
    }

  
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Search Spotify Tracks</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by track name"
        className="border p-2 w-64 mr-2"
      />
      <button onClick={handleSearch} className="bg-green-500 text-white px-4 py-2 rounded">
        Search
      </button>

      <div className="mt-6">
        {tracks.map((track) => (
          <div key={track.id} className="mb-4 border-b pb-2">
            <strong>{track.name}</strong> by {track.artists.map((a) => a.name).join(', ')}<br />
            <span className="text-sm text-gray-500">{track.album.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
