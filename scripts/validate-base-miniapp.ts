import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const manifestPath = join(root, "public", ".well-known", "farcaster.json");
const indexPath = join(root, "index.html");
const requiredAssets = [
  "public/base/icon.png",
  "public/base/splash.png",
  "public/base/hero.png",
  "public/base/screenshot-1.png",
  "public/base/screenshot-2.png",
  "public/base/screenshot-3.png"
];

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function warn(condition: boolean, message: string) {
  if (!condition) {
    console.warn(`WARN ${message}`);
  }
}

assert(existsSync(manifestPath), "Missing public/.well-known/farcaster.json");
assert(existsSync(indexPath), "Missing index.html");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const index = readFileSync(indexPath, "utf8");
const miniapp = manifest.miniapp ?? {};
const association = manifest.accountAssociation ?? {};

assert(/<meta[^>]+name="base:app_id"/s.test(index), "Missing base:app_id meta tag");
warn(/<meta[^>]+name="fc:miniapp"/s.test(index), "Missing fc:miniapp compatibility meta tag.");
assert(/<meta[^>]+property="og:title"/s.test(index), "Missing og:title meta tag");
assert(/<meta[^>]+property="og:description"/s.test(index), "Missing og:description meta tag");
assert(/<meta[^>]+property="og:image"/s.test(index), "Missing og:image meta tag");

assert(miniapp.name === "Launch Desk", "Manifest miniapp.name should be Launch Desk");
assert(typeof miniapp.homeUrl === "string" && miniapp.homeUrl.startsWith("https://"), "Manifest homeUrl must be HTTPS");
assert(typeof miniapp.iconUrl === "string" && miniapp.iconUrl.startsWith("https://"), "Manifest iconUrl must be HTTPS");
assert(typeof miniapp.heroImageUrl === "string" && miniapp.heroImageUrl.startsWith("https://"), "Manifest heroImageUrl must be HTTPS");
assert(Array.isArray(miniapp.screenshotUrls) && miniapp.screenshotUrls.length >= 3, "Manifest should include at least 3 screenshotUrls");
assert(miniapp.noindex === false, "Manifest noindex should be false for submission");

for (const asset of requiredAssets) {
  assert(existsSync(join(root, asset)), `Missing asset: ${asset}`);
}

warn(Boolean(association.header && association.payload && association.signature), "Optional Farcaster accountAssociation still needs wallet signature if you use legacy embed validation.");
warn(
  manifest.baseBuilder?.ownerAddress && manifest.baseBuilder.ownerAddress !== "0x0000000000000000000000000000000000000000",
  "baseBuilder.ownerAddress still needs your Base Build wallet address."
);

console.log("Base standard web app local validation passed.");
