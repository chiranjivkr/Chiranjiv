let board = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'X';
        let gameActive = true;
        let gameMode = 'player'; // 'player' or 'ai'
        let scores = { X: 0, O: 0, draw: 0 };

        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]              // Diagonals
        ];

        function setMode(mode) {
            gameMode = mode;
            const btns = document.querySelectorAll('.mode-btn');
            btns.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            const label = document.getElementById('scoreOLabel');
            label.textContent = mode === 'ai' ? 'AI' : 'Player O';
            
            resetGame();
        }

        function makeMove(index) {
            if (!gameActive || board[index] !== '') {
                return;
            }

            board[index] = currentPlayer;
            updateCell(index);
            
            if (checkWinner()) {
                const winner = currentPlayer === 'O' && gameMode === 'ai' ? 'AI' : `Player ${currentPlayer}`;
                endGame(`${winner} Wins! 🎉`);
                scores[currentPlayer]++;
                updateScores();
                return;
            }

            if (checkDraw()) {
                endGame("It's a Draw! 🤝");
                scores.draw++;
                updateScores();
                return;
            }

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateGameInfo();

            if (gameMode === 'ai' && currentPlayer === 'O' && gameActive) {
                setTimeout(makeAIMove, 100);
            }
        }

        function makeAIMove() {
            if (!gameActive) return;
            const bestMove = findBestMove();
            if (bestMove !== undefined) {
                makeMove(bestMove);
            }
        }

        function findBestMove() {
            // Try to win
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    if (checkWinnerForPlayer('O')) {
                        board[i] = '';
                        return i;
                    }
                    board[i] = '';
                }
            }

            // Block player from winning
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    if (checkWinnerForPlayer('X')) {
                        board[i] = '';
                        return i;
                    }
                    board[i] = '';
                }
            }

            // Take center if available
            if (board[4] === '') return 4;

            // Take a corner
            const corners = [0, 2, 6, 8];
            const availableCorners = corners.filter(i => board[i] === '');
            if (availableCorners.length > 0) {
                return availableCorners[Math.floor(Math.random() * availableCorners.length)];
            }

            // Take any available space
            const available = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
            return available[Math.floor(Math.random() * available.length)];
        }

        function checkWinnerForPlayer(player) {
            return winningConditions.some(condition => {
                return condition.every(index => board[index] === player);
            });
        }

        function checkWinner() {
            return checkWinnerForPlayer(currentPlayer);
        }

        function checkDraw() {
            return board.every(cell => cell !== '');
        }

        function updateCell(index) {
            const cells = document.querySelectorAll('.cell');
            cells[index].textContent = currentPlayer;
            cells[index].classList.add(currentPlayer.toLowerCase());
            cells[index].disabled = true;
        }

        function updateGameInfo() {
            const info = document.getElementById('gameInfo');
            if (gameMode === 'ai' && currentPlayer === 'O') {
                info.textContent = "AI is thinking...";
            } else {
                info.textContent = `Player ${currentPlayer}'s Turn`;
            }
        }

        function endGame(message) {
            gameActive = false;
            const info = document.getElementById('gameInfo');
            info.textContent = message;
            info.classList.add('winner-message');
            setTimeout(() => info.classList.remove('winner-message'), 500);
        }

        function updateScores() {
            document.getElementById('scoreX').textContent = scores.X;
            document.getElementById('scoreO').textContent = scores.O;
            document.getElementById('scoreDraw').textContent = scores.draw;
        }

        function resetGame() {
            board = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'X';
            gameActive = true;
            
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => {
                cell.textContent = '';
                cell.disabled = false;
                cell.classList.remove('x', 'o');
            });
            
            updateGameInfo();
        }