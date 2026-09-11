import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
} from "@/components/ui/glowing-background-stars-card";
import { Planet as PlanetSphere } from "@/components/Planet";
import { useLang } from "@/i18n/LanguageProvider";
import { RENDER, type Planet } from "@/data/planets";

/**
 * Wraps the 21st.dev Glowing Stars card (Aceternity) without editing the vendor
 * file, so it stays updatable: the theme is applied entirely through className
 * overrides and the surrounding markup.
 *
 * Two accessibility notes on top of what the vendor component ships:
 *
 * 1. The vendor card animates its stars on `mouseEnter` only. Hover-only
 *    feedback leaves keyboard users with nothing, so the wrapper adds an
 *    equivalent glow on `:focus-within` in CSS. The stars still need a pointer,
 *    but the card visibly responds to Tab either way.
 * 2. The whole card is one link rather than a card with a link inside it, so
 *    there is a single tab stop per planet and the target is far larger than
 *    the 44×44px minimum.
 */
export function PlanetCard({ planet }: { planet: Planet }) {
  const { lang, isRtl, t, pick, num } = useLang();
  const render = RENDER[planet.slug];

  // The name in the *other* language, shown as the secondary line. It always
  // needs its own direction: an Arabic name inside an English page (or the
  // reverse) is a bidi island, and without dir it inherits the wrong one.
  const other = lang === "ar" ? planet.name.en : planet.name.ar;

  return (
    <Link
      to={`/planets/${planet.slug}`}
      aria-label={t("card.aria", { name: pick(planet.name) })}
      className="group block rounded-xl outline-none transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 focus-visible:-translate-y-1 motion-reduce:transform-none"
    >
      <GlowingStarsBackgroundCard className="relative h-full max-h-none max-w-none border-hairline bg-[linear-gradient(160deg,#0c0e1a_0%,#141830_100%)] transition-shadow duration-300 group-hover:glow-violet group-focus-visible:glow-celeste">
        {/* The planet sits ON the vendor card's star grid rather than replacing
            it, so the stars become a backdrop and the vendor file stays
            untouched. These insets mirror the card's own p-4 and the
            illustration's h-48, which is what keeps it centred without
            hard-coded pixel offsets. */}
        <div className="pointer-events-none absolute inset-x-0 top-4 flex h-48 items-center justify-center">
          <PlanetSphere
            color={planet.color}
            kind={render.kind}
            tilt={render.tilt}
            spinSeconds={render.spinSeconds}
            rings={render.rings}
            retrograde={render.retrograde}
            /* Saturn gets a bigger canvas, not a bigger globe: the rings reach
               past twice the planet radius and need the extra frame to fit. */
            size={render.rings ? 200 : 150}
            className="drop-shadow-[0_0_28px_rgba(0,0,0,0.6)]"
          />
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <GlowingStarsTitle className="font-display text-2xl text-ink">
              {pick(planet.name)}
            </GlowingStarsTitle>
            <p
              dir={lang === "ar" ? "ltr" : "rtl"}
              className={
                lang === "ar"
                  ? "tabular mt-0.5 text-xs uppercase tracking-widest text-ink-muted"
                  : "mt-0.5 text-xs text-ink-muted"
              }
            >
              {other}
            </p>
          </div>

          <span
            className="mt-1 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium"
            style={{
              color: planet.color,
              backgroundColor: `${planet.color}1f`,
              boxShadow: `inset 0 0 0 1px ${planet.color}33`,
            }}
          >
            {pick(planet.type)}
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-4">
          <GlowingStarsDescription className="max-w-none text-sm leading-relaxed text-ink-muted">
            {pick(planet.tagline)}
          </GlowingStarsDescription>

          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] transition-colors duration-300 group-hover:bg-white/[0.14]"
          >
            {/* SVG icon, never an emoji. The arrow points toward the start of
                the line, which is the opposite side in each direction. */}
            <ArrowLeft
              className={`h-4 w-4 text-ink ${isRtl ? "" : "rotate-180"}`}
              strokeWidth={2}
            />
          </span>
        </div>

        {/* Label above value rather than beside it. Side by side, a wide value
            like "142,984 km" outgrew its half of the grid and printed straight
            over the next column — the number and its unit must not break apart,
            so the row cannot absorb the overflow by wrapping. Stacking gives
            each value the full column width in either language.
            min-w-0 + truncate are the belt and braces: a grid column will not
            shrink below its content otherwise. */}
        <dl className="tabular mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-hairline pt-3 text-xs">
          <div className="min-w-0">
            <dt className="text-ink-muted">{t("card.diameter")}</dt>
            <dd className="mt-1 truncate text-ink">
              {num(planet.data.diameterKm)} {t("unit.km")}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-ink-muted">{t("card.moons")}</dt>
            <dd className="mt-1 truncate text-ink">{num(planet.data.moons)}</dd>
          </div>
        </dl>
      </GlowingStarsBackgroundCard>
    </Link>
  );
}
