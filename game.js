let balls = []
const app = document.getElementById('div_canvas');
var chLine = document.getElementById("chLine");
const gameWindow = createCanvas(app, 400, 400);
const gameDiv = 20;
let intervals = []

let colorInfected = "#ff0000"
let colorHealed = "#00ff00"
let colorNormal = "#0066ff"

let secondsChart = []
let secondsInfected = []//[589, 445, 483, 503, 689, 692, 634]
let secondsHealed = []
let secondsNormal = []

class Ball {
    constructor(gameWindow, gameContext, gameDiv, id, infected, movable) {
        this.id = id
        this.gameWindow = gameWindow
        this.gameContext = gameContext
        this.gameDiv = gameDiv
        this.marginScreenX = 5
        this.marginScreenY = 5
        this.x = getRndInteger(this.marginScreenX, this.gameWindow.width - this.marginScreenX)
        this.y = getRndInteger(this.marginScreenY, this.gameWindow.height - this.marginScreenY)
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
            return colorInfected
        else if (this.infected == "NORMAL")
            return colorNormal
        else if (this.infected == "HEALED")
            return colorHealed
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
            if (this.x < this.marginScreenX || this.x > this.gameWindow.width - this.marginScreenX) this.dx = -this.dx;
            if (this.y < this.marginScreenY || this.y > this.gameWindow.height - this.marginScreenY) this.dy = -this.dy;
            this.x += this.dx;
            this.y += this.dy;
        }

        this.checkCollision()

        this.draw()

        // if (this.x < this.marginScreenX - this.radius || this.x > this.gameWindow.width - this.marginScreenX + this.radius)
        //     this.x = getRndInteger(this.marginScreenX, this.gameWindow.width - this.marginScreenX)

        // if (this.y < this.marginScreenY - this.radius || this.y > this.gameWindow.height - this.marginScreenY + this.radius)
        //     this.y = getRndInteger(this.marginScreenY, this.gameWindow.height - this.marginScreenY)
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
                    let rdm = getRndInteger(1, 40)
                    if (
                        this.x < this.marginScreenX ||
                        this.x > this.gameWindow.width - this.marginScreenX ||
                        this.y < this.marginScreenY ||
                        this.y > this.gameWindow.height - this.marginScreenY
                    ) { } else {
                        if (rdm <= 10 && this.x < 0)
                            this.dx = -this.dx;
                        if (rdm > 10 && rdm <= 20)
                            this.dy = -this.dy;
                        if (rdm > 20 && rdm <= 30)
                            this.dx = -this.dx;
                        if (rdm > 30 && rdm <= 40)
                            this.dy = -this.dy;
                    }
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

    chart()

    balls = []
    const gameContext = gameWindow.getContext('2d');

    let infecteds = document.getElementById("infecteds")
    let movable = document.getElementById("movable")
    let imovable = document.getElementById("imovable")

    if (infecteds.value > 1000)
        infecteds.value = 1000

    if (movable.value > 1000)
        movable.value = 1000

    if (imovable.value > 1000)
        imovable.value = 1000

    let totalTxt = document.getElementById("total")
    let totalInfectedsTxt = document.getElementById("total_infecteds")
    let totalHealedTxt = document.getElementById("total_healed")
    let maxInfectedsTxt = document.getElementById("max_infecteds")

    let total = 0
    let totalInfecteds = 0
    let totalHealed = 0
    let maxInfecteds = 0
    let initProcess = true

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

    if (intervals.length < 2) {
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

                ball.update()
            });

            maxInfecteds = totalInfecteds + totalHealed

            totalTxt.value = total
            totalInfectedsTxt.value = totalInfecteds
            totalHealedTxt.value = totalHealed
            maxInfectedsTxt.value = maxInfecteds

        }, 200 / 13);
        intervals.push(interval)

        let interval2 = setInterval(function () {
            total = 0
            totalInfecteds = 0
            totalHealed = 0

            total = balls.length

            balls.forEach(ball => {
                if (ball.infected == "INFECTED")
                    totalInfecteds++
                else if (ball.infected == "HEALED")
                    totalHealed++
            });

            if (totalHealed != balls.length) {
                secondsInfected.push(totalInfecteds)
                secondsNormal.push(total - totalInfecteds - totalHealed)
                secondsHealed.push(totalHealed)
                secondsChart.push(".")
            }

            window.myLine.update();
        }, 1000)
        intervals.push(interval2)

    }

}

function chart() {

    secondsHealed = []
    secondsInfected = []
    secondsNormal = []

    // chart colors
    var colors = [colorNormal, colorInfected, colorHealed];

    /* large line chart */

    var chartData = {
        labels: secondsChart,
        datasets: [
            {
                data: secondsNormal,
                backgroundColor: 'transparent',
                borderColor: colors[0],
                // borderWidth: 4,
                pointBackgroundColor: colors[0]
            },
            {
                data: secondsInfected,
                backgroundColor: 'transparent',
                borderColor: colors[1],
                // borderWidth: 4,
                pointBackgroundColor: colors[1]
            },
            {
                data: secondsHealed,
                backgroundColor: 'transparent',
                borderColor: colors[2],
                // borderWidth: 4,
                pointBackgroundColor: colors[2]
            }
        ]
    };

    if (chLine) {
        window.myLine = new Chart(chLine, {
            type: 'line',
            data: chartData,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        }
                    }]
                },
                legend: {
                    display: false
                }
            }
        });
    }
}