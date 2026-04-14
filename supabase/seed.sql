-- ============================================================
-- Everest Smart Traders — Seed Data
-- Run AFTER schema + RLS migrations
-- ============================================================
-- ── SITE SETTINGS ────────────────────────────────────────────────────────
insert into
  public.site_settings (key, value, description)
values
  (
    'business_name',
    '"Everest Smart Traders"',
    'Business display name'
  ),
  (
    'address',
    '"New Baneshwor, Kathmandu, Nepal"',
    'Human-readable business address'
  ),
  (
    'tagline',
    '"Smart Security & Automation Solutions"',
    'Short tagline'
  ),
  (
    'phones',
    '{"primary": "9860819528", "secondary": "9862268680"}',
    'Contact phone numbers'
  ),
  (
    'email',
    '"everestsmarttraders@gmail.com"',
    'Primary contact email'
  ),
  (
    'whatsapp',
    '"9860819528"',
    'WhatsApp number (digits only)'
  ),
  (
    'social_links',
    '{"facebook": "", "instagram": "", "tiktok": "", "youtube": ""}',
    'Social media profile URLs'
  ),
  (
    'locations',
    '[{"label": "Main Office", "address": "New Baneshwor, Kathmandu, Nepal", "map_embed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.32024905902!2d85.31671451243716!3d27.676495226749722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19007624b50b%3A0x98e1a48a7ee6e870!2sEverest%20Smart%20Traders!5e0!3m2!1sen!2snp!4v1776147661054!5m2!1sen!2snp"}]',
    'Branch locations'
  ),
  (
    'business_hours',
    '"Sunday–Friday: 9 AM – 6 PM (NST)"',
    'Business hours text'
  ),
  (
    'service_area',
    '"We serve Kathmandu Valley and major cities across Nepal"',
    'Service coverage text'
  ),
  (
    'logo_url',
    '""',
    'Primary logo URL'
  ),
  (
    'favicon_url',
    '""',
    'Favicon URL'
  ),
  (
    'seo_defaults',
    '{"title": "Everest Smart Traders", "description": "Nepal trusted supplier and installer of gate automation, smart door locks, hotel lock systems, and automation solutions.", "og_image": ""}',
    'Default SEO settings'
  ),
  (
    'hero_ctas',
    '[{"label": "Request a Quote", "href": "/quote", "variant": "primary"}, {"label": "View Products", "href": "/products", "variant": "outline"}, {"label": "WhatsApp Us", "href": "https://wa.me/9779860819528", "variant": "whatsapp"}]',
    'Hero section CTA buttons'
  ) on conflict (key) do nothing;

-- ── PRODUCT CATEGORIES ───────────────────────────────────────────────────
insert into
  public.product_categories (
    name,
    slug,
    description,
    icon,
    position,
    is_active
  )
values
  (
    'Gate Automation',
    'gate-automation',
    'Sliding and swing gate opening systems for residential and commercial properties',
    'gate',
    1,
    true
  ),
  (
    'Door Access Systems',
    'door-access',
    'Smart door locks, hotel lock systems, electric locks, and digital access control',
    'lock',
    2,
    true
  ),
  (
    'Shutter & Roller Motors',
    'shutter-motors',
    'Rolling shutter motors and automation systems for shops, warehouses, and garages',
    'rollers',
    3,
    true
  ),
  (
    'Curtain Motors',
    'curtain-motors',
    'Automated curtain and blind motor systems for smart homes and commercial spaces',
    'blinds',
    4,
    true
  ),
  (
    'Video Door Phone',
    'video-door-phone',
    'Video intercom and entry systems with remote access and monitoring',
    'monitor',
    5,
    true
  ),
  (
    'Access Control',
    'access-control',
    'Digital keypads, card readers, biometric access, and entry management systems',
    'shield',
    6,
    true
  );

-- ── PRODUCTS ─────────────────────────────────────────────────────────────
-- Gate Automation
insert into
  public.products (
    name,
    slug,
    short_description,
    category_id,
    is_featured,
    is_published,
    position,
    specifications,
    features,
    use_cases
  )
select
  'Sliding Gate Opener — Heavy Duty',
  'sliding-gate-opener-heavy-duty',
  'High-torque sliding gate motor for wide residential and commercial entrances up to 800 kg.',
  id,
  true,
  true,
  1,
  '[{"label": "Max Gate Weight", "value": "800 kg"}, {"label": "Gate Width", "value": "Up to 20 m"}, {"label": "Motor Power", "value": "500W"}, {"label": "Operating Voltage", "value": "220V AC"}, {"label": "Speed", "value": "0.15–0.20 m/s"}, {"label": "Protection Class", "value": "IP44"}, {"label": "Remote Range", "value": "Up to 100 m"}, {"label": "Working Temperature", "value": "-20°C to +55°C"}]',
  '["Built-in obstacle detection and auto-reverse", "Manual release for power outages", "Soft start and soft stop", "Compatible with access control systems", "Anti-crushing safety edge support", "Remote control included", "Adjustable speed and limits"]',
  '{"residentialGates", "commercialEntrances", "industrialGates", "parkingFacilities"}'
from
  public.product_categories
where
  slug = 'gate-automation';

insert into
  public.products (
    name,
    slug,
    short_description,
    category_id,
    is_featured,
    is_published,
    position,
    specifications,
    features,
    use_cases
  )
select
  'Swing Gate Opener — Dual Arm',
  'swing-gate-opener-dual-arm',
  'Linear actuator system for double-leaf swing gates, ideal for homes, offices, and apartment complexes.',
  id,
  true,
  true,
  2,
  '[{"label": "Max Leaf Weight", "value": "300 kg per leaf"}, {"label": "Max Leaf Width", "value": "5 m per leaf"}, {"label": "Motor Type", "value": "24V DC"}, {"label": "Opening Time", "value": "15–20 seconds"}, {"label": "Protection Class", "value": "IP44"}, {"label": "Remote Range", "value": "Up to 80 m"}]',
  '["Dual leaf synchronisation", "Obstacle detection with auto-reverse", "Manual release mechanism", "Solar panel compatible (optional)", "Remote and keypad compatible", "Customisable open/close timing"]',
  '{"residentialHomes", "apartmentComplexes", "offices", "schools"}'
from
  public.product_categories
where
  slug = 'gate-automation';

-- Door Access
insert into
  public.products (
    name,
    slug,
    short_description,
    category_id,
    is_featured,
    is_published,
    position,
    specifications,
    features,
    use_cases
  )
select
  'Hotel Door Lock — RFID Card System',
  'hotel-door-lock-rfid',
  'Professional RFID hotel lock with front desk management software, suitable for hotels, guesthouses, and resorts.',
  id,
  true,
  true,
  1,
  '[{"label": "Card Technology", "value": "RFID 13.56 MHz"}, {"label": "Battery", "value": "4× AA (12–18 months)"}, {"label": "Material", "value": "Zinc alloy + ABS"}, {"label": "Finish", "value": "Gold / Silver / Black"}, {"label": "Software", "value": "Included front desk management"}, {"label": "Low Battery Warning", "value": "Yes"}]',
  '["Multiple access levels — guest, housekeeper, manager, master", "Mechanical emergency override", "Audit trail — last 500 entries", "Anti-peeping keypad", "Auto-lock on close", "Management software for Windows", "Emergency opening tool included"]',
  '{"hotels", "guesthouses", "resorts", "serviced_apartments"}'
from
  public.product_categories
where
  slug = 'door-access';

insert into
  public.products (
    name,
    slug,
    short_description,
    category_id,
    is_featured,
    is_published,
    position,
    specifications,
    features,
    use_cases
  )
select
  'Smart Door Lock — Fingerprint & PIN',
  'smart-door-lock-fingerprint-pin',
  'Multi-mode digital door lock with fingerprint, PIN, RFID card, and mechanical key access.',
  id,
  true,
  true,
  2,
  '[{"label": "Access Modes", "value": "Fingerprint, PIN, RFID Card, Key"}, {"label": "Fingerprint Capacity", "value": "100"}, {"label": "PIN Capacity", "value": "100 codes"}, {"label": "Battery", "value": "4× AA (8–12 months)"}, {"label": "Material", "value": "Stainless steel"}, {"label": "Fire Rating", "value": "Compatible"}]',
  '["Touchscreen keypad with anti-smudge coating", "Auto-lock after configurable delay", "Wrong PIN alarm", "One-time visitor codes", "Remote app control (Wi-Fi model)", "Low battery USB emergency charging", "Passage mode for high-traffic hours"]',
  '{"homes", "offices", "apartments", "commercial"}'
from
  public.product_categories
where
  slug = 'door-access';

-- Shutter Motors
insert into
  public.products (
    name,
    slug,
    short_description,
    category_id,
    is_featured,
    is_published,
    position,
    specifications,
    features,
    use_cases
  )
select
  'Rolling Shutter Motor — Tubular',
  'rolling-shutter-motor-tubular',
  'Built-in tubular motor for rolling shutters and garage doors, with remote control and limit adjustment.',
  id,
  false,
  true,
  1,
  '[{"label": "Power", "value": "120W / 250W options"}, {"label": "Torque", "value": "20 Nm – 50 Nm"}, {"label": "Speed", "value": "14–16 RPM"}, {"label": "Voltage", "value": "220V 50Hz"}, {"label": "Duty Cycle", "value": "20%"}, {"label": "Protection Class", "value": "IP44"}, {"label": "Tube Diameter", "value": "60 mm / 76 mm"}]',
  '["Internal limit switches — no external wiring", "Thermal overload protection", "Obstacle force stop", "RF remote included", "Compatible with timers and smart switches", "Low maintenance brushless options available"]',
  '{"shops", "warehouses", "garages", "securityGrilles"}'
from
  public.product_categories
where
  slug = 'shutter-motors';

-- Curtain Motors
insert into
  public.products (
    name,
    slug,
    short_description,
    category_id,
    is_featured,
    is_published,
    position,
    specifications,
    features,
    use_cases
  )
select
  'Curtain Motor — Smart Wi-Fi',
  'curtain-motor-wifi',
  'Quiet Wi-Fi curtain track motor compatible with Alexa, Google Home, and Tuya Smart for home automation.',
  id,
  false,
  true,
  1,
  '[{"label": "Power", "value": "36W"}, {"label": "Max Curtain Weight", "value": "50 kg"}, {"label": "Max Track Length", "value": "6 m"}, {"label": "Noise Level", "value": "< 40 dB"}, {"label": "Voltage", "value": "220V AC"}, {"label": "Connectivity", "value": "2.4 GHz Wi-Fi"}, {"label": "App", "value": "Tuya Smart / SmartLife"}]',
  '["Voice control via Alexa and Google Home", "Scheduled automation and scenes", "Touch manual override", "Battery backup model available", "Adjustable speed and soft start/stop", "RF remote compatible", "Works without Wi-Fi via remote"]',
  '{"smartHomes", "hotels", "offices", "cinemas"}'
from
  public.product_categories
where
  slug = 'curtain-motors';

-- Video Door Phone
insert into
  public.products (
    name,
    slug,
    short_description,
    category_id,
    is_featured,
    is_published,
    position,
    specifications,
    features,
    use_cases
  )
select
  'Video Door Phone — 7" Touchscreen',
  'video-door-phone-7-inch',
  '7-inch colour touchscreen video door intercom with two-way audio, door release, and mobile app support.',
  id,
  true,
  true,
  1,
  '[{"label": "Screen", "value": "7\" TFT colour touchscreen"}, {"label": "Resolution", "value": "1200 × 900 px"}, {"label": "Camera", "value": "1.3 MP wide-angle"}, {"label": "Night Vision", "value": "IR night vision"}, {"label": "Audio", "value": "Full duplex two-way"}, {"label": "Door Release", "value": "Built-in electric lock control"}, {"label": "Memory", "value": "Photo capture, SD card up to 32 GB"}, {"label": "App", "value": "Mobile app support (Wi-Fi model)"}]',
  '["Photo and video capture on ring/motion", "Multi-apartment support (up to 8 indoor units)", "Unlock door remotely from indoor unit or phone", "Do-not-disturb mode", "2-wire or IP system options", "Weather-proof outdoor panel", "Call forwarding to mobile when away"]',
  '{"apartments", "homes", "offices", "commercialBuildings"}'
from
  public.product_categories
where
  slug = 'video-door-phone';

-- ── SERVICES ─────────────────────────────────────────────────────────────
insert into
  public.services (
    name,
    slug,
    intro,
    is_published,
    position,
    key_benefits,
    ideal_use_cases
  )
values
  (
    'Gate Automation',
    'gate-automation',
    'Complete supply and installation of sliding gate openers, swing gate openers, and remote access systems for homes, offices, and commercial properties across Nepal.',
    true,
    1,
    '["Increased security and controlled entry", "Convenient remote operation", "Suitable for heavy-duty commercial gates", "Integration with access control systems", "After-sales maintenance and support"]',
    '{"residentialHomes", "apartments", "offices", "factories", "commercialComplexes"}'
  ),
  (
    'Hotel Lock Systems',
    'hotel-lock-systems',
    'Professional supply, installation, programming, and staff training for hotel RFID door lock systems with front desk management software.',
    true,
    2,
    '["Centralised front desk management", "Multiple access levels for staff hierarchy", "Audit trail for all door entries", "Quick card encoding for check-in/check-out", "Emergency master override"]',
    '{"hotels", "guesthouses", "resorts", "serviced_apartments", "hostels"}'
  ),
  (
    'Smart Door Lock Installation',
    'smart-door-lock-installation',
    'Supply and professional installation of digital door locks for homes, apartments, and offices with fingerprint, PIN, RFID, and app-based access.',
    true,
    3,
    '["No keys to lose or copy", "Multiple user access codes", "Auto-lock for security", "Real-time entry logs", "Remote access via app (Wi-Fi models)"]',
    '{"homes", "apartments", "offices", "retail"}'
  ),
  (
    'Rolling Shutter Automation',
    'rolling-shutter-automation',
    'Motorisation and automation of existing rolling shutters or full supply and installation of new shutter motor systems for shops, warehouses, and commercial buildings.',
    true,
    4,
    '["Remote operation — no manual rolling", "Timer-based open/close scheduling", "Obstacle safety stop", "Improved shop security", "Compatible with existing shutters in most cases"]',
    '{"shops", "showrooms", "warehouses", "garages", "storage"}'
  ),
  (
    'Curtain Motor Automation',
    'curtain-motor-automation',
    'Smart curtain and blind motor installation with app control, voice assistant integration, and scene-based automation for homes and hospitality.',
    true,
    5,
    '["Voice and app control", "Scheduled scenes (morning, evening, movie mode)", "No structural changes required", "Works with existing curtain tracks", "Hotel room guest experience upgrade"]',
    '{"smartHomes", "hotels", "executiveOffices", "cinemas"}'
  ),
  (
    'Video Door Phone & Entry Systems',
    'video-door-phone-entry',
    'Supply and installation of video intercom systems, electric lock integration, and entry management for residential and commercial buildings.',
    true,
    6,
    '["Visual verification before entry", "Remote door release from anywhere", "Photo/video capture log", "Multi-unit apartment support", "Night vision and weather-proof panels"]',
    '{"apartments", "homes", "offices", "schools", "hospitals"}'
  );

-- ── INDUSTRIES ───────────────────────────────────────────────────────────
insert into
  public.industries (
    name,
    slug,
    icon,
    description,
    solutions_summary,
    is_active,
    position
  )
values
  (
    'Hotels & Hospitality',
    'hotels',
    'hotel',
    'Automation and security solutions tailored for the hospitality industry — hotel lock systems, curtain motors, and access control.',
    'Hotel lock systems, curtain motor automation, video door phone for front desk, gate automation for driveways',
    true,
    1
  ),
  (
    'Residential Homes',
    'homes',
    'home',
    'Smart, secure, and convenient automation for new builds and existing homes across Nepal.',
    'Smart door locks, swing gate openers, curtain motors, video door phone, rolling shutter automation',
    true,
    2
  ),
  (
    'Commercial & Offices',
    'offices',
    'building',
    'Professional access control and automation solutions for corporate offices, banks, and commercial buildings.',
    'Digital door locks, sliding gate openers, access control systems, shutter motors, video door phone',
    true,
    3
  ),
  (
    'Retail & Shops',
    'retail',
    'store',
    'Secure and automated shutter systems for retail shops, showrooms, and restaurants.',
    'Rolling shutter motors, digital door locks, gate automation, video entry systems',
    true,
    4
  ),
  (
    'Builders & Developers',
    'developers',
    'hammer',
    'Bulk supply and project-based installation for property developers and construction projects.',
    'Complete smart home/building packages — all automation and security solutions at project scale',
    true,
    5
  ),
  (
    'Institutions',
    'institutions',
    'shield',
    'Robust access control and gate automation for schools, hospitals, factories, and institutions.',
    'Sliding gate openers, access control, electric locks, shutter motors, video intercom',
    true,
    6
  );

-- ── FAQs ─────────────────────────────────────────────────────────────────
insert into
  public.faqs (
    question,
    answer,
    category,
    is_published,
    position
  )
values
  (
    'Which areas do you serve?',
    'We are based in Nepal and primarily serve Kathmandu Valley. We also undertake projects in Pokhara, Chitwan, and other major cities. Contact us to discuss your location.',
    'General',
    true,
    1
  ),
  (
    'Do you install the products or only supply them?',
    'We both supply and professionally install all products. Our team handles delivery, installation, testing, and handover training at your site.',
    'General',
    true,
    2
  ),
  (
    'What is covered under your warranty?',
    'All products come with manufacturer warranty (typically 1–2 years). We also offer after-sales service support for maintenance and repairs.',
    'General',
    true,
    3
  ),
  (
    'Can I request a product demonstration before buying?',
    'Yes, we offer product demonstrations at our office or can arrange an on-site visit for larger projects. Contact us to schedule.',
    'General',
    true,
    4
  ),
  (
    'How long does installation take?',
    'Most residential installations are completed in 1–2 days. Hotel lock system projects and larger commercial installations may take 3–7 days depending on scope.',
    'Installation',
    true,
    5
  ),
  (
    'Do you offer hotel lock system training for staff?',
    'Yes, all hotel lock system installations include on-site software training for front desk staff and a handover session for the hotel manager.',
    'Hotel',
    true,
    6
  ),
  (
    'Can rolling shutter motors be fitted to existing shutters?',
    'In most cases, yes. We assess your existing shutter dimensions and type to select the correct motor. Contact us with your shutter size for a quote.',
    'Shutter',
    true,
    7
  ),
  (
    'Are your smart door locks compatible with existing door frames?',
    'Our locks are compatible with most standard door frames. For unusual door types (glass, sliding, heavy timber), we assess suitability before installation.',
    'Locks',
    true,
    8
  ),
  (
    'Can gate automation work during a power cut?',
    'All gate openers include a manual release mechanism for power outages. Battery backup and UPS-connected options are also available on request.',
    'Gate',
    true,
    9
  ),
  (
    'How do I get a price quote?',
    'Use the Request Quote form on our website, send a WhatsApp message to 9860819528, or call us directly. Provide your product requirements, location, and any site photos for a faster quote.',
    'General',
    true,
    10
  );

-- ── HOMEPAGE SECTIONS ────────────────────────────────────────────────────
insert into
  public.homepage_sections (
    section_key,
    title,
    subtitle,
    is_visible,
    position,
    content
  )
values
  (
    'hero',
    'Automate. Secure. Elevate.',
    'Smart gate systems, hotel locks, shutter motors, and access control — supplied and installed by Nepal''s trusted automation specialists.',
    true,
    1,
    '{}'
  ),
  (
    'trust_strip',
    'Why Businesses Trust Us',
    null,
    true,
    2,
    '{}'
  ),
  (
    'solutions',
    'Our Solutions',
    'From hotel lock systems to gate automation — complete security and automation for every space.',
    true,
    3,
    '{}'
  ),
  (
    'featured_products',
    'Featured Products',
    'Quality automation equipment from trusted global brands, installed by our certified team.',
    true,
    4,
    '{}'
  ),
  (
    'industries',
    'Industries We Serve',
    'Tailored solutions for hotels, homes, offices, shops, and builders across Nepal.',
    true,
    5,
    '{}'
  ),
  (
    'why_us',
    'Why Choose Everest Smart Traders',
    null,
    true,
    6,
    '{"reasons": [{"icon": "wrench", "title": "Expert Installation", "description": "Certified technicians with real-world experience across Nepal"}, {"icon": "headset", "title": "After-Sales Support", "description": "We are here after handover — maintenance, repairs, and software support"}, {"icon": "star", "title": "Quality Products", "description": "We source from trusted global brands tested in Nepal''s climate"}, {"icon": "map-pin", "title": "Nepal-Based Service", "description": "Local team, local knowledge, responsive to your location and needs"}]}'
  ),
  (
    'projects',
    'Recent Installations',
    'Real projects, real results — from Kathmandu hotels to residential complexes.',
    true,
    7,
    '{}'
  ),
  (
    'testimonials',
    'What Our Clients Say',
    null,
    true,
    8,
    '{}'
  ),
  (
    'blog',
    'Guides & Insights',
    'Learn about smart security, gate automation, and making the right product choices.',
    true,
    9,
    '{}'
  ),
  (
    'faq',
    'Frequently Asked Questions',
    null,
    true,
    10,
    '{}'
  ),
  (
    'cta_band',
    'Ready to Upgrade Your Security?',
    'Get a free site assessment and personalised quote. Our team is available Sunday–Friday.',
    true,
    11,
    '{}'
  );
