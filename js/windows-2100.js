/* Original glass-pane sculpture for an imagined future desktop. */
(() => {
    'use strict';
    const core=window.DimensionsCore;
    const canvas=document.getElementById('future-canvas'), background=document.getElementById('future-background');
    if(!core || !canvas || !background)return;
    const ctx=canvas.getContext('2d'),sky=background.getContext('2d'),motion=document.getElementById('future-motion');
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const state={yaw:.38,pitch:-.38,phase:0,playing:!preference.matches};
    let active=false,frame=0,last=0,lastDraw=0,dirty=true,drag=null;
    let hero={width:0,height:0},ambient={width:0,height:0};
    const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
    function size(element){const r=element.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);const w=Math.round(r.width),h=Math.round(r.height);if(element.width!==Math.round(w*d)||element.height!==Math.round(h*d)){element.width=Math.round(w*d);element.height=Math.round(h*d);}element.getContext('2d').setTransform(d,0,0,d,0,0);return{width:w,height:h};}
    function camera(p){const v=core.rotate(core.rotate(p,0,2,state.yaw),1,2,state.pitch),lens=9/(9-v[2]);return{x:v[0]*lens,y:-v[1]*lens,z:v[2]};}
    function drawScene(){
        const {width:w,height:h}=hero;if(!w||!h)return;
        ctx.clearRect(0,0,w,h);
        const glow=ctx.createRadialGradient(w*.5,h*.5,0,w*.5,h*.5,w*.6);glow.addColorStop(0,'#fdfdff');glow.addColorStop(1,'#e9f0fc00');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
        const items=[];
        // Two orbital rings plus four thin, genuinely three-dimensional panes.
        for(let ring=0;ring<2;ring++){
            const points=Array.from({length:161},(_,i)=>{const t=i/160*Math.PI*2;return camera(core.rotate([3.05*Math.cos(t),3.05*Math.sin(t),0],0,2,ring?1.1:.3));});
            for(let i=0;i<160;i++)items.push({kind:'line',points:[points[i],points[i+1]],depth:(points[i].z+points[i+1].z)/2,color:ring?'#9a83c3':'#659fbb'});
            const t=state.phase*.18+ring*2,beacon=camera(core.rotate([3.05*Math.cos(t),3.05*Math.sin(t),0],0,2,ring?1.1:.3));items.push({kind:'beacon',points:[beacon],depth:beacon.z,color:ring?'#a187cb':'#4d94b6'});
        }
        const topology=core.hypercube(3),faces=[[0,1,3,2],[4,5,7,6],[0,1,5,4],[2,3,7,6],[0,2,6,4],[1,3,7,5]];
        const palette=['#64a9db','#aa8fde','#6cb7bb','#a091d0'];
        for(let pane=0;pane<4;pane++){
            const center=[pane%2? .85:-.85,pane<2?.85:-.85,Math.sin(state.phase*.3+pane*.6)*.16];
            const points=topology.vertices.map(v=>{let p=[v[0]*.7,v[1]*.7,v[2]*.075];p=core.rotate(p,0,2,Math.sin(state.phase*.22+pane)*.08);return camera(p.map((n,i)=>n+center[i]));});
            for(const face of faces){const facePoints=face.map(i=>points[i]);items.push({kind:'face',points:facePoints,depth:facePoints.reduce((sum,p)=>sum+p.z,0)/4,color:palette[pane]});}
        }
        const all=items.flatMap(item=>item.points),xs=all.map(p=>p.x),ys=all.map(p=>p.y);
        const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),scale=Math.min((w-46)/(x1-x0),(h-54)/(y1-y0));
        const screen=p=>({x:w*.5+(p.x-(x0+x1)/2)*scale,y:h*.48+(p.y-(y0+y1)/2)*scale});
        ctx.save();ctx.beginPath();ctx.ellipse(w*.5,h*.88,w*.23,9,0,0,Math.PI*2);ctx.fillStyle='#8d9bc61c';ctx.fill();ctx.restore();
        items.sort((a,b)=>a.depth-b.depth);
        for(const item of items){
            const points=item.points.map(screen);ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
            if(item.kind==='face'){
                ctx.closePath();const fill=ctx.createLinearGradient(points[0].x,points[0].y,points[2].x,points[2].y);fill.addColorStop(0,item.color+'99');fill.addColorStop(.4,item.color+'48');fill.addColorStop(1,'#ffffffb3');ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle='#ffffffd9';ctx.lineWidth=2;ctx.stroke();ctx.strokeStyle=item.color;ctx.lineWidth=1;ctx.stroke();
            }else if(item.kind==='line') {ctx.strokeStyle=item.color+'90';ctx.lineWidth=1;ctx.stroke();}
            else {const p=points[0];ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle=item.color;ctx.shadowColor=item.color;ctx.shadowBlur=12;ctx.fill();ctx.shadowBlur=0;ctx.beginPath();ctx.arc(p.x,p.y,1.5,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();}
        }
        canvas.dataset.renderCount=String(Number(canvas.dataset.renderCount||0)+1);
        canvas.dataset.view=`${state.yaw.toFixed(2)},${state.pitch.toFixed(2)}`;
    }
    function drawSky(){
        const{width:w,height:h}=ambient;if(!w||!h)return;sky.clearRect(0,0,w,h);sky.fillStyle='#edf3fb';sky.fillRect(0,0,w,h);
        for(const [x,y,color] of [[.12,.22,'#a5b7ef'],[.85,.36,'#bdc7ee'],[.64,.88,'#b4dcdf']]){const light=sky.createRadialGradient(w*x,h*y,0,w*x,h*y,w*.5);light.addColorStop(0,color+'a6');light.addColorStop(1,color+'00');sky.fillStyle=light;sky.fillRect(0,0,w,h);}
        sky.save();sky.translate(w*.62,h*.38);sky.rotate(-.28+Math.sin(state.phase*.03)*.025);
        for(let i=0;i<5;i++){sky.beginPath();sky.ellipse(0,0,w*(.31+i*.065),h*(.13+i*.045),0,0,Math.PI*2);sky.strokeStyle=i%2?'#ffffff8a':'#819dd726';sky.lineWidth=i%2?1.2:1;sky.stroke();}sky.restore();
        for(let i=0;i<65;i++){const x=((i*.618+.11)%1)*w,y=((i*.382+.08)%1)*h+Math.sin(state.phase*.08+i)*5;sky.beginPath();sky.arc(x,y,i%4?1:1.8,0,Math.PI*2);sky.fillStyle=i%3?'#ffffffc0':'#8194ba4d';sky.fill();}
    }
    function text(){motion.textContent=state.playing?'Pause motion':'Play motion';motion.setAttribute('aria-pressed',String(state.playing));}
    function tick(now){frame=0;if(!active||document.hidden)return;const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(state.playing)state.phase+=dt;
        if(dirty||now-lastDraw>33){drawSky();drawScene();dirty=false;lastDraw=now;}
        if(state.playing)frame=requestAnimationFrame(tick);
    }
    function redraw(){dirty=true;if(active&&!document.hidden&&!frame)frame=requestAnimationFrame(tick);}
    function resize(){if(!active)return;hero=size(canvas);ambient=size(background);redraw();}
    function sync(){active=document.body.classList.contains('win2100-theme');cancelAnimationFrame(frame);frame=0;last=0;if(active){resize();text();}}
    function setPlaying(value){state.playing=value;last=0;text();redraw();}
    document.querySelectorAll('[data-future-view]').forEach(button=>button.addEventListener('click',()=>{const view=button.dataset.futureView;state.yaw=view==='reverse'?3.52:.38;state.pitch=view==='overhead'?1.12:-.38;redraw();}));
    motion.addEventListener('click',()=>setPlaying(!state.playing));
    canvas.addEventListener('pointerdown',event=>{if(event.button!==0)return;drag={id:event.pointerId,x:event.clientX,y:event.clientY};canvas.setPointerCapture(event.pointerId);});
    canvas.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;state.yaw+=(event.clientX-drag.x)*.008;state.pitch=clamp(state.pitch+(event.clientY-drag.y)*.008,-1.3,1.3);drag.x=event.clientX;drag.y=event.clientY;redraw();});
    for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>drag=null);
    canvas.addEventListener('keydown',event=>{const actions={ArrowLeft:()=>state.yaw-=.14,ArrowRight:()=>state.yaw+=.14,ArrowUp:()=>state.pitch=clamp(state.pitch-.14,-1.3,1.3),ArrowDown:()=>state.pitch=clamp(state.pitch+.14,-1.3,1.3),Home:()=>{state.yaw=.38;state.pitch=-.38;}};if(actions[event.key]){event.preventDefault();actions[event.key]();redraw();}});
    preference.addEventListener('change',()=>{if(preference.matches)setPlaying(false);});
    document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);frame=0;last=0;if(!document.hidden)redraw();});
    new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});new ResizeObserver(resize).observe(canvas);window.addEventListener('resize',resize);sync();
})();
