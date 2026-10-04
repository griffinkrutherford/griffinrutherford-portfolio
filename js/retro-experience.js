/* One semantic resume, themed icons, and a Matrix-only terminal projection. */
(() => {
    'use strict';
    const resume=document.getElementById('nineties-resume');
    if(!resume)return;
    const terminal=resume.querySelector('.matrix-experience');
    function wrap(text,width){
        const lines=[];let line='';
        for(const word of text.trim().split(/\s+/)){
            if(line.length+word.length+1>width){lines.push(line);line=word;}else line+=(line?' ':'')+word;
        }
        if(line)lines.push(line);return lines;
    }
    const width=59,blocks=[];
    for(const group of resume.querySelectorAll('.experience-group')){
        const rows=[group.querySelector('h3').textContent.toUpperCase(),''];
        for(const card of group.querySelectorAll('.experience-card')){
            const text=selector=>card.querySelector(selector)?.textContent.trim()||'';
            rows.push(...wrap(`${text('h4')} @ ${text('.experience-organization')}`,width));
            const date=text('.experience-date');if(date)rows.push(...wrap(date,width));
            rows.push(...wrap(text('.experience-description'),width),'');
        }
        blocks.push('┌'+'─'.repeat(width+2)+'┐\n'+rows.map(row=>'│ '+row.padEnd(width)+' │').join('\n')+'\n└'+'─'.repeat(width+2)+'┘');
    }
    terminal.textContent=blocks.join('\n\n');
    const hyperIcons={computer:'experience',mail:'connect',application:'projects',network:'connect',people:'profile',documents:'observatory'};
    const kirbyIcons={computer:'sword',mail:'plasma',application:'beam',network:'mirror',people:'fighter',documents:'warp_star'};
    function sync(){
        const theme=['vista','xp','win98','win2100','nintendo','hypercube','matrix','macos','mac2010'].find(key=>document.body.classList.contains(`${key}-theme`));
        for(const image of resume.querySelectorAll('[data-experience-icon]')){
            const key=image.dataset.experienceIcon;
            if(theme==='macos'||theme==='mac2010')image.src=`images/macos/${theme==='macos'?'modern':'classic'}/${key}.png`;
            else if(theme==='hypercube')image.src=`images/hypercube/art/${hyperIcons[key]}.webp`;
            else if(theme==='win2100')image.src=`images/win2100/art/${key}.webp`;
            else if(theme==='nintendo')image.src=`images/sprites/nintendo/kirby/super-star/${kirbyIcons[key]}.png`;
            else image.src=`images/${theme==='matrix'?'vista':theme||'vista'}/${key}.${theme==='win98'?'png':'ico'}`;
        }
    }
    new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});sync();
})();
