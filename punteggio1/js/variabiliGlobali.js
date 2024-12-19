const persone = { 0: "", 1: "Alice", 2: "Andre", 3: "Busti", 4: "Dani", 5: "Fede", 6: "Fra", 7: "Friggi", 8: "Giorgia", 9: "Giulia", 10: "Marco", 11: "Mati", 12: "Pat", 13: "Totta", 14: "Viola" }
let numPersone = 15;
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
const consoleDiv = document.getElementById("cici");

// Salva i metodi originali della console
const originalLog = console.log;
const originalError = console.error;