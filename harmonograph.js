let W,H; 
let p1,p2,p3;
var t_frame=null;
let last_pen_x,last_pen_y

let pen_viz = true; 
let pause = false; 

window.onload = function() {
  W = window.innerWidth;
  H = window.innerHeight; 
  
  p1 = new Pendulum(W/2,H/4,generateColor());
  p2 = new Pendulum(W/4,H/2,generateColor());
  //p3 = new Pendulum(W/2,H/2,generateColor());
  
  [last_pen_x,last_pen_y] = combine_pendula();
  init();
};


let current_mx,current_my; 
onmousemove = function(e){current_mx=e.clientX; current_my=e.clientY;}

let dragging = null;
function check_drag(e) {
  let mx = e.clientX; let my = e.clientY; 
  console.log(e);

  let ps = [p1,p2]
  for (let i=0; i<2; i++) {
    p = ps[i];

    let [x,y] = p.coords(); 
    // Balls all 25px diameter
    if ((Math.pow(x-mx, 2)+Math.pow(y-my, 2)) <= 25*25) {
      dragging = p; 
      p.held_offset = [x-mx, y-my]; 
      p.being_dragged = true;
    }
  }  
}

function stop_drag(e) {
  if (dragging) { dragging.being_dragged = false; }
  dragging = null; 
}

onmousedown = check_drag; 
onmouseup = stop_drag; 


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
  //p3 = new Pendulum(W/2,H/2,generateColor());

  [last_pen_x,last_pen_y] = combine_pendula();
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

  p1.update(current_mx, current_my); 
  p2.update(current_mx, current_my);
  //p3.update(current_mx, current_my);

  const ca_ctx = document.getElementById("canvas").getContext("2d");
  const tr_ctx = document.getElementById("trace").getContext("2d");

  // Draw the weights
  ca_ctx.clearRect(0,0, W,H); 
  if (pen_viz) {
    p1.draw(ca_ctx, current_mx, current_my);
    p2.draw(ca_ctx, current_mx, current_my);
    //p3.draw(ca_ctx, current_mx, current_my);
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