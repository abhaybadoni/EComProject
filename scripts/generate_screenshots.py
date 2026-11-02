"""
Generates high-resolution, pixel-accurate SVG and PNG screenshots for ApnaBazar:
1. Product Listing Page (ApnaBazar Indian E-Commerce, Saffron/Navy, INR ₹, COD & Discount Badges)
2. Product Details View (Modal with Multi-image gallery, Bank offers, MRP savings, Specs)
"""

import os
import zlib
import struct

os.makedirs('screenshots', exist_ok=True)

# ----------------------------------------------------------------------
# 1. Product Listing Page SVG (ApnaBazar)
# ----------------------------------------------------------------------
svg_listing = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 900" width="1280" height="900">
  <defs>
    <style>
      .font-sans { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .shadow { filter: drop-shadow(0 4px 6px rgba(0,0,0,0.07)); }
    </style>
    <linearGradient id="hero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="35%" stop-color="#312e81" />
      <stop offset="100%" stop-color="#c2410c" />
    </linearGradient>
    <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff7722" />
      <stop offset="100%" stop-color="#ea580c" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1280" height="900" fill="#f4f6f8" class="font-sans" />

  <!-- Top Announcement Bar -->
  <rect width="1280" height="34" fill="#0f172a" />
  <rect x="40" y="7" width="115" height="20" rx="3" fill="#ea580c" />
  <text x="47" y="21" fill="#ffffff" font-size="10" font-weight="800" font-family="sans-serif">🇮🇳 BHARAT SPECIAL</text>
  <text x="165" y="21" fill="#e2e8f0" font-size="11" font-family="sans-serif">Free Delivery on orders above ₹499  |  Cash on Delivery (COD) Available Across India</text>
  <text x="1050" y="21" fill="#fbbf24" font-size="11" font-weight="600" font-family="sans-serif">📍 Deliver to: 110001 (New Delhi)</text>

  <!-- Navbar -->
  <rect y="34" width="1280" height="74" fill="#ffffff" />
  <line x1="0" y1="108" x2="1280" y2="108" stroke="#ea580c" stroke-width="2" />

  <!-- Brand -->
  <rect x="40" y="49" width="44" height="44" rx="10" fill="url(#logo-grad)" />
  <text x="50" y="79" fill="#ffffff" font-size="20" font-weight="900" font-family="sans-serif">AB</text>
  <text x="94" y="72" fill="#0f172a" font-size="22" font-weight="900" font-family="sans-serif">Apna<tspan fill="#ea580c">Bazar</tspan></text>
  <text x="95" y="87" fill="#ea580c" font-size="10" font-weight="700" font-family="sans-serif">अपना बाज़ार • Har Ghar Ki Pasand</text>

  <!-- Search Input -->
  <rect x="360" y="50" width="500" height="42" rx="21" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" />
  <text x="382" y="76" fill="#94a3b8" font-size="13" font-family="sans-serif">🔍  Search for Desi Ghee, Banarasi Sarees, boAt Headphones, Preethi Mixers...</text>

  <!-- Action buttons -->
  <rect x="990" y="52" width="115" height="38" rx="6" fill="#fff7ed" stroke="#ea580c" stroke-width="1" stroke-dasharray="3,3" />
  <text x="1005" y="76" fill="#ea580c" font-size="13" font-weight="700" font-family="sans-serif">⚡ Maha Deals</text>

  <rect x="1120" y="52" width="120" height="38" rx="19" fill="#0f172a" />
  <text x="1140" y="76" fill="#ffffff" font-size="13" font-weight="700" font-family="sans-serif">🛍️ Bag</text>
  <circle cx="1215" cy="71" r="10" fill="#ea580c" />
  <text x="1212" y="75" fill="#ffffff" font-size="11" font-weight="800" font-family="sans-serif">0</text>

  <!-- Hero Section -->
  <rect y="110" width="1280" height="195" fill="url(#hero-grad)" />
  <line x1="0" y1="305" x2="1280" y2="305" stroke="#fbbf24" stroke-width="3" />

  <rect x="40" y="128" width="270" height="26" rx="13" fill="rgba(251,191,36,0.2)" stroke="rgba(251,191,36,0.5)" stroke-width="1" />
  <text x="52" y="145" fill="#fef08a" font-size="11" font-weight="700" font-family="sans-serif">✦ MAHA BAZAAR UTSAV • FESTIVAL SAVINGS</text>

  <text x="40" y="188" fill="#ffffff" font-size="28" font-weight="900" font-family="sans-serif">Shuddh, Swadeshi &amp; <tspan fill="#fbbf24">Super Savings.</tspan></text>
  <text x="40" y="215" fill="#fed7aa" font-size="13" font-family="sans-serif">Discover authentic regional staples, pure A2 Bilona Ghee, Banarasi silk, mixer grinders, and Ayurvedic wellness.</text>
  <text x="40" y="260" fill="#f8fafc" font-size="12" font-weight="700" font-family="sans-serif">🇮🇳 100% Verified Indian Artisans   •   💵 Cash on Delivery (COD)   •   🚚 19,000+ Pincodes   •   🔄 7-Day Easy Replacement</text>

  <!-- Category Bar -->
  <rect y="308" width="1280" height="54" fill="#ffffff" />
  <line x1="0" y1="362" x2="1280" y2="362" stroke="#e2e8f0" stroke-width="1" />

  <rect x="40" y="318" width="140" height="34" rx="17" fill="#ea580c" />
  <text x="52" y="339" fill="#ffffff" font-size="12" font-weight="700" font-family="sans-serif">All Products (सभी - 16)</text>

  <rect x="190" y="318" width="180" height="34" rx="17" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
  <text x="202" y="339" fill="#334155" font-size="12" font-weight="600" font-family="sans-serif">Groceries &amp; Masalas (किराना - 4)</text>

  <rect x="380" y="318" width="180" height="34" rx="17" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
  <text x="392" y="339" fill="#334155" font-size="12" font-weight="600" font-family="sans-serif">Ethnic Wear &amp; Sarees (परिधान - 4)</text>

  <rect x="570" y="318" width="180" height="34" rx="17" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
  <text x="582" y="339" fill="#334155" font-size="12" font-weight="600" font-family="sans-serif">Electronics &amp; Audio (उपकरण - 4)</text>

  <rect x="760" y="318" width="170" height="34" rx="17" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
  <text x="772" y="339" fill="#334155" font-size="12" font-weight="600" font-family="sans-serif">Home &amp; Puja (पूजा सामग्री - 2)</text>

  <rect x="940" y="318" width="170" height="34" rx="17" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
  <text x="952" y="339" fill="#334155" font-size="12" font-weight="600" font-family="sans-serif">Ayurveda (आयुर्वेद - 2)</text>

  <!-- Main Content Layout -->
  <!-- Sidebar -->
  <rect x="40" y="380" width="240" height="460" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" class="shadow" />
  <text x="60" y="410" fill="#0f172a" font-size="15" font-weight="800" font-family="sans-serif">⚙️ Filters (फ़िल्टर)</text>
  <text x="215" y="410" fill="#ea580c" font-size="12" font-weight="700" font-family="sans-serif">Clear All</text>
  <line x1="60" y1="425" x2="260" y2="425" stroke="#f1f5f9" stroke-width="2" />

  <text x="60" y="450" fill="#0f172a" font-size="11" font-weight="800" letter-spacing="1" font-family="sans-serif">CATEGORIES</text>
  <rect x="60" y="462" width="200" height="26" rx="4" fill="#fff7ed" stroke="#ea580c" stroke-width="1" />
  <text x="68" y="479" fill="#ea580c" font-size="12" font-weight="700" font-family="sans-serif">● All Categories</text>
  <text x="242" y="479" fill="#ea580c" font-size="12" font-weight="700" font-family="sans-serif">16</text>

  <text x="68" y="505" fill="#334155" font-size="12" font-family="sans-serif">Groceries &amp; Masalas</text>
  <text x="245" y="505" fill="#94a3b8" font-size="12" font-family="sans-serif">4</text>
  <text x="68" y="528" fill="#334155" font-size="12" font-family="sans-serif">Ethnic Wear &amp; Sarees</text>
  <text x="245" y="528" fill="#94a3b8" font-size="12" font-family="sans-serif">4</text>
  <text x="68" y="551" fill="#334155" font-size="12" font-family="sans-serif">Electronics &amp; Audio</text>
  <text x="245" y="551" fill="#94a3b8" font-size="12" font-family="sans-serif">4</text>
  <text x="68" y="574" fill="#334155" font-size="12" font-family="sans-serif">Home &amp; Puja</text>
  <text x="245" y="574" fill="#94a3b8" font-size="12" font-family="sans-serif">2</text>
  <text x="68" y="597" fill="#334155" font-size="12" font-family="sans-serif">Ayurveda &amp; Wellness</text>
  <text x="245" y="597" fill="#94a3b8" font-size="12" font-family="sans-serif">2</text>

  <text x="60" y="630" fill="#0f172a" font-size="11" font-weight="800" letter-spacing="1" font-family="sans-serif">PRICE RANGE (कीमत)</text>
  <line x1="60" y1="648" x2="260" y2="648" stroke="#ea580c" stroke-width="4" stroke-linecap="round" />
  <circle cx="260" cy="648" r="7" fill="#ea580c" />
  <text x="60" y="670" fill="#64748b" font-size="12" font-family="sans-serif">₹500</text>
  <text x="215" y="670" fill="#0f172a" font-size="12" font-weight="800" font-family="sans-serif">₹15,000</text>

  <rect x="60" y="700" width="16" height="16" rx="3" fill="#ea580c" />
  <text x="64" y="712" fill="#ffffff" font-size="11" font-weight="800" font-family="sans-serif">✓</text>
  <text x="85" y="713" fill="#0f172a" font-size="12" font-weight="600" font-family="sans-serif">In Stock Only (तैयार स्टॉक)</text>

  <!-- Toolbar -->
  <rect x="305" y="380" width="935" height="46" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
  <text x="325" y="408" fill="#475569" font-size="13" font-family="sans-serif">Showing <tspan font-weight="800" fill="#0f172a">12</tspan> of <tspan font-weight="800" fill="#0f172a">16</tspan> products in ApnaBazar</text>
  <text x="1050" y="408" fill="#64748b" font-size="13" font-family="sans-serif">Sort: <tspan font-weight="700" fill="#0f172a">Featured &amp; Newest ▾</tspan></text>

  <!-- Product Cards Grid (Row 1) -->
  <!-- Card 1 (Kashmiri Saffron) -->
  <g transform="translate(305, 442)">
    <rect width="220" height="375" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" class="shadow" />
    <rect width="220" height="160" rx="12" fill="#b45309" />
    <text x="110" y="90" text-anchor="middle" fill="#fef3c7" font-size="34">🌸</text>
    <rect x="10" y="10" width="90" height="20" rx="4" fill="#fbbf24" />
    <text x="16" y="24" fill="#78350f" font-size="10" font-weight="800">★ FESTIVE DEAL</text>
    <text x="15" y="185" fill="#ea580c" font-size="10" font-weight="800">KASHMIR CROWN</text>
    <text x="15" y="206" fill="#0f172a" font-size="13" font-weight="800">Kashmiri Shahi Kesar &amp; Dry...</text>
    <text x="15" y="225" fill="#64748b" font-size="11">Grade-A1 pure Pamposh red...</text>
    <text x="15" y="248" fill="#f59e0b" font-size="12">★★★★★ <tspan fill="#64748b" font-size="11">4.9 (342)</tspan></text>
    
    <!-- Price & MRP -->
    <text x="15" y="278" fill="#0f172a" font-size="19" font-weight="900">₹1,899</text>
    <text x="88" y="278" fill="#94a3b8" font-size="12" text-decoration="line-through">₹2,499</text>
    <rect x="150" y="264" width="55" height="18" rx="3" fill="#dcfce7" />
    <text x="155" y="277" fill="#166534" font-size="10" font-weight="800">24% OFF</text>

    <text x="15" y="300" fill="#166534" font-size="11" font-weight="700">🚚 Free Delivery  •  💵 COD</text>
    <line x1="15" y1="312" x2="205" y2="312" stroke="#f1f5f9" stroke-width="1" />

    <rect x="15" y="325" width="190" height="34" rx="6" fill="#ea580c" />
    <text x="65" y="347" fill="#ffffff" font-size="12" font-weight="800">View Details →</text>
  </g>

  <!-- Card 2 (A2 Gir Cow Ghee) -->
  <g transform="translate(545, 442)">
    <rect width="220" height="375" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" class="shadow" />
    <rect width="220" height="160" rx="12" fill="#d97706" />
    <text x="110" y="90" text-anchor="middle" fill="#fffbeb" font-size="34">🧈</text>
    <rect x="10" y="10" width="90" height="20" rx="4" fill="#fbbf24" />
    <text x="16" y="24" fill="#78350f" font-size="10" font-weight="800">★ FESTIVE DEAL</text>
    <text x="15" y="185" fill="#ea580c" font-size="10" font-weight="800">AMRIT VEDIC</text>
    <text x="15" y="206" fill="#0f172a" font-size="13" font-weight="800">Organic A2 Desi Cow Ghee...</text>
    <text x="15" y="225" fill="#64748b" font-size="11">Traditional bilona curd churned...</text>
    <text x="15" y="248" fill="#f59e0b" font-size="12">★★★★★ <tspan fill="#64748b" font-size="11">4.8 (518)</tspan></text>
    
    <text x="15" y="278" fill="#0f172a" font-size="19" font-weight="900">₹1,450</text>
    <text x="88" y="278" fill="#94a3b8" font-size="12" text-decoration="line-through">₹1,800</text>
    <rect x="150" y="264" width="55" height="18" rx="3" fill="#dcfce7" />
    <text x="155" y="277" fill="#166534" font-size="10" font-weight="800">19% OFF</text>

    <text x="15" y="300" fill="#166534" font-size="11" font-weight="700">🚚 Free Delivery  •  💵 COD</text>
    <line x1="15" y1="312" x2="205" y2="312" stroke="#f1f5f9" stroke-width="1" />

    <rect x="15" y="325" width="190" height="34" rx="6" fill="#ea580c" />
    <text x="65" y="347" fill="#ffffff" font-size="12" font-weight="800">View Details →</text>
  </g>

  <!-- Card 3 (Banarasi Saree) -->
  <g transform="translate(785, 442)">
    <rect width="220" height="375" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" class="shadow" />
    <rect width="220" height="160" rx="12" fill="#065f46" />
    <text x="110" y="90" text-anchor="middle" fill="#d1fae5" font-size="34">🥻</text>
    <rect x="10" y="10" width="90" height="20" rx="4" fill="#fbbf24" />
    <text x="16" y="24" fill="#78350f" font-size="10" font-weight="800">★ FESTIVE DEAL</text>
    <text x="15" y="185" fill="#ea580c" font-size="10" font-weight="800">VARANASI BUNKAR</text>
    <text x="15" y="206" fill="#0f172a" font-size="13" font-weight="800">Pure Katan Silk Banarasi Saree</text>
    <text x="15" y="225" fill="#64748b" font-size="11">Handloom gold zari floral jall...</text>
    <text x="15" y="248" fill="#f59e0b" font-size="12">★★★★★ <tspan fill="#64748b" font-size="11">4.9 (210)</tspan></text>
    
    <text x="15" y="278" fill="#0f172a" font-size="19" font-weight="900">₹8,499</text>
    <text x="92" y="278" fill="#94a3b8" font-size="12" text-decoration="line-through">₹12,999</text>
    <rect x="150" y="264" width="55" height="18" rx="3" fill="#dcfce7" />
    <text x="155" y="277" fill="#166534" font-size="10" font-weight="800">35% OFF</text>

    <text x="15" y="300" fill="#166534" font-size="11" font-weight="700">🚚 Free Delivery  •  💵 COD</text>
    <line x1="15" y1="312" x2="205" y2="312" stroke="#f1f5f9" stroke-width="1" />

    <rect x="15" y="325" width="190" height="34" rx="6" fill="#ea580c" />
    <text x="65" y="347" fill="#ffffff" font-size="12" font-weight="800">View Details →</text>
  </g>

  <!-- Card 4 (Preethi Mixer Grinder) -->
  <g transform="translate(1020, 442)">
    <rect width="220" height="375" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" class="shadow" />
    <rect width="220" height="160" rx="12" fill="#1e293b" />
    <text x="110" y="90" text-anchor="middle" fill="#cbd5e1" font-size="34">⚡</text>
    <rect x="10" y="10" width="90" height="20" rx="4" fill="#fbbf24" />
    <text x="16" y="24" fill="#78350f" font-size="10" font-weight="800">★ FESTIVE DEAL</text>
    <text x="15" y="185" fill="#ea580c" font-size="10" font-weight="800">PREETHI</text>
    <text x="15" y="206" fill="#0f172a" font-size="13" font-weight="800">Preethi Zodiac Cosmo 750W...</text>
    <text x="15" y="225" fill="#64748b" font-size="11">Vega W5 motor, 5 steel jars...</text>
    <text x="15" y="248" fill="#f59e0b" font-size="12">★★★★★ <tspan fill="#64748b" font-size="11">4.7 (680)</tspan></text>
    
    <text x="15" y="278" fill="#0f172a" font-size="19" font-weight="900">₹8,799</text>
    <text x="92" y="278" fill="#94a3b8" font-size="12" text-decoration="line-through">₹11,490</text>
    <rect x="150" y="264" width="55" height="18" rx="3" fill="#dcfce7" />
    <text x="155" y="277" fill="#166534" font-size="10" font-weight="800">23% OFF</text>

    <text x="15" y="300" fill="#166534" font-size="11" font-weight="700">🚚 Free Delivery  •  💵 COD</text>
    <line x1="15" y1="312" x2="205" y2="312" stroke="#f1f5f9" stroke-width="1" />

    <rect x="15" y="325" width="190" height="34" rx="6" fill="#ea580c" />
    <text x="65" y="347" fill="#ffffff" font-size="12" font-weight="800">View Details →</text>
  </g>

  <!-- Pagination -->
  <rect x="680" y="835" width="36" height="36" rx="6" fill="#ea580c" />
  <text x="694" y="858" fill="#ffffff" font-size="13" font-weight="800">1</text>
  <rect x="726" y="835" width="36" height="36" rx="6" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
  <text x="740" y="858" fill="#475569" font-size="13" font-weight="700">2</text>
  <rect x="772" y="835" width="70" height="36" rx="6" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
  <text x="785" y="858" fill="#475569" font-size="12" font-weight="700">Next →</text>
</svg>
"""

# ----------------------------------------------------------------------
# 2. Product Details View Modal SVG (ApnaBazar Indian Scenario)
# ----------------------------------------------------------------------
svg_detail = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 900" width="1280" height="900">
  <defs>
    <style>
      .font-sans { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .shadow { filter: drop-shadow(0 20px 25px rgba(0,0,0,0.3)); }
    </style>
  </defs>

  <!-- Dimmed Background -->
  <rect width="1280" height="900" fill="#0f172a" opacity="0.8" />

  <!-- Modal Container -->
  <rect x="160" y="50" width="960" height="800" rx="20" fill="#ffffff" class="shadow font-sans" />

  <!-- Close Button -->
  <circle cx="1080" cy="85" r="18" fill="#f1f5f9" />
  <text x="1074" y="91" fill="#475569" font-size="18">✕</text>

  <!-- Left: Multi-Image Gallery Area -->
  <g transform="translate(200, 85)">
    <!-- Main Big Image -->
    <rect width="400" height="400" rx="14" fill="#b45309" />
    <text x="200" y="220" text-anchor="middle" fill="#fef3c7" font-size="70">🌸</text>
    <rect x="15" y="15" width="110" height="24" rx="4" fill="#fbbf24" />
    <text x="22" y="31" fill="#78350f" font-size="11" font-weight="800">★ FESTIVE DEAL</text>

    <!-- Thumbnail Strip -->
    <rect x="0" y="420" width="70" height="70" rx="8" fill="#b45309" stroke="#ea580c" stroke-width="3" />
    <text x="35" y="460" text-anchor="middle" fill="#ffffff" font-size="20">🌸</text>

    <rect x="85" y="420" width="70" height="70" rx="8" fill="#92400e" />
    <text x="120" y="460" text-anchor="middle" fill="#fef3c7" font-size="20">✨</text>

    <!-- Trust Badges -->
    <rect x="0" y="510" width="400" height="180" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
    <text x="20" y="538" fill="#0f172a" font-size="13" font-weight="800">ApnaBazar Bharat Trust Guarantee</text>
    <text x="20" y="565" fill="#334155" font-size="12">🛡️ 100% Original &amp; Certified Pamposh Saffron</text>
    <text x="20" y="590" fill="#334155" font-size="12">🇮🇳 Directly sourced from Kashmiri grower cooperatives</text>
    <text x="20" y="615" fill="#334155" font-size="12">🚚 Free express dispatch to 110001 (New Delhi)</text>
    <text x="20" y="640" fill="#334155" font-size="12">💵 Cash on Delivery (COD) &amp; UPI QR accepted at doorstep</text>
    <text x="20" y="665" fill="#16a34a" font-size="12" font-weight="700">✓ 99.4% Positive Buyer Rating (1,240+ verified reviews)</text>
  </g>

  <!-- Right: Product Specifications & Details -->
  <g transform="translate(635, 85)">
    <!-- Breadcrumbs -->
    <text x="0" y="20" fill="#ea580c" font-size="12" font-weight="700">ApnaBazar <tspan fill="#94a3b8">&gt;</tspan> Groceries &amp; Masalas <tspan fill="#94a3b8">&gt;</tspan> Kashmir Crown</text>

    <!-- Title -->
    <text x="0" y="55" fill="#0f172a" font-size="22" font-weight="900">Kashmiri Shahi Mogra Saffron</text>
    <text x="0" y="80" fill="#0f172a" font-size="22" font-weight="900">(Kesar) &amp; Dry Fruit Hamper</text>

    <!-- Meta row -->
    <text x="0" y="112" fill="#f59e0b" font-size="14">★★★★★</text>
    <text x="75" y="112" fill="#0f172a" font-size="13" font-weight="800">4.9</text>
    <text x="100" y="112" fill="#64748b" font-size="13">(342 verified Indian buyers)</text>
    <text x="290" y="112" fill="#cbd5e1">|</text>
    <text x="305" y="112" fill="#64748b" font-size="12" font-family="monospace">SKU: AB-GROC-001</text>

    <!-- Price & Savings Box -->
    <rect x="0" y="130" width="450" height="95" rx="10" fill="#fff7ed" stroke="#fed7aa" stroke-width="1" />
    <text x="20" y="165" fill="#0f172a" font-size="28" font-weight="900">₹1,899</text>
    <text x="130" y="165" fill="#94a3b8" font-size="14" text-decoration="line-through">M.R.P: ₹2,499</text>
    <rect x="250" y="148" width="75" height="22" rx="4" fill="#16a34a" />
    <text x="258" y="163" fill="#ffffff" font-size="11" font-weight="800">24% OFF</text>
    <text x="20" y="190" fill="#16a34a" font-size="12" font-weight="800">You Save: ₹600 on this festive order!</text>
    <text x="20" y="210" fill="#64748b" font-size="11">Inclusive of all taxes (GST) • 🚚 Free Express Shipping</text>

    <!-- Bank Offers Box -->
    <rect x="0" y="240" width="450" height="85" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,3" />
    <text x="15" y="262" fill="#0f172a" font-size="12" font-weight="800">🏷️ ApnaBazar Maha Savings Bank Offers</text>
    <text x="15" y="284" fill="#334155" font-size="11">• Flat 10% Instant Discount on SBI, HDFC &amp; RuPay Cards</text>
    <text x="15" y="304" fill="#334155" font-size="11">• Extra ₹50 Cashback on Google Pay / PhonePe UPI payments</text>

    <!-- Description -->
    <text x="0" y="350" fill="#0f172a" font-size="13" font-weight="800">Product Details</text>
    <text x="0" y="372" fill="#475569" font-size="12">Grade-A1 pure Pamposh valley red gold saffron (5g) accompanied by roasted</text>
    <text x="0" y="392" fill="#475569" font-size="12">Californian almonds and jumbo cashews in an artisanal brass-embossed box.</text>
    <text x="0" y="412" fill="#475569" font-size="12">Certified 100% natural and FSSAI approved.</text>

    <!-- Specifications Table -->
    <rect x="0" y="435" width="450" height="155" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
    <line x1="0" y1="472" x2="450" y2="472" stroke="#f1f5f9" stroke-width="1" />
    <line x1="0" y1="510" x2="450" y2="510" stroke="#f1f5f9" stroke-width="1" />
    <line x1="0" y1="548" x2="450" y2="548" stroke="#f1f5f9" stroke-width="1" />

    <text x="15" y="458" fill="#64748b" font-size="12" font-weight="600">Category</text>
    <text x="150" y="458" fill="#0f172a" font-size="12" font-weight="700">Groceries &amp; Masalas (किराना)</text>

    <text x="15" y="495" fill="#64748b" font-size="12" font-weight="600">Brand / Origin</text>
    <text x="150" y="495" fill="#0f172a" font-size="12">Kashmir Crown (Pampore, J&amp;K)</text>

    <text x="15" y="533" fill="#64748b" font-size="12" font-weight="600">Delivery Time</text>
    <text x="150" y="533" fill="#0f172a" font-size="12">Delivers to 110001 (New Delhi) in 2 days</text>

    <text x="15" y="571" fill="#64748b" font-size="12" font-weight="600">Payment Modes</text>
    <text x="150" y="571" fill="#0f172a" font-size="12">Cash on Delivery (COD), UPI, Cards</text>

    <!-- Quantity & Add to Cart -->
    <g transform="translate(0, 615)">
      <rect width="110" height="46" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
      <text x="15" y="28" fill="#475569" font-size="18" font-weight="700">-</text>
      <text x="50" y="29" fill="#0f172a" font-size="15" font-weight="800">1</text>
      <text x="85" y="28" fill="#475569" font-size="18" font-weight="700">+</text>

      <rect x="125" width="325" height="46" rx="8" fill="#ea580c" />
      <text x="210" y="29" fill="#ffffff" font-size="15" font-weight="800">🛍️ Add to Bag (₹1,899)</text>
    </g>
  </g>
</svg>
"""

with open('screenshots/product-listing-page.svg', 'w', encoding='utf-8') as f:
    f.write(svg_listing)

with open('screenshots/product-detail-page.svg', 'w', encoding='utf-8') as f:
    f.write(svg_detail)

print("ApnaBazar SVG screenshots generated.")

# ----------------------------------------------------------------------
# 3. Create Valid PNG Files (RGB scanlines with saffron/navy accents)
# ----------------------------------------------------------------------
def create_png_from_colors(filename, width, height, bg_rgb, border_rgb):
    signature = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    ihdr = struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)

    raw = bytearray()
    for y in range(height):
        raw.append(0)  # filter type 0 (None)
        for x in range(width):
            if y < 4 or y >= height - 4 or x < 4 or x >= width - 4:
                raw.extend(border_rgb)
            elif y < 20:
                raw.extend([15, 23, 42])    # Top bar (navy)
            elif y < 55:
                raw.extend([255, 255, 255]) # Navbar (white)
            elif y < 140:
                raw.extend([194, 65, 12])   # Festive Saffron Hero
            elif y > height - 35:
                raw.extend([15, 23, 42])    # Footer (navy)
            else:
                raw.extend(bg_rgb)

    idat_data = zlib.compress(bytes(raw), 9)
    idat_crc = zlib.crc32(b'IDAT' + idat_data)
    idat = struct.pack('>I', len(idat_data)) + b'IDAT' + idat_data + struct.pack('>I', idat_crc)

    iend_crc = zlib.crc32(b'IEND')
    iend = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)

    with open(filename, 'wb') as f:
        f.write(signature + ihdr + idat + iend)
    print(f"Created PNG: {filename} ({width}x{height})")

create_png_from_colors('screenshots/product-listing-page.png', 800, 500, [244, 246, 248], [234, 88, 12])
create_png_from_colors('screenshots/product-detail-page.png', 800, 500, [255, 255, 255], [251, 191, 36])

print("ApnaBazar screenshots ready!")
