let clickCounter = 0;
let lastClick = null; // Coordina dell'ultimo clic
let lineaWidth = 10;
let punti = 0;
document.addEventListener('click', (event) => {
    clickCounter++; // Incrementare il contatore dei clic

    const { clientX: x, clientY: y } = event;

    // Creare un nuovo div per il clic
    const clickDiv = document.createElement('div');
    clickDiv.classList.add('click');
    clickDiv.id = clickCounter; // Assegnare l'ID corrispondente
    clickDiv.style.left = `${x}px`;
    clickDiv.style.top = `${y}px`;

    // Aggiungere il div al documento
    document.body.appendChild(clickDiv);

    // Creare e gestire la linea tra l'ultimo clic e il nuovo clic
    if (lastClick) {
        drawLine(lastClick.x, lastClick.y, x, y);
    }
    if (lastClick) {
        // Conta le sfere sulla linea tra i due clic
        punti += contaSfereSuLinea(lastClick.x, lastClick.y, x, y);
        const counterDiv = document.getElementById('counter');
        counterDiv.textContent = `Punti: ${punti}`;
    }
    // Aggiornare l'ultimo clic
    lastClick = { x, y };

    // Aggiornare la trasparenza di tutti i div esistenti
    updateTransparency();
});

function drawLine(x1, y1, x2, y2) {
    // Calcolare la distanza e l'angolo tra i punti
    y1 = y1 - lineaWidth / 2;
    y2 = y2 - lineaWidth / 2;
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    // Creare un nuovo div per la linea
    const lineDiv = document.createElement('div');
    lineDiv.classList.add('line');
    lineDiv.style.width = `${distance}px`;
    lineDiv.style.height = `${lineaWidth}px`;
    lineDiv.style.left = `${x1}px`;
    lineDiv.style.top = `${y1}px`;
    lineDiv.style.transform = `rotate(${angle}deg)`;

    // Aggiungere la linea al documento
    document.body.appendChild(lineDiv);

    // Rimuovere la linea dopo 1 secondo
    setTimeout(() => {
        lineDiv.classList.add('hidden'); // Svanire la linea
        setTimeout(() => lineDiv.remove(), 1000); // Rimuovere il div dopo la transizione
    }, 10);
}

function updateTransparency() {
    // Recuperare tutti gli elementi con la classe 'click'
    const allClicks = document.querySelectorAll('.click');

    allClicks.forEach((div) => {
        const id = parseInt(div.id); // Recuperare l'ID del div
        const difference = clickCounter - id;

        if (difference > 3) {
            // Se la differenza è maggiore di 5, rendere il div invisibile
            div.remove();
        } else {
            // Altrimenti, calcolare la trasparenza in base alla differenza
            const transparency = 1 - difference / 3;
            div.style.backgroundColor = `rgba(0, 123, 255, ${transparency})`;
            div.classList.remove('hidden');
        }
    });
}

function creaSfera() {
    // Genera dimensione casuale tra 10px e 30px
    const size = Math.random() * (30 - 10) + 10;
    const spazio = 20;
    const x = Math.random() * (window.innerWidth - size - spazio * 2) + spazio; // 40px = 20px per lato
    const y = Math.random() * (window.innerHeight - size - spazio * 2) + spazio;

    // Creare la sfera
    const sfera = document.createElement('div');
    sfera.classList.add('sfera');
    sfera.style.width = `${size}px`;
    sfera.style.height = `${size}px`;
    sfera.style.left = `${x}px`;
    sfera.style.top = `${y}px`;

    // Aggiungere la sfera al documento
    document.body.appendChild(sfera);
    setTimeout(() => sfera.remove(), 3000);
}
function distanzaPuntoLinea(x1, y1, x2, y2, cx, cy) {
    const numerator = Math.abs((y2 - y1) * cx - (x2 - x1) * cy + x2 * y1 - y2 * x1);
    const denominator = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
    return numerator / denominator;
}

// Funzione per contare le sfere sulla linea
function contaSfereSuLinea(x1, y1, x2, y2) {
    const allSfere = document.querySelectorAll('.sfera');
    let count = 0;

    allSfere.forEach((sfera) => {
        const rect = sfera.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const radius = rect.width / 2;

        // Calcola la distanza tra la sfera e la linea
        const distanza = distanzaPuntoLinea(x1, y1, x2, y2, centerX, centerY);

        if (distanza <= radius + lineaWidth / 2) {
            count++;
            sfera.remove();
        }
    });

    return count;
}
// Esegui la funzione creaSfera ogni 2 secondi
setInterval(creaSfera, 500);
setInterval(creaSfera, 2000);
setInterval(creaSfera, 5000);