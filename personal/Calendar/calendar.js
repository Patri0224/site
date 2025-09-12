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
const dayModal = document.getElementById("dayModal");
const dayModalDate = document.getElementById("dayModalDate");
const dayEventList = document.getElementById("dayEventList");
const addNewEvent = document.getElementById("addNewEvent");
const closeDayModal = document.getElementById("closeDayModal");
const searchModal = document.getElementById("searchModal");
const openSearch = document.getElementById("openSearch");
const closeSearch = document.getElementById("closeSearch");
const doSearch = document.getElementById("doSearch");
const searchText = document.getElementById("searchText");
const includeRecurring = document.getElementById("includeRecurring");
const searchResults = document.getElementById("searchResults");

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

async function saveEventAPI(day, month, nome, ripetibile, oraInizio = "00:00:00", oraFine = "00:00:00") {
    try {
        const res = await fetch(`/.netlify/functions/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ day, month, nome, ripetibile, oraInizio, oraFine })
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
async function searchEventsApi(search, includeRecurring) {
    try {
        const res = await fetch(`/.netlify/functions/events?search=${encodeURIComponent(search)}&recurring=${includeRecurring}`);
        if (!res.ok) throw new Error("Errore ricerca eventi");
        return await res.json(); // array di eventi trovati
    } catch (err) {
        console.error(err);
        return [];
    }
}

// ===================== Funzioni UI =====================
// Funzione per caricare e renderizzare il calendario
// Ottiene gli eventi per il mese corrente
// Ottiene gli eventi per la settimana corrente
// Mostra i dettagli del giorno selezionato
// Apre/chiude modali
// Gestisce la ricerca

// ===================== Render Calendario =====================
async function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-11
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    monthLabel.textContent = firstDay.toLocaleDateString("it-IT", { month: "long", year: "numeric" });

    // Chiamata unica al database per il mese
    const eventsMonth = await getEventsMonth(month + 1); // funzione nuova

    const giorniSettimana = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

    // Pulisci il calendario
    calendarEl.innerHTML = "";

    // Aggiungi header giorni della settimana
    giorniSettimana.forEach(giorno => {
        const dayHeader = document.createElement("div");
        dayHeader.className = "day-header";
        dayHeader.textContent = giorno;
        calendarEl.appendChild(dayHeader);
    });

    // giorni vuoti iniziali
    const startDay = firstDay.getDay() || 7; // domenica = 7
    for (let i = 1; i < startDay; i++) {
        const emptyEl = document.createElement("div");
        emptyEl.className = "day empty";
        calendarEl.appendChild(emptyEl);
    }

    // giorni mese
    // giorni mese
    for (let d = 1; d <= lastDay.getDate(); d++) {
        const date = new Date(year, month, d);
        const dayEl = document.createElement("div");
        dayEl.className = "day";
        if (isToday(date)) dayEl.classList.add("today");

        // 🔹 Filtra gli eventi per questo giorno
        const eventsDay = eventsMonth.filter(e => parseInt(e.day) === d);
        if (eventsDay.length) dayEl.classList.add("has-event");

        // Numero del giorno
        dayEl.innerHTML = `<strong>${d}</strong>`;

        // Lista eventi come badge
        if (eventsDay.length) {
            const eventsContainer = document.createElement("div");
            eventsContainer.className = "events-in-day";

            eventsDay.forEach(e => {
                const span = document.createElement("span");
                span.textContent = e.nome;
                // aggiungi la classe in base al tipo
                span.classList.add(e.ripetibile ? "recurring" : "single");
                eventsContainer.appendChild(span);
            });

            dayEl.appendChild(eventsContainer);
        }


        dayEl.onclick = () => {
            const eventsDay = eventsMonth.filter(ev => parseInt(ev.day) === d);
            openDayModal(date, eventsDay); // mostra eventi con ora_inizio/fine e posizione
        };
        // passiamo gli eventi già filtrati
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
    const eventsWeek = await getWeekEvents();
    weekList.innerHTML = "";
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const key = `${date.getDate()}-${date.getMonth() + 1}`;
        const li = document.createElement("li");
        const label = date.toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "numeric" });

        if (eventsWeek[key] && eventsWeek[key].length > 0) {
            li.innerHTML = `${label}: `;
            eventsWeek[key].forEach((e, idx) => {
                const span = document.createElement("span");
                span.textContent = e.nome;
                span.style.fontWeight = "bold";
                // Colore diverso se ripetibile o singolo
                span.style.color = e.ripetibile ? "#2563eb" : "#f97316"; // blu vs arancione
                li.appendChild(span);
                if (idx < eventsWeek[key].length - 1) {
                    li.appendChild(document.createTextNode(", "));
                }
            });
        } else {
            li.textContent = `${label}: —`;
        }

        weekList.appendChild(li);
    }
}

// ===================== Modal giorno =====================
function openDayModal(date, eventsDay = []) {
    selectedDate = date;
    dayModal.classList.remove("hidden");
    dayModalDate.textContent = date.toLocaleDateString("it-IT");

    dayEventList.innerHTML = "";

    eventsDay.forEach((e, index) => {
        const li = document.createElement("li");
        const ora_inizio = e.ora_inizio ? e.ora_inizio.slice(0, 5) : "00:00";
        const ora_fine = e.ora_fine ? e.ora_fine.slice(0, 5) : "00:00";
        li.textContent = `${index + 1}. ${e.nome} [${ora_inizio} - ${ora_fine}] ${e.ripetibile ? "(ricorrente)" : "(singolo)"}`;

        // Pulsante elimina
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = async () => {
            await deleteEventAPI(selectedDate.getDate(), selectedDate.getMonth() + 1, e.nome);
            openDayModal(selectedDate, eventsDay.filter(ev => ev !== e));
            renderCalendar();
        };

        li.appendChild(deleteBtn);
        dayEventList.appendChild(li);
    });
}

// chiudi modal giorno
closeDayModal.onclick = () => dayModal.classList.add("hidden");

// apri modal aggiungi evento dal dettaglio giorno
addNewEvent.onclick = () => {
    dayModal.classList.add("hidden");
    openModal(selectedDate);
};

// chiusura cliccando all’esterno
dayModal.addEventListener("click", (e) => {
    if (e.target === dayModal) dayModal.classList.add("hidden");
});

// ===================== Modal =====================
function openModal(date) {
    selectedDate = date;
    modal.classList.remove("hidden");
    modalDate.textContent = date.toLocaleDateString("it-IT");
    eventText.value = "";
    eventStart.value = "00:00:00";
    eventEnd.value = "00:00:00";
    eventSingle.checked = false;

}

saveEvent.onclick = async () => {
    if (!selectedDate) return;
    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;

    const ora_inizio = document.getElementById("eventStart")?.value || "00:00:00";
    const ora_fine = document.getElementById("eventEnd")?.value || "00:00:00";
    await saveEventAPI(day, month, eventText.value, !eventSingle.checked, ora_inizio, ora_fine);
    closeModalFn();
    const eventsMonth = await getEventsMonth(month); // prendi gli eventi aggiornati del mese
    const eventsDay = eventsMonth.filter(ev => parseInt(ev.day) === day);
    openDayModal(selectedDate, eventsDay);
    renderCalendar();
};

closeModal.onclick = closeModalFn;
function closeModalFn() {
    modal.classList.add("hidden");
    dayModal.classList.remove("hidden");
}

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModalFn();
        dayModal.classList.add("hidden");
    }
});
// ===================== Modal ricerca =====================
openSearch.onclick = () => searchModal.classList.remove("hidden");
closeSearch.onclick = () => searchModal.classList.add("hidden");

// Esegui ricerca
doSearch.onclick = async () => {
    const query = searchText.value.trim();
    const recurring = includeRecurring.checked;

    if (!query) return;

    // 🔹 chiamata alla funzione serverless (da implementare lato backend)

    const events = await searchEventsApi(query, recurring);
    searchResults.innerHTML = "";
    if (events.length === 0) {
        searchResults.innerHTML = "<li>Nessun risultato</li>";
    } else {
        events.forEach(e => {
            const li = document.createElement("li");
            li.textContent = `${e.nome} (${new Date(e.data).toLocaleDateString("it-IT")}) ${e.ora_inizio.slice(0, 5)}-${e.ora_fine.slice(0, 5)} ${e.ripetibile ? "(ricorrente)" : "(singolo)"}`;
            searchResults.appendChild(li);
        });
    }
};
// Permetti ricerca anche con Enter
searchText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault(); // evita il submit del form o refresh pagina
        doSearch.click();   // simula il click del bottone "Cerca"
    }
});
// Chiudi se clicco fuori dal contenuto del modal
searchModal.addEventListener("click", (e) => {
    if (e.target === searchModal) {
        searchModal.classList.add("hidden");
    }
});

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
