/* =====================================================================
   THE INSIDERS' STORY — Contact page form handler
   ===================================================================== */

(() => {
  'use strict';

  const form = document.getElementById('contactPageForm');
  const note = document.getElementById('contactPageNote');
  if (!form || !note) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const msg  = (data.get('message') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();

    if (!name || !email || !msg) {
      note.textContent = 'Please complete the required fields so we can reply properly.';
      return;
    }

    const first = name.split(' ')[0];
    note.textContent = `Thank you, ${first}. Tanya will read this personally and reply within two working days.`;
    form.reset();
  });

})();
