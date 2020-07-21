// Banana image source: https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Emojione_1F34C.svg/200px-Emojione_1F34C.svg.png
// Monkey image source: https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Emoji_u1f412.svg/480px-Emoji_u1f412.svg.png

const canvas = document.querySelector('canvas');
const cw = canvas.width = window.innerWidth;
const ch = canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

const body = document.querySelector('body');

ctx.font = "60px Arial";
ctx.fillStyle = "rgba(255,255,255,0.75)";
ctx.fillText('Loading...', cw / 2 - 110, ch / 2 - 40);

let currentScore = 0;
const newBananaMultiple = 5;
const bananas = [];
const maxLives = 3;
let numLives = maxLives;

let animationId;

let bestScore = 0;
let banana, monkey;
let firstRun = true;


window.addEventListener('DOMContentLoaded', (evt) => {
  // Retrieve best score from local storage, if it exists
  const score = parseInt(JSON.parse(localStorage.getItem("bestScore")), 10);
  bestScore = score ? score : currentScore;
  banana = new Image();
  
  banana.src = './images/banana.png';  
  monkey = new Image();
  monkey.src = './images/monkey.png';

  banana.addEventListener('load', (evt) => {
    monkey.addEventListener('load', (evt) => {
      createBanana(banana);
    });
  });
});

class Banana {
  constructor(image) {
    this.vy = 1;
    this.y = 0;
    // Banana image is 100x100 pixels
    this.height = 100;
    this.width = 100;
    this.x = Math.floor(Math.random() * (cw - this.width));
    this.image = image;
  }

  update() {
    this.y += this.vy;
    if (this.y > ch) {
      this.x = Math.floor(Math.random() * (cw - this.width));
      this.y = 0;
      return false;
    }
    return true;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}


function drawLives() {
  for (let i = numLives; i >= 0; i--) {
    // Monkey image is 60x60 pixels
    const imageWidth = 60;
    const imageHeight = imageWidth;
    let x = cw - (imageWidth + 20) * i;
    ctx.drawImage(monkey, x, 10, imageWidth, imageHeight);
  }
}

function createBanana(image) {
  bananas.push(new Banana(image));
  if (firstRun) {
    firstRun = false;
    run();
  }
}

canvas.addEventListener('mousedown', mousePressed);

function mousePressed(evt) {
  evt.preventDefault();
  const mx = evt.clientX;
  const my = evt.clientY;
  bananas.forEach((b) => {
    if (mx > b.x && mx < b.x + b.width && my > b.y &&
      my < b.y + b.height) {
      b.x = Math.floor(Math.random() * (cw - 100));
      b.y = 0;
      b.vy *= 1.05;
      currentScore++;
      // Create a new banana when currentScore is multiple of newBananaMultiple
      if (currentScore !== 0 && (currentScore % newBananaMultiple === 0)) {
        createBanana(banana);
      }
    }
  });

}

function drawScore() {
  ctx.font = "18px Verdana";
  ctx.fillStyle = "white";
  ctx.fillText('Current score: ' + currentScore, 10, 25);
  ctx.fillText('Best ever score: ' + bestScore, 10, 50);
}

function run() {
  ctx.clearRect(0, 0, cw, ch);
  for (let i = 0, len = bananas.length; i < len; i++) {
    let banana = bananas[i];

    if (!banana.update()) {
      numLives--;
    }
    banana.draw();
  }
  if (numLives <= 0) {
    // Save best score if it is better than the value already stored in local storage
    if (currentScore > bestScore) {
      bestScore = currentScore;
      localStorage.setItem("bestScore", JSON.stringify(bestScore));
    }
    window.cancelAnimationFrame(animationId);
  } else {
    animationId = window.requestAnimationFrame(run);
  }
  drawScore();
  drawLives();
}