const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
    const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
    try {
        const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(process.env.PAGE_URL || 'http://127.0.0.1:8794/90s.html', { waitUntil: 'load' });
        const toggle = page.locator('#theme-toggle');
        const menu = page.getByRole('listbox', { name: 'Retro theme' });
        const select = async theme => {
            await toggle.click();
            await page.locator(`.theme-option[data-theme="${theme}"]`).click();
            assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
            assert.equal(await page.locator(`body.${theme}-theme`).count(), 1);
            assert.equal(await menu.isVisible(), false);
        };
        const out = process.env.SCREENSHOT_DIR || '/tmp/retro-themes-review';
        fs.mkdirSync(out, { recursive: true });
        assert.equal(await page.locator('body.vista-theme').count(), 1);
        assert.equal(await toggle.locator('.theme-toggle-text').textContent(), 'Windows Vista Aero');
        await toggle.focus(); await page.keyboard.press('ArrowDown');
        assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
        assert.equal(await menu.getByRole('option').count(), 4);
        assert.equal(await page.evaluate(() => document.activeElement.dataset.theme), 'vista');
        assert(await menu.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)));
        await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
        assert.equal(await page.locator('body.xp-theme').count(), 1);
        assert.equal(await page.evaluate(() => document.activeElement.id), 'theme-toggle');
        assert.equal(await toggle.locator('.theme-toggle-text').textContent(), 'Windows XP');
        assert.match(await toggle.locator('img').getAttribute('src'), /xp\/windows-logo.png/);
        assert.match(await page.locator('body').evaluate(el => getComputedStyle(el).backgroundImage), /xp\/bliss.jpg/);
        assert.match(await page.locator('.vista-hero').evaluate(el => getComputedStyle(el).fontFamily), /Tahoma/);
        assert.equal(await page.locator('.vista-taskbar').isVisible(), true);
        assert.match(await page.locator('.vista-start-orb').getAttribute('src'), /xp\/windows-logo.png/);
        assert.match(await page.locator('.vista-globe').getAttribute('src'), /xp\/network.ico/);
        assert.equal(await page.locator('.vista-globe').evaluate(el => getComputedStyle(el).animationName), 'none');

        assert.match(await page.locator('link[rel="icon"]').getAttribute('href'), /xp\/windows-logo.png/);
        assert.match(await page.locator('.vista-taskbar').evaluate(el => getComputedStyle(el).backgroundImage), /xp\/taskbar.png/);
        const start = page.locator('#vista-start');
        assert.match(await start.evaluate(el => getComputedStyle(el).backgroundImage), /xp\/start-button.png/);
        await start.hover();
        assert.equal(await start.evaluate(el => getComputedStyle(el).backgroundPosition), '50% 50%');
        await start.click();
        assert.equal(await start.evaluate(el => getComputedStyle(el).backgroundPosition), '50% 100%');
        await page.keyboard.press('Escape');
        const desktopIcons = page.locator('.vista-window-titlebar img, .vista-shortcut-icon, .vista-file-icon, .vista-taskbar img, .vista-start-menu img, .vista-breadcrumb img, .vista-folder-status img');
        assert(await desktopIcons.evaluateAll(images => images.filter(image => /images\/(vista|xp)\//.test(image.src)).every(image => image.src.includes('/xp/'))));
        await page.locator('.vista-breadcrumb img').scrollIntoViewIfNeeded();
        await page.waitForFunction(() => [...document.querySelectorAll('.vista-shortcut-icon,.vista-file-icon,.vista-breadcrumb img,.vista-folder-status img')].every(image => image.complete && image.naturalWidth > 0));
                const skills = page.locator('#nineties-skills');
        await skills.locator('.vista-window-minimize').click();
        assert.equal(await skills.locator('.skill-bar').first().isVisible(), false);
        await page.locator('#vista-start').click();
        assert(await page.locator('#vista-start-menu').isVisible());
        await page.locator('#vista-start-menu a[href="#nineties-skills"]').click();
        assert(await skills.locator('.skill-bar').first().isVisible());
        assert.equal(await page.locator('#vista-start-menu').isVisible(), false);
        const search = page.locator('#vista-project-search');
        await search.fill('lune');
        assert.equal(await page.locator('[data-vista-project]:visible').count(), 1);
        await search.fill('no-such-project');
        assert(await page.locator('#vista-project-empty').isVisible());
        await search.fill('');
        await page.locator('.nineties-header .vista-window-maximize').click();
        assert.equal(await page.locator('.nineties-header .vista-window-maximize').getAttribute('aria-pressed'), 'true');
        await page.locator('.nineties-header .vista-window-maximize').click();
        await page.locator('#vista-start').click();
        await page.locator('#vista-personalize').click();
        assert(await menu.isVisible());
        assert.equal(await page.locator('#vista-start-menu').isVisible(), false);
        await page.keyboard.press('Escape');
        assert.equal(await page.evaluate(() => document.activeElement.id), 'theme-toggle');
        await toggle.click(); await page.keyboard.press('End');
        assert.equal(await page.evaluate(() => document.activeElement.dataset.theme), 'matrix');
        await page.keyboard.press('Home');
        assert.equal(await page.evaluate(() => document.activeElement.dataset.theme), 'vista');
        await page.keyboard.press('Escape');
        await toggle.click(); await page.locator('h1').click();
        assert.equal(await menu.isVisible(), false);

        // Leaving the desktop clears its transient UI; Matrix and Kirby clean up too.
        await skills.locator('.vista-window-minimize').click();
        await search.fill('no-such-project');
        await select('nintendo');
        assert(await page.locator('.kirby-showcase').isVisible());
        assert.equal(await page.locator('.vista-taskbar').isVisible(), false);
        assert.equal(await page.locator('.is-vista-minimized,.is-vista-maximized').count(), 0);
        assert.equal(await page.locator('[data-vista-project][hidden]').count(), 0);
        await select('matrix');
        assert(await page.locator('#matrix-canvas').isVisible());
        assert.equal(await page.locator('.kirby-showcase').isVisible(), false);

        assert.match(await toggle.locator('img').getAttribute('src'), /matrix.svg/);
        assert.match(await page.locator('link[rel="icon"]').getAttribute('href'), /matrix.svg/);
        await page.waitForFunction(() => getComputedStyle(document.getElementById('nineties-about')).backgroundColor === 'rgba(0, 12, 5, 0.32)');
        for (const selector of ['.nineties-header', '#nineties-about', '.ascii-border', '#nineties-projects td', '.guestbook-entries']) {
            const style = await page.locator(selector).first().evaluate(el => { const s=getComputedStyle(el); return {background:s.backgroundColor,opacity:s.opacity,blur:s.backdropFilter}; });
            assert.match(style.background, /^rgba\(/, `${selector} has a translucent background`);
            assert(Number(style.background.match(/,\s*([\d.]+)\)$/)[1]) <= .4, `${selector} lets the rain through`);
            assert.equal(style.opacity, '1', 'text and controls remain opaque');
            assert.equal(style.blur, 'none', 'rain stays recognizable');
        }

        assert.equal(await page.locator('#matrix-canvas').evaluate(el => getComputedStyle(el).zIndex), '0');
        assert.equal(await page.locator('.nineties-wrapper').evaluate(el => getComputedStyle(el).zIndex), '1');
        const rain = () => page.locator('#matrix-canvas').evaluate(el => el.toDataURL());
        const still = await rain();
        await page.waitForTimeout(120); assert.equal(await rain(), still, 'reduced motion freezes the rain');
        await page.emulateMedia({reducedMotion:'no-preference'});
        await page.waitForTimeout(120); assert.notEqual(await rain(), still, 'rain animates when motion is enabled');
        await page.emulateMedia({reducedMotion:'reduce'});
        const stopped = await rain();
        await page.waitForTimeout(120); assert.equal(await rain(), stopped, 'motion preference can change while Matrix is selected');
        await select('xp');
        assert.equal(await page.locator('#matrix-canvas').isVisible(), false);
        assert.equal(await page.locator('.kirby-showcase').isVisible(), false);
        await search.fill('');
        await select('vista');
        assert.match(await page.locator('.vista-globe').getAttribute('src'), /vista\/network.ico/);
        assert.match(await page.locator('.vista-start-orb').getAttribute('src'), /vista\/start-orb.svg/);

        for (const width of [320, 390, 768, 1440]) {
            await page.setViewportSize({ width, height: 1000 });
            for (const theme of ['vista', 'xp', 'nintendo', 'matrix']) {
                await select(theme);
                assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${theme} fits ${width}px`);
                if (theme === 'matrix') assert.equal(await page.locator('.nineties-wrapper').evaluate(el => el.scrollLeft), 0, 'theme changes do not leave a hidden horizontal pan');
                await toggle.click();
                const bounds = await menu.boundingBox();
                assert(bounds.x >= 0 && bounds.x + bounds.width <= width, `picker fits ${width}px`);
                if ([390, 1440].includes(width)) {
                    await page.evaluate(() => scrollTo({left:0,top:0,behavior:'instant'}));
                    if (theme === 'matrix') await page.waitForTimeout(2500);
                    await page.screenshot({ path: `${out}/${theme}-picker-${width}.png` });
                    await page.keyboard.press('Escape');
                    if (['xp','matrix'].includes(theme)) await page.locator('#nineties-projects').screenshot({path: `${out}/${theme}-projects-${width}.png`});
                }
                await page.keyboard.press('Escape');
                if (theme === 'xp' && [390, 1440].includes(width)) {
                    await page.locator('#vista-start').click();
                    await page.screenshot({ path: `${out}/xp-start-${width}.png` });
                    await page.keyboard.press('Escape');
                }
            }
        }
        await page.reload();
        assert.equal(await page.locator('body.vista-theme').count(), 1);
        assert.deepEqual(errors, []);
        console.log('PASS: four-theme picker and favicons, authentic XP assets and Start states, desktop controls/search, transparent Matrix layers and rain motion, cleanup, keyboard navigation, and 320–1440px layouts.');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
