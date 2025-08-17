// Nintendo Theme Integration for 90s Page
// This script will activate once sprite images are added to the /images/sprites/nintendo/ directory

class NintendoTheme {
    constructor() {
        this.sprites = {
            mario: [
                'mario.png',
                'luigi.png', 
                'princess-peach.png',
                'bowser.png',
                'yoshi.png',
                'toad.png',
                'question-block.png',
                'brick-block.png',
                'pipe.png',
                'coin.png',
                'mushroom.png',
                'fire-flower.png',
                'star.png'
            ],
            kirby: [
                'kirby.png',
                'kirby-inhale.png',
                'waddle-dee.png',
                'king-dedede.png',
                'meta-knight.png'
            ],
            donkeyKong: [
                'donkey-kong.png',
                'diddy-kong.png',
                'barrel.png',
                'banana.png'
            ],
            zelda: [
                'link.png',
                'zelda.png',
                'ganon.png',
                'triforce.png',
                'rupee.png',
                'heart.png'
            ],
            metroid: [
                'samus.png',
                'metroid.png',
                'energy-tank.png'
            ],
            pokemon: [
                'pikachu.png',
                'pokeball.png',
                'charmander.png',
                'squirtle.png',
                'bulbasaur.png'
            ],
            starFox: [
                'fox.png',
                'falco.png',
                'arwing.png',
                'peppy.png'
            ]
        };
        
        this.basePath = '/images/sprites/nintendo/';
        this.activeSprites = [];
        this.isActive = false;
    }
    
    // Initialize the Nintendo theme
    init() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.createThemeStyles();
        // Disabled for cleaner aesthetic
        // this.addFloatingSprites();
        // this.addCoinCounter();
        // this.addPowerUpEffects();
        // this.addSoundEffects();
        // this.replaceButtons();
        // this.addWarpPipes();
        
        // Add Nintendo theme class to body
        document.body.classList.add('nintendo-theme');
        
        // Play theme music if available
        this.playThemeMusic();
    }
    
    // Create Nintendo-specific styles
    createThemeStyles() {
        const style = document.createElement('style');
        style.id = 'nintendo-theme-styles';
        style.textContent = `
            /* Nintendo Theme Styles */
            body.nintendo-theme {
                background: linear-gradient(to bottom, #5C94FC 0%, #5C94FC 70%, #C84C0C 70%, #C84C0C 100%);
                min-height: 100vh;
                position: relative;
                overflow-x: hidden;
            }
            
            /* Pixelated font */
            body.nintendo-theme * {
                image-rendering: pixelated;
                image-rendering: -moz-crisp-edges;
                image-rendering: crisp-edges;
            }
            
            /* Mario-style brick pattern background */
            body.nintendo-theme::before {
                content: '';
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                height: 100px;
                background-image: repeating-linear-gradient(
                    0deg,
                    #C84C0C,
                    #C84C0C 8px,
                    #000 8px,
                    #000 9px
                ),
                repeating-linear-gradient(
                    90deg,
                    #C84C0C,
                    #C84C0C 8px,
                    #000 8px,
                    #000 9px
                );
                z-index: -1;
            }
            
            /* Floating sprite animation */
            .nintendo-sprite {
                position: fixed;
                z-index: 1000;
                pointer-events: none;
                animation: float-sprite 10s infinite linear;
            }
            
            @keyframes float-sprite {
                from {
                    transform: translateX(-100px);
                }
                to {
                    transform: translateX(calc(100vw + 100px));
                }
            }
            
            /* Coin counter */
            .coin-counter {
                position: fixed;
                top: 20px;
                left: 20px;
                background: #000;
                color: #FFF;
                padding: 10px;
                border: 3px solid #FFF;
                font-family: 'Courier New', monospace;
                font-size: 20px;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .coin-counter img {
                width: 24px;
                height: 24px;
                animation: coin-spin 1s infinite linear;
            }
            
            @keyframes coin-spin {
                from { transform: rotateY(0deg); }
                to { transform: rotateY(360deg); }
            }
            
            /* Question block buttons */
            .nintendo-button {
                background: linear-gradient(to bottom, #FFD700 0%, #FFA500 100%);
                border: 3px solid #8B4513;
                color: #000;
                font-weight: bold;
                position: relative;
                box-shadow: 3px 3px 0 #654321;
                transition: all 0.1s;
            }
            
            .nintendo-button:hover {
                transform: translateY(-2px);
                box-shadow: 5px 5px 0 #654321;
            }
            
            .nintendo-button:active {
                transform: translateY(2px);
                box-shadow: 1px 1px 0 #654321;
            }
            
            .nintendo-button::before {
                content: '?';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 24px;
                color: #FFF;
                text-shadow: 2px 2px 0 #000;
            }
            
            /* Warp pipe decoration */
            .warp-pipe {
                position: fixed;
                bottom: 0;
                width: 80px;
                height: 100px;
                background: linear-gradient(to right, #00AA00 0%, #00FF00 50%, #00AA00 100%);
                border: 3px solid #000;
                border-bottom: none;
                z-index: 100;
            }
            
            .warp-pipe::before {
                content: '';
                position: absolute;
                top: -20px;
                left: -10px;
                right: -10px;
                height: 30px;
                background: linear-gradient(to right, #00AA00 0%, #00FF00 50%, #00AA00 100%);
                border: 3px solid #000;
                border-radius: 10px 10px 0 0;
            }
            
            .warp-pipe.left {
                left: 50px;
            }
            
            .warp-pipe.right {
                right: 50px;
            }
            
            /* Power-up animation */
            @keyframes power-up {
                0% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.5) rotate(180deg); }
                100% { transform: scale(1) rotate(360deg); }
            }
            
            .power-up-active {
                animation: power-up 0.5s ease-out;
            }
            
            /* 1-UP text effect */
            .one-up {
                position: fixed;
                color: #00FF00;
                font-size: 24px;
                font-weight: bold;
                text-shadow: 2px 2px 0 #000;
                pointer-events: none;
                animation: one-up-float 2s ease-out forwards;
                z-index: 10000;
            }
            
            @keyframes one-up-float {
                0% {
                    opacity: 1;
                    transform: translateY(0);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-100px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add floating sprites across the screen
    addFloatingSprites() {
        const spritesToFloat = [
            { game: 'mario', sprite: 'mushroom.png', y: '20%' },
            { game: 'mario', sprite: 'star.png', y: '40%' },
            { game: 'kirby', sprite: 'kirby.png', y: '60%' },
            { game: 'pokemon', sprite: 'pikachu.png', y: '30%' },
            { game: 'zelda', sprite: 'triforce.png', y: '50%' }
        ];
        
        spritesToFloat.forEach((item, index) => {
            setTimeout(() => {
                this.createFloatingSprite(item.game, item.sprite, item.y);
            }, index * 2000);
        });
    }
    
    // Create a single floating sprite
    createFloatingSprite(game, spriteName, yPosition) {
        const sprite = document.createElement('img');
        sprite.className = 'nintendo-sprite';
        sprite.src = `${this.basePath}${game}/${spriteName}`;
        sprite.style.top = yPosition;
        sprite.style.animationDuration = `${10 + Math.random() * 10}s`;
        sprite.style.animationDelay = `${Math.random() * 5}s`;
        
        sprite.onerror = () => {
            // If sprite doesn't exist yet, remove it
            sprite.remove();
        };
        
        document.body.appendChild(sprite);
        this.activeSprites.push(sprite);
        
        // Remove sprite after animation completes
        sprite.addEventListener('animationend', () => {
            sprite.remove();
            const index = this.activeSprites.indexOf(sprite);
            if (index > -1) {
                this.activeSprites.splice(index, 1);
            }
        });
    }
    
    // Add coin counter UI
    addCoinCounter() {
        const counter = document.createElement('div');
        counter.className = 'coin-counter';
        counter.innerHTML = `
            <img src="${this.basePath}mario/coin.png" alt="Coin" onerror="this.style.display='none'">
            <span id="coin-count">x 000</span>
        `;
        document.body.appendChild(counter);
        
        // Increment coins on certain actions
        let coinCount = 0;
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                coinCount++;
                document.getElementById('coin-count').textContent = `x ${String(coinCount).padStart(3, '0')}`;
                this.playCoinSound();
                
                // Show 1-UP every 100 coins
                if (coinCount % 100 === 0) {
                    this.show1Up(e.clientX, e.clientY);
                }
            }
        });
    }
    
    // Add power-up effects to hover elements
    addPowerUpEffects() {
        document.querySelectorAll('a, button, .skill-bar').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('power-up-active');
                setTimeout(() => {
                    element.classList.remove('power-up-active');
                }, 500);
            });
        });
    }
    
    // Replace buttons with question blocks
    replaceButtons() {
        document.querySelectorAll('button').forEach(button => {
            if (!button.classList.contains('nintendo-button')) {
                button.classList.add('nintendo-button');
            }
        });
    }
    
    // Add warp pipes decoration
    addWarpPipes() {
        const leftPipe = document.createElement('div');
        leftPipe.className = 'warp-pipe left';
        document.body.appendChild(leftPipe);
        
        const rightPipe = document.createElement('div');
        rightPipe.className = 'warp-pipe right';
        document.body.appendChild(rightPipe);
        
        // Make pipes clickable for navigation
        leftPipe.style.cursor = 'pointer';
        rightPipe.style.cursor = 'pointer';
        
        leftPipe.addEventListener('click', () => {
            this.warpAnimation('left');
        });
        
        rightPipe.addEventListener('click', () => {
            this.warpAnimation('right');
        });
    }
    
    // Warp pipe animation
    warpAnimation(direction) {
        const body = document.body;
        body.style.transition = 'transform 0.5s ease-in';
        body.style.transform = `translateY(100vh) scale(0.5)`;
        
        setTimeout(() => {
            // Scroll to different section
            if (direction === 'left') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
            
            body.style.transform = 'translateY(0) scale(1)';
        }, 500);
    }
    
    // Show 1-UP text
    show1Up(x, y) {
        const oneUp = document.createElement('div');
        oneUp.className = 'one-up';
        oneUp.textContent = '1-UP!';
        oneUp.style.left = `${x}px`;
        oneUp.style.top = `${y}px`;
        document.body.appendChild(oneUp);
        
        setTimeout(() => {
            oneUp.remove();
        }, 2000);
    }
    
    // Sound effects (placeholders - actual sounds need to be added)
    addSoundEffects() {
        // Create audio elements for sound effects
        this.sounds = {
            coin: new Audio(),
            powerUp: new Audio(),
            jump: new Audio(),
            warp: new Audio()
        };
        
        // Set source paths (these would need actual sound files)
        this.sounds.coin.src = '/audio/coin.wav';
        this.sounds.powerUp.src = '/audio/power-up.wav';
        this.sounds.jump.src = '/audio/jump.wav';
        this.sounds.warp.src = '/audio/warp.wav';
    }
    
    playCoinSound() {
        this.playSound('coin');
    }
    
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(() => {
                // Ignore errors if sound files don't exist
            });
        }
    }
    
    // Play theme music
    playThemeMusic() {
        const music = new Audio('/audio/mario-theme.mp3');
        music.loop = true;
        music.volume = 0.3;
        music.play().catch(() => {
            // Ignore if music doesn't exist or autoplay is blocked
        });
    }
    
    // Cleanup theme
    destroy() {
        // Remove all sprites
        this.activeSprites.forEach(sprite => sprite.remove());
        this.activeSprites = [];
        
        // Remove theme styles
        const styles = document.getElementById('nintendo-theme-styles');
        if (styles) styles.remove();
        
        // Remove theme class
        document.body.classList.remove('nintendo-theme');
        
        // Remove added elements
        document.querySelectorAll('.coin-counter, .warp-pipe, .one-up').forEach(el => el.remove());
        
        this.isActive = false;
    }
}

// Export for use in other scripts
window.NintendoTheme = NintendoTheme;