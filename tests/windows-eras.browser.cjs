const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
    const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
    try {
        const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[],failed=[];
        page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&/\/(win98|win2100|windows-98|windows-2100)/.test(r.url()))failed.push(r.url());});
        const base=process.env.PAGE_URL||'http://127.0.0.1:8796/90s.html';
        const out=process.env.SCREENSHOT_DIR||'/tmp/windows-eras-review';fs.mkdirSync(out,{recursive:true});
        const select=async key=>{await page.locator('#theme-toggle').click();await page.locator(`[data-theme="${key}"]`).click();assert(await page.locator(`body.${key}-theme`).count());};
        await page.goto(base,{waitUntil:'load'});assert(await page.locator('body.vista-theme').count());
        for(const theme of ['win98','win2100']){
            await select(theme);assert(await page.locator('.vista-taskbar').isVisible());assert(await page.locator('#nineties-about').textContent().then(text=>text.includes('600k+')));
            const ext=theme==='win98'?'png':'svg';assert.match(await page.locator('link[rel="icon"]').getAttribute('href'),new RegExp(`${theme}/windows-logo.${ext}`));
            // Every old desktop shell resource is replaced, including lazy folder icons.
            await page.locator('#nineties-projects').scrollIntoViewIfNeeded();
            await page.waitForFunction(()=>[...document.querySelectorAll('.vista-shortcut-icon,.vista-file-icon')].every(image=>image.complete&&image.naturalWidth>0));
            assert(await page.locator('.vista-window-titlebar img,.vista-shortcut-icon,.vista-file-icon,.vista-breadcrumb img,.vista-folder-status img,.vista-start-orb').evaluateAll(images=>images.every(image=>image.src.includes(`/${document.body.classList.contains('win98-theme')?'win98':'win2100'}/`))));
            const skills=page.locator('#nineties-skills');await skills.locator('.vista-window-minimize').click();assert.equal(await skills.locator('.skill-bar').first().isVisible(),false);await page.locator('#vista-start').click();await page.locator('#vista-start-menu a[href="#nineties-skills"]').click();assert(await skills.locator('.skill-bar').first().isVisible());
            await page.locator('#vista-project-search').fill('lune');assert.equal(await page.locator('[data-vista-project]:visible').count(),1);await page.locator('#vista-project-search').fill('not-a-project');assert(await page.locator('#vista-project-count').textContent().then(t=>t==='0 items'));assert(await page.locator('#vista-project-empty').isVisible());
            await page.locator('#vista-project-search').fill('');
            const expand=page.locator('.nineties-header .vista-window-maximize');await expand.click();assert.equal(await expand.getAttribute('aria-pressed'),'true');await expand.click();
            for(const width of [320,390,768,1440]){
                await page.setViewportSize({width,height:1000});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(80);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${theme} fits ${width}`);
                await page.screenshot({path:`${out}/${theme}-${width}.png`});
                if([390,1440].includes(width)){
                    await page.locator('#vista-start').focus();await page.keyboard.press('Enter');assert(await page.locator('#vista-start-menu').isVisible());await page.screenshot({path:`${out}/${theme}-start-${width}.png`});await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.id),'vista-start');
                    for(const section of ['nineties-about','nineties-projects'])await page.locator(`#${section}`).screenshot({path:`${out}/${theme}-${section}-${width}.png`});
                }
            }
        }
        await page.setViewportSize({width:1440,height:1000});
        const canvas=page.locator('#future-canvas'),background=page.locator('#future-background');await canvas.scrollIntoViewIfNeeded();
        const pixels=()=>canvas.evaluate(c=>c.toDataURL()),sky=()=>background.evaluate(c=>c.toDataURL());
        const initial=await pixels(),initialSky=await sky();await page.waitForTimeout(180);assert.equal(await pixels(),initial);assert.equal(await sky(),initialSky,'reduced motion freezes the background');
        await canvas.focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(60);assert.notEqual(await pixels(),initial);await page.keyboard.press('Home');await page.waitForTimeout(60);assert.equal(await pixels(),initial);
        const box=await canvas.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+60,box.y+box.height/2+30,{steps:6});await page.mouse.up();await page.waitForTimeout(60);assert.notEqual(await pixels(),initial,'pointer orbit changes the camera');
        for(const width of [390,1440]){
            await page.setViewportSize({width,height:1000});
            for(const view of ['front','reverse','overhead']){await page.locator(`[data-future-view="${view}"]`).click();await page.waitForTimeout(60);await page.locator('.future-scene').screenshot({path:`${out}/win2100-${view}-${width}.png`});}
        }
        await page.locator('#future-motion').click();await page.waitForTimeout(200);const animated=await pixels();assert.notEqual(animated,initial);assert.notEqual(await sky(),initialSky);await page.locator('#future-motion').click();await page.waitForTimeout(60);const paused=await pixels();await page.waitForTimeout(140);assert.equal(await pixels(),paused,'explicit pause stops motion');
        await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('#future-motion').click();await page.waitForTimeout(100);await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(60);const reduced=await pixels();await page.waitForTimeout(140);assert.equal(await pixels(),reduced,'live motion preference pauses the scene');
        const renders=await canvas.getAttribute('data-render-count');await select('win98');assert.equal(await background.isVisible(),false);await page.waitForTimeout(140);assert.equal(await canvas.getAttribute('data-render-count'),renders,'future animation stops outside its theme');
        // Repeated switching restores the exact resource family and functional text.
        for(const theme of ['xp','vista','matrix','nintendo','hypercube','win2100','win98']){await select(theme);assert.match(await page.locator('#nineties-resume').textContent(),/600k\+ lines/);assert.match(await page.locator('#nineties-about').textContent(),/600k\+/);if(['xp','vista','win98','win2100'].includes(theme))assert.match(await page.locator('.vista-globe').getAttribute('src'),new RegExp(`images/${theme}/`));}
        const deep=new URL(base);deep.searchParams.set('theme','win2100');await page.goto(deep.href);assert(await canvas.isVisible());assert.equal(await page.locator('#theme-toggle .theme-toggle-text').textContent(),'Windows 2100');await page.reload();assert(await page.locator('body.win2100-theme').count());
        deep.searchParams.set('theme','win98');await page.goto(deep.href);assert.equal(await page.locator('#theme-toggle .theme-toggle-text').textContent(),'Windows 98');await page.reload();assert(await page.locator('body.win98-theme').count());
        for(const route of ['index.html','legacy/index.html']){const url=new URL(route,base);await page.goto(url.href,{waitUntil:'domcontentloaded'});assert.match(await page.locator('body').textContent(),/600k\+ line/);assert.doesNotMatch(await page.locator('body').textContent(),/500k\+/);await page.setViewportSize({width:390,height:1000});await page.locator('.quick-links-button').click();await page.locator('.quick-links-nav .has-submenu > a').click();assert(await page.locator('.quick-links-menu').evaluate(el=>el.classList.contains('active')));assert(await page.locator('.has-submenu').evaluate(el=>el.classList.contains('active')));}
        assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
        console.log('PASS: both desktop eras, icons/favicons, Start shortcuts, minimize/restore/expand, project search, 320–1440px layouts, 3D views and pointer/keyboard orbit, pause/reduced motion/cleanup, deep links, and 600k+ across main/legacy/retro.');
    }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
