/**
 * Every piece of interface text, in both languages.
 *
 * Keeping the two side by side in one file rather than in parallel ar/en files
 * is deliberate: a missing translation is visible the moment you look at the
 * entry, instead of hiding as an absent key in a file nobody opened.
 *
 * Content that belongs to the subject matter rather than the interface — the
 * planets, the timeline — lives with its data in src/data/, in the same shape.
 */

export type Lang = "ar" | "en";

/** A string that exists in both languages. */
export type L10n = { ar: string; en: string };

export const UI = {
  /* --- navigation ------------------------------------------------------- */
  "nav.brand": { ar: "Cosmos", en: "Cosmos" },
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.planets": { ar: "الكواكب", en: "Planets" },
  "nav.timeline": { ar: "الخط الزمني", en: "Timeline" },
  "nav.label": { ar: "التنقل الرئيسي", en: "Main navigation" },
  "nav.skip": { ar: "تخطَّ إلى المحتوى", en: "Skip to content" },

  /* --- language switch -------------------------------------------------- */
  "lang.label": { ar: "اللغة", en: "Language" },
  "lang.switchTo": { ar: "التبديل إلى الإنجليزية", en: "Switch to Arabic" },

  /* --- home ------------------------------------------------------------- */
  "home.eyebrow": { ar: "المجموعة الشمسية", en: "The Solar System" },
  "home.title1": { ar: "لا شيء هنا", en: "Nothing here" },
  "home.title2": { ar: "يقف ساكناً", en: "stands still" },
  "home.lede": {
    ar: "الشمس نفسها تجري بسرعة ١٩.٤ كيلومتر في الثانية، والكواكب تلاحقها. المسار الذي يرسمه كل كوكب في الفضاء ليس دائرة — بل حلزون.",
    en: "The Sun itself travels at 19.4 kilometres a second, and the planets chase it. The path each one traces through space is not a circle — it is a helix.",
  },
  "home.ctaPlanets": { ar: "استكشف الكواكب الثمانية", en: "Explore all eight planets" },
  "home.ctaTimeline": { ar: "تاريخ الكون", en: "History of the universe" },
  "home.featured": { ar: "أبرز الكواكب", en: "Featured planets" },
  "home.featuredLede": {
    ar: "أربعة عوالم اختيرت لتباينها: كوكب فيه حياة، وعملاق أثقل من كل الباقي مجتمعاً، وآخر بحلقات من الجليد، ورابع يدور على جنبه.",
    en: "Four worlds picked for contrast: one with life on it, one heavier than everything else combined, one ringed with ice, and one that rolls on its side.",
  },
  "home.viewAll": { ar: "عرض الثمانية كلها", en: "View all eight" },

  /* --- planets index ---------------------------------------------------- */
  "planets.title": { ar: "الكواكب الثمانية", en: "The eight planets" },
  "planets.lede": {
    ar: "من عطارد المحترق إلى نبتون المتجمّد. اضغط أي كوكب لبياناته الكاملة.",
    en: "From scorched Mercury to frozen Neptune. Select any planet for its full data.",
  },

  /* --- planet detail ---------------------------------------------------- */
  "detail.back": { ar: "كل الكواكب", en: "All planets" },
  "detail.order": { ar: "الكوكب {n} من الشمس", en: "Planet {n} from the Sun" },
  "detail.data": { ar: "البيانات", en: "Data" },
  "detail.colProperty": { ar: "الخاصية", en: "Property" },
  "detail.colValue": { ar: "القيمة", en: "Value" },
  "detail.colUnit": { ar: "الوحدة", en: "Unit" },
  "detail.tableSummary": {
    ar: "البيانات الفيزيائية والمدارية لكوكب {name}",
    en: "Physical and orbital data for {name}",
  },
  "detail.tableSource": {
    ar: "المصدر: صحيفة حقائق الكواكب — ناسا. درجات الحرارة للعمالقة الغازية والجليدية مقيسة عند مستوى ضغط ١ بار، إذ لا سطح لها.",
    en: "Source: NASA Planetary Fact Sheet. Temperatures for the gas and ice giants are measured at the 1-bar pressure level, as they have no surface.",
  },
  "detail.facts": { ar: "أشياء تستحق المعرفة", en: "Worth knowing" },
  "detail.nav": { ar: "التنقل بين الكواكب", en: "Planet navigation" },
  "detail.asOf": { ar: "حتى {date}", en: "as of {date}" },
  "detail.retrograde": { ar: "{v} (تراجعي)", en: "{v} (retrograde)" },

  /* --- planet card ------------------------------------------------------ */
  "card.aria": { ar: "{name} — عرض التفاصيل والبيانات", en: "{name} — view details and data" },
  "card.diameter": { ar: "القطر", en: "Diameter" },
  "card.moons": { ar: "الأقمار", en: "Moons" },

  /* --- timeline --------------------------------------------------------- */
  "timeline.title": { ar: "تاريخ الكون", en: "History of the universe" },
  "timeline.lede": {
    ar: "من الانفجار العظيم إلى اليوم — ١٣.٧٨٧ مليار سنة.",
    en: "From the Big Bang to today — 13.787 billion years.",
  },
  "timeline.tMinus": { ar: "منذ الانفجار العظيم", en: "After the Big Bang" },
  "timeline.yearsAgo": { ar: "قبل الآن", en: "Years ago" },
  "timeline.theoretical": { ar: "نظري", en: "Theoretical" },

  /* --- not found -------------------------------------------------------- */
  "notFound.title": { ar: "لا شيء هنا", en: "Nothing here" },
  "notFound.body": {
    ar: "الصفحة التي تبحث عنها خارج المدار.",
    en: "The page you are looking for is out of orbit.",
  },
  "notFound.back": { ar: "العودة إلى الرئيسية", en: "Back to home" },

  /* --- footer ----------------------------------------------------------- */
  "footer.sources": {
    ar: "البيانات الكوكبية من صحيفة حقائق الكواكب — ناسا. أعداد الأقمار من مركز الكواكب الصغيرة التابع للاتحاد الفلكي الدولي.",
    en: "Planetary data from the NASA Planetary Fact Sheet. Moon counts from the IAU Minor Planet Center.",
  },

  /* --- units ------------------------------------------------------------ */
  "unit.km": { ar: "كم", en: "km" },
  "unit.kg": { ar: "كجم", en: "kg" },
  "unit.millionKm": { ar: "مليون كم", en: "million km" },
  "unit.au": { ar: "و.ف", en: "AU" },
  "unit.earthDays": { ar: "يوم أرضي", en: "Earth days" },
  "unit.hours": { ar: "ساعة", en: "hours" },
  "unit.accel": { ar: "م/ث²", en: "m/s²" },
  "unit.celsius": { ar: "°م", en: "°C" },
} as const;

export type UIKey = keyof typeof UI;
