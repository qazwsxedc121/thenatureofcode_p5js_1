class PVector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
    }

    div(n) {
        this.x /= n;
        this.y /= n;
    }

    mult(n) {
        this.x *= n;
        this.y *= n;
    }

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
}