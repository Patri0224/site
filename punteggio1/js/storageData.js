function saveData() {
    // Ottieni i dati delle squadre
    const newName = prompt("Inserisci il nome del file:");
    if (newName == null) return;
    const team1Name = document.getElementById('name-team1').textContent;
    const team1Score = document.getElementById('score-team1').textContent;
    const team1Image = document.getElementById('1').src;
    const team2Name = document.getElementById('name-team2').textContent;
    const team2Score = document.getElementById('score-team2').textContent;
    const team2Image = document.getElementById('2').src;
    const h1 = punteggio1;
    const h2 = punteggio2;
    const m1 = squadra1;
    const m2 = squadra2;
    const fraa = fra;
    const punt = punto;
    const songs = songsToString(current_track);
    const temps = tempi.join(";");

    // Crea una stringa con i dati formattati
    const data = {
        team1: {
            name: team1Name,
            score: team1Score,
            image: team1Image,
            history: h1,
            member: m1
        },
        team2: {
            name: team2Name,
            score: team2Score,
            image: team2Image,
            history: h2,
            member: m2
        },
        fra: fraa,
        songs: songs,
        temps: temps,
        punt: punt
    };

    const jsonData = JSON.stringify(data, null, 2); // null, 2 per un formato leggibile

    // Crea un URL di tipo "data:" per il file JSON
    const dataUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonData); // Crea l'URL data

    // Crea un link temporaneo per il download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = newName + ".partita.json"; // Nome del file da scaricare

    // Simula il click sul link per scaricare il file
    link.click();
    showMenu(2);
}
function loadData(event) {
    const file = event.target.files[0]; // Ottieni il file selezionato
    if (!file) return;

    const reader = new FileReader();

    // Funzione che viene chiamata quando il file è stato letto
    reader.onload = function (e) {

        const fileContent = e.target.result;

        try {
            // Parsea il contenuto JSON
            const data = JSON.parse(fileContent);
            // Aggiorna la pagina con i dati letti
            document.getElementById('name-team1').textContent = data.team1.name;
            document.getElementById('score-team1').textContent = data.team1.score;
            document.getElementById('1').src = data.team1.image;
            document.getElementById('name-team2').textContent = data.team2.name;
            document.getElementById('score-team2').textContent = data.team2.score;
            document.getElementById('2').src = data.team2.image;
            punteggio1 = data.team1.history;
            punteggio2 = data.team2.history;
            squadra1 = data.team1.member;
            squadra2 = data.team2.member;
            fra = data.fra;
            punto = data.punt;
            current_track = songsFromString(data.songs);
            tempi = data.temps.split(";");
        } catch (error) {
            alert("Errore nel caricamento del file. Assicurati che sia un file JSON valido.");
        }
        controlloIndietro();
        controlImgBackground();
        settaSquadre();
    };

    // Leggi il file come testo
    reader.readAsText(file);
    updateBackground();
    showMenu(2);
}
function preset() {
    const newName = prompt("inserisci qualcosa per attivare il preset");
    if (newName) {
        document.getElementById('name-team1').textContent = "Andrilde";
        document.getElementById('score-team1').textContent = "0";
        document.getElementById('1').src = null;
        document.getElementById('name-team2').textContent = "Frarco";
        document.getElementById('score-team2').textContent = "0";
        document.getElementById('2').src = null;
        punteggio1 = "0|0";
        punteggio2 = "0|0";
        current_track = [];
        tempi = [];
        punto = 0;
        squadra1 = "2;9;11;13";
        squadra2 = "1;6;10;14";
        fra = 0;

        localStorage.setItem("nt1", document.getElementById('name-team1').textContent);
        localStorage.setItem("st1", document.getElementById('score-team1').textContent);
        localStorage.setItem("it1", document.getElementById('1').src);
        localStorage.setItem("nt2", document.getElementById('name-team2').textContent);
        localStorage.setItem("st2", document.getElementById('score-team2').textContent);
        localStorage.setItem("it2", document.getElementById('2').src);
        localStorage.setItem("h1", punteggio1);
        localStorage.setItem("h2", punteggio2);
        localStorage.setItem("m1", squadra1);
        localStorage.setItem("m2", squadra2);
        localStorage.setItem("fra", fra);
        localStorage.setItem("punt", punto);
        localStorage.setItem("songs", current_track);
        localStorage.setItem("temps", tempi);
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token');

        // Rimuovi il token dalla barra degli indirizzi
        window.location.hash = '';

        // Reindirizza l'utente alla home o a una pagina di login
        window.open('https://www.spotify.com/logout/', '_blank');
        handleRedirect();
    }
    updateBackground();
    controlImgBackground();
    controlloIndietro();
    showMenu(2);
    location.reload();
}
//reset pagina a opzioni default (anche dati temporanei)
function reset() {
    const newName = prompt("inserisci qualcosa per resettare");
    if (newName) {
        document.getElementById('name-team1').textContent = "Team 1";
        document.getElementById('score-team1').textContent = "0";
        document.getElementById('1').src = null;
        document.getElementById('name-team2').textContent = "Team 2";
        document.getElementById('score-team2').textContent = "0";
        document.getElementById('2').src = null;
        punteggio1 = "0|0";
        punteggio2 = "0|0";
        current_track = [];
        tempi = [];
        punto = 0;
        squadra1 = "";
        squadra2 = "";
        fra = 0;

        localStorage.setItem("nt1", document.getElementById('name-team1').textContent);
        localStorage.setItem("st1", document.getElementById('score-team1').textContent);
        localStorage.setItem("it1", document.getElementById('1').src);
        localStorage.setItem("nt2", document.getElementById('name-team2').textContent);
        localStorage.setItem("st2", document.getElementById('score-team2').textContent);
        localStorage.setItem("it2", document.getElementById('2').src);
        localStorage.setItem("h1", punteggio1);
        localStorage.setItem("h2", punteggio2);
        localStorage.setItem("m1", squadra1);
        localStorage.setItem("m2", squadra2);
        localStorage.setItem("fra", fra);
        localStorage.setItem("punt", punto);
        localStorage.setItem("songs", current_track);
        localStorage.setItem("temps", tempi);
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token');

        // Rimuovi il token dalla barra degli indirizzi
        window.location.hash = '';

        // Reindirizza l'utente alla home o a una pagina di login
        window.open('https://www.spotify.com/logout/', '_blank');
        handleRedirect();
    }
    updateBackground();
    controlImgBackground();
    controlloIndietro();
    showMenu(2);
    location.reload();
}
//salvataggio dati in buffer temporanei in caso di reload pagina
window.addEventListener('beforeunload', function () {
    // Salva lo stato corrente, ad esempio il punteggio, nel localStorage
    localStorage.setItem("nt1", document.getElementById('name-team1').textContent);
    localStorage.setItem("st1", document.getElementById('score-team1').textContent);
    localStorage.setItem("it1", document.getElementById('1').src);
    localStorage.setItem("nt2", document.getElementById('name-team2').textContent);
    localStorage.setItem("st2", document.getElementById('score-team2').textContent);
    localStorage.setItem("it2", document.getElementById('2').src);
    localStorage.setItem("h1", punteggio1);
    localStorage.setItem("h2", punteggio2);
    localStorage.setItem("m1", squadra1);
    localStorage.setItem("m2", squadra2);
    localStorage.setItem("fra", fra);
    localStorage.setItem("punt", punto);
    localStorage.setItem("songs", songsToString(current_track));
    localStorage.setItem("temps", tempi.join(";"));
});
window.addEventListener('load', function () {
    const nameTeam1 = localStorage.getItem("nt1");
    const scoreTeam1 = localStorage.getItem("st1");
    const imageTeam1 = localStorage.getItem("it1");
    const nameTeam2 = localStorage.getItem("nt2");
    const scoreTeam2 = localStorage.getItem("st2");
    const imageTeam2 = localStorage.getItem("it2");
    const h1 = localStorage.getItem("h1");
    const h2 = localStorage.getItem("h2");
    const m1 = localStorage.getItem("m1");
    const m2 = localStorage.getItem("m2");
    const fraa = localStorage.getItem("fra");
    const songs = localStorage.getItem("songs");
    const temps = localStorage.getItem("temps");
    const punt = localStorage.getItem("punt");
    if (nameTeam1) document.getElementById('name-team1').textContent = nameTeam1;
    if (scoreTeam1) document.getElementById('score-team1').textContent = scoreTeam1;
    if (imageTeam1) document.getElementById('1').src = imageTeam1;

    if (nameTeam2) document.getElementById('name-team2').textContent = nameTeam2;
    if (scoreTeam2) document.getElementById('score-team2').textContent = scoreTeam2;
    if (imageTeam2) document.getElementById('2').src = imageTeam2;
    if (h1) punteggio1 = h1;
    if (h2) punteggio2 = h2;
    if (m1) squadra1 = m1;
    if (m2) squadra2 = m2;
    if (fraa) fra = fraa;
    if (songs) current_track = songsFromString(songs);
    if (temps) tempi = temps.split(";");
    if (punt) punto = parseInt(punt);
    updateBackground();
    controlImgBackground();
    controlloIndietro();
    settaSquadre();
});