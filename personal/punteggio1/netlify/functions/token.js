const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { code, verifier, redirect_uri } = JSON.parse(event.body);

  const params = new URLSearchParams();
  params.append('client_id', process.env.SPOTIFY_CLIENT_ID);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirect_uri);
  params.append('code_verifier', verifier);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString()
  });

  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
// Assicurati di avere le variabili d'ambiente SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET configurate su Netlify
// Puoi configurarle nella sezione "Environment Variables" delle impostazioni del tuo sito su