/* Direct theme selection with icons and keyboard navigation. */
(() => {
    const picker = document.querySelector('.theme-picker');
    const trigger = document.getElementById('theme-toggle');
    const menu = document.getElementById('retro-theme-menu');
    const options = [...menu.querySelectorAll('[data-theme]')];

    function close(restoreFocus = false) {
        menu.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        if (restoreFocus) trigger.focus();
    }
    function open() {
        menu.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        (options.find(option => option.getAttribute('aria-selected') === 'true') || options[0]).focus();
    }
    window.openRetroThemePicker = open;
    window.syncRetroThemePicker = theme => {
        const selected = options.find(option => option.dataset.theme === theme);
        if (!selected) return;
        options.forEach(option => option.setAttribute('aria-selected', String(option === selected)));
        trigger.querySelector('img').src = selected.querySelector('img').getAttribute('src');
        const name = selected.querySelector('span').firstChild.textContent;
        trigger.querySelector('.theme-toggle-text').textContent = name;
        trigger.setAttribute('aria-label', `Choose retro theme. Current theme: ${name}.`);
    };
    trigger.addEventListener('click', () => menu.hidden ? open() : close());
    trigger.addEventListener('keydown', event => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            open();
        }
    });
    options.forEach(option => option.addEventListener('click', () => {
        window.applyRetroTheme(option.dataset.theme);
        close(true);
    }));
    menu.addEventListener('keydown', event => {
        const index = options.indexOf(document.activeElement);
        const moves = { ArrowDown: (index + 1) % options.length, ArrowUp: (index - 1 + options.length) % options.length, Home: 0, End: options.length - 1 };
        if (event.key in moves) {
            event.preventDefault();
            options[moves[event.key]].focus();
        }
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !menu.hidden) {
            event.preventDefault();
            close(true);
        }
    });
    document.addEventListener('click', event => {
        if (!picker.contains(event.target)) close();
    });
    document.addEventListener('focusin', event => {
        if (!picker.contains(event.target)) close();
    });
})();
