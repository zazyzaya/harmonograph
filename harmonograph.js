let W,H; 
let p1,p2,p3;
var t_frame=null;
let last_pen_x,last_pen_y
let pen_viz = true; 

window.onload = function() {
  W = window.innerWidth;
  H = window.innerHeight; 
  
  p1 = new Pendulum(W/2,H/4,generateColor());
  p2 = new Pendulum(W/4,H/2,generateColor());
  p3 = new Pendulum(W/2,H/2,generateColor());
  
  [last_pen_x,last_pen_y] = combine_pendula();
  init();
};

function generateColor() {
  let hexSet = "0123456789ABCDEF";
  let finalHexString = "#";
  for (let i = 0; i < 6; i++) {
    finalHexString += hexSet[Math.ceil(Math.random() * 15)];
  }
  return finalHexString;
}

function set_size(canvas_id) {
  document.getElementById(canvas_id).setAttribute('width', W);
  document.getElementById(canvas_id).setAttribute('height', H);
}

function init() {
  // Cant do this in css for some reason
  set_size("canvas");
  set_size("trace"); 
  window.requestAnimationFrame(animate);
}

function reset() {
  const ca_ctx = document.getElementById("canvas").getContext("2d");
  const tr_ctx = document.getElementById("trace").getContext("2d");
  ca_ctx.clearRect(0, 0, W,H); 
  tr_ctx.clearRect(0, 0, W,H); 
  
  p1 = new Pendulum(W/2,H/4,generateColor());
  p2 = new Pendulum(W/4,H/2,generateColor());
  p3 = new Pendulum(W/2,H/2,generateColor());

  [last_pen_x,last_pen_y] = combine_pendula();
}

function combine_pendula() {
  // Translate s.t. center of screen is 0,0
  // Assumes input vectors are relative to pendula tip
  let [pen_x,pen_y] = p3.coords(tip=true);
  pen_x += W/2; pen_y += H/2;

  let [x1,y1] = p1.coords(tip=true); 
  let [x2,y2] = p2.coords(tip=true);

  // This needs to be adjusted if pendula aren't 
  // Orthoganal with pen at intersection
  return [pen_x +x1+x2, pen_y +y1+y2];
}

function animate() {
  p1.update(); 
  p2.update();
  p3.update();

  const ca_ctx = document.getElementById("canvas").getContext("2d");
  const tr_ctx = document.getElementById("trace").getContext("2d");

  // Draw the weights
  ca_ctx.clearRect(0, 0, W,H); 
  if (pen_viz) {
    p1.draw(ca_ctx);
    p2.draw(ca_ctx);
    p3.draw(ca_ctx);
  }

  // Trace the paths 
  let [pen_x, pen_y] = combine_pendula()
  tr_ctx.beginPath();
  tr_ctx.strokeStyle = document.getElementById("pen").value; 

  tr_ctx.moveTo(last_pen_x, last_pen_y); 
  tr_ctx.lineTo(pen_x, pen_y); 
  tr_ctx.stroke(); 

  last_pen_x = pen_x; 
  last_pen_y = pen_y;

  t_frame = window.requestAnimationFrame(animate);
}