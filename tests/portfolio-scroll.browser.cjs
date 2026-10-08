const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 try{
  const page=await browser.newPage({reducedMotion:'reduce'});
  const root=process.env.SITE_URL||'http://127.0.0.1:8796/';
  const out=process.env.SCREENSHOT_DIR||'/tmp/portfolio-scroll-review';fs.mkdirSync(out,{recursive:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>new URL(r.request().url()).origin===new URL(root).origin?r.continue():r.abort());
  const metrics=()=>page.evaluate(()=>{
   const root=document.scrollingElement,body=document.body,content=document.querySelector('.content-section');
   return {root:root.tagName,rootHeight:root.scrollHeight,bodyHeight:body.clientHeight,bodyScrollHeight:body.scrollHeight,bodyScrollTop:body.scrollTop,rootScrollY:scrollY,rootWidth:document.documentElement.clientWidth,rootScrollWidth:document.documentElement.scrollWidth,bodyWidth:body.clientWidth,bodyScrollWidth:body.scrollWidth,contentTop:content?.getBoundingClientRect().top,contentBottom:content?.getBoundingClientRect().bottom,viewportHeight:innerHeight};
  });
  for(const route of ['index.html','legacy/index.html']){
   for(const [width,height] of [[720,900],[960,540],[767,800],[768,800],[769,800],[390,844],[1440,1000]]){
    await page.setViewportSize({width,height});await page.goto(new URL(route,root).href);
    await page.evaluate(()=>{document.querySelectorAll('video').forEach(v=>v.pause());scrollTo({top:0,behavior:'instant'});});
    let state=await metrics();assert.equal(state.root,'HTML');
    assert(state.bodyScrollHeight<=state.bodyHeight+1,`${route} ${width}×${height} must not have a second body scroll area: ${JSON.stringify(state)}`);
    assert.equal(Math.round(state.contentTop),height,'content still starts one viewport below the video');
    assert(state.rootScrollWidth<=state.rootWidth&&state.bodyScrollWidth<=state.bodyWidth,'no horizontal scrollbar');
    await page.mouse.move(width/2,height/2);await page.mouse.wheel(0,600);await page.waitForFunction(()=>scrollY>0);
    state=await metrics();assert.equal(state.bodyScrollTop,0,'wheel scrolls the document, not a nested body');
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
    // The landing arrow bounces; click its center without waiting for animation stability.
    await page.locator('.scroll-arrow').click({force:true});await page.waitForFunction(()=>Math.abs(document.querySelector('.content-section').getBoundingClientRect().top)<3);
    assert.equal((await metrics()).bodyScrollTop,0,'scroll arrow targets the document');
    if(width===720||width===960){await page.waitForTimeout(120);await page.screenshot({path:`${out}/${route.includes('legacy')?'legacy':'main'}-${width}x${height}.png`});}
    await page.locator('.quick-links-button').click();assert(await page.locator('.quick-links-menu').evaluate(el=>el.classList.contains('active')));
    await page.locator('.quick-links-nav a[href="#about"]').click();await page.waitForFunction(()=>Math.abs(document.getElementById('about').getBoundingClientRect().top)<5);
    assert.equal((await metrics()).bodyScrollTop,0,'anchor navigation stays in one scroll area');
    await page.evaluate(()=>scrollTo({top:document.scrollingElement.scrollHeight,behavior:'instant'}));
    state=await metrics();assert(state.contentBottom<=height+2&&state.contentBottom>0,'bottom of all content is reachable with the document scrollbar');
    assert.equal(state.bodyScrollTop,0);
   }
  }
  for(const theme of ['vista','xp','win98','nintendo','matrix','hypercube','win2100','macos','mac2010']){
   await page.setViewportSize({width:720,height:900});await page.goto(new URL(`90s.html?theme=${theme}`,root).href);
   const state=await metrics();assert(state.bodyScrollHeight<=state.bodyHeight+1,`${theme} has one page scroll area`);
   assert(await page.locator('.nineties-wrapper').evaluate(el=>el.scrollHeight<=el.clientHeight+1),'retro wrapper does not add an inner vertical scrollbar');
   await page.mouse.move(360,500);await page.mouse.wheel(0,500);await page.waitForFunction(()=>scrollY>0);assert.equal((await metrics()).bodyScrollTop,0);
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: one document scrollbar on main/legacy across half-width, half-height, breakpoint, mobile and full-size windows; wheel, scroll-arrow and anchor navigation; all content reachable; no horizontal overflow; nine retro themes retain document scrolling.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
