/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // make an array of HEIGHT and then map over it making arrays at each index of WIDTH
  for(let i = 0; i < HEIGHT; i++) {
    let row = [];
    for(let j = 0; j < WIDTH; j++) {
      row.push(null);
    }
    board.push(row);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  let htmlBoard = document.getElementById('board');

  // creating the top row that allows players to select where to drop their piece via a click event listener
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // make each box as a td in the tr and give them an id to represent where they lie on the x axis
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  // add the element to the board
  htmlBoard.append(top);

  // making the board in html
  // outer for loop 
  for (var y = 0; y < HEIGHT; y++) {
    // create the row element
    const row = document.createElement("tr");
    // inner for loop; making each cell and adding them to the row
    for (var x = 0; x < WIDTH; x++) {
      // create the cell as a td
      const cell = document.createElement("td");
      // give the cell an id prop for finding it later via its y-x coords
      cell.setAttribute("id", `${y}-${x}`);
      // add cell to the row
      row.append(cell);
    }
    // add row to the board
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // starting from the bottom, check each spot in the provided column to see if it's empty
  // return the first empty row, or null if there's no empty rows
  for(let i = HEIGHT-1; i >= 0; i--) {
    if(board[i][x] == null)
      return i;
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  let piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`player${currPlayer}`);
  document.getElementById(`${y}-${x}`).appendChild(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  var x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check if it's a tie by going over each cell to see if they have a value that isn't null
  if (board.every(row => row.every(val => val)))
    return endGame("Tie!")

  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // iterates over each cell via two four loops
  // outer for loop
  for (var y = 0; y < HEIGHT; y++) {
    // inner for loop
    for (var x = 0; x < WIDTH; x++) {
      // makes an array of coordinates for each win condition
      // horizontal array consisting of the base cell and the 3 cells to its right
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      // vertical array consisting of the base cell and the 3 cells below
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      // diagonal arrays consisting of the base cell and the 3 cells below and to the right and left, respectively
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // passes these values into the _win function, which checks if they're all:
      // A: valid cells to begin with
      // B: cells of the same player (player 1 or player 2)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
