var r = 0;
var theta = 0;

function draw(){
    let x = r * cos(theta) + width / 2;
    letvas = createCanvas(400,400);
    canvas.parent('sketch-holder');
    background(0);
    mover = new Mover(new PVector(width/2, height/2), new PVector(0, 0), new PVector(0, 0), 10, 1); y = r * sin(theta) + height / 2;
    stroke(255);
    fill(255);
    ellipse(x,y,5,5);
    r += 0.2;
    theta += 0.1;
}

function setup(){
    createCanvas(400,400);
    background(0);
}