const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const board = [];
const bgm = document.createElement("audio");
const breakSound = document.createElement("audio");
const drop = document.createElement("audio");
let rotatedShape;

bgm.setAttribute("src", "./assets/bgm.mp3");
bgm.muted = true;

breakSound.setAttribute("src", "./assets/break.mp3");
breakSound.muted = true;

drop.setAttribute("src", "./assets/drop.mp3");
drop.muted = true;

for (let row = 0; row < BOARD_HEIGHT; row++) {
  board[row] = [];
  for (let col = 0; col < BOARD_WIDTH; col++) {
    board[row][col] = 0;
  }
}

const tetrominoes = [
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#ffd800",
  },
  {
    shape: [
      [0, 2, 0],
      [2, 2, 2],
    ],
    color: "#7925DD",
  },
  {
    shape: [
      [0, 3, 3],
      [3, 3, 0],
    ],
    color: "orange",
  },
  {
    shape: [
      [4, 4, 0],
      [0, 4, 4],
    ],
    color: "red",
  },
  {
    shape: [
      [5, 0, 0],
      [5, 5, 5],
    ],
    color: "green",
  },
  {
    shape: [
      [0, 0, 6],
      [6, 6, 6],
    ],
    color: "#ff6400 ",
  },
  { shape: [[7, 7, 7, 7]], color: "#00b5ff" },
];

function randomTetromino() {
  const index = Math.floor(Math.random() * tetrominoes.length);
  const tetromino = tetrominoes[index];
  return {
    shape: tetromino.shape,
    color: tetromino.color,
    row: 0,
    col: Math.floor(Math.random() * (BOARD_WIDTH - tetromino.shape[0].length + 1)),
  };
}

let currentTetromino = randomTetromino();
let currentGhostTetromino;

function drawTetromino() {
  const shape = currentTetromino.shape;
  const color = currentTetromino.color;
  const row = currentTetromino.row;
  const col = currentTetromino.col;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const block = document.createElement("div");
        block.classList.add("block");
        block.style.backgroundColor = color;
        block.style.top = (row + r) * 24 + "px";
        block.style.left = (col + c) * 24 + "px";
        block.setAttribute("id", `block-${row + r}-${col + c}`);
        document.getElementById("game_board").appendChild(block);
      }
    }
  }
}

function eraseTetromino() {
  for (let i = 0; i < currentTetromino.shape.length; i++) {
    for (let j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] !== 0) {
        let row = currentTetromino.row + i;
        let col = currentTetromino.col + j;
        let block = document.getElementById(`block-${row}-${col}`);

        if (block) {
          document.getElementById("game_board").removeChild(block);
        }
      }
    }
  }
}

function canTetrominoMove(rowOffset, colOffset) {
  for (let i = 0; i < currentTetromino.shape.length; i++) {
    for (let j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] !== 0) {
        let row = currentTetromino.row + i + rowOffset;
        let col = currentTetromino.col + j + colOffset;

        if (row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH || (row >= 0 && board[row][col] !== 0)) {
          return false;
        }
      }
    }
  }
  return true;
}

function canTetrominoRotate() {
  for (let i = 0; i < rotatedShape.length; i++) {
    for (let j = 0; j < rotatedShape[i].length; j++) {
      if (rotatedShape[i][j] !== 0) {
        let row = currentTetromino.row + i;
        let col = currentTetromino.col + j;

        if (row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH || (row >= 0 && board[row][col] !== 0)) {
          return false;
        }
      }
    }
  }
  return true;
}

function lockTetromino() {
  for (let i = 0; i < currentTetromino.shape.length; i++) {
    for (let j = 0; j < currentTetromino.shape[i].length; j++) {
      if (currentTetromino.shape[i][j] !== 0) {
        let row = currentTetromino.row + i;
        let col = currentTetromino.col + j;
        board[row][col] = currentTetromino.color;
      }
    }
  }

  let rowsCleared = clearRows();
  if (rowsCleared > 0) {
  }

  currentTetromino = randomTetromino();
}

function clearRows() {
  let rowsCleared = 0;

  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    let rowFilled = true;

    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board[y][x] === 0) {
        rowFilled = false;
        break;
      }
    }

    if (rowFilled) {
      breakSound.muted = false;
      breakSound.play();
      rowsCleared++;

      for (let yy = y; yy > 0; yy--) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          board[yy][x] = board[yy - 1][x];
        }
      }

      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[0][x] = 0;
      }
      document.getElementById("game_board").innerHTML = "";
      for (let row = 0; row < BOARD_HEIGHT; row++) {
        for (let col = 0; col < BOARD_WIDTH; col++) {
          if (board[row][col]) {
            const block = document.createElement("div");
            block.classList.add("block");
            block.style.backgroundColor = board[row][col];
            block.style.top = row * 24 + "px";
            block.style.left = col * 24 + "px";
            block.setAttribute("id", `block-${row}-${col}`);
            document.getElementById("game_board").appendChild(block);
          }
        }
      }

      y++;
    }
  }

  return rowsCleared;
}

function rotateTetromino() {
  rotatedShape = [];
  for (let i = 0; i < currentTetromino.shape[0].length; i++) {
    let row = [];
    for (let j = currentTetromino.shape.length - 1; j >= 0; j--) {
      row.push(currentTetromino.shape[j][i]);
    }
    rotatedShape.push(row);
  }

  if (canTetrominoRotate()) {
    eraseTetromino();
    currentTetromino.shape = rotatedShape;
    drawTetromino();
  }

  moveGhostTetromino();
}

function moveTetromino(direction) {
  let row = currentTetromino.row;
  let col = currentTetromino.col;
  if (direction === "left") {
    if (canTetrominoMove(0, -1)) {
      eraseTetromino();
      col -= 1;
      currentTetromino.col = col;
      currentTetromino.row = row;
      drawTetromino();
    }
  } else if (direction === "right") {
    if (canTetrominoMove(0, 1)) {
      eraseTetromino();
      col += 1;

      currentTetromino.col = col;
      currentTetromino.row = row;
      drawTetromino();
    }
  } else {
    if (canTetrominoMove(1, 0)) {
      eraseTetromino();
      row++;
      currentTetromino.col = col;
      currentTetromino.row = row;
      drawTetromino();
    } else {
      lockTetromino();
    }
  }

  moveGhostTetromino();
}

drawTetromino();
setInterval(moveTetromino, 500);

document.addEventListener("keydown", handleKeyPress);

function handleKeyPress(event) {
  switch (event.keyCode) {
    case 37: 
      moveTetromino("left");
      break;
    case 39: 
      moveTetromino("right");
      break;
    case 40: 
      moveTetromino("down");
      break;
    case 38: 
      rotateTetromino();
      break;
    case 32: 
      dropTetromino();
      break;
    default:
      break;
  }
}

document.body.addEventListener("click", () => {
  bgm.play();
  bgm.muted = false;
  drop.muted = false;
});

function dropTetromino() {
  let row = currentTetromino.row;
  let col = currentTetromino.col;

  drop.muted = false;
  drop.play();

  while (canTetrominoMove(1, 0)) {
    eraseTetromino();
    row++;
    currentTetromino.col = col;
    currentTetromino.row = row;
    drawTetromino();
  }
  lockTetromino();
}

function drawGhostTetromino() {
  const shape = currentGhostTetromino.shape;
  const color = "rgba(255,255,255,0.5)";
  const row = currentGhostTetromino.row;
  const col = currentGhostTetromino.col;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const block = document.createElement("div");
        block.classList.add("ghost");
        block.style.backgroundColor = color;
        block.style.top = (row + r) * 24 + "px";
        block.style.left = (col + c) * 24 + "px";
        block.setAttribute("id", `ghost-${row + r}-${col + c}`);
        document.getElementById("game_board").appendChild(block);
      }
    }
  }
}

function eraseGhostTetromino() {
  const ghost = document.querySelectorAll(".ghost");
  for (let i = 0; i < ghost.length; i++) {
    ghost[i].remove();
  }
}

function canGhostTetrominoMove(rowOffset, colOffset) {
  for (let i = 0; i < currentGhostTetromino.shape.length; i++) {
    for (let j = 0; j < currentGhostTetromino.shape[i].length; j++) {
      if (currentGhostTetromino.shape[i][j] !== 0) {
        let row = currentGhostTetromino.row + i + rowOffset;
        let col = currentGhostTetromino.col + j + colOffset;

        if (row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH || (row >= 0 && board[row][col] !== 0)) {
          return false;
        }
      }
    }
  }
  return true;
}

function moveGhostTetromino() {
  eraseGhostTetromino();

  currentGhostTetromino = { ...currentTetromino };
  while (canGhostTetrominoMove(1, 0)) {
    currentGhostTetromino.row++;
  }

  drawGhostTetromino();
}