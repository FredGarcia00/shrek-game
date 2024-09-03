const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const shrekImage = document.getElementById('shrekImage');

let shrekX = canvas.width / 2;
let shrekY = canvas.height / 2;
const shrekSize = 50;

function drawShrek() {
    ctx.drawImage(shrekImage, shrekX - shrekSize / 2, shrekY - shrekSize / 2, shrekSize, shrekSize);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    clear();
    drawShrek();
    requestAnimationFrame(gameLoop);
}

function moveShrek(x, y) {
    shrekX = x;
    shrekY = y;
}

// Handle both mouse and touch events
function handleInput(event) {
    event.preventDefault();
    let x, y;
    
    if (event.type.startsWith('touch')) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
    } else {
        x = event.clientX;
        y = event.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    moveShrek(
        (x - rect.left) * scaleX,
        (y - rect.top) * scaleY
    );
}

// Add event listeners for both mouse and touch events
canvas.addEventListener('mousedown', handleInput);
canvas.addEventListener('mousemove', handleInput);
canvas.addEventListener('touchstart', handleInput);
canvas.addEventListener('touchmove', handleInput);

// Prevent default touch behavior on the canvas
canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

// Start the game loop
gameLoop();