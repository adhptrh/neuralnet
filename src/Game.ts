import Player from "./Player"

export default class Game {
    canvas:HTMLCanvasElement = document.createElement("canvas")
    ctx:CanvasRenderingContext2D
    bots:Array<Player> = []
    instance:Game

    constructor() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.ctx = this.canvas.getContext("2d")
        this.bots.push(new Player(this.ctx))
    }

    show() {
        document.body.appendChild(this.canvas)
    }

    loop() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.updatePlayer()
        this.renderPlayer()
        requestAnimationFrame(()=>this.loop())
    }

    renderPlayer() {
        for (let i=0;i<this.bots.length;i++) {
            this.bots[i].draw()
        }
    }

    updatePlayer() {
        for (let i=0;i<this.bots.length;i++) {
            this.bots[i].update()
        }
    }
}