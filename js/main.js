const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width = 800;
const HEIGHT = canvas.height = 800;
document.body.appendChild(canvas);
canvas.style.border = "1px solid black";

//==================================================================================================
// HANDLE THE PLAYER 
//==================================================================================================
var playerX = 400;
var playerY = 600;
var playerWidth = 50;
var playerHeight = 50;

function DrawPlayer() {
    ctx.beginPath();
    ctx.rect(playerX, playerY, playerWidth, playerHeight);
    ctx.fillStyle = "#0095D";
    ctx.fill();
    ctx.closePath();
}

//==================================================================================================
// HANDLE PLAYER MOVEMENT
//==================================================================================================
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

document.addEventListener("keydown", KeyDownHandler, false);
document.addEventListener("keyup", KeyUpHandler, false);

function KeyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    } else if (e.keyCode == 38) {
        upPressed = true;
    } else if (e.keyCode == 40) {
        downPressed = true;
    }
}

function KeyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    } else if (e.keyCode == 38) {
        upPressed = false;
    } else if (e.keyCode == 40) {
        downPressed = false;
    }
}


//==================================================================================================
// HANDLE RENDERING THE SPRITES
//==================================================================================================
function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    DrawPlayer();

    if (rightPressed && playerX < WIDTH-playerWidth) {
        playerX += 7;
    } else if (leftPressed && playerX > 0) {
        playerX -= 7;
    } else if (upPressed && playerY > 0){
        playerY -= 7;
    } else if (downPressed && playerY < HEIGHT - playerHeight) {
        playerY += 7;
    }
}
setInterval(draw, 10);

