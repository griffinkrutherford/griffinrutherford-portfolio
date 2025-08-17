// Nintendo Sprites using actual sprite sheet files
// This implementation uses real sprite images from The Spriters Resource

class NintendoSpriteSystem {
    constructor() {
        this.sprites = [];
        this.container = null;
        this.animationFrames = {};
        
        // Sprite sheet configurations
        this.spriteSheets = {
            mario: {
                src: '/images/sprites/nintendo/mario-world.png',
                frames: {
                    // Small Mario positions on sprite sheet (x, y, width, height)
                    smallStand: { x: 209, y: 0, w: 16, h: 16 },
                    smallWalk1: { x: 226, y: 0, w: 16, h: 16 },
                    smallWalk2: { x: 243, y: 0, w: 16, h: 16 },
                    smallJump: { x: 277, y: 0, w: 16, h: 16 },
                    // Big Mario
                    bigStand: { x: 209, y: 32, w: 16, h: 32 },
                    bigWalk1: { x: 226, y: 32, w: 16, h: 32 },
                    bigWalk2: { x: 243, y: 32, w: 16, h: 32 },
                    bigJump: { x: 277, y: 32, w: 16, h: 32 }
                }
            },
            kirby: {
                src: '/images/sprites/nintendo/kirby-sprites.png',
                frames: {
                    // Kirby positions (these are estimates, adjust based on actual sheet)
                    stand: { x: 0, y: 0, w: 20, h: 20 },
                    walk1: { x: 21, y: 0, w: 20, h: 20 },
                    walk2: { x: 42, y: 0, w: 20, h: 20 },
                    float: { x: 63, y: 0, w: 20, h: 20 },
                    inhale: { x: 84, y: 0, w: 20, h: 20 }
                }
            }
        };
        
        this.loadedSheets = {};
    }
    
    async init() {
        this.container = document.getElementById('nintendo-sprites-container');
        if (!this.container) {
            console.error('Nintendo sprites container not found');
            return;
        }
        
        // Clear existing sprites
        this.container.innerHTML = '';
        
        // Load sprite sheets
        await this.loadSpriteSheets();
        
        // Create sprites
        this.createSprites();
        
        // Start animation loop
        this.animate();
    }
    
    async loadSpriteSheets() {
        const promises = Object.entries(this.spriteSheets).map(([name, config]) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.loadedSheets[name] = img;
                    resolve();
                };
                img.onerror = () => {
                    console.error(`Failed to load sprite sheet: ${name}`);
                    resolve(); // Continue even if one fails
                };
                img.src = config.src;
            });
        });
        
        await Promise.all(promises);
    }
    
    createSpriteCanvas(sheetName, frameName, scale = 2) {
        const sheet = this.spriteSheets[sheetName];
        const frame = sheet.frames[frameName];
        const img = this.loadedSheets[sheetName];
        
        if (!img || !frame) return null;
        
        // Create canvas for sprite
        const canvas = document.createElement('canvas');
        canvas.width = frame.w * scale;
        canvas.height = frame.h * scale;
        
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false; // Keep pixels crisp
        
        // Draw sprite from sheet
        ctx.drawImage(
            img,
            frame.x, frame.y, frame.w, frame.h,  // Source
            0, 0, canvas.width, canvas.height     // Destination
        );
        
        return canvas;
    }
    
    createSprites() {
        // Create multiple Mario sprites
        for (let i = 0; i < 3; i++) {
            this.createMarioSprite(i);
        }
        
        // Create multiple Kirby sprites
        for (let i = 0; i < 3; i++) {
            this.createKirbySprite(i);
        }
        
        // Create coin blocks (using CSS as fallback)
        for (let i = 0; i < 5; i++) {
            this.createCoinBlock(i);
        }
    }
    
    createMarioSprite(index) {
        const sprite = document.createElement('div');
        sprite.className = 'nintendo-sprite sprite-mario';
        sprite.style.cssText = `
            position: fixed;
            left: ${-50 - index * 100}px;
            top: ${60 + index * 10}%;
            width: 32px;
            height: 32px;
            z-index: 150;
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
        `;
        
        // Create animation frames
        const frames = ['smallStand', 'smallWalk1', 'smallWalk2'];
        let currentFrame = 0;
        
        // Update sprite image
        const updateFrame = () => {
            const canvas = this.createSpriteCanvas('mario', frames[currentFrame]);
            if (canvas) {
                sprite.style.backgroundImage = `url(${canvas.toDataURL()})`;
                sprite.style.backgroundSize = 'contain';
                sprite.style.backgroundRepeat = 'no-repeat';
            }
        };
        
        updateFrame();
        
        // Animate sprite
        sprite.dataset.x = -50 - index * 100;
        sprite.dataset.speed = 2 + index * 0.5;
        sprite.dataset.frameCounter = 0;
        
        this.sprites.push({
            element: sprite,
            type: 'mario',
            updateFrame: () => {
                sprite.dataset.frameCounter = parseInt(sprite.dataset.frameCounter) + 1;
                if (sprite.dataset.frameCounter % 10 === 0) {
                    currentFrame = (currentFrame + 1) % frames.length;
                    updateFrame();
                }
            }
        });
        
        this.container.appendChild(sprite);
    }
    
    createKirbySprite(index) {
        const sprite = document.createElement('div');
        sprite.className = 'nintendo-sprite sprite-kirby';
        sprite.style.cssText = `
            position: fixed;
            left: ${70 + index * 25}%;
            top: ${20 + index * 15}%;
            width: 40px;
            height: 40px;
            z-index: 150;
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
        `;
        
        // Create animation frames
        const frames = ['stand', 'walk1', 'walk2', 'float'];
        let currentFrame = 0;
        
        // Update sprite image
        const updateFrame = () => {
            const canvas = this.createSpriteCanvas('kirby', frames[currentFrame]);
            if (canvas) {
                sprite.style.backgroundImage = `url(${canvas.toDataURL()})`;
                sprite.style.backgroundSize = 'contain';
                sprite.style.backgroundRepeat = 'no-repeat';
            }
        };
        
        updateFrame();
        
        // Float animation
        sprite.dataset.floatY = 0;
        sprite.dataset.floatAngle = index * Math.PI / 3;
        sprite.dataset.frameCounter = 0;
        
        this.sprites.push({
            element: sprite,
            type: 'kirby',
            updateFrame: () => {
                sprite.dataset.frameCounter = parseInt(sprite.dataset.frameCounter) + 1;
                if (sprite.dataset.frameCounter % 15 === 0) {
                    currentFrame = (currentFrame + 1) % frames.length;
                    updateFrame();
                }
            }
        });
        
        this.container.appendChild(sprite);
    }
    
    createCoinBlock(index) {
        const block = document.createElement('div');
        block.className = 'nintendo-sprite sprite-coin-block';
        block.style.cssText = `
            position: fixed;
            left: ${15 + index * 15}%;
            top: 40%;
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #FFA500, #FFD700);
            border: 2px solid #8B4513;
            z-index: 150;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: white;
            text-shadow: 1px 1px 0 #8B4513;
        `;
        block.textContent = '?';
        
        // Pulse animation
        block.dataset.pulseScale = 1;
        block.dataset.pulseDirection = 1;
        
        this.sprites.push({
            element: block,
            type: 'block'
        });
        
        this.container.appendChild(block);
    }
    
    animate() {
        // Animate Mario sprites (horizontal movement)
        this.sprites.filter(s => s.type === 'mario').forEach(sprite => {
            const el = sprite.element;
            let x = parseFloat(el.dataset.x);
            const speed = parseFloat(el.dataset.speed);
            
            x += speed;
            if (x > window.innerWidth + 50) {
                x = -50;
            }
            
            el.dataset.x = x;
            el.style.left = `${x}px`;
            
            // Update animation frame
            if (sprite.updateFrame) {
                sprite.updateFrame();
            }
        });
        
        // Animate Kirby sprites (floating)
        this.sprites.filter(s => s.type === 'kirby').forEach(sprite => {
            const el = sprite.element;
            let angle = parseFloat(el.dataset.floatAngle);
            
            angle += 0.05;
            const floatY = Math.sin(angle) * 20;
            
            el.dataset.floatAngle = angle;
            el.style.transform = `translateY(${floatY}px)`;
            
            // Update animation frame
            if (sprite.updateFrame) {
                sprite.updateFrame();
            }
        });
        
        // Animate coin blocks (pulsing)
        this.sprites.filter(s => s.type === 'block').forEach(sprite => {
            const el = sprite.element;
            let scale = parseFloat(el.dataset.pulseScale);
            let direction = parseInt(el.dataset.pulseDirection);
            
            scale += direction * 0.01;
            if (scale > 1.1 || scale < 0.9) {
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