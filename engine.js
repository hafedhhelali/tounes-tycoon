/**
 * Tounes Tycoon - Core Idle Game Engine
 * © EOLabs 2026. Pur JavaScript, zéro dépendance, zéro dérive de timer.
 */

export const BUSINESS_CONFIGS = [
  {
    id: 'kaskrout',
    name: 'كسكروت عيّاري سخون',
    tagline: 'غطّس في الزيت وكبّر في الهريسة !',
    icon: '🥖',
    baseCost: 5.0, // Don de départ 5 DT permet l'achat immédiat
    baseRevenue: 0.8,
    costMultiplier: 1.07,
    cycleDurationMs: 600, // 0.6s
    managerName: 'عم الصادق',
    managerRole: 'شاف العيّاري',
    managerAvatar: '👨‍🍳',
    managerCost: 25.0,
  },
  {
    id: 'fricasse',
    name: 'بمبلوني وفريكاسي',
    tagline: 'سخون يكوّي ومن يدّو للفوّاي !',
    icon: '🍩',
    baseCost: 25.0,
    baseRevenue: 3.5,
    costMultiplier: 1.08,
    cycleDurationMs: 1200, // 1.2s
    managerName: 'الباجي بمبلوني',
    managerRole: 'معلّم القلي',
    managerAvatar: '🧑‍🍳',
    managerCost: 100.0,
  },
  {
    id: 'kahwa',
    name: 'مقهى شعبي',
    tagline: 'كابوسين إكسبريس وطرح شكبة صبّاحي',
    icon: '☕',
    baseCost: 120.0,
    baseRevenue: 14.0,
    costMultiplier: 1.09,
    cycleDurationMs: 2500, // 2.5s
    managerName: 'سي الهاشمي',
    managerRole: 'سرباي توربو',
    managerAvatar: '🤵',
    managerCost: 450.0,
  },
  {
    id: 'attariya',
    name: 'عطريّة الحومة',
    tagline: 'من باكو حليب لخيط وإبرة وتقييد في الكرني',
    icon: '🏪',
    baseCost: 550.0,
    baseRevenue: 50.0,
    costMultiplier: 1.10,
    cycleDurationMs: 5000, // 5.0s
    managerName: 'منصف العطّار',
    managerRole: 'سيّد الكرني',
    managerAvatar: '🏬',
    managerCost: 1800.0,
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
    managerName: 'خالتي زبيدة',
    managerRole: 'شوافة الحلو',
    managerAvatar: '👩‍🍳',
    managerCost: 7000.0,
  },
  {
    id: 'taxi_collectif',
    name: 'محطة تاكسي جماعي',
    tagline: 'سكّر الباب بالقوي، وخمسة ومارش !',
    icon: '🚐',
    baseCost: 9800.0,
    baseRevenue: 720.0,
    costMultiplier: 1.12,
    cycleDurationMs: 18000, // 18.0s
    managerName: 'كمال تيربو',
    managerRole: 'كلاج الديسك',
    managerAvatar: '🕶️',
    managerCost: 28000.0,
  },
  {
    id: 'superette',
    name: 'سوبيرات البركة',
    tagline: 'كليماتيزور يخدم والكرّوسة تدور في الرّايونات',
    icon: '🛒',
    baseCost: 38000.0,
    baseRevenue: 2600.0,
    costMultiplier: 1.12,
    cycleDurationMs: 30000, // 30.0s
    managerName: 'سي رضا',
    managerRole: 'كابو الرّفوف',
    managerAvatar: '👔',
    managerCost: 100000.0,
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
    managerName: 'كريم الشريف',
    managerRole: 'مدير العمليات',
    managerAvatar: '💼',
    managerCost: 400000.0,
  },
  {
    id: 'salon_de_the',
    name: 'سالون دو ثي في اللاك',
    tagline: 'موكا، موخيتو، كليماتيزور ودلال VIP',
    icon: '🍹',
    baseCost: 600000.0,
    baseRevenue: 35000.0,
    costMultiplier: 1.14,
    cycleDurationMs: 60000, // 60.0s
    managerName: 'رامي الباريستا',
    managerRole: 'ماستر الكوكتيل',
    managerAvatar: '🍸',
    managerCost: 1500000.0,
  },
  {
    id: 'restaurant',
    name: 'مطعم مشوي وحوت',
    tagline: 'تسطيرة وحوت كعب على الفحم، صحة وبالشفاء',
    icon: '🥘',
    baseCost: 2500000.0,
    baseRevenue: 130000.0,
    costMultiplier: 1.15,
    cycleDurationMs: 90000, // 90.0s
    managerName: 'الشاف فتحي',
    managerRole: 'سلطان الكوجينة',
    managerAvatar: '👨‍🍳',
    managerCost: 6000000.0,
  },
  {
    id: 'hotel',
    name: 'أوتيل 5 نجوم',
    tagline: 'بيسين، ريلاكس، وتورست ودلال الملوك',
    icon: '🏨',
    baseCost: 10000000.0,
    baseRevenue: 500000.0,
    costMultiplier: 1.15,
    cycleDurationMs: 120000, // 120.0s
    managerName: 'ميسيو برهان',
    managerRole: 'المدير العام',
    managerAvatar: '🎩',
    managerCost: 25000000.0,
  }
];

export const TUNISIAN_EVENTS = [
  {
    id: 'chheli',
    title: '☀️ شهيلي يكوّي 48°C !',
    description: 'القهاوي وسالونات الشاي يعبّاو بالمشروبات الباردة والماء المثلّج.',
    durationMs: 30000,
    multipliers: { kahwa: 2.0, salon_de_the: 2.5 }
  },
  {
    id: 'derby',
    title: '⚽ ليلة الدربي الكبير في رادس !',
    description: 'العاصمة شاعلة والجمهور في الشارع ! الكساكروت والفريكاسي يطيرو طيران.',
    durationMs: 40000,
    multipliers: { kaskrout: 3.0, fricasse: 2.5, kahwa: 1.8 }
  },
  {
    id: 'aaras',
    title: '💐 موسم الأعراس والوطية !',
    description: 'الزغاريت تعلّي والحلو يتفرّق ! الباتيسري والمطاعم مطلوبين بالصف.',
    durationMs: 35000,
    multipliers: { patisserie: 3.0, restaurant: 2.0 }
  },
  {
    id: 'embouteillage',
    title: '🚗 سركيلاسيون باب سعدون واقْفة !',
    description: 'التكاسي الجماعي تبلوكات والكيوسك يبيع للواقفين في الكارتاجة.',
    durationMs: 25000,
    multipliers: { kaskrout: 2.5, taxi_collectif: 0.3 }
  }
];

export const TUNISIAN_QUESTS = [
  {
    id: 'first_kiosk',
    title: 'بداية الرحلة : حل أوّل حانوت عيّاري',
    targetType: 'business_level',
    businessId: 'kaskrout',
    targetValue: 1,
    rewardDinars: 5.0,
    titleEarned: 'تاجر مبتدئ'
  },
  {
    id: 'serve_kaskrout_10',
    title: 'سرباي الحومة : سربّي 10 مرّات',
    targetType: 'manual_serves',
    targetValue: 10,
    rewardDinars: 15.0,
    titleEarned: 'سرباي نشيط'
  },
  {
    id: 'first_manager',
    title: 'معلّم ومرتاح : دبّر أوّل جيرون',
    targetType: 'hired_managers',
    targetValue: 1,
    rewardDinars: 40.0,
    titleEarned: 'شاف خدمة'
  },
  {
    id: 'open_coffee',
    title: 'وسع المشروع : حل المقهى الشعبي',
    targetType: 'business_level',
    businessId: 'kahwa',
    targetValue: 1,
    rewardDinars: 100.0,
    titleEarned: 'صاحب قهوة'
  },
  {
    id: 'open_taxi',
    title: 'نقل العاصمة : حل محطة تاكسي جماعي',
    targetType: 'business_level',
    businessId: 'taxi_collectif',
    targetValue: 1,
    rewardDinars: 1500.0,
    titleEarned: 'رايس التكاسي'
  },
  {
    id: 'wealth_1000',
    title: 'عبي الكاسة : وصّل 1 000 د.ت في الكاسة',
    targetType: 'accumulated_dinars',
    targetValue: 1000.0,
    rewardDinars: 250.0,
    titleEarned: 'ملياردير الحومة'
  }
];

export class TycoonEngine {
  constructor(initialState = null) {
    this.businesses = BUSINESS_CONFIGS.map(cfg => ({
      ...cfg,
      level: 0,
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
    return business.baseRevenue * business.level * prestigeMultiplier * eventMultiplier * adMultiplier;
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

  hireManager(id) {
    const biz = this.businesses.find(b => b.id === id);
    if (!biz || biz.hasManager || biz.level === 0) return false;
    if (this.dinars >= biz.managerCost) {
      this.dinars -= biz.managerCost;
      biz.hasManager = true;
      biz.isProducing = true;
      return true;
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
          biz.hasManager = saved.hasManager ?? false;
          biz.progressMs = saved.progressMs ?? 0;
          biz.isProducing = saved.isProducing ?? false;
        }
      }
    }
  }
}
