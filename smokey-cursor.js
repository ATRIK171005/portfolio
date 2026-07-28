class SmokeyCursor {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, moved: false };
        this.hue = 0;
        
        this.init();
    }

    init() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '99999';
        document.body.appendChild(this.canvas);
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: true });
        
        this.loop();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    onMouseMove(e) {
        this.pointer.x = e.clientX;
        this.pointer.y = e.clientY;
        this.pointer.moved = true;
        this.addParticle(e.clientX, e.clientY);
    }

    onTouchMove(e) {
        if (e.touches.length > 0) {
            this.pointer.x = e.touches[0].clientX;
            this.pointer.y = e.touches[0].clientY;
            this.pointer.moved = true;
            this.addParticle(this.pointer.x, this.pointer.y);
        }
    }

    addParticle(x, y) {
        this.hue += 2;
        if (this.hue > 360) this.hue = 0;
        
        this.particles.push({
            x: x,
            y: y,
            size: Math.random() * 20 + 15,
            color: `hsla(${this.hue}, 100%, 70%, 1)`,
            life: 1.0,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 1, // drift upwards like smoke
            growth: Math.random() * 0.5 + 0.2
        });
    }

    loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Use lighter blending for glowing smoke
        this.ctx.globalCompositeOperation = 'screen';
        
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            
            p.life -= 0.02; // fade out
            p.x += p.vx;
            p.y += p.vy;
            p.size += p.growth;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                i--;
                continue;
            }
            
            this.ctx.beginPath();
            let gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            // Replace alpha in HSLA
            let colorStart = p.color.replace('1)', `${p.life * 0.5})`);
            let colorEnd = p.color.replace('1)', '0)');
            
            gradient.addColorStop(0, colorStart);
            gradient.addColorStop(1, colorEnd);
            
            this.ctx.fillStyle = gradient;
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        requestAnimationFrame(() => this.loop());
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new SmokeyCursor();
});
