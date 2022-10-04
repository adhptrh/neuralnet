import Platform from "./Platform"
import Player from "./Player"

export default class Game {
    canvas:HTMLCanvasElement = document.createElement("canvas")
    ctx:CanvasRenderingContext2D
    bots:Array<Player> = []
    platforms:Array<Platform> = []
    i:number = 0

    constructor() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.ctx = this.canvas.getContext("2d")

        for (let i=1;i<4;i++) {
            let platform = new Platform(this.ctx)
            platform.y = i*30*5
            this.platforms.push(platform)
        }

        for (let i=0;i<1;i++) {
            let player = new Player(this.canvas,this.ctx)
            player.x = this.platforms[2].x + (this.platforms[2].width/2) - (player.width/2)
            player.y = this.platforms[2].y - player.height
            this.bots.push(player)
        }
    }

    show() {
        document.body.appendChild(this.canvas)
    }

    loop() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)

        if (this.i % 30 == 0) {
            let platform = new Platform(this.ctx)
            this.platforms.push(platform)
        }

        this.updatePlatforms()
        this.updateBots(this.platforms)

        this.renderPlatforms()
        this.renderBots()
        this.i++
        requestAnimationFrame(()=>this.loop())
    }

    updateBots(platforms:Array<Platform>) {
        for (let i=0;i<this.bots.length;i++) {
            this.bots[i].update(platforms)
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