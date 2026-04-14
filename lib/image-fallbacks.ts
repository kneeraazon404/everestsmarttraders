const IMAGE_POOL_SIZE = 100;

function toPoolImage(index: number): string {
  const normalized = ((index % IMAGE_POOL_SIZE) + IMAGE_POOL_SIZE) % IMAGE_POOL_SIZE;
  return `/images/home-automation/home-automation-${String(normalized + 1).padStart(3, "0")}.jpg`;
}

function simpleHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function pickFallbackImage(key: string, offset = 0): string {
  return toPoolImage(simpleHash(key) + offset);
}

export const HERO_FALLBACK_IMAGE = toPoolImage(0);
export const ABOUT_FALLBACK_IMAGE = toPoolImage(11);
export const BLOG_FALLBACK_IMAGE = toPoolImage(22);
export const PRODUCT_FALLBACK_IMAGE = toPoolImage(33);
export const PROJECT_FALLBACK_IMAGE = toPoolImage(44);
export const INDUSTRY_FALLBACK_IMAGE = toPoolImage(55);
export const SERVICE_FALLBACK_IMAGE = toPoolImage(66);
