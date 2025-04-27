const gameboard = (function () {
    const gridDim = 3;
    const grid = Array(gridDim*gridDim).fill(undefined);

    function placeMark(position, mark) {
        if (grid[position] || position >= grid.length) {
            return false;
        }

        grid[position] = mark;

        return true;
    }

    function checkWin() {
        // Skips checks for first moves.
        const markCount = grid.filter((item) => item !== undefined).length;
        if (markCount < 5) {
            return false;
        }

        if (checkHorizontals() || checkVerticals() || checkDiagonals()) {
            return true;
        }

        if (markCount === grid.length) {
            return null;
        }

        return false;
    }

    function checkHorizontals() {
        for (let rowStart = 0; rowStart < grid.length; rowStart += gridDim) {
            const row = grid.slice(rowStart, rowStart + gridDim);

            // Skips row if not all spaces have marks.
            if (!row.includes(undefined)) {
                if (row.every(mark => mark === row[0])) {
                    return true;
                }
            }
        }

        return false;
    }

    function checkVerticals() {
        for (let colStart = 0; colStart < gridDim; colStart++) {
            const col = grid.filter((_, idx) => {
                return (idx - colStart) % gridDim === 0;
            });

            // Skips col if not all spaces have marks.
            if (!col.includes(undefined)) {
                if (col.every(mark => mark === col[0])) {
                    return true;
                }
            }
        }

        return false;
    }

    function checkDiagonals() {
        // Top left to bottom right.
        const topLeftDiagonal = grid.filter((_, idx) => {
            return idx % (gridDim + 1) === 0;
        })

        // Skips diagonal if not all spaces have marks.
        if (!topLeftDiagonal.includes(undefined)) {
            if (topLeftDiagonal.every(mark => mark === topLeftDiagonal[0])) {
                return true;
            }
        }

        // Top right to bottom left.
        const topRightDiagonal = grid.filter((_, idx) => {
            return idx % (gridDim - 1) === 0 && idx !== 0 && idx !== grid.length - 1;
        })

        // Skips diagonal if not all spaces have marks.
        if (!topRightDiagonal.includes(undefined)) {
            if (topRightDiagonal.every(mark => mark === topRightDiagonal[0])) {
                return true;
            }
        }

        return false;
    }

    function getBoard() {
        return grid;
    }

    return {checkWin, getBoard, placeMark};
})();

const gameController = (function () {
    const playerX = createPlayer('Henk', 'X');
    const playerO = createPlayer('Mand', 'O');

    const board = gameboard;
    let currentPlayer = playerX;

    function makeMove(pos) {
        validMove = board.placeMark(pos, currentPlayer.mark);
        const gameWon = board.checkWin();

        if (gameWon) {
            console.log(`Game over. Winner: ${currentPlayer.name}.`);
        } else if (gameWon !== false) {
            console.log('Tie.');
        }

        if (validMove) {
            currentPlayer = currentPlayer === playerX ? playerO : playerX;
        }

        return validMove;
    }

    return { getBoard: board.getBoard, makeMove };
})();


function createPlayer (name, mark) {
    return { name, mark };
}

const displayController = (function() {
    const boardElement = document.querySelector('.board');
    const game = gameController;

    function updateDisplay () {
        const docFrag = document.createDocumentFragment();

        for (const [idx, mark] of game.getBoard().entries()) {
            const cellElement = document.createElement('button');
            cellElement.textContent = mark;
            cellElement.dataset.indexNumber = idx;
            docFrag.appendChild(cellElement);
        }

        boardElement.innerHTML = '';
        boardElement.appendChild(docFrag);
    }

    boardElement.addEventListener('click', (e) => {
        const button = e.target;
        const indexNumber = button.dataset.indexNumber;

        if (game.makeMove(indexNumber)) {
            updateDisplay();
        }
    });

    updateDisplay();
})();
