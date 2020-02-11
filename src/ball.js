import { TAU, BR, MU, R, G } from "./globals"
import { midpoint, Vector } from "./geometry"

export default function Ball() {
  this.x = 200;
  this.y = 20;
  this.v = new Vector(1, 1);
  this.r = BR;
  this.color = "red";

  this.update = function(lineCourse) {
    // this.v = this.v.plusxy(0, G);
    this.x += this.v.x;
    this.y += this.v.y;

    let collision = lineCourse.collides(this);
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
  