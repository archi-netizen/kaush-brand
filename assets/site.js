(function(){var b=document.querySelector('.menu-btn'),n=document.getElementById('nav');if(!b||!n)return;
b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
n.addEventListener('click',function(e){if(e.target.tagName==='A'){n.classList.remove('open');b.setAttribute('aria-expanded','false')}});})();

/* Work page: filter project cards by category */
(function(){var g=document.getElementById('pgrid');if(!g)return;
var chips=document.querySelectorAll('.chip'),cards=g.querySelectorAll('.card'),n=document.getElementById('fshown');
function apply(f){var k=0;cards.forEach(function(c){var on=f==='all'||(' '+c.getAttribute('data-cat')+' ').indexOf(' '+f+' ')>-1;c.hidden=!on;if(on)k++});
chips.forEach(function(b){var on=b.getAttribute('data-f')===f;b.classList.toggle('is-on',on);b.setAttribute('aria-pressed',on)});if(n)n.textContent=k;
try{history.replaceState(null,'',f==='all'?location.pathname:'#'+f)}catch(e){}}
chips.forEach(function(b){b.addEventListener('click',function(){apply(b.getAttribute('data-f'))})});
var h=location.hash.slice(1);if(h&&document.querySelector('.chip[data-f="'+h+'"]'))apply(h);})();

/* Slideshow (looping) */
(function(){document.querySelectorAll('.ss').forEach(function(ss){
var sl=ss.querySelectorAll('.ss-slide'),dots=ss.querySelector('.ss-dots'),i=0,t=null,n=sl.length,cnt=ss.querySelector('.ss-count');
var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
sl.forEach(function(_,k){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Slide '+(k+1));b.addEventListener('click',function(){go(k,true)});dots.appendChild(b)});
function go(k,user){i=(k+n)%n;sl.forEach(function(s,j){s.classList.toggle('on',j===i);s.setAttribute('aria-hidden',j!==i)});
dots.querySelectorAll('button').forEach(function(b,j){b.classList.toggle('on',j===i)});if(cnt)cnt.textContent=(i+1)+' / '+n;if(user)start()}
function start(){stop();if(!rm)t=setInterval(function(){go(i+1)},4500)}function stop(){if(t){clearInterval(t);t=null}}
ss.querySelector('.ss-prev').addEventListener('click',function(){go(i-1,true)});
ss.querySelector('.ss-next').addEventListener('click',function(){go(i+1,true)});
ss.addEventListener('mouseenter',stop);ss.addEventListener('mouseleave',start);ss.addEventListener('focusin',stop);ss.addEventListener('focusout',start);
ss.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')go(i-1,true);if(e.key==='ArrowRight')go(i+1,true)});
var x0=null;ss.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
ss.addEventListener('touchend',function(e){if(x0===null)return;var d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>40)go(i+(d<0?1:-1),true);x0=null});
go(0);start()})})();

/* PDF flipbook (pdf.js, self-hosted) */
(function(){var fb=document.querySelector('.flip');if(!fb)return;
var url=fb.getAttribute('data-pdf'),stage=fb.querySelector('.flip-stage'),cnt=fb.querySelector('.flip-count'),fsb=fb.querySelector('.flip-fs'),pdf=null,pg=1,wide=true,gen=0,dpr=window.devicePixelRatio||1;
function load(src,cb){var s=document.createElement('script');s.src=src;s.onload=cb;document.head.appendChild(s)}
function isFs(){return document.fullscreenElement===fb||fb.classList.contains('flip-full')}
async function draw(){if(!pdf)return;var my=++gen;wide=fb.clientWidth>760;var n=pdf.numPages,pages=wide&&pg>1&&pg<n?[pg,pg+1]:[pg];
var w=(stage.clientWidth||fb.clientWidth)/(pages.length>1?2:1),maxH=isFs()?Math.max(300,innerHeight-130):900,frag=document.createDocumentFragment(),h0=0;
for(var k=0;k<pages.length;k++){var p=await pdf.getPage(pages[k]);if(my!==gen)return;var v=p.getViewport({scale:1}),css=Math.min(w/v.width,maxH/v.height),vp=p.getViewport({scale:css*dpr}),c=document.createElement('canvas');c.width=Math.round(vp.width);c.height=Math.round(vp.height);c.style.width=(vp.width/dpr)+'px';c.style.height=(vp.height/dpr)+'px';c.setAttribute('role','img');c.setAttribute('aria-label','Page '+pages[k]);
await p.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;if(my!==gen)return;
var d=document.createElement('div');d.className='pg'+(pages.length>1?(k?' pg-r':' pg-l'):'');d.appendChild(c);frag.appendChild(d);h0=Math.max(h0,vp.height/dpr)}
if(my!==gen)return;stage.style.minHeight=h0+'px';stage.replaceChildren(frag);
stage.classList.remove('turn');void stage.offsetWidth;stage.classList.add('turn');
cnt.textContent=(pages.length>1?pages[0]+'–'+pages[1]:pages[0])+' / '+n}
function step(d){var n=pdf.numPages;if(d>0){pg=(wide&&pg>1&&pg<n)?pg+2:pg+1}else{pg=(wide&&pg>2)?pg-2:pg-1}pg=Math.max(1,Math.min(n,pg));if(wide&&pg>1&&pg%2===1)pg-=1;draw()}
fb.querySelector('.flip-prev').addEventListener('click',function(){step(-1)});
fb.querySelector('.flip-next').addEventListener('click',function(){step(1)});
fb.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1);if(e.key==='Escape'&&fb.classList.contains('flip-full'))tog()});
function tog(){if(document.fullscreenElement===fb){document.exitFullscreen();return}
if(fb.classList.contains('flip-full')){fb.classList.remove('flip-full');document.body.style.overflow='';fsb.textContent='Fullscreen';fsb.setAttribute('aria-pressed','false');draw();return}
if(fb.requestFullscreen){fb.requestFullscreen().catch(function(){pseudo()})}else pseudo()}
function pseudo(){fb.classList.add('flip-full');document.body.style.overflow='hidden';fsb.textContent='Exit fullscreen';fsb.setAttribute('aria-pressed','true');draw()}
if(fsb)fsb.addEventListener('click',tog);
document.addEventListener('fullscreenchange',function(){var on=document.fullscreenElement===fb;if(fsb){fsb.textContent=on?'Exit fullscreen':'Fullscreen';fsb.setAttribute('aria-pressed',on)}setTimeout(draw,120)});
var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(draw,200)});
var started=false;function init(){if(started)return;started=true;load('/assets/pdf.min.js',function(){pdfjsLib.GlobalWorkerOptions.workerSrc='/assets/pdf.worker.min.js';pdfjsLib.getDocument(url).promise.then(function(d){pdf=d;draw()}).catch(function(){stage.innerHTML='<p>The flipbook could not be loaded.</p>'})})}
if('IntersectionObserver'in window){new IntersectionObserver(function(e,o){if(e[0].isIntersecting){o.disconnect();init()}},{rootMargin:'300px'}).observe(fb)}else init();})();

/* Courses: register-interest panel */
(function(){var b=document.getElementById('ri-btn'),p=document.getElementById('ri-panel');if(!b||!p)return;
b.addEventListener('click',function(){var o=p.hidden;p.hidden=!o;b.setAttribute('aria-expanded',o)});
var c=document.getElementById('ri-copy'),ok=document.getElementById('ri-ok');if(!c)return;
c.addEventListener('click',function(){var t=c.getAttribute('data-email');
function done(m){ok.textContent=m;setTimeout(function(){ok.textContent=''},2500)}
if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){done('Copied ✓')},function(){fb()})}else fb();
function fb(){var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy');done('Copied ✓')}catch(e){done('Press Ctrl+C to copy: '+t)}document.body.removeChild(a)}})})();

/* Mirror Lab: before/after sliders + lightbox */
(function(){document.querySelectorAll('.ba input').forEach(function(r){var b=r.parentNode;function u(){b.style.setProperty('--p',r.value+'%')}r.addEventListener('input',u);u()});
var lb=document.getElementById('lb');if(!lb)return;var imgs=[].slice.call(document.querySelectorAll('.mg-i img')),i=0,im=lb.querySelector('img');
function show(k){i=(k+imgs.length)%imgs.length;im.src=imgs[i].src;im.alt=imgs[i].alt}
function open_(k){show(k);lb.hidden=false;document.body.style.overflow='hidden';lb.querySelector('.lb-x').focus()}
function close_(){lb.hidden=true;document.body.style.overflow=''}
imgs.forEach(function(g,k){g.parentNode.addEventListener('click',function(){open_(k)})});
lb.querySelector('.lb-x').addEventListener('click',close_);lb.querySelector('.lb-p').addEventListener('click',function(){show(i-1)});lb.querySelector('.lb-n').addEventListener('click',function(){show(i+1)});
lb.addEventListener('click',function(e){if(e.target===lb)close_()});
document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close_();if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1)});})();

/* Cursor + slow reveal (from the original site) */
(function(){var de=document.documentElement,rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
/* reveal */
if('IntersectionObserver' in window){
var sel='main .wrap > .kick, main .wrap > h2, main .wrap > .lead, main .wrap > p, main .wrap > .facts, main .split-h, main .prose > *, .card, .svc, .bk, .tk, .f3, .mvc, .mc, .fl, .step, .ms, .fact, .course, .sm-c, .feat > *, .grid3 > *, .mg li, .pans li, .phones li, .msteps > *, .tks > *, .callout, .korp';
var els=[].slice.call(document.querySelectorAll(sel)).filter(function(e){return !e.closest('.hero,.phero,.flip,.lb,.ss,.ba,.chips-row,.filters')});
els.forEach(function(e){e.classList.add('sr')});de.classList.add('sr-on');
var obs=new IntersectionObserver(function(en){var n=0;en.forEach(function(x){if(x.isIntersecting){var t=x.target;setTimeout(function(){t.classList.add('vis')},(n++%5)*90);obs.unobserve(t)}})},{threshold:.08,rootMargin:'0px 0px -4% 0px'});
els.forEach(function(e){obs.observe(e)});
setTimeout(function(){document.querySelectorAll('.sr:not(.vis)').forEach(function(e){var r=e.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)e.classList.add('vis')})},2500);}
/* cursor */
if(!(window.matchMedia&&matchMedia('(hover: hover) and (pointer: fine)').matches))return;
var d=document.createElement('div');d.id='cur';var r=document.createElement('div');r.id='curR';d.setAttribute('aria-hidden','true');r.setAttribute('aria-hidden','true');document.body.appendChild(r);document.body.appendChild(d);de.classList.add('cur-on');
var mx=-50,my=-50,rx=-50,ry=-50,DARK='.dark,.phero,.bar,.foot,.hero-dark,.mp-ink,.tks,.step,.korp,.lb,.ms-ink,.callout.dark';
document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;d.style.left=mx+'px';d.style.top=my+'px';var t=e.target;de.classList.toggle('cur-dark',!!(t.closest&&t.closest(DARK)));de.classList.toggle('cur-hov',!!(t.closest&&t.closest('a,button,label,summary,input[type=range]')))},{passive:true});
document.addEventListener('mouseleave',function(){d.style.opacity=0;r.style.opacity=0});document.addEventListener('mouseenter',function(){d.style.opacity=1;r.style.opacity=1});
(function loop(){rx+=(mx-rx)*(rm?1:.1);ry+=(my-ry)*(rm?1:.1);r.style.left=rx+'px';r.style.top=ry+'px';requestAnimationFrame(loop)})();})();

/* reading progress */
(function(){var p=document.querySelector('.rd-prog');if(!p)return;function u(){var h=document.documentElement,t=h.scrollHeight-innerHeight;p.style.width=(t>0?Math.min(100,scrollY/t*100):0)+'%'}addEventListener('scroll',u,{passive:true});addEventListener('resize',u);u()})();

/* Le Corbusier: copy colour */
(function(){var ts=document.querySelectorAll('.lc-t'),ok=document.getElementById('lc-ok');if(!ts.length)return;ts.forEach(function(b){b.addEventListener('click',function(){var h=b.getAttribute('data-hex').toUpperCase();function d(){if(ok){ok.textContent='Copied '+h;setTimeout(function(){ok.textContent=''},2000)}}
if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(h).then(d,d);else{var a=document.createElement('textarea');a.value=h;document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}document.body.removeChild(a);d()}})})})();

/* Sitemap matrix */
(function(){var g=document.getElementById('smg');if(!g)return;var chips=document.querySelectorAll('.chip'),tiles=[].slice.call(g.querySelectorAll('.smt')),q=document.getElementById('smq'),cnt=document.getElementById('smc'),f='all';
function ap(){var s=(q.value||'').toLowerCase().trim(),k=0;tiles.forEach(function(t){var okc=f==='all'||(' '+t.getAttribute('data-cat')+' ').indexOf(' '+f+' ')>-1,oks=!s||t.getAttribute('data-t').indexOf(s)>-1,on=okc&&oks;t.classList.toggle('dim',!on);if(on)k++});cnt.textContent=k;chips.forEach(function(b){var on=b.getAttribute('data-f')===f;b.classList.toggle('is-on',on);b.setAttribute('aria-pressed',on)})}
chips.forEach(function(b){b.addEventListener('click',function(){f=b.getAttribute('data-f');ap()})});q.addEventListener('input',ap);
document.getElementById('smr').addEventListener('click',function(){var v=tiles.filter(function(t){return !t.classList.contains('dim')});var t=v[Math.floor(Math.random()*v.length)];if(t)location.href=t.getAttribute('href')});})();

/* Carrot colours */
(function(){var h=document.getElementById('at-hero');if(!h)return;var bs=h.querySelectorAll('.cs');
function set(bg,fg){h.style.setProperty('--cb',bg);h.style.setProperty('--cf',fg);bs.forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-bg')===bg)});try{localStorage.setItem('carrot',bg)}catch(e){}}
bs.forEach(function(b){b.addEventListener('click',function(){set(b.getAttribute('data-bg'),b.getAttribute('data-fg'))})});
var v=null;try{v=localStorage.getItem('carrot')}catch(e){}var m=null;bs.forEach(function(b){if(b.getAttribute('data-bg')===v)m=b});set(m?m.getAttribute('data-bg'):'#ED9121',m?m.getAttribute('data-fg'):'#08090F')})();

/* Home hero colours */
(function(){var h=document.querySelector('.hero');if(!h)return;var bs=h.querySelectorAll('.hp');if(!bs.length)return;
function set(b){h.style.setProperty('--hb',b.dataset.bg);h.style.setProperty('--mk',b.dataset.mk);h.style.setProperty('--hf',b.dataset.fg);h.style.setProperty('--hu',b.dataset.u);h.style.setProperty('--hbt',b.dataset.bg==='#C8FF00'?'#C8FF00':'#08090F');bs.forEach(function(x){x.setAttribute('aria-pressed',x===b)});try{localStorage.setItem('heroTheme',b.dataset.bg)}catch(e){}}
bs.forEach(function(b){b.addEventListener('click',function(){set(b)})});
var v=null;try{v=localStorage.getItem('heroTheme')}catch(e){}var m=null;bs.forEach(function(b){if(b.dataset.bg===v)m=b});set(m||bs[0]);
})();

/* Hero mark: touch me not */
(function(){var h=document.querySelector('.hero'),mk=h&&h.querySelector('.mark-bg');if(!mk)return;
if(!(window.matchMedia&&matchMedia('(hover: hover) and (pointer: fine)').matches)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var x=0,y=0,vx=0,vy=0,mx=null,my=null,live=true;
h.addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY});h.addEventListener('pointerleave',function(){mx=my=null});
new IntersectionObserver(function(e){live=e[0].isIntersecting}).observe(h);
(function f(){if(live){var r=mk.getBoundingClientRect(),cx=r.left+r.width/2-x,cy=r.top+r.height/2-y,hr=h.getBoundingClientRect(),
 px=cx+x,py=cy+y;if(mx!=null){var dx=px-mx,dy=py-my,d=Math.hypot(dx,dy)||1,R=Math.max(230,r.width*.6);if(d<R){var k=(R-d)/R*1.8;vx+=dx/d*k;vy+=dy/d*k}}
 vx+=-x*.004;vy+=-y*.004;vx*=.9;vy*=.9;x+=vx;y+=vy;
 var lx=Math.max(0,(hr.right-r.right)+x-8),lxn=Math.max(0,(r.left-hr.left)-x*0+x-8);
 var maxR=hr.right-(r.right-x)-6,maxL=(r.left-x)-hr.left-6,maxD=hr.bottom-(r.bottom-y)-6,maxU=(r.top-y)-hr.top-70;
 x=Math.max(-maxL,Math.min(maxR,x));y=Math.max(-maxU,Math.min(maxD,y));
 mk.style.translate=x+'px '+y+'px'}requestAnimationFrame(f)})()})();

/* Brand system: mark playground */
(function(){var d=document.getElementById('mkp-d');if(!d)return;
function play(){d.classList.remove('go');void d.getBoundingClientRect();d.classList.add('go')}
document.getElementById('mkp-r').addEventListener('click',play);
if('IntersectionObserver' in window){new IntersectionObserver(function(e,o){if(e[0].isIntersecting){o.disconnect();play()}},{threshold:.4}).observe(d)}else play();
var im=document.getElementById('mkp-i'),ps=JSON.parse(im.getAttribute('data-p')),k=0;
document.getElementById('mkp-n').addEventListener('click',function(){k=(k+1)%ps.length;im.style.opacity=0;setTimeout(function(){im.setAttribute('href',ps[k]);im.style.opacity=1},300)});
var li=document.getElementById('mkp-li'),ls=JSON.parse(li.getAttribute('data-p')),j=0,svg=li.ownerSVGElement;
svg.addEventListener('mousemove',function(e){var r=svg.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;li.style.transform='translate('+(x*-120)+'px,'+(y*-80)+'px)'});
document.getElementById('mkp-ln').addEventListener('click',function(){j=(j+1)%ls.length;li.setAttribute('href',ls[j])});
svg.addEventListener('click',function(){j=(j+1)%ls.length;li.setAttribute('href',ls[j])})})();

/* Brand system: six moods of the mark (gentle, respects reduced motion) */
(function(){var grid=document.querySelector('.mps-g');if(!grid)return;if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
grid.querySelectorAll('.mps').forEach(function(card){var m=card.getAttribute('data-m'),st=card.querySelector('.mps-s'),el=card.querySelector('.mps-m'),W=0,H=0,x=0,y=0,vx=0,vy=0,live=false,mx=null,my=null;
function size(){var r=st.getBoundingClientRect();W=r.width;H=r.height}size();window.addEventListener('resize',size);
function rel(e){var r=st.getBoundingClientRect();return [e.clientX-r.left-W/2,e.clientY-r.top-H/2]}
function put(sx,sy,rot){el.style.transform='translate('+x+'px,'+y+'px) scale('+(sx||1)+','+(sy==null?(sx||1):sy)+') rotate('+(rot||0)+'deg)'}
new IntersectionObserver(function(e){live=e[0].isIntersecting},{threshold:.1}).observe(st);
st.addEventListener('pointermove',function(e){var p=rel(e);mx=p[0];my=p[1]});st.addEventListener('pointerleave',function(){mx=my=null});
if(m==='esc'){var lim=function(){return [W/2-70,H/2-45]};
 (function f(){if(live){var l=lim();if(mx!=null){var dx=x-mx,dy=y-my,d=Math.hypot(dx,dy)||1;if(d<150){var k=(150-d)/150*2.2;vx+=dx/d*k;vy+=dy/d*k}}vx+=(0-x)*.004;vy+=(0-y)*.004;vx*=.9;vy*=.9;x=clamp(x+vx,-l[0],l[0]);y=clamp(y+vy,-l[1],l[1]);put(1,1,vx*2)}requestAnimationFrame(f)})()}
if(m==='sqz'){var tx=0,ty=0,ex=0,ey=0,evx=0,evy=0,sp=0,ang=0,pv=0,pvv=0;
 st.addEventListener('pointerdown',function(){pvv+=.9});
 (function f(){if(live){var gx=mx!=null?mx*.45:0,gy=my!=null?my*.45:0;evx+=(gx-ex)*.045;evy+=(gy-ey)*.045;evx*=.86;evy*=.86;var ox=ex,oy=ey;ex+=evx;ey+=evy;x=ex;y=ey;var v=Math.hypot(ex-ox,ey-oy);sp+=(v-sp)*.2;if(v>.15)ang=Math.atan2(ey-oy,ex-ox);pvv+=(0-pv)*.12;pvv*=.84;pv+=pvv;var st_=Math.min(.55,sp*.05)+pv*.35,a=ang*180/Math.PI;el.style.transform='translate('+x+'px,'+y+'px) rotate('+a+'deg) scale('+(1+st_)+','+(1-st_*.7)+') rotate('+(-a)+'deg)'}requestAnimationFrame(f)})()}
if(m==='zg'){x=0;y=0;vx=.35;vy=-.25;var r=0,rv=.12;
 st.addEventListener('pointerdown',function(e){var p=rel(e),dx=x-p[0],dy=y-p[1],d=Math.hypot(dx,dy)||1;vx+=dx/d*1.6;vy+=dy/d*1.6;rv+=(dx>0?1:-1)*.25});
 (function f(){if(live){var lx=W/2-65,ly=H/2-45;x+=vx;y+=vy;r+=rv;if(x>lx||x<-lx){vx*=-1;x=clamp(x,-lx,lx)}if(y>ly||y<-ly){vy*=-1;y=clamp(y,-ly,ly)}var s=Math.hypot(vx,vy);if(s>1.1){vx*=.995;vy*=.995}rv*=.998;put(1,1,r)}requestAnimationFrame(f)})()}
if(m==='jmp'){var busy=false;function jump(){if(busy)return;busy=true;el.style.animation='mpj 1s cubic-bezier(.3,.1,.3,1) 1';setTimeout(function(){el.style.animation='';busy=false},1020)}
 el.addEventListener('click',jump);st.addEventListener('click',jump);el.style.setProperty('--x','0px');el.style.setProperty('--y','0px')}
if(m==='shr'){var sc=1;(function f(){if(live){var t=1;if(mx!=null){var d=Math.hypot(mx,my);t=clamp(.22+d/190,.22,1.25)}else t=1;sc+=(t-sc)*.09;put(sc,sc,0)}requestAnimationFrame(f)})()}
if(m==='lk'){var rx=0,ry=0;st.style.perspective='700px';(function f(){if(live){var tx=0,ty=0;if(mx!=null){ty=clamp(mx/(W/2),-1,1)*32;tx=clamp(-my/(H/2),-1,1)*24}rx+=(tx-rx)*.1;ry+=(ty-ry)*.1;el.style.transform='rotateX('+rx+'deg) rotateY('+ry+'deg)'}requestAnimationFrame(f)})()}
})})();
