const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const boxSize = 20;
const rows = canvas.height / boxSize;
const cols = canvas.width / boxSize;

let snake = [{ x: 10 * boxSize, y: 10 * boxSize }];
let food = generateFood(); // Generate initial food
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let gameSpeed = 100;
let gameRunning = true;
let score = 0; // Initialize score

function drawBox(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, boxSize, boxSize);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(x, y, boxSize, boxSize);
}

function drawSnake() {
    snake.forEach(part => drawBox(part.x, part.y, '#28a745'));
}

function drawFood() {
    drawBox(food.x, food.y, '#dc3545');
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20); // Display score in top-left corner
}

function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * cols) * boxSize,
            y: Math.floor(Math.random() * rows) * boxSize
        };
    } while (snake.some(part => part.x === newFood.x && part.y === newFood.y)); // Check for overlap

    return newFood;
}

function checkGameOver() {
    const head = snake[0];
    // Check self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameRunning = false;
            return;
        }
    }
    // Check wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        gameRunning = false;
    }
}

function updateSnake() {
    const head = { x: snake[0].x + direction.x * boxSize, y: snake[0].y + direction.y * boxSize };
    snake.unshift(head);

    // Check if snake eats the food
    if (head.x === food.x && head.y === food.y) {
        food = generateFood(); // Generate new food
        score++; // Increase score
    } else {
        // Remove the last part of the snake if no food eaten
        snake.pop();
    }
}

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const keyPressed = event.keyCode;
    if (keyPressed === 37 && direction.x === 0) nextDirection = { x: -1, y: 0 }; // Left
    else if (keyPressed === 38 && direction.y === 0) nextDirection = { x: 0, y: -1 }; // Up
    else if (keyPressed === 39 && direction.x === 0) nextDirection = { x: 1, y: 0 }; // Right
    else if (keyPressed === 40 && direction.y === 0) nextDirection = { x: 0, y: 1 }; // Down
}

function gameLoop() {
    if (!gameRunning) {
        alert('Game Over! Your score: ' + score);
        document.location.reload(); // Reload page on game over
        return; // Exit the loop
    }

    direction = nextDirection;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    checkGameOver(); // Check for collisions before updating the snake
    updateSnake(); // Update snake position

    drawSnake();
    drawFood();
    drawScore(); // Draw score on screen
}

setInterval(gameLoop, gameSpeed);