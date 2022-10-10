import { checkCollision, getDistanceEncoded, randomFloat, randomInt } from "./Helper"
import NeuralNetwork from "./NeuralNetwork"
import Neuron from "./Neuron"
import Platform from "./Platform"

export default class Player {
    color: string = "#000"
    x: number = 0
    y: number = 0
    velX: number = 0
    velY: number = 0
    maxVelX: number = 0
    maxVelY: number = 40
    jumpHeight:number = -21
    width: number = 50
    height: number = 50
    dead:boolean = false
    onGround:boolean = true
    isMutan:boolean =false
    isOffspring:boolean = false
    ctx:CanvasRenderingContext2D
    canvas:HTMLCanvasElement
    i:number = 0
    inputCount:number = 30
    neuralNetwork:NeuralNetwork
    bruh:Array<string> = ["b","c","d","e"]
    fit: number = 0
    bestBot: boolean = false
    showRaycast:boolean = false
    keepedAlive:boolean = false
    platformDiscovered:Array<Platform> = []
    id:number = Math.floor(Math.random()*(99999-10000))+10000
    
    constructor(canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D) {
        this.ctx = ctx
        this.canvas = canvas
        this.neuralNetwork = new NeuralNetwork()
        this.color = `rgb(${randomInt(0,150)},${randomInt(0,150)},${randomInt(0,150)})`
    }

    draw() {
        this.ctx.fillStyle = this.color
        this.ctx.fillText(`ID: ${this.id}`,this.x,this.y-10)
        this.ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        )
    }

    update(platforms:Array<Platform>) {
        if (this.dead) {
            return
        }
        this.gravity()
        if (this.velX > 0) this.velX--
        if (this.velX < 0) this.velX++
        this.y += this.velY
        this.x += this.velX

        this.onGround = false
        for (let i=0;i<platforms.length;i++) {
            if (checkCollision(this,platforms[i])) {
                let found = false
                for (let ii=0;ii<this.platformDiscovered.length;ii++) {
                    if (this.platformDiscovered[ii].id == platforms[i].id) {
                        found = true
                    }
                }
                if (!found) {
                    this.platformDiscovered.push(platforms[i])
                    this.fit += 1000
                }
                if (this.velY > 0) {
                    this.velY = 4
                    this.y = platforms[i].y - this.height
                }
                this.onGround = true
            }
        }

        this.neuralNetwork.inputs = []
        this.neuralNetwork.inputs.push(this.raycast(platforms,(i:number)=>{
            return {
                x:this.x + (this.width/2) - (5/2),
                y:this.y + (this.height/2) - (i*10),
            }
        }))
        this.neuralNetwork.inputs.push(this.raycast(platforms,(i:number)=>{
            return {
                x:this.x + (this.width/2) - (5/2),
                y:this.y + (this.height/2) + (i*10),
            }
        }))
        for (let ij=1;ij<=6;ij++) {
            this.neuralNetwork.inputs.push(this.raycast(platforms,(i:number)=>{
                return {
                    x:this.x + (this.width/2) - (5/2) + (i*(2*ij)),
                    y:this.y + (this.height/2) - (i*10),
                }
            }))
        }
        for (let ij=1;ij<=6;ij++) {
            this.neuralNetwork.inputs.push(this.raycast(platforms,(i:number)=>{
                return {
                    x:this.x + (this.width/2) - (5/2) - (i*(2*ij)),
                    y:this.y + (this.height/2) - (i*10),
                }
            }))
        }
        for (let ij=1;ij<=6;ij++) {
            this.neuralNetwork.inputs.push(this.raycast(platforms,(i:number)=>{
                return {
                    x:this.x + (this.width/2) - (5/2) + (i*(2*ij)),
                    y:this.y + (this.height/2) + (i*10),
                }
            }))
        }
        for (let ij=1;ij<=6;ij++) {
            this.neuralNetwork.inputs.push(this.raycast(platforms,(i:number)=>{
                return {
                    x:this.x + (this.width/2) - (5/2) - (i*(2*ij)),
                    y:this.y + (this.height/2) + (i*10),
                }
            }))
        }
        this.neuralNetwork.inputs.push((0-(61/2)+(this.velY+21))/(61/2))
        this.neuralNetwork.inputs.push(this.onGround ? 1:-1)
        this.neuralNetwork.inputs.push((0-(500/2)+this.x)/(500/2))
        this.neuralNetwork.inputs.push((0-(this.canvas.height/2)+this.y)/(this.canvas.height/2))

        let outputId = this.neuralNetwork.calculateOutput()

        switch (outputId) {
            case 0:
                this.jump()
                break;
            case 1:
                this.velX = -15
                break;
            case 2:
                this.velX = 15
                break;
            case 3:
                break;
        }

        if (this.y > this.canvas.height) {
            this.dead = true
        }
        if (!this.dead) {
            this.fit++
        }
        this.i++;
    }
    
    raycast(platforms: Array<Platform>, getXY:Function) {
        let dist = 50
        for (let i=0;i<50;i++) {
            let res = getXY(i)
            let node = {
                x:res.x,
                y:res.y,
                width:5,
                height:5
            }
            if (this.showRaycast) {
                this.ctx.fillStyle = "#888"
                this.ctx.fillRect(
                    node.x,
                    node.y,
                    node.width,
                    node.height
                )
            }
            let found = false
            for (let ii=0;ii<platforms.length;ii++) {
                if (checkCollision(platforms[ii],node)) {
                    dist = i
                    found = true
                    break
                }
            }
            if (found) {
                break
            }
        }
        return (0-(50/2)+dist)/(50/2)
    }

    gravity() {
        this.velY += 1
        if (this.velY >= this.maxVelY) this.velY = this.maxVelY
    }

    jump() {
        if (this.onGround) {
            this.velY = this.jumpHeight
        }
    }
}