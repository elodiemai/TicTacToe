'use strict';

(function () {


    const Gameboard = (() => {
        let game = [];
        let moveLog = {};
        return {
            get moveLog() {
                return moveLog;
            },
            set moveLog(obj) {
                moveLog = obj;
            },
            get game() {
                return game;
            },
            set game(arr) {
                game = arr;
            },
        }
    })();

    /**
     * Represents a Player
     * @param {*} name - the name of the player, default values either 'Human' or 'Computer'
     * @param {*} symbol - the symbol of the player, default values either 'X or 'O'
     */

    const Player = (name, symbol) => {
        const getInfoPlayer = () => (`${name} is playing ${symbol}.`);
        return {
            name,
            getInfoPlayer,
            symbol
        }
    }

    const gameController = (() => {


        const user = Player('Human', 'O');
        const comp = Player('Computer', 'X');
        let _victory = false;
        let _playerStart = (Math.round(Math.random())) ? user : comp;

        /**
         * Initializes the game log to 0 move for each player
         */
        const initMoveLog = () => {
            let _log = {};
            _log[user.name] = 0;
            _log[comp.name] = 0;
            Gameboard.moveLog = _log;
        };

        /**
         * Resets the game array to [['','','']['','','']['','','']]
         */
        const initGame = () => {
            Gameboard.game = [];
            let row = [];
            for (let i = 0; i < 3; i++) {
                row.push('');
            }
            for (let i = 0; i < 3; i++) {
                Gameboard.game.push(row);
            }
        };


        const resetGame = () => {
            initMoveLog();
            initGame();
            _victory = false;
            displayController.resetDisplayGame();
            if (!doesPlayerStart()) compMove();
        };

        const playMove = (player, position) => {
            const [row, col] = position.split(',');
            if (_isLegalMove(row, col) && whosTurn() === player && !_victory) {
                const updatedRow = [...Gameboard.game[row]].map((val, j) => (j === +col) ? player.symbol : val);
                Gameboard.game.splice(row, 1, updatedRow);
                Gameboard.moveLog[player.name] += 1;
                if (checkIfVictory(player)) {
                    _printGameWin(player);
                }
                return true;
            }
            _checkEndGame();
        }


        const _checkEndGame = () => {
            if (Gameboard.game.every(row => row.every(cell => cell !== '')) && Gameboard.game.length > 0 && !_victory) {
                _printGameTie();
            }
        }

        const checkIfVictory = (player) => {
            let isVictory = false;
            //check rows
            Gameboard.game.forEach(row => {
                if (row.every(cell => cell === player.symbol)) {
                    isVictory = true;
                }
            })
            //check columns
            for (let i = 0; i <= 2; i++) {
                if (Gameboard.game.map(row => row[i]).every(cell => cell === player.symbol)) {
                    isVictory = true;
                }
            }
            //check diagonals
            if (Gameboard.game[0][0] === player.symbol && Gameboard.game[1][1] === player.symbol && Gameboard.game[2][2] === player.symbol) {
                isVictory = true;
            }
            if (Gameboard.game[2][0] === player.symbol && Gameboard.game[1][1] === player.symbol && Gameboard.game[0][2] === player.symbol) {
                isVictory = true;
            }
            _victory = isVictory;
            return isVictory;
        }

        const whosTurn = () => {
            if (user === _playerStart) {
                return (Gameboard.moveLog[user.name] > Gameboard.moveLog[comp.name]) ? comp : user;
            } else {
                return (Gameboard.moveLog[comp.name] > Gameboard.moveLog[user.name]) ? user : comp;
            }
        }

        const compMove = () => {
            if (!_victory && Gameboard.game.some(row => row.some(cell => cell === ''))) {
                //let position = '';
                /*
                while (position === '') {
                    let i = Math.floor(Math.random() * 3 + 1);
                    let j = Math.floor(Math.random() * 3 + 1);
                    position = (_isLegalMove(i, j)) ? `${i},${j}` : '';
                }*/
                let position = minimax(user, comp).findBestMove(Gameboard.game);
                if (playMove(comp, position)) {
                    displayController.addMarkDisplay(comp, position);
                }
            }
            _checkEndGame();
        }

        const doesPlayerStart = () => (_playerStart === user);

        const _isLegalMove = (i, j) => (Gameboard.game[i][j] === '');

        const _printGameWin = (player) => {
            _printMsg(`${player.name} won!`);
            document.querySelector('.button').innerHTML = '<p>Play again</p>';
            document.querySelector('.button').classList.toggle('deactivate');
        }

        const _printGameTie = () => {
            _printMsg('Oh. It\'s a tie!');
            document.querySelector('.button').innerHTML = '<p>Play again</p>';
            document.querySelector('.button').classList.toggle('deactivate');
        }

        const _printMsg = (message) => document.querySelector('.message').innerText = message;

        return {
            playMove,
            resetGame,
            compMove,
            doesPlayerStart,
            checkIfVictory,
            whosTurn
        }
    })();

    const displayController = (() => {

        const startGame = () => {
            gameController.resetGame();
            const startMessage = (gameController.doesPlayerStart()) ? 'You start.' : 'Computer starts.';
            document.querySelector('.message').innerText = startMessage;
            document.querySelector('.button').classList.toggle('deactivate');
            document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', eventMove));
        };




        const resetDisplayGame = () => {
            document.querySelectorAll('.cell').forEach(cell => {
                cell.innerText = ''
                cell.classList.remove('O');
                cell.classList.remove('X');
            })
        }

        const addMarkDisplay = (player, position) => {
            document.querySelector(`.cell[data-attribute="${position}"]`).innerText = player.symbol;
            document.querySelector(`.cell[data-attribute="${position}"]`).classList.toggle(player.symbol);
        }

        document.querySelector('.button').addEventListener('click', startGame);

        const eventMove = (event) => {
            const player = gameController.whosTurn();
            if (gameController.playMove(player, event.target.dataset.attribute)) {
                event.target.innerText = player.symbol;
                event.target.classList.toggle(player.symbol);
                gameController.compMove();
            }
        }

        return {
            addMarkDisplay,
            resetDisplayGame
        }

    })();

})();

const minimax = (user, comp) => {

    // Javascript program to find the
    // next optimal move for a player
    class Move {
        constructor() {
            let row, col;
        }
    }

    let player = comp.symbol, opponent = user.symbol;

    // This function returns true if there are moves
    // remaining on the board. It returns false if
    // there are no moves left to play.
    function isMovesLeft(board) {
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                if (board[i][j] == '')
                    return true;

        return false;
    }

    // This is the evaluation function as discussed
    // in the previous article ( http://goo.gl/sJgv68 )
    function evaluate(b) {

        // Checking for Rows for X or O victory.
        for (let row = 0; row < 3; row++) {
            if (b[row][0] == b[row][1] &&
                b[row][1] == b[row][2]) {
                if (b[row][0] == player)
                    return +10;

                else if (b[row][0] == opponent)
                    return -10;
            }
        }

        // Checking for Columns for X or O victory.
        for (let col = 0; col < 3; col++) {
            if (b[0][col] == b[1][col] &&
                b[1][col] == b[2][col]) {
                if (b[0][col] == player)
                    return +10;

                else if (b[0][col] == opponent)
                    return -10;
            }
        }

        // Checking for Diagonals for X or O victory.
        if (b[0][0] == b[1][1] && b[1][1] == b[2][2]) {
            if (b[0][0] == player)
                return +10;

            else if (b[0][0] == opponent)
                return -10;
        }

        if (b[0][2] == b[1][1] &&
            b[1][1] == b[2][0]) {
            if (b[0][2] == player)
                return +10;

            else if (b[0][2] == opponent)
                return -10;
        }

        // Else if none of them have
        // won then return 0
        return 0;
    }

    // This is the minimax function. It
    // considers all the possible ways
    // the game can go and returns the
    // value of the board
    function minimax(board, depth, isMax) {
        let score = evaluate(board);

        // If Maximizer has won the game
        // return his/her evaluated score
        if (score == 10)
            return score;

        // If Minimizer has won the game
        // return his/her evaluated score
        if (score == -10)
            return score;

        // If there are no more moves and
        // no winner then it is a tie
        if (isMovesLeft(board) == false)
            return 0;

        // If this maximizer's move
        if (isMax) {
            let best = -1000;

            // Traverse all cells
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {

                    // Check if cell is empty
                    if (board[i][j] == '') {

                        // Make the move
                        board[i][j] = player;

                        // Call minimax recursively
                        // and choose the maximum value
                        best = Math.max(best, minimax(board,
                            depth + 1, !isMax));

                        // Undo the move
                        board[i][j] = '';
                    }
                }
            }
            return best;
        }

        // If this minimizer's move
        else {
            let best = 1000;

            // Traverse all cells
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {

                    // Check if cell is empty
                    if (board[i][j] == '') {

                        // Make the move
                        board[i][j] = opponent;

                        // Call minimax recursively and
                        // choose the minimum value
                        best = Math.min(best, minimax(board,
                            depth + 1, !isMax));

                        // Undo the move
                        board[i][j] = '';
                    }
                }
            }
            return best;
        }
    }

    // This will return the best possible
    // move for the player
    function findBestMove(board) {
        let bestVal = -1000;
        let bestMove = new Move();
        bestMove.row = -1;
        bestMove.col = -1;

        // Traverse all cells, evaluate
        // minimax function for all empty
        // cells. And return the cell
        // with optimal value.
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {

                // Check if cell is empty
                if (board[i][j] == '') {

                    // Make the move
                    board[i][j] = player;

                    // compute evaluation function
                    // for this move.
                    let moveVal = minimax(board, 0, false);

                    // Undo the move
                    board[i][j] = '';

                    // If the value of the current move
                    // is more than the best value, then
                    // update best
                    if (moveVal > bestVal) {
                        bestMove.row = i;
                        bestMove.col = j;
                        bestVal = moveVal;
                    }
                }
            }
        }
        console.log(`${bestMove.row},${bestMove.col}`);
        return `${bestMove.row},${bestMove.col}`;
    }

    return {
        findBestMove
    }

}