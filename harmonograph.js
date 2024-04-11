const W = window.innerWidth;
const H = window.innerHeight; 

const p1 = new Pendulum(W/2,H/2);

// WHY JAVASCRIPT?!?!?
function mod(x,div) {
  var rem = x % div; 
  if (rem < 0) {
    return div+rem; 
  }
  return rem;
}

function set_size(canvas_id) {
  document.getElementById(canvas_id).setAttribute('width', W);
  document.getElementById(canvas_id).setAttribute('height', H);
}

function init() {
  // Cant do this in css for some reason
  set_size("canvas");
  window.requestAnimationFrame(trace);
}

var t_frame=null;
function trace() {
  const ctx = document.getElementById("canvas").getContext("2d");
  
  ctx.clearRect(0, 0, W,H); 
  p1.pixel_trail(ctx);

  t_frame = window.requestAnimationFrame(trace);

}

init();
