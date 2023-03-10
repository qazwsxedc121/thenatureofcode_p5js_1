"use strict";
class Vehicle {
    constructor(location) {
        this.r = 6;
        this.location = location ? location.clone() : new PVector(0, 0);
        this.velocity = new PVector(0, 0);
        this.acceleration = new PVector(0, 0);
        this.maxSpeed = 4;
        this.r = 6;
    }
    seek(target) {
        let desired = PVector.sub(target, this.location);
        desired.normalize();
        desired.mult(this.maxSpeed);
        let steer = PVector.sub(desired, this.velocity);
        steer.limit(0.1);
        this.applyForce(steer);
    }
    applyForce(force) {
        this.acceleration.add(force);
    }
    display() {
        let theta = this.velocity.heading2D() + Math.PI / 2;
        fill(175);
        stroke(0);
        push();
        translate(this.location.x, this.location.y);
        rotate(theta);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
        pop();
    }
    update() {
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        this.acceleration.mult(0);
    }
}
var vehicle;
var target;
function setup() {
    createCanvas(640, 360);
    vehicle = new Vehicle(new PVector(mouseX, mouseY));
    target = new PVector(width / 2, height / 2);
}
function draw() {
    background(255);
    vehicle.seek(target);
    vehicle.update();
    vehicle.display();
    fill(127);
    stroke(0);
    strokeWeight(2);
    ellipse(target.x, target.y, 48, 48);
}
function mousePressed() {
    target = new PVector(mouseX, mouseY);
}
