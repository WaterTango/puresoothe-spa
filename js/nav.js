// Mobile nav (≤600px): #29 hamburger menu, #30 hide on scroll down / show on scroll up.
// #57: every #anchor jump lands with the target's top edge exactly under the (visible) header.
(function () {
  var header = document.querySelector('.nav');
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('nav-menu');
  if (!header || !btn || !menu) return;
  var mq = window.matchMedia('(max-width: 600px)');

  var root = document.documentElement;
  var jumping = false, settleTimer = null;

  // #57: --hdr = real header height (CSS values stay as the no-JS fallback). Not measured while the mobile menu is open.
  function measure() {
    if (header.classList.contains('menu-open')) return;
    var h = header.offsetHeight;
    if (h) root.style.setProperty('--hdr', h + 'px');
  }

  function setOpen(open) {
    header.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) header.classList.remove('nav-hidden'); else measure();
  }
  function isOpen() { return header.classList.contains('menu-open'); }

  btn.addEventListener('click', function () { setOpen(!isOpen()); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) { setOpen(false); btn.focus(); }
  });

  var lastY = window.scrollY;

  // #57: one generic handler for every in-page #anchor (menu links, Explore services, new sections need only an id + link).
  function settle(target) {
    jumping = false;
    var d = target.getBoundingClientRect().top - header.offsetHeight;
    if (Math.abs(d) > 0.5) window.scrollBy({ top: d, behavior: 'instant' });
    lastY = window.scrollY;
  }
  function watchSettle(target) {
    var last = -1, still = 0;
    clearInterval(settleTimer);
    settleTimer = setInterval(function () {
      var y = window.scrollY;
      still = (y === last) ? still + 1 : 0;
      last = y;
      if (still >= 3) { clearInterval(settleTimer); settle(target); }
    }, 80);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var id = a.getAttribute('href').slice(1);
    var target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    setOpen(false);           // closing the mobile menu shrinks the sticky header: do it before measuring the jump
    measure();
    jumping = true;
    header.classList.remove('nav-hidden');
    try { history.pushState(null, '', '#' + id); } catch (err) {}
    // explicit destination (target top minus --hdr): smooth via CSS scroll-behavior, instant for reduced motion
    window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - header.offsetHeight) });
    watchSettle(target);
  });

  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  if (window.ResizeObserver) new ResizeObserver(measure).observe(header);

  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (jumping) { header.classList.remove('nav-hidden'); lastY = y; return; }
    if (!mq.matches || y <= 80 || isOpen()) header.classList.remove('nav-hidden');
    else if (y > lastY) header.classList.add('nav-hidden');
    else if (y < lastY) header.classList.remove('nav-hidden');
    lastY = y;
  }, { passive: true });

  function onChange() { if (!mq.matches) { setOpen(false); header.classList.remove('nav-hidden'); } }
  if (mq.addEventListener) mq.addEventListener('change', onChange); else mq.addListener(onChange);
})();
