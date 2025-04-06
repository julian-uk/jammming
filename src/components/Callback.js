import { useEffect } from 'react';

const Callback = () => {
  useEffect(() => {
    const fetchAccessToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const verifier = localStorage.getItem('code_verifier');

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: '26cbf9d6bc2e4cb194c9185464d954c4',
          grant_type: 'authorization_code',
          code,
          redirect_uri: 'http://localhost:3000/callback',
          code_verifier: verifier,
        }),
      });

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        window.location.href = '/search'; // redirect to your search page
      }

    };

    fetchAccessToken();
  }, []);

  return <p>Logging in...</p>;
};

export default Callback;
