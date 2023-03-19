var Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

var ground : Matter.Body;
var engine : Matter.Engine;
var bodies : Matter.Body[] = [];
var constraints : Matter.Constraint[] = [];
var matterRenderDebug = true;

// poly decomp setup
var poly_decomp = decomp;
Matter.Common.setDecomp(poly_decomp);

var fan : Matter.Body;

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
    createConstraintBridge({x: 100, y: 100}, {x: 700, y: 100}, 20);
    fan = createWindMill({x: 400, y: 470});

    Composite.add(engine.world, [ground,]);

    // setup matterjs runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    Matter.Events.on(engine, 'beforeUpdate', function(event) {
        // apply force to fan
        Matter.Body.rotate(fan, 0.01);
    });
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

function drawConstaint(constraint: Matter.Constraint){
    stroke(0, 0, 0);
    strokeWeight(2);
    line(
        Matter.Constraint.pointAWorld(constraint).x, Matter.Constraint.pointAWorld(constraint).y,
        Matter.Constraint.pointBWorld(constraint).x, Matter.Constraint.pointBWorld(constraint).y,
    )
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

// create two circles joined by a constraint
function createTwoCircleMatterBody(position: Matter.Vector){
    let parts = Array<Matter.Body>();
    let circle1Part = Bodies.circle(30, 0, 20, {isStatic: false});
    let circle2Part = Bodies.circle(-30, 0, 20, {isStatic: false});
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

function createConstraintBridge(pointA: Matter.Vector, pointB: Matter.Vector, radius: number){
    let distance = Matter.Vector.magnitude(Matter.Vector.sub(pointA, pointB));
    let numCircles = distance / (radius * 2);
    let circles : Matter.Body[] = [];
    let bridge_constraints : Matter.Constraint[] = [];
    for(let i = 0; i < numCircles; i++){
        let positionX = pointA.x + (pointB.x - pointA.x) * i / numCircles;
        let positionY = pointA.y + (pointB.y - pointA.y) * i / numCircles;
        let circle = Bodies.circle(positionX, positionY, radius, {isStatic: false});
        circles.push(circle);
        bodies.push(circle);
    }
    for(let i = 0; i < circles.length - 1; i++){
        let constraint = Matter.Constraint.create({
            bodyA: circles[i],
            bodyB: circles[i+1],
            length: radius*2,
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

function createWindMill(position: Matter.Vector){
    let parts = Array<Matter.Body>();
    let fanPart = Bodies.rectangle(0, 0,  200, 20, {isStatic: true, collisionFilter: {group: -1}});
    let stickPart = Bodies.rectangle(0, 50, 20, 100, {isStatic: true, collisionFilter: {group: -1}});
    // must set position after create, because when creating with parts,
    // the position should set to (0, 0), to ensure part position is correct
    Matter.Body.setPosition(fanPart, position);
    Matter.Body.setPosition(stickPart, {x: position.x, y: position.y + 50});
    let constraintPivot = Matter.Constraint.create({
        bodyA: fanPart,
        pointA: {x: 0, y: 0},
        bodyB: stickPart,
        pointB: {x: 0, y: -45},
        length: 0,
    });

    bodies.push(fanPart);
    bodies.push(stickPart);
    constraints.push(constraintPivot);
    Composite.add(engine.world, [constraintPivot]);
    Composite.add(engine.world, [fanPart, stickPart]);
    return fanPart;
}


function draw() {
    background(200)
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
    createTwoCircleMatterBody({x: mouseX, y: mouseY});
}