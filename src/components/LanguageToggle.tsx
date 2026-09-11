import { useLang } from "@/i18n/LanguageProvider";
import { type Lang } from "@/i18n/strings";
import { cn } from "@/lib/utils";

/**
 * The AR / EN switch.
 *
 * Deliberately its own component rather than markup buried in the navbar, so
 * that redesigning the navbar cannot accidentally delete the only way to change
 * language — drop <LanguageToggle /> wherever it suits the new design.
 *
 * Accessibility notes:
 * · Two real buttons rather than one toggle, so the current language is stated
 *   rather than implied — `aria-pressed` marks which is active.
 * · The active option carries a filled background, not just brighter text:
 *   colour alone is never the sole indicator of state.
 * · 44px tall, matching the nav links, which is the minimum touch target.
 * · Each label is a language name in its own script, so a reader who cannot
 *   read the current interface can still find their way out.
 */
const OPTIONS: Array<{ value: Lang; short: string; full: string }> = [
  { value: "ar", short: "ع", full: "العربية" },
  { value: "en", short: "EN", full: "English" },
];

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useLang();

  return (
    <div
      role="group"
      aria-label={t("lang.label")}
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-hairline bg-surface/60 p-0.5",
        className
      )}
    >
      {OPTIONS.map((opt) => {
        const active = lang === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            lang={opt.value}
            aria-pressed={active}
            aria-label={opt.full}
            onClick={() => setLang(opt.value)}
            className={cn(
              "flex h-10 min-w-11 items-center justify-center rounded-full px-3 text-sm transition-colors duration-200",
              active
                ? "bg-surface-3 font-medium text-ink"
                : "text-ink-muted hover:text-ink"
            )}
          >
            {opt.short}
          </button>
        );
      })}
    </div>
  );
}
