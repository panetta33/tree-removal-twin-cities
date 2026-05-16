/* Tree Removal Twin Cities — site script
   Keep this small and beginner-friendly */

(function () {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Close nav when a link is clicked (mobile)
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Set current year in footer(s)
  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Form submission via Formspree (no page reload)
  // To activate: replace YOUR_FORMSPREE_ID with the ID from your Formspree form
  // Sign up free at https://formspree.io — get the endpoint URL
  document.querySelectorAll('form[data-lead-form]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      const endpoint = form.getAttribute('action');
      // If the endpoint still has the placeholder, let the browser submit normally
      // (which will cause an error and let the owner know it's not wired up yet)
      if (!endpoint || endpoint.includes('YOUR_FORMSPREE_ID')) {
        e.preventDefault();
        showFormMessage(form, 'Form not yet connected. Edit script.js + the form action URL to wire up Formspree.', 'error');
        return;
      }
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      try {
        const data = new FormData(form);
        const res = await fetch(endpoint, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.reset();
          showFormMessage(form, "Thanks! We received your request and will reach out within 1 business hour during business hours. For emergencies, please call us directly.", 'success');
        } else {
          const body = await res.json().catch(() => ({}));
          const msg = (body.errors && body.errors.map(x => x.message).join(', ')) || 'Something went wrong. Please call us instead.';
          showFormMessage(form, msg, 'error');
        }
      } catch (err) {
        showFormMessage(form, 'Network error. Please call us directly or try again.', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  });

  function showFormMessage(form, text, type) {
    let msg = form.querySelector('.form-message');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'form-message';
      form.prepend(msg);
    }
    msg.textContent = text;
    msg.className = 'form-message ' + (type === 'success' ? 'success-msg' : 'error-msg');
    msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
})();
