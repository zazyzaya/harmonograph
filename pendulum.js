function generateColor() {
    let hexSet = "0123456789ABCDEF";
    let finalHexString = "#";
    for (let i = 0; i < 6; i++) {
      finalHexString += hexSet[Math.ceil(Math.random() * 15)];
    }
    return finalHexString;
  }

class Pendulum {
    constructor(x,y, l=10, lambda=0.99) {
        // X,y are coords when pendulum viewed from above 
        this.x = x; 
        this.y = y;
        this.l = l; 
        this.lambda = lambda; // Friction

        this.color = generateColor();
        this.dt = 0.01;

        // Angle when observed from the side wrt x
        this.theta = Math.cos(x / l)
        this.theta_v = 0; 

        // Angle off of x when obseved from above
        this.phi = Math.tanh(y/x); 
        this.phi_v = 0; 
    }

    coords() {
        let x = this.x + (this.l * Math.sinh(this.theta)); 
        let y = this.y + (x * Math.tan(this.phi)); 

        return [x,y];
    }

    update() {
        // Assume g/l = 1 
        let a_theta = -Math.sin(this.theta); 
        this.theta_v += a_theta; 
        this.theta_v *= this.lambda;
        this.theta += this.theta_v*this.dt; 

        let a_phi = -Math.sin(this.phi);
        this.phi_v += a_phi; 
        this.phi_v *= this.lambda; 
        this.phi += this.phi_v*this.dt;

    }

    pixel_trail(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color; 

        let size = 1;
        
        let [x,y] = this.coords(); 
        ctx.arc(x, y, 10, size, 2 * Math.PI, false);
        ctx.fill();

        this.update(); 
    }
}