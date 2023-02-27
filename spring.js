"use strict";
class Spring {
    constructor(x, y, l) {
        this.anchor = new PVector(x, y);
        this.len = l;
    }
    connect(b) {
        let force = PVector.sub(b.loc, this.anchor);
        let d = force.mag();
        let stretch = d - this.len;
        force.normalize();
        force.mult(-1 * stretch);
        b.applyForce(force);
    }
    display() {
        stroke(0);
        rectMode(CENTER);
        rect(this.anchor.x, this.anchor.y, 10, 10);
    }
    displayLine(b) {
        stroke(0);
        line(this.anchor.x, this.anchor.y, b.loc.x, b.loc.y);
    }
}
class Bob {
    constructor(x, y, m) {
        this.loc = new PVector(x, y);
        this.vel = new PVector(0, 0);
        this.acc = new PVector(0, 0);
        this.mass = m;
    }
    applyForce(force) {
        let f = PVector.div(force, this.mass);
        this.acc.add(f);
    }
    update() {
        this.vel.add(this.acc);
        this.loc.add(this.vel);
        this.acc.mult(0);
    }
    display() {
        stroke(0);
        strokeWeight(2);
        fill(175);
        ellipse(this.loc.x, this.loc.y, 16, 16);
    }
}
var s;
var b;
var gravity = new PVector(0, 10);
function setup() {
    let canvas = createCanvas(400, 400);
    canvas.mouseClicked(() => {
        b.loc = new PVector(mouseX, mouseY);
        b.acc = new PVector(0, 0);
        b.vel = new PVector(0, 0);
    });
    s = new Spring(width / 2, 0, 100);
    b = new Bob(width / 2, 100, 20);
}
function draw() {
    background(200);
    b.applyForce(gravity);
    s.connect(b);
    b.update();
    s.display();
    s.displayLine(b);
    b.display();
}
