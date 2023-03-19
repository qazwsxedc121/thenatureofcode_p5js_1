class PVector {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    set(x: number, y: number) {
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

    dot(v:PVector):number {
        return this.x * v.x + this.y * v.y;
    }
    static dot(v1:PVector, v2:PVector):number {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static angleBetween(v1:PVector, v2:PVector):number {
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
    dist(v:PVector) {
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
    }
    static dist(v1:PVector, v2:PVector) {
        return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
    }
}