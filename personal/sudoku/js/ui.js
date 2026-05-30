const boardEl = document.getElementById("board");

function createBoard() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;

      const notesDiv = document.createElement("div");
      notesDiv.className = "notes";

      for (let n = 1; n <= 9; n++) {
        const span = document.createElement("span");
        span.textContent = n;
        notesDiv.appendChild(span);
      }

      const valueDiv = document.createElement("div");
      valueDiv.className = "value";

      cell.appendChild(notesDiv);
      cell.appendChild(valueDiv);
      boardEl.appendChild(cell);
    }
  }
}

function getCell(r, c) {
  return document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
}

function renderCell(r, c) {
  const cell = getCell(r, c);
  const valueDiv = cell.querySelector(".value");
  const spans = cell.querySelectorAll(".notes span");

  const value = board[r][c];

  if (value) {
    valueDiv.textContent = value;
    cell.classList.add("filled");
  } else {
    valueDiv.textContent = "";
    cell.classList.remove("filled");
  }

  spans.forEach((s, i) => {
    s.style.visibility = notes[r][c].has(i + 1) ? "visible" : "hidden";
  });

  cell.classList.toggle("error", hasConflict(r, c, value));
}

function highlight(r, c) {
  const value = board[r][c];

  document.querySelectorAll(".cell").forEach(cell => {
    cell.classList.remove("selected","highlight-row","highlight-col","highlight-block","highlight-same");

    const rr = +cell.dataset.row;
    const cc = +cell.dataset.col;

    if (rr === r && cc === c) cell.classList.add("selected");
    if (rr === r) cell.classList.add("highlight-row");
    if (cc === c) cell.classList.add("highlight-col");
    if (Math.floor(rr/3) === Math.floor(r/3) &&
        Math.floor(cc/3) === Math.floor(c/3))
      cell.classList.add("highlight-block");

    if (value && board[rr][cc] === value)
      cell.classList.add("highlight-same");
  });
}
