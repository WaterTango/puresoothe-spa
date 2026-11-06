// Mobile nav (≤600px): #29 hamburger menu, #30 hide on scroll down / show on scroll up.
(function () {
  var header = document.querySelector('.nav');
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('nav-menu');
  if (!header || !btn || !menu) return;
  var mq = window.matchMedia('(max-width: 600px)');

  function setOpen(open) {
    header.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) header.classList.remove('nav-hidden');
  }
  function isOpen() { return header.classList.contains('menu-open'); }

  btn.addEventListener('click', function () { setOpen(!isOpen()); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) { setOpen(false); btn.focus(); }
  });

  var lastY = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (!mq.matches || y <= 80 || isOpen()) header.classList.remove('nav-hidden');
    else if (y > lastY) header.classList.add('nav-hidden');
    else if (y < lastY) header.classList.remove('nav-hidden');
    lastY = y;
  }, { passive: true });

  function onChange() { if (!mq.matches) { setOpen(false); header.classList.remove('nav-hidden'); } }
  if (mq.addEventListener) mq.addEventListener('change', onChange); else mq.addListener(onChange);
})();
