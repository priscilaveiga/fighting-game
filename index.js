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
        x:215,
        y:157
    },
    sprites: {
        idle:{
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc : './img/samuraiMack/TakeHitWhite.png',
            framesMax: 4
        },
        death: {
            imageSrc : './img/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset:{
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    },
    audios:{
        attack:{
            audioSrc: 'audio/Battle_Attack_7.mp3',
            html5: true,
            mute: true
        },
        death:{
            audioSrc: 'audio/Pain_Grunt_1.mp3',
            html5: true,
            mute: true
        }
    }
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    scale: 2.5,
    framesMax: 4,
    offset: {
        x:215,
        y:167
    },
    sprites: {
        idle:{
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc : './img/kenji/Takehit.png',
            framesMax: 3
        },
        death: {
            imageSrc : './img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset:{
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    },
    audios:{
        attack:{
            audioSrc: 'audio/Battle_Attack_12.mp3',
            html5: true,
            mute: true
        },
        death:{
            audioSrc: 'audio/Pain_Grunt_6.mp3',
            html5: true,
            mute: true
        }
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

//Start screen and starting the game after click on button
let gameHasStarted = false
function startGame(){
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)
    background.image.onload = ()=>{
        context.drawImage(background.image, 0, 0)
        context.fillStyle = 'rgba(255, 2555, 255, 0.30)'
        context.fillRect(0, 0, canvas.width, canvas.height)
        document.querySelector('#startGame').style.display = 'block'

    }
    gameHasStarted = true
    if (gameHasStarted){
        document.getElementById('pressStartButton').addEventListener("click", () => {
            document.querySelector('#indexScreen').style.display = 'flex'
            document.querySelector('#startGame').style.display = 'none'
            decreaseTimer()
            animate()
            player.audios.attack.mute(false)
            enemy.audios.attack.mute(false)
            return
        })
    }
} 

startGame()

//Creating an animation for players -> this is a loop to repeat the sequence of movements
function animate() {
    window.requestAnimationFrame(animate)
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height) 
    background.update()
    shop.update()
    context.fillStyle = 'rgba(255, 2555, 255, 0.15)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    // player movement
    player.velocity.x = 0
   
    // to accurate our movement x
    if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else { player.switchSprite('idle')
    }

    // jumping
    if (player.velocity.y < 0){
        player.switchSprite('jump')
    } else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }
    
    // enemy movement
    enemy.velocity.x = 0
    if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else { enemy.switchSprite('idle')
    }

    // jumping
    if (enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    // detect for collision & enemy gets hit
    /* 1st case: the player is touching the enemy, 2nd case: limiting when the player is touching the enemy and passed their, 3rd case: the player is jumping and touching the enemy or vice verse
    */
    if (
        rectangleCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking && player.framesCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false
        // Health bar animation   previous: document.querySelector('#enemyHealth').style.width = enemy.health + '%' 
        gsap.to('#enemyHealth', {
            width:enemy.health + '%'
        })  
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4){
        player.isAttacking = false
    }

    if (
        rectangleCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking && enemy.framesCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#playerHealth', {
            width:player.health + '%'
        })
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2){
        enemy.isAttacking = false
    }

    // end game based on health
    if (player.health <= 0 || enemy.health <= 0) {
        determineWinners({ player, enemy, timerId })
    }
}

window.addEventListener('keydown', (event) => {
    if(!player.dead){
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
        }        
    }
    if(!enemy.dead){
        switch (event.key){
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
    }
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
})