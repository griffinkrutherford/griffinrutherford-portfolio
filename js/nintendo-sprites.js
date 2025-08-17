// Nintendo Sprites with Base64 Images
// Using pixel art representations of classic Nintendo characters

const NintendoSprites = {
    // Small Mario sprite (16x16 pixel art)
    mario: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA+klEQVQ4jWNgoDZgoOYFjAwMDP+R+P8ZGBj+E6MZBkaVDyILGBkYGP4zQEEjAwPDfyLdxAgFo8oHhQUsSCY3EqkZBhC0DBMnBzA2gNHIBqCzQeIgdiNUPzoYSS4YiQ6gBRiSi5lRsItczU5yNTvJ1ewkV7OTXM1OcjU7ydXsJFezk1zNTnI1O8nV7CRXs5NczU5yNTsRmqFyIxpx8R9XPKIlJ7gFqHyCgzwygJJJ/0eSDYxI4n8H3gLyXEAqICZ8BtQCUgJqJGdx/wdKJBADSMmhUAAF0IBawIiVl7Ayo0EaC5k1oxYMKgtGQyHQA2E0FEZDYTQURkMBAOF8VUs8snJ8AAAAAElFTkSuQmCC`,

    // Luigi sprite (16x16 pixel art - green version)
    luigi: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA+klEQVQ4jWNgoDZgoOYFjAwMDP+R+P8ZGBj+E6MZBkaVDyILGBkYGP4zQEEjAwPDfyLdxAgFo8oHhQUsSCY3EqkZBhC0DBMnBzA2gNHIBqCzQeIgdiNUPzoYSS4YiQ6gBRiSi5lRsItczU5yNTvJ1ewkV7OTXM1OcjU7ydXsJFezk1zNTnI1O8nV7CRXs5NczU5yNTsRmqFyIxpx8R9XPKIlJ7gFqHyCg7wqQBJZ/0eSDYxI4n8H3gLyXEAqICZ8BtQCUgJqJGdx/wdKJBADSMmhUAAF0IBawIiVl7Ayo0EaC5k1oxYMKgtGQyHQA2E0FEZDYTQURkMBAOF8VUs8snJ8AAAAAElFTkSuQmCC`,

    // Kirby sprite (16x16 pixel art)
    kirby: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAyklEQVQ4jWNgoDZgoOYFjAwMDIxYxP8zMDD8J8YAGBhVPogsYIRawILF8P8MDAwgzU5E6gVpboTqRwcjyQUj0QG0AENyMTMKdpGr2UmuZie5mp3kanaSq9lJrmYnuZqd5Gp2kqvZSa5mJ7manQjNULkRjbj4jyse0ZITXAJUPslBXhUgiaz/I8kGRiTxvwNvAfkuIBUQEz4DagEpATWSs7j/AyUSiAGk5FAogAJoQC1gxMrLWJnRII2FzJpRC4aVBaOhMBoKo6EAALVcT0HKz7q1AAAAAElFTkSuQmCC`,

    // Goomba sprite (16x16 pixel art)
    goomba: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0klEQVQ4jWNgoDZgoOYFjAwMDIxYxP8zMDD8J8YAGBhVPogsYIRawILF8P8MDAwgzU5E6gVpboTqRwcjyQUj0QG0AENyMTMKdpGr2UmuZie5mp3kanaSq9lJrmYnuZqd5Gp2kqvZSa5mJ7manQjNULkRjbj4jyse0ZIT3AJUPslBXhUgiaz/I8kGRiTxvwNvAfkuIBUQEz4DagEpATWSs7j/AyUSiAGk5FAogAJoQC1gxMrLWJnRII2FzJpRC4aVBaOhMBoKo6EwGgqjoTAaCgByXlFJEfU12QAAAABJRU5ErkJggg==`,

    // Mushroom sprite (16x16 pixel art)
    mushroom: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA3klEQVQ4jWNgoDZgoOYFjAwMDIxYxP8zMDD8J8YAGBhVPogsYIRawILF8P8MDAwgzU5E6gVpboTqRwcjyQUj0QG0AENyMTMKdpGr2UmuZie5mp3kanaSq9lJrmYnuZqd5Gp2kqvZSa5mJ7manQjNULkRjbj4jyse0ZIT3AJUPslBXhUgiaz/I8kGRiTxvwNvAfkuIBUQEz4DagEpATWSs7j/AyUSiAGk5FAogAJoQC1gxMrLWJnRII2FzJpRC4aVBaOhMBoKo6EwGgqjoTAaCqOhMBoKo6EwGgoAAADZYFNJ5nBoFwAAAABJRU5ErkJggg==`,

    // Fire Flower sprite (16x16 pixel art)
    fireFlower: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5klEQVQ4jWNgoDZgoOYFjAwMDIxYxP8zMDD8J8YAGBhVPogsYIRawILF8P8MDAwgzU5E6gVpboTqRwcjyQUj0QG0AENyMTMKdpGr2UmuZie5mp3kanaSq9lJrmYnuZqd5Gp2kqvZSa5mJ7manQjNULkRjbj4jyse0ZIT3AJUPslBXhUgiaz/I8kGRiTxvwNvAfkuIBUQEz4DagEpATWSs7j/AyUSiAGk5FAogAJoQC1gxMrLWJnRII2FzJpRC4aVBaOhMBoKo6EwGgqjoTAaCqOhMBoKo6EwGgqjoTAaCqOhAAA7ZlVJBBxBfQAAAABJRU5ErkJggg==`,

    // Star sprite (16x16 pixel art)
    star: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA5ElEQVQ4jWNgoDZgoOYFjAwMDIxYxP8zMDD8J8YAGBhVPogsYIRawILF8P8MDAwgzU5E6gVpboTqRwcjyQUj0QG0AENyMTMKdpGr2UmuZie5mp3kanaSq9lJrmYnuZqd5Gp2kqvZSa5mJ7manQjNULkRjbj4jyse0ZIT3AJUPslBXhUgiaz/I8kGRiTxvwNvAfkuIBUQEz4DagEpATWSs7j/AyUSiAGk5FAogAJoQC1gxMrLWJnRII2FzJpRC4aVBaOhMBoKo6EwGgqjoTAaCqOhMBoKo6EwGgqjoTAaCqOhAAC9ZVVJ2eN/mgAAAABJRU5ErkJggg==`,

    // Coin sprite (16x16 pixel art)
    coin: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4klEQVQ4jWNgoDZgoOYFjAwMDIxYxP8zMDD8J8YAGBhVPogsYIRawILF8P8MDAwgzU5E6gVpboTqRwcjyQUj0QG0AENyMTMKdpGr2UmuZie5mp3kanaSq9lJrmYnuZqd5Gp2kqvZSa5mJ7kanQjNULkRjbj4jyse0ZIT3AJUPslBXhUgiaz/I8kGRiTxvwNvAfkuIBUQEz4DagEpATWSs7j/AyUSiAGk5FAogAJoQC1gxMrLWJnRII2FzJpRC4aVBaOhMBoKo6EwGgqjoTAaCqOhMBoKo6EwGgqjoTAaCgAAslVVST0aQ1YAAAAASUVORK5CYII==`,

    // Question Block sprite (16x16 pixel art)
    questionBlock: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA6ElEQVQ4jWNgoDZgoOYFjAwMDIxYxP8zMDD8J8YAGBhVPogsYIRawILF8P8MDAwgzU5E6gVpboTqRwcjyQUj0QG0AENyMTMKdpGr2UmuZie5mp3kanaSq9lJrmYnuZqd5Gp2kqvZSa5mJ7manQjNULkRjbj4jyse0ZIT3AJUPslBXhUgiaz/I8kGRiTxvwNvAfkuIBUQEz4DagEpATWSs7j/AyUSiAGk5FAogAJoQC1gxMrLWJnRII2FzJpRC4aVBaOhMBoKo6EwGgqjoTAaCqOhMBoKo6EwGgqjoTAaCqOhMBoKAADCZlVJhx1A3QAAAABJRU5ErkJggg==`,

    // Yoshi sprite (20x20 pixel art)
    yoshi: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAA+klEQVQ4je2TMQ6CMBRAX4tJB+MJXLyAB/AEDsZbOHgAL+ABvIEX8AROxsHFxDgYE0MdSlJCW6jGwSSv6dI/770/lMI/oWxBl0rnhSu1KqUXsWyhjEAXeAdPGeBz3kLZgC5wBm7AATgBPeDur8AQeAA94ASscD8CGBQN1MAV2AM74ATsgrMNzooEKmAMjIJnA9SAGqiFMVBNFdE0TdM0TdPqphRABRhEzDSBJrCIAizBRYBXYJsEWIKnADdMBJgAl8jkrCCTzAAAAABJRU5ErkJggg==`,

    // Pikachu sprite (20x20 pixel art)
    pikachu: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAA/ElEQVQ4jbWUMQ6CMBSGvxaTDsYTuHgBD+AJHIy3cPAAXsADeAMv4AWcjIOLiXEwJoY6lKSEtlCNg0n+pU3f+977X0sp/BMqFnSpdF64UqtSehHLFsoIdIF38JQBPuctlA3oAmfgBhyAE9ADFAgHhsAD6AEn4ATsgrMNzooEKmAMjIJnA9SAGqiFMVBNFdE0TdM0TdO0uikFUAEGETNNoAlsogCLcBHgFdgmAZbgKcANEwEmwCUyOSvIJLMAJsAlMjkryCQzAK7AETgCR+AIHIE1cARWwBFYAkdgARyBOXAEZsARmAJH4AAAANZYFNJhx1A3QAAAABJRU5ErkJggg==`
};

// Function to create sprite elements
function createSpriteElement(type, x, y) {
    const sprite = document.createElement('img');
    sprite.src = NintendoSprites[type];
    sprite.className = `nintendo-sprite sprite-${type}`;
    sprite.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${type === 'yoshi' || type === 'pikachu' ? '40px' : '32px'};
        height: ${type === 'yoshi' || type === 'pikachu' ? '40px' : '32px'};
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
        z-index: 150;
        pointer-events: none;
    `;
    return sprite;
}

// Animation functions for sprites
function animateSprite(sprite, animationType) {
    switch(animationType) {
        case 'bounce':
            let bounceY = 0;
            let bounceDirection = 1;
            setInterval(() => {
                bounceY += bounceDirection * 2;
                if (bounceY > 10 || bounceY < -10) bounceDirection *= -1;
                sprite.style.transform = `translateY(${bounceY}px)`;
            }, 100);
            break;
            
        case 'horizontal':
            let posX = -50;
            setInterval(() => {
                posX += 2;
                if (posX > window.innerWidth + 50) posX = -50;
                sprite.style.left = `${posX}px`;
            }, 50);
            break;
            
        case 'float':
            let floatY = 0;
            let floatAngle = 0;
            setInterval(() => {
                floatAngle += 0.1;
                floatY = Math.sin(floatAngle) * 20;
                sprite.style.transform = `translateY(${floatY}px)`;
            }, 50);
            break;
            
        case 'spin':
            let rotation = 0;
            setInterval(() => {
                rotation += 5;
                sprite.style.transform = `rotate(${rotation}deg)`;
            }, 50);
            break;
    }
}

// Initialize Nintendo sprites on page
function initializeNintendoSprites() {
    const container = document.getElementById('nintendo-sprites-container');
    if (!container) return;
    
    // Clear existing sprites
    container.innerHTML = '';
    
    // Create Mario running across screen
    const mario = createSpriteElement('mario', -50, window.innerHeight * 0.7);
    container.appendChild(mario);
    animateSprite(mario, 'horizontal');
    
    // Create Luigi bouncing
    const luigi = createSpriteElement('luigi', window.innerWidth * 0.8, window.innerHeight * 0.6);
    container.appendChild(luigi);
    animateSprite(luigi, 'bounce');
    
    // Create floating Kirby
    const kirby = createSpriteElement('kirby', window.innerWidth * 0.3, window.innerHeight * 0.2);
    container.appendChild(kirby);
    animateSprite(kirby, 'float');
    
    // Create Goomba walking
    const goomba = createSpriteElement('goomba', -50, window.innerHeight * 0.85);
    container.appendChild(goomba);
    animateSprite(goomba, 'horizontal');
    
    // Create spinning star
    const star = createSpriteElement('star', window.innerWidth * 0.5, window.innerHeight * 0.15);
    container.appendChild(star);
    animateSprite(star, 'spin');
    
    // Create coins at various positions
    for (let i = 0; i < 5; i++) {
        const coin = createSpriteElement('coin', 
            Math.random() * window.innerWidth, 
            Math.random() * window.innerHeight * 0.5);
        container.appendChild(coin);
        animateSprite(coin, 'spin');
    }
    
    // Create question blocks
    for (let i = 0; i < 3; i++) {
        const block = createSpriteElement('questionBlock',
            100 + i * 150,
            window.innerHeight * 0.4);
        container.appendChild(block);
        animateSprite(block, 'bounce');
    }
    
    // Create mushroom
    const mushroom = createSpriteElement('mushroom', window.innerWidth * 0.7, window.innerHeight * 0.75);
    container.appendChild(mushroom);
    animateSprite(mushroom, 'bounce');
    
    // Create Yoshi
    const yoshi = createSpriteElement('yoshi', -50, window.innerHeight * 0.5);
    container.appendChild(yoshi);
    animateSprite(yoshi, 'horizontal');
    
    // Create Pikachu
    const pikachu = createSpriteElement('pikachu', window.innerWidth * 0.9, window.innerHeight * 0.3);
    container.appendChild(pikachu);
    animateSprite(pikachu, 'bounce');
}

// Export for use in 90s.html
window.NintendoSprites = NintendoSprites;
window.initializeNintendoSprites = initializeNintendoSprites;