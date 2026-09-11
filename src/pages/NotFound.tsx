import { Link } from "react-router-dom";
import { Starfield } from "@/components/Starfield";
import { useLang } from "@/i18n/LanguageProvider";

export function NotFound() {
  const { t, num } = useLang();

  return (
    <>
      <Starfield />
      <div className="flex min-h-[70svh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="tabular text-6xl font-light text-violet-soft">{num(404)}</p>
          <h1 className="mt-6 font-display text-3xl font-light tracking-tight text-ink">
            {t("notFound.title")}
          </h1>
          <p className="mt-4 text-ink-muted">{t("notFound.body")}</p>
          <Link
            to="/"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-medium text-void transition-colors duration-200 hover:bg-white/90"
          >
            {t("notFound.back")}
          </Link>
        </div>
      </div>
    </>
  );
}
