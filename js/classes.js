/*
The class receive the name Sprite because it's common in gaming development: it has images, movements, for e.g.
*/
class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1}) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
    }

    draw() {
        /*
        context.drawImage(this.image, this.position.x, this.position.y, this.image.width * this.scale, this.image.height * this.scale)
        The new method draw will include a crop feature for the shop animation
        */
        context.drawImage(this.image, this.framesCurrent * (this.image.width/ this.framesMax), 0, this.image.width/ this.framesMax, this.image.height, this.position.x, this.position.y, 
        (this.image.width/ this.framesMax) * this.scale, this.image.height * this.scale)
    }

    update() {
        this.draw()
        this.framesElapsed++
        if( this.framesElapsed % this.framesHold === 0){
            if (this.framesCurrent < this.framesMax -1){
                this.framesCurrent++
            } else{
                this.framesCurrent = 0
            }
        }
    }


}

//Creating an object player
class Fighter {
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
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
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
