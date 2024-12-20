



// Step 1: Login to Spotify
const login = () => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    window.location.hash = ''; // Rimuove il token nell'URL
    // Dichiarazione delle variabili necessarie
    const AUTH_URL = 'https://accounts.spotify.com/authorize';  // URL di autorizzazione Spotify
    const CLIENT_ID = 'd3efac0125d1444e9b68f2fb1784a6db';  // Sostituisci con il tuo Client ID di Spotify
    const REDIRECT_URI = 'https://studiopersonale.netlify.app/punteggio1/punteggio.html';  // Il tuo URI di redirect

    const SCOPES = 'user-read-currently-playing user-read-playback-state';  // Permessi necessari per l'accesso a Spotify

    // Costruisci l'URL di autorizzazione con l'opzione 'prompt=login'
    const url = `${AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=${encodeURIComponent(SCOPES)}&prompt=login`;

    // Reindirizza l'utente a Spotify per il login
    window.location.href = url;
};
const logout = () => {
    // Rimuovi il token di accesso dal localStorage o sessionStorage
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/punteggio1/';
    // Rimuovi il token dalla barra degli indirizzi
    window.location.hash = '';
    let newWindow = window.open('https://www.spotify.com/logout/', '_blank');

};
// Step 2: Handle redirect and get token
const handleRedirect = () => {
    const hash = window.location.hash;
    if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        accessToken = params.get('access_token');
        console.log('Access Token:', accessToken);
    }
};

// Step 3: Fetch the currently playing track
const fetchCurrentTrack = async (num) => {
    let tempPunto = punto;
    const API_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
    if (!accessToken) {
        current_track[tempPunto] = ogg;
        return;
    }

    try {
        const response = await fetch(API_ENDPOINT, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.status === 200) {
            const data = await response.json();
            let ogg1 = [3];
            ogg1[0] = data.item.name;
            ogg1[1] = data.item.artists.map(artist => artist.name).join(', ');
            ogg1[2] = data.item.id;
            current_track[tempPunto] = ogg1;
            if (num == 3) document.getElementById("currentSong").innerHTML = data.item.name + " of " + ogg1[1];
        } else {
            console.error('No track playing or API error:', response);
            current_track[tempPunto] = ogg;
        }
    } catch (error) {
        console.error('Error fetching current track:', error);
        current_track[tempPunto] = ogg;
    }
};

function songsToString(oggg) {
    var str = "";
    for (let index = 0; index < oggg.length; index++) {
        str += oggg[index][0] + "||" + oggg[index][1] + "||" + oggg[index][2];
        if (index < oggg.length - 1) {
            str += "///";
        }
    }
    return str;
}
function songsFromString(str) {
    var oggg = [];
    var oggg1 = str.split("///");
    for (let index = 0; index < oggg1.length; index++) {
        let oggg2 = oggg1[index].split("||");
        oggg.push(oggg2);
    }
    return oggg;
}
handleRedirect();