-- =====================================================================
-- Full-Stack E-Commerce Database Seed Data (Sample Products & Categories)
-- Part 1: Product Listing Website
-- =====================================================================

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------
-- 1. Seed Categories
-- ---------------------------------------------------------------------
INSERT INTO categories (id, name, slug, description) VALUES
(1, 'Electronics', 'electronics', 'High-performance audio, computing, and smart accessories.'),
(2, 'Footwear', 'footwear', 'Athletic running shoes, casual sneakers, and leather footwear.'),
(3, 'Fashion & Apparel', 'fashion', 'Premium jackets, hoodies, knitwear, and modern everyday apparel.'),
(4, 'Home & Kitchen', 'home-kitchen', 'Minimalist kitchenware, artisanal coffee makers, and smart home essentials.'),
(5, 'Accessories', 'accessories', 'Luxury timepieces, leather backpacks, sunglasses, and wallets.');

-- ---------------------------------------------------------------------
-- 2. Seed Products
-- ---------------------------------------------------------------------
INSERT INTO products (id, title, slug, description, price, category_id, image_url, thumbnail_url, stock, rating, rating_count, brand, sku, is_featured) VALUES
(
    1,
    'Aura Wireless Noise-Cancelling Headphones',
    'aura-wireless-noise-cancelling-headphones',
    'Immerse yourself in rich, high-fidelity acoustics with adaptive active noise cancellation, 40-hour battery life, and ultra-plush memory foam earcups.',
    249.99,
    1,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
    35,
    4.8,
    128,
    'AcoustiX',
    'ELEC-HP-001',
    1
),
(
    2,
    'Apex Mechanical Ergonomic Keyboard',
    'apex-mechanical-ergonomic-keyboard',
    'Crafted with CNC anodized aluminum, hot-swappable tactile switches, and customizable RGB per-key backlighting for typing purists and developers.',
    159.00,
    1,
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=300&q=80',
    20,
    4.7,
    84,
    'KeyCraft',
    'ELEC-KB-002',
    1
),
(
    3,
    'Quantum Ultra-Thin 4K Monitor 27"',
    'quantum-ultra-thin-4k-monitor-27',
    'A breathtaking 27-inch IPS 4K HDR display featuring 99% sRGB color gamut, USB-C 90W power delivery, and an edge-to-edge frameless chassis.',
    399.50,
    1,
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80',
    14,
    4.9,
    62,
    'VisiPro',
    'ELEC-MN-003',
    0
),
(
    4,
    'Stratus Smart Fitness Watch Pro',
    'stratus-smart-fitness-watch-pro',
    'Continuous heart-rate, SpO2, and sleep tracking in a titanium casing with 14-day battery life and water resistance up to 50 meters.',
    189.99,
    1,
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
    42,
    4.6,
    95,
    'Chronos',
    'ELEC-SW-004',
    1
),
(
    5,
    'CloudStep Pro Running Sneakers',
    'cloudstep-pro-running-sneakers',
    'Engineered with responsive nitrogen-infused foam soles and breathable engineered mesh for unmatched cushion and rebound on long-distance runs.',
    129.99,
    2,
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80',
    50,
    4.7,
    210,
    'AeroStride',
    'FOOT-SN-005',
    1
),
(
    6,
    'Heritage Handcrafted Leather Chelsea Boots',
    'heritage-handcrafted-leather-chelsea-boots',
    'Full-grain Italian calfskin leather with Goodyear welt construction, elastic side gussets, and vegetable-tanned leather lining.',
    215.00,
    2,
    'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=300&q=80',
    18,
    4.9,
    47,
    'Tuscan & Co.',
    'FOOT-BT-006',
    0
),
(
    7,
    'Vanguard Urban Commuter Low-Top',
    'vanguard-urban-commuter-low-top',
    'Minimalist monochrome sneakers made from sustainable recycled canvas and vulcanized natural rubber soles.',
    89.00,
    2,
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=300&q=80',
    65,
    4.5,
    115,
    'AeroStride',
    'FOOT-SN-007',
    0
),
(
    8,
    'All-Weather Performance Wool Parka',
    'all-weather-performance-wool-parka',
    'Waterproof bonded merino wool outer shell with recycled down insulation, magnetic storm flap, and fleece-lined handwarmer pockets.',
    320.00,
    3,
    'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=300&q=80',
    15,
    4.8,
    73,
    'NordicShield',
    'FASH-JK-008',
    1
),
(
    9,
    'Heavyweight French Terry Pullover Hoodie',
    'heavyweight-french-terry-pullover-hoodie',
    'Cut from 480 GSM organic cotton french terry with flatlock stitching, rib-knit side panels, and a tailored contemporary drape.',
    95.00,
    3,
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&q=80',
    40,
    4.6,
    91,
    'Monolith Apparel',
    'FASH-HD-009',
    0
),
(
    10,
    'Structured Linen Button-Down Shirt',
    'structured-linen-button-down-shirt',
    'Breathable premium flax linen woven with a soft relaxed finish, mother-of-pearl buttons, and double-needle armhole stitching.',
    75.00,
    3,
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80',
    28,
    4.4,
    39,
    'Monolith Apparel',
    'FASH-SH-010',
    0
),
(
    11,
    'Barista Precision Gooseneck Kettle',
    'barista-precision-gooseneck-kettle',
    'Digital temperature control to the exact degree, integrated brew stopwatch, and an ergonomic counterbalanced handle for steady pour-over extraction.',
    135.00,
    4,
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80',
    22,
    4.9,
    140,
    'ArtisanBrew',
    'HOME-KT-011',
    1
),
(
    12,
    'Ceramic Matte Pour-Over Dripper & Carafe',
    'ceramic-matte-pour-over-dripper-and-carafe',
    'Hand-glazed heat-retentive ceramic cone dripper paired with a thermal shock-resistant borosilicate glass server.',
    48.00,
    4,
    'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=300&q=80',
    38,
    4.7,
    58,
    'ArtisanBrew',
    'HOME-CF-012',
    0
),
(
    13,
    'Cast Iron Dutch Oven 5.5 Quart',
    'cast-iron-dutch-oven-5-5-quart',
    'Heavy-duty enameled cast iron delivers superior heat retention and even heat distribution for braising, baking sourdough, and slow-cooking stews.',
    160.00,
    4,
    'https://images.unsplash.com/photo-1584990347449-399497554e2b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584990347449-399497554e2b?auto=format&fit=crop&w=300&q=80',
    12,
    4.9,
    88,
    'Fonte Cuisine',
    'HOME-DO-013',
    0
),
(
    14,
    'Executive Chronograph Watch',
    'executive-chronograph-watch',
    'Sapphire crystal glass, Japanese quartz chronograph movement, 316L stainless steel case, and genuine top-grain calfskin leather strap.',
    220.00,
    5,
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=300&q=80',
    19,
    4.8,
    104,
    'Chronos',
    'ACCS-WT-014',
    1
),
(
    15,
    'Full-Grain Leather Roll-Top Commuter Backpack',
    'full-grain-leather-roll-top-commuter-backpack',
    'Water-resistant waxed canvas combined with rich full-grain oil-waxed leather accents. Features a padded 16-inch laptop compartment.',
    175.00,
    5,
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80',
    25,
    4.7,
    67,
    'Tuscan & Co.',
    'ACCS-BP-015',
    1
),
(
    16,
    'Polarized Acetate Classic Sunglasses',
    'polarized-acetate-classic-sunglasses',
    'Hand-polished Italian cellulose acetate frame with 100% UVA/UVB Category 3 polarized scratch-resistant mineral glass lenses.',
    110.00,
    5,
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80',
    45,
    4.5,
    52,
    'Solaris',
    'ACCS-SG-016',
    0
);

-- ---------------------------------------------------------------------
-- 3. Seed Multi-Image Gallery per Product
-- ---------------------------------------------------------------------
INSERT INTO product_images (product_id, url, alt_text, display_order) VALUES
(1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80', 'Aura Headphones front view', 1),
(1, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80', 'Aura Headphones angled side view', 2),
(1, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80', 'Aura Headphones earcup detail', 3),

(2, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80', 'Apex Keyboard top layout', 1),
(2, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80', 'Apex Keyboard switch detail', 2),

(3, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80', 'Quantum 4K Monitor front display', 1),

(4, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80', 'Stratus Smart Watch on wrist', 1),
(4, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80', 'Stratus Watch dial detail', 2),

(5, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80', 'CloudStep Pro running shoes red profile', 1),
(5, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80', 'CloudStep Pro sole tread pattern', 2),

(6, 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=1000&q=80', 'Chelsea Boots leather profile', 1),

(7, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=80', 'Vanguard Commuter sneakers flat lay', 1),

(8, 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80', 'Wool Parka outerwear view', 1),

(9, 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80', 'French Terry Hoodie detail', 1),

(10, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80', 'Linen shirt fabric and collar detail', 1),

(11, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80', 'Barista Gooseneck kettle spout and lid', 1),

(12, 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80', 'Pour-Over set brewing in kitchen', 1),

(13, 'https://images.unsplash.com/photo-1584990347449-399497554e2b?auto=format&fit=crop&w=1000&q=80', 'Dutch Oven enamel finish', 1),

(14, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80', 'Chronograph dial and leather strap', 1),

(15, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80', 'Leather backpack front view', 1),

(16, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80', 'Polarized sunglasses angled view', 1);
