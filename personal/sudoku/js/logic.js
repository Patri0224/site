function hasConflict(r, c, value) {
  if (!value) return false;

  for (let i = 0; i < 9; i++) {
    if (board[r][i] === value && i !== c) return true;
    if (board[i][c] === value && i !== r) return true;
  }

  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;

  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (board[br + i][bc + j] === value && !(br + i === r && bc + j === c))
        return true;

  return false;
}
