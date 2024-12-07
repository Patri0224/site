function changeTeamName(team) {
    const teamElement = document.getElementById('name-' + team);
    const newName = prompt("Inserisci il nuovo nome della squadra:");
    if (newName) {
        teamElement.textContent = newName;
    }
}
function changeTeamScore(team) {
    const teamElement = document.getElementById('score-' + team);
    var newScore = prompt("Inserisci il nuovo punteggio della squadra:");
    if (newScore) {
        if (isNaN(parseInt(newScore))) {
            newScore = "0";
        }
        teamElement.textContent = newScore;
        indietro = true;
        document.getElementById("ind").style.backgroundColor = "blue";
        updateStringhe();
    }
    updateBackground();
    controlImgBackground();
}
// Funzioni per gestire il punteggio delle squadre da bottoni
function addPoints(team, points) {
    const scoreElement = document.getElementById('score-' + team);
    let currentScore = parseInt(scoreElement.textContent);
    scoreElement.textContent = currentScore + points;
    updateStringhe();
    updateBackground();
    controlImgBackground();
    deselectCheckboxs();
}
function subtractPoint(team) {
    const scoreElement = document.getElementById('score-' + team);
    let currentScore = parseInt(scoreElement.textContent);
    if (currentScore > 0) {
        scoreElement.textContent = currentScore - 1;
    }
    updateStringhe();
    updateBackground();
    deselectCheckboxs();
}
//Funzioni per gestire forma e quali immagini di sfondo (quali, animazioni, movimenti)
function updateBackground() {
    let score1 = document.getElementById('score-team1').textContent;
    let score2 = document.getElementById('score-team2').textContent;
    const imm1 = document.getElementById('triangle-image');
    const imm2 = document.getElementById('triangle-image2');
    const imm3 = document.getElementById('triangle-image3');
    if (score1 == '0' && score2 == '0') {

    } else {

    }

    let scoreDiff = score1 - score2;
    if (scoreDiff > maxSpostamento) scoreDiff = maxSpostamento;
    if (scoreDiff < -maxSpostamento) scoreDiff = -maxSpostamento;
    let team1Width, widthBottom; team1Width = 50 + (scoreDiff * peso1);
    widthBottom = 50 + (scoreDiff * peso2);
    imm1.style.clipPath = `polygon(0% 0%, ${team1Width}% 0%, ${widthBottom}% 100%, 0% 100%)`;
    imm2.style.clipPath = `polygon(${team1Width}% 0%, 100% 0%, 100% 100%, ${widthBottom}% 100%)`;
    imm3.style.clipPath = `polygon(${team1Width - spessoreBarra}% 0%, ${team1Width + spessoreBarra}% 0%, ${widthBottom + spessoreBarra}% 100%, ${widthBottom - spessoreBarra}% 100%)`;
    imm3.style.backgroundColor = "#2a2a2a";
    setTimeout(() => {
        imm3.style.background = "#1a1a1a";
    }, 400);
}
function controlImgBackground() {
    let img1 = document.getElementById('1');
    let img2 = document.getElementById('2');
    if (img1.src == null || img1.src == "" || img1.src.includes("/null")) {
        img1.style.display = "none";
    } else {
        img1.style.display = "block";
    }
    if (img2.src == null || img2.src == "" || img2.src.includes("/null")) {
        img2.style.display = "none";
    } else {
        img2.style.display = "block";
    }
}
function changeBackground1() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            document.getElementById("1").src = event.target.result;
            controlImgBackground();
        }
        reader.readAsDataURL(file);

    }
    input.click();
    updateBackground();
    showMenu(2);
}
function changeBackground2() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            document.getElementById("2").src = event.target.result;
            controlImgBackground();
        }
        reader.readAsDataURL(file);


    }
    input.click();
    updateBackground();
    showMenu(2);
}
//salvataggio delle partite in file
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
    const songs = current_track.join(";;");

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
        songs: songs
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
            current_track = data.songs.split(";;");
            console.log(squadra1, squadra2);
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
        punteggio1 = "0|-1";
        punteggio2 = "0|-1";
        current_track = { 0: null };
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
        localStorage.setItem("songs", current_track.join(";;"));

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
    localStorage.setItem("songs", current_track.join(";;"));
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
    const songs = this.localStorage.getItem("songs");
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
    if (songs) current_track = songs.split(";;");
    updateBackground();
    controlImgBackground();
    controlloIndietro();
    settaSquadre();
});
//aggiunta ultimo valore nella cronologia del punteggio
function updateStringhe() {
    fetchCurrentTrack();
    punteggio1 += ";" + document.getElementById('score-team1').textContent + "|" + getSelectedValue1();
    punteggio2 += ";" + document.getElementById('score-team2').textContent + "|" + getSelectedValue2();
    document.getElementById("ind").style.backgroundColor = "blue";
}
function getSelectedValue1() {
    const selected = document.querySelector('input[name="pTeam1"]:checked');
    document.getElementById('1p-1').checked = true;
    return selected.value;
}
function getSelectedValue2() {
    const selected = document.querySelector('input[name="pTeam2"]:checked');
    document.getElementById('2p-1').checked = true;
    return selected.value;
}
//grafico per storia partita
function showGraf() {
    if (document.getElementById("grafico").style.display == "block") {
        document.getElementById("grafico").style.display = "none";
        return;
    }
    console.log(current_track);
    var array = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0
    };
    var array1 = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0
    };

    const arr1 = punteggio1.split(";");
    const arr2 = punteggio2.split(";");
    let str = `<div id="primaRiga" class='riga'><p>Grafico punteggi</p></div> `;

    // Aggiornamento dell'array e generazione della stringa
    let prev1 = 0;
    let prev2 = 0;
    for (let index = 0; index < arr1.length; index++) {
        let pA = "";
        let pB = "";
        let p1 = arr1[index].split("|")[1];
        let p2 = arr2[index].split("|")[1];
        let var1 = parseInt(arr1[index].split("|")[0]);
        let var2 = parseInt(arr2[index].split("|")[0]);
        let a = var1 - var2;
        array[parseInt(p1) + 1]++;
        array[parseInt(p2) + 1]++;
        array1[parseInt(p1) + 1]++;
        array1[parseInt(p2) + 1]++;
        if (var1 - prev1 == 2) array1[parseInt(p1) + 1]++;
        if (var2 - prev2 == 2) array1[parseInt(p2) + 1]++;

        prev1 = var1;
        prev2 = var2;

        if (p1 != -1) pA = persone[p1];
        if (p2 != -1) pB = persone[p2];

        if (var1 + var2 == 0) {
            str += `<div class='riga'> <p class='sinistra'>0</p><div class="centro1" style="width:50%"></div><div class="centro2" style="width:50%"></div><p class='destra'>0</p></div>`;
        } else {
            a = a * 50 / (var1 + var2);
            let b = 50 + a;
            let c = 50 - a;
            str += `<div class='riga'> <p class='sinistra'>${arr1[index].split("|")[0]}</p><div class="centro1" style="width:${b}%"><p>${pA}</p></div><div class="centro2" style="width:${c}%"><p>${pB}</p></div><p class='destra'>${arr2[index].split("|")[0]}</p></div>`;
        }
    }
    // Ordinamento dell'array
    let sortedArray = Object.entries(array);
    sortedArray.sort((a, b) => b[1] - a[1]);
    str += `<div class="punteggiSingoli"><p>Ordine titolo indovinati</p>`;

    for (let i = 0; i < sortedArray.length; i++) {
        const key = sortedArray[i][0]; // La chiave dell'elemento
        const value = sortedArray[i][1];
        if (key != 0 && value > 0) { // Non aggiungere la chiave "0" poiché non corrisponde a una persona
            str += `<p class="text1">${persone[key - 1]}: ${value}</p>`;
        }
    }
    str += "</div>";
    let sortedArray1 = Object.entries(array1);
    sortedArray1.sort((a, b) => b[1] - a[1]);
    str += `<div class="punteggiSingoli"><p>Ordine punti guadagnati</p>`;

    for (let i = 0; i < sortedArray1.length; i++) {
        const key = sortedArray1[i][0]; // La chiave dell'elemento
        const value = sortedArray1[i][1];
        if (key != 0 && value > 0) { // Non aggiungere la chiave "0" poiché non corrisponde a una persona
            str += `<p class="text1">${persone[key - 1]}: ${value}</p>`;
        }
    }
    str += "</div>";

    // Mostrare il risultato
    document.getElementById("grafico").innerHTML = str;
    document.getElementById("grafico").style.display = "block";
    showMenu(2);
}
//gestione ctrl-z
function indietroPunteggio() {
    if (premuto == true) {
        if (punteggio1.length > 4 && punteggio2.length > 4) {
            premuto = false;
            let valori = punteggio1.split(";");
            valori.pop();
            let a = valori[valori.length - 1];
            punteggio1 = valori.join(";");
            valori = punteggio2.split(";");
            valori.pop();
            let b = valori[valori.length - 1];
            punteggio2 = valori.join(";");
            document.getElementById('score-team1').textContent = a.split("|")[0];
            document.getElementById('score-team2').textContent = b.split("|")[0];
            current_track.pop();
            updateBackground();
            controlloIndietro();
        }
    } else {
        premuto = true;
        document.getElementById("ind").style.backgroundColor = "green";
        setTimeout(() => {
            premuto = false;
            controlloIndietro();
        }, 2000);
    }
}
function controlloIndietro() {
    if (punteggio1.length > 4 && punteggio2.length > 4) {
        document.getElementById("ind").style.backgroundColor = "blue";
    } else {
        document.getElementById("ind").style.backgroundColor = "red";
    }
}
//per mostrare il menu
function showMenu(op) {
    if (op == 2) {
        document.getElementById("menu").style.display = "none";
    } else if (document.getElementById("menu").style.display == "block") {
        document.getElementById("menu").style.display = "none";
    } else {
        document.getElementById("menu").style.display = "block";
    }
}
//Usati per gestire le squadre
function changeSquadra1() {
    let str = "";
    for (let key in persone) {
        str += `<label><input type="checkbox" class="t1" value="${key}">${persone[key]}</label>`;
    }
    str += `<button onclick="Set1()">Set</button>`;
    document.getElementById("Sq1").innerHTML = str;
    document.getElementById("Sq1").style.display = "flex";
}
function changeSquadra2() {
    let str = "";
    for (let key in persone) {
        str += `<label><input type="checkbox" class="t2" value="${key}">${persone[key]}</label>`;
    }
    str += `<button onclick="Set2()">Set</button>`;
    document.getElementById("Sq2").innerHTML = str;
    document.getElementById("Sq2").style.display = "flex";
}
function Set1() {
    const selectedCheckboxes = document.querySelectorAll('.t1:checked');
    const selectedValues = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
    squadra1 = "";
    for (let key in selectedValues) {
        squadra1 += ";" + selectedValues[key];
    }
    squadra1 = squadra1.slice(1);
    document.getElementById("Sq1").style.display = "none";
    settaSquadre();
}
function Set2() {
    const selectedCheckboxes = document.querySelectorAll('.t2:checked');
    const selectedValues = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
    squadra2 = "";
    console.log(selectedCheckboxes, selectedValues);
    for (let key in selectedValues) {
        squadra2 += ";" + selectedValues[key];
    }
    squadra2 = squadra2.slice(1);
    console.log(squadra2);
    document.getElementById("Sq2").style.display = "none";
    settaSquadre();
}
function settaSquadre() {
    let str = `<label for="1p-1"><input type="radio" id="1p-1" name="pTeam1" value="-1" checked>Nessuno</label>`;

    if (squadra1.length != 0) {
        let sq = squadra1.split(";");
        for (let index = 0; index < sq.length; index++) {
            str += `<label  onclick="setTitoloChecked(1)"  for="1p${sq[index]}"><input type="radio" id="1p${sq[index]}" name="pTeam1" value="${sq[index]}">${persone[sq[index]]}</label>`;
        }
    }
    document.getElementById("partecipanti1").innerHTML = str;

    str = `<label for="2p-1"><input type="radio" id="2p-1" name="pTeam2" value="-1" checked>Nessuno</label>`;

    if (squadra2.length != 0) {
        sq = squadra2.split(";");
        for (let index = 0; index < sq.length; index++) {
            str += `<label onclick="setTitoloChecked(2)" for="2p${sq[index]}"><input  type="radio" id="2p${sq[index]}" name="pTeam2" value="${sq[index]}">${persone[sq[index]]}</label>`;
        }
    }
    document.getElementById("partecipanti2").innerHTML = str;
}
function setTitoloChecked(op) {
    document.getElementById("team" + op + "-checkbox1").checked = true;
    if (op == 1) {
        document.getElementById("2p-1").checked = true;
        document.getElementById("team" + 2 + "-checkbox1").checked = false;
    } else if (op == 2) {
        document.getElementById("1p-1").checked = true;
        document.getElementById("team" + 1 + "-checkbox1").checked = false;
    }
}
//Fra
function Fra() {
    fra++;
    document.getElementById("fra").innerHTML = "Fra: " + fra;
}
//Reload pagina
function reload() {
    if (pReload == true) {
        location.reload();
    } else {
        pReload = true;
        document.getElementById("reload").style.backgroundColor = "green";
        setTimeout(() => {
            pReload = false;
            document.getElementById("reload").style.backgroundColor = "";
        }, 2000);
    }
}
//variabili globali
var persone = { 0: "Alice", 1: "Andre", 2: "Busti", 3: "Fede", 4: "Fra", 5: "Friggi", 6: "Giorgia", 7: "Giulia", 8: "Marco", 9: "Mati", 10: "Pat", 11: "Totta", 12: "Viola" }
var premuto = false;//per conferma indietro
var pReload = false;//per conferma reload
var punteggio1 = "0|-1";
var punteggio2 = "0|-1";
var squadra1 = "";
var squadra2 = "";
var fra = 0;
const peso1 = 0.9;//tra 0 e 1: spostamento in alto della barra e immagini
const peso2 = 0.7;//tra 0 e 1: spostamento in basso della barra e immagini
const spessoreBarra = 2;//in percentuale
const maxSpostamento = 20;//range dello spostamento fino a una massima differenza tra i due punteggi
// Funzione per aggiungere punti in base alle checkbox selezionate
function addSelectedPoints(team) {
    let totalPoints = 0;
    const checkbox1 = document.getElementById(team + '-checkbox1');
    const checkbox2 = document.getElementById(team + '-checkbox2');
    const checkbox3 = document.getElementById(team + '-checkbox3');

    if (checkbox1.checked && checkbox2.checked) {
        totalPoints += 1;
        if (checkbox3.checked) totalPoints += 1;
    }

    addPoints(team, totalPoints);

    // Deseleziona le checkbox dopo aver aggiunto i punti
    checkbox1.checked = false;
    checkbox2.checked = false;
    checkbox3.checked = false;
}
function deselectCheckboxs() {
    document.getElementById('team1-checkbox1').checked = false;
    document.getElementById('team1-checkbox2').checked = false;
    document.getElementById('team1-checkbox3').checked = false;
    document.getElementById('team2-checkbox1').checked = false;
    document.getElementById('team2-checkbox2').checked = false;
    document.getElementById('team2-checkbox3').checked = false;
}
var CLIENT_ID = 'd3efac0125d1444e9b68f2fb1784a6db';
const REDIRECT_URI = 'https://shimmering-bienenstitch-adedce.netlify.app/punteggio/punteggio.html'; // Cambia se necessario
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const API_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const SCOPES = 'user-read-currently-playing';
let current_track = [];
current_track[0] = null;
let accessToken = null;

// Step 1: Login to Spotify
const login = () => {
    const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPES}`;
    window.location.href = url;
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
const fetchCurrentTrack = async () => {
    if (!accessToken) {
        alert('Login first!');
        return;
    }

    try {
        const response = await fetch(API_ENDPOINT, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.status === 200) {
            const data = await response.json();
            current_track.push(data);
        } else {
            console.error('No track playing or API error:', response);
        }
    } catch (error) {
        console.error('Error fetching current track:', error);
    }
};

// Step 4: Save track data offline
const saveTrack = (track) => {
    const storedTracks = JSON.parse(localStorage.getItem('tracks')) || [];
    storedTracks.push(track);
    localStorage.setItem('tracks', JSON.stringify(storedTracks));
    displayTracks();
};

// Step 5: Display saved tracks
const displayTracks = () => {
    const trackList = document.getElementById('trackList');
    trackList.innerHTML = '';

    const storedTracks = JSON.parse(localStorage.getItem('tracks')) || [];
    storedTracks.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${track.item.name} by ${track.item.artists.map(artist => artist.name).join(', ')}`;
        trackList.appendChild(li);
    });
};

handleRedirect();