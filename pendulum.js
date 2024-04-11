class Pendulum {
    constructor(x,y,c, l=5000,tip_l=1, lambda=0.9999) {
        // X,y are coords when pendulum viewed from above 
        this.x = x; 
        this.y = y;
        this.color = c; 

        this.l = l; 
        this.tip_l = tip_l; 
        this.lambda = lambda; // Friction
        this.dt = 0.01;

        // Angle when observed from the side wrt x
        this.theta = Math.random()*0.1 -0.05;
        this.theta_v = Math.random()/25 - 0.05; 

        // Angle off of x when obseved from above
        this.phi = Math.tanh(y/x); 
        this.phi_v = Math.random() * 10 - 5; 

        this.last_x = NaN; 
        this.last_y = NaN; 
    }

    coords(tip=false) {
        let lst = this.l * Math.sin(this.theta); 
        let dx = lst*Math.cos(this.phi); 
        let dy = lst*Math.sin(this.phi)

        if (tip) {
            // Coords are flipped and have 
            // [x,y]*tip_l magnitude 
            return [-dx*this.tip_l,-dy*this.tip_l];
        }

        return [this.x+dx, this.y+dy];
    }

    update() {
        let [x,y] = this.coords();
        this.last_x = x; 
        this.last_y = y; 

        // Assume g/l = 1 
        let a_theta = -Math.sin(this.theta); 
        this.theta_v += a_theta; 
        this.theta_v *= this.lambda;
        this.theta += this.theta_v*this.dt; 

        //this.phi_v *= this.lambda; 
        this.phi += this.phi_v*this.dt;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color; 

        let size = 1;
        
        let [x,y] = this.coords(); 
        ctx.arc(x, y, 10, size, 2 * Math.PI, false);
        ctx.fill();
    }

    trace(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.color; 

        let size = 0.1;
        let [x,y] = this.coords(); 

        ctx.moveTo(this.last_x, this.last_y); 
        ctx.lineTo(x, y); 
        ctx.stroke(); 
    }
}