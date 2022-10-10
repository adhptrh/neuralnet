import { ByPass } from "webpack-dev-server"
import { randomFloat } from "./Helper"
import Platform from "./Platform"
import Player from "./Player"

export default class Game {
    canvas:HTMLCanvasElement = document.createElement("canvas")
    ctx:CanvasRenderingContext2D
    bots:Array<Player> = []
    platforms:Array<Platform> = []
    i:number = 0
    gen:number = 0
    lastBestFit:number = 0
    population:number = 200
    bestSelect:number = 150
    tamat: boolean = false
    currentBestFit: number = 0
    lastPlatformPos: number = 0
    trainingMode:boolean = true
    noAnimation:boolean = true
    avaliablePlatformPos: Array<number> = [0,50,100,150,200,250,300,350,400]
    plannedPlatformPos: Array<number> = [400,0,300,400,200,0,400,200,100,200,0,100,300,200,0,300,400,100,300,200,100,200,400,200,0,100,200,300,200,400,300,100,300,0,400,200,100,300,0,200,400,100,0,200,400,300,0,200,300,400,300,100,200,400,300,200,400,0,200,0,100,300,0,400,100,400,300,100,0,200,400,100,200,400,300,400,200,300,200,300,200,0,100,0,100,0,400,100,0,100,400,0,100,400,300,200,400,100,400,0,300,200,400,300,200,400,100,0,300,400,0,100,300,400,200,0,300,0,200,100,400,200,0,100,200,0,300,0,400,200,400,100,200,0,300,100,400,100,300,100,0,100,300,400,100,300,0,200,300,200,400,300,200,0,200,300,0,300,0,400,200,400,200,300,0,400,0,400,100,400,300,0,300,400,200,0,400,300,200,0,100,300,400,200,0,200,0,200,300,0,300,100,300,100,300,100,0,200,300,400,200,0,300,100,0,400,100,200,0,200,0,100,200,400,200,100,0,300,0,300,400,200,300,200,0,400,200,300,200,400,200,0,100,0,400,200,100,300,400,200,100,200,100,300,200,400,300,400,0,300,100,0,200,400,300,100,0,300,200,100,300,0,100,200,100,0,100,0,400,0,200,400,200,300,200,300,400,100,200,100,300,100,300,200,0,300,0,400,0,100,300,0,400,0,400,100,300,100,0,300,0,200,100,200,0,200,300,200,400,200,400,0,400,300,200,300,200,300,100,200,300,100,0,200,300,400,300,100,300,200,300,100,400,300,0,100,0,200,100,400,100,300,400,200,300,400,0,400,200,100,200,0,200,300,400,300,100,0,300,0,200,0,100,400,300,400,0,200,100,300,400,0,300,0,200,300,0,200,300,0,300,0,200,400,300,400,300,200,400,200,100,400,0,100,300,100,400,0,400,200,0,400,200,300,200,300,200,400,100,400,100,400,100,300,100,0,300,100,300,400,200,400,300,100,200,100,0,100,400,100,400,200,0,200,100,300,0,200,100,400,300,100,300,400,300,200,0,100,400,200,0,100,400,0,200,0,400,100,300,0,200,0,200,0,100,300,0,200,0,300,100,300,400,0,100,300,400,300,400,100,200,100,300,200,0,100,400,0,400,100,400,300,400,100,300,100,200,300,100,200]
    plannedPlatformCur = 0
    constructor() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.ctx = this.canvas.getContext("2d")
        if (this.noAnimation) {
            this.ctx.fillRect = (...a)=>{}
            this.ctx.fillText = (...a)=>{}
        }

        for (let i=1;i<4;i++) {
            let platform = new Platform(this.ctx)
            platform.y = i*30*5
            if (this.trainingMode) {
                platform.x = this.plannedPlatformPos[this.plannedPlatformCur]
            } else {
                platform.x = this.avaliablePlatformPos[Math.floor(Math.random()*this.avaliablePlatformPos.length)]
            }
            this.plannedPlatformCur++
            this.platforms.push(platform)
        }

        for (let i=0;i<this.population;i++) {
            let player = new Player(this.canvas,this.ctx)
            player.x = this.platforms[2].x + (this.platforms[2].width/2) - (player.width/2)
            player.y = this.platforms[2].y - player.height
            this.bots.push(player)
        }
    }

    sortBotsFitnessAscending() {
        for (let i=0;i<this.bots.length-1;i++) {
            for (let ii=i+1;ii<this.bots.length;ii++) {
                if (this.bots[ii].fit > this.bots[i].fit) {
                    let temp = this.bots[i]
                    this.bots[i] = this.bots[ii]
                    this.bots[ii] = temp
                }
            }
        }
    }

    newGen() {
        
        this.currentBestFit = 0
        this.plannedPlatformCur = 0
        this.gen++
        console.log(`Gen: ${this.gen}`)

        this.sortBotsFitnessAscending()
        
        // Eliminate all bots except the best selection
        for (let i=0;i<this.population-this.bestSelect;i++) {
            this.bots.pop()
        }

        let goodGen:Array<Player> = []
        // push the good gen
        for (let i=0;i<this.bots.length;i++) {
            goodGen.push(this.bots[i])
        }

        if (this.bots.length > 0) {
            console.log(this.bots[0])
            this.lastBestFit = this.bots[0].fit
            console.log(`Best Fit: ${this.bots[0].fit}`)
        }
        if (this.tamat) {
            alert("done")
            return
        }
        
        // remove all bots
        for (let i=0;i<this.bestSelect;i++) {
            this.bots.pop()
        }
        
        // population now = 0

        let babies:Array<Player> = []

        // Cross over and mutate
        for (let i=0;i<goodGen.length-1;i++) {
            let baby = new Player(this.canvas,this.ctx)
            baby.weights = {...goodGen[0].weights}
            baby.mutate()
            babies.push(baby)
        }

        this.platforms = []
        for (let i=1;i<4;i++) {
            let platform = new Platform(this.ctx)
            platform.y = i*30*5
            
            if (this.trainingMode) {
                platform.x = this.plannedPlatformPos[this.plannedPlatformCur]
            } else {
                platform.x = this.avaliablePlatformPos[Math.floor(Math.random()*this.avaliablePlatformPos.length)]
            }
            this.plannedPlatformCur++
            this.platforms.push(platform)
        }

        for (let i=0;i<babies.length;i++) {
            let player = new Player(this.canvas,this.ctx)
            player.x = this.platforms[2].x + (this.platforms[2].width/2) - (player.width/2)
            player.y = this.platforms[2].y - player.height
            player.weights = babies[i].weights
            player.isOffspring = true
            this.bots.push(player)
        }

        for (let i=0;i<this.population-babies.length;i++) {
            let player = new Player(this.canvas,this.ctx)
            player.x = this.platforms[2].x + (this.platforms[2].width/2) - (player.width/2)
            player.y = this.platforms[2].y - player.height
            this.bots.push(player)
        }
        console.log(`New Babies: ${babies.length}`)
        console.log(`Population: ${this.bots.length}`)
        this.i = 0
    }

    show() {
        document.body.appendChild(this.canvas)
    }

    loop() {

        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
    
        for (let i=0;i<this.bots.length;i++) {
            if (this.bots[i].fit > this.currentBestFit) {
                this.currentBestFit = this.bots[i].fit
            }
        }
        let allDead = true
        let aliveBots:Array<Player> = []
        for (let i=0;i<this.bots.length;i++) {
            if (this.bots[i].dead == false) {
                allDead = false
                aliveBots.push(this.bots[i])
            }
        }
        if (allDead) {
            this.newGen()
        }

        if (this.i % 30 == 0) {
            /* if (this.plannedPlatformCur == 1000) {
                this.tamat = true
                this.newGen()
                return
            } */
            let platform = new Platform(this.ctx)
            if (this.trainingMode) {
                platform.x = this.plannedPlatformPos[this.plannedPlatformCur]
            } else {
                platform.x = this.avaliablePlatformPos[Math.floor(Math.random()*this.avaliablePlatformPos.length)]
            }
            this.plannedPlatformCur++
            console.log(`Planned Plaform Current: ${this.plannedPlatformCur}`)
            this.platforms.push(platform)
        }

        this.updatePlatforms()
        this.updateBots(this.platforms)

        this.renderPlatforms()
        this.renderBots()
        this.ctx.fillText(`Bots Alive: ${aliveBots.length}`,10,30)
        this.ctx.fillText(`Gen: ${this.gen}`,10,60)
        this.ctx.fillText(`Last Best Fit: ${this.lastBestFit}`,10,90)
        this.ctx.fillText(`Current Best Fit: ${this.currentBestFit}`,10,120)
        this.i++
        if (this.noAnimation) {
            setTimeout(()=>{this.loop()},0)
        } else {
            requestAnimationFrame(()=>{this.loop()})
        }
        
    }

    updateBots(platforms:Array<Platform>) {
        let bestBotFit = 0
        for (let i=0;i<this.bots.length;i++) {
            if (this.bots[i].fit > bestBotFit){
                this.bots[i].bestBot = true
                bestBotFit = this.bots[i].fit
            } else {
                this.bots[i].bestBot = false
            }
        }
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