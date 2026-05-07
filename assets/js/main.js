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
        status.textContent = 'Thanks. Your request has been sent to the MKU & MKS sales desk for follow-up.';
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
  const loginShell = document.querySelector('[data-login-shell]');
  const loggedOut = loginShell?.querySelector('[data-auth-stage="loggedout"]');
  const loggedIn = document.querySelector('[data-auth-stage="loggedin"]');
  if (!demoButton || !loginShell || !loggedIn) return;

  demoButton.addEventListener('click', () => {
    if (status) {
      status.textContent = 'Signed in successfully. Your account dashboard is ready below.';
    }
    if (loggedOut) loggedOut.classList.add('hidden');
    loggedIn.classList.remove('hidden');
    setTimeout(() => {
      loggedIn.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  });
}

function setupQuickOrders() {
  const orderButtons = document.querySelectorAll('[data-order-item]');
  const quickOrderForms = document.querySelectorAll('[data-quick-order-form]');

  const fillForms = ({ company, product, quantity, notes }) => {
    quickOrderForms.forEach(form => {
      const companyField = form.querySelector('[data-order-company-field]');
      const productField = form.querySelector('[data-order-product-field]');
      const qtyField = form.querySelector('[data-order-qty-field]');
      const notesField = form.querySelector('[data-order-notes-field]');
      const status = form.querySelector('[data-order-status]');

      if (companyField && company) companyField.value = company;
      if (productField && product) productField.value = product;
      if (qtyField && quantity) qtyField.value = quantity;
      if (notesField && notes) notesField.value = notes;
      if (status) status.textContent = '';
    });
  };

  orderButtons.forEach(button => {
    button.addEventListener('click', () => {
      fillForms({
        company: button.dataset.orderCompany || 'MKU',
        product: button.dataset.orderProduct || '',
        quantity: button.dataset.orderQty || '4 cartons',
        notes: button.dataset.orderNotes || 'Please confirm stock and next available delivery slot.'
      });

      const desk = document.getElementById('order-desk') || document.getElementById('account-dashboard');
      if (desk) {
        desk.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  quickOrderForms.forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const companyField = form.querySelector('[data-order-company-field]');
      const productField = form.querySelector('[data-order-product-field]');
      const qtyField = form.querySelector('[data-order-qty-field]');
      const status = form.querySelector('[data-order-status]');
      const orderRef = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const company = companyField?.value || 'MKU';
      const product = productField?.value || 'selected item';
      const quantity = qtyField?.value || 'requested quantity';

      if (status) {
        status.textContent = `${orderRef} created for ${company}: ${product} (${quantity}). Sales has the request and will confirm availability.`;
      }
    });
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
  setupQuickOrders();
  setupProductFilters();
  setupHashScroll();
});
