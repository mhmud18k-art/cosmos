/**
 * OPTIONAL, unused by default. Planet.tsx now draws Earth's continents, Mars's
 * named features and Jupiter's Great Red Spot from real coordinates in code —
 * see src/components/Planet.tsx — so nothing needs to be downloaded for the
 * site to look realistic, and this script is not run automatically.
 *
 * It is kept only in case you want to swap the generated surfaces for actual
 * photographic texture maps later. If you do, re-add a `texture` prop to the
 * <Planet /> call sites in PlanetCard.tsx / PlanetDetail.tsx — the component
 * still supports one.
 *
 *   node scripts/get-textures.mjs
 *
 * Source: Solar System Scope (solarsystemscope.com/textures), built from NASA
 * elevation and imagery data, CC BY 4.0. Note: this site downloaded these
 * successfully in the past but the host has since returned non-image
 * responses to plain requests (likely bot protection) — treat this as
 * best-effort, not guaranteed to work.
 *
 * These are equirectangular maps: longitude across, latitude down. That is
 * exactly what src/components/Planet.tsx expects, so no conversion is needed.
 */

import { mkdir, writeFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "planets");
const BASE = "https://www.solarsystemscope.com/textures/download";

// 2k is deliberate, not a compromise: Planet.tsx downsamples every map to
// 256x128 before it ever reaches the screen, so an 8k file would cost ~16x the
// download to be thrown away on load.
const FILES = {
  "mercury.jpg": "2k_mercury.jpg",
  "venus.jpg": "2k_venus_atmosphere.jpg", // what you actually see is the cloud deck
  "earth.jpg": "2k_earth_daymap.jpg",
  "mars.jpg": "2k_mars.jpg",
  "jupiter.jpg": "2k_jupiter.jpg",
  "saturn.jpg": "2k_saturn.jpg",
  "uranus.jpg": "2k_uranus.jpg",
  "neptune.jpg": "2k_neptune.jpg",
};

await mkdir(OUT, { recursive: true });

let ok = 0;
let failed = [];

for (const [local, remote] of Object.entries(FILES)) {
  const dest = join(OUT, local);

  try {
    await access(dest);
    console.log(`•  ${local} — already there, skipping`);
    ok++;
    continue;
  } catch {
    /* not downloaded yet */
  }

  try {
    const res = await fetch(`${BASE}/${remote}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    // A "success" that returns an HTML error page would silently write a broken
    // file, so check it actually looks like a JPEG before saving.
    if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error("not a JPEG");
    await writeFile(dest, buf);
    console.log(`✓  ${local}  (${(buf.length / 1024).toFixed(0)} KB)`);
    ok++;
  } catch (err) {
    console.warn(`✗  ${local} — ${err.message}`);
    failed.push([local, `${BASE}/${remote}`]);
  }
}

console.log(`\n${ok}/8 textures in public/planets/`);

if (failed.length) {
  console.log(
    "\nDownload these by hand and save them under public/planets/ with the name on the left:"
  );
  for (const [local, url] of failed) console.log(`  ${local}  ←  ${url}`);
  console.log("\nOr browse them at https://www.solarsystemscope.com/textures/");
}
