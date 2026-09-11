/**
 * Planetary data.
 *
 * Sources: NASA Planetary Fact Sheet (nssdc.gsfc.nasa.gov) for the physical and
 * orbital figures, which are stable; and the IAU Minor Planet Center for the
 * moon counts, which are NOT stable — Saturn alone gained 128 confirmed moons in
 * March 2025 and 11 more in March 2026. `moonsAsOf` records when each count was
 * last checked so a stale number is visible rather than silently wrong.
 *
 * Temperatures are mean surface temperatures, except for the gas and ice giants,
 * which have no surface — those are quoted at the 1-bar pressure level, the
 * convention used in the NASA fact sheet.
 *
 * Every piece of prose carries both languages side by side. The numbers do not:
 * they are language-independent, and only their *formatting* changes, which is
 * handled at render time by the `num` helper from the language context.
 */

import type { PlanetKind } from "@/lib/planet-texture";
import type { L10n } from "@/i18n/strings";

/** A list of strings that exists in both languages. */
type L10nList = { ar: string[]; en: string[] };

export type Planet = {
  slug: string;
  /** Both names are always available: whichever is not the active language is
   *  shown underneath as a secondary line, in either direction. */
  name: L10n;
  /** One-line hook for the card. */
  tagline: L10n;
  /** Two or three sentences for the detail page. */
  blurb: L10n;
  type: L10n;
  /** Accent colour, used for the card glow and the detail header. */
  color: string;
  data: {
    /** Equatorial diameter, km. */
    diameterKm: number;
    /** kg, written out because the exponent matters more than the precision. */
    massKg: string;
    /** Mean distance from the Sun, million km. */
    distanceMkm: number;
    /** In astronomical units. */
    distanceAu: number;
    /** Sidereal orbital period, Earth days. */
    orbitDays: number;
    /** Sidereal rotation period, hours. Negative = retrograde. */
    rotationHours: number;
    /** Surface (or 1-bar) gravity, m/s². */
    gravity: number;
    /** Mean temperature, °C. */
    tempC: number;
    moons: number;
    moonsAsOf: L10n;
    atmosphere: L10n;
  };
  /** Two or three things worth knowing. */
  facts: L10nList;
};

export const PLANETS: Planet[] = [
  {
    slug: "mercury",
    name: { ar: "عطارد", en: "Mercury" },
    tagline: {
      ar: "الأقرب للشمس، والأسرع في المدار",
      en: "Closest to the Sun, and the fastest in orbit",
    },
    blurb: {
      ar: "أصغر كواكب المجموعة وأقربها للشمس. يدور حول الشمس مرة كل ٨٨ يوماً، لكنه يدور حول نفسه ببطء شديد — ثلاث دورات حول محوره لكل دورتين حول الشمس. غياب الغلاف الجوي يجعل الفرق بين وجهه النهاري والليلي من أعنف ما في المجموعة.",
      en: "The smallest planet and the closest to the Sun. It completes an orbit every 88 days, yet turns on its axis so slowly that it makes exactly three rotations for every two orbits. With almost no atmosphere to move heat around, the gap between its day and night sides is among the most extreme anywhere in the solar system.",
    },
    type: { ar: "صخري", en: "Rocky" },
    color: "#c9c2b6",
    data: {
      diameterKm: 4879,
      massKg: "3.30 × 10²³",
      distanceMkm: 57.9,
      distanceAu: 0.387,
      orbitDays: 88,
      rotationHours: 1407.6,
      gravity: 3.7,
      tempC: 167,
      moons: 0,
      moonsAsOf: { ar: "٢٠٢٦", en: "2026" },
      atmosphere: {
        ar: "لا يوجد فعلياً — غلاف خارجي بالغ الرقّة",
        en: "Effectively none — an extremely thin exosphere",
      },
    },
    facts: {
      ar: [
        "الفرق بين درجة الحرارة نهاراً وليلاً يتجاوز ٦٠٠ درجة مئوية.",
        "رغم قربه من الشمس، ليس الأسخن — الزهرة يسبقه بفارق كبير.",
        "يحتفظ بجليد مائي في قيعان فوهات قطبية لا تصلها أشعة الشمس أبداً.",
      ],
      en: [
        "Day and night temperatures differ by more than 600 °C.",
        "Despite being nearest the Sun it is not the hottest — Venus beats it comfortably.",
        "It holds water ice in the floors of polar craters that sunlight never reaches.",
      ],
    },
  },
  {
    slug: "venus",
    name: { ar: "الزهرة", en: "Venus" },
    tagline: {
      ar: "أسخن كوكب في المجموعة",
      en: "The hottest planet in the solar system",
    },
    blurb: {
      ar: "توأم الأرض في الحجم والكتلة، ونقيضها في كل ما عدا ذلك. غلاف جوي من ثاني أكسيد الكربون يبلغ ضغطه ٩٢ ضعف ضغط الأرض، وأثر بيت زجاجي جامح يرفع حرارة سطحه فوق ٤٦٠ درجة مئوية. يدور حول نفسه بالعكس، وببطء يجعل يومه أطول من سنته.",
      en: "Earth's twin in size and mass, and its opposite in nearly everything else. A carbon-dioxide atmosphere presses down at 92 times Earth's pressure, and a runaway greenhouse effect holds the surface above 460 °C. It turns backwards, and so slowly that its day outlasts its year.",
    },
    type: { ar: "صخري", en: "Rocky" },
    color: "#ffc65a",
    data: {
      diameterKm: 12104,
      massKg: "4.87 × 10²⁴",
      distanceMkm: 108.2,
      distanceAu: 0.723,
      orbitDays: 224.7,
      rotationHours: -5832.5,
      gravity: 8.9,
      tempC: 464,
      moons: 0,
      moonsAsOf: { ar: "٢٠٢٦", en: "2026" },
      atmosphere: {
        ar: "ثاني أكسيد الكربون ٩٦٪ ونيتروجين ٣.٥٪",
        en: "96% carbon dioxide, 3.5% nitrogen",
      },
    },
    facts: {
      ar: [
        "يومه (٢٤٣ يوماً أرضياً) أطول من سنته (٢٢٥ يوماً).",
        "يدور حول محوره في الاتجاه المعاكس لمعظم الكواكب.",
        "ضغط سطحه يعادل الضغط على عمق ٩٠٠ متر تحت سطح المحيط.",
      ],
      en: [
        "Its day (243 Earth days) is longer than its year (225 days).",
        "It rotates in the opposite direction to most of the planets.",
        "Surface pressure matches being 900 metres deep in Earth's ocean.",
      ],
    },
  },
  {
    slug: "earth",
    name: { ar: "الأرض", en: "Earth" },
    tagline: {
      ar: "العالم الوحيد المعروف بوجود حياة عليه",
      en: "The only world known to carry life",
    },
    blurb: {
      ar: "الكوكب الثالث، والوحيد الذي يوجد فيه ماء سائل مستقر على السطح. غلافه الجوي الغني بالأكسجين ومجاله المغناطيسي يحميان سطحه من الإشعاع الشمسي. سطحه نشط تكتونياً، وهو ما يعيد تدوير الكربون ويبقي المناخ ضمن نطاق صالح للحياة على مدى جيولوجي.",
      en: "The third planet, and the only one with stable liquid water on its surface. An oxygen-rich atmosphere and a magnetic field together shield the ground from solar radiation. Its crust is tectonically active, which recycles carbon and has kept the climate within a habitable range over geological time.",
    },
    type: { ar: "صخري", en: "Rocky" },
    color: "#5fd8ff",
    data: {
      diameterKm: 12756,
      massKg: "5.97 × 10²⁴",
      distanceMkm: 149.6,
      distanceAu: 1.0,
      orbitDays: 365.2,
      rotationHours: 23.9,
      gravity: 9.8,
      tempC: 15,
      moons: 1,
      moonsAsOf: { ar: "٢٠٢٦", en: "2026" },
      atmosphere: {
        ar: "نيتروجين ٧٨٪ وأكسجين ٢١٪",
        en: "78% nitrogen, 21% oxygen",
      },
    },
    facts: {
      ar: [
        "٧١٪ من سطحه مغطى بالماء، لكن الماء لا يشكّل سوى ٠.٠٢٪ من كتلته.",
        "القمر يبتعد عنها نحو ٣.٨ سنتيمتر كل سنة.",
        "مجالها المغناطيسي ينشأ من دوران لبّها الخارجي المنصهر.",
      ],
      en: [
        "Water covers 71% of the surface but makes up only 0.02% of the mass.",
        "The Moon drifts about 3.8 centimetres further away each year.",
        "Its magnetic field is generated by the churning of a molten outer core.",
      ],
    },
  },
  {
    slug: "mars",
    name: { ar: "المريخ", en: "Mars" },
    tagline: {
      ar: "الكوكب الأحمر، وأكثر الوجهات دراسةً",
      en: "The red planet, and the most studied destination",
    },
    blurb: {
      ar: "كوكب صخري بارد وجاف، يكتسب لونه من أكسيد الحديد في تربته. يحمل أعلى بركان في المجموعة الشمسية (أوليمبوس مونس) وأحد أطول الأودية (فاليس مارينيريس). تشير تضاريسه إلى أن الماء السائل جرى على سطحه في الماضي البعيد.",
      en: "A cold, dry rocky world that takes its colour from iron oxide in the soil. It carries the tallest volcano in the solar system, Olympus Mons, and one of its longest canyon systems, Valles Marineris. The landforms record liquid water running across the surface in the distant past.",
    },
    type: { ar: "صخري", en: "Rocky" },
    color: "#ff4a32",
    data: {
      diameterKm: 6792,
      massKg: "6.42 × 10²³",
      distanceMkm: 227.9,
      distanceAu: 1.524,
      orbitDays: 687,
      rotationHours: 24.6,
      gravity: 3.7,
      tempC: -65,
      moons: 2,
      moonsAsOf: { ar: "٢٠٢٦", en: "2026" },
      atmosphere: {
        ar: "ثاني أكسيد الكربون ٩٥٪ — رقيق جداً",
        en: "95% carbon dioxide — extremely thin",
      },
    },
    facts: {
      ar: [
        "أوليمبوس مونس يرتفع ٢٢ كيلومتراً، أي نحو ٢.٥ ضعف ارتفاع إيفرست.",
        "يومه يقارب يوم الأرض: ٢٤ ساعة و٣٧ دقيقة.",
        "قمراه فوبوس وديموس صغيران وغير كرويين، ويُرجَّح أنهما كويكبان أُسِرا.",
      ],
      en: [
        "Olympus Mons rises 22 kilometres — roughly 2.5 times the height of Everest.",
        "Its day is close to Earth's: 24 hours and 37 minutes.",
        "Its moons Phobos and Deimos are small and lumpy, most likely captured asteroids.",
      ],
    },
  },
  {
    slug: "jupiter",
    name: { ar: "المشتري", en: "Jupiter" },
    tagline: {
      ar: "الأضخم — أثقل من كل الكواكب مجتمعة",
      en: "The largest — heavier than every other planet combined",
    },
    blurb: {
      ar: "عملاق غازي تفوق كتلته كتلة بقية كواكب المجموعة مجتمعة بمرتين ونصف. لا سطح صلب له؛ الغلاف الغازي يتكثّف تدريجياً حتى يصير هيدروجيناً معدنياً سائلاً. جاذبيته الهائلة تحرف المذنّبات وتؤثر في بنية المجموعة كلها.",
      en: "A gas giant with two and a half times the mass of every other planet put together. It has no solid surface; the atmosphere simply thickens with depth until it becomes liquid metallic hydrogen. Its gravity deflects comets and has shaped the architecture of the whole solar system.",
    },
    type: { ar: "عملاق غازي", en: "Gas giant" },
    color: "#ffa62e",
    data: {
      diameterKm: 142984,
      massKg: "1.898 × 10²⁷",
      distanceMkm: 778.5,
      distanceAu: 5.203,
      orbitDays: 4331,
      rotationHours: 9.9,
      gravity: 23.1,
      tempC: -110,
      moons: 101,
      moonsAsOf: { ar: "٢٠٢٦", en: "2026" },
      atmosphere: {
        ar: "هيدروجين ٩٠٪ وهيليوم ١٠٪",
        en: "90% hydrogen, 10% helium",
      },
    },
    facts: {
      ar: [
        "البقعة الحمراء العظيمة عاصفة أكبر من الأرض، تُرصد منذ أكثر من ٣٥٠ سنة.",
        "أسرع الكواكب دوراناً: يكمل دورة حول محوره في أقل من ١٠ ساعات.",
        "قمره جانيميد أكبر من عطارد، وهو أكبر قمر في المجموعة الشمسية.",
      ],
      en: [
        "The Great Red Spot is a storm wider than Earth, watched for over 350 years.",
        "It is the fastest-spinning planet, turning once in under 10 hours.",
        "Its moon Ganymede is larger than Mercury and the biggest moon in the solar system.",
      ],
    },
  },
  {
    slug: "saturn",
    name: { ar: "زحل", en: "Saturn" },
    tagline: {
      ar: "صاحب أشهر نظام حلقات",
      en: "Keeper of the most famous ring system",
    },
    blurb: {
      ar: "ثاني أكبر الكواكب، وأقلها كثافة — كثافته أقل من كثافة الماء. حلقاته تتكوّن أساساً من قطع جليد مائي يتراوح حجمها بين حبّات الغبار والبيوت، وهي رقيقة إلى حد مذهل: سمكها عشرات الأمتار مقابل امتداد يبلغ مئات الآلاف من الكيلومترات.",
      en: "The second-largest planet and the least dense — less dense, in fact, than water. Its rings are mostly chunks of water ice ranging from grains of dust to houses, and they are astonishingly thin: tens of metres thick across a span of hundreds of thousands of kilometres.",
    },
    type: { ar: "عملاق غازي", en: "Gas giant" },
    color: "#ffd884",
    data: {
      diameterKm: 120536,
      massKg: "5.68 × 10²⁶",
      distanceMkm: 1432,
      distanceAu: 9.537,
      orbitDays: 10747,
      rotationHours: 10.7,
      gravity: 9.0,
      tempC: -140,
      moons: 285,
      moonsAsOf: { ar: "مارس ٢٠٢٦", en: "March 2026" },
      atmosphere: {
        ar: "هيدروجين ٩٦٪ وهيليوم ٣٪",
        en: "96% hydrogen, 3% helium",
      },
    },
    facts: {
      ar: [
        "كثافته أقل من كثافة الماء — نظرياً يطفو لو وُجد حوض يسعه.",
        "عدد أقماره المؤكدة قفز من ١٤٦ إلى ٢٧٤ في إعلان واحد في مارس ٢٠٢٥.",
        "قمره تيتان له غلاف جوي كثيف وبحيرات ميثان سائل على سطحه.",
      ],
      en: [
        "It is less dense than water — in principle it would float, given a big enough bath.",
        "Its confirmed moon count jumped from 146 to 274 in a single announcement in March 2025.",
        "Its moon Titan has a thick atmosphere and lakes of liquid methane on its surface.",
      ],
    },
  },
  {
    slug: "uranus",
    name: { ar: "أورانوس", en: "Uranus" },
    tagline: {
      ar: "الكوكب الذي يتدحرج على جنبه",
      en: "The planet that rolls on its side",
    },
    blurb: {
      ar: "عملاق جليدي يميل محوره بمقدار ٩٨ درجة تقريباً، أي أنه يدور مضطجعاً على جانبه — وهو ما يُرجَّح أنه أثر اصطدام هائل في تاريخه المبكر. هذا الميل يمنحه أشد الفصول تطرفاً في المجموعة: كل قطب يقضي ٤٢ سنة في ضوء متصل ثم ٤٢ سنة في ظلام.",
      en: "An ice giant tipped about 98 degrees over, so that it effectively spins lying down — most likely the mark of an enormous collision early in its history. That tilt gives it the most extreme seasons anywhere: each pole spends 42 years in continuous daylight, then 42 in darkness.",
    },
    type: { ar: "عملاق جليدي", en: "Ice giant" },
    color: "#7fe6ff",
    data: {
      diameterKm: 51118,
      massKg: "8.68 × 10²⁵",
      distanceMkm: 2867,
      distanceAu: 19.191,
      orbitDays: 30589,
      rotationHours: -17.2,
      gravity: 8.7,
      tempC: -195,
      moons: 28,
      moonsAsOf: { ar: "٢٠٢٦", en: "2026" },
      atmosphere: {
        ar: "هيدروجين ٨٣٪ وهيليوم ١٥٪ وميثان ٢٪",
        en: "83% hydrogen, 15% helium, 2% methane",
      },
    },
    facts: {
      ar: [
        "ميل محوره ٩٨ درجة — يدور فعلياً على جانبه.",
        "أبرد غلاف جوي مُقاس في المجموعة الشمسية: −٢٢٤ درجة مئوية.",
        "الميثان في غلافه يمتص الضوء الأحمر، فيبدو الكوكب أزرق مخضرّاً.",
      ],
      en: [
        "Its axial tilt is 98 degrees — it genuinely rotates on its side.",
        "It holds the coldest atmosphere ever measured in the solar system: −224 °C.",
        "Methane in its air absorbs red light, which is why the planet looks blue-green.",
      ],
    },
  },
  {
    slug: "neptune",
    name: { ar: "نبتون", en: "Neptune" },
    tagline: {
      ar: "الأبعد، وموطن أعنف الرياح",
      en: "The furthest out, and home to the fiercest winds",
    },
    blurb: {
      ar: "أبعد كواكب المجموعة عن الشمس، واكتُشف بالحساب الرياضي قبل أن يُرصد بالتلسكوب — إذ دلّت اضطرابات مدار أورانوس على وجوده. تهبّ في غلافه أسرع رياح مرصودة في المجموعة الشمسية، وتتجاوز ٢٠٠٠ كيلومتر في الساعة.",
      en: "The most distant planet from the Sun, and the only one found by mathematics before anyone saw it — irregularities in the orbit of Uranus gave it away. Its atmosphere carries the fastest winds measured anywhere in the solar system, exceeding 2,000 kilometres per hour.",
    },
    type: { ar: "عملاق جليدي", en: "Ice giant" },
    color: "#3f7dff",
    data: {
      diameterKm: 49528,
      massKg: "1.02 × 10²⁶",
      distanceMkm: 4515,
      distanceAu: 30.069,
      orbitDays: 59800,
      rotationHours: 16.1,
      gravity: 11.0,
      tempC: -200,
      moons: 16,
      moonsAsOf: { ar: "٢٠٢٦", en: "2026" },
      atmosphere: {
        ar: "هيدروجين ٨٠٪ وهيليوم ١٩٪ وميثان ١.٥٪",
        en: "80% hydrogen, 19% helium, 1.5% methane",
      },
    },
    facts: {
      ar: [
        "اكتُشف عام ١٨٤٦ بالحساب قبل الرصد، اعتماداً على شذوذ مدار أورانوس.",
        "أكمل أول دورة كاملة حول الشمس منذ اكتشافه في عام ٢٠١١.",
        "قمره تريتون يدور عكس اتجاه دوران الكوكب، ويُرجَّح أنه جُرم مأسور من حزام كايبر.",
      ],
      en: [
        "Discovered in 1846 by calculation rather than observation, from anomalies in Uranus's orbit.",
        "It finished its first full orbit since discovery only in 2011.",
        "Its moon Triton orbits backwards, and is probably a captured Kuiper Belt object.",
      ],
    },
  },
];

export function getPlanet(slug: string): Planet | undefined {
  return PLANETS.find((p) => p.slug === slug);
}

/**
 * Rendering parameters for <Planet />, kept apart from the factual data above
 * so the two are not confused: `spinSeconds` is a look, not a measurement.
 *
 * `tilt` IS real — axial tilt in degrees, from the same NASA fact sheet. Venus
 * at 177° and Uranus at 98° are why those two also spin retrograde: their poles
 * are flipped past the horizontal.
 */
export const RENDER: Record<
  string,
  {
    /**
     * Every planet has its own surface builder rather than sharing a generic
     * "rocky/gas/ice" recipe — Mercury really is cratered, Venus really is a
     * smooth cloud deck, Uranus really is featureless. See
     * src/lib/planet-texture.ts. All of it is generated in code from real
     * data, so there is no image to download and nothing that can fail.
     */
    kind: PlanetKind;
    tilt: number;
    spinSeconds: number;
    rings?: boolean;
    retrograde?: boolean;
  }
> = {
  mercury: { kind: "mercury", tilt: 0.03, spinSeconds: 60 },
  venus: { kind: "venus", tilt: 177.4, spinSeconds: 90, retrograde: true },
  earth: { kind: "earth", tilt: 23.4, spinSeconds: 26 },
  mars: { kind: "mars", tilt: 25.2, spinSeconds: 27 },
  jupiter: { kind: "jupiter", tilt: 3.1, spinSeconds: 14 },
  saturn: { kind: "saturn", tilt: 26.7, spinSeconds: 16, rings: true },
  uranus: { kind: "uranus", tilt: 97.8, spinSeconds: 22, retrograde: true },
  neptune: { kind: "neptune", tilt: 28.3, spinSeconds: 20 },
};

/**
 * Rows of the detail table, kept beside the data so the two never drift. The
 * label and unit are UI string keys rather than literals, so the table speaks
 * whichever language is active.
 */
export const DATA_LABELS: Array<{
  key: keyof Planet["data"];
  label: L10n;
  unitKey?:
    | "unit.km"
    | "unit.kg"
    | "unit.millionKm"
    | "unit.au"
    | "unit.earthDays"
    | "unit.hours"
    | "unit.accel"
    | "unit.celsius";
}> = [
  { key: "diameterKm", label: { ar: "القطر الاستوائي", en: "Equatorial diameter" }, unitKey: "unit.km" },
  { key: "massKg", label: { ar: "الكتلة", en: "Mass" }, unitKey: "unit.kg" },
  { key: "distanceMkm", label: { ar: "متوسط البعد عن الشمس", en: "Mean distance from the Sun" }, unitKey: "unit.millionKm" },
  { key: "distanceAu", label: { ar: "البعد بالوحدات الفلكية", en: "Distance in astronomical units" }, unitKey: "unit.au" },
  { key: "orbitDays", label: { ar: "مدة الدورة حول الشمس", en: "Orbital period" }, unitKey: "unit.earthDays" },
  { key: "rotationHours", label: { ar: "مدة الدورة حول المحور", en: "Rotation period" }, unitKey: "unit.hours" },
  { key: "gravity", label: { ar: "جاذبية السطح", en: "Surface gravity" }, unitKey: "unit.accel" },
  { key: "tempC", label: { ar: "متوسط الحرارة", en: "Mean temperature" }, unitKey: "unit.celsius" },
  { key: "moons", label: { ar: "عدد الأقمار المؤكدة", en: "Confirmed moons" } },
  { key: "atmosphere", label: { ar: "الغلاف الجوي", en: "Atmosphere" } },
];
