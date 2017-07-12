const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width = 800;
const HEIGHT = canvas.height = 1048;
document.body.appendChild(canvas);
canvas.style.border = "1px solid black";

//==================================================================================================
// VARIABLES FOR GAME SPEED / TIME / SCORE
//==================================================================================================
var frameCount = 0;
var score = 0;
var paused = false;

//==================================================================================================
// HANDLE LOADING IMAGES FOR SPRITES
//==================================================================================================
var playerSprite = new Image();
playerSprite.src = "img/player.png";

var bulletSprite = new Image();
bulletSprite.src = "img/pBullet.png";

var enemySprite = new Image();
enemySprite.src = "img/enemy1.png";

var backgroundImg = new Image();
backgroundImg.src = "img/background.png";
var bgx = 0;
var bgy = 0;

var backgroundImg2 = new Image();
backgroundImg2.src = "img/background.png";
var bg2x = 0;
var bg2y = 0 - HEIGHT;

// Object to hold all the sprites but need to deal with individual x and ys so the drawing needs to be part of the Enemy/Player/Bullet function etc
// var spriteManager = {};
// spriteManager.enemySprite = new Image();
// spriteManager.enemySprite.src = "img/player.png";

//==================================================================================================
// HANDLE THE PLAYER 
//==================================================================================================
var player = {
    x: 400,
    y: 900,
    speed: 5,
    hp: 5,
    width: 80,
    height: 140
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
    var width = 11;
    var height = 11;
    var id = Math.random();
    var type = "bullet";

    Bullet(x, y, speed, side, width, height, type, id)
}

function CreateEnemyBullet(enemy) {
    var x = enemy.x + (enemy.width / 2) - 10;
    var y = enemy.y;
    var speed = 7;
    var side = "enemy";
    var width = 11;
    var height = 11;
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
    var width = 60;
    var height = 102;
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
var pPressed = false;

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

    if (e.keyCode == 80) {
        pPressed = true;
        paused = !paused;
    }

    if (gameOver && e.keyCode == 13) {
        StartGame();
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
        spacePressed = false;
    }

    if (e.keyCode == 80) {
        pPressed = false;
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
// HANDLE STARING / ENDING GAME
//==================================================================================================
var gameOver = false;

function StartGame() {
    player.hp = 5;
    player.x = 400;
    player.y = 600;
    frameCount = 0;
    score = 0;
    enemyManager = {};
    bulletManager = {};
    gameOver = false;
    bgx = 0;
    bgy = 0;
    bg2x = 0;
    bg2y = 0 - HEIGHT;
}

function GameOver() {

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
    if (!paused) {
        if (!gameOver) {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            DrawBackground();
            frameCount++;
            UpdatePlayerPosition();

            if (frameCount % 100 === 0) {
                CreateEnemy();
            }

            // if (frameCount % 400 === 0) {
            //     //var size = Object.keys(enemyManager).length;
            //     //var rndm = Math.floor(Math.random() * (size - 0) + 0);
            //     //console.log(rndm);
            //     //console.log(size);
            //     //console.log(enemyManager[0].x);
            //     //CreateEnemyBullet(enemyManager);                
            // }

            for (var bullet in bulletManager) {
                UpdateActor(bulletManager[bullet]);

                var toDelete = false;
                if (bulletManager[bullet].y < 0 || bulletManager[bullet].y > HEIGHT) {
                    toDelete = true;
                }

                if (bulletManager[bullet].side === "player") {
                    for (var enemyCheck in enemyManager) {
                        var collision = CheckCollisionBounds(bulletManager[bullet], enemyManager[enemyCheck]);

                        if (collision) {
                            //can remove enemy hp here if any have more than 1 hp
                            toDelete = true;
                            score += enemyManager[enemyCheck].score;
                            delete enemyManager[enemyCheck];
                            break;
                        }
                    }
                }

                if (bulletManager[bullet].side === "enemy") {
                    var collision = CheckCollisionBounds(bulletManager[bullet], player);

                    if (collision) {
                        toDelete = true;
                        break;
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
                    if (player.hp === 0) {
                        gameOver = true;
                        DrawGameOver();
                    }
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
        }
    }
    requestAnimationFrame(Update);
}
//==================================================================================================
// HANDLE RENDERING THE SPRITES
//==================================================================================================
function DrawActor(actor) {
    ctx.save();

    if (actor.side === "enemy") {
        ctx.drawImage(enemySprite, actor.x, actor.y);
    }

    if (actor.side === "player" && actor.type === "bullet") {
        ctx.drawImage(bulletSprite, actor.x, actor.y);
    }

    ctx.restore();
}

function DrawBackground() {
    ctx.drawImage(backgroundImg, 0, bgy);
    ctx.drawImage(backgroundImg, 0, bg2y);
    bgy++;
    bg2y++;

    if (bgy > HEIGHT) {
        bgy = 0 - HEIGHT + 2;
    }

    if (bg2y > HEIGHT) {
        bg2y = 0 - HEIGHT + 2;
    }
}

function DrawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFF";
    ctx.fillText("Score: " + score, 8, 20);
}

function DrawHP() {
    ctx.font = "16px Arial";
    ctx.fillText("HP: " + player.hp, 8, 1030);
}

function DrawGameOver() {
    ctx.font = "32px Arial";
    ctx.fillText("GAME OVER", 300, 200);
    ctx.fillText("Press ENTER to start a new game", 180, 300);
}

function Draw() {
    DrawActor(player);
    if (!gameOver) {
        ctx.drawImage(playerSprite, player.x, player.y);
    }
    DrawScore();
    DrawHP();



    // for (var img in spriteManager) {
    //     ctx.drawImage(spriteManager[img], player.x, player.y);
    // }
}

//setInterval(Update, 10);
Update();
