const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: 50,
    size: 30,
    color: 'blue',
    speed: 5
};

const enemy = {
    x: 300,
    y: 300,
    size: 30,
    color: 'red',
    dx: 2,
    dy: 2
};

let score = 0;
let lives =3;
let gameOver = false;

function drawBox(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);    
}

function clearCanvas() {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    
}

function draw() {
    clearCanvas();
    drawBox(player.x, player.y, player.size, player.color);
    drawBox(enemy.x, enemy.y, enemy.size, enemy.color);
}

function updateEnemy() {
    enemy.x += enemy.dx;
    enemy.y += enemy.dy;
    
   if (enemy.x <= 0 || enemy.x + enemy.size >= canvas.width) {
        enemy.dx *= -1;
    }

    if (enemy.y <= 0 || enemy.y + enemy.size >= canvas.height) {
        enemy.dy *= -1;
    }
}


function checkCollision() {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < player.size) {
        score++;
        document.getElementById('score').textContent = score;
        enemy.x = Math.random() * (canvas.width - enemy.size);
        enemy.y = Math.random() * (canvas.height - enemy.size);
        enemy.dx *= 1.05;
        enemy.dy *= 1.05; 
    }
}

function loseLife() {
    lives--;
    document.getElementById('lives').textContent = lives;
    if (lives <= 0) {
        document.getElementById('game-over').style.display = 'block';
        gameOver = true;
        setTimeout(resetGame, 3000);
    }
}

function update() {
    if (gameOver) return;

    draw();
    updateEnemy();
    checkCollision();

    if (
        player.x < 0 || player.x + player.size > canvas.width ||
        player.y < 0 || player.y + player.size > canvas.height
    ) {
        loseLife();
        player.x = canvas.width /2;
        player.y = canvas.height /2;
    }

    requestAnimationFrame(update);
}

document.addEventListener('keydown', (e) => {
    if(gameOver) return;

    switch (e.key) {
        case 'ArrowUp': player.y -= player.speed; break;
        case 'ArrowDown': player.y += player.speed; break;
        case 'ArrowLeft': player.x -= player.speed; break;
        case 'ArrowRight': player.x += player.speed; break;
    }

});







//update();