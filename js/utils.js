function rectangleCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.attackBox.position.y + rectangle2.attackBox.height
    )
}

function determineWinners({ player, enemy, timerId }) {
    //to stop the timer when the health bar is over
    clearTimeout(timerId)
    //property repeated for all the if's
    document.querySelector('#gameResult').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#gameResult').innerHTML = 'Tie'
    }
    else if (player.health > enemy.health) {
        document.querySelector('#gameResult').innerHTML = 'Player 1 Wins'
    }
    else if (player.health < enemy.health) {
        document.querySelector('#gameResult').innerHTML = 'Player 2 Wins'
    }
}

let timer = 60
let timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if (timer === 0) {
        determineWinners({ player, enemy, timerId })
    }
}

function setInitialScale ({ gameHeight, gameWidth}){

    const screenWidth = screen.width > screen.height ? screen.width : screen.height;
    const screenHeight = screen.width > screen.height ? screen.height : screen.width;
    const gameHeightRatio = screenHeight / gameHeight;
    const gameWidthRatio = screenWidth / gameWidth;
    const initialScale = gameWidthRatio <= gameHeightRatio ? gameWidthRatio : gameHeightRatio;
    document.querySelector('meta[name="viewport"]').setAttribute('content', `width=${screenWidth}, height=${screenHeight}, initial-scale=${initialScale}`);
}