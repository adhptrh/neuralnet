export default class Platform {
    width:number = 100
    height:number = 5
    x:number = Math.floor(Math.random()*401)
    y:number = 0
    color:string = "#000"
    ctx:CanvasRenderingContext2D
    fallSpeed: number = 5

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
        this.y += this.fallSpeed
    }
}