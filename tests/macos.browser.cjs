const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const root=process.env.PAGE_URL||'http://127.0.0.1:8796/90s.html';
  const out=process.env.SCREENSHOT_DIR||'/tmp/macos-review';fs.mkdirSync(out,{recursive:true});
  const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().startsWith(new URL(root).origin))failed.push(`${r.status()} ${r.url()}`);});
  // Screenshots should be reproducible and should not rely on external asset services.
  await page.route('**/*',r=>new URL(r.request().url()).origin===new URL(root).origin?r.continue():r.abort());
  const screenshot=async name=>{await page.waitForTimeout(180);await page.screenshot({type:'jpeg',quality:88,path:`${out}/${name}.jpg`});};
  const select=async theme=>{await page.locator('#theme-toggle').click();await page.locator(`[data-theme="${theme}"]`).click();await page.waitForFunction(theme=>document.body.classList.contains(`${theme}-theme`),theme);};
  for(const theme of ['macos','mac2010']){
   await page.goto(`${root}?theme=${theme}`);
   assert.equal(await page.locator('.theme-option').count(),9);
   assert(await page.locator('.mac-menubar').isVisible());assert(await page.locator('.mac-dock').isVisible());
   assert.equal(await page.locator('.vista-taskbar').isVisible(),false);
   assert.equal(await page.locator('.vista-hero').isVisible(),false);
   assert.match(await page.locator('link[rel="icon"]').getAttribute('href'),new RegExp(`${theme==='macos'?'modern':'classic'}-finder.png`));
   assert.match(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundImage),new RegExp(`${theme==='macos'?'modern':'classic'}-wallpaper.webp`));
   assert.equal(await page.locator('.experience-card').count(),8);
   assert.equal(await page.locator('.matrix-experience').isVisible(),false);
   await page.waitForFunction(()=>[...document.querySelectorAll('.mac-dock img,.mac-welcome img')].every(im=>im.complete&&im.naturalWidth>0));
   const menu=page.locator('#mac-desktop-menu'),trigger=page.locator('#mac-menu-toggle');
   await trigger.focus();await page.keyboard.press('ArrowDown');assert(await menu.isVisible());
   assert.equal(await page.evaluate(()=>document.activeElement.textContent),'About Griffin');
   await page.keyboard.press('End');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Return to the modern site');
   await page.keyboard.press('Home');await page.keyboard.press('ArrowDown');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Experience & education');
   await page.keyboard.press('Escape');assert.equal(await menu.isVisible(),false);assert(await trigger.evaluate(el=>el===document.activeElement));
   const skills=page.locator('#nineties-skills');await skills.locator('.vista-window-minimize').click();assert.equal(await skills.locator('.skill-bar').first().isVisible(),false);
   await page.locator('[data-mac-dock="skills"]').click();assert(await skills.locator('.skill-bar').first().isVisible());
   await skills.locator('.vista-window-maximize').click();assert.equal(await skills.locator('.vista-window-maximize').getAttribute('aria-pressed'),'true');
   await skills.locator('.vista-window-maximize').click();
   await skills.locator('.mac-window-close').click();assert.equal(await skills.isVisible(),false);
   await page.locator('[data-mac-dock="skills"]').click();assert(await skills.isVisible());
   await skills.locator('.mac-window-close').click();await trigger.click();await page.locator('#mac-restore-windows').click();assert(await skills.isVisible());
   const welcome=page.locator('.nineties-header');await welcome.locator('.mac-window-close').click();assert.equal(await welcome.isVisible(),false);
   await page.locator('[data-mac-dock="finder"]').click();assert(await welcome.isVisible());
   await page.locator('[data-mac-dock="mail"]').click();assert(await page.locator('#nineties-guestbook').isVisible());
   assert.equal(await page.locator('[id="vista-welcome-center"]').count(),1);
   const search=page.locator('#vista-project-search');await search.fill('lune');assert.equal(await page.locator('[data-vista-project]:visible').count(),1);
   await search.fill('nothing-matches');assert(await page.locator('#vista-project-empty').isVisible());await search.fill('');
   await page.locator('.mac-dock [data-mac-personalize]').click();assert(await page.locator('#retro-theme-menu').isVisible());await page.keyboard.press('Escape');
   assert.equal(await page.evaluate(()=>document.activeElement.id),'theme-toggle');
   for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:1000});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    assert.equal(await page.locator('.nineties-header .vista-window-controls button:visible').count(),3);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${theme} has no horizontal overflow at ${width}`);
    const bounds=await page.locator('.mac-dock').boundingBox();assert(bounds.x>=0&&bounds.x+bounds.width<=width);
    await screenshot(`${theme}-desktop-${width}`);
    if(width===390||width===1440){
     await trigger.click();await screenshot(`${theme}-menu-${width}`);
     assert.equal(await menu.locator('img').getAttribute('src'),'images/headshot-sep-26.jpg');
     await page.keyboard.press('Escape');
     for(const section of ['resume','projects','skills']){
      await page.locator(`#nineties-${section}`).scrollIntoViewIfNeeded();
      await page.waitForFunction(selector=>[...document.querySelectorAll(`${selector} img`)].filter(im=>getComputedStyle(im).display!=='none').every(im=>im.complete&&im.naturalWidth>0),`#nineties-${section}`);
      await screenshot(`${theme}-${section}-${width}`);
     }
    }
   }
   await page.setViewportSize({width:844,height:390});await trigger.click();const menuBounds=await menu.boundingBox();assert(menuBounds.y>=0&&menuBounds.y+menuBounds.height<=390);await screenshot(`${theme}-landscape`);await page.keyboard.press('Escape');
   await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
   await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('[data-mac-dock="projects"]').hover();
   assert(Number(await page.locator('[data-mac-dock="projects"]').evaluate(el=>el.style.getPropertyValue('--dock-scale')))>1);
   await screenshot(`${theme}-dock-hover`);
   await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('[data-mac-dock="projects"] img').evaluate(el=>getComputedStyle(el).transform),'none');
   await skills.locator('.mac-window-close').click();await select('vista');assert.equal(await page.locator('.is-mac-closed').count(),0);
   assert.equal(await page.locator('.mac-dock').isVisible(),false);assert(await page.locator('.vista-taskbar').isVisible());
   assert.equal(await page.locator('.mac-window-close:visible').count(),0);assert(await skills.isVisible());
   for(const other of ['matrix','nintendo','hypercube','xp','win98','win2100',theme]){await select(other);assert.equal(await page.locator('#mac-desktop-menu').isVisible(),false);}
  }
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  console.log('PASS: both Mac themes, generated and sourced local assets, nine-theme selection, menu keyboard/focus/Escape, current headshot, real Dock links, minimize/expand/close/reopen, show-all, project search, reduced-motion magnification, clean theme switching, unique IDs, 320–1440px and landscape layouts.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
