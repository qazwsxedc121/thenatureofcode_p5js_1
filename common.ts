class PVector {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(v:PVector) {
        this.x += v.x;
        this.y += v.y;
    }
    static add(v1:PVector, v2:PVector) {
        return new PVector(v1.x + v2.x, v1.y + v2.y);
    }

    sub(v:PVector) {
        this.x -= v.x;
        this.y -= v.y;
    }
    static sub(v1:PVector, v2:PVector) {
        return new PVector(v1.x - v2.x, v1.y - v2.y);
    }

    div(n:number) {
        this.x /= n;
        this.y /= n;
    }
    static div(v:PVector, n:number) {
        return new PVector(v.x / n, v.y / n);
    }

    mult(n:number) {
        this.x *= n;
        this.y *= n;
    }
    static mult(v:PVector, n:number) {
        return new PVector(v.x * n, v.y * n);
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

    setMag(n:number) {
        this.normalize();
        this.mult(n);
    }

    limit(n:number) {
        if (this.mag() > n) {
            this.setMag(n);
        }
    }

    heading2D() {
        return Math.atan2(this.y, this.x);
    }

    rotate2D(angle:number) {
        let newHeading = this.heading2D() + angle;
        let mag = this.mag();
        this.x = Math.cos(newHeading) * mag;
        this.y = Math.sin(newHeading) * mag;
    }

    clone() {
        return new PVector(this.x, this.y);
    }
}