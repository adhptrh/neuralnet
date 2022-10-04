export default class Platform {
    width:number = 100
    height:number = 10
    x:number = 0
    y:number = 300
    color:string = "#000"
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

    }
}