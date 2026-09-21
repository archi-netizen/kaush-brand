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
var url=fb.getAttribute('data-pdf'),stage=fb.querySelector('.flip-stage'),cnt=fb.querySelector('.flip-count'),pdf=null,pg=1,wide=true,busy=false;
function load(src,cb){var s=document.createElement('script');s.src=src;s.onload=cb;document.head.appendChild(s)}
function spread(){wide=fb.clientWidth>760}
async function draw(){if(!pdf||busy)return;busy=true;spread();stage.innerHTML='';
var n=pdf.numPages,pages=wide&&pg>1&&pg<n?[pg,pg+1]:[pg];if(wide&&pg>1&&pg===n&&n%2===0)pages=[pg];
var w=stage.clientWidth/(pages.length>1?2:1);
for(var k=0;k<pages.length;k++){var p=await pdf.getPage(pages[k]),v=p.getViewport({scale:1}),sc=Math.min(w/v.width,900/v.height)*(window.devicePixelRatio||1);
var vp=p.getViewport({scale:sc}),c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;c.style.width=(vp.width/(window.devicePixelRatio||1))+'px';c.setAttribute('role','img');c.setAttribute('aria-label','Page '+pages[k]);
stage.appendChild(c);await p.render({canvasContext:c.getContext('2d'),viewport:vp}).promise}
stage.classList.remove('turn');void stage.offsetWidth;stage.classList.add('turn');
cnt.textContent=(pages.length>1?pages[0]+'–'+pages[1]:pages[0])+' / '+n;fb.dataset.step=pages.length;busy=false}
function step(d){var s=(wide&&pg>1&&pg<pdf.numPages)?2:1;if(d<0){s=(wide&&pg>2)?2:1}pg=Math.max(1,Math.min(pdf.numPages,pg+d*s));if(wide&&pg>1&&pg%2===1)pg-=1;draw()}
fb.querySelector('.flip-prev').addEventListener('click',function(){step(-1)});
fb.querySelector('.flip-next').addEventListener('click',function(){step(1)});
fb.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)});
var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(draw,200)});
var started=false;function init(){if(started)return;started=true;load('/assets/pdf.min.js',function(){pdfjsLib.GlobalWorkerOptions.workerSrc='/assets/pdf.worker.min.js';pdfjsLib.getDocument(url).promise.then(function(d){pdf=d;draw()}).catch(function(){stage.innerHTML='<p>The flipbook could not be loaded. <a href="'+url+'">Open the PDF</a>.</p>'})})}
if('IntersectionObserver'in window){new IntersectionObserver(function(e,o){if(e[0].isIntersecting){o.disconnect();init()}},{rootMargin:'300px'}).observe(fb)}else init();})();

/* Courses: register-interest panel */
(function(){var b=document.getElementById('ri-btn'),p=document.getElementById('ri-panel');if(!b||!p)return;
b.addEventListener('click',function(){var o=p.hidden;p.hidden=!o;b.setAttribute('aria-expanded',o)});
var c=document.getElementById('ri-copy'),ok=document.getElementById('ri-ok');if(!c)return;
c.addEventListener('click',function(){var t=c.getAttribute('data-email');
function done(m){ok.textContent=m;setTimeout(function(){ok.textContent=''},2500)}
if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){done('Copied ✓')},function(){fb()})}else fb();
function fb(){var a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy');done('Copied ✓')}catch(e){done('Press Ctrl+C to copy: '+t)}document.body.removeChild(a)}})})();
