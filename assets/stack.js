/* Stacking cards: shrink and darken a card as the next one slides over it. */
(function () {
  var stacks = [].slice.call(document.querySelectorAll('[data-stack]'));
  if (!stacks.length) return;

  stacks.forEach(function (st) {
    [].slice.call(st.querySelectorAll('.stk-card')).forEach(function (c, i) { c.style.setProperty('--i', i); });
  });
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var items = [], ticking = false;

  function measure() {
    items = [];
    stacks.forEach(function (st) {
      var cards = [].slice.call(st.querySelectorAll('.stk-card'));
      cards.forEach(function (c, i) {
        var next = cards[i + 1];
        if (next) items.push({ card: c, next: next, stick: parseFloat(getComputedStyle(next).top) || 0 });
      });
    });
  }

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function update() {
    ticking = false;
    for (var k = 0; k < items.length; k++) {
      var it = items[k];
      var d = it.next.getBoundingClientRect().top - it.stick;
      var p = 1 - clamp(d / (it.card.offsetHeight * 0.85));
      if (p <= 0.001) {
        it.card.style.transform = '';
        it.card.style.filter = '';
      } else {
        it.card.style.transform = 'scale(' + (1 - 0.05 * p).toFixed(4) + ')';
        it.card.style.filter = 'brightness(' + (1 - 0.4 * p).toFixed(3) + ')';
      }
    }
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  measure();
  update();
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', function () { measure(); req(); });
  window.addEventListener('load', function () { measure(); req(); });
})();
