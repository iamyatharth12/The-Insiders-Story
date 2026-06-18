/* =====================================================================
   THE INSIDERS' STORY — Home page motion
   Hero slideshow, word reveal, case-study pinned rotation.
   ===================================================================== */

(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. HERO WORD REVEAL ---------- */
  if (!reduced) {
    const words = document.querySelectorAll('.hero__word[data-split]');
    words.forEach((w, i) => {
      setTimeout(() => w.classList.add('is-in'), 350 + i * 160);
    });
  } else {
    document.querySelectorAll('.hero__word[data-split]').forEach(w => w.classList.add('is-in'));
  }

  /* ---------- 2. HERO BACKGROUND SLIDESHOW + PARALLAX ---------- */
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length > 1 && !reduced) {
    let idx = 0;
    setInterval(() => {
      slides[idx].classList.remove('is-active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('is-active');
    }, 6500);
  } else if (slides[0]) {
    slides[0].classList.add('is-active');
  }

  if (!reduced) {
    const hero = document.getElementById('hero');
    if (hero) {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          slides.forEach(s => {
            s.style.transform = `scale(1.${100 + Math.min(y * 0.02, 10)}) translateY(${y * 0.15}px)`;
          });
        }
      }, { passive: true });
    }
  }

  /* ---------- 3. HERO COUNTERS ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (!reduced && counters.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => io.observe(c));
  } else {
    counters.forEach(c => c.textContent = c.dataset.count);
  }
  function animateCount(el) {
    const target = Number(el.dataset.count) || 0;
    const dur = 1600;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  }

  /* ---------- 4. CASE STUDY — STICKY PANEL ROTATION ---------- */
  const caseEl = document.getElementById('case');
  if (caseEl && !reduced) {
    const panels = caseEl.querySelectorAll('.case__panel');
    const total = panels.length;
    const setActive = (i) => panels.forEach((p, idx) => p.classList.toggle('is-active', idx === i));

    let ticking = false;
    const onCaseScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = caseEl.getBoundingClientRect();
        const h = caseEl.offsetHeight;
        const vh = window.innerHeight;
        const totalScroll = h - vh;
        const scrolled = Math.min(Math.max(-rect.top, 0), totalScroll);
        const step = totalScroll / total;
        const idx = Math.min(total - 1, Math.floor(scrolled / step));
        setActive(idx);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onCaseScroll, { passive: true });
    setActive(0);
  } else if (caseEl) {
    caseEl.querySelectorAll('.case__panel').forEach((p, i) => p.classList.toggle('is-active', i === 0));
  }

  /* ---------- 5. TIMELINE PROGRESS (homepage) ---------- */
  const timelineItems = document.querySelectorAll('.timeline__item');
  if (timelineItems.length && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    timelineItems.forEach((el) => io.observe(el));
  } else {
    timelineItems.forEach((el) => el.classList.add('is-revealed'));
  }

  /* ---------- 6. HOMEPAGE PROJECT LIGHTBOX ---------- */
  const projectData = [
    { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85', caption: 'Aaline · A residence in linen and stone' },
    { src: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=2000&q=85', caption: 'Maison Taupe · A layered home by the sea' },
    { src: 'https://images.unsplash.com/photo-1616627561839-074385245ff6?auto=format&fit=crop&w=2000&q=85', caption: 'Atelier Beige · Soft modernism for a family' },
    { src: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=2000&q=85', caption: 'Casa Lume · A home shaped by afternoon light' },
    { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85', caption: 'Studio Kaze · A room for thinking' },
    { src: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2000&q=85', caption: 'Noor · Stone, brass, and home cooking' }
  ];
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCap = document.getElementById('lightboxCaption');
  const lbClose = document.getElementById('lightboxClose');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');
  let lbIndex = 0;

  if (lightbox && lbImg) {
    const open = (i) => {
      lbIndex = (i + projectData.length) % projectData.length;
      lbImg.src = projectData[lbIndex].src;
      lbImg.alt = projectData[lbIndex].caption;
      lbCap.textContent = projectData[lbIndex].caption;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-no-scroll');
    };
    const close = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-no-scroll');
    };
    const next = () => open(lbIndex + 1);
    const prev = () => open(lbIndex - 1);

    document.querySelectorAll('.project').forEach((p, i) => {
      p.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        open(i);
      });
      p.setAttribute('role', 'button');
      p.setAttribute('tabindex', '0');
      p.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
    });

    lbClose.addEventListener('click', close);
    lbNext.addEventListener('click', next);
    lbPrev.addEventListener('click', prev);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
  }

  /* ---------- 7. HOMEPAGE CONTACT FORM ---------- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form && note) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      if (!name || !data.get('email') || !data.get('message')) {
        note.textContent = 'Please complete the required fields so we can reply properly.';
        return;
      }
      note.textContent = `Thank you, ${name.split(' ')[0]}. We'll be in touch within two working days.`;
      form.reset();
    });
  }

})();
