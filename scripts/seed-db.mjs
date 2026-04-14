/**
 * Everest Smart Traders — Full Database Seed Script
 * Run:
 *   node scripts/seed-db.mjs
 *   node scripts/seed-db.mjs --reset
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local/.env
 * Uses the service-role key → bypasses RLS → full write access
 */

import { readFileSync, existsSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const shouldReset = process.argv.includes("--reset");

// ── Load .env.local or .env ─────────────────────────────────────────────────
const envCandidates = [
  new URL("../.env.local", import.meta.url).pathname,
  new URL("../.env", import.meta.url).pathname,
];

const envPath = envCandidates.find((path) => existsSync(path));
let envVars = {};
try {
  if (!envPath) {
    throw new Error("No env file found");
  }
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    envVars[key] = val;
  }
} catch {
  console.error("Could not read .env.local/.env — make sure one exists");
  process.exit(1);
}

const SUPABASE_URL = envVars["NEXT_PUBLIC_SUPABASE_URL"];
const SERVICE_KEY = envVars["SUPABASE_SERVICE_ROLE_KEY"];

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// ── Helpers ─────────────────────────────────────────────────────────────────
async function upsert(table, data, conflictCol = "slug") {
  const { error } = await supabase
    .from(table)
    .upsert(data, { onConflict: conflictCol, ignoreDuplicates: false });
  if (error) {
    console.error(`  ✗ ${table}:`, error.message);
  } else {
    console.log(`  ✓ ${table} — ${data.length} rows`);
  }
}

async function upsertNoSlug(table, data) {
  // For tables without a natural unique key — replace all rows for deterministic mock data
  const { error: deleteError } = await supabase
    .from(table)
    .delete()
    .not("id", "is", null);
  if (deleteError) {
    console.error(`  ✗ ${table} delete:`, deleteError.message);
    return;
  }

  const { error } = await supabase.from(table).insert(data);
  if (error) {
    console.error(`  ✗ ${table}:`, error.message);
  } else {
    console.log(`  ✓ ${table} — ${data.length} rows`);
  }
}

async function clearTable(table, idColumn = "id") {
  const { error } = await supabase
    .from(table)
    .delete()
    .not(idColumn, "is", null);

  if (error) {
    console.error(`  ✗ ${table} clear:`, error.message);
    return false;
  }

  console.log(`  ✓ ${table} cleared`);
  return true;
}

async function resetApplicationData() {
  console.log("\n🧹 Reset mode enabled: clearing existing application data…");

  // Keep auth users/profiles intact so admin access is preserved.
  // Clear in FK-safe order.
  const clearPlan = [
    ["project_products", "project_id"],
    ["project_images", "id"],
    ["product_images", "id"],
    ["testimonials", "id"],
    ["faqs", "id"],
    ["media_assets", "id"],
    ["inquiries", "id"],
    ["blog_posts", "id"],
    ["blog_categories", "id"],
    ["projects", "id"],
    ["products", "id"],
    ["industries", "id"],
    ["services", "id"],
    ["product_categories", "id"],
    ["seo_overrides", "id"],
    ["announcements", "id"],
    ["homepage_sections", "id"],
    ["site_settings", "id"],
  ];

  let hasFailure = false;
  for (const [table, idColumn] of clearPlan) {
    const ok = await clearTable(table, idColumn);
    if (!ok) hasFailure = true;
  }

  if (hasFailure) {
    console.error(
      "\nReset failed on one or more tables. Aborting seed to avoid partial state.",
    );
    process.exit(1);
  }
}

if (shouldReset) {
  await resetApplicationData();
}

// ── Image URLs ───────────────────────────────────────────────────────────────
// Each content item gets a unique image from the 100-image pool.
// Image 075 is reserved for the hero section.
// Format: /images/home-automation/home-automation-NNN.jpg
const ha = (n) =>
  `/images/home-automation/home-automation-${String(n).padStart(3, "0")}.jpg`;

const ASSET = {
  logo: "/images/brand-transparent.png",
  favicon: "/images/brand-transparent.png",
  hero: "/images/home-automation/home-automation-075.jpg",
  // Unique images per section (non-repeating, skip 075)
  // Categories: 001–010
  catGate: ha(1),
  catDoor: ha(2),
  catShutter: ha(3),
  catCurtain: ha(4),
  catVdp: ha(5),
  catAccess: ha(6),
  catSmartHome: ha(7),
  catCctv: ha(8),
  catElock: ha(9),
  catBarrier: ha(10),
  // Products: 011–020
  prodGate1: ha(11),
  prodGate2: ha(12),
  prodGate3: ha(13),
  prodHotelLock: ha(14),
  prodSmartLock: ha(15),
  prodShutter: ha(16),
  prodCurtain: ha(17),
  prodVdp: ha(18),
  prodAccess: ha(19),
  prodSmartHub: ha(20),
  // Services: 021–030
  svcGate: ha(21),
  svcHotel: ha(22),
  svcLock: ha(23),
  svcShutter: ha(24),
  svcCurtain: ha(25),
  svcVdp: ha(26),
  svcAccess: ha(27),
  svcCctv: ha(28),
  svcAmc: ha(29),
  svcSurvey: ha(30),
  // Industries: 031–040
  indHotel: ha(31),
  indHome: ha(32),
  indOffice: ha(33),
  indRetail: ha(34),
  indDeveloper: ha(35),
  indInstitution: ha(36),
  indFactory: ha(37),
  indHospital: ha(38),
  indSchool: ha(39),
  indApartment: ha(40),
  // Projects: 041–050
  projHyatt: ha(41),
  projSunrise: ha(42),
  projPokhara: ha(43),
  projOffice: ha(44),
  projBhatbhateni: ha(45),
  projTribhuvan: ha(46),
  projIndustrial: ha(47),
  projVilla: ha(48),
  projHospital: ha(49),
  projDhulikhel: ha(50),
  // Blog posts: 051–060
  blog1: ha(51),
  blog2: ha(52),
  blog3: ha(53),
  blog4: ha(54),
  blog5: ha(55),
  blog6: ha(56),
  blog7: ha(57),
  blog8: ha(58),
  blog9: ha(59),
  blog10: ha(60),
  // Product gallery alternates: 061–070
  prodAlt1: ha(61),
  prodAlt2: ha(62),
  prodAlt3: ha(63),
  prodAlt4: ha(64),
  prodAlt5: ha(65),
  prodAlt6: ha(66),
  prodAlt7: ha(67),
  prodAlt8: ha(68),
  prodAlt9: ha(69),
  prodAlt10: ha(70),
  // Project gallery alternates: 071–074, 076–080 (skip 075 = hero)
  projAlt1: ha(71),
  projAlt2: ha(72),
  projAlt3: ha(73),
  projAlt4: ha(74),
  projAlt5: ha(76),
  projAlt6: ha(77),
  projAlt7: ha(78),
  projAlt8: ha(79),
  projAlt9: ha(80),
  projAlt10: ha(81),
  // SEO / OG images: 082–090
  ogHome: ha(82),
  ogProducts: ha(83),
  ogBlog: ha(84),
  ogServices: ha(85),
  ogContact: ha(86),
};

// Named lookup — used inline below per-item
function img(key) {
  return ASSET[key] ?? ASSET.ogHome;
}

// ── 1. SITE SETTINGS ─────────────────────────────────────────────────────────
console.log("\n📋 Site Settings…");
const LOCATION_URL = "https://maps.app.goo.gl/WXDSNh6swgonpxC17";
const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.32024905902!2d85.31671451243716!3d27.676495226749722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19007624b50b%3A0x98e1a48a7ee6e870!2sEverest%20Smart%20Traders!5e0!3m2!1sen!2snp!4v1776147661054!5m2!1sen!2snp";
const siteSettings = [
  {
    key: "site_name",
    value: "Everest Smart Traders",
    description: "Site name",
  },
  {
    key: "business_name",
    value: "Everest Smart Traders",
    description: "Business display name",
  },
  {
    key: "tagline",
    value: "Smart Security & Automation Solutions",
    description: "Short tagline",
  },
  {
    key: "phones",
    value: { primary: "9860819528", secondary: "9862268680" },
    description: "Contact phone numbers",
  },
  {
    key: "email",
    value: "everestsmarttraders@gmail.com",
    description: "Primary contact email",
  },
  { key: "whatsapp", value: "9860819528", description: "WhatsApp number" },
  {
    key: "address",
    value: "New Baneshwor, Kathmandu, Nepal",
    description: "Human-readable business address for display",
  },
  {
    key: "social_links",
    value: {
      facebook: "https://facebook.com/everestsmarttraders",
      instagram: "https://www.instagram.com/everestsmart",
      tiktok: "https://www.tiktok.com/@everestsmarttrade",
      youtube: "",
    },
    description: "Social media URLs",
  },
  {
    key: "locations",
    value: [
      {
        label: "Main Office",
        address: "New Baneshwor, Kathmandu, Nepal",
        map_embed: MAP_EMBED_URL,
      },
    ],
    description: "Branch locations",
  },
  {
    key: "business_hours",
    value: "Sunday–Friday: 9 AM – 6 PM (NST)",
    description: "Business hours text",
  },
  {
    key: "service_area",
    value: "We serve Kathmandu Valley and major cities across Nepal",
    description: "Service coverage",
  },
  { key: "logo_url", value: ASSET.logo, description: "Logo URL" },
  { key: "favicon_url", value: ASSET.favicon, description: "Favicon URL" },
  { key: "hero_image_url", value: ASSET.hero, description: "Hero image URL" },
  {
    key: "seo_defaults",
    value: {
      title: "Everest Smart Traders",
      description:
        "Nepal's trusted supplier and installer of gate automation, smart door locks, hotel lock systems, and automation solutions.",
      og_image: ASSET.ogHome,
    },
    description: "Default SEO",
  },
  {
    key: "hero_ctas",
    value: [
      { label: "Request a Quote", href: "/quote", variant: "primary" },
      { label: "View Products", href: "/products", variant: "outline" },
      {
        label: "WhatsApp Us",
        href: "https://wa.me/9779860819528",
        variant: "whatsapp",
      },
    ],
    description: "Hero CTA buttons",
  },
];
await upsert("site_settings", siteSettings, "key");

// ── 2. PRODUCT CATEGORIES ─────────────────────────────────────────────────────
console.log("\n📦 Product Categories…");
const categories = [
  {
    name: "Gate Automation",
    slug: "gate-automation",
    description: "Sliding and swing gate motor systems for all property types",
    icon: "gate",
    position: 1,
    is_active: true,
    image_url: ASSET.catGate,
  },
  {
    name: "Door Access Systems",
    slug: "door-access",
    description:
      "Hotel locks, smart door locks, digital locks, and electric bolts",
    icon: "lock",
    position: 2,
    is_active: true,
    image_url: ASSET.catDoor,
  },
  {
    name: "Shutter & Roller Motors",
    slug: "shutter-motors",
    description:
      "Tubular and external motors for rolling shutters and garage doors",
    icon: "panels",
    position: 3,
    is_active: true,
    image_url: ASSET.catShutter,
  },
  {
    name: "Curtain Motors",
    slug: "curtain-motors",
    description: "Smart Wi-Fi and RF curtain motors for homes and hotels",
    icon: "blinds",
    position: 4,
    is_active: true,
    image_url: ASSET.catCurtain,
  },
  {
    name: "Video Door Phone",
    slug: "video-door-phone",
    description:
      "Colour video intercoms with remote door release and mobile app support",
    icon: "monitor",
    position: 5,
    is_active: true,
    image_url: ASSET.catVdp,
  },
  {
    name: "Access Control",
    slug: "access-control",
    description:
      "Keypads, card readers, biometric terminals, and entry management",
    icon: "shield",
    position: 6,
    is_active: true,
    image_url: ASSET.catAccess,
  },
  {
    name: "Smart Home Systems",
    slug: "smart-home",
    description: "Home automation hubs, smart switches, and scene controllers",
    icon: "home",
    position: 7,
    is_active: true,
    image_url: ASSET.catSmartHome,
  },
  {
    name: "CCTV & Surveillance",
    slug: "cctv-surveillance",
    description: "IP cameras, DVR/NVR systems, and remote monitoring solutions",
    icon: "camera",
    position: 8,
    is_active: true,
    image_url: ASSET.catCctv,
  },
  {
    name: "Electric Locks",
    slug: "electric-locks",
    description:
      "Electromagnetic and electric strike locks for doors and gates",
    icon: "key",
    position: 9,
    is_active: true,
    image_url: ASSET.catElock,
  },
  {
    name: "Barriers & Bollards",
    slug: "barriers-bollards",
    description:
      "Automatic road barriers and rising bollards for parking and security",
    icon: "barrier",
    position: 10,
    is_active: true,
    image_url: ASSET.catBarrier,
  },
];
await upsert("product_categories", categories, "slug");

// Fetch category IDs for product FK references
const { data: cats } = await supabase
  .from("product_categories")
  .select("id, slug");
const catId = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

// ── 3. PRODUCTS ───────────────────────────────────────────────────────────────
console.log("\n🛒 Products…");
const products = [
  {
    name: "Sliding Gate Opener — Heavy Duty",
    slug: "sliding-gate-opener-heavy-duty",
    category_id: catId["gate-automation"],
    short_description:
      "High-torque sliding gate motor for wide residential and commercial entrances up to 800 kg.",
    cover_image_url: ASSET.prodGate1,
    price_range: "Rs. 25,000 – 45,000",
    is_featured: true,
    is_published: true,
    position: 1,
    features: JSON.stringify([
      "Built-in obstacle detection and auto-reverse",
      "Manual release for power outages",
      "Soft start and soft stop",
      "Compatible with access control systems",
      "RF remote control included",
      "Adjustable speed and travel limits",
    ]),
    specifications: JSON.stringify([
      { label: "Max Gate Weight", value: "800 kg" },
      { label: "Gate Width", value: "Up to 20 m" },
      { label: "Motor Power", value: "500W" },
      { label: "Voltage", value: "220V AC" },
      { label: "Speed", value: "0.18 m/s" },
      { label: "Protection Class", value: "IP44" },
      { label: "Remote Range", value: "100 m" },
    ]),
  },
  {
    name: "Swing Gate Opener — Dual Arm",
    slug: "swing-gate-opener-dual-arm",
    category_id: catId["gate-automation"],
    short_description:
      "Linear actuator system for double-leaf swing gates, ideal for homes, offices, and apartment complexes.",
    cover_image_url: ASSET.prodGate2,
    price_range: "Rs. 20,000 – 35,000",
    is_featured: true,
    is_published: true,
    position: 2,
    features: JSON.stringify([
      "Dual leaf synchronisation",
      "Obstacle detection with auto-reverse",
      "Manual release mechanism",
      "Solar panel compatible (optional)",
      "Keypad & remote compatible",
    ]),
    specifications: JSON.stringify([
      { label: "Max Leaf Weight", value: "300 kg per leaf" },
      { label: "Max Leaf Width", value: "5 m" },
      { label: "Motor Type", value: "24V DC" },
      { label: "Opening Time", value: "15–20 s" },
      { label: "Remote Range", value: "80 m" },
    ]),
  },
  {
    name: "Underground Gate Motor — Hidden",
    slug: "underground-gate-motor-hidden",
    category_id: catId["gate-automation"],
    short_description:
      "Concealed underground actuator for swing gates — clean aesthetics, no visible motor arms.",
    cover_image_url: ASSET.prodGate3,
    price_range: "Rs. 55,000 – 90,000",
    is_featured: false,
    is_published: true,
    position: 3,
    features: JSON.stringify([
      "Fully concealed — no visible mechanics",
      "IP67 waterproof rated",
      "220V or 24V DC versions",
      "Anti-flooding design",
      "Compatible with all access controllers",
    ]),
    specifications: JSON.stringify([
      { label: "Max Leaf Weight", value: "500 kg per leaf" },
      { label: "Max Leaf Width", value: "4 m" },
      { label: "Protection Class", value: "IP67" },
      { label: "Voltage", value: "230V AC / 24V DC" },
    ]),
  },
  {
    name: "Hotel Door Lock — RFID Card System",
    slug: "hotel-door-lock-rfid",
    category_id: catId["door-access"],
    short_description:
      "Professional RFID hotel lock with front desk management software for hotels, guesthouses, and resorts.",
    cover_image_url: ASSET.prodHotelLock,
    price_range: "Rs. 8,000 – 15,000 per door",
    is_featured: true,
    is_published: true,
    position: 1,
    features: JSON.stringify([
      "Multiple access levels: guest, housekeeper, manager, master",
      "Audit trail — last 500 entries",
      "Anti-peeping keypad",
      "Auto-lock on close",
      "Management software for Windows included",
    ]),
    specifications: JSON.stringify([
      { label: "Card Technology", value: "RFID 13.56 MHz" },
      { label: "Battery", value: "4× AA (12–18 months)" },
      { label: "Material", value: "Zinc alloy + ABS" },
      { label: "Finish", value: "Gold / Silver / Black" },
    ]),
  },
  {
    name: "Smart Door Lock — Fingerprint & PIN",
    slug: "smart-door-lock-fingerprint-pin",
    category_id: catId["door-access"],
    short_description:
      "Multi-mode digital door lock with fingerprint, PIN, RFID card, and mechanical key access.",
    cover_image_url: ASSET.prodSmartLock,
    price_range: "Rs. 12,000 – 22,000",
    is_featured: true,
    is_published: true,
    position: 2,
    features: JSON.stringify([
      "Fingerprint, PIN, RFID card, and key access",
      "Touchscreen with anti-smudge coating",
      "Auto-lock after configurable delay",
      "One-time visitor codes",
      "Low battery USB emergency charging",
    ]),
    specifications: JSON.stringify([
      { label: "Access Modes", value: "Fingerprint, PIN, RFID, Key" },
      { label: "Fingerprint Capacity", value: "100" },
      { label: "Battery", value: "4× AA (8–12 months)" },
      { label: "Material", value: "Stainless steel" },
    ]),
  },
  {
    name: "Rolling Shutter Motor — Tubular 250W",
    slug: "rolling-shutter-motor-tubular",
    category_id: catId["shutter-motors"],
    short_description:
      "Built-in tubular motor for rolling shutters and garage doors, with remote control and limit adjustment.",
    cover_image_url: ASSET.prodShutter,
    price_range: "Rs. 9,000 – 18,000",
    is_featured: false,
    is_published: true,
    position: 1,
    features: JSON.stringify([
      "Internal limit switches — no external wiring",
      "Thermal overload protection",
      "Obstacle force stop",
      "RF remote included",
      "Compatible with timers and smart switches",
    ]),
    specifications: JSON.stringify([
      { label: "Power", value: "250W" },
      { label: "Torque", value: "40 Nm" },
      { label: "Speed", value: "14 RPM" },
      { label: "Voltage", value: "220V 50Hz" },
      { label: "Tube Diameter", value: "60 mm / 76 mm" },
    ]),
  },
  {
    name: "Curtain Motor — Smart Wi-Fi Tubular",
    slug: "curtain-motor-wifi",
    category_id: catId["curtain-motors"],
    short_description:
      "Quiet Wi-Fi curtain motor compatible with Alexa, Google Home, and Tuya Smart.",
    cover_image_url: ASSET.prodCurtain,
    price_range: "Rs. 7,500 – 14,000",
    is_featured: false,
    is_published: true,
    position: 1,
    features: JSON.stringify([
      "Voice control via Alexa and Google Home",
      "Scheduled automation and scenes",
      "Touch manual override",
      "Adjustable speed and soft start/stop",
      "Works without Wi-Fi via RF remote",
    ]),
    specifications: JSON.stringify([
      { label: "Power", value: "36W" },
      { label: "Max Curtain Weight", value: "50 kg" },
      { label: "Noise Level", value: "< 40 dB" },
      { label: "Connectivity", value: "2.4 GHz Wi-Fi" },
      { label: "App", value: "Tuya Smart / SmartLife" },
    ]),
  },
  {
    name: 'Video Door Phone — 7" Colour Touchscreen',
    slug: "video-door-phone-7-inch",
    category_id: catId["video-door-phone"],
    short_description:
      "7-inch colour touchscreen video door intercom with two-way audio, door release, and mobile app.",
    cover_image_url: ASSET.prodVdp,
    price_range: "Rs. 18,000 – 35,000",
    is_featured: true,
    is_published: true,
    position: 1,
    features: JSON.stringify([
      "Photo & video capture on ring/motion",
      "Multi-apartment support (up to 8 indoor units)",
      "Remote door unlock from indoor unit or phone",
      "Night vision outdoor panel",
      "Call forwarding to mobile when away",
    ]),
    specifications: JSON.stringify([
      { label: "Screen", value: '7" TFT colour touchscreen' },
      { label: "Camera", value: "1.3 MP wide-angle" },
      { label: "Night Vision", value: "IR" },
      { label: "Memory", value: "SD card up to 32 GB" },
    ]),
  },
  {
    name: "Fingerprint Access Controller — Standalone",
    slug: "fingerprint-access-controller-standalone",
    category_id: catId["access-control"],
    short_description:
      "Standalone biometric fingerprint and RFID access controller with built-in door relay for offices and secure rooms.",
    cover_image_url: ASSET.prodAccess,
    price_range: "Rs. 12,000 – 20,000",
    is_featured: false,
    is_published: true,
    position: 1,
    features: JSON.stringify([
      "Fingerprint + RFID card + PIN access",
      "Stores 3,000 fingerprints",
      "Wiegand output for integration",
      "Built-in door bell and intercom output",
      "USB enrollment device included",
    ]),
    specifications: JSON.stringify([
      { label: "Fingerprint Capacity", value: "3,000" },
      { label: "Card Capacity", value: "10,000" },
      { label: "Communication", value: "TCP/IP + USB" },
      { label: "Wiegand", value: "26/34-bit output" },
    ]),
  },
  {
    name: "Smart Home Automation Hub — 4-in-1",
    slug: "smart-home-hub-4in1",
    category_id: catId["smart-home"],
    short_description:
      "Central home automation controller supporting lights, curtains, AC, and security — all from one app.",
    cover_image_url: ASSET.prodSmartHub,
    price_range: "Rs. 35,000 – 65,000",
    is_featured: true,
    is_published: true,
    position: 1,
    features: JSON.stringify([
      "Controls lights, curtains, AC, and door locks from one app",
      "Works with Alexa and Google Home",
      "Scene programming (morning, night, movie, away)",
      "Supports up to 150 devices",
      "Wi-Fi + Zigbee dual protocol",
    ]),
    specifications: JSON.stringify([
      { label: "Protocol", value: "Wi-Fi 2.4 GHz + Zigbee 3.0" },
      { label: "Max Devices", value: "150" },
      { label: "App", value: "Tuya Smart / SmartLife" },
      { label: "Power", value: "5V 2A USB-C" },
    ]),
  },
];
await upsert("products", products, "slug");

console.log("\n🖼️  Product Images…");
const { data: productRows } = await supabase
  .from("products")
  .select("id, slug, cover_image_url");
const prodAltImages = [
  ASSET.prodAlt1,
  ASSET.prodAlt2,
  ASSET.prodAlt3,
  ASSET.prodAlt4,
  ASSET.prodAlt5,
  ASSET.prodAlt6,
  ASSET.prodAlt7,
  ASSET.prodAlt8,
  ASSET.prodAlt9,
  ASSET.prodAlt10,
];
const productImages = (productRows ?? []).flatMap((product, idx) => [
  {
    product_id: product.id,
    url: product.cover_image_url,
    alt: `${product.slug} image 1`,
    position: 1,
  },
  {
    product_id: product.id,
    url: prodAltImages[idx % prodAltImages.length],
    alt: `${product.slug} image 2`,
    position: 2,
  },
]);
await upsertNoSlug("product_images", productImages);

// ── 4. SERVICES ───────────────────────────────────────────────────────────────
console.log("\n🔧 Services…");
const services = [
  {
    name: "Gate Automation Installation",
    slug: "gate-automation-installation",
    intro:
      "Complete supply and professional installation of sliding gate openers, swing gate openers, and remote access systems across Nepal.",
    key_benefits: JSON.stringify([
      "Increased security and controlled entry",
      "Remote operation from phone or remote",
      "Suitable for heavy commercial gates up to 800 kg",
      "Integration with access control systems",
      "After-sales maintenance and support",
    ]),
    cover_image_url: ASSET.svcGate,
    is_published: true,
    is_active: true,
    position: 1,
  },
  {
    name: "Hotel Lock System Setup",
    slug: "hotel-lock-systems",
    intro:
      "Professional supply, installation, programming, and staff training for hotel RFID door lock systems with front desk management software.",
    key_benefits: JSON.stringify([
      "Centralised front desk management",
      "Multiple access levels for staff hierarchy",
      "Audit trail for all door entries",
      "Quick card encoding for check-in/out",
      "Emergency master override",
    ]),
    cover_image_url: ASSET.svcHotel,
    is_published: true,
    is_active: true,
    position: 2,
  },
  {
    name: "Smart Door Lock Installation",
    slug: "smart-door-lock-installation",
    intro:
      "Supply and professional installation of digital door locks with fingerprint, PIN, RFID, and app-based access for homes, apartments, and offices.",
    key_benefits: JSON.stringify([
      "No keys to lose or copy",
      "Multiple user access codes",
      "Auto-lock for security",
      "Real-time entry logs",
      "Remote access via app (Wi-Fi models)",
    ]),
    cover_image_url: ASSET.svcLock,
    is_published: true,
    is_active: true,
    position: 3,
  },
  {
    name: "Rolling Shutter Automation",
    slug: "rolling-shutter-automation",
    intro:
      "Motorisation and automation of existing rolling shutters or full supply and installation of new shutter motor systems for shops and warehouses.",
    key_benefits: JSON.stringify([
      "Remote operation — no manual rolling",
      "Timer-based open/close scheduling",
      "Obstacle safety stop",
      "Improved shop security",
      "Compatible with most existing shutters",
    ]),
    cover_image_url: ASSET.svcShutter,
    is_published: true,
    is_active: true,
    position: 4,
  },
  {
    name: "Curtain Motor Automation",
    slug: "curtain-motor-automation",
    intro:
      "Smart curtain and blind motor installation with app control, voice integration, and scene automation for homes and hospitality.",
    key_benefits: JSON.stringify([
      "Voice and app control",
      "Scheduled scenes (morning, evening, movie mode)",
      "No structural changes required",
      "Works with existing curtain tracks",
      "Hotel guest experience upgrade",
    ]),
    cover_image_url: ASSET.svcCurtain,
    is_published: true,
    is_active: true,
    position: 5,
  },
  {
    name: "Video Door Phone & Entry Systems",
    slug: "video-door-phone-entry",
    intro:
      "Supply and installation of video intercom systems, electric lock integration, and entry management for residential and commercial buildings.",
    key_benefits: JSON.stringify([
      "Visual verification before entry",
      "Remote door release from anywhere",
      "Photo/video capture log",
      "Multi-unit apartment support",
      "Night vision weather-proof panels",
    ]),
    cover_image_url: ASSET.svcVdp,
    is_published: true,
    is_active: true,
    position: 6,
  },
  {
    name: "Access Control System Installation",
    slug: "access-control-installation",
    intro:
      "Design and installation of fingerprint, RFID card, and keypad access control systems for offices, factories, and secure facilities.",
    key_benefits: JSON.stringify([
      "Restrict entry to authorised personnel only",
      "Detailed access logs and reporting",
      "Time-based access zones",
      "Integration with attendance systems",
      "Scalable to hundreds of doors",
    ]),
    cover_image_url: ASSET.svcAccess,
    is_published: true,
    is_active: true,
    position: 7,
  },
  {
    name: "CCTV & Surveillance Setup",
    slug: "cctv-surveillance-setup",
    intro:
      "Complete CCTV camera and NVR/DVR system supply and installation with remote viewing via mobile app — for homes, shops, hotels, and offices.",
    key_benefits: JSON.stringify([
      "24/7 remote viewing from anywhere",
      "High-definition IP and HD-TVI cameras",
      "Night vision and wide-angle coverage",
      "Cloud and local storage options",
      "Motion detection alerts",
    ]),
    cover_image_url: ASSET.svcCctv,
    is_published: true,
    is_active: true,
    position: 8,
  },
  {
    name: "Annual Maintenance Contract (AMC)",
    slug: "annual-maintenance-contract",
    intro:
      "Scheduled preventive maintenance and priority breakdown response service for all installed automation systems.",
    key_benefits: JSON.stringify([
      "Quarterly preventive maintenance visits",
      "Priority response for breakdowns",
      "Discounted parts and labour rates",
      "System health check and adjustment",
      "Remote diagnostics support",
    ]),
    cover_image_url: ASSET.svcAmc,
    is_published: true,
    is_active: true,
    position: 9,
  },
  {
    name: "Site Survey & Consultation",
    slug: "site-survey-consultation",
    intro:
      "Free site assessment and expert consultation to identify the right automation and security solution for your property.",
    key_benefits: JSON.stringify([
      "No-obligation free site visit",
      "Expert product recommendation",
      "Installation scope and cost estimate",
      "Multiple solution options to fit budget",
      "Available across Kathmandu Valley",
    ]),
    cover_image_url: ASSET.svcSurvey,
    is_published: true,
    is_active: true,
    position: 10,
  },
];
await upsert("services", services, "slug");

// ── 5. INDUSTRIES ─────────────────────────────────────────────────────────────
console.log("\n🏭 Industries…");
const industries = [
  {
    name: "Hotels & Hospitality",
    slug: "hotels",
    description:
      "Automation and security solutions tailored for the hospitality industry — hotel lock systems, curtain motors, and access control.",
    solutions_summary:
      "Hotel lock systems\nCurtain motor automation\nVideo door phone for front desk\nGate automation for driveways\nCCTV surveillance",
    cover_image_url: ASSET.indHotel,
    icon: "hotel",
    is_active: true,
    position: 1,
  },
  {
    name: "Residential Homes",
    slug: "homes",
    description:
      "Smart, secure, and convenient automation for new builds and existing homes across Nepal.",
    solutions_summary:
      "Smart door locks\nSwing gate openers\nCurtain motors\nVideo door phone\nRolling shutter automation",
    cover_image_url: ASSET.indHome,
    icon: "home",
    is_active: true,
    position: 2,
  },
  {
    name: "Commercial & Offices",
    slug: "offices",
    description:
      "Professional access control and automation solutions for corporate offices, banks, and commercial buildings.",
    solutions_summary:
      "Digital door locks\nSliding gate openers\nAccess control systems\nShutter motors\nVideo door phone",
    cover_image_url: ASSET.indOffice,
    icon: "building",
    is_active: true,
    position: 3,
  },
  {
    name: "Retail & Shops",
    slug: "retail",
    description:
      "Secure and automated shutter systems for retail shops, showrooms, and restaurants.",
    solutions_summary:
      "Rolling shutter motors\nDigital door locks\nGate automation\nVideo entry systems",
    cover_image_url: ASSET.indRetail,
    icon: "store",
    is_active: true,
    position: 4,
  },
  {
    name: "Builders & Developers",
    slug: "developers",
    description:
      "Bulk supply and project-based installation for property developers and construction projects.",
    solutions_summary:
      "Complete smart home/building packages\nAll automation and security solutions at project scale\nBulk pricing available",
    cover_image_url: ASSET.indDeveloper,
    icon: "hammer",
    is_active: true,
    position: 5,
  },
  {
    name: "Institutions",
    slug: "institutions",
    description:
      "Robust access control and gate automation for schools, hospitals, factories, and institutions.",
    solutions_summary:
      "Sliding gate openers\nAccess control\nElectric locks\nShutter motors\nVideo intercom",
    cover_image_url: ASSET.indInstitution,
    icon: "shield",
    is_active: true,
    position: 6,
  },
  {
    name: "Factories & Warehouses",
    slug: "factories",
    description:
      "Heavy-duty gate systems, shutter motors, and industrial access control for factories and warehouses.",
    solutions_summary:
      "Heavy-duty sliding gate openers\nIndustrial rolling shutter motors\nAccess control with attendance integration\nCCTV surveillance\nElectric barriers",
    cover_image_url: ASSET.indFactory,
    icon: "factory",
    is_active: true,
    position: 7,
  },
  {
    name: "Hospitals & Clinics",
    slug: "hospitals",
    description:
      "Controlled entry, door automation, and surveillance for healthcare facilities.",
    solutions_summary:
      "Automatic sliding doors\nAccess control for restricted areas\nVideo intercom at reception\nCCTV surveillance\nEmergency exit solutions",
    cover_image_url: ASSET.indHospital,
    icon: "hospital",
    is_active: true,
    position: 8,
  },
  {
    name: "Schools & Universities",
    slug: "schools",
    description:
      "Secure campus entry, controlled access, and safety solutions for educational institutions.",
    solutions_summary:
      "Gate automation for campus entry\nAccess control for offices and labs\nVideo door phone at main gate\nCCTV coverage across campus",
    cover_image_url: ASSET.indSchool,
    icon: "graduation-cap",
    is_active: true,
    position: 9,
  },
  {
    name: "Apartments & Condominiums",
    slug: "apartments",
    description:
      "Multi-unit residential security — video intercoms, smart locks, gate systems, and centralised access for apartments.",
    solutions_summary:
      "Video door phone with multi-unit support\nSliding gate automation for parking\nSmart door locks for each unit\nAccess control for common areas",
    cover_image_url: ASSET.indApartment,
    icon: "building-2",
    is_active: true,
    position: 10,
  },
];
await upsert("industries", industries, "slug");

// ── 6. PROJECTS ───────────────────────────────────────────────────────────────
console.log("\n🏗️  Projects…");
const { data: indData } = await supabase.from("industries").select("id, slug");
const indId = Object.fromEntries(indData.map((i) => [i.slug, i.id]));

const projects = [
  {
    title: "Hyatt Regency Kathmandu — Complete Lock System",
    slug: "hyatt-regency-hotel-lock-system",
    location: "Thamel, Kathmandu",
    industry_id: indId["hotels"],
    summary:
      "Full supply and installation of RFID hotel lock system across 280 rooms with front desk software and staff training.",
    challenge:
      "The hotel needed to replace aging mechanical locks with a modern RFID system while minimising disruption to ongoing operations.",
    solution:
      "We phased the installation floor by floor over 5 days, working nights to avoid guest disruption. Front desk software was set up and all 45 staff members trained.",
    result:
      "100% of rooms fitted within timeline. Check-in speed improved and the hotel now has a full audit trail for all room entries.",
    cover_image_url: ASSET.projHyatt,
    is_featured: true,
    is_published: true,
    completed_at: "2024-09-15",
  },
  {
    title: "Sunrise Residency — Gate Automation & Video Intercom",
    slug: "sunrise-residency-gate-video-intercom",
    location: "Pepsicola, Kathmandu",
    industry_id: indId["apartments"],
    summary:
      "Automated sliding gate system with RFID access and 4-unit video door phone installation for a residential apartment complex.",
    challenge:
      "The apartment required a secure entry system that residents could use without a physical key and management could control remotely.",
    solution:
      "Installed a 6-metre heavy-duty sliding gate opener with RFID card access and a 4-indoor-unit video intercom connected to each apartment.",
    result:
      "Residents enjoy keyless entry. The management can monitor entry logs and issue/revoke access remotely.",
    cover_image_url: ASSET.projSunrise,
    is_featured: true,
    is_published: true,
    completed_at: "2024-11-20",
  },
  {
    title: "Pokhara Grand Hotel — Curtain Motor Upgrade",
    slug: "pokhara-grand-hotel-curtain-motors",
    location: "Lakeside, Pokhara",
    industry_id: indId["hotels"],
    summary:
      "Installation of smart Wi-Fi curtain motors across 120 hotel rooms with app and voice control integration.",
    challenge:
      "The hotel wanted to offer a premium guest experience with in-room smart curtains as part of a broader modernisation.",
    solution:
      "Installed Tuya-compatible Wi-Fi curtain motors in all rooms, programmed with room scenes and connected to the hotel's guest app.",
    result:
      "Guest satisfaction scores improved. Housekeeping now uses scheduled scenes to open curtains for room preparation each morning.",
    cover_image_url: ASSET.projPokhara,
    is_featured: false,
    is_published: true,
    completed_at: "2024-08-10",
  },
  {
    title: "Prime Office Tower — Access Control System",
    slug: "prime-office-tower-access-control",
    location: "Durbarmarg, Kathmandu",
    industry_id: indId["offices"],
    summary:
      "Multi-floor fingerprint and RFID access control system for a 12-storey commercial building with centralised management.",
    challenge:
      "The building management needed to control access to different floors for different tenant companies with detailed entry logs.",
    solution:
      "Installed fingerprint access controllers on all 12 floors with a central software platform that tenants can manage their own floors independently.",
    result:
      "Building security incidents reduced. Each tenant company now fully manages their own floor access from a browser dashboard.",
    cover_image_url: ASSET.projOffice,
    is_featured: true,
    is_published: true,
    completed_at: "2024-10-05",
  },
  {
    title: "Bhatbhateni Supermarket Chain — Rolling Shutter Automation",
    slug: "bhatbhateni-shutter-automation",
    location: "Multiple Locations, Kathmandu",
    industry_id: indId["retail"],
    summary:
      "Motorisation and automation of rolling shutters across 6 Bhatbhateni branches with remote and timer control.",
    challenge:
      "Manual shutter operation was slow, inconsistent, and causing staff injuries. The client wanted all shutters timer-controlled.",
    solution:
      "Fitted 250W tubular motors to all 18 shutter doors across 6 branches. Programmed with daily timers and RF remote overrides.",
    result:
      "Opening and closing time reduced from 15 minutes per branch to under 2 minutes. Zero injuries since installation.",
    cover_image_url: ASSET.projBhatbhateni,
    is_featured: false,
    is_published: true,
    completed_at: "2024-07-22",
  },
  {
    title: "Tribhuvan University — Campus Gate Automation",
    slug: "tribhuvan-university-gate-automation",
    location: "Kirtipur, Kathmandu",
    industry_id: indId["schools"],
    summary:
      "Heavy-duty sliding gate system with vehicle access barrier and security booth integration for the main campus entrance.",
    challenge:
      "The university needed to manage high vehicle and pedestrian traffic at peak hours while maintaining security.",
    solution:
      "Installed a 10-metre industrial sliding gate with a separate pedestrian gate, RFID for faculty vehicles, and a manual security booth bypass.",
    result:
      "Campus entry is now fully controlled. Faculty vehicles pass within 5 seconds, and visitor logs are maintained automatically.",
    cover_image_url: ASSET.projTribhuvan,
    is_featured: false,
    is_published: true,
    completed_at: "2024-12-01",
  },
  {
    title: "Kathmandu Industrial Park — Factory Gate & CCTV",
    slug: "kathmandu-industrial-park-gate-cctv",
    location: "Balaju, Kathmandu",
    industry_id: indId["factories"],
    summary:
      "Industrial heavy-duty gate automation and 24-camera CCTV system for a multi-unit industrial park.",
    challenge:
      "The park needed 24/7 vehicle and personnel monitoring with controlled access to individual factory units.",
    solution:
      "Installed two industrial sliding gate openers at the main vehicle entry, individual RFID unit doors, and 24 IP cameras with NVR recording.",
    result:
      "Full CCTV coverage of all areas with 30-day recording. Gate access logs tie in with camera timestamps for incident management.",
    cover_image_url: ASSET.projIndustrial,
    is_featured: false,
    is_published: true,
    completed_at: "2024-06-14",
  },
  {
    title: "Private Villa — Full Smart Home Package",
    slug: "private-villa-smart-home-kathmandu",
    location: "Maharajgunj, Kathmandu",
    industry_id: indId["homes"],
    summary:
      "Complete smart home installation including gate automation, curtain motors, smart locks, and video door phone for a luxury private residence.",
    challenge:
      "The homeowner wanted a fully integrated smart home controllable from a single app while maintaining a premium aesthetic.",
    solution:
      "Installed an underground swing gate motor, Wi-Fi curtain motors in 8 rooms, fingerprint smart lock, and a video door phone with mobile app, all controlled via a central Tuya hub.",
    result:
      "The entire home is controlled from one app. The homeowner can open the gate, check the door camera, and control all rooms remotely.",
    cover_image_url: ASSET.projVilla,
    is_featured: true,
    is_published: true,
    completed_at: "2025-01-08",
  },
  {
    title: "Bir Hospital — Secure Zone Access Control",
    slug: "bir-hospital-access-control",
    location: "Kathmandu",
    industry_id: indId["hospitals"],
    summary:
      "Access control installation for ICU, pharmacy, and records sections with biometric authentication and emergency override.",
    challenge:
      "The hospital needed to restrict sensitive areas to authorised staff while allowing fast emergency access at all times.",
    solution:
      "Installed fingerprint + RFID controllers at 8 restricted doors with an emergency override panel at the nurses station.",
    result:
      "Restricted zone entries are now fully logged. Emergency access is available within 2 seconds from the override panel.",
    cover_image_url: ASSET.projHospital,
    is_featured: false,
    is_published: true,
    completed_at: "2024-05-30",
  },
  {
    title: "Dhulikhel Lodge Retreat — Hotel Lock Renovation",
    slug: "dhulikhel-lodge-hotel-lock-renovation",
    location: "Dhulikhel, Kavrepalanchok",
    industry_id: indId["hotels"],
    summary:
      "Replacement of mechanical locks with RFID hotel lock system across 45 cottages with wireless front desk integration.",
    challenge:
      "Remote lodge location meant all hardware had to be transported and installation completed within a 3-day closure window.",
    solution:
      "Pre-configured all locks and cards at our workshop. Two-team installation completed all 45 rooms in 2.5 days with same-day staff training.",
    result:
      "Full system operational before the lodge reopened. Front desk check-in now takes 90 seconds instead of 5 minutes.",
    cover_image_url: ASSET.projDhulikhel,
    is_featured: false,
    is_published: true,
    completed_at: "2025-02-20",
  },
];
await upsert("projects", projects, "slug");

console.log("\n🖼️  Project Images…");
const { data: projectRows } = await supabase
  .from("projects")
  .select("id, slug, cover_image_url");
const projAltImages = [
  ASSET.projAlt1,
  ASSET.projAlt2,
  ASSET.projAlt3,
  ASSET.projAlt4,
  ASSET.projAlt5,
  ASSET.projAlt6,
  ASSET.projAlt7,
  ASSET.projAlt8,
  ASSET.projAlt9,
  ASSET.projAlt10,
];
const projectImages = (projectRows ?? []).flatMap((project, idx) => [
  {
    project_id: project.id,
    url: project.cover_image_url,
    alt: `${project.slug} cover`,
    is_cover: true,
    position: 1,
  },
  {
    project_id: project.id,
    url: projAltImages[idx % projAltImages.length],
    alt: `${project.slug} installation`,
    is_cover: false,
    position: 2,
  },
]);
await upsertNoSlug("project_images", projectImages);

console.log("\n🔗 Project Product Links…");
const projectProducts = (projectRows ?? [])
  .map((project, index) => {
    const target = productRows?.[index % (productRows?.length || 1)];
    return {
      project_id: project.id,
      product_id: target?.id,
    };
  })
  .filter((row) => row.product_id);
const { error: projectProductDeleteError } = await supabase
  .from("project_products")
  .delete()
  .not("project_id", "is", null);
if (projectProductDeleteError) {
  console.error(
    "  ✗ project_products delete:",
    projectProductDeleteError.message,
  );
} else {
  const { error: projectProductInsertError } = await supabase
    .from("project_products")
    .insert(projectProducts);
  if (projectProductInsertError) {
    console.error("  ✗ project_products:", projectProductInsertError.message);
  } else {
    console.log(`  ✓ project_products — ${projectProducts.length} rows`);
  }
}

// ── 7. TESTIMONIALS ───────────────────────────────────────────────────────────
console.log("\n⭐ Testimonials…");
const testimonials = [
  {
    client_name: "Sanjay Shrestha",
    client_title: "General Manager",
    client_company: "Hyatt Regency Kathmandu",
    content:
      "Everest Smart Traders completed our entire hotel lock installation across 280 rooms without any disruption to guests. Their team was professional, on-time, and the after-sales support has been excellent.",
    rating: 5,
    is_featured: true,
    is_published: true,
  },
  {
    client_name: "Priya Gurung",
    client_title: "Homeowner",
    client_company: null,
    content:
      "We had a sliding gate and smart door lock installed at our home. The installation was clean, quick, and the technicians explained everything clearly. Very happy with the results.",
    rating: 5,
    is_featured: true,
    is_published: true,
  },
  {
    client_name: "Ramesh Karki",
    client_title: "Operations Director",
    client_company: "Prime Office Tower",
    content:
      "The access control system they installed across our 12-floor building has transformed how tenants manage their spaces. The software is intuitive and the installation was seamless.",
    rating: 5,
    is_featured: true,
    is_published: true,
  },
  {
    client_name: "Anita Maharjan",
    client_title: "Hotel Manager",
    client_company: "Pokhara Grand Hotel",
    content:
      "Our guests love the smart curtains. We get comments about it on TripAdvisor. The installation team came from Kathmandu and finished on schedule despite our tight timeline.",
    rating: 5,
    is_featured: false,
    is_published: true,
  },
  {
    client_name: "Bikash Thapa",
    client_title: "Property Manager",
    client_company: "Sunrise Residency Apartments",
    content:
      "The video door phone system and automated gate have made our residents feel much safer. We particularly appreciate the ability to manage access remotely from our phones.",
    rating: 4,
    is_featured: false,
    is_published: true,
  },
  {
    client_name: "Deepa Rana",
    client_title: "CEO",
    client_company: "Rana Properties Pvt. Ltd.",
    content:
      "We have worked with Everest Smart Traders on three residential projects now. Their bulk pricing, installation quality, and reliability make them our first choice for automation across all our developments.",
    rating: 5,
    is_featured: true,
    is_published: true,
  },
  {
    client_name: "Mohan Tamang",
    client_title: "Shop Owner",
    client_company: "Tamang Electronics, Newroad",
    content:
      "Getting a motor on my rolling shutter was the best business decision. No more waiting for manual opening, no more back strain. The timer control means my shop opens and closes automatically.",
    rating: 5,
    is_featured: false,
    is_published: true,
  },
  {
    client_name: "Sunita Poudel",
    client_title: "Principal",
    client_company: "Kathmandu International School",
    content:
      "Campus security has improved dramatically since Everest Smart Traders installed our gate system. Parents feel safer and our staff no longer need to manually manage vehicle entry.",
    rating: 4,
    is_featured: false,
    is_published: true,
  },
  {
    client_name: "Arjun Bhandari",
    client_title: "Facilities Manager",
    client_company: "Kathmandu Industrial Park",
    content:
      "The combined gate, access control, and CCTV system they installed has given us full control over the park. Response to their maintenance calls is very fast.",
    rating: 5,
    is_featured: false,
    is_published: true,
  },
  {
    client_name: "Kabita Adhikari",
    client_title: "Interior Designer",
    client_company: "Adhikari Design Studio",
    content:
      "I always recommend Everest Smart Traders to my clients for home automation. Their underground gate motors are perfect for high-end projects where aesthetics matter.",
    rating: 5,
    is_featured: true,
    is_published: true,
  },
];
await upsertNoSlug("testimonials", testimonials);

// ── 8. BLOG CATEGORIES ────────────────────────────────────────────────────────
console.log("\n📝 Blog Categories…");
const blogCategories = [
  {
    name: "Product Guides",
    slug: "product-guides",
    description: "In-depth guides on choosing and using automation products",
  },
  {
    name: "Installation Tips",
    slug: "installation-tips",
    description: "Tips and best practices for automation system installation",
  },
  {
    name: "Smart Home",
    slug: "smart-home",
    description: "Smart home automation ideas and inspiration",
  },
  {
    name: "Security Tips",
    slug: "security-tips",
    description: "Home and business security advice",
  },
  {
    name: "Industry News",
    slug: "industry-news",
    description: "Latest news from the automation and security industry",
  },
];
await upsert("blog_categories", blogCategories, "slug");

const { data: bcData } = await supabase
  .from("blog_categories")
  .select("id, slug");
const bcId = Object.fromEntries(bcData.map((c) => [c.slug, c.id]));

// ── 9. TUTORIALS (BLOG POSTS) ────────────────────────────────────────────────
console.log("\n🎬 Tutorials…");
const TUTORIAL_VIDEO = "/videos/tutorial.mp4";

const blogPosts = [
  {
    title: "How to Install a Sliding Gate Motor: Step-by-Step Guide",
    slug: "how-to-install-sliding-gate-motor",
    category_id: bcId["installation-tips"],
    excerpt:
      "A complete step-by-step installation guide for sliding gate automation motors — from site assessment to first remote operation.",
    video_url: TUTORIAL_VIDEO,
    cover_image_url: ASSET.blog1,
    author_name: "Everest Smart Traders",
    tags: ["gate automation", "installation", "sliding gate", "DIY"],
    is_featured: true,
    is_published: true,
    published_at: "2025-01-15T08:00:00Z",
    reading_time: 10,
    seo_title: "How to Install a Sliding Gate Motor | Everest Smart Traders",
    seo_description:
      "Step-by-step tutorial for installing a sliding gate automation motor — tools, wiring, limit switch setup, and testing.",
    content: `<h2>Prerequisites</h2>
<ul>
  <li>Sliding gate motor kit (motor unit, gear rack, remote receivers, remote controls)</li>
  <li>Concrete already set and gate running smoothly on its rail</li>
  <li>220V AC power point within 5 metres of the motor position</li>
  <li>Drill, angle grinder, welding machine (for rack attachment), spirit level</li>
</ul>
<h2>Step 1: Assess the Site</h2>
<p>Before unpacking the motor, walk the gate path with a spirit level. The gate must run level and smooth. Check that the gate weight is within the motor's rated capacity — weigh it if unsure. Confirm there is a solid concrete pillar to bolt the motor housing to.</p>
<h2>Step 2: Mount the Motor Housing</h2>
<p>Position the motor housing against the pillar so that the drive pinion aligns with the centre of the rack. Mark the bolt holes, drill into the concrete with a hammer drill and 12 mm bit, insert expansion anchors, and torque the bolts to the manufacturer's specification (typically 25–30 Nm).</p>
<h2>Step 3: Attach the Gear Rack</h2>
<p>Lay the rack along the bottom of the gate, engaging the teeth with the pinion. Weld or bolt the rack brackets to the gate frame every 300–400 mm. Ensure no gap greater than 1 mm between rack sections — uneven joints cause noise and premature wear. Apply gear grease to the full rack length.</p>
<h2>Step 4: Wire the Motor</h2>
<p>Run the power cable in conduit from the distribution board to the motor. Connect Live (Brown), Neutral (Blue), and Earth (Green/Yellow) to the motor terminal block. Install a 16 A MCB in the distribution board dedicated to the gate.</p>
<h2>Step 5: Connect Accessories</h2>
<p>Wire the safety photocells to the PHOTO terminals. Wire the external key switch or push button to the PED/COM terminals. Connect any loop detectors if required for vehicle sensing. Refer to your motor's wiring diagram — terminal labels vary by brand.</p>
<h2>Step 6: Set the Limit Switches</h2>
<p>Power the motor and press OPEN on the remote. Watch the gate travel — press STOP when it reaches the fully-open position, then adjust the OPEN limit cam until the motor stops at exactly that point. Repeat for CLOSE limit. Test that the gate stops precisely at each end without mechanical impact.</p>
<h2>Step 7: Test Safety Features</h2>
<p>Place a solid 50 mm obstacle in the gate path and trigger a close cycle. The gate must stop and reverse within 200 mm of contact. If it does not, reduce the obstacle detection sensitivity on the control board. Never commission a gate without passing this test.</p>
<h2>Step 8: Programme the Remotes</h2>
<p>Press and hold the LEARN button on the receiver board until the LED flashes. Press any button on the remote — the LED confirms a successful pairing. Programme all remote controls and check operation from maximum expected range.</p>
<h2>Troubleshooting</h2>
<ul>
  <li><strong>Gate reverses immediately after starting:</strong> Photocells are misaligned or blocked.</li>
  <li><strong>Motor runs but gate does not move:</strong> Pinion is not fully engaged with the rack.</li>
  <li><strong>Remote works only close-up:</strong> Replace the remote battery and re-pair.</li>
</ul>`,
  },
  {
    title: "How to Set Up an RFID Hotel Lock System from Scratch",
    slug: "hotel-lock-rfid-setup-guide",
    category_id: bcId["installation-tips"],
    excerpt:
      "A complete tutorial for installing and configuring an RFID hotel lock system — hardware fitting, software setup, and card encoding.",
    video_url: TUTORIAL_VIDEO,
    cover_image_url: ASSET.blog2,
    author_name: "Everest Smart Traders",
    tags: ["hotel locks", "RFID", "installation", "hospitality"],
    is_featured: true,
    is_published: true,
    published_at: "2025-01-28T08:00:00Z",
    reading_time: 12,
    seo_title: "RFID Hotel Lock System Setup Tutorial | Everest Smart Traders",
    seo_description:
      "Step-by-step guide to installing RFID hotel locks, setting up the front desk software, and encoding guest key cards.",
    content: `<h2>What You Will Need</h2>
<ul>
  <li>RFID hotel lock set (lock body, exterior handle, interior handle, mortise, escutcheon)</li>
  <li>Hotel management software (supplied on USB or downloadable) + encoder unit</li>
  <li>Windows PC or laptop for software installation</li>
  <li>Chisel set, drill, hole saw (25 mm and 54 mm), screwdrivers</li>
  <li>4× AA batteries per lock</li>
</ul>
<h2>Step 1: Prepare the Door</h2>
<p>Use the paper template (included in the lock box) to mark the positions of the latch hole, deadbolt hole, and handle bore holes on the door edge and face. Use a 25 mm spade bit for the latch hole on the door edge and a 54 mm hole saw for the handle bore holes on the door face. Chisel the mortise recess to the depth specified in the template.</p>
<h2>Step 2: Fit the Mortise Lock Body</h2>
<p>Insert the mortise lock body into the door edge. Secure it with the two supplied screws. Fit the faceplate over the mortise edge and mark, then chisel, the faceplate recess so it sits flush with the door edge.</p>
<h2>Step 3: Install the Electronic Lock Cylinder</h2>
<p>Feed the wiring harness from the exterior handle through the 54 mm bore hole. Connect the harness to the lock body's wiring connector according to the colour diagram in the manual. Align the tailpiece of the exterior handle with the drive cam of the mortise, then fit the interior handle and secure with the through-bolts. Insert batteries into the battery tray in the interior handle.</p>
<h2>Step 4: Install the Management Software</h2>
<p>Insert the encoder USB and run the software installer. During setup, enter the hotel name and choose a system password. The software will create the hotel's master key profile. Print or record the system password — it cannot be recovered if lost.</p>
<h2>Step 5: Initialise the Lock</html>
<p>In the software, go to <em>Lock Management → Add New Lock</em>. Assign a room number and floor. Select <em>Issue Initialisation Card</em> and place a blank card on the encoder. Bring the initialisation card to the lock and hold it against the exterior RFID reader until you hear 3 beeps. The lock is now registered to your system.</p>
<h2>Step 6: Encode Access Levels</h2>
<p>Issue cards for each access level: <strong>Guest</strong> (expires at checkout), <strong>Housekeeping</strong> (floors only, time-limited), <strong>Maintenance</strong> (specific rooms), <strong>Manager</strong> (all rooms), <strong>Emergency Master</strong> (all locks). Always test each card type on a test door before giving to staff.</p>
<h2>Step 7: Issue a Guest Key Card</h2>
<p>At check-in, go to <em>Check-In</em>, enter room number and check-out date/time. Place a blank card on the encoder and click <em>Encode</em>. The card is ready in under 5 seconds. Test the card on the room door before handing to the guest.</p>
<h2>Step 8: Audit and Maintenance</h2>
<p>Periodically download the audit log from each lock using the audit card (issued by the software). The log records the last 500 door events. Replace batteries when the lock emits a low-battery warning (typically a yellow LED during card read).</p>`,
  },
  {
    title: "Installing a Rolling Shutter Motor: Complete Walkthrough",
    slug: "rolling-shutter-motor-installation",
    category_id: bcId["installation-tips"],
    excerpt:
      "Learn how to motorise an existing rolling shutter — from choosing the right motor to limit switch calibration.",
    video_url: TUTORIAL_VIDEO,
    cover_image_url: ASSET.blog3,
    author_name: "Everest Smart Traders",
    tags: ["rolling shutter", "motor installation", "automation"],
    is_featured: false,
    is_published: true,
    published_at: "2025-02-05T08:00:00Z",
    reading_time: 9,
    content: `<h2>Prerequisites</h2>
<ul>
  <li>Tubular shutter motor (size matched to shutter width and weight)</li>
  <li>220V power supply at the installation point</li>
  <li>Shutter in good mechanical condition — no broken slats, smooth manual operation</li>
  <li>Step ladder, hex key set, cable clips, conduit</li>
</ul>
<h2>Step 1: Select the Correct Motor</h2>
<p>Measure the shutter width and weigh the curtain (or estimate: steel slats weigh approx 6–8 kg per m²). Select a motor torque rating at least 30% above the calculated load. For shutters wider than 4 metres, use a motor with built-in thermal protection.</p>
<h2>Step 2: Remove the Existing Axle Supports</h2>
<p>Lower the shutter fully. Remove the end caps from both sides of the barrel. Slide out the axle. The tubular motor replaces the axle — it fits inside the barrel tube.</p>
<h2>Step 3: Insert and Secure the Tubular Motor</h2>
<p>Slide the motor into the barrel from the motor-head end (the end with the power cable exit). The motor head should protrude slightly from the barrel. Fit the anti-rotation bracket to the motor head and fix it to the shutter bracket on the wall to prevent the motor body from spinning.</p>
<h2>Step 4: Refit the Barrel and Slats</h2>
<p>Slide the barrel (with motor inside) back onto the support brackets. Refit the end cap on the idle side. Reconnect the shutter curtain to the barrel using the slat-to-barrel clip.</p>
<h2>Step 5: Wire the Motor</h2>
<p>The tubular motor cable has 3 or 5 cores. For a basic 3-wire motor: Brown = UP, Blue = DOWN, Green/Yellow = Earth. Connect to a 3-position wall switch or the receiver board if using remote control. Run all wiring in conduit and secure with cable clips every 300 mm.</p>
<h2>Step 6: Set the Limit Switches</h2>
<p>Most tubular motors have internal limit adjusters accessible through a port on the motor head. Power the motor and run it UP — use the UP limit adjuster to stop the barrel at the exact fully-open position. Run it DOWN and use the DOWN limit adjuster to stop precisely at the floor seal. Fine-tune until the shutter stops cleanly with no mechanical tension.</p>
<h2>Step 7: Test and Commission</h2>
<p>Operate the shutter 10 complete cycles. Listen for any grinding or clicking sounds from the barrel. Check that the curtain stacks evenly at the top. Verify the motor housing temperature — it should not feel hot to the touch after 5 cycles.</p>`,
  },
  {
    title: "Setting Up a Smart Home System: A Room-by-Room Guide",
    slug: "smart-home-setup-room-by-room",
    category_id: bcId["smart-home"],
    excerpt:
      "Build your smart home from scratch with this room-by-room tutorial — covering the gateway, lighting, gate, locks, and curtains.",
    video_url: TUTORIAL_VIDEO,
    cover_image_url: ASSET.blog4,
    author_name: "Everest Smart Traders",
    tags: ["smart home", "Tuya", "automation", "guide"],
    is_featured: true,
    is_published: true,
    published_at: "2025-02-18T08:00:00Z",
    reading_time: 14,
    content: `<h2>What You Will Need</h2>
<ul>
  <li>Tuya-compatible smart devices (gate motor, smart lock, curtain motors, smart switches)</li>
  <li>A stable 2.4 GHz Wi-Fi router — confirm coverage at the gate and all rooms</li>
  <li>Smartphone with the <strong>Smart Life</strong> or <strong>Tuya Smart</strong> app installed</li>
  <li>Tuya gateway (if using Zigbee devices for better range and reliability)</li>
</ul>
<h2>Step 1: Set Up the Smart Life App and Account</h2>
<p>Download <em>Smart Life</em> from the App Store or Google Play. Create an account using your phone number or email. Set your region to <em>South Asia</em> for local server routing and lower latency.</p>
<h2>Step 2: Add the Smart Gateway (If Using Zigbee)</h2>
<p>Plug the Tuya Zigbee gateway into a power socket near your router. In the app, tap <em>+</em> → <em>Gateway</em> → follow the pairing wizard. Once paired, all Zigbee devices will connect through the gateway rather than directly to Wi-Fi.</p>
<h2>Step 3: Gate Automation</h2>
<p>If your gate motor has a Wi-Fi receiver module, pair it via the app by putting the receiver in AP mode (hold LEARN for 5 seconds until LED blinks). Select <em>Add Device → Gate Controller</em> in the app. Set automations: <em>Open at 07:00 weekdays, Close at 21:00 every day</em>.</p>
<h2>Step 4: Front Door Smart Lock</h2>
<p>Follow the lock manufacturer's app pairing instructions (usually hold the reset button until it enters pairing mode). Add the lock to your home in Smart Life. Create individual codes for family members. Set a temporary code for domestic staff that expires on a weekly schedule.</p>
<h2>Step 5: Living Room Curtain Motor</h2>
<p>Pair the curtain motor in the same way as the gate controller. In the app, create a <em>Good Morning</em> automation: <em>At sunrise → Open curtains to 50%</em>. Create a <em>Movie Mode</em> scene that closes the curtains and dims the lights simultaneously.</p>
<h2>Step 6: Smart Lighting</h2>
<p>Replace conventional switches with smart switch modules (they fit behind the existing switch face). Pair each switch. Create rooms in the app (Living Room, Bedroom, Kitchen). Assign devices to rooms for easy group control.</p>
<h2>Step 7: Set Up Automations and Scenes</h2>
<p>Use the <em>Automation</em> tab to create rules. Example: <em>When front door lock detects a check-in → Turn on entrance light for 3 minutes</em>. Example: <em>When gate opens → Send a notification to the owner's phone</em>.</p>
<h2>Step 8: Add Voice Control</h2>
<p>Link Smart Life to Amazon Alexa or Google Home. Say "Alexa, open the gate" or "Hey Google, good morning" to trigger your morning scene. Voice control is a convenience layer on top of the app — it does not replace the app for configuration.</p>`,
  },
  {
    title: "Video Door Phone Installation: Wiring and Configuration",
    slug: "video-door-phone-installation-guide",
    category_id: bcId["installation-tips"],
    excerpt:
      "A step-by-step guide for installing a wired video door phone system — from cable runs to indoor monitor configuration.",
    video_url: TUTORIAL_VIDEO,
    cover_image_url: ASSET.blog5,
    author_name: "Everest Smart Traders",
    tags: ["video door phone", "installation", "wiring"],
    is_featured: false,
    is_published: true,
    published_at: "2025-03-02T08:00:00Z",
    reading_time: 11,
    content: `<h2>System Components</h2>
<ul>
  <li>Outdoor video panel (camera, speaker, RFID reader, door release button)</li>
  <li>Indoor monitor(s) — one per apartment unit</li>
  <li>Electric strike or magnetic lock for the entrance door</li>
  <li>4-core flat cable (or Cat5e) for video/audio/power, 2-core for door release</li>
  <li>12V DC 2A power adapter</li>
</ul>
<h2>Step 1: Plan the Cable Routes</h2>
<p>Plan cable routes from the outdoor panel to each indoor monitor. In a single home, run the cable through the wall or in conduit along skirting boards. In a multi-unit building, run a trunk cable to a distribution frame, then branch cables to each unit. Measure all distances — cable runs over 50 m require a signal amplifier for wired systems.</p>
<h2>Step 2: Mount the Outdoor Panel</h2>
<p>The panel should be mounted at 150 cm height (camera centre) on the door pillar or wall beside the main entrance. Use the included flush-mount box in masonry, or surface-mount the box if wall penetration is not possible. Feed the cable through the knock-out in the back of the box before securing to the wall.</p>
<h2>Step 3: Run the Cable</h2>
<p>For a 4-core cable: Core 1 = Video (+), Core 2 = Audio, Core 3 = Power (+12V), Core 4 = Common (Ground). Run separately: 2-core cable for the door release circuit (electric strike or magnetic lock). Secure cables every 400 mm with cable clips. Leave 300 mm of slack at each device location for termination.</p>
<h2>Step 4: Mount the Indoor Monitor</h2>
<p>Mount the indoor monitor bracket at eye level (150–160 cm) on the interior wall of the entrance hall or living area. Feed the cable through the cable entry on the back of the monitor. Hang the monitor on the bracket.</p>
<h2>Step 5: Terminate the Wiring</h2>
<p>Connect the 4-core cable according to the wiring diagram specific to your brand (always check — terminal numbering varies). Connect the door release output terminals from the indoor monitor to the electric strike. The strike is normally a 12V DC device — connect it in series with the monitor's release relay output.</p>
<h2>Step 6: Power and Test</h2>
<p>Connect the 12V DC adapter to the system's power input. Press the outdoor call button — the indoor monitor should show the camera image within 2 seconds and ring. Test the door release button on the indoor monitor — the electric strike should activate and the door should open.</p>
<h2>Step 7: Configure the Monitor Settings</h2>
<p>Access the indoor monitor menu to set: ring tone volume, camera brightness, door release duration (typically 3–5 seconds), and intercom ID if multiple indoor monitors are on the same system.</p>
<h2>Step 8: Multi-Unit Configuration (Apartments)</h2>
<p>For multi-unit buildings, each indoor monitor is assigned a unique unit address via a DIP switch or software menu. The outdoor panel lists the unit addresses — pressing a number on the keypad calls that specific unit.</p>`,
  },
  {
    title: "Gate Motor Maintenance: 10-Step Annual Servicing Guide",
    slug: "gate-motor-annual-maintenance-guide",
    category_id: bcId["installation-tips"],
    excerpt:
      "Keep your gate automation system running reliably for years with this complete 10-step annual maintenance procedure.",
    video_url: TUTORIAL_VIDEO,
    cover_image_url: ASSET.blog6,
    author_name: "Everest Smart Traders",
    tags: ["maintenance", "gate automation", "annual service"],
    is_featured: false,
    is_published: true,
    published_at: "2025-03-15T08:00:00Z",
    reading_time: 10,
    content: `<h2>Tools and Materials Needed</h2>
<ul>
  <li>Wire brush, clean rags, gear grease (NLGI Grade 2), anti-corrosion spray</li>
  <li>Multimeter, torque wrench (0–50 Nm), screwdriver set</li>
  <li>Replacement battery (if backup battery is 3+ years old)</li>
</ul>
<h2>Step 1: Disconnect Power Before Starting</h2>
<p>Switch off the MCB for the gate at the distribution board and lock it out with a lockout tag. Confirm there is no power at the motor with a multimeter before touching any wiring. Safety first — a gate motor can seriously injure someone if it activates unexpectedly.</p>
<h2>Step 2: Inspect the Motor Housing</h2>
<p>Check the motor housing for cracks, corrosion, or water ingress marks. If you see rust on the PCB or water stains inside, the housing seal has failed. Replace the motor housing cover gasket.</p>
<h2>Step 3: Clean and Lubricate the Gear Rack</h2>
<p>Use a wire brush to clean the full length of the gear rack, removing accumulated dust, grease, and grit. Wipe clean with a dry rag. Apply fresh gear grease (NLGI Grade 2) across the full rack. Work the grease into the teeth with a gloved hand or brush.</p>
<h2>Step 4: Check and Lubricate Gate Rollers and Hinges</h2>
<p>Inspect all gate rollers and hinges. Apply a thin film of machine oil to each roller bearing. For swing gate hinges, apply grease to the pin. Check for flat spots on the rollers — replace rollers that have developed flat spots as they cause gate bounce.</p>
<h2>Step 5: Inspect and Clean the Photocells</h2>
<p>Wipe the photocell lenses clean with a damp cloth. Check that the transmitter and receiver are still aligned — hold a piece of card in the beam path, the gate should stop and reverse. Misaligned photocells are the most common cause of gate stopping unexpectedly.</p>
<h2>Step 6: Tighten All Fixing Bolts</h2>
<p>Using the torque wrench, check all motor mounting bolts and rack bracket bolts. Retorque to 25–30 Nm. Vibration from 12 months of operation commonly loosens these fasteners.</p>
<h2>Step 7: Test and Charge the Backup Battery</h2>
<p>Disconnect the mains power and operate the gate 5 times using the remote. The gate should operate normally from the backup battery. Measure the battery voltage under load — it should read above 23V for a 24V system. Replace the battery if it reads below 21V.</p>
<h2>Step 8: Verify Limit Switch Accuracy</h2>
<p>Run the gate through a full open and close cycle. Confirm it stops at exactly the same fully-open and fully-closed positions as it should. If the gate is drifting from its limits, re-adjust the limit cams.</p>
<h2>Step 9: Test the Obstacle Detection</h2>
<p>Place a rigid 50 mm object in the gate's path and trigger a close cycle. The gate must stop and reverse within 200 mm of impact. This is a safety-critical test — if it fails, adjust the obstacle detection sensitivity and retest before restoring service.</p>
<h2>Step 10: Reconnect Power and Run Final Test</h2>
<p>Reconnect the MCB. Run 10 full open-close cycles, watching and listening carefully throughout. Document the service in your maintenance log with date, technician name, and any replacements made.</p>`,
  },
  {
    title: "How to Configure an Access Control System for Your Office",
    slug: "access-control-office-configuration",
    category_id: bcId["security-tips"],
    excerpt:
      "Configure a multi-door access control system from scratch — adding users, creating access levels, and reviewing audit logs.",
    video_url: TUTORIAL_VIDEO,
    cover_image_url: ASSET.blog7,
    author_name: "Everest Smart Traders",
    tags: ["access control", "office security", "RFID", "configuration"],
    is_featured: false,
    is_published: true,
    published_at: "2025-03-28T08:00:00Z",
    reading_time: 11,
    content: `<h2>System Requirements</h2>
<ul>
  <li>Access control panel (supports TCP/IP connection to management software)</li>
  <li>RFID readers installed at each controlled door</li>
  <li>Electric strikes or magnetic locks fitted and wired to the panel</li>
  <li>Management software installed on a dedicated Windows PC</li>
  <li>Blank RFID cards for each user</li>
</ul>
<h2>Step 1: Connect the Panel to the Network</h2>
<p>Assign the access control panel a static IP address in your network range (e.g., 192.168.1.100). Connect it to your network switch. Open the management software, go to <em>Device Management → Add Controller</em>, enter the IP address, and test the connection.</p>
<h2>Step 2: Define Access Levels</h2>
<p>Before adding any users, define the access levels your organisation needs. Common levels: <strong>General Staff</strong> (main entrance + own floor, 08:00–20:00 weekdays), <strong>IT Staff</strong> (server room access added), <strong>Management</strong> (all doors, all hours), <strong>Visitor</strong> (lobby only, one-day validity).</p>
<h2>Step 3: Add Door Profiles</h2>
<p>In the software, create a profile for each controlled door. Assign the door a name, specify which panel relay it is connected to, and define the default unlock duration (3–5 seconds is typical for an electric strike).</p>
<h2>Step 4: Create Time Zones</h2>
<p>Create time zones that match your business hours. Example: <em>Business Hours</em> = Monday–Friday 07:30–21:00. <em>Weekend</em> = Saturday 08:00–17:00. Time zones are applied to access levels so that staff access is automatically restricted outside working hours.</p>
<h2>Step 5: Enrol Users and Assign Cards</h2>
<p>Go to <em>Personnel Management → Add Employee</em>. Enter the employee name, department, and photo. Place a blank RFID card on the USB enrolment reader — the card UID is read automatically. Assign the appropriate access level to the user. Click <em>Download to Device</em> to push the configuration to the panel.</p>
<h2>Step 6: Test Each Door</h2>
<p>Test a card for each access level at each door. Verify: correct doors open, restricted doors do not open, access is correctly denied outside time zones. Log any discrepancies and correct the access level configuration.</p>
<h2>Step 7: Set Up Real-Time Monitoring</h2>
<p>In the software, open the <em>Real-Time Events</em> panel. You should see a live feed of every card swipe. Verify that door names are displaying correctly. Configure alerts: door held open longer than 30 seconds = notification to the admin.</p>
<h2>Step 8: Review Audit Logs</h2>
<p>Access logs are stored in the software database. Go to <em>Reports → Access Events</em> and filter by user, door, or date range. Export to Excel for compliance or incident investigation. Set a reminder to back up the database monthly.</p>`,
  },
  {
    title: "Installing and Pairing Wi-Fi Curtain Motors with Smart Life",
    slug: "wifi-curtain-motor-installation-pairing",
    category_id: bcId["smart-home"],
    excerpt:
      "A full installation tutorial for Wi-Fi curtain motors — hardware fitting, cable routing, and pairing with the Smart Life app.",
    video_url: TUTORIAL_VIDEO,
    cover_image_url: ASSET.blog8,
    author_name: "Everest Smart Traders",
    tags: ["curtain motor", "smart home", "Wi-Fi", "Tuya"],
    is_featured: false,
    is_published: true,
    published_at: "2025-04-05T08:00:00Z",
    reading_time: 9,
    content: `<h2>What You Will Need</h2>
<ul>
  <li>Tubular Wi-Fi curtain motor with rod adapters</li>
  <li>Curtain track or rod already installed and level</li>
  <li>220V power point within 2 metres of the motor end of the track</li>
  <li>Smart Life app on your smartphone (2.4 GHz Wi-Fi required)</li>
</ul>
<h2>Step 1: Check the Curtain Track</h2>
<p>The track must be level and straight. Any sag or curve causes the curtain to bunch unevenly. Use a spirit level across the full track length. If the track sags in the centre, add a mid-span support bracket.</p>
<h2>Step 2: Insert the Motor into the Track</h2>
<p>Tubular curtain motors slip directly into the track tube. Fit the appropriate rod adapter to the motor head (square or round, depending on your track brand). Insert the motor from the motor-head end of the track. The motor body rotates inside the track tube to move the curtain.</p>
<h2>Step 3: Attach the Curtain</h2>
<p>Hook the curtain ring clips to the track runners. Space them evenly across the curtain width. Clip the leading edge of the curtain to the motor's drive clip (the clip that moves when the motor runs).</p>
<h2>Step 4: Route the Power Cable</h2>
<p>Route the motor's power cable from the motor end of the track to the power socket. Use cable clips to secure the cable along the wall or ceiling. Do not leave the cable hanging free — it is a trip hazard and looks untidy.</p>
<h2>Step 5: Put the Motor in Pairing Mode</h2>
<p>Plug in the motor. The motor will emit a beep. Press the RESET button on the motor (or use the wire loop button if there is no external button) until you hear 2 beeps — the motor is now in AP pairing mode, indicated by a rapidly blinking LED on the power plug.</p>
<h2>Step 6: Pair with Smart Life App</h2>
<p>Open the Smart Life app, tap <em>+</em> → <em>Add Device</em> → <em>Electrical → Curtain Switch</em>. Follow the wizard — it will ask you to confirm the LED is blinking and will request your 2.4 GHz Wi-Fi password. The app will connect to the motor and add it to your home.</p>
<h2>Step 7: Set the Open and Close Limits</h2>
<p>In the app, tap the curtain device and select <em>Settings → Calibration</em>. Follow the calibration process: the motor runs fully open, you confirm, it runs fully closed, you confirm. The motor stores these positions as limits.</p>
<h2>Step 8: Create Automations</h2>
<p>In Smart Life, go to <em>Automation → Add Automation</em>. Create rules: <em>At sunrise + 30 min → Open curtains to 80%</em>. <em>At 22:00 → Close curtains fully</em>. You can also control the curtains with voice commands if Smart Life is linked to Alexa or Google Home.</p>`,
  },
  {
    title: "Upgrading Your Hotel to a Modern Lock System: A Project Guide",
    slug: "hotel-lock-system-upgrade-project-guide",
    category_id: bcId["industry-news"],
    excerpt:
      "Planning a hotel lock upgrade? This project guide covers scoping, procurement, installation sequence, and staff training.",
    video_url: TUTORIAL_VIDEO,
    cover_image_url: ASSET.blog9,
    author_name: "Everest Smart Traders",
    tags: ["hotel locks", "project management", "hospitality", "upgrade"],
    is_featured: false,
    is_published: true,
    published_at: "2025-04-10T08:00:00Z",
    reading_time: 13,
    content: `<h2>Phase 1: Scoping and Planning</h2>
<p>Begin with a full door audit. Walk every door in the hotel that requires access control: guest rooms, service corridors, housekeeping stores, laundry, kitchen, server room, gym, roof. Count and categorise each door. Note: door thickness, door type (timber/metal), existing mortise position, and whether there is power nearby.</p>
<p>For each door type, select the correct lock model. Timber doors in Nepal typically use a 60 mm backset mortise. Metal doors may require a different faceplate. Order 10% spare locks for breakage allowance.</p>
<h2>Phase 2: Infrastructure Preparation</h2>
<p>Before any locks arrive: confirm the front desk PC is dedicated to lock management software (no other critical software). Install the management software and test on a demo lock. Confirm the front desk encoder is working. Prepare a blank key card stock (budget 3 cards per room per year).</p>
<h2>Phase 3: Installation Sequence</h2>
<p>Install locks in this order: <strong>1. Non-guest rooms first</strong> (service areas, back of house) — these allow staff to get familiar with the system without disturbing guests. <strong>2. Unoccupied guest rooms</strong> — batch these during low occupancy. <strong>3. Occupied rooms</strong> — only between 10:00–14:00 when guests are typically out; never leave a room unsecured overnight.</p>
<h2>Phase 4: Software Configuration</h2>
<p>Create the full room list in the software before issuing any cards. Set up all access levels. Test every lock in the software inventory. Configure check-in/check-out default times. Test the master card on every newly fitted lock before opening the room to guests.</p>
<h2>Phase 5: Staff Training</h2>
<p>Run a 2-hour training session for front desk staff covering: check-in card encoding, check-out card cancellation, duplicate card issuance for lost cards, emergency access procedures, and end-of-day audit download. Create a laminated quick-reference card for the front desk.</p>
<h2>Phase 6: Guest Communication</h2>
<p>Update the check-in process. Inform guests that RFID key cards should be kept away from mobile phones and wallets (which can demagnetise them). Brief staff on how to handle the most common guest complaint: "My card stopped working." (Answer: re-encode it at the front desk — takes 10 seconds.)</p>
<h2>Phase 7: Post-Installation Audit</h2>
<p>After 30 days of operation, download audit logs from all locks. Review for: any doors not appearing in logs (lock not connected to system), any master card being used outside emergency (investigate), battery warnings (replace immediately). Document findings and submit to management.</p>`,
  },
  {
    title: "Installing Solar-Powered Gate Automation: Full Tutorial",
    slug: "solar-gate-automation-installation",
    category_id: bcId["installation-tips"],
    excerpt:
      "Learn how to install a solar-powered gate opener — panel positioning, battery wiring, and load-shedding operation.",
    video_url: TUTORIAL_VIDEO,
    cover_image_url: ASSET.blog10,
    author_name: "Everest Smart Traders",
    tags: ["solar", "gate automation", "installation", "off-grid"],
    is_featured: false,
    is_published: true,
    published_at: "2025-04-12T08:00:00Z",
    reading_time: 11,
    seo_title:
      "Solar Gate Automation Installation Tutorial | Everest Smart Traders",
    seo_description:
      "Step-by-step tutorial for installing a solar-powered gate opener with battery backup — ideal for Nepal's load shedding conditions.",
    content: `<h2>System Components</h2>
<ul>
  <li>24V DC solar gate motor kit</li>
  <li>20W solar panel + mounting bracket</li>
  <li>12Ah sealed lead-acid battery (or LiFePO4 equivalent)</li>
  <li>Solar charge controller (built into most kit motors)</li>
  <li>Gear rack, remote receiver, 2× remote controls</li>
</ul>
<h2>Step 1: Assess Solar Exposure</h2>
<p>Identify where the solar panel will be mounted — it needs unobstructed southern exposure (in Nepal's northern hemisphere position) for a minimum of 4 peak sun hours per day. Avoid shadows from trees, walls, or structures at any time between 09:00 and 15:00. A panel in permanent partial shade will fail to keep the battery charged.</p>
<h2>Step 2: Estimate Daily Operation Cycles</h2>
<p>Calculate the expected number of gate open-close cycles per day. A 20W panel in Nepal generates approximately 80 Wh per day in good conditions. A typical 24V DC gate motor uses 40–60 Wh per cycle. This means a 20W panel comfortably supports up to 10–15 cycles per day. For higher traffic, upsize the panel or use mains power with battery backup instead.</p>
<h2>Step 3: Install the Motor and Gear Rack</h2>
<p>Follow standard gate motor installation: mount the motor housing to the concrete pillar, attach the gear rack to the gate, set the limit switches. See our <em>Sliding Gate Motor Installation</em> tutorial for detailed steps on this phase.</p>
<h2>Step 4: Mount the Solar Panel</h2>
<p>Fix the mounting bracket to the wall or post above the motor, angled at 25–35° for Nepal's latitude to maximise year-round yield. Mount the panel on the bracket and orient it due south. Use stainless steel fixings — the panel will be exposed to monsoon rains for years. Cable-tie the panel cable to the bracket, leaving a drip loop at the bottom to prevent water tracking into the connector.</p>
<h2>Step 5: Wire the Solar Panel to the Motor</h2>
<p>Route the panel cable in UV-resistant conduit from the panel to the motor housing. Connect the panel's MC4 connector to the solar input on the motor's charge controller. The motor kit will indicate which terminals are for the solar panel (typically labelled SOLAR+ and SOLAR–). Do not reverse polarity — it will damage the charge controller.</p>
<h2>Step 6: Connect the Battery</h2>
<p>The battery slides into the motor housing or mounts in a separate weatherproof enclosure near the motor. Connect the battery positive (red) to BATT+ and negative (black) to BATT–. The charge controller will begin charging immediately if the solar panel is illuminated.</p>
<h2>Step 7: Commission and Test</h2>
<p>Test the gate operation using the remote. Run 5 complete cycles. Check the battery voltage on the controller display — it should read 25–26V for a healthy 24V battery. Cover the solar panel with a cloth to simulate load shedding and run 5 more cycles from the battery — the gate should operate without any issue.</p>
<h2>Step 8: Monsoon and Winter Preparation</h2>
<p>Before each monsoon season, inspect the solar panel surface for cracks or delamination. Clean the panel glass — dust and bird droppings can reduce output by 15–20%. Before winter, check the battery electrolyte level (in non-sealed batteries) and top up with distilled water if needed.</p>`,
  },
];
await upsert("blog_posts", blogPosts, "slug");

// ── 10. FAQs ──────────────────────────────────────────────────────────────────
console.log("\n❓ FAQs…");
const faqs = [
  {
    question: "Which areas do you serve?",
    answer:
      "We are based in Nepal and primarily serve Kathmandu Valley. We also undertake projects in Pokhara, Chitwan, and other major cities. Contact us to discuss your location.",
    category: "General",
    is_published: true,
    position: 1,
  },
  {
    question: "Do you install the products or only supply them?",
    answer:
      "We both supply and professionally install all products. Our team handles delivery, installation, testing, and handover training at your site.",
    category: "General",
    is_published: true,
    position: 2,
  },
  {
    question: "What is covered under your warranty?",
    answer:
      "All products come with manufacturer warranty (typically 1–2 years). We also offer after-sales service support for maintenance and repairs.",
    category: "General",
    is_published: true,
    position: 3,
  },
  {
    question: "Can I request a product demonstration before buying?",
    answer:
      "Yes, we offer demonstrations at our office or on-site for larger projects. Contact us to schedule.",
    category: "General",
    is_published: true,
    position: 4,
  },
  {
    question: "How long does installation take?",
    answer:
      "Most residential installations take 1–2 days. Hotel lock projects and larger commercial installations may take 3–7 days depending on scope.",
    category: "Installation",
    is_published: true,
    position: 5,
  },
  {
    question: "Do you offer hotel lock system training for staff?",
    answer:
      "Yes, all hotel lock system installations include on-site software training for front desk staff and a handover session for the manager.",
    category: "Hotel",
    is_published: true,
    position: 6,
  },
  {
    question: "Can rolling shutter motors be fitted to existing shutters?",
    answer:
      "In most cases, yes. We assess your existing shutter dimensions to select the correct motor. Contact us with your shutter size for a quote.",
    category: "Shutter",
    is_published: true,
    position: 7,
  },
  {
    question: "Are your smart door locks compatible with existing door frames?",
    answer:
      "Our locks are compatible with most standard door frames. For unusual door types, we assess suitability before installation.",
    category: "Locks",
    is_published: true,
    position: 8,
  },
  {
    question: "Can gate automation work during a power cut?",
    answer:
      "All gate openers include a manual release for power outages. Battery backup and UPS-connected options are available on request.",
    category: "Gate",
    is_published: true,
    position: 9,
  },
  {
    question: "How do I get a price quote?",
    answer:
      "Use the Request Quote form on our website, send a WhatsApp message to 9860819528, or call us directly. Provide your requirements and site photos for a faster quote.",
    category: "General",
    is_published: true,
    position: 10,
  },
];
await upsertNoSlug("faqs", faqs);

// ── 11. HOMEPAGE SECTIONS ─────────────────────────────────────────────────────
console.log("\n🏠 Homepage Sections…");
const homepageSections = [
  {
    section_key: "hero",
    title: "Automate. Secure. Elevate.",
    subtitle:
      "Smart gate systems, hotel locks, shutter motors, and access control — supplied and installed by Nepal's trusted automation specialists.",
    is_visible: true,
    position: 1,
    content: {},
  },
  {
    section_key: "trust_strip",
    title: "Why Businesses Trust Us",
    subtitle: null,
    is_visible: true,
    position: 2,
    content: {},
  },
  {
    section_key: "solutions",
    title: "Our Solutions",
    subtitle:
      "From hotel lock systems to gate automation — complete security and automation for every space.",
    is_visible: true,
    position: 3,
    content: {},
  },
  {
    section_key: "featured_products",
    title: "Featured Products",
    subtitle:
      "Quality automation equipment from trusted global brands, installed by our certified team.",
    is_visible: true,
    position: 4,
    content: {},
  },
  {
    section_key: "industries",
    title: "Industries We Serve",
    subtitle:
      "Tailored solutions for hotels, homes, offices, shops, and builders across Nepal.",
    is_visible: true,
    position: 5,
    content: {},
  },
  {
    section_key: "why_us",
    title: "Why Choose Everest Smart Traders",
    subtitle: null,
    is_visible: true,
    position: 6,
    content: {
      reasons: [
        {
          icon: "wrench",
          title: "Expert Installation",
          description:
            "Certified technicians with real-world experience across Nepal",
        },
        {
          icon: "headset",
          title: "After-Sales Support",
          description:
            "We are here after handover — maintenance, repairs, and software support",
        },
        {
          icon: "star",
          title: "Quality Products",
          description:
            "We source from trusted global brands tested in Nepal's climate",
        },
        {
          icon: "map-pin",
          title: "Nepal-Based Service",
          description:
            "Local team, local knowledge, responsive to your location and needs",
        },
      ],
    },
  },
  {
    section_key: "projects",
    title: "Recent Installations",
    subtitle:
      "Real projects, real results — from Kathmandu hotels to residential complexes.",
    is_visible: true,
    position: 7,
    content: {},
  },
  {
    section_key: "testimonials",
    title: "What Our Clients Say",
    subtitle: null,
    is_visible: true,
    position: 8,
    content: {},
  },
  {
    section_key: "blog",
    title: "Guides & Insights",
    subtitle:
      "Learn about smart security, gate automation, and making the right product choices.",
    is_visible: true,
    position: 9,
    content: {},
  },
  {
    section_key: "faq",
    title: "Frequently Asked Questions",
    subtitle: null,
    is_visible: true,
    position: 10,
    content: {},
  },
  {
    section_key: "cta_band",
    title: "Ready to Upgrade Your Security?",
    subtitle:
      "Get a free site assessment and personalised quote. Our team is available Sunday–Friday.",
    is_visible: true,
    position: 11,
    content: {},
  },
];
await upsert("homepage_sections", homepageSections, "section_key");

// ── 12. ANNOUNCEMENTS ─────────────────────────────────────────────────────────
console.log("\n📢 Announcements…");
const announcements = [
  {
    message:
      "Free site survey for all gate automation and hotel lock installations in Kathmandu Valley. Limited slots available.",
    link: "/quote",
    link_label: "Book Your Survey",
    type: "info",
    is_active: true,
    starts_at: "2025-04-01T00:00:00Z",
    ends_at: "2025-06-30T23:59:59Z",
  },
  {
    message:
      "New: Underground swing gate motors now available. Perfect for luxury homes where aesthetics matter.",
    link: "/products/gate-automation",
    link_label: "View Product",
    type: "success",
    is_active: false,
    starts_at: null,
    ends_at: null,
  },
];
await upsertNoSlug("announcements", announcements);

// ── 13. SEO OVERRIDES ───────────────────────────────────────────────────────
console.log("\n🔎 SEO Overrides…");
const seoOverrides = [
  {
    path: "/",
    title: "Everest Smart Traders — Smart Security & Automation in Nepal",
    description:
      "Gate automation, hotel lock systems, smart locks, curtain motors, and access control supplied and installed across Nepal.",
    og_image: ASSET.ogHome,
    canonical: null,
    noindex: false,
    structured_data: { type: "WebSite", name: "Everest Smart Traders" },
  },
  {
    path: "/products",
    title: "Automation & Security Products | Everest Smart Traders",
    description:
      "Browse gate openers, smart locks, shutter motors, video door phones, and access control products.",
    og_image: ASSET.ogProducts,
    canonical: null,
    noindex: false,
    structured_data: null,
  },
  {
    path: "/services",
    title: "Installation Services | Everest Smart Traders",
    description:
      "Professional installation and maintenance services for automation and security systems in Nepal.",
    og_image: ASSET.ogServices,
    canonical: null,
    noindex: false,
    structured_data: null,
  },
  {
    path: "/contact",
    title: "Contact Everest Smart Traders",
    description:
      "Talk to our team for site visits, quotes, and technical support.",
    og_image: ASSET.ogContact,
    canonical: null,
    noindex: false,
    structured_data: null,
  },
];
await upsert("seo_overrides", seoOverrides, "path");

// ── 14. MEDIA ASSETS ────────────────────────────────────────────────────────
console.log("\n🗂️  Media Assets…");
const mediaAssets = [
  {
    filename: "brand-transparent.png",
    url: ASSET.logo,
    storage_path: "public/images/brand-transparent.png",
    mime_type: "image/png",
    size: null,
    alt: "Everest Smart Traders logo",
    folder: "branding",
  },
  {
    filename: "hero-gate-automation.jpg",
    url: ASSET.hero,
    storage_path: "public/images/home-automation/home-automation-075.jpg",
    mime_type: "image/jpeg",
    size: null,
    alt: "Gate automation hero",
    folder: "hero",
  },
  {
    filename: "gate-opener.jpg",
    url: ASSET.prodGate1,
    storage_path: "public/images/home-automation/home-automation-011.jpg",
    mime_type: "image/jpeg",
    size: null,
    alt: "Sliding gate opener",
    folder: "products",
  },
  {
    filename: "smart-lock.jpg",
    url: ASSET.prodSmartLock,
    storage_path: "public/images/home-automation/home-automation-015.jpg",
    mime_type: "image/jpeg",
    size: null,
    alt: "Smart door lock",
    folder: "products",
  },
  {
    filename: "hotel-lock.jpg",
    url: ASSET.prodHotelLock,
    storage_path: "public/images/home-automation/home-automation-014.jpg",
    mime_type: "image/jpeg",
    size: null,
    alt: "Hotel RFID door lock",
    folder: "products",
  },
  {
    filename: "curtain-motor.jpg",
    url: ASSET.prodCurtain,
    storage_path: "public/images/home-automation/home-automation-017.jpg",
    mime_type: "image/jpeg",
    size: null,
    alt: "Smart curtain motor",
    folder: "products",
  },
  {
    filename: "project-installation.jpg",
    url: ASSET.projHyatt,
    storage_path: "public/images/home-automation/home-automation-041.jpg",
    mime_type: "image/jpeg",
    size: null,
    alt: "Hotel lock installation project",
    folder: "projects",
  },
  {
    filename: "smart-home-automation.jpg",
    url: ASSET.blog4,
    storage_path: "public/images/home-automation/home-automation-054.jpg",
    mime_type: "image/jpeg",
    size: null,
    alt: "Smart home automation setup",
    folder: "blog",
  },
];
await upsertNoSlug("media_assets", mediaAssets);

// ── 15. SAMPLE INQUIRIES ──────────────────────────────────────────────────────
console.log("\n📨 Sample Inquiries…");
const inquiries = [
  {
    inquiry_type: "contact",
    full_name: "Mausam Koirala",
    phone: "9860819528",
    email: "mausam.koirala@example.com",
    subject: "General Business Inquiry",
    message:
      "I would like details about your complete automation package and AMC support options.",
    status: "new",
    location: "Kathmandu",
  },
  {
    inquiry_type: "quote",
    full_name: "Kailash Koirala",
    phone: "9862268680",
    email: "kailash.koirala@example.com",
    subject: "Quote for Smart Door Lock and Gate",
    message:
      "Please provide pricing for a smart door lock plus sliding gate opener installation at my residence.",
    status: "contacted",
    location: "Lalitpur",
  },
  {
    inquiry_type: "quote",
    full_name: "Rajesh Sharma",
    phone: "9841234567",
    email: "rajesh.sharma@gmail.com",
    subject: "Gate Automation for Residence",
    message:
      "I need a sliding gate motor for my house in Budhanilkantha. Gate is 6 metres wide, mild steel, about 200 kg. Please send quote.",
    status: "new",
    location: "Budhanilkantha, Kathmandu",
  },
  {
    inquiry_type: "general",
    full_name: "Sita Poudel",
    phone: "9856789012",
    email: null,
    subject: "Hotel Lock Inquiry",
    message:
      "We are opening a 30-room guesthouse in Pokhara next month. Need RFID lock system with software. When can your team visit?",
    status: "contacted",
    location: "Pokhara",
  },
  {
    inquiry_type: "quote",
    full_name: "Binod Karmacharya",
    phone: "9801234567",
    email: "binod.k@company.com.np",
    subject: "Rolling Shutter Motor for 3 Shops",
    message:
      "Need tubular motors for 3 shop shutters in Newroad. Each shutter is about 3m wide by 3m tall. Please quote for supply and installation.",
    status: "quoted",
    location: "Newroad, Kathmandu",
  },
  {
    inquiry_type: "support",
    full_name: "Meena Thapa",
    phone: "9812345678",
    email: null,
    subject: "Gate Remote Not Working",
    message:
      "Our sliding gate remote stopped working yesterday. Gate was installed by your team 8 months ago. Can someone come check?",
    status: "closed",
    location: "Sanepa, Lalitpur",
  },
  {
    inquiry_type: "quote",
    full_name: "Dev Prasad Joshi",
    phone: "9867890123",
    email: "dev.joshi@hotel.com",
    subject: "Full Hotel Lock System — 60 Rooms",
    message:
      "We are renovating our hotel in Thamel. Need complete RFID lock system for 60 rooms plus staff and common area access. Request site visit and quotation.",
    status: "new",
    location: "Thamel, Kathmandu",
  },
  {
    inquiry_type: "general",
    full_name: "Pratima Bista",
    phone: "9845678901",
    email: "pratima.bista@gmail.com",
    subject: "Smart Door Lock Recommendation",
    message:
      "Looking for a smart door lock for our apartment main door. Budget around Rs. 15,000. Which model do you recommend for a steel door?",
    status: "new",
    location: "Lazimpat, Kathmandu",
  },
  {
    inquiry_type: "quote",
    full_name: "Rajan Maharjan",
    phone: "9803456789",
    email: null,
    subject: "Curtain Motors for Office — 12 Windows",
    message:
      "Our office has 12 large curtain windows. All need motorised curtains for conference room and executive floors. Please advise on options and pricing.",
    status: "contacted",
    location: "Durbarmarg, Kathmandu",
  },
  {
    inquiry_type: "quote",
    full_name: "Anita Gurung",
    phone: "9851234567",
    email: "anita.gurung@school.edu.np",
    subject: "School Campus Gate System",
    message:
      "We need automated gate for our school main entrance. The gate is a double swing type, each leaf about 3m. Also interested in CCTV. Please visit for assessment.",
    status: "new",
    location: "Kirtipur, Kathmandu",
  },
  {
    inquiry_type: "support",
    full_name: "Sunil Bajracharya",
    phone: "9876543210",
    email: "sunil.b@gmail.com",
    subject: "Curtain Motor Running Slow",
    message:
      "Curtain motor installed 2 years ago is running very slowly now. Almost stops midway. Needs servicing I think. Can you send a technician?",
    status: "new",
    location: "Bhaisepati, Lalitpur",
  },
  {
    inquiry_type: "quote",
    full_name: "Kamana Shrestha",
    phone: "9823456789",
    email: "kamana.s@realtor.com.np",
    subject: "Automation Package for New Development",
    message:
      "We are building a 24-unit residential complex in Budhanilkantha. Need pricing for complete smart home package per unit including gate, locks, and video intercom. We buy in bulk.",
    status: "contacted",
    location: "Budhanilkantha, Kathmandu",
  },
];
await upsertNoSlug("inquiries", inquiries);

console.log("\n✅ Done! All tables seeded.\n");
