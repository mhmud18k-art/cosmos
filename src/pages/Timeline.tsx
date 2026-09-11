import { Starfield } from "@/components/Starfield";
import { useLang } from "@/i18n/LanguageProvider";
import { ERAS } from "@/data/timeline";

/* ============================================================================
 * ⚠️  PLACEHOLDER — this one is yours to design.
 *
 * The content is done: `src/data/timeline.ts` holds all 12 eras, sourced and
 * written. What is deliberately missing is the *timeline* — the beam, the
 * scroll-linked reveal, the sticky era heading. Right now this is an ordered
 * list with a hairline down one side, which is honest about being unstyled
 * rather than pretending to be finished.
 *
 * Two notes for when you build it:
 *
 * · Whatever you animate, gate it behind prefers-reduced-motion. index.css
 *   already neutralises CSS transitions, but a JS/GSAP scroll driver has to
 *   check `matchMedia('(prefers-reduced-motion: reduce)')` itself and render
 *   the final state immediately.
 * · Keep the <ol>. A timeline is an ordered list, and screen readers announce
 *   position and length from it for free.
 *
 * The GSAP preset ui-ux-pro-max suggests for this tier:
 *   gsap.from('.era', { opacity: 0, y: 16, duration: 0.4,
 *                       stagger: { each: 0.06 }, ease: 'back.out(1.4)' })
 * ==========================================================================*/

export function Timeline() {
  const { lang, t, pick } = useLang();

  return (
    <>
      <Starfield />

      <div className="nebula px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <header className="mb-16 max-w-2xl">
            <p className="tabular mb-4 text-xs uppercase tracking-[0.25em] text-celeste">
              {lang === "ar" ? "١٣.٨ مليار سنة" : "13.8 billion years"}
            </p>
            <h1 className="text-glow font-display text-4xl font-light tracking-tight text-ink sm:text-5xl">
              {t("timeline.title")}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              {t("timeline.lede")}
            </p>
          </header>

          <ol className="relative border-s border-hairline ps-8">
            {ERAS.map((era) => (
              <li key={era.id} className="era relative pb-14 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute -start-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: era.color,
                    boxShadow: `0 0 12px ${era.color}`,
                  }}
                />

                <div className="tabular mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs">
                  {/* <bdi> so a value like "10⁻⁴³ seconds" is not reordered by
                      the surrounding Arabic run. */}
                  <span style={{ color: era.color }}>
                    <bdi>{pick(era.tMinus)}</bdi>
                  </span>
                  <span className="text-ink-muted">
                    {lang === "ar" ? "قبل " : ""}
                    <bdi>{pick(era.yearsAgo)}</bdi>
                    {lang === "en" ? " ago" : ""}
                  </span>
                  {era.theoretical && (
                    /* Not colour-only: the word says it too. */
                    <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-ink-muted">
                      {t("timeline.theoretical")}
                    </span>
                  )}
                </div>

                <h2 className="font-display text-2xl font-light tracking-tight text-ink">
                  {pick(era.title)}
                </h2>
                <p className="mt-3 leading-relaxed text-ink-muted">
                  {pick(era.body)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
