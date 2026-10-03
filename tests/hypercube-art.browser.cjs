const{chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[],failed=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&/\/(hypercube\/art|retro-experience|hyper.*art)/.test(r.url()))failed.push(r.url());});
  const base=process.env.PAGE_URL||'http://127.0.0.1:8796/90s.html',out=process.env.SCREENSHOT_DIR||'/tmp/hypercube-art-review';fs.mkdirSync(out,{recursive:true});
  const url=new URL(base);url.searchParams.set('theme','hypercube');await page.goto(url.href,{waitUntil:'load'});
  const choose=async theme=>{await page.locator('#theme-toggle').click();await page.locator(`[data-theme="${theme}"]`).click();assert(await page.locator(`body.${theme}-theme`).count());};
  const dialog=page.locator('#hyper-art-dialog'),opener=page.locator('.hyper-brand button');
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:1000});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Hypercube fits ${width}`);
   await opener.focus();await page.keyboard.press('Enter');assert(await dialog.isVisible());
   for(const wallpaper of ['prism','void']){
    await page.locator(`button[data-hyper-wallpaper="${wallpaper}"]`).click();
    await page.waitForFunction(()=>{const im=document.getElementById('hyper-wallpaper-preview');return im.complete&&im.naturalWidth>0;});
    assert.equal(await page.locator('body').getAttribute('data-hyper-wallpaper'),wallpaper);
    assert.equal(await page.locator(`button[data-hyper-wallpaper="${wallpaper}"]`).getAttribute('aria-pressed'),'true');
    assert(await page.locator('body').evaluate((el,name)=>getComputedStyle(el).backgroundImage.includes(`wallpaper-${name}.webp`),wallpaper));
    assert(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth));
    await page.screenshot({path:`${out}/hypercube-art-${wallpaper}-${width}.png`});
   }
   for(let i=0;i<8;i++){await page.keyboard.press('Tab');assert(await dialog.evaluate(el=>el.contains(document.activeElement)));}
   await page.keyboard.press('Shift+Tab');assert(await dialog.evaluate(el=>el.contains(document.activeElement)));
   await page.keyboard.press('Escape');assert.equal(await dialog.isVisible(),false);assert(await opener.evaluate(el=>el===document.activeElement));
   await page.locator('.hyper-actions a').first().hover();assert.equal(await page.locator('.hyper-actions a').first().evaluate(el=>getComputedStyle(el).color),'rgb(7, 27, 39)','primary-link hover stays readable on cyan');
   await page.screenshot({path:`${out}/hypercube-void-${width}.png`});
   if([390,1440].includes(width))await page.locator('.hyper-desktop-shortcuts').screenshot({path:`${out}/hypercube-shortcuts-${width}.png`});
  }
  await page.reload();assert.equal(await page.locator('body').getAttribute('data-hyper-wallpaper'),'void');
  await page.evaluate(()=>localStorage.setItem('hypercube-wallpaper','toString'));await page.reload();assert.equal(await page.locator('body').getAttribute('data-hyper-wallpaper'),'prism');
  await opener.click();await page.mouse.click(2,2);assert.equal(await dialog.isVisible(),false);
  await opener.click();await page.locator('.hyper-art-heading button').click();assert.equal(await dialog.isVisible(),false);
  for(const width of [390,1440]){await page.setViewportSize({width,height:1000});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:`${out}/hypercube-prism-${width}.png`});}
  await page.waitForFunction(()=>[...document.querySelectorAll('.hyper-brand img,.hyper-desktop-shortcuts img')].every(im=>im.complete&&im.naturalWidth>0));
  assert.match(await page.locator('link[rel="icon"]').getAttribute('href'),/hypercube\/art\/emblem.png/);
  const artAssets=['emblem.png','profile.webp','projects.webp','experience.webp','studio.webp','connect.webp','observatory.webp','wallpaper-prism.webp','wallpaper-void.webp'];
  assert(await page.evaluate(async names=>Promise.all(names.map(name=>new Promise(resolve=>{const im=new Image;im.onload=()=>resolve(im.naturalWidth>0);im.onerror=()=>resolve(false);im.src=`images/hypercube/art/${name}`;}))).then(result=>result.every(Boolean)),artAssets));
  for(const anchor of ['nineties-about','nineties-projects','nineties-resume','nineties-skills']){await page.locator(`.hyper-desktop-shortcuts a[href="#${anchor}"]`).click();assert.equal(await page.evaluate(()=>location.hash),`#${anchor}`);}
  await page.setViewportSize({width:844,height:390});await opener.click();assert(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth&&el.scrollHeight<=el.clientHeight));
  await page.locator('button[data-hyper-wallpaper="void"]').click();await page.screenshot({path:`${out}/hypercube-art-landscape.png`});
  await page.evaluate(()=>window.applyRetroTheme('vista'));assert.equal(await dialog.isVisible(),false,'theme switch closes Personalization');
  // Actual resume text has one source, while all seven views get their own presentation.
  const content=page.locator('#nineties-resume'),cards=page.locator('.experience-collection');
  const canonical=await cards.innerText();
  for(const theme of ['vista','xp','win98','win2100','hypercube','nintendo','matrix','vista']){
   await choose(theme);
   if(theme==='matrix'){
    assert(await page.locator('.matrix-experience').isVisible());assert.equal(await cards.isVisible(),false);
    for(const organization of ['Coherascent Labs','Malestrum: The Third Phase','TrueFlow AI','Jefferson County','CACI International','Colorado School of Mines','Santa Fe Prep'])assert((await page.locator('.matrix-experience').innerText()).includes(organization));
    assert.match(await page.locator('.matrix-experience').innerText(),/[┌│└]/);
   }else{
    assert.equal(await page.locator('.matrix-experience').isVisible(),false);assert(await cards.isVisible());assert.equal(await cards.innerText(),canonical);
    assert.equal(await page.locator('.experience-card').count(),8);assert.doesNotMatch(await content.innerText(),/[┌┐└┘│─]/);
    await page.locator('.experience-group').last().scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>[...document.querySelectorAll('.experience-icon')].every(im=>im.complete&&im.naturalWidth>0));
    const family=theme==='hypercube'?'hypercube/art/':theme==='win2100'?'win2100/art/':theme==='nintendo'?'sprites/nintendo/kirby/super-star/':`${theme}/`;
    assert(await page.locator('.experience-icon').evaluateAll((images,path)=>images.every(im=>im.src.includes(`images/${path}`)),family));
    assert.doesNotMatch(await page.locator('.experience-description').first().evaluate(el=>getComputedStyle(el).fontFamily.split(',')[0]),/Courier|Consolas/);
    if(['vista','xp','win98','win2100'].includes(theme)){
     await content.locator('.vista-window-minimize').click();assert.equal(await cards.isVisible(),false);
     await page.locator('#vista-start').click();await page.locator('#vista-start-menu a[href="#nineties-resume"]').first().click();assert(await cards.isVisible());
    }
   }
   for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${theme} fits ${width}`);
    if(theme!=='matrix')assert(await page.locator('.experience-card').evaluateAll(cards=>cards.every(card=>card.scrollWidth<=card.clientWidth)),`${theme} cards do not clip text at ${width}`);
    if(theme==='matrix'&&width===320){await page.locator('.matrix-experience').focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(100);assert(await page.locator('.matrix-experience').evaluate(el=>el.scrollLeft>0),'Matrix terminal scrolls with the keyboard');}
    if([390,1440].includes(width)){
     if(theme==='matrix')await page.locator('.matrix-experience').screenshot({path:`${out}/experience-${theme}-${width}.png`});
     else{
      await page.locator('.experience-card').first().screenshot({path:`${out}/experience-${theme}-${width}.png`});
      await page.locator('.experience-group').last().screenshot({path:`${out}/education-${theme}-${width}.png`});
     }
    }
   }
  }
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  console.log('PASS: nine generated Hypercube assets, persistent Prism/Void Personalization, keyboard focus/close/cleanup/landscape, working shortcuts, six bespoke resume designs, Matrix-only terminal, shared content, icon delivery, minimize/restore, repeated switching, and 320–1440px layouts.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
