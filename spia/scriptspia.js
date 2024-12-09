var persone = [];
function addNome(str) {
    persone.push(str);
}
function removeNome(elementoDaRimuovere) {
    const indice = persone.indexOf(elementoDaRimuovere);

    if (indice !== -1) {
        // Rimuovi l'elemento usando splice
        persone.splice(indice, 1);
    }
}
var parole={};