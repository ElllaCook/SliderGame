// Get the canvas element from the DOM
const canvas = document.getElementById('canvas');
// Get the 2D rendering context
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

// ground when taking into account player height 
const groundY = canvas.height - 50; // 550

// win/lose flag
let gameOver = false;

// score trackers
let score = 0; // time survived in seconds
let startTime = null;  
let highScore = localStorage.getItem('highScore') || 0;

// standardised playerImg for testing
const playerImg = new Image();
playerImg.src = "assets/ella.png";

// playerImg.onload = () => {
//   ctx.drawImage(playerImg, 50, 50, 100, 100);
// };

// characters selection object - LATER DEV
const characters = {
    ella: new Image(),
    josh: new Image()
}

characters.ella.src = "assets/ella.png";

// represent player as an object so it is able to be manipulated
const player = {
    image: playerImg,
    x: 50,
    y: 50,
    width: 50,
    height: 50,
    velocityY: 0,
}

// OBSTACLE DEF
let obstacles = [];

function createObstacle() {
    return {
        x: canvas.width, // start off screen to the right
        y: 500, // global var
        width: 30,
        height: 50,
        speed: 6
    };
}

startTime = Date.now(); // milliseconds

// GAME LOOP
function gameLoop() {
    // clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // score updating
    if (!gameOver) {
    const now = Date.now();
    score = Math.floor((now - startTime) / 1000); // convert to seconds
    }

    // IF LOST
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    // show final score
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';  
    ctx.fillText(`Score: ${score}`,canvas.width / 2, canvas.height / 3.4);
    ctx.fillText(`High Score: ${highScore}`,canvas.width / 2, canvas.height / 3);  
    
    
    // show restart button in HTML
    document.getElementById('restartButton').style.display = 'block';
    return;
    }

    // gravity
    player.velocityY += 0.5;
    player.y += player.velocityY;

    // ground collision
    const groundY = canvas.height - 50; // player.height
    if (player.y + player.height > groundY) {
        player.y = groundY - player.height;
        player.velocityY = 0;
    }
    
    // draw everything
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

    // move and draw OBSTACLES
    obstacles.forEach(obs => {
        obs.x -= obs.speed; //move left
        ctx.fillStyle = 'green'; // temp design for obstacle
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // get rid of obs off screen
    obstacles = obstacles.filter(obs => obs.x + obs.width > 0);

    if (Math.random() < 0.01) { // 1% chance per frame
        obstacles.push(createObstacle());
    }

    // COLLISION MECHANICS
    obstacles.forEach(obs => {
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            gameOver = true;
        }
        // HIGH SCORE TRACKER
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore); // save it
    }
    });

    // repeat
    requestAnimationFrame(gameLoop)
}

// ALL USER INPUT MECHANICS 
// TAP TO JUMP + BUTTON CLICKING

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && player.y + player.height >= groundY) {
        player.velocityY = -10;
    }
});

document.addEventListener('click', (e) => {
        if (player.y + player.height >= groundY) {
            player.velocityY = -10;
        }
    });

document.getElementById('restartButton').addEventListener('click', startGame);


// START GAME FUNCTION
function startGame() {
    document.getElementById('restartButton').style.display = 'none';
    // reset player
    player.x = 50;
    player.y = 50;
    player.velocityY = 0;

    // reset obstacles
    obstacles = [];    

    // reset timer
    startTime = Date.now();
    score = 0;

    // reset gameOver flag
    gameOver = false;

    // start game
    gameLoop();
}

// START THE GAME
startGame();
