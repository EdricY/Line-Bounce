import { circleIntersectsLineSeg } from "./geometry";

const TAU = 2 * Math.PI;

var canvas = document.getElementById("canvas");
const W = canvas.width;
const H = canvas.height;
const G = .1;
const BR = 10;
const LW = 5;
const R = BR + LW/2;
const MU = .9

var canvasClientRatio = 1;
var ctx = canvas.getContext("2d");

var midpress = false;
var cursor = new Point(-1, -1);

var course = new LineCourse();
var ball = new Ball();

(function init() {
  ctx.strokeStyle = '#FFF';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = LW;

  requestAnimationFrame(tick);
})();

function tick() {
  update();
  draw();
  // setTimeout( ()=> 
  requestAnimationFrame(tick)
  // , 100)
}

function update() {
  ball.update()
}

function draw() {
  ctx.fillStyle = "#778";
  ctx.fillRect(0, 0, W, H);
  ball.draw(ctx);
  course.draw(ctx);
  if (midpress) drawPreviewLine(cursor);
}

function drawPreviewLine(cursor) {
  let pt = course.lastPt;
  if (pt == null) return;
  ctx.beginPath();
  ctx.moveTo(pt.x, pt.y);
  ctx.lineTo(cursor.x, cursor.y);
  ctx.stroke();
}

canvas.onmousemove = function(e) {
  let x = (e.clientX - canvas.offsetLeft) * canvasClientRatio;
  let y = (e.clientY - canvas.offsetTop) * canvasClientRatio;
  cursor = new Point(x, y);
}

canvas.onmousedown = function(e) {
  midpress = true;
}

canvas.onmouseup = function(e) {
  course.addPoint(cursor);
  midpress = false;
}

function LineCourse() {
  this.points = [];
  this.canvas = document.createElement("canvas");
  this.canvas.width = canvas.width;
  this.canvas.height = canvas.height;
  this.canvas.hidden = true;
  this.ctx = this.canvas.getContext("2d");
  this.ctx.strokeStyle = '#AAA';
  this.ctx.lineCap = 'round';
  this.ctx.lineJoin = 'round';
  this.ctx.lineWidth = LW;

  this.ctx.beginPath();

  this.lastPt = null;

  this.addPoint = function(pt) {
    this.points.push(pt);
    this.ctx.lineTo(pt.x, pt.y);
    this.ctx.stroke()
    this.lastPt = pt;
  }

  this.draw = function(ctx) {
    ctx.drawImage(this.canvas, 0, 0);
  }

  this.drawToCursor = function(pt) {
    if (midpress) { //replace to true for constant tracking
      this.ctx.strokeStyle = 'white'
      this.ctx.beginPath();
      this.ctx.moveTo(pt.x, pt.y);
      this.ctx.lineTo(cursor.x, cursor.y);
      this.ctx.stroke();
    }
  }

  this.collides = function(ball) {
    let len = this.points.length;
    if (len < 2) return null;

    let p2 = this.points[0];
    for (let i = 1; i < len; i++) {
      let p1 = p2;
      p2 = this.points[i];
      let line = {p1, p2};
      let r = ball.r + this.ctx.lineWidth/2;
      let collision = circleIntersectsLineSeg(ball, R, line);
      if (collision == null) continue;
      
      //calculate normal
      let dx = p2.x - p1.x
      let dy = p2.y - p1.y
      let n = new Vector(-dy, dx);
      collision.normal = n.normalize();
      return collision
    }
    return null;
  }
}

function Ball() {
  this.x = 200;
  this.y = 20;
  this.v = new Vector(0, 0);
  this.r = BR;
  this.color = "red";

  this.update = function() {
    this.v = this.v.plusxy(0, G);
    this.x += this.v.x;
    this.y += this.v.y;

    let collision = course.collides(this);
    if (collision != null) {
      let s = this.v.magnitude();
      let v = this.v.normalize();
      let n = collision.normal;
      let r = v.plus(n.scale(-2*(v.dot(n))));
      this.v = r.scale(s * MU);
      
      let p = collision.p1;
      if (!p) p = collision.p2;
      else if (collision.p2) p = midpoint(collision.p1, collision.p2)
      let nudge = new Vector(this.x - p.x, this.y - p.y);
      let ndist = R - nudge.magnitude();
      nudge = nudge.normalize().scale(2 * ndist);
      this.x += nudge.x;
      this.y += nudge.y; // TODO: check if nudge causes collision
    }

    // if (this.v.magnitude() > BR) { //is this needed?
    //   this.v = this.v.normalize().scale(BR);
    // }
  }

  this.draw = function(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, TAU);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function midpoint(p1, p2) {
  let x = p1.x + p2.x
  let y = p1.y + p2.y
  return new Point(x/2, y/2);
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}

function Vector(x, y) {
  this.x = x;
  this.y = y;
  
  this.dot = function(vec) {
    return vec.x*x + vec.y*y;
  }
  
  this.plusxy = function(ox, oy) {
    return new Vector(x+ox, y+oy);
  }

  this.plus = function(vec) {
    return new Vector(x+vec.x, y+vec.y);
  }
  
  this.scale = function(s) {
    return new Vector(s*x, s*y);
  }
  
  this.normalize = function() {
    let magn = this.magnitude();
    return new Vector(x/magn, y/magn);
  }

  this.magnitude = function() { //TODO: getter?
    return Math.sqrt(x*x + y*y);
  }
}
