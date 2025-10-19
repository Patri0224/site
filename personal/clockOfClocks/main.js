const H = { h: 0, m: 180 },
    V = { h: 270, m: 90 },
    TL = { h: 180, m: 270 },
    TR = { h: 0, m: 270 },
    BL = { h: 180, m: 90 },
    BR = { h: 0, m: 90 },
    E = { h: 135, m: 135 };

const digits = [
    [
        BR, H, H, BL,
        V, BR, BL, V,
        V, V, V, V,
        V, V, V, V,
        V, TR, TL, V,
        TR, H, H, TL,
    ],
    [
        BR, H, BL, E,
        TR, BL, V, E,
        E, V, V, E,
        E, V, V, E,
        BR, TL, TR, BL,
        TR, H, H, TL,
    ],
    [
        BR, H, H, BL,
        TR, H, BL, V,
        BR, H, TL, V,
        V, BR, H, TL,
        V, TR, H, BL,
        TR, H, H, TL,
    ],
    [
        BR, H, H, BL,
        TR, H, BL, V,
        E, BR, TL, V,
        E, TR, BL, V,
        BR, H, TL, V,
        TR, H, H, TL,
    ],
    [
        BR, BL, BR, BL,
        V, V, V, V,
        V, TR, TL, V,
        TR, H, BL, V,
        E, E, V, V,
        E, E, TR, TL,
    ],
    [
        BR, H, H, BL,
        V, BR, H, TL,
        V, TR, H, BL,
        TR, H, BL, V,
        BR, H, TL, V,
        TR, H, H, TL,
    ],
    [
        BR, H, H, BL,
        V, BR, H, TL,
        V, TR, H, BL,
        V, BR, BL, V,
        V, TR, TL, V,
        TR, H, H, TL,
    ],
    [
        BR, H, H, BL,
        TR, H, BL, V,
        E, E, V, V,
        E, E, V, V,
        E, E, V, V,
        E, E, TR, TL,
    ],
    [
        BR, H, H, BL,
        V, BR, BL, V,
        V, TR, TL, V,
        V, BR, BL, V,
        V, TR, TL, V,
        TR, H, H, TL,
    ],
    [
        BR, H, H, BL,
        V, BR, BL, V,
        V, TR, TL, V,
        TR, H, BL, V,
        BR, H, TL, V,
        TR, H, H, TL,
    ],
];


function getTimeDigits() {
    const now = new Date();
    // solo ore e minuti
    return [
        ...String(now.getHours()).padStart(2, "0"),
        ...String(now.getMinutes()).padStart(2, "0"),
        ...String(now.getSeconds()).padStart(2, "0")
    ].map(Number);
}

function normalizeClockwise(next, prev) {
    let delta = (next - prev) % 360;
    if (delta < 0) delta += 360;
    return prev + delta;
}

const app = document.getElementById("app");
const miniClocks = [];
const slowSpeed = 12;   // 12 gradi/sec = 360 gradi in 30 sec
const fastSpeed = 480;       // stesso: 1 minuto per andare al target

function createClock(h, m) {
    const div = document.createElement("div");
    div.className = "clock";

    const hour = document.createElement("div");
    hour.className = "hour";
    hour.style.width = "8px";
    hour.style.height = "1px";
    hour.style.transition = "transform ease";
    hour.style.transform = `rotate(${h}deg)`;

    const minute = document.createElement("div");
    minute.className = "minute";
    minute.style.width = "10px";
    minute.style.height = "1px";
    minute.style.transition = "transform ease";
    minute.style.transform = `rotate(${m}deg)`;

    div.appendChild(hour);
    div.appendChild(minute);

    miniClocks.push({
        hour, minute,
        currentH: h, currentM: m,
        targetH: h, targetM: m
    });

    return div;
}

function createDigit(digit, index) {
    const container = document.createElement("div");
    container.className = "digit";
    digits[digit].forEach(({ h, m }) => {
        container.appendChild(createClock(h, m));
    });
    app.appendChild(container);

    // Aggiungi ":" tra coppie (dopo 2 e 4 cifre)
    if (index === 1 || index === 3) {
        const sep = document.createElement("div");
        sep.className = "separator";
        sep.textContent = "";
        app.appendChild(sep);
    }

}


// inizializzazione
getTimeDigits().forEach((d, i) => createDigit(d, i));

function setTargets() {
    const digitsNow = getTimeDigits();
    let idx = 0;
    for (const d of digitsNow) {
        digits[d].forEach(({ h, m }) => {
            const mc = miniClocks[idx];
            mc.targetH = normalizeClockwise(h, mc.currentH);
            mc.targetM = normalizeClockwise(m, mc.currentM);
            idx++;
        });
    }
}

function animateClocks(timestamp) {
    if (!animateClocks.last) animateClocks.last = timestamp;
    let dt = (timestamp - animateClocks.last) / 1000;
    animateClocks.last = timestamp;
    if (dt > 0.1) dt = 0.1;
    let i = 0;
    miniClocks.forEach(mc => {
        const hTarget = mc.targetH;
        const mTarget = mc.targetM;

        // --- Calcolo velocità target (stessa logica di prima)
        let targetSpeed = slowSpeed;
        if (i > 24 * 4) targetSpeed = fastSpeed;

        const isTargetE = (hTarget % 360) === E.h && (mTarget % 360) === E.m;
        if (i > 24 * 4 && isTargetE) targetSpeed /= 6;
        i++;

        // --- Aggiungiamo velocità effettiva graduale
        if (mc.currentSpeed === undefined) mc.currentSpeed = targetSpeed; // inizializza
        const smoothFactor = 1; // più alto = più reattivo (2-5 ideale)
        mc.currentSpeed += (targetSpeed - mc.currentSpeed) * dt * smoothFactor;

        const speed = mc.currentSpeed; // usa la velocità smussata

        // --- Rotazioni (logica invariata)
        if (isTargetE) {
            mc.currentH += speed * dt;
        } else if (Math.abs(hTarget - mc.currentH) > 0.1) {
            mc.currentH += speed * dt;
            if (mc.currentH > hTarget) mc.currentH = hTarget;
        }
        mc.hour.style.transform = `rotate(${mc.currentH}deg)`;

        if (isTargetE) {
            mc.currentM += speed * dt * 1.7;
        } else if (Math.abs(mTarget - mc.currentM) > 0.1) {
            mc.currentM += speed * dt;
            if (mc.currentM > mTarget) mc.currentM = mTarget;
        }
        mc.minute.style.transform = `rotate(${mc.currentM}deg)`;
    });

    requestAnimationFrame(animateClocks);
}

function resizeDigits() {
    const appWidth = window.innerWidth;
    const digits = document.querySelectorAll('.digit');

    digits.forEach(d => {
        const digitSize = appWidth * 0.14; // 14% dello schermo
        d.style.width = `${digitSize}px`;
        d.style.gap = `${appWidth * 0.001}px`;

        const clocks = d.querySelectorAll('.clock');
        clocks.forEach(clock => {
            clock.style.width = '100%';
            clock.style.height = '100%';

            const hour = clock.querySelector('.hour');
            const minute = clock.querySelector('.minute');

            // Scala le lancette proporzionalmente alla cifra
            hour.style.width = `${digitSize * 0.09}px`;
            hour.style.height = `${digitSize * 0.012}px`;
            hour.style.top = "50%";
            hour.style.left = "50%";
            hour.style.transformOrigin = "0% 50%";

            minute.style.width = `${digitSize * 0.12}px`;
            minute.style.height = `${digitSize * 0.012}px`;
            minute.style.top = "50%";
            minute.style.left = "50%";
            minute.style.transformOrigin = "0% 50%"; // leggermente più spessa
        });
    });
}

// Applica subito e ogni volta che cambia la dimensione
resizeDigits();
window.addEventListener('resize', resizeDigits);

// Aggiorna target ogni secondo
setInterval(setTargets, 1000);

// Avvia animazione
requestAnimationFrame(animateClocks);