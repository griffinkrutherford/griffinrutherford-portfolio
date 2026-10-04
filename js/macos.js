/* Mac desktop navigation, reversible window closing, and Dock magnification. */
(() => {
    'use strict';
    const isMac = () => document.body.matches('.macos-theme,.mac2010-theme');
    const trigger = document.getElementById('mac-menu-toggle');
    const menu = document.getElementById('mac-desktop-menu');
    const items = [...menu.querySelectorAll('[role="menuitem"]')];
    const dock = document.querySelector('.mac-dock');
    const dockItems = [...dock.querySelectorAll('a,button')];
    const panels = [...document.querySelectorAll('.vista-window')];
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    function close(restoreFocus = false) {
        menu.hidden = true;
        trigger.setAttribute('aria-expanded','false');
        if (restoreFocus) trigger.focus();
    }
    function open(last = false) {
        menu.hidden = false;
        trigger.setAttribute('aria-expanded','true');
        items[last ? items.length - 1 : 0].focus();
    }
    trigger.addEventListener('click', () => menu.hidden ? open() : close());
    trigger.addEventListener('keydown', event => {
        if (['ArrowDown','ArrowUp'].includes(event.key)) {
            event.preventDefault(); open(event.key === 'ArrowUp');
        }
    });
    menu.addEventListener('keydown', event => {
        const index = items.indexOf(document.activeElement);
        const next = {ArrowDown:(index+1)%items.length,ArrowUp:(index+items.length-1)%items.length,Home:0,End:items.length-1};
        if (event.key in next) { event.preventDefault(); items[next[event.key]].focus(); }
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !menu.hidden) { event.preventDefault(); close(true); }
    });
    document.addEventListener('click', event => {
        if (!menu.hidden && !menu.contains(event.target) && !trigger.contains(event.target)) close();
        const shortcut = event.target.closest('a[href^="#"]');
        if (shortcut && isMac()) {
            const panel = document.getElementById(shortcut.hash.slice(1));
            if (panel) panel.classList.remove('is-mac-closed');
            close();
        }
    });
    document.addEventListener('focusin', event => {
        if (!menu.hidden && !menu.contains(event.target) && !trigger.contains(event.target)) close();
    });
    document.querySelectorAll('[data-mac-personalize]').forEach(button => button.addEventListener('click', event => {
        event.stopPropagation();
        close(); window.openRetroThemePicker();
        document.getElementById('theme-toggle').scrollIntoView({block:'nearest'});
    }));
    document.getElementById('mac-restore-windows').addEventListener('click', () => {
        panels.forEach(panel => panel.classList.remove('is-mac-closed','is-vista-minimized','is-vista-maximized'));
        window.syncDesktopWindows();
        close(true);
    });
    for (const panel of panels) {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'mac-window-close mac-only';
        button.title = 'Close window; reopen from the Dock or desktop menu';
        const updateLabel = () => button.setAttribute('aria-label',`Close ${panel.querySelector('.vista-window-title').textContent}`);
        updateLabel();
        new MutationObserver(updateLabel).observe(panel.querySelector('.vista-window-title'),{childList:true});
        panel.querySelector('.vista-window-controls').prepend(button);
        button.addEventListener('click', () => {
            panel.classList.add('is-mac-closed');
            (dockItems.find(item => item.hash === `#${panel.id}`) || dockItems[0]).focus();
        });
    }
    function resetDock() {
        dockItems.forEach(item => { item.style.removeProperty('--dock-scale'); item.style.removeProperty('--dock-lift'); });
    }
    function magnify(position) {
        if (!isMac() || motion.matches) return resetDock();
        dockItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const proximity = Math.max(0,1-Math.abs(position-(rect.left+rect.width/2))/100);
            item.style.setProperty('--dock-scale',1+.32*proximity);
            item.style.setProperty('--dock-lift',proximity);
        });
    }
    dock.addEventListener('pointermove', event => { if (event.pointerType !== 'touch') magnify(event.clientX); });
    dock.addEventListener('pointerleave',resetDock);
    dock.addEventListener('focusin',event => {
        const item = event.target.closest('a,button');
        if (item) { const rect=item.getBoundingClientRect(); magnify(rect.left+rect.width/2); }
    });
    dock.addEventListener('focusout',event => { if (!dock.contains(event.relatedTarget)) resetDock(); });
    motion.addEventListener('change',resetDock);
    function sync() {
        close(); resetDock();
        if (!isMac()) { panels.forEach(panel=>panel.classList.remove('is-mac-closed')); return; }
        const era = document.body.classList.contains('mac2010-theme') ? 'classic' : 'modern';
        document.querySelectorAll('[data-mac-icon]').forEach(image => {
            const key=image.dataset.macIcon;
            image.src=key==='finder'?`images/macos/art/${era}-finder.png`:`images/macos/${era}/${key}.png`;
        });
        document.getElementById('mac-era-label').textContent = era === 'classic' ? 'MAC OS X · THE EARLY 2010s' : 'MACOS · A CONTEMPORARY DESKTOP';
        const heading = document.getElementById('mac-welcome-title');
        heading.replaceChildren(document.createTextNode(era === 'classic' ? 'Hello.' : 'A desktop for'),document.createElement('br'),document.createTextNode(era === 'classic' ? 'Make yourself at home.' : 'curious minds.'));
    }
    new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});sync();
    function updateClock() {
        const clock = document.getElementById('mac-clock'); const now=new Date();
        clock.textContent=new Intl.DateTimeFormat('en-US',{timeZone:'America/Denver',hour:'numeric',minute:'2-digit'}).format(now);
        clock.dateTime=now.toISOString(); clock.title='Current time in Santa Fe, New Mexico';
    }
    updateClock(); setInterval(updateClock,60000);
})();
