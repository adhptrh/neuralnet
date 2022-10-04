import Platform from "./Platform"

export default class Player {
    color: string = "#000"
    x: number = 0
    y: number = 0
    velX: number = 0
    velY: number = 0
    maxVelX: number = 0
    maxVelY: number = 40
    jumpHeight:number = -25
    width: number = 50
    height: number = 50
    ctx:CanvasRenderingContext2D
    
    constructor(ctx:CanvasRenderingContext2D) {
        this.ctx = ctx
    }

    draw() {
        this.ctx.fillStyle = this.color
        this.ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        )
    }

    update() {
        this.gravity()
        this.y += this.velY
    }

    gravity() {
        this.velY += 1
        if (this.velY >= this.maxVelY) this.velY = this.maxVelY
    }

    jump() {
        this.velY = this.jumpHeight
    }
}