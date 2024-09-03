const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const shrekImage = document.getElementById('shrekImage');

const shrek = {
    x: canvas.width / 2 - 30,
    y: canvas.height - 60,
    width: 60,
    height: 60,
    speed: 8,
    velocity: 0,
    friction: 0.9,
    acceleration: 0.5
};

let creatures = [];
let score = 0;
let leftPressed = false;
let rightPressed = false;

function drawShrek() {
    ctx.drawImage(shrekImage, shrek.x, shrek.y, shrek.width, shrek.height);
}

function drawCreature(creature) {
    ctx.fillStyle = creature.color;
    ctx.fillRect(creature.x, creature.y, creature.width, creature.height);
}

function updateShrek() {
    if (leftPressed) {
        shrek.velocity -= shrek.acceleration;
    }
    if (rightPressed) {
        shrek.velocity += shrek.acceleration;
    }
    
    shrek.velocity *= shrek.friction;
    shrek.x += shrek.velocity;

    // Keep Shrek within the canvas
    if (shrek.x < 0) {
        shrek.x = 0;
        shrek.velocity = 0;
    } else if (shrek.x + shrek.width > canvas.width) {
        shrek.x = canvas.width - shrek.width;
        shrek.velocity = 0;
    }
}

function createCreature() {
    return {
        x: Math.random() * (canvas.width - 20),
        y: 0,
        width: 20,
        height: 20,
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
        speed: 2 + Math.random() * 2
    };
}

function updateCreatures() {
    for (let i = creatures.length - 1; i >= 0; i--) {
        creatures[i].y += creatures[i].speed;
        
        if (creatures[i].y > canvas.height) {
            creatures.splice(i, 1);
        } else if (
            shrek.x < creatures[i].x + creatures[i].width &&
            shrek.x + shrek.width > creatures[i].x &&
            shrek.y < creatures[i].y + creatures[i].height &&
            shrek.y + shrek.height > creatures[i].y
        ) {
            creatures.splice(i, 1);
            score++;
        }
    }
    
    if (Math.random() < 0.02) {
        creatures.push(createCreature());
    }
}

function drawScore() {
    ctx.fillStyle = '#FFF';
    ctx.font = '16px Arial';
    ctx.fillText('Creatures Caught: ' + score, 10, 20);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updateShrek();
    drawShrek();
    updateCreatures();
    creatures.forEach(drawCreature);
    drawScore();
    
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (event.key === 'ArrowRight') {
        rightPressed = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (event.key === 'ArrowRight') {
        rightPressed = false;
    }
});

gameLoop();