const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width = 800;
const HEIGHT = canvas.height = 800;
document.body.appendChild(canvas);
canvas.style.border = "1px solid black";

//==================================================================================================
// HANDLE THE PLAYER 
//==================================================================================================
var player = {
    x: 400,
    y: 700,
    speed: 7,
    hp: 10,
    height: 50,
    width: 50
};


//==================================================================================================
// HANDLE THE BULLETS
//==================================================================================================
var bulletManager = {};


function Bullet(x, y, speed, side, width, height, type, id) {
    var newBullet = {
        x: x,
        y: y,
        speed: speed,
        side: side,
        width: width,
        height: height,
        type: type,
        id: id
    };
    bulletManager[id] = newBullet;
}


function CreatePlayerBullet() {
    var x = player.x + (player.width / 2) - 10;
    var y = player.y;
    var speed = 7;
    var side = "player";
    var width = 20;
    var height = 20;
    var id = Math.random();
    var type = "bullet";

    Bullet(x, y, speed, side, width, height, type, id)
}
//==================================================================================================
// HANDLE PLAYER MOVEMENT
//==================================================================================================
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;
var spacePressed = false;

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
    } else if (e.keyCode == 32) {
        spacePressed = true;
        CreatePlayerBullet();
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
    } else if (e.keyCode == 32) {

    }
}

function UpdatePlayerPosition() {
    if (rightPressed && player.x < WIDTH - player.width) {
        player.x += 7;
    } else if (leftPressed && player.x > 0) {
        player.x -= 7;
    } else if (upPressed && player.y > 0) {
        player.y -= 7;
    } else if (downPressed && player.y < HEIGHT - player.height) {
        player.y += 7;
    }
}


//==================================================================================================
// UPDATE GAME LOOP
//==================================================================================================
function UpdateActor(actor) {
    UpdateActorPosition(actor);
    DrawActor(actor);
}

function UpdateActorPosition(actor) {
    if (actor.type == "bullet") {
        if (actor.side == "player") {
            actor.y -= actor.speed;
        } else {
            actor.y += actor.speed;
        }
    }

    if (actor.type === "enemy") {
        actor.x += actor.speed;
        actor.y += actor.speed;

        if (actor.x < 0 || actor.x > WIDTH) {
            actor.speed = -actor.speed;
        }
    }
}

function Update() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    UpdatePlayerPosition();

    for (var bullet in bulletManager) {
        UpdateActor(bulletManager[bullet]);

        var toDelete = false;
        if (bulletManager[bullet].y < 0) {
            toDelete = true;
        }

        // Check bullet collision here

        if (toDelete) {
            delete bulletManager[bullet];
        }
    }


    Draw();
}
//==================================================================================================
// HANDLE RENDERING THE SPRITES
//==================================================================================================
function DrawActor(actor) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(actor.x, actor.y, actor.width, actor.height);
    ctx.fillStyle = "#0095D";
    ctx.fill();
    ctx.restore();
}

function Draw() {
    DrawActor(player);
}
setInterval(Update, 10);

