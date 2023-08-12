const prompt = require('prompt-sync')({sigint: true});

const hatChar = '^';
const holeChar = 'O';
const fieldChar = '░';
const posChar = '*';


function getRandomInt(max) {
  // From 0 to `max`, inclusive
  return Math.floor(Math.random() * (max + 1));
}


class Field {
  constructor(field = null) {
    this.field = field ? field : Field.generateField();
  }
  
  print() {
    this.field.forEach((row) => {
      console.log(row.join(' '));
    });
  }

  static generateField(rows = 4, cols = 4) {
    const [hatX, hatY] = Field._generateHatPos(rows, cols);
    const field = [];
    for (let y = 0; y < rows; y++) {
      const row = [];
      for (let x = 0; x < cols; x++) {
        if (y === 0 && x === 0) {
          row.push(posChar);
        } else if (y === hatY && x === hatX) {
          row.push(hatChar);
        } else {
          const char = (Math.random() > 0.2) ? fieldChar : holeChar;
          row.push(char);
        }
      }
      field.push(row);
    }
    return field;
  }

  static _generateHatPos(rows, cols) {
    let x = 0;
    let y = 0;
    while (x === 0 && y === 0) {
      x = getRandomInt(cols - 1);
      y = getRandomInt(rows - 1);
    }
    return [x, y];
  }
}


class Game {
  constructor(field) {
    this._field = field;
    this._array = field.field;
    this._gameOver = false;
    this._rowIndex = 0;
    this._MaxRowIndex = this._array.length - 1;
    this._colIndex = 0;
    this._MaxColIndex = this._array[0].length - 1;
  }

  printField() {
    this._field.print();
  }

  _getMove() { 
    const validMoves = ['l', 'r', 'u', 'd'];
    let move;
    while (true) {
      move = prompt(
        "Which way do you want to move ('l', 'r', 'u', or 'd')? "
      );
      if (validMoves.includes(move.toLowerCase())) {
        break;
      } else {
        console.log('That is not a valid move.')
      }
    }
    return move;
  }

  _isMoveValid(move) {
    switch(move) {
      case 'l':
        return (this._colIndex > 0);
      case 'r':
        return (this._colIndex < this._MaxColIndex);
      case 'u':
        return (this._rowIndex > 0);
      case 'd':
        return (this._rowIndex < this._MaxRowIndex);
      default:
        return false;
    }
  }

  _checkIfGameOver() {
    const arrayItem = this._array[this._rowIndex][this._colIndex];

    if (arrayItem === hatChar) {
      console.log("Congratulations, you found your hat!");
      this._gameOver = true;
    } else if (arrayItem === holeChar) {
      console.log("Whoops, you fell in a hole! Game over.");
      this._gameOver = true;
    }
  }

  _makeMove(move) {
    if (move === 'l') {
      this._colIndex --;
    } else if (move === 'r') {
      this._colIndex ++;
    } else if (move === 'u') {
      this._rowIndex --;
    } else if (move === 'd') {
      this._rowIndex ++;
    }
  }

  _changeCurrentCharToField() {
    this._array[this._rowIndex][this._colIndex] = fieldChar;
  }

  _changeCurrentCharToPos() {
    this._array[this._rowIndex][this._colIndex] = posChar;
  }

  playGame() {
    while (!this._gameOver) {
      console.log("==========");
      console.log("");
      this.printField();
      console.log("");

      const move = this._getMove();
      if (this._isMoveValid(move)) {
        this._changeCurrentCharToField();
        this._makeMove(move);
        this._checkIfGameOver();
        this._changeCurrentCharToPos();
      } else {
        console.log("You can't move outside the field!");
        continue;
      }
    }
  }
}


// const field = new Field([
//   ['*', '░', 'O'],
//   ['░', 'O', '░'],
//   ['░', '^', '░'],
// ]);

const field = new Field();
const game = new Game(field);
game.playGame();
