const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
    const browser = await chromium.launch({
        headless: true,
        ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})
    });
    try {
        const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        const url = new URL(process.env.WORKSHEET_URL || 'http://127.0.0.1:8793/gradient-descent-worksheet/');
        url.searchParams.set('version', 'attention');
        await page.goto(url.href, { waitUntil: 'load' });
        const selector = page.getByLabel('Choose a lesson', { exact: true });
        const switchTo = async mode => {
            await selector.selectOption(mode);
            assert.equal(new URL(page.url()).searchParams.get('version'), mode);
            assert.equal(await page.locator('.worksheet-panel:visible').count(), 1);
            assert.equal(await page.locator('body').getAttribute('data-worksheet-mode'), mode);
        };
        assert.equal(await selector.inputValue(), 'attention');
        assert.equal(await selector.locator('option').count(), 6);
        assert.equal(await page.locator('#attention-worksheet [data-bonus-response]').count(), 9);
        assert.equal(await page.locator('#dimensions-worksheet [data-bonus-response]').count(), 10);
        assert(await page.locator('[data-bonus-response]').evaluateAll(inputs => inputs.every(input =>
            input.labels.length === 1 && input.getAttribute('aria-describedby').split(' ').every(id => document.getElementById(id))
        )));

        // Existing exit drafts keep their original key after the response-field update.
        await page.evaluate(() => localStorage.setItem('attention-exit-response', 'An earlier exit ticket.'));
        await page.reload();
        assert.equal(await page.locator('#att-exit-response').inputValue(), 'An earlier exit ticket.');
        const attentionDraft = 'Lower loss can improve a proxy without proving it serves the viewer.';
        const dimensionsDraft = 'The slice changes while the whole ball stays the same.';
        await page.locator('#att-language-response').fill(attentionDraft);
        await page.locator('#att-exit-response').fill('Compare engagement with the viewer’s stated intention.');
        await page.locator('#att-language-step').click();
        await page.waitForFunction(() => document.getElementById('att-language-summary').textContent.includes('1 updates'));
        const attentionBackground = await page.locator('.att-card').first().evaluate(el => getComputedStyle(el).backgroundImage);
        await switchTo('dimensions');
        await page.locator('#dim-slice-response').fill(dimensionsDraft);
        await page.locator('#dim-volume-response').fill('The fraction is 0.9 raised to the dimension.');
        await page.locator('#dim-exit-response').fill('A shadow loses depth information.');
        const dimensionsBackground = await page.locator('.dim-card').first().evaluate(el => getComputedStyle(el).backgroundImage);
        assert.notEqual(attentionBackground, dimensionsBackground);
        await switchTo('algebra');
        await page.locator('#practice-input-1').fill('An original worksheet draft.');
        for (const mode of ['calculus', 'statistics', 'modeling', 'dimensions', 'attention', 'algebra']) await switchTo(mode);
        assert.equal(await page.locator('#practice-input-1').inputValue(), 'An original worksheet draft.');
        await switchTo('attention');
        assert.equal(await page.locator('#att-language-response').inputValue(), attentionDraft);
        await page.reload();
        assert.equal(await page.locator('#att-language-response').inputValue(), attentionDraft);
        assert.equal(await page.locator('#att-exit-response').inputValue(), 'Compare engagement with the viewer’s stated intention.');
        await switchTo('dimensions');
        await page.reload();
        assert.equal(await selector.inputValue(), 'dimensions');
        assert.equal(await page.locator('#dim-slice-response').inputValue(), dimensionsDraft);
        assert.equal(await page.locator('#dim-volume-response').inputValue(), 'The fraction is 0.9 raised to the dimension.');
        assert.equal(await page.locator('#dim-exit-response').inputValue(), 'A shadow loses depth information.');

        const out = process.env.SCREENSHOT_DIR || '/tmp/worksheet-lessons-review';
        fs.mkdirSync(out, { recursive: true });
        for (const width of [320, 390, 768, 1440]) {
            await page.setViewportSize({ width, height: 1000 });
            for (const mode of ['dimensions', 'attention']) {
                await switchTo(mode);
                assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${mode} at ${width}px`);
                const field = page.locator(mode === 'dimensions' ? '#dim-slice-response' : '#att-language-response');
                const bounds = await field.boundingBox();
                assert(bounds.x >= 0 && bounds.x + bounds.width <= width, 'response fits viewport');
                if ([390, 1440].includes(width)) {
                    await page.evaluate(() => scrollTo(0, 0));
                    await page.screenshot({ path: `${out}/${mode}-${width}.png` });
                    await field.locator('..').screenshot({ path: `${out}/${mode}-response-${width}.png` });
                }
            }
        }

        // Printing expands long drafts instead of clipping them inside a textarea.
        const longDraft = Array.from({ length: 30 }, (_, i) => `Observation ${i + 1}: explain the mechanism.`).join('\n');
        for (const mode of ['dimensions', 'attention']) {
            await switchTo(mode);
            const field = page.locator(mode === 'dimensions' ? '#dim-slice-response' : '#att-language-response');
            await field.fill(longDraft);
            await page.emulateMedia({ media: 'print' });
            assert.equal(await field.isVisible(), false);
            const printed = field.locator('..').locator('.bonus-print-response');
            assert(await printed.isVisible());
            assert.equal(await printed.textContent(), longDraft);
            await page.emulateMedia({ media: 'screen' });
        }
        url.searchParams.set('version', 'unknown');
        await page.goto(url.href);
        assert.equal(await selector.inputValue(), 'algebra');
        assert.equal(await page.locator('.worksheet-panel:visible').count(), 1);

        // Blocked storage must leave both lectures and their response fields usable.
        const blocked = await browser.newPage({ reducedMotion: 'reduce' });
        blocked.on('pageerror', error => errors.push(error.message));
        await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } }));
        url.searchParams.set('version', 'attention');
        await blocked.goto(url.href);
        await blocked.locator('#att-language-response').fill('Works without storage.');
        assert.match(await blocked.locator('#att-language-response-status').textContent(), /while it is open/);
        await blocked.getByLabel('Choose a lesson', { exact: true }).selectOption('dimensions');
        await blocked.locator('#dim-slice-response').fill('Geometry draft without storage.');
        await blocked.getByLabel('Choose a lesson', { exact: true }).selectOption('attention');
        assert.equal(await blocked.locator('#att-language-response').inputValue(), 'Works without storage.');
        await blocked.close();
        assert.deepEqual(errors, []);
        console.log('PASS: six-lesson dropdown, deep links, 19 labeled bonus responses, draft persistence/migration, original drafts, blocked storage, distinct themes, mobile layouts, and full printed responses.');
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
