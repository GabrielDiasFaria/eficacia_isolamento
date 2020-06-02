let balls = []
const app = document.getElementById('div_canvas');
const gameWindow = createCanvas(app, 400, 400);
const gameDiv = 20;
let intervals = []

class Ball {
    constructor(gameWindow, gameContext, gameDiv, id, infected, movable) {
        this.id = id
        this.gameWindow = gameWindow
        this.gameContext = gameContext
        this.gameDiv = gameDiv
        this.x = getRndInteger(1, this.gameWindow.width)
        this.y = getRndInteger(1, this.gameWindow.height)
        this.dx = 1
        this.dy = 1
        this.radius = 5
        this.velocity = 10
        this.infected = infected
        this.stepInfected = 0
        this.movable = movable
    }

    setColor() {
        if (this.infected == "INFECTED")
            return "#ff0000"
        else if (this.infected == "NORMAL")
            return "#0066ff"
        else if (this.infected == "HEALED")
            return "#00ff00"
    }

    update() {
        if (this.infected == "INFECTED")
            this.stepInfected++

        if (this.stepInfected == 1000 && this.infected == "INFECTED") {
            this.stepInfected = 0
            this.infected = "HEALED"
        }

        // Boundary Logic
        if (this.movable) {
            if (this.x < 0 || this.x > this.gameWindow.width) this.dx = -this.dx;
            if (this.y < 0 || this.y > this.gameWindow.height) this.dy = -this.dy;
            this.x += this.dx;
            this.y += this.dy;
        }

        this.checkCollision()

        this.draw()
    }

    draw() {
        this.gameContext.beginPath();
        this.gameContext.fillStyle = this.setColor();
        // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
        this.gameContext.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.gameContext.closePath();
        this.gameContext.fill();

        // this.gameContext.fillText(this.stepInfected, this.x - 2, this.y - 7)
    }

    checkCollision() {
        balls.forEach(ball => {
            var aCircle = [ball.x, ball.y];
            var circle = [this.x, this.y];
            if (ball.id != this.id) {
                var dist = Math.hypot(aCircle[0] - circle[0], aCircle[1] - circle[1]);
                if (dist <= (this.radius * 2)) {
                    if (ball.infected == "INFECTED" && this.infected != "HEALED")
                        this.infected = "INFECTED"
                    let rdm = getRndInteger(1, 10)
                    if (rdm <= 10)
                        this.dx = -this.dx;
                    else if (rdm > 10 && rdm <= 20)
                        this.dy = -this.dy;
                    else if (rdm > 20 && rdm <= 30)
                        this.dx = +this.dx;
                    else if (rdm > 30 && rdm <= 40)
                        this.dy = +this.dy;
                }

            }
        });
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function createCanvas(app, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    app.appendChild(canvas);
    return canvas;
}

function initAnalyse() {

    balls = []
    const gameContext = gameWindow.getContext('2d');

    let infecteds = document.getElementById("infecteds")
    let movable = document.getElementById("movable")
    let imovable = document.getElementById("imovable")

    let totalTxt = document.getElementById("total")
    let totalInfectedsTxt = document.getElementById("total_infecteds")
    let totalHealedTxt = document.getElementById("total_healed")
    let maxInfectedsTxt = document.getElementById("max_infecteds")

    let total = 0
    let totalInfecteds = 0
    let totalHealed = 0
    let maxInfecteds = 0

    // Infecteds
    for (var i = 0; i < infecteds.value; i++) {
        balls.push(new Ball(gameWindow, gameContext, gameDiv, i, "INFECTED", true))
    }

    // Moveis
    for (var i = 0; i < movable.value; i++) {
        balls.push(new Ball(gameWindow, gameContext, gameDiv, i, "NORMAL", true))
    }

    // Imoveis
    for (var i = 0; i < imovable.value; i++) {
        balls.push(new Ball(gameWindow, gameContext, gameDiv, i, "NORMAL", false))
    }
    // const ball = new Ball(gameWindow, gameContext, gameDiv);

    if (intervals.length == 0) {
        let interval = setInterval(function () {
            gameContext.clearRect(0, 0, gameWindow.width, gameWindow.height);

            total = 0
            totalInfecteds = 0
            totalHealed = 0

            total = balls.length

            balls.forEach(ball => {
                if (ball.infected == "INFECTED")
                    totalInfecteds++
                else if (ball.infected == "HEALED")
                    totalHealed++

                if (totalInfecteds > maxInfecteds)
                    maxInfecteds = totalInfecteds

                ball.update()
            });

            totalTxt.value = total
            totalInfectedsTxt.value = totalInfecteds
            totalHealedTxt.value = totalHealed
            maxInfectedsTxt.value = maxInfecteds
        }, 200 / 13);

        intervals.push(interval)
    }
}

window.onload = () => {

    // const app = document.getElementById('div_canvas');
    // const gameWindow = createCanvas(app, 400, 400);
    // const gameContext = gameWindow.getContext('2d');
    // const gameDiv = 20;

    // balls.push(new Ball(gameWindow, gameContext, gameDiv, i, "INFECTED", true))

    // // Moveis
    // for (var i = 0; i < 5; i++) {
    //     balls.push(new Ball(gameWindow, gameContext, gameDiv, i, "NORMAL", true))
    // }

    // // Imoveis
    // for (var i = 0; i < 40; i++) {
    //     balls.push(new Ball(gameWindow, gameContext, gameDiv, i, "NORMAL", false))
    // }
    // // const ball = new Ball(gameWindow, gameContext, gameDiv);

    // setInterval(function () {
    //     gameContext.clearRect(0, 0, gameWindow.width, gameWindow.height);
    //     balls.forEach(ball => {
    //         ball.update()
    //     });

    // }, 200 / 13);

}