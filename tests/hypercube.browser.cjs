const { chromium }=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
    const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
    try {
        const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
        const errors=[],failures=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400 && r.url().includes('/hypercube'))failures.push(r.url());});
        const base=process.env.PAGE_URL || 'http://127.0.0.1:8796/90s.html';
        const url=new URL(base);url.searchParams.set('theme','hypercube');
        await page.goto(url.href,{waitUntil:'load'});
        const canvas=page.locator('#hypercube-canvas'),bg=page.locator('#hypercube-background');
        await page.waitForFunction(()=>Number(document.getElementById('hypercube-canvas').dataset.renderCount)>0);
        const pixels=()=>canvas.evaluate(c=>c.toDataURL()),sky=()=>bg.evaluate(c=>c.toDataURL());
        assert(await page.locator('body.hypercube-theme').count());assert.equal(await page.locator('#theme-toggle .theme-toggle-text').textContent(),'Hypercube');
        assert.match(await page.locator('link[rel="icon"]').getAttribute('href'),/hypercube\/art\/emblem.png/);
        assert.equal(await page.locator('.vista-taskbar').isVisible(),false);assert.equal(await page.locator('.kirby-showcase').isVisible(),false);
        assert.equal(await page.locator('#matrix-canvas').isVisible(),false);
        assert.match(await page.locator('#hyper-summary').textContent(),/16 vertices · 32 edges/);
        const initial=await pixels(),initialSky=await sky();await page.waitForTimeout(180);assert.equal(await pixels(),initial);assert.equal(await sky(),initialSky);
        assert.equal(await page.locator('#hyper-motion').textContent(),'Play motion');
        await canvas.focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(60);assert.notEqual(await pixels(),initial);
        await page.keyboard.press('Home');await page.waitForTimeout(60);assert.equal(await pixels(),initial,'Home returns to the same camera');
        const bounds=await canvas.boundingBox();await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);await page.mouse.down();await page.mouse.move(bounds.x+bounds.width/2+60,bounds.y+bounds.height/2+35,{steps:5});await page.mouse.up();await page.waitForTimeout(60);assert.notEqual(await pixels(),initial,'pointer orbit changes the projection');
        await page.locator('#hyper-reset').click();await page.waitForTimeout(60);assert.equal(await pixels(),initial);
        await page.locator('#hyper-motion').click();await page.waitForTimeout(200);assert.notEqual(await pixels(),initial,'user can explicitly play motion');assert.notEqual(await sky(),initialSky);
        await page.locator('#hyper-motion').click();await page.waitForTimeout(80);const paused=await pixels(),pausedSky=await sky();await page.waitForTimeout(180);assert.equal(await pixels(),paused);assert.equal(await sky(),pausedSky);
        await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('#hyper-motion').click();await page.waitForTimeout(100);await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(80);const reduced=await pixels();await page.waitForTimeout(120);assert.equal(await pixels(),reduced,'changing the preference pauses motion');
        const out=process.env.SCREENSHOT_DIR || '/tmp/hypercube-review';fs.mkdirSync(out,{recursive:true});const files=[];
        // Review every dimension from three camera angles, at phone and desktop sizes.
        for(const width of [390,1440]) {
            await page.setViewportSize({width,height:1000});
            for(const d of [3,4,5,6]){
                await page.locator('#hyper-dimension').selectOption(String(d));
                await page.locator('#hyper-turn').fill('0');
                await page.locator('#hyper-turn').dispatchEvent('input');
                for(const view of ['front','reverse','overhead']){
                    await page.locator(`[data-hyper-view="${view}"]`).click();await page.waitForTimeout(70);
                    assert.equal(await canvas.getAttribute('data-vertices'),String(2**d));assert.equal(await canvas.getAttribute('data-edges'),String(d*2**(d-1)));
                    assert.match(await page.locator('#hyper-summary').textContent(),new RegExp(`${d} independent directions`));
                    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`fits ${width}`);
                    const file=`${d}d-${view}-${width}.png`;await page.locator('.hyper-observatory').screenshot({path:`${out}/${file}`});files.push(file);
                }
            }
            await page.locator('#hyper-dimension').selectOption('4');await page.locator('[data-hyper-view="front"]').click();
            for(const angle of [45,90,135]){
                await page.locator('#hyper-turn').fill(String(angle));await page.locator('#hyper-turn').dispatchEvent('input');await page.waitForTimeout(60);
                assert.equal(await page.locator('#hyper-turn-value').textContent(),`${angle}°`);
                const file=`4d-turn-${angle}-${width}.png`;await page.locator('.hyper-observatory').screenshot({path:`${out}/${file}`});files.push(file);
            }
            await page.locator('#hyper-turn').fill('0');await page.locator('#hyper-turn').dispatchEvent('input');await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(70);
            const heroFile=`hero-${width}.png`;await page.screenshot({path:`${out}/${heroFile}`,fullPage:width===1440});files.push(heroFile);
            for(const section of ['nineties-about','nineties-projects','nineties-skills']){const file=`${section}-${width}.png`;await page.locator(`#${section}`).screenshot({path:`${out}/${file}`});files.push(file);}
        }
        for(const width of [320,768]){await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`fits ${width}`);}
        await page.setViewportSize({width:844,height:390});await page.locator('#theme-toggle').click();await page.keyboard.press('End');const menu=page.locator('#retro-theme-menu');assert.equal(await page.evaluate(()=>document.activeElement.dataset.theme),'win2100');const menuBounds=await menu.boundingBox();assert(menuBounds.y+menuBounds.height<=390,'picker fits a short landscape viewport');await page.keyboard.press('Escape');
        await page.locator('#theme-toggle').click();await page.locator('[data-theme="matrix"]').click();assert.equal(await bg.isVisible(),false);assert.equal(await canvas.isVisible(),false);assert(await page.locator('#matrix-canvas').isVisible());
        const dormant=await canvas.getAttribute('data-render-count');await page.waitForTimeout(150);assert.equal(await canvas.getAttribute('data-render-count'),dormant,'no Hypercube frames in other themes');
        await page.locator('#theme-toggle').click();await page.locator('[data-theme="hypercube"]').click();assert(await canvas.isVisible());assert.equal(await page.locator('#matrix-canvas').isVisible(),false);
        await page.reload();assert(await page.locator('body.hypercube-theme').count(),'explicit theme link survives reload');
        const invalid=new URL(base);invalid.searchParams.set('theme','invalid');await page.goto(invalid.href);assert(await page.locator('body.vista-theme').count(),'invalid theme falls back to Vista');
        assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
        fs.writeFileSync(`${out}/gallery.html`,`<!doctype html><meta charset="utf-8"><title>Hypercube review</title><style>body{background:#080d1c;color:#e4eeff;font:14px system-ui;padding:20px}main{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}figure{margin:0;border:1px solid #60789f;border-radius:8px;padding:10px}img{display:block;width:100%;height:480px;object-fit:contain;object-position:top;background:#060b1f}figcaption{padding:10px}</style><h1>Hypercube: dimension, angle, and responsive review</h1><main>${files.map(f=>`<figure><img src="${f}"><figcaption>${f}</figcaption></figure>`).join('')}</main>`);
        console.log(`PASS: correct topology, pointer/keyboard orbit, controls, reduced-motion and pause, cleanup, theme links, 320–1440px and landscape layouts; ${files.length} screenshots in ${out}.`);
    }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
