/* =====================================================================
   THE INSIDERS' STORY — Project detail renderer
   Reads ?slug=... and renders the full case study from projects-data.js.
   ===================================================================== */

(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.getElementById('projectRoot');
  if (!root || !window.INSIDERS_PROJECTS) return;

  const slug = new URL(location.href).searchParams.get('slug');
  const projects = window.INSIDERS_PROJECTS;
  const idx = projects.findIndex(p => p.slug === slug);
  const project = idx >= 0 ? projects[idx] : projects[0];
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];

  document.title = `${project.name} — The Insiders' Story`;

  /* ---------- HELPERS ---------- */
  const paletteChips = (project.palette || []).map(c =>
    `<div class="pd-palette__chip" style="background:${c}" data-color="${c}"></div>`
  ).join('');

  const materialList = (project.materials || []).map(m =>
    `<li><strong>${m.name}</strong><span>${m.note}</span></li>`
  ).join('');

  const furnitureList = (project.furniture || []).map(f => `<li>${f}</li>`).join('');

  const galleryImgs = (project.gallery || []).map(src =>
    `<img src="${src}" alt="${project.name} — gallery image" loading="lazy" />`
  ).join('');

  const storyParas = (project.story || []).map(p => `<p>${p}</p>`).join('');

  /* ---------- RENDER ---------- */
  root.innerHTML = `
    <section class="pd-hero">
      <div class="pd-hero__media">
        <img src="${project.cover}" alt="${project.coverAlt || project.name}" data-parallax="0.04" />
        <div class="pd-hero__overlay"></div>
      </div>
      <div class="pd-hero__content">
        <nav class="pd-hero__breadcrumb reveal" data-reveal="up" aria-label="Breadcrumb">
          <a href="index.html">Home</a>
          <span>/</span>
          <a href="projects.html">Projects</a>
          <span>/</span>
          <span style="color: var(--bone);">${project.name}</span>
        </nav>
        <h1 class="pd-hero__title reveal" data-reveal="up" data-delay="100">
          ${project.name}
        </h1>
        <div class="pd-hero__meta">
          <div class="pd-hero__meta-item reveal" data-reveal="up" data-delay="200">
            <span class="pd-hero__meta-label">Location</span>
            <span class="pd-hero__meta-value">${project.place}</span>
          </div>
          <div class="pd-hero__meta-item reveal" data-reveal="up" data-delay="300">
            <span class="pd-hero__meta-label">Year</span>
            <span class="pd-hero__meta-value">${project.year}</span>
          </div>
          <div class="pd-hero__meta-item reveal" data-reveal="up" data-delay="400">
            <span class="pd-hero__meta-label">Category</span>
            <span class="pd-hero__meta-value">${project.category}</span>
          </div>
          <div class="pd-hero__meta-item reveal" data-reveal="up" data-delay="500">
            <span class="pd-hero__meta-label">Style</span>
            <span class="pd-hero__meta-value" style="font-style:italic;">${project.style}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="pd-intro">
      <div class="pd-intro__sticky">
        <p class="pd-intro__eyebrow reveal" data-reveal="up">The Project Story</p>
        <h2 class="pd-intro__title reveal" data-reveal="up">
          ${project.teaser}
        </h2>
      </div>
      <div class="pd-intro__body reveal" data-reveal="up">
        ${storyParas}
      </div>
    </section>

    ${project.challenge ? `
    <section class="pd-challenge">
      <div class="pd-challenge__inner">
        <p class="pd-challenge__eyebrow reveal" data-reveal="up">The Challenge</p>
        <p class="pd-challenge__quote reveal" data-reveal="up">${project.challenge}</p>
      </div>
    </section>` : ''}

    ${project.gallery && project.gallery[1] ? `
    <div class="pd-break">
      <img src="${project.gallery[1]}" alt="" loading="lazy" data-parallax="0.06" />
    </div>` : ''}

    <section class="pd-details">
      <div class="pd-block reveal" data-reveal="up">
        <p class="pd-block__label">Materials</p>
        <h3 class="pd-block__title">A palette of honest materials</h3>
        <div class="pd-block__body">
          <ul class="pd-list">${materialList}</ul>
        </div>
      </div>

      <div class="pd-block reveal" data-reveal="up">
        <p class="pd-block__label">Colour Palette</p>
        <h3 class="pd-block__title">Tones drawn from the site</h3>
        <div class="pd-block__body">
          <p>Every project begins with a colour study — small watercolours mixed in the studio, refined through the seasons until the palette feels inevitable.</p>
          <div class="pd-palette">${paletteChips}</div>
        </div>
      </div>

      <div class="pd-block reveal" data-reveal="up">
        <p class="pd-block__label">Lighting</p>
        <h3 class="pd-block__title">Designed around the day</h3>
        <div class="pd-block__body">
          <p>${project.lighting}</p>
        </div>
      </div>

      <div class="pd-block reveal" data-reveal="up">
        <p class="pd-block__label">Furniture</p>
        <h3 class="pd-block__title">A few quiet pieces</h3>
        <div class="pd-block__body">
          <ul class="pd-list">${furnitureList.split('</li>').filter(Boolean).map(f => {
            const text = f.replace('<li>','').trim();
            return `<li><strong>·</strong><span>${text}</span></li>`;
          }).join('')}</ul>
        </div>
      </div>

      ${project.spatial ? `
      <div class="pd-block reveal" data-reveal="up" style="grid-column: 1 / -1;">
        <p class="pd-block__label">Spatial Planning</p>
        <h3 class="pd-block__title">How the rooms are arranged</h3>
        <div class="pd-block__body"><p>${project.spatial}</p></div>
      </div>` : ''}
    </section>

    ${project.beforeAfter ? `
    <section class="pd-ba">
      <div class="pd-ba__head">
        <p class="pd-ba__eyebrow reveal" data-reveal="up">The Transformation</p>
        <h3 class="pd-ba__title reveal" data-reveal="up">Before &amp; After</h3>
      </div>
      <div class="pd-ba__viewer reveal" data-reveal="up" id="baViewer">
        <img class="pd-ba__img pd-ba__img--before" src="${project.beforeAfter.before}" alt="Before the renovation" />
        <img class="pd-ba__img pd-ba__img--after" id="baAfter" src="${project.beforeAfter.after}" alt="After the renovation" />
        <div class="pd-ba__label pd-ba__label--before">Before</div>
        <div class="pd-ba__label pd-ba__label--after">After</div>
        <div class="pd-ba__handle" id="baHandle" style="left: 50%;"></div>
      </div>
    </section>` : ''}

    ${project.gallery && project.gallery[2] ? `
    <section class="pd-twoup">
      <div class="pd-twoup__image">
        <img src="${project.gallery[2]}" alt="${project.name} — detail" loading="lazy" data-parallax="0.06" />
      </div>
      <div class="pd-twoup__image">
        <img src="${project.gallery[3] || project.gallery[0]}" alt="${project.name} — detail" loading="lazy" data-parallax="0.06" />
      </div>
    </section>` : ''}

    ${project.gallery && project.gallery.length > 1 ? `
    <section class="pd-hscroll">
      <div class="pd-hscroll__head">
        <h3 class="pd-hscroll__title">Selected moments from the project</h3>
        <span class="pd-hscroll__hint">Drag · scroll →</span>
      </div>
      <div class="pd-hscroll__track-wrap" id="hScroll">
        <div class="pd-hscroll__track">
          ${(project.gallery.concat(project.gallery)).map((src, i) => `
            <div class="pd-hscroll__item">
              <img src="${src}" alt="${project.name} — frame ${i + 1}" loading="lazy" />
              <span class="pd-hscroll__caption">${project.name} · ${i + 1}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </section>` : ''}

    <section class="process-cta">
      <div class="process-cta__inner">
        <p class="section-eyebrow" style="color:var(--clay); margin-bottom:1.2rem;"><span style="color:var(--clay);">A new chapter</span></p>
        <h2 class="process-cta__title reveal" data-reveal="up">
          Let's create <em>your story</em>.
        </h2>
        <p class="process-cta__sub reveal" data-reveal="up">
          Every residence we design begins with a single conversation. Tell us about the space, the people, and the feeling you want to come home to.
        </p>
        <div class="reveal" data-reveal="up" style="display:inline-flex; gap:0.8rem; flex-wrap:wrap; justify-content:center;">
          <a href="contact.html" class="btn btn--light magnetic" data-magnetic="0.3">
            <span>Begin Your Design Journey</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
          <a href="https://wa.me/919821970058?text=Hello%2C%20I%27d%20like%20to%20discuss%20a%20project" target="_blank" rel="noopener" class="btn btn--ghost magnetic" data-magnetic="0.3">
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>

    <nav class="pd-nav" aria-label="Project pagination">
      <a href="project.html?slug=${prev.slug}" class="pd-nav__link pd-nav__link--prev">
        <span class="pd-nav__label">← Previous</span>
        <span class="pd-nav__name">${prev.name}</span>
        <span class="voice__meta">${prev.place} · ${prev.year}</span>
      </a>
      <a href="project.html?slug=${next.slug}" class="pd-nav__link pd-nav__link--next">
        <span class="pd-nav__label">Next →</span>
        <span class="pd-nav__name">${next.name}</span>
        <span class="voice__meta">${next.place} · ${next.year}</span>
      </a>
    </nav>
  `;

  /* ---------- INIT: parallax, reveals, before/after, magnetic ---------- */
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
    root.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    root.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
  }

  if (!reduced && !window.matchMedia('(pointer: coarse)').matches) {
    const imgs = root.querySelectorAll('[data-parallax]');
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
    // Magnetic
    root.querySelectorAll('.magnetic').forEach((el) => {
      const strength = Number(el.dataset.magnetic) || 0.3;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- BEFORE / AFTER SLIDER ---------- */
  const ba = document.getElementById('baViewer');
  const baAfter = document.getElementById('baAfter');
  const baHandle = document.getElementById('baHandle');
  if (ba && baAfter && baHandle) {
    let dragging = false;
    const setPos = (x) => {
      const r = ba.getBoundingClientRect();
      let pct = ((x - r.left) / r.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      baAfter.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      baHandle.style.left = pct + '%';
    };
    const onDown = (e) => { dragging = true; e.preventDefault(); };
    const onUp = () => { dragging = false; };
    const onMove = (e) => {
      if (!dragging) return;
      const x = (e.touches ? e.touches[0].clientX : e.clientX);
      setPos(x);
    };
    ba.addEventListener('mousedown', onDown);
    ba.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    // Initial center
    setPos(ba.getBoundingClientRect().left + ba.getBoundingClientRect().width / 2);
  }

})();
