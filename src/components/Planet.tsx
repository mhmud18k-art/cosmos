import { useEffect, useRef } from "react";
import {
  RING_BANDS,
  RING_GLOBE_R,
  TH,
  TW,
  buildTexture,
  flattenPoles,
  hexToRgb,
  type PlanetKind,
} from "@/lib/planet-texture";

/* ============================================================================
 * A planet rendered on a 2D canvas.
 *
 * Why not WebGL: this component appears eight times on the planets grid, and
 * browsers cap live WebGL contexts (commonly 8–16). Past the cap the oldest
 * contexts get killed and cards go blank. 2D canvas has no such limit.
 *
 * Why it stays cheap anyway: everything that depends only on geometry — which
 * pixels are inside the disc, each pixel's latitude/longitude, and how much
 * light it catches — is computed ONCE at mount into flat typed arrays. Per
 * frame the loop does one add, one texture lookup and one multiply per pixel,
 * which is why eight of these can run together without dropping frames.
 *
 * The surfaces come from src/lib/planet-texture.ts, where each body is built
 * from real data — real coastlines, real named features, real cloud-band
 * latitudes. Nothing is downloaded.
 * ==========================================================================*/

export type { PlanetKind };

type Props = {
  /**
   * Optional real photographic surface map, equirectangular, served from
   * /public. Nothing passes this today — the generated surfaces are built
   * from real data and need no files — but the path is kept so a genuine
   * NASA map can be dropped in later without touching the renderer.
   */
  texture?: string;
  /** Accent colour. Drives the atmospheric rim glow and the ring tint only. */
  color: string;
  kind: PlanetKind;
  /** Rendered diameter in CSS pixels. */
  size?: number;
  /** Axial tilt in degrees. Uranus at ~98 visibly rolls on its side. */
  tilt?: number;
  /** Seconds per full rotation. */
  spinSeconds?: number;
  /** Draws the ring system. Saturn only. */
  rings?: boolean;
  /** Retrograde rotation (Venus, Uranus). */
  retrograde?: boolean;
  className?: string;
};

export function Planet({
  texture,
  color,
  kind,
  size = 150,
  tilt = 12,
  spinSeconds = 28,
  rings = false,
  retrograde = false,
  className = "",
}: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const S = Math.round(size * dpr);
    canvas.width = S;
    canvas.height = S;

    const seed = Math.abs(
      [...kind].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7)
    );
    // `let`, because a real map may arrive after the first frame is already up.
    let tex = buildTexture(kind, seed);
    const [cr, cg, cb] = hexToRgb(color);

    /* ---- geometry, computed once -------------------------------------- */
    // Leave a margin so the atmospheric rim has somewhere to bloom — and a much
    // bigger one when there are rings, which reach past twice the globe's
    // radius.
    const R = S * (rings ? RING_GLOBE_R : 0.44);
    const cx = S / 2;
    const cy = S / 2;
    const N = S * S;

    const mask = new Uint8Array(N);
    const uBase = new Float32Array(N); // longitude at rotation 0, in [0,1)
    const vRow = new Int32Array(N); // texture row (latitude)
    const light = new Float32Array(N); // diffuse + ambient, premultiplied

    const t = (tilt * Math.PI) / 180;
    const cosT = Math.cos(t), sinT = Math.sin(t);

    // Light from the upper left, slightly toward the viewer.
    const LX = -0.52, LY = 0.42, LZ = 0.74;

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const i = y * S + x;
        const dx = (x - cx) / R;
        const dy = (y - cy) / R;
        const d2 = dx * dx + dy * dy;
        if (d2 > 1) continue;

        const nx = dx;
        const ny = -dy; // canvas y grows downward
        const nz = Math.sqrt(1 - d2);

        // Tilt the axis by rotating the normal about the screen-horizontal axis.
        const nyT = ny * cosT - nz * sinT;
        const nzT = ny * sinT + nz * cosT;

        const lat = Math.asin(Math.max(-1, Math.min(1, nyT))); // -π/2..π/2
        const lon = Math.atan2(nx, nzT); // -π..π

        mask[i] = 1;
        uBase[i] = lon / (Math.PI * 2) + 0.5;
        vRow[i] = Math.min(
          TH - 1,
          Math.max(0, Math.floor((0.5 - lat / Math.PI) * TH))
        );

        const diff = Math.max(0, nx * LX + ny * LY + nz * LZ);
        // Ambient keeps the night side readable instead of pure black, and the
        // soft shoulder on the terminator stops it from looking like a hard cut.
        light[i] = 0.1 + Math.pow(diff, 0.85) * 0.95;
      }
    }

    const img = ctx.createImageData(S, S);
    const data = img.data;
    for (let i = 0; i < N; i++) data[i * 4 + 3] = mask[i] ? 255 : 0;

    /* ---- rim glow sprite, drawn once per frame over the disc ----------- */
    const rim = document.createElement("canvas");
    rim.width = rim.height = S;
    {
      const rc = rim.getContext("2d")!;
      const g = rc.createRadialGradient(cx, cy, R * 0.86, cx, cy, R * 1.28);
      g.addColorStop(0, `rgba(${cr},${cg},${cb},0)`);
      g.addColorStop(0.32, `rgba(${cr},${cg},${cb},0.30)`);
      g.addColorStop(0.6, `rgba(${cr},${cg},${cb},0.10)`);
      g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
      rc.fillStyle = g;
      rc.fillRect(0, 0, S, S);
    }

    /* ---- rings --------------------------------------------------------- */
    function drawRings(front: boolean) {
      const rc = ctx!;
      rc.save();
      if (front) {
        // The near half must not paint over the globe, so clip the disc out.
        rc.beginPath();
        rc.rect(0, 0, S, S);
        rc.arc(cx, cy, R, 0, Math.PI * 2, true);
        rc.clip("evenodd");
      }
      rc.translate(cx, cy);
      rc.rotate(-t * 0.9);
      rc.scale(1, 0.26); // the viewing angle that makes rings read as rings
      for (const [r0, r1, alpha] of RING_BANDS) {
        const g = rc.createRadialGradient(0, 0, R * r0, 0, 0, R * r1);
        g.addColorStop(0, `rgba(${cr},${cg},${cb},0)`);
        g.addColorStop(0.5, `rgba(255,246,224,${alpha})`);
        g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        rc.beginPath();
        // Stroke on the MIDLINE between r0 and r1, not on r1. A stroke is drawn
        // centred on its path, so arcing at r1 put half the band outside the
        // gradient that was meant to colour it — which is why the rings first
        // came out thin and washed out.
        rc.arc(
          0,
          0,
          (R * (r0 + r1)) / 2,
          front ? 0 : Math.PI,
          front ? Math.PI : Math.PI * 2
        );
        rc.lineWidth = R * (r1 - r0);
        rc.strokeStyle = g;
        rc.stroke();
      }
      rc.restore();
    }

    /* ---- frame --------------------------------------------------------- */
    let raf = 0;
    let visible = true;
    let last = 0;

    function draw(rot: number) {
      const c = ctx!;
      c.clearRect(0, 0, S, S);
      if (rings) drawRings(false);

      for (let i = 0; i < N; i++) {
        if (!mask[i]) continue;
        let u = uBase[i] + rot;
        u -= Math.floor(u);
        const ti = (vRow[i] * TW + ((u * TW) | 0)) * 3;
        const l = light[i];
        const p = i * 4;
        data[p] = tex[ti] * l;
        data[p + 1] = tex[ti + 1] * l;
        data[p + 2] = tex[ti + 2] * l;
      }
      c.putImageData(img, 0, 0);

      c.globalCompositeOperation = "lighter";
      c.drawImage(rim, 0, 0);
      c.globalCompositeOperation = "source-over";

      if (rings) drawRings(true);
    }

    const dir = retrograde ? -1 : 1;
    let rot = 0;

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      if (!visible) {
        last = now;
        return;
      }
      // 30fps is plenty for a slow spin and halves the cost with eight running.
      if (now - last < 33) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      rot += (dir * dt) / spinSeconds;
      draw(rot);
    }

    draw(0);
    if (!reduced) raf = requestAnimationFrame(tick);

    /* ---- optional real photographic map --------------------------------- */
    let alive = true;
    if (texture) {
      const im = new Image();
      im.onload = () => {
        if (!alive) return;
        const off = document.createElement("canvas");
        off.width = TW;
        off.height = TH;
        const oc = off.getContext("2d", { willReadFrequently: true });
        if (!oc) return;
        oc.drawImage(im, 0, 0, TW, TH);
        const src = oc.getImageData(0, 0, TW, TH).data;
        const next = new Uint8ClampedArray(TW * TH * 3);
        for (let i = 0, j = 0; i < TW * TH; i++, j += 3) {
          next[j] = src[i * 4];
          next[j + 1] = src[i * 4 + 1];
          next[j + 2] = src[i * 4 + 2];
        }
        flattenPoles(next);
        tex = next;
        draw(rot);
      };
      // A missing file is not an error worth surfacing: the generated surface
      // is already on screen and stays.
      im.onerror = () => {};
      im.src = texture;
    }

    // Planets scrolled out of view stop costing anything.
    const io = new IntersectionObserver(
      (e) => {
        visible = e[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [texture, color, kind, size, tilt, spinSeconds, rings, retrograde]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ width: size, height: size, display: "block" }}
    />
  );
}
