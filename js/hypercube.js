/* An orbitable coordinate projection, with a separate decorative cube constellation. */
(() => {
    'use strict';
    const geometry = window.HypercubeGeometry, core = window.DimensionsCore;
    const canvas = document.getElementById('hypercube-canvas');
    const background = document.getElementById('hypercube-background');
    if (!canvas || !background || !geometry) return;
    const ctx = canvas.getContext('2d'), ambient = background.getContext('2d');
    const dimension = document.getElementById('hyper-dimension');
    const turn = document.getElementById('hyper-turn');
    const turnValue = document.getElementById('hyper-turn-value');
    const motion = document.getElementById('hyper-motion');
    const summary = document.getElementById('hyper-summary');
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const colors = ['#67f3ec', '#67f3ec', '#67f3ec', '#ed8bff', '#ffd083', '#a8f49b'];
    const state = {dimension: 4, angle: 0, yaw: .55, pitch: -.12, zoom: 1, phase: 0, playing: !preference.matches};
    let active = false, frame = 0, previous = 0, lastDraw = 0, lastText = 0, dirty = true, drag = null;
    let heroSize = {width: 0, height: 0}, backgroundSize = {width: 0, height: 0};
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
    function sizeCanvas(element) {
        const bounds = element.getBoundingClientRect(), ratio = Math.min(devicePixelRatio || 1, 2);
        const width = Math.round(bounds.width), height = Math.round(bounds.height);
        if (element.width !== Math.round(width * ratio) || element.height !== Math.round(height * ratio)) {
            element.width = Math.round(width * ratio); element.height = Math.round(height * ratio);
        }
        element.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
        return {width, height};
    }
    function camera(point, yaw, pitch) {
        const p = core.rotate(core.rotate(point, 0, 2, yaw), 1, 2, pitch);
        const lens = 8 / (8 - p[2]);
        return {x: p[0] * lens, y: -p[1] * lens, z: p[2]};
    }
    function path(context, points, indices) {
        context.beginPath();
        indices.forEach((index, i) => { const p = points[index]; if (i) context.lineTo(p.x, p.y); else context.moveTo(p.x, p.y); });
        context.closePath();
    }
    function wire(context, points, edges, alpha = 1, faces = false) {
        context.save(); context.globalAlpha = alpha;
        if (faces) {
            const ordered = geometry.cellFaces.slice().sort((a,b) => a.reduce((sum,i) => sum + points[i].z,0) - b.reduce((sum,i) => sum + points[i].z,0));
            for (const face of ordered) {
                path(context, points, face); context.fillStyle = '#51dcd216'; context.fill();
                context.strokeStyle = '#86fff54d'; context.lineWidth = .7; context.stroke();
            }
        }
        const ordered = edges.slice().sort((a,b) => (points[a[0]].z + points[a[1]].z) - (points[b[0]].z + points[b[1]].z));
        for (const [a,b,axis] of ordered) {
            const p=points[a], q=points[b];
            context.beginPath(); context.moveTo(p.x,p.y); context.lineTo(q.x,q.y);
            context.strokeStyle = colors[axis]; context.globalAlpha = alpha * .13;
            context.lineWidth = 5; context.stroke();
            const selectedCell = faces && a < 8 && b < 8;
            context.globalAlpha = alpha * (selectedCell ? .98 : clamp(.63 + (p.z + q.z) * .065, .32, .96) * (faces && axis < 3 ? .62 : 1));
            context.lineWidth = selectedCell ? 2 : axis > 2 ? 1.5 : 1.2; context.stroke();
        }
        context.globalAlpha = alpha * .9;
        for (const p of points) {
            context.beginPath(); context.arc(p.x,p.y, faces ? 2.3 : 1.4,0,Math.PI*2);
            context.fillStyle = '#ceffff'; context.fill();
        }
        context.restore();
    }
    function drawHero() {
        const {width:w,height:h} = heroSize;
        if (!w || !h) return;
        ctx.clearRect(0,0,w,h);
        const glow = ctx.createRadialGradient(w*.5,h*.44,0,w*.5,h*.44,w*.65);
        glow.addColorStop(0,'#182451'); glow.addColorStop(1,'#080d20'); ctx.fillStyle=glow; ctx.fillRect(0,0,w,h);
        // A restrained stage grid helps the eye read the orbit, without pretending to be data axes.
        ctx.strokeStyle='#5675bc20'; ctx.lineWidth=.6;
        for(let i=-5;i<=5;i++) { ctx.beginPath(); ctx.moveTo(w*.5+i*14,h*.72); ctx.lineTo(w*.5+i*90,h); ctx.stroke(); }
        for(let i=0;i<6;i++) { const y=h*.72+(h*.28)*Math.pow(i/5,1.8); ctx.beginPath(); ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke(); }
        const model=geometry.shape(state.dimension,state.angle);
        // Uniformly scale the projected shape to keep the viewing camera outside its bounding sphere.
        const radius=Math.max(...model.projected.map(p=>Math.hypot(...p)));
        const cameraPoints=model.projected.map(p=>camera(p.map(v=>v*2.2/radius),state.yaw,state.pitch));
        const xs=cameraPoints.map(p=>p.x), ys=cameraPoints.map(p=>p.y);
        const minX=Math.min(...xs), maxX=Math.max(...xs), minY=Math.min(...ys), maxY=Math.max(...ys);
        const scale=Math.min((w-64)/(maxX-minX),(h-85)/(maxY-minY))*state.zoom;
        const points=cameraPoints.map(p=>({x:w*.5+(p.x-(minX+maxX)/2)*scale,y:h*.46+(p.y-(minY+maxY)/2)*scale,z:p.z}));
        ctx.save(); ctx.beginPath(); ctx.ellipse(w*.5,h*.9,w*.24,9,0,0,Math.PI*2);ctx.fillStyle='#00091b66';ctx.fill();ctx.restore();
        wire(ctx,points,model.edges,1,true);
        canvas.dataset.dimension=state.dimension; canvas.dataset.vertices=model.vertices.length; canvas.dataset.edges=model.edges.length;
        canvas.dataset.renderCount=String(Number(canvas.dataset.renderCount || 0)+1);
    }
    function drawBackground() {
        const {width:w,height:h}=backgroundSize;
        if(!w || !h) return;
        ambient.clearRect(0,0,w,h);
        const glow=ambient.createRadialGradient(w*.7,h*.1,0,w*.7,h*.1,w*.9);
        glow.addColorStop(0,'#17204c'); glow.addColorStop(.5,'#090e27'); glow.addColorStop(1,'#06091a');
        ambient.fillStyle=glow;ambient.fillRect(0,0,w,h);
        ambient.strokeStyle='#60a3dc12';ambient.lineWidth=.6;
        for(let i=-9;i<=9;i++){ambient.beginPath();ambient.moveTo(w*.5,h*.55);ambient.lineTo(w*.5+i*w*.14,h);ambient.stroke();}
        for(let i=1;i<=7;i++){const y=h*.55+h*.45*Math.pow(i/7,2);ambient.beginPath();ambient.moveTo(0,y);ambient.lineTo(w,y);ambient.stroke();}
        for(let i=0;i<65;i++){ const x=((i*127.71)%997)/997*w,y=((i*73.41)%991)/991*h; ambient.fillStyle=i%3?'#809ed24d':'#b5e5ff73';ambient.fillRect(x,y,1,1); }
        const count=w<700?6:12;
        for(let i=0;i<count;i++) {
            const shape=geometry.shape(3,state.phase*.7+i*.53);
            const x=((i*.381966+.08)%1)*w + Math.sin(state.phase*.3+i)*12;
            const y=((i*.618034+.12)%1)*h + Math.cos(state.phase*.2+i)*16;
            const size=(w<700?24:36)+(i%4)*13;
            const points=shape.projected.map(p=>camera(p,i*.74+state.phase*.18,.3+Math.sin(i)*.3)).map(p=>({x:x+p.x*size,y:y+p.y*size,z:p.z}));
            wire(ambient,points,shape.edges,.25+i%3*.06,false);
        }
    }
    function text() {
        const vertices=2**state.dimension, edges=state.dimension*vertices/2;
        const degrees=Math.round(state.angle*180/Math.PI);
        turn.value=degrees;turnValue.value=`${degrees}°`;
        document.getElementById('hyper-dimension-label').textContent=`${state.dimension}D → 3D → screen`;
        document.getElementById('hyper-turn-label').textContent=state.dimension===3?'Turn in X–Z':state.dimension===4?'Turn in X–W':'Turn through extra planes';
        const legend=document.getElementById('hyper-extra-legend');
        legend.hidden=state.dimension===3;
        legend.textContent=state.dimension===4?'W direction · pink':state.dimension===5?'Extra directions · pink / gold':'Extra directions · pink / gold / lime';
        summary.textContent=`${vertices} vertices · ${edges} edges · ${state.dimension} independent directions. `+(state.dimension===3?'This is a 3D cube viewed on a 2D screen. ':'One XYZ cube is shaded. Extra-colored edges connect its copies along further directions. ')+ 'Drag to orbit; arrow keys turn the camera, +/− zoom, Home resets. Perspective can make separate vertices overlap.';
        canvas.setAttribute('aria-label',`Interactive ${state.dimension}-dimensional cube projection. ${vertices} vertices and ${edges} edges. Drag or use arrow keys to orbit.`);
        motion.textContent=state.playing?'Pause motion':'Play motion';motion.setAttribute('aria-pressed',String(state.playing));
    }
    function tick(now) {
        frame=0;
        if(!active || document.hidden)return;
        const dt=previous?Math.min((now-previous)/1000,.05):0;previous=now;
        if(state.playing){state.angle=(state.angle+dt*.16)%(Math.PI*2);state.phase+=dt;}
        if(dirty || now-lastDraw>=33){drawBackground();drawHero();dirty=false;lastDraw=now;}
        if(now-lastText>150){text();lastText=now;}
        if(state.playing)frame=requestAnimationFrame(tick);
    }
    function requestDraw() {dirty=true;if(active && !document.hidden && !frame)frame=requestAnimationFrame(tick);}
    function resize() {if(!active)return;heroSize=sizeCanvas(canvas);backgroundSize=sizeCanvas(background);requestDraw();}
    function syncTheme() {
        active=document.body.classList.contains('hypercube-theme');
        cancelAnimationFrame(frame);frame=0;previous=0;
        if(active){resize();text();}
    }
    function setPlaying(value){state.playing=value;previous=0;text();requestDraw();}
    function resetView(){state.yaw=.55;state.pitch=-.12;state.zoom=1;requestDraw();}
    dimension.addEventListener('change',()=>{state.dimension=Number(dimension.value);text();requestDraw();});
    turn.addEventListener('input',()=>{state.angle=Number(turn.value)*Math.PI/180;setPlaying(false);});
    motion.addEventListener('click',()=>setPlaying(!state.playing));
    document.getElementById('hyper-reset').addEventListener('click',resetView);
    document.querySelectorAll('[data-hyper-view]').forEach(button=>button.addEventListener('click',()=>{
        const view=button.dataset.hyperView;state.yaw=view==='reverse'?3.55:.55;state.pitch=view==='overhead'?1.12:-.12;state.zoom=1;requestDraw();
    }));
    canvas.addEventListener('pointerdown',event=>{if(event.button!==0)return;drag={x:event.clientX,y:event.clientY,id:event.pointerId};canvas.setPointerCapture(event.pointerId);});
    canvas.addEventListener('pointermove',event=>{if(!drag || event.pointerId!==drag.id)return;state.yaw+=(event.clientX-drag.x)*.008;state.pitch=clamp(state.pitch+(event.clientY-drag.y)*.008,-1.3,1.3);drag.x=event.clientX;drag.y=event.clientY;requestDraw();});
    const endDrag=()=>{drag=null;};canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);canvas.addEventListener('lostpointercapture',endDrag);
    canvas.addEventListener('keydown',event=>{
        const actions={ArrowLeft:()=>state.yaw-=.14,ArrowRight:()=>state.yaw+=.14,ArrowUp:()=>state.pitch=clamp(state.pitch-.14,-1.3,1.3),ArrowDown:()=>state.pitch=clamp(state.pitch+.14,-1.3,1.3),'+':()=>state.zoom=clamp(state.zoom+.05,.7,1.05),'=':()=>state.zoom=clamp(state.zoom+.05,.7,1.05),'-':()=>state.zoom=clamp(state.zoom-.05,.7,1.05),Home:resetView};
        if(actions[event.key]){event.preventDefault();actions[event.key]();requestDraw();}
    });
    preference.addEventListener('change',()=>{if(preference.matches)setPlaying(false);});
    document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);frame=0;previous=0;if(!document.hidden)requestDraw();});
    new MutationObserver(syncTheme).observe(document.body,{attributes:true,attributeFilter:['class']});
    new ResizeObserver(resize).observe(canvas);
    window.addEventListener('resize',resize);
    document.querySelectorAll('.nineties-nav-table tr:last-child a').forEach(link=>{
        const icon=document.createElement('img');icon.src='images/theme-icons/hypercube.svg';icon.alt='';icon.className='hyper-nav-icon hypercube-only';link.prepend(icon);
    });
    syncTheme();
})();
