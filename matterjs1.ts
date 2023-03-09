var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

var ground : Matter.Body;
var engine : Matter.Engine;
var bodies : Matter.Body[] = [];
var matterRenderDebug = true;

// poly decomp setup
var poly_decomp = decomp;
Matter.Common.setDecomp(poly_decomp);

function setup() {
    // p5js part
    createCanvas(800, 600)

    // matterjs part
    engine = Engine.create();
    if(matterRenderDebug){
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

    Composite.add(engine.world, [ground,]);

    // setup matterjs runner
    var runner = Runner.create();
    Runner.run(runner, engine);

}

function drawMatterBody(body: Matter.Body) {
    // does not support concave shapes
    fill(127);
    let len = body.parts.length;
    if(len == 1){
        var vertices = body.vertices;
        beginShape();
        for (var i = 0; i < vertices.length; i++) {
            vertex(vertices[i].x, vertices[i].y);
        }
        endShape(CLOSE);
    }
    else // if a body has more than one part, it is a compound body, maybe concave
    {
        for(let j = 1; j < len; j++){
            var vertices = body.parts[j].vertices;
            beginShape();
            for (var i = 0; i < vertices.length; i++) {
                vertex(vertices[i].x, vertices[i].y);
            }
            endShape(CLOSE);
        }

    }
}

function createMatterBody(x: number, y: number, w: number, h: number) {
    let body = Bodies.rectangle(x, y, w, h);
    bodies.push(body);
    Composite.add(engine.world, [body]);
}

// a sin wave shape
function createSinMatterBody(){
    let vertexes = [];
    for(let i = 0; i < 800; i += 10){
        let vertex = {x: i, y: -sin(i/100)*100 + 200};
        vertexes.push(vertex);
    }
    vertexes.push({x: 800, y: 400});
    vertexes.push({x: 0, y: 400});
    let body = Bodies.fromVertices(400, 500, vertexes, {
        isStatic: true,
    });
    bodies.push(body);
    Composite.add(engine.world, [body]);
}

// a body composed by a stick and a circle
function createStickMatterBody(position: Matter.Vector){
    let parts = Array<Matter.Body>();
    let circlePart = Bodies.circle(0,  -50, 30, {isStatic: false});
    let stickPart = Bodies.rectangle(0, 0, 20, 40, {isStatic: false});
    parts = [circlePart, stickPart];
    let body = Matter.Body.create({parts: parts});
    // must set position after create, because when creating with parts,
    // the position should set to (0, 0), to ensure part position is correct
    Matter.Body.setPosition(body, position);

    bodies.push(body);
    Composite.add(engine.world, [body]);
}

function draw() {
    background(200)
    for (let body of bodies) {
        drawMatterBody(body);
    }
}

function mousePressed() {
    //createMatterBody(mouseX, mouseY, 20, 20);
    createStickMatterBody({x: mouseX, y: mouseY});
}