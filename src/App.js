// File: App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import Spotify from './utils/Spotify';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [searchType, setSearchType] = useState('track');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    Spotify.getAccessToken();
    Spotify.getCurrentUser().then(setCurrentUser);
    Spotify.getUserPlaylists().then(setUserPlaylists);
  }, []);

  const addTrack = (track) => {
    if (playlistTracks.find(savedTrack => savedTrack.id === track.id)) return;
    setPlaylistTracks(prev => [...prev, track]);
  };

  const removeTrack = (track) => {
    setPlaylistTracks(prev => prev.filter(t => t.id !== track.id));
  };

  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  };

  const savePlaylist = () => {
    const trackURIs = playlistTracks.map(track => track.uri);
    if (selectedPlaylistId) {
      Promise.all([
        Spotify.updatePlaylistTracks(selectedPlaylistId, trackURIs),
        Spotify.renamePlaylist(selectedPlaylistId, playlistName)
      ]).then(() => {
        Spotify.getUserPlaylists().then(setUserPlaylists);
      });
    } else {
      Spotify.savePlaylist(playlistName, trackURIs).then(() => {
        setPlaylistName('New Playlist');
        setPlaylistTracks([]);
        Spotify.getUserPlaylists().then(setUserPlaylists);
      });
    }
  };

  const search = (term) => {
    if (!term) return;
    Spotify.search(term, searchType).then(setSearchResults);
  };

  const loadPlaylist = (playlist) => {
    setPlaylistName(playlist.name);
    setSelectedPlaylistId(playlist.id);
    Spotify.getPlaylistTracks(playlist.id).then(setPlaylistTracks);
  };

  const newPlaylist = () => {
    setPlaylistName('New Playlist');
    setPlaylistTracks([]);
    setSelectedPlaylistId(null);
  };

  const logout = () => {
    window.location.href = 'https://accounts.spotify.com/logout';
  };

  return (
    <div className="App">
      <div className="header-bar">
        <h1 className="app-title">🎵 Jammming 🎶</h1>
        {currentUser && (
          <div className="user-info">
            <span>Logged in as: {currentUser.display_name}</span>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Search by: </label>
        <select value={searchType} onChange={e => setSearchType(e.target.value)}>
          <option value="track">Track</option>
          <option value="artist">Artist</option>
        </select>
      </div>
      <SearchBar onSearch={search} />
      <div className="App-playlist">
        <div>
          <h2>Your Playlists</h2>
          <button onClick={newPlaylist} style={{ marginBottom: '10px' }}>+ New Playlist</button>
          <ul>
            {userPlaylists.map(p => (
              <li key={p.id}>
                <button onClick={() => loadPlaylist(p)}>{p.name}</button>
              </li>
            ))}
          </ul>
        </div>
        <SearchResults searchResults={searchResults} onAdd={addTrack} alignRight={true} />
        <Playlist
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          onRemove={removeTrack}
          onNameChange={updatePlaylistName}
          onSave={savePlaylist}
          alignRight={true}
        />
      </div>
    </div>
  );
}

export default App;