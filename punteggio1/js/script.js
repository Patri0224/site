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
        document.getElementById("ind").style.backgroundColor = "blue";
    } else {
        document.getElementById("ind").style.backgroundColor = "red";
    }
}

//per mostrare il menu





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
            fetchCurrentTrack(2);
    }
    document.getElementById("currentSong").innerHTML = "";
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