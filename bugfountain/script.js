let bugImage;

let bugs;
const maxBugs = 50;
let numBugs = 0;

const xVelocities = [-2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2];
const yVelocities = [-7, -8, -9, -10, -11, -12]; 
const gravity = 0.1;

function preload() {
  bugImage = loadImage('./images/bug.png');
}

function setup() {
  createCanvas(innerWidth, innerHeight);  
  imageMode(CENTER);
  angleMode(DEGREES);
  bugs = [];
}

function draw() {
  background(100, 255, 0);
  if (numBugs < maxBugs) {
    const vx = randomItem(xVelocities);
    const vy = randomItem(yVelocities);
    bug = new Bug(width / 2, height, bugImage, vx, vy, gravity);
    bugs.push(bug);
    numBugs += 1;
  }

  bugs.forEach(bug => {
    bug.update();
    bug.draw();
  }); 
}

function randomItem(arr) {
  const len = arr.length;
  const index = floor(random(len));
  return arr[index];
}

class Bug {
  constructor(x, y, image, vx, vy, gravity) {
    this.initialX = x;
    this.initialY = y;
    this.x = this.initialX;
    this.y = this.initialY;
    this.image = image;
    this.width = image.width;
    this.height = image.height;
    this.vx = vx;

    this.initialVy = vy;
    this.vy = vy;
    this.gravity = gravity;
  }

  update() {
    this.x += this.vx;
    this.vy += this.gravity;
    this.y += this.vy;
    if (this.y > height + this.height / 2) {
      this.x = this.initialX;
      this.y = this.initialY;
      this.vy = this.initialVy;
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    let angle = atan(this.vy / this.vx);
    angle = this.vx > 0 ? angle + 90 : angle - 90;
    rotate(angle);
    image(this.image, 0, 0);
    pop();
  }
}

