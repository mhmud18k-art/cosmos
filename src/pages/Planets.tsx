import { PlanetCard } from "@/components/PlanetCard";
import { Starfield } from "@/components/Starfield";
import { useLang } from "@/i18n/LanguageProvider";
import { PLANETS } from "@/data/planets";

export function Planets() {
  const { t, num } = useLang();

  return (
    <>
      <Starfield />

      <div className="nebula px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <header className="mb-14 max-w-2xl">
            <p className="tabular mb-4 text-xs uppercase tracking-[0.25em] text-celeste">
              {num(8)} {t("home.eyebrow")}
            </p>
            <h1 className="text-glow font-display text-4xl font-light tracking-tight text-ink sm:text-5xl">
              {t("planets.title")}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">
              {t("planets.lede")}
            </p>
          </header>

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {PLANETS.map((planet) => (
              <li key={planet.slug}>
                <PlanetCard planet={planet} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
