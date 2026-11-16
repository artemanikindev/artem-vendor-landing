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
    { key: 'live', id: 'Lavmpl', title: 'Live link', note: 'Calendar test · Lavmpl', tone: 'ok' },
    { key: 'expired', id: 'Apbel5', title: 'Expired event link', note: 'QA KN-2959 Expired · Apbel5 · Oct 1–3, 2026', tone: 'warn' },
    { key: 'deleted', id: '1DQ2WQ', title: 'Deleted link', note: 'QA Lane A - deleted link · 1DQ2WQ', tone: 'bad' }
  ];

  var PUBLIC_BASE = 'https://stg.start-chat.com/m/artem-vendor/';
  var MODE_KEY = 'qa-open-in-modal';

  function readModalMode() {
    try { return localStorage.getItem(MODE_KEY) === 'true'; } catch (e) { return false; }
  }
  function saveModalMode(value) {
    try { localStorage.setItem(MODE_KEY, String(value)); } catch (e) {}
  }
  function modalUrl(id) {
    return window.location.pathname + '?_kom=/schedule?magicLinkId=' + id;
  }

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
          return '<a class="chooser-item" data-id="' + l.id + '" href="' + PUBLIC_BASE + l.id + '">' +
            '<span class="chooser-dot ' + l.tone + '"></span>' +
            '<span><b>' + l.title + '</b><small>' + l.note + '</small></span>' +
            '<span class="chooser-arrow">→</span></a>';
        }).join('') +
      '</div>' +
      '<label class="chooser-mode"><input type="checkbox" id="chooser-modal"> Open in modal (Knock tag on this page)</label>' +
      '<p class="chooser-hint">Modal currently loads from production (staging tag config) — every link shows "not found" there. Use page mode for real staging results.</p>' +
    '</div>';
  document.body.appendChild(overlay);

  var modeInput = overlay.querySelector('#chooser-modal');
  modeInput.checked = readModalMode();
  modeInput.addEventListener('change', function () { saveModalMode(modeInput.checked); });

  overlay.querySelectorAll('.chooser-item').forEach(function (item) {
    item.addEventListener('click', function (event) {
      if (!modeInput.checked) return;
      event.preventDefault();
      window.location.href = modalUrl(item.dataset.id);
    });
  });

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
