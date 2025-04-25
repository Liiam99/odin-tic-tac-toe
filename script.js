const gameboard = (function () {
    const gridDim = 3;
    const grid = Array(gridDim*gridDim).fill(undefined);

    function placeMark (position, mark) {
        if (grid[position] || position >= grid.length) {
            return false;
        }

        grid[position] = mark;

        for (let i = 0; i < grid.length; i += gridDim) {
            console.log(grid.slice(i, i + gridDim));
        }

        console.log('-----------------');

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

    return { placeMark, checkWin };
})();

const gameController = (function () {
    const playerX = createPlayer('Henk', 'X');
    const playerO = createPlayer('Mand', 'O');

    const board = gameboard;
    let currentPlayer = playerX;
    let gameWon = board.checkWin();

    while (gameWon === false) {
        currentPlayer = currentPlayer === playerX ? playerO : playerX;
        let validMove;

        do {
            const pos = prompt('Where would you like to place your mark?');

            validMove = board.placeMark(pos, currentPlayer.mark);

            if (!validMove) {
                console.log('Invalid move. Try again.');
            }
        } while (!validMove);

        gameWon = board.checkWin();
    }

    if (gameWon) {
        console.log(`Game over. Winner: ${currentPlayer.name}.`)
    } else {
        console.log('Tie.')
    }
})();


function createPlayer (name, mark) {
    return { name, mark };
}
