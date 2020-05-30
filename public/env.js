//*****Environment*****\\
class Environment{

  constructor(n){
    this.obs = [];
    this.cirobs = [];
    
    for(let i = 1; i <= n/2; i++){
      this.obs.push(new Obstacle());
      this.cirobs.push(new circleObs());
    }
    this.mover = new Mover({lines: this.obs, cir: this.cirobs});
  }

  update(action){
    var record = {
      state: null,
      reward: 0,
      done: 0
    };
    this.mover.update(action);
    if(this.mover.crash){
      record.reward = -10;
      record.done = 1;
    }
    else if(this.mover.isNear)
      record.reward = -7;
    else{
      record.reward = 0;
    }
    record.state = this.getState();
    return record;
  }

  show(){
    for(let i = 0; i < this.obs.length; i++){
      this.obs[i].show();
      this.cirobs[i].show();
    }
    this.mover.show();
  }

  getState(){
    this.show();
    var data = tf.tidy(() => this.fun());
    return data;
  }

  fun(){
    // console.log('sensor: ' + this.mover.sensorValues);
    const s_t = tf.tensor1d(this.mover.sensorValues);
    const divider = tf.scalar(this.mover.MAX_DIST);
    return s_t.div(divider).arraySync();
  }
}

class Mover{
  constructor(obs){
    this.pos = createVector(random()*width, random()*height);
    this.vel = createVector(0,0.7);
    this.acc = createVector(0,0);
    this.mass = 1.5;
    this.rad = 11;
    this.crash = false;
    this.ray = [null];
    this.sensorValues = [];
    this.MAX_DIST = 30;
    this.obs = obs.lines;
    this.cir = obs.cir;
    this.isNear = false;
    while(this.sensorValues.length < 5) this.sensorValues.push(this.MAX_DIST);
  }
  
  checkIntersect(){
    this.sensorValues = [];
    this.isNear = false;
    while(this.sensorValues.length < 5) this.sensorValues.push(this.MAX_DIST);
    for(let i = 0; i < this.ray.length; i++){
      for(let j = 0; j < this.cir.length; j++){
        var a = this.intersect(this.pos, p5.Vector.add(this.ray[i], this.pos), this.obs[j].pos2, p5.Vector.add(this.obs[j].pos1,this.obs[j].pos2));
        var c = this.cir[j].intersectPoint(this.pos, p5.Vector.add(this.ray[i], this.pos));
        if(a || !(c<0)){
          var whatever;
          if(!(c<0) && a)
            whatever = round(min(p5.Vector.dist(this.pos, a), c));
          else{
            if(a)
              whatever = round((p5.Vector.dist(this.pos, a)));
            else if(!(c<0)){
              whatever = round(c);
            }
          }
          if(this.sensorValues[i] < whatever)
            continue;
          this.sensorValues[i] = whatever;
          // console.log(whatever);
          if(this.sensorValues[i] < 7) this.crash = true;
          if(this.sensorValues[i] < 23) this.isNear = true;
        }
      }
    }
  }
    
  raycast(){
    this.ray = [];
    var angleL;
    var head = degrees(this.vel.heading());
    for(angleL = head-30; angleL <= head+30; angleL += 15){
      this.ray.push(p5.Vector.fromAngle(radians(angleL)).setMag(this.MAX_DIST));
    }
  }
  
  intersect(point1, point2, point3, point4) {
    const a = point1.x;
    const b = point1.y;
    const c = point2.x;
    const d = point2.y;
    const p = point3.x;
    const q = point3.y;
    const r = point4.x;
    const s = point4.y;
    
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det == 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;

      if((0 < lambda && lambda < 1) && (0 < gamma && gamma < 1)){
        return this.intersect_point(point1, point2, point3, point4);
      }
      else return false;
    }
  }

  intersect_point(point1, point2, point3, point4) {
     const ua = ((point4.x - point3.x) * (point1.y - point3.y) - 
               (point4.y - point3.y) * (point1.x - point3.x)) /
              ((point4.y - point3.y) * (point2.x - point1.x) - 
               (point4.x - point3.x) * (point2.y - point1.y));

    const ub = ((point2.x - point1.x) * (point1.y - point3.y) - 
               (point2.y - point1.y) * (point1.x - point3.x)) /
              ((point4.y - point3.y) * (point2.x - point1.x) - 
               (point4.x - point3.x) * (point2.y - point1.y));

    const x = point1.x + ua * (point2.x - point1.x);
    const y = point1.y + ua * (point2.y - point1.y);

    return createVector(x, y);
  }

  edge(){
      this.pos.x = this.pos.x < 0 ? width : this.pos.x;
      this.pos.x = this.pos.x > width ? 0 : this.pos.x;
      this.pos.y = this.pos.y < 0 ? height : this.pos.y;
      this.pos.y = this.pos.y > height ? 0 : this.pos.y;
  }

  update(action){
    var offset;
    if(action == 0){
      offset = degrees(this.vel.heading()) - 90;
      if(offset < -179){
        offset = 2*179 + offset;
      }
    }
    else if(action == 1){
      offset = degrees(this.vel.heading()) + 90;
      if(offset > 179){
        offset = offset - 2*179;
      }
    }
    else
      offset = degrees(this.vel.heading());

    var a = p5.Vector.fromAngle(radians(offset)).setMag(0.02);
    
    this.acc.add(a);
    this.vel.add(this.acc.mult(4));
    this.pos.add(this.vel);
    this.vel.limit(1.5);
    this.acc.mult(0);
    this.edge();
    this.raycast();
    this.checkIntersect();
  
  }

  show(){
    push();
    translate(this.pos.x, this.pos.y);
    for(var p of this.ray){
      stroke(255);
      line(0,0,p.x, p.y);
    }
    noStroke();
    fill('green');
    ellipse(0, 0, this.rad);
    pop();
  }
}

function Obstacle(){
  this.angle = random()*180;
  this.pos1 = p5.Vector.fromAngle(radians(this.angle)).setMag(random(10,60));
  this.pos2 = createVector(random(0,1)*width, random(0,1)*height);

  this.show = function(){
    push();
    translate(this.pos2.x, this.pos2.y);
    stroke('red');
        line(0,0,this.pos1.x, this.pos1.y);
    pop();
  }
}

function circleObs(){
  this.dia = floor(random(4,25));
  this.pos = createVector(random()*width, random()*height);

  this.intersectPoint = function(p1, p2){
    line(p1.x, p1.y, p2.x, p2.y);
    const x = [p1.x, p2.x];
    const y = [p1.y, p2.y];
    const dx = x[1] - x[0];
    const dy = y[1] - y[0];
    const A = sq(dx) + sq(dy);
    const B = 2 * (dx * (x[0] - this.pos.x) + dy * (y[0] - this.pos.y));
    const C = sq((x[0] - this.pos.x)) + sq((y[0] - this.pos.y)) - sq(this.dia/2);
    const delta = B * B - 4 * A * C;
    // console.log('delta:'+delta);
    if(delta < 0) 
      return -1;
    else if(delta == 0){
      const t = -B /(2 * A);
      console.log("t: "+t);
      const X = x[0] + t * dx;
      const Y =  y[0] + t * dy;
      return p5.Vector.dist(p1,createVector(X, Y));
    }
    else if(delta > 0){
      var t1 = ((-B + sqrt(delta)) / (2 * A));
      var t2 = ((-B - sqrt(delta)) / (2 * A));
      if( t2 >= 0 && t2 <= 1){
        const in1 = createVector(x[0] + t1 * dx, y[0] + t1 * dy);
        const in2 = createVector(x[0] + t2 * dx, y[0] + t2 * dy);
        var shit =  min(p5.Vector.dist(p1, in1), p5.Vector.dist(p1, in2));
        // console.log("shit:"+shit);
        return shit;
      }
      return -1;
    }
  }

  this.show = () => {
    push();
    translate(this.pos.x, this.pos.y);
    noFill();
    stroke('red');
    ellipse(0, 0, this.dia);
    pop();
  }
}