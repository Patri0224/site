export async function handler(event) {
    const { code, verifier, redirect_uri } = JSON.parse(event.body);

    const client_id = '44a46de2fd8a4b38b962b7dcc81abccc';
    const token_url = 'https://accounts.spotify.com/api/token';

    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri,
        client_id: client_id,
        code_verifier: verifier
    });

    const res = await fetch(token_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    });

    const data = await res.json();
    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
}
