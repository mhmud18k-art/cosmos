import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { UI, type L10n, type Lang, type UIKey } from "@/i18n/strings";

/* ============================================================================
 * Language switching.
 *
 * Changing language here is not just swapping strings: Arabic sets the whole
 * document right-to-left, which flips layout, arrow directions and text
 * alignment. Both of those live on <html>, so they are set here rather than in
 * a component, and index.html reads the stored choice before React mounts so
 * the page never renders in the wrong direction first.
 * ==========================================================================*/

const STORAGE_KEY = "cosmos-lang";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** "rtl" for Arabic, "ltr" for English. */
  dir: "rtl" | "ltr";
  isRtl: boolean;
  /** An interface string, with optional {placeholder} substitution. */
  t: (key: UIKey, vars?: Record<string, string | number>) => string;
  /** The active side of a bilingual content value. */
  pick: (value: L10n) => string;
  /** A number in the active locale — Arabic-Indic digits under Arabic. */
  num: (n: number) => string;
  /** Converts Western digits inside a string, for values stored as text. */
  digits: (s: string) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

function readStored(): Lang {
  // Storage can throw outright in a private window or with site data blocked,
  // so a failure here has to fall through to the default rather than break
  // the whole render.
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "ar" || v === "en") return v;
  } catch {
    /* unavailable */
  }
  return "ar";
}

const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStored);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* the choice just will not persist; the session still works */
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(
    () => setLangState((l) => (l === "ar" ? "en" : "ar")),
    []
  );

  const value = useMemo<Ctx>(() => {
    const digits = (s: string) =>
      lang === "ar" ? s.replace(/[0-9]/g, (d) => AR_DIGITS[+d]) : s;

    return {
      lang,
      setLang,
      toggle,
      dir: lang === "ar" ? "rtl" : "ltr",
      isRtl: lang === "ar",
      t: (key, vars) => {
        let s: string = UI[key][lang];
        if (vars) {
          for (const [k, v] of Object.entries(vars)) {
            s = s.replaceAll(`{${k}}`, String(v));
          }
        }
        return s;
      },
      pick: (v) => v[lang],
      num: (n) =>
        n.toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
          maximumFractionDigits: 3,
        }),
      digits,
    };
  }, [lang, setLang, toggle]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLang(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLang must be used inside <LanguageProvider>.");
  }
  return ctx;
}
