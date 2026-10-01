/* Real page shortcuts inside a Vista-inspired Start menu. */
(() => {
    const start = document.getElementById('vista-start');
    const menu = document.getElementById('vista-start-menu');
    const clock = document.getElementById('vista-clock');
    function close(restoreFocus = false) {
        menu.hidden = true;
        start.setAttribute('aria-expanded', 'false');
        if (restoreFocus) start.focus();
    }
    start.addEventListener('click', () => {
        if (!menu.hidden) return close();
        menu.hidden = false;
        start.setAttribute('aria-expanded', 'true');
        menu.querySelector('a').focus();
    });
    menu.addEventListener('click', event => {
        if (event.target.closest('a')) close();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !menu.hidden) { event.preventDefault(); close(true); }
    });
    document.addEventListener('click', event => {
        if (!menu.hidden && !menu.contains(event.target) && !start.contains(event.target)) close();
    });
    document.addEventListener('focusin', event => {
        if (!menu.hidden && !menu.contains(event.target) && !start.contains(event.target)) close();
    });
    function updateClock() {
        const now = new Date();
        clock.textContent = new Intl.DateTimeFormat('en-US', {timeZone: 'America/Denver', hour: 'numeric', minute: '2-digit'}).format(now);
        clock.dateTime = now.toISOString();
        clock.title = 'Current time in Santa Fe, New Mexico';
    }
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    window.syncVistaMotion = () => {
        const marquee = document.querySelector('.nineties-marquee');
        if (document.body.classList.contains('vista-theme') && reducedMotion.matches) marquee.stop();
        else marquee.start();
    };
    reducedMotion.addEventListener('change', window.syncVistaMotion);
    updateClock();
    setInterval(updateClock, 60000);
})();
