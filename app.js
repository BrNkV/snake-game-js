// Поле, на котором всё будет происходить, — тоже как бы переменная
let canvas = document.querySelector('.game');
// Классическая змейка — двухмерная, сделаем такую же
let context = canvas.getContext('2d');
// Размер одной клеточки на поле — 16 пикселей
let grid = 16;
// Служебная переменная, которая отвечает за скорость змейки
let speed = 0;
let maxSpeed = 7;
let inpSpeed = document.querySelector('.speed-value');

//цвет змейки 
let colorSnake = '#5631dd';

//змейка
let snake = {
    // Начальные координаты
    x: 160,
    y: 160,
    // Скорость змейки
    dx: grid,
    dy: 0,
    //хвост змейки
    cells: [],
    // Стартовая длина змейки
    maxCells: 4
};
// еда
let food = {
    x: 320,
    y: 320
};

//очки
let score = 0;
let scoreSpan = document.querySelector('.score span');

//кнопка start
let startBtn = document.querySelector('.start-game');
//кнопка сброс
let resetBtn = document.querySelector('.reset-game');

//изменение скорости
inpSpeed.addEventListener('change', (e) => {
    // console.log(e.target.value);
    if (e.target.value == 'slow') {
        maxSpeed = 10;
    }
    if (e.target.value == 'normal') {
        maxSpeed = 7;
    }
    if (e.target.value == 'fast') {
        maxSpeed = 4;
    }
})

function resetGame() {
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    score = 0;
    scoreSpan.innerHTML = score;
}

//изменение цвета змея
document.querySelector('.color-value').addEventListener('change', (e) => {
    // console.log(e.target.value);
    colorSnake = e.target.value;
})

// рандом генератор
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// рандом еды
function getRandomFood() {
    //размер холста у нас 400x400, разбит на ячейки — 25 по 16px
    food.x = getRandomInt(0, 25) * grid;
    food.y = getRandomInt(0, 25) * grid;
}

let requestId;
// Игровой цикл — основной процесс
function gameLoop() {
    //замедляет скорость игры с 60 кадров в секунду до 15 (60/15 = 4)
    requestId = requestAnimationFrame(gameLoop);
    //код выполнится только один раз из четырёх, в этом и суть замедления кадров, а пока переменная count меньше четырёх, код выполняться не будет
    if (++speed < maxSpeed) { //чем больше maxSpeed тем медленнее
        return;
    }
    // Обнуляем переменную скорости
    speed = 0;
    // Очищаем игровое поле
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Двигаем змейку
    snake.x += snake.dx;
    snake.y += snake.dy;
    // пересечение горизонтальной границы
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    }
    else if (snake.x >= canvas.width) {
        snake.x = 0;
    }
    //пересечение вертикальной границы
    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    }
    else if (snake.y >= canvas.height) {
        snake.y = 0;
    }
    // Продолжаем движение. Голова всегда впереди. 
    //добавляем координаты в начало массива
    snake.cells.unshift({ x: snake.x, y: snake.y });
    //удаляем последний элемент из массива
    if (snake.cells.length > snake.maxCells) snake.cells.pop();
    // Рисуем еду
    context.fillStyle = `rgb(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)})`;
    context.fillRect(food.x, food.y, grid - 1, grid - 1);
    // Одно движение змейки — один новый нарисованный квадратик 
    context.fillStyle = colorSnake;
    // Обрабатываем каждый элемент змейки
    snake.cells.forEach(function (cell, index) {
        //эффект клеточек, делаем квадратики меньше на один пиксель, для образования черной границы
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
        // змейка покушала
        if (cell.x === food.x && cell.y === food.y) {
            // увеличиваем длину змейки
            snake.maxCells++;
            score++;
            scoreSpan.innerHTML = score;
            // console.log(score);
            // Рисуем новую еду
            getRandomFood();
        }
        // Проверяем, не столкнулась ли змея сама с собой
        for (let i = index + 1; i < snake.cells.length; i++) {
            // Если такие клетки есть — начинаем игру заново
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                // Задаём стартовые параметры основным переменным
                stopGame();
            }
        }
    });
}


// управление стрелками
document.addEventListener('keydown', function (e) {
    // проверяем: если змейка движется, например, влево, то ещё одно нажатие влево или вправо ничего не поменяет — змейка продолжит двигаться в ту же сторону, что и раньше.
    // Стрелка влево
    if (e.key === 'ArrowLeft' && snake.dx === 0) {
        //даём ей движение по горизонтали, влево, а вертикальное — останавливаем
        snake.dx = -grid;
        snake.dy = 0;
    }
    // Стрелка вверх
    else if (e.key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    // Стрелка вправо
    else if (e.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    // Стрелка вниз
    else if (e.key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

// start game
startBtn.addEventListener('click', () => {
    cancelAnimationFrame(requestId);
    resetGame();
    gameLoop();
})

//reset
resetBtn.addEventListener('click', () => {
    stopGame();
    resetGame();
})

//stop game
function stopGame() {
    cancelAnimationFrame(requestId);
    scoreList.unshift(score);
    viewTopScore(scoreList);
    updateLs();
}

let scoreList = [];

function getLocalStorage() {
    if (localStorage.getItem('scoreList')) {
        const score = JSON.parse(localStorage.getItem('scoreList'));
        scoreList = score;
        viewTopScore(scoreList);
    }
}
window.addEventListener('load', getLocalStorage)


function updateLs() {
    localStorage.setItem('scoreList', JSON.stringify(scoreList));
}

let topList = document.querySelector('.top-list');


function viewTopScore(score) {
    if (scoreList.length > 10) scoreList.pop();
    topList.innerHTML = '';
    score.sort((a, b) => b - a);
    score.forEach(e => {
        topList.innerHTML += `<li>Score: ${e}</li>`
    })

    updateLs();
}

console.log(`

С больщим трудом наговнокодил змейку... буду еще дорабатывать
по баллам старался учесть все требования, но результатом не сильно доволен

Спасибо за проверку! Удачи в учебе, и хорошего дня!

`)
