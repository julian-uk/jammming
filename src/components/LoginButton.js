
import React from 'react';
import { generateCodeVerifier, generateCodeChallenge } from '../utils/auth';

const clientId = '26cbf9d6bc2e4cb194c9185464d954c4';
const redirectUri = 'http://localhost:3000/callback';

const LoginButton = () => {
  const handleLogin = async () => {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem('code_verifier', verifier);

    const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=playlist-modify-public playlist-modify-private&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge_method=S256&code_challenge=${challenge}`;

    window.location = url;
  };

  return <button onClick={handleLogin}>Login with Spotify</button>;
};

export default LoginButton;
