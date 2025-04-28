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

    function clearGame() {
        grid.forEach((_, index) => grid[index] = undefined);
    }

    return { checkWin, clearGame, getBoard, placeMark };
})();


function GameController(nameX, nameO) {
    const playerX = createPlayer(nameX, 'X');
    const playerO = createPlayer(nameO, 'O');

    const board = gameboard;
    let currentPlayer = playerX;
    let hasEnded = false;

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function hasGameEnded() {
        return hasEnded;
    }

    function makeMove(pos) {
        validMove = board.placeMark(pos, currentPlayer.mark);

        if (validMove) {
            hasEnded = board.checkWin();

            if (hasEnded === false) {
                currentPlayer = currentPlayer === playerX ? playerO : playerX;
            }
        }

        return validMove;
    }

    return { clearGame: board.clearGame, getBoard: board.getBoard,
        getCurrentPlayer, hasGameEnded, makeMove};
}


function createPlayer (name, mark) {
    return { name, mark };
}

const displayController = (function() {
    const boardElement = document.querySelector('.board');
    const restartButton = document.querySelector('.restart');
    const startButton = document.querySelector('.start');

    let game;

    function updateDisplay(game) {
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

    startButton.addEventListener('click', () => {
        startButton.disabled = true;
        restartButton.disabled = false;

        const playerXInput = document.querySelector('#player-X');
        const nameX = playerXInput.value;
        playerXInput.disabled = true;

        const playerOInput = document.querySelector('#player-O');
        const nameO = playerOInput.value;
        playerOInput.disabled = true;

        game = GameController(nameX, nameO);
        updateDisplay(game);

        const startingPlayer = game.getCurrentPlayer();
        displayCurrentPlayer(startingPlayer);
    });

    restartButton.addEventListener('click', () => {
        document.querySelector('#player-X').disabled = false;
        document.querySelector('#player-O').disabled = false;
        startButton.disabled = false;
        restartButton.disabled = true;

        game.clearGame();
        boardElement.innerHTML = '';

        const currentPlayer = document.querySelector('.current-player');
        if (currentPlayer) {
            currentPlayer.className = '';
        }
    });

    boardElement.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            return;
        }

        const button = e.target;
        const indexNumber = button.dataset.indexNumber;

        if (game.makeMove(indexNumber)) {
            updateDisplay(game);

            const hasGameEnded = game.hasGameEnded();

            if (hasGameEnded !== false) {
                // True represents a win, null a tie.
                if (hasGameEnded) {
                    displayResult('win');
                } else {
                    displayResult('tie');
                }
            } else {
                displayCurrentPlayer(game.getCurrentPlayer());
            }
        }
    });

    function displayCurrentPlayer(player) {
        const previousPlayer = document.querySelector('.current-player');

        if (previousPlayer) {
            previousPlayer.className = '';
        }

        const currentPlayer = document.querySelector(`label[for="player-${player.mark}"]`);
        currentPlayer.className = 'current-player';
    }

    function displayResult(result) {
        const buttons = boardElement.querySelectorAll('button');
        buttons.forEach(button => button.disabled = true);

        if (result === 'tie') {
            document.querySelector('.current-player').className = '';
        } else {
            document.querySelector('.current-player').className += ' winner';
        }
    }
})();
