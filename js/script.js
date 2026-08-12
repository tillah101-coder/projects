
document.addEventListener('DOMContentLoaded', () => {

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const cartEmptyEl = document.getElementById('cartEmpty');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartCountEl = document.getElementById('cartCount');

  function formatPrice(value) {
    return '$' + value.toFixed(2);
  }

  function renderCart() {
    cartItemsEl.innerHTML = '';

    if (cart.length === 0) {
      cartEmptyEl.classList.remove('d-none');
    } else {
      cartEmptyEl.classList.add('d-none');
      cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center mc-cart-item';
        li.innerHTML =
          '<div>' +
            '<div class="fw-semibold">' + item.title + '</div>' +
            '<div class="text-muted small">' + item.author + '</div>' +
          '</div>' +
          '<div class="d-flex align-items-center gap-3">' +
            '<span class="mc-mono">' + formatPrice(item.price) + '</span>' +
            '<button type="button" class="btn-close" aria-label="Remove ' + item.title + ' from basket" data-index="' + index + '"></button>' +
          '</div>';
        cartItemsEl.appendChild(li);
      });
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalEl.textContent = formatPrice(total);
    cartCountEl.textContent = String(cart.length);
    cartCountEl.classList.toggle('d-none', cart.length === 0);
  }

  document.querySelectorAll('.mc-add-to-cart').forEach((btn) => {
    btn.addEventListener('click', () => {
      cart.push({
        title: btn.dataset.title,
        author: btn.dataset.author,
        price: parseFloat(btn.dataset.price)
      });
      renderCart();

      const original = btn.textContent;
      btn.textContent = 'Added ✓';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 1000);
    });
  });

  cartItemsEl.addEventListener('click', (event) => {
    const removeBtn = event.target.closest('button[data-index]');
    if (!removeBtn) return;
    cart.splice(Number(removeBtn.dataset.index), 1);
    renderCart();
  });

  const reserveBtn = document.getElementById('reserveBtn');
  const reserveToastEl = document.getElementById('reserveToast');
  if (reserveBtn && reserveToastEl && window.bootstrap) {
    const toast = new bootstrap.Toast(reserveToastEl);
    reserveBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      toast.show();
      cart.length = 0;
      renderCart();
      const cartOffcanvasEl = document.getElementById('cartOffcanvas');
      const instance = bootstrap.Offcanvas.getInstance(cartOffcanvasEl);
      if (instance) instance.hide();
    });
  }

  renderCart();

  const spines = document.querySelectorAll('.mc-spine');
  const cards = document.querySelectorAll('.mc-catalog-card');
  const searchInput = document.getElementById('bookSearch');
  const resultsMeta = document.getElementById('resultsMeta');
  const noResultsEl = document.getElementById('noResults');
  let activeFilter = 'all';

  function applyFilters() {
    const query = (searchInput && searchInput.value ? searchInput.value : '').trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const matchesFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
      const matchesSearch = !query ||
        card.dataset.title.toLowerCase().includes(query) ||
        card.dataset.author.toLowerCase().includes(query);
      const shouldShow = matchesFilter && matchesSearch;
      card.closest('.mc-catalog-col').classList.toggle('d-none', !shouldShow);
      if (shouldShow) visibleCount += 1;
    });

    if (resultsMeta) {
      resultsMeta.textContent = visibleCount + (visibleCount === 1 ? ' title' : ' titles');
    }
    if (noResultsEl) {
      noResultsEl.classList.toggle('d-none', visibleCount !== 0);
    }
  }

  spines.forEach((spine) => {
    spine.addEventListener('click', () => {
      activeFilter = spine.dataset.filter;
      spines.forEach((s) => s.setAttribute('aria-pressed', s === spine ? 'true' : 'false'));
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  applyFilters();

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const msg = document.getElementById('newsletterMsg');
      if (msg) {
        msg.textContent = 'Thank you — check your inbox to confirm.';
        msg.classList.remove('d-none');
      }
      newsletterForm.reset();
    });
  }

});
