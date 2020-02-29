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

var menuBtn = document.getElementById("menuBtn");
var playBtn = document.getElementById("play-btn");
var outerDiv = document.getElementById("outer-div");
var gameContainer = document.getElementById("game-container");
menuBtn.addEventListener("click", goToMenu);
playBtn.addEventListener("click", startPlaying);

function goToMenu() {
  gameContainer.classList.add("nodisp");
  outerDiv.classList.remove("nodisp");
}

function startPlaying() {
  outerDiv.classList.add("nodisp");
  gameContainer.classList.remove("nodisp");
}

// window["course"] = course; //for debug

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

var leftDrawer = document.getElementById("left-drawer");
leftDrawer.addEventListener("click", leftClicked)
function leftClicked() {
  outerDiv.classList.add("left-expand");
  outerDiv.classList.remove("right-expand");
}

var rightDrawer = document.getElementById("right-drawer");
rightDrawer.addEventListener("click", function() {
  outerDiv.classList.add("right-expand");
  outerDiv.classList.remove("left-expand");
});

var titleDiv = document.getElementById("title-div");
titleDiv.addEventListener("click", function() {
  outerDiv.classList.remove("left-expand");
  outerDiv.classList.remove("right-expand");
});