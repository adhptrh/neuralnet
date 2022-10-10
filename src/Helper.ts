function checkCollision(obj1:any, obj2:any) {
    if (
        obj1.x + obj1.width >= obj2.x &&
        obj1.y + obj1.height >= obj2.y &&
        obj2.x + obj2.width >= obj1.x &&
        obj2.y + obj2.height >= obj1.y
    ) {
        return true
    }
}
function getDistanceEncoded(rect1:any,rect2:any) {
    return (Math.sqrt((rect2.x-rect1.x)**2 + (rect2.y-rect1.y)**2) - 250)/(250)
}
function randomFloat(min:number,max:number) {
    return Math.random()*(max-min)+min
}
export {
    checkCollision,
    randomFloat,
    getDistanceEncoded
}