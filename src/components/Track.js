import React from 'react';

function Track({ track, onAdd, onRemove, isRemoval }) {
  const handleClick = () => {
    if (isRemoval) {
      onRemove(track);
    } else {
      onAdd(track);
    }
  };

  return (
    <div className="track">
      <p>{track.name} | {track.artist} | {track.album}</p>
      <button onClick={handleClick}>{isRemoval ? '-' : '+'}</button>
    </div>
  );
}

export default Track;
