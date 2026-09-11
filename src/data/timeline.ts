/**
 * History of the universe, Big Bang → today.
 *
 * Ages follow the Planck 2018 cosmology (universe age 13.787 ± 0.020 billion
 * years) and the standard ΛCDM chronology. `tMinus` is time since the Big Bang;
 * `yearsAgo` is the same moment counted backwards from now, which is the axis
 * most people actually read a cosmic timeline on.
 *
 * The two earliest entries are theoretical: no observation reaches past the
 * cosmic microwave background at ~380,000 years, so everything before that is
 * inference from particle physics rather than something anyone has seen.
 */

import type { L10n } from "@/i18n/strings";

export type Era = {
  id: string;
  /** Human-readable time since the Big Bang. */
  tMinus: L10n;
  /** Same instant, counted back from the present. */
  yearsAgo: L10n;
  title: L10n;
  body: L10n;
  /** Accent for the marker. Keep to the palette. */
  color: string;
  /** True where the entry rests on theory rather than direct observation. */
  theoretical?: boolean;
};

export const ERAS: Era[] = [
  {
    id: "planck",
    tMinus: { ar: "٠ — ١٠⁻⁴³ ثانية", en: "0 — 10⁻⁴³ seconds" },
    yearsAgo: { ar: "١٣.٨ مليار سنة", en: "13.8 billion years" },
    title: { ar: "زمن بلانك", en: "The Planck epoch" },
    body: {
      ar: "أبكر لحظة تصلها الفيزياء المعروفة. الجاذبية والقوى الأخرى موحّدة على الأرجح في قوة واحدة، والنسبية العامة وميكانيكا الكم تتوقفان معاً عن إعطاء إجابات. ما قبل ذلك ليس مجهولاً فحسب، بل خارج نطاق ما تستطيع نظرياتنا الحالية وصفه.",
      en: "The earliest moment known physics can reach. Gravity and the other forces are probably unified into one, and general relativity and quantum mechanics both stop returning answers. What came before is not merely unknown — it is outside what our current theories are able to describe.",
    },
    color: "#a78bfa",
    theoretical: true,
  },
  {
    id: "inflation",
    tMinus: { ar: "١٠⁻³⁶ — ١٠⁻³² ثانية", en: "10⁻³⁶ — 10⁻³² seconds" },
    yearsAgo: { ar: "١٣.٨ مليار سنة", en: "13.8 billion years" },
    title: { ar: "التضخم الكوني", en: "Cosmic inflation" },
    body: {
      ar: "يتمدد الكون بمعامل لا يقل عن ١٠²⁶ في جزء ضئيل من الثانية. هذا ما يفسّر لماذا يبدو الكون متجانساً ومسطّحاً على النطاقات الكبرى، ولماذا تتطابق حرارة منطقتين متقابلتين لم يكن بينهما اتصال ممكن.",
      en: "The universe expands by a factor of at least 10²⁶ in a small fraction of a second. This is what explains why it looks so uniform and so flat on large scales, and why two opposite patches of sky that could never have exchanged a signal are nonetheless the same temperature.",
    },
    color: "#a78bfa",
    theoretical: true,
  },
  {
    id: "quark-soup",
    tMinus: { ar: "١٠⁻¹² — ١٠⁻⁶ ثانية", en: "10⁻¹² — 10⁻⁶ seconds" },
    yearsAgo: { ar: "١٣.٨ مليار سنة", en: "13.8 billion years" },
    title: { ar: "حساء الكواركات", en: "The quark soup" },
    body: {
      ar: "تنفصل القوى الأساسية بعضها عن بعض. الكون بلازما من الكواركات والغلوونات، أسخن من أن تترابط في جسيمات. مع هبوط الحرارة تتجمّع الكواركات ثلاثة ثلاثة لتكوّن البروتونات والنيوترونات.",
      en: "The fundamental forces separate from one another. The universe is a plasma of quarks and gluons, far too hot for them to bind into particles. As it cools, quarks lock together in threes to form protons and neutrons.",
    },
    color: "#7c3aed",
    theoretical: true,
  },
  {
    id: "nucleosynthesis",
    tMinus: { ar: "١٠ ثوانٍ — ٢٠ دقيقة", en: "10 seconds — 20 minutes" },
    yearsAgo: { ar: "١٣.٨ مليار سنة", en: "13.8 billion years" },
    title: { ar: "التخليق النووي البدائي", en: "Big Bang nucleosynthesis" },
    body: {
      ar: "تندمج البروتونات والنيوترونات فتتكوّن نوى الهيدروجين والهيليوم وأثر من الليثيوم. النسبة الناتجة — نحو ٧٥٪ هيدروجين و٢٥٪ هيليوم بالكتلة — ما زالت مقيسة في الكون اليوم، وهي من أقوى الأدلة على النموذج كله.",
      en: "Protons and neutrons fuse into hydrogen and helium nuclei, plus a trace of lithium. The resulting ratio — roughly 75% hydrogen to 25% helium by mass — is still what we measure in the universe today, and is among the strongest pieces of evidence for the whole model.",
    },
    color: "#7c3aed",
  },
  {
    id: "cmb",
    tMinus: { ar: "٣٨٠ ألف سنة", en: "380,000 years" },
    yearsAgo: { ar: "١٣.٨ مليار سنة", en: "13.8 billion years" },
    title: { ar: "الانفصال — أول ضوء", en: "Recombination — first light" },
    body: {
      ar: "تبرد الحرارة إلى نحو ٣٠٠٠ كلفن، فتلتقط النوى إلكتروناتها وتتكوّن الذرات المتعادلة. يصير الكون شفافاً للضوء لأول مرة، والفوتونات المنطلقة في تلك اللحظة هي إشعاع الخلفية الكونية الميكروي الذي نرصده اليوم: أقدم صورة يمكن التقاطها للكون.",
      en: "Temperatures fall to about 3,000 K, nuclei capture their electrons, and neutral atoms form. The universe becomes transparent to light for the first time, and the photons released at that instant are the cosmic microwave background we observe today: the oldest picture of the universe it is possible to take.",
    },
    color: "#5fd8ff",
  },
  {
    id: "dark-ages",
    tMinus: { ar: "٣٨٠ ألف — ١٥٠ مليون سنة", en: "380,000 — 150 million years" },
    yearsAgo: { ar: "١٣.٦ مليار سنة", en: "13.6 billion years" },
    title: { ar: "العصور المظلمة", en: "The dark ages" },
    body: {
      ar: "لا نجوم بعد. غاز محايد بارد ينتشر في الفراغ، والجاذبية تشتغل ببطء على تكتيل المادة المظلمة في هالات ستصير لاحقاً مهاداً للمجرات.",
      en: "No stars yet. Cold neutral gas fills the void while gravity works slowly, gathering dark matter into haloes that will later cradle the first galaxies.",
    },
    color: "#4338ca",
  },
  {
    id: "first-stars",
    tMinus: { ar: "١٠٠ — ٤٠٠ مليون سنة", en: "100 — 400 million years" },
    yearsAgo: { ar: "١٣.٥ مليار سنة", en: "13.5 billion years" },
    title: { ar: "النجوم الأولى", en: "The first stars" },
    body: {
      ar: "تشتعل نجوم الجيل الثالث — ضخمة، قصيرة العمر، خالية من العناصر الثقيلة. إشعاعها يعيد تأيين الغاز المحيط، وموتها في مستعرات عظمى يبذر الكون بأول كربون وأكسجين وحديد. تلسكوب جيمس ويب يرصد اليوم مجرات من هذه الحقبة.",
      en: "Population III stars ignite — massive, short-lived, and containing no heavy elements at all. Their radiation reionises the surrounding gas, and their deaths as supernovae seed the universe with its first carbon, oxygen and iron. The James Webb telescope is now observing galaxies from this era.",
    },
    color: "#5fd8ff",
  },
  {
    id: "milky-way",
    tMinus: { ar: "١ — ٢ مليار سنة", en: "1 — 2 billion years" },
    yearsAgo: { ar: "نحو ١٢ مليار سنة", en: "about 12 billion years" },
    title: { ar: "تكوّن درب التبانة", en: "The Milky Way forms" },
    body: {
      ar: "تتجمّع مجرتنا من اندماج تجمعات أصغر. أقدم نجومها المعروفة يقارب عمرها عمر الكون نفسه، ولا تزال في الهالة المحيطة بالقرص.",
      en: "Our galaxy assembles from the merging of smaller clumps. Its oldest known stars are nearly as old as the universe itself, and still sit in the halo surrounding the disc.",
    },
    color: "#a78bfa",
  },
  {
    id: "solar-system",
    tMinus: { ar: "٩.٢ مليار سنة", en: "9.2 billion years" },
    yearsAgo: { ar: "٤.٦ مليار سنة", en: "4.6 billion years" },
    title: { ar: "ولادة المجموعة الشمسية", en: "The solar system is born" },
    body: {
      ar: "تنهار سحابة جزيئية على نفسها، فتتكوّن الشمس في مركزها ويتسطّح ما تبقّى في قرص كوكبي. تتلاحم الحبيبات في كويكبات ثم في كواكب. الأرض تكتمل خلال نحو ١٠٠ مليون سنة.",
      en: "A molecular cloud collapses in on itself, forming the Sun at its centre while the remainder flattens into a planet-forming disc. Grains stick into asteroids, and asteroids into planets. Earth finishes assembling within roughly 100 million years.",
    },
    color: "#ffd884",
  },
  {
    id: "life",
    tMinus: { ar: "١٠ مليارات سنة", en: "10 billion years" },
    yearsAgo: { ar: "٣.٨ مليار سنة", en: "3.8 billion years" },
    title: { ar: "أول أثر للحياة", en: "The first trace of life" },
    body: {
      ar: "أقدم الأدلة الجيوكيميائية والحفرية على حياة ميكروبية على الأرض. البكتيريا الزرقاء تبدأ لاحقاً في إنتاج الأكسجين بالتمثيل الضوئي، فتغيّر تركيب الغلاف الجوي تغييراً جذرياً فيما يُعرف بحدث الأكسدة الكبير قبل ٢.٤ مليار سنة.",
      en: "The oldest geochemical and fossil evidence for microbial life on Earth. Cyanobacteria later begin producing oxygen by photosynthesis, transforming the composition of the atmosphere in what is known as the Great Oxidation Event, 2.4 billion years ago.",
    },
    color: "#5fd8ff",
  },
  {
    id: "humans",
    tMinus: { ar: "١٣.٧٨٧ مليار سنة", en: "13.787 billion years" },
    yearsAgo: { ar: "٣٠٠ ألف سنة", en: "300,000 years" },
    title: { ar: "الإنسان العاقل", en: "Homo sapiens" },
    body: {
      ar: "يظهر نوعنا في أفريقيا. على مقياس هذا الخط الزمني، لو اختُصر عمر الكون في سنة واحدة، لظهر الإنسان في آخر ثماني دقائق من ليلة رأس السنة.",
      en: "Our species appears in Africa. On the scale of this timeline, if the age of the universe were compressed into a single year, humans would show up in the last eight minutes of New Year's Eve.",
    },
    color: "#f8fafc",
  },
  {
    id: "now",
    tMinus: { ar: "١٣.٧٨٧ مليار سنة", en: "13.787 billion years" },
    yearsAgo: { ar: "اليوم", en: "today" },
    title: { ar: "اللحظة الحالية", en: "The present moment" },
    body: {
      ar: "الكون ما زال يتمدد، وبمعدل متسارع تدفعه الطاقة المظلمة. الضوء الذي يصلنا من أبعد المجرات المرصودة قطع أكثر من ١٣ مليار سنة قبل أن يبلغ مرايا تلسكوباتنا.",
      en: "The universe is still expanding, and at an accelerating rate driven by dark energy. Light reaching us from the most distant observed galaxies has travelled for more than 13 billion years before landing on our telescope mirrors.",
    },
    color: "#f8fafc",
  },
];
