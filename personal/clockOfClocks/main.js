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
const app = document.getElementById("app");
const miniClocks = [];
const slowSpeed = 48;   // 36 gradi/sec = 360 gradi in 10 sec
const fastSpeed = 480;
let modTime = 0;
let O = 0;
let M = 0;
let S = 0;
let SecondiAttivi = true;
function getNow() {
    return new Date(Date.now() + modTime * 1000);
}

function getTimeDigits() {
    const now = getNow();
    const future = new Date(now.getTime() + 5 * 1000);
    const base = [
        ...String(now.getHours()).padStart(2, "0"),
        ...String(future.getMinutes() % 60).padStart(2, "0"),
    ];

    if (SecondiAttivi) {
        base.push(...String(now.getSeconds()).padStart(2, "0"));
    }

    return base.map(Number);
}

function normalizeClockwise(next, prev) {
    let delta = (next - prev) % 360;
    if (delta < 0) delta += 360;
    return prev + delta;
}

// stesso: 1 minuto per andare al target

function createClock(h, m) {
    const now = getNow();
    const s = now.getSeconds() * 6 - 90 + 1;
    if (h === E.h && m === E.m) {
        // Per la "E", inizializza le lancette in base all'ora attuale
        h = ((now.getHours() % 12) + now.getMinutes() / 60) * 30 - 90;
        m = now.getMinutes() * 6 + now.getSeconds() * 0.1 - 90;
    }

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

    const second = document.createElement("div");
    second.className = "second";
    second.style.width = "12px";
    second.style.height = "1px";
    second.style.opacity = "0";
    second.style.transition = "transform ease";
    second.style.transform = `rotate(${s}deg)`;
    div.appendChild(hour);
    div.appendChild(minute);
    div.appendChild(second);

    miniClocks.push({
        hour, minute, second,
        currentH: h, currentM: m, currentS: s,
        targetH: h, targetM: m, targetS: s,
        ifSecond: false
    });

    return div;
}

function createDigit(digit, index) {
    const container = document.createElement("div");
    container.className = "digit";
    container.id = "digit" + index;
    digits[digit].forEach(({ h, m }) => {
        container.appendChild(createClock(h, m));
    });

    // Aggiungi ":" tra coppie (dopo 2 e 4 cifre)
    if (index === 2 || index === 4) {
        const sep = document.createElement("div");
        sep.className = "separator";
        sep.id = "s" + index;
        sep.textContent = "";
        app.appendChild(sep);
    }

    app.appendChild(container);


}


// inizializzazione
getTimeDigits().forEach((d, i) => createDigit(d, i));

function setTargets() {
    const digitsNow = getTimeDigits();
    const now = getNow();
    let idx = 0;

    for (const d of digitsNow) {
        digits[d].forEach(({ h, m }) => {
            const mc = miniClocks[idx];
            mc.ifSecond = false;
            // Se il clock è parte della "E" (le ultime 4x24 celle)
            let hTarget = h;
            let mTarget = m;
            let sTarget = now.getSeconds() * 6 - 90 + 1;
            sTarget = (sTarget + 360) % 360;
            const isTargetE = (h % 360) === E.h && (m % 360) === E.m;
            if (isTargetE) {
                mc.hour.classList.remove("active");
                mc.minute.classList.remove("active");
                // usa l'ora reale come target
                mc.ifSecond = true;
                hTarget = ((now.getHours() % 12) + now.getMinutes() / 60) * 30 - 90;
                mTarget = now.getMinutes() * 6 + now.getSeconds() * 0.1 - 90;

                hTarget = (hTarget + 360) % 360;
                mTarget = (mTarget + 360) % 360;

            } else if (!mc.hour.classList.contains("active")) {

                mc.hour.classList.add("active");
                mc.minute.classList.add("active");
            }


            // --- Normalizza movimento clockwise rispetto alla posizione corrente
            mc.targetH = normalizeClockwise(hTarget, mc.currentH);
            mc.targetM = normalizeClockwise(mTarget, mc.currentM);
            mc.targetS = normalizeClockwise(sTarget, mc.currentS);

            idx++;
        });
    }
}

function animateClocks(timestamp) {
    if (!animateClocks.last) animateClocks.last = timestamp;
    let dt = (timestamp - animateClocks.last) / 1000;
    animateClocks.last = timestamp;
    if (dt > 0.1) dt = 0.1;

    miniClocks.forEach((mc, i) => {
        const bool = i > 24 * 4;
        if (!SecondiAttivi && i > 24 * 4) return;
        let targetSpeed = bool ? fastSpeed : slowSpeed;

        if (mc.currentSpeed === undefined) mc.currentSpeed = targetSpeed;
        const smoothFactor = 1;
        mc.currentSpeed += (targetSpeed - mc.currentSpeed) * dt * smoothFactor;

        const speed = mc.currentSpeed;
        let op = true;
        // Rotazioni con raggiungimento progressivo dei target
        if (Math.abs(mc.targetH - mc.currentH) > 0.1) {
            op = false;
            mc.currentH += speed * dt;
            if (mc.currentH > mc.targetH) mc.currentH = mc.targetH;
        } else {
            mc.currentH %= 360;
            mc.targetH %= 360;
        }
        mc.hour.style.transform = `rotate(${mc.currentH}deg)`;

        if (Math.abs(mc.targetM - mc.currentM) > 0.1) {
            op = false;
            mc.currentM += speed * dt * (bool ? 1.7 : 1.1);
            if (mc.currentM > mc.targetM) mc.currentM = mc.targetM;
        } else {
            mc.currentM = mc.currentM % 360;
            mc.targetM %= 360;
        }
        mc.minute.style.transform = `rotate(${mc.currentM}deg)`;
        if (op && mc.ifSecond)
            mc.second.style.opacity = "1";
        else
            mc.second.style.opacity = "0";
        mc.currentS = mc.targetS;
        mc.second.style.transform = `rotate(${mc.currentS}deg)`;

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
            clock.style.width = '99%';
            clock.style.height = '99%';

            const hour = clock.querySelector('.hour');
            const minute = clock.querySelector('.minute');
            const second = clock.querySelector('.second');

            // Scala le lancette proporzionalmente alla cifra
            hour.style.width = `${digitSize * 0.09}px`;
            hour.style.height = `${digitSize * 0.012}px`;
            hour.style.top = "50%";
            hour.style.left = "50%";
            hour.style.transformOrigin = "0% 50%";
            hour.style.transition = "background-color 0.8s ease-in-out;"

            minute.style.width = `${digitSize * 0.12}px`;
            minute.style.height = `${digitSize * 0.012}px`;
            minute.style.top = "50%";
            minute.style.left = "50%";
            minute.style.transformOrigin = "0% 50%"; // leggermente più spessa
            minute.style.transition = "background-color 0.8s ease-in-out;"

            second.style.width = `${digitSize * 0.10}px`;
            second.style.height = `${digitSize * 0.008}px`;
            second.style.top = "50%";
            second.style.left = "50%";
            second.style.transformOrigin = "0% 50%";
            second.style.opacity = "0";
            second.style.transition = "opacity 0.7s ease-out";

        });
    });
}
function addHourTicks(clockEl) {
    for (let i = 0; i < 12; i++) {
        const tick = document.createElement("div");
        tick.className = "tick";
        if (i % 3 === 0) tick.classList.add("major");
        tick.style.transform = `rotate(${i * 30}deg)`;
        clockEl.appendChild(tick);
    }
}
let piuMeno = 1;
function changePiuMeno() {
    if (piuMeno == 1) {
        piuMeno = -1;
        document.getElementById("piumeno").innerHTML = "-";
    }
    else {
        piuMeno = 1;
        document.getElementById("piumeno").innerHTML = "+";
    }
}
function reset() {
    modTime = 0;
    O = 0;
    M = 0;
    S = 0;
    updateModTime();
}
function modOra() {
    O = (O + piuMeno) % 24;
    updateModTime();
}
function modMinuto() {
    M = (M + piuMeno) % 60;
    updateModTime();
}
function modSecondo() {
    S = (S + piuMeno) % 60;
    updateModTime();
}

function updateModTime() {
    // Calcolo del tempo modificato totale in secondi
    modTime = O * 3600 + M * 60 + S;

    // Formatto la stringa in due cifre, mantenendo il segno se negativo
    const fmt = n => (n < 0 ? "-" + String(Math.abs(n)).padStart(2, "0") : String(n).padStart(2, "0"));
    document.getElementById("totChange").innerHTML = `${fmt(O)}:${fmt(M)}:${fmt(S)}`;
}
function changeSecondi() {
    if (SecondiAttivi) {
        //disattiva
        SecondiAttivi = false;
        document.getElementById("digit4").style.display = "none";
        document.getElementById("digit5").style.display = "none";
        document.getElementById("s4").style.display = "none";
    } else {
        //attiva
        SecondiAttivi = true;
        document.getElementById("digit4").style.display = "grid";
        document.getElementById("digit5").style.display = "grid";
        document.getElementById("s4").style.display = "block";
    }
    setTargets();
}

document.querySelectorAll('.clock').forEach(addHourTicks);

// Applica subito e ogni volta che cambia la dimensione
resizeDigits();
window.addEventListener('resize', resizeDigits);

// Aggiorna target ogni secondo
setInterval(setTargets, 1000);

// Avvia animazione
requestAnimationFrame(animateClocks);