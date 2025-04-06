// File: utils/Spotify.js
const clientId = '26cbf9d6bc2e4cb194c9185464d954c4';
const redirectUri = 'http://localhost:3000/';
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) return accessToken;

    const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (tokenMatch && expiresInMatch) {
      accessToken = tokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessUrl =
        'https://accounts.spotify.com/authorize?' +
        `client_id=${clientId}&response_type=token&scope=playlist-modify-public playlist-read-private user-read-private&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  getCurrentUser() {
    const token = Spotify.getAccessToken();
    return fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => response.json());
  },

  search(term, type = 'track') {
    const token = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=${type}&q=${encodeURIComponent(term)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => response.json())
      .then(jsonResponse => {
        if (!jsonResponse.tracks && !jsonResponse.artists) return [];

        if (type === 'artist') {
          const artists = jsonResponse.artists.items;
          return artists.map(artist => ({
            id: artist.id,
            name: artist.name,
            artist: artist.name,
            album: '-',
            uri: artist.uri,
            genres: artist.genres?.join(', ') || 'N/A'
          }));
        }

        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          genres: track.artists[0].genres?.join(', ') || 'N/A'
        }));
      });
  },

  getUserPlaylists() {
    const token = Spotify.getAccessToken();
    return fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(jsonResponse => jsonResponse.items || []);
  },

  getPlaylistTracks(playlistId) {
    const token = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(jsonResponse => {
        return jsonResponse.items.map(item => {
          const track = item.track;
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
            genres: 'N/A'
          };
        });
      });
  },

  savePlaylist(name, uris) {
    if (!name || !uris.length) return Promise.resolve();

    const token = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${token}` };
    let userId;

    return fetch('https://api.spotify.com/v1/me', { headers: headers })
      .then(response => response.json())
      .then(jsonResponse => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ name: name })
        });
      })
      .then(response => response.json())
      .then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ uris: uris })
        });
      });
  },

  updatePlaylistTracks(playlistId, uris) {
    const token = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({ uris: uris })
    });
  },

  renamePlaylist(playlistId, newName) {
    const token = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newName })
    });
  }
  
};


  // Add to Spotify.js
Spotify.getSavedArtists = function () {
    const token = Spotify.getAccessToken();
    return fetch('https://api.spotify.com/v1/me/following?type=artist', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(jsonResponse => jsonResponse.artists.items || []);
  };
  

export default Spotify;
