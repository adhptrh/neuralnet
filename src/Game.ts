import Platform from "./Platform"
import Player from "./Player"

export default class Game {
    canvas:HTMLCanvasElement = document.createElement("canvas")
    ctx:CanvasRenderingContext2D
    bots:Array<Player> = []
    platforms:Array<Platform> = []
    i:number = 0
    gen:number = 0
    lastPlatformPos: number = 0
    avaliablePlatformPos: Array<number> = [0,100,200,300,400]

    constructor() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.ctx = this.canvas.getContext("2d")

        for (let i=1;i<4;i++) {
            let platform = new Platform(this.ctx)
            platform.y = i*30*5
            this.platforms.push(platform)
        }

        for (let i=0;i<300;i++) {
            let player = new Player(this.canvas,this.ctx)
            player.x = this.platforms[2].x + (this.platforms[2].width/2) - (player.width/2)
            player.y = this.platforms[2].y - player.height
            this.bots.push(player)
        }
    }

    newGen() {
        this.gen++
        for (let i=0;i<this.bots.length-1;i++) {
            for (let ii=i+1;ii<this.bots.length-i;ii++) {
                if (this.bots[ii].fit > this.bots[i].fit) {
                    let temp = this.bots[i]
                    this.bots[i] = this.bots[ii]
                    this.bots[ii] = temp
                }
            }
        }
        for (let i=0;i<250;i++) {
            this.bots.pop()
        }
        let goodGen = []
        for (let i=0;i<this.bots.length;i++) {
            goodGen.push(this.bots[i].weights)
        }
        
        for (let i=0;i<50;i++) {
            this.bots.pop()
        }
        this.platforms = []
        for (let i=1;i<4;i++) {
            let platform = new Platform(this.ctx)
            platform.y = i*30*5
            let pfpos = this.avaliablePlatformPos[Math.floor(Math.random()*this.avaliablePlatformPos.length)]
            while (pfpos == this.lastPlatformPos) {
                pfpos = this.avaliablePlatformPos[Math.floor(Math.random()*this.avaliablePlatformPos.length)]
            }
            this.lastPlatformPos = pfpos
            platform.x = pfpos
            this.platforms.push(platform)
        }
        for (let i=0;i<goodGen.length;i++) {
            let player = new Player(this.canvas,this.ctx)
            player.x = this.platforms[2].x + (this.platforms[2].width/2) - (player.width/2)
            player.y = this.platforms[2].y - player.height
            player.weights = goodGen[i]
            this.bots.push(player)
        }

        for (let i=0;i<250;i++) {
            let player = new Player(this.canvas,this.ctx)
            player.x = this.platforms[2].x + (this.platforms[2].width/2) - (player.width/2)
            player.y = this.platforms[2].y - player.height
            this.bots.push(player)
        }
        this.i = 0
        console.log(this.gen)
    }

    show() {
        document.body.appendChild(this.canvas)
    }

    loop() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
    
        let allDead = true
        for (let i=0;i<this.bots.length;i++) {
            if (this.bots[i].dead == false)[
                allDead = false
            ]
            if (!allDead) break
        }
        if (allDead) {
            this.newGen()
        }

        if (this.i % 30 == 0) {
            let platform = new Platform(this.ctx)
            
            let pfpos = this.avaliablePlatformPos[Math.floor(Math.random()*this.avaliablePlatformPos.length)]
            while (pfpos == this.lastPlatformPos) {
                pfpos = this.avaliablePlatformPos[Math.floor(Math.random()*this.avaliablePlatformPos.length)]
            }
            this.lastPlatformPos = pfpos
            platform.x = pfpos
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