const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const shrekImage = document.getElementById('shrekImage');
const donkeyImage = document.getElementById('donkeyImage');

// Set canvas size
const setCanvasSize = () => {
    canvas.width = Math.min(window.innerWidth, 800);
    canvas.height = Math.min(window.innerHeight, 600);
};
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

// Game objects
const shrek = {
    x: canvas.width / 2,
    y: canvas.height - 80,
    width: 80,
    height: 80,
    speed: 5
};

const donkeys = [];
const donkeySpawnRate = 0.02;
const donkeySpeed = 2;

let score = 0;
let isPaused = false;

// Input handling
let leftPressed = false;
let rightPressed = false;

const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'ArrowRight') rightPressed = true;
    if (e.key === 'p' || e.key === 'P') togglePause();
};

const handleKeyUp = (e) => {
    if (e.key === 'ArrowLeft') leftPressed = false;
    if (e.key === 'ArrowRight') rightPressed = false;
};

const handleTouch = (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    
    if (touchX < canvas.width / 2) {
        leftPressed = true;
        rightPressed = false;
    } else {
        leftPressed = false;
        rightPressed = true;
    }
};

const handleTouchEnd = () => {
    leftPressed = false;
    rightPressed = false;
};

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);
canvas.addEventListener('touchend', handleTouchEnd);

// Pause functionality
const togglePause = () => {
    isPaused = !isPaused;
    if (isPaused) {
        renderPauseScreen();
    } else {
        gameLoop();
    }
};

// Game logic
const updateShrek = () => {
    if (leftPressed && shrek.x > 0) shrek.x -= shrek.speed;
    if (rightPressed && shrek.x < canvas.width - shrek.width) shrek.x += shrek.speed;
};

const updateDonkeys = () => {
    if (Math.random() < donkeySpawnRate) {
        donkeys.push({
            x: Math.random() * (canvas.width - 60),
            y: -60,
            width: 60,
            height: 60
        });
    }

    for (let i = donkeys.length - 1; i >= 0; i--) {
        donkeys[i].y += donkeySpeed;

        if (donkeys[i].y > canvas.height) {
            donkeys.splice(i, 1);
            score++;
        } else if (
            shrek.x < donkeys[i].x + donkeys[i].width &&
            shrek.x + shrek.width > donkeys[i].x &&
            shrek.y < donkeys[i].y + donkeys[i].height &&
            shrek.y + shrek.height > donkeys[i].y
        ) {
            // Game over
            alert(`Game Over! Your score: ${score}`);
            score = 0;
            donkeys.length = 0;
            shrek.x = canvas.width / 2;
        }
    }
};

// Rendering
const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#7cba5e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Shrek
    ctx.drawImage(shrekImage, shrek.x, shrek.y, shrek.width, shrek.height);

    // Draw donkeys
    donkeys.forEach(donkey => {
        ctx.drawImage(donkeyImage, donkey.x, donkey.y, donkey.width, donkey.height);
    });

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Draw pause button
    drawPauseButton();
};

const renderPauseScreen = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Press P or tap the pause button to resume', canvas.width / 2, canvas.height / 2 + 40);
    drawPauseButton();
};

const drawPauseButton = () => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(canvas.width - 50, 10, 40, 40);
    ctx.fillStyle = isPaused ? 'green' : 'red';
    ctx.fillRect(canvas.width - 45, 15, 10, 30);
    ctx.fillRect(canvas.width - 25, 15, 10, 30);
};

// Pause button click handler
const handlePauseClick = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (clickX > canvas.width - 50 && clickX < canvas.width - 10 && clickY > 10 && clickY < 50) {
        togglePause();
    }
};

canvas.addEventListener('click', handlePauseClick);

// Game loop
const gameLoop = () => {
    if (!isPaused) {
        updateShrek();
        updateDonkeys();
        render();
        requestAnimationFrame(gameLoop);
    }
};

gameLoop();