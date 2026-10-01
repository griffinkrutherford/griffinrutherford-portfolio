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
        assert.match(await toggle.locator('img').getAttribute('src'), /theme-icons\/xp.svg/);
        assert.match(await page.locator('body').evaluate(el => getComputedStyle(el).backgroundImage), /xp\/bliss.jpg/);
        assert.match(await page.locator('.vista-hero').evaluate(el => getComputedStyle(el).fontFamily), /Tahoma/);
        assert.equal(await page.locator('.vista-taskbar').isVisible(), true);
        assert.match(await page.locator('.vista-start-orb').getAttribute('src'), /theme-icons\/xp.svg/);
        assert.match(await page.locator('.vista-globe').getAttribute('src'), /xp\/network.ico/);
        assert.equal(await page.locator('.vista-globe').evaluate(el => getComputedStyle(el).animationName), 'none');
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
                await toggle.click();
                const bounds = await menu.boundingBox();
                assert(bounds.x >= 0 && bounds.x + bounds.width <= width, `picker fits ${width}px`);
                if ([390, 1440].includes(width)) {
                    await page.evaluate(() => scrollTo(0, 0));
                    await page.screenshot({ path: `${out}/${theme}-picker-${width}.png` });
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
        console.log('PASS: default Vista, four-theme icon picker, arrows/Home/End/Enter/Escape, XP assets and desktop controls, search/Start shortcuts, theme cleanup, reduced motion, and 320–1440px layouts.');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
