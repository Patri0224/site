//variabili globali
const persone = { 0: "", 1: "Alice", 2: "Andre", 3: "Busti", 4: "Dani", 5: "Fede", 6: "Fra", 7: "Friggi", 8: "Giorgia", 9: "Giulia", 10: "Marco", 11: "Mati", 12: "Pat", 13: "Totta", 14: "Viola" }
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
let punto = 0;
let current_track = [];
let accessToken = null;
let tempi = [];
let tempoTemp = 0;
let ogg = [];
ogg[0] = 1;
ogg[1] = 1;
ogg[2] = 1;
let nwindow;
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
    document.getElementById("currentSong").innerHTML = "";
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
    const punt = punto;
    const songs = current_track.join(";;");
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
            current_track = data.songs.split(";;");
            tempi = data.temps.split(";");
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
//grafico per storia partita
function showGraf() {
    if (document.getElementById("grafico").style.display == "block") {
        document.getElementById("grafico").style.display = "none";
        return;
    }
    console.log(current_track);
    console.log(punteggio1);
    console.log(punteggio2);
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
        13: 0,
        14: 0,
        15: 0,
        16: 0,
        17: 0
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
        13: 0,
        14: 0,
        15: 0,
        16: 0,
        17: 0
    };

    const arr1 = punteggio1.split(";");
    const arr2 = punteggio2.split(";");
    let str = `<div id="primaRiga" class='riga'><p>Grafico punteggi</p></div> `;

    // Aggiornamento dell'array e generazione della stringa
    let prev1 = 0;
    let prev2 = 0;
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
                else str += `<div id="canzone${index}" class='riga' style="display:none"><p class="text2">not found</p> </div>`;

            }
        }
    } catch (errore) {
        str += "errore" + errore;
        console.log(errore);
    }
    try {
        // Ordinamento dell'array
        let sortedArray = Object.entries(array);
        sortedArray.sort((a, b) => b[1] - a[1]);
        str += `<div class="punteggiSingoli"><p>Ordine titolo indovinati</p>`;

        for (let i = 0; i < sortedArray.length; i++) {
            const key = sortedArray[i][0]; // La chiave dell'elemento
            const value = sortedArray[i][1];
            if (key != 0 && value > 0) { // Non aggiungere la chiave "0" poiché non corrisponde a una persona
                str += `<p class="text1" onclick="canzoniPerPersona(${key})">${persone[key]}: ${value}</p>`;
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
function todiv(str) {
    //document.getElementById("cici").innerHTML += str;
}
function mostraCanzone(index) {
    let obj = document.getElementById("canzone" + index);
    console.log(obj);
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
        document.getElementById("ind").style.backgroundColor = "blue";
    } else {
        document.getElementById("ind").style.backgroundColor = "red";
    }
}
//per mostrare il menu
function showMenu(op) {
    document.getElementById("canzoni").style.display = "none";
    if (op == 2) {
        document.getElementById("menu").style.display = "none";
    } else if (document.getElementById("menu").style.display == "block") {
        document.getElementById("menu").style.display = "none";
    } else {
        document.getElementById("menu").style.display = "block";
        document.getElementById("grafico").style.display = "none";
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
    console.log(squadra1);
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
    let str = `<label for="1p-1"><input type="radio" id="1p-1" name="pTeam1" value="0" checked>Nessuno</label>`;

    if (squadra1.length != 0) {
        let sq = squadra1.split(";");
        for (let index = 0; index < sq.length; index++) {
            str += `<label  onclick="setTitoloChecked(1)"  for="1p${sq[index]}"><input type="radio" id="1p${sq[index]}" name="pTeam1" value="${sq[index]}">${persone[sq[index]]}</label>`;
        }
    }
    document.getElementById("partecipanti1").innerHTML = str;

    str = `<label for="2p-1"><input type="radio" id="2p-1" name="pTeam2" value="0" checked>Nessuno</label>`;

    if (squadra2.length != 0) {
        sq = squadra2.split(";");
        for (let index = 0; index < sq.length; index++) {
            str += `<label onclick="setTitoloChecked(2)" for="2p${sq[index]}"><input  type="radio" id="2p${sq[index]}" name="pTeam2" value="${sq[index]}">${persone[sq[index]]}</label>`;
        }
    }
    document.getElementById("partecipanti2").innerHTML = str;
}




function setTitoloChecked(op) {
    tempi[punto] = getCurrentTimeInSeconds() - tempoTemp;
    tempoTemp = getCurrentTimeInSeconds();
    document.getElementById("team" + op + "-checkbox1").checked = true;
    if (op == 1) {
        document.getElementById("2p-1").checked = true;
        document.getElementById("team" + 2 + "-checkbox1").checked = false;
        document.getElementById("team" + 2 + "-checkbox2").checked = false;
        document.getElementById("team" + 2 + "-checkbox3").checked = false;
    } else if (op == 2) {
        document.getElementById("1p-1").checked = true;
        document.getElementById("team" + 1 + "-checkbox1").checked = false;
        document.getElementById("team" + 1 + "-checkbox2").checked = false;
        document.getElementById("team" + 1 + "-checkbox3").checked = false;
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

// Funzione per aggiungere punti in base alle checkbox selezionate
function addSelectedPoints(team) {
    if (current_track[punto] != null) {
        if (current_track[punto][0] == 1)
            fetchCurrentTrack();
    }
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
                str += `<div class="rig"><div class="rigg"><p>${song[0]}</p></div><div class="rigg"><p class="desc">indovinata da:${persona} a ${song[2]}</p></div></div>`
            }
        }
    } catch (errore) {
        str += "errore" + errore;
    }
    document.getElementById("canzoni").innerHTML = str;
    document.getElementById("canzoni").style.display = "block";
}

function getCanzone() {
    tempoTemp = getCurrentTimeInSeconds();
    fetchCurrentTrack();
}



function canzoniPerPersona(person) {
    let arrayCanzoniPerPersona = [];
    let arrayTempoPerPersona = [];
    let autori = [];
    let numAutori = [];
    const arr1 = punteggio1.split(";");
    const arr2 = punteggio2.split(";");
    for (let index = 1; index < arr1.length; index++) {

        let item = current_track[index - 1] || ogg;
        let tempo = tempi[index - 1];
        let p1 = arr1[index].split("|")[1];
        let p2 = arr2[index].split("|")[1];

        if (p1 == person || p2 == person) {
            arrayCanzoniPerPersona.push(item);
            arrayTempoPerPersona.push(tempo);
            console.log(item+"aa");
            if (item[0] != 1) {
                console.log(item+"bb");
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
                        numAutori[autori.length-1] = 1;
                    }
                }
            }
        }
    }
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
    console.log(autori);
    console.log(numAutori);
    strr += `</section>`;
    let strrr = `<div id="autori">`;
    for (let index = 0; index < autori.length; index++) {
        strrr += `<div class="autore">
                <p class="nome">${autori[index]}</p><p>${numAutori[index]}</p>
                </div>`;
    }
    strrr += `</div>`;
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
            <link rel="stylesheet" href="style1.css">
            <script src="script.js" defer></script>
        </head>
        <body>
            <header>
                <h1>${persone[person]}</h1>
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
        todiv('Access Token:', accessToken);
    }
};

// Step 3: Fetch the currently playing track
const fetchCurrentTrack = async () => {

    const API_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
    if (!accessToken) {
        current_track[punto] = ogg;
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
            current_track[punto] = ogg1;
            document.getElementById("currentSong").innerHTML = data.item.name + " of " + ogg1[1];
        } else {
            console.error('No track playing or API error:', response);
            todiv('No track playing or API error:' + response);
            current_track[punto] = ogg;
        }
    } catch (error) {
        console.error('Error fetching current track:', error);
        todiv('Error fetching current track:' + error);
        current_track[punto] = ogg;
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