const char_avaliable = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+{}|:<>?[];',./`~-=\\\"".split("")
class Particle {
    public location: PVector
    public velocity: PVector
    public acceleration: PVector
    public lifespan: number = 255
    public showText: string = '0'
    public mass: number = 1

    constructor(initLocation?: PVector) {
        this.location = initLocation ? initLocation.clone() : new PVector(width / 2, height / 2)
        this.velocity = new PVector(random(-1, 1), random(-2, 0))
        this.acceleration = new PVector(0, 0)
        this.showText = random(char_avaliable)
    }

    update() {
        this.velocity.add(this.acceleration)
        this.location.add(this.velocity)
        this.acceleration.mult(0)
        this.lifespan -= 2
    }

    display() {
        noStroke()
        fill(50, this.lifespan)
        text(this.showText, this.location.x, this.location.y)
    }

    isDead() : boolean {
        return this.lifespan < 0
    }

    run() {
        this.update()
        this.display()
    }

    applyForce(force: PVector) {
        let f = PVector.div(force, this.mass)
        this.acceleration.add(f)
    }
}


class ParticleSystem {
    public particles: Array<Particle>
    public origin: PVector

    constructor(origin: PVector) {
        this.particles = []
        this.origin = origin
    }

    addParticle() {
        let pt = new Particle(this.origin)
        this.particles.push(pt)
    }

    run() {
        this.addParticle()
        for(let i = this.particles.length - 1; i >= 0; i--) {
            if(this.particles[i].isDead()) {
                this.particles.splice(i, 1)
            } else {
                this.particles[i].run()
            }
        }
    }

    applyForce(force: PVector) {
        for(let i = 0; i < this.particles.length; i++) {
            this.particles[i].applyForce(force)
        }
    }

    applyRepeller(repeller: Repeller) {
        for(let i = 0; i < this.particles.length; i++) {
            let force = repeller.repel(this.particles[i])
            this.particles[i].applyForce(force)
        }
    }
}

class Repeller {
    public location: PVector
    public G: number = 5
    public mass: number = 20

    constructor(x: number, y: number) {
        this.location = new PVector(x, y)
    }

    display() {
        stroke(0)
        fill(175)
        ellipse(this.location.x, this.location.y, this.mass * 2, this.mass * 2)
    }

    repel(p: Particle) {
        let dir = PVector.sub(this.location, p.location)
        let d = dir.mag()
        d = constrain(d, 5, 100)
        dir.normalize()
        let force = this.G * (this.mass * p.mass) / (d * d)
        dir.mult(force * -1)
        return dir
    }
}

var ptl: Array<ParticleSystem>
var repeller: Repeller

function setup() {
    createCanvas(400, 400)
    ptl = []
    repeller = new Repeller(width / 2, height / 2)
    smooth()
}

function draw() {
    background(200)
    repeller.display()

    for(let i = 0; i < ptl.length; i++) {
        ptl[i].applyForce(new PVector(0, 0.1))
        ptl[i].applyRepeller(repeller)
        ptl[i].run()
    }
}

function mouseClicked() {
    ptl.push(new ParticleSystem(new PVector(mouseX, mouseY)))
}