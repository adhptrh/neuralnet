import Game from "./Game"

let game = new Game()
game.show()
game.loop()

window.addEventListener("keydown",(e)=>{
    if (e.code == "Space") {
        game.bots[0].jump()
    }
    if (e.code == "KeyA") {
        game.bots[0].velX = -15
    }
    if (e.code == "KeyD") {
        game.bots[0].velX = 15
    }
    if (e.code == "KeyZ") {
        game.bots.forEach((v)=>{v.showRaycast = !v.showRaycast})
    }
    if (e.code == "KeyX") {
        game.onlyShowBestFit = !game.onlyShowBestFit
    }
})