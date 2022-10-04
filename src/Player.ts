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
    dead:boolean = false
    ctx:CanvasRenderingContext2D
    canvas:HTMLCanvasElement
    
    constructor(canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D) {
        this.ctx = ctx
        this.canvas = canvas
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

    update(platforms:Array<Platform>) {
        this.gravity()
        this.y += this.velY

        for (let i=0;i<platforms.length;i++) {
            if (
                this.y + this.height >= platforms[i].y &&
                this.x + this.width >= platforms[i].x &&
                platforms[i].y + platforms[i].height >= this.y &&
                platforms[i].x + platforms[i].width >= this.x
            ) {
                this.y = platforms[i].y - this.height
            }
        }

        if (this.y > this.canvas.height) {
            this.dead = true
        }
    }

    gravity() {
        this.velY += 1
        if (this.velY >= this.maxVelY) this.velY = this.maxVelY
    }

    jump() {
        this.velY = this.jumpHeight
    }
}