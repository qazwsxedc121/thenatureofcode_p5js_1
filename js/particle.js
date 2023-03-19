"use strict";
const char_avaliable = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}|:<>?[];',./`~-=\\\"".split("");
class Particle {
    constructor(initLocation) {
        this.lifespan = 255;
        this.showText = '0';
        this.mass = 1;
        this.location = initLocation ? initLocation.clone() : new PVector(width / 2, height / 2);
        this.velocity = new PVector(random(-1, 1), random(-2, 0));
        this.acceleration = new PVector(0, 0);
        this.showText = random(char_avaliable);
    }
    update() {
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        this.acceleration.mult(0);
        this.lifespan -= 2;
    }
    display() {
        noStroke();
        fill(50, this.lifespan);
        text(this.showText, this.location.x, this.location.y);
    }
    isDead() {
        return this.lifespan < 0;
    }
    run() {
        this.update();
        this.display();
    }
    applyForce(force) {
        let f = PVector.div(force, this.mass);
        this.acceleration.add(f);
    }
}
class ParticleSystem {
    constructor(origin) {
        this.particles = [];
        this.origin = origin;
    }
    addParticle() {
        let pt = new Particle(this.origin);
        this.particles.push(pt);
    }
    run() {
        this.addParticle();
        for (let i = this.particles.length - 1; i >= 0; i--) {
            if (this.particles[i].isDead()) {
                this.particles.splice(i, 1);
            }
            else {
                this.particles[i].run();
            }
        }
    }
    applyForce(force) {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].applyForce(force);
        }
    }
    applyRepeller(repeller) {
        for (let i = 0; i < this.particles.length; i++) {
            let force = repeller.repel(this.particles[i]);
            this.particles[i].applyForce(force);
        }
    }
}
class Repeller {
    constructor(x, y) {
        this.G = 5;
        this.mass = 20;
        this.location = new PVector(x, y);
    }
    display() {
        stroke(0);
        fill(175);
        ellipse(this.location.x, this.location.y, this.mass * 2, this.mass * 2);
    }
    repel(p) {
        let dir = PVector.sub(this.location, p.location);
        let d = dir.mag();
        d = constrain(d, 5, 100);
        dir.normalize();
        let force = this.G * (this.mass * p.mass) / (d * d);
        dir.mult(force * -1);
        return dir;
    }
}
var ptl;
var repeller;
function setup() {
    createCanvas(400, 400);
    ptl = [];
    repeller = new Repeller(width / 2, height / 2);
    smooth();
}
function draw() {
    background(200);
    repeller.display();
    for (let i = 0; i < ptl.length; i++) {
        ptl[i].applyForce(new PVector(0, 0.1));
        ptl[i].applyRepeller(repeller);
        ptl[i].run();
    }
}
function mouseClicked() {
    ptl.push(new ParticleSystem(new PVector(mouseX, mouseY)));
}
