/**
 * ApnaBazar (अपना बाज़ार) — Interactive CSS Generator & Appearance Studio
 * Dynamically optimizes website styling, color themes, component geometry,
 * typography, and generates downloadable/exportable pure CSS stylesheets.
 */

const STORAGE_KEY = 'apnabazar_custom_theme';

export const THEME_PRESETS = {
    default: {
        id: 'default',
        name: 'Bharat Saffron (Default)',
        primary: '#ea580c',
        primaryHover: '#c2410c',
        navy: '#0f172a',
        accent: '#f59e0b',
        bodyBg: '#f4f6f8',
        cardBg: '#ffffff',
        textColor: '#1e293b',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        radius: 10,
        shadow: 'soft',
        density: 'standard',
        swatches: ['#ea580c', '#0f172a', '#f59e0b']
    },
    emerald: {
        id: 'emerald',
        name: 'Modern Emerald / Eco Luxe',
        primary: '#059669',
        primaryHover: '#047857',
        navy: '#064e3b',
        accent: '#10b981',
        bodyBg: '#f0fdf4',
        cardBg: '#ffffff',
        textColor: '#0f172a',
        fontFamily: 'Inter, system-ui, sans-serif',
        radius: 12,
        shadow: 'soft',
        density: 'standard',
        swatches: ['#059669', '#064e3b', '#10b981']
    },
    midnight: {
        id: 'midnight',
        name: 'Midnight Cyber Dark (OLED)',
        primary: '#06b6d4',
        primaryHover: '#0891b2',
        navy: '#090d16',
        accent: '#f43f5e',
        bodyBg: '#0b0f19',
        cardBg: '#151c2e',
        textColor: '#e2e8f0',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        radius: 8,
        shadow: 'glow',
        density: 'compact',
        swatches: ['#06b6d4', '#090d16', '#f43f5e']
    },
    royal: {
        id: 'royal',
        name: 'Royal Heritage Velvet',
        primary: '#7c3aed',
        primaryHover: '#6d28d9',
        navy: '#2e1065',
        accent: '#eab308',
        bodyBg: '#faf5ff',
        cardBg: '#ffffff',
        textColor: '#1e1b4b',
        fontFamily: 'Georgia, "Playfair Display", serif',
        radius: 16,
        shadow: 'float',
        density: 'spacious',
        swatches: ['#7c3aed', '#2e1065', '#eab308']
    },
    monochrome: {
        id: 'monochrome',
        name: 'Clean Nordic Monochrome',
        primary: '#18181b',
        primaryHover: '#27272a',
        navy: '#09090b',
        accent: '#71717a',
        bodyBg: '#fafafa',
        cardBg: '#ffffff',
        textColor: '#09090b',
        fontFamily: 'system-ui, sans-serif',
        radius: 0,
        shadow: 'flat',
        density: 'compact',
        swatches: ['#18181b', '#09090b', '#71717a']
    },
    ocean: {
        id: 'ocean',
        name: 'Ocean Cobalt & Sky',
        primary: '#0284c7',
        primaryHover: '#0369a1',
        navy: '#0c4a6e',
        accent: '#38bdf8',
        bodyBg: '#f0f9ff',
        cardBg: '#ffffff',
        textColor: '#0f172a',
        fontFamily: 'Roboto, system-ui, sans-serif',
        radius: 8,
        shadow: 'soft',
        density: 'standard',
        swatches: ['#0284c7', '#0c4a6e', '#38bdf8']
    },
    crimson: {
        id: 'crimson',
        name: 'Crimson Festive Dhamaka',
        primary: '#e11d48',
        primaryHover: '#be123c',
        navy: '#881337',
        accent: '#f59e0b',
        bodyBg: '#fff1f2',
        cardBg: '#ffffff',
        textColor: '#1f2937',
        fontFamily: 'Poppins, system-ui, sans-serif',
        radius: 14,
        shadow: 'float',
        density: 'standard',
        swatches: ['#e11d48', '#881337', '#f59e0b']
    }
};

let currentState = { ...THEME_PRESETS.default };

/**
 * Generate pure CSS rules based on state
 */
export function generateCss(state = currentState) {
    const isDark = state.bodyBg === '#0b0f19' || state.bodyBg === '#090d16';
    
    let shadowDef = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.08)';
    let cardShadow = '0 2px 8px rgba(0,0,0,0.06)';
    if (state.shadow === 'flat') {
        shadowDef = 'none';
        cardShadow = 'none';
    } else if (state.shadow === 'float') {
        shadowDef = '0 12px 24px -4px rgba(0, 0, 0, 0.15)';
        cardShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.12)';
    } else if (state.shadow === 'glow') {
        shadowDef = `0 0 15px ${state.primary}33`;
        cardShadow = `0 4px 20px rgba(0, 0, 0, 0.4), 0 0 1px ${state.primary}66`;
    }

    let gridColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
    if (state.density === 'compact') {
        gridColumns = 'repeat(auto-fill, minmax(220px, 1fr))';
    } else if (state.density === 'spacious') {
        gridColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
    }

    const css = `/* =======================================================
   ApnaBazar Custom Optimized Stylesheet
   Generated: ${new Date().toISOString()}
   Theme Preset: ${state.name || 'Custom'}
   ======================================================= */

:root {
  --primary: ${state.primary};
  --primary-hover: ${state.primaryHover};
  --navy: ${state.navy};
  --accent: ${state.accent};
  --radius-md: ${state.radius}px;
  --radius-lg: ${Math.round(state.radius * 1.4)}px;
  --shadow-md: ${shadowDef};
  --transition: all 0.2s ease;
}

body {
  background-color: ${state.bodyBg} !important;
  color: ${state.textColor} !important;
  font-family: ${state.fontFamily} !important;
}

.top-bar, .navbar {
  background: ${state.navy} !important;
}

.brand-name {
  color: #ffffff !important;
}

.brand-icon {
  background: ${state.primary} !important;
  border-radius: ${Math.min(state.radius, 12)}px !important;
}

.brand-name span {
  color: ${state.accent} !important;
}

.nav-deals-btn, .btn-primary, .add-to-cart-btn {
  background: ${state.primary} !important;
  border-radius: ${state.radius}px !important;
  border: none !important;
  color: #ffffff !important;
}

.nav-deals-btn:hover, .btn-primary:hover, .add-to-cart-btn:hover {
  background: ${state.primaryHover} !important;
}

.hero-section {
  background: linear-gradient(135deg, ${state.navy} 0%, ${state.primary}dd 100%) !important;
}

.products-grid {
  grid-template-columns: ${gridColumns} !important;
}

.product-card {
  background-color: ${state.cardBg} !important;
  border-radius: ${state.radius}px !important;
  box-shadow: ${cardShadow} !important;
  border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'} !important;
}

.product-title {
  color: ${state.textColor} !important;
}

.price-current {
  color: ${state.primary} !important;
}

.product-badge-deal {
  background: ${state.accent} !important;
  color: #0f172a !important;
}

.category-chip.active {
  background: ${state.primary} !important;
  color: #ffffff !important;
  border-color: ${state.primary} !important;
}

.footer {
  background: ${state.navy} !important;
}
`;
    return css;
}

/**
 * Apply generated stylesheet to DOM
 */
export function applyCssToDom(cssText) {
    let styleTag = document.getElementById('dynamic-custom-css');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'dynamic-custom-css';
        document.head.appendChild(styleTag);
    }
    styleTag.textContent = cssText;
}

/**
 * Remove custom stylesheet and restore default
 */
export function removeCssFromDom() {
    const styleTag = document.getElementById('dynamic-custom-css');
    if (styleTag) styleTag.remove();
}

/**
 * Mount the CSS Studio UI drawer & floating launcher into page
 */
export function initCssStudio() {
    // 1. Restore saved theme if any
    loadSavedTheme();

    // 2. Build DOM elements if not already present
    if (!document.getElementById('css-studio-drawer')) {
        createStudioDom();
    }

    // 3. Attach launcher button if not present
    if (!document.getElementById('css-studio-launcher') && !document.body.classList.contains('admin-body')) {
        createFloatingLauncher();
    }

    // 4. Hook into Admin / Navbar buttons
    const navStudioBtn = document.getElementById('open-css-studio-btn');
    if (navStudioBtn) {
        navStudioBtn.addEventListener('click', openCssStudio);
    }
}

function loadSavedTheme() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            currentState = { ...THEME_PRESETS.default, ...parsed };
            const css = generateCss(currentState);
            applyCssToDom(css);
        }
    } catch (e) {
        console.warn('Failed to load saved theme:', e);
    }
}

function createFloatingLauncher() {
    const btn = document.createElement('button');
    btn.id = 'css-studio-launcher';
    btn.className = 'css-studio-launcher';
    btn.innerHTML = '<span>🎨</span> <span>CSS Generator</span>';
    btn.title = 'Customize website appearance and generate CSS';
    btn.addEventListener('click', openCssStudio);
    document.body.appendChild(btn);
}

function createStudioDom() {
    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'css-studio-overlay';
    overlay.className = 'css-studio-overlay';
    overlay.addEventListener('click', closeCssStudio);
    document.body.appendChild(overlay);

    // Drawer
    const drawer = document.createElement('div');
    drawer.id = 'css-studio-drawer';
    drawer.className = 'css-studio-drawer';

    drawer.innerHTML = `
        <div class="studio-header">
            <div class="studio-title">
                <span>🎨</span>
                <span>CSS Generator &amp; Appearance Studio</span>
            </div>
            <button id="studio-close-btn" class="studio-close-btn" title="Close studio">✕</button>
        </div>

        <div class="studio-body">
            <!-- Theme Presets -->
            <div class="studio-section">
                <div class="studio-section-title">
                    <span>✨</span> Optimized Theme Presets
                </div>
                <div class="theme-presets-grid" id="theme-presets-grid">
                    ${Object.values(THEME_PRESETS).map(p => `
                        <div class="preset-card ${currentState.id === p.id ? 'active' : ''}" data-preset-id="${p.id}">
                            <div class="preset-card-title">${escapeHtml(p.name)}</div>
                            <div class="preset-swatches">
                                ${p.swatches.map(s => `<span class="swatch-dot" style="background:${s}"></span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Granular Styling Customizer -->
            <div class="studio-section">
                <div class="studio-section-title">
                    <span>🎛️</span> Palette &amp; Colors
                </div>
                <div class="controls-grid">
                    <div class="control-item">
                        <label>Primary Brand</label>
                        <div class="color-input-wrap">
                            <input type="color" id="ctrl-primary" class="color-picker" value="${currentState.primary}">
                            <span class="color-hex" id="hex-primary">${currentState.primary}</span>
                        </div>
                    </div>

                    <div class="control-item">
                        <label>Navbar &amp; Topbar</label>
                        <div class="color-input-wrap">
                            <input type="color" id="ctrl-navy" class="color-picker" value="${currentState.navy}">
                            <span class="color-hex" id="hex-navy">${currentState.navy}</span>
                        </div>
                    </div>

                    <div class="control-item">
                        <label>Accent &amp; Deals</label>
                        <div class="color-input-wrap">
                            <input type="color" id="ctrl-accent" class="color-picker" value="${currentState.accent}">
                            <span class="color-hex" id="hex-accent">${currentState.accent}</span>
                        </div>
                    </div>

                    <div class="control-item">
                        <label>Background Color</label>
                        <div class="color-input-wrap">
                            <input type="color" id="ctrl-bodybg" class="color-picker" value="${currentState.bodyBg}">
                            <span class="color-hex" id="hex-bodybg">${currentState.bodyBg}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Geometry & Typography -->
            <div class="studio-section">
                <div class="studio-section-title">
                    <span>📐</span> Geometry &amp; Typography
                </div>
                <div class="controls-grid">
                    <div class="control-item">
                        <label for="ctrl-radius">Corner Radius: <span id="val-radius">${currentState.radius}px</span></label>
                        <input type="range" id="ctrl-radius" class="studio-range" min="0" max="24" step="2" value="${currentState.radius}">
                    </div>

                    <div class="control-item">
                        <label for="ctrl-font">Typography</label>
                        <select id="ctrl-font" class="studio-select">
                            <option value='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'>System Sans (Default)</option>
                            <option value='Inter, system-ui, sans-serif'>Inter (Clean Modern)</option>
                            <option value='Poppins, system-ui, sans-serif'>Poppins (Friendly)</option>
                            <option value='Roboto, system-ui, sans-serif'>Roboto (Material)</option>
                            <option value='Georgia, "Playfair Display", serif'>Playfair (Luxury Serif)</option>
                        </select>
                    </div>

                    <div class="control-item">
                        <label for="ctrl-shadow">Card Shadow</label>
                        <select id="ctrl-shadow" class="studio-select">
                            <option value="soft">Subtle Modern Soft</option>
                            <option value="float">Elevated Float 3D</option>
                            <option value="glow">Neo-Glow (Accent)</option>
                            <option value="flat">Minimal Flat (0 shadow)</option>
                        </select>
                    </div>

                    <div class="control-item">
                        <label for="ctrl-density">Catalogue Grid Density</label>
                        <select id="ctrl-density" class="studio-select">
                            <option value="standard">Standard (4 Columns)</option>
                            <option value="compact">Compact Density (5 Columns)</option>
                            <option value="spacious">Spacious Showcase (3 Columns)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Generated Pure CSS Box -->
            <div class="studio-section">
                <div class="studio-section-title">
                    <span>💻</span> Live Generated CSS Code
                </div>
                <div class="css-output-box">
                    <div class="css-output-header">
                        <span>Pure CSS (Ready to Deploy)</span>
                        <span id="css-char-count">0 bytes</span>
                    </div>
                    <pre class="css-code-pre" id="css-code-pre"><code></code></pre>
                </div>
            </div>
        </div>

        <div class="studio-footer">
            <div class="studio-btn-row">
                <button id="studio-save-btn" class="studio-btn studio-btn-primary">
                    <span>💾</span> <span>Apply &amp; Save Theme</span>
                </button>
                <button id="studio-copy-btn" class="studio-btn studio-btn-secondary">
                    <span>📋</span> <span>Copy CSS</span>
                </button>
                <button id="studio-download-btn" class="studio-btn studio-btn-secondary">
                    <span>⬇</span> <span>Download .css</span>
                </button>
            </div>
            <button id="studio-reset-btn" class="studio-btn studio-btn-outline">
                <span>🔄</span> <span>Reset to Default Website CSS</span>
            </button>
        </div>
    `;

    document.body.appendChild(drawer);
    setupStudioHandlers();
    updateStudioPreview();
}

function setupStudioHandlers() {
    // Close button
    document.getElementById('studio-close-btn')?.addEventListener('click', closeCssStudio);

    // Preset cards
    document.querySelectorAll('.preset-card').forEach(card => {
        card.addEventListener('click', () => {
            const presetId = card.dataset.presetId;
            const preset = THEME_PRESETS[presetId];
            if (preset) {
                currentState = { ...preset };
                syncFormInputs();
                updateStudioPreview();
            }
        });
    });

    // Color pickers
    const bindColor = (id, stateKey, hexId) => {
        const input = document.getElementById(id);
        const hex = document.getElementById(hexId);
        if (input) {
            input.addEventListener('input', (e) => {
                currentState[stateKey] = e.target.value;
                if (stateKey === 'primary') {
                    // compute subtle darker hover
                    currentState.primaryHover = adjustBrightness(e.target.value, -15);
                }
                if (hex) hex.textContent = e.target.value;
                currentState.id = 'custom';
                updateStudioPreview();
            });
        }
    };
    bindColor('ctrl-primary', 'primary', 'hex-primary');
    bindColor('ctrl-navy', 'navy', 'hex-navy');
    bindColor('ctrl-accent', 'accent', 'hex-accent');
    bindColor('ctrl-bodybg', 'bodyBg', 'hex-bodybg');

    // Radius slider
    const radiusInput = document.getElementById('ctrl-radius');
    if (radiusInput) {
        radiusInput.addEventListener('input', (e) => {
            currentState.radius = parseInt(e.target.value, 10);
            const lbl = document.getElementById('val-radius');
            if (lbl) lbl.textContent = `${currentState.radius}px`;
            currentState.id = 'custom';
            updateStudioPreview();
        });
    }

    // Font select
    const fontSelect = document.getElementById('ctrl-font');
    if (fontSelect) {
        fontSelect.addEventListener('change', (e) => {
            currentState.fontFamily = e.target.value;
            currentState.id = 'custom';
            updateStudioPreview();
        });
    }

    // Shadow select
    const shadowSelect = document.getElementById('ctrl-shadow');
    if (shadowSelect) {
        shadowSelect.addEventListener('change', (e) => {
            currentState.shadow = e.target.value;
            currentState.id = 'custom';
            updateStudioPreview();
        });
    }

    // Density select
    const densitySelect = document.getElementById('ctrl-density');
    if (densitySelect) {
        densitySelect.addEventListener('change', (e) => {
            currentState.density = e.target.value;
            currentState.id = 'custom';
            updateStudioPreview();
        });
    }

    // Save button
    document.getElementById('studio-save-btn')?.addEventListener('click', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
        showToast('Theme saved! It will persist across all pages.', 'success');
    });

    // Copy CSS button
    document.getElementById('studio-copy-btn')?.addEventListener('click', async () => {
        const css = generateCss(currentState);
        try {
            await navigator.clipboard.writeText(css);
            showToast('CSS copied to clipboard!', 'success');
        } catch {
            showToast('Could not copy to clipboard. Select text manually.', 'warning');
        }
    });

    // Download .css
    document.getElementById('studio-download-btn')?.addEventListener('click', () => {
        const css = generateCss(currentState);
        const blob = new Blob([css], { type: 'text/css;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `apnabazar-${currentState.id || 'theme'}.css`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Downloaded custom CSS stylesheet!', 'success');
    });

    // Reset button
    document.getElementById('studio-reset-btn')?.addEventListener('click', () => {
        currentState = { ...THEME_PRESETS.default };
        localStorage.removeItem(STORAGE_KEY);
        removeCssFromDom();
        syncFormInputs();
        updateStudioPreview();
        showToast('Restored default website styling.', 'info');
    });
}

function syncFormInputs() {
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    };
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    setVal('ctrl-primary', currentState.primary);
    setText('hex-primary', currentState.primary);
    setVal('ctrl-navy', currentState.navy);
    setText('hex-navy', currentState.navy);
    setVal('ctrl-accent', currentState.accent);
    setText('hex-accent', currentState.accent);
    setVal('ctrl-bodybg', currentState.bodyBg);
    setText('hex-bodybg', currentState.bodyBg);

    setVal('ctrl-radius', currentState.radius);
    setText('val-radius', `${currentState.radius}px`);
    setVal('ctrl-font', currentState.fontFamily);
    setVal('ctrl-shadow', currentState.shadow);
    setVal('ctrl-density', currentState.density);

    // Active preset cards
    document.querySelectorAll('.preset-card').forEach(card => {
        card.classList.toggle('active', card.dataset.presetId === currentState.id);
    });
}

function updateStudioPreview() {
    const css = generateCss(currentState);
    applyCssToDom(css);

    const codePre = document.getElementById('css-code-pre');
    if (codePre) {
        codePre.textContent = css;
    }
    const byteCount = document.getElementById('css-char-count');
    if (byteCount) {
        byteCount.textContent = `${css.length} bytes`;
    }
}

export function openCssStudio() {
    document.getElementById('css-studio-overlay')?.classList.add('active');
    document.getElementById('css-studio-drawer')?.classList.add('active');
    syncFormInputs();
    updateStudioPreview();
}

export function closeCssStudio() {
    document.getElementById('css-studio-overlay')?.classList.remove('active');
    document.getElementById('css-studio-drawer')?.classList.remove('active');
}

// Color brightness adjustment helper
function adjustBrightness(hex, percent) {
    let num = parseInt(hex.replace('#', ''), 16);
    let r = (num >> 16) + Math.round(255 * (percent / 100));
    let g = ((num >> 8) & 0x00FF) + Math.round(255 * (percent / 100));
    let b = (num & 0x0000FF) + Math.round(255 * (percent / 100));

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✓', error: '✕', warning: '⚠️', info: 'ℹ️' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Auto-mount on load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        initCssStudio();
    });
}
