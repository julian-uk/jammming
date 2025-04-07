import React from 'react';

function Track({ track, onAdd, onRemove, isRemoval }) {
  const handleClick = () => {
    isRemoval ? onRemove(track) : onAdd(track);
  };

  return (
    <div className="track">
      <div className="track-info">
        <p>{track.name} | {track.artist} | {track.album}</p>
        {track.preview_url && (
          <audio controls style={{ marginTop: '5px', width: '100%' }}>
            <source src={track.preview_url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>

      <button onClick={handleClick}>
        {isRemoval ? '-' : '+'}
      </button>
    </div>
  );
}

export default Track;
