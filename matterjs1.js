"use strict";
var Engine = Matter.Engine, Runner = Matter.Runner, Bodies = Matter.Bodies, Composite = Matter.Composite;
var boxA;
var boxB;
var ground;
var engine;
var bodies = [];
function setup() {
    engine = Engine.create();
    // var render = Render.create({
    //     element: document.body,
    //     engine: engine
    // });
    createCanvas(800, 600);
    boxA = Bodies.rectangle(400, 200, 80, 80);
    boxB = Bodies.rectangle(450, 50, 80, 80);
    ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
    Composite.add(engine.world, [boxA, boxB, ground]);
    // Render.run(render);
    var runner = Runner.create();
    Runner.run(runner, engine);
}
function drawMatterBody(body) {
    var vertices = body.vertices;
    fill(127);
    beginShape();
    for (var i = 0; i < vertices.length; i++) {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}
function createMatterBody(x, y, w, h) {
    let body = Bodies.rectangle(x, y, w, h);
    bodies.push(body);
    Composite.add(engine.world, [body]);
}
function draw() {
    background(200);
    drawMatterBody(boxA);
    drawMatterBody(boxB);
    drawMatterBody(ground);
    for (let body of bodies) {
        drawMatterBody(body);
    }
}
function mousePressed() {
    createMatterBody(mouseX, mouseY, 10, 10);
}
