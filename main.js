// Get the canvas element from the DOM
const canvas = document.getElementById('canvas');
// Get the 2D rendering context
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

const playerImg = new Image();
playerImg.src = "assets/ella.png";

playerImg.onload = () => {
  ctx.drawImage(playerImg, 50, 50, 100, 100);
};

// characters selection object
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