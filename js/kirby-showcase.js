// Original SNES sprites from WiKirby's Kirby Super Star gallery.
const kirbySprites = [
    ['kirby', 'Classic Kirby', 'Ready for adventure.'],
    ['hover', 'Hover Kirby', 'Floating into the next level.'],
    ['guard', 'Guard Kirby', 'Defense activated.'],
    ['jump', 'Jump Kirby', 'Up we go!'],
    ['hurt', 'Hurt Kirby', 'A little bump never ends the game.'],
    ['warp_star', 'Warp Star Kirby', 'Fast travel through Dream Land.'],
    ['sword', 'Sword Kirby', 'Hero mode equipped.'],
    ['fire', 'Fire Kirby', 'Turn up the heat.'],
    ['hammer', 'Hammer Kirby', 'Big ideas need a big hammer.'],
    ['beam', 'Beam Kirby', 'Electric possibilities.'],
    ['ice', 'Ice Kirby', 'Keep your cool.'],
    ['parasol', 'Parasol Kirby', 'Rain or shine, keep going.'],
    ['wing', 'Wing Kirby', 'Take the scenic route.'],
    ['wheel', 'Wheel Kirby', 'Speed run unlocked.'],
    ['bomb', 'Bomb Kirby', 'An explosive idea.'],
    ['cutter', 'Cutter Kirby', 'A sharp new angle.'],
    ['ninja', 'Ninja Kirby', 'Move quietly, make an impact.'],
    ['yo-yo', 'Yo-Yo Kirby', 'A perfect comeback.'],
    ['jet', 'Jet Kirby', 'Full throttle ahead.'],
    ['sleep', 'Sleep Kirby', 'Rest is a power-up too.'],
    ['cook', 'Cook Kirby', 'Something good is cooking.'],
    ['fighter', 'Fighter Kirby', 'Ready for the next round.'],
    ['mirror', 'Mirror Kirby', 'Look at it another way.'],
    ['plasma', 'Plasma Kirby', 'Energy fully charged.'],
    ['stone', 'Stone Kirby', 'Solid as a rock.']
];

const kirbyGrid = document.getElementById('kirby-grid');
const kirbyFeatureImage = document.getElementById('kirby-feature-image');
const kirbyFeatureName = document.getElementById('kirby-feature-name');
const kirbyFeatureHint = document.getElementById('kirby-feature-hint');
const kirbyBasePath = 'images/sprites/nintendo/kirby/super-star/';

if (kirbyGrid && kirbyFeatureImage && kirbyFeatureName && kirbyFeatureHint) {
    for (const [file, name, hint] of kirbySprites) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'kirby-card';
        button.setAttribute('aria-pressed', String(file === 'sword'));
        button.setAttribute('aria-label', `Equip ${name}`);

        const image = document.createElement('img');
        image.src = `${kirbyBasePath}${file}.png`;
        image.alt = '';
        image.width = 68;
        image.height = 68;
        image.loading = 'lazy';

        const caption = document.createElement('span');
        caption.textContent = name;
        button.append(image, caption);

        button.addEventListener('click', () => {
            if (button.getAttribute('aria-pressed') !== 'true' && document.body.classList.contains('nintendo-theme')) {
                window.KirbySfx?.play('abilityGain');
            }
            for (const card of kirbyGrid.children) {
                card.setAttribute('aria-pressed', String(card === button));
            }
            kirbyFeatureImage.src = image.src;
            kirbyFeatureImage.alt = name;
            kirbyFeatureName.textContent = name;
            kirbyFeatureHint.textContent = hint;
        });

        kirbyGrid.appendChild(button);
    }
}
