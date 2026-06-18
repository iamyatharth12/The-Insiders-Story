/* =====================================================================
   THE INSIDERS' STORY — Site-wide Behaviors
   Nav, cursor, magnetic buttons, parallax, image reveals, page-transition.
   Used on every page.
   ===================================================================== */

(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;

  /* ---------- 1. NAV SCROLL STATE ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 60);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 2. MOBILE MENU ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    const toggleMenu = (open) => {
      const isOpen = open ?? !mobileMenu.classList.contains('is-open');
      mobileMenu.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      document.body.classList.toggle('is-no-scroll', isOpen);
    };
    navToggle.addEventListener('click', () => toggleMenu());
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
  }

  /* ---------- HELPER (shared across sections) ---------- */
  const fileFromHref = (href) => {
    try { return decodeURIComponent((new URL(href, location.href)).pathname.split('/').pop() || 'index.html'); }
    catch { return 'index.html'; }
  };

  /* ---------- 2.5. PRELOADER DISMISSAL (covers all pages) ---------- */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const dismiss = () => {
      if (!preloader.classList.contains('is-done')) {
        preloader.classList.add('is-done');
      }
    };
    try {
      const from = sessionStorage.getItem('insiders.from') || '';
      if (from && from !== fileFromHref(location.href)) {
        // Page transition handles it — no need for additional fade
      } else {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => setTimeout(dismiss, 500));
        } else {
          setTimeout(dismiss, 500);
        }
      }
    } catch {
      // If sessionStorage or helper fails, dismiss preloader normally
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(dismiss, 500));
      } else {
        setTimeout(dismiss, 500);
      }
    }
    setTimeout(dismiss, 3000);
  }
  const cursor = document.getElementById('cursor');
  if (cursor && !isCoarse && !reduced) {
    const dot = cursor.querySelector('.cursor__dot');
    const ring = cursor.querySelector('.cursor__ring');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    }, { passive: true });

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    tick();

    const hoverables = 'a, button, .project, .p-card, input, textarea, select, .voice, [data-hover], .filters__btn, .pd-ba__viewer';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverables)) cursor.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverables)) cursor.classList.remove('is-hover');
    });
  }

  /* ---------- 4. SCROLL-TRIGGERED REVEALS ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (!reduced && 'IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = Number(entry.target.dataset.delay) || 0;
          setTimeout(() => entry.target.classList.add('is-in'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- 5. SUBTLE PARALLAX ON IMAGES ---------- */
  if (!reduced && !isCoarse) {
    const parallaxImgs = document.querySelectorAll('[data-parallax]');
    if (parallaxImgs.length) {
      window.addEventListener('scroll', () => {
        const vh = window.innerHeight;
        parallaxImgs.forEach((img) => {
          const r = img.parentElement.getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) return;
          const center = r.top + r.height / 2 - vh / 2;
          const strength = Number(img.dataset.parallax) || 0.08;
          const offset = Math.max(-60, Math.min(60, center * -strength));
          img.style.transform = `translateY(${offset}px) scale(1.06)`;
        });
      }, { passive: true });
    }
  }

  /* ---------- 6. MAGNETIC BUTTONS ---------- */
  if (!reduced && !isCoarse) {
    const magnets = document.querySelectorAll('.magnetic');
    magnets.forEach((el) => {
      const strength = Number(el.dataset.magnetic) || 0.35;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------- 7. PAGE TRANSITIONS (cinematic overlay) ---------- */
  if (!reduced && 'sessionStorage' in window) {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = '<div class="page-transition__label"><span></span></div>';
    document.body.appendChild(overlay);
    const label = overlay.querySelector('span');

    const routeLabels = {
      'index.html': 'Story',
      'projects.html': 'Projects',
      'project.html': 'Project',
      'about.html': 'Studio',
      'process.html': 'Process',
      'contact.html': 'Begin'
    };

    const fileFromHref = (href) => {
      try { return decodeURIComponent((new URL(href, location.href)).pathname.split('/').pop() || 'index.html'); }
      catch { return 'index.html'; }
    };

    // On first paint, animate the overlay away from the previous page
    const from = sessionStorage.getItem('insiders.from') || '';
    const to   = fileFromHref(location.href);
    label.textContent = routeLabels[to] || to.replace('.html', '');
    if (from && from !== to) {
      // Coming from another page: hide preloader and play exit animation
      const pl = document.getElementById('preloader');
      if (pl) { pl.style.opacity = '0'; pl.style.visibility = 'hidden'; }
      overlay.style.display = '';
      overlay.classList.add('is-exit');
      setTimeout(() => {
        overlay.classList.remove('is-exit');
      }, 700);
    } else {
      overlay.style.display = 'none';
    }

    // Intercept internal links
    const isInternal = (href) => {
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('whatsapp:')) return false;
      if (href.startsWith('http') || href.startsWith('//')) return false;
      return true;
    };
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!isInternal(href)) return;
      if (a.target && a.target !== '_self') return;
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      const target = a.href;
      const next = fileFromHref(target);
      label.textContent = routeLabels[next] || next.replace('.html', '');
      sessionStorage.setItem('insiders.from', to);
      overlay.style.display = '';
      overlay.classList.remove('is-exit');
      overlay.classList.add('is-enter');
      setTimeout(() => { window.location.href = target; }, 750);
    });
  }

  /* ---------- 8. SET BODY PAGE ATTRIBUTE (for active nav) ---------- */
  const setPage = () => {
    const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    let key = 'home';
    if (file === 'projects.html') key = 'projects';
    else if (file.startsWith('project')) key = 'project-detail';
    else if (file === 'about.html') key = 'about';
    else if (file === 'process.html') key = 'process';
    else if (file === 'contact.html') key = 'contact';
    document.body.setAttribute('data-page', key);
  };
  setPage();

})();
