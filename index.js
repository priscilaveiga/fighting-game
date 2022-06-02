//Setting the canvas to a 2d
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

//Changing the size of the canvas to fill in the most common screens
canvas.width = 1024
canvas.height = 576

//Changing the canvas' color
context.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

/*Creating an object player
The class receive the name Sprite because it's common in gaming development: it has images, movements, for e.g.
*/
class Sprite {
    constructor({ position, velocity, color = 'purple', offset }) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        //attack box
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: offset,
            width: 100,
            height: 50
        }
        this.color = color
        this.isAttacking
        this.health = 100
    }

    draw() {
        context.fillStyle = this.color
        context.fillRect(this.position.x, this.position.y, this.width, this.height)

        //attack box
        if (this.isAttacking) {
            context.fillStyle = 'green'
            context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }

    update() {
        this.draw()

        //updating the attack box according to thw position of the player dynamically
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        //This is a short version of this.position.y = this.position.y + this.velocity.y
        this.position.y += this.velocity.y
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else this.velocity.y += gravity //adding gravity to a player when it's above the canvas.height

        this.position.x += this.velocity.x
    }

    attack() {
        this.isAttacking = true
        //We would like to attack just for a certain amount of time
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    }
})


const enemy = new Sprite({
    position: {
        x: 900,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
})



console.log(player)

//to keep good accuracy in our game  we are creating an obj keys which contain the keys obj - when the keys are pressed
const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }

}

function rectangleCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.attackBox.position.y + rectangle2.attackBox.height
    )
}

function determineWinners({ player, enemy, timerId}) {
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

let timer = 50
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if (timer === 0) {
        determineWinners({player, enemy, timerId})
    }
}

decreaseTimer()

//Creating an animation for players -> this is a loop to repeat the sequence of movements
function animate() {
    window.requestAnimationFrame(animate)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    //player movement
    player.velocity.x = 0
    //to accurate our movement x
    if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    } else if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    }

    //enemy movement
    enemy.velocity.x = 0
    if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    } else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    }

    //detect for collision
    /* 1st case: the player is touching the enemy, 2nd case: limiting when the player is touching the enemy and passed their, 3rd case: the player is jumping and touching the enemy or vice verse
    */
    if (
        rectangleCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking
    ) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (
        rectangleCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    if (player.health <=0 || enemy.health<=0) {
        determineWinners({player, enemy, timerId})

    }


}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -10
            break

        //attacking key
        case ' ':
            player.attack()
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -10
            break

        //enemy attacking key
        case 'ArrowDown':
            enemy.attack()
            break
    }
    //console.log(event.key)

})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    //enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
    //console.log(event.key)

})

