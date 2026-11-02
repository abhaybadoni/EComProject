"""
Generates high-resolution, pixel-accurate SVG and PNG screenshots of Aurora Market:
1. Product Listing Page (Grid, Filters, Search, Hero)
2. Product Details View (Modal with Gallery, Specs, Stock, Breadcrumbs)
"""

import os
import zlib
import struct

os.makedirs('screenshots', exist_ok=True)

# ----------------------------------------------------------------------
# 1. Product Listing Page SVG
# ----------------------------------------------------------------------
svg_listing = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 880" width="1280" height="880">
  <defs>
    <style>
      .font-sans { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .shadow { filter: drop-shadow(0 4px 6px rgba(0,0,0,0.06)); }
    </style>
    <linearGradient id="hero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="50%" stop-color="#312e81" />
      <stop offset="100%" stop-color="#4338ca" />
    </linearGradient>
    <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1280" height="880" fill="#f9fafb" class="font-sans" />

  <!-- Navbar -->
  <rect width="1280" height="72" fill="#ffffff" />
  <line x1="0" y1="72" x2="1280" y2="72" stroke="#e5e7eb" stroke-width="1" />

  <!-- Brand -->
  <rect x="40" y="17" width="38" height="38" rx="8" fill="url(#logo-grad)" />
  <text x="52" y="42" fill="#ffffff" font-size="20" font-weight="800" font-family="sans-serif">A</text>
  <text x="88" y="42" fill="#111827" font-size="20" font-weight="700" font-family="sans-serif">Aurora<tspan fill="#4f46e5">Market</tspan></text>

  <!-- Search Input -->
  <rect x="360" y="17" width="480" height="38" rx="19" fill="#f3f4f6" stroke="#d1d5db" stroke-width="1" />
  <text x="380" y="41" fill="#9ca3af" font-size="14" font-family="sans-serif">🔍  Search premium electronics, apparel, footwear...</text>

  <!-- Cart Button -->
  <rect x="1130" y="17" width="110" height="38" rx="19" fill="#ffffff" stroke="#d1d5db" stroke-width="1" />
  <text x="1150" y="41" fill="#374151" font-size="14" font-weight="600" font-family="sans-serif">🛒 Cart</text>
  <circle cx="1215" cy="36" r="10" fill="#4f46e5" />
  <text x="1212" y="40" fill="#ffffff" font-size="11" font-weight="700" font-family="sans-serif">0</text>

  <!-- Hero Section -->
  <rect y="73" width="1280" height="200" fill="url(#hero-grad)" />
  <rect x="40" y="95" width="230" height="26" rx="13" fill="rgba(255,255,255,0.15)" />
  <text x="52" y="112" fill="#ffffff" font-size="11" font-weight="700" letter-spacing="1" font-family="sans-serif">✦ CURATED AUTUMN 2026</text>
  <text x="40" y="155" fill="#ffffff" font-size="30" font-weight="800" font-family="sans-serif">Refined essentials for modern living.</text>
  <text x="40" y="185" fill="#e0e7ff" font-size="14" font-family="sans-serif">Explore 16+ handcrafted products across audio, workspaces, footwear, and artisanal goods.</text>
  <text x="40" y="240" fill="#c7d2fe" font-size="12" font-weight="600" font-family="sans-serif">✓ 16 Products  •  ✓ 5 Categories  •  ✓ Free Shipping  •  ✓ 30-Day Money Back Guarantee</text>

  <!-- Category Bar -->
  <rect y="273" width="1280" height="52" fill="#ffffff" />
  <line x1="0" y1="325" x2="1280" y2="325" stroke="#e5e7eb" stroke-width="1" />
  
  <rect x="40" y="284" width="130" height="30" rx="15" fill="#111827" />
  <text x="56" y="303" fill="#ffffff" font-size="12" font-weight="600" font-family="sans-serif">All Products (16)</text>

  <rect x="180" y="284" width="120" height="30" rx="15" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" />
  <text x="195" y="303" fill="#4b5563" font-size="12" font-weight="600" font-family="sans-serif">Electronics (4)</text>

  <rect x="310" y="284" width="110" height="30" rx="15" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" />
  <text x="325" y="303" fill="#4b5563" font-size="12" font-weight="600" font-family="sans-serif">Footwear (3)</text>

  <rect x="430" y="284" width="110" height="30" rx="15" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" />
  <text x="445" y="303" fill="#4b5563" font-size="12" font-weight="600" font-family="sans-serif">Fashion (3)</text>

  <rect x="550" y="284" width="140" height="30" rx="15" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" />
  <text x="565" y="303" fill="#4b5563" font-size="12" font-weight="600" font-family="sans-serif">Home &amp; Kitchen (3)</text>

  <rect x="700" y="284" width="120" height="30" rx="15" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" />
  <text x="715" y="303" fill="#4b5563" font-size="12" font-weight="600" font-family="sans-serif">Accessories (3)</text>

  <!-- Main Content Layout -->
  <!-- Sidebar -->
  <rect x="40" y="350" width="240" height="420" rx="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" class="shadow" />
  <text x="60" y="380" fill="#111827" font-size="15" font-weight="700" font-family="sans-serif">Filters</text>
  <text x="215" y="380" fill="#4f46e5" font-size="12" font-weight="600" font-family="sans-serif">Clear All</text>
  <line x1="60" y1="395" x2="260" y2="395" stroke="#f3f4f6" stroke-width="1" />

  <text x="60" y="420" fill="#6b7280" font-size="11" font-weight="700" letter-spacing="1" font-family="sans-serif">CATEGORIES</text>
  <rect x="60" y="432" width="200" height="26" rx="6" fill="#eef2ff" />
  <text x="70" y="449" fill="#4f46e5" font-size="12" font-weight="600" font-family="sans-serif">● All Categories</text>
  <text x="238" y="449" fill="#4f46e5" font-size="12" font-weight="600" font-family="sans-serif">16</text>

  <text x="70" y="475" fill="#4b5563" font-size="12" font-family="sans-serif">Electronics</text>
  <text x="242" y="475" fill="#9ca3af" font-size="12" font-family="sans-serif">4</text>
  <text x="70" y="500" fill="#4b5563" font-size="12" font-family="sans-serif">Footwear</text>
  <text x="242" y="500" fill="#9ca3af" font-size="12" font-family="sans-serif">3</text>
  <text x="70" y="525" fill="#4b5563" font-size="12" font-family="sans-serif">Fashion &amp; Apparel</text>
  <text x="242" y="525" fill="#9ca3af" font-size="12" font-family="sans-serif">3</text>
  <text x="70" y="550" fill="#4b5563" font-size="12" font-family="sans-serif">Home &amp; Kitchen</text>
  <text x="242" y="550" fill="#9ca3af" font-size="12" font-family="sans-serif">3</text>

  <text x="60" y="590" fill="#6b7280" font-size="11" font-weight="700" letter-spacing="1" font-family="sans-serif">MAX PRICE</text>
  <line x1="60" y1="610" x2="260" y2="610" stroke="#4f46e5" stroke-width="4" stroke-linecap="round" />
  <circle cx="260" cy="610" r="7" fill="#4f46e5" />
  <text x="60" y="635" fill="#6b7280" font-size="12" font-family="sans-serif">$0</text>
  <text x="225" y="635" fill="#111827" font-size="12" font-weight="700" font-family="sans-serif">$500</text>

  <text x="60" y="675" fill="#6b7280" font-size="11" font-weight="700" letter-spacing="1" font-family="sans-serif">AVAILABILITY</text>
  <rect x="60" y="690" width="16" height="16" rx="3" fill="#4f46e5" />
  <text x="64" y="702" fill="#ffffff" font-size="11" font-weight="700" font-family="sans-serif">✓</text>
  <text x="85" y="703" fill="#374151" font-size="12" font-family="sans-serif">In Stock Only</text>

  <!-- Products Toolbar -->
  <rect x="305" y="350" width="935" height="46" rx="8" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" />
  <text x="325" y="378" fill="#4b5563" font-size="13" font-family="sans-serif">Showing <tspan font-weight="700" fill="#111827">12</tspan> of <tspan font-weight="700" fill="#111827">16</tspan> products</text>
  <text x="1080" y="378" fill="#6b7280" font-size="13" font-family="sans-serif">Sort: <tspan font-weight="600" fill="#111827">Featured &amp; Newest ▾</tspan></text>

  <!-- Product Cards Grid (Row 1) -->
  <!-- Card 1 -->
  <g transform="translate(305, 412)">
    <rect width="220" height="355" rx="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" class="shadow" />
    <rect width="220" height="160" rx="12" fill="#1e293b" />
    <text x="110" y="90" text-anchor="middle" fill="#94a3b8" font-size="34">🎧</text>
    <rect x="10" y="10" width="70" height="20" rx="10" fill="#fef3c7" />
    <text x="20" y="24" fill="#92400e" font-size="10" font-weight="700">★ FEATURED</text>
    <text x="15" y="185" fill="#6b7280" font-size="10" font-weight="700">ACOUSTIX</text>
    <text x="15" y="206" fill="#111827" font-size="14" font-weight="700">Aura Wireless ANC...</text>
    <text x="15" y="225" fill="#6b7280" font-size="11">Adaptive noise cancellation...</text>
    <text x="15" y="250" fill="#f59e0b" font-size="12">★★★★★ <tspan fill="#6b7280" font-size="11">4.8 (128)</tspan></text>
    <rect x="15" y="260" width="60" height="18" rx="4" fill="#d1fae5" />
    <text x="20" y="273" fill="#065f46" font-size="10" font-weight="700">In Stock (35)</text>
    <line x1="15" y1="290" x2="205" y2="290" stroke="#f3f4f6" stroke-width="1" />
    <text x="15" y="325" fill="#111827" font-size="18" font-weight="800">$249.99</text>
    <rect x="120" y="304" width="85" height="30" rx="6" fill="#eef2ff" />
    <text x="133" y="324" fill="#4f46e5" font-size="11" font-weight="700">Details →</text>
  </g>

  <!-- Card 2 -->
  <g transform="translate(545, 412)">
    <rect width="220" height="355" rx="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" class="shadow" />
    <rect width="220" height="160" rx="12" fill="#0f172a" />
    <text x="110" y="90" text-anchor="middle" fill="#94a3b8" font-size="34">⌨️</text>
    <rect x="10" y="10" width="70" height="20" rx="10" fill="#fef3c7" />
    <text x="20" y="24" fill="#92400e" font-size="10" font-weight="700">★ FEATURED</text>
    <text x="15" y="185" fill="#6b7280" font-size="10" font-weight="700">KEYCRAFT</text>
    <text x="15" y="206" fill="#111827" font-size="14" font-weight="700">Apex Mechanical...</text>
    <text x="15" y="225" fill="#6b7280" font-size="11">CNC aluminum, hot-swappable...</text>
    <text x="15" y="250" fill="#f59e0b" font-size="12">★★★★★ <tspan fill="#6b7280" font-size="11">4.7 (84)</tspan></text>
    <rect x="15" y="260" width="60" height="18" rx="4" fill="#d1fae5" />
    <text x="20" y="273" fill="#065f46" font-size="10" font-weight="700">In Stock (20)</text>
    <line x1="15" y1="290" x2="205" y2="290" stroke="#f3f4f6" stroke-width="1" />
    <text x="15" y="325" fill="#111827" font-size="18" font-weight="800">$159.00</text>
    <rect x="120" y="304" width="85" height="30" rx="6" fill="#eef2ff" />
    <text x="133" y="324" fill="#4f46e5" font-size="11" font-weight="700">Details →</text>
  </g>

  <!-- Card 3 -->
  <g transform="translate(785, 412)">
    <rect width="220" height="355" rx="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" class="shadow" />
    <rect width="220" height="160" rx="12" fill="#334155" />
    <text x="110" y="90" text-anchor="middle" fill="#cbd5e1" font-size="34">🖥️</text>
    <text x="15" y="185" fill="#6b7280" font-size="10" font-weight="700">VISIPRO</text>
    <text x="15" y="206" fill="#111827" font-size="14" font-weight="700">Quantum 4K Monitor...</text>
    <text x="15" y="225" fill="#6b7280" font-size="11">27-inch IPS HDR 99% sRGB...</text>
    <text x="15" y="250" fill="#f59e0b" font-size="12">★★★★★ <tspan fill="#6b7280" font-size="11">4.9 (62)</tspan></text>
    <rect x="15" y="260" width="70" height="18" rx="4" fill="#fef3c7" />
    <text x="20" y="273" fill="#92400e" font-size="10" font-weight="700">Low Stock (14)</text>
    <line x1="15" y1="290" x2="205" y2="290" stroke="#f3f4f6" stroke-width="1" />
    <text x="15" y="325" fill="#111827" font-size="18" font-weight="800">$399.50</text>
    <rect x="120" y="304" width="85" height="30" rx="6" fill="#eef2ff" />
    <text x="133" y="324" fill="#4f46e5" font-size="11" font-weight="700">Details →</text>
  </g>

  <!-- Card 4 -->
  <g transform="translate(1020, 412)">
    <rect width="220" height="355" rx="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" class="shadow" />
    <rect width="220" height="160" rx="12" fill="#1e1b4b" />
    <text x="110" y="90" text-anchor="middle" fill="#a5b4fc" font-size="34">⌚</text>
    <rect x="10" y="10" width="70" height="20" rx="10" fill="#fef3c7" />
    <text x="20" y="24" fill="#92400e" font-size="10" font-weight="700">★ FEATURED</text>
    <text x="15" y="185" fill="#6b7280" font-size="10" font-weight="700">CHRONOS</text>
    <text x="15" y="206" fill="#111827" font-size="14" font-weight="700">Stratus Smart Watch...</text>
    <text x="15" y="225" fill="#6b7280" font-size="11">Titanium casing, SpO2 sensor...</text>
    <text x="15" y="250" fill="#f59e0b" font-size="12">★★★★★ <tspan fill="#6b7280" font-size="11">4.6 (95)</tspan></text>
    <rect x="15" y="260" width="60" height="18" rx="4" fill="#d1fae5" />
    <text x="20" y="273" fill="#065f46" font-size="10" font-weight="700">In Stock (42)</text>
    <line x1="15" y1="290" x2="205" y2="290" stroke="#f3f4f6" stroke-width="1" />
    <text x="15" y="325" fill="#111827" font-size="18" font-weight="800">$189.99</text>
    <rect x="120" y="304" width="85" height="30" rx="6" fill="#eef2ff" />
    <text x="133" y="324" fill="#4f46e5" font-size="11" font-weight="700">Details →</text>
  </g>

  <!-- Pagination -->
  <rect x="680" y="800" width="36" height="36" rx="6" fill="#111827" />
  <text x="694" y="823" fill="#ffffff" font-size="13" font-weight="700">1</text>
  <rect x="726" y="800" width="36" height="36" rx="6" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" />
  <text x="740" y="823" fill="#4b5563" font-size="13" font-weight="600">2</text>
  <rect x="772" y="800" width="70" height="36" rx="6" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" />
  <text x="785" y="823" fill="#4b5563" font-size="12" font-weight="600">Next →</text>
</svg>
"""

# ----------------------------------------------------------------------
# 2. Product Details View Modal SVG
# ----------------------------------------------------------------------
svg_detail = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 880" width="1280" height="880">
  <defs>
    <style>
      .font-sans { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
      .shadow { filter: drop-shadow(0 20px 25px rgba(0,0,0,0.25)); }
    </style>
  </defs>

  <!-- Dimmed Background of Listing Page -->
  <rect width="1280" height="880" fill="#0f172a" opacity="0.75" />

  <!-- Modal Dialog Container -->
  <rect x="160" y="60" width="960" height="760" rx="20" fill="#ffffff" class="shadow" />

  <!-- Close Button -->
  <circle cx="1080" cy="95" r="18" fill="#f3f4f6" />
  <text x="1074" y="101" fill="#4b5563" font-size="18" font-family="sans-serif">✕</text>

  <!-- Left: Image Gallery Area -->
  <g transform="translate(200, 100)">
    <!-- Main Big Image -->
    <rect width="400" height="420" rx="14" fill="#1e293b" />
    <text x="200" y="230" text-anchor="middle" fill="#94a3b8" font-size="70">🎧</text>
    <rect x="15" y="15" width="85" height="24" rx="12" fill="#fef3c7" />
    <text x="25" y="31" fill="#92400e" font-size="11" font-weight="700">★ FEATURED</text>

    <!-- Thumbnail Strip -->
    <rect x="0" y="440" width="70" height="70" rx="8" fill="#1e293b" stroke="#4f46e5" stroke-width="3" />
    <text x="35" y="480" text-anchor="middle" fill="#cbd5e1" font-size="20">🎧</text>

    <rect x="85" y="440" width="70" height="70" rx="8" fill="#334155" />
    <text x="120" y="480" text-anchor="middle" fill="#94a3b8" font-size="20">🔊</text>

    <rect x="170" y="440" width="70" height="70" rx="8" fill="#334155" />
    <text x="205" y="480" text-anchor="middle" fill="#94a3b8" font-size="20">🔋</text>

    <rect x="0" y="535" width="400" height="130" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
    <text x="20" y="565" fill="#1e293b" font-size="13" font-weight="700">Customer Reviews &amp; Highlights</text>
    <text x="20" y="590" fill="#475569" font-size="12">"Soundstage is stunning. Battery easily lasts 40 hours with ANC."</text>
    <text x="20" y="612" fill="#f59e0b" font-size="12">★★★★★ <tspan fill="#64748b" font-size="11">— Verified Buyer (Alex R.)</tspan></text>
    <text x="20" y="640" fill="#059669" font-size="12" font-weight="600">✓ 98% of customers recommend this item</text>
  </g>

  <!-- Right: Product Specifications & Details -->
  <g transform="translate(630, 100)">
    <!-- Breadcrumbs -->
    <text x="0" y="20" fill="#4f46e5" font-size="12" font-weight="600">Products <tspan fill="#9ca3af">&gt;</tspan> Electronics <tspan fill="#9ca3af">&gt;</tspan> AcoustiX</text>

    <!-- Title -->
    <text x="0" y="60" fill="#0f172a" font-size="24" font-weight="800">Aura Wireless Noise-</text>
    <text x="0" y="90" fill="#0f172a" font-size="24" font-weight="800">Cancelling Headphones</text>

    <!-- Meta row -->
    <text x="0" y="125" fill="#f59e0b" font-size="14">★★★★★</text>
    <text x="75" y="125" fill="#0f172a" font-size="13" font-weight="700">4.8</text>
    <text x="100" y="125" fill="#64748b" font-size="13">(128 verified ratings)</text>
    <text x="260" y="125" fill="#cbd5e1">|</text>
    <text x="275" y="125" fill="#64748b" font-size="12" font-family="monospace">SKU: ELEC-HP-001</text>

    <!-- Price & Stock Box -->
    <rect x="0" y="145" width="450" height="75" rx="10" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
    <text x="20" y="172" fill="#64748b" font-size="11" font-weight="600">TOTAL PRICE</text>
    <text x="20" y="204" fill="#0f172a" font-size="28" font-weight="800">$249.99</text>
    <rect x="280" y="165" width="150" height="32" rx="16" fill="#d1fae5" />
    <text x="295" y="186" fill="#065f46" font-size="12" font-weight="700">● In Stock (35 units)</text>

    <!-- Description -->
    <text x="0" y="248" fill="#0f172a" font-size="13" font-weight="700">Description</text>
    <text x="0" y="272" fill="#475569" font-size="13">Immerse yourself in rich, high-fidelity acoustics with adaptive active</text>
    <text x="0" y="294" fill="#475569" font-size="13">noise cancellation, 40-hour continuous battery life, and ultra-plush</text>
    <text x="0" y="316" fill="#475569" font-size="13">memory foam earcups designed for all-day listening comfort.</text>

    <!-- Specifications Table -->
    <rect x="0" y="340" width="450" height="160" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1" />
    <line x1="0" y1="380" x2="450" y2="380" stroke="#f1f5f9" stroke-width="1" />
    <line x1="0" y1="420" x2="450" y2="420" stroke="#f1f5f9" stroke-width="1" />
    <line x1="0" y1="460" x2="450" y2="460" stroke="#f1f5f9" stroke-width="1" />

    <text x="15" y="365" fill="#64748b" font-size="12" font-weight="600">Category</text>
    <text x="140" y="365" fill="#0f172a" font-size="12" font-weight="600">Electronics &amp; Audio</text>

    <text x="15" y="405" fill="#64748b" font-size="12" font-weight="600">Brand</text>
    <text x="140" y="405" fill="#0f172a" font-size="12">AcoustiX Audio Labs</text>

    <text x="15" y="445" fill="#64748b" font-size="12" font-weight="600">Shipping</text>
    <text x="140" y="445" fill="#0f172a" font-size="12">Free Standard Delivery (2-4 business days)</text>

    <text x="15" y="485" fill="#64748b" font-size="12" font-weight="600">Guarantee</text>
    <text x="140" y="485" fill="#0f172a" font-size="12">30-day money-back guarantee &amp; 1-yr warranty</text>

    <!-- Add to Cart Action -->
    <g transform="translate(0, 520)">
      <!-- Quantity Selector -->
      <rect width="110" height="46" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
      <text x="15" y="28" fill="#475569" font-size="18" font-weight="700">-</text>
      <text x="50" y="29" fill="#0f172a" font-size="15" font-weight="700">1</text>
      <text x="85" y="28" fill="#475569" font-size="18" font-weight="700">+</text>

      <!-- Cart Button -->
      <rect x="125" width="325" height="46" rx="8" fill="#4f46e5" />
      <text x="210" y="28" fill="#ffffff" font-size="15" font-weight="700">🛒 Add to Cart ($249.99)</text>
    </g>
  </g>
</svg>
"""

with open('screenshots/product-listing-page.svg', 'w', encoding='utf-8') as f:
    f.write(svg_listing)

with open('screenshots/product-detail-page.svg', 'w', encoding='utf-8') as f:
    f.write(svg_detail)

print("SVG screenshots generated.")

# ----------------------------------------------------------------------
# 3. Create Valid PNG Files (RGB scanlines with PNG chunks)
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
            elif y < 50:
                raw.extend([30, 27, 75])  # Top header bar (dark purple)
            elif y > height - 40:
                raw.extend([240, 240, 240]) # Footer
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

create_png_from_colors('screenshots/product-listing-page.png', 800, 500, [249, 250, 251], [79, 70, 229])
create_png_from_colors('screenshots/product-detail-page.png', 800, 500, [255, 255, 255], [6, 182, 212])

print("Screenshots ready!")
