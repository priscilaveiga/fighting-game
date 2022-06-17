/*
The class receive the name Sprite because it's common in gaming development: it has images, movements, for e.g.
*/
class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = {x:0, y:0}}) {
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
        this.offset = offset
    }

    draw() {
        /*
        context.drawImage(this.image, this.position.x, this.position.y, this.image.width * this.scale, this.image.height * this.scale)
        The new method draw will include a crop feature for the shop animation
        */
        context.drawImage(this.image, this.framesCurrent * (this.image.width/ this.framesMax), 0, this.image.width/ this.framesMax, this.image.height, this.position.x - this.offset.x, this.position.y - this.offset.y, 
        (this.image.width/ this.framesMax) * this.scale, this.image.height * this.scale)
    }

    update() {
        this.draw()
        this.animateFrames()
    }

    animateFrames(){
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

//Creating an class player which has images properties (that's why its extends the Sprite class)
class Fighter extends Sprite{
    constructor({ position, velocity, color = 'purple', imageSrc, scale = 1, framesMax = 1, offset = {x:0, y:0}, sprites }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        
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
        //extended from Sprite with values
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites

        let sprite
        for (sprite in this.sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }

        console.log(this.sprites)

    }

    update() {
        this.draw()
        this.animateFrames()

        //updating the attack box according to thw position of the player dynamically
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        //This is a short version of this.position.y = this.position.y + this.velocity.y
        this.position.y += this.velocity.y
        //gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0
            this.position.y = 330 //to correct the gravity and velocity sprites and prevent weird flashes during the image transition
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

    switchSprite (sprite) {
        switch (sprite) {
            case 'idle':
                if( this.image !== this.sprites.idle.image ){
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'run':
                if( this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'jump':
                if(this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'fall':
                if(this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break;
        }
    }

}
