/* Real page shortcuts inside a Vista-inspired Start menu. */
(() => {
    const start = document.getElementById('vista-start');
    const menu = document.getElementById('vista-start-menu');
    const clock = document.getElementById('vista-clock');
    const isDesktopTheme = () => document.body.matches('.vista-theme, .xp-theme');
    document.getElementById('vista-personalize').addEventListener('click', event => {
        event.stopPropagation();
        window.openRetroThemePicker();
    });
    const windows = [
        ['.nineties-header', 'computer', 'Welcome Center — Griffin Rutherford'],
        ['#nineties-about', 'people'],
        ['#nineties-resume', 'documents'],
        ['#nineties-skills', 'control-panel'],
        ['#nineties-projects', 'folder'],
        ['.guestbook', 'mail']
    ].map(([selector, icon, fixedTitle]) => {
        const panel = document.querySelector(selector);
        if (!panel) return null;
        const heading = panel.querySelector('h2');
        const bar = document.createElement('div');
        bar.className = 'vista-window-titlebar vista-only';
        const title = document.createElement('span');
        title.className = 'vista-window-title';
        const image = document.createElement('img');
        image.src = `images/vista/${icon}.ico`;
        image.alt = ''; image.width = 20; image.height = 20; image.loading = 'lazy';
        bar.append(image, title);
        const controls = document.createElement('div');
        controls.className = 'vista-window-controls';
        const collapse = document.createElement('button');
        collapse.type = 'button';
        collapse.className = 'vista-window-minimize';
        collapse.setAttribute('aria-expanded', 'true');
        if (!panel.id) panel.id = 'vista-welcome-center';
        collapse.setAttribute('aria-controls', panel.id);
        const expand = document.createElement('button');
        expand.type = 'button'; expand.className = 'vista-window-maximize';
        expand.setAttribute('aria-pressed', 'false');
        function sync() {
            title.textContent = fixedTitle && document.body.classList.contains('xp-theme') ? 'My Computer — Griffin Rutherford' : fixedTitle || heading.textContent.trim();
            const minimized = panel.classList.contains('is-vista-minimized');
            collapse.setAttribute('aria-expanded', String(!minimized));
            collapse.setAttribute('aria-label', `${minimized ? 'Restore' : 'Minimize'} ${title.textContent}`);
            collapse.title = minimized ? 'Restore window' : 'Minimize window';
            const maximized = panel.classList.contains('is-vista-maximized');
            expand.setAttribute('aria-pressed', String(maximized));
            expand.setAttribute('aria-label', `${maximized ? 'Restore width of' : 'Expand'} ${title.textContent}`);
            expand.title = maximized ? 'Restore window width' : 'Expand window';
        }
        collapse.addEventListener('click', () => { panel.classList.toggle('is-vista-minimized'); sync(); });
        expand.addEventListener('click', () => {
            panel.classList.remove('is-vista-minimized');
            panel.classList.toggle('is-vista-maximized'); sync();
        });
        controls.append(collapse, expand); bar.append(controls);
        panel.prepend(bar); panel.classList.add('vista-window'); sync();
        return {panel, sync};
    }).filter(Boolean);
    function syncWindows() {
        if (!isDesktopTheme()) {
            windows.forEach(({panel}) => panel.classList.remove('is-vista-minimized', 'is-vista-maximized'));
        }
        windows.forEach(({sync}) => sync());
    }
    new MutationObserver(syncWindows).observe(document.body, {attributes: true, attributeFilter: ['class']});
    const desktopImages = [...document.querySelectorAll('.vista-window-titlebar img, .vista-shortcut-icon, .vista-file-icon, .vista-hero img, .vista-taskbar img, .vista-start-menu img, .vista-breadcrumb img, .vista-folder-status img')].map(image => ({image, source: image.getAttribute('src')}));
    function syncDesktopResources() {
        const xp = document.body.classList.contains('xp-theme');
        desktopImages.forEach(({image, source}) => {
            const match = source.match(/images\/vista\/(computer|network|folder|people|documents|control-panel|application|pictures|mail)\.ico$/);
            image.src = xp && match ? `images/xp/${match[1]}.ico` : source;
            if (image.classList.contains('vista-start-orb') && xp) image.src = 'images/xp/windows-logo.png';
        });
        document.querySelector('.vista-eyebrow').textContent = xp ? 'PERSONAL DESKTOP · WINDOWS XP / 2001' : 'PERSONAL DESKTOP · EST. 1996 / REMIXED 2007';
        document.querySelector('.vista-hero h2').textContent = xp ? 'Your next adventure starts here.' : 'Connected by curiosity.';
    }
    new MutationObserver(syncDesktopResources).observe(document.body, {attributes: true, attributeFilter: ['class']});
    syncDesktopResources();

    function restoreShortcut(target) {
        const item = windows.find(({panel}) => `#${panel.id}` === target);
        if (item) { item.panel.classList.remove('is-vista-minimized'); item.sync(); }
    }
    document.addEventListener('click', event => {
        const link = event.target.closest('a[href^="#"]');
        if (link && isDesktopTheme()) restoreShortcut(link.getAttribute('href'));
    });
    const search = document.getElementById('vista-project-search');
    const projectRows = Array.from(document.querySelectorAll('[data-vista-project]'));
    function filterProjects() {
        const query = isDesktopTheme() ? search.value.trim().toLowerCase() : '';
        let count = 0;
        projectRows.forEach(row => { row.hidden = !row.textContent.toLowerCase().includes(query); if (!row.hidden) count++; });
        document.getElementById('vista-project-count').textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
        document.getElementById('vista-project-empty').hidden = count !== 0;
    }
    search.addEventListener('input', filterProjects);
    new MutationObserver(filterProjects).observe(document.body, {attributes: true, attributeFilter: ['class']});
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
        if (isDesktopTheme() && reducedMotion.matches) marquee.stop();
        else marquee.start();
    };
    reducedMotion.addEventListener('change', window.syncVistaMotion);
    updateClock();
    setInterval(updateClock, 60000);
})();
