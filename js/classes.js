/*
The class receive the name Sprite because it's common in gaming development: it has images, movements, for e.g.
*/
class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = {x:0, y:0}, audios}) {
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
        this.audios = audios
    }

    draw() {
        /*
        context.drawImage(this.image, this.position.x, this.position.y, this.image.width * this.scale, this.image.height * this.scale)
        The new method draw will include a crop feature for the shop animation
        */
        context.drawImage(this.image, this.framesCurrent * (this.image.width/ this.framesMax), 0, this.image.width/ this.framesMax, this.image.height, this.position.x - this.offset.x, this.position.y - this.offset.y, 
        (this.image.width/ this.framesMax) * this.scale, this.image.height * this.scale)
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

    update() {
        this.draw()
        this.animateFrames()
    }
}

//Creating an class player which has images properties (that's why its extends the Sprite class)
class Fighter extends Sprite{
    constructor({ position, velocity, color = 'purple', imageSrc, scale = 1, framesMax = 1, offset = {x:0, y:0}, sprites, attackBox = { offset:{}, width: undefined, height: undefined}, audios}) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset,
            audios
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
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.isAttacking
        this.health = 100
        //extended from Sprite with values
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites
        this.dead = false
        
        for ( const sprite in this.sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }

        for ( const audio in this.audios){
            audios[audio] = new Howl({
                src: audios[audio].audioSrc, 
                html5: audios[audio].html5,
                mute: audios[audio].mute
            })
        }
    }

    update() {
        this.draw()
        if (!this.dead) this.animateFrames()

        // updating the attack box according to the position of the player dynamically
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        // draw the attack box
        //context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        //This is a short version of this.position.y = this.position.y + this.velocity.y
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        //gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0
            this.position.y = 330 //to correct the gravity and velocity sprites and prevent weird flashes during the image transition
        } else this.velocity.y += gravity //adding gravity to a player when it's above the canvas.height
        

    }

    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true
        this.audios.attack.play()
    }

    takeHit(){
        this.health -= 20
        if (this.health <=0){
            this.switchSprite('death')
        } else {
            this.switchSprite('takeHit')
            this.audios.death.play()
        }
    }

    switchSprite (sprite) {
        // overriding death animation - not allowing any other animation after death
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1)
                this.dead = true
            return
        }

        // overriding all the other animations with the attack animation
        if(
            this.image === this.sprites.attack1.image &&
            this.framesCurrent < this.sprites.attack1.framesMax - 1
        ) return
        
        // overriding when fighter gets hit
        if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1)
        return

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
            case 'attack1':
                if(this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'takeHit':
                if(this.image !== this.sprites.takeHit.image){
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'death':
            if(this.image !== this.sprites.death.image){
                this.image = this.sprites.death.image
                this.framesMax = this.sprites.death.framesMax
                this.framesCurrent = 0
            }
            break;
        }
    }
}
