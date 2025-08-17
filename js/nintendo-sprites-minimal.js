// Minimal Nintendo Sprites - Only for replacing ASCII symbols
class NintendoSpritesMinimal {
    constructor() {
        this.spriteFiles = {
            star: '/images/sprites/nintendo/mario/floating-qblock.png',
            coin: '/images/sprites/nintendo/mario/floating-qblock.png',
            mushroom: '/images/sprites/nintendo/mario/yoshi-standing.png',
            kirby: '/images/sprites/nintendo/kirby/kirby-dance.gif',
            mario: '/images/sprites/nintendo/mario/mario-walking.gif'
        };
    }
    
    init() {
        // Only replace symbols in Nintendo theme
        this.replaceAsciiSymbols();
    }
    
    replaceAsciiSymbols() {
        // Replace [*] with coin/star sprite
        this.replaceTextWithSprite('\\[\\*\\]', this.spriteFiles.star, 16);
        
        // Replace [?] with question block sprite
        this.replaceTextWithSprite('\\[\\?\\]', this.spriteFiles.star, 16);
        
        // Replace (*) with mario sprite
        this.replaceTextWithSprite('\\(\\*\\)', this.spriteFiles.mario, 20);
        
        // Replace specific skill indicators
        this.replaceInSkills();
    }
    
    replaceTextWithSprite(pattern, spriteSrc, size) {
        const regex = new RegExp(pattern, 'g');
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Skip script and style elements
                    if (node.parentNode.tagName === 'SCRIPT' || 
                        node.parentNode.tagName === 'STYLE') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (regex.test(node.nodeValue)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_REJECT;
                }
            }
        );
        
        const nodesToReplace = [];
        while (walker.nextNode()) {
            nodesToReplace.push(walker.currentNode);
        }
        
        nodesToReplace.forEach(node => {
            const parent = node.parentNode;
            const text = node.nodeValue;
            const parts = text.split(regex);
            const matches = text.match(regex);
            
            if (matches) {
                const fragment = document.createDocumentFragment();
                
                parts.forEach((part, index) => {
                    if (part) {
                        fragment.appendChild(document.createTextNode(part));
                    }
                    if (index < matches.length) {
                        const img = document.createElement('img');
                        img.src = spriteSrc;
                        img.style.cssText = `
                            width: ${size}px;
                            height: ${size}px;
                            display: inline-block;
                            vertical-align: middle;
                            margin: 0 2px;
                            image-rendering: pixelated;
                            image-rendering: -moz-crisp-edges;
                            image-rendering: crisp-edges;
                        `;
                        fragment.appendChild(img);
                    }
                });
                
                parent.replaceChild(fragment, node);
            }
        });
    }
    
    replaceInSkills() {
        // Replace skill indicators with mini sprites
        document.querySelectorAll('.nintendo-skill').forEach(skill => {
            const text = skill.textContent;
            if (text.includes('(*)')) {
                skill.innerHTML = skill.innerHTML.replace('(*)', 
                    `<img src="${this.spriteFiles.mario}" style="width: 20px; height: 20px; display: inline-block; vertical-align: middle; margin-right: 5px; image-rendering: pixelated;">`);
            }
            if (text.includes('[o]')) {
                skill.innerHTML = skill.innerHTML.replace('[o]', 
                    `<img src="${this.spriteFiles.star}" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-right: 5px; image-rendering: pixelated;">`);
            }
            if (text.includes('^_^')) {
                skill.innerHTML = skill.innerHTML.replace('^_^', 
                    `<img src="${this.spriteFiles.kirby}" style="width: 20px; height: 20px; display: inline-block; vertical-align: middle; margin-right: 5px; image-rendering: pixelated;">`);
            }
            if (text.includes(':-)')) {
                skill.innerHTML = skill.innerHTML.replace(':-)', 
                    `<img src="${this.spriteFiles.mushroom}" style="width: 18px; height: 18px; display: inline-block; vertical-align: middle; margin-right: 5px; image-rendering: pixelated;">`);
            }
        });
    }
}

// Export for use
window.NintendoSpritesMinimal = NintendoSpritesMinimal;