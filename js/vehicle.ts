class Vehicle {
    location : PVector;
    velocity : PVector;
    acceleration : PVector;
    maxSpeed : number;
    maxForce : number = 0.05;
    r : number = 6;
    constructor(location? : PVector) {
        this.location = location ? location.clone() : new PVector(0,0);
        this.velocity = new PVector(0, 0);
        this.acceleration = new PVector(0, 0);
        this.maxSpeed = 1;
        this.r = 6;
    }
    seek(target : PVector) {

    }
    applyForce(force : PVector) {
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
    getNewTarget(): PVector {
        let predictLocation = this.location.clone();
        let predictOffset = this.velocity.clone();
        predictOffset.normalize();
        predictOffset.mult(10);
        predictLocation.add(predictOffset);
        let randomAngle = random(0, Math.PI * 2);
        let offset = new PVector(10 * Math.cos(randomAngle), 10 * Math.sin(randomAngle));
        predictLocation.add(offset);
        return predictLocation;
    }
}

class FlowField {
    field : PVector[][];
    cols : number;
    rows : number;
    resolution : number;
    constructor(resolution : number) {
        this.resolution = resolution;
        this.cols = width / resolution;
        this.rows = height / resolution;
        this.field = new Array(this.cols);
        for(let i = 0; i < this.cols; i++) {
            this.field[i] = new Array(this.rows);
        }
        this.initNoise2D(0.1);
    }
    initUniform(direction : PVector) {
        for(let i = 0; i < this.cols; i++) {
            for(let j = 0; j < this.rows; j++) {
                this.field[i][j] = direction.clone();
            }
        }
    }
    initNoise2D(scale : number) {
        for(let i = 0; i < this.cols; i++) {
            for(let j = 0; j < this.rows; j++) {
                let angle = noise(i*scale, j*scale) * Math.PI * 2;
                this.field[i][j] = new PVector(Math.cos(angle), Math.sin(angle));
            }
        }
    }
    draw() {
        for(let i = 0; i < this.cols; i++) {
            for(let j = 0; j < this.rows; j++) {
                this.drawVector(this.field[i][j], i * this.resolution, j * this.resolution, this.resolution - 2);
            }
        }
    }
    drawVector(v : PVector, x : number, y : number, scale : number) {
        push();
        let arrowsize = 4;
        translate(x, y);
        stroke(0, 50);
        rotate(v.heading2D());
        let len = v.mag() * scale;
        ellipse(0, 0, 3, 3);
        line(0, 0, len, 0);
        pop();
    }

    lookup(lookup : PVector) : PVector {
        let column = Math.floor(constrain(lookup.x / this.resolution, 0, this.cols - 1));
        let row = Math.floor(constrain(lookup.y / this.resolution, 0, this.rows - 1));
        return this.field[column][row].clone();
    }
}

class VehicleBehavior {
    getForce(vehicle : Vehicle, target : PVector) : PVector {
        return new PVector(0, 0);
    }
}

class VehicleBehaviorWandering extends VehicleBehavior {
    getForce(vehicle : Vehicle, target : PVector) : PVector {
        let wanderR = 25;
        let facing = vehicle.velocity.clone();
        facing.normalize();
        facing.mult(wanderR);
        let targetLocation = vehicle.location.clone();
        targetLocation.add(facing);
        let randomAngle = random(0, Math.PI * 2);
        let offset = new PVector(wanderR * Math.cos(randomAngle), wanderR * Math.sin(randomAngle));
        targetLocation.add(offset);
        let desired = PVector.sub(targetLocation, vehicle.location);
        desired.normalize();
        desired.limit(vehicle.maxSpeed);
        let steer = PVector.sub(desired, vehicle.velocity);
        steer.limit(vehicle.maxForce);
        return steer;
    }
}

class Path {
    points : PVector[];
    radius : number;
    constructor(points : PVector[], radius : number) {
        this.points = points;
        this.radius = radius;
    }
    draw() {
        stroke(0);
        strokeWeight(1);
        noFill();
        beginShape();
        for(let i = 0; i < this.points.length; i++) {
            vertex(this.points[i].x, this.points[i].y);
        }
        endShape();
        stroke(128, 40);
        strokeWeight(this.radius * 2);
        beginShape();
        for(let i = 0; i < this.points.length - 1; i++) {
            line(this.points[i].x, this.points[i].y, this.points[i+1].x, this.points[i+1].y);
        }
        endShape(CLOSE);
    }
    // return the closest point on the path and which segment it is on
    getClosestPointOnPath(location : PVector, outPoint : PVector, startfrom: number = 0) : number {
        let minDistance = Number.MAX_VALUE;
        let minIndex = -1;
        for(let i = startfrom; i < this.points.length - 1; i++) {
            let p1 = this.points[i];
            let p2 = this.points[i+1];
            let pointD = new PVector(0, 0);
            let distance = this.getDistanceToSegment(location, p1, p2, pointD);
            if(distance < minDistance) {
                minDistance = distance;
                minIndex = i;
                outPoint.set(pointD.x, pointD.y);
            }
        }
        return minIndex;
    }
    getDistanceToSegment(location : PVector, p1 : PVector, p2 : PVector, outPoint : PVector) : number {
        let normalPoint = this.getNormalPoint(location, p1, p2);
        if(this.isOnSegment(normalPoint, p1, p2)) {
            outPoint.set(normalPoint.x, normalPoint.y);
            return PVector.dist(location, normalPoint);
        }else {
            let d1 = PVector.dist(location, p1);
            let d2 = PVector.dist(location, p2);
            if(d1 < d2) {
                outPoint.set(p1.x, p1.y);
                return d1;
            }else {
                outPoint.set(p2.x, p2.y);
                return d2;
            }
        }
    }
    isOnSegment(p : PVector, a : PVector, b : PVector) : boolean {
        let ap = PVector.sub(p, a);
        let bp = PVector.sub(p, b);
        return PVector.dot(ap, bp) <= 0;
    }
    getNormalPoint(p : PVector, a : PVector, b : PVector) : PVector {
        let ap = PVector.sub(p, a);
        let ab = PVector.sub(b, a);
        ab.normalize();
        ab.mult(PVector.dot(ap, ab));
        return PVector.add(a, ab);
    }
    addPoint(point : PVector) {
        this.points.push(point);
    }
}

class VehicleBehaviorSeek extends VehicleBehavior {
    getForce(vehicle : Vehicle, target : PVector) : PVector {
        let desired = PVector.sub(target, vehicle.location);
        let d = desired.mag();
        desired.normalize();

        if(d < 100) {
            let m = map(d, 0, 100, 0, vehicle.maxSpeed);
            desired.mult(m);
        }else {
            desired.mult(vehicle.maxSpeed);
        }
        let steer = PVector.sub(desired, vehicle.velocity);

        steer.limit(vehicle.maxForce);
        return steer;
    }
}

class VehicleBehaviorFlowField extends VehicleBehavior {
    flowField : FlowField;
    constructor(flowField : FlowField) {
        super();
        this.flowField = flowField;
    }
    getForce(vehicle : Vehicle, target : PVector) : PVector {
        let desired = this.flowField.lookup(vehicle.location);
        desired.mult(vehicle.maxSpeed);
        let steer = PVector.sub(desired, vehicle.velocity);
        steer.limit(vehicle.maxForce);
        return steer;
    }
}

class VehicleBehaviorFollowPath extends VehicleBehavior {
    path : Path;
    currentSegment : number;
    constructor(path : Path) {
        super();
        this.path = path;
        this.currentSegment = 0;
    }
    getForce(vehicle : Vehicle, target : PVector) : PVector {
        let predict = vehicle.velocity.clone();
        predict.normalize();
        predict.mult(deltaTime);
        let predictLocation = PVector.add(vehicle.location, predict);
        let closestPoint = new PVector(0, 0);
        let segIndex = this.path.getClosestPointOnPath(predictLocation, closestPoint, this.currentSegment);

        let distance = PVector.dist(predictLocation, closestPoint);
        if(distance > this.path.radius) {
            // outside the path
            let desired = PVector.sub(closestPoint, vehicle.location);
            let maxSpeed = Math.min(vehicle.maxSpeed, desired.mag());
            desired.normalize();
            desired.mult(maxSpeed);
            let steer = PVector.sub(desired, vehicle.velocity);
            steer.limit(vehicle.maxForce);
            return steer;
        }

        // inside path

        this.currentSegment = segIndex;

        let pathStart = this.path.points[this.currentSegment];
        let pathEnd = this.path.points[this.currentSegment + 1];
        let nearPathEnd = PVector.dist(vehicle.location, pathEnd) < this.path.radius;
        if(nearPathEnd) {
            if(this.currentSegment + 1 == this.path.points.length - 1) {
                // reached the end, seek to path end
                let desired = PVector.sub(pathEnd, vehicle.location);
                let maxSpeed = Math.min(vehicle.maxSpeed, desired.mag());
                desired.normalize();
                desired.mult(maxSpeed);
                let steer = PVector.sub(desired, vehicle.velocity);
                steer.limit(vehicle.maxForce);
                return steer;
            }else{
                this.currentSegment++;
                pathStart = this.path.points[this.currentSegment];
                pathEnd = this.path.points[this.currentSegment + 1];
            }
        }
        let internalForward = PVector.sub(pathEnd, pathStart);
        let internalTarget = this.path.getNormalPoint(predictLocation, pathStart, pathEnd);
        internalForward.normalize();
        internalForward.mult(this.path.radius);
        internalTarget.add(internalForward);
        stroke(255, 0, 0);
        noFill();
        ellipse(internalTarget.x, internalTarget.y, 4, 4);
        ellipse(closestPoint.x, closestPoint.y, 4, 4);

            let desired = PVector.sub(internalTarget, vehicle.location);
            let maxSpeed = Math.min(vehicle.maxSpeed, desired.mag());
            desired.normalize();
            desired.mult(maxSpeed);
            let steer = PVector.sub(desired, vehicle.velocity);
            steer.limit(vehicle.maxForce);
            return steer;

    }
    getNormalPoint(p : PVector, a : PVector, b : PVector) : PVector {
        let ap = PVector.sub(p, a);
        let ab = PVector.sub(b, a);
        ab.normalize();
        ab.mult(ap.dot(ab));
        let normalPoint = PVector.add(a, ab);
        // Is normalPoint on the line segment? if not return closest endpoint
        if(PVector.dot(ab, PVector.sub(normalPoint, b)) > 0)
        {
            return b;
        }
        else if(PVector.dot(ab, PVector.sub(normalPoint, a)) < 0){
            return a;
        }
        return normalPoint;
    }
}

var vehicle : Vehicle;
var target : PVector;
var flowField : FlowField;
var path : Path;
var behavior : VehicleBehavior;


function setup() {
    createCanvas(640, 360);
    vehicle = new Vehicle(new PVector(width / 2, height / 2));
    target = new PVector(width / 2, height / 2);
    flowField = new FlowField(20);
    path = new Path([new PVector(100, 100), new PVector(200, 100), new PVector(200, 200)], 10);
    behavior = new VehicleBehaviorFollowPath(path);
}

function draw() {
    background(255);
    vehicle.applyForce(behavior.getForce(vehicle, target));
    vehicle.update();
    vehicle.display();
    //flowField.draw();
    path.draw();
    fill(127);
    stroke(0);
    strokeWeight(2);
    ellipse(target.x, target.y, 4, 4);
}

function mousePressed() {
    path.addPoint(new PVector(mouseX, mouseY));
}