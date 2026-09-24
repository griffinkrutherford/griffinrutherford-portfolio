// Kirby Super Star (SNES) sound effects used by the Nintendo page.
const kirbySoundFiles = {
    abilityGain: 'ability-gain.wav',
    menuSelect: 'menu-select.wav',
    starBounce: 'star-bounce.wav',
    oneUp: '1up.wav',
    pop: 'pop.wav'
};

const kirbySounds = Object.fromEntries(
    Object.entries(kirbySoundFiles).map(([name, file]) => {
        const audio = new Audio(`audio/kirby-super-star/${file}`);
        audio.preload = 'auto';
        audio.volume = name === 'abilityGain' ? 0.45 : 0.35;
        return [name, audio];
    })
);

let kirbySfxEnabled = localStorage.getItem('kirbySfxEnabled') !== 'false';

window.KirbySfx = {
    play(name) {
        if (!kirbySfxEnabled || !kirbySounds[name]) return;
        const audio = kirbySounds[name];
        audio.pause();
        audio.currentTime = 0;
        audio.play().catch(() => {});
    },
    get enabled() {
        return kirbySfxEnabled;
    },
    set enabled(value) {
        kirbySfxEnabled = Boolean(value);
        localStorage.setItem('kirbySfxEnabled', String(kirbySfxEnabled));
        if (!kirbySfxEnabled) {
            Object.values(kirbySounds).forEach(audio => audio.pause());
        }
    }
};
