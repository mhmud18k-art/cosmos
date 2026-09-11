/* ============================================================================
 * Planet surface generation.
 *
 * Every surface here is written in code from real astronomical data — real
 * coastlines, real named albedo features at their real coordinates, real
 * cloud-band latitudes. Nothing is downloaded, so nothing can fail to load,
 * and each body is built by its own function rather than by tinting one
 * generic "rocky/gas/ice" recipe. That is the whole point: Mercury is
 * cratered because Mercury is cratered, Venus is a smooth cloud deck because
 * that is what you actually see, and Uranus is bland because Uranus is bland.
 *
 * Shared by the React component (src/components/Planet.tsx) and by the
 * no-build preview page — preview.html embeds a transpiled copy of this file,
 * so the two can never drift apart.
 * ==========================================================================*/

export type PlanetKind =
  | "mercury"
  | "venus"
  | "earth"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

/** Equirectangular working size: longitude across, latitude down. */
export const TW = 512;
export const TH = 256;

type RGB = [number, number, number];

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

export function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  const f = h.length === 3 ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2] : h.slice(0, 6);
  const n = parseInt(f, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/* --- deterministic noise -------------------------------------------------- */

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/** Value noise on a grid that wraps in x, so the map's edges meet seamlessly. */
function makeNoise(w: number, h: number, seed: number) {
  const rnd = mulberry32(seed);
  const g = new Float32Array(w * h);
  for (let i = 0; i < g.length; i++) g[i] = rnd();
  return (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const sx = smooth(xf), sy = smooth(yf);
    const x0 = ((xi % w) + w) % w, x1 = (x0 + 1) % w;
    const y0 = Math.min(h - 1, Math.max(0, yi)), y1 = Math.min(h - 1, y0 + 1);
    const a = g[y0 * w + x0], b = g[y0 * w + x1];
    const c = g[y1 * w + x0], d = g[y1 * w + x1];
    return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
  };
}

/**
 * Fractal noise taking (u, v) in [0,1] — u is longitude, v is latitude. Every
 * octave wraps over exactly one full turn of longitude, so there is never a
 * seam at the date line. A wide, short grid (w >> h) stretches the result
 * along longitude, which is what makes gas-giant turbulence shear into belts
 * instead of looking like static.
 */
function makeFbm(w: number, h: number, seed: number, octaves: number) {
  const layers: Array<(x: number, y: number) => number> = [];
  for (let o = 0; o < octaves; o++) layers.push(makeNoise(w << o, h << o, seed + o * 7919));
  return (u: number, v: number) => {
    let sum = 0, amp = 1, tot = 0;
    for (let o = 0; o < octaves; o++) {
      sum += layers[o](u * (w << o), v * (h << o)) * amp;
      tot += amp;
      amp *= 0.5;
    }
    return sum / tot;
  };
}

/* --- feature placement ---------------------------------------------------- */

/**
 * Smooth falloff from 1 at (cLon, cLat) to 0 at the edge of an ellipse, in
 * degrees. This is how every named feature below is placed: give it the real
 * coordinates from the literature and it lands where it belongs.
 */
function feature(
  lonDeg: number, latDeg: number,
  cLon: number, cLat: number,
  lonR: number, latR: number
): number {
  let dLon = lonDeg - cLon;
  dLon = ((dLon + 540) % 360) - 180;
  const d = Math.sqrt((dLon / lonR) ** 2 + ((latDeg - cLat) / latR) ** 2);
  return d >= 1 ? 0 : smooth(1 - d);
}

/** Piecewise latitude→colour ramp, smoothstepped so belts blend like cloud. */
function bandColor(latDeg: number, stops: Array<[number, RGB]>, out: RGB) {
  if (latDeg <= stops[0][0]) {
    out[0] = stops[0][1][0]; out[1] = stops[0][1][1]; out[2] = stops[0][1][2];
    return;
  }
  for (let i = 1; i < stops.length; i++) {
    if (latDeg <= stops[i][0]) {
      const [l0, c0] = stops[i - 1];
      const [l1, c1] = stops[i];
      const s = smooth((latDeg - l0) / (l1 - l0));
      out[0] = mix(c0[0], c1[0], s);
      out[1] = mix(c0[1], c1[1], s);
      out[2] = mix(c0[2], c1[2], s);
      return;
    }
  }
  const last = stops[stops.length - 1][1];
  out[0] = last[0]; out[1] = last[1]; out[2] = last[2];
}

/**
 * Flattens each polar row toward its own average colour.
 *
 * Every equirectangular map crowds all 360° of longitude onto a handful of
 * pixels at the poles. Sampled onto a sphere that becomes a radial starburst.
 * Averaging the row kills the variation causing it while keeping the row's
 * real colour, so ice caps stay white and Jupiter's poles stay brown.
 */
export function flattenPoles(tex: Uint8ClampedArray) {
  for (let y = 0; y < TH; y++) {
    const lat = y / TH;
    const w = Math.min(1, Math.pow(Math.abs(lat - 0.5) * 2, 2.2) * 1.2);
    if (w <= 0.001) continue;
    let ar = 0, ag = 0, ab = 0;
    for (let x = 0; x < TW; x++) {
      const i = (y * TW + x) * 3;
      ar += tex[i]; ag += tex[i + 1]; ab += tex[i + 2];
    }
    ar /= TW; ag /= TW; ab /= TW;
    for (let x = 0; x < TW; x++) {
      const i = (y * TW + x) * 3;
      tex[i] = mix(tex[i], ar, w);
      tex[i + 1] = mix(tex[i + 1], ag, w);
      tex[i + 2] = mix(tex[i + 2], ab, w);
    }
  }
}

/* ==========================================================================
 * MERCURY — a battered grey world. Craters are the entire story.
 * ======================================================================== */

type Crater = { lon: number; lat: number; r: number; depth: number };

/** Craters spread evenly over the sphere, biased small like a real population. */
function craterField(seed: number, count: number): Crater[] {
  const rnd = mulberry32(seed);
  const out: Crater[] = [];
  for (let i = 0; i < count; i++) {
    // asin() of a uniform value gives equal area per crater, so they do not
    // bunch up at the poles the way a naive uniform latitude would.
    const lat = (Math.asin(rnd() * 2 - 1) * 180) / Math.PI;
    const lon = rnd() * 360 - 180;
    // Small craters vastly outnumber large ones on any real cratered surface,
    // and a crowd of small ones is what reads as "battered" — a handful of big
    // ones just reads as circles drawn on a ball.
    const r = 1.5 + Math.pow(rnd(), 2.8) * 12;
    out.push({ lon, lat, r, depth: 0.45 + rnd() * 0.55 });
  }
  return out;
}

/** Stamps bright rims and dark floors into a relief buffer. */
function stampCraters(relief: Float32Array, craters: Crater[]) {
  for (const c of craters) {
    const latR = c.r;
    // A crater keeps its angular size, but degrees of longitude get narrower
    // toward the poles, so its footprint on the map has to widen to match.
    const lonR = c.r / Math.max(0.16, Math.cos((c.lat * Math.PI) / 180));
    const y0 = Math.max(0, Math.floor(((90 - (c.lat + latR)) / 180) * TH));
    const y1 = Math.min(TH - 1, Math.ceil(((90 - (c.lat - latR)) / 180) * TH));
    for (let y = y0; y <= y1; y++) {
      const latDeg = 90 - ((y + 0.5) / TH) * 180;
      const dLat = (latDeg - c.lat) / latR;
      if (Math.abs(dLat) >= 1) continue;
      for (let x = 0; x < TW; x++) {
        const lonDeg = ((x + 0.5) / TW) * 360 - 180;
        let dLon = lonDeg - c.lon;
        dLon = ((dLon + 540) % 360) - 180;
        const d = Math.sqrt((dLon / lonR) ** 2 + dLat * dLat);
        if (d >= 1.05) continue;
        // A raised rim just inside the edge, a sunken floor in the middle —
        // both kept gentle. Pushed harder they stop looking like topography
        // and start looking like rings stencilled onto the surface.
        // Weighted heavily toward the sunken floor. A symmetric bright rim is
        // the thing that makes procedural craters read as stencilled rings —
        // real ones are read mostly as dark pits at this scale.
        const rim = Math.exp(-(((d - 0.82) / 0.22) ** 2));
        const floor = d < 0.74 ? 1 - (d / 0.74) ** 2 : 0;
        relief[y * TW + x] += rim * 0.08 * c.depth - floor * 0.34 * c.depth;
      }
    }
  }
}

function buildMercury(seed: number) {
  const tex = new Uint8ClampedArray(TW * TH * 3);
  const dust = makeFbm(18, 9, seed, 4);
  const relief = new Float32Array(TW * TH);
  stampCraters(relief, craterField(seed + 13, 300));

  for (let y = 0; y < TH; y++) {
    const v = (y + 0.5) / TH;
    const latDeg = 90 - v * 180;
    for (let x = 0; x < TW; x++) {
      const u = (x + 0.5) / TW;
      const lonDeg = u * 360 - 180;
      const i = (y * TW + x) * 3;

      let s = 0.54 + (dust(u, v) - 0.5) * 0.3;

      // Caloris Planitia, 30.5°N 189.8°E — 1,550 km across, one of the largest
      // impact basins in the solar system, and smoother and paler than the
      // cratered terrain it punched through.
      const caloris = feature(lonDeg, latDeg, -170.2, 30.5, 24, 20);
      s = mix(s, 0.74, caloris * 0.85);

      // Bright ray systems from two young craters: Kuiper (11.3°S, 31.2°W)
      // and Debussy (34.2°S, 12.6°E).
      s += feature(lonDeg, latDeg, -31.2, -11.3, 26, 22) * 0.12;
      s += feature(lonDeg, latDeg, 12.6, -34.2, 24, 20) * 0.1;

      // Craters fade inside Caloris, whose floor was resurfaced by lava.
      s += relief[y * TW + x] * (1 - caloris * 0.75);
      s = clamp01(s * 0.92 + 0.04) * 1.18;

      // Genuinely grey, with only a faint warm cast — Mercury is darker and
      // less colourful than the Moon.
      tex[i] = s * 172;
      tex[i + 1] = s * 164;
      tex[i + 2] = s * 154;
    }
  }
  flattenPoles(tex);
  return tex;
}

/* ==========================================================================
 * VENUS — no surface is visible at all, only the top of a 20 km cloud deck.
 * ======================================================================== */

function buildVenus(seed: number) {
  const tex = new Uint8ClampedArray(TW * TH * 3);
  const streaks = makeFbm(12, 5, seed, 4);
  const fine = makeFbm(26, 12, seed + 331, 3);

  for (let y = 0; y < TH; y++) {
    const v = (y + 0.5) / TH;
    const latDeg = 90 - v * 180;
    for (let x = 0; x < TW; x++) {
      const u = (x + 0.5) / TW;
      const i = (y * TW + x) * 3;

      // The atmosphere superrotates — it laps the planet in about four days,
      // sixty times faster than Venus itself turns — dragging cloud features
      // into long streaks that sweep back from the equator into the "Y".
      const shear = (latDeg / 90) * 0.22;
      let s = 0.9 + (streaks(u + shear, v) - 0.5) * 0.16 + (fine(u, v) - 0.5) * 0.05;

      // The polar collars are brighter and blander than the mid latitudes.
      s = mix(s, 1.0, Math.pow(Math.abs(latDeg) / 90, 2.4));
      s = Math.max(0.55, Math.min(1.12, s));

      // Sulphuric-acid cloud: cream, tipping to ochre. Almost no blue.
      tex[i] = s * 238;
      tex[i + 1] = s * 216;
      tex[i + 2] = s * 166;
    }
  }
  flattenPoles(tex);
  return tex;
}

/* ==========================================================================
 * EARTH — drawn from real coastlines.
 *
 * The outlines below are [longitude, latitude] in degrees, simplified by hand
 * from real coasts. At this resolution fine coastal detail would be thrown
 * away anyway, so they keep only the shape each continent is recognised by.
 * ======================================================================== */

const EARTH_LAND: Array<Array<[number, number]>> = [
  // North America, Central America included
  [
    [-165, 68], [-165, 58], [-158, 58], [-135, 58], [-130, 52], [-125, 48],
    [-124, 40], [-120, 34], [-117, 32], [-108, 23], [-105, 20], [-97, 18],
    [-92, 15], [-88, 14], [-83, 9], [-79, 8], [-77, 8], [-80, 22], [-81, 30],
    [-75, 35], [-70, 42], [-66, 44], [-60, 47], [-64, 50], [-56, 51],
    [-60, 58], [-70, 60], [-78, 63], [-85, 67], [-95, 69], [-110, 72],
    [-125, 70], [-140, 70], [-155, 71], [-165, 68],
  ],
  // Greenland
  [
    [-45, 60], [-42, 65], [-30, 70], [-22, 76], [-35, 82], [-55, 82],
    [-68, 76], [-60, 68], [-50, 62], [-45, 60],
  ],
  // South America
  [
    [-79, 8], [-77, 2], [-75, -3], [-70, -5], [-70, -15], [-70, -22],
    [-70, -30], [-71, -38], [-73, -45], [-75, -52], [-69, -55], [-65, -52],
    [-62, -42], [-58, -35], [-53, -34], [-48, -26], [-40, -14], [-35, -8],
    [-38, -5], [-45, -1], [-50, 0], [-55, 5], [-60, 8], [-65, 10], [-72, 11],
    [-79, 8],
  ],
  // Africa, with the Arabian Peninsula attached as it reads at this scale
  [
    [-17, 15], [-16, 21], [-10, 28], [-6, 33], [0, 37], [10, 37], [20, 33],
    [25, 32], [32, 31], [35, 32], [36, 27], [42, 17], [43, 12], [51, 12],
    [58, 22], [50, 25], [48, 12], [44, 11], [43, 2], [40, -3], [40, -10],
    [35, -20], [35, -26], [32, -29], [27, -33], [20, -34], [17, -32],
    [14, -22], [12, -17], [10, -6], [9, 3], [4, 6], [-3, 5], [-8, 5],
    [-12, 8], [-17, 15],
  ],
  // Europe
  [
    [-9, 43], [-9, 37], [-6, 36], [0, 38], [3, 43], [8, 44], [13, 46],
    [13, 42], [18, 40], [23, 37], [27, 37], [27, 41], [30, 46], [28, 50],
    [23, 54], [20, 54], [14, 54], [10, 54], [5, 51], [4, 51], [-2, 51],
    [-5, 49], [-9, 48], [-9, 43],
  ],
  // Asia — Turkey through Kamchatka, down through India and Indonesia
  [
    [27, 37], [35, 37], [35, 42], [40, 41], [48, 41], [55, 45], [60, 55],
    [55, 65], [60, 70], [75, 72], [90, 73], [105, 73], [125, 72], [140, 70],
    [160, 62], [170, 65], [178, 68], [180, 66], [170, 60], [158, 53],
    [140, 46], [130, 42], [122, 38], [121, 31], [122, 25], [110, 21],
    [108, 16], [102, 10], [100, 6], [104, 1], [110, -3], [116, -7], [120, -8],
    [130, -8], [140, -5], [141, 0], [130, 5], [120, 8], [110, 12], [98, 10],
    [92, 22], [88, 22], [80, 8], [77, 8], [73, 20], [68, 24], [62, 25],
    [58, 27], [55, 27], [50, 30], [48, 30], [45, 30], [40, 33], [35, 32],
    [27, 37],
  ],
  // Australia
  [
    [113, -22], [114, -26], [115, -34], [118, -35], [130, -32], [136, -35],
    [140, -38], [147, -38], [150, -37], [153, -28], [153, -20], [145, -17],
    [143, -11], [137, -12], [132, -12], [130, -14], [126, -14], [122, -18],
    [113, -22],
  ],
];

/** Bounding boxes, so most ocean pixels are rejected without any real work. */
const EARTH_BBOX = EARTH_LAND.map((poly) => {
  let x0 = 180, x1 = -180, y0 = 90, y1 = -90;
  for (const [lon, lat] of poly) {
    if (lon < x0) x0 = lon;
    if (lon > x1) x1 = lon;
    if (lat < y0) y0 = lat;
    if (lat > y1) y1 = lat;
  }
  return [x0, x1, y0, y1] as [number, number, number, number];
});

function pointInPolygon(lon: number, lat: number, poly: Array<[number, number]>) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

const ANTARCTIC_LAT = -63;

function isLand(lonDeg: number, latDeg: number) {
  if (latDeg < ANTARCTIC_LAT) return true;
  for (let p = 0; p < EARTH_LAND.length; p++) {
    const [x0, x1, y0, y1] = EARTH_BBOX[p];
    if (lonDeg < x0 || lonDeg > x1 || latDeg < y0 || latDeg > y1) continue;
    if (pointInPolygon(lonDeg, latDeg, EARTH_LAND[p])) return true;
  }
  return false;
}

function buildEarth(seed: number) {
  const tex = new Uint8ClampedArray(TW * TH * 3);
  const ground = makeFbm(40, 20, seed, 4);
  const sea = makeFbm(16, 8, seed + 411, 3);
  const cloud = makeFbm(14, 7, seed + 977, 4);

  for (let y = 0; y < TH; y++) {
    const v = (y + 0.5) / TH;
    const latDeg = 90 - v * 180;
    const absLat = Math.abs(latDeg);
    for (let x = 0; x < TW; x++) {
      const u = (x + 0.5) / TW;
      const lonDeg = u * 360 - 180;
      const i = (y * TW + x) * 3;
      const n = ground(u, v);

      let r: number, g: number, b: number;

      if (isLand(lonDeg, latDeg)) {
        if (absLat > 76) {
          // Ice sheet
          r = mix(226, 246, n); g = mix(233, 249, n); b = mix(238, 252, n);
        } else if (absLat > 58) {
          // Boreal forest and tundra
          r = mix(88, 122, n); g = mix(104, 132, n); b = mix(84, 102, n);
        } else if (absLat > 15 && absLat < 35) {
          // The arid belt — the Sahara, Arabia, the Kalahari, the Australian
          // interior all sit here, put there by the same descending air.
          r = mix(176, 214, n); g = mix(144, 180, n); b = mix(92, 122, n);
        } else {
          // Temperate and tropical vegetation
          r = mix(46, 92, n); g = mix(98, 146, n); b = mix(48, 74, n);
        }
      } else {
        // Ocean: deep basins are near-black blue, shelves much lighter.
        const depth = sea(u, v);
        r = mix(6, 30, depth); g = mix(42, 92, depth); b = mix(102, 158, depth);
        if (absLat > 68) {
          // Sea ice
          const ice = clamp01((absLat - 68) / 12);
          r = mix(r, 232, ice); g = mix(g, 240, ice); b = mix(b, 246, ice);
        }
      }

      // Cloud, banded the way the real circulation bands it: heavy at the
      // equator where air rises, thin over the subtropical deserts where it
      // sinks, heavy again along the mid-latitude storm tracks.
      const belt =
        1.05 * Math.exp(-((latDeg / 11) ** 2)) +
        0.85 * Math.exp(-(((absLat - 58) / 15) ** 2)) +
        0.3;
      const c = clamp01((cloud(u, v) - 0.52) * 3.4) * clamp01(belt);
      if (c > 0) {
        const a = smooth(clamp01(c)) * 0.88;
        r = mix(r, 250, a); g = mix(g, 252, a); b = mix(b, 255, a);
      }

      tex[i] = r; tex[i + 1] = g; tex[i + 2] = b;
    }
  }
  flattenPoles(tex);
  return tex;
}

/* ==========================================================================
 * MARS — real named features at their real areographic coordinates.
 * ======================================================================== */

/** lon, lat, lonRadius, latRadius, strength — the classic dark albedo areas. */
const MARS_DARK: Array<[number, number, number, number, number]> = [
  [70, 8, 18, 16, 1.0],      // Syrtis Major Planum
  [-30, 45, 46, 18, 0.6],    // Acidalia Planitia
  [110, 45, 42, 17, 0.55],   // Utopia Planitia
  [-90, -26, 22, 11, 0.5],   // Solis Lacus, the "eye of Mars"
  [-40, -22, 30, 12, 0.45],  // Mare Erythraeum
  [160, -22, 32, 15, 0.5],   // Mare Cimmerium
  [-150, -18, 30, 14, 0.45], // Mare Sirenum
  [-60, 18, 16, 10, 0.3],    // Lunae Planum
];

function buildMars(seed: number) {
  const tex = new Uint8ClampedArray(TW * TH * 3);
  const dust = makeFbm(22, 11, seed, 4);

  for (let y = 0; y < TH; y++) {
    const v = (y + 0.5) / TH;
    const latDeg = 90 - v * 180;
    for (let x = 0; x < TW; x++) {
      const u = (x + 0.5) / TW;
      const lonDeg = u * 360 - 180;
      const i = (y * TW + x) * 3;
      const n = dust(u, v);

      // Base: iron-oxide dust. Butterscotch and ochre — Mars photographs far
      // browner than the "red planet" name suggests.
      let r = mix(158, 202, n);
      let g = mix(102, 142, n);
      let b = mix(72, 102, n);

      // Bright, dust-mantled highlands.
      let bright = 0;
      bright = Math.max(bright, feature(lonDeg, latDeg, 70, -42, 22, 15) * 0.95); // Hellas Planitia
      bright = Math.max(bright, feature(lonDeg, latDeg, 0, 22, 36, 21) * 0.6);    // Arabia Terra
      bright = Math.max(bright, feature(lonDeg, latDeg, -105, 2, 35, 23) * 0.65); // Tharsis rise
      bright = Math.max(bright, feature(lonDeg, latDeg, 150, 25, 27, 17) * 0.45); // Elysium Planitia
      r = mix(r, 228, bright * 0.6); g = mix(g, 158, bright * 0.6); b = mix(b, 112, bright * 0.6);

      // Dark basaltic sand. Grey-brown, never black — these are the markings
      // that first let astronomers time Mars's rotation.
      let dark = 0;
      for (let k = 0; k < MARS_DARK.length; k++) {
        const f = MARS_DARK[k];
        const d = feature(lonDeg, latDeg, f[0], f[1], f[2], f[3]) * f[4];
        if (d > dark) dark = d;
      }
      r = mix(r, 84, dark * 0.95); g = mix(g, 62, dark * 0.95); b = mix(b, 52, dark * 0.95);

      // Valles Marineris — 4,000 km of canyon centred near 8°S, 65°W. It is a
      // shadowed gash, so it darkens whatever it crosses rather than tinting.
      const vm = feature(lonDeg, latDeg, -63, -9, 46, 4.2);
      r *= 1 - vm * 0.45; g *= 1 - vm * 0.45; b *= 1 - vm * 0.45;

      // Olympus Mons, 18.6°N 133.8°W: the tallest volcano in the solar system,
      // a pale shield with a dark summit caldera.
      const om = feature(lonDeg, latDeg, -134, 18.6, 8, 7);
      r = mix(r, 234, om * 0.7); g = mix(g, 176, om * 0.7); b = mix(b, 134, om * 0.7);
      const caldera = feature(lonDeg, latDeg, -134, 18.6, 2.4, 2.1);
      r *= 1 - caldera * 0.34; g *= 1 - caldera * 0.34; b *= 1 - caldera * 0.34;

      // Polar caps of water and carbon-dioxide ice. The southern cap is the
      // bigger of the two and reaches further toward the equator.
      const north = clamp01((latDeg - 78) / 10);
      const south = clamp01((-latDeg - 72) / 15);
      const ice = smooth(clamp01(Math.max(north, south) * 1.25));
      r = mix(r, 244, ice); g = mix(g, 247, ice); b = mix(b, 250, ice);

      tex[i] = r; tex[i + 1] = g; tex[i + 2] = b;
    }
  }
  flattenPoles(tex);
  return tex;
}

/* ==========================================================================
 * THE GIANTS — banded by latitude, using the real belt and zone structure.
 *
 * On Jupiter the pale stripes are "zones" (rising, cooler, higher cloud) and
 * the dark ones are "belts" (sinking, warmer, deeper cloud). The latitudes
 * below are the real ones, which is why the pattern is not symmetric.
 * ======================================================================== */

const JUPITER_BANDS: Array<[number, RGB]> = [
  [-90, [116, 102, 92]],
  [-72, [142, 124, 106]],
  [-58, [186, 166, 138]],
  [-47, [214, 196, 166]],  // South temperate zone
  [-38, [148, 106, 78]],   // South temperate belt
  [-30, [226, 208, 174]],  // South tropical zone
  [-20, [180, 110, 74]],   // South equatorial belt, southern component
  [-12, [166, 94, 62]],    // South equatorial belt
  [-7, [234, 216, 178]],
  [0, [240, 226, 192]],    // Equatorial zone
  [6, [230, 210, 170]],
  [11, [174, 98, 62]],     // North equatorial belt — the darkest, widest belt
  [17, [158, 86, 54]],
  [23, [228, 208, 172]],   // North tropical zone
  [31, [150, 108, 80]],    // North temperate belt
  [39, [212, 192, 162]],
  [49, [168, 148, 124]],
  [62, [142, 126, 108]],
  [90, [112, 100, 88]],
];

const SATURN_BANDS: Array<[number, RGB]> = [
  [-90, [146, 124, 92]],
  [-70, [176, 152, 112]],
  [-55, [204, 180, 136]],
  [-40, [222, 200, 154]],
  [-25, [232, 212, 168]],
  [-12, [238, 220, 178]],
  [0, [243, 227, 185]],
  [12, [237, 219, 175]],
  [25, [229, 209, 163]],
  [40, [217, 195, 149]],
  [55, [197, 173, 128]],
  [70, [170, 146, 108]],
  [90, [140, 120, 92]],
];

const URANUS_BANDS: Array<[number, RGB]> = [
  [-90, [156, 208, 208]],
  [-60, [164, 214, 213]],
  [-30, [172, 221, 220]],
  [0, [178, 226, 224]],
  [30, [174, 223, 221]],
  [60, [170, 219, 217]],
  [90, [190, 232, 229]],  // the bright polar hood
];

const NEPTUNE_BANDS: Array<[number, RGB]> = [
  [-90, [48, 84, 146]],
  [-60, [56, 96, 166]],
  [-40, [63, 107, 181]],
  [-20, [70, 118, 196]],
  [0, [77, 128, 206]],
  [20, [70, 116, 194]],
  [40, [61, 103, 177]],
  [60, [54, 92, 162]],
  [90, [46, 82, 142]],
];

function buildJupiter(seed: number) {
  const tex = new Uint8ClampedArray(TW * TH * 3);
  const warpN = makeFbm(5, 3, seed, 3);
  const turbN = makeFbm(26, 9, seed + 701, 4);
  const rgb: RGB = [0, 0, 0];

  for (let y = 0; y < TH; y++) {
    const v = (y + 0.5) / TH;
    const latDeg = 90 - v * 180;
    for (let x = 0; x < TW; x++) {
      const u = (x + 0.5) / TW;
      const lonDeg = u * 360 - 180;
      const i = (y * TW + x) * 3;

      // Belts meander rather than running straight, so displace the latitude
      // that is looked up instead of the colour that comes out.
      const latW = latDeg + (warpN(u, v) - 0.5) * 9;
      bandColor(latW, JUPITER_BANDS, rgb);
      let [r, g, b] = rgb;

      const t = (turbN(u, v) - 0.5) * 0.2;
      r *= 1 + t; g *= 1 + t; b *= 1 + t;

      // The Great Red Spot: a storm wider than Earth, tracked continuously
      // since the 1800s, anchored at about 22°S.
      // The pale hollow the storm carves out of the belt around it. Drawn
      // first, so the spot itself lands inside it — that bright surround is
      // most of what makes the GRS stand out in a real photograph.
      const hollow = feature(lonDeg, latDeg, -25, -22, 36, 16);
      if (hollow > 0) {
        r = mix(r, 240, hollow * 0.72); g = mix(g, 226, hollow * 0.72); b = mix(b, 196, hollow * 0.72);
      }
      const grs = feature(lonDeg, latDeg, -25, -22, 25, 10.5);
      if (grs > 0) {
        const a = smooth(clamp01(grs * 1.35));
        r = mix(r, 196, a); g = mix(g, 84, a); b = mix(b, 58, a);
      }

      // White ovals in the south temperate belt — long-lived anticyclones.
      let oval = 0;
      oval = Math.max(oval, feature(lonDeg, latDeg, 95, -41, 9, 4.5));
      oval = Math.max(oval, feature(lonDeg, latDeg, 130, -41, 7, 3.8));
      oval = Math.max(oval, feature(lonDeg, latDeg, -100, -35, 8, 4));
      if (oval > 0) {
        r = mix(r, 244, oval * 0.75); g = mix(g, 236, oval * 0.75); b = mix(b, 214, oval * 0.75);
      }

      tex[i] = r; tex[i + 1] = g; tex[i + 2] = b;
    }
  }
  flattenPoles(tex);
  return tex;
}

function buildSaturn(seed: number) {
  const tex = new Uint8ClampedArray(TW * TH * 3);
  const warpN = makeFbm(4, 3, seed, 3);
  const turbN = makeFbm(20, 8, seed + 617, 4);
  const rgb: RGB = [0, 0, 0];

  for (let y = 0; y < TH; y++) {
    const v = (y + 0.5) / TH;
    const latDeg = 90 - v * 180;
    for (let x = 0; x < TW; x++) {
      const u = (x + 0.5) / TW;
      const i = (y * TW + x) * 3;

      // Saturn's bands are far softer than Jupiter's — a deep haze layer sits
      // above the cloud tops and mutes almost all of the contrast.
      const latW = latDeg + (warpN(u, v) - 0.5) * 5;
      bandColor(latW, SATURN_BANDS, rgb);
      let [r, g, b] = rgb;

      const t = (turbN(u, v) - 0.5) * 0.075;
      r *= 1 + t; g *= 1 + t; b *= 1 + t;

      tex[i] = r; tex[i + 1] = g; tex[i + 2] = b;
    }
  }
  flattenPoles(tex);
  return tex;
}

function buildUranus(seed: number) {
  const tex = new Uint8ClampedArray(TW * TH * 3);
  const turbN = makeFbm(14, 6, seed, 3);
  const rgb: RGB = [0, 0, 0];

  for (let y = 0; y < TH; y++) {
    const v = (y + 0.5) / TH;
    const latDeg = 90 - v * 180;
    for (let x = 0; x < TW; x++) {
      const u = (x + 0.5) / TW;
      const i = (y * TW + x) * 3;

      bandColor(latDeg, URANUS_BANDS, rgb);
      let [r, g, b] = rgb;

      // Voyager 2 flew past and found almost nothing to photograph. Keeping it
      // nearly featureless is the accurate choice, not a shortcut.
      const t = (turbN(u, v) - 0.5) * 0.035;
      r *= 1 + t; g *= 1 + t; b *= 1 + t;

      tex[i] = r; tex[i + 1] = g; tex[i + 2] = b;
    }
  }
  flattenPoles(tex);
  return tex;
}

function buildNeptune(seed: number) {
  const tex = new Uint8ClampedArray(TW * TH * 3);
  const warpN = makeFbm(5, 3, seed, 3);
  const turbN = makeFbm(18, 7, seed + 233, 4);
  const cirrus = makeFbm(22, 8, seed + 881, 3);
  const rgb: RGB = [0, 0, 0];

  for (let y = 0; y < TH; y++) {
    const v = (y + 0.5) / TH;
    const latDeg = 90 - v * 180;
    for (let x = 0; x < TW; x++) {
      const u = (x + 0.5) / TW;
      const lonDeg = u * 360 - 180;
      const i = (y * TW + x) * 3;

      const latW = latDeg + (warpN(u, v) - 0.5) * 6;
      bandColor(latW, NEPTUNE_BANDS, rgb);
      let [r, g, b] = rgb;

      const t = (turbN(u, v) - 0.5) * 0.11;
      r *= 1 + t; g *= 1 + t; b *= 1 + t;

      // The Great Dark Spot Voyager 2 saw at 22°S in 1989 — a storm the size
      // of Eurasia, and a hole in the methane deck rather than a cloud.
      const gds = feature(lonDeg, latDeg, -30, -22, 24, 10);
      const ga = smooth(clamp01(gds * 1.2));
      r = mix(r, 24, ga * 0.9); g = mix(g, 46, ga * 0.9); b = mix(b, 100, ga * 0.9);

      // Bright methane-ice cirrus, including the companion clouds that trailed
      // the dark spot along its southern edge.
      let bright = clamp01((cirrus(u, v) - 0.68) * 4) * 0.34;
      bright = Math.max(bright, feature(lonDeg, latDeg, -30, -33, 16, 4.5) * 0.6);
      bright = Math.max(bright, feature(lonDeg, latDeg, 60, -42, 20, 5.5) * 0.42);
      if (bright > 0) {
        r = mix(r, 226, bright); g = mix(g, 238, bright); b = mix(b, 250, bright);
      }

      tex[i] = r; tex[i + 1] = g; tex[i + 2] = b;
    }
  }
  flattenPoles(tex);
  return tex;
}

/* ==========================================================================
 * Saturn's rings — real radii, in units of Saturn's own radius.
 *
 * The gap between the B and A rings is the Cassini Division, 4,800 km wide
 * and visible in a small telescope, so it is left empty here rather than
 * shaded: it is the feature that makes the rings read as rings.
 * ======================================================================== */

/** [inner radius, outer radius, opacity] */
export const RING_BANDS: Array<[number, number, number]> = [
  [1.24, 1.52, 0.2],   // C ring — thin and translucent
  [1.53, 1.95, 0.88],  // B ring — the bright one
  [2.03, 2.21, 0.58],  // A ring, inside the Encke Gap
  [2.23, 2.27, 0.42],  // A ring, outside it
];

/** Globe radius as a fraction of the canvas when rings have to fit as well. */
export const RING_GLOBE_R = 0.205;

/* --- dispatch ------------------------------------------------------------- */

export function buildTexture(kind: PlanetKind, seed: number): Uint8ClampedArray {
  switch (kind) {
    case "mercury": return buildMercury(seed);
    case "venus": return buildVenus(seed);
    case "earth": return buildEarth(seed);
    case "mars": return buildMars(seed);
    case "jupiter": return buildJupiter(seed);
    case "saturn": return buildSaturn(seed);
    case "uranus": return buildUranus(seed);
    case "neptune": return buildNeptune(seed);
  }
}
