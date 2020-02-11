import { Point } from "./geometry";
export let midpress = false;
export let cursor = new Point(-1, -1);
var canvasClientRatio = 1;

export function initInputs(canvas, course) {
  canvas.onmousemove = function(e) {
    cursor.x = (e.clientX - canvas.offsetLeft) * canvasClientRatio;
    cursor.y = (e.clientY - canvas.offsetTop) * canvasClientRatio;
  }
    
  canvas.onmousedown = function(e) {
    midpress = true;
  }
  
  canvas.onmouseup = function(e) {
    course.addPoint(cursor);
    midpress = false;
  }

  canvas.ontouchstart = function(e) {
    e.preventDefault();
    let touch = e.touches[0];
    cursor.x = (touch.clientX - canvas.offsetLeft) * canvasClientRatio;
    cursor.y = (touch.clientY - canvas.offsetTop) * canvasClientRatio;
    midpress = true;
  }
  canvas.ontouchmove = function(e) {
    e.preventDefault();
    let touch = e.touches[0];
    cursor.x = (touch.clientX - canvas.offsetLeft) * canvasClientRatio;
    cursor.y = (touch.clientY - canvas.offsetTop) * canvasClientRatio;
    midpress = true;
  }
  canvas.ontouchend = function(e) {
    course.addPoint(cursor);
    midpress = false;
  }

}