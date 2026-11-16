/**
 * ApnaBazar (अपना बाज़ार) — High-Performance Geolocation & IP-to-Country Mapper
 * Features fast in-memory IP range lookup, realistic country subnets,
 * device detection, and simulator preset profiles.
 */

// Helper to convert dotted IPv4 string to 32-bit unsigned number
export function ipToLong(ipStr) {
    if (!ipStr || typeof ipStr !== 'string') return 0;
    
    // Normalize IPv6-mapped IPv4 e.g. ::ffff:192.168.1.1
    let clean = ipStr.trim();
    if (clean.startsWith('::ffff:')) {
        clean = clean.replace('::ffff:', '');
    }

    // Handle localhost abbreviations
    if (clean === '::1' || clean === 'localhost') {
        clean = '127.0.0.1';
    }

    const parts = clean.split('.');
    if (parts.length !== 4) return 0;

    let result = 0;
    for (let i = 0; i < 4; i++) {
        const octet = parseInt(parts[i], 10);
        if (isNaN(octet) || octet < 0 || octet > 255) return 0;
        result = (result << 8) + octet;
    }
    // Convert to unsigned 32-bit integer
    return result >>> 0;
}

// Convert CIDR prefix to [startLong, endLong]
export function cidrToRange(cidr) {
    const [ip, bitsStr] = cidr.split('/');
    const bits = parseInt(bitsStr, 10);
    const ipLong = ipToLong(ip);
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    const start = (ipLong & mask) >>> 0;
    const end = (start | (~mask >>> 0)) >>> 0;
    return [start, end];
}

/**
 * Curated list of major country CIDRs and subnets.
 * Sorted / checked for fast range matching.
 */
const COUNTRY_BLOCKS = [
    // India (IN) - Airtel, Jio, BSNL, ACT, MTNL, Tata
    { cidr: '14.139.0.0/16', code: 'IN', name: 'India', flag: '🇮🇳', city: 'New Delhi' },
    { cidr: '27.56.0.0/14', code: 'IN', name: 'India', flag: '🇮🇳', city: 'Mumbai' },
    { cidr: '49.32.0.0/11', code: 'IN', name: 'India', flag: '🇮🇳', city: 'Bengaluru' },
    { cidr: '103.21.244.0/22', code: 'IN', name: 'India', flag: '🇮🇳', city: 'Jaipur' },
    { cidr: '103.50.0.0/16', code: 'IN', name: 'India', flag: '🇮🇳', city: 'Hyderabad' },
    { cidr: '106.51.0.0/16', code: 'IN', name: 'India', flag: '🇮🇳', city: 'Chennai' },
    { cidr: '117.192.0.0/11', code: 'IN', name: 'India', flag: '🇮🇳', city: 'Kolkata' },
    { cidr: '122.160.0.0/12', code: 'IN', name: 'India', flag: '🇮🇳', city: 'Pune' },
    { cidr: '157.32.0.0/11', code: 'IN', name: 'India', flag: '🇮🇳', city: 'Ahmedabad' },
    { cidr: '182.64.0.0/11', code: 'IN', name: 'India', flag: '🇮🇳', city: 'Lucknow' },
    { cidr: '202.54.0.0/16', code: 'IN', name: 'India', flag: '🇮🇳', city: 'Chandigarh' },
    { cidr: '223.176.0.0/12', code: 'IN', name: 'India', flag: '🇮🇳', city: 'Bhopal' },

    // United States (US)
    { cidr: '3.0.0.0/9', code: 'US', name: 'United States', flag: '🇺🇸', city: 'Ashburn' },
    { cidr: '8.8.8.0/24', code: 'US', name: 'United States', flag: '🇺🇸', city: 'Mountain View' },
    { cidr: '12.0.0.0/10', code: 'US', name: 'United States', flag: '🇺🇸', city: 'Dallas' },
    { cidr: '23.0.0.0/12', code: 'US', name: 'United States', flag: '🇺🇸', city: 'Boston' },
    { cidr: '52.0.0.0/11', code: 'US', name: 'United States', flag: '🇺🇸', city: 'Seattle' },
    { cidr: '54.160.0.0/12', code: 'US', name: 'United States', flag: '🇺🇸', city: 'San Jose' },
    { cidr: '64.233.160.0/19', code: 'US', name: 'United States', flag: '🇺🇸', city: 'New York' },
    { cidr: '66.102.0.0/20', code: 'US', name: 'United States', flag: '🇺🇸', city: 'Los Angeles' },
    { cidr: '104.0.0.0/8', code: 'US', name: 'United States', flag: '🇺🇸', city: 'San Francisco' },
    { cidr: '142.250.0.0/15', code: 'US', name: 'United States', flag: '🇺🇸', city: 'Chicago' },
    { cidr: '174.128.0.0/11', code: 'US', name: 'United States', flag: '🇺🇸', city: 'Atlanta' },
    { cidr: '208.67.220.0/22', code: 'US', name: 'United States', flag: '🇺🇸', city: 'Miami' },

    // United Kingdom (GB)
    { cidr: '2.16.0.0/13', code: 'GB', name: 'United Kingdom', flag: '🇬🇧', city: 'London' },
    { cidr: '31.13.64.0/18', code: 'GB', name: 'United Kingdom', flag: '🇬🇧', city: 'Manchester' },
    { cidr: '51.140.0.0/14', code: 'GB', name: 'United Kingdom', flag: '🇬🇧', city: 'Birmingham' },
    { cidr: '82.165.0.0/16', code: 'GB', name: 'United Kingdom', flag: '🇬🇧', city: 'Edinburgh' },
    { cidr: '86.0.0.0/11', code: 'GB', name: 'United Kingdom', flag: '🇬🇧', city: 'Glasgow' },
    { cidr: '151.224.0.0/13', code: 'GB', name: 'United Kingdom', flag: '🇬🇧', city: 'Bristol' },
    { cidr: '185.128.0.0/14', code: 'GB', name: 'United Kingdom', flag: '🇬🇧', city: 'Leeds' },

    // Germany (DE)
    { cidr: '46.163.0.0/16', code: 'DE', name: 'Germany', flag: '🇩🇪', city: 'Berlin' },
    { cidr: '78.46.0.0/15', code: 'DE', name: 'Germany', flag: '🇩🇪', city: 'Nuremberg' },
    { cidr: '84.116.0.0/14', code: 'DE', name: 'Germany', flag: '🇩🇪', city: 'Munich' },
    { cidr: '88.198.0.0/16', code: 'DE', name: 'Germany', flag: '🇩🇪', city: 'Frankfurt' },
    { cidr: '91.136.0.0/14', code: 'DE', name: 'Germany', flag: '🇩🇪', city: 'Hamburg' },
    { cidr: '178.63.0.0/16', code: 'DE', name: 'Germany', flag: '🇩🇪', city: 'Cologne' },

    // Canada (CA)
    { cidr: '24.114.0.0/15', code: 'CA', name: 'Canada', flag: '🇨🇦', city: 'Toronto' },
    { cidr: '65.92.0.0/14', code: 'CA', name: 'Canada', flag: '🇨🇦', city: 'Montreal' },
    { cidr: '142.44.0.0/15', code: 'CA', name: 'Canada', flag: '🇨🇦', city: 'Vancouver' },
    { cidr: '192.197.82.0/24', code: 'CA', name: 'Canada', flag: '🇨🇦', city: 'Ottawa' },
    { cidr: '207.216.0.0/14', code: 'CA', name: 'Canada', flag: '🇨🇦', city: 'Calgary' },

    // Australia (AU)
    { cidr: '1.120.0.0/13', code: 'AU', name: 'Australia', flag: '🇦🇺', city: 'Sydney' },
    { cidr: '13.236.0.0/14', code: 'AU', name: 'Australia', flag: '🇦🇺', city: 'Melbourne' },
    { cidr: '101.160.0.0/11', code: 'AU', name: 'Australia', flag: '🇦🇺', city: 'Brisbane' },
    { cidr: '139.130.0.0/16', code: 'AU', name: 'Australia', flag: '🇦🇺', city: 'Perth' },
    { cidr: '203.2.0.0/15', code: 'AU', name: 'Australia', flag: '🇦🇺', city: 'Adelaide' },

    // Japan (JP)
    { cidr: '118.103.0.0/16', code: 'JP', name: 'Japan', flag: '🇯🇵', city: 'Tokyo' },
    { cidr: '124.32.0.0/11', code: 'JP', name: 'Japan', flag: '🇯🇵', city: 'Osaka' },
    { cidr: '126.0.0.0/9', code: 'JP', name: 'Japan', flag: '🇯🇵', city: 'Kyoto' },
    { cidr: '133.242.0.0/16', code: 'JP', name: 'Japan', flag: '🇯🇵', city: 'Nagoya' },
    { cidr: '210.140.0.0/14', code: 'JP', name: 'Japan', flag: '🇯🇵', city: 'Yokohama' },

    // Singapore (SG)
    { cidr: '116.12.0.0/14', code: 'SG', name: 'Singapore', flag: '🇸🇬', city: 'Singapore' },
    { cidr: '118.188.0.0/14', code: 'SG', name: 'Singapore', flag: '🇸🇬', city: 'Singapore' },
    { cidr: '128.199.192.0/18', code: 'SG', name: 'Singapore', flag: '🇸🇬', city: 'Singapore' },
    { cidr: '175.156.0.0/14', code: 'SG', name: 'Singapore', flag: '🇸🇬', city: 'Singapore' },

    // United Arab Emirates (AE)
    { cidr: '5.36.0.0/14', code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', city: 'Dubai' },
    { cidr: '83.110.0.0/15', code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', city: 'Abu Dhabi' },
    { cidr: '94.200.0.0/14', code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', city: 'Sharjah' },

    // France (FR)
    { cidr: '80.10.0.0/15', code: 'FR', name: 'France', flag: '🇫🇷', city: 'Paris' },
    { cidr: '82.64.0.0/11', code: 'FR', name: 'France', flag: '🇫🇷', city: 'Marseille' },
    { cidr: '90.80.0.0/13', code: 'FR', name: 'France', flag: '🇫🇷', city: 'Lyon' },

    // Brazil (BR)
    { cidr: '177.16.0.0/12', code: 'BR', name: 'Brazil', flag: '🇧🇷', city: 'São Paulo' },
    { cidr: '179.96.0.0/11', code: 'BR', name: 'Brazil', flag: '🇧🇷', city: 'Rio de Janeiro' },
    { cidr: '189.1.0.0/16', code: 'BR', name: 'Brazil', flag: '🇧🇷', city: 'Brasília' },

    // Netherlands (NL)
    { cidr: '62.194.0.0/15', code: 'NL', name: 'Netherlands', flag: '🇳🇱', city: 'Amsterdam' },
    { cidr: '145.131.0.0/16', code: 'NL', name: 'Netherlands', flag: '🇳🇱', city: 'Rotterdam' },

    // South Korea (KR)
    { cidr: '112.160.0.0/11', code: 'KR', name: 'South Korea', flag: '🇰🇷', city: 'Seoul' },
    { cidr: '211.200.0.0/14', code: 'KR', name: 'South Korea', flag: '🇰🇷', city: 'Busan' },

    // Russia (RU)
    { cidr: '77.88.0.0/18', code: 'RU', name: 'Russia', flag: '🇷🇺', city: 'Moscow' },
    { cidr: '95.173.0.0/16', code: 'RU', name: 'Russia', flag: '🇷🇺', city: 'Saint Petersburg' },

    // China (CN)
    { cidr: '110.16.0.0/12', code: 'CN', name: 'China', flag: '🇨🇳', city: 'Beijing' },
    { cidr: '183.0.0.0/10', code: 'CN', name: 'China', flag: '🇨🇳', city: 'Shanghai' },
    { cidr: '220.181.0.0/16', code: 'CN', name: 'China', flag: '🇨🇳', city: 'Shenzhen' },

    // Italy (IT)
    { cidr: '79.0.0.0/11', code: 'IT', name: 'Italy', flag: '🇮🇹', city: 'Rome' },
    { cidr: '151.100.0.0/16', code: 'IT', name: 'Italy', flag: '🇮🇹', city: 'Milan' },

    // Spain (ES)
    { cidr: '80.24.0.0/13', code: 'ES', name: 'Spain', flag: '🇪🇸', city: 'Madrid' },
    { cidr: '88.1.0.0/16', code: 'ES', name: 'Spain', flag: '🇪🇸', city: 'Barcelona' }
];

// Precompute ranges
const PRECOMPUTED_RANGES = COUNTRY_BLOCKS.map(block => {
    const [start, end] = cidrToRange(block.cidr);
    return {
        start,
        end,
        code: block.code,
        name: block.name,
        flag: block.flag,
        city: block.city
    };
});

/**
 * General deterministic IANA allocation fallback for any unlisted public IP.
 * Guarantees every valid IPv4 resolves to a realistic country.
 */
const IANA_OCTET_MAP = [
    { max: 10, code: 'US', name: 'United States', flag: '🇺🇸', city: 'New York' },
    { max: 20, code: 'US', name: 'United States', flag: '🇺🇸', city: 'San Jose' },
    { max: 27, code: 'IN', name: 'India', flag: '🇮🇳', city: 'Bengaluru' },
    { max: 35, code: 'GB', name: 'United Kingdom', flag: '🇬🇧', city: 'London' },
    { max: 45, code: 'CA', name: 'Canada', flag: '🇨🇦', city: 'Toronto' },
    { max: 50, code: 'IN', name: 'India', flag: '🇮🇳', city: 'New Delhi' },
    { max: 60, code: 'US', name: 'United States', flag: '🇺🇸', city: 'Dallas' },
    { max: 70, code: 'US', name: 'United States', flag: '🇺🇸', city: 'Chicago' },
    { max: 80, code: 'DE', name: 'Germany', flag: '🇩🇪', city: 'Frankfurt' },
    { max: 90, code: 'FR', name: 'France', flag: '🇫🇷', city: 'Paris' },
    { max: 100, code: 'GB', name: 'United Kingdom', flag: '🇬🇧', city: 'Manchester' },
    { max: 103, code: 'IN', name: 'India', flag: '🇮🇳', city: 'Jaipur' },
    { max: 105, code: 'US', name: 'United States', flag: '🇺🇸', city: 'San Francisco' },
    { max: 107, code: 'IN', name: 'India', flag: '🇮🇳', city: 'Mumbai' },
    { max: 115, code: 'KR', name: 'South Korea', flag: '🇰🇷', city: 'Seoul' },
    { max: 120, code: 'JP', name: 'Japan', flag: '🇯🇵', city: 'Tokyo' },
    { max: 125, code: 'IN', name: 'India', flag: '🇮🇳', city: 'Jaipur' },
    { max: 135, code: 'AU', name: 'Australia', flag: '🇦🇺', city: 'Sydney' },
    { max: 150, code: 'US', name: 'United States', flag: '🇺🇸', city: 'Atlanta' },
    { max: 160, code: 'IN', name: 'India', flag: '🇮🇳', city: 'Hyderabad' },
    { max: 170, code: 'SG', name: 'Singapore', flag: '🇸🇬', city: 'Singapore' },
    { max: 180, code: 'BR', name: 'Brazil', flag: '🇧🇷', city: 'São Paulo' },
    { max: 190, code: 'NL', name: 'Netherlands', flag: '🇳🇱', city: 'Amsterdam' },
    { max: 205, code: 'IN', name: 'India', flag: '🇮🇳', city: 'Chennai' },
    { max: 215, code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', city: 'Dubai' },
    { max: 230, code: 'JP', name: 'Japan', flag: '🇯🇵', city: 'Osaka' },
    { max: 255, code: 'US', name: 'United States', flag: '🇺🇸', city: 'San Francisco' }
];

/**
 * Check if IP is private, link-local, or loopback
 */
export function isPrivateIp(ipStr) {
    if (!ipStr) return true;
    const clean = ipStr.replace(/^::ffff:/, '').trim();
    if (clean === '127.0.0.1' || clean === '::1' || clean === 'localhost') return true;
    
    const parts = clean.split('.').map(n => parseInt(n, 10));
    if (parts.length !== 4) return true;

    // 10.0.0.0 - 10.255.255.255
    if (parts[0] === 10) return true;
    // 172.16.0.0 - 172.31.255.255
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0 - 192.168.255.255
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 169.254.0.0 - 169.254.255.255 (Link-local)
    if (parts[0] === 169 && parts[1] === 254) return true;

    return false;
}

/**
 * Main IP-to-Country Lookup Function
 */
export function lookupIp(ipStr) {
    const rawIp = (ipStr || '').toString().trim();
    const cleanIp = rawIp.replace(/^::ffff:/, '').trim();

    if (!cleanIp || cleanIp === '127.0.0.1' || cleanIp === '::1' || cleanIp.toLowerCase() === 'localhost') {
        return {
            ip: cleanIp || '127.0.0.1',
            countryCode: 'IN',
            countryName: 'India (Local Host)',
            city: 'Jaipur (Server)',
            flag: '🇮🇳',
            isLocal: true
        };
    }

    if (isPrivateIp(cleanIp)) {
        return {
            ip: cleanIp,
            countryCode: 'IN',
            countryName: 'India (Internal Network)',
            city: 'Local Area Network',
            flag: '🇮🇳',
            isLocal: true
        };
    }

    const ipNum = ipToLong(cleanIp);
    if (ipNum === 0) {
        return {
            ip: cleanIp,
            countryCode: 'UNKNOWN',
            countryName: 'Unknown Location',
            city: 'Unknown City',
            flag: '🌐',
            isLocal: false
        };
    }

    // 1. Search in exact curated ranges
    for (const range of PRECOMPUTED_RANGES) {
        if (ipNum >= range.start && ipNum <= range.end) {
            return {
                ip: cleanIp,
                countryCode: range.code,
                countryName: range.name,
                city: range.city,
                flag: range.flag,
                isLocal: false
            };
        }
    }

    // 2. Deterministic IANA fallback based on first octet
    const firstOctet = parseInt(cleanIp.split('.')[0], 10);
    for (const bucket of IANA_OCTET_MAP) {
        if (firstOctet <= bucket.max) {
            return {
                ip: cleanIp,
                countryCode: bucket.code,
                countryName: bucket.name,
                city: bucket.city,
                flag: bucket.flag,
                isLocal: false
            };
        }
    }

    return {
        ip: cleanIp,
        countryCode: 'US',
        countryName: 'United States',
        city: 'International',
        flag: '🇺🇸',
        isLocal: false
    };
}

/**
 * Extract client IP from request headers or socket
 */
export function getClientIp(req) {
    if (!req) return '127.0.0.1';

    // 1. Check simulation header or simulation query param
    if (req.headers && req.headers['x-simulated-ip']) {
        return req.headers['x-simulated-ip'].toString().trim();
    }
    if (req.query && req.query.simulate_ip) {
        return req.query.simulate_ip.toString().trim();
    }

    // 2. Standard proxy headers
    if (req.headers) {
        const forwarded = req.headers['x-forwarded-for'];
        if (forwarded) {
            const first = forwarded.split(',')[0].trim();
            if (first) return first;
        }
        if (req.headers['x-real-ip']) return req.headers['x-real-ip'].toString().trim();
        if (req.headers['cf-connecting-ip']) return req.headers['cf-connecting-ip'].toString().trim();
    }

    // 3. Socket remote address
    const sockAddr = req.socket?.remoteAddress || req.connection?.remoteAddress || req.ip;
    if (sockAddr) {
        return sockAddr.replace(/^::ffff:/, '').trim();
    }

    return '127.0.0.1';
}

/**
 * Detect client device category from User-Agent
 */
export function detectDevice(userAgent = '') {
    const ua = (userAgent || '').toLowerCase();
    if (!ua || ua.includes('curl') || ua.includes('bot') || ua.includes('simulator') || ua.includes('python') || ua.includes('node')) {
        return 'Simulator / Bot';
    }
    if (ua.includes('ipad') || ua.includes('tablet') || ua.includes('kindle') || ua.includes('playbook')) {
        return 'Tablet';
    }
    if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('android') || ua.includes('blackberry')) {
        return 'Mobile';
    }
    return 'Desktop';
}

/**
 * Realistic Presets for the Traffic Simulator
 */
export const SIMULATOR_PRESETS = [
    { country: 'India', code: 'IN', flag: '🇮🇳', city: 'Mumbai', ip: '49.36.12.85' },
    { country: 'India', code: 'IN', flag: '🇮🇳', city: 'Bengaluru', ip: '106.51.72.19' },
    { country: 'India', code: 'IN', flag: '🇮🇳', city: 'New Delhi', ip: '14.139.60.2' },
    { country: 'India', code: 'IN', flag: '🇮🇳', city: 'Jaipur', ip: '103.21.244.15' },
    { country: 'India', code: 'IN', flag: '🇮🇳', city: 'Hyderabad', ip: '103.50.162.34' },
    { country: 'India', code: 'IN', flag: '🇮🇳', city: 'Pune', ip: '122.161.45.10' },
    { country: 'United States', code: 'US', flag: '🇺🇸', city: 'New York', ip: '142.250.190.46' },
    { country: 'United States', code: 'US', flag: '🇺🇸', city: 'San Francisco', ip: '104.244.42.1' },
    { country: 'United States', code: 'US', flag: '🇺🇸', city: 'Seattle', ip: '52.11.23.45' },
    { country: 'United States', code: 'US', flag: '🇺🇸', city: 'Chicago', ip: '64.233.160.1' },
    { country: 'United Kingdom', code: 'GB', flag: '🇬🇧', city: 'London', ip: '82.165.197.1' },
    { country: 'United Kingdom', code: 'GB', flag: '🇬🇧', city: 'Manchester', ip: '31.13.65.1' },
    { country: 'Germany', code: 'DE', flag: '🇩🇪', city: 'Frankfurt', ip: '88.198.24.12' },
    { country: 'Germany', code: 'DE', flag: '🇩🇪', city: 'Berlin', ip: '46.163.78.20' },
    { country: 'Canada', code: 'CA', flag: '🇨🇦', city: 'Toronto', ip: '24.114.32.1' },
    { country: 'Canada', code: 'CA', flag: '🇨🇦', city: 'Vancouver', ip: '142.44.215.1' },
    { country: 'Australia', code: 'AU', flag: '🇦🇺', city: 'Sydney', ip: '1.120.45.67' },
    { country: 'Australia', code: 'AU', flag: '🇦🇺', city: 'Melbourne', ip: '139.130.4.5' },
    { country: 'Japan', code: 'JP', flag: '🇯🇵', city: 'Tokyo', ip: '118.103.2.14' },
    { country: 'Japan', code: 'JP', flag: '🇯🇵', city: 'Osaka', ip: '133.242.18.9' },
    { country: 'Singapore', code: 'SG', flag: '🇸🇬', city: 'Singapore', ip: '128.199.200.1' },
    { country: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', city: 'Dubai', ip: '94.200.15.22' },
    { country: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', city: 'Abu Dhabi', ip: '83.110.45.10' },
    { country: 'France', code: 'FR', flag: '🇫🇷', city: 'Paris', ip: '80.10.12.34' },
    { country: 'Brazil', code: 'BR', flag: '🇧🇷', city: 'São Paulo', ip: '177.18.29.34' },
    { country: 'Netherlands', code: 'NL', flag: '🇳🇱', city: 'Amsterdam', ip: '145.131.39.10' },
    { country: 'South Korea', code: 'KR', flag: '🇰🇷', city: 'Seoul', ip: '112.170.12.3' },
    { country: 'Russia', code: 'RU', flag: '🇷🇺', city: 'Moscow', ip: '77.88.21.11' },
    { country: 'China', code: 'CN', flag: '🇨🇳', city: 'Beijing', ip: '110.16.55.4' },
    { country: 'Italy', code: 'IT', flag: '🇮🇹', city: 'Rome', ip: '79.12.34.56' },
    { country: 'Spain', code: 'ES', flag: '🇪🇸', city: 'Madrid', ip: '80.24.11.89' }
];
