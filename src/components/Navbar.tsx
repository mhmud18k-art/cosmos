import { NavLink } from "react-router-dom";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLang } from "@/i18n/LanguageProvider";
import { type UIKey } from "@/i18n/strings";
import { cn } from "@/lib/utils";

/* ============================================================================
 * ⚠️  PLACEHOLDER — this one is yours to design.
 *
 * You asked to build the navbar yourself, so this is deliberately plain: it
 * routes correctly and it is keyboard-accessible, and that is all. Replace the
 * markup freely; the only things worth keeping when you do are marked KEEP
 * below, because losing them breaks something rather than just looks.
 *
 * Design tokens available to you: bg-void / bg-surface / bg-surface-2,
 * text-ink / text-ink-muted, border-hairline, .glow-violet, .glow-celeste,
 * .nebula, .text-glow. See src/index.css.
 *
 * Note on direction: nothing here hard-codes left or right. The layout follows
 * the document direction, which the language switch flips — so do not reach for
 * ml-/mr-/left-/right- when you redesign it. Use ms-/me-/start-/end-, which
 * mirror automatically, or Arabic will come out inside-out.
 * ==========================================================================*/

const LINKS: Array<{ to: string; key: UIKey; end: boolean }> = [
  { to: "/", key: "nav.home", end: true },
  { to: "/planets", key: "nav.planets", end: false },
  { to: "/timeline", key: "nav.timeline", end: false },
];

export function Navbar() {
  const { t } = useLang();

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-void/70 backdrop-blur-xl">
      {/* KEEP: lets keyboard users jump past the nav straight to content.
          focus:start-4 rather than focus:right-4 so it lands on the correct
          side in both languages. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-4 focus:z-50 focus:rounded-lg focus:bg-surface-2 focus:px-4 focus:py-2 focus:text-ink"
      >
        {t("nav.skip")}
      </a>

      <nav
        /* KEEP: screen readers announce this as the site's main navigation. */
        aria-label={t("nav.label")}
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <NavLink
          to="/"
          className="font-display text-lg font-semibold tracking-tight text-ink"
        >
          {t("nav.brand")}
        </NavLink>

        <div className="flex items-center gap-2">
          <ul className="flex items-center gap-1">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      /* KEEP: 44px min touch target (h-11) and a non-colour-only
                         active cue — the underline, not just the brighter text. */
                      "relative flex h-11 items-center rounded-lg px-3 text-sm transition-colors duration-200",
                      "after:absolute after:inset-x-3 after:bottom-2 after:h-px after:transition-opacity after:duration-200",
                      isActive
                        ? "text-ink after:bg-violet-soft after:opacity-100"
                        : "text-ink-muted hover:text-ink after:opacity-0"
                    )
                  }
                >
                  {t(link.key)}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* KEEP (or move, but do not drop): the only way to change language.
              See src/components/LanguageToggle.tsx. */}
          <LanguageToggle className="ms-1" />
        </div>
      </nav>
    </header>
  );
}
