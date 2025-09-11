// Selettori elementi
const calendarEl = document.getElementById("calendar");
const monthLabel = document.getElementById("monthLabel");
const weekList = document.getElementById("weekList");
const modal = document.getElementById("eventModal");
const modalDate = document.getElementById("modalDate");
const eventText = document.getElementById("eventText");
const eventSingle = document.getElementById("eventSingle");
const eventList = document.getElementById("eventList");
const saveEvent = document.getElementById("saveEvent");
const closeModal = document.getElementById("closeModal");

let currentDate = new Date();
let selectedDate = null;

// ===================== API =====================
async function getEvents(day, month) {
    try {
        const res = await fetch(`/.netlify/functions/events?day=${day}&month=${month}`);
        if (!res.ok) throw new Error("Errore fetch eventi");
        return await res.json();
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function getEventsMonth(month) {
    try {
        const res = await fetch(`/.netlify/functions/events?month=${month}`);
        if (!res.ok) throw new Error("Errore caricamento eventi mese");
        return await res.json(); // array di eventi {day, nome, ripetibile}
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function getWeekEvents() {
    try {
        const res = await fetch(`/.netlify/functions/events?week=true`);
        if (!res.ok) throw new Error("Errore fetch settimana");
        return await res.json();
    } catch (err) {
        console.error(err);
        return {};
    }
}

async function saveEventAPI(day, month, nome, ripetibile) {
    try {
        const res = await fetch(`/.netlify/functions/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ day, month, nome, ripetibile })
        });
        if (!res.ok) throw new Error("Errore salvataggio evento");
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}

async function deleteEventAPI(day, month, nome) {
    try {
        const res = await fetch(`/.netlify/functions/events`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ day, month, nome })
        });
        if (!res.ok) throw new Error("Errore eliminazione evento");
        return await res.json();
    } catch (err) {
        console.error(err);
    }
}


// ===================== Render Calendario =====================
async function renderCalendar() {
    calendarEl.innerHTML = "";
    const year = 2024; // anno bisestile
    const month = currentDate.getMonth(); // 0-11
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    monthLabel.textContent = firstDay.toLocaleDateString("it-IT", { month: "long", year: "numeric" });

    // 🔹 Chiamata unica al database per il mese
    const eventsMonth = await getEventsMonth(month + 1); // funzione nuova

    // giorni vuoti iniziali
    const startDay = firstDay.getDay() || 7;
    for (let i = 1; i < startDay; i++) {
        calendarEl.innerHTML += `<div class="day empty"></div>`;
    }

    // giorni mese
    for (let d = 1; d <= lastDay.getDate(); d++) {
        const date = new Date(year, month, d);
        const dayEl = document.createElement("div");
        dayEl.className = "day";
        if (isToday(date)) dayEl.classList.add("today");

        // 🔹 Filtra gli eventi per questo giorno
        const eventsDay = eventsMonth.filter(e => parseInt(e.day) === d);
        if (eventsDay.length) dayEl.classList.add("has-event");

        dayEl.innerHTML = `<strong>${d}</strong>`;
        dayEl.onclick = () => openModal(date, eventsDay); // passiamo gli eventi già filtrati
        calendarEl.appendChild(dayEl);
    }

    renderWeek(eventsMonth); // passa gli eventi del mese se serve
}


function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth();
}

// ===================== Settimana =====================
async function renderWeek() {
    weekList.innerHTML = "";
    const eventsWeek = await getWeekEvents();
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const key = `${date.getDate()}-${date.getMonth() + 1}`;
        const li = document.createElement("li");
        const label = date.toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "numeric" });
        li.textContent = `${label}: ${eventsWeek[key] ? eventsWeek[key].map(e => e.nome).join(", ") : "—"}`;
        weekList.appendChild(li);
    }
}

// ===================== Modal =====================
function openModal(date, eventsDay = []) {
    selectedDate = date;
    modal.classList.remove("hidden");
    modalDate.textContent = date.toLocaleDateString("it-IT");
    eventText.value = "";
    eventSingle.checked = false;

    // ✅ Usa gli eventi già passati invece di fare un'altra query
    renderEventList(eventsDay);
}


function renderEventList(eventsDay) {
    eventList.innerHTML = "";

    eventsDay.forEach((e, index) => {
        const li = document.createElement("li");
        li.textContent = `${e.nome} ${e.ripetibile ? "" : "(singolo)"}`;

        // Pulsante elimina
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.onclick = async () => {
            await deleteEventAPI(selectedDate.getDate(), selectedDate.getMonth() + 1, e.nome);
            closeModalFn();
            renderCalendar();
        };

        li.appendChild(deleteBtn);
        eventList.appendChild(li);
    });
}



saveEvent.onclick = async () => {
    if (!selectedDate) return;
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    await saveEventAPI(day, month, eventText.value, !eventSingle.checked);
    closeModalFn();
    renderCalendar();
};

closeModal.onclick = closeModalFn;
function closeModalFn() {
    modal.classList.add("hidden");
}

// ===================== Navigazione mese =====================
document.getElementById("prevMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
};
document.getElementById("nextMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
};

// ===================== Init =====================
renderCalendar();
