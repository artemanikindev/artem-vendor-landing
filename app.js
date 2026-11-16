(function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      var counter = entry.target.querySelector('[data-count]');
      if (counter) animateCount(counter);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });

  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var decimals = String(target).includes('.') ? 1 : 0;
    var start = performance.now();
    function tick(now) {
      var progress = Math.min((now - start) / 1200, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var statusEl = document.getElementById('tag-status');
  var dotEl = document.getElementById('tag-dot');
  if (statusEl) {
    setTimeout(function () {
      var running = window.KnockScriptRunning === true;
      statusEl.textContent = running ? 'Knock tag running' : 'Knock tag not loaded';
      if (running) dotEl.classList.add('on');
    }, 3000);
  }
})();

(function () {
  var LINKS = [
    { key: 'live', title: 'Live link', note: 'Calendar test · Lavmpl', tone: 'ok', url: 'https://stg.start-chat.com/m/artem-vendor/Lavmpl' },
    { key: 'expired', title: 'Expired event link', note: 'QA KN-2959 Expired · Apbel5 · Oct 1–3, 2026', tone: 'warn', url: 'https://stg.start-chat.com/m/artem-vendor/Apbel5' },
    { key: 'deleted', title: 'Deleted link', note: 'QA Lane A - deleted link · 1DQ2WQ', tone: 'bad', url: 'https://stg.start-chat.com/m/artem-vendor/1DQ2WQ' }
  ];

  var overlay = document.createElement('div');
  overlay.className = 'chooser';
  overlay.hidden = true;
  overlay.innerHTML =
    '<div class="chooser-card" role="dialog" aria-modal="true" aria-labelledby="chooser-title">' +
      '<button class="chooser-close" type="button" aria-label="Close">×</button>' +
      '<p class="eyebrow">QA · pick a link</p>' +
      '<h3 id="chooser-title">Which booking link?</h3>' +
      '<div class="chooser-list">' +
        LINKS.map(function (l) {
          return '<a class="chooser-item" data-key="' + l.key + '" href="' + l.url + '">' +
            '<span class="chooser-dot ' + l.tone + '"></span>' +
            '<span><b>' + l.title + '</b><small>' + l.note + '</small></span>' +
            '<span class="chooser-arrow">→</span></a>';
        }).join('') +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);

  function open() { overlay.hidden = false; }
  function close() { overlay.hidden = true; }

  overlay.addEventListener('click', function (event) {
    if (event.target === overlay || event.target.classList.contains('chooser-close')) close();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') close();
  });

  document.querySelectorAll('a.btn[href*="_kom="]').forEach(function (button) {
    if (button.closest('.qa')) return;
    button.addEventListener('click', function (event) {
      event.preventDefault();
      open();
    });
  });

  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      open();
    });
  }
})();
