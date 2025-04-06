// File: components/Playlist.jsx
import React from 'react';
import Tracklist from './Tracklist';

function Playlist({ playlistName, playlistTracks, onRemove, onNameChange, onSave }) {
  return (
    <div>
      <input value={playlistName} onChange={e => onNameChange(e.target.value)} />
      <Tracklist tracks={playlistTracks} onRemove={onRemove} isRemoval={true} />
      <button onClick={onSave}>Save To Spotify</button>
    </div>
  );
}

export default Playlist;