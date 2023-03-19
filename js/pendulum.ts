var p: Pendulum;
function setup() {
    createCanvas(400, 400);
    p = new Pendulum();
}

function draw(){
    background(200);
    p.update();
    p.display();
}

class Pendulum {
    r: number;
    angle: number;
    aVelocity: number;
    aAcceleration: number;
    constructor() {
        this.r = 200;
        this.angle = PI/4;
        this.aVelocity = 0;
        this.aAcceleration = 0;
    }
    update() {
        this.aAcceleration = -0.01 * sin(this.angle);
        this.aVelocity += this.aAcceleration;
        this.angle += this.aVelocity;
    }

    display() {
        let x = this.r * sin(this.angle);
        let y = this.r * cos(this.angle);
        stroke(0);
        strokeWeight(2);
        translate(width/2, height/4);
        line(0, 0, x, y);
        fill(0);
        ellipse(x, y, 20, 20);
    }
}