//Setting the canvas to a 2d
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

//Changing the size of the canvas to fill in the most common screens
canvas.width = 1024
canvas.height = 576

//Changing the canvas' color
context.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 623,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
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
    },
    imageSrc: './img/samuraiMack/Idle.png',
    scale: 2.5,
    framesMax: 8,
    offset: {
        x:185,
        y:157
    },
    sprites: {
        idle:{
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8,
            image: new Image()
        }
    }
})


const enemy = new Fighter({
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

decreaseTimer()

//Creating an animation for players -> this is a loop to repeat the sequence of movements
function animate() {
    window.requestAnimationFrame(animate)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height) 
    background.update()
    shop.update()
    player.update()
    //enemy.update()

    //player movement
    player.velocity.x = 0
    player.image = player.sprites.idle.image
    //to accurate our movement x
    if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.image = player.sprites.run.image
    } else if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.image = player.sprites.run.image
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

    if (player.health <= 0 || enemy.health <= 0) {
        determineWinners({ player, enemy, timerId })

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

