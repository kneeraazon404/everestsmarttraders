/**
 * Backfill missing CMS images as admin-owned media assets.
 *
 * What it does:
 * 1. Finds an admin profile (role='admin').
 * 2. Uploads local images from public/images/home-automation to Supabase Storage bucket.
 * 3. Inserts media_assets rows with uploaded_by = admin profile id.
 * 4. Fills empty image URL fields across content tables.
 * 5. Adds product_images/project_images rows where galleries are empty.
 *
 * Run:
 *   node scripts/backfill-admin-images.mjs
 */

import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ARGS = new Set(process.argv.slice(2));
const SHOULD_RESET = ARGS.has("--reset");
const SKIP_HERO = ARGS.has("--skip-hero");

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const IMAGES_ROOT = path.join(ROOT, "public", "images", "home-automation");

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
]);
const MIME_BY_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

function normalizeName(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function hash(value) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function hasImage(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isLocalImageUrl(value) {
  return typeof value === "string" && value.trim().startsWith("/images/");
}

function localPathFromPublicUrl(value) {
  const clean = String(value).split("?")[0].split("#")[0];
  return path.join(ROOT, "public", clean);
}

function storagePathFromPublicUrl(publicUrl, supabaseUrl, bucket) {
  if (typeof publicUrl !== "string" || !publicUrl) return "";
  const clean = publicUrl.split("?")[0].split("#")[0];
  const prefix = `${supabaseUrl}/storage/v1/object/public/${bucket}/`;
  if (!clean.startsWith(prefix)) return "";
  return clean.slice(prefix.length);
}

function resolveLocalImagePath(value) {
  const direct = localPathFromPublicUrl(value);
  if (existsSync(direct)) return direct;

  const clean = String(value).split("?")[0].split("#")[0];
  const base = path.basename(clean);
  const inHomeAutomation = path.join(IMAGES_ROOT, base);
  if (existsSync(inHomeAutomation)) return inHomeAutomation;

  return "";
}

function parseEnv(raw) {
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed
      .slice(idx + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");
    env[key] = value;
  }
  return env;
}

async function loadEnv() {
  const candidates = [path.join(ROOT, ".env.local"), path.join(ROOT, ".env")];
  const envPath = candidates.find((p) => existsSync(p));
  if (!envPath) {
    throw new Error("No .env.local or .env file found.");
  }
  const raw = await readFile(envPath, "utf8");
  return parseEnv(raw);
}

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await walkFiles(fullPath);
      out.push(...nested);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (IMAGE_EXTENSIONS.has(ext)) out.push(fullPath);
  }
  return out;
}

async function listBucketPathsRecursive(supabase, bucket, prefix = "") {
  const filePaths = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const listed = await supabase.storage.from(bucket).list(prefix, {
      limit,
      offset,
      sortBy: { column: "name", order: "asc" },
    });

    if (listed.error) {
      throw new Error(
        `Could not list storage path '${prefix || "/"}': ${listed.error.message}`,
      );
    }

    const entries = listed.data ?? [];
    for (const entry of entries) {
      const childPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (!entry.id) {
        const nested = await listBucketPathsRecursive(
          supabase,
          bucket,
          childPath,
        );
        filePaths.push(...nested);
      } else {
        filePaths.push(childPath);
      }
    }

    if (entries.length < limit) break;
    offset += limit;
  }

  return filePaths;
}

async function removeStoragePaths(supabase, bucket, paths) {
  const chunkSize = 100;
  for (let i = 0; i < paths.length; i += chunkSize) {
    const chunk = paths.slice(i, i + chunkSize);
    const removed = await supabase.storage.from(bucket).remove(chunk);
    if (removed.error) {
      throw new Error(
        `Could not remove storage objects: ${removed.error.message}`,
      );
    }
  }
}

function buildPools(paths) {
  const pools = {
    generic: [],
    gate: [],
    lock: [],
    shutter: [],
    curtain: [],
    intercom: [],
    access: [],
    cctv: [],
    hotel: [],
    office: [],
    home: [],
    project: [],
    blog: [],
    brand: [],
  };

  for (const filePath of paths) {
    const basename = path.basename(filePath).toLowerCase();
    pools.generic.push(filePath);

    if (basename.includes("brand")) pools.brand.push(filePath);
    if (basename.includes("gate")) pools.gate.push(filePath);
    if (basename.includes("lock") || basename.includes("door"))
      pools.lock.push(filePath);
    if (basename.includes("shutter") || basename.includes("roller"))
      pools.shutter.push(filePath);
    if (basename.includes("curtain")) pools.curtain.push(filePath);
    if (basename.includes("intercom") || basename.includes("vdp"))
      pools.intercom.push(filePath);
    if (basename.includes("access")) pools.access.push(filePath);
    if (basename.includes("cctv") || basename.includes("camera"))
      pools.cctv.push(filePath);
    if (basename.includes("hotel") || basename.includes("safebox"))
      pools.hotel.push(filePath);
    if (basename.includes("office")) pools.office.push(filePath);
    if (basename.includes("residential") || basename.includes("home"))
      pools.home.push(filePath);
    if (basename.includes("project")) pools.project.push(filePath);
    if (basename.includes("blog")) pools.blog.push(filePath);
    if (basename.includes("home-automation")) pools.blog.push(filePath);
  }

  return pools;
}

function pickPoolKey(seed) {
  const value = seed.toLowerCase();
  if (
    value.includes("logo") ||
    value.includes("favicon") ||
    value.includes("brand")
  )
    return "brand";
  if (value.includes("gate") || value.includes("barrier")) return "gate";
  if (value.includes("lock") || value.includes("door")) return "lock";
  if (value.includes("shutter") || value.includes("roller")) return "shutter";
  if (value.includes("curtain") || value.includes("blind")) return "curtain";
  if (
    value.includes("video") ||
    value.includes("intercom") ||
    value.includes("vdp")
  )
    return "intercom";
  if (value.includes("access") || value.includes("biometric")) return "access";
  if (value.includes("cctv") || value.includes("surveillance")) return "cctv";
  if (value.includes("hotel") || value.includes("hospitality")) return "hotel";
  if (value.includes("office") || value.includes("commercial")) return "office";
  if (value.includes("home") || value.includes("residential")) return "home";
  if (value.includes("project") || value.includes("installation"))
    return "project";
  if (value.includes("blog") || value.includes("article")) return "blog";
  return "generic";
}

function pickLocalImage(pools, seed, offset = 0) {
  const key = pickPoolKey(seed);
  const preferred = pools[key].length ? pools[key] : pools.generic;
  if (!preferred.length) {
    throw new Error(
      "No local images found under public/images/home-automation.",
    );
  }
  const index = (hash(seed) + offset) % preferred.length;
  return preferred[index];
}

async function ensureUpload({
  supabase,
  bucket,
  localPath,
  folder,
  logicalName,
  alt,
  adminId,
  mediaCache,
}) {
  const cacheKey = `${folder}::${localPath}::${logicalName}`;
  if (mediaCache.has(cacheKey)) return mediaCache.get(cacheKey);

  const ext = path.extname(localPath).toLowerCase();
  const safeLogical = normalizeName(logicalName) || "asset";
  const storagePath = `autofill/${folder}/${safeLogical}${ext}`;
  const contentType = MIME_BY_EXT[ext] ?? "application/octet-stream";

  const bytes = await readFile(localPath);
  const upload = await supabase.storage
    .from(bucket)
    .upload(storagePath, bytes, {
      upsert: false,
      contentType,
    });

  if (
    upload.error &&
    !String(upload.error.message).toLowerCase().includes("already exists")
  ) {
    throw new Error(
      `Storage upload failed for ${storagePath}: ${upload.error.message}`,
    );
  }

  const { data: publicData } = supabase.storage
    .from(bucket)
    .getPublicUrl(storagePath);
  const publicUrl = publicData.publicUrl;

  const existingAsset = await supabase
    .from("media_assets")
    .select("id")
    .eq("storage_path", storagePath)
    .maybeSingle();

  if (!existingAsset.error && !existingAsset.data) {
    const assetInsert = await supabase.from("media_assets").insert({
      filename: path.basename(localPath),
      url: publicUrl,
      storage_path: storagePath,
      mime_type: null,
      size: bytes.byteLength,
      alt,
      folder,
      uploaded_by: adminId,
    });

    if (assetInsert.error) {
      throw new Error(
        `media_assets insert failed for ${storagePath}: ${assetInsert.error.message}`,
      );
    }
  }

  mediaCache.set(cacheKey, { publicUrl, storagePath });
  return { publicUrl, storagePath };
}

async function run() {
  const env = await loadEnv();
  const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE = env.SUPABASE_SERVICE_ROLE_KEY;
  const BUCKET = env.NEXT_PUBLIC_STORAGE_BUCKET || "media";

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env file.",
    );
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const bucketsRes = await supabase.storage.listBuckets();
  if (bucketsRes.error) {
    throw new Error(
      `Could not list storage buckets: ${bucketsRes.error.message}`,
    );
  }
  const hasBucket = (bucketsRes.data ?? []).some(
    (bucket) => bucket.name === BUCKET,
  );
  if (!hasBucket) {
    const created = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 20 * 1024 * 1024,
    });
    if (created.error) {
      throw new Error(
        `Could not create bucket '${BUCKET}': ${created.error.message}`,
      );
    }
    console.log(`Created storage bucket: ${BUCKET}`);
  }

  const allImageFiles = await walkFiles(IMAGES_ROOT);
  const pools = buildPools(allImageFiles);
  const mediaCache = new Map();

  const adminRes = await supabase
    .from("profiles")
    .select("id, role, email")
    .eq("role", "admin")
    .limit(1)
    .maybeSingle();

  if (adminRes.error) {
    throw new Error(`Could not fetch admin profile: ${adminRes.error.message}`);
  }
  if (!adminRes.data) {
    throw new Error(
      "No admin profile found. Create/login an admin user first.",
    );
  }

  const adminId = adminRes.data.id;
  const now = new Date().toISOString();
  const stats = {
    siteSettings: 0,
    siteSettingsMigrated: 0,
    categories: 0,
    categoriesMigrated: 0,
    products: 0,
    productsMigrated: 0,
    services: 0,
    servicesMigrated: 0,
    industries: 0,
    industriesMigrated: 0,
    projects: 0,
    projectsMigrated: 0,
    blogPosts: 0,
    blogPostsMigrated: 0,
    productImages: 0,
    productImagesMigrated: 0,
    projectImages: 0,
    projectImagesMigrated: 0,
  };

  console.log(`Using admin profile: ${adminRes.data.email ?? adminId}`);
  console.log(`Local images discovered: ${allImageFiles.length}`);
  console.log(`Target bucket: ${BUCKET}`);

  if (SHOULD_RESET) {
    console.log(
      "\nReset mode enabled: purging Supabase media and image references before backfill...",
    );

    let preservedHeroStoragePath = "";
    if (SKIP_HERO) {
      const heroSettingRes = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "hero_image_url")
        .maybeSingle();

      if (heroSettingRes.error) {
        throw new Error(
          `Could not read hero_image_url: ${heroSettingRes.error.message}`,
        );
      }

      const heroUrl =
        typeof heroSettingRes.data?.value === "string"
          ? heroSettingRes.data.value
          : "";
      preservedHeroStoragePath = storagePathFromPublicUrl(
        heroUrl,
        SUPABASE_URL,
        BUCKET,
      );
      if (preservedHeroStoragePath) {
        console.log(
          `Preserving hero storage path: ${preservedHeroStoragePath}`,
        );
      } else {
        console.log(
          "Hero image is not stored in Supabase bucket or not set; nothing to preserve.",
        );
      }
    }

    const allStoragePaths = await listBucketPathsRecursive(supabase, BUCKET);
    const toDelete = preservedHeroStoragePath
      ? allStoragePaths.filter((p) => p !== preservedHeroStoragePath)
      : allStoragePaths;

    if (toDelete.length) {
      await removeStoragePaths(supabase, BUCKET, toDelete);
    }
    console.log(`Deleted ${toDelete.length} storage object(s).`);

    if (preservedHeroStoragePath) {
      const mediaDelete = await supabase
        .from("media_assets")
        .delete()
        .neq("storage_path", preservedHeroStoragePath);
      if (mediaDelete.error) {
        throw new Error(
          `media_assets cleanup failed: ${mediaDelete.error.message}`,
        );
      }
    } else {
      const mediaDelete = await supabase
        .from("media_assets")
        .delete()
        .not("id", "is", null);
      if (mediaDelete.error) {
        throw new Error(
          `media_assets cleanup failed: ${mediaDelete.error.message}`,
        );
      }
    }

    const resetSiteKeys = SKIP_HERO
      ? ["logo_url", "favicon_url"]
      : ["logo_url", "favicon_url", "hero_image_url"];

    if (resetSiteKeys.length) {
      const siteReset = await supabase
        .from("site_settings")
        .update({ value: "", updated_by: adminId, updated_at: now })
        .in("key", resetSiteKeys);
      if (siteReset.error) {
        throw new Error(
          `site_settings reset failed: ${siteReset.error.message}`,
        );
      }
    }

    const resets = [
      supabase
        .from("product_categories")
        .update({ image_url: null })
        .not("id", "is", null),
      supabase
        .from("products")
        .update({ cover_image_url: null, updated_by: adminId })
        .not("id", "is", null),
      supabase
        .from("services")
        .update({ cover_image_url: null })
        .not("id", "is", null),
      supabase
        .from("industries")
        .update({ cover_image_url: null })
        .not("id", "is", null),
      supabase
        .from("projects")
        .update({ cover_image_url: null })
        .not("id", "is", null),
      supabase
        .from("blog_posts")
        .update({ cover_image_url: null })
        .not("id", "is", null),
      supabase.from("product_images").delete().not("id", "is", null),
      supabase.from("project_images").delete().not("id", "is", null),
    ];

    const resetResults = await Promise.all(resets);
    for (const result of resetResults) {
      if (result.error) {
        throw new Error(`Reset query failed: ${result.error.message}`);
      }
    }
    console.log("Cleared non-hero image fields and gallery rows.");
  }

  const settingKeys = SKIP_HERO
    ? ["logo_url", "favicon_url"]
    : ["logo_url", "favicon_url", "hero_image_url"];
  const settingsRes = await supabase
    .from("site_settings")
    .select("id, key, value")
    .in("key", settingKeys);

  if (settingsRes.error) throw new Error(settingsRes.error.message);

  for (const row of settingsRes.data ?? []) {
    const current = typeof row.value === "string" ? row.value : "";
    let local = "";
    if (!hasImage(current)) {
      local = pickLocalImage(pools, row.key);
    } else if (isLocalImageUrl(current) && resolveLocalImagePath(current)) {
      local = resolveLocalImagePath(current);
    } else {
      continue;
    }

    const upload = await ensureUpload({
      supabase,
      bucket: BUCKET,
      localPath: local,
      folder: "general",
      logicalName: `site-${row.key}`,
      alt: `Everest Smart Traders ${row.key}`,
      adminId,
      mediaCache,
    });

    const updated = await supabase
      .from("site_settings")
      .update({ value: upload.publicUrl, updated_by: adminId, updated_at: now })
      .eq("id", row.id);

    if (updated.error) throw new Error(updated.error.message);
    if (!hasImage(current)) stats.siteSettings += 1;
    else stats.siteSettingsMigrated += 1;
  }

  async function fillImageField({
    table,
    select,
    field,
    slugField = "slug",
    nameField = "name",
    folder,
    extraSeed = "",
    writeAdmin = false,
  }) {
    const rowsRes = await supabase.from(table).select(select);
    if (rowsRes.error) throw new Error(`${table}: ${rowsRes.error.message}`);

    for (const row of rowsRes.data ?? []) {
      let local = "";
      const current = row[field];

      if (!hasImage(current)) {
        const slug = row[slugField] || row.id;
        const name = row[nameField] || slug;
        const seed = `${table}-${slug}-${name}-${extraSeed}`;
        local = pickLocalImage(pools, seed);
      } else if (isLocalImageUrl(current) && resolveLocalImagePath(current)) {
        local = resolveLocalImagePath(current);
      } else {
        continue;
      }

      const slug = row[slugField] || row.id;
      const name = row[nameField] || slug;

      const upload = await ensureUpload({
        supabase,
        bucket: BUCKET,
        localPath: local,
        folder,
        logicalName: `${table}-${slug}`,
        alt: String(name),
        adminId,
        mediaCache,
      });

      const payload = { [field]: upload.publicUrl };
      if (writeAdmin && "updated_by" in row) payload.updated_by = adminId;

      const updated = await supabase
        .from(table)
        .update(payload)
        .eq("id", row.id);
      if (updated.error)
        throw new Error(`${table} update: ${updated.error.message}`);

      const migrated = hasImage(current);
      if (table === "product_categories") {
        if (migrated) stats.categoriesMigrated += 1;
        else stats.categories += 1;
      }
      if (table === "products") {
        if (migrated) stats.productsMigrated += 1;
        else stats.products += 1;
      }
      if (table === "services") {
        if (migrated) stats.servicesMigrated += 1;
        else stats.services += 1;
      }
      if (table === "industries") {
        if (migrated) stats.industriesMigrated += 1;
        else stats.industries += 1;
      }
      if (table === "projects") {
        if (migrated) stats.projectsMigrated += 1;
        else stats.projects += 1;
      }
      if (table === "blog_posts") {
        if (migrated) stats.blogPostsMigrated += 1;
        else stats.blogPosts += 1;
      }
    }
  }

  await fillImageField({
    table: "product_categories",
    select: "id, slug, name, image_url",
    field: "image_url",
    folder: "products",
  });

  await fillImageField({
    table: "products",
    select: "id, slug, name, cover_image_url, updated_by",
    field: "cover_image_url",
    folder: "products",
    writeAdmin: true,
  });

  await fillImageField({
    table: "services",
    select: "id, slug, name, cover_image_url",
    field: "cover_image_url",
    folder: "services",
  });

  await fillImageField({
    table: "industries",
    select: "id, slug, name, cover_image_url",
    field: "cover_image_url",
    folder: "services",
  });

  await fillImageField({
    table: "projects",
    select: "id, slug, title, cover_image_url",
    field: "cover_image_url",
    nameField: "title",
    folder: "projects",
  });

  await fillImageField({
    table: "blog_posts",
    select: "id, slug, title, cover_image_url",
    field: "cover_image_url",
    nameField: "title",
    folder: "blog",
  });

  const productsRes = await supabase
    .from("products")
    .select("id, slug, name, cover_image_url");
  if (productsRes.error) throw new Error(productsRes.error.message);

  for (const product of productsRes.data ?? []) {
    const existingRes = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", product.id)
      .limit(1);
    if (existingRes.error) throw new Error(existingRes.error.message);
    if ((existingRes.data ?? []).length) continue;

    const first = product.cover_image_url;
    const secondLocal = pickLocalImage(
      pools,
      `product-gallery-${product.slug}`,
      1,
    );
    const secondUpload = await ensureUpload({
      supabase,
      bucket: BUCKET,
      localPath: secondLocal,
      folder: "products",
      logicalName: `product-gallery-${product.slug}`,
      alt: `${product.name} gallery`,
      adminId,
      mediaCache,
    });

    const insert = await supabase.from("product_images").insert([
      {
        product_id: product.id,
        url: first,
        alt: `${product.name} cover`,
        position: 1,
      },
      {
        product_id: product.id,
        url: secondUpload.publicUrl,
        alt: `${product.name} detail`,
        position: 2,
      },
    ]);
    if (insert.error) throw new Error(insert.error.message);
    stats.productImages += 2;
  }

  const allProductImages = await supabase
    .from("product_images")
    .select("id, product_id, url, alt");
  if (allProductImages.error) throw new Error(allProductImages.error.message);

  for (const image of allProductImages.data ?? []) {
    if (!isLocalImageUrl(image.url)) continue;
    const local = resolveLocalImagePath(image.url);
    if (!local) continue;
    const uploaded = await ensureUpload({
      supabase,
      bucket: BUCKET,
      localPath: local,
      folder: "products",
      logicalName: `product-image-${image.id}`,
      alt: image.alt ?? "Product image",
      adminId,
      mediaCache,
    });

    const updated = await supabase
      .from("product_images")
      .update({ url: uploaded.publicUrl })
      .eq("id", image.id);
    if (updated.error) throw new Error(updated.error.message);
    stats.productImagesMigrated += 1;
  }

  const projectsRes = await supabase
    .from("projects")
    .select("id, slug, title, cover_image_url");
  if (projectsRes.error) throw new Error(projectsRes.error.message);

  for (const project of projectsRes.data ?? []) {
    const existingRes = await supabase
      .from("project_images")
      .select("id")
      .eq("project_id", project.id)
      .limit(1);
    if (existingRes.error) throw new Error(existingRes.error.message);
    if ((existingRes.data ?? []).length) continue;

    const galleryLocal = pickLocalImage(
      pools,
      `project-gallery-${project.slug}`,
      1,
    );
    const galleryUpload = await ensureUpload({
      supabase,
      bucket: BUCKET,
      localPath: galleryLocal,
      folder: "projects",
      logicalName: `project-gallery-${project.slug}`,
      alt: `${project.title} gallery`,
      adminId,
      mediaCache,
    });

    const insert = await supabase.from("project_images").insert([
      {
        project_id: project.id,
        url: project.cover_image_url,
        alt: `${project.title} cover`,
        is_cover: true,
        position: 1,
      },
      {
        project_id: project.id,
        url: galleryUpload.publicUrl,
        alt: `${project.title} detail`,
        is_cover: false,
        position: 2,
      },
    ]);
    if (insert.error) throw new Error(insert.error.message);
    stats.projectImages += 2;
  }

  const allProjectImages = await supabase
    .from("project_images")
    .select("id, project_id, url, alt");
  if (allProjectImages.error) throw new Error(allProjectImages.error.message);

  for (const image of allProjectImages.data ?? []) {
    if (!isLocalImageUrl(image.url)) continue;
    const local = resolveLocalImagePath(image.url);
    if (!local) continue;
    const uploaded = await ensureUpload({
      supabase,
      bucket: BUCKET,
      localPath: local,
      folder: "projects",
      logicalName: `project-image-${image.id}`,
      alt: image.alt ?? "Project image",
      adminId,
      mediaCache,
    });

    const updated = await supabase
      .from("project_images")
      .update({ url: uploaded.publicUrl })
      .eq("id", image.id);
    if (updated.error) throw new Error(updated.error.message);
    stats.projectImagesMigrated += 1;
  }

  console.log("\nBackfill complete:");
  console.table(stats);
}

run().catch((error) => {
  console.error("Backfill failed:");
  console.error(error);
  process.exit(1);
});
