
function showMenu(op) {
    document.getElementById("canzoni").style.display = "none";
    document.getElementById("cici").style.display = "none";
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
    let str = `<h3>Squadra 1</h3>`;
    for (let key in persone) {
        if (key != 0)
            str += `<label><input type="checkbox" class="t1" value="${key}"><p>${persone[key]}</p></label>`;
    }
    str += `<button onclick="Set1()">Set</button>`;
    document.getElementById("Sq1").innerHTML = str;
    document.getElementById("Sq1").style.display = "flex";
}

function changeSquadra2() {
    let str = `<h3>Squadra 2</h3>`;
    for (let key in persone) {
        if (key != 0)
            str += `<label><input type="checkbox" class="t2" value="${key}"><p>${persone[key]}</p></label>`;
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
    let str = `<label for="1p-1"><input type="radio" id="1p-1" name="pTeam1" value="0" checked>Nessuno</label>`;

    if (squadra1.length != 0) {
        let sq = squadra1.split(";");
        for (let index = 0; index < sq.length; index++) {
            str += `<label  for="1p${sq[index]}"><input onclick="setTitoloChecked(1)"  type="radio" id="1p${sq[index]}" name="pTeam1" value="${sq[index]}">${persone[sq[index]]}</label>`;
        }
    }
    document.getElementById("partecipanti1").innerHTML = str;

    str = `<label for="2p-1"><input type="radio" id="2p-1" name="pTeam2" value="0" checked>Nessuno</label>`;

    if (squadra2.length != 0) {
        sq = squadra2.split(";");
        for (let index = 0; index < sq.length; index++) {
            str += `<label  for="2p${sq[index]}"><input onclick="setTitoloChecked(2)" type="radio" id="2p${sq[index]}" name="pTeam2" value="${sq[index]}">${persone[sq[index]]}</label>`;
        }
    }
    document.getElementById("partecipanti2").innerHTML = str;
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
                                <p>${song[0]}</p>
                            </div>
                            <div class="rigg">
                                <p class="desc">indovinata da:${persona} a ${t} <a href="https://open.spotify.com/track/${song[2]}" target="_blank">Link</a></p>
                            </div>
                        </div>`
            }
        }
    } catch (errore) {
        str += "errore" + errore;
    }

    document.getElementById("canzoni").innerHTML = str;
    document.getElementById("canzoni").style.display = "block";
}
function showError() {
    document.getElementById("cici").style.display = "block";
}
function mostraCanzone(index) {
    let obj = document.getElementById("canzone" + index);
    if (obj.style.display == "none") {
        obj.style.display = "block";
    }
    else {
        obj.style.display = "none";
    }
}
