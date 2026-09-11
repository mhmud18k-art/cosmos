import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Starfield } from "@/components/Starfield";
import { Planet as PlanetSphere } from "@/components/Planet";
import { useLang } from "@/i18n/LanguageProvider";
import { DATA_LABELS, PLANETS, RENDER, getPlanet, type Planet } from "@/data/planets";
import { NotFound } from "@/pages/NotFound";

export function PlanetDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, isRtl, t, pick, num, digits } = useLang();
  const planet = slug ? getPlanet(slug) : undefined;

  if (!planet) return <NotFound />;

  const render = RENDER[planet.slug];
  const index = PLANETS.findIndex((p) => p.slug === planet.slug);
  const prev = PLANETS[index - 1];
  const next = PLANETS[index + 1];
  const name = pick(planet.name);
  const other = lang === "ar" ? planet.name.en : planet.name.ar;

  function formatValue(key: keyof Planet["data"], value: unknown): string {
    if (key === "atmosphere" || key === "moonsAsOf") {
      return pick(value as { ar: string; en: string });
    }
    // Mass is stored as text because the exponent matters more than precision;
    // only its digits need localising.
    if (typeof value === "string") return digits(value);
    if (typeof value !== "number") return String(value);
    if (key === "rotationHours" && value < 0) {
      // A negative period means retrograde rotation. Saying so beats a minus
      // sign the reader has to decode.
      return t("detail.retrograde", { v: num(Math.abs(value)) });
    }
    return num(value);
  }

  return (
    <>
      <Starfield />

      <article className="px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/planets"
            className="mb-10 inline-flex h-11 items-center gap-2 text-sm text-ink-muted transition-colors duration-200 hover:text-ink"
          >
            <ArrowRight
              className={`h-4 w-4 ${isRtl ? "" : "rotate-180"}`}
              aria-hidden="true"
            />
            {t("detail.back")}
          </Link>

          {/* ── Header ─────────────────────────────────────────────────────
              The planet's own colour drives the glow here. It is decoration
              only — never the sole carrier of meaning.

              flex-row-reverse puts the globe at the end of the line in Arabic;
              in English the natural order already does that, so the reversal
              only applies in RTL.                                            */}
          <header
            className={`relative mb-14 flex flex-col gap-10 md:items-center md:gap-14 ${
              isRtl ? "md:flex-row-reverse" : "md:flex-row"
            }`}
          >
            {/* The globe leads on wide screens and drops below the copy on
                narrow ones, where a 300px sphere would push the heading off
                the first screen. */}
            <div className="relative shrink-0 self-center">
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-full opacity-30 blur-[70px]"
                style={{ backgroundColor: planet.color }}
              />
              <PlanetSphere
                color={planet.color}
                kind={render.kind}
                tilt={render.tilt}
                spinSeconds={render.spinSeconds}
                rings={render.rings}
                retrograde={render.retrograde}
                size={render.rings ? 340 : 280}
              />
            </div>

            <div className="relative min-w-0 flex-1">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    color: planet.color,
                    backgroundColor: `${planet.color}1f`,
                    boxShadow: `inset 0 0 0 1px ${planet.color}33`,
                  }}
                >
                  {pick(planet.type)}
                </span>
                <span className="tabular text-xs uppercase tracking-[0.2em] text-ink-muted">
                  {t("detail.order", { n: num(index + 1) })}
                </span>
              </div>

              <h1 className="text-glow font-display text-5xl font-light tracking-tight text-ink sm:text-6xl">
                {name}
              </h1>
              <p
                dir={lang === "ar" ? "ltr" : "rtl"}
                className={
                  lang === "ar"
                    ? "tabular mt-2 text-start text-sm uppercase tracking-[0.3em] text-ink-muted"
                    : "mt-2 text-start text-sm text-ink-muted"
                }
              >
                {other}
              </p>

              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-muted">
                {pick(planet.blurb)}
              </p>
            </div>
          </header>

          {/* ── Data table ─────────────────────────────────────────────── */}
          <section className="mb-14" aria-labelledby="data-heading">
            <h2
              id="data-heading"
              className="mb-5 font-display text-2xl font-light tracking-tight text-ink"
            >
              {t("detail.data")}
            </h2>

            <Table>
              <caption className="sr-only">
                {t("detail.tableSummary", { name })}
              </caption>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">{t("detail.colProperty")}</TableHead>
                  <TableHead scope="col">{t("detail.colValue")}</TableHead>
                  <TableHead scope="col">{t("detail.colUnit")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DATA_LABELS.map(({ key, label, unitKey }) => (
                  <TableRow key={key}>
                    <TableHead
                      scope="row"
                      className="font-normal normal-case tracking-normal text-ink-muted"
                    >
                      {pick(label)}
                    </TableHead>
                    <TableCell className="tabular text-ink">
                      {/* <bdi> isolates the value from the surrounding run.
                          Without it the bidi algorithm reorders "5.68 × 10²⁶"
                          into "10²⁶ × 5.68" — the digits are bidi-weak, so they
                          get pulled into the paragraph's right-to-left flow and
                          the notation comes out backwards. Caught on screenshot,
                          not in review: it looks correct in the source. */}
                      <bdi>{formatValue(key, planet.data[key])}</bdi>
                      {key === "moons" && (
                        <span className="mx-2 text-xs text-ink-muted">
                          ({t("detail.asOf", { date: pick(planet.data.moonsAsOf) })})
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-ink-muted">
                      {unitKey ? t(unitKey) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>{t("detail.tableSource")}</TableCaption>
            </Table>
          </section>

          {/* ── Facts ──────────────────────────────────────────────────── */}
          <section aria-labelledby="facts-heading">
            <h2
              id="facts-heading"
              className="mb-5 font-display text-2xl font-light tracking-tight text-ink"
            >
              {t("detail.facts")}
            </h2>

            <ul className="grid gap-4 sm:grid-cols-3">
              {planet.facts[lang].map((fact, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-hairline bg-surface/60 p-5 text-sm leading-relaxed text-ink-muted backdrop-blur-sm"
                >
                  <span
                    aria-hidden="true"
                    className="tabular mb-3 block text-xs"
                    style={{ color: planet.color }}
                  >
                    {num(i + 1).padStart(2, num(0))}
                  </span>
                  {fact}
                </li>
              ))}
            </ul>
          </section>

          {/* ── Prev / next ────────────────────────────────────────────── */}
          <nav
            aria-label={t("detail.nav")}
            className="mt-16 flex items-center justify-between gap-4 border-t border-hairline pt-8"
          >
            {prev ? (
              <Link
                to={`/planets/${prev.slug}`}
                className="flex h-11 min-w-0 items-center gap-2 text-sm text-ink-muted transition-colors duration-200 hover:text-ink"
              >
                <ArrowRight
                  className={`h-4 w-4 shrink-0 ${isRtl ? "" : "rotate-180"}`}
                  aria-hidden="true"
                />
                <span className="truncate">{pick(prev.name)}</span>
              </Link>
            ) : (
              <span />
            )}

            {next ? (
              <Link
                to={`/planets/${next.slug}`}
                className="flex h-11 min-w-0 items-center gap-2 text-sm text-ink-muted transition-colors duration-200 hover:text-ink"
              >
                <span className="truncate">{pick(next.name)}</span>
                <ArrowRight
                  className={`h-4 w-4 shrink-0 ${isRtl ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </article>
    </>
  );
}
