import { Link } from "react-router-dom";
import { OrbitalHeroSection } from "@/components/ui/orbital-hero-section";
import { PlanetCard } from "@/components/PlanetCard";
import { useLang } from "@/i18n/LanguageProvider";
import { PLANETS } from "@/data/planets";

/** Four picked for contrast rather than order: rocky, giant, ringed, tilted. */
const FEATURED = ["earth", "jupiter", "saturn", "uranus"];

export function Home() {
  const { t, isRtl } = useLang();
  const featured = FEATURED.map((slug) => PLANETS.find((p) => p.slug === slug)!);

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────
          21st.dev · "Orbital Hero Section" by @yura.
          The Sun drifts through the star field and each planet trails a helix
          behind it, integrated from real J2000 orbital elements.

          The copy sits at the start of the line, which is the right in Arabic
          and the left in English — so the art has to be pushed the other way
          and the scrim has to darken the side the text landed on. Getting this
          backwards is what put the headline on top of the Sun the first time. */}
      <section className="relative min-h-[92svh] w-full md:min-h-[720px]">
        <OrbitalHeroSection
          focus={isRtl ? [0.28, 0.45] : [0.72, 0.45]}
          scrim={isRtl ? "right" : "left"}
          scrimStrength={0.92}
          viewRadius={3.2}
          showOrbits
        >
          <div className="flex h-full min-h-[92svh] items-center px-6 sm:px-10 md:min-h-[720px] lg:px-20">
            <div className="max-w-[36rem]">
              <p className="tabular mb-5 text-xs uppercase tracking-[0.25em] text-celeste">
                {t("home.eyebrow")}
              </p>

              <h1 className="text-glow font-display text-[2.5rem] font-light leading-[1.1] tracking-tight text-ink sm:text-6xl lg:text-[4rem]">
                {t("home.title1")}
                <br />
                {t("home.title2")}
              </h1>

              <p className="mt-6 max-w-md text-base leading-relaxed text-ink-muted">
                {t("home.lede")}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  to="/planets"
                  className="flex h-12 items-center rounded-full bg-ink px-7 text-sm font-medium text-void transition-colors duration-200 hover:bg-white/90"
                >
                  {t("home.ctaPlanets")}
                </Link>
                <Link
                  to="/timeline"
                  className="flex h-12 items-center rounded-full border border-hairline-strong px-7 text-sm text-ink transition-colors duration-200 hover:border-violet-soft hover:text-violet-soft"
                >
                  {t("home.ctaTimeline")}
                </Link>
              </div>
            </div>
          </div>
        </OrbitalHeroSection>
      </section>

      {/* ── Featured planets ─────────────────────────────────────────────── */}
      <section className="nebula px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-light tracking-tight text-ink sm:text-4xl">
                {t("home.featured")}
              </h2>
              <p className="mt-3 max-w-lg text-ink-muted">{t("home.featuredLede")}</p>
            </div>

            <Link
              to="/planets"
              className="flex h-11 items-center text-sm text-celeste underline decoration-celeste/40 underline-offset-8 transition-colors duration-200 hover:decoration-celeste"
            >
              {t("home.viewAll")}
            </Link>
          </div>

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((planet) => (
              <li key={planet.slug}>
                <PlanetCard planet={planet} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
