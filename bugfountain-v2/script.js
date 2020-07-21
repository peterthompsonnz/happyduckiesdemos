let bugImage;

let bugs = [];
const maxBugs = 50;
let numBugs = 0;

const bugImageDetails = [
  { name: 'bug60.png', image: null },
  { name: 'bug55.png', image: null },
  { name: 'bug50.png', image: null },
  { name: 'bug45.png', image: null },
  { name: 'bug40.png', image: null },
];

const xVelocities = [-2,-1.75,-1.5,-1.25,-1,-0.75,-0.5,-0.25,0.25,0.5,0.75,1,1.25,1.5,1.75,2];
const bugWeightConstant = -25000;
const gravity = 0.1;

async function preload() {
  for (let details of bugImageDetails) {
    const image = await loadImage(`./images/${details['name']}`);
    details['image'] = image;
  }
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  imageMode(CENTER);
  angleMode(DEGREES);
}

function draw() {
  background(100, 255, 0);
  if (numBugs < maxBugs) {
    const vx = randomItem(xVelocities);
    const imageDetails = randomItem(bugImageDetails);
    const size = parseInt(imageDetails['name'].slice(3, 5), 10);
    // vy depends on the square pixelage of the bug image
    // Smaller bugs move faster
    const vy = bugWeightConstant / (size * size);

    const newBug = new Bug(width / 2, height, imageDetails['image'], vx, vy, gravity);
    bugs.push(newBug);
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

