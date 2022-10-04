import Platform from "./Platform"
import Player from "./Player"

export default class Game {
    canvas:HTMLCanvasElement = document.createElement("canvas")
    ctx:CanvasRenderingContext2D
    bots:Array<Player> = []
    platforms:Array<Platform> = []
    instance:Game

    constructor() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.ctx = this.canvas.getContext("2d")
        this.bots.push(new Player(this.ctx))
        this.platforms.push(new Platform(this.ctx))
    }

    show() {
        document.body.appendChild(this.canvas)
    }

    loop() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)

        this.updateBots(this.platforms)
        this.updatePlatforms()

        this.renderPlatforms()
        this.renderBots()
        requestAnimationFrame(()=>this.loop())
    }

    updateBots(platforms:Array<Platform>) {
        for (let i=0;i<this.bots.length;i++) {
            this.bots[i].update()
        }
    }

    updatePlatforms() {
        for (let i=0;i<this.platforms.length;i++) {
            this.platforms[i].update()
        }
    }

    renderBots() {
        for (let i=0;i<this.bots.length;i++) {
            this.bots[i].draw()
        }
    }

    renderPlatforms() {
        for (let i=0;i<this.platforms.length;i++) {
            this.platforms[i].draw()
        }
    }
}