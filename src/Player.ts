import Neuron from "./Neuron"
import Platform from "./Platform"

function sigmoidSquash2(n:number) {
    return (n>0) ? n:0
}
function sigmoidSquash(n:number) {
    return 1/(1+Math.E**-n)
}

function randomFloat(min:number,max:number) {
    return Math.random()*(max-min)+min
}

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
    ctx:CanvasRenderingContext2D
    canvas:HTMLCanvasElement
    i:number = 0
    inputCount:number = 3
    neuronsLayer:Array<number> = [5,5,4]
    neurons:Array<Array<Neuron>> = []
    weights:{[key:string]:number} = {}
    bruh:Array<string> = ["b","c","d","e"]
    fit: number = 0
    platformDiscovered:Array<Platform> = []
    
    constructor(canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D) {
        this.ctx = ctx
        this.canvas = canvas

        for (let i=0;i<this.neuronsLayer.length;i++) {
            let neurons = []
            for (let ii=0;ii<this.neuronsLayer[i];ii++) {
                neurons.push(new Neuron())
            }
            this.neurons.push(neurons)
        }

        for (let i=0;i<this.neurons[0].length;i++) {
            for (let ii=0;ii<this.inputCount;ii++) {
                this.weights[`a${i}${ii}`] = randomFloat(-1,1)
            }
        }
        
        for (let i=1;i<this.neurons.length;i++) {
            for (let ii=0;ii<this.neurons[i].length;ii++) {
                for (let iii=0;iii<this.neurons[i-1].length;iii++) {
                    this.weights[`${this.bruh[i]}${ii}${iii}`] = randomFloat(-1,1)
                }
            }
        }

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
            if (
                this.y + this.height >= platforms[i].y &&
                this.x + this.width >= platforms[i].x &&
                platforms[i].y + platforms[i].height >= this.y &&
                platforms[i].x + platforms[i].width >= this.x
            ) {
                let found = false
                for (let ii=0;ii<this.platformDiscovered.length;ii++) {
                    if (this.platformDiscovered[ii].id == platforms[i].id) {
                        found = true
                    }
                }
                if (!found) {
                    this.platformDiscovered.push(platforms[i])
                    this.fit++
                }
                if (this.velY > 0) {
                    this.velY = 4
                    this.y = platforms[i].y - this.height
                }
                this.onGround = true
            }
        }
        
        let inputs:Array<number> = []

        this.ctx.fillStyle = "#F00"
        let detector = {
            x:0,
            y:this.y-100,
            width:this.canvas.width,
            height:100,
        }

        let input2:number = -1
        let input3:number = -1
        let input4:number = -1
        for (let i=0;i<platforms.length;i++) {
            if (
                platforms[i].y+platforms[i].height >= detector.y &&
                platforms[i].y<=detector.y+detector.height
            ) {
                input2 = (0-200+platforms[i].x)/200
            }
        }
        inputs.push(input2)
        inputs.push((-20+(this.velY+21))/20)
        
        let detector2 = {
            x:0,
            y:this.y+this.height,
            width:this.canvas.width,
            height:50,
        }

        for (let i=0;i<platforms.length;i++) {
            if (
                platforms[i].y+platforms[i].height >= detector.y &&
                platforms[i].y<=detector2.y+detector2.height
            ) {
                input3 = (0-200+platforms[i].x)/200
            }
        }
        inputs.push(input3)

        for (let i=0;i<this.neurons[0].length;i++) {
            let output = 0
            for (let ii=0;ii<inputs.length;ii++) {
                output += inputs[ii]*this.weights[`a${i}${ii}`]
            }
            output = sigmoidSquash(output)
            this.neurons[0][i].output = output
        }

        for (let i=1;i<this.neurons.length;i++) {
            for (let ii=0;ii<this.neurons[i].length;ii++) {
                let output = 0
                for (let iii=0;iii<this.neurons[i-1].length;iii++) {
                    output += this.neurons[i-1][iii].output*this.weights[`${this.bruh[i]}${ii}${iii}`]
                }
                this.neurons[i][ii].output = sigmoidSquash(output)
            }
        }
        this.ctx.font = "20px Arial"
        /* this.ctx.fillText(this.neurons[this.neurons.length-1][0].output.toString(),this.x,this.y-50)
        this.ctx.fillText(this.neurons[this.neurons.length-1][1].output.toString(),this.x,this.y-30)
        this.ctx.fillText(this.neurons[this.neurons.length-1][2].output.toString(),this.x,this.y-10) */
        this.ctx.fillText(this.fit.toString(),this.x,this.y-10)

        let best = -1
        let outputId = -1
        for (let i=0;i<this.neurons[this.neurons.length-1].length;i++) {
            let yes = 0
            for (let ii=0;ii<this.neurons[this.neurons.length-1].length;ii++) {
                if (this.neurons[this.neurons.length-1][i].output > this.neurons[this.neurons.length-1][ii].output) {
                    yes += 1
                }
            }
            if (yes > best) {
                best = yes
                outputId = i
            }
        }

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
        this.i++;

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