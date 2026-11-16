/**
 * ApnaBazar (अपना बाज़ार) — Admin Analytics & Traffic Simulator Module
 */

const API_BASE = window.location.origin;

let streamInterval = null;
let autoRefreshInterval = null;
let cachedCountries = [];

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

async function initDashboard() {
    setupEventListeners();
    await loadPresets();
    await refreshAll();

    // Auto-refresh every 3.5 seconds if enabled
    const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
    if (autoRefreshToggle && autoRefreshToggle.checked) {
        startAutoRefresh();
    }
}

function setupEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) refreshBtn.addEventListener('click', () => refreshAll(true));

    // Reset/Clear button
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) clearBtn.addEventListener('click', handleClearLogs);

    // Live Stream toggle
    const streamBtn = document.getElementById('stream-toggle-btn');
    if (streamBtn) streamBtn.addEventListener('click', toggleTrafficStream);

    // Batch quick simulate buttons
    document.querySelectorAll('.sim-quick-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const count = parseInt(btn.dataset.count, 10) || 5;
            await triggerSimulation({ count });
        });
    });

    // Custom IP submit button
    const sendCustomBtn = document.getElementById('send-custom-ip-btn');
    if (sendCustomBtn) sendCustomBtn.addEventListener('click', handleCustomSimulation);

    // Terminal clear button
    const clearTerminalBtn = document.getElementById('clear-terminal-btn');
    if (clearTerminalBtn) {
        clearTerminalBtn.addEventListener('click', () => {
            const terminal = document.getElementById('terminal-window');
            if (terminal) terminal.innerHTML = '<div class="terminal-line muted">[Terminal cleared]</div>';
        });
    }

    // Country search filter
    const countrySearchInput = document.getElementById('country-search-input');
    if (countrySearchInput) {
        countrySearchInput.addEventListener('input', (e) => {
            renderCountryTable(cachedCountries, e.target.value);
        });
    }

    // Country dropdown filter for recent table
    const tableCountryFilter = document.getElementById('table-country-filter');
    if (tableCountryFilter) {
        tableCountryFilter.addEventListener('change', () => {
            loadRecentVisits();
        });
    }

    // Auto-refresh toggle
    const autoRefreshToggle = document.getElementById('auto-refresh-toggle');
    if (autoRefreshToggle) {
        autoRefreshToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                startAutoRefresh();
            } else {
                stopAutoRefresh();
            }
        });
    }
}

function startAutoRefresh() {
    stopAutoRefresh();
    autoRefreshInterval = setInterval(() => {
        // Soft refresh without wiping view
        loadSummary();
        loadCountries();
        loadRecentVisits();
    }, 3500);
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

async function refreshAll(notify = false) {
    try {
        await Promise.all([
            loadSummary(),
            loadCountries(),
            loadRecentVisits()
        ]);
        if (notify) showToast('Dashboard metrics refreshed successfully.', 'info');
    } catch (err) {
        console.error('Refresh error:', err);
    }
}

/**
 * 1. Load KPI Summary Counters
 */
async function loadSummary() {
    try {
        const res = await fetch(`${API_BASE}/api/analytics/summary`);
        if (!res.ok) return;
        const data = await res.json();
        const s = data.summary;

        document.getElementById('kpi-total-visits').textContent = s.totalVisits.toLocaleString();
        document.getElementById('kpi-unique-ips').textContent = s.uniqueVisitors.toLocaleString();
        document.getElementById('kpi-countries-count').textContent = s.totalCountries.toLocaleString();

        if (s.topCountry && s.topCountry.country_name !== 'None') {
            document.getElementById('kpi-top-flag').textContent = s.topCountry.flag || '🌐';
            document.getElementById('kpi-top-name').textContent = s.topCountry.country_name;
            const pct = s.totalVisits > 0 ? Math.round((s.topCountry.count / s.totalVisits) * 100) : 0;
            document.getElementById('kpi-top-meta').textContent = `${s.topCountry.count.toLocaleString()} visits (${pct}%)`;
        } else {
            document.getElementById('kpi-top-flag').textContent = '🌐';
            document.getElementById('kpi-top-name').textContent = 'No Traffic Yet';
            document.getElementById('kpi-top-meta').textContent = 'Waiting for requests';
        }

        document.getElementById('kpi-traffic-split').textContent = 
            `${(s.realVisits || 0).toLocaleString()} / ${(s.simulatedVisits || 0).toLocaleString()}`;
        document.getElementById('kpi-split-meta').textContent = 
            `${s.realVisits || 0} Real Storefront | ${s.simulatedVisits || 0} Simulated`;
    } catch (err) {
        console.error('Error loading summary:', err);
    }
}

/**
 * 2. Load Geographic Country Breakdown
 */
async function loadCountries() {
    try {
        const res = await fetch(`${API_BASE}/api/analytics/countries`);
        if (!res.ok) return;
        const data = await res.json();
        cachedCountries = data.countries || [];

        // Update country filter dropdown if options changed
        updateCountryDropdown(cachedCountries);

        const searchVal = document.getElementById('country-search-input')?.value || '';
        renderCountryTable(cachedCountries, searchVal);
    } catch (err) {
        console.error('Error loading countries:', err);
    }
}

function updateCountryDropdown(countries) {
    const select = document.getElementById('table-country-filter');
    if (!select) return;

    const currentVal = select.value;
    const existingOptions = new Set(Array.from(select.options).map(o => o.value));

    countries.forEach(c => {
        if (!existingOptions.has(c.country_code)) {
            const opt = document.createElement('option');
            opt.value = c.country_code;
            opt.textContent = `${c.flag} ${c.country_name} (${c.country_code})`;
            select.appendChild(opt);
        }
    });

    if (existingOptions.has(currentVal)) {
        select.value = currentVal;
    }
}

function renderCountryTable(countries, query = '') {
    const tbody = document.getElementById('country-table-body');
    if (!tbody) return;

    let filtered = countries;
    if (query && query.trim()) {
        const q = query.toLowerCase().trim();
        filtered = countries.filter(c => 
            c.country_name.toLowerCase().includes(q) || 
            c.country_code.toLowerCase().includes(q) ||
            (c.city && c.city.toLowerCase().includes(q))
        );
    }

    if (!filtered || filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="table-empty">No country records found${query ? ' matching "' + query + '"' : ''}.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(c => `
        <tr>
            <td style="font-size:1.5rem; text-align:center;">${c.flag}</td>
            <td><strong>${escapeHtml(c.country_name)}</strong></td>
            <td><code style="background:#0f172a; padding:2px 6px; border-radius:4px; color:#93c5fd;">${c.country_code}</code></td>
            <td style="color:#94a3b8;">${escapeHtml(c.city || 'Hub')}</td>
            <td><strong>${c.visit_count.toLocaleString()}</strong></td>
            <td>${c.unique_ips.toLocaleString()}</td>
            <td>
                <div class="progress-bar-container">
                    <div class="progress-track">
                        <div class="progress-fill" style="width: ${Math.max(c.percentage, 3)}%;"></div>
                    </div>
                    <span class="progress-label">${c.percentage}%</span>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * 3. Load Recent Visit Activity Log
 */
async function loadRecentVisits() {
    try {
        const country = document.getElementById('table-country-filter')?.value || 'all';
        const url = `${API_BASE}/api/analytics/recent?limit=25${country !== 'all' ? `&country=${country}` : ''}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        const tbody = document.getElementById('recent-table-body');
        if (!tbody) return;

        const visits = data.visits || [];
        if (visits.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="table-empty">No visitor activity recorded yet. Run simulator to generate visits!</td></tr>';
            return;
        }

        tbody.innerHTML = visits.map(v => {
            const timeStr = formatVisitTime(v.created_at);
            const isSim = v.is_simulated === 1;
            return `
                <tr>
                    <td style="color:#94a3b8; font-size:0.775rem; white-space:nowrap;">${timeStr}</td>
                    <td><code style="color:#38bdf8;">${escapeHtml(v.ip_address)}</code></td>
                    <td>
                        <span style="font-size:1.15rem; vertical-align:middle; margin-right:4px;">${v.flag}</span>
                        <strong>${escapeHtml(v.country_name)}</strong>
                        <span style="color:#64748b; font-size:0.75rem;">(${escapeHtml(v.city || 'Hub')})</span>
                    </td>
                    <td><span style="font-family:monospace; color:#cbd5e1;">${escapeHtml(v.path)}</span></td>
                    <td><span class="badge badge-device">${escapeHtml(v.device_type || 'Desktop')}</span></td>
                    <td>
                        <span class="badge ${isSim ? 'badge-simulated' : 'badge-real'}">
                            ${isSim ? '⚡ Simulated' : '👤 Real User'}
                        </span>
                    </td>
                    <td>
                        <span class="badge badge-status-ok">${v.status_code || 200} OK</span>
                        <span style="color:#64748b; font-size:0.75rem; margin-left:4px;">${v.response_time_ms}ms</span>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        console.error('Error loading recent visits:', err);
    }
}

/**
 * 4. Load Simulator Presets & Render Country Chips
 */
async function loadPresets() {
    try {
        const res = await fetch(`${API_BASE}/api/analytics/presets`);
        if (!res.ok) return;
        const data = await res.json();
        const presets = data.presets || [];
        const container = document.getElementById('sim-country-chips');
        if (!container) return;

        // Group presets by country code
        const uniqueCountries = [];
        const seen = new Set();
        presets.forEach(p => {
            if (!seen.has(p.code)) {
                seen.add(p.code);
                uniqueCountries.push(p);
            }
        });

        container.innerHTML = uniqueCountries.map(p => `
            <button class="country-chip" data-code="${p.code}" data-ip="${p.ip}" data-name="${escapeHtml(p.country)}" title="Simulate visit from ${p.country}">
                <span>${p.flag}</span>
                <span>${p.country}</span>
            </button>
        `).join('');

        // Attach click handlers to chips
        container.querySelectorAll('.country-chip').forEach(chip => {
            chip.addEventListener('click', async () => {
                const code = chip.dataset.code;
                const ip = chip.dataset.ip;
                const name = chip.dataset.name;
                await triggerSimulation({ country: code, ip });
            });
        });
    } catch (err) {
        console.error('Error loading presets:', err);
    }
}

/**
 * 5. Trigger Web Request Simulation
 */
async function triggerSimulation({ count = 1, country = null, ip = null, path = null, device = null }) {
    try {
        const payload = { count };
        if (country) payload.country = country;
        if (ip) payload.ip = ip;
        if (path) payload.path = path;
        if (device) payload.device = device;

        const res = await fetch(`${API_BASE}/api/analytics/simulate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            throw new Error(`Simulation failed: HTTP ${res.status}`);
        }

        const data = await res.json();
        if (data.visits && data.visits.length > 0) {
            data.visits.forEach(v => {
                logToTerminal(v);
            });
        }

        // Fast refresh of stats
        loadSummary();
        loadCountries();
        loadRecentVisits();
    } catch (err) {
        console.error('Simulation error:', err);
        showToast('Error running simulation: ' + err.message, 'error');
    }
}

function handleCustomSimulation() {
    const ipInput = document.getElementById('custom-ip-input');
    const pathSelect = document.getElementById('custom-path-select');
    const deviceSelect = document.getElementById('custom-device-select');

    const ip = ipInput ? ipInput.value.trim() : '';
    const path = pathSelect ? pathSelect.value : '/';
    const device = deviceSelect ? deviceSelect.value : 'Desktop';

    if (!ip) {
        showToast('Please enter an IP address to simulate (e.g. 49.36.12.85)', 'warning');
        if (ipInput) ipInput.focus();
        return;
    }

    triggerSimulation({ count: 1, ip, path, device });
    if (ipInput) ipInput.value = '';
    showToast(`Simulated request dispatched for IP: ${ip}`, 'success');
}

/**
 * 6. Live Traffic Stream Generator
 */
function toggleTrafficStream() {
    const btn = document.getElementById('stream-toggle-btn');
    const text = document.getElementById('stream-btn-text');

    if (streamInterval) {
        // Stop streaming
        clearInterval(streamInterval);
        streamInterval = null;
        if (btn) btn.classList.remove('streaming');
        if (text) text.textContent = 'Start Live Traffic Stream';
        showToast('Traffic stream paused.', 'info');
    } else {
        // Start streaming
        if (btn) btn.classList.add('streaming');
        if (text) text.textContent = 'Stop Traffic Stream';
        showToast('Live traffic stream started! Generating requests...', 'success');

        // Immediately simulate one, then run interval every 1.5s
        triggerSimulation({ count: 1 });
        streamInterval = setInterval(() => {
            triggerSimulation({ count: 1 });
        }, 1500);
    }
}

/**
 * 7. Terminal Logger
 */
function logToTerminal(visit) {
    const terminal = document.getElementById('terminal-window');
    if (!terminal) return;

    const time = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.className = 'terminal-line simulated';
    line.innerHTML = `
        <span style="color:#64748b;">[${time}]</span> 
        <span style="color:#ffffff;">${visit.flag || '🌐'} ${escapeHtml(visit.country || 'Unknown')} (${escapeHtml(visit.city || 'Hub')})</span> 
        &bull; IP: <strong style="color:#38bdf8;">${escapeHtml(visit.ip)}</strong> 
        &bull; <span style="color:#a7f3d0;">${visit.device || 'Desktop'}</span> 
        &bull; <code>${escapeHtml(visit.path)}</code> 
        &bull; <span style="color:#4ade80;">${visit.statusCode || 200} OK</span> (${visit.latency || 25}ms)
    `;

    terminal.appendChild(line);

    // Keep terminal limited to last 150 lines
    while (terminal.children.length > 150) {
        terminal.removeChild(terminal.firstChild);
    }

    // Auto-scroll to bottom
    terminal.scrollTop = terminal.scrollHeight;
}

/**
 * 8. Clear Analytics Logs
 */
async function handleClearLogs() {
    if (!confirm('Are you sure you want to clear all visitor analytics logs? This will reset all metrics to 0.')) {
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/analytics/clear`, { method: 'POST' });
        if (res.ok) {
            showToast('All analytics logs have been cleared.', 'success');
            const terminal = document.getElementById('terminal-window');
            if (terminal) terminal.innerHTML = '<div class="terminal-line muted">[Database Reset] All analytics tables cleared.</div>';
            refreshAll();
        } else {
            showToast('Failed to clear logs.', 'error');
        }
    } catch (err) {
        showToast('Error: ' + err.message, 'error');
    }
}

// Helpers
function formatVisitTime(dateStr) {
    if (!dateStr) return 'Just now';
    try {
        const date = new Date(dateStr.replace(' ', 'T') + 'Z');
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
        return dateStr;
    }
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
