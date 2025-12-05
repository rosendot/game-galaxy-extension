const SERVER_URL = "https://game-galaxy-server-mljd.onrender.com";

let socket = null;
let playerSymbol = null;
let currentTurn = null;
let gameActive = false;

// UI Elements
const menu = document.getElementById("menu");
const gameContainer = document.getElementById("gameContainer");
const playBtn = document.getElementById("playBtn");
const backBtn = document.getElementById("backBtn");
const status = document.getElementById("status");
const playerSymbolEl = document.getElementById("playerSymbol");
const turnStatus = document.getElementById("turnStatus");

// Initialize
function init() {
  playBtn.addEventListener("click", findMatch);
  backBtn.addEventListener("click", backToMenu);
}

// Connect to server and find match
function findMatch() {
  status.textContent = "Connecting to server...";

  socket = io(SERVER_URL);

  socket.on("connect", () => {
    console.log("Connected to server");
    status.textContent = "Finding opponent...";
    socket.emit("find_match");
  });

  socket.on("waiting", (data) => {
    status.textContent = data.message;
  });

  socket.on("match_found", (data) => {
    console.log("Match found:", data);
    playerSymbol = data.symbol;
    currentTurn = "X";
    gameActive = true;

    // Switch to game view
    menu.classList.remove("visible");
    menu.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    gameContainer.classList.add("visible");

    // Update UI
    playerSymbolEl.textContent = `You are: ${playerSymbol}`;
    updateTurnStatus();

    // Initialize board
    initializeBoard();
  });

  socket.on("update_board", (data) => {
    console.log("Board update:", data);
    currentTurn = data.currentTurn;
    renderBoard(data.board);
    updateTurnStatus();
  });

  socket.on("game_over", (data) => {
    console.log("Game over:", data);
    gameActive = false;

    if (data.draw) {
      turnStatus.textContent = "Game Over: Draw!";
    } else {
      const isWinner = data.winnerSocketId === socket.id;
      turnStatus.textContent = isWinner ? "You Win!" : "You Lose!";
    }

    // Disable board
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => cell.classList.add("disabled"));
  });

  socket.on("opponent_disconnected", () => {
    gameActive = false;
    turnStatus.textContent = "Opponent disconnected";

    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => cell.classList.add("disabled"));
  });

  socket.on("error", (data) => {
    console.error("Error:", data.message);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });
}

// Update turn status text
function updateTurnStatus() {
  if (!gameActive) return;

  const isMyTurn = currentTurn === playerSymbol;
  turnStatus.textContent = isMyTurn ? "Your turn" : "Opponent's turn";
}

// Back to menu
function backToMenu() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  gameContainer.classList.remove("visible");
  gameContainer.classList.add("hidden");
  menu.classList.remove("hidden");
  menu.classList.add("visible");

  status.textContent = "Ready to play!";
  playerSymbol = null;
  currentTurn = null;
  gameActive = false;

  // Clear board
  const boardEl = document.getElementById("board");
  boardEl.innerHTML = "";
}

// Start when popup opens
init();
