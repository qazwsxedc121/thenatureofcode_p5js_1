

class Mover {
    constructor(location, velocity, acceleration, topSpeed, mass) {
        this.location = location;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.topSpeed = topSpeed;
        this.mass = mass;
        this.angle = 0;
        this.aVelocity = 0;
        this.aAcceleration = 0;
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.topSpeed);
        this.location.add(this.velocity);

        this.updateAngle2();

        this.acceleration.mult(0);
    }

    updateAngle() {
        this.aVelocity += this.aAcceleration;
        this.aVelocity = constrain(this.aVelocity, -0.1, 0.1);
        this.angle += this.aVelocity;
    }

    updateAngle2() {
        this.angle = this.velocity.heading2D();
    }

    display() {
        stroke(0);
        fill(175);
        rectMode(CENTER);
        push();
        translate(this.location.x, this.location.y);
        rotate(this.angle);
        rect(0, 0, 48, 24);
        pop();
        
    }

    checkEdges() {
        if (this.location.x > width) {
            this.location.x = 0;
        } else if (this.location.x < 0) {
            this.location.x = width;
        }

        if (this.location.y > height) {
            //this.location.y = 0;
            this.velocity.y *= -1;
            //console.log(this.velocity.y);
            this.location.y = height;
        } else if (this.location.y < 0) {
            this.location.y = height;
            //this.velocity.y *= -1;
        }
    }

    applyForce(force) {
        let forceclone = force.clone();
        forceclone.div(this.mass);
        this.acceleration.add(forceclone);
    }

}

var mover;

function setup(){
    createCanvas(400,400);
    background(0);
    mover = new Mover(new PVector(width/2, height/2), new PVector(0, 0), new PVector(0, 0), 10, 1);
}

function draw(){
    background(200);
    //console.log(mover.velocity);
    //let wind = new PVector(0.01,0);
    //let gravity = new PVector(0, 0.2);
    //mover.applyForce(wind);
    //mover.applyForce(gravity);
    //mover.aAcceleration = 0.001;

    followMouse();

    mover.update();
    mover.display();
    mover.checkEdges();
}

function followMouse() {
    let acceleration = new PVector(mouseX, mouseY);
    acceleration.sub(mover.location);
    acceleration.limit(1);
    mover.acceleration = acceleration;
}