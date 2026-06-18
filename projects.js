/* =====================================================================
   THE INSIDERS' STORY — Projects page
   Renders the editorial grid from projects-data.js + handles filters.
   ===================================================================== */

(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const grid = document.getElementById('projectsGrid');
  const filterButtons = document.querySelectorAll('#filtersList .filters__btn');
  const countEl = document.getElementById('filtersCount');

  if (!grid || !window.INSIDERS_PROJECTS) return;

  /* ---------- 1. RENDER GRID ---------- */
  const projects = window.INSIDERS_PROJECTS;
  const html = projects.map((p, i) => {
    const idx = String(i + 1).padStart(2, '0');
    return `
      <a href="project.html?slug=${p.slug}" class="p-card reveal" data-reveal="up" data-category="${p.category}" data-sub="${(p.subcategories || []).join(',')}">
        <div class="p-card__media">
          <span class="p-card__index">${idx}</span>
          <span class="p-card__view">View Project</span>
          <img src="${p.cover}" alt="${p.coverAlt}" loading="lazy" data-parallax="0.05" />
        </div>
        <div class="p-card__meta">
          <div class="p-card__header">
            <div>
              <span class="p-card__category">${p.category} · ${p.place}</span>
              <h3 class="p-card__name">${p.name}</h3>
              <span class="p-card__place">${p.style}</span>
            </div>
            <span class="p-card__year">${p.year}</span>
          </div>
          <p class="p-card__teaser">${p.teaser}</p>
        </div>
      </a>
    `;
  }).join('');
  grid.innerHTML = html;

  /* ---------- 2. UPDATE COUNT ---------- */
  if (countEl) countEl.textContent = String(projects.length);

  /* ---------- 3. APPLY REVEAL ANIMATION (re-observe new elements) ---------- */
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = Number(entry.target.dataset.delay) || 0;
          setTimeout(() => entry.target.classList.add('is-in'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    grid.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    grid.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- 4. APPLY PARALLAX (re-bind images) ---------- */
  if (!reduced && !window.matchMedia('(pointer: coarse)').matches) {
    const imgs = grid.querySelectorAll('[data-parallax]');
    if (imgs.length) {
      window.addEventListener('scroll', () => {
        const vh = window.innerHeight;
        imgs.forEach((img) => {
          const r = img.parentElement.getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) return;
          const center = r.top + r.height / 2 - vh / 2;
          const strength = Number(img.dataset.parallax) || 0.05;
          const offset = Math.max(-50, Math.min(50, center * -strength));
          img.style.transform = `translateY(${offset}px) scale(1.06)`;
        });
      }, { passive: true });
    }
  }

  /* ---------- 5. FILTERS ---------- */
  const applyFilter = (filter) => {
    let visible = 0;
    grid.querySelectorAll('.p-card').forEach((card) => {
      const cat = card.dataset.category;
      const subs = (card.dataset.sub || '').split(',');
      const match = filter === 'All' || cat === filter || subs.includes(filter);
      if (match) {
        card.classList.remove('is-hidden');
        // re-trigger reveal animation
        card.classList.remove('is-in');
        requestAnimationFrame(() => {
          setTimeout(() => card.classList.add('is-in'), 50);
        });
        visible++;
      } else {
        card.classList.add('is-hidden');
      }
    });
    if (countEl) countEl.textContent = String(visible);

    // Empty state
    let empty = grid.querySelector('.projects-empty');
    if (visible === 0) {
      if (!empty) {
        empty = document.createElement('div');
        empty.className = 'projects-empty';
        empty.textContent = 'No projects in this category — yet.';
        grid.appendChild(empty);
      }
    } else if (empty) {
      empty.remove();
    }
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      applyFilter(filter);
      // Update URL for shareable filtered view
      const url = new URL(location.href);
      if (filter === 'All') url.searchParams.delete('cat');
      else url.searchParams.set('cat', filter);
      history.replaceState(null, '', url);
    });
  });

  // Read initial filter from URL
  const initial = new URL(location.href).searchParams.get('cat');
  if (initial) {
    const target = Array.from(filterButtons).find(b => b.dataset.filter === initial);
    if (target) target.click();
  }

})();
