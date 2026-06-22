
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
const balloonContainer = document.querySelector('.balloon-container');
let width = 0;
let height = 0;
let fireworks = [];
let particles = [];
const colors = ['#ff4fa3', '#ff9ed0', '#ffd1dc', '#ff87d1', '#ff6ab8'];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Firework {
  constructor(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = Math.hypot(tx - sx, ty - sy);
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    while (this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 3;
    this.acceleration = 1.05;
    this.brightness = Math.random() * 20 + 50;
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    if (this.speed < 12) this.speed *= this.acceleration;

    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = Math.hypot(this.x + vx - this.x, this.y + vy - this.y);
    this.x += vx;
    this.y += vy;

    if (Math.hypot(this.tx - this.x, this.ty - this.y) < this.speed) {
      createExplosion(this.tx, this.ty, this.color);
      fireworks.splice(index, 1);
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsl(330, 100%, ${this.brightness}%)`;
    ctx.stroke();
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 4 + 1;
    this.friction = 0.95;
    this.gravity = 0.12;
    this.hue = color;
    this.brightness = Math.random() * 30 + 50;
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.015;
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if (this.alpha <= this.decay) {
      particles.splice(index, 1);
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `rgba(255, 150, 220, ${this.alpha})`;
    ctx.stroke();
  }
}

function launchFirework() {
  const startX = Math.random() * width;
  const targetX = Math.random() * (width - 100) + 50;
  const targetY = Math.random() * (height * 0.45) + 80;
  fireworks.push(new Firework(startX, height, targetX, targetY));
}

function createExplosion(x, y, color) {
  const particleCount = 20 + Math.floor(Math.random() * 20);
  for (let i = 0; i < particleCount; i += 1) {
    particles.push(new Particle(x, y, color));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'lighter';

  fireworks.forEach((firework, index) => firework.draw() || firework.update(index));
  particles.forEach((particle, index) => particle.draw() || particle.update(index));
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createBalloon() {
  const balloon = document.createElement('div');
  balloon.className = 'balloon';
  const color = colors[Math.floor(Math.random() * colors.length)];
  balloon.style.background = `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.85), ${color})`;
  balloon.style.left = `${random(5, 92)}%`;
  balloon.style.animationDuration = `${random(8, 14)}s`;
  balloon.style.animationDelay = `${random(0, 4)}s`;
  balloon.style.opacity = `${random(0.8, 1)}`;
  const shine = document.createElement('span');
  balloon.appendChild(shine);
  balloonContainer.appendChild(balloon);
}

function createBalloons(count = 10) {
  for (let i = 0; i < count; i += 1) {
    createBalloon();
  }
}

createBalloons();
animate();
setInterval(launchFirework, 1200);

function showSurprise() {
  document.getElementById('surprise').classList.remove('hidden');
  for (let i = 0; i < 4; i += 1) {
    setTimeout(launchFirework, i * 180);
  }
}
