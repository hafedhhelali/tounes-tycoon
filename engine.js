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
    this.prestigePoints = 0; // Ma3rouf / Réputation
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

    if (initialState) {
      this.loadState(initialState);
    }
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
    return cashReward;
  }

  getCost(business) {
    return Math.floor(business.baseCost * Math.pow(business.costMultiplier, business.level) * 100) / 100;
  }

  getRevenue(business, now = Date.now()) {
    if (business.level === 0) return 0;
    const prestigeMultiplier = 1.0 + (this.prestigePoints * 0.05); // +5% par point de Ma3rouf
    let eventMultiplier = 1.0;
    if (this.activeEvent && this.activeEvent.event.multipliers[business.id]) {
      eventMultiplier = this.activeEvent.event.multipliers[business.id];
    }
    const adMultiplier = this.isAdBoostActive(now) ? 2.0 : 1.0;
    // Chaque recrutement au-delà du 1er gérant apporte un bonus d'encadrement (+25% par cadre additionnel)
    const extraStaff = Math.max(0, (business.hiredManagersCount || (business.hasManager ? 1 : 0)) - 1);
    const staffMultiplier = 1.0 + (extraStaff * 0.25);
    return business.baseRevenue * business.level * prestigeMultiplier * eventMultiplier * adMultiplier * staffMultiplier;
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

    let revenueEarned = 0;

    for (const biz of this.businesses) {
      if (biz.level === 0) continue;

      if (biz.hasManager) {
        // Mode passif auto : calcul continu sans perte
        const totalMs = biz.progressMs + deltaMs;
        const cycles = Math.floor(totalMs / biz.cycleDurationMs);
        if (cycles > 0) {
          revenueEarned += cycles * this.getRevenue(biz);
          biz.progressMs = totalMs % biz.cycleDurationMs;
        } else {
          biz.progressMs = totalMs;
        }
      } else if (biz.isProducing) {
        // Mode manuel (tap)
        biz.progressMs += deltaMs;
        if (biz.progressMs >= biz.cycleDurationMs) {
          revenueEarned += this.getRevenue(biz);
          biz.progressMs = 0;
          biz.isProducing = false;
        }
      }
    }

    this.dinars += revenueEarned;
    this.totalDinarsEarned += revenueEarned;
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
      manualServesCount: this.manualServesCount,
      completedQuestIds: this.completedQuestIds,
      playerTitle: this.playerTitle,
      prestigePoints: this.prestigePoints,
      lastTimestamp: this.lastTimestamp,
      activeEvent: this.activeEvent,
      adBoostEndsAt: this.adBoostEndsAt,
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
    this.manualServesCount = state.manualServesCount ?? 0;
    this.completedQuestIds = Array.isArray(state.completedQuestIds) ? state.completedQuestIds : [];
    this.playerTitle = state.playerTitle ?? this.playerTitle;
    this.prestigePoints = state.prestigePoints ?? 0;
    this.lastTimestamp = state.lastTimestamp ?? Date.now();
    this.activeEvent = state.activeEvent ?? null;
    this.adBoostEndsAt = state.adBoostEndsAt ?? 0;

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
