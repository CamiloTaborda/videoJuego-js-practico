const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const btnUp = document.querySelector("#up");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const btnDown = document.querySelector("#down");
const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#time");
const spanRecord = document.querySelector("#record");
const pResult = document.querySelector("#result");

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined
};

const gifPosition = {
    x: undefined,
    y: undefined
};

let enemyPositions = [];

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function fixNumber(n) {
    return Number(n.toFixed(2));
  }

function setCanvasSize () {

    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.7;
    } else {
        canvasSize = window.innerHeight * 0.7;
    }

    canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute("width", canvasSize);
    canvas.setAttribute("height", canvasSize);

    elementsSize = canvasSize / 10;

    playerPosition.x = undefined;
    playerPosition.y = undefined;

    startGame();
}


function startGame () {

    game.font = `${elementsSize}px Verdana`;
    game.textAlign = "end";

    const map = maps[level];

    if (!map) {
        gameWin();
        return;
    }

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    
    showLives();

    enemyPositions = []
    game.clearRect(0, 0, canvasSize, canvasSize);
    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);

            if (col == 'O') {
                if (!playerPosition.x && !playerPosition.y) {
                playerPosition.x = posX;
                playerPosition.y = posY;
                }
            } else if (col == 'I') {
                gifPosition.x = posX;
                gifPosition.y = posY;
            } else if (col == 'X') {
            enemyPositions.push({
                x: posX,
                y: posY
            });
        }
            game.fillText(emoji, posX, posY);
        })
    })
    movePlayer();
}

function movePlayer() {
    const gifCollisionX = playerPosition.x.toFixed(3) == gifPosition.x.toFixed(3);
    const gifCollisionY = playerPosition.y.toFixed(3) == gifPosition.y.toFixed(3);
    const gifCollision = gifCollisionX && gifCollisionY;

    if (gifCollision) {
        levelWin();
    }

    const enemyCollision = enemyPositions.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY;
    });

    if (enemyCollision) {
       levelFail();
    }

     game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin () {
    console.log("subiste nivel");
    level++;
    startGame();
}

function levelFail() {
    lives--;
   if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
   }

   playerPosition.x = undefined;
   playerPosition.y = undefined;
   startGame();
}

function gameWin() {
    console.log("Terminaste el juego!!");
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if (recordTime) { 
        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = "Superaste el Record!!";
        } else {
            pResult.innerHTML = "No superaste el Record";
        }
    } else {
      localStorage.setItem('record_time', playerTime);
      pResult.innerHTML = 'Inicia un Record !!'
    }

    console.log({recordTime, playerTime});
}

function showLives() {
   const heartsArray = Array(lives).fill(emojis['HEART']);

   spanLives.innerHTML = "";
   heartsArray.forEach(heart => spanLives.append(heart));
    
}

function showTime() {
   spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time');
 }

window.addEventListener("keydown", moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
    // if(event.key === "ArrowUp") moveUp();
    // if(event.key === "ArrowLeft") moveLeft() ;
    // if(event.key === "ArrowRight") moveRight();
    // if(event.key === "ArrowDown") moveDown();
    const moveFunctions = {
        ArrowUp: moveUp,
        ArrowLeft: moveLeft,
        ArrowRight: moveRight,
        ArrowDown: moveDown

      };

    
      const moveFunction = moveFunctions[event.key];
      if (moveFunction) {
        moveFunction();
      }
}

function moveUp () {
    console.log('moviendome hacia arriba')

    if ((playerPosition.y - elementsSize) < 0) {
       console.log("OUT");
    } else {
        playerPosition.y -= elementsSize;
        startGame();
    }
};

function moveLeft () {
    console.log('moviendome hacia izquierda')
    if ((playerPosition.x - elementsSize) < 0) {
        console.log("OUT");
     } else {
         playerPosition.x -= elementsSize;
         startGame();
     }
}

function moveRight () {
    console.log('moviendome hacia derecha')
    if ((playerPosition.x + elementsSize) >= canvasSize) {
        console.log("OUT");
     } else {
         playerPosition.x += elementsSize;
         startGame();
     }
}

function moveDown () {
    console.log('moviendome hacia abajo')
    if ((playerPosition.y + elementsSize) >= canvasSize) {
        console.log("OUT");
     } else {
         playerPosition.y += elementsSize;
         startGame();
     }
}