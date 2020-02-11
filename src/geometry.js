//stackoverflow.com/questions/37224912
export function circleIntersectsLineSeg(circle, radius, line){
  let b, c, d, u1, u2, ret, retP1, retP2, v1, v2, empty;
  v1 = {};
  v2 = {};
  v1.x = line.p2.x - line.p1.x;
  v1.y = line.p2.y - line.p1.y;
  v2.x = line.p1.x - circle.x;
  v2.y = line.p1.y - circle.y;
  b = (v1.x * v2.x + v1.y * v2.y);
  c = 2 * (v1.x * v1.x + v1.y * v1.y);
  b *= -2;
  d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - radius * radius));
  if(isNaN(d)){ // no intercept
    return null;
  }
  u1 = (b - d) / c;  // these represent the unit distance of point one and two on the line
  u2 = (b + d) / c;    
  retP1 = {};   // return points
  retP2 = {}
  ret = {}; // return array
  empty = true;
  if (u1 <= 1 && u1 >= 0){  // add point if on the line segment
    retP1.x = line.p1.x + v1.x * u1;
    retP1.y = line.p1.y + v1.y * u1;
    ret.p1 = retP1;
    empty = false;
  }

  if (u2 <= 1 && u2 >= 0){  // second add point if on the line segment
    retP2.x = line.p1.x + v1.x * u2;
    retP2.y = line.p1.y + v1.y * u2;
    ret.p2 = retP2;
    empty = false;
  }
  if (empty) return null;
  return ret;
}

export function midpoint(p1, p2) {
  let x = p1.x + p2.x
  let y = p1.y + p2.y
  return new Point(x/2, y/2);
}

export function Point(x, y) {
  this.x = x;
  this.y = y;
}

export function Vector(x, y) {
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
