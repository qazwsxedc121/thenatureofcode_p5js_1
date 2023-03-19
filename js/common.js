"use strict";
class PVector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }
    static add(v1, v2) {
        return new PVector(v1.x + v2.x, v1.y + v2.y);
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
    }
    static sub(v1, v2) {
        return new PVector(v1.x - v2.x, v1.y - v2.y);
    }
    div(n) {
        this.x /= n;
        this.y /= n;
    }
    static div(v, n) {
        return new PVector(v.x / n, v.y / n);
    }
    mult(n) {
        this.x *= n;
        this.y *= n;
    }
    static mult(v, n) {
        return new PVector(v.x * n, v.y * n);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static angleBetween(v1, v2) {
        return Math.acos(PVector.dot(v1, v2) / (v1.mag() * v2.mag()));
    }
    // 2D magnitude
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        let m = this.mag();
        if (m != 0) {
            this.div(m);
        }
    }
    setMag(n) {
        this.normalize();
        this.mult(n);
    }
    limit(n) {
        if (this.mag() > n) {
            this.setMag(n);
        }
    }
    heading2D() {
        return Math.atan2(this.y, this.x);
    }
    rotate2D(angle) {
        let newHeading = this.heading2D() + angle;
        let mag = this.mag();
        this.x = Math.cos(newHeading) * mag;
        this.y = Math.sin(newHeading) * mag;
    }
    clone() {
        return new PVector(this.x, this.y);
    }
    dist(v) {
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
    }
    static dist(v1, v2) {
        return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
    }
}
