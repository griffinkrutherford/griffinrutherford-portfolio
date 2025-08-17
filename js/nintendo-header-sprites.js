// Nintendo Header Sprites - Replace emojis and symbols in headers with sprites
class NintendoHeaderSprites {
    constructor() {
        this.spriteMap = {
            '🍄': '/images/sprites/nintendo/mario/yoshi-standing.png',
            '⭐': '/images/sprites/nintendo/mario/floating-qblock.png', 
            '👑': '/images/sprites/nintendo/kirby/kirby-dance.gif',
            '🌟': '/images/sprites/nintendo/mario/floating-qblock.png',
            '🔥': '/images/sprites/nintendo/mario/mario-walking.gif',
            '🪙': '/images/sprites/nintendo/mario/floating-qblock.png',
            '[?]': '/images/sprites/nintendo/mario/floating-qblock.png',
            '[*]': '/images/sprites/nintendo/mario/floating-qblock.png'
        };
    }
    
    init() {
        // Replace emojis in headers after theme text updates
        setTimeout(() => {
            this.replaceHeaderSymbols();
        }, 200);
    }
    
    replaceHeaderSymbols() {
        // Target all Nintendo world titles and section titles
        const selectors = [
            '.nintendo-world-title',
            '.nineties-section-title',
            '.flame-text',
            '.rainbow-text',
            '.rotating-3d'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                this.replaceSymbolsInElement(element);
            });
        });
    }
    
    replaceSymbolsInElement(element) {
        let html = element.innerHTML;
        
        // Replace each emoji/symbol with an inline sprite image
        Object.entries(this.spriteMap).forEach(([symbol, spritePath]) => {
            const spriteImg = `<img src="${spritePath}" style="
                width: 24px;
                height: 24px;
                display: inline-block;
                vertical-align: middle;
                margin: 0 4px;
                image-rendering: pixelated;
                image-rendering: -moz-crisp-edges;
                image-rendering: crisp-edges;
                background: transparent;
            " alt="${symbol}">`;
            
            // Use a regex to replace all occurrences
            const regex = new RegExp(symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            html = html.replace(regex, spriteImg);
        });
        
        // Only update if changes were made
        if (html !== element.innerHTML) {
            element.innerHTML = html;
        }
    }
    
    // Clean up when switching themes
    cleanup() {
        // Headers will be reset by theme switcher
    }
}

// Export for use
window.NintendoHeaderSprites = NintendoHeaderSprites;