"use strict";
var Engine = Matter.Engine, Runner = Matter.Runner, Bodies = Matter.Bodies, Composite = Matter.Composite;
var ground;
var engine;
var bodies = [];
var constraints = [];
var matterRenderDebug = true;
// poly decomp setup
var poly_decomp = decomp;
Matter.Common.setDecomp(poly_decomp);
function setup() {
    // p5js part
    createCanvas(800, 600);
    // matterjs part
    engine = Engine.create();
    if (matterRenderDebug) {
        var render = Matter.Render.create({
            element: document.body,
            engine: engine
        });
        Matter.Render.run(render);
    }
    // setup ground and bodies
    ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
    bodies.push(ground);
    //createSinMatterBody()
    createConstraintBridge({ x: 100, y: 100 }, { x: 700, y: 100 }, 20);
    Composite.add(engine.world, [ground,]);
    // setup matterjs runner
    var runner = Runner.create();
    Runner.run(runner, engine);
}
function drawMatterBody(body) {
    // does not support concave shapes
    fill(127);
    let len = body.parts.length;
    if (len == 1) {
        var vertices = body.vertices;
        beginShape();
        for (var i = 0; i < vertices.length; i++) {
            vertex(vertices[i].x, vertices[i].y);
        }
        endShape(CLOSE);
    }
    else // if a body has more than one part, it is a compound body, maybe concave
     {
        for (let j = 1; j < len; j++) {
            var vertices = body.parts[j].vertices;
            beginShape();
            for (var i = 0; i < vertices.length; i++) {
                vertex(vertices[i].x, vertices[i].y);
            }
            endShape(CLOSE);
        }
    }
}
function drawConstaint(constraint) {
    stroke(0, 0, 0);
    strokeWeight(2);
    line(Matter.Constraint.pointAWorld(constraint).x, Matter.Constraint.pointAWorld(constraint).y, Matter.Constraint.pointBWorld(constraint).x, Matter.Constraint.pointBWorld(constraint).y);
}
function createMatterBody(x, y, w, h) {
    let body = Bodies.rectangle(x, y, w, h);
    bodies.push(body);
    Composite.add(engine.world, [body]);
}
// a sin wave shape
function createSinMatterBody() {
    let vertexes = [];
    for (let i = 0; i < 800; i += 10) {
        let vertex = { x: i, y: -sin(i / 100) * 100 + 200 };
        vertexes.push(vertex);
    }
    vertexes.push({ x: 800, y: 400 });
    vertexes.push({ x: 0, y: 400 });
    let body = Bodies.fromVertices(400, 500, vertexes, {
        isStatic: true,
    });
    bodies.push(body);
    Composite.add(engine.world, [body]);
}
// a body composed by a stick and a circle
function createStickMatterBody(position) {
    let parts = Array();
    let circlePart = Bodies.circle(0, -50, 30, { isStatic: false });
    let stickPart = Bodies.rectangle(0, 0, 20, 40, { isStatic: false });
    parts = [circlePart, stickPart];
    let body = Matter.Body.create({ parts: parts });
    // must set position after create, because when creating with parts,
    // the position should set to (0, 0), to ensure part position is correct
    Matter.Body.setPosition(body, position);
    bodies.push(body);
    Composite.add(engine.world, [body]);
}
// create two circles joined by a constraint
function createTwoCircleMatterBody(position) {
    let parts = Array();
    let circle1Part = Bodies.circle(30, 0, 20, { isStatic: false });
    let circle2Part = Bodies.circle(-30, 0, 20, { isStatic: false });
    let constrain = Matter.Constraint.create({
        bodyA: circle1Part,
        bodyB: circle2Part,
        length: 60,
        stiffness: 1,
    });
    bodies.push(circle1Part);
    bodies.push(circle2Part);
    constraints.push(constrain);
    Matter.Body.setPosition(circle1Part, position);
    Matter.Body.setPosition(circle2Part, position);
    Composite.add(engine.world, circle1Part);
    Composite.add(engine.world, circle2Part);
    Composite.add(engine.world, constrain);
}
function createConstraintBridge(pointA, pointB, radius) {
    let distance = Matter.Vector.magnitude(Matter.Vector.sub(pointA, pointB));
    let numCircles = distance / (radius * 2);
    let circles = [];
    let bridge_constraints = [];
    for (let i = 0; i < numCircles; i++) {
        let positionX = pointA.x + (pointB.x - pointA.x) * i / numCircles;
        let positionY = pointA.y + (pointB.y - pointA.y) * i / numCircles;
        let circle = Bodies.circle(positionX, positionY, radius, { isStatic: false });
        circles.push(circle);
        bodies.push(circle);
    }
    for (let i = 0; i < circles.length - 1; i++) {
        let constraint = Matter.Constraint.create({
            bodyA: circles[i],
            bodyB: circles[i + 1],
            length: radius * 2,
            stiffness: 0.8,
        });
        constraints.push(constraint);
        bridge_constraints.push(constraint);
    }
    let constraintHead = Matter.Constraint.create({
        pointA: pointA,
        bodyB: circles[0],
        length: radius,
    });
    constraints.push(constraintHead);
    bridge_constraints.push(constraintHead);
    let constraintTail = Matter.Constraint.create({
        bodyA: circles[circles.length - 1],
        pointB: pointB,
        length: radius,
    });
    constraints.push(constraintTail);
    bridge_constraints.push(constraintTail);
    Composite.add(engine.world, circles);
    Composite.add(engine.world, bridge_constraints);
}
function draw() {
    background(200);
    for (let body of bodies) {
        drawMatterBody(body);
    }
    for (let constraint of constraints) {
        drawConstaint(constraint);
    }
}
function mousePressed() {
    //createMatterBody(mouseX, mouseY, 20, 20);
    // createStickMatterBody({x: mouseX, y: mouseY});
    createTwoCircleMatterBody({ x: mouseX, y: mouseY });
}
