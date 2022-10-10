import { ActivationFunction, randomFloat } from "./Helper"
import Neuron from "./Neuron"

export default class NeuralNetwork {
    neuronsLayer:Array<number> = [8,10,8,4]
    mutateRate:number = 20
    neurons:Array<Array<Neuron>> = []
    inputCount:number = 30
    weights:{[key:string]:number} = {}
    inputs:Array<number> = []

    constructor() {
        for (let i=0;i<this.neuronsLayer.length;i++) {
            let neurons = []
            for (let ii=0;ii<this.neuronsLayer[i];ii++) {
                neurons.push(new Neuron())
            }
            this.neurons.push(neurons)
        }

        for (let i=0;i<this.neurons[0].length;i++) {
            for (let ii=0;ii<this.inputCount;ii++) {
                this.weights[`0${i}${ii}`] = randomFloat(-1,1)
            }
        }
        
        for (let i=1;i<this.neurons.length;i++) {
            for (let ii=0;ii<this.neurons[i].length;ii++) {
                for (let iii=0;iii<this.neurons[i-1].length;iii++) {
                    this.weights[`${i*100}${ii}${iii}`] = randomFloat(-1,1)
                }
            }
        }
    }

    calculateOutput() {
        for (let i=0;i<this.neurons[0].length;i++) {
            let output = 0
            for (let ii=0;ii<this.inputs.length;ii++) {
                output += this.inputs[ii]*this.weights[`0${i}${ii}`]
            }
            output = ActivationFunction.relu(output)
            this.neurons[0][i].output = output
        }

        for (let i=1;i<this.neurons.length;i++) {
            for (let ii=0;ii<this.neurons[i].length;ii++) {
                let output = 0
                for (let iii=0;iii<this.neurons[i-1].length;iii++) {
                    output += this.neurons[i-1][iii].output*this.weights[`${i*100}${ii}${iii}`]
                }
                this.neurons[i][ii].output = ActivationFunction.relu(output)
            }
        }
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
        return outputId
    }

    mutate() {
        let pickCount = Math.floor(Math.random()*this.mutateRate)+1
        for (let i=0;i<pickCount;i++) {
            let randomMutateWeight = Math.floor(Math.random()*Object.keys(this.weights).length)
            this.weights[Object.keys(this.weights).at(randomMutateWeight)] = randomFloat(-1,1)
        }
    }
}