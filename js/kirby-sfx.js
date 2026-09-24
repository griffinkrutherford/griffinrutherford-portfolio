// Kirby Super Star (SNES) sound effects used by the Nintendo page.
const kirbySoundFiles = {
    abilityGain: 'ability-gain.wav',
    menuSelect: 'menu-select.wav',
    starBounce: 'star-bounce.wav',
    oneUp: '1up.wav',
    pop: 'pop.wav',
    enterDoor: 'enter-door.wav',
    jump: 'jump.wav',
    starHit: 'star-hit.wav',
    switch: 'switch.wav',
    treasure: 'treasure.wav'
};

const kirbySounds = Object.fromEntries(
    Object.entries(kirbySoundFiles).map(([name, file]) => {
        const audio = new Audio(`audio/kirby-super-star/${file}`);
        audio.preload = 'auto';
        audio.volume = name === 'abilityGain' ? 0.45 : 0.35;
        return [name, audio];
    })
);

const activeSounds = new Set();
let kirbySfxEnabled = localStorage.getItem('kirbySfxEnabled') !== 'false';

window.KirbySfx = {
    play(name) {
        if (!kirbySfxEnabled || !kirbySounds[name]) return;
        const sample = kirbySounds[name];
        const audio = sample.cloneNode();
        audio.volume = sample.volume;
        activeSounds.add(audio);

        const cleanup = () => activeSounds.delete(audio);
        audio.addEventListener('ended', cleanup, { once: true });
        audio.addEventListener('error', cleanup, { once: true });
        audio.play().catch(cleanup);
    },
    get enabled() {
        return kirbySfxEnabled;
    },
    set enabled(value) {
        kirbySfxEnabled = Boolean(value);
        localStorage.setItem('kirbySfxEnabled', String(kirbySfxEnabled));
        if (!kirbySfxEnabled) {
            activeSounds.forEach(audio => audio.pause());
            activeSounds.clear();
        }
    }
};
