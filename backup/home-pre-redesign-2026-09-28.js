/* Home page: the statement lights up word by word as it scrolls into view. */
(function () {
  var el = document.querySelector('.hm-big');
  if (!el || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;

  function wrap(node) {
    [].slice.call(node.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (t) {
          if (!t) return;
          if (/^\s+$/.test(t)) { f.appendChild(document.createTextNode(t)); return; }
          var s = document.createElement('span');
          s.className = 'w';
          s.textContent = t;
          f.appendChild(s);
        });
        node.replaceChild(f, n);
      } else if (n.nodeType === 1) {
        wrap(n);
      }
    });
  }
  wrap(el);

  var words = [].slice.call(el.querySelectorAll('.w')), n = words.length, ticking = false;
  var MIN = 0.22;

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function update() {
    ticking = false;
    var r = el.getBoundingClientRect(), vh = window.innerHeight || 800;
    var p = clamp((vh * 0.88 - r.top) / (r.height + vh * 0.3));
    for (var i = 0; i < n; i++) {
      var t = i / n;
      words[i].style.opacity = (MIN + (1 - MIN) * clamp((p * 1.2 - t) * 5)).toFixed(3);
    }
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  update();
})();
