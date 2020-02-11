import { LW, R } from "./globals"
import { circleIntersectsLineSeg, Vector, Point } from "./geometry"

export default function LineCourse() {
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
    let np = new Point(pt.x, pt.y)
    this.points.push(np);
    this.ctx.lineTo(np.x, np.y);
    this.ctx.stroke()
    this.lastPt = np;
  }

  this.draw = function(ctx) {
    ctx.drawImage(this.canvas, 0, 0);
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