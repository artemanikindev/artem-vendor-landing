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

  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      window.location.href = '/?_kom=/schedule?magicLinkId=Lavmpl&utm_source=landing&utm_medium=form';
    });
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
