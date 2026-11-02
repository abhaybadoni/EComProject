/**
 * ApnaBazar (अपना बाज़ार) — Frontend Application Controller
 * Tailored for Indian e-commerce shopping experience (INR ₹, COD, MRP & Discounts)
 */

import api from './api.js';

// Application State
const state = {
    filters: {
        search: '',
        category: 'all',
        minPrice: '',
        maxPrice: '',
        inStock: false,
        sort: 'newest',
        page: 1,
        limit: 12
    },
    categories: [],
    products: [],
    pagination: {
        total: 0,
        page: 1,
        limit: 12,
        totalPages: 1
    },
    selectedProduct: null,
    activeGalleryIndex: 0,
    selectedQuantity: 1,
    cartCount: 0,
    userPincode: '110001 (New Delhi)',
    isLoading: false
};

// Currency Formatter for Indian Rupees (₹)
const formatINR = (amount) => {
    return '₹' + Number(amount || 0).toLocaleString('en-IN', {
        maximumFractionDigits: 0
    });
};

// DOM References
const elements = {
    navSearchInput: document.getElementById('nav-search-input'),
    searchClearBtn: document.getElementById('search-clear-btn'),
    catBar: document.getElementById('category-bar'),
    sidebarCatList: document.getElementById('sidebar-cat-list'),
    priceRangeSlider: document.getElementById('price-slider'),
    priceMinInput: document.getElementById('price-min'),
    priceMaxInput: document.getElementById('price-max'),
    stockToggle: document.getElementById('stock-toggle'),
    sortSelect: document.getElementById('sort-select'),
    resetFiltersBtn: document.getElementById('reset-filters-btn'),
    activeFiltersBar: document.getElementById('active-filters-bar'),
    productsGrid: document.getElementById('products-grid'),
    resultsCount: document.getElementById('results-count'),
    paginationWrapper: document.getElementById('pagination-wrapper'),
    productModal: document.getElementById('product-modal'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalContent: document.getElementById('modal-content'),
    navCartCount: document.getElementById('nav-cart-count'),
    toastContainer: document.getElementById('toast-container'),
    pincodeDisplay: document.getElementById('pincode-display')
};

/**
 * Show a toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? '✓' : type === 'warning' ? '⚠️' : '🇮🇳';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

/**
 * Initialize Application
 */
async function init() {
    setupEventListeners();
    await loadCategories();
    parseUrlParams();
    await loadProducts();
    handleHashRouting();
}

/**
 * Load categories from backend API and render
 */
async function loadCategories() {
    try {
        const res = await api.getCategories();
        if (res.success) {
            state.categories = res.data;
            renderCategoryNavigation();
        }
    } catch (err) {
        console.error('Failed to load categories:', err);
    }
}

/**
 * Render category navigation chips (English + Hindi)
 */
function renderCategoryNavigation() {
    const totalCount = state.categories.reduce((sum, c) => sum + (c.product_count || 0), 0);

    // Quick Bar Chips
    const quickBarHtml = `
        <button class="cat-chip ${state.filters.category === 'all' ? 'active' : ''}" data-category="all">
            <span>All Products</span>
            <span class="cat-hi-sub">सभी सामान (${totalCount})</span>
        </button>
        ${state.categories.map(c => `
            <button class="cat-chip ${state.filters.category === c.slug ? 'active' : ''}" data-category="${c.slug}">
                <span>${c.name}</span>
                <span class="cat-hi-sub">${c.name_hi || ''} (${c.product_count})</span>
            </button>
        `).join('')}
    `;
    elements.catBar.innerHTML = quickBarHtml;

    // Sidebar Category Items
    const sidebarHtml = `
        <div class="filter-category-item ${state.filters.category === 'all' ? 'active' : ''}" data-category="all">
            <span>All Categories (सभी श्रेणियां)</span>
            <span style="font-weight:700;">${totalCount}</span>
        </div>
        ${state.categories.map(c => `
            <div class="filter-category-item ${state.filters.category === c.slug ? 'active' : ''}" data-category="${c.slug}">
                <span>${c.name}</span>
                <span style="font-weight:700;">${c.product_count}</span>
            </div>
        `).join('')}
    `;
    elements.sidebarCatList.innerHTML = sidebarHtml;
}

/**
 * Load products from API based on current filters
 */
async function loadProducts() {
    state.isLoading = true;
    renderLoadingSkeletons();

    try {
        const res = await api.getProducts(state.filters);
        if (res.success) {
            state.products = res.data;
            state.pagination = res.pagination;
            renderProductsGrid();
            renderActiveFilterPills();
            renderPagination();
            updateResultsCounter();
        }
    } catch (err) {
        console.error('Failed to load products:', err);
        elements.productsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-icon">⚠️</div>
                <h3 class="empty-title">Error Loading ApnaBazar Products</h3>
                <p class="empty-subtitle">${err.message}</p>
                <button class="btn-primary" onclick="window.location.reload()">Retry Loading</button>
            </div>
        `;
    } finally {
        state.isLoading = false;
    }
}

/**
 * Render loading skeleton placeholders
 */
function renderLoadingSkeletons() {
    const skeletons = Array(6).fill(0).map(() => `
        <div class="skeleton-card">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-text" style="width: 35%;"></div>
            <div class="skeleton skeleton-text" style="width: 85%;"></div>
            <div class="skeleton skeleton-text" style="width: 60%;"></div>
            <div class="skeleton skeleton-text" style="width: 40%; height: 24px; margin-top: 1rem;"></div>
        </div>
    `).join('');
    elements.productsGrid.innerHTML = skeletons;
}

/**
 * Render Product Grid
 */
function renderProductsGrid() {
    if (!state.products || state.products.length === 0) {
        elements.productsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-icon">🛍️</div>
                <h3 class="empty-title">No products found for this search</h3>
                <p class="empty-subtitle">Try adjusting your filters, searching for Ghee, Kesar, Banarasi Sarees, or boAt headphones.</p>
                <button class="btn-primary" id="empty-reset-btn">Reset All Filters</button>
            </div>
        `;
        document.getElementById('empty-reset-btn')?.addEventListener('click', resetAllFilters);
        return;
    }

    elements.productsGrid.innerHTML = state.products.map(p => {
        const stars = '★'.repeat(Math.round(p.rating || 5)) + '☆'.repeat(5 - Math.round(p.rating || 5));
        const formattedPrice = formatINR(p.price);
        const formattedMrp = p.mrp ? formatINR(p.mrp) : '';
        const discountPct = p.mrp ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;

        const stockBadge = p.stock > 15 
            ? `<span class="badge" style="background:#dcfce7; color:#166534;">In Stock (${p.stock})</span>`
            : p.stock > 0 
                ? `<span class="badge" style="background:#fef3c7; color:#92400e;">Only ${p.stock} left!</span>`
                : `<span class="badge" style="background:#fee2e2; color:#991b1b;">Out of Stock</span>`;

        return `
            <article class="product-card" data-product-id="${p.id}" tabindex="0" role="button" aria-label="${p.title}">
                <div class="card-image-wrap">
                    <img 
                        src="${p.image_url}" 
                        alt="${p.title}" 
                        class="card-image"
                        loading="lazy"
                        onerror="this.src='/images/products/kesar-hamper.svg'"
                    />
                    <div class="card-badge-container">
                        ${p.is_featured ? `<span class="badge badge-featured">★ FESTIVE DEAL</span>` : ''}
                        <span class="badge badge-category">${p.category_name}</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-brand">${p.brand || 'ApnaBazar'}</div>
                    <h3 class="card-title">${p.title}</h3>
                    <p class="card-desc">${p.description}</p>
                    <div class="card-rating">
                        <span class="stars">${stars}</span>
                        <strong>${p.rating}</strong>
                        <span>(${p.rating_count} reviews)</span>
                    </div>

                    <!-- Price & Discount -->
                    <div class="card-price-row">
                        <span class="card-price">${formattedPrice}</span>
                        ${formattedMrp ? `<span class="card-mrp">M.R.P: ${formattedMrp}</span>` : ''}
                        ${discountPct > 0 ? `<span class="card-discount">${discountPct}% OFF</span>` : ''}
                    </div>

                    <!-- Perks (COD & Free Delivery) -->
                    <div class="card-perks">
                        <span>🚚 Free Delivery</span>
                        <span>•</span>
                        <span>💵 Pay on Delivery</span>
                    </div>

                    <div class="card-footer">
                        <button class="card-action-btn view-details-btn" data-product-id="${p.id}">
                            View Details / Buy Now →
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

/**
 * Render active filter badges
 */
function renderActiveFilterPills() {
    const pills = [];

    if (state.filters.search) {
        pills.push(`
            <span class="active-filter-pill">
                Search: "${state.filters.search}"
                <button data-remove-filter="search">&times;</button>
            </span>
        `);
    }

    if (state.filters.category && state.filters.category !== 'all') {
        const cat = state.categories.find(c => c.slug === state.filters.category);
        pills.push(`
            <span class="active-filter-pill">
                Category: ${cat ? cat.name : state.filters.category}
                <button data-remove-filter="category">&times;</button>
            </span>
        `);
    }

    if (state.filters.minPrice || state.filters.maxPrice) {
        const min = state.filters.minPrice ? formatINR(state.filters.minPrice) : '₹0';
        const max = state.filters.maxPrice ? formatINR(state.filters.maxPrice) : '₹15,000+';
        pills.push(`
            <span class="active-filter-pill">
                Price: ${min} - ${max}
                <button data-remove-filter="price">&times;</button>
            </span>
        `);
    }

    if (state.filters.inStock) {
        pills.push(`
            <span class="active-filter-pill">
                In Stock Only
                <button data-remove-filter="inStock">&times;</button>
            </span>
        `);
    }

    elements.activeFiltersBar.innerHTML = pills.join('');
}

/**
 * Render pagination controls
 */
function renderPagination() {
    const { totalPages, page } = state.pagination;
    if (totalPages <= 1) {
        elements.paginationWrapper.innerHTML = '';
        return;
    }

    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
        buttons += `
            <button class="cat-chip ${i === page ? 'active' : ''}" data-page="${i}" style="min-width: 38px; justify-content: center;">
                ${i}
            </button>
        `;
    }

    elements.paginationWrapper.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 2rem;">
            <button class="cat-chip" data-page="${page - 1}" ${page <= 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
                ← Previous
            </button>
            ${buttons}
            <button class="cat-chip" data-page="${page + 1}" ${page >= totalPages ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
                Next →
            </button>
        </div>
    `;
}

/**
 * Update results counter text
 */
function updateResultsCounter() {
    const total = state.pagination.total;
    const count = state.products.length;
    elements.resultsCount.innerHTML = `Showing <strong>${count}</strong> of <strong>${total}</strong> products in ApnaBazar`;
}

/**
 * Open Product Details Modal/View
 */
async function openProductDetail(productId) {
    try {
        const res = await api.getProductById(productId);
        if (!res.success || !res.data) {
            showToast('Failed to load product details', 'warning');
            return;
        }

        state.selectedProduct = res.data;
        state.activeGalleryIndex = 0;
        state.selectedQuantity = 1;

        window.location.hash = `#/product/${productId}`;

        renderProductModal();
        elements.productModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    } catch (err) {
        console.error('Error fetching product detail:', err);
        showToast(err.message, 'warning');
    }
}

/**
 * Render Product Detail Modal Contents
 */
function renderProductModal() {
    const p = state.selectedProduct;
    if (!p) return;

    const stars = '★'.repeat(Math.round(p.rating || 5)) + '☆'.repeat(5 - Math.round(p.rating || 5));
    const formattedPrice = formatINR(p.price);
    const formattedMrp = p.mrp ? formatINR(p.mrp) : '';
    const discountPct = p.mrp ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
    const savingsAmount = p.mrp ? formatINR(p.mrp - p.price) : 0;

    const images = p.images && p.images.length > 0 ? p.images : [{ url: p.image_url, alt_text: p.title }];
    const mainImg = images[state.activeGalleryIndex] || images[0];

    const stockPill = p.stock > 15
        ? `<span class="badge" style="background:#dcfce7; color:#166534; font-size:0.8rem;">● In Stock (${p.stock} units in warehouse)</span>`
        : p.stock > 0
            ? `<span class="badge" style="background:#fef3c7; color:#92400e; font-size:0.8rem;">▲ Hurry! Only ${p.stock} left in stock</span>`
            : `<span class="badge" style="background:#fee2e2; color:#991b1b; font-size:0.8rem;">✕ Currently Unavailable</span>`;

    elements.modalContent.innerHTML = `
        <div class="detail-layout">
            <!-- Left: Multi-Image Gallery -->
            <div class="detail-gallery">
                <div class="detail-main-img-wrap">
                    <img 
                        src="${mainImg.url}" 
                        alt="${mainImg.alt_text || p.title}" 
                        class="detail-main-img" 
                        id="detail-main-image"
                    />
                </div>
                ${images.length > 1 ? `
                    <div class="detail-thumb-strip">
                        ${images.map((img, idx) => `
                            <img 
                                src="${img.url}" 
                                alt="Thumbnail ${idx + 1}" 
                                class="detail-thumb ${idx === state.activeGalleryIndex ? 'active' : ''}" 
                                data-gallery-idx="${idx}"
                            />
                        `).join('')}
                    </div>
                ` : ''}

                <!-- Trust Badges -->
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:0.85rem; font-size:0.8rem; color:#475569; display:flex; flex-direction:column; gap:0.4rem;">
                    <div>🛡️ <strong>100% Original Guarantee:</strong> Sourced directly from certified artisans & brands.</div>
                    <div>🇮🇳 <strong>Swadeshi Quality:</strong> Handpicked across Indian states.</div>
                    <div>🔄 <strong>7-Day Replacement Policy:</strong> No questions asked return at doorstep.</div>
                </div>
            </div>

            <!-- Right: Product Info & Actions -->
            <div class="detail-info">
                <div class="detail-breadcrumbs">
                    <a href="#/" id="breadcrumb-home">ApnaBazar</a> &gt; 
                    <span>${p.category_name}</span> &gt; 
                    <span>${p.brand || 'Artisan'}</span>
                </div>

                <h1 class="detail-title">${p.title}</h1>

                <div class="detail-meta-row">
                    <span class="stars" style="font-size: 1.1rem;">${stars}</span>
                    <strong style="color: #0f172a;">${p.rating}</strong>
                    <span style="color: #64748b;">(${p.rating_count} verified Indian buyers)</span>
                    <span style="color: #cbd5e1;">|</span>
                    <span style="font-size: 0.8rem; color: #64748b; font-family: monospace;">SKU: ${p.sku || 'AB-N/A'}</span>
                </div>

                <!-- Price Box -->
                <div class="detail-price-box">
                    <div class="detail-price-main">
                        <span class="detail-price">${formattedPrice}</span>
                        ${formattedMrp ? `<span class="detail-mrp">${formattedMrp}</span>` : ''}
                        ${discountPct > 0 ? `<span class="detail-save-badge">${discountPct}% OFF</span>` : ''}
                    </div>
                    ${savingsAmount ? `<div style="font-size:0.85rem; color:#16a34a; font-weight:700; margin-top:0.25rem;">You Save: ${savingsAmount} on this order!</div>` : ''}
                    <div class="tax-text">Inclusive of all taxes (GST) • Free Express Shipping</div>
                    <div style="margin-top:0.6rem;">${stockPill}</div>
                </div>

                <!-- Bank & Festive Offers Box -->
                <div class="bank-offers-box">
                    <div class="bank-offers-title">🏷️ ApnaBazar Maha Savings Offers</div>
                    <div class="bank-offer-item">• <strong>Bank Offer:</strong> Flat 10% Instant Discount on SBI, HDFC & RuPay Cards.</div>
                    <div class="bank-offer-item">• <strong>UPI Cashback:</strong> Extra ₹50 cashback on Google Pay / PhonePe / Paytm UPI.</div>
                    <div class="bank-offer-item">• <strong>COD Available:</strong> Pay with cash or UPI QR at delivery time.</div>
                </div>

                <div class="detail-desc-title">Product Details & Overview</div>
                <p class="detail-desc">${p.description}</p>

                <!-- Specifications Table -->
                <div class="detail-specs">
                    <div class="spec-row">
                        <span class="spec-key">Category</span>
                        <span class="spec-val">${p.category_name} (${p.category_name_hi || ''})</span>
                    </div>
                    <div class="spec-row">
                        <span class="spec-key">Brand / Maker</span>
                        <span class="spec-val">${p.brand || 'ApnaBazar Selected'}</span>
                    </div>
                    <div class="spec-row">
                        <span class="spec-key">Delivery Time</span>
                        <span class="spec-val">Delivers to ${state.userPincode} in 2-4 days</span>
                    </div>
                    <div class="spec-row">
                        <span class="spec-key">Payment Options</span>
                        <span class="spec-val">Cash on Delivery (COD), UPI, Net Banking, Credit/Debit Cards</span>
                    </div>
                </div>

                <!-- Action buttons -->
                <div class="detail-actions">
                    <div class="qty-control">
                        <button class="qty-btn" id="qty-minus">-</button>
                        <span class="qty-display" id="qty-display">${state.selectedQuantity}</span>
                        <button class="qty-btn" id="qty-plus">+</button>
                    </div>
                    <button class="btn-add-cart" id="modal-add-cart-btn" ${p.stock === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                        🛒 Add to Bag (${formattedPrice})
                    </button>
                </div>
            </div>
        </div>
    `;

    // Gallery Thumbnails Click Handler
    elements.modalContent.querySelectorAll('.detail-thumb').forEach(thumb => {
        thumb.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.dataset.galleryIdx, 10);
            state.activeGalleryIndex = idx;
            const targetImg = images[idx];
            const mainImgEl = document.getElementById('detail-main-image');
            if (mainImgEl && targetImg) {
                mainImgEl.src = targetImg.url;
            }
            elements.modalContent.querySelectorAll('.detail-thumb').forEach((t, i) => {
                t.classList.toggle('active', i === idx);
            });
        });
    });

    // Quantity selector buttons
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const qtyDisplay = document.getElementById('qty-display');

    qtyMinus?.addEventListener('click', () => {
        if (state.selectedQuantity > 1) {
            state.selectedQuantity--;
            qtyDisplay.textContent = state.selectedQuantity;
        }
    });

    qtyPlus?.addEventListener('click', () => {
        if (state.selectedQuantity < p.stock) {
            state.selectedQuantity++;
            qtyDisplay.textContent = state.selectedQuantity;
        } else {
            showToast(`Maximum stock limit (${p.stock}) reached`, 'warning');
        }
    });

    // Add to cart preview button
    document.getElementById('modal-add-cart-btn')?.addEventListener('click', () => {
        state.cartCount += state.selectedQuantity;
        elements.navCartCount.textContent = state.cartCount;
        showToast(`Added ${state.selectedQuantity}x "${p.title}" to your ApnaBazar Bag!`, 'success');
    });

    document.getElementById('breadcrumb-home')?.addEventListener('click', (e) => {
        e.preventDefault();
        closeProductDetail();
    });
}

/**
 * Close Product Details Modal
 */
function closeProductDetail() {
    elements.productModal.classList.remove('open');
    document.body.style.overflow = '';
    state.selectedProduct = null;
    if (window.location.hash.startsWith('#/product/')) {
        history.pushState(null, null, ' ');
    }
}

/**
 * Handle URL hash changes
 */
function handleHashRouting() {
    const hash = window.location.hash;
    const match = hash.match(/^#\/product\/(\d+)$/);
    if (match) {
        const id = parseInt(match[1], 10);
        openProductDetail(id);
    }
}

/**
 * Reset all active filters
 */
function resetAllFilters() {
    state.filters.search = '';
    state.filters.category = 'all';
    state.filters.minPrice = '';
    state.filters.maxPrice = '';
    state.filters.inStock = false;
    state.filters.sort = 'newest';
    state.filters.page = 1;

    elements.navSearchInput.value = '';
    elements.searchClearBtn.style.display = 'none';
    elements.priceMinInput.value = '';
    elements.priceMaxInput.value = '';
    elements.priceRangeSlider.value = 15000;
    elements.stockToggle.checked = false;
    elements.sortSelect.value = 'newest';

    renderCategoryNavigation();
    loadProducts();
}

/**
 * Parse initial URL search params
 */
function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('search')) state.filters.search = params.get('search');
    if (params.has('category')) state.filters.category = params.get('category');
    if (params.has('sort')) state.filters.sort = params.get('sort');

    if (state.filters.search) {
        elements.navSearchInput.value = state.filters.search;
        elements.searchClearBtn.style.display = 'block';
    }
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Search with debounce
    let searchDebounceTimer;
    elements.navSearchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        elements.searchClearBtn.style.display = val ? 'block' : 'none';

        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
            state.filters.search = val;
            state.filters.page = 1;
            loadProducts();
        }, 300);
    });

    elements.searchClearBtn.addEventListener('click', () => {
        elements.navSearchInput.value = '';
        elements.searchClearBtn.style.display = 'none';
        state.filters.search = '';
        state.filters.page = 1;
        loadProducts();
    });

    // Category Clicks
    const handleCategoryClick = (categorySlug) => {
        state.filters.category = categorySlug;
        state.filters.page = 1;
        renderCategoryNavigation();
        loadProducts();
    };

    elements.catBar.addEventListener('click', (e) => {
        const chip = e.target.closest('.cat-chip');
        if (chip) handleCategoryClick(chip.dataset.category);
    });

    elements.sidebarCatList.addEventListener('click', (e) => {
        const item = e.target.closest('.filter-category-item');
        if (item) handleCategoryClick(item.dataset.category);
    });

    // Price Slider & Inputs
    elements.priceRangeSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        elements.priceMaxInput.value = val;
        state.filters.maxPrice = val;
        state.filters.page = 1;
        loadProducts();
    });

    elements.priceMinInput.addEventListener('change', (e) => {
        state.filters.minPrice = e.target.value;
        state.filters.page = 1;
        loadProducts();
    });

    elements.priceMaxInput.addEventListener('change', (e) => {
        state.filters.maxPrice = e.target.value;
        elements.priceRangeSlider.value = e.target.value || 15000;
        state.filters.page = 1;
        loadProducts();
    });

    // Quick Price Filter Buttons
    document.querySelectorAll('.price-quick-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const max = e.currentTarget.dataset.maxPrice;
            state.filters.maxPrice = max;
            elements.priceMaxInput.value = max;
            elements.priceRangeSlider.value = max || 15000;
            state.filters.page = 1;
            loadProducts();
        });
    });

    // In-Stock Checkbox
    elements.stockToggle.addEventListener('change', (e) => {
        state.filters.inStock = e.target.checked;
        state.filters.page = 1;
        loadProducts();
    });

    // Sort Select
    elements.sortSelect.addEventListener('change', (e) => {
        state.filters.sort = e.target.value;
        state.filters.page = 1;
        loadProducts();
    });

    // Reset button
    elements.resetFiltersBtn.addEventListener('click', resetAllFilters);

    // Active Filters Pill Removal
    elements.activeFiltersBar.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-remove-filter]');
        if (!btn) return;
        const filterType = btn.dataset.removeFilter;

        if (filterType === 'search') {
            state.filters.search = '';
            elements.navSearchInput.value = '';
            elements.searchClearBtn.style.display = 'none';
        } else if (filterType === 'category') {
            state.filters.category = 'all';
            renderCategoryNavigation();
        } else if (filterType === 'price') {
            state.filters.minPrice = '';
            state.filters.maxPrice = '';
            elements.priceMinInput.value = '';
            elements.priceMaxInput.value = '';
            elements.priceRangeSlider.value = 15000;
        } else if (filterType === 'inStock') {
            state.filters.inStock = false;
            elements.stockToggle.checked = false;
        }
        state.filters.page = 1;
        loadProducts();
    });

    // Product Card Click -> Open Detail
    elements.productsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (card) {
            const id = parseInt(card.dataset.productId, 10);
            if (id) openProductDetail(id);
        }
    });

    // Pagination Click
    elements.paginationWrapper.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-page]');
        if (btn && !btn.disabled) {
            const page = parseInt(btn.dataset.page, 10);
            if (page && page !== state.filters.page) {
                state.filters.page = page;
                loadProducts();
                window.scrollTo({ top: 400, behavior: 'smooth' });
            }
        }
    });

    // Modal close & keyboard
    elements.modalCloseBtn.addEventListener('click', closeProductDetail);
    elements.productModal.addEventListener('click', (e) => {
        if (e.target === elements.productModal) closeProductDetail();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.productModal.classList.contains('open')) {
            closeProductDetail();
        }
    });

    window.addEventListener('hashchange', handleHashRouting);

    // Pincode change simulation
    elements.pincodeDisplay?.addEventListener('click', () => {
        const newPin = prompt('Enter delivery pincode (e.g., 400001, 560001, 700001):', '400001');
        if (newPin && newPin.trim()) {
            state.userPincode = `${newPin.trim()}`;
            elements.pincodeDisplay.textContent = state.userPincode;
            showToast(`Delivery location updated to ${state.userPincode}!`, 'success');
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
