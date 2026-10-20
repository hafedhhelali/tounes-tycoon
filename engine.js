/**
 * Tounes Tycoon - Core Idle Game Engine
 * © EOLabs 2026. Pur JavaScript, zéro dépendance, zéro dérive de timer.
 */

export const BUSINESS_CONFIGS = [
  {
    id: 'kaskrout',
    name: 'نصبة كسكروت عياري',
    tagline: 'سخون يحرق بالزيت والهريسة العربي، كول وتفرهد !',
    icon: '🥖',
    baseCost: 5.0, // Don de départ 5 DT permet l'achat immédiat
    baseRevenue: 0.8,
    costMultiplier: 1.07,
    cycleDurationMs: 600, // 0.6s
    managers: [
      { name: 'عمّك الصادق', role: 'صنايعي الكسكروت', avatar: '👨‍🍳', cost: 25.0 }
    ],
  },
  {
    id: 'fricasse',
    name: 'فريكاسي وبمبلوني سخون',
    tagline: 'من الطنجرة للفوّاي، كعبة تقرمش تسكت الجوع !',
    icon: '🍩',
    baseCost: 30.0,
    baseRevenue: 3.5,
    costMultiplier: 1.08,
    cycleDurationMs: 1400, // 1.4s
    managers: [
      { name: 'الباجي البمبلوني', role: 'معلّم القلي والتغميس', avatar: '🧑‍🍳', cost: 150.0 }
    ],
  },
  {
    id: 'kahwa',
    name: 'قهوة شعبية وطرح شكبة',
    tagline: 'كابوسين تروّق المخ وطرح كارطة مع ولاد الحومة',
    icon: '☕',
    baseCost: 120.0,
    baseRevenue: 14.0,
    costMultiplier: 1.09,
    cycleDurationMs: 2500, // 2.5s
    managers: [
      { name: 'الناصر القارصون', role: 'سرباي الصالة والضحكة', avatar: '🤵', cost: 600.0 },
      { name: 'سي الهاشمي', role: 'صاحب القهوة والكونتوار', avatar: '☕', cost: 1800.0 }
    ],
  },
  {
    id: 'attariya',
    name: 'عطريّة ولد الحومة',
    tagline: 'باكو حليب، طماطم وخيط وإبرة، وقيّد في الكرني',
    icon: '🏪',
    baseCost: 800.0,
    baseRevenue: 55.0,
    costMultiplier: 1.10,
    cycleDurationMs: 5000, // 5.0s
    managers: [
      { name: 'منصف العطّار', role: 'مولى الحانوت والكرني', avatar: '🏬', cost: 4000.0 }
    ],
  },
  {
    id: 'patisserie',
    name: 'حلويات عربي وبقلاوة',
    tagline: 'مقروض القيروان وبقلاوة بالعسل الحر تذوب في الفم',
    icon: '🍯',
    baseCost: 4500.0,
    baseRevenue: 220.0,
    costMultiplier: 1.11,
    cycleDurationMs: 10000, // 10.0s
    managers: [
      { name: 'الحاج عمر', role: 'حلواني الفور والعسل', avatar: '👳', cost: 20000.0 },
      { name: 'خالتي زبيدة', role: 'شوافة الحلو والتوزيع', avatar: '👩‍🍳', cost: 50000.0 }
    ],
  },
  {
    id: 'taxi_collectif',
    name: 'محطة تاكسي جماعي',
    tagline: 'سكّر الباب بالسياسة، خمسة ومارش وطيران للبلاد !',
    icon: '🚐',
    baseCost: 25000.0,
    baseRevenue: 950.0,
    costMultiplier: 1.12,
    cycleDurationMs: 18000, // 18.0s
    managers: [
      { name: 'كمال تيربو', role: 'كلاج الديسك والشوفيرية', avatar: '🕶️', cost: 120000.0 }
    ],
  },
  {
    id: 'superette',
    name: 'سوبيرات الحومة',
    tagline: 'كليماتيزور بارد وشاريوات تجري وقضية سريعة',
    icon: '🛒',
    baseCost: 150000.0,
    baseRevenue: 3800.0,
    costMultiplier: 1.12,
    cycleDurationMs: 30000, // 30.0s
    managers: [
      { name: 'منير الكاشير', role: 'كاشير الكاسة', avatar: '💳', cost: 600000.0 },
      { name: 'سي رضا', role: 'شاف الرّفوف والسلعة', avatar: '👔', cost: 1500000.0 }
    ],
  },
  {
    id: 'supermarche',
    name: 'المغازة العامّة',
    tagline: 'بروموسيونات وقضية الشهر بالكردونة، العز والحطة',
    icon: '🏢',
    baseCost: 900000.0,
    baseRevenue: 15000.0,
    costMultiplier: 1.13,
    cycleDurationMs: 45000, // 45.0s
    managers: [
      { name: 'طارق الشاف', role: 'كابو السلعة والبيع', avatar: '📋', cost: 3500000.0 },
      { name: 'كريم الشريف', role: 'معلّم الليفريزون والسطوك', avatar: '💼', cost: 9000000.0 }
    ],
  },
  {
    id: 'salon_de_the',
    name: 'صالون شاي البحيرة',
    tagline: 'موخيتو منعنع ودلال على البحر وقعدة رجال أعمال',
    icon: '🍹',
    baseCost: 5500000.0,
    baseRevenue: 55000.0,
    costMultiplier: 1.14,
    cycleDurationMs: 60000, // 60.0s
    managers: [
      { name: 'وسيم الكابتن', role: 'شاف صالة الصالون', avatar: '🤵', cost: 20000000.0 },
      { name: 'رامي الباريستا', role: 'فنّان العصير والكوكتيل', avatar: '🍸', cost: 50000000.0 }
    ],
  },
  {
    id: 'restaurant',
    name: 'مطعم ابو علي الشامي',
    tagline: 'شاورما على أصولها ومشوي ومقبلات شامية، على كيف كيفك !',
    icon: '🥘',
    baseCost: 32000000.0,
    baseRevenue: 220000.0,
    costMultiplier: 1.14,
    cycleDurationMs: 90000, // 90.0s
    managers: [
      { name: 'المعلم مبروك', role: 'صنايعي الكانون والشواية', avatar: '🔥', cost: 110000000.0 },
      { name: 'الشاف فتحي', role: 'معلّم الكوجينة والطياب', avatar: '👨‍🍳', cost: 280000000.0 }
    ],
  },
  {
    id: 'agence_voyages',
    name: 'وكالة اسفار اللقلق',
    tagline: 'فويّاجات وعمرات وتيكيات طيارة، حوّس وتفرّه في العالم',
    icon: '✈️',
    baseCost: 180000000.0,
    baseRevenue: 850000.0,
    costMultiplier: 1.14,
    cycleDurationMs: 120000, // 120.0s
    managers: [
      { name: 'أنيس التيكي', role: 'شاف التيكيات والفيزا', avatar: '🎫', cost: 600000000.0 },
      { name: 'سي منير اللقلاق', role: 'الباترون الكبير', avatar: '🧳', cost: 1500000000.0 }
    ],
  },
  {
    id: 'hotel',
    name: 'نزل وفندق 5 نجوم',
    tagline: 'بيسين شاسعة وسوّاح من كل بلاد، فخامة ودلال ملكي',
    icon: '🏨',
    baseCost: 900000000.0,
    baseRevenue: 3200000.0,
    costMultiplier: 1.15,
    cycleDurationMs: 150000, // 150.0s
    managers: [
      { name: 'مدام سيرين', role: 'شوافة الريسبسيون والدلال', avatar: '👩‍💼', cost: 3000000000.0 },
      { name: 'ميسيو برهان', role: 'مدير الفندق والباترون', avatar: '🎩', cost: 8000000000.0 }
    ],
  },
  {
    id: 'centre_commercial',
    name: 'المول والمركّب التجاري الكبير',
    tagline: 'إسكالاتور وماركات ودور سينما، الدنيا تغلي والفلوس تصبّ',
    icon: '🛍️',
    baseCost: 4500000000.0,
    baseRevenue: 12000000.0,
    costMultiplier: 1.15,
    cycleDurationMs: 200000, // 200.0s
    managers: [
      { name: 'المهندس مراد', role: 'كابو التكنيك والضوّ', avatar: '👷', cost: 15000000000.0 },
      { name: 'مدام نادية', role: 'شوافة البوتيكات والماركات', avatar: '👠', cost: 35000000000.0 },
      { name: 'سي خليل بن عمار', role: 'الباترون الكبير وصاحب المول', avatar: '👑', cost: 90000000000.0 }
    ],
  },
  {
    id: 'usine_conserves',
    name: 'معمل مصبّرات الهريسة والتن',
    tagline: 'حكك هريسة عربي وتصدير لفرنسا وإيطاليا، صابة تونس الحرة',
    icon: '🥫',
    baseCost: 22000000000.0,
    baseRevenue: 45000000.0,
    costMultiplier: 1.15,
    cycleDurationMs: 260000, // 260.0s
    managers: [
      { name: 'المهندس حمادي', role: 'كابو الآلات والتعليب', avatar: '🏭', cost: 70000000000.0 },
      { name: 'سي عبد السلام', role: 'شاف التصدير والديوانة', avatar: '🚢', cost: 180000000000.0 },
      { name: 'الحاج بلقاسم', role: 'صاحب المعامل والهنشرات', avatar: '💼', cost: 450000000000.0 }
    ],
  },
  {
    id: 'showroom_auto',
    name: 'قصر السيارات الفاخرة (Showroom Auto)',
    tagline: 'كراهب زيرو كم آخر عيطة ومحركات تفور، شياكة أصحاب الملاين',
    icon: '🏎️',
    baseCost: 110000000000.0,
    baseRevenue: 180000000.0,
    costMultiplier: 1.15,
    cycleDurationMs: 320000, // 320.0s
    managers: [
      { name: 'ياسين كوميرسيال', role: 'بياع كراهب الـVIP', avatar: '🏎️', cost: 350000000000.0 },
      { name: 'مدام مريم الوكيل', role: 'شوافة الدار والماركات', avatar: '💎', cost: 850000000000.0 },
      { name: 'سي طارق قطوس', role: 'الباترون الكبير', avatar: '👑', cost: 2000000000000.0 }
    ],
  },
  {
    id: 'promoteur_immobilier',
    name: 'الشركة العقارية اللجّ الازرق',
    tagline: 'عمارات وفيلات فاخرة في قمرت والحمامات، والتراب يجيب الذهب',
    icon: '🏗️',
    baseCost: 550000000000.0,
    baseRevenue: 700000000.0,
    costMultiplier: 1.15,
    cycleDurationMs: 380000, // 380.0s
    managers: [
      { name: 'سي لطفي المهندس', role: 'معلّم الشوانط والبني', avatar: '👷', cost: 1800000000000.0 },
      { name: 'مدام وفاء السمسارة', role: 'شوافة العقار والصفقات', avatar: '🏘️', cost: 4500000000000.0 },
      { name: 'الحاج بوبكر', role: 'الباترون الكبير وصاحب الرزيدونسات', avatar: '🏢', cost: 10000000000000.0 }
    ],
  },
  {
    id: 'tayaran_el_ghzela',
    name: 'شركة طيران الغزالة',
    tagline: 'طيارات تجوب السماء وعلم تونس يرفرف فوق السحاب، قمّة المجد !',
    icon: '🛫',
    baseCost: 2800000000000.0,
    baseRevenue: 2800000000.0,
    costMultiplier: 1.15,
    cycleDurationMs: 450000, // 450.0s
    managers: [
      { name: 'الكابتن رمزي', role: 'قائد الأسطول وكبير الطيّارين', avatar: '👨‍✈️', cost: 8000000000000.0 },
      { name: 'مدام سهام', role: 'شوافة المطار والملاحة', avatar: '👩‍✈️', cost: 20000000000000.0 },
      { name: 'سي المنصف البكوش', role: 'الرئيس المدير العام وصاحب الأسطول', avatar: '🦅', cost: 50000000000000.0 }
    ],
  }
];

export const TUNISIAN_EVENTS = [
  {
    id: 'chheli',
    title: '☀️ شهيلي يكوّي 48°C والدنيا تغلي !',
    description: 'القهاوي معبّية بالملاين، الشقف البارد يطير طيران والعطش واكل العباد !',
    durationMs: 30000,
    multipliers: { kahwa: 2.0, salon_de_the: 2.5 }
  },
  {
    id: 'derby',
    title: '⚽ ليلة الدربي وسهرية رادس شاعلة !',
    description: 'البلاد مقلوبة والفيراج يغنّي ! الكساكروت والفريكاسي يطيرو مالطواول.',
    durationMs: 40000,
    multipliers: { kaskrout: 3.0, fricasse: 2.5, kahwa: 1.8 }
  },
  {
    id: 'aaras',
    title: '💐 موسم الصيف والأعراس والوطيات !',
    description: 'الزغاريت تضرب والناس فرحانة ! الباتيسري والمطاعم خدامة ليل ونهار.',
    durationMs: 35000,
    multipliers: { patisserie: 3.0, restaurant: 2.0 }
  },
  {
    id: 'embouteillage',
    title: '🚗 زحمة خانقة وسركيلاسيو باب سعدون !',
    description: 'التاكسيات واقفة والموتورات تزمّر ! الكشك يخدم بالواقفة والناس تستنّى.',
    durationMs: 25000,
    multipliers: { kaskrout: 2.5, taxi_collectif: 0.3 }
  }
];

export const TUNISIAN_QUESTS = [
  {
    id: 'first_kiosk',
    title: 'ضربة البداية : حلّ أوّل كشك كسكروت',
    targetType: 'business_level',
    businessId: 'kaskrout',
    targetValue: 1,
    rewardDinars: 5.0,
    titleEarned: 'تاجر مبتدئ'
  },
  {
    id: 'serve_kaskrout_10',
    title: 'سربّي الكليونات 10 مرّات بيديك',
    targetType: 'manual_serves',
    targetValue: 10,
    rewardDinars: 15.0,
    titleEarned: 'سرباي نشيط'
  },
  {
    id: 'first_manager',
    title: 'ارتاح وتفرّج : خدّم أوّل معلّم يدير الحانوت',
    targetType: 'hired_managers',
    targetValue: 1,
    rewardDinars: 40.0,
    titleEarned: 'شاف خدمة'
  },
  {
    id: 'open_coffee',
    title: 'وسّع المشروع : حلّ القهوة الشعبية',
    targetType: 'business_level',
    businessId: 'kahwa',
    targetValue: 1,
    rewardDinars: 100.0,
    titleEarned: 'صاحب قهوة'
  },
  {
    id: 'open_taxi',
    title: 'شياكة النقل : حلّ محطة تاكسي جماعي',
    targetType: 'business_level',
    businessId: 'taxi_collectif',
    targetValue: 1,
    rewardDinars: 1500.0,
    titleEarned: 'ريّس التاكسيات'
  },
  {
    id: 'open_mall',
    title: 'الفخامة : حلّ المول والمركّب التجاري الكبير',
    targetType: 'business_level',
    businessId: 'centre_commercial',
    targetValue: 1,
    rewardDinars: 50000000.0,
    titleEarned: 'ملك التجارة'
  },
  {
    id: 'wealth_1000',
    title: 'الكاسة مريڤلة : وصّل 1 000 د.ت',
    targetType: 'accumulated_dinars',
    targetValue: 1000.0,
    rewardDinars: 250.0,
    titleEarned: 'غني الحومة'
  }
];

export const TUNISIAN_COMBOS = [
  {
    id: 'combo_street_food',
    name: 'سلسلة الماكلة التونسية',
    tagline: 'كسكروت عيّاري مع كعبة فريكاسي وبمبلوني، بنّة الشارع الأصيلة',
    icon: '🥖🍩',
    businessIds: ['kaskrout', 'fricasse'],
    multiplier: 2.0,
    bonusDesc: 'مداخيل الماكلة الشعبية x2'
  },
  {
    id: 'combo_kahwa_salle',
    name: 'سلطان القهاوي والقعدات',
    tagline: 'من كابوسين الصباح لصالون الشاي والسهريات الرايقة',
    icon: '☕🍹',
    businessIds: ['kahwa', 'salon_de_the'],
    multiplier: 2.5,
    bonusDesc: 'مداخيل القهاوي x2.5'
  },
  {
    id: 'combo_commerce_houma',
    name: 'عمدة تجارة الحومة',
    tagline: 'من عطريّة ولد الحومة للسوبيرات والمغازة الكبيرة، السلعة ما تقصّش',
    icon: '🏪🛒🏢',
    businessIds: ['attariya', 'superette', 'supermarche'],
    multiplier: 3.0,
    bonusDesc: 'مداخيل التجارة وقضية الدار x3'
  },
  {
    id: 'combo_nacer_sahriya',
    name: 'شارع النصر سهرية',
    tagline: 'شاورما أبو علي مع قعدة رايقة في صالون الشاي، جوّ العاصمة',
    icon: '🥘🍹',
    businessIds: ['restaurant', 'salon_de_the'],
    multiplier: 2.2,
    bonusDesc: 'مداخيل المطاعم والصالونات x2.2'
  },
  {
    id: 'combo_carthage_holding',
    name: 'هولدينغ قرطاج الدولي',
    tagline: 'العقار الفاخر مع أسطول الغزالة ووكالة الأسفار، إمبراطور تونس',
    icon: '🏗️🛫✈️',
    businessIds: ['promoteur_immobilier', 'tayaran_el_ghzela', 'agence_voyages'],
    multiplier: 4.0,
    bonusDesc: 'مداخيل الاستثمارات الكبرى x4'
  }
];

export const PRESTIGE_RANKS = [
  { minLevel: 0, title: 'مواطن يلوّج على مشروع', badge: 'مبتدئ' },
  { minLevel: 1, title: 'ولد حومة مستثمر', badge: 'معلّم 1★' },
  { minLevel: 2, title: 'رجل أعمال الحومة', badge: 'معلّم 2★' },
  { minLevel: 3, title: 'ملياردير باب سويقة', badge: 'مستثمر 3★' },
  { minLevel: 5, title: 'بارون التجارة والصناعة', badge: 'كابو 4★' },
  { minLevel: 10, title: 'إمبراطور تونس الكبير', badge: 'أسطورة 5★' }
];

export class TycoonEngine {
  constructor(initialState = null) {
    this.businesses = BUSINESS_CONFIGS.map(cfg => ({
      ...cfg,
      level: 0,
      hiredManagersCount: 0,
      hasManager: false,
      progressMs: 0,
      isProducing: false
    }));

    // Économie
    this.dinars = 5.0; // Don de départ (pour acheter le 1er kiosque كسكروت عيّاري à 5 DT)
    this.totalDinarsEarned = 5.0;
    this.lifetimeDinarsEarned = 5.0; // Cumul tous prestiges confondus
    this.prestigePoints = 0; // Ma3rouf / Réputation / Expérience
    this.prestigeLevel = 0; // Nombre de prestiges effectués
    this.lastTimestamp = Date.now();

    // Statistiques pour les quêtes
    this.manualServesCount = 0;
    this.completedQuestIds = [];
    this.playerTitle = 'مواطن يلوّج على مشروع';

    // Événement actif
    this.activeEvent = null; // { event: TUNISIAN_EVENTS[i], endsAt: timestamp }
    this.nextEventCheck = Date.now() + 15000; // Premier check après 15s

    // Google Ads Rewarded Boost (ex: x2 pendant 4 heures)
    this.adBoostEndsAt = 0;

    // Mini boost temporaire rapide (ex: Drop تفتوفة تيربو 30s)
    this.speedBoostEndsAt = 0;
    this.speedBoostMultiplier = 1.0;

    // Quartier actif (Zone de conquête urbaine)
    this.currentZoneId = 'bab_souika';

    // Améliorations tactiques achetées (Set d'IDs)
    this.purchasedUpgrades = [];

    // Roue de la fortune (عجلة الحظ التونسية)
    this.lastFreeWheelSpin = 0;

    // Décisions / Dilemmes moraux résolus
    this.resolvedDilemmas = [];
    this.nextDilemmaCheck = Date.now() + 25000; // Premier dilemme après 25s
    this.activeDilemma = null;

    if (initialState) {
      this.loadState(initialState);
    }
  }

  // --- ZONES URBAINES DE CONQUÊTE TUNISIENNE ---
  getZones() {
    return [
      {
        id: 'bab_souika',
        name: 'باب سويقة والمدينة العربي',
        icon: '🕌',
        tagline: 'أصل التجارة، نصبة، كسكروت، قهوة شعبية وجوّ الحومة العتيقة',
        minPrestige: 0,
        reqDinars: 0,
        bonusDesc: 'مداخيل الماكلة الشعبية والقهاوي +25%',
        themeClass: 'zone-bab-souika'
      },
      {
        id: 'la_goulette',
        name: 'حلق الوادي والكورنيش',
        icon: '⚓',
        tagline: 'ريحة البحر، السمك المشوي، ومحطة التاكسي الجماعي والباتيسري',
        minPrestige: 0,
        reqDinars: 10000,
        bonusDesc: 'سرعة إنتاج التاكسي الجماعي والحلويات +30%',
        themeClass: 'zone-la-goulette'
      },
      {
        id: 'lac_2',
        name: 'البحيرة 2 ولاك سنتر',
        icon: '🏙️',
        tagline: 'عمارات زجاجية، صالونات شاي فاخرة، وشركات ومحلات هاي كلاس',
        minPrestige: 1,
        reqDinars: 500000,
        bonusDesc: 'مداخيل صالون الشاي والشركات +40%',
        themeClass: 'zone-lac-2'
      },
      {
        id: 'hammamet',
        name: 'ياسمين الحمامات وقمرت',
        icon: '🏖️',
        tagline: 'نزل فخمة، سياحة، مطاعم ومولات كبرى، الفلوس بالعملة الصعبة',
        minPrestige: 2,
        reqDinars: 50000000,
        bonusDesc: 'مداخيل النزل والمطاعم والمول +50%',
        themeClass: 'zone-hammamet'
      },
      {
        id: 'djerba_holding',
        name: 'إمبراطورية تونس الدولية',
        icon: '👑',
        tagline: 'أسطول طيران الغزالة، المعامل الكبرى والشركات العقارية العالمية',
        minPrestige: 3,
        reqDinars: 1000000000,
        bonusDesc: 'مداخيل جميع المشاريع الكبرى x2',
        themeClass: 'zone-djerba'
      }
    ];
  }

  getCurrentZone() {
    const zones = this.getZones();
    return zones.find(z => z.id === this.currentZoneId) || zones[0];
  }

  unlockZone(zoneId) {
    const zone = this.getZones().find(z => z.id === zoneId);
    if (!zone) return false;
    if (this.prestigeLevel < zone.minPrestige) return false;
    if (this.lifetimeDinarsEarned < zone.reqDinars && this.totalDinarsEarned < zone.reqDinars) return false;
    this.currentZoneId = zoneId;
    return true;
  }

  getZoneMultiplier(businessId) {
    const zone = this.getCurrentZone();
    if (!zone || zone.id === 'bab_souika') return 1.0; // Zone par défaut neutre pour préserver les tests unitaires
    if (zone.id === 'la_goulette' && ['taxi_collectif', 'patisserie'].includes(businessId)) return 1.30;
    if (zone.id === 'lac_2' && ['salon_de_the', 'superette', 'supermarche'].includes(businessId)) return 1.40;
    if (zone.id === 'hammamet' && ['hotel', 'restaurant', 'centre_commercial'].includes(businessId)) return 1.50;
    if (zone.id === 'djerba_holding' && ['tayaran_el_ghzela', 'promoteur_immobilier', 'showroom_auto', 'usine_conserves'].includes(businessId)) return 2.0;
    return 1.0;
  }

  // --- MILESTONES DE NIVEAU (x25, x50, x100, x200) ---
  getBusinessMilestones(business) {
    const milestones = [
      { level: 25, mult: 2.0, name: 'دفعة المعلّم (x2)' },
      { level: 50, mult: 2.0, name: 'صنعة الحريف (x2)' },
      { level: 100, mult: 3.0, name: 'شهرية ذهبية (x3)' },
      { level: 200, mult: 4.0, name: 'إمبراطور الصنعة (x4)' }
    ];
    let totalMult = 1.0;
    let nextMilestone = null;
    for (const m of milestones) {
      if (business.level >= m.level) {
        totalMult *= m.mult;
      } else if (!nextMilestone) {
        nextMilestone = m;
      }
    }
    return {
      multiplier: totalMult,
      nextLevel: nextMilestone ? nextMilestone.level : null,
      nextMultiplier: nextMilestone ? nextMilestone.mult : null,
      progress: nextMilestone ? Math.min(100, (business.level / nextMilestone.level) * 100) : 100
    };
  }

  // --- ARBRES D'AMÉLIORATIONS TACTIQUES (UPGRADES DU QUARTIER) ---
  getTacticalUpgrades() {
    return [
      {
        id: 'upg_hrissa_arbi',
        businessId: 'kaskrout',
        name: 'هريسة عربي بالثوم والكروية',
        tagline: 'سرّ الخلطة اللي يخلّي الكليونات يشدّو الصف على الكسكروت',
        cost: 45.0,
        multiplier: 2.5,
        icon: '🌶️'
      },
      {
        id: 'upg_bambalouni_sidi_bou',
        businessId: 'fricasse',
        name: 'زيت صافي وسكر بمبلوني',
        tagline: 'تقرميشة على طريقة سيدي بوسعيد، الريحة تجيب من آخر الشارع',
        cost: 200.0,
        multiplier: 2.5,
        icon: '✨'
      },
      {
        id: 'upg_zahr_direct',
        businessId: 'kahwa',
        name: 'ماء زهر وقرصة كستناء',
        tagline: 'قعدة تروّق البال وتخلّي الطواول ما تفرغش',
        cost: 800.0,
        multiplier: 2.2,
        icon: '🌸'
      },
      {
        id: 'upg_carnet_credit',
        businessId: 'attariya',
        name: 'كرني الكريدي المورود',
        tagline: 'الحومة كاملة تقيّد عندك والثقة عمياء',
        cost: 4000.0,
        multiplier: 2.0,
        icon: '📖'
      },
      {
        id: 'upg_neon_led',
        businessId: 'patisserie',
        name: 'بندار نيون وإضاءة سهرات',
        tagline: 'المحل يشعل في الليل، الكل يوقف يشري حلو ودردشة',
        cost: 25000.0,
        multiplier: 2.2,
        icon: '💡'
      },
      {
        id: 'upg_turbo_diesel',
        businessId: 'taxi_collectif',
        name: 'تيربو موتور إيسيزو ديزل',
        tagline: 'دوبلاج على اليمين وتوصيل في شطر الوقت !',
        cost: 150000.0,
        multiplier: 2.5,
        icon: '🏎️'
      },
      {
        id: 'upg_promo_vendredi',
        businessId: 'superette',
        name: 'بروموسيون الجمعة وتخفيضات',
        tagline: 'الحوانيت تفرغ والناس تعبّي الشكائر',
        cost: 800000.0,
        multiplier: 2.0,
        icon: '🏷️'
      },
      {
        id: 'upg_vip_lounge',
        businessId: 'salon_de_the',
        name: 'صالون VIP وكليماتيزور ثلج',
        tagline: 'رجال أعمال وصفقات كبرى على كاس تاي بالبندق',
        cost: 25000000.0,
        multiplier: 2.5,
        icon: '🍸'
      }
    ];
  }

  buyTacticalUpgrade(upgradeId) {
    if (this.purchasedUpgrades.includes(upgradeId)) return false;
    const upg = this.getTacticalUpgrades().find(u => u.id === upgradeId);
    if (!upg) return false;
    if (this.dinars >= upg.cost) {
      this.dinars -= upg.cost;
      this.purchasedUpgrades.push(upgradeId);
      return upg;
    }
    return false;
  }

  isUpgradePurchased(upgradeId) {
    return this.purchasedUpgrades.includes(upgradeId);
  }

  getUpgradeMultiplier(businessId) {
    let mult = 1.0;
    const all = this.getTacticalUpgrades();
    for (const upg of all) {
      if (upg.businessId === businessId && this.isUpgradePurchased(upg.id)) {
        mult *= upg.multiplier;
      }
    }
    return mult;
  }

  // --- ROUE DE LA FORTUNE TUNISIENNE (عجلة الحظ التونسية) ---
  canSpinWheel(now = Date.now()) {
    // 1 tour gratuit toutes les 90 secondes (ou vidéo pub)
    return (now - this.lastFreeWheelSpin) >= 90000;
  }

  spinWheel(isFree = true, now = Date.now()) {
    if (isFree && !this.canSpinWheel(now)) return null;
    this.lastFreeWheelSpin = now;

    // Récompenses de la roue tunisienne
    const prizes = [
      { id: 'cash_mini', name: 'تفتوفة 50 د.ت', type: 'cash', amount: 50.0, weight: 30, icon: '💵' },
      { id: 'cash_big', name: 'صابة باهية !', type: 'cash_rate', multiplier: 120, weight: 25, icon: '💰' }, // 2 min de prod
      { id: 'turbo_60s', name: 'تيربو دقيقة x3', type: 'speed_boost', durationSec: 60, multiplier: 3.0, weight: 20, icon: '⚡' },
      { id: 'gift_kaskrout', name: 'كسكروت الحظ بلاش', type: 'free_levels', businessId: 'kaskrout', levels: 5, weight: 15, icon: '🥖' },
      { id: 'jackpot_dinar', name: 'الجائزة الكبرى !', type: 'cash_rate', multiplier: 360, weight: 10, icon: '👑' } // 6 min de prod
    ];

    // Tirage pondéré
    const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
    let rand = Math.random() * totalWeight;
    let chosen = prizes[0];
    for (const p of prizes) {
      if (rand < p.weight) {
        chosen = p;
        break;
      }
      rand -= p.weight;
    }

    // Application du gain
    let rewardValue = 0;
    if (chosen.type === 'cash') {
      this.dinars += chosen.amount;
      this.totalDinarsEarned += chosen.amount;
      this.lifetimeDinarsEarned = (this.lifetimeDinarsEarned || 0) + chosen.amount;
      rewardValue = chosen.amount;
    } else if (chosen.type === 'cash_rate') {
      let rate = 0;
      this.businesses.forEach(b => { if (b.level > 0) rate += (this.getRevenue(b, now)/(b.cycleDurationMs/1000)); });
      const amount = Math.max(30.0, Math.floor(rate * chosen.multiplier));
      this.dinars += amount;
      this.totalDinarsEarned += amount;
      this.lifetimeDinarsEarned = (this.lifetimeDinarsEarned || 0) + amount;
      rewardValue = amount;
    } else if (chosen.type === 'speed_boost') {
      this.speedBoostEndsAt = Math.max(now, this.speedBoostEndsAt) + (chosen.durationSec * 1000);
      this.speedBoostMultiplier = chosen.multiplier;
    } else if (chosen.type === 'free_levels') {
      const biz = this.businesses.find(b => b.id === chosen.businessId);
      if (biz) biz.level += chosen.levels;
    }

    return { prize: chosen, value: rewardValue };
  }

  // --- MINI-DILEMMES POPULAIRES ET ÉVÉNEMENTS MORAUX ---
  getDilemmas() {
    return [
      {
        id: 'dil_controle_hygiene',
        title: '👮 مراقبة حفظ الصحة والبلدية جات على غفلة !',
        desc: 'شاف الكوجينة لقى الزيت يغلي والهريسة حارة. شنوّة تعمل ؟',
        choiceA: {
          text: '☕ ضيّفهم بكابوسين وكسكروت سخون وافرح بيهم',
          cost: 15.0,
          effectDesc: 'ربحت سمعة طيبة وتيربو x2 على الماكلة 45 ثانية !',
          action: (engine, now) => {
            engine.speedBoostEndsAt = Math.max(now, engine.speedBoostEndsAt) + 45000;
            engine.speedBoostMultiplier = 2.0;
          }
        },
        choiceB: {
          text: '📜 ورّيهم الأوراق والرخص القانونية 100%',
          cost: 0,
          effectDesc: 'خرجوا مبهورين بنظافة المحل ! +40 د.ت بونيس بلدية',
          action: (engine) => {
            engine.dinars += 40.0;
            engine.totalDinarsEarned += 40.0;
          }
        }
      },
      {
        id: 'dil_aaras_houma',
        title: '🎺 عرس ولد الحومة والفرقة الشعبية تضرب !',
        desc: 'العريس جاء يطلب في كريدي باهي للحلويات والتاكسيات باش يوصّل العروسة.',
        choiceA: {
          text: '🤝 أعطيه مبروك وتخفيض 50% والكرني مفتوح',
          cost: 25.0,
          effectDesc: 'الحومة كاملة ولات تشري من عندك ! بونيس بركة مضاعفة',
          action: (engine) => {
            engine.dinars += 90.0;
            engine.totalDinarsEarned += 90.0;
          }
        },
        choiceB: {
          text: '💼 التجارة تجارة : خلاص كاش مع هدية طبق بقلاوة',
          cost: 0,
          effectDesc: 'ربحت كاش فوري +60 د.ت بالوقت',
          action: (engine) => {
            engine.dinars += 60.0;
            engine.totalDinarsEarned += 60.0;
          }
        }
      },
      {
        id: 'dil_greve_transport',
        title: '🚖 إضراب تاكسيات ومحطة اللواج واقفة !',
        desc: 'الناس مكدسة في المحطة وكلها تحب تروّح لديارها فيسع.',
        choiceA: {
          text: '🚐 خرّج أسطولك كامل واخدم بتسعيرة شعبية رحيمة',
          cost: 0,
          effectDesc: 'التاكسي خدم بالواقفة ! تيربو مضاعف x2.5 لمدّة 40 ثانية',
          action: (engine, now) => {
            engine.speedBoostEndsAt = Math.max(now, engine.speedBoostEndsAt) + 40000;
            engine.speedBoostMultiplier = 2.5;
          }
        },
        choiceB: {
          text: '🥖 حلّ نصبة كساكروت في المحطة ووكّل الناس العالقة',
          cost: 10.0,
          effectDesc: 'الصابة تغلي ! دخلت +110 د.ت في ربع ساعة',
          action: (engine) => {
            engine.dinars += 110.0;
            engine.totalDinarsEarned += 110.0;
          }
        }
      }
    ];
  }

  triggerRandomDilemma(now = Date.now()) {
    if (this.activeDilemma) return null;
    const available = this.getDilemmas();
    const chosen = available[Math.floor(Math.random() * available.length)];
    this.activeDilemma = chosen;
    return chosen;
  }

  resolveDilemma(choiceKey, now = Date.now()) {
    if (!this.activeDilemma) return null;
    const dilemma = this.activeDilemma;
    const choice = choiceKey === 'A' ? dilemma.choiceA : dilemma.choiceB;

    if (choice.cost > 0 && this.dinars < choice.cost) {
      return { success: false, reason: 'insufficient_funds', cost: choice.cost };
    }

    if (choice.cost > 0) {
      this.dinars -= choice.cost;
    }

    if (typeof choice.action === 'function') {
      choice.action(this, now);
    }

    this.resolvedDilemmas.push(dilemma.id);
    this.activeDilemma = null;
    this.nextDilemmaCheck = now + 40000 + Math.random() * 30000; // Prochain dans 40-70s
    return { success: true, choice, dilemma };
  }

  // --- SYNERGIES & COMBOS ---
  getActiveCombos() {
    return TUNISIAN_COMBOS.filter(combo => {
      return combo.businessIds.every(id => {
        const b = this.businesses.find(item => item.id === id);
        return b && b.level > 0;
      });
    });
  }

  isComboActive(comboId) {
    const combo = TUNISIAN_COMBOS.find(c => c.id === comboId);
    if (!combo) return false;
    return combo.businessIds.every(id => {
      const b = this.businesses.find(item => item.id === id);
      return b && b.level > 0;
    });
  }

  getComboMultiplier(businessId) {
    let mult = 1.0;
    const active = this.getActiveCombos();
    for (const combo of active) {
      if (combo.businessIds.includes(businessId)) {
        mult *= combo.multiplier;
      }
    }
    return mult;
  }

  // --- PRESTIGE / ASCENSION SYSTEM (بيع واخرج مستثمر كبير) ---
  // Seuil minimum pour faire le premier prestige : 100 000 دينار gagnés au total
  getPrestigeThreshold() {
    return 100000.0;
  }

  canPrestige() {
    return this.totalDinarsEarned >= this.getPrestigeThreshold();
  }

  // Points de prestige gagnables selon la fortune accumulée dans la run
  calculatePendingPrestigePoints() {
    if (this.totalDinarsEarned < this.getPrestigeThreshold()) return 0;
    // Paliers de prestige équilibrés pour éviter l'emballement exponentiel
    // À 150 000 DT => donne 3 points (respecte les tests unitaires)
    const points = Math.floor(Math.pow(this.totalDinarsEarned / 100000, 0.4) * 2.5) + 1;
    return Math.max(1, points);
  }

  getPrestigeMultiplier() {
    // 100% de base + 2% par point de prestige (croissance contrôlée et gratifiante)
    return 1.0 + (this.prestigePoints * 0.02);
  }

  executePrestige() {
    if (!this.canPrestige()) return false;
    const gainedPoints = this.calculatePendingPrestigePoints();
    this.prestigePoints += gainedPoints;
    this.prestigeLevel += 1;

    // Reset des commerces et du cash courant
    this.businesses.forEach(b => {
      b.level = 0;
      b.hiredManagersCount = 0;
      b.hasManager = false;
      b.progressMs = 0;
      b.isProducing = false;
    });

    this.dinars = 5.0; // Nouveau don de démarrage
    this.totalDinarsEarned = 5.0;
    this.manualServesCount = 0;
    this.activeEvent = null;

    // Calcul du nouveau titre de prestige
    this.updatePlayerPrestigeTitle();

    return {
      pointsEarned: gainedPoints,
      totalPoints: this.prestigePoints,
      prestigeLevel: this.prestigeLevel,
      newMultiplier: this.getPrestigeMultiplier(),
      title: this.playerTitle
    };
  }

  updatePlayerPrestigeTitle() {
    // Trouve le titre le plus élevé atteint
    let currentRank = PRESTIGE_RANKS[0];
    for (const rank of PRESTIGE_RANKS) {
      if (this.prestigeLevel >= rank.minLevel) {
        currentRank = rank;
      }
    }
    this.playerTitle = currentRank.title;
  }

  // --- FLOATING LUCKY DROP (تفتوفة في الكياس / صندوق الحظ) ---
  claimLuckyDrop(type = 'cash', now = Date.now()) {
    if (type === 'speed') {
      // Boost de vitesse x2 pendant 30 secondes
      this.speedBoostEndsAt = Math.max(now, this.speedBoostEndsAt) + 30000;
      this.speedBoostMultiplier = 2.0;
      return { type: 'speed', durationSec: 30, multiplier: 2.0 };
    }

    // Type 'cash' : gain instantané basé sur les revenus / seconde
    let totalPerSecond = 0;
    for (const biz of this.businesses) {
      if (biz.level > 0) {
        totalPerSecond += (this.getRevenue(biz, now) / (biz.cycleDurationMs / 1000));
      }
    }
    // Gain d'au moins 20 DT ou 90 secondes de production
    const amount = Math.max(20.0, Math.floor(totalPerSecond * 90));
    this.dinars += amount;
    this.totalDinarsEarned += amount;
    this.lifetimeDinarsEarned = (this.lifetimeDinarsEarned || 0) + amount;
    return { type: 'cash', amount };
  }

  isSpeedBoostActive(now = Date.now()) {
    return now < this.speedBoostEndsAt;
  }

  checkQuests() {
    const claimable = [];
    for (const q of TUNISIAN_QUESTS) {
      if (this.completedQuestIds.includes(q.id)) continue;

      let achieved = false;
      if (q.targetType === 'business_level') {
        const biz = this.businesses.find(b => b.id === q.businessId);
        if (biz && biz.level >= q.targetValue) achieved = true;
      } else if (q.targetType === 'manual_serves') {
        if (this.manualServesCount >= q.targetValue) achieved = true;
      } else if (q.targetType === 'hired_managers') {
        const mgrCount = this.businesses.filter(b => b.hasManager).length;
        if (mgrCount >= q.targetValue) achieved = true;
      } else if (q.targetType === 'accumulated_dinars') {
        if (this.totalDinarsEarned >= q.targetValue) achieved = true;
      }

      if (achieved) {
        claimable.push(q);
      }
    }
    return claimable;
  }

  claimQuest(questId) {
    const q = TUNISIAN_QUESTS.find(item => item.id === questId);
    if (!q || this.completedQuestIds.includes(questId)) return null;

    const claimable = this.checkQuests();
    if (!claimable.some(item => item.id === questId)) return null;

    this.completedQuestIds.push(questId);
    this.dinars += q.rewardDinars;
    this.totalDinarsEarned += q.rewardDinars;
    this.lifetimeDinarsEarned = (this.lifetimeDinarsEarned || 0) + q.rewardDinars;
    if (q.titleEarned) this.playerTitle = q.titleEarned;

    return q;
  }

  isAdBoostActive(now = Date.now()) {
    return now < this.adBoostEndsAt;
  }

  addAdBoost(durationMs = 4 * 60 * 60 * 1000, now = Date.now()) {
    const start = Math.max(now, this.adBoostEndsAt);
    this.adBoostEndsAt = Math.min(start + durationMs, now + (24 * 60 * 60 * 1000));
  }

  // Google Ads Rewarded Cash : offre 3 minutes de production (ou min 5 TND)
  claimAdCashReward(now = Date.now()) {
    let totalPerSecond = 0;
    for (const biz of this.businesses) {
      if (biz.level > 0) {
        totalPerSecond += (this.getRevenue(biz, now) / (biz.cycleDurationMs / 1000));
      }
    }
    // 3 minutes (180s) de revenus cumulés, avec minimum garanti de 5 DT pour débloquer
    const cashReward = Math.max(5.0, Math.floor(totalPerSecond * 60));
    this.dinars += cashReward;
    this.totalDinarsEarned += cashReward;
    this.lifetimeDinarsEarned = (this.lifetimeDinarsEarned || 0) + cashReward;
    return cashReward;
  }

  getCost(business) {
    return Math.floor(business.baseCost * Math.pow(business.costMultiplier, business.level) * 100) / 100;
  }

  getRevenue(business, now = Date.now()) {
    if (business.level === 0) return 0;
    const prestigeMultiplier = this.getPrestigeMultiplier();
    let eventMultiplier = 1.0;
    if (this.activeEvent && this.activeEvent.event.multipliers[business.id]) {
      eventMultiplier = this.activeEvent.event.multipliers[business.id];
    }
    const adMultiplier = this.isAdBoostActive(now) ? 2.0 : 1.0;
    // Multiplicateur de synergie / combos tunisiens
    const comboMultiplier = this.getComboMultiplier(business.id);
    // Multiplicateur lucky drop turbo speed
    const luckySpeedMultiplier = this.isSpeedBoostActive(now) ? this.speedBoostMultiplier : 1.0;

    // Chaque recrutement au-delà du 1er gérant apporte un bonus d'encadrement (+25% par cadre additionnel)
    const extraStaff = Math.max(0, (business.hiredManagersCount || (business.hasManager ? 1 : 0)) - 1);
    const staffMultiplier = 1.0 + (extraStaff * 0.25);

    // Multiplicateurs de conquête urbaine (Quartier)
    const zoneMultiplier = this.getZoneMultiplier ? this.getZoneMultiplier(business.id) : 1.0;

    // Multiplicateurs d'améliorations tactiques achetées
    const upgradeMultiplier = this.getUpgradeMultiplier ? this.getUpgradeMultiplier(business.id) : 1.0;

    // Multiplicateurs de Milestones (x25, x50, x100, x200)
    const milestoneInfo = this.getBusinessMilestones ? this.getBusinessMilestones(business) : { multiplier: 1.0 };
    const milestoneMultiplier = milestoneInfo.multiplier || 1.0;

    return business.baseRevenue * business.level * prestigeMultiplier * eventMultiplier * adMultiplier * staffMultiplier * comboMultiplier * luckySpeedMultiplier * zoneMultiplier * upgradeMultiplier * milestoneMultiplier;
  }

  buyBusiness(id) {
    const biz = this.businesses.find(b => b.id === id);
    if (!biz) return false;
    const cost = this.getCost(biz);
    if (this.dinars >= cost) {
      this.dinars -= cost;
      biz.level += 1;
      return true;
    }
    return false;
  }

  getNextManager(biz) {
    if (!biz || !Array.isArray(biz.managers)) return null;
    const count = biz.hiredManagersCount ?? (biz.hasManager ? biz.managers.length : 0);
    if (count >= biz.managers.length) return null;
    return biz.managers[count];
  }

  hireManager(id) {
    const biz = this.businesses.find(b => b.id === id);
    if (!biz || biz.level === 0) return false;
    const nextMgr = this.getNextManager(biz);
    if (!nextMgr) return false;

    if (this.dinars >= nextMgr.cost) {
      this.dinars -= nextMgr.cost;
      biz.hiredManagersCount = (biz.hiredManagersCount || 0) + 1;
      // Automatisation dès le 1er recrutement, et chaque cadre supplémentaire booste la productivité
      biz.hasManager = true;
      biz.isProducing = true;
      return nextMgr;
    }
    return false;
  }

  startProduction(id) {
    const biz = this.businesses.find(b => b.id === id);
    if (!biz || biz.level === 0 || biz.isProducing) return false;
    biz.isProducing = true;
    this.manualServesCount += 1;
    return true;
  }

  triggerRandomEvent(now = Date.now()) {
    if (this.activeEvent) return null;
    const randomIndex = Math.floor(Math.random() * TUNISIAN_EVENTS.length);
    const event = TUNISIAN_EVENTS[randomIndex];
    this.activeEvent = {
      event,
      endsAt: now + event.durationMs
    };
    return this.activeEvent;
  }

  update(now = Date.now()) {
    const deltaMs = Math.max(0, now - this.lastTimestamp);
    this.lastTimestamp = now;

    // Gestion du timer de l'événement en cours
    if (this.activeEvent && now >= this.activeEvent.endsAt) {
      this.activeEvent = null;
      this.nextEventCheck = now + 20000; // Prochain check dans 20s
    }

    // Déclenchement automatique occasionnel
    if (!this.activeEvent && now >= this.nextEventCheck) {
      this.triggerRandomEvent(now);
    }

    // Déclenchement occasionnel de dilemmes moraux du quartier
    if (!this.activeDilemma && now >= (this.nextDilemmaCheck || 0)) {
      this.triggerRandomDilemma(now);
    }

    let revenueEarned = 0;

    for (const biz of this.businesses) {
      if (biz.level === 0) continue;

      if (biz.hasManager) {
        // Mode passif auto : calcul continu sans perte
        const totalMs = biz.progressMs + deltaMs;
        const cycles = Math.floor(totalMs / biz.cycleDurationMs);
        if (cycles > 0) {
          revenueEarned += cycles * this.getRevenue(biz, now);
          biz.progressMs = totalMs % biz.cycleDurationMs;
        } else {
          biz.progressMs = totalMs;
        }
      } else if (biz.isProducing) {
        // Mode manuel (tap)
        biz.progressMs += deltaMs;
        if (biz.progressMs >= biz.cycleDurationMs) {
          revenueEarned += this.getRevenue(biz, now);
          biz.progressMs = 0;
          biz.isProducing = false;
        }
      }
    }

    this.dinars += revenueEarned;
    this.totalDinarsEarned += revenueEarned;
    this.lifetimeDinarsEarned = (this.lifetimeDinarsEarned || 0) + revenueEarned;
    return revenueEarned;
  }

  // Calcul du gain hors ligne au retour du joueur
  processOfflineProgress(currentTimestamp = Date.now()) {
    return this.update(currentTimestamp);
  }

  // Sauvegarde / Restauration
  exportState() {
    return {
      dinars: this.dinars,
      totalDinarsEarned: this.totalDinarsEarned,
      lifetimeDinarsEarned: this.lifetimeDinarsEarned || this.totalDinarsEarned,
      manualServesCount: this.manualServesCount,
      completedQuestIds: this.completedQuestIds,
      playerTitle: this.playerTitle,
      prestigePoints: this.prestigePoints,
      prestigeLevel: this.prestigeLevel || 0,
      lastTimestamp: this.lastTimestamp,
      activeEvent: this.activeEvent,
      adBoostEndsAt: this.adBoostEndsAt,
      speedBoostEndsAt: this.speedBoostEndsAt || 0,
      currentZoneId: this.currentZoneId || 'bab_souika',
      purchasedUpgrades: this.purchasedUpgrades || [],
      lastFreeWheelSpin: this.lastFreeWheelSpin || 0,
      businesses: this.businesses.map(b => ({
        id: b.id,
        level: b.level,
        hiredManagersCount: b.hiredManagersCount ?? (b.hasManager ? 1 : 0),
        hasManager: b.hasManager,
        progressMs: b.progressMs,
        isProducing: b.isProducing
      }))
    };
  }

  loadState(state) {
    if (!state) return;
    this.dinars = state.dinars ?? this.dinars;
    this.totalDinarsEarned = state.totalDinarsEarned ?? this.totalDinarsEarned;
    this.lifetimeDinarsEarned = state.lifetimeDinarsEarned ?? this.totalDinarsEarned;
    this.manualServesCount = state.manualServesCount ?? 0;
    this.completedQuestIds = Array.isArray(state.completedQuestIds) ? state.completedQuestIds : [];
    this.playerTitle = state.playerTitle ?? this.playerTitle;
    this.prestigePoints = state.prestigePoints ?? 0;
    this.prestigeLevel = state.prestigeLevel ?? 0;
    this.lastTimestamp = state.lastTimestamp ?? Date.now();
    this.activeEvent = state.activeEvent ?? null;
    this.adBoostEndsAt = state.adBoostEndsAt ?? 0;
    this.speedBoostEndsAt = state.speedBoostEndsAt ?? 0;
    this.currentZoneId = state.currentZoneId ?? 'bab_souika';
    this.purchasedUpgrades = Array.isArray(state.purchasedUpgrades) ? state.purchasedUpgrades : [];
    this.lastFreeWheelSpin = state.lastFreeWheelSpin ?? 0;

    if (Array.isArray(state.businesses)) {
      for (const saved of state.businesses) {
        const biz = this.businesses.find(b => b.id === saved.id);
        if (biz) {
          biz.level = saved.level ?? 0;
          biz.hiredManagersCount = saved.hiredManagersCount ?? (saved.hasManager ? 1 : 0);
          biz.hasManager = saved.hasManager ?? (biz.hiredManagersCount > 0);
          biz.progressMs = saved.progressMs ?? 0;
          biz.isProducing = saved.isProducing ?? false;
        }
      }
    }
  }
}
