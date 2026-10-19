/**
 * Tounes Tycoon - Core Idle Game Engine
 * © EOLabs 2026. Pur JavaScript, zéro dépendance, zéro dérive de timer.
 */

export const BUSINESS_CONFIGS = [
  {
    id: 'kaskrout',
    name: 'كسكروت عيّاري سخون',
    tagline: 'غطّس في الزيت وزيد الهريسة !',
    icon: '🥖',
    baseCost: 5.0, // Don de départ 5 DT permet l'achat immédiat
    baseRevenue: 0.8,
    costMultiplier: 1.07,
    cycleDurationMs: 600, // 0.6s
    managers: [
      { name: 'عم الصادق', role: 'معلّم الكسكروت', avatar: '👨‍🍳', cost: 25.0 }
    ],
  },
  {
    id: 'fricasse',
    name: 'بمبلوني وفريكاسي',
    tagline: 'سخون يكوي، من يدّو للفوّاي !',
    icon: '🍩',
    baseCost: 25.0,
    baseRevenue: 3.5,
    costMultiplier: 1.08,
    cycleDurationMs: 1200, // 1.2s
    managers: [
      { name: 'الباجي بمبلوني', role: 'معلّم القلي', avatar: '🧑‍🍳', cost: 100.0 }
    ],
  },
  {
    id: 'kahwa',
    name: 'مقهى شعبي',
    tagline: 'كابوسين وإكسبراس وقعدة الصباح',
    icon: '☕',
    baseCost: 120.0,
    baseRevenue: 14.0,
    costMultiplier: 1.09,
    cycleDurationMs: 2500, // 2.5s
    managers: [
      { name: 'الناصر القارصون', role: 'سرباي الصالة', avatar: '🤵', cost: 250.0 },
      { name: 'سي الهاشمي', role: 'معلّم الكونتوار', avatar: '☕', cost: 500.0 }
    ],
  },
  {
    id: 'attariya',
    name: 'عطريّة الحومة',
    tagline: 'من الحليب للخيط والإبرة، وكتبها في الكرني',
    icon: '🏪',
    baseCost: 550.0,
    baseRevenue: 50.0,
    costMultiplier: 1.10,
    cycleDurationMs: 5000, // 5.0s
    managers: [
      { name: 'منصف العطّار', role: 'أمين الصندوق والكرني', avatar: '🏬', cost: 1800.0 }
    ],
  },
  {
    id: 'patisserie',
    name: 'باتيسري وحلويات عربي',
    tagline: 'عسل قطر، بقلاوة وكعبات مقروض يذوبو في الفم',
    icon: '🍯',
    baseCost: 2400.0,
    baseRevenue: 190.0,
    costMultiplier: 1.11,
    cycleDurationMs: 10000, // 10.0s
    managers: [
      { name: 'الحاج عمر', role: 'معلّم الفور والقطر', avatar: '👳', cost: 3500.0 },
      { name: 'خالتي زبيدة', role: 'شوافة الحلو والتوزيع', avatar: '👩‍🍳', cost: 7000.0 }
    ],
  },
  {
    id: 'taxi_collectif',
    name: 'محطة تاكسي جماعي',
    tagline: 'سكّر الباب بالقوة وطلّق !',
    icon: '🚐',
    baseCost: 9800.0,
    baseRevenue: 720.0,
    costMultiplier: 1.12,
    cycleDurationMs: 18000, // 18.0s
    managers: [
      { name: 'كمال تيربو', role: 'كلاج الديسك والشوفيرية', avatar: '🕶️', cost: 28000.0 }
    ],
  },
  {
    id: 'superette',
    name: 'سوبيرات البركة',
    tagline: 'المكيّف يخدم والشاريو يدور في الرّايونات',
    icon: '🛒',
    baseCost: 38000.0,
    baseRevenue: 2600.0,
    costMultiplier: 1.12,
    cycleDurationMs: 30000, // 30.0s
    managers: [
      { name: 'منير الكاشير', role: 'كاشير', avatar: '💳', cost: 40000.0 },
      { name: 'سي رضا', role: 'كابو الرّفوف والتوريد', avatar: '👔', cost: 100000.0 }
    ],
  },
  {
    id: 'supermarche',
    name: 'سوبرماركت المدينة',
    tagline: 'بروموسيونات، كاسات سريعة وقضية الشهر',
    icon: '🏢',
    baseCost: 150000.0,
    baseRevenue: 9500.0,
    costMultiplier: 1.13,
    cycleDurationMs: 45000, // 45.0s
    managers: [
      { name: 'طارق الشاف', role: 'كابو البيع', avatar: '📋', cost: 150000.0 },
      { name: 'كريم الشريف', role: 'معلّم الليفريزون', avatar: '💼', cost: 400000.0 }
    ],
  },
  {
    id: 'salon_de_the',
    name: 'صالون تاي البحيرة',
    tagline: 'موكا، موخيتو، كليماتيزور ودلال VIP',
    icon: '🍹',
    baseCost: 600000.0,
    baseRevenue: 35000.0,
    costMultiplier: 1.14,
    cycleDurationMs: 60000, // 60.0s
    managers: [
      { name: 'وسيم الكابتن', role: 'شاف صالة الـ VIP', avatar: '🤵', cost: 600000.0 },
      { name: 'رامي الباريستا', role: 'ماستر الكوكتيل والبار', avatar: '🍸', cost: 1500000.0 }
    ],
  },
  {
    id: 'restaurant',
    name: 'مطعم مشوي وحوت',
    tagline: 'مشوي وحوت على الفحم، بالصحة والشفاء',
    icon: '🥘',
    baseCost: 2500000.0,
    baseRevenue: 130000.0,
    costMultiplier: 1.15,
    cycleDurationMs: 90000, // 90.0s
    managers: [
      { name: 'المعلم مبروك', role: 'شاف الشواية والكانون', avatar: '🔥', cost: 2500000.0 },
      { name: 'الشاف فتحي', role: 'معلّم الكوجينة', avatar: '👨‍🍳', cost: 6000000.0 }
    ],
  },
  {
    id: 'agence_voyages',
    name: 'وكالة أسفار اللقلاق (Ella9la9)',
    tagline: 'عمرة وتيكيات وطيارات، ودور العالم وإنت مرتاح',
    icon: '✈️',
    baseCost: 5500000.0,
    baseRevenue: 280000.0,
    costMultiplier: 1.15,
    cycleDurationMs: 105000, // 105.0s
    managers: [
      { name: 'أنيس التيكي', role: 'شاف التيكيات', avatar: '🎫', cost: 4500000.0 },
      { name: 'سي منير اللقلاق', role: 'الباترون', avatar: '🧳', cost: 12000000.0 }
    ],
  },
  {
    id: 'hotel',
    name: 'أوتيل 5 نجوم',
    tagline: 'بيسين وريلاكس وسيّاح، ودلال الملوك',
    icon: '🏨',
    baseCost: 12000000.0,
    baseRevenue: 600000.0,
    costMultiplier: 1.15,
    cycleDurationMs: 120000, // 120.0s
    managers: [
      { name: 'مدام سيرين', role: 'شوافة الاستقبال', avatar: '👩‍💼', cost: 10000000.0 },
      { name: 'ميسيو برهان', role: 'الباترون', avatar: '🎩', cost: 30000000.0 }
    ],
  },
  {
    id: 'centre_commercial',
    name: 'المركّب التجاري (Mall)',
    tagline: 'ماركات عالمية وإسكالاتور وسينما، والملاين تدور',
    icon: '🛍️',
    baseCost: 45000000.0,
    baseRevenue: 2200000.0,
    costMultiplier: 1.15,
    cycleDurationMs: 180000, // 180.0s
    managers: [
      { name: 'المهندس مراد', role: 'معلّم الصيانة', avatar: '👷', cost: 35000000.0 },
      { name: 'مدام نادية', role: 'شوافة المحلات', avatar: '👠', cost: 70000000.0 },
      { name: 'سي خليل بن عمار', role: 'الباترون الكبير', avatar: '👑', cost: 120000000.0 }
    ],
  },
  {
    id: 'usine_conserves',
    name: 'معمل مصبرات الهريسة والتن',
    tagline: 'فلاحة وتصدير، وهريسة عربي تعمّر الكونتوارات',
    icon: '🥫',
    baseCost: 200000000.0,
    baseRevenue: 10000000.0,
    costMultiplier: 1.15,
    cycleDurationMs: 240000, // 240.0s
    managers: [
      { name: 'المهندس حمادي', role: 'كابو التعليب', avatar: '🏭', cost: 150000000.0 },
      { name: 'سي عبد السلام', role: 'كابو التصدير', avatar: '🚢', cost: 350000000.0 },
      { name: 'الحاج بلقاسم', role: 'كبير المعمل', avatar: '💼', cost: 600000000.0 }
    ],
  },
  {
    id: 'showroom_auto',
    name: 'صالة عرض سيارات فاخرة (Showroom Auto)',
    tagline: 'آخر الموديلات، كراهب 0 كم ودلال رجال الأعمال',
    icon: '🏎️',
    baseCost: 800000000.0,
    baseRevenue: 42000000.0,
    costMultiplier: 1.15,
    cycleDurationMs: 300000, // 300.0s (5min)
    managers: [
      { name: 'ياسين كوميرسيال', role: 'كابو البيع والـVIP', avatar: '🏎️', cost: 600000000.0 },
      { name: 'مدام مريم الوكيل', role: 'شوافة الماركات', avatar: '💎', cost: 1500000000.0 },
      { name: 'سي طارق قطوس', role: 'الباترون الكبير', avatar: '👑', cost: 3000000000.0 }
    ],
  },
  {
    id: 'tayaran_el_ghzela',
    name: 'شركة طيران الغزالة (Tayaran El Ghzéla)',
    tagline: 'طيّارات برشا، وعلم تونس يرفرف في الدنيا',
    icon: '🛫',
    baseCost: 3500000000.0,
    baseRevenue: 190000000.0,
    costMultiplier: 1.15,
    cycleDurationMs: 420000, // 420.0s (7min)
    managers: [
      { name: 'الكابتن رمزي', role: 'كبير الطيارين', avatar: '👨‍✈️', cost: 2500000000.0 },
      { name: 'مدام سهام', role: 'شوافة المطار', avatar: '👩‍✈️', cost: 6000000000.0 },
      { name: 'سي المنصف البكوش', role: 'الباترون الكبير', avatar: '🦅', cost: 15000000000.0 }
    ],
  }
];

export const TUNISIAN_EVENTS = [
  {
    id: 'chheli',
    title: '☀️ شهيلي يكوّي 48°C !',
    description: 'القهاوي تتعبّى والمشروب البارد يطير !',
    durationMs: 30000,
    multipliers: { kahwa: 2.0, salon_de_the: 2.5 }
  },
  {
    id: 'derby',
    title: '⚽ ليلة الدربي الكبير في رادس !',
    description: 'العاصمة شاعلة والجمهور في الشارع ! الكسكروت والفريكاسي يطيرو طيران.',
    durationMs: 40000,
    multipliers: { kaskrout: 3.0, fricasse: 2.5, kahwa: 1.8 }
  },
  {
    id: 'aaras',
    title: '💐 موسم الأعراس والوطية !',
    description: 'الزغاريت تعلّي والحلو يتوزّع ! الباتيسري والمطاعم عليهم الكرية.',
    durationMs: 35000,
    multipliers: { patisserie: 3.0, restaurant: 2.0 }
  },
  {
    id: 'embouteillage',
    title: '🚗 الزحمة في باب سعدون !',
    description: 'التاكسيات الجماعية واقفة والكيوسك يبيع للي يستنّى.',
    durationMs: 25000,
    multipliers: { kaskrout: 2.5, taxi_collectif: 0.3 }
  }
];

export const TUNISIAN_QUESTS = [
  {
    id: 'first_kiosk',
    title: 'البداية : حلّ أوّل كسكروت',
    targetType: 'business_level',
    businessId: 'kaskrout',
    targetValue: 1,
    rewardDinars: 5.0,
    titleEarned: 'تاجر مبتدئ'
  },
  {
    id: 'serve_kaskrout_10',
    title: 'سربّي 10 مرّات',
    targetType: 'manual_serves',
    targetValue: 10,
    rewardDinars: 15.0,
    titleEarned: 'سرباي نشيط'
  },
  {
    id: 'first_manager',
    title: 'معلّم ومرتاح : خدّم أوّل جيرون',
    targetType: 'hired_managers',
    targetValue: 1,
    rewardDinars: 40.0,
    titleEarned: 'شاف خدمة'
  },
  {
    id: 'open_coffee',
    title: 'كبّر : حلّ المقهى الشعبي',
    targetType: 'business_level',
    businessId: 'kahwa',
    targetValue: 1,
    rewardDinars: 100.0,
    titleEarned: 'صاحب قهوة'
  },
  {
    id: 'open_taxi',
    title: 'حلّ محطة تاكسي جماعي',
    targetType: 'business_level',
    businessId: 'taxi_collectif',
    targetValue: 1,
    rewardDinars: 1500.0,
    titleEarned: 'ريّس التاكسيات'
  },
  {
    id: 'open_mall',
    title: 'حلّ المركّب التجاري (Mall)',
    targetType: 'business_level',
    businessId: 'centre_commercial',
    targetValue: 1,
    rewardDinars: 5000000.0,
    titleEarned: 'ملك التجارة'
  },
  {
    id: 'wealth_1000',
    title: 'عمّر الكاسة : وصّل 1 000 د.ت',
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
    const cashReward = Math.max(5.0, Math.floor(totalPerSecond * 180));
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
