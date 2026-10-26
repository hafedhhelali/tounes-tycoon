/**
 * Tounes Tycoon - Core Idle Game Engine
 * © EOLabs 2026. Pur JavaScript, zéro dépendance, zéro dérive de timer.
 */

export const BUSINESS_CONFIGS = [
  {
    id: 'kaskrout',
    name: 'نصبة كسكروت عياري',
    tagline: 'بالتنّ والزيتون وكعبة العظام المروبة، عضّة تدوّخ وتنسّيك في همّ الدنيا !',
    icon: '🥖',
    baseCost: 5.0, // Don de départ 5 DT permet l'achat immédiat
    baseRevenue: 0.8,
    costMultiplier: 1.07,
    cycleDurationMs: 600, // 0.6s
    managers: [
      { name: 'عمّك الصادق', role: 'معلّم القصّان', avatar: '👨‍🍳', cost: 25.0 }
    ],
  },
  {
    id: 'fricasse',
    name: 'فريكاسي وبمبلوني',
    tagline: 'كعبة مقرمشة تعوّم في العسل وشاربة الزيت بالبركة، تعضّ الكعبة تتفرشك !',
    icon: '🍩',
    baseCost: 30.0,
    baseRevenue: 3.5,
    costMultiplier: 1.08,
    cycleDurationMs: 1400, // 1.4s
    managers: [
      { name: 'الباجي البمبلوني', role: 'فنّان البمبلوني', avatar: '🧑‍🍳', cost: 150.0 }
    ],
  },
  {
    id: 'kahwa',
    name: 'قهوة شعبية',
    tagline: 'تاي منعنع بالبندق، شيشة تفاح بالمعسل والجمر، وطرح شكبة كارطة للصباح !',
    icon: '☕',
    baseCost: 120.0,
    baseRevenue: 14.0,
    costMultiplier: 1.09,
    cycleDurationMs: 2500, // 2.5s
    managers: [
      { name: 'الناصر القارصون', role: 'سرباي الصالة', avatar: '🤵', cost: 600.0 },
      { name: 'سي الهاشمي', role: 'مولى القهوة', avatar: '☕', cost: 1800.0 }
    ],
  },
  {
    id: 'attariya',
    name: 'عطريّة ولد الحومة',
    tagline: 'كسكسي، هريسة دياري، زيت زيتونة، حكك تن ومعجون، وشكارة السميد حاضرة.',
    icon: '🏪',
    baseCost: 800.0,
    baseRevenue: 55.0,
    costMultiplier: 1.10,
    cycleDurationMs: 5000, // 5.0s
    managers: [
      { name: 'منصف العطّار', role: 'مولى الحانوت', avatar: '🏬', cost: 4000.0 }
    ],
  },
  {
    id: 'fruits_de_mer',
    name: 'مارشي فواكه البحر والسمك الطازج',
    tagline: 'قرنيط، كروفيت شايح، حوت مشوي وسردينة ذهبية من أعماق البحر المتوسط !',
    icon: '🦐',
    baseCost: 18000.0,
    baseRevenue: 750.0,
    costMultiplier: 1.10,
    cycleDurationMs: 12000,
    managers: [
      { name: 'الشاف عمار البحري', role: 'ريس المارشي والمطعم', avatar: '👨‍🍳', cost: 75000.0 },
      { name: 'المعلم كمال الصياد', role: 'قبطان الشباك والقرنيط', avatar: '🎣', cost: 220000.0 }
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
      { name: 'الحاج عمر', role: 'حلواني الفور', avatar: '👳', cost: 20000.0 },
      { name: 'خالتي زبيدة', role: 'مسؤولة التوزيع', avatar: '👩‍🍳', cost: 50000.0 }
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
      { name: 'كمال تيربو', role: 'شاف الشوفيرية', avatar: '🕶️', cost: 120000.0 }
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
      { name: 'سي رضا', role: 'شاف الرّفوف', avatar: '👔', cost: 1500000.0 }
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
      { name: 'طارق الشاف', role: 'كابو المبيعات', avatar: '📋', cost: 3500000.0 },
      { name: 'كريم الشريف', role: 'معلّم التوزيع', avatar: '💼', cost: 9000000.0 }
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
      { name: 'وسيم الكابتن', role: 'شاف الصالة', avatar: '🤵', cost: 20000000.0 },
      { name: 'رامي الباريستا', role: 'باريستا الكوكتيل', avatar: '🍸', cost: 50000000.0 }
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
      { name: 'المعلم مبروك', role: 'صنايعي الشواية', avatar: '🔥', cost: 110000000.0 },
      { name: 'الشاف فتحي', role: 'معلّم الكوجينة', avatar: '👨‍🍳', cost: 280000000.0 }
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
      { name: 'أنيس التيكي', role: 'شاف الحجوزات', avatar: '🎫', cost: 600000000.0 },
      { name: 'سي منير اللقلاق', role: 'الباترون', avatar: '🧳', cost: 1500000000.0 }
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
      { name: 'مدام سيرين', role: 'مسؤولة الاستقبال', avatar: '👩‍💼', cost: 3000000000.0 },
      { name: 'ميسيو برهان', role: 'مدير النزل', avatar: '🎩', cost: 8000000000.0 }
    ],
  },
  {
    id: 'centre_commercial',
    name: 'المول والمركّب التجاري الكبير',
    tagline: 'إسكالاتور وماركات ودور سينما، الدنيا تغلي والفلوس تصبّ',
    icon: '🛍️',
    baseCost: 4500000.0,
    baseRevenue: 45000.0,
    costMultiplier: 1.13,
    cycleDurationMs: 150000, // 150.0s
    managers: [
      { name: 'المهندس مراد', role: 'كابو الصيانة', avatar: '👷', cost: 15000000.0 },
      { name: 'مدام نادية', role: 'مديرة الماركات', avatar: '👠', cost: 35000000.0 },
      { name: 'سي خليل بن عمار', role: 'الباترون وصاحب المول', avatar: '👑', cost: 80000000.0 }
    ],
  },
  {
    id: 'usine_conserves',
    name: 'معمل مصبّرات الهريسة والتن',
    tagline: 'حكك هريسة عربي وتصدير لفرنسا وإيطاليا، خيرات تونس الحرة',
    icon: '🥫',
    baseCost: 15000000.0,
    baseRevenue: 120000.0,
    costMultiplier: 1.13,
    cycleDurationMs: 180000, // 180.0s
    managers: [
      { name: 'المهندس حمادي', role: 'شاف الإنتاج', avatar: '🏭', cost: 50000000.0 },
      { name: 'سي عبد السلام', role: 'شاف التصدير', avatar: '🚢', cost: 120000000.0 },
      { name: 'الحاج بلقاسم', role: 'مالك المصانع', avatar: '💼', cost: 250000000.0 }
    ],
  },
  {
    id: 'showroom_auto',
    name: 'قصر السيارات الفاخرة (Showroom Auto)',
    tagline: 'كراهب زيرو كم آخر عيطة ومحركات تفور، شياكة أصحاب الملاين',
    icon: '🏎️',
    baseCost: 45000000.0,
    baseRevenue: 320000.0,
    costMultiplier: 1.14,
    cycleDurationMs: 210000, // 210.0s
    managers: [
      { name: 'ياسين كوميرسيال', role: 'مستشار السيارات', avatar: '🏎️', cost: 150000000.0 },
      { name: 'مدام مريم الوكيل', role: 'مديرة المبيعات', avatar: '💎', cost: 350000000.0 },
      { name: 'سي طارق قطوس', role: 'الباترون', avatar: '👑', cost: 800000000.0 }
    ],
  },
  {
    id: 'promoteur_immobilier',
    name: 'الشركة العقارية اللجّ الازرق',
    tagline: 'عمارات وفيلات فاخرة في قمرت والحمامات، والتراب يجيب الذهب',
    icon: '🏗️',
    baseCost: 120000000.0,
    baseRevenue: 750000.0,
    costMultiplier: 1.14,
    cycleDurationMs: 240000, // 240.0s
    managers: [
      { name: 'سي لطفي المهندس', role: 'مهندس البناء', avatar: '👷', cost: 400000000.0 },
      { name: 'مدام وفاء السمسارة', role: 'مستشارة العقار', avatar: '🏘️', cost: 900000000.0 },
      { name: 'الحاج بوبكر', role: 'الباترون وصاحب الرزيدونسات', avatar: '🏢', cost: 2000000000.0 }
    ],
  },
  {
    id: 'tayaran_el_ghzela',
    name: 'شركة طيران الغزالة',
    tagline: 'طيارات تجوب السماء وعلم تونس يرفرف فوق السحاب، قمّة المجد !',
    icon: '🛫',
    baseCost: 350000000.0,
    baseRevenue: 1800000.0,
    costMultiplier: 1.14,
    cycleDurationMs: 300000, // 300.0s
    managers: [
      { name: 'الكابتن رمزي', role: 'قائد الأسطول', avatar: '👨‍✈️', cost: 1200000000.0 },
      { name: 'مدام سهام', role: 'مديرة الملاحة', avatar: '👩‍✈️', cost: 2800000000.0 },
      { name: 'سي المنصف البكوش', role: 'الرئيس المدير العام', avatar: '🦅', cost: 6000000000.0 }
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
    title: 'سربّي الحرفاء 10 مرّات بيديك',
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

export const LEAGUE_TIERS = [
  {
    id: 'houma',
    name: 'دوري الحومة والشوانط',
    badge: '🥉 حومة',
    minDps: 0,
    rivals: [
      { name: 'منصف العطوف', avatar: '🏪', baseDps: 1.2 },
      { name: 'صالح الكسكروتي', avatar: '🥖', baseDps: 3.5 },
      { name: 'حمادي بيجو', avatar: '🛵', baseDps: 8.0 },
      { name: 'خالتي شريفة', avatar: '👵', baseDps: 15.0 },
      { name: 'وليد ترينكا', avatar: '🎲', baseDps: 25.0 }
    ],
    promotionReward: { dinars: 500, prestige: 5 }
  },
  {
    id: 'medina',
    name: 'رابطة حراير ومعلّمي الأسواق',
    badge: '🥈 مدينة',
    minDps: 100,
    rivals: [
      { name: 'سفيان بيستاش', avatar: '🥜', baseDps: 150 },
      { name: 'سي الهاشمي القهواجي', avatar: '☕', baseDps: 450 },
      { name: 'خالتي منانة البقلاوجية', avatar: '🍯', baseDps: 1200 },
      { name: 'لمين اللواج', avatar: '🚐', baseDps: 2800 },
      { name: 'منير الكاشير', avatar: '💳', baseDps: 6000 }
    ],
    promotionReward: { dinars: 25000, prestige: 20 }
  },
  {
    id: 'joumhouriya',
    name: 'دوري حيتان الأعمال وباب سويقة',
    badge: '🥇 وطني',
    minDps: 10000,
    rivals: [
      { name: 'مدام درّة الكوليكسيون', avatar: '💅', baseDps: 25000 },
      { name: 'كمال تيربو النقل', avatar: '🏎️', baseDps: 80000 },
      { name: 'الحاج علي بن سالم', avatar: '🕋', baseDps: 250000 },
      { name: 'طارق الشاف', avatar: '🏢', baseDps: 700000 },
      { name: 'وسيم صالون الشاي', avatar: '🍹', baseDps: 1800000 }
    ],
    promotionReward: { dinars: 1000000, prestige: 100 }
  },
  {
    id: 'elite',
    name: 'رابطة أباطرة تونس الكبار',
    badge: '👑 نخبة تونس',
    minDps: 2000000,
    rivals: [
      { name: 'سي مروان قرطاج', avatar: '🏛️', baseDps: 5000000 },
      { name: 'فوزي بنزين الطيران', avatar: '🛫', baseDps: 15000000 },
      { name: 'ليلى غولد القابضة', avatar: '💎', baseDps: 45000000 },
      { name: 'المعلم مبروك الشامي', avatar: '👑', baseDps: 120000000 },
      { name: 'البارون الأزرق سيدي بوسعيد', avatar: '🏰', baseDps: 350000000 }
    ],
    promotionReward: { dinars: 100000000, prestige: 500 }
  }
];

export const DAILY_LOGIN_REWARDS = [
  { day: 1, title: 'فتّوح يا رزّاق', icon: '🥐', dinars: 50, prestige: 0, desc: '50 د.ت كاش تسمّي بيها باسم الله' },
  { day: 2, title: 'عرق الجبين', icon: '☕', dinars: 250, prestige: 0, speedBoostMs: 900000, desc: '250 د.ت + تيربو x2 ربع ساعة' },
  { day: 3, title: 'بركة ولاد الحومة', icon: '🥖', dinars: 1200, prestige: 3, desc: '1 200 د.ت + 3 نقاط معروف' },
  { day: 4, title: 'خميس وعاشور', icon: '🧿', dinars: 5000, prestige: 0, adBoostMs: 1800000, desc: '5 000 د.ت + إنتاج مضاعف لنصف ساعة' },
  { day: 5, title: 'صابة الجمعة الفاضلة', icon: '🍯', dinars: 20000, prestige: 10, desc: '20 000 د.ت + 10 نقاط معروف' },
  { day: 6, title: 'الحطة والهمّة', icon: '🏎️', dinars: 100000, prestige: 0, speedBoostMs: 3600000, desc: '100 000 د.ت + تيربو x4 لساعة كاملة' },
  { day: 7, title: 'كنز سيدي محرز !', icon: '👑', dinars: 500000, prestige: 25, titleUnlock: 'سلطان التجارة', desc: '500 000 د.ت + 25 معروف + لقب سلطان التجارة' }
];

export const DAILY_CHALLENGES_POOL = [
  { id: 'dc_serves', title: 'سربيس سخون', desc: 'سربّي 30 حريف يدويّا باليد', target: 30, type: 'serves', rewardDinars: 500, rewardPrestige: 2 },
  { id: 'dc_upgrades', title: 'عمارة واستثمار', desc: 'اشري أو طلّع 3 مستويات في المشاريع', target: 3, type: 'upgrades', rewardDinars: 1200, rewardPrestige: 3 },
  { id: 'dc_chkobba', title: 'معلّم كارطة', desc: 'اربح طرح شكبة في القهوة', target: 1, type: 'chkobba_wins', rewardDinars: 2500, rewardPrestige: 5 },
  { id: 'dc_spin', title: 'عجلة الحظ', desc: 'دوّر عجلة الحظ مرّة اليوم', target: 1, type: 'wheel_spins', rewardDinars: 800, rewardPrestige: 2 }
];

export const PRESTIGE_RANKS = [
  { minLevel: 0, title: 'مواطن يلوّج على مشروع', badge: 'مبتدئ' },
  { minLevel: 1, title: 'ولد حومة مستثمر', badge: 'معلّم 1★' },
  { minLevel: 2, title: 'رجل أعمال الحومة', badge: 'معلّم 2★' },
  { minLevel: 3, title: 'ملياردير باب سويقة', badge: 'مستثمر 3★' },
  { minLevel: 5, title: 'بارون التجارة والصناعة', badge: 'كابو 4★' },
  { minLevel: 10, title: 'إمبراطور تونس الكبير', badge: 'أسطورة 5★', isLegend: true }
];

// Niveaux du Joueur basés sur le nombre de villes tunisiennes ouvertes (1 à 14)
export const PLAYER_CITY_LEVELS = [
  { level: 1, title: 'تاجر مبتدئ في تونس العاصمة 🇹🇳', badge: 'المستوى 1', minCities: 1 },
  { level: 2, title: 'مستثمر قنال بنزرت ⛵', badge: 'المستوى 2', minCities: 2 },
  { level: 3, title: 'أمير ياسمين نابل والحمامات 🏖️', badge: 'المستوى 3', minCities: 3 },
  { level: 4, title: 'سيّد قمح وخيرات باجة 🧀', badge: 'المستوى 4', minCities: 4 },
  { level: 5, title: 'فارس قصبة الكاف العالية 🏰', badge: 'المستوى 5', minCities: 5 },
  { level: 6, title: 'لورد بوجعفر وجوهرة سوسة 💎', badge: 'المستوى 6', minCities: 6 },
  { level: 7, title: 'قبطان رباط المنستير والمهدية ⚓', badge: 'المستوى 7', minCities: 7 },
  { level: 8, title: 'عمدة الأغالبة وعطور القيروان 🕌', badge: 'المستوى 8', minCities: 8 },
  { level: 9, title: 'زعيم صناعات وتجارة صفاقس 🏭', badge: 'المستوى 9', minCities: 9 },
  { level: 10, title: 'معلّم قفصة والمناجم الكبرى ⛏️', badge: 'المستوى 10', minCities: 10 },
  { level: 11, title: 'سلطان دقلة وواحات توزر 🌴', badge: 'المستوى 11', minCities: 11 },
  { level: 12, title: 'حاكم خليج وموانئ قابس 🌊', badge: 'المستوى 12', minCities: 12 },
  { level: 13, title: 'بارون قصور مدنين وجرجيس 🏺', badge: 'المستوى 13', minCities: 13 },
  { level: 14, title: 'حاكم سبيطلة والآثار الرومانية 🏛️', badge: 'المستوى 14', minCities: 14 },
  { level: 15, title: 'سفير التجارة المغاربية في عنابة 🇩🇿', badge: 'المستوى 15', minCities: 15 },
  { level: 16, title: 'زعيم أسواق العبور في طرابلس 🇱🇾', badge: 'المستوى 16', minCities: 16 },
  { level: 17, title: 'إمبراطور الهولدينغ الوطني الشامل 👑', badge: 'المستوى 17 (القمة)', minCities: 17 }
];

export const TUNISIAN_CITIES = [
  {
    id: 'tunis',
    name: 'تونس',
    icon: '🕌',
    tagline: 'نقطة البداية، أصل التجارة، نصبة كسكروت وفريكاسي في قلب المدينة العربي',
    costDinars: 0,
    criteriaDesc: 'نقطة البداية',
    minPrestige: 0,
    reqDinars: 0,
    bonusDesc: 'مشاريع العاصمة : كسكروت، فريكاسي، قهوة (+25%)',
    themeClass: 'zone-bab-souika'
  },
  {
    id: 'bizerte',
    name: 'بنزرت',
    icon: '⛵',
    tagline: 'قنال بنزرت، الحوت المشوي، الكورنيش العتيق وحركة الميناء',
    costDinars: 2500,
    criteriaDesc: '2,500 د.ت + مشروع واحد مستوى 10',
    minPrestige: 0,
    reqDinars: 2500,
    reqBizLevel: { count: 1, minLevel: 10 },
    bonusDesc: 'مشاريع بنزرت والميناء (+25%)',
    themeClass: 'zone-bizerte'
  },
  {
    id: 'nabeul_hammamet',
    name: 'نابل',
    icon: '🏖️',
    tagline: 'الفخار، ياسمين الحمامات، زهر نابل والنزل السياحية الفاخرة',
    costDinars: 8000,
    criteriaDesc: '8,000 د.ت + 1 معلّم / مدير مسيّر',
    minPrestige: 0,
    reqDinars: 8000,
    reqManagers: 1,
    bonusDesc: 'سياحة الحمامات وحلويات نابل (+30%)',
    themeClass: 'zone-hammamet'
  },
  {
    id: 'beja',
    name: 'باجة',
    icon: '🧀',
    tagline: 'مطماطة الشمال، قمح وسمن، مخارق وزلابية وجبن باجة المعتّق',
    costDinars: 22000,
    criteriaDesc: '22,000 د.ت + مشروعين مستوى 20',
    minPrestige: 0,
    reqDinars: 22000,
    reqBizLevel: { count: 2, minLevel: 20 },
    bonusDesc: 'الخيرات والمخبوزات الباجية (+30%)',
    themeClass: 'zone-beja'
  },
  {
    id: 'le_kef',
    name: 'الكاف',
    icon: '🏰',
    tagline: 'القصبة العالية، سيدي بومخلوف، برنوس الجبل والتجارة العريقة',
    costDinars: 60000,
    criteriaDesc: '60,000 د.ت + كسب 50 ألف دينار جملي',
    minPrestige: 0,
    reqDinars: 60000,
    reqTotalDinars: 50000,
    bonusDesc: 'مشاريع الجبل والقصبة (+35%)',
    themeClass: 'zone-le-kef'
  },
  {
    id: 'sousse',
    name: 'سوسة',
    icon: '💎',
    tagline: 'بوجعفر، القنطاوي، التجارة البحرية وصالونات الشاي العصرية',
    costDinars: 150000,
    criteriaDesc: '150,000 د.ت + برستيج 1',
    minPrestige: 1,
    reqDinars: 150000,
    bonusDesc: 'صالونات سوسة والمطاعم الفاخرة (+35%)',
    themeClass: 'zone-sousse'
  },
  {
    id: 'monastir_mahdia',
    name: 'المنستير',
    icon: '⚓',
    tagline: 'رباط المنستير، سقيفة المهدية الكحلة والحوت الشامي الأزرق',
    costDinars: 350000,
    criteriaDesc: '350,000 د.ت + 5 معلّمين مسيّرين',
    minPrestige: 0,
    reqDinars: 350000,
    reqManagers: 5,
    bonusDesc: 'مشاريع الساحل والنزل الكبرى (+40%)',
    themeClass: 'zone-monastir'
  },
  {
    id: 'kairouan',
    name: 'القيروان',
    icon: '🕌',
    tagline: 'فسقية الأغالبة، مقروض القيروان والزرابي الصوفية الفاخرة',
    costDinars: 800000,
    criteriaDesc: '800,000 د.ت + 4 مشاريع مستوى 35',
    minPrestige: 0,
    reqDinars: 800000,
    reqBizLevel: { count: 4, minLevel: 35 },
    bonusDesc: 'حلويات القيروان والحرف التقليدية (+40%)',
    themeClass: 'zone-kairouan'
  },
  {
    id: 'sbeitla',
    name: 'سبيطلة',
    icon: '🏛️',
    tagline: 'عاصمة سفيطلة الرومانية، المعابد الثلاثة، الكابيتول التاريخي وزيت الزيتون العريق',
    costDinars: 600000,
    criteriaDesc: '600,000 د.ت + مشروع واحد مستوى 30',
    minPrestige: 0,
    reqDinars: 600000,
    reqBizLevel: { count: 1, minLevel: 30 },
    bonusDesc: 'الآثار والتجارة الفلاحية الرومانية (+40%)',
    themeClass: 'zone-sbeitla'
  },
  {
    id: 'annaba',
    name: 'عنابة (الجزائر)',
    icon: '🇩🇿',
    tagline: 'بونة الجزائرية، الميناء التجاري العريق، الفولاذ وسوق التبادل الحدودي المغاربي',
    costDinars: 80000000,
    criteriaDesc: '80,000,000 د.ت + فتح الكاف وباجة',
    minPrestige: 3,
    reqDinars: 80000000,
    bonusDesc: 'التجارة المغاربية والاستيراد والتصدير مع الجزائر (x2.5)',
    themeClass: 'zone-annaba'
  },
  {
    id: 'tripoli',
    name: 'طرابلس (ليبيا)',
    icon: '🇱🇾',
    tagline: 'عروس البحر، باب البحر، أسواق الذهب والتجارة والعبور الدولي المغاربي',
    costDinars: 120000000,
    criteriaDesc: '120,000,000 د.ت + فتح مدنين',
    minPrestige: 5,
    reqDinars: 120000000,
    bonusDesc: 'التجارة والعبور الدولي مع ليبيا الشقيقة (x3)',
    themeClass: 'zone-tripoli'
  },
  {
    id: 'sfax',
    name: 'صفاقس',
    icon: '🏭',
    tagline: 'باب الديوان، الزيتونة المباركة، الصناعات الكبرى والخدمة الحارة',
    costDinars: 2000000,
    criteriaDesc: '2,000,000 د.ت + برستيج 2',
    minPrestige: 2,
    reqDinars: 2000000,
    bonusDesc: 'الصناعات الصفاقسية والتجارة الكبرى (+50%)',
    themeClass: 'zone-sfax'
  },
  {
    id: 'gafsa',
    name: 'قفصة',
    icon: '⛏️',
    tagline: 'الحوض المنجمي، البركة الرومانية ونخيل قفصة الجبلي التاريخي',
    costDinars: 4500000,
    criteriaDesc: '4,500,000 د.ت',
    minPrestige: 0,
    reqDinars: 4500000,
    bonusDesc: 'نقل قفصة وتجارتها المركزية (+50%)',
    themeClass: 'zone-gafsa'
  },
  {
    id: 'tozeur',
    name: 'توزر',
    icon: '🌴',
    tagline: 'دقلة النور، الشبيكة وتامغزة، والواحات الصحراوية العالمية',
    costDinars: 10000000,
    criteriaDesc: '10,000,000 د.ت + مشروع واحد مستوى 100',
    minPrestige: 0,
    reqDinars: 10000000,
    reqBizLevel: { count: 1, minLevel: 100 },
    bonusDesc: 'سياحة الصحراء ووكالات الأسفار (+60%)',
    themeClass: 'zone-tozeur'
  },
  {
    id: 'gabes',
    name: 'قابس',
    icon: '🌊',
    tagline: 'الحناء الجبسية، واحة قابس الشاطئية والموانئ التجارية الجنوبية',
    costDinars: 25000000,
    criteriaDesc: '25,000,000 د.ت + 10 معلّمين مسيّرين',
    minPrestige: 0,
    reqDinars: 25000000,
    reqManagers: 10,
    bonusDesc: 'سوق قابس والمجمعات الصناعية (+75%)',
    themeClass: 'zone-gabes'
  },
  {
    id: 'medenine_zarzis',
    name: 'مدنين',
    icon: '🏺',
    tagline: 'قصور مدنين، بحر جرجيس والزيتون الروماني العريق',
    costDinars: 60000000,
    criteriaDesc: '60,000,000 د.ت + برستيج 3',
    minPrestige: 3,
    reqDinars: 60000000,
    bonusDesc: 'الموانئ والتجارة المغاربية الجنوبية (x2)',
    themeClass: 'zone-medenine'
  },
  {
    id: 'djerba_holding',
    name: 'جربة',
    icon: '👑',
    tagline: 'جزيرة الأحلام ومقر الهولدينغ التونسي الوطني الدولي الشامل',
    costDinars: 150000000,
    criteriaDesc: '150,000,000 د.ت + لقب الأسطورة (برستيج 10)',
    minPrestige: 10,
    reqDinars: 150000000,
    reqLegendTitle: true,
    bonusDesc: 'مضاعف الهولدينغ الوطني الشامل لجميع المداخيل (x5) !',
    holdingMultiplier: 5.0,
    themeClass: 'zone-djerba'
  }
];

export class TycoonEngine {
  constructor(initialState = null) {
    this.BUSINESS_CONFIGS = BUSINESS_CONFIGS;
    this.cityBusinesses = {};
    this.cityBalances = { tunis: 5.0 };
    this.businesses = this.initCityBusinesses('tunis');

    // Économie
    this.dinars = 5.0; // السيولة في الجيب (Cash disponible)
    this.bankBalance = 0.0; // الرصيد في البنك (Compte bancaire sécurisé)
    this.totalDinarsEarned = 5.0;
    this.lifetimeDinarsEarned = 5.0; // Cumul tous prestiges confondus
    this.prestigePoints = 0; // Ma3rouf / Réputation / Expérience
    this.prestigeLevel = 0; // Nombre de prestiges effectués
    this.lastTimestamp = Date.now();
    this.createdAt = Date.now();
    this.totalPlayTimeSeconds = 0;

    // Profil Joueur & Empire
    this.empireName = 'إمبراطورية تونس للخدمات';

    // Statistiques pour les quêtes
    this.manualServesCount = 0;
    this.completedQuestIds = [];
    this.playerLevel = 1; // Niveau 1 au départ
    this.playerTitle = 'مواطن يلوّج على مشروع';

    // Événement actif
    this.activeEvent = null; // { event: TUNISIAN_EVENTS[i], endsAt: timestamp }
    this.nextEventCheck = Date.now() + 15000; // Premier check après 15s

    // Google Ads Rewarded Boost (ex: x2 pendant 4 heures)
    this.adBoostEndsAt = 0;

    // Mini boost temporaire rapide (ex: Drop تفتوفة تيربو 30s)
    this.speedBoostEndsAt = 0;
    this.speedBoostMultiplier = 1.0;

    // Quartier / Ville active de conquête (compatibilité ascendante)
    this.currentZoneId = 'tunis';
    this.currentCityId = 'tunis';
    this.unlockedCityIds = ['tunis'];

    // Améliorations tactiques achetées (Set d'IDs)
    this.purchasedUpgrades = [];

    // Roue de la fortune (عجلة الحظ التونسية)
    this.lastFreeWheelSpin = 0;

    // Décisions / Dilemmes moraux résolus
    this.resolvedDilemmas = [];
    this.nextDilemmaCheck = Date.now() + 25000; // Premier dilemme après 25s
    this.activeDilemma = null;

    // Rétention & Social : مربوح الأسبوع (Daily Login Streak)
    this.dailyLogin = {
      lastClaimDate: null,
      currentStreak: 0
    };

    // Rétention & Social : بطولة تجار تونس (Ligue Hebdomadaire)
    this.league = {
      tierIndex: 0,
      seasonEnd: Date.now() + (7 * 86400000)
    };

    // Rétention & Social : تحدي اليوم (Daily Challenges)
    this.dailyChallenge = {
      dateKey: null,
      challenges: []
    };

    // Système réaliste de dépenses et charges d'entreprise (المصاريف والأداءات التونسية)
    this.lastExpensesDeductionAt = Date.now();
    this.expensesCycleIntervalMs = 60000; // Cycle de charges toutes les 60 secondes
    this.totalExpensesPaid = 0;
    this.lastExpensesBreakdown = {
      salaries: 0,
      maintenance: 0,
      utilities: 0,
      taxes: 0,
      total: 0,
      effectiveRatePct: 12
    };

    if (initialState) {
      this.loadState(initialState);
    }
  }

  initCityBusinesses(cityId) {
    if (!this.cityBusinesses[cityId]) {
      // نصبة كسكروت عياري : UNE SEULE, DANS la ville de départ ('tunis')
      // Dans les autres villes, le premier commerce est le fricassé/bambalouni ou pâtisserie
      const configs = this.BUSINESS_CONFIGS.filter(cfg => {
        if (cfg.id === 'kaskrout' && cityId !== 'tunis') return false;
        if (cfg.id === 'fruits_de_mer' && !['sfax', 'djerba_holding', 'monastir_mahdia'].includes(cityId)) return false;
        return true;
      });

      this.cityBusinesses[cityId] = configs.map(cfg => ({
        id: cfg.id,
        name: cfg.name,
        tagline: cfg.tagline,
        icon: cfg.icon,
        baseCost: cfg.baseCost,
        baseRevenue: cfg.baseRevenue,
        costMultiplier: cfg.costMultiplier,
        cycleDurationMs: cfg.cycleDurationMs,
        level: 0,
        hiredManagersCount: 0,
        hasManager: false,
        progressMs: 0,
        isProducing: false,
        managers: cfg.managers,
        isSold: false
      }));
    }
    return this.cityBusinesses[cityId];
  }

  switchCity(cityId) {
    const city = this.getCityById(cityId);
    if (!city) return false;
    if (this.currentCityId) {
      if (!this.cityBalances) this.cityBalances = {};
      this.cityBalances[this.currentCityId] = this.dinars;
    }
    this.currentCityId = city.id;
    this.currentZoneId = city.id;
    if (!this.cityBalances) this.cityBalances = {};
    if (this.cityBalances[city.id] === undefined) {
      this.cityBalances[city.id] = 0;
    }
    this.dinars = this.cityBalances[city.id];
    this.initCityBusinesses(city.id);
    this.businesses = this.cityBusinesses[city.id];
    return true;
  }

  // --- 14 CITIES PROGRESSION & VILLES TUNISIENNES ---
  getCities() {
    return TUNISIAN_CITIES;
  }

  getCityById(cityId) {
    if (!cityId) return null;
    return TUNISIAN_CITIES.find(c => c.id === cityId) || null;
  }

  getCurrentCity() {
    return this.getCityById(this.currentCityId) || TUNISIAN_CITIES[0];
  }

  checkCityUnlockCriteria(cityOrId) {
    const city = typeof cityOrId === 'string' ? this.getCityById(cityOrId) : cityOrId;
    if (!city) return false;
    if (this.unlockedCityIds.includes(city.id)) return true;

    // 1. Condition Dinars en caisse (costDinars)
    if (city.costDinars > 0 && this.dinars < city.costDinars) return false;

    // 2. Condition Prestige minimal
    if (city.minPrestige > 0 && this.prestigeLevel < city.minPrestige) return false;

    // 3. Condition cumuls de dinars gagnés (lifetime / total)
    if (city.reqTotalDinars && (this.lifetimeDinarsEarned || 0) < city.reqTotalDinars && (this.totalDinarsEarned || 0) < city.reqTotalDinars) {
      return false;
    }

    // 4. Condition gérants / managers recrutés
    if (city.reqManagers && city.reqManagers > 0) {
      const totalManagers = this.businesses.reduce((sum, b) => sum + (b.hiredManagersCount || (b.hasManager ? 1 : 0)), 0);
      if (totalManagers < city.reqManagers) return false;
    }

    // 5. Condition niveaux de business (ex: 1 biz L10, 2 biz L20, 4 biz L35, 1 biz L100)
    if (city.reqBizLevel) {
      const { count = 1, minLevel = 1 } = city.reqBizLevel;
      const allEmpireBusinesses = Object.values(this.cityBusinesses).flat();
      const qualified = allEmpireBusinesses.filter(b => (b.level || 0) >= minLevel).length;
      if (qualified < count) return false;
    }

    // 6. Condition Titre Légende (Prestige 10 / badge أسطورة 5★)
    if (city.reqLegendTitle) {
      const isLegend = (this.prestigeLevel >= 10) ||
        (this.playerTitle && (this.playerTitle.includes('إمبراطور') || this.playerTitle.includes('أسطورة')));
      if (!isLegend) return false;
    }

    return true;
  }

  unlockCity(cityId) {
    const city = this.getCityById(cityId);
    if (!city) return false;

    // Déjà débloquée -> simple voyage / basculement vers la ville et ses projets
    if (this.unlockedCityIds.includes(city.id)) {
      this.switchCity(city.id);
      return true;
    }

    // Vérification stricte des critères
    if (!this.checkCityUnlockCriteria(city)) return false;

    // Prélèvement du coût d'ouverture si > 0
    if (city.costDinars > 0) {
      this.dinars -= city.costDinars;
    }

    this.unlockedCityIds.push(city.id);
    const remainingWallet = this.dinars;
    this.switchCity(city.id);
    // Au premier déblocage de la ville, le reliquat du voyage constitue la trésorerie initiale
    if (this.cityBalances[city.id] === undefined || this.cityBalances[city.id] === 0) {
      this.cityBalances[city.id] = remainingWallet;
      this.dinars = remainingWallet;
    }
    this.updatePlayerPrestigeTitle();
    return true;
  }

  // --- ZONES URBAINES DE CONQUÊTE TUNISIENNE (Rétrocompatibilité Totale) ---
  getZones() {
    // Fournit les 14 villes tunisiennes dans le format historique attendu par l'UI
    return this.getCities();
  }

  getCurrentZone() {
    return this.getCurrentCity();
  }

  unlockZone(zoneId) {
    const mappedId = (zoneId === 'bab_souika') ? 'tunis'
      : (zoneId === 'la_goulette') ? 'bizerte'
      : (zoneId === 'lac_2') ? 'nabeul_hammamet'
      : (zoneId === 'hammamet') ? 'sousse'
      : zoneId;
    return this.unlockCity(mappedId);
  }

  getZoneMultiplier(businessId, targetCityId = null) {
    const city = targetCityId ? this.getCityById(targetCityId) : this.getCurrentCity();
    if (!city) return 1.0;

    // Djerba / Holding National applique un multiplicateur massif x5 sur tous les commerces
    if (city.id === 'djerba_holding') {
      return 5.0;
    }

    // Multiplicateurs locaux thématiques par ville
    if (city.id === 'tunis') return 1.0; // Zone par défaut neutre
    if (city.id === 'bizerte' && ['taxi_collectif', 'patisserie'].includes(businessId)) return 1.25;
    if (city.id === 'nabeul_hammamet' && ['hotel', 'restaurant', 'patisserie'].includes(businessId)) return 1.30;
    if (city.id === 'beja' && ['kaskrout', 'attariya', 'usine_conserves'].includes(businessId)) return 1.30;
    if (city.id === 'le_kef' && ['kahwa', 'fricasse', 'superette'].includes(businessId)) return 1.35;
    if (city.id === 'sousse' && ['salon_de_the', 'restaurant', 'hotel'].includes(businessId)) return 1.35;
    if (city.id === 'monastir_mahdia' && ['patisserie', 'agence_voyages', 'hotel'].includes(businessId)) return 1.40;
    if (city.id === 'kairouan' && ['patisserie', 'attariya', 'supermarche'].includes(businessId)) return 1.40;
    if (city.id === 'sfax' && ['supermarche', 'usine_conserves', 'centre_commercial', 'showroom_auto'].includes(businessId)) return 1.50;
    if (city.id === 'gafsa' && ['taxi_collectif', 'agence_voyages', 'usine_conserves'].includes(businessId)) return 1.50;
    if (city.id === 'tozeur' && ['agence_voyages', 'hotel', 'restaurant'].includes(businessId)) return 1.60;
    if (city.id === 'gabes' && ['supermarche', 'centre_commercial', 'usine_conserves'].includes(businessId)) return 1.75;
    if (city.id === 'medenine_zarzis' && ['agence_voyages', 'promoteur_immobilier', 'showroom_auto'].includes(businessId)) return 2.0;

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
        tagline: 'سرّ الخلطة اللي يخلّي الحرفاء يشدّو الصف على الكسكروت',
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
      { id: 'cash_big', name: 'مربوح باهي !', type: 'cash_rate', multiplier: 120, weight: 25, icon: '💰' }, // 2 min de prod
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
    this.bankBalance = 0.0;
    this.totalDinarsEarned = 5.0;
    this.manualServesCount = 0;
    this.activeEvent = null;
    this.currentCityId = 'tunis';
    this.currentZoneId = 'tunis';
    this.unlockedCityIds = ['tunis'];

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

  getPlayerLevel() {
    const cityCount = (this.unlockedCityIds && this.unlockedCityIds.length) || 1;
    this.playerLevel = Math.min(14, Math.max(1, cityCount));
    return this.playerLevel;
  }

  getPlayerCityRank() {
    const lvl = this.getPlayerLevel();
    return PLAYER_CITY_LEVELS.find(r => r.level === lvl) || PLAYER_CITY_LEVELS[0];
  }

  updatePlayerPrestigeTitle() {
    this.getPlayerLevel();
    let currentRank = PRESTIGE_RANKS[0];
    for (const rank of PRESTIGE_RANKS) {
      if (this.prestigeLevel >= rank.minLevel) {
        currentRank = rank;
      }
    }
    this.playerTitle = currentRank.title;
  }

  // Calcul du revenu total par seconde pour la ligue et l'affichage
  getTotalDinarsPerSecond(now = Date.now()) {
    let total = 0;
    for (const biz of this.businesses) {
      if (biz.level > 0) {
        total += (this.getRevenue(biz, now) / (biz.cycleDurationMs / 1000));
      }
    }
    return total;
  }

  // --- مربوح الأسبوع (RÉCOMPENSES DE CONNEXION 7 JOURS) ---
  checkDailyLoginStatus() {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (!this.dailyLogin.lastClaimDate) {
      return { available: true, dayIndex: 0 };
    }
    const lastDate = new Date(this.dailyLogin.lastClaimDate);
    const today = new Date(todayStr);
    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { available: false, dayIndex: this.dailyLogin.currentStreak % 7 };
    }
    if (diffDays === 1) {
      return { available: true, dayIndex: (this.dailyLogin.currentStreak) % 7 };
    }
    return { available: true, dayIndex: 0, resetStreak: true };
  }

  claimDailyReward(now = Date.now()) {
    const status = this.checkDailyLoginStatus();
    if (!status.available) return null;

    const dayIndex = status.resetStreak ? 0 : status.dayIndex;
    const reward = DAILY_LOGIN_REWARDS[dayIndex];

    this.dinars += reward.dinars;
    this.totalDinarsEarned += reward.dinars;
    this.lifetimeDinarsEarned = (this.lifetimeDinarsEarned || 0) + reward.dinars;
    if (reward.prestige) this.prestigePoints += reward.prestige;

    if (reward.speedBoostMs) {
      this.speedBoostEndsAt = Math.max(now, this.speedBoostEndsAt) + reward.speedBoostMs;
      this.speedBoostMultiplier = 2.0;
    }
    if (reward.adBoostMs) {
      this.adBoostEndsAt = Math.max(now, this.adBoostEndsAt) + reward.adBoostMs;
    }
    if (reward.titleUnlock) {
      this.playerTitle = reward.titleUnlock;
    }

    this.dailyLogin.lastClaimDate = new Date().toISOString().slice(0, 10);
    this.dailyLogin.currentStreak = status.resetStreak ? 1 : (this.dailyLogin.currentStreak + 1);

    return { reward, streak: this.dailyLogin.currentStreak };
  }

  // --- بطولة تجار تونس (LIGUE HEBDOMADAIRE) ---
  getLeagueData(now = Date.now()) {
    const tier = LEAGUE_TIERS[this.league.tierIndex] || LEAGUE_TIERS[0];
    const playerDps = this.getTotalDinarsPerSecond(now);

    const rivals = tier.rivals.map((r, i) => {
      const dynamicScore = Math.floor(r.baseDps * 3600);
      return {
        name: r.name,
        avatar: r.avatar,
        score: dynamicScore,
        dps: r.baseDps,
        isPlayer: false
      };
    });

    const playerScore = Math.floor(playerDps * 3600);
    const playerEntry = {
      name: 'أنت (رجل أعمال الحومة)',
      avatar: '😎',
      score: playerScore,
      dps: playerDps,
      isPlayer: true
    };

    const fullList = [...rivals, playerEntry].sort((a, b) => b.score - a.score);
    fullList.forEach((entry, idx) => { entry.rank = idx + 1; });

    const playerRank = fullList.find(e => e.isPlayer).rank;
    const isPromoted = playerRank <= 2 && this.league.tierIndex < (LEAGUE_TIERS.length - 1);

    return {
      tierName: tier.name,
      tierBadge: tier.badge,
      leaderboard: fullList,
      playerRank,
      isPromoted,
      promotionReward: tier.promotionReward
    };
  }

  promoteLeague() {
    const data = this.getLeagueData();
    if (data.isPromoted && this.league.tierIndex < LEAGUE_TIERS.length - 1) {
      this.league.tierIndex += 1;
      this.dinars += data.promotionReward.dinars;
      this.prestigePoints += data.promotionReward.prestige;
      this.league.seasonEnd = Date.now() + (7 * 86400000);
      return { success: true, newTier: LEAGUE_TIERS[this.league.tierIndex] };
    }
    return { success: false };
  }

  // --- تحدي اليوم (DAILY MISSIONS) ---
  getDailyChallenges() {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (this.dailyChallenge.dateKey === todayStr && this.dailyChallenge.challenges.length > 0) {
      return this.dailyChallenge.challenges;
    }

    const shuffled = [...DAILY_CHALLENGES_POOL].sort(() => 0.5 - Math.random());
    this.dailyChallenge = {
      dateKey: todayStr,
      challenges: shuffled.slice(0, 3).map(ch => ({
        ...ch,
        current: 0,
        completed: false,
        claimed: false
      }))
    };
    return this.dailyChallenge.challenges;
  }

  recordChallengeProgress(type, amount = 1) {
    const list = this.getDailyChallenges();
    let updated = false;
    list.forEach(ch => {
      if (ch.type === type && !ch.completed) {
        ch.current += amount;
        if (ch.current >= ch.target) {
          ch.current = ch.target;
          ch.completed = true;
        }
        updated = true;
      }
    });
    return updated;
  }

  claimChallengeReward(challengeId) {
    const list = this.getDailyChallenges();
    const ch = list.find(c => c.id === challengeId);
    if (!ch || !ch.completed || ch.claimed) return null;

    ch.claimed = true;
    this.dinars += ch.rewardDinars;
    this.totalDinarsEarned += ch.rewardDinars;
    this.lifetimeDinarsEarned = (this.lifetimeDinarsEarned || 0) + ch.rewardDinars;
    if (ch.rewardPrestige) this.prestigePoints += ch.rewardPrestige;

    return ch;
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
    // Gain équilibré : au moins 2.0 DT ou 15 secondes de production (facteur idle soutenable)
    const amount = Math.max(2.0, Math.floor(totalPerSecond * 15));
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

  // --- DÉTAIL & PLAN INTÉRIEUR DU PROJET (VUE IMMERSIVE) ---
  // Spécialités régionales adaptées selon la ville
  getBusinessRegionalSpecialty(businessId, targetCityId = null) {
    const cityId = targetCityId || this.currentCityId || 'tunis';
    const citySpecialties = {
      beja: {
        attariya: { name: 'أجبان ومشتقات حليب باجة', icon: '🧀', tagline: 'جبن مالح، ريكوتا طازجة وحليب بيو من مراعي باجة الخضراء' },
        supermarche: { name: 'مجمّع خيرات ومطامير باجة', icon: '🌾', tagline: 'قمح باجة العالي، سميد صافي ومخارق وزلابية سخونة' },
        kaskrout: { name: 'كسكروت خبز طابونة باجي', icon: '🥖', tagline: 'طابونة سخونة بالجبن الباجي والزيت الحار' }
      },
      tozeur: {
        attariya: { name: 'تمور ودقلة النور الجريدية', icon: '🌴', tagline: 'دقلة العرجون معسّلة، ربّ التمر ومطاويح تمور الواحات العالمية' },
        patisserie: { name: 'حلويات التمور وواحة توزر', icon: '🍯', tagline: 'مقروض محشي بدقلة النور وكعك التمر باللوز' },
        agence_voyages: { name: 'سفاري وواحات الشبيكة وتوزر', icon: '🚙', tagline: 'رحلات بالرباعية في كثبان الشبيكة وتامغزة والشط' }
      },
      nabeul_hammamet: {
        attariya: { name: 'عطريّة وزهر نابل الأصيل', icon: '🏪', tagline: 'بهارات نابلية فاوحة، ماء زهر مقطّر، فلفل شايح وهريسة دياري' },
        patisserie: { name: 'زهر نابل وياسمين الحمامات', icon: '🌸', tagline: 'تقطير ماء الزهر الحر، حلويات اللوز ونبلية نابلية' },
        hotel: { name: 'منتجع ياسمين الحمامات الفاخر', icon: '🏖️', tagline: 'شاطئ لازوردي، مسبح دافئ واستجمام على الطريقة النابلية' }
      },
      djerba_holding: {
        attariya: { name: 'عطريّة حومة السوق العتيقة', icon: '🏪', tagline: 'توابل جربية نادرة، زيتون معتّق، سميد وخيرات الجزيرة' },
        supermarche: { name: 'سوق الحارة والمنسوجات الجربية', icon: '🧶', tagline: 'كليم جربي، بشكير حمام وحياكة صوف جزيرة الأحلام' },
        hotel: { name: 'منتجع الهولدينغ والمنزل الجربي 5 نجوم', icon: '👑', tagline: 'إقامة أندلسية بأقواس بيضاء وبحر قنطرة جربة' }
      },
      sfax: {
        restaurant: { name: 'مطعم الحوت والقرنيط الصفاقسي', icon: '🐟', tagline: 'حوت مشوي طازج، شوربة قرنيط وشرمولة صفاقسية أصلية' },
        supermarche: { name: 'سوق باب الجبلي للسمك وزيت الزيتون', icon: '🫒', tagline: 'صابة زيت الزيتون البكر الممتاز وحوت شوابي طازة' },
        usine_conserves: { name: 'مصنع مصبرات الحوت الأزرق وزيت الزيتون', icon: '🥫', tagline: 'تعليب السردينة والتن وتصدير الذهب الأخضر الصفاقسي' }
      },
      bizerte: {
        restaurant: { name: 'مطعم حوت الميناء العتيق', icon: '⛵', tagline: 'حوت قنال بنزرت، سردينة مشوية وكفتة بحرية مقرمشة' },
        kaskrout: { name: 'كسكروت لبلابي كركار بنزرتي', icon: '🍲', tagline: 'صحفة لبلابي بنزرتية حارة بحبة البيض والكمون' }
      },
      kairouan: {
        patisserie: { name: 'مقروض القيروان الملكي بالسمن', icon: '🍯', tagline: 'مقروض بالسمن الحر، التمر المعسل وجلجلان باب الجلادين' },
        attariya: { name: 'عطريّة رحبة الصوف القيروانية', icon: '🏪', tagline: 'حمص، عطورات وبخور، حكك هريسة وزيت زيتون عقارب' }
      }
    };

    if (citySpecialties[cityId] && citySpecialties[cityId][businessId]) {
      return citySpecialties[cityId][businessId];
    }
    return null;
  }

  getBusinessDetail(bizId, now = Date.now()) {
    const biz = this.businesses.find(b => b.id === bizId);
    if (!biz) return null;
    const specialty = this.getBusinessRegionalSpecialty(biz.id);

    const revenuePerCycle = this.getRevenue(biz, now);
    const cycleSeconds = (biz.cycleDurationMs || 1000) / 1000;
    const dinarsPerSecond = cycleSeconds > 0 ? (revenuePerCycle / cycleSeconds) : 0;

    // Recettes authentiques décomposées selon la nature du commerce tunisien
    const RECIPES_MAP = {
      kaskrout: [
        { item: 'كسكروت عياري كامل بالتن والعظام', price: 4.5, sharePct: 60 },
        { item: 'كعيبات كفتة وهريسة عربي', price: 2.0, sharePct: 25 },
        { item: 'مشروب غازي بوڨاع سيدر بارد', price: 1.5, sharePct: 15 }
      ],
      fricasse: [
        { item: 'كعبة فريكاسي سخونة بالزيتون', price: 1.2, sharePct: 55 },
        { item: 'كعبة بمبلوني مرشوشة سكر', price: 1.5, sharePct: 35 },
        { item: 'دبوزة ماء صافية معدنية', price: 1.0, sharePct: 10 }
      ],
      kahwa: [
        { item: 'قهوة فيلتري / إكسبريس قارحة', price: 1.8, sharePct: 45 },
        { item: 'كاس تاي منعنع بالبندق', price: 1.5, sharePct: 35 },
        { item: 'شيشة تفاح عادية وسريعة', price: 4.5, sharePct: 20 }
      ],
      attariya: [
        { item: 'قضية اليوم (حليب، خبز، طماطم، سميد)', price: 12.0, sharePct: 50 },
        { item: 'صبّان صولد وتيكيات هواتف', price: 5.0, sharePct: 30 },
        { item: 'سلعة الصغار والشكلاطة والبيمو', price: 2.5, sharePct: 20 }
      ],
      fruits_de_mer: [
        { item: 'صحن قرنيط مفوّر وشوربة بحر', price: 16.5, sharePct: 45 },
        { item: 'كروفيت مشوي وغلال البحر طازجة', price: 24.0, sharePct: 35 },
        { item: 'حوتة وراطة مشوية بالكمون', price: 18.0, sharePct: 20 }
      ],
      patisserie: [
        { item: 'صحن بقلاوة ومقروض قيرواني بالعسل', price: 18.0, sharePct: 50 },
        { item: 'قرون غزال وحلو درع وزرير', price: 14.0, sharePct: 30 },
        { item: 'تورتة عيد ميلاد بريستيج', price: 45.0, sharePct: 20 }
      ],
      taxi_collectif: [
        { item: 'توصيلة ركاب سنتر فيل خط سريع', price: 2.5, sharePct: 70 },
        { item: 'كورسة خاصة ومستعجلة', price: 15.0, sharePct: 20 },
        { item: 'نقل كردونات وقضية من المحطة', price: 5.0, sharePct: 10 }
      ],
      superette: [
        { item: 'سلة قضية العائلة الأسبوعية', price: 65.0, sharePct: 50 },
        { item: 'ياغورت وأجبان ومشروبات', price: 22.0, sharePct: 30 },
        { item: 'مواد تنظيف وغسيل', price: 28.0, sharePct: 20 }
      ],
      supermarche: [
        { item: 'شاريو كامل لحم وخضار ومؤونة الشهر', price: 220.0, sharePct: 55 },
        { item: 'إلكتروميناجي وأواني المطبخ', price: 110.0, sharePct: 25 },
        { item: 'مواد تجميل وبارفانات', price: 45.0, sharePct: 20 }
      ],
      salon_de_the: [
        { item: 'كأس قهوة كابوسين بريستيج / إكسبريس', price: 3.0, sharePct: 40 },
        { item: 'موخيتو فريش وتشكيلة عصائر', price: 6.5, sharePct: 35 },
        { item: 'تشيز كيك وميلك شيك شوكولا', price: 8.0, sharePct: 25 }
      ],
      restaurant: [
        { item: 'صحن مشاوي مشكل على الفحم', price: 38.0, sharePct: 50 },
        { item: 'شاورما سوري ومقبلات شامية', price: 16.0, sharePct: 30 },
        { item: 'عصائر طبيعية وحلويات شامية', price: 8.5, sharePct: 20 }
      ],
      agence_voyages: [
        { item: 'تذكرة طيران وفويّاج منظم', price: 1200.0, sharePct: 50 },
        { item: 'باكج عمرة VIP فنادق الحرم', price: 3800.0, sharePct: 35 },
        { item: 'حجوزات نزل سياحية وسهرات', price: 450.0, sharePct: 15 }
      ],
      hotel: [
        { item: 'إقامة جناح ديلوكس شامل كلياً', price: 420.0, sharePct: 55 },
        { item: 'خدمات السبا والبيسين والمساج', price: 160.0, sharePct: 25 },
        { item: 'بوفيه عشاء وسهرة سياحية', price: 85.0, sharePct: 20 }
      ],
      centre_commercial: [
        { item: 'إيجار محلات الماركات العالمية', price: 12000.0, sharePct: 45 },
        { item: 'تذاكر قاعات السينما الفاخرة', price: 18.0, sharePct: 30 },
        { item: 'إيرادات ساحة المطاعم والـFood Court', price: 35.0, sharePct: 25 }
      ],
      usine_conserves: [
        { item: 'حاوية تصدير هريسة عربي لأوروبا', price: 45000.0, sharePct: 50 },
        { item: 'دفعة علب طماطم وتنّ وطني', price: 28000.0, sharePct: 35 },
        { item: 'مربى وزيوت طبيعية معلبة', price: 15000.0, sharePct: 15 }
      ],
      showroom_auto: [
        { item: 'سيارة دفع رباعي فارهة زيرو كم', price: 240000.0, sharePct: 60 },
        { item: 'سيارة برلين هجينة للمدينة', price: 110000.0, sharePct: 30 },
        { item: 'عقود صيانة وتأمين ذهبي', price: 8500.0, sharePct: 10 }
      ],
      promoteur_immobilier: [
        { item: 'شقة فاخرة بريزيدنس قمرت مطلة عالبحر', price: 680000.0, sharePct: 55 },
        { item: 'فيلا مستقلة بالحمامات مع مسبح', price: 1200000.0, sharePct: 35 },
        { item: 'مكاتب ومقرات إدارية كبرى', price: 450000.0, sharePct: 10 }
      ],
      tayaran_el_ghzela: [
        { item: 'تذاكر الدرجة الأولى ورجال الأعمال', price: 3200.0, sharePct: 45 },
        { item: 'تذاكر الدرجة الاقتصادية للرحلات الدولية', price: 750.0, sharePct: 40 },
        { item: 'شحن بضائع جوي سريع (Cargo)', price: 18000.0, sharePct: 15 }
      ]
    };

    const recipeBreakdown = RECIPES_MAP[biz.id] || [
      { item: 'الخدمة الأساسية للمشروع', price: Math.max(1, Math.round(revenuePerCycle * 0.6)), sharePct: 60 },
      { item: 'خدمات إضافية ممتازة', price: Math.max(1, Math.round(revenuePerCycle * 0.25)), sharePct: 25 },
      { item: 'مبيعات جانبية وسريعة', price: Math.max(1, Math.round(revenuePerCycle * 0.15)), sharePct: 15 }
    ];

    // Postes d'employés et cadres (Staff Slots)
    const hiredCount = biz.hiredManagersCount ?? (biz.hasManager ? 1 : 0);
    const staffSlots = (biz.managers || []).map((m, idx) => ({
      role: m.role,
      name: m.name,
      icon: m.avatar || '👔',
      hired: idx < hiredCount,
      bonusDesc: idx === 0 ? 'تشغيل أوتوماتيكي مستمر 24/7' : 'مضاعفة الكفاءة والإنتاجية (+25%)',
      cost: m.cost
    }));

    // Simulation dynamique d'activité (Clients / min, satisfaction, affluence)
    let customersPerMinute = 0;
    let satisfactionPct = 80;
    let crowdLevel = 'متوسط';

    if (biz.level > 0) {
      // Fréquentation basée sur le niveau et la vitesse
      const baseFlow = Math.max(1, Math.round((60 / cycleSeconds) * (1 + (biz.level * 0.08))));
      customersPerMinute = Math.min(2500, baseFlow);

      // Satisfaction client : grimpe avec les cadres recrutés et les niveaux
      satisfactionPct = Math.min(99, Math.max(70, 75 + (hiredCount * 8) + Math.min(15, Math.floor(biz.level / 10))));

      if (biz.level >= 50 || hiredCount >= 2) {
        crowdLevel = 'شاعل';
      } else if (biz.level >= 15 || hiredCount >= 1) {
        crowdLevel = 'قوي';
      } else {
        crowdLevel = 'متوسط';
      }
    } else {
      crowdLevel = 'متوسط';
      satisfactionPct = 0;
    }

    return {
      id: biz.id,
      name: specialty ? specialty.name : biz.name,
      tagline: specialty ? specialty.tagline : biz.tagline,
      icon: specialty ? specialty.icon : biz.icon,
      level: biz.level,
      cycleDurationMs: biz.cycleDurationMs,
      revenuePerCycle,
      dinarsPerSecond,
      recipeBreakdown,
      staffSlots,
      customersPerMinute,
      satisfactionPct,
      crowdLevel
    };
  }

  getRevenue(business, now = Date.now(), cityId = null) {
    if (business.level === 0) return 0;
    const prestigeMultiplier = this.getPrestigeMultiplier();
    let eventMultiplier = 1.0;
    if (this.activeEvent && this.activeEvent.event && this.activeEvent.event.multipliers && this.activeEvent.event.multipliers[business.id]) {
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
    const targetCity = cityId || this.currentCityId;
    const zoneMultiplier = this.getZoneMultiplier ? this.getZoneMultiplier(business.id, targetCity) : 1.0;

    // Multiplicateurs d'améliorations tactiques achetées
    const upgradeMultiplier = this.getUpgradeMultiplier ? this.getUpgradeMultiplier(business.id) : 1.0;

    // Multiplicateurs de Milestones (x25, x50, x100, x200)
    const milestoneInfo = this.getBusinessMilestones ? this.getBusinessMilestones(business) : { multiplier: 1.0 };
    const milestoneMultiplier = milestoneInfo.multiplier || 1.0;

    const rawRevenue = business.baseRevenue * business.level * prestigeMultiplier * eventMultiplier * adMultiplier * staffMultiplier * comboMultiplier * luckySpeedMultiplier * zoneMultiplier * upgradeMultiplier * milestoneMultiplier;

    // Équilibrage macro-économique tunisien : au-delà de 5 millions DT / cycle,
    // amortissement d'échelle (loi des rendements décroissants réaliste)
    if (rawRevenue > 5000000) {
      const excess = rawRevenue - 5000000;
      return 5000000 + Math.pow(excess, 0.85);
    }
    return rawRevenue;
  }

  // Vente du fonds de commerce : rembourse 70% de l'investissement cumulé
  // Si c'est la نصبة كسكروت, elle disparaît définitivement et devient un parc public verdoyant
  sellBusiness(bizId) {
    const biz = this.businesses.find(b => b.id === bizId);
    if (!biz || biz.level === 0 || biz.isSold) return null;

    // Calcul de la valeur de revente (70% de la valeur cumulée investie)
    let totalInvested = 0;
    for (let lvl = 0; lvl < biz.level; lvl++) {
      totalInvested += biz.baseCost * Math.pow(biz.costMultiplier, lvl);
    }
    const resaleValue = Math.floor(Math.max(biz.baseCost * 0.7, totalInvested * 0.7) * 100) / 100;

    this.dinars += resaleValue;
    biz.level = 0;
    biz.isProducing = false;
    biz.progressMs = 0;
    biz.hasManager = false;
    biz.hiredManagersCount = 0;

    if (biz.id === 'kaskrout') {
      biz.isSold = true;
      if (!this.soldBusinesses) this.soldBusinesses = [];
      if (!this.soldBusinesses.includes('kaskrout')) {
        this.soldBusinesses.push('kaskrout');
      }
    }

    return { resaleValue, isKaskroutPark: biz.id === 'kaskrout' };
  }

  buyBusiness(id) {
    const biz = this.businesses.find(b => b.id === id);
    if (!biz) return false;
    const cost = this.getCost(biz);
    if (this.dinars >= cost) {
      this.dinars -= cost;
      if (this.currentCityId) {
        if (!this.cityBalances) this.cityBalances = {};
        this.cityBalances[this.currentCityId] = this.dinars;
      }
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
      if (this.currentCityId) {
        if (!this.cityBalances) this.cityBalances = {};
        this.cityBalances[this.currentCityId] = this.dinars;
      }
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
    this.totalPlayTimeSeconds = (this.totalPlayTimeSeconds || 0) + (deltaMs / 1000);

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

    for (const [cId, bList] of Object.entries(this.cityBusinesses)) {
      const isCurrentCity = (cId === this.currentCityId);
      let cityRev = 0;

      for (const biz of bList) {
        if (biz.level === 0) continue;

        if (biz.hasManager) {
          // Mode passif auto : calcul continu sans perte
          const totalMs = biz.progressMs + deltaMs;
          const cycles = Math.floor(totalMs / biz.cycleDurationMs);
          if (cycles > 0) {
            const rev = cycles * this.getRevenue(biz, now, cId);
            cityRev += rev;
            biz.progressMs = totalMs % biz.cycleDurationMs;
          } else {
            biz.progressMs = totalMs;
          }
        } else if (isCurrentCity && biz.isProducing) {
          // Mode manuel (tap) pour la ville où se trouve le joueur
          biz.progressMs += deltaMs;
          if (biz.progressMs >= biz.cycleDurationMs) {
            cityRev += this.getRevenue(biz, now, cId);
            biz.progressMs = 0;
            biz.isProducing = false;
          }
        }
      }

      if (cityRev > 0) {
        if (!this.cityBalances) this.cityBalances = {};
        this.cityBalances[cId] = (this.cityBalances[cId] || 0) + cityRev;
        if (isCurrentCity) {
          revenueEarned += cityRev;
        } else {
          this.totalDinarsEarned += cityRev;
          this.lifetimeDinarsEarned = (this.lifetimeDinarsEarned || 0) + cityRev;
        }
      }
    }

    // Déduction des dépenses d'entreprise périodiques (salaires خدامة، صيانة، ستاغ وصوناد، قباضة)
    // S'applique par cycle périodique (toutes les 60s) sans bloquer le joueur
    const interval = this.expensesCycleIntervalMs || 60000;
    if (this.lastExpensesDeductionAt === 0) {
      this.lastExpensesDeductionAt = now;
    }

    if (now - this.lastExpensesDeductionAt >= interval) {
      this.processPeriodicExpenses(now);
    }

    this.dinars += revenueEarned;
    this.totalDinarsEarned += revenueEarned;
    this.lifetimeDinarsEarned = (this.lifetimeDinarsEarned || 0) + revenueEarned;
    if (this.currentCityId) {
      if (!this.cityBalances) this.cityBalances = {};
      this.cityBalances[this.currentCityId] = this.dinars;
    }
    return revenueEarned;
  }

  // --- SYSTÈME RÉALISTE DE DÉPENSES & CHARGES D'ENTREPRISE (المصاريف والأداءات) ---
  processPeriodicExpenses(now = Date.now()) {
    const activeBusinesses = this.businesses.filter(b => b.level > 0);
    if (activeBusinesses.length === 0) {
      this.lastExpensesDeductionAt = now;
      return null;
    }

    // Calcul du revenu brut moyen d'une minute d'activité
    let grossRatePerSec = 0;
    activeBusinesses.forEach(b => {
      grossRatePerSec += (this.getRevenue(b, now) / (b.cycleDurationMs / 1000));
    });

    const grossMinuteRevenue = grossRatePerSec * 60;
    const breakdown = this.calculateExpensesBreakdown(grossMinuteRevenue);

    // Déduction réaliste et équilibrée sans jamais bloquer le joueur à 0 ni dépasser son solde
    if (breakdown.total > 0 && this.dinars > 0) {
      const maxDeductible = Math.min(breakdown.total, this.dinars * 0.15); // max 15% du solde ou montant total
      const deducted = Math.min(breakdown.total, maxDeductible);
      this.dinars = Math.max(0, this.dinars - deducted);
      this.totalExpensesPaid = (this.totalExpensesPaid || 0) + deducted;
    }

    this.lastExpensesBreakdown = breakdown;
    this.lastExpensesDeductionAt = now;
    return breakdown;
  }

  calculateExpensesBreakdown(grossRevenue = 0) {
    const activeBusinesses = this.businesses.filter(b => b.level > 0);
    const activeCount = activeBusinesses.length;
    if (activeCount === 0) {
      return {
        salaries: 0,
        maintenance: 0,
        utilities: 0,
        taxes: 0,
        total: 0,
        effectiveRatePct: 0
      };
    }

    // Calcul réaliste proportionnel au chiffre d'affaires et au nombre de commerces
    // Si pas de production ou de chiffre d'affaires actif, pas de charges injustifiées
    if (grossRevenue <= 0) {
      return {
        salaries: 0,
        maintenance: 0,
        utilities: 0,
        taxes: 0,
        total: 0,
        effectiveRatePct: 0
      };
    }

    const baseRev = grossRevenue;
    const salaries = Math.round(baseRev * 0.04 * 100) / 100;
    const maintenance = Math.round(baseRev * 0.03 * 100) / 100;
    const utilities = Math.round(baseRev * 0.025 * 100) / 100;
    const taxes = Math.round(baseRev * 0.025 * 100) / 100;
    const total = Math.round((salaries + maintenance + utilities + taxes) * 100) / 100;

    return {
      salaries,
      maintenance,
      utilities,
      taxes,
      total,
      effectiveRatePct: 12
    };
  }

  getCurrentExpensesSummary() {
    let grossRatePerSec = 0;
    this.businesses.forEach(b => {
      if (b.level > 0) {
        grossRatePerSec += (this.getRevenue(b) / (b.cycleDurationMs / 1000));
      }
    });

    const grossCycleEstimate = grossRatePerSec * 60; // Base estimée sur 1 minute de production
    const breakdown = this.calculateExpensesBreakdown(grossCycleEstimate);
    return {
      grossRatePerSec,
      grossMinute: grossCycleEstimate,
      salaries: breakdown.salaries,
      maintenance: breakdown.maintenance,
      utilities: breakdown.utilities,
      taxes: breakdown.taxes,
      totalCycle: breakdown.total,
      totalExpensesPaid: this.totalExpensesPaid || 0,
      effectiveRatePct: breakdown.effectiveRatePct || 12
    };
  }

  // Calcul du gain hors ligne au retour du joueur
  processOfflineProgress(currentTimestamp = Date.now()) {
    return this.update(currentTimestamp);
  }

  // Gestion du profil Joueur & Empire
  setEmpireName(newName) {
    if (typeof newName !== 'string') return false;
    const trimmed = newName.trim();
    if (trimmed.length === 0 || trimmed.length > 32) return false;
    this.empireName = trimmed;
    return true;
  }

  
  getTotalFortune() {
    let sum = (this.dinars || 0) + (this.bankBalance || 0);
    if (this.cityBalances) {
      for (const [cId, bal] of Object.entries(this.cityBalances)) {
        if (cId !== this.currentCityId) {
          sum += (bal || 0);
        }
      }
    }
    return sum;
  }

  // --- COMPTE BANCAIRE : DÉPÔT / RETRAIT (سيولة ورصيد في البنك) ---
  depositToBank(amount) {
    const val = Math.max(0, parseFloat(amount) || 0);
    if (val <= 0 || val > this.dinars) return false;
    this.dinars -= val;
    this.bankBalance = (this.bankBalance || 0) + val;
    if (this.currentCityId) {
      if (!this.cityBalances) this.cityBalances = {};
      this.cityBalances[this.currentCityId] = this.dinars;
    }
    return { success: true, amount: val, dinars: this.dinars, bankBalance: this.bankBalance };
  }

  withdrawFromBank(amount) {
    const val = Math.max(0, parseFloat(amount) || 0);
    if (val <= 0 || val > (this.bankBalance || 0)) return false;
    this.bankBalance = (this.bankBalance || 0) - val;
    this.dinars += val;
    if (this.currentCityId) {
      if (!this.cityBalances) this.cityBalances = {};
      this.cityBalances[this.currentCityId] = this.dinars;
    }
    return { success: true, amount: val, dinars: this.dinars, bankBalance: this.bankBalance };
  }

  getProfileStats(now = Date.now()) {
    const unlockedCount = this.businesses.filter(b => b.level > 0).length;
    const totalLevels = this.businesses.reduce((sum, b) => sum + (b.level || 0), 0);
    const totalManagersHired = this.businesses.reduce((sum, b) => sum + (b.hiredManagersCount || (b.hasManager ? 1 : 0)), 0);

    // Calcul deterministe de l'Empire Level :
    // Niveau = 1 + total des niveaux des commerces + paliers logarithmiques basés sur lifetimeDinarsEarned
    const lifetime = Math.max(0, this.lifetimeDinarsEarned || this.totalDinarsEarned || 0);
    const earningsLevelBonus = lifetime > 5 ? Math.floor(Math.log10(lifetime)) : 0;
    const empireLevel = Math.max(1, 1 + totalLevels + earningsLevelBonus);

    // Progression globale du jeu (0 - 100%) :
    // 17 commerces * palier 100 niveaux = 1700 niveaux de commerces
    // + managers (17) + quêtes achevées (TUNISIAN_QUESTS.length)
    const totalBiz = this.businesses.length || 17;
    const maxMilestoneTarget = totalBiz * 100;
    const levelProgress = Math.min(1, totalLevels / maxMilestoneTarget);
    const questProgress = TUNISIAN_QUESTS.length > 0 ? (this.completedQuestIds.length / TUNISIAN_QUESTS.length) : 0;
    const overallProgressPct = Math.min(100, Math.round(((levelProgress * 0.7) + (questProgress * 0.3)) * 1000) / 10);

    // Calcul précis du temps de jeu écoulé
    const elapsedSinceCreation = Math.max(0, Math.floor((now - (this.createdAt || now)) / 1000));
    const playTimeSeconds = Math.max(Math.floor(this.totalPlayTimeSeconds || 0), elapsedSinceCreation);

    return {
      empireName: this.empireName || 'إمبراطورية تونس للخدمات',
      playerTitle: this.playerTitle || 'مواطن يلوّج على مشروع',
      empireLevel,
      overallProgressPct,
      unlockedBusinessesCount: unlockedCount,
      totalManagersHired,
      prestigeCount: this.prestigeLevel || 0,
      prestigePoints: this.prestigePoints || 0,
      lifetimeDinars: lifetime,
      currentDinars: this.dinars || 0,
      bankBalance: this.bankBalance || 0,
      totalEmpireFortune: this.getTotalFortune(),
      totalExpensesPaid: this.totalExpensesPaid || 0,
      expensesSummary: this.getCurrentExpensesSummary(),
      totalPlayTimeSeconds: playTimeSeconds
    };
  }

  // Hard Reset complet du jeu
  resetGame() {
    this.businesses = BUSINESS_CONFIGS.map(cfg => ({
      ...cfg,
      level: 0,
      hiredManagersCount: 0,
      hasManager: false,
      progressMs: 0,
      isProducing: false
    }));

    this.dinars = 5.0;
    this.totalDinarsEarned = 5.0;
    this.lifetimeDinarsEarned = 5.0;
    this.prestigePoints = 0;
    this.prestigeLevel = 0;
    this.lastTimestamp = Date.now();
    this.createdAt = Date.now();
    this.totalPlayTimeSeconds = 0;
    this.empireName = 'إمبراطورية تونس للخدمات';

    this.manualServesCount = 0;
    this.completedQuestIds = [];
    this.playerTitle = 'مواطن يلوّج على مشروع';

    this.activeEvent = null;
    this.nextEventCheck = Date.now() + 15000;
    this.adBoostEndsAt = 0;
    this.speedBoostEndsAt = 0;
    this.speedBoostMultiplier = 1.0;
    this.currentCityId = 'tunis';
    this.currentZoneId = 'tunis';
    this.unlockedCityIds = ['tunis'];
    this.purchasedUpgrades = [];
    this.lastFreeWheelSpin = 0;
    this.resolvedDilemmas = [];
    this.nextDilemmaCheck = Date.now() + 25000;
    this.activeDilemma = null;

    this.dailyLogin = {
      lastClaimDate: null,
      currentStreak: 0
    };

    this.league = {
      tierIndex: 0,
      seasonEnd: Date.now() + (7 * 86400000)
    };

    this.dailyChallenge = {
      dateKey: null,
      challenges: []
    };

    this.lastExpensesDeductionAt = Date.now();
    this.totalExpensesPaid = 0;
    this.lastExpensesBreakdown = {
      salaries: 0,
      maintenance: 0,
      utilities: 0,
      taxes: 0,
      total: 0,
      effectiveRatePct: 12
    };
  }

  // Sauvegarde / Restauration
  exportState() {
    return {
      empireName: this.empireName || 'إمبراطورية تونس للخدمات',
      createdAt: this.createdAt || Date.now(),
      totalPlayTimeSeconds: this.totalPlayTimeSeconds || 0,
      dinars: this.dinars,
      bankBalance: this.bankBalance || 0,
      cityBalances: this.cityBalances || { [this.currentCityId || "tunis"]: this.dinars },
      totalDinarsEarned: this.totalDinarsEarned,
      lifetimeDinarsEarned: this.lifetimeDinarsEarned || this.totalDinarsEarned,
      totalExpensesPaid: this.totalExpensesPaid || 0,
      lastExpensesDeductionAt: this.lastExpensesDeductionAt || Date.now(),
      lastExpensesBreakdown: this.lastExpensesBreakdown || null,
      manualServesCount: this.manualServesCount,
      completedQuestIds: this.completedQuestIds,
      playerTitle: this.playerTitle,
      prestigePoints: this.prestigePoints,
      prestigeLevel: this.prestigeLevel || 0,
      lastTimestamp: this.lastTimestamp,
      activeEvent: this.activeEvent,
      adBoostEndsAt: this.adBoostEndsAt,
      speedBoostEndsAt: this.speedBoostEndsAt || 0,
      currentZoneId: this.currentZoneId || this.currentCityId || 'tunis',
      currentCityId: this.currentCityId || this.currentZoneId || 'tunis',
      unlockedCityIds: this.unlockedCityIds || ['tunis'],
      soldBusinesses: this.soldBusinesses || [],
      purchasedUpgrades: this.purchasedUpgrades || [],
      lastFreeWheelSpin: this.lastFreeWheelSpin || 0,
      dailyLogin: this.dailyLogin || { lastClaimDate: null, currentStreak: 0 },
      league: this.league || { tierIndex: 0, seasonEnd: Date.now() + 7 * 86400000 },
      dailyChallenge: this.dailyChallenge || { dateKey: null, challenges: [] },
      businesses: this.businesses.map(b => ({
        id: b.id,
        level: b.level,
        hiredManagersCount: b.hiredManagersCount ?? (b.hasManager ? 1 : 0),
        hasManager: b.hasManager,
        progressMs: b.progressMs,
        isProducing: b.isProducing
      })),
      cityBusinesses: Object.fromEntries(
        Object.entries(this.cityBusinesses).map(([cId, bList]) => [
          cId,
          bList.map(b => ({
            id: b.id,
            level: b.level,
            hiredManagersCount: b.hiredManagersCount ?? (b.hasManager ? 1 : 0),
            hasManager: b.hasManager,
            progressMs: b.progressMs,
            isProducing: b.isProducing
          }))
        ])
      )
    };
  }

  loadState(state) {
    if (!state) return;
    this.empireName = typeof state.empireName === 'string' && state.empireName.trim().length > 0 ? state.empireName.trim() : this.empireName;
    this.createdAt = state.createdAt ?? this.createdAt;
    this.totalPlayTimeSeconds = state.totalPlayTimeSeconds ?? this.totalPlayTimeSeconds;
    this.dinars = state.dinars ?? this.dinars;
    this.bankBalance = state.bankBalance ?? 0;
    this.cityBalances = state.cityBalances ?? { [this.currentCityId || "tunis"]: this.dinars };
    this.totalDinarsEarned = state.totalDinarsEarned ?? this.totalDinarsEarned;
    this.lifetimeDinarsEarned = state.lifetimeDinarsEarned ?? this.totalDinarsEarned;
    this.totalExpensesPaid = state.totalExpensesPaid ?? 0;
    this.lastExpensesDeductionAt = state.lastExpensesDeductionAt ?? Date.now();
    this.lastExpensesBreakdown = state.lastExpensesBreakdown ?? this.lastExpensesBreakdown;
    this.manualServesCount = state.manualServesCount ?? 0;
    this.completedQuestIds = Array.isArray(state.completedQuestIds) ? state.completedQuestIds : [];
    this.playerTitle = state.playerTitle ?? this.playerTitle;
    this.prestigePoints = state.prestigePoints ?? 0;
    this.prestigeLevel = state.prestigeLevel ?? 0;
    this.lastTimestamp = state.lastTimestamp ?? Date.now();
    this.activeEvent = state.activeEvent ?? null;
    this.adBoostEndsAt = state.adBoostEndsAt ?? 0;
    this.speedBoostEndsAt = state.speedBoostEndsAt ?? 0;
    const rawZone = state.currentCityId ?? state.currentZoneId ?? 'tunis';
    const mappedZone = (rawZone === 'bab_souika') ? 'tunis'
      : (rawZone === 'la_goulette') ? 'bizerte'
      : (rawZone === 'lac_2') ? 'nabeul_hammamet'
      : (rawZone === 'hammamet') ? 'sousse'
      : rawZone;
    this.currentCityId = mappedZone;
    this.currentZoneId = mappedZone;
    this.unlockedCityIds = Array.isArray(state.unlockedCityIds) && state.unlockedCityIds.length > 0
      ? state.unlockedCityIds
      : ['tunis'];
    if (!this.unlockedCityIds.includes(this.currentCityId)) {
      this.unlockedCityIds.push(this.currentCityId);
    }
    this.soldBusinesses = Array.isArray(state.soldBusinesses) ? state.soldBusinesses : [];
    this.purchasedUpgrades = Array.isArray(state.purchasedUpgrades) ? state.purchasedUpgrades : [];
    this.lastFreeWheelSpin = state.lastFreeWheelSpin ?? 0;
    this.dailyLogin = state.dailyLogin ?? { lastClaimDate: null, currentStreak: 0 };
    this.league = state.league ?? { tierIndex: 0, seasonEnd: Date.now() + 7 * 86400000 };
    this.dailyChallenge = state.dailyChallenge ?? { dateKey: null, challenges: [] };

    this.cityBusinesses = {};
    if (state.cityBusinesses && typeof state.cityBusinesses === 'object') {
      for (const [cId, bSavedList] of Object.entries(state.cityBusinesses)) {
        const cBizList = this.initCityBusinesses(cId);
        if (Array.isArray(bSavedList)) {
          for (const saved of bSavedList) {
            const b = cBizList.find(item => item.id === saved.id);
            if (b) {
              b.level = saved.level ?? 0;
              b.hiredManagersCount = saved.hiredManagersCount ?? (saved.hasManager ? 1 : 0);
              b.hasManager = saved.hasManager ?? (b.hiredManagersCount > 0);
              b.progressMs = saved.progressMs ?? 0;
              b.isProducing = saved.isProducing ?? false;
            }
          }
        }
      }
    }

    this.initCityBusinesses(this.currentCityId);
    this.businesses = this.cityBusinesses[this.currentCityId];

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
