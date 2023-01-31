const Player = (name, symbol) => {
    const getInfoPlayer = () => { return `${name} is playing ${symbol}.` };
    return {
        name,
        getInfoPlayer,
        symbol
    }
}

let user = Player('Human', 'O');
let comp = Player('Computer', 'X');



const Gameboard = ((player1, player2) => {
    let _game = [];
    let _moveLog = {};
    let _victory = false;
    let _playerStart = (Math.round(Math.random())) ? player1 : player2;
    _moveLog[player1.name] = 0;
    _moveLog[player2.name] = 0;

    resetGame();

    function resetGame() {
        _game = [];
        let row = [];
        for (let i = 0; i < 3; i++) {
            row.push('');
        }
        for (let i = 0; i < 3; i++) {
            _game.push(row);
        }
        _victory = false;
        document.querySelectorAll('.cell').forEach(cell => {
            cell.innerText = ''
            cell.classList.remove('O');
            cell.classList.remove('X');
        }
        );
    }

    function addMark(player, position) {
        const [row, col] = position.split(',');
        if (_isLegalMove(row, col) && whosTurn() === player && !_victory) {
            const updatedRow = [..._game[row - 1]].map((val, j) => (j === col - 1) ? player.symbol : val);
            _game.splice(row - 1, 1, updatedRow);
            _moveLog[player.name] += 1;
            if (checkIfVictory(player)) {
                _printMsg(`${player.name} won!`);
                document.querySelector('.button').innerHTML = '<p>Play again</p>';
                document.querySelector('.button').classList.toggle('deactivate');
            }
            return true;
        }
        _checkEndGame();
    }

    function _checkEndGame() {
        if (_game.every(row => row.every(cell => cell !== '')) && !_victory)  {
            _printMsg('Oh. It\'s a tie!');
            document.querySelector('.button').innerHTML = '<p>Play again</p>';
            document.querySelector('.button').classList.toggle('deactivate');
        }
    }

    function checkIfVictory(player) {
        let isVictory = false;
        //check rows
        _game.forEach(row => {
            if (row.every(cell => cell === player.symbol)) {
                isVictory = true;
            }
        })
        //check columns
        for (let i = 0; i <= 2; i++) {
            if (_game.map(row => row[i]).every(cell => cell === player.symbol)) {
                isVictory = true;
            }
        }
        //check diagonals
        if (_game[0][0] === player.symbol && _game[1][1] === player.symbol && _game[2][2] === player.symbol) {
            isVictory = true;
        }
        if (_game[2][0] === player.symbol && _game[1][1] === player.symbol && _game[0][2] === player.symbol) {
            isVictory = true;
        }
        _victory = isVictory;
        return isVictory;
    }

    function whosTurn() {
        if (player1 === _playerStart) {
            return (_moveLog[player1.name] > _moveLog[player2.name]) ? player2 : player1;
        } else {
            return (_moveLog[player2.name] > _moveLog[player1.name]) ? player1 : player2;
        }
    }

    function compMove() {
        if (!_victory && _game.some(row => row.some(cell => cell === ''))) {
            let position = '';
            while (position === '') {
                let i = Math.floor(Math.random() * 3 + 1);
                let j = Math.floor(Math.random() * 3 + 1);
                position = (_isLegalMove(i, j)) ? `${i},${j}` : '';
            }
            if (addMark(player2, position)) {
                document.querySelector(`.cell[data-attribute="${position}"]`).innerText = player2.symbol;
                document.querySelector(`.cell[data-attribute="${position}"]`).classList.toggle(player2.symbol);
            }
        }
        _checkEndGame();
    }

    const doesPlayerStart = () => (_playerStart === user);
    const _printMsg = (message) => document.querySelector('.message').innerText = message;
    const _isLegalMove = (i, j) => (_game[i - 1][j - 1] === '');


    document.querySelector('.button').addEventListener('click', printWhoStarts);


    function playMove(event) {
        const player = Gameboard.whosTurn();
        if (Gameboard.addMark(player, event.target.dataset.attribute)) {
            event.target.innerText = player.symbol;
            event.target.classList.toggle(player.symbol);
            Gameboard.compMove();
        }
    }

    function printWhoStarts() {
        Gameboard.resetGame();
        const startMessage = (Gameboard.doesPlayerStart()) ? 'You start.' : 'Computer starts.';
        document.querySelector('.message').innerText = startMessage;
        document.querySelector('.button').classList.toggle('deactivate');
        if (!Gameboard.doesPlayerStart()) Gameboard.compMove();
        document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', playMove));
    };


    return {
        _game,
        resetGame,
        compMove,
        doesPlayerStart,
        addMark,
        checkIfVictory,
        whosTurn
    }


})(user, comp)





