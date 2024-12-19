//grafico per storia partita
function showGraf() {
    if (document.getElementById("grafico").style.display == "block") {
        document.getElementById("grafico").style.display = "none";
        return;
    }
    console.log(current_track);
    console.log(punteggio1);
    console.log(punteggio2);
    console.log(tempi);
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
                else str += `<div id="canzone${index}" class='riga' style="display:none"><p class="text2">not found at ${tempo}</p> </div>`;

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
            <link rel="stylesheet" href=""css/punteggiPerPersona.css"">
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