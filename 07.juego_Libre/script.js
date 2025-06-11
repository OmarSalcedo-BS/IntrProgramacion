
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const scoreDisplay = document.getElementById('scoreDisplay');

const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rigthButton');
const jumpButton = document.getElementById('jumpButton');

let gameStarted = false;
let gameOver = false;
let animationFrameId;
let score = 0;
let maxScore = 0;
let particles = [];
let platformParticles = [];

const player = {
    width: 20,
    height: 40,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 2,
    jumpStrength: -10,
    gravity: 0.2,
    onPlataform: false,
    hue: 0,
    colorSpeed: 5
};

const platform = {
    height: 30,
    width: 80,
    spacingY: 80,
    minX: 20,
    maxX: 20,
    defaultColor: 'green',
    initialPlatformColor: 'red',
    crumbleTime: 190
};

//Array para almacenar las plataformas
const platforms = [];
const initialPlatformCount = 10; //Numero de plataformas


        const keys = {
            left: false,
            right: false,
            jump: false
        };

        function drawPlayer() {
            player.hue = (player.hue + player.colorSpeed) % 360;
            ctx.beginPath();
            ctx.roundRect(player.x, player.y, player.width, player.height, 3); // Bordes ligeramente redondeados
            ctx.fillStyle = `hsl(${player.hue}, 100%, 70%)`;
            ctx.fill();
            ctx.closePath();
        }

        function drawPlatform(plat) {
            ctx.beginPath();
            ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 3);
            ctx.fillStyle = plat.currentColor || plat.color;
            ctx.fill();
            ctx.closePath();
        }

        function generateInitialPlatforms() {
            platforms.length = 0;
            platforms.push({
                x: (canvas.width - platform.width) / 2,
                y: canvas.height - 50,
                width: platform.width,
                height: platform.height,
                color: platform.initialPlatformColor,
                currentColor: platform.initialPlatformColor,
                life: platform.crumbleTime,
                isTouched: false
            });


            for (let i = 1; i < initialPlatformCount; i++) {
                generateNewPlatform(platforms[platforms.length - 1].y - platform.spacingY);
            }
        }


        function generateNewPlatform(yPos) {
            const minPlatformX = platform.minX;
            const maxPlatformX = canvas.width - platform.width - platform.maxX;
            const randomX = Math.random() * (maxPlatformX - minPlatformX) + minPlatformX;

            platforms.push({
                x: randomX,
                y: yPos,
                width: platform.width,
                height: platform.height,
                color: platform.defaultColor,
                currentColor: platform.defaultColor,
                life: platform.crumbleTime,
                isTouched: false
            });
        }

    function getRandomHSLColor() {
            const h = Math.floor(Math.random() * 360); // Hue 0-359
            const s = 70 + Math.floor(Math.random() * 30); // Saturation 70-99%
            const l = 50 + Math.floor(Math.random() * 20); // Lightness 50-69%
            return `hsl(${h}, ${s}%, ${l}%)`;
        }


        function movePlayer() {
            player.vy += player.gravity;

            player.x += player.vx;
            if (player.x < 0) {
                player.x = 0;
            } else if (player.x + player.width > canvas.width) {
                player.x = canvas.width - player.width;
            }

            player.y += player.vy;
        }

        function playerJump() {
            if (player.onPlatform) {
                player.vy = player.jumpStrength;
                player.onPlatform = false; // Ya no está en la plataforma
            }
        }

        // Función para detectar colisiones entre el jugador y las plataformas
        function checkCollisions() {
            player.onPlatform = false;
            let playerLandedOnPlatform = false;

            platforms.forEach(plat => {
               
             if (player.vy >= 0 && // Jugador cayendo o quieto verticalmente
                    player.x < plat.x + plat.width &&
                    player.x + player.width > plat.x &&
                    player.y + player.height > plat.y &&
                    player.y + player.height < plat.y + plat.height + player.vy) { // Colisión en la parte superior de la plataforma

                    if (plat.life > 0) {
                        player.y = plat.y - player.height; 
                        player.vy = 0; 
                        player.onPlatform = true;
                        playerLandedOnPlatform = true; 

                       
                        if (!plat.isTouched) {
                            plat.isTouched = true;
                            plat.currentColor = getRandomHSLColor(); 
                        }
                    }
                }
            });

           
            if (player.y > canvas.height) {
                gameOver = true;
                createParticles ();
            }
        }

        // Función para desplazar las plataformas hacia abajo y generar nuevas
        function scrollPlatforms() {
            
            const scrollThreshold = canvas.height * 0.4; 
            if (player.y < scrollThreshold) {
                const scrollAmount = scrollThreshold - player.y;
                player.y = scrollThreshold; 

                // Desplazar todas las plataformas hacia abajo
                platforms.forEach(plat => {
                    plat.y += scrollAmount;
                });

                // Actualizar la puntuación (altura alcanzada)
                score += Math.round(scrollAmount);
                if (score > maxScore) {
                    maxScore = score;
                }

                for (let i = platforms.length - 1; i >= 0; i--) {
                    if (platforms[i].y > canvas.height + platform.height) {
                        platforms.splice(i, 1);
                    }
                }

                
                while (platforms.length < initialPlatformCount + 2) { 
                    const highestPlatformY = platforms.reduce((minY, p) => Math.min(minY, p.y), Infinity);
                    generateNewPlatform(highestPlatformY - platform.spacingY);
                }
            }
        }

        // Función para actualizar la visualización de la puntuación
        function updateScoreDisplay() {
            scoreDisplay.textContent = `Altura: ${maxScore}`;
        }

        // Función para mostrar el mensaje de juego (Game Over)
        function showMessage(text, color) {
            messageText.textContent = text;
            messageText.style.color = color;
            messageBox.style.display = 'flex';
        }

        // Función para ocultar el mensaje de juego
        function hideMessage() {
            messageBox.style.display = 'none';
        }

        // Función para reiniciar el juego
        function resetGame() {
            gameStarted = false;
            gameOver = false;
            score = 0;
            maxScore = 0;
            updateScoreDisplay();
            hideMessage();

            // Reiniciar posición del jugador
            player.x = (canvas.width - player.width) / 2;
            player.y = canvas.height - player.height - 100; // Posición inicial más alta

            player.vx = 0;
            player.vy = 0;
            player.onPlatform = false;
            player.hue = 0;

            particles.length = 0;

            // Generar plataformas
            generateInitialPlatforms();

            // Detener cualquier animación en curso
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            draw(); // Dibuja el estado inicial
        }

            function createParticles() {
            const particleCount = 50; 
            const particleSize = 8; 
            const maxSpeed = 8; 
            const playerColor = `hsl(${player.hue}, 100%, 70%)`; 

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: player.x + player.width / 2 - particleSize / 2, 
                    y: player.y + player.height / 2 - particleSize / 2,
                    vx: (Math.random() - 0.5) * maxSpeed * 2, 
                    vy: (Math.random() - 1) * maxSpeed, 
                    size: particleSize,
                    life: 100, 
                    color: playerColor 
                });
            }
        }

        function updateParticles() {
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += player.gravity; 
                p.life -= 2; 

                if (p.life <= 0) {
                    particles.splice(i, 1); 
                }
            }
        }

        function drawParticles() {
            particles.forEach(p => {
                ctx.beginPath();
                
                const opacity = p.life / 100; 
                ctx.fillStyle = p.color.replace(')', `, ${opacity})`).replace('hsl', 'hsla');
                ctx.roundRect(p.x, p.y, p.size, p.size, 2);
                ctx.fill();
                ctx.closePath();
            });
        }

        function createPlatformParticles(x, y, width, height, color) {
            const particleCount = 15; 
            const particleSize = 4;
            const maxSpeed = 3; 
            for (let i = 0; i < particleCount; i++) {
                platformParticles.push({
                    x: x + width / 2 + (Math.random() - 0.5) * width, 
                    y: y + height / 2 + (Math.random() - 0.5) * height,
                    vx: (Math.random() - 0.5) * maxSpeed * 2,
                    vy: (Math.random() - 1) * maxSpeed,
                    size: particleSize,
                    life: 80, 
                    color: color
                });
            }
        }

        function updatePlatformParticles() {
            for (let i = platformParticles.length - 1; i >= 0; i--) {
                const p = platformParticles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += player.gravity; 
                p.life -= 2;

                if (p.life <= 0) {
                    platformParticles.splice(i, 1);
                }
            }
        }

        function drawPlatformParticles() {
            platformParticles.forEach(p => {
                ctx.beginPath();
                const opacity = p.life / 80; 
                ctx.fillStyle = p.color.replace(')', `, ${opacity})`).replace('hsl', 'hsla');
                ctx.roundRect(p.x, p.y, p.size, p.size, 2);
                ctx.fill();
                ctx.closePath();
            });
        }

        // Función principal de dibujo
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

            // Dibujar plataformas
            platforms.forEach(plat => drawPlatform(plat));

          if (!gameOver || particles.length === 0) {
                drawPlayer(); 
            }

            
            drawParticles();
            drawPlatformParticles();
        }

        // Bucle principal del juego
        function update() {
            if (gameOver) {
        
                if (particles.length > 0) {
                    updateParticles();
                    draw();
                    animationFrameId = requestAnimationFrame(update); 
                } else {
                   
                    showMessage(`¡Caíste! Fin del Juego. La altura que alcanzaste fue de: ${maxScore}`, "red");
                    saveHighScore(maxScore);
                }

                updatePlatformParticles();
                return;
            }

            // Manejar entrada del jugador
            if (keys.left) {
                player.vx = -player.speed;
            } else if (keys.right) {
                player.vx = player.speed;
            } else {
                player.vx = 0;
            }

            if (keys.jump) {
                playerJump();
                keys.jump = false; // Consumir el salto
            }

            movePlayer();
            checkCollisions();
            scrollPlatforms(); 
            updateScoreDisplay(); 

            for (let i = platforms.length - 1; i >= 0; i--) {
                const plat = platforms[i];
                if (plat.isTouched && plat.life > 0) {
                    plat.life--; 
                    const crumbleOpacity = plat.life / platform.crumbleTime;
                    if (plat.currentColor.startsWith('hsl(')) {
                        plat.currentColor = plat.currentColor.replace(')', `, ${crumbleOpacity})`).replace('hsl', 'hsla');
                    } else { 
                        plat.currentColor = `rgba(160, 174, 192, ${crumbleOpacity})`;
                    }

                } else if (plat.isTouched && plat.life <= 0) {
                   
                    createPlatformParticles(plat.x, plat.y, plat.width, plat.height, plat.currentColor);
                    platforms.splice(i, 1); 

                    
                    if (player.onPlatform &&
                        player.x < plat.x + plat.width &&
                        player.x + player.width > plat.x &&
                        player.y + player.height >= plat.y &&
                        player.y + player.height <= plat.y + plat.height) {
                        player.onPlatform = false;
                        player.vy = player.gravity; 
                    }
                }
            }


            draw(); 
            updatePlatformParticles();

            animationFrameId = requestAnimationFrame(update); 
        }

       
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'Left') {
                keys.left = true;
            } else if (e.key === 'ArrowRight' || e.key === 'Right') {
                keys.right = true;
            } else if (e.key === ' ' || e.key === 'Spacebar') { 
                keys.jump = true;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'Left') {
                keys.left = false;
            } else if (e.key === 'ArrowRight' || e.key === 'Right') {
                keys.right = false;
            } else if (e.key === ' ' || e.key === 'Spacebar') {
                keys.jump = false;
            }
        });

        // Eventos táctiles para los botones en pantalla
        leftButton.addEventListener('touchstart', (e) => { e.preventDefault(); keys.left = true; });
        leftButton.addEventListener('touchend', (e) => { e.preventDefault(); keys.left = false; });
        leftButton.addEventListener('touchcancel', (e) => { e.preventDefault(); keys.left = false; }); 

        rightButton.addEventListener('touchstart', (e) => { e.preventDefault(); keys.right = true; });
        rightButton.addEventListener('touchend', (e) => { e.preventDefault(); keys.right = false; });
        rightButton.addEventListener('touchcancel', (e) => { e.preventDefault(); keys.right = false; });

        jumpButton.addEventListener('touchstart', (e) => { e.preventDefault(); keys.jump = true; });
        jumpButton.addEventListener('touchend', (e) => { e.preventDefault(); keys.jump = false; });
        jumpButton.addEventListener('touchcancel', (e) => { e.preventDefault(); keys.jump = false; });


        // Evento para iniciar el juego
        startButton.addEventListener('click', () => {
            if (!gameStarted && !gameOver) {
                gameStarted = true;
                hideMessage();
                update(); 
            }
        });

       
        restartButton.addEventListener('click', resetGame);

       
        function setupCanvas() {
            
            const containerWidth = canvas.parentElement.clientWidth;
            canvas.width = Math.min(containerWidth * 0.9, 600); 
            canvas.height = canvas.width * 1.5; 

            
            if (canvas.height < 400) {
                canvas.height = 400;
            }

            resetGame(); // Reiniciar el juego cada vez que el canvas se redimensiona
        }

        // Inicializar el juego cuando la ventana carga
        window.onload = setupCanvas;
        window.addEventListener('resize', setupCanvas);