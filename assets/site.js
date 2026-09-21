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
