const board = Array(9).fill().map(() => Array(9).fill(null));
const notes = Array(9).fill().map(() =>
  Array(9).fill().map(() => new Set())
);

let selected = { r: null, c: null };
let noteMode = false;
let history = [];

function setValue(r, c, value) {
  history.push({
    r, c,
    prev: board[r][c],
    prevNotes: new Set(notes[r][c]),
  });

  board[r][c] = value;
  notes[r][c].clear();

  renderCell(r, c);
}

function toggleNote(r, c, value) {
  if (notes[r][c].has(value)) notes[r][c].delete(value);
  else notes[r][c].add(value);

  renderCell(r, c);
}

function undo() {
  const last = history.pop();
  if (!last) return;

  board[last.r][last.c] = last.prev;
  notes[last.r][last.c] = last.prevNotes;

  renderCell(last.r, last.c);
}
