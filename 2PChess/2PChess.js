class Piece {
    constructor(type, color, row, col) {
        this.type = type;
        this.color = color;
        this.row = row;
        this.col = col;
    }

    setRow(row) {
        this.row = row;
    }

    setCol(col) {
        this.col = col;
    }

    isValidMove(targetRow, targetCol, board) {
        return false;
    }
}

class Pawn extends Piece {
    constructor(color, row, col) {
        super("p", color, row, col);
    }

    isValidMove(targetRow, targetCol, board) {
        const direction = this.color === 'white' ? -1 : 1;
        const startRow = this.color === 'white' ? 6 : 1;
        if (targetCol === this.col) {
            if (targetRow === this.row + direction && !board[targetRow][targetCol]) {
                return true;
            }
            if (this.row === startRow && targetRow === this.row + 2 * direction && !board[targetRow][targetCol] && !board[this.row + direction][targetCol]) {
                return true;
            }
        } else if (Math.abs(targetCol - this.col) === 1 && targetRow === this.row + direction && board[targetRow][targetCol] && this.color !== board[targetRow][targetCol].color) {
            return true;
        }
        return false;
    }
}

class Knight extends Piece {
    constructor(color, row, col) {
        super("N", color, row, col);
    }

    isValidMove(targetRow, targetCol, board) {
        const rowDiff = Math.abs(targetRow - this.row);
        const colDiff = Math.abs(targetCol - this.col);
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    }
}

class Bishop extends Piece {
    constructor(color, row, col) {
        super("B", color, row, col);
    }

    isValidMove(targetRow, targetCol, board) {
        return Math.abs(targetRow - this.row) === Math.abs(targetCol - this.col);
    }
}

class Rook extends Piece {
    constructor(color, row, col) {
        super("R", color, row, col);
    }

    isValidMove(targetRow, targetCol, board) {
        return (targetRow === this.row || targetCol === this.col);
    }
}

class Queen extends Piece {
    constructor(color, row, col) {
        super("Q", color, row, col);
    }

    isValidMove(targetRow, targetCol, board) {
        return (targetRow === this.row || targetCol === this.col) || (Math.abs(targetRow - this.row) === Math.abs(targetCol - this.col));
    }
}

class King extends Piece {
    constructor(color, row, col) {
        super("K", color, row, col);
    }

    isValidMove(targetRow, targetCol, board) {
        return Math.abs(targetRow - this.row) <= 1 && Math.abs(targetCol - this.col) <= 1;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const chessboard = document.getElementById('chessboard');
    const pieces = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
    };

    const initialBoard = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];

    let board = [];
    for (let row = 0; row < 8; row++) {
        board[row] = [];
        for (let col = 0; col < 8; col++) {
            const piece = initialBoard[row][col];
            if (piece) {
                const color = piece === piece.toUpperCase() ? 'white' : 'black';
                switch (piece.toLowerCase()) {
                    case 'p':
                        board[row][col] = new Pawn(color, row, col);
                        break;
                    case 'n':
                        board[row][col] = new Knight(color, row, col);
                        break;
                    case 'b':
                        board[row][col] = new Bishop(color, row, col);
                        break;
                    case 'r':
                        board[row][col] = new Rook(color, row, col);
                        break;
                    case 'q':
                        board[row][col] = new Queen(color, row, col);
                        break;
                    case 'k':
                        board[row][col] = new King(color, row, col);
                        break;
                }
            } else {
                board[row][col] = null;
            }
        }
    }

    let selectedPiece = null;
    let currentTurn = 'white';

    function createBoard() {
        chessboard.innerHTML = '';
        let color = true; // true for white, false for black
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.classList.add('square', color ? 'white' : 'black');
                square.dataset.row = row;
                square.dataset.col = col;

                if (board[row][col]) {
                    const piece = document.createElement('span');
                    piece.classList.add('piece');
                    piece.textContent = pieces[board[row][col].type];
                    piece.style.color = board[row][col].color === 'white' ? 'white' : 'black';
                    square.appendChild(piece);
                }
                square.addEventListener('click', () => handleSquareClick(square));
                chessboard.appendChild(square);
                color = !color;
            }
            color = !color;
        }
    }

    function handleSquareClick(square) {
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const piece = board[row][col];

        if (selectedPiece) {
            if (piece && selectedPiece.color === piece.color) {
                selectedPiece = piece;
            } else {
                movePiece(selectedPiece, row, col);
            }
        } else if (piece && piece.color === currentTurn) {
            selectedPiece = piece;
        }
    }

    function movePiece(selected, targetRow, targetCol) {
        if (selected.isValidMove(targetRow, targetCol, board)) {
            board[targetRow][targetCol] = selected;
            board[selected.row][selected.col] = null;
            selected.setRow(targetRow);
            selected.setCol(targetCol);
            selectedPiece = null;
            switchTurn();
            createBoard();
        }
    }

    function switchTurn() {
        currentTurn = currentTurn === 'white' ? 'black' : 'white';
    }

    createBoard();
});
