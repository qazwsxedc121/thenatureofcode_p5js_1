var oscillator;

function setup(){
    createCanvas(400,400);
    background(200);
    oscillator = new Oscillator();
}

function draw(){
    //background(200);
    oscillator.oscillate();
    oscillator.display();
}

class Oscillator {
    constructor() {
        this.angle = new PVector(0,0);
        this.velocity = new PVector(random(-0.05, 0.05), random(-0.05, 0.05));
        this.amplitude = new PVector(width/2, height/2);
    }

    oscillate() {
        this.angle.add(this.velocity);
    }

    display() {
        let x = sin(this.angle.x) * this.amplitude.x;
        let y = sin(this.angle.y) * this.amplitude.y;
        push();
        translate(width/2, height/2);
        //stroke(0);
        fill(100);
        //line(0, 0, x, y);
        ellipse(x, y, 16, 16);
        pop();
    }
}