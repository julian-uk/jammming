
// File: src/utils/Spotify.js

const clientId = '26cbf9d6bc2e4cb194c9185464d954c4'; // Replace with your Spotify client ID
const redirectUri = 'http://localhost:3000/'; // Ensure this matches your Spotify app settings
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    // Check for access token match in URL
    const tokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (tokenMatch && expiresInMatch) {
      accessToken = tokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      // Clear parameters from URL to allow retrieval of a new token when it expires
      window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      // Redirect to Spotify authorization
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  search(term, searchType = 'track') {
    const token = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=${searchType}&q=${term}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(jsonResponse => {
        if (!jsonResponse[`${searchType}s`]) {
          return [];
        }
        return jsonResponse[`${searchType}s`].items.map(item => ({
          id: item.id,
          name: item.name,
          artist: item.artists ? item.artists[0].name : '',
          album: item.album ? item.album.name : '',
          uri: item.uri,
          preview_url: item.preview_url // Include preview URL for audio samples
        }));
      });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const token = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${token}` };
    let userId;

    return fetch('https://api.spotify.com/v1/me', { headers })
      .then(response => response.json())
      .then(jsonResponse => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers,
          method: 'POST',
          body: JSON.stringify({ name })
        });
      })
      .then(response => response.json())
      .then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers,
          method: 'POST',
          body: JSON.stringify({ uris: trackUris })
        });
      });
  },

  getCurrentUser() {
    const token = Spotify.getAccessToken();
    return fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => response.json());
  },

  getUserPlaylists() {
    const token = Spotify.getAccessToken();
    return fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(jsonResponse => {
        if (!jsonResponse.items) {
          return [];
        }
        return jsonResponse.items.map(playlist => ({
          id: playlist.id,
          name: playlist.name
        }));
      });
  },

  getPlaylistTracks(playlistId) {
    const token = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(jsonResponse => {
        if (!jsonResponse.items) {
          return [];
        }
        return jsonResponse.items.map(({ track }) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          preview_url: track.preview_url // Include preview URL for audio samples
        }));
      });
  },

  updatePlaylistTracks(playlistId, trackUris) {
    const token = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify({ uris: trackUris })
    });
  },

  renamePlaylist(playlistId, newName) {
    const token = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify({ name: newName })
    });
  }
};

export default Spotify;

