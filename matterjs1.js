"use strict";
var Engine = Matter.Engine, Runner = Matter.Runner, Bodies = Matter.Bodies, Composite = Matter.Composite;
var boxA;
var boxB;
var ground;
var engine;
var bodies = [];
var poly_decomp = decomp;
var matterRenderDebug = true;
Matter.Common.setDecomp(poly_decomp);
function setup() {
    engine = Engine.create();
    if (matterRenderDebug) {
        var render = Matter.Render.create({
            element: document.body,
            engine: engine
        });
        Matter.Render.run(render);
    }
    createCanvas(800, 600);
    boxA = Bodies.rectangle(400, 200, 80, 80);
    boxB = Bodies.rectangle(450, 50, 80, 80);
    ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
    Composite.add(engine.world, [boxA, boxB, ground]);
    createSinMatterBody();
    var runner = Runner.create();
    Runner.run(runner, engine);
}
function drawMatterBody(body) {
    // does not support concave shapes
    noFill();
    var vertices = body.vertices;
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
function createSinMatterBody() {
    let vertexes = [];
    for (let i = 0; i < 600; i += 10) {
        let vertex = { x: i, y: -sin(i / 100) * 100 + 200 };
        vertexes.push(vertex);
    }
    vertexes.push({ x: 600, y: 400 });
    vertexes.push({ x: 0, y: 400 });
    let body = Bodies.fromVertices(400, 500, vertexes, {
        isStatic: true,
    });
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
    createMatterBody(mouseX, mouseY, 20, 20);
}
