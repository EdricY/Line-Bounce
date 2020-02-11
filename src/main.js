import { circleIntersectsLineSeg, midpoint, Point, Vector } from "./geometry";
import {
  canvas,
  ctx,
  TAU,
  W,
  H,
  G,
  BR,
  LW,
  R,
  MU,
} from "./globals"
import Ball from "./ball";
import LineCourse from "./linecourse";

import { midpress, initInputs, cursor } from "./input";

var course = new LineCourse();
var ball = new Ball();

window["course"] = course;

(function init() {
  ctx.strokeStyle = '#FFF';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = LW;
  initInputs(canvas, course);
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
  ball.update(course)
}

function draw() {
  ctx.fillStyle = "#778";
  ctx.fillRect(0, 0, W, H);
  ball.draw(ctx);
  course.draw(ctx);
  if (midpress) {
    drawPreviewLine(cursor);
  }
}

function drawPreviewLine(cursor) {
  let pt = course.lastPt;
  if (pt == null) return;
  ctx.beginPath();
  ctx.moveTo(pt.x, pt.y);
  ctx.lineTo(cursor.x, cursor.y);
  ctx.stroke();
}

