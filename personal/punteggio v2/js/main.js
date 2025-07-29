const persone = {
    0: "",
    1: "Alice", 2: "Andre", 3: "Busti", 4: "Dani", 5: "Fede", 6: "Fra", 7: "Friggi",
    8: "Giorgia", 9: "Giulia", 10: "Marco", 11: "Mati", 12: "Pat", 13: "Totta",
    14: "Viola", 15: "Margo", 16: "Lisa", 17: "Mirko", 18: "Depa", 19: "Giada",
    20: "Irene", 21: "Mati D", 22: "Clara", 23: "Samu", 24: "Billa",
    25: "Giuse", 26: "Paolo",
    27: "Ludovica", 28: "Giorgia C", 29: "Selina"
};

// Converti oggetto in array, saltando l'indice 0
const giocatoriPredefiniti = Object.keys(persone)
    .filter(k => k !== "0")
    .map(k => persone[k]);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('setupForm');
    const selezioneSquadre = document.getElementById('selezioneSquadre');
    const numSquadre = document.getElementById('numSquadre');

    function aggiornaSelezioneSquadre() {
        const n = parseInt(numSquadre.value);
        selezioneSquadre.innerHTML = '';

        for (let i = 1; i <= n; i++) {
            const label = document.createElement('label');
            label.textContent = `Squadra ${i}:`;

            const select = document.createElement('select');
            select.multiple = true;
            select.name = `squadra${i}`;

            giocatoriPredefiniti.forEach(nome => {
                const opt = document.createElement('option');
                opt.value = nome;
                opt.textContent = nome;
                select.appendChild(opt);
            });

            label.appendChild(select);
            selezioneSquadre.appendChild(label);
        }
    }

    numSquadre.addEventListener('change', aggiornaSelezioneSquadre);
    aggiornaSelezioneSquadre(); // iniziale

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const setup = {
            numeroSquadre: parseInt(numSquadre.value),
            tipoRegole: document.getElementById('regole').value,
            squadre: []
        };

        for (let i = 1; i <= setup.numeroSquadre; i++) {
            const select = form.querySelector(`select[name="squadra${i}"]`);
            const membri = Array.from(select.selectedOptions).map(opt => opt.value);
            setup.squadre.push(membri);
        }

        localStorage.setItem('partitaCorrente', JSON.stringify(setup));
        window.location.href = 'partita.html';
    });

});
