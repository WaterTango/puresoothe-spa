// #42 Hotels we visit: live search, one selection, steps 2-3 unlock. #47: the button is a plain link to #services.
(function () {
  var q = document.getElementById('hotel-q');
  var list = document.querySelector('.hotel-list');
  if (!q || !list) return;
  var items = [].slice.call(list.querySelectorAll('li'));
  var status = document.getElementById('hotel-status');
  var chosen = document.getElementById('hotel-chosen');
  var card = document.getElementById('hotel-steps');
  var mq = window.matchMedia('(max-width: 600px)');
  var TOTAL = items.length, LIMIT = 6;

  function render() {
    var term = q.value.trim().toLowerCase();
    var matches = items.filter(function (li) {
      return li.firstChild.getAttribute('data-name').toLowerCase().indexOf(term) > -1;
    });
    var n = matches.length;
    var cap = mq.matches ? n : LIMIT;
    items.forEach(function (li) { li.hidden = true; });
    matches.slice(0, cap).forEach(function (li) { li.hidden = false; });
    var text;
    if (!n) text = 'No match. Contact us and we will arrange a session at your location.';
    else if (mq.matches) text = n + ' of ' + TOTAL + ' hotels. Scroll the list or keep typing.';
    else if (n > LIMIT) text = (n - LIMIT) + ' more. Keep typing to narrow down.';
    else text = n + ' of ' + TOTAL + ' hotels';
    status.textContent = text;
  }

  q.addEventListener('input', render);
  list.addEventListener('click', function (e) {
    var b = e.target.closest('button.hotel');
    if (!b) return;
    items.forEach(function (li) {
      var on = li.firstChild === b;
      li.firstChild.classList.toggle('sel', on);
      li.firstChild.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    chosen.textContent = b.getAttribute('data-name');
    card.classList.add('unlocked');
  });
  if (mq.addEventListener) mq.addEventListener('change', render); else mq.addListener(render);
  render();
})();
