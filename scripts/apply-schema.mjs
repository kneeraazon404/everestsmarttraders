/**
 * Everest Smart Traders — Schema + Migration runner
 *
 * Uses the Supabase Management API to apply the database schema.
 *
 * Requires SUPABASE_ACCESS_TOKEN in .env.local
 * Get it from: https://supabase.com/dashboard/account/tokens
 *
 * Run: node scripts/apply-schema.mjs
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ─────────────────────────────────────────────────────────
const envPath = join(__dir, "../.env.local");
let envVars = {};
try {
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    envVars[key] = val;
  }
} catch {
  console.error("Could not read .env.local");
  process.exit(1);
}

const ACCESS_TOKEN = envVars["SUPABASE_ACCESS_TOKEN"] || process.env.SUPABASE_ACCESS_TOKEN;
const PROJECT_REF = "nxnkswfguzwzmiqhvdcw";

if (!ACCESS_TOKEN) {
  console.error(`
╔══════════════════════════════════════════════════════════════════╗
║  SUPABASE_ACCESS_TOKEN not found in .env.local                  ║
╠══════════════════════════════════════════════════════════════════╣
║  To run this script automatically:                              ║
║  1. Go to: https://supabase.com/dashboard/account/tokens        ║
║  2. Create a new access token                                   ║
║  3. Add to .env.local:  SUPABASE_ACCESS_TOKEN=sbp_xxxx...       ║
║  4. Re-run: node scripts/apply-schema.mjs                       ║
╠══════════════════════════════════════════════════════════════════╣
║  OR run manually in the Supabase SQL editor:                    ║
║  https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new  ║
║  Paste contents of: supabase/setup.sql                          ║
╚══════════════════════════════════════════════════════════════════╝
`);
  process.exit(1);
}

// ── Read SQL files ────────────────────────────────────────────────────────────
const schema = readFileSync(join(__dir, "../supabase/migrations/001_initial_schema.sql"), "utf8");
const rls    = readFileSync(join(__dir, "../supabase/migrations/002_rls_policies.sql"), "utf8");
const combined = schema + "\n\n" + rls;

// ── Run via Management API ─────────────────────────────────────────────────
async function runSQL(sql, label) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error(`✗ ${label} failed (${res.status}):`, JSON.stringify(json).substring(0, 300));
    return false;
  }

  console.log(`✓ ${label}`);
  return true;
}

console.log("Applying schema migrations…");
const ok = await runSQL(combined, "Schema + RLS");
if (ok) {
  console.log("\n✅ Schema applied. Run seed: node scripts/seed-db.mjs\n");
} else {
  console.log("\nIf the error says 'already exists', the schema is already applied.");
  console.log("You can safely run: node scripts/seed-db.mjs\n");
}
