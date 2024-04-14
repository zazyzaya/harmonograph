let W,H; 
let p1,p2,p3;
var t_frame=null;
let last_pen_x,last_pen_y

let pen_viz = false; 
let pause = false; 

const DEFAULT_PAPER = "#282828";
const DEFAULT_PEN = "#b4cbd9";

window.onload = function() {
  W = window.innerWidth;
  H = window.innerHeight; 
  
  p1 = new Pendulum(W/2,H/4,generateColor());
  p2 = new Pendulum(W/4,H/2,generateColor());
  p3 = new Pendulum(W/2,H/2,generateColor());
  
  [last_pen_x,last_pen_y] = combine_pendula();
  init();
};

function change_bg_color() {
  let c = document.getElementById("bgcolor").value
  document.body.style.backgroundColor = c; 
}

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

function fill_boxes() {
  document.getElementById("theta1").setAttribute("value", p1.theta); 
  document.getElementById("theta2").setAttribute("value", p2.theta); 
  document.getElementById("theta3").setAttribute("value", p3.theta); 
  document.getElementById("phi1").setAttribute("value", p1.phi); 
  document.getElementById("phi2").setAttribute("value", p2.phi); 
  document.getElementById("phi3").setAttribute("value", p3.phi); 
  document.getElementById("phidot1").setAttribute("value", p1.phi_v); 
  document.getElementById("phidot2").setAttribute("value", p2.phi_v); 
  document.getElementById("phidot3").setAttribute("value", p3.phi_v); 
  document.getElementById("l").setAttribute("value", p1.l / DEFAULT_L); 
  document.getElementById("zoom").setAttribute("value", p1.tip_l / DEFAULT_TIP); 
  document.getElementById("dt").setAttribute("value", p1.dt); 
}

function init() {
  // Cant do this in css for some reason
  set_size("canvas");
  set_size("trace"); 
  fill_boxes();
  window.requestAnimationFrame(animate);
}

function submit() {
  const ca_ctx = document.getElementById("canvas").getContext("2d");
  const tr_ctx = document.getElementById("trace").getContext("2d");
  ca_ctx.clearRect(0, 0, W,H); 
  tr_ctx.clearRect(0, 0, W,H); 

  let theta1 = parseFloat(document.getElementById("theta1").value); 
  let theta2 = parseFloat(document.getElementById("theta2").value); 
  let theta3 = parseFloat(document.getElementById("theta3").value); 
  let phi1 = parseFloat(document.getElementById("phi1").value); 
  let phi2 = parseFloat(document.getElementById("phi2").value); 
  let phi3 = parseFloat(document.getElementById("phi3").value); 
  let phi_v1 = parseFloat(document.getElementById("phidot1").value); 
  let phi_v2 = parseFloat(document.getElementById("phidot2").value);
  let phi_v3 = parseFloat(document.getElementById("phidot3").value);
  let l = parseFloat(document.getElementById("l").value);
  let zoom = parseFloat(document.getElementById("zoom").value);
  let dt = parseFloat(document.getElementById("dt").value);

  l = (isNaN(l)) ? 1 : l; 
  zoom = (isNaN(zoom)) ? 1 : zoom;
  dt = (isNaN(dt)) ? DEFAULT_DT : dt; 
  
  p1 = new Pendulum(
    W/2,H/4,generateColor(), 
    l, zoom, theta1, phi1, phi_v1, dt 
  ); 
  p2 = new Pendulum(
    W/4,H/2,generateColor(), 
    l, zoom, theta2, phi2, phi_v2, dt
  ); 
  p3 = new Pendulum(
    W/2,H/2,generateColor(), 
    l, zoom, theta3, phi3, phi_v3, dt
  );

  fill_boxes(); 
  [last_pen_x,last_pen_y] = combine_pendula();
}

function reset() {
  const ca_ctx = document.getElementById("canvas").getContext("2d");
  const tr_ctx = document.getElementById("trace").getContext("2d");
  ca_ctx.clearRect(0, 0, W,H); 
  tr_ctx.clearRect(0, 0, W,H); 
  
  p1 = new Pendulum(W/2,H/4,generateColor());
  p2 = new Pendulum(W/4,H/2,generateColor());
  p3 = new Pendulum(W/2,H/2,generateColor());

  fill_boxes();
  [last_pen_x,last_pen_y] = combine_pendula();
  pause = false; 

  document.getElementById("pen").value = DEFAULT_PEN; 
  document.getElementById("bgcolor").value = DEFAULT_PAPER; 
  change_bg_color();
}

function clear_fn() {
  const ca_ctx = document.getElementById("canvas").getContext("2d");
  const tr_ctx = document.getElementById("trace").getContext("2d");
  ca_ctx.clearRect(0, 0, W,H); 
  tr_ctx.clearRect(0, 0, W,H); 
}

function pause_fn() {
  // If going into a pause, don't do anything
  if (!pause) {
    pause = true; 
    return; 
  } 

  // Unpausing
  pause = false;
  [last_pen_x,last_pen_y] = combine_pendula();
  t_frame = window.requestAnimationFrame(animate);
}

function combine_pendula() {
  // Translate s.t. center of screen is 0,0
  // Assumes input vectors are relative to pendula tip
  let pen_x = W/2; let pen_y = H/2;
  let [dx,dy] = p3.coords(tip=true); 
  pen_x += dx; pen_y += dy;

  let [x1,y1] = p1.coords(tip=true); 
  let [x2,y2] = p2.coords(tip=true);

  // This needs to be adjusted if pendula aren't 
  // Orthoganal with pen at intersection
  return [pen_x +x1+x2, pen_y +y1+y2];
}

function animate() {
  if (pause) {
    // Don't request new animation frame 
    // until unpaused
    return;
  }

  p1.update(); 
  p2.update();
  p3.update();

  const ca_ctx = document.getElementById("canvas").getContext("2d");
  const tr_ctx = document.getElementById("trace").getContext("2d");

  // Draw the weights
  ca_ctx.clearRect(0,0, W,H); 
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