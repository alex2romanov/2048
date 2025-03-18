document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const scoreDisplay = document.getElementById('score');
    let board = [];
    let score = 0;

    // Инициализация игрового поля
    function init() {
        board = Array(4).fill().map(() => Array(4).fill(0));
        createTile();
        createTile();
        render();
    }

    // Создание новой плитки
    function createTile() {
        let empty = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 0) empty.push([i, j]);
            }
        }
        if (empty.length) {
            let [i, j] = empty[Math.floor(Math.random() * empty.length)];
            board[i][j] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    // Отрисовка поля
    function render() {
        grid.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let tile = document.createElement('div');
                tile.className = `tile tile-${board[i][j] || '0'}`;
                tile.textContent = board[i][j] || '';
                grid.appendChild(tile);
            }
        }
        scoreDisplay.textContent = score;
    }

    // Сжатие массива
    function compress(arr) {
        let newArr = arr.filter(val => val);
        for (let i = 0; i < newArr.length - 1; i++) {
            if (newArr[i] === newArr[i + 1]) {
                newArr[i] *= 2;
                score += newArr[i];
                newArr.splice(i + 1, 1);
            }
        }
        while (newArr.length < 4) newArr.push(0);
        return newArr;
    }

    // Обработка движения
    function move(direction) {
        let moved = false;
        let newBoard = board.map(row => [...row]);

        if (direction === 'left') {
            for (let i = 0; i < 4; i++) {
                let newRow = compress(board[i]);
                if (newRow.join() !== board[i].join()) moved = true;
                newBoard[i] = newRow;
            }
        }

        if (direction === 'right') {
            for (let i = 0; i < 4; i++) {
                let reversed = board[i].slice().reverse();
                let newRow = compress(reversed).reverse();
                if (newRow.join() !== board[i].join()) moved = true;
                newBoard[i] = newRow;
            }
        }

        if (direction === 'up') {
            for (let j = 0; j < 4; j++) {
                let col = [board[0][j], board[1][j], board[2][j], board[3][j]];
                let newCol = compress(col);
                for (let i = 0; i < 4; i++) {
                    if (newBoard[i][j] !== newCol[i]) moved = true;
                    newBoard[i][j] = newCol[i];
                }
            }
        }

        if (direction === 'down') {
            for (let j = 0; j < 4; j++) {
                let col = [board[0][j], board[1][j], board[2][j], board[3][j]].reverse();
                let newCol = compress(col).reverse();
                for (let i = 0; i < 4; i++) {
                    if (newBoard[i][j] !== newCol[i]) moved = true;
                    newBoard[i][j] = newCol[i];
                }
            }
        }

        if (moved) {
            board = newBoard;
            createTile();
            render();
        }
    }

    // Управление с клавиатуры
    document.addEventListener('keydown', (e) => {
        e.preventDefault();
        switch (e.key) {
            case 'ArrowLeft': move('left'); break;
            case 'ArrowRight': move('right'); break;
            case 'ArrowUp': move('up'); break;
            case 'ArrowDown': move('down'); break;
        }
    });

    // Управление с помощью сенсорных жестов (для iPhone и других устройств)
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, false);

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const minSwipeDistance = 30; // Минимальная дистанция для распознавания свайпа

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Горизонтальный свайп
            if (deltaX > minSwipeDistance) {
                move('right');
            } else if (deltaX < -minSwipeDistance) {
                move('left');
            }
        } else {
            // Вертикальный свайп
            if (deltaY > minSwipeDistance) {
                move('down');
            } else if (deltaY < -minSwipeDistance) {
                move('up');
            }
        }
    }

    init();
});
