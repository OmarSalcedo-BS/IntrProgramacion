const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: 50,
    size: 30,
    color: 'red',
    speed: 12
};

const enemies = [
    { x: 300, y: 300, size: 30, color: 'blue', dx: 2, dy: 2 },
    { x: 100, y: 200, size: 30, color: 'black', dx: -3, dy: 3 },
];

const enemyD = {
    x: 300, 
    y: 300, 
    size: 30, 
    color: 'Yellow', 
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
    enemies.forEach(enemy => {
        drawBox(enemy.x, enemy.y, enemy.size, enemy.color);
    });
    drawBox(enemyD.x, enemyD.y, enemyD.size, enemyD.color);
}

function updateEnemy(enemy) {
    enemy.x += enemy.dx;
    enemy.y += enemy.dy;
    
   if (enemy.x <= 0 || enemy.x + enemy.size >= canvas.width) {
        enemy.dx *= -1;
    }

    if (enemy.y <= 0 || enemy.y + enemy.size >= canvas.height) {
        enemy.dy *= -1;
    }
}

function updateDamaginEnemy() {
    enemyD.x += enemyD.dx;
    enemyD.y += enemyD.dy;

     if (enemyD.x <= 0 || enemyD.x + enemyD.size >= canvas.width) {
                enemyD.dx *= -1;
            }

     if (enemyD.y <= 0 || enemyD.y + enemyD.size >= canvas.height) {
                enemyD.dy *= -1;
            }
    
}


function checkCollision(enemy) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < player.size) {
        score++;
        document.getElementById('score').textContent = score;
        enemy.x = Math.random() * (canvas.width - enemy.size);
        enemy.y = Math.random() * (canvas.height - enemy.size);
        enemy.dx *= 1.10;
        enemy.dy *= 1.10; 
    }
}

function checkDamaginEnemyCollision() { 
    const dx = player.x - enemyD.x;
    const dy = player.y - enemyD.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < (player.size / 2) + (enemyD.size / 2)) {
                loseLife();
    enemyD.x = Math.random() * (canvas.width - enemyD.size);
    enemyD.y = Math.random() * (canvas.height - enemyD.size);
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
    enemies.forEach(enemy => {
        updateEnemy(enemy);
        checkCollision(enemy);
     });

     updateDamaginEnemy();
    checkDamaginEnemyCollision();

  
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

function resetGame() {
    score = 0;
    lives = 3;
    player.x = 50;
    player.y = 50;
  enemies.forEach(enemy => {
        enemy.x = Math.random() * (canvas.width - enemy.size);
        enemy.y = Math.random() * (canvas.height - enemy.size);
        enemy.dx = 2; // O los valores iniciales que desees
        enemy.dy = 2;
    });
     enemyD.x = Math.random() * (canvas.width - enemyD.size);
            enemyD.y = Math.random() * (canvas.height - enemyD.size);
            enemyD.dx = 3;
            enemyD.dy = -3;

    gameOver = false;
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('game-over').style.display = 'none';
    update();
}

update();