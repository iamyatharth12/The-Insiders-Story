/* =====================================================================
   THE INSIDERS' STORY — Process page progress indicator
   ===================================================================== */

(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const steps = document.querySelectorAll('.process-stage[data-step]');
  const bar = document.getElementById('progressBar');
  const stepsRing = document.querySelectorAll('.process-progress__step');
  const nowLabel = document.getElementById('progressNow');
  if (!steps.length || !bar) return;

  const names = ['01 · Discover', '02 · Imagine', '03 · Create', '04 · Transform'];
  const pctPer = 100 / (steps.length - 1);

  const updateProgress = () => {
    const vh = window.innerHeight;
    let maxVisible = 0;
    steps.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      // If the stage's top is above the bottom of the viewport by 30%+, it's "visible"
      if (r.top < vh * 0.85) {
        maxVisible = Math.max(maxVisible, i + 1);
      }
    });

    const current = Math.max(1, maxVisible);
    const pct = (current - 1) * pctPer;

    if (!reduced) {
      bar.style.transition = 'width 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
    }
    bar.style.width = pct + '%';

    // Update step dots
    stepsRing.forEach((dot, i) => {
      dot.classList.remove('is-passed', 'is-current');
      if (i + 1 < current) dot.classList.add('is-passed');
      if (i + 1 === current) dot.classList.add('is-current');
    });

    // Update label
    if (nowLabel) {
      nowLabel.textContent = current <= 4 ? names[current - 1] : names[3];
    }
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

})();
