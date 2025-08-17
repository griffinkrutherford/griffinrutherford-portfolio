// Nintendo Sprites using actual sprite sheet files
// This implementation uses real sprite images from The Spriters Resource

class NintendoSpriteSystem {
    constructor() {
        this.sprites = [];
        this.container = null;
        this.animationFrames = {};
        
        // Actual sprite files available
        this.spriteFiles = {
            mario: [
                '/images/sprites/nintendo/mario/mario-walking.gif',
                '/images/sprites/nintendo/mario/yoshi-standing.png',
                '/images/sprites/nintendo/mario/floating-qblock.png'
            ],
            kirby: [
                '/images/sprites/nintendo/kirby/kirby-dance.gif'
            ]
        };
        
        this.loadedSheets = {};
    }
    
    init() {
        this.container = document.getElementById('nintendo-sprites-container');
        if (!this.container) {
            console.error('Nintendo sprites container not found');
            return;
        }
        
        // Clear existing sprites
        this.container.innerHTML = '';
        
        // Create sprites using actual files
        this.createSprites();
        
        // Start animation loop
        this.animate();
    }
    
    createSpriteImage(src) {
        const img = document.createElement('img');
        img.src = src;
        img.style.background = 'transparent';
        img.style.border = 'none';
        img.style.outline = 'none';
        return img;
    }
    
    createSprites() {
        // Create Mario walking sprites
        this.createMarioWalking();
        
        // Create Yoshi sprite
        this.createYoshiSprite();
        
        // Create Kirby dancing sprite
        this.createKirbyDancing();
        
        // Create floating question blocks
        for (let i = 0; i < 3; i++) {
            this.createFloatingBlock(i);
        }
    }
    
    createMarioWalking() {
        const sprite = document.createElement('div');
        sprite.className = 'nintendo-sprite sprite-mario';
        sprite.style.cssText = `
            position: fixed;
            left: -80px;
            bottom: 100px;
            height: 64px;
            z-index: 150;
            background: transparent;
        `;
        
        const img = this.createSpriteImage(this.spriteFiles.mario[0]);
        sprite.appendChild(img);
        
        // Animate sprite horizontally
        sprite.dataset.x = -80;
        sprite.dataset.speed = 3;
        
        this.sprites.push({
            element: sprite,
            type: 'mario-walking'
        });
        
        this.container.appendChild(sprite);
    }
    
    createYoshiSprite() {
        const sprite = document.createElement('div');
        sprite.className = 'nintendo-sprite sprite-yoshi';
        sprite.style.cssText = `
            position: fixed;
            right: 100px;
            bottom: 100px;
            height: 56px;
            z-index: 150;
            background: transparent;
        `;
        
        const img = this.createSpriteImage(this.spriteFiles.mario[1]);
        sprite.appendChild(img);
        
        // Bounce animation
        sprite.dataset.bounceY = 0;
        sprite.dataset.bounceDirection = 1;
        
        this.sprites.push({
            element: sprite,
            type: 'yoshi'
        });
        
        this.container.appendChild(sprite);
    }
    
    createKirbyDancing() {
        const sprite = document.createElement('div');
        sprite.className = 'nintendo-sprite sprite-kirby';
        sprite.style.cssText = `
            position: fixed;
            left: 50%;
            top: 20%;
            height: 80px;
            transform: translateX(-50%);
            z-index: 150;
            background: transparent;
        `;
        
        const img = this.createSpriteImage(this.spriteFiles.kirby[0]);
        sprite.appendChild(img);
        
        // Float animation
        sprite.dataset.floatAngle = 0;
        
        this.sprites.push({
            element: sprite,
            type: 'kirby-dancing'
        });
        
        this.container.appendChild(sprite);
    }
    
    createFloatingBlock(index) {
        const sprite = document.createElement('div');
        sprite.className = 'nintendo-sprite sprite-qblock';
        sprite.style.cssText = `
            position: fixed;
            left: ${20 + index * 30}%;
            top: 30%;
            height: 48px;
            z-index: 150;
            background: transparent;
        `;
        
        const img = this.createSpriteImage(this.spriteFiles.mario[2]);
        sprite.appendChild(img);
        
        // Pulse animation
        sprite.dataset.pulseScale = 1;
        sprite.dataset.pulseDirection = 1;
        
        this.sprites.push({
            element: sprite,
            type: 'qblock'
        });
        
        this.container.appendChild(sprite);
    }
    
    animate() {
        // Animate Mario walking (horizontal movement)
        this.sprites.filter(s => s.type === 'mario-walking').forEach(sprite => {
            const el = sprite.element;
            let x = parseFloat(el.dataset.x);
            const speed = parseFloat(el.dataset.speed);
            
            x += speed;
            if (x > window.innerWidth + 80) {
                x = -80;
            }
            
            el.dataset.x = x;
            el.style.left = `${x}px`;
        });
        
        // Animate Yoshi (bouncing)
        this.sprites.filter(s => s.type === 'yoshi').forEach(sprite => {
            const el = sprite.element;
            let bounceY = parseFloat(el.dataset.bounceY);
            let direction = parseInt(el.dataset.bounceDirection);
            
            bounceY += direction * 2;
            if (bounceY > 20 || bounceY < -20) {
                direction *= -1;
            }
            
            el.dataset.bounceY = bounceY;
            el.dataset.bounceDirection = direction;
            el.style.transform = `translateY(${bounceY}px)`;
        });
        
        // Animate Kirby (floating)
        this.sprites.filter(s => s.type === 'kirby-dancing').forEach(sprite => {
            const el = sprite.element;
            let angle = parseFloat(el.dataset.floatAngle);
            
            angle += 0.05;
            const floatY = Math.sin(angle) * 15;
            
            el.dataset.floatAngle = angle;
            el.style.transform = `translateX(-50%) translateY(${floatY}px)`;
        });
        
        // Animate question blocks (pulsing)
        this.sprites.filter(s => s.type === 'qblock').forEach(sprite => {
            const el = sprite.element;
            let scale = parseFloat(el.dataset.pulseScale);
            let direction = parseInt(el.dataset.pulseDirection);
            
            scale += direction * 0.005;
            if (scale > 1.05 || scale < 0.95) {
                direction *= -1;
            }
            
            el.dataset.pulseScale = scale;
            el.dataset.pulseDirection = direction;
            el.style.transform = `scale(${scale})`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    cleanup() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.sprites = [];
    }
}

// Initialize on page load
window.NintendoSpriteSystem = NintendoSpriteSystem;

// Auto-initialize if Nintendo theme is active
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the 90s page with Nintendo theme
    if (document.body.classList.contains('nintendo-theme')) {
        const spriteSystem = new NintendoSpriteSystem();
        spriteSystem.init();
        window.nintendoSpriteSystem = spriteSystem;
    }
});