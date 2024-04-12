class Pendulum {
    constructor(x,y,c, l=5000,tip_l=1, lambda=0.9999, theta_0=null, phi_0=null) {
        // X,y are coords when pendulum viewed from above 
        this.x = x; 
        this.y = y;
        this.color = c; 

        this.being_dragged = false; 
        this.held_offset = null;

        this.l = l; 
        this.tip_l = tip_l; 
        this.lambda = lambda; // Friction
        this.dt = 0.01;

        // Angle when observed from the side wrt x
        if (theta_0 == null) {
            this.theta = Math.random()*0.1 -0.05;
        } else {
            this.theta = theta_0; 
        }
        this.theta_v = Math.random()/100 - 0.005; 

        // Angle off of x when obseved from above
        if (phi_0 == null) {
            this.phi = Math.random() * 2; 
        }
        else {
            this.phi = phi_0;
        }
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

    update(mx,my) {
        if (this.being_dragged) {
            let [off_x,off_y] = this.held_offset; 
            let x = mx-off_x-this.x; let y = my-off_y-this.y; 

            this.theta_v = 0; 
            this.phi = Math.tanh(y/x); 
            this.theta = Math.sinh(x / (this.l * Math.cos(this.phi)));

            this.last_x = mx-off_x; 
            this.last_y = my-off_y;
            return; 
        }

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

    draw(ctx, x=null,y=null) {
        if (!this.being_dragged) {
            // Otherwise, mouse coords will be used 
            [x,y] = this.coords(); 
        }
        else {
            let [off_x,off_y] = this.held_offset; 
            x -= off_x; y -= off_y; 
        }
        
        // Draw ball
        ctx.beginPath();
        ctx.fillStyle = this.color; 
        ctx.arc(x, y, 25, 1, 2 * Math.PI, false);
        ctx.fill();

        // Draw line
        ctx.beginPath(); 
        ctx.strokeStyle = "#696969"; // hehe
        ctx.moveTo(this.x, this.y); 
        ctx.lineTo(x,y); 
        ctx.stroke();
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