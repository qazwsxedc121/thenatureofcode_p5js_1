var angleOffset : number = 0;

function setup() {
    createCanvas(400, 400);
}

function draw(){
    background(200);
    let angle = angleOffset;
    let angleVel = 0.05
    let amplitude = 100;
    for(let x = 0; x < width; x+=24) {
        let y = (noise(angle*5) + sin(angle*5)) * amplitude;
        fill(0);
        ellipse(x, y + height/2, 24, 24);
        angle += angleVel;
    }
    angleOffset += 0.01;
}