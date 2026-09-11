import { useEffect, useRef } from "react";

/**
 * A quiet star field for the pages that are not the hero.
 *
 * Deliberately much cheaper than the orbital hero: static stars, one slow
 * twinkle pass, no per-frame maths. It sits behind content at low opacity, so
 * it reads as texture rather than as something competing for attention.
 *
 * Honours prefers-reduced-motion by drawing one frame and stopping — the stars
 * are still there, they just stop breathing.
 */
export function Starfield({ density = 0.00012 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let stars: Array<{ x: number; y: number; r: number; a: number; p: number }> = [];
    let w = 0;
    let h = 0;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(w * h * density);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.25,
        a: Math.random() * 0.5 + 0.25,
        p: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const twinkle = reduced ? 1 : 0.75 + 0.25 * Math.sin(t * 0.0009 + s.p);
        ctx.globalAlpha = s.a * twinkle;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    build();
    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const ro = new ResizeObserver(() => {
      build();
      if (reduced) draw(0);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-70"
    />
  );
}
