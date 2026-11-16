#!/usr/bin/env node
/**
 * ApnaBazar (अपना बाज़ार) — CLI Web Request Traffic Simulator
 * Simulates incoming traffic from various global IP addresses.
 *
 * Usage:
 *   node backend/scripts/simulateTraffic.js
 *   node backend/scripts/simulateTraffic.js --count=20
 *   node backend/scripts/simulateTraffic.js --country=US
 *   node backend/scripts/simulateTraffic.js --ip=82.165.197.1
 *   node backend/scripts/simulateTraffic.js --continuous --delay=1000
 */

import { db } from '../src/config/db.js';
import { lookupIp, SIMULATOR_PRESETS, detectDevice } from '../src/utils/geoIp.js';

const SAMPLE_PATHS = [
    '/',
    '/api/products',
    '/api/products/1',
    '/api/products/4',
    '/api/products/9',
    '/api/categories',
    '/api/products?category=groceries',
    '/api/products?category=ethnic-wear',
    '/api/products?search=tea',
    '/api/products?sort=price_asc'
];

const SAMPLE_USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.64 Mobile Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    'Mozilla/5.0 (iPad; CPU OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Mobile/15E148 Safari/604.1'
];

// Parse command line arguments with robust regex support
const fullArgStr = process.argv.slice(2).join(' ');
let count = 15;
let countryFilter = null;
let customIp = null;
let continuous = false;
let delayMs = 1200;

const countMatch = fullArgStr.match(/--count[=:\s]?(\d+)/i);
if (countMatch) {
    count = parseInt(countMatch[1], 10) || 15;
}

const countryMatch = fullArgStr.match(/--country[=:\s]?([a-zA-Z]+)/i);
if (countryMatch) {
    countryFilter = countryMatch[1].toUpperCase();
}

const ipMatch = fullArgStr.match(/--ip[=:\s]?([0-9.]+)/i);
if (ipMatch) {
    customIp = ipMatch[1];
}

if (/\b(--continuous|-c)\b/i.test(fullArgStr)) {
    continuous = true;
}

const delayMatch = fullArgStr.match(/--delay[=:\s]?(\d+)/i);
if (delayMatch) {
    delayMs = parseInt(delayMatch[1], 10) || 1200;
}

const insertStmt = db.prepare(`
    INSERT INTO user_visits (
        ip_address, country_code, country_name, city, flag,
        path, method, user_agent, device_type, status_code,
        response_time_ms, is_simulated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
`);

function simulateSingleVisit(idx = 1) {
    let preset;
    if (customIp) {
        const geo = lookupIp(customIp);
        preset = {
            ip: customIp,
            code: geo.countryCode,
            name: geo.countryName,
            city: geo.city,
            flag: geo.flag
        };
    } else if (countryFilter) {
        const matches = SIMULATOR_PRESETS.filter(p => p.code === countryFilter);
        preset = matches.length > 0
            ? matches[Math.floor(Math.random() * matches.length)]
            : SIMULATOR_PRESETS[Math.floor(Math.random() * SIMULATOR_PRESETS.length)];
    } else {
        preset = SIMULATOR_PRESETS[Math.floor(Math.random() * SIMULATOR_PRESETS.length)];
    }

    let ipToUse = preset.ip;
    if (!customIp) {
        const parts = preset.ip.split('.');
        if (parts.length === 4) {
            const randomHost = 10 + Math.floor(Math.random() * 240);
            ipToUse = `${parts[0]}.${parts[1]}.${parts[2]}.${randomHost}`;
        }
    }

    const geo = lookupIp(ipToUse);
    const path = SAMPLE_PATHS[Math.floor(Math.random() * SAMPLE_PATHS.length)];
    const ua = SAMPLE_USER_AGENTS[Math.floor(Math.random() * SAMPLE_USER_AGENTS.length)];
    const device = detectDevice(ua);
    const latency = 12 + Math.floor(Math.random() * 68);

    insertStmt.run(
        ipToUse,
        geo.countryCode,
        geo.countryName,
        geo.city || preset.city,
        geo.flag || preset.flag,
        path,
        'GET',
        ua,
        device,
        200,
        latency
    );

    const pad = (s, l) => (s + ' '.repeat(l)).slice(0, l);
    const ts = new Date().toLocaleTimeString();
    console.log(
        `[${ts}] #${String(idx).padStart(3, '0')} ${geo.flag} ${pad(geo.countryName, 18)} | ` +
        `IP: ${pad(ipToUse, 15)} | City: ${pad(geo.city || 'N/A', 14)} | ` +
        `Device: ${pad(device, 8)} | ${path} (200 OK, ${latency}ms)`
    );
}

console.log('================================================================');
console.log('   ApnaBazar (अपना बाज़ार) — Global Traffic Request Simulator    ');
console.log('================================================================');
console.log(` Mode:        ${continuous ? 'Continuous Stream' : `Batch Simulation (${count} requests)`}`);
if (countryFilter) console.log(` Country:     ${countryFilter}`);
if (customIp) console.log(` Target IP:   ${customIp}`);
console.log('----------------------------------------------------------------');

if (continuous) {
    console.log(`Streaming requests every ${delayMs}ms... Press Ctrl+C to stop.\n`);
    let seq = 1;
    setInterval(() => {
        simulateSingleVisit(seq++);
    }, delayMs);
} else {
    for (let i = 1; i <= count; i++) {
        simulateSingleVisit(i);
    }
    console.log('----------------------------------------------------------------');
    console.log(` Successfully simulated ${count} global web requests!`);
    console.log(' View real-time analytics at: http://localhost:5000/admin.html');
    console.log('================================================================\n');
}
