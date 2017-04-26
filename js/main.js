const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width = 800;
const HEIGHT = canvas.height = 800;
document.body.appendChild(canvas);
canvas.style.border = "1px solid black";

//==================================================================================================
// VARIABLES FOR GAME SPEED / TIME / SCORE
//==================================================================================================
var frameCount = 0;
var score = 0;

//==================================================================================================
// HANDLE LOADING IMAGES FOR SPRITES
//==================================================================================================
var playerSprite = new Image();
playerSprite.src = "img/player.png";

// var bulletSprite = new Image();
// bulletSprite.src = "img/player.png";

var enemySprite = new Image();
enemySprite.src = "img/enemy1.png";




// Object to hold all the sprites but need to deal with individual x and ys so the drawing needs to be part of the Enemy/Player/Bullet function etc
// var spriteManager = {};
// spriteManager.enemySprite = new Image();
// spriteManager.enemySprite.src = "img/player.png";

//==================================================================================================
// HANDLE THE PLAYER 
//==================================================================================================
var player = {
    x: 400,
    y: 600,
    speed: 5,
    hp: 10,
    width: 87,
    height: 146 
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
// HANDLE THE ENEMIES
//==================================================================================================
var enemyManager = {};

function Enemy(x, y, speedX, speedY, side, width, height, type, score, id) {
    var newEnemy = {
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY,
        side: side,
        width: width,
        height: height,
        type: type,
        score: score,
        id: id
    };
    enemyManager[id] = newEnemy;
}

function CreateEnemy() {
    var x = Math.random() * (WIDTH - 200) + (100);
    var y = 0;
    var speedX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(-2))) + Math.ceil(-2);
    var speedY = 3;
    var side = "enemy";
    var width = 63;
    var height = 119;
    var type = "unit";
    var score = 1;
    var id = Math.random();

    Enemy(x, y, speedX, speedY, side, width, height, type, score, id);
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
        player.x += player.speed;
    } else if (leftPressed && player.x > 0) {
        player.x -= player.speed;
    } else if (upPressed && player.y > 0) {
        player.y -= player.speed;
    } else if (downPressed && player.y < HEIGHT - player.height) {
        player.y += player.speed;
    }
}

//==================================================================================================
// HANDLE COLLISION DETECTION FUNCTIONS
//==================================================================================================
function CheckDistance(actor1, actor2) {
    var dx = actor1.x - actor2.x;
    var dy = actor1.x - actor2.y;

    return Math.sqrt(dx * dx + dy * dy);
}

function CheckCollisionBounds(actor1, actor2) {
    var entity1 = {
        x: actor1.x - actor1.width / 2,
        y: actor1.y - actor1.height / 2,
        width: actor1.width,
        height: actor1.height
    }

    var entity2 = {
        x: actor2.x - actor2.width / 2,
        y: actor2.y - actor2.height / 2,
        width: actor2.width,
        height: actor2.height
    }

    return CheckCollision(entity1, entity2);
}

function CheckCollision(entity1, entity2) {
    return entity1.x <= entity2.x + entity2.width &&
            entity2.x <= entity1.x + entity1.width &&
            entity1.y <= entity2.y + entity2.height &&
            entity2.y <= entity1.y + entity1.height;
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

    if (actor.type == "unit") {
        if (actor.x + actor.speedX < 0 + actor.width || actor.x + actor.speedX > WIDTH - actor.width) {
            actor.speedX = -actor.speedX;
        }
        actor.x += actor.speedX;
        actor.y += actor.speedY;
    }
}

function Update() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    frameCount++;
    UpdatePlayerPosition();

    if (frameCount % 100 === 0) {
        CreateEnemy();
    }

    for (var bullet in bulletManager) {
        UpdateActor(bulletManager[bullet]);

        var toDelete = false;
        if (bulletManager[bullet].y < 0) {
            toDelete = true;
        }

        if(bulletManager[bullet].side === "player") {
            for (var enemyCheck in enemyManager) {
                var collision = CheckCollisionBounds(bulletManager[bullet], enemyManager[enemyCheck]);

                if(collision) {
                    toDelete = true;
                    score += enemyManager[enemyCheck].score;
                    delete enemyManager[enemyCheck];
                    break;
                }
            }
        }

        if (toDelete) {
            delete bulletManager[bullet];
        }
    }

    for (var enemy in enemyManager) {
        UpdateActor(enemyManager[enemy]);

        var deleting = false;
        if (enemyManager[enemy].y > HEIGHT) {
            deleting = true;
        }

        var collided = CheckCollisionBounds(player, enemyManager[enemy]);

        if (collided) {
            player.hp -= 1;
            console.log('player hp ' + player.hp);            
            deleting = true;
        }

        if (deleting) {
            delete enemyManager[enemy];
        }
    }

    //==================================================
    // THIS PRINTS THE NUMBER OF BULLETS IN THE BULLETLIST(MANAGER)
    // var size = Object.keys(enemyManager).length;
    // console.log(size);
    //===================================================

    Draw();    
    requestAnimationFrame(Update);
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

    if (actor.side === "enemy") {
        ctx.drawImage(enemySprite, actor.x, actor.y);
    }
    ctx.restore();
}

function DrawScore(){
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, 8, 20);
}

function Draw() {
    DrawActor(player);
    DrawScore();
    ctx.drawImage(playerSprite, player.x, player.y);
   

    // for (var img in spriteManager) {
    //     ctx.drawImage(spriteManager[img], player.x, player.y);
    // }
}

//setInterval(Update, 10);
Update();
