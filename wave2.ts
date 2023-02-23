var angleOffset : number = 0;

function setup() {
    createCanvas(400, 400);
}

function draw(){
    background(200);
    let angle = angleOffset;
    let angleVel = 0.2
    let amplitude = 200;
    for(let x = 0; x < width; x+=24) {
        let y = sin(angle) * amplitude;
        fill(0);
        ellipse(x, y + height/2, 24, 24);
        angle += angleVel;
    }
    angleOffset += 0.01;
}