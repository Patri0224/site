//variabili globali
var persone = {
    0: "",
    1: "Alice",
    2: "Andrea",
    3: "Billa",
    4: "Busti",
    5: "Clara",
    6: "Dani",
    7: "Depa",
    8: "Fede",
    9: "Fra",
    10: "Friggi",
    11: "Giorgia",
    12: "Giorgia C",
    13: "Giuse",
    14: "Giulia",
    15: "Giada",
    16: "Irene",
    17: "Lisa",
    18: "Ludovica",
    19: "Marco",
    20: "Margo",
    21: "Mati",
    22: "Mati (depa)",
    23: "Mirko",
    24: "Pat",
    25: "Paolo",
    26: "Samu",
    27: "Selina",
    28: "Totta",
    29: "Viola"
};
//ogni nome nuovo deve essere aggiunto in fondo alla lista anche se non è più in ordine alfabetico per essere uguale al database
// automatically uses env NETLIFY_DATABASE_URL
//
let numPersone = Object.keys(persone).length;
var premuto = false;//per conferma indietro
var pReload = false;//per conferma reload

var punteggio1 = "0|0";
var punteggio2 = "0|0";
var squadra1 = "";
var squadra2 = "";
let punto = 0;
let current_track = [];
let accessToken = null;
let tempi = [];
let tempoTemp = 0;
let ogg = [];
ogg[0] = 1;
ogg[1] = 1;
ogg[2] = 1;
let idCorrente = 0;
let personeScelte = [];
personeScelte[0] = 1;
const peso1 = 0.9;//tra 0 e 1: spostamento in alto della barra e immagini
const peso2 = 0.7;//tra 0 e 1: spostamento in basso della barra e immagini
const spessoreBarra = 2;//in percentuale
const maxSpostamento = 20;//range dello spostamento fino a una massima differenza tra i due punteggi


let nwindow;

const consoleDiv = document.getElementById("cici");
const CLIENT_ID = '44a46de2fd8a4b38b962b7dcc81abccc';
const REDIRECT_URI = 'https://studiopersonale.netlify.app/personal/punteggio1/punteggio.htm';



(function () {
    const outputDiv = document.getElementById('cici');

    function appendToConsoleDiv(type, args) {
        const message = Array.from(args).map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');

        const line = `[${type.toUpperCase()}] ${message}\n.`;
        const p = document.createElement('div');
        p.textContent = line;
        outputDiv.appendChild(p);
    }

    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = function (...args) {
        appendToConsoleDiv('log', args);
        originalLog.apply(console, args);
    };

    console.warn = function (...args) {
        appendToConsoleDiv('warn', args);
        originalWarn.apply(console, args);
    };

    console.error = function (...args) {
        appendToConsoleDiv('error', args);
        originalError.apply(console, args);
    };
})();

/*
DDDDDDDDDDDDD        BBBBBBBBBBBBBBBBB   
D::::::::::::DDD     B::::::::::::::::B  
D:::::::::::::::DD   B::::::BBBBBB:::::B 
DDD:::::DDDDD:::::D  BB:::::B     B:::::B
  D:::::D    D:::::D   B::::B     B:::::B
  D:::::D     D:::::D  B::::B     B:::::B
  D:::::D     D:::::D  B::::BBBBBB:::::B 
  D:::::D     D:::::D  B:::::::::::::BB  
  D:::::D     D:::::D  B::::BBBBBB:::::B 
  D:::::D     D:::::D  B::::B     B:::::B
  D:::::D     D:::::D  B::::B     B:::::B
  D:::::D    D:::::D   B::::B     B:::::B
DDD:::::DDDDD:::::D  BB:::::BBBBBB::::::B
D:::::::::::::::DD   B:::::::::::::::::B 
D::::::::::::DDD     B::::::::::::::::B  
DDDDDDDDDDDDD        BBBBBBBBBBBBBBBBB
*/
function mostraListaPartite() {
    if (!navigator.onLine) {
        alert("Nessuna connessione Internet");
        return;
    }
    const lista = document.getElementById('lista-partite');
    if (lista.style.display === 'none' || lista.style.display === '') {
        caricaListaPartite();
        lista.style.display = 'flex';
    } else {
        lista.style.display = 'none';
    }
}
//database partite
function caricaListaPartite() {
    if (!navigator.onLine) {
        alert("Nessuna connessione Internet");
        return;
    }
    fetch('/.netlify/functions/listMatches')
        .then(res => res.json())
        .then(partite => {
            const lista = document.getElementById('lista-partite');
            lista.innerHTML = '';
            partite.forEach(partita => {
                const el = document.createElement('div');
                el.textContent = `Partita: ${partita.nome_partita} (ID ${partita.id})`;
                el.style.cursor = 'pointer';
                el.onclick = () => caricaPartita(partita.id);
                lista.appendChild(el);
            });
        })
        .catch(err => console.error('Errore lista partite:', err));
}

function caricaPartita(idPartitas) {
    if (!navigator.onLine) {
        alert("Nessuna connessione Internet");
        return;
    }
    fetch(`/.netlify/functions/loadMatch?id=${idPartitas}`)
        .then(res => res.json())
        .then(data => {
            // Assumendo tu abbia funzioni già fatte che trasformano:
            document.getElementById('name-team1').textContent = data.nomes1;
            document.getElementById('score-team1').textContent = data.puntis1;
            document.getElementById('name-team2').textContent = data.nomes2;
            document.getElementById('score-team2').textContent = data.puntis2;

            punteggio1 = data.punteggio_1;
            punteggio2 = data.punteggio_2;
            squadra1 = data.squadra1;
            squadra2 = data.squadra2;
            punto = data.punto;
            current_track = songsFromString(data.current_track); // tua funzione
            tempi = data.tempi.split(';');

            // puoi anche salvare idPartita corrente in una variabile globale
            idCorrente = data.id;
            document.getElementById('lista-partite').style.display = 'none'; // nascondi la lista dopo il caricamento
            salvaStatoTemporaneo(); // salva lo stato corrente
            updateBackground();
            controlImgBackground();
            controlloIndietro();
            showMenu(2);
            location.reload();
        })
        .catch(err => console.error('Errore nel caricamento:', err));
}

function salvaPartita() {
    if (!navigator.onLine) {
        alert("Nessuna connessione Internet");
        return;
    }
    const body = {
        idPartita: idCorrente, // se 0 => nuova
        team1Name: document.getElementById('name-team1').textContent,
        team1Score: document.getElementById('score-team1').textContent,
        team2Name: document.getElementById('name-team2').textContent,
        team2Score: document.getElementById('score-team2').textContent,
        punteggio1,
        punteggio2,
        squadra1,
        squadra2,
        punto,
        current_track: songsToString(current_track), // tua funzione
        tempi,
        nomePartita: prompt('Nome partita:', 'Senza nome') || 'Senza nome'
    };

    fetch('/.netlify/functions/saveMatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .then(resp => {
            console.log('Partita salvata con ID:', resp.id);
            idCorrente = resp.id;
            caricaListaPartite(); // aggiorna lista
        })
        .catch(err => console.error('Errore salvataggio:', err));
}

function aggiungiGiocatore() {
    if (!navigator.onLine) {
        alert("Nessuna connessione Internet");
        return;
    }

    const nome = prompt("Inserisci il nome del giocatore:");
    if (!nome || nome.trim() === "") {
        alert("Nome non valido.");
        return;
    }

    fetch('/.netlify/functions/addPlayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome.trim() })
    })
        .then(res => {
            if (!res.ok) throw new Error("Errore durante l'inserimento");
            return res.json();
        })
        .then(() => caricaGiocatori())  // ⚠️ chiamata corretta (non subito eseguita!)
        .catch(err => alert("Errore: " + err.message));
}

function caricaGiocatori() {
    if (!navigator.onLine) {
        return;
    }
    fetch('/.netlify/functions/getPlayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gruppi: personeScelte })
    })
        .then(res => res.json())
        .then(data => {
            persone = { 0: "" }; // reset con lo 0 vuoto
            data.forEach(p => {
                persone[p.id] = p.nome;
            });
            numPersone = Object.keys(persone).length;
            settaSquadre();
        })
        .catch(err => console.error('Errore caricamento giocatori:', err));

}
/*
   SSSSSSSSSSSSSSS FFFFFFFFFFFFFFFFFFFFFF     OOOOOOOOO     NNNNNNNN        NNNNNNNNDDDDDDDDDDDDD             OOOOOOOOO     
 SS:::::::::::::::SF::::::::::::::::::::F   OO:::::::::OO   N:::::::N       N::::::ND::::::::::::DDD        OO:::::::::OO   
S:::::SSSSSS::::::SF::::::::::::::::::::F OO:::::::::::::OO N::::::::N      N::::::ND:::::::::::::::DD    OO:::::::::::::OO 
S:::::S     SSSSSSSFF::::::FFFFFFFFF::::FO:::::::OOO:::::::ON:::::::::N     N::::::NDDD:::::DDDDD:::::D  O:::::::OOO:::::::O
S:::::S              F:::::F       FFFFFFO::::::O   O::::::ON::::::::::N    N::::::N  D:::::D    D:::::D O::::::O   O::::::O
S:::::S              F:::::F             O:::::O     O:::::ON:::::::::::N   N::::::N  D:::::D     D:::::DO:::::O     O:::::O
 S::::SSSS           F::::::FFFFFFFFFF   O:::::O     O:::::ON:::::::N::::N  N::::::N  D:::::D     D:::::DO:::::O     O:::::O
  SS::::::SSSSS      F:::::::::::::::F   O:::::O     O:::::ON::::::N N::::N N::::::N  D:::::D     D:::::DO:::::O     O:::::O
    SSS::::::::SS    F:::::::::::::::F   O:::::O     O:::::ON::::::N  N::::N:::::::N  D:::::D     D:::::DO:::::O     O:::::O
       SSSSSS::::S   F::::::FFFFFFFFFF   O:::::O     O:::::ON::::::N   N:::::::::::N  D:::::D     D:::::DO:::::O     O:::::O
            S:::::S  F:::::F             O:::::O     O:::::ON::::::N    N::::::::::N  D:::::D     D:::::DO:::::O     O:::::O
            S:::::S  F:::::F             O::::::O   O::::::ON::::::N     N:::::::::N  D:::::D    D:::::D O::::::O   O::::::O
SSSSSSS     S:::::SFF:::::::FF           O:::::::OOO:::::::ON::::::N      N::::::::NDDD:::::DDDDD:::::D  O:::::::OOO:::::::O
S::::::SSSSSS:::::SF::::::::FF            OO:::::::::::::OO N::::::N       N:::::::ND:::::::::::::::DD    OO:::::::::::::OO 
S:::::::::::::::SS F::::::::FF              OO:::::::::OO   N::::::N        N::::::ND::::::::::::DDD        OO:::::::::OO   
 SSSSSSSSSSSSSSS   FFFFFFFFFFF                OOOOOOOOO     NNNNNNNN         NNNNNNNDDDDDDDDDDDDD             OOOOOOOOO
*/





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
    if (img1.src == null || img1.src == "" || img1.src.includes("null")) {
        img1.style.display = "none";
    } else {
        img1.style.display = "block";
    }
    if (img2.src == null || img2.src == "" || img2.src.includes("null")) {
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
            document.getElementById("1").style.display = "block";
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
            document.getElementById("2").style.display = "block";
            controlImgBackground();
        }
        reader.readAsDataURL(file);


    }
    input.click();
    updateBackground();
    showMenu(2);
}
/*

   SSSSSSSSSSSSSSS                AAA         VVVVVVVV           VVVVVVVVEEEEEEEEEEEEEEEEEEEEEE
 SS:::::::::::::::S              A:::A        V::::::V           V::::::VE::::::::::::::::::::E
S:::::SSSSSS::::::S             A:::::A       V::::::V           V::::::VE::::::::::::::::::::E
S:::::S     SSSSSSS            A:::::::A      V::::::V           V::::::VEE::::::EEEEEEEEE::::E
S:::::S                       A:::::::::A      V:::::V           V:::::V   E:::::E       EEEEEE
S:::::S                      A:::::A:::::A      V:::::V         V:::::V    E:::::E             
 S::::SSSS                  A:::::A A:::::A      V:::::V       V:::::V     E::::::EEEEEEEEEE   
  SS::::::SSSSS            A:::::A   A:::::A      V:::::V     V:::::V      E:::::::::::::::E   
    SSS::::::::SS         A:::::A     A:::::A      V:::::V   V:::::V       E:::::::::::::::E   
       SSSSSS::::S       A:::::AAAAAAAAA:::::A      V:::::V V:::::V        E::::::EEEEEEEEEE   
            S:::::S     A:::::::::::::::::::::A      V:::::V:::::V         E:::::E             
            S:::::S    A:::::AAAAAAAAAAAAA:::::A      V:::::::::V          E:::::E       EEEEEE
SSSSSSS     S:::::S   A:::::A             A:::::A      V:::::::V         EE::::::EEEEEEEE:::::E
S::::::SSSSSS:::::S  A:::::A               A:::::A      V:::::V          E::::::::::::::::::::E
S:::::::::::::::SS  A:::::A                 A:::::A      V:::V           E::::::::::::::::::::E
 SSSSSSSSSSSSSSS   AAAAAAA                   AAAAAAA      VVV            EEEEEEEEEEEEEEEEEEEEEE


*/
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
            document.getElementById('1').style.display = "block";
            document.getElementById('name-team2').textContent = data.team2.name;
            document.getElementById('score-team2').textContent = data.team2.score;
            document.getElementById('2').src = data.team2.image;
            document.getElementById('2').style.display = "block";
            punteggio1 = data.team1.history;
            punteggio2 = data.team2.history;
            squadra1 = data.team1.member;
            squadra2 = data.team2.member;
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
    caricaGiocatori();
}
function preset() {
    const newName = prompt("inserisci qualcosa per attivare il preset");
    if (newName) {
        document.getElementById('name-team1').textContent = "Andrilde";
        document.getElementById('score-team1').textContent = "0";
        document.getElementById('1').src = null;
        document.getElementById('1').style.display = "none";
        document.getElementById('name-team2').textContent = "Frarco";
        document.getElementById('score-team2').textContent = "0";
        document.getElementById('2').src = null;
        document.getElementById('2').style.display = "none";
        punteggio1 = "0|0";
        punteggio2 = "0|0";
        current_track = [];
        tempi = [];
        punto = 0;
        squadra1 = "2;14;21;28";
        squadra2 = "1;6;9;19";
        personeScelte = [1];
        personeScelte[0] = 1;
        persone = {
            0: "",
            1: "Alice",
            2: "Andrea",
            3: "Billa",
            4: "Busti",
            5: "Clara",
            6: "Dani",
            7: "Depa",
            8: "Fede",
            9: "Fra",
            10: "Friggi",
            11: "Giorgia",
            12: "Giorgia C",
            13: "Giuse",
            14: "Giulia",
            15: "Giada",
            16: "Irene",
            17: "Lisa",
            18: "Ludovica",
            19: "Marco",
            20: "Margo",
            21: "Mati",
            22: "Mati (depa)",
            23: "Mirko",
            24: "Pat",
            25: "Paolo",
            26: "Samu",
            27: "Selina",
            28: "Totta",
            29: "Viola"
        };
        tempoTemp = getCurrentTimeInSeconds();

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
        localStorage.setItem("punt", punto);
        localStorage.setItem("songs", current_track);
        localStorage.setItem("temps", tempi);
        localStorage.setItem("persone", JSON.stringify(persone)); // Salva le persone
        localStorage.setItem("personeScelte", JSON.stringify(personeScelte)); // Salva le persone selezionate
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token');
        accessToken = null; // Resetta il token globale
        idCorrente = 0; // Resetta l'ID della partita corrente

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
    salvaStatoTemporaneo();
    location.reload();
    caricaGiocatori();
}
//reset pagina a opzioni default (anche dati temporanei)
function reset() {
    const newName = prompt("inserisci qualcosa per resettare");
    if (newName) {
        document.getElementById('name-team1').textContent = "Team 1";
        document.getElementById('score-team1').textContent = "0";
        document.getElementById('1').src = null;
        document.getElementById('1').style.display = "none";
        document.getElementById('name-team2').textContent = "Team 2";
        document.getElementById('score-team2').textContent = "0";
        document.getElementById('2').src = null;
        document.getElementById('2').style.display = "none";
        punteggio1 = "0|0";
        punteggio2 = "0|0";
        current_track = [];
        tempi = [];
        punto = 0;
        squadra1 = "";
        squadra2 = "";
        personeScelte = [1];
        personeScelte[0] = 1;
        persone = {
            0: "",
            1: "Alice",
            2: "Andrea",
            3: "Billa",
            4: "Busti",
            5: "Clara",
            6: "Dani",
            7: "Depa",
            8: "Fede",
            9: "Fra",
            10: "Friggi",
            11: "Giorgia",
            12: "Giorgia C",
            13: "Giuse",
            14: "Giulia",
            15: "Giada",
            16: "Irene",
            17: "Lisa",
            18: "Ludovica",
            19: "Marco",
            20: "Margo",
            21: "Mati",
            22: "Mati (depa)",
            23: "Mirko",
            24: "Pat",
            25: "Paolo",
            26: "Samu",
            27: "Selina",
            28: "Totta",
            29: "Viola"
        };
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
        localStorage.setItem("punt", punto);
        localStorage.setItem("songs", current_track);
        localStorage.setItem("temps", tempi);
        localStorage.setItem("persone", JSON.stringify(persone)); // Salva le persone
        localStorage.setItem("personeScelte", JSON.stringify(personeScelte)); // Salva le persone selezionate

        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token');


        accessToken = null; // Resetta il token globale
        idCorrente = 0; // Resetta l'ID della partita corrente  
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
    salvaStatoTemporaneo();
    location.reload();
    caricaGiocatori();
}
//salvataggio dati in buffer temporanei in caso di reload pagina
function salvaStatoTemporaneo() {
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
    localStorage.setItem("punt", punto);
    localStorage.setItem("songs", songsToString(current_track));
    localStorage.setItem("temps", tempi.join(";"));
    localStorage.setItem("access_token", accessToken); // Salva il token di accesso
    localStorage.setItem("idCorrente", idCorrente); // Salva l'ID della partita corrente
    localStorage.setItem("persone", JSON.stringify(persone)); // Salva il tempo corrente
    localStorage.setItem("personeScelte", JSON.stringify(personeScelte)); // Salva le persone selezionate
}

// ✅ Più affidabile di beforeunload su iOS
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") salvaStatoTemporaneo();
});
window.addEventListener("pagehide", salvaStatoTemporaneo);

// Facoltativo: mantieni anche beforeunload per desktop
window.addEventListener("beforeunload", salvaStatoTemporaneo);

// 🔄 Ripristino dei dati al load
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
    const songs = localStorage.getItem("songs");
    const temps = localStorage.getItem("temps");
    const punt = localStorage.getItem("punt");
    accessToken = localStorage.getItem("access_token"); // Ripristina il token di accesso
    idCorrente = localStorage.getItem("idCorrente") || 0; // Ripristina l'ID della partita corrente
    persone = JSON.parse(localStorage.getItem("persone")) || { 0: "" }; // Ripristina i giocatori
    personeScelte = JSON.parse(localStorage.getItem("personeScelte")) || [1]; // Ripristina le persone selezionate
    if (nameTeam1) document.getElementById('name-team1').textContent = nameTeam1;
    if (scoreTeam1) document.getElementById('score-team1').textContent = scoreTeam1;
    if (nameTeam2) document.getElementById('name-team2').textContent = nameTeam2;
    if (scoreTeam2) document.getElementById('score-team2').textContent = scoreTeam2;


    try {
        if (imageTeam1) document.getElementById('1').src = imageTeam1;
        if (imageTeam2) document.getElementById('2').src = imageTeam2;
    } catch (error) {
        console.log("Errore nel caricamento delle immagini:", error);
    }

    if (h1) punteggio1 = h1;
    if (h2) punteggio2 = h2;
    if (m1) squadra1 = m1;
    if (m2) squadra2 = m2;
    if (songs) current_track = songsFromString(songs);
    if (temps) tempi = temps.split(";");
    if (punt) punto = parseInt(punt);

    updateBackground();
    controlImgBackground();
    controlloIndietro();
    settaSquadre();
    caricaGiocatori();
});

//aggiunta ultimo valore nella cronologia del punteggio
function updateStringhe() {
    punto = parseInt(punto) + 1;
    current_track[punto] = ogg;
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
function creaArrayZero(dimensione) {
    let arr = [];
    for (let i = 0; i <= dimensione; i++) {
        arr[i] = 0;
    }
    return arr;
}
/*
        GGGGGGGGGGGGGRRRRRRRRRRRRRRRRR                  AAA               FFFFFFFFFFFFFFFFFFFFFF
     GGG::::::::::::GR::::::::::::::::R                A:::A              F::::::::::::::::::::F
   GG:::::::::::::::GR::::::RRRRRR:::::R              A:::::A             F::::::::::::::::::::F
  G:::::GGGGGGGG::::GRR:::::R     R:::::R            A:::::::A            FF::::::FFFFFFFFF::::F
 G:::::G       GGGGGG  R::::R     R:::::R           A:::::::::A             F:::::F       FFFFFF
G:::::G                R::::R     R:::::R          A:::::A:::::A            F:::::F             
G:::::G                R::::RRRRRR:::::R          A:::::A A:::::A           F::::::FFFFFFFFFF   
G:::::G    GGGGGGGGGG  R:::::::::::::RR          A:::::A   A:::::A          F:::::::::::::::F   
G:::::G    G::::::::G  R::::RRRRRR:::::R        A:::::A     A:::::A         F:::::::::::::::F   
G:::::G    GGGGG::::G  R::::R     R:::::R      A:::::AAAAAAAAA:::::A        F::::::FFFFFFFFFF   
G:::::G        G::::G  R::::R     R:::::R     A:::::::::::::::::::::A       F:::::F             
 G:::::G       G::::G  R::::R     R:::::R    A:::::AAAAAAAAAAAAA:::::A      F:::::F             
  G:::::GGGGGGGG::::GRR:::::R     R:::::R   A:::::A             A:::::A   FF:::::::FF           
   GG:::::::::::::::GR::::::R     R:::::R  A:::::A               A:::::A  F::::::::FF           
     GGG::::::GGG:::GR::::::R     R:::::R A:::::A                 A:::::A F::::::::FF           
        GGGGGG   GGGGRRRRRRRR     RRRRRRRAAAAAAA                   AAAAAAAFFFFFFFFFFF         
*/
//grafico per storia partita
function showGraf() {
    if (document.getElementById("grafico").style.display == "block") {
        document.getElementById("grafico").style.display = "none";
        return;
    }
    console.log("current_track:", current_track);
    console.log("punteggio1:", punteggio1);
    console.log("punteggio2:", punteggio2);
    console.log("tempi:", tempi);
    console.log("squadra1:", squadra1);
    console.log("squadra2:", squadra2);
    console.log("punto:", punto);
    console.log("accessToken:", accessToken);
    console.log("idCorrente:", idCorrente);
    console.log("persone:", persone);
    console.log("personeScelte:", personeScelte);
    let array = creaArrayZero(numPersone + 4);
    let array1 = creaArrayZero(numPersone + 4);
    const arr1 = punteggio1.split(";");
    const arr2 = punteggio2.split(";");
    let str = `<div id="primaRiga" class='riga'><p>Grafico punteggi</p></div> `;

    // Aggiornamento dell'array e generazione della stringa
    let prev1 = 0;
    let prev2 = 0;
    //tempi
    let arrayTempMediaSomma = creaArrayZero(numPersone + 4);
    let arrayTempMediaNumero = creaArrayZero(numPersone + 4);
    let arrayTempMin = creaArrayZero(numPersone + 4);
    let arrayTempMax = creaArrayZero(numPersone + 4);
    try {
        for (let index = 0; index < arr1.length; index++) {

            let item = current_track[index - 1] || ogg;
            let tempo = tempi[index - 1];
            let pA = "";
            let pB = "";
            let p1 = arr1[index].split("|")[1];
            let p2 = arr2[index].split("|")[1];
            let var1 = parseInt(arr1[index].split("|")[0]);
            let var2 = parseInt(arr2[index].split("|")[0]);
            let a = var1 - var2;
            array[parseInt(p1)]++;
            array[parseInt(p2)]++;
            array1[parseInt(p1)]++;
            array1[parseInt(p2)]++;
            if (var1 - prev1 == 2) array1[parseInt(p1)]++;
            if (var2 - prev2 == 2) array1[parseInt(p2)]++;

            prev1 = var1;
            prev2 = var2;

            pA = persone[p1];
            pB = persone[p2];

            if (var1 + var2 == 0) {
                str += `<div class='riga'> <p class='sinistra'>0</p><div class="centro1" style="width:50%"></div><div class="centro2" style="width:50%"></div><p class='destra'>0</p></div>`;
            } else {
                a = a * 50 / (var1 + var2);
                let b = 50 + a;
                let c = 50 - a;
                str += `<div class='riga'> <p class='sinistra'>${arr1[index].split("|")[0]}</p><div class="centro1" style="width:${b}%"  onclick="mostraCanzone(${index})"><p>${pA}</p></div><div class="centro2" style="width:${c}%"  onclick="mostraCanzone(${index})"><p>${pB}</p></div><p class='destra'>${arr2[index].split("|")[0]}</p></div>`;

                if (item[0] != 1) str += `<div id="canzone${index}" class='riga' style="display:none"><p class="text2">${item[0]} at ${tempo} by ${item[1]}</p> </div>`;
                else str += `<div id="canzone${index}" class='riga' style="display:none"><p class="text2">not found at ${tempo}</p> </div>`;

            }
            let persona = parseInt(p1);
            if (persona == 0) persona = parseInt(p2);
            if (tempo != null && tempo != "") {
                arrayTempMediaSomma[persona] += parseInt(tempo);
                arrayTempMediaNumero[persona]++;
                if (arrayTempMin[persona] == 0 || parseInt(tempo) < arrayTempMin[persona]) {
                    arrayTempMin[persona] = parseInt(tempo);
                }
                if (arrayTempMax[persona] == 0 || parseInt(tempo) > arrayTempMax[persona]) {
                    arrayTempMax[persona] = parseInt(tempo);
                }

            }
        }
    } catch (errore) {
        str += "errore" + errore;
        console.log(errore);
    }
    for (let i = 0; i < arrayTempMediaSomma.length; i++) {
        if (arrayTempMediaNumero[i] > 0) {
            arrayTempMediaSomma[i] = Math.round(arrayTempMediaSomma[i] / arrayTempMediaNumero[i]);
        } else {
            arrayTempMediaSomma[i] = 0;
        }
    }
    console.log("arrayTempMediaSomma:", arrayTempMediaSomma);
    console.log("arrayTempMin:", arrayTempMin);
    console.log("arrayTempMax:", arrayTempMax);

    try {
        // Ordinamento dell'array
        let sortedArray = Object.entries(array);
        sortedArray.sort((a, b) => b[1] - a[1]);
        str += `<div class="punteggiSingoli"><p>Ordine titolo indovinati</p>`;

        for (let i = 0; i < sortedArray.length; i++) {
            const key = sortedArray[i][0]; // La chiave dell'elemento
            const value = sortedArray[i][1];
            if (key != 0 && value > 0) { // Non aggiungere la chiave "0" poiché non corrisponde a una persona
                str += `<p class="text1" onclick="canzoniPerPersona(${key})">${persone[key]}: ${value} con ${arrayTempMediaSomma[key]}s/c (${arrayTempMin[key]}-${arrayTempMax[key]})</p>`;
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
                str += `<p class="text1">${persone[key]}: ${value}</p>`;
            }
        }
        str += "</div>";
    } catch (errore) {
        str += "errore" + errore;
    }
    // Mostrare il risultato
    document.getElementById("grafico").innerHTML = str;
    document.getElementById("grafico").style.display = "block";
    showMenu(2);
}




/*
TTTTTTTTTTTTTTTTTTTTTTTEEEEEEEEEEEEEEEEEEEEEE               AAA               MMMMMMMM               MMMMMMMM
T:::::::::::::::::::::TE::::::::::::::::::::E              A:::A              M:::::::M             M:::::::M
T:::::::::::::::::::::TE::::::::::::::::::::E             A:::::A             M::::::::M           M::::::::M
T:::::TT:::::::TT:::::TEE::::::EEEEEEEEE::::E            A:::::::A            M:::::::::M         M:::::::::M
TTTTTT  T:::::T  TTTTTT  E:::::E       EEEEEE           A:::::::::A           M::::::::::M       M::::::::::M
        T:::::T          E:::::E                       A:::::A:::::A          M:::::::::::M     M:::::::::::M
        T:::::T          E::::::EEEEEEEEEE            A:::::A A:::::A         M:::::::M::::M   M::::M:::::::M
        T:::::T          E:::::::::::::::E           A:::::A   A:::::A        M::::::M M::::M M::::M M::::::M
        T:::::T          E:::::::::::::::E          A:::::A     A:::::A       M::::::M  M::::M::::M  M::::::M
        T:::::T          E::::::EEEEEEEEEE         A:::::AAAAAAAAA:::::A      M::::::M   M:::::::M   M::::::M
        T:::::T          E:::::E                  A:::::::::::::::::::::A     M::::::M    M:::::M    M::::::M
        T:::::T          E:::::E       EEEEEE    A:::::AAAAAAAAAAAAA:::::A    M::::::M     MMMMM     M::::::M
      TT:::::::TT      EE::::::EEEEEEEE:::::E   A:::::A             A:::::A   M::::::M               M::::::M
      T:::::::::T      E::::::::::::::::::::E  A:::::A               A:::::A  M::::::M               M::::::M
      T:::::::::T      E::::::::::::::::::::E A:::::A                 A:::::A M::::::M               M::::::M
      TTTTTTTTTTT      EEEEEEEEEEEEEEEEEEEEEEAAAAAAA                   AAAAAAAMMMMMMMM               MMMMMMMM
*/

//Usati per gestire le squadre
function changeSquadra1() {
    let str = `<h3 style="color: #bbbbff;">Squadra 1</h3>`;
    let s1 = squadra1.split(";");
    let s2 = squadra2.split(";");
    for (let key in persone) {
        if (key != 0) {
            let color = "squadra";
            let checked = "";
            if (s1.includes(key)) {
                color = "squadra1";
                checked = "checked";  // checkbox selezionato
            } else if (s2.includes(key)) {
                color = "squadra2";
            }
            str += `<label class="${color}">
                        <input type="checkbox" class="t1" value="${key}" ${checked}>
                        <p>${persone[key]}</p>
                    </label>`;
        }
    }
    str += `<button onclick="Set1()">Set</button>`;
    document.getElementById("Sq1").innerHTML = str;
    document.getElementById("Sq1").style.display = "flex";
}

function changeSquadra2() {
    let str = `<h3 style="color: #ffbbbb;">Squadra 2</h3>`;
    let s1 = squadra1.split(";");
    let s2 = squadra2.split(";");
    for (let key in persone) {
        if (key != 0) {
            let color = "squadra";
            let checked = "";
            if (s2.includes(key)) {
                color = "squadra2";
                checked = "checked";  // checkbox selezionato
            } else if (s1.includes(key)) {
                color = "squadra1";
            }
            str += `<label class="${color}">
                        <input type="checkbox" class="t2" value="${key}" ${checked}>
                        <p>${persone[key]}</p>
                    </label>`;
        }
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
    for (let key in selectedValues) {
        squadra2 += ";" + selectedValues[key];
    }
    squadra2 = squadra2.slice(1);
    document.getElementById("Sq2").style.display = "none";
    settaSquadre();
}
function settaSquadre() {
    let str = `<label for="1p-1"><input onclick="deselectCheckboxs()" type="radio" id="1p-1" name="pTeam1" value="0" checked>Nessuno</label>`;

    if (squadra1.length != 0) {
        let sq = squadra1.split(";");
        for (let index = 0; index < sq.length; index++) {
            str += `<label  for="1p${sq[index]}"><input onclick="setTitoloChecked(1)"  type="radio" id="1p${sq[index]}" name="pTeam1" value="${sq[index]}">${persone[sq[index]]}</label>`;
        }
    }
    document.getElementById("partecipanti1").innerHTML = str;

    str = `<label for="2p-1"><input onclick="deselectCheckboxs()" type="radio" id="2p-1" name="pTeam2" value="0" checked>Nessuno</label>`;

    if (squadra2.length != 0) {
        sq = squadra2.split(";");
        for (let index = 0; index < sq.length; index++) {
            str += `<label  for="2p${sq[index]}"><input onclick="setTitoloChecked(2)" type="radio" id="2p${sq[index]}" name="pTeam2" value="${sq[index]}">${persone[sq[index]]}</label>`;
        }
    }
    document.getElementById("partecipanti2").innerHTML = str;
}

function giocatoriAggiuntivi() {
    const container = document.getElementById("Sq3");
    container.innerHTML = ""; // svuota il div
    descrizione = [];
    descrizione[0] = "Nessuno"; // Nessun giocatore selezionato
    descrizione[1] = "Alice"; // Giocatore 1    
    descrizione[2] = "Amici Mati"; // Giocatore 2
    descrizione[3] = "Amici Carlotta"; // Giocatore 3
    descrizione[4] = "Fra 1"; // Giocatore 4
    descrizione[5] = "Fra 2"; // Giocatore 5
    descrizione[6] = "Pallanuoto estesa"; // Giocatore 6
    // 1. Crea i checkbox da 2 a 6
    for (let i = 2; i <= 6; i++) {
        const wrapper = document.createElement("label");
        wrapper.style.display = "block";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "giocatore" + i;
        checkbox.value = i;

        const descrizione = document.createElement("span");
        descrizione.textContent = `Descrizione per il giocatore ${i}`; // ← cambia qui

        wrapper.appendChild(checkbox);
        wrapper.appendChild(descrizione);
        container.appendChild(wrapper);
    }

    // 2. Crea il bottone
    const bottone = document.createElement("button");
    bottone.textContent = "Conferma selezione";
    bottone.onclick = () => {
        const selezionati = [];
        const checkboxes = container.querySelectorAll("input[type=checkbox]");
        checkboxes.forEach(cb => {
            if (cb.checked) {
                selezionati.push(Number(cb.value));
            }
        });
        container.style.display = "none"; // nascondi il div
        // Qui puoi usare l'array `selezionati` come vuoi
    };

    container.appendChild(bottone);
    container.style.display = "block"; // mostra il div
}



/*
MMMMMMMM               MMMMMMMMEEEEEEEEEEEEEEEEEEEEEENNNNNNNN        NNNNNNNNUUUUUUUU     UUUUUUUU
M:::::::M             M:::::::ME::::::::::::::::::::EN:::::::N       N::::::NU::::::U     U::::::U
M::::::::M           M::::::::ME::::::::::::::::::::EN::::::::N      N::::::NU::::::U     U::::::U
M:::::::::M         M:::::::::MEE::::::EEEEEEEEE::::EN:::::::::N     N::::::NUU:::::U     U:::::UU
M::::::::::M       M::::::::::M  E:::::E       EEEEEEN::::::::::N    N::::::N U:::::U     U:::::U 
M:::::::::::M     M:::::::::::M  E:::::E             N:::::::::::N   N::::::N U:::::D     D:::::U 
M:::::::M::::M   M::::M:::::::M  E::::::EEEEEEEEEE   N:::::::N::::N  N::::::N U:::::D     D:::::U 
M::::::M M::::M M::::M M::::::M  E:::::::::::::::E   N::::::N N::::N N::::::N U:::::D     D:::::U 
M::::::M  M::::M::::M  M::::::M  E:::::::::::::::E   N::::::N  N::::N:::::::N U:::::D     D:::::U 
M::::::M   M:::::::M   M::::::M  E::::::EEEEEEEEEE   N::::::N   N:::::::::::N U:::::D     D:::::U 
M::::::M    M:::::M    M::::::M  E:::::E             N::::::N    N::::::::::N U:::::D     D:::::U 
M::::::M     MMMMM     M::::::M  E:::::E       EEEEEEN::::::N     N:::::::::N U::::::U   U::::::U 
M::::::M               M::::::MEE::::::EEEEEEEE:::::EN::::::N      N::::::::N U:::::::UUU:::::::U 
M::::::M               M::::::ME::::::::::::::::::::EN::::::N       N:::::::N  UU:::::::::::::UU  
M::::::M               M::::::ME::::::::::::::::::::EN::::::N        N::::::N    UU:::::::::UU    
MMMMMMMM               MMMMMMMMEEEEEEEEEEEEEEEEEEEEEENNNNNNNN         NNNNNNN      UUUUUUUUU

*/
function mostraCanzone(index) {
    let obj = document.getElementById("canzone" + index);
    if (obj.style.display == "none") {
        obj.style.display = "block";
    }
    else {
        obj.style.display = "none";
    }
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
            tempi.pop();
            punto = punto - 1;
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
        document.getElementById("ind").style.backgroundColor = "#227bd9ff";
    } else {
        document.getElementById("ind").style.backgroundColor = "#EF4444";
    }
}
function showError() {
    document.getElementById("cici").style.display = "block";
}
//per mostrare il menu
function showMenu(op) {
    document.getElementById("canzoni").style.display = "none";
    document.getElementById("cici").style.display = "none";
    document.getElementById("lista-partite").style.display = "none";
    if (op == 2) {
        document.getElementById("menu").style.display = "none";
    } else if (document.getElementById("menu").style.display == "block") {
        document.getElementById("menu").style.display = "none";
    } else {
        document.getElementById("menu").style.display = "block";
        document.getElementById("grafico").style.display = "none";
    }
}
function setTitoloChecked(op) {
    tempi[punto] = getCurrentTimeInSeconds() - tempoTemp;
    if (current_track[punto] != null) {
        if (current_track[punto][0] == 1)
            fetchCurrentTrack(2);
    }
    deselectCheckboxs();
    document.getElementById("team" + op + "-checkbox1").checked = true;
    if (op == 1) {
        document.getElementById("2p-1").checked = true;
    } else if (op == 2) {
        document.getElementById("1p-1").checked = true;
    }
}
//timer per calcolare il tempo di risposta
function startTimer() {
    tempoTemp = getCurrentTimeInSeconds();
}
//Reload pagina
function reload() {
    if (pReload == true) {
        salvaStatoTemporaneo();
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

// Funzione per aggiungere punti in base alle checkbox selezionate
function addSelectedPoints(team) {

    document.getElementById("currentSong").innerHTML = "";
    let totalPoints = 0;
    const checkbox1 = document.getElementById(team + '-checkbox1');
    const checkbox2 = document.getElementById(team + '-checkbox2');
    const checkbox3 = document.getElementById(team + '-checkbox3');

    if (checkbox1.checked && checkbox2.checked) {
        totalPoints += 1;
        if (checkbox3.checked) totalPoints += 1;
    }
    if (totalPoints != 0) {
        addPoints(team, totalPoints);
    } else {
        current_track[punto] = ogg;

    }

    // Deseleziona le checkbox dopo aver aggiunto i punti
    checkbox1.checked = false;
    checkbox2.checked = false;
    checkbox3.checked = false;
    tempoTemp = getCurrentTimeInSeconds();
}

function getCurrentTimeInSeconds() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Converti tutto in secondi
    return hours * 3600 + minutes * 60 + seconds;
}
function deselectCheckboxs() {
    document.getElementById('team1-checkbox1').checked = false;
    document.getElementById('team1-checkbox2').checked = false;
    document.getElementById('team1-checkbox3').checked = false;
    document.getElementById('team2-checkbox1').checked = false;
    document.getElementById('team2-checkbox2').checked = false;
    document.getElementById('team2-checkbox3').checked = false;
}





function listaCanzoni() {
    if (document.getElementById("canzoni").style.display == "block") {
        document.getElementById("canzoni").style.display = "none";
        return;
    }
    var str = "";
    try {
        const arr1 = punteggio1.split(";");
        const arr2 = punteggio2.split(";");
        for (let index = 0; index < current_track.length; index++) {
            const song = current_track[index];
            const t = tempi[index];
            if (song == null) {

            } else if (song[0] != 1) {

                let p1 = arr1[index + 1].split("|")[1];
                let p2 = arr2[index + 1].split("|")[1];
                let persona = "errore";
                if (p1 != 0) {
                    persona = persone[p1];
                } else if (p2 != 0) {
                    persona = persone[p2];
                }
                str += `<div class="rig">
                            <div class="rigg">
                                <a href="https://open.spotify.com/track/${song[2]}" target="_blank"><p>${song[0]}</p></a>
                            </div>
                            <div class="rigg">
                                <p class="desc">indovinata da:${persona} a ${t} s. Link</p>
                            </div>
                        </div>`
            }
        }
    } catch (errore) {
        console.error("Errore durante la generazione della lista delle canzoni:", errore);
    }

    document.getElementById("canzoni").innerHTML = str;
    document.getElementById("canzoni").style.display = "block";
}

function getCanzone() {
    fetchCurrentTrack(3);
}



function canzoniPerPersona(person) {
    let arrayCanzoniPerPersona = [];
    let arrayTempoPerPersona = [];
    let autori = [];
    let numAutori = [];
    const arr1 = punteggio1.split(";");
    const arr2 = punteggio2.split(";");
    let n = 0;
    let t = 0;
    for (let index = 1; index < arr1.length; index++) {

        let item = current_track[index - 1] || ogg;
        let tempo = tempi[index - 1];
        let p1 = arr1[index].split("|")[1];
        let p2 = arr2[index].split("|")[1];

        if (p1 == person || p2 == person) {
            t += tempo;
            n++;
            if (item[0] != 1) {
                arrayCanzoniPerPersona.push(item);
                arrayTempoPerPersona.push(tempo);
                let auts = item[1].split(", ");
                for (let i = 0; i < auts.length; i++) {
                    let presente = false;
                    for (let l = 0; l < autori.length; l++) {
                        if (auts[i] == autori[l]) {
                            presente = true;
                            numAutori[l]++;
                        }
                    }
                    if (!presente) {
                        autori[autori.length] = auts[i];
                        numAutori[autori.length - 1] = 1;
                    }
                }
            }
        }
    }


    if (n != 0)
        t = t / n;
    let strr = `<section class="songs" id="song-list">`;
    for (let index = 0; index < arrayCanzoniPerPersona.length; index++) {
        strr += `
            <article class="song">
                <h3>Titolo: ${arrayCanzoniPerPersona[index][0]}</h3>
                <p><strong>Autori:</strong> ${arrayCanzoniPerPersona[index][1]}</p>
                <p><strong>Tempo:</strong> ${arrayTempoPerPersona[index]} secondi</p>
            </article>
            `;
    }
    strr += `</section>`;
    let strrr = `<section class="songs" id="song-list">`;
    for (let index = 0; index < autori.length; index++) {
        strrr += `<article class="song">
                <p class="nome">${autori[index]}: ${numAutori[index]}</p>
                </article>`;
    }
    strrr += `</section>`;
    nwindow = window.open('', '_blank');
    // Controlla se la finestra è stata aperta
    if (nwindow) {
        // Scrivi il contenuto della nuova pagina HTML
        nwindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Pagina Creata con JavaScript</title>
            <link rel="stylesheet" href="css/punteggiPerPersona.css">
            <script src="script.js" defer></script>
        </head>
        <body>
            <header>
                <h1>${persone[person]}</h1><p>tempo medio: ${t}</p>
            </header>
            <main>
            ${strr}
            </main>
            ${strrr}
        </body>
        </html>
    `);
        // Facoltativo: chiudi lo stream di scrittura per la nuova finestra
        nwindow.document.close();
    }
}

/*
   SSSSSSSSSSSSSSS PPPPPPPPPPPPPPPPP        OOOOOOOOO     TTTTTTTTTTTTTTTTTTTTTTTYYYYYYY       YYYYYYY
 SS:::::::::::::::SP::::::::::::::::P     OO:::::::::OO   T:::::::::::::::::::::TY:::::Y       Y:::::Y
S:::::SSSSSS::::::SP::::::PPPPPP:::::P  OO:::::::::::::OO T:::::::::::::::::::::TY:::::Y       Y:::::Y
S:::::S     SSSSSSSPP:::::P     P:::::PO:::::::OOO:::::::OT:::::TT:::::::TT:::::TY::::::Y     Y::::::Y
S:::::S              P::::P     P:::::PO::::::O   O::::::OTTTTTT  T:::::T  TTTTTTYYY:::::Y   Y:::::YYY
S:::::S              P::::P     P:::::PO:::::O     O:::::O        T:::::T           Y:::::Y Y:::::Y   
 S::::SSSS           P::::PPPPPP:::::P O:::::O     O:::::O        T:::::T            Y:::::Y:::::Y    
  SS::::::SSSSS      P:::::::::::::PP  O:::::O     O:::::O        T:::::T             Y:::::::::Y     
    SSS::::::::SS    P::::PPPPPPPPP    O:::::O     O:::::O        T:::::T              Y:::::::Y      
       SSSSSS::::S   P::::P            O:::::O     O:::::O        T:::::T               Y:::::Y       
            S:::::S  P::::P            O:::::O     O:::::O        T:::::T               Y:::::Y       
            S:::::S  P::::P            O::::::O   O::::::O        T:::::T               Y:::::Y       
SSSSSSS     S:::::SPP::::::PP          O:::::::OOO:::::::O      TT:::::::TT             Y:::::Y       
S::::::SSSSSS:::::SP::::::::P           OO:::::::::::::OO       T:::::::::T          YYYY:::::YYYY    
S:::::::::::::::SS P::::::::P             OO:::::::::OO         T:::::::::T          Y:::::::::::Y    
 SSSSSSSSSSSSSSS   PPPPPPPPPP               OOOOOOOOO           TTTTTTTTTTT          YYYYYYYYYYYYY
*/
// Genera un code verifier e challenge
// 1. Genera code verifier e challenge PKCE
async function generatePKCECodes() {
    const verifier = generateRandomString(64);
    const challenge = await sha256Challenge(verifier);
    localStorage.setItem('code_verifier', verifier); // salva subito
    return challenge;
}

function generateRandomString(length) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    // btoa richiede stringa, quindi converto byte per byte
    return btoa(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function sha256Challenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const base64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// 2. Avvia login con redirect a Spotify
async function login() {
    const challenge = await generatePKCECodes();
    const scope = 'user-read-currently-playing user-read-playback-state';
    const authUrl =
        `https://accounts.spotify.com/authorize?` +
        `response_type=code&client_id=${CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&code_challenge_method=S256&code_challenge=${challenge}`;
    window.location.href = authUrl;
}

// 3. Gestisce il redirect con il codice e scambia token
async function handleRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (!code) return; // niente da fare

    // Se abbiamo già il token nel localStorage, evita di rifare la chiamata
    if (localStorage.getItem('access_token') == null || localStorage.getItem('access_token') == 'undefined' || localStorage.getItem('access_token') == '') {
        window.history.replaceState({}, document.title, REDIRECT_URI);
        return;
    }

    const verifier = localStorage.getItem('code_verifier');
    console.log('handleRedirect - code:', code);
    console.log('handleRedirect - verifier:', verifier);

    if (!verifier) {
        console.error('PKCE code_verifier mancante in localStorage!');
        return;
    }

    try {
        const response = await fetch('/.netlify/functions/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: code,
                verifier: verifier,
                redirect_uri: REDIRECT_URI
            })
        });

        if (!response.ok) {
            const text = await response.text();
            console.error('Errore fetch token:', response.status, text);
            return;
        }

        const data = await response.json();
        console.log('Token ottenuto:', data);

        localStorage.setItem('access_token', data.access_token);
        accessToken = data.access_token;

        // Pulisce URL togliendo codice dalla barra indirizzi
        window.history.replaceState({}, document.title, REDIRECT_URI);
    } catch (error) {
        console.error('Eccezione durante fetch token:', error);
    }
}

// 4. Funzione per fetch canzone corrente da Spotify
async function fetchCurrentTrack(num) {
    let tempPunto = punto;
    let token = localStorage.getItem('access_token') || accessToken;
    console.log('fetchCurrentTrack - token:', token);
    if (!token || token === null || token === 'undefined' || token === '' || token === 0 || token === 'null') {
        console.warn('Token mancante, Spotify disabilitato');
        current_track[tempPunto] = ogg; // fallback locale
        return;
    }

    if (!navigator.onLine) {
        console.warn('Offline, Spotify disabilitato');
        current_track[tempPunto] = ogg;
        return;
    }

    try {
        const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 204) {
            console.log('Nessuna traccia in riproduzione');
            current_track[tempPunto] = ogg;
            return;
        }

        if (!res.ok) {
            const text = await res.text();
            console.error('Errore API Spotify:', res.status, text);
            current_track[tempPunto] = ogg;
            return;
        }

        const data = await res.json();
        console.log('Track data:', data);

        const ogg1 = [
            data.item.name,
            data.item.artists.map(artist => artist.name).join(', '),
            data.item.id,
            data.progress_ms / 1000 // secondi
        ];

        current_track[tempPunto] = ogg1;
        if (num === 3) {
            document.getElementById("currentSong").textContent = `${data.item.name} of ${ogg1[1]}`;
        }
    } catch (error) {
        console.error('Eccezione fetchCurrentTrack:', error);
        current_track[tempPunto] = ogg;
    }
}

// 5. Logout pulito
function logout() {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    accessToken = null;
    window.history.replaceState({}, document.title, "/");
    // opzionale: logout spotify aprendo pagina
    window.open('https://www.spotify.com/logout/', '_blank');
}


function songsToString(oggg) {
    var str = "";
    try {
        for (let index = 0; index < oggg.length; index++) {
            str += oggg[index][0] + "||" + oggg[index][1] + "||" + oggg[index][2];
            if (index < oggg.length - 1) {
                str += "///";
            }
        }
    } catch (errore) {
        str = null;
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

/*
PPPPPPPPPPPPPPPPP   DDDDDDDDDDDDD        FFFFFFFFFFFFFFFFFFFFFF
P::::::::::::::::P  D::::::::::::DDD     F::::::::::::::::::::F
P::::::PPPPPP:::::P D:::::::::::::::DD   F::::::::::::::::::::F
PP:::::P     P:::::PDDD:::::DDDDD:::::D  FF::::::FFFFFFFFF::::F
  P::::P     P:::::P  D:::::D    D:::::D   F:::::F       FFFFFF
  P::::P     P:::::P  D:::::D     D:::::D  F:::::F             
  P::::PPPPPP:::::P   D:::::D     D:::::D  F::::::FFFFFFFFFF   
  P:::::::::::::PP    D:::::D     D:::::D  F:::::::::::::::F   
  P::::PPPPPPPPP      D:::::D     D:::::D  F:::::::::::::::F   
  P::::P              D:::::D     D:::::D  F::::::FFFFFFFFFF   
  P::::P              D:::::D     D:::::D  F:::::F             
  P::::P              D:::::D    D:::::D   F:::::F             
PP::::::PP          DDD:::::DDDDD:::::D  FF:::::::FF           
P::::::::P          D:::::::::::::::DD   F::::::::FF           
P::::::::P          D::::::::::::DDD     F::::::::FF           
PPPPPPPPPP          DDDDDDDDDDDDD        FFFFFFFFFFF
*/
function squadraAppartenenza(num) {
    let as1 = squadra1.split(";")
    for (let index = 0; index < as1.length; index++) {
        if (as1[index] == num)
            return 1;
    }
    as1 = squadra2.split(";")
    for (let index = 0; index < as1.length; index++) {
        if (as1[index] == num)
            return 2;
    }
    return 0;
}




let riga = 20;
function rigaAdd(pdf, num) { // Gestione di testi su più righe
    let margin = 20;
    const pageHeight = pdf.internal.pageSize.height;
    riga += num - 3;
    // Verifica se serve una nuova pagina
    if (riga > pageHeight - margin) {
        pdf.addPage(); // Aggiunge una nuova pagina
        riga = margin; // Resetta la posizione Y
    }
}
async function generaPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    let nome_partita = prompt("Inserisci il nemo della partita:");
    const wid = pdf.internal.pageSize.width;
    // Bordi del foglio
    pdf.setLineWidth(1);// rettangolo esterno


    // Intestazione
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text(nome_partita, centerX(nome_partita, pdf), riga);
    rigaAdd(pdf, 10);
    rigaAdd(pdf, 5);
    // Squadre e punteggi
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    let a = "Squadra " + document.getElementById("name-team1").textContent;
    pdf.setTextColor(0, 0, 150);
    pdf.text(a, centerX25(a, pdf), riga);
    a = "Squadra " + document.getElementById("name-team2").textContent;
    pdf.setTextColor(150, 0, 0);
    pdf.text(a, centerX75(a, pdf), riga);
    rigaAdd(pdf, 10);

    pdf.setFontSize(14);
    a = "Punteggio finale: " + document.getElementById("score-team1").textContent;
    pdf.setTextColor(0, 0, 150);
    pdf.text(a, centerX25(a, pdf), riga);
    a = "Punteggio finale: " + document.getElementById("score-team2").textContent;
    pdf.setTextColor(150, 0, 0);
    pdf.text(a, centerX75(a, pdf), riga);
    rigaAdd(pdf, 10);
    pdf.setLineWidth(0.5); // Spessore della linea
    pdf.line(10, riga, wid - 10, riga);
    rigaAdd(pdf, 10);
    let r = riga;
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.text("Punti per persona:", 15, riga);
    pdf.setFont("helvetica", "normal");

    let array = creaArrayZero(numPersone + 4);
    let array1 = creaArrayZero(numPersone + 4);

    const arr1 = punteggio1.split(";");
    const arr2 = punteggio2.split(";");

    // Aggiornamento dell'array e generazione della stringa
    let prev1 = 0;
    let prev2 = 0;
    try {
        for (let index = 0; index < arr1.length; index++) {
            let item = current_track[index - 1] || ogg;
            let tempo = tempi[index - 1];
            let p1 = arr1[index].split("|")[1];
            let p2 = arr2[index].split("|")[1];
            let var1 = parseInt(arr1[index].split("|")[0]);
            let var2 = parseInt(arr2[index].split("|")[0]);
            let a = var1 - var2;
            array[parseInt(p1)]++;
            array[parseInt(p2)]++;
            array1[parseInt(p1)]++;
            array1[parseInt(p2)]++;
            if (var1 - prev1 == 2) array1[parseInt(p1)]++;
            if (var2 - prev2 == 2) array1[parseInt(p2)]++;
            prev1 = var1;
            prev2 = var2;
        }
    } catch (errore) {
        rigaAdd(pdf, 10);
        console.log(errore);
        pdf.setTextColor(100, 0, 0);
        pdf.text(errore, 15, riga);
        pdf.setTextColor(0, 0, 0);
    }
    // Ordinamento dell'array
    let sortedArray = Object.entries(array);
    sortedArray.sort((a, b) => b[1] - a[1]);

    for (let i = 0; i < sortedArray.length; i++) {
        const key = sortedArray[i][0]; // La chiave dell'elemento
        const value = sortedArray[i][1];
        if (key != 0 && value > 0) {
            rigaAdd(pdf, 10);
            if (squadraAppartenenza(key) == 1) pdf.setTextColor(0, 0, 150);
            if (squadraAppartenenza(key) == 2) pdf.setTextColor(150, 0, 0);
            pdf.text(persone[key] + ": " + value, 20, riga);
            pdf.setTextColor(0, 0, 0);
        }
    }
    riga = r;
    // Sezione: Punti per persona (precisi)
    pdf.setFont("helvetica", "bold");
    pdf.text("Punti per persona (precisi):", 75, riga);
    pdf.setFont("helvetica", "normal");
    let sortedArray1 = Object.entries(array1);
    sortedArray1.sort((a, b) => b[1] - a[1]);

    for (let i = 0; i < sortedArray1.length; i++) {
        const key = sortedArray1[i][0]; // La chiave dell'elemento
        const value = sortedArray1[i][1];
        if (key != 0 && value > 0) {
            rigaAdd(pdf, 10);
            if (squadraAppartenenza(key) == 1) pdf.setTextColor(0, 0, 150);
            if (squadraAppartenenza(key) == 2) pdf.setTextColor(150, 0, 0);
            pdf.text(persone[key] + ": " + value, 80, riga);
            pdf.setTextColor(0, 0, 0);
        }
    }

    rigaAdd(pdf, 10);
    rigaAdd(pdf, 10);
    rigaAdd(pdf, 10);
    pdf.setLineWidth(0.5); // Spessore della linea
    pdf.line(10, riga, wid - 10, riga);
    // Sezione: Canzoni indovinate
    let primaRiga = 0;
    try {
        for (let indexx = 1; indexx < numPersone; indexx++) {
            let arrayCanzoniPerPersona = [];
            let arrayTempoPerPersona = [];
            let autori = [];
            let numAutori = [];
            let n = 0;
            let t = 0;
            for (let index = 1; index < arr1.length; index++) {
                let item = current_track[index - 1] || ogg;
                let tempo = tempi[index - 1];
                let p1 = arr1[index].split("|")[1];
                let p2 = arr2[index].split("|")[1];
                if (p1 == indexx || p2 == indexx) {
                    t += tempo;
                    n++;
                    if (item[0] != 1) {
                        arrayCanzoniPerPersona.push(item);
                        arrayTempoPerPersona.push(tempo);
                        let auts = item[1].split(", ");
                        for (let i = 0; i < auts.length; i++) {
                            let presente = false;
                            for (let l = 0; l < autori.length; l++) {
                                if (auts[i] == autori[l]) {
                                    presente = true;
                                    numAutori[l]++;
                                }
                            }
                            if (!presente) {
                                autori[autori.length] = auts[i];
                                numAutori[autori.length - 1] = 1;
                            }
                        }
                    }
                }
            }
            if (n != 0) {
                t = t / n;
                if (primaRiga == 1) {
                    rigaAdd(pdf, 10);
                    pdf.setLineWidth(0.3); // Spessore della linea
                    pdf.line(10, riga, wid / 2, riga);
                } else {
                    primaRiga = 1;
                }
                rigaAdd(pdf, 10);
                pdf.setFont("helvetica", "bold");
                pdf.text("Canzoni indovinate da: " + persone[indexx], 15, riga);
                pdf.setFont("helvetica", "normal");
                rigaAdd(pdf, 10);
                pdf.text("Ogni canzone trovata:", 20, riga);
                for (let index = 0; index < arrayCanzoniPerPersona.length; index++) {
                    rigaAdd(pdf, 10);
                    let sstr = "- " + arrayCanzoniPerPersona[index][0] + " di " + arrayCanzoniPerPersona[index][1] + " in " + arrayTempoPerPersona[index] + "s";
                    pdf.text(sstr, 25, riga);
                }
                rigaAdd(pdf, 10);
                pdf.text("Autori trovati:", 20, riga);
                for (let index = 0; index < autori.length; index++) {
                    rigaAdd(pdf, 10);
                    let sstr = "- " + autori[index] + " trovato " + numAutori[index];
                    if (numAutori[index] == 1) sstr += " volta"
                    else sstr += " volte";
                    pdf.text(sstr, 25, riga);

                }
            }
        }
    } catch (errore) {
        rigaAdd(pdf, 10);
        console.log(errore);
        pdf.setTextColor(100, 0, 0);
        pdf.text(errore, 15, riga);
        pdf.setTextColor(0, 0, 0);
    }
    rigaAdd(pdf, 10);
    pdf.setLineWidth(0.5); // Spessore della linea
    pdf.line(10, riga, wid - 10, riga);
    rigaAdd(pdf, 10);
    pdf.setFont("helvetica", "bold");
    pdf.text("Lista canzoni: ", 15, riga);
    pdf.setFont("helvetica", "normal");
    try {
        for (let index = 0; index < current_track.length; index++) {
            const song = current_track[index];
            const t = tempi[index];
            if (song == null) {

            } else if (song[0] != 1) {

                let p1 = arr1[index + 1].split("|")[1];
                let p2 = arr2[index + 1].split("|")[1];
                let persona = "errore";
                if (p1 != 0) {
                    persona = persone[p1];
                } else if (p2 != 0) {
                    persona = persone[p2];
                }
                rigaAdd(pdf, 15);
                const t1 = "  (" + persona + " a " + t + "s)";
                pdf.text(song[0] + " di " + song[1] + t1, 20, riga);
                const textWidth = pdf.getTextWidth(song[0]);

                // Altezza del font corrente
                const fontSize = pdf.internal.getFontSize(); // In punti
                const textHeight = (fontSize / 72) * 25.4; // Converti in mm (standard PDF)

                // Link
                const linkX = 20; // Posizione orizzontale del testo
                const linkY = riga - textHeight + 1; // Posizione verticale (con aggiustamenti)
                pdf.link(linkX, linkY, textWidth, textHeight, { url: `https://open.spotify.com/track/${song[2]}` });

                /* rigaAdd(pdf, 6);
                 pdf.setLineWidth(0.3); // Spessore della linea
                 pdf.setDrawColor(100, 100, 100);
                 pdf.line(x, riga, pdf.getTextWidth(t1) + x, riga);
                 pdf.setDrawColor(0, 0, 0);*/

            }
        }
    } catch (errore) {
        rigaAdd(pdf, 10);
        console.log(errore);
        pdf.setTextColor(100, 0, 0);
        pdf.text(errore, 15, riga);
        pdf.setTextColor(0, 0, 0);
    }
    // Salvataggio del file
    pdf.save(nome_partita + "_report_partita.pdf");
}
function centerX(text, pdf) {
    const pageWidth = pdf.internal.pageSize.width;
    const textWidth = pdf.getTextWidth(text); // Larghezza del testo
    return (pageWidth - textWidth) / 2
}
function centerX25(text, pdf) {
    const pageWidth = pdf.internal.pageSize.width;
    const textWidth = pdf.getTextWidth(text); // Larghezza del testo
    return (pageWidth - textWidth) / 4
}
function centerX75(text, pdf) {
    const pageWidth = pdf.internal.pageSize.width;
    const textWidth = pdf.getTextWidth(text); // Larghezza del testo
    return (pageWidth - textWidth) * 3 / 4
}
/*
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker registrato con successo.'))
        .catch((error) => console.error('Registrazione Service Worker fallita:', error));
}
*/

handleRedirect();
caricaGiocatori();