'use strict';

(function () {
    const gameController = (() => {

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
                const updatedRow = [...Gameboard.game[row - 1]].map((val, j) => (j === col - 1) ? player.symbol : val);
                Gameboard.game.splice(row - 1, 1, updatedRow);
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
                let position = '';
                while (position === '') {
                    let i = Math.floor(Math.random() * 3 + 1);
                    let j = Math.floor(Math.random() * 3 + 1);
                    position = (_isLegalMove(i, j)) ? `${i},${j}` : '';
                }
                if (playMove(comp, position)) {
                    displayController.addMarkDisplay(comp, position);
                }
            }
            _checkEndGame();
        }

        const doesPlayerStart = () => (_playerStart === user);

        const _isLegalMove = (i, j) => (Gameboard.game[i - 1][j - 1] === '');

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


