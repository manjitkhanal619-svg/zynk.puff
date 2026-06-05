// ===== CART STATE =====
let cart = [];

// ===== SMOKE EFFECT =====
function createSmoke() {
  const container = document.getElementById('smokeContainer');
  if (!container) return;
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const smoke = document.createElement('div');
      smoke.className = 'smoke-puff';
      smoke.style.left = Math.random() * 100 + 'vw';
      smoke.style.animationDuration = (8 + Math.random() * 10) + 's';
      smoke.style.animationDelay = (Math.random() * 5) + 's';
      smoke.style.width = smoke.style.height = (60 + Math.random() * 120) + 'px';
      smoke.style.opacity = (0.03 + Math.random() * 0.06).toString();
      container.appendChild(smoke);
      setTimeout(() => smoke.remove(), 20000);
    }, i * 1200);
  }
}
setInterval(createSmoke, 6000);
createSmoke();

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// ===== MOBILE MENU =====
function toggleMenu() {
  const links = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  links.classList.toggle('open');
  hamburger.classList.toggle('open');
}

// ===== CART =====
function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
}

function addToCart(productId, flavor) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const selectedFlavor = flavor || product.flavors[0];
  const existingIndex = cart.findIndex(item => item.id === productId && item.flavor === selectedFlavor);
  if (existingIndex > -1) {
    cart[existingIndex].qty++;
  } else {
    cart.push({ ...product, flavor: selectedFlavor, qty: 1 });
  }
  updateCartUI();
  showAddedToast(product.shortName);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => el.textContent = count);
  const cartItemsEl = document.getElementById('cartItems');
  const cartFooterEl = document.getElementById('cartFooter');
  const cartTotalEl = document.getElementById('cartTotal');
  if (!cartItemsEl) return;
  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<div class="cart-empty"><svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg><p>Your cart is empty</p></div>`;
    if (cartFooterEl) cartFooterEl.style.display = 'none';
  } else {
    cartItemsEl.innerHTML = cart.map((item, i) => `
      <div class="cart-item">
        <div class="cart-item-img">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : `<div class="cart-item-placeholder">✦</div>`}
        </div>
        <div class="cart-item-info">
          <p class="cart-item-name">${item.shortName}</p>
          <p class="cart-item-flavor">${item.flavor}</p>
          <p class="cart-item-price">NPR ${item.price.toLocaleString()} × ${item.qty}</p>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
      </div>
    `).join('');
    if (cartFooterEl) cartFooterEl.style.display = 'block';
    if (cartTotalEl) cartTotalEl.textContent = `NPR ${total.toLocaleString()}`;
  }
}

function showAddedToast(name) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✦</span> ${name} added to cart!`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 2500);
}

// ===== PRODUCT CARD BUILDER =====
function buildProductCard(product, isFeatured = false) {
  const flavorList = product.flavors.slice(0, 4).map(f => `<span class="flavor-tag">${f}</span>`).join('');
  const extraFlavors = product.flavors.length > 4 ? `<span class="flavor-more">+${product.flavors.length - 4} more</span>` : '';
  const imgHTML = product.image
    ? `<img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" />`
    : `<div class="product-img-placeholder"><div class="placeholder-icon">✦</div><p>Coming Soon</p></div>`;
  const badge = product.badge ? `<div class="product-badge">${product.badge}</div>` : '';

  return `
    <div class="product-card" data-category="${product.category}" data-id="${product.id}">
      ${badge}
      <a href="product.html?id=${product.id}" class="product-img-link">
        <div class="product-img-wrap">
          ${imgHTML}
          <div class="product-img-overlay">
            <span>View Details</span>
          </div>
        </div>
      </a>
      <div class="product-info">
        <div class="product-puffs">${product.puffs} Puffs</div>
        <a href="product.html?id=${product.id}" class="product-name-link">
          <h3 class="product-name">${product.shortName}</h3>
        </a>
        <div class="product-price">NPR ${product.price.toLocaleString()}</div>
        <div class="product-flavors">
          ${flavorList}${extraFlavors}
        </div>
        <div class="product-flavor-select">
          <select class="flavor-select" id="flavor-${product.id}">
            ${product.flavors.map(f => `<option value="${f}">${f}</option>`).join('')}
          </select>
        </div>
        <div class="product-actions">
          <button class="btn-cart" onclick="addToCart(${product.id}, document.getElementById('flavor-${product.id}').value)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            Add to Cart
          </button>
          <button class="btn-buy" onclick="buyNow(${product.id})">Buy Now</button>
        </div>
      </div>
    </div>
  `;
}

function buyNow(productId) {
  showBuyError();
}

function showBuyError() {
  const existing = document.querySelector('.buy-error-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'buy-error-toast';
  toast.innerHTML = `<span>⚠️</span> Network Error. Please try again later.`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3500);
}

// ===== RENDER FEATURED =====
function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const featured = PRODUCTS.filter(p => p.image).slice(0, 5);
  grid.innerHTML = featured.map(p => buildProductCard(p)).join('');
  animateCards();
}

// ===== RENDER SHOP =====
function renderShop(filter = 'all') {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  grid.innerHTML = filtered.map(p => buildProductCard(p)).join('');
  animateCards();
}

// ===== SHOP FILTERS =====
function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderShop(btn.dataset.filter);
    });
  });
}

// ===== PRODUCT DETAIL PAGE =====
function renderProductDetail() {
  const detail = document.getElementById('productDetail');
  if (!detail) return;
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) { detail.innerHTML = '<p style="color:#c9a96e;text-align:center;padding:4rem">Product not found.</p>'; return; }
  document.title = `${product.name} — Chilam`;
  const breadcrumb = document.getElementById('breadcrumbName');
  if (breadcrumb) breadcrumb.textContent = product.shortName;
  const imgHTML = product.image
    ? `<img src="${product.image}" alt="${product.name}" class="detail-img" />`
    : `<div class="detail-img-placeholder"><div class="placeholder-icon-lg">✦</div><p>Image Coming Soon</p></div>`;
  detail.innerHTML = `
    <div class="detail-left">
      <div class="detail-img-wrap">${imgHTML}</div>
    </div>
    <div class="detail-right">
      ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
      <div class="detail-puffs">${product.puffs} Puffs</div>
      <h1 class="detail-name">${product.name}</h1>
      <div class="detail-price">NPR ${product.price.toLocaleString()}</div>
      <p class="detail-desc">${product.description}</p>
      <div class="detail-features">
        ${product.features.map(f => `<div class="detail-feature"><span>✦</span>${f}</div>`).join('')}
      </div>
      <div class="detail-flavors-section">
        <h4>Available Flavors</h4>
        <div class="detail-flavors-list">
          ${product.flavors.map(f => `<span class="flavor-tag">${f}</span>`).join('')}
        </div>
      </div>
      <div class="detail-select-wrap">
        <label>Select Flavor</label>
        <select class="flavor-select detail-flavor-select" id="flavor-${product.id}">
          ${product.flavors.map(f => `<option value="${f}">${f}</option>`).join('')}
        </select>
      </div>
      <div class="detail-actions">
        <button class="btn-cart detail-btn" onclick="addToCart(${product.id}, document.getElementById('flavor-${product.id}').value)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          Add to Cart
        </button>
        <button class="btn-buy detail-btn" onclick="buyNow(${product.id})">Buy Now</button>
      </div>
    </div>
  `;
  // Related
  const relatedGrid = document.getElementById('relatedGrid');
  if (relatedGrid) {
    const related = PRODUCTS.filter(p => p.id !== id && p.category === product.category).slice(0, 4);
    const fallback = related.length < 4 ? PRODUCTS.filter(p => p.id !== id && !related.includes(p)).slice(0, 4 - related.length) : [];
    relatedGrid.innerHTML = [...related, ...fallback].map(p => buildProductCard(p)).join('');
  }
}

// ===== ANIMATE CARDS =====
function animateCards() {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 80);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderFeatured();
  renderShop();
  initFilters();
  renderProductDetail();
});
