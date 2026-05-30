boardEl.addEventListener("click", e => {
    const cell = e.target.closest(".cell");
    if (!cell) return;

    selected.r = +cell.dataset.row;
    selected.c = +cell.dataset.col;

    highlight(selected.r, selected.c);
});

document.addEventListener("keydown", e => {
    if (selected.r == null) return;

    if (e.key >= "1" && e.key <= "9") {
        const n = +e.key;
        if (noteMode) toggleNote(selected.r, selected.c, n);
        else setValue(selected.r, selected.c, n);
    }

    if (e.key === "Backspace" || e.key === "Delete" || e.key === "c") {
        setValue(selected.r, selected.c, null);
    }

    if (e.key === "z") undo();
    if (e.key === "a") {
        noteMode = !noteMode;
        document.getElementById("noteToggle").textContent = `Annotazioni: ${noteMode ? "ON" : "OFF"}`;
    }
});

// mobile numpad
document.querySelectorAll("#numpad button").forEach(btn => {
    btn.addEventListener("click", () => {
        if (selected.r == null) return;

        const n = btn.dataset.num;

        if (n === "clear") setValue(selected.r, selected.c, null);
        else {
            const val = +n;
            if (noteMode) toggleNote(selected.r, selected.c, val);
            else setValue(selected.r, selected.c, val);
        }
    });
});

// note toggle
document.getElementById("noteToggle").onclick = () => {
    noteMode = !noteMode;
    noteToggle.textContent = `Annotazioni: ${noteMode ? "ON" : "OFF"}`;
};

// undo button
document.getElementById("undoBtn").onclick = undo;
