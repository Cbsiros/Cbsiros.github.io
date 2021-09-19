var phrases = ['Welcome', 'to my website!'];
var currentPhrase = 0;

var headerHeight = document.querySelector("#navbar").offsetHeight;

var canvas = document.querySelector("#scene"),
  ctx = canvas.getContext("2d"),
  particles = [];

var canvasWidth = canvas.width = window.innerWidth;
var canvasHeight = canvas.height = window.innerHeight;

class Vector {

  constructor(x, y) {
      this.x = x;
      this.y = y;
  }
  
  add(other) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  scaleBy(number) {
    return new Vector(this.x * number, this.y * number);
  }

  length() {
    return Math.hypot(this.x, this.y);
  }

  normalize() {
    return this.scaleBy(1 / this.length());
  }

  withLength(newLength) {
    return this.normalize().scaleBy(newLength);
  }

}

class Particle {

    constructor(x, y) {
        this.pos = new Vector(Math.random() * canvasWidth, Math.random() * canvasHeight)
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.home = new Vector(x, y);
        this.mouseDist = 0.0;

        this.friction = 0.8;

        this.size = 2;
        this.color = '#946b2d';
        this.radius = 50;
    }

    update() {
        this.mouseDist = this.pos.subtract(mouse).length();
        if(this.mouseDist < this.radius) 
          this.acc = this.pos.subtract(mouse).scaleBy(50);

        this.acc = this.acc.add(this.home.subtract(this.pos));
        this.acc = this.acc.scaleBy(1/150);
        this.vel = this.vel.add(this.acc);
        this.vel = this.vel.scaleBy(this.friction);
        this.pos = this.pos.add(this.vel);

        this.acc = this.acc.scaleBy(0);
    }

    draw(){
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.size, Math.PI * 2, false);
      ctx.fill();
    }
  }

var mouse = new Vector(0, 0);
function onMouseMove(e){
  mouse.x = e.clientX;
  mouse.y = e.clientY - headerHeight;
}

function initScene(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold "+(canvasWidth/10)+"px Helvetica";
  ctx.textAlign = "center";
  ctx.fillText(phrases[currentPhrase], canvasWidth/2, canvasHeight/2);
  currentPhrase++;
  if(currentPhrase == phrases.length)
    currentPhrase = 0; 
    
  var data  = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.log(data);

  particles = [];
  for(var i = 0; i < canvasWidth; i += Math.round(canvasWidth / 200)){
    for(var j = 0; j < canvasHeight; j += Math.round(canvasHeight / 200)){
      if(data[ ((i + j * canvasWidth) * 4) + 3] > 150)
        particles.push(new Particle(i, j));
    }
  }
}

function onMouseClick(){
    if(mouse.y >= 0){
        setTimeout(initScene, 000); 
    }
}

function render(a) {
  requestAnimationFrame(render);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
};

window.addEventListener("mousemove", onMouseMove);
window.addEventListener("click", onMouseClick); 

initScene();
requestAnimationFrame(render);