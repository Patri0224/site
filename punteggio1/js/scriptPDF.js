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
        console.log(errore);
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
    // Sezione: Canzoni indovinate
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
            rigaAdd(pdf, 10);
            pdf.setLineWidth(0.5); // Spessore della linea
            pdf.line(10, riga, wid / 2, riga);
            rigaAdd(pdf, 10);
            pdf.setFont("helvetica", "bold");
            pdf.text("Canzoni indovinate da: " + persone[indexx], 15, riga);
            pdf.setFont("helvetica", "normal");
            rigaAdd(pdf, 10);
            pdf.text("Ogni canzone trovata:", 20, riga);
            for (let index = 0; index < arrayCanzoniPerPersona.length; index++) {
                rigaAdd(pdf, 10);
                let sstr = arrayCanzoniPerPersona[index][0] + " di " + arrayCanzoniPerPersona[index][1] + " in " + arrayTempoPerPersona[index] + "s";
                pdf.text(sstr, 25, riga);
            }
            rigaAdd(pdf, 10);
            pdf.text("Autori trovati:", 20, riga);
            for (let index = 0; index < autori.length; index++) {
                rigaAdd(pdf, 10);
                let sstr = autori[index] + " trovato " + numAutori[index];
                if (numAutori[index] == 1) sstr += " volta"
                else sstr += " volte";
                pdf.text(sstr, 25, riga);

            }
        }
    }
    rigaAdd(pdf, 10);
    pdf.setLineWidth(0.5); // Spessore della linea
    pdf.line(10, riga, wid - 10, riga);
    rigaAdd(pdf, 10);
    pdf.setFont("helvetica", "bold");
    pdf.text("Lista canzoni: ", 15, riga);
    pdf.setFont("helvetica", "normal");
    for (let index = 0; index < current_track.length; index++) {
        const song = current_track[index];
        const t = tempi[index];
        if (song == null) {

        } else if (song[0] != 1) {

            const arr11 = punteggio1.split(";");
            const arr21 = punteggio2.split(";");
            let p1 = arr11[index + 1].split("|")[1];
            let p2 = arr21[index + 1].split("|")[1];
            let persona = "errore";
            if (p1 != 0) {
                persona = persone[p1];
            } else if (p2 != 0) {
                persona = persone[p2];
            }
            rigaAdd(pdf, 11);
            pdf.text(song[0], 20, riga);
            rigaAdd(pdf, 8);
            const t1 = "indovinata da: " + persona + " a " + t + "s.";
            pdf.text(t1, 20, riga);
            const text = "Link a Spotify";
            const url = "https://open.spotify.com/track/" + song[2]; // Sostituisci con il tuo link

            rigaAdd(pdf, 8);
            // Aggiunge il testo visibile
            const x = 20;
            pdf.text(text, x, riga);

            // Aggiunge il link cliccabile sulla stessa posizione
            const textWidth = pdf.getTextWidth(text);
            pdf.link(x, riga - 5, textWidth, 3, { url: url });
            rigaAdd(pdf, 6);
            pdf.setLineWidth(0.3); // Spessore della linea
            pdf.setDrawColor(100, 100, 100);
            pdf.line(x, riga, pdf.getTextWidth(t1) + x, riga);
            pdf.setDrawColor(0, 0, 0);

        }
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