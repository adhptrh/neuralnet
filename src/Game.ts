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
    gen:number = 1
    lastBestFit:number = 0
    population:number = 200
    bestSelect:number = 150
    tamat: boolean = false
    currentBestFit: number = 0
    lastPlatformPos: number = 0
    trainingMode:boolean = true
    noAnimation:boolean = false
    genRecord:Array<any> = []
    onlyShowBestFit: boolean = false
    avaliablePlatformPos: Array<number> = [0,50,100,150,200,250,300,350,400]
    plannedPlatformPos: Array<number> = [400,0,300,400,200,0,400,200,100,200,0,100,300,200,0,300,400,100,300,200,100,200,400,200,0,100,200,300,200,400,300,100,300,0,400,200,100,300,0,200,400,100,0,200,400,300,0,200,300,400,300,100,200,400,300,200,400,0,200,0,100,300,0,400,100,400,300,100,0,200,400,100,200,400,300,400,200,300,200,300,200,0,100,0,100,0,400,100,0,100,400,0,100,400,300,200,400,100,400,0,300,200,400,300,200,400,100,0,300,400,0,100,300,400,200,0,300,0,200,100,400,200,0,100,200,0,300,0,400,200,400,100,200,0,300,100,400,100,300,100,0,100,300,400,100,300,0,200,300,200,400,300,200,0,200,300,0,300,0,400,200,400,200,300,0,400,0,400,100,400,300,0,300,400,200,0,400,300,200,0,100,300,400,200,0,200,0,200,300,0,300,100,300,100,300,100,0,200,300,400,200,0,300,100,0,400,100,200,0,200,0,100,200,400,200,100,0,300,0,300,400,200,300,200,0,400,200,300,200,400,200,0,100,0,400,200,100,300,400,200,100,200,100,300,200,400,300,400,0,300,100,0,200,400,300,100,0,300,200,100,300,0,100,200,100,0,100,0,400,0,200,400,200,300,200,300,400,100,200,100,300,100,300,200,0,300,0,400,0,100,300,0,400,0,400,100,300,100,0,300,0,200,100,200,0,200,300,200,400,200,400,0,400,300,200,300,200,300,100,200,300,100,0,200,300,400,300,100,300,200,300,100,400,300,0,100,0,200,100,400,100,300,400,200,300,400,0,400,200,100,200,0,200,300,400,300,100,0,300,0,200,0,100,400,300,400,0,200,100,300,400,0,300,0,200,300,0,200,300,0,300,0,200,400,300,400,300,200,400,200,100,400,0,100,300,100,400,0,400,200,0,400,200,300,200,300,200,400,100,400,100,400,100,300,100,0,300,100,300,400,200,400,300,100,200,100,0,100,400,100,400,200,0,200,100,300,0,200,100,400,300,100,300,400,300,200,0,100,400,200,0,100,400,0,200,0,400,100,300,0,200,0,200,0,100,300,0,200,0,300,100,300,400,0,100,300,400,300,400,100,200,100,300,200,0,100,400,0,400,100,400,300,400,100,300,100,200,300,100,200]
    plannedPlatformCur = 0
    constructor() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.ctx = this.canvas.getContext("2d")
        this.ctx.font = "20px Arial"
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
            baby.neuralNetwork.weights = {...goodGen[0].neuralNetwork.weights}
            baby.neuralNetwork.mutate()
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
            player.neuralNetwork.weights = babies[i].neuralNetwork.weights
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
    
        for (let i=0;i<this.bots.length-1;i++) {
            for (let ii=i+1;ii<this.bots.length;ii++) {
                if (this.bots[ii].fit > this.bots[i].fit) {
                    let temp = this.bots[i]
                    this.bots[i] = this.bots[ii]
                    this.bots[ii] = temp
                }
            }
            this.bots[i].showRaycast = false
        }
        this.bots[0].showRaycast = true

        this.currentBestFit = this.bots[0].fit
        

        let allDead = true
        let aliveBots:Array<Player> = []
        for (let i=0;i<this.bots.length;i++) {
            if (this.bots[i].dead == false) {
                allDead = false
                aliveBots.push(this.bots[i])
            }
        }
        if (allDead) {
            this.genRecord.push({
                gen:this.gen,
                fit:this.currentBestFit,
                color:this.bots[0].color
            })
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
        this.ctx.fillStyle = "#000"
        this.ctx.fillText(`Population: ${aliveBots.length}`,10,30)
        this.ctx.fillText(`Generation: ${this.gen}`,10,60)

        let maxGenRecord = 0
        for (let i=0;i<this.genRecord.length;i++) {
            if (this.genRecord[i].fit > maxGenRecord)[
                maxGenRecord = this.genRecord[i].fit
            ]
        }

        this.ctx.fillText(`Generation`,900,30)
        if (this.genRecord.length > 0) {
            let idx = 0
            for (let i=this.genRecord.length-1;i>this.genRecord.length-1-(this.genRecord.length > 10 ? 10:this.genRecord.length);i--) {
                this.ctx.fillStyle = this.genRecord[i].color
                this.ctx.fillRect(900,40 + (idx*30),(this.genRecord[i].fit/maxGenRecord)*300,20)
                this.ctx.fillText(`Gen: ${this.genRecord[i].gen}, Fitness: ${this.genRecord[i].fit}`,920+((this.genRecord[i].fit/maxGenRecord)*300),58+(idx*30))
                idx++
            }
        } else {
            this.ctx.fillText(`No data.`,900,58)
        }

        this.ctx.fillText(`Leaderboard`,600,30)

        for (let i=0;i<(this.bots.length > 10 ? 10:this.bots.length);i++) {
            this.ctx.fillStyle = this.bots[i].color
            this.ctx.fillRect(600,40 + (i*30),20,20)
            this.ctx.fillText(`ID: ${this.bots[i].id}, Fitness: ${this.bots[i].fit}`,630,58+(i*30))
        }

        this.ctx.fillStyle = "#000"
        this.ctx.fillText(`${this.bots[0].id}'s Neural Network, Output: "${this.bots[0].outputNN}"`,600,360)
        this.ctx.strokeStyle = "#BBB"
        for (let i=0;i<this.bots[0].neuralNetwork.neurons[0].length;i++) {
            for (let ii=0;ii<this.bots[0].neuralNetwork.inputCount;ii++) {
                this.ctx.beginPath();
                this.ctx.moveTo(605, 375+(ii*14))
                this.ctx.lineTo(690,375+(i*14))
                this.ctx.stroke()
                this.ctx.closePath()
            }
        }

        
        for (let i=0;i<this.bots[0].neuralNetwork.neuronsLayer.length;i++) {
            for (let ii=0;ii<this.bots[0].neuralNetwork.neuronsLayer[i];ii++) {
                for (let iii=0;iii<this.bots[0].neuralNetwork.neuronsLayer[i+1];iii++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(690+(i*85), 375+(ii*14))
                    this.ctx.lineTo(690+(i*85)+85,375+(iii*14))
                    this.ctx.stroke()
                    this.ctx.closePath()
                }
            }
        }

        this.ctx.strokeStyle = "#000"
        for (let i=0;i<this.bots[0].neuralNetwork.inputCount;i++) {
            this.ctx.fillStyle = "#000"
            this.ctx.beginPath();
            this.ctx.arc(605, 375+(i*14), 5, 0, 2 * Math.PI);
            this.ctx.fill()
            this.ctx.stroke()
            this.ctx.closePath()
        }



        for (let i=0;i<this.bots[0].neuralNetwork.neuronsLayer.length;i++) {
            let lastOutput = 0
            let toColor = 0
            for (let ii=0;ii<this.bots[0].neuralNetwork.neuronsLayer[i];ii++) {
                if (this.bots[0].neuralNetwork.neurons[i][ii].output > lastOutput) {
                    lastOutput = this.bots[0].neuralNetwork.neurons[i][ii].output
                    toColor = ii
                }
            }
            for (let ii=0;ii<this.bots[0].neuralNetwork.neuronsLayer[i];ii++) {
                if (ii == toColor) {
                    this.ctx.fillStyle = "#000"
                } else {
                    this.ctx.fillStyle = "#FFF"
                }
                this.ctx.beginPath();
                this.ctx.arc(690+(i*85), 375+(ii*14), 5, 0, 2 * Math.PI);
                this.ctx.fill()
                this.ctx.stroke()
                this.ctx.closePath()
            }
        }

        this.i++
        if (this.noAnimation) {
            setTimeout(()=>{this.loop()},0)
        } else {
            requestAnimationFrame(()=>{this.loop()})
        }
        
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
        if (this.onlyShowBestFit) {
            this.bots[0].draw()
        } else {
            for (let i=0;i<this.bots.length;i++) {
                if (!this.bots[i].dead){
                    this.bots[i].draw()
                }
            }
        }
    }

    renderPlatforms() {
        for (let i=0;i<this.platforms.length;i++) {
            this.platforms[i].draw()
        }
    }
}