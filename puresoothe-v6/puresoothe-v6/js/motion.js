// #43 section reveal on scroll (fade up once, above-the-fold untouched) + #52 header shadow and current-section link.
(function () {
  var header = document.querySelector('.nav');

  // #52.3 header shadow once scrolled past 8px
  if (header) {
    var shadow = function () { header.classList.toggle('scrolled', (window.scrollY || 0) > 8); };
    window.addEventListener('scroll', shadow, { passive: true });
    shadow();
  }

  // #52.4 current section link (Home / Services / Contact) for the menu underline
  if ('IntersectionObserver' in window) {
    var ids = ['home', 'services', 'contact'];
    var links = {};
    ids.forEach(function (id) { links[id] = document.querySelector('#nav-menu a[href="#' + id + '"]'); });
    var setCurrent = function (id) {
      ids.forEach(function (k) {
        if (!links[k]) return;
        var on = k === id;
        links[k].classList.toggle('is-current', on);
        if (on) links[k].setAttribute('aria-current', 'true'); else links[k].removeAttribute('aria-current');
      });
    };
    setCurrent('home');
    var cur = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setCurrent(en.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    ids.forEach(function (id) { var el = document.getElementById(id); if (el) cur.observe(el); });
  }

  // #43.2 reveal (not under reduced motion)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  var els = [].slice.call(document.querySelectorAll('.head, .cat-title, .card, .quick-card, .qm-title, .trc, .hotels-head'));
  var vh = window.innerHeight || document.documentElement.clientHeight;
  var targets = els.filter(function (el) {
    var r = el.getBoundingClientRect();
    if (!r.width && !r.height) return false;      // not displayed at this width
    if (r.top < vh && r.bottom > 0) return false;  // above the fold: untouched
    el.classList.add('rv');
    return true;
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      io.unobserve(el);
      el.classList.add('rv-in');
      setTimeout(function () { el.classList.remove('rv', 'rv-in'); }, 700);
    });
  }, { threshold: 0.15 });
  targets.forEach(function (el) { io.observe(el); });
})();
