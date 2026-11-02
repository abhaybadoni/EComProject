"""
Generates 16 bespoke, high-resolution product images in frontend/images/products/
Each image is specifically styled for ApnaBazar's Indian catalogue items.
"""

import os

output_dir = 'frontend/images/products'
os.makedirs(output_dir, exist_ok=True)

products = [
    {
        "filename": "kesar-hamper.svg",
        "bg_top": "#451a03", "bg_bot": "#78350f",
        "brand": "KASHMIR CROWN", "title": "Kashmiri Shahi Mogra Kesar",
        "accent": "#f59e0b", "icon": "🌸",
        "detail": "Grade-A1 Pamposh Red Gold + Almonds Box",
        "badge": "100% PURE KASHMIRI KESAR",
        "graphic": """
            <circle cx="400" cy="420" r="160" fill="#92400e" opacity="0.4" />
            <rect x="260" y="320" width="280" height="200" rx="16" fill="#b45309" stroke="#fbbf24" stroke-width="4" />
            <rect x="240" y="300" width="320" height="36" rx="8" fill="#d97706" stroke="#fef08a" stroke-width="2" />
            <circle cx="400" cy="420" r="60" fill="#78350f" stroke="#fbbf24" stroke-width="3" />
            <text x="400" y="445" text-anchor="middle" font-size="64">🌸</text>
            <path d="M 330 460 Q 400 500 470 460" stroke="#ef4444" stroke-width="6" fill="none" />
            <text x="400" y="560" text-anchor="middle" fill="#fef08a" font-size="20" font-weight="bold">ROYAL DRY FRUIT HAMPER</text>
        """
    },
    {
        "filename": "a2-desi-ghee.svg",
        "bg_top": "#78350f", "bg_bot": "#b45309",
        "brand": "AMRIT VEDIC", "title": "Organic A2 Gir Cow Bilona Ghee",
        "accent": "#fef08a", "icon": "🧈",
        "detail": "Vedic Hand-Churned Cultured Ghee (1 Litre)",
        "badge": "A2 BILONA METHOD • 100% PURE",
        "graphic": """
            <circle cx="400" cy="420" r="160" fill="#d97706" opacity="0.3" />
            <!-- Clay / Glass Pot -->
            <path d="M 280 480 Q 260 400 310 330 L 490 330 Q 540 400 520 480 Q 500 530 400 530 Q 300 530 280 480 Z" fill="#fef3c7" stroke="#d97706" stroke-width="6" />
            <!-- Golden Ghee Line -->
            <path d="M 295 450 Q 400 480 505 450 L 500 480 Q 400 520 300 480 Z" fill="#f59e0b" />
            <!-- Pot Neck & Lid -->
            <rect x="330" y="300" width="140" height="35" rx="6" fill="#b45309" stroke="#fbbf24" stroke-width="3" />
            <path d="M 310 305 Q 400 280 490 305 L 470 290 Q 400 270 330 290 Z" fill="#92400e" />
            <text x="400" y="415" text-anchor="middle" font-size="52">🧈</text>
            <text x="400" y="565" text-anchor="middle" fill="#fef3c7" font-size="18" font-weight="bold">SHUDDH DESI BILONA GHEE</text>
        """
    },
    {
        "filename": "darjeeling-tea.svg",
        "bg_top": "#064e3b", "bg_bot": "#047857",
        "brand": "MAKAIBARI HERITAGE", "title": "Estate Darjeeling First Flush Tea",
        "accent": "#a7f3d0", "icon": "🍵",
        "detail": "Loose Leaf Spring Harvest (500g Golden Tin)",
        "badge": "100% ORGANIC DARJEELING TEA",
        "graphic": """
            <circle cx="400" cy="420" r="160" fill="#065f46" opacity="0.4" />
            <rect x="290" y="310" width="220" height="230" rx="14" fill="#022c22" stroke="#34d399" stroke-width="5" />
            <rect x="270" y="285" width="260" height="30" rx="8" fill="#065f46" stroke="#6ee7b7" stroke-width="3" />
            <circle cx="400" cy="400" r="50" fill="#047857" stroke="#a7f3d0" stroke-width="2" />
            <text x="400" y="420" text-anchor="middle" font-size="44">🍃</text>
            <text x="400" y="480" text-anchor="middle" fill="#6ee7b7" font-size="16" font-weight="bold">FIRST FLUSH 2026</text>
            <text x="400" y="505" text-anchor="middle" fill="#a7f3d0" font-size="12">CHAMPAGNE OF TEAS</text>
        """
    },
    {
        "filename": "kerala-spices.svg",
        "bg_top": "#7c2d12", "bg_bot": "#9a3412",
        "brand": "KERALA SPICE CO.", "title": "Malabar Whole Spices & Garam Masala",
        "accent": "#fed7aa", "icon": "🌶️",
        "detail": "Tellicherry Pepper, Cardamom & Cloves Gift Set",
        "badge": "STONE-GROUND AROMATIC SPICES",
        "graphic": """
            <circle cx="400" cy="420" r="160" fill="#c2410c" opacity="0.3" />
            <!-- Brass Masala Dabba -->
            <circle cx="400" cy="420" r="140" fill="#b45309" stroke="#fbbf24" stroke-width="8" />
            <circle cx="400" cy="420" r="45" fill="#78350f" stroke="#fbbf24" stroke-width="2" />
            <!-- Compartments with Spices -->
            <circle cx="340" cy="370" r="30" fill="#18181b" /><!-- Pepper -->
            <circle cx="460" cy="370" r="30" fill="#15803d" /><!-- Cardamom -->
            <circle cx="340" cy="470" r="30" fill="#b91c1c" /><!-- Chilli -->
            <circle cx="460" cy="470" r="30" fill="#854d0e" /><!-- Cloves/Cinnamon -->
            <text x="400" y="432" text-anchor="middle" font-size="32">✨</text>
            <text x="400" y="585" text-anchor="middle" fill="#fef08a" font-size="18" font-weight="bold">ROYAL MALABAR SPICE BOX</text>
        """
    },
    {
        "filename": "banarasi-saree.svg",
        "bg_top": "#064e3b", "bg_bot": "#134e4a",
        "brand": "VARANASI BUNKAR", "title": "Pure Katan Silk Banarasi Saree",
        "accent": "#fde047", "icon": "🥻",
        "detail": "Emerald Green with Real Gold Zari Pallu",
        "badge": "SILK MARK CERTIFIED • HANDLOOM",
        "graphic": """
            <circle cx="400" cy="420" r="160" fill="#047857" opacity="0.4" />
            <!-- Saree Drape & Gold Zari Pattern -->
            <path d="M 270 300 L 530 300 L 500 520 L 250 500 Z" fill="#065f46" stroke="#fbbf24" stroke-width="4" />
            <!-- Gold Zari Brocade Lines -->
            <line x1="270" y1="350" x2="520" y2="350" stroke="#fbbf24" stroke-width="6" stroke-dasharray="10,5" />
            <line x1="265" y1="410" x2="510" y2="410" stroke="#fef08a" stroke-width="8" stroke-dasharray="12,6" />
            <line x1="260" y1="465" x2="505" y2="465" stroke="#fbbf24" stroke-width="12" stroke-dasharray="15,4" />
            <circle cx="400" cy="380" r="40" fill="#022c22" stroke="#fde047" stroke-width="3" />
            <text x="400" y="398" text-anchor="middle" font-size="40">🥻</text>
            <text x="400" y="560" text-anchor="middle" fill="#fef08a" font-size="18" font-weight="bold">HERITAGE VARANASI WEAVE</text>
        """
    },
    {
        "filename": "chanderi-kurta.svg",
        "bg_top": "#701a75", "bg_bot": "#86198f",
        "brand": "RIVAAZ ETHNO", "title": "Chanderi Silk Embroidered Kurta Set",
        "accent": "#f5d0fe", "icon": "✨",
        "detail": "Gotta-Patti Work with Chiffon Dupatta",
        "badge": "FESTIVE ETHNIC WEAR",
        "graphic": """
            <circle cx="400" cy="420" r="160" fill="#a21caf" opacity="0.3" />
            <!-- Kurta Silhouette -->
            <path d="M 330 280 L 400 320 L 470 280 L 520 330 L 480 520 L 320 520 L 280 330 Z" fill="#86198f" stroke="#f5d0fe" stroke-width="4" />
            <!-- Placket Embroidery -->
            <line x1="400" y1="320" x2="400" y2="440" stroke="#fef08a" stroke-width="6" stroke-dasharray="8,4" />
            <circle cx="400" cy="360" r="6" fill="#fbbf24" />
            <circle cx="400" cy="390" r="6" fill="#fbbf24" />
            <circle cx="400" cy="420" r="6" fill="#fbbf24" />
            <text x="400" y="565" text-anchor="middle" fill="#f5d0fe" font-size="18" font-weight="bold">HAND EMBROIDERED SILK</text>
        """
    },
    {
        "filename": "nehru-jacket.svg",
        "bg_top": "#1e293b", "bg_bot": "#334155",
        "brand": "SWADESHI CRAFT", "title": "Khadi Raw Silk Nehru Bundi Jacket",
        "accent": "#e2e8f0", "icon": "🧥",
        "detail": "Mandarin Collar with Antique Brass Buttons",
        "badge": "100% HANDSPUN KHADI SILK",
        "graphic": """
            <circle cx="400" cy="420" r="160" fill="#475569" opacity="0.3" />
            <!-- Jacket Silhouette -->
            <path d="M 340 290 L 400 310 L 460 290 L 490 350 L 470 520 L 330 520 L 310 350 Z" fill="#1e293b" stroke="#cbd5e1" stroke-width="4" />
            <!-- Mandarin Collar -->
            <rect x="365" y="280" width="70" height="25" rx="4" fill="#334155" stroke="#f8fafc" stroke-width="2" />
            <!-- Brass Buttons -->
            <line x1="400" y1="310" x2="400" y2="510" stroke="#64748b" stroke-width="2" />
            <circle cx="400" cy="340" r="6" fill="#fbbf24" stroke="#78350f" stroke-width="1.5" />
            <circle cx="400" cy="375" r="6" fill="#fbbf24" stroke="#78350f" stroke-width="1.5" />
            <circle cx="400" cy="410" r="6" fill="#fbbf24" stroke="#78350f" stroke-width="1.5" />
            <circle cx="400" cy="445" r="6" fill="#fbbf24" stroke="#78350f" stroke-width="1.5" />
            <circle cx="400" cy="480" r="6" fill="#fbbf24" stroke="#78350f" stroke-width="1.5" />
            <text x="400" y="565" text-anchor="middle" fill="#cbd5e1" font-size="18" font-weight="bold">ROYAL BANDHGALA WAISTCOAT</text>
        """
    },
    {
        "filename": "pashmina-stole.svg",
        "bg_top": "#831843", "bg_bot": "#9d174d",
        "brand": "PASHM HERITAGE", "title": "Kashmiri Hand-Embroidered Pashmina",
        "accent": "#fbcfe8", "icon": "🧣",
        "detail": "Changthangi Wool with Traditional Sozni Needlework",
        "badge": "100% PURE KASHMIRI PASHMINA",
        "graphic": """
            <circle cx="400" cy="420" r="160" fill="#be185d" opacity="0.3" />
            <rect x="280" y="300" width="240" height="230" rx="10" fill="#9d174d" stroke="#fbcfe8" stroke-width="4" />
            <!-- Kashmiri Paisley/Ambi Motifs -->
            <path d="M 330 360 Q 360 320 380 370 Q 400 420 350 430 Z" fill="#fbbf24" stroke="#fbcfe8" stroke-width="2" />
            <path d="M 430 400 Q 460 360 480 410 Q 500 460 450 470 Z" fill="#38bdf8" stroke="#fbcfe8" stroke-width="2" />
            <!-- Tassel fringes -->
            <line x1="280" y1="535" x2="280" y2="555" stroke="#fbcfe8" stroke-width="4" />
            <line x1="320" y1="535" x2="320" y2="555" stroke="#fbcfe8" stroke-width="4" />
            <line x1="360" y1="535" x2="360" y2="555" stroke="#fbcfe8" stroke-width="4" />
            <line x1="400" y1="535" x2="400" y2="555" stroke="#fbcfe8" stroke-width="4" />
            <line x1="440" y1="535" x2="440" y2="555" stroke="#fbcfe8" stroke-width="4" />
            <line x1="480" y1="535" x2="480" y2="555" stroke="#fbcfe8" stroke-width="4" />
            <line x1="520" y1="535" x2="520" y2="555" stroke="#fbcfe8" stroke-width="4" />
            <text x="400" y="585" text-anchor="middle" fill="#fbcfe8" font-size="18" font-weight="bold">AUTHENTIC SOZNI WORK</text>
        """
    },
    {
        "filename": "mixer-grinder.svg",
        "bg_top": "#1e293b", "bg_bot": "#0f172a",
        "brand": "PREETHI", "title": "Zodiac Cosmo 750W Mixer Grinder",
        "accent": "#ea580c", "icon": "⚡",
        "detail": "Vega W5 Motor with 5 Stainless Steel Jars",
        "badge": "5-YEAR MOTOR WARRANTY • BIS APPROVED",
        "graphic": """
            <circle cx="400" cy="420" r="160" fill="#334155" opacity="0.4" />
            <!-- Mixer Base Unit -->
            <path d="M 310 400 L 490 400 L 510 520 L 290 520 Z" fill="#ea580c" stroke="#f8fafc" stroke-width="4" />
            <!-- Speed Control Knob -->
            <circle cx="400" cy="460" r="24" fill="#0f172a" stroke="#fbbf24" stroke-width="3" />
            <line x1="400" y1="460" x2="415" y2="448" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" />
            <!-- Top Jar -->
            <path d="M 340 280 L 460 280 L 440 395 L 360 395 Z" fill="#cbd5e1" stroke="#f8fafc" stroke-width="4" />
            <rect x="330" y="260" width="140" height="22" rx="6" fill="#475569" />
            <!-- Jar Handle -->
            <path d="M 460 300 Q 500 330 450 370" stroke="#334155" stroke-width="10" fill="none" stroke-linecap="round" />
            <text x="400" y="565" text-anchor="middle" fill="#fef08a" font-size="18" font-weight="bold">750W HEAVY DUTY MOTOR</text>
        """
    },
    {
        "filename": "boat-headphones.svg",
        "bg_top": "#0f172a", "bg_bot": "#1e293b",
        "brand": "BOAT", "title": "boAt Rockerz 550 Over-Ear Wireless",
        "accent": "#ef4444", "icon": "🎧",
        "detail": "50mm Drivers with boAt Super Extra Bass (50H Playtime)",
        "badge": "1-YEAR WARRANTY • SIGNATURE SOUND",
        "graphic": """
            <circle cx="400" cy="420" r="160" fill="#334155" opacity="0.3" />
            <!-- Headband Arch -->
            <path d="M 280 410 A 130 130 0 0 1 520 410" stroke="#0f172a" stroke-width="26" fill="none" stroke-linecap="round" />
            <path d="M 285 410 A 125 125 0 0 1 515 410" stroke="#ef4444" stroke-width="8" fill="none" />
            <!-- Left Earcup -->
            <rect x="250" y="380" width="55" height="100" rx="26" fill="#1e293b" stroke="#ef4444" stroke-width="4" />
            <circle cx="277" cy="430" r="14" fill="#ef4444" />
            <!-- Right Earcup -->
            <rect x="495" y="380" width="55" height="100" rx="26" fill="#1e293b" stroke="#ef4444" stroke-width="4" />
            <circle cx="522" cy="430" r="14" fill="#ef4444" />
            <text x="400" y="565" text-anchor="middle" fill="#f87171" font-size="18" font-weight="bold">50 HOURS CONTINUOUS PLAYTIME</text>
        """
    },
    {
        "filename": "induction-cooktop.svg",
        "bg_top": "#18181b", "bg_bot": "#27272a",
        "brand": "HAVELLS", "title": "Smart Induction Cooktop 2000W",
        "accent": "#38bdf8", "icon": "🍳",
        "detail": "Indian Auto-Cook Preset Menus (Roti, Dosa, Curry)",
        "badge": "2000W POWER • INDIAN PRESET MENUS",
        "graphic": """
            <circle cx="400" cy="420" r="160" fill="#3f3f46" opacity="0.3" />
            <!-- Cooktop Body -->
            <rect x="270" y="300" width="260" height="230" rx="16" fill="#09090b" stroke="#52525b" stroke-width="4" />
            <!-- Crystal Induction Ring -->
            <circle cx="400" cy="390" r="75" fill="none" stroke="#ef4444" stroke-width="4" stroke-dasharray="16,6" />
            <circle cx="400" cy="390" r="50" fill="none" stroke="#fbbf24" stroke-width="3" />
            <circle cx="400" cy="390" r="20" fill="#dc2626" />
            <!-- Digital Display -->
            <rect x="350" y="480" width="100" height="30" rx="4" fill="#18181b" stroke="#38bdf8" stroke-width="1.5" />
            <text x="400" y="501" text-anchor="middle" fill="#38bdf8" font-size="15" font-family="monospace" font-weight="bold">2000W</text>
            <text x="400" y="570" text-anchor="middle" fill="#38bdf8" font-size="18" font-weight="bold">AUTO PAN DETECTION &amp; TIMER</text>
        """
    },
    {
        "filename": "smartwatch.svg",
        "bg_top": "#0f172a", "bg_bot": "#1e3a8a",
        "brand": "NOISE", "title": "ColorFit Pulse Grand Calling Smartwatch",
        "accent": "#60a5fa", "icon": "⌚",
        "detail": "1.69\" HD Display with SpO2 & 24x7 Heart Rate",
        "badge": "BLUETOOTH CALLING • 7-DAY BATTERY",
        "graphic": """
            <circle cx="400" cy="420" r="160" fill="#1e40af" opacity="0.3" />
            <!-- Watch Straps -->
            <rect x="360" y="240" width="80" height="100" rx="8" fill="#334155" />
            <rect x="360" y="470" width="80" height="100" rx="8" fill="#334155" />
            <!-- Watch Dial -->
            <rect x="330" y="320" width="140" height="170" rx="24" fill="#0f172a" stroke="#60a5fa" stroke-width="5" />
            <!-- Screen Content -->
            <text x="400" y="380" text-anchor="middle" fill="#f8fafc" font-size="28" font-weight="bold">10:48</text>
            <text x="400" y="415" text-anchor="middle" fill="#ef4444" font-size="16">❤️ 72 BPM</text>
            <text x="400" y="445" text-anchor="middle" fill="#34d399" font-size="15">👣 8,420 Steps</text>
            <text x="400" y="590" text-anchor="middle" fill="#93c5fd" font-size="18" font-weight="bold">150+ CLOUD WATCH FACES</text>
        """
    },
    {
        "filename": "brass-diya.svg",
        "bg_top": "#78350f", "bg_bot": "#92400e",
        "brand": "TEMPLE ARTS BRASS", "title": "Solid Brass Peacock Diya Kuthuvilakku",
        "accent": "#fde047", "icon": "🪔",
        "detail": "Handcrafted Heavy Brass 5-Wick Pair (12 Inch)",
        "badge": "TRADITIONAL TEMPLE BRASS • HANDMADE",
        "graphic": """
            <circle cx="400" cy="420" r="160" fill="#b45309" opacity="0.4" />
            <!-- Peacock Finial Top -->
            <circle cx="400" cy="300" r="22" fill="#fbbf24" stroke="#78350f" stroke-width="2" />
            <text x="400" y="310" text-anchor="middle" font-size="24">🦚</text>
            <!-- Diya Oil Bowl & 5 Wick Notches -->
            <ellipse cx="400" cy="360" rx="90" ry="25" fill="#f59e0b" stroke="#fef08a" stroke-width="4" />
            <!-- Golden Flame -->
            <path d="M 400 315 Q 412 335 400 350 Q 388 335 400 315 Z" fill="#ef4444" />
            <circle cx="400" cy="340" r="6" fill="#fbbf24" />
            <!-- Column Stand -->
            <rect x="388" y="375" width="24" height="100" rx="4" fill="#d97706" stroke="#fbbf24" stroke-width="2" />
            <!-- Base Pedestal -->
            <ellipse cx="400" cy="485" rx="80" ry="22" fill="#b45309" stroke="#fef08a" stroke-width="4" />
            <text x="400" y="560" text-anchor="middle" fill="#fef08a" font-size="18" font-weight="bold">AUSPICIOUS PUJA KUTHUVILAKKU</text>
        """
    },
    {
        "filename": "jaipuri-razai.svg",
        "bg_top": "#831843", "bg_bot": "#9f1239",
        "brand": "JAIPUR LOOM", "title": "Jaipuri Sanganeri Pure Cotton Razai",
        "accent": "#fecdd3", "icon": "🛏️",
        "detail": "Hand-Block Printed Soft Featherlight Quilt",
        "badge": "100% SURGICAL COTTON • HAND PRINTED",
        "graphic": """
            <circle cx="400" cy="420" r="160" fill="#be123c" opacity="0.3" />
            <rect x="270" y="300" width="260" height="230" rx="14" fill="#fff1f2" stroke="#be123c" stroke-width="5" />
            <!-- Block Print Floral Motifs -->
            <circle cx="340" cy="360" r="25" fill="#fda4af" stroke="#9f1239" stroke-width="3" />
            <circle cx="460" cy="360" r="25" fill="#fda4af" stroke="#9f1239" stroke-width="3" />
            <circle cx="400" cy="420" r="30" fill="#fb7185" stroke="#881337" stroke-width="3" />
            <circle cx="340" cy="475" r="25" fill="#fda4af" stroke="#9f1239" stroke-width="3" />
            <circle cx="460" cy="475" r="25" fill="#fda4af" stroke="#9f1239" stroke-width="3" />
            <text x="400" y="432" text-anchor="middle" font-size="32">🌸</text>
            <text x="400" y="570" text-anchor="middle" fill="#fecdd3" font-size="18" font-weight="bold">TRADITIONAL SANGANER PRINT</text>
        """
    },
    {
        "filename": "kumkumadi-fluid.svg",
        "bg_top": "#451a03", "bg_bot": "#78350f",
        "brand": "FOREST ESSENTIALS", "title": "Kumkumadi Miraculous Night Fluid",
        "accent": "#fde047", "icon": "✨",
        "detail": "Kashmiri Saffron & 26 Ayurvedic Herbs (30ml)",
        "badge": "CLASSICAL AYURVEDA • FSSAI CERTIFIED",
        "graphic": """
            <circle cx="400" cy="420" r="160" fill="#92400e" opacity="0.3" />
            <!-- Amber Dropper Bottle -->
            <rect x="330" y="340" width="140" height="175" rx="20" fill="#78350f" stroke="#fbbf24" stroke-width="4" />
            <!-- Dropper Neck -->
            <rect x="375" y="295" width="50" height="45" fill="#b45309" stroke="#fbbf24" stroke-width="2" />
            <path d="M 370 295 L 430 295 L 415 260 L 385 260 Z" fill="#18181b" />
            <!-- Golden Herb Label -->
            <rect x="345" y="380" width="110" height="95" rx="6" fill="#fef3c7" stroke="#b45309" stroke-width="2" />
            <text x="400" y="415" text-anchor="middle" fill="#78350f" font-size="14" font-weight="bold">KUMKUMADI</text>
            <text x="400" y="435" text-anchor="middle" fill="#b45309" font-size="10">TAILAM (30ML)</text>
            <text x="400" y="460" text-anchor="middle" font-size="20">🌸</text>
            <text x="400" y="565" text-anchor="middle" fill="#fef08a" font-size="18" font-weight="bold">PURE AYURVEDIC BEAUTY ELIXIR</text>
        """
    },
    {
        "filename": "sandalwood-set.svg",
        "bg_top": "#78350f", "bg_bot": "#92400e",
        "brand": "MYSORE HERITAGE", "title": "Mysore Sandalwood Oil & Agarbatti Set",
        "accent": "#fed7aa", "icon": "🌿",
        "detail": "Distilled Santalum Album Essential Oil & Incense",
        "badge": "GOVT. CERTIFIED MYSORE SANDALWOOD",
        "graphic": """
            <circle cx="400" cy="420" r="160" fill="#b45309" opacity="0.3" />
            <!-- Sandalwood Oil Flask -->
            <circle cx="340" cy="440" r="45" fill="#d97706" stroke="#fef08a" stroke-width="3" />
            <rect x="325" y="365" width="30" height="40" fill="#b45309" stroke="#fef08a" stroke-width="2" />
            <!-- Agarbatti Sticks in Holder -->
            <path d="M 440 480 L 480 320" stroke="#78350f" stroke-width="5" stroke-linecap="round" />
            <path d="M 450 480 L 505 330" stroke="#92400e" stroke-width="5" stroke-linecap="round" />
            <path d="M 430 480 L 455 315" stroke="#b45309" stroke-width="5" stroke-linecap="round" />
            <circle cx="480" cy="318" r="4" fill="#ef4444" />
            <circle cx="505" cy="328" r="4" fill="#ef4444" />
            <circle cx="455" cy="313" r="4" fill="#ef4444" />
            <!-- Smoke Swirls -->
            <path d="M 480 315 Q 495 285 475 260" stroke="#e2e8f0" stroke-width="2" fill="none" opacity="0.7" />
            <text x="400" y="565" text-anchor="middle" fill="#fef3c7" font-size="18" font-weight="bold">FRAGRANT TEMPLE CHANDAN</text>
        """
    }
]

template = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <style>
      .font-sans {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }}
    </style>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{bg_top}" />
      <stop offset="100%" stop-color="{bg_bot}" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.15)" />
      <stop offset="100%" stop-color="rgba(0,0,0,0)" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="800" fill="url(#bg-grad)" class="font-sans" />
  <circle cx="400" cy="400" r="380" fill="url(#glow)" />

  <!-- Outer Border Frame -->
  <rect x="20" y="20" width="760" height="760" rx="20" fill="none" stroke="{accent}" stroke-width="2" opacity="0.4" />

  <!-- Brand & Badge Header -->
  <rect x="40" y="45" width="220" height="34" rx="6" fill="rgba(0,0,0,0.3)" stroke="{accent}" stroke-width="1.5" />
  <text x="55" y="68" fill="{accent}" font-size="13" font-weight="900" letter-spacing="1">{brand}</text>

  <rect x="520" y="45" width="240" height="34" rx="6" fill="#ea580c" />
  <text x="640" y="67" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="900">{badge}</text>

  <!-- Center Artwork -->
  {graphic}

  <!-- Bottom Title & Detail Plaque -->
  <rect x="40" y="680" width="720" height="80" rx="12" fill="rgba(15,23,42,0.85)" stroke="{accent}" stroke-width="1.5" />
  <text x="60" y="715" fill="#ffffff" font-size="20" font-weight="900">{title}</text>
  <text x="60" y="742" fill="{accent}" font-size="14" font-weight="600">{detail}</text>
  <text x="730" y="730" text-anchor="end" fill="#ffffff" font-size="32">{icon}</text>
</svg>
"""

for p in products:
    content = template.format(**p)
    filepath = os.path.join(output_dir, p['filename'])
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Generated: {filepath}")

print(f"\nSuccessfully generated {len(products)} custom Indian product images in {output_dir}/")
