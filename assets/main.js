const sitePath = window.location.pathname.split('/').pop() || 'index.html';

function setActiveNav() {
  document.querySelectorAll('[data-nav-link]').forEach(link => {
    const href = link.getAttribute('href');
    const linkPath = href.split('/').pop();
    if (linkPath === sitePath || (sitePath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function setupMobileMenu() {
  const toggle = document.querySelector('[data-mobile-toggle]');
  const panel = document.querySelector('[data-mobile-panel]');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  panel.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      panel.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function setupFooterYear() {
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

function setupDemoForms() {
  document.querySelectorAll('[data-demo-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const status = form.querySelector('[data-form-status]');
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      if (status) {
        status.textContent = 'Thanks — this static demo captured your request locally. We can connect this form to Firebase next.';
      }
      form.reset();
      setTimeout(() => {
        if (submitButton) submitButton.disabled = false;
      }, 900);
    });
  });
}

function setupDemoLogin() {
  const demoButton = document.querySelector('[data-demo-login]');
  const status = document.querySelector('[data-login-status]');
  if (!demoButton || !status) return;

  demoButton.addEventListener('click', () => {
    status.textContent = 'Portal demo mode enabled. Next step: connect Firebase Auth and customer-specific pricing visibility.';
  });
}

function setupProductFilters() {
  const buttons = document.querySelectorAll('[data-filter]');
  const searchInput = document.querySelector('[data-product-search]');
  const cards = document.querySelectorAll('[data-product-grid] .product-card');
  const emptyState = document.querySelector('[data-empty-state]');
  if (!buttons.length || !cards.length) return;

  let activeFilter = 'all';

  const runFilter = () => {
    const query = (searchInput?.value || '').trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
      const matchesFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
      const haystack = (card.dataset.search || '').toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const show = matchesFilter && matchesQuery;
      card.classList.toggle('hidden', !show);
      if (show) visibleCount += 1;
    });

    if (emptyState) {
      emptyState.classList.toggle('hidden', visibleCount !== 0);
    }
  };

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      buttons.forEach(btn => btn.classList.remove('primary'));
      button.classList.add('primary');
      runFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', runFilter);
  }
}

function setupHashScroll() {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  setupMobileMenu();
  setupFooterYear();
  setupDemoForms();
  setupDemoLogin();
  setupProductFilters();
  setupHashScroll();
});
