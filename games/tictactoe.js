// Initialize empty board UI
function initializeBoard() {
  const boardEl = document.getElementById("board");
  boardEl.innerHTML = "";

  // Create 9 cells (3x3 grid)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;

      cell.addEventListener("click", () => handleCellClick(row, col));

      boardEl.appendChild(cell);
    }
  }
}

// Render board state
function renderBoard(board) {
  const cells = document.querySelectorAll(".cell");
  const isMyTurn = currentTurn === playerSymbol;

  let index = 0;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const cell = cells[index];
      const value = board[row][col];

      cell.textContent = value || "";

      // Disable cells that are filled OR if it's not player's turn
      if (value || !isMyTurn) {
        cell.classList.add("disabled");
      } else {
        cell.classList.remove("disabled");
      }

      index++;
    }
  }
}

// Handle cell click
function handleCellClick(row, col) {
  if (!gameActive) return;
  if (currentTurn !== playerSymbol) return;

  // Send move to server
  socket.emit("make_move", { row, col });
}
