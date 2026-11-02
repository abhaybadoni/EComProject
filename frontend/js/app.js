/**
 * Aurora Market — Main Frontend Application Logic
 * Manages State, UI rendering, event listeners, URL routing, and API interaction
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
    isLoading: false
};

// DOM Element References
const elements = {
    // Search
    navSearchInput: document.getElementById('nav-search-input'),
    searchClearBtn: document.getElementById('search-clear-btn'),
    
    // Categories
    catBar: document.getElementById('category-bar'),
    sidebarCatList: document.getElementById('sidebar-cat-list'),
    
    // Filters & Sorting
    priceRangeSlider: document.getElementById('price-slider'),
    priceMinInput: document.getElementById('price-min'),
    priceMaxInput: document.getElementById('price-max'),
    stockToggle: document.getElementById('stock-toggle'),
    sortSelect: document.getElementById('sort-select'),
    resetFiltersBtn: document.getElementById('reset-filters-btn'),
    activeFiltersBar: document.getElementById('active-filters-bar'),
    
    // Mobile Drawer
    mobileFilterBtn: document.getElementById('mobile-filter-btn'),
    mobileFilterClose: document.getElementById('mobile-filter-close'),
    filterSidebar: document.getElementById('filter-sidebar'),
    
    // Products Grid & Counter
    productsGrid: document.getElementById('products-grid'),
    resultsCount: document.getElementById('results-count'),
    paginationWrapper: document.getElementById('pagination-wrapper'),
    
    // Product Detail Modal
    productModal: document.getElementById('product-modal'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalContent: document.getElementById('modal-content'),
    
    // Cart & Toast
    navCartCount: document.getElementById('nav-cart-count'),
    toastContainer: document.getElementById('toast-container')
};

/**
 * Show a toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? '✓' : 'ℹ';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
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
 * Load categories from backend API and populate UI
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
 * Render category navigation buttons in both quick-bar and sidebar
 */
function renderCategoryNavigation() {
    const totalCount = state.categories.reduce((sum, c) => sum + (c.product_count || 0), 0);

    // Render Quick Bar
    const quickBarHtml = `
        <button class="cat-chip ${state.filters.category === 'all' ? 'active' : ''}" data-category="all">
            All Products <span class="cat-count">(${totalCount})</span>
        </button>
        ${state.categories.map(c => `
            <button class="cat-chip ${state.filters.category === c.slug ? 'active' : ''}" data-category="${c.slug}">
                ${c.name} <span class="cat-count">(${c.product_count})</span>
            </button>
        `).join('')}
    `;
    elements.catBar.innerHTML = quickBarHtml;

    // Render Sidebar list
    const sidebarHtml = `
        <div class="filter-category-item ${state.filters.category === 'all' ? 'active' : ''}" data-category="all">
            <span>All Categories</span>
            <span class="cat-count">${totalCount}</span>
        </div>
        ${state.categories.map(c => `
            <div class="filter-category-item ${state.filters.category === c.slug ? 'active' : ''}" data-category="${c.slug}">
                <span>${c.name}</span>
                <span class="cat-count">${c.product_count}</span>
            </div>
        `).join('')}
    `;
    elements.sidebarCatList.innerHTML = sidebarHtml;
}

/**
 * Load products from API based on current filter state
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
                <h3 class="empty-title">Error Loading Products</h3>
                <p class="empty-subtitle">${err.message}</p>
                <button class="btn-primary" onclick="window.location.reload()">Retry</button>
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
            <div class="skeleton skeleton-text" style="width: 40%;"></div>
            <div class="skeleton skeleton-text" style="width: 80%;"></div>
            <div class="skeleton skeleton-text" style="width: 60%;"></div>
            <div class="skeleton skeleton-text" style="width: 30%; height: 22px; margin-top: 1.25rem;"></div>
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
                <div class="empty-icon">🔍</div>
                <h3 class="empty-title">No products match your criteria</h3>
                <p class="empty-subtitle">Try adjusting your search query, clearing filters, or browsing other categories.</p>
                <button class="btn-primary" id="empty-reset-btn">Reset All Filters</button>
            </div>
        `;
        document.getElementById('empty-reset-btn')?.addEventListener('click', resetAllFilters);
        return;
    }

    elements.productsGrid.innerHTML = state.products.map(p => {
        const stars = '★'.repeat(Math.round(p.rating || 5)) + '☆'.repeat(5 - Math.round(p.rating || 5));
        const formattedPrice = `$${Number(p.price).toFixed(2)}`;
        const stockBadge = p.stock > 15 
            ? `<span class="badge" style="background:#d1fae5; color:#065f46;">In Stock</span>`
            : p.stock > 0 
                ? `<span class="badge" style="background:#fef3c7; color:#92400e;">Only ${p.stock} left</span>`
                : `<span class="badge" style="background:#fee2e2; color:#991b1b;">Out of Stock</span>`;

        return `
            <article class="product-card" data-product-id="${p.id}" tabindex="0" role="button" aria-label="${p.title}">
                <div class="card-image-wrap">
                    <img 
                        src="${p.image_url}" 
                        alt="${p.title}" 
                        class="card-image"
                        loading="lazy"
                        onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'"
                    />
                    <div class="card-badge-container">
                        ${p.is_featured ? `<span class="badge badge-featured">★ Featured</span>` : ''}
                        <span class="badge badge-category">${p.category_name}</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-brand">${p.brand || 'Aurora'}</div>
                    <h3 class="card-title">${p.title}</h3>
                    <p class="card-desc">${p.description}</p>
                    <div class="card-rating">
                        <span class="stars">${stars}</span>
                        <span>${p.rating} (${p.rating_count})</span>
                        <span style="margin-left: auto;">${stockBadge}</span>
                    </div>
                    <div class="card-footer">
                        <span class="card-price">${formattedPrice}</span>
                        <button class="card-action-btn view-details-btn" data-product-id="${p.id}">
                            View Details →
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
        const min = state.filters.minPrice || '0';
        const max = state.filters.maxPrice || '500+';
        pills.push(`
            <span class="active-filter-pill">
                Price: $${min} - $${max}
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
    elements.resultsCount.innerHTML = `Showing <strong>${count}</strong> of <strong>${total}</strong> products`;
}

/**
 * Open Product Details Modal/View
 */
async function openProductDetail(productId) {
    try {
        const res = await api.getProductById(productId);
        if (!res.success || !res.data) {
            showToast('Failed to load product details', 'error');
            return;
        }

        state.selectedProduct = res.data;
        state.activeGalleryIndex = 0;
        state.selectedQuantity = 1;

        // Update URL hash for deep linking
        window.location.hash = `#/product/${productId}`;

        renderProductModal();
        elements.productModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    } catch (err) {
        console.error('Error fetching product detail:', err);
        showToast(err.message, 'error');
    }
}

/**
 * Render Product Detail Modal Contents
 */
function renderProductModal() {
    const p = state.selectedProduct;
    if (!p) return;

    const stars = '★'.repeat(Math.round(p.rating || 5)) + '☆'.repeat(5 - Math.round(p.rating || 5));
    const formattedPrice = `$${Number(p.price).toFixed(2)}`;
    const images = p.images && p.images.length > 0 ? p.images : [{ url: p.image_url, alt_text: p.title }];
    const mainImg = images[state.activeGalleryIndex] || images[0];

    const stockPill = p.stock > 15
        ? `<span class="stock-status-pill stock-in">● In Stock (${p.stock} units available)</span>`
        : p.stock > 0
            ? `<span class="stock-status-pill stock-low">▲ Low Stock (Only ${p.stock} left)</span>`
            : `<span class="stock-status-pill stock-out">✕ Out of Stock</span>`;

    elements.modalContent.innerHTML = `
        <div class="detail-layout">
            <!-- Left: Image Gallery -->
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
            </div>

            <!-- Right: Product Info & Actions -->
            <div class="detail-info">
                <div class="detail-breadcrumbs">
                    <a href="#/" id="breadcrumb-home">Products</a> &gt; 
                    <span>${p.category_name}</span> &gt; 
                    <span>${p.brand || 'Aurora'}</span>
                </div>

                <h1 class="detail-title">${p.title}</h1>

                <div class="detail-meta-row">
                    <span class="stars" style="font-size: 1.1rem;">${stars}</span>
                    <strong style="color: var(--gray-800);">${p.rating}</strong>
                    <span style="color: var(--gray-500);">(${p.rating_count} reviews)</span>
                    <span style="color: var(--gray-300);">|</span>
                    <span class="detail-sku">SKU: ${p.sku || 'N/A'}</span>
                </div>

                <div class="detail-price-box">
                    <div>
                        <span style="font-size: 0.85rem; color: var(--gray-500); display: block;">Total Price</span>
                        <div class="detail-price">${formattedPrice}</div>
                    </div>
                    <div>
                        ${stockPill}
                    </div>
                </div>

                <div class="detail-desc-title">Product Description</div>
                <p class="detail-desc">${p.description}</p>

                <div class="detail-specs">
                    <div class="spec-row">
                        <span class="spec-key">Category</span>
                        <span class="spec-val">${p.category_name}</span>
                    </div>
                    <div class="spec-row">
                        <span class="spec-key">Brand</span>
                        <span class="spec-val">${p.brand || 'Aurora'}</span>
                    </div>
                    <div class="spec-row">
                        <span class="spec-key">Shipping</span>
                        <span class="spec-val">Free Standard Delivery (2-4 business days)</span>
                    </div>
                    <div class="spec-row">
                        <span class="spec-key">Guarantee</span>
                        <span class="spec-val">30-day money-back guarantee & authentic warranty</span>
                    </div>
                </div>

                <div class="detail-actions">
                    <div class="qty-control">
                        <button class="qty-btn" id="qty-minus">-</button>
                        <span class="qty-display" id="qty-display">${state.selectedQuantity}</span>
                        <button class="qty-btn" id="qty-plus">+</button>
                    </div>
                    <button class="btn-add-cart" id="modal-add-cart-btn" ${p.stock === 0 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                        🛒 Add to Cart (${formattedPrice})
                    </button>
                </div>
            </div>
        </div>
    `;

    // Attach thumbnail listeners
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

    // Quantity buttons
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
        showToast(`Added ${state.selectedQuantity}x "${p.title}" to cart!`, 'success');
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
 * Handle URL hash changes for deep linking (e.g. #/product/1)
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

    // Reset inputs
    elements.navSearchInput.value = '';
    elements.searchClearBtn.style.display = 'none';
    elements.priceMinInput.value = '';
    elements.priceMaxInput.value = '';
    elements.priceRangeSlider.value = 500;
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

    // Quick Bar & Sidebar Category Clicks
    const handleCategoryClick = (categorySlug) => {
        state.filters.category = categorySlug;
        state.filters.page = 1;
        renderCategoryNavigation();
        loadProducts();
    };

    elements.catBar.addEventListener('click', (e) => {
        const chip = e.target.closest('.cat-chip');
        if (chip) {
            handleCategoryClick(chip.dataset.category);
        }
    });

    elements.sidebarCatList.addEventListener('click', (e) => {
        const item = e.target.closest('.filter-category-item');
        if (item) {
            handleCategoryClick(item.dataset.category);
        }
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
        elements.priceRangeSlider.value = e.target.value || 500;
        state.filters.page = 1;
        loadProducts();
    });

    // In-Stock Checkbox
    elements.stockToggle.addEventListener('change', (e) => {
        state.filters.inStock = e.target.checked;
        state.filters.page = 1;
        loadProducts();
    });

    // Sort Dropdown
    elements.sortSelect.addEventListener('change', (e) => {
        state.filters.sort = e.target.value;
        state.filters.page = 1;
        loadProducts();
    });

    // Reset Filters button
    elements.resetFiltersBtn.addEventListener('click', resetAllFilters);

    // Remove active filter badge
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
            elements.priceRangeSlider.value = 500;
        } else if (filterType === 'inStock') {
            state.filters.inStock = false;
            elements.stockToggle.checked = false;
        }
        state.filters.page = 1;
        loadProducts();
    });

    // Product Card clicks & View Details clicks (delegated)
    elements.productsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (card) {
            const id = parseInt(card.dataset.productId, 10);
            if (id) openProductDetail(id);
        }
    });

    // Pagination clicks (delegated)
    elements.paginationWrapper.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-page]');
        if (btn && !btn.disabled) {
            const page = parseInt(btn.dataset.page, 10);
            if (page && page !== state.filters.page) {
                state.filters.page = page;
                loadProducts();
                window.scrollTo({ top: 380, behavior: 'smooth' });
            }
        }
    });

    // Modal close button & overlay click
    elements.modalCloseBtn.addEventListener('click', closeProductDetail);
    elements.productModal.addEventListener('click', (e) => {
        if (e.target === elements.productModal) {
            closeProductDetail();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.productModal.classList.contains('open')) {
            closeProductDetail();
        }
    });

    // Hash change listener for browser back/forward buttons
    window.addEventListener('hashchange', handleHashRouting);

    // Mobile filter drawer toggle
    elements.mobileFilterBtn?.addEventListener('click', () => {
        elements.filterSidebar.classList.add('mobile-open');
    });

    elements.mobileFilterClose?.addEventListener('click', () => {
        elements.filterSidebar.classList.remove('mobile-open');
    });
}

// Start app once DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
