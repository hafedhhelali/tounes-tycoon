/**
 * Tounes Tycoon - Core Idle Game Engine
 * © EOLabs 2026. Pur JavaScript, zéro dépendance, zéro dérive de timer.
 */

export const BUSINESS_CONFIGS = [
  {
    id: 'fricasse',
    name: 'كشك فريكاسي وبمبلوني',
    tagline: 'سخون يكوي وزيت جديد !',
    icon: '🥪',
    baseCost: 10.0, // 10 Dinars pour monter son kiosque
    baseRevenue: 1.5, // 1.5 DT par fournée
    costMultiplier: 1.08,
    cycleDurationMs: 800, // 0.8s
    managerName: 'عمك صالح',
    managerRole: 'شاف الطبلية',
    managerAvatar: '👨‍🍳',
    managerCost: 50.0,
  },
  {
    id: 'kahwa',
    name: 'قهوة شعبية',
    tagline: 'كابوسين إكسبريس وشيشة تفاح',
    icon: '☕',
    baseCost: 80.0, // 80 Dinars
    baseRevenue: 10.0,
    costMultiplier: 1.10,
    cycleDurationMs: 3000, // 3s
    managerName: 'الناصر Garçon',
    managerRole: 'سرباي توربو',
    managerAvatar: '🤵',
    managerCost: 300.0,
  },
  {
    id: 'machmoum',
    name: 'بارفان ومشاميم فل',
    tagline: 'فل وياسمين وريحة تدوّخ',
    icon: '🌸',
    baseCost: 450.0, // 450 Dinars
    baseRevenue: 45.0,
    costMultiplier: 1.12,
    cycleDurationMs: 6000, // 6s
    managerName: 'الشيخة لطيفة',
    managerRole: 'سلطانة الفل',
    managerAvatar: '🧕',
    managerCost: 1500.0,
  },
  {
    id: 'louage',
    name: 'محطة لواج وتاكسي جماعي',
    tagline: 'البلاصة لخرة ونتوكلو على ربي !',
    icon: '🚐',
    baseCost: 2200.0, // 2 200 Dinars
    baseRevenue: 180.0,
    costMultiplier: 1.12,
    cycleDurationMs: 12000, // 12s
    managerName: 'شكري كلاج',
    managerRole: 'شوفير كورسّات',
    managerAvatar: '🕶️',
    managerCost: 6500.0,
  },
  {
    id: 'makroudh',
    name: 'حلويات مقروض وبقلاوة',
    tagline: 'لوز حر وسمن عربي أصيل',
    icon: '🍯',
    baseCost: 9500.0, // 9 500 Dinars
    baseRevenue: 750.0,
    costMultiplier: 1.13,
    cycleDurationMs: 24000, // 24s
    managerName: 'الحاج عمر',
    managerRole: 'معلّم الحرفة',
    managerAvatar: '👳',
    managerCost: 25000.0,
  },
  {
    id: 'lac2_lounge',
    name: 'صالون شاي VIP في البحيرة',
    tagline: 'كليماتيزور يخدم وكعبات موخيتو',
    icon: '✨',
    baseCost: 45000.0, // 45 000 Dinars
    baseRevenue: 3200.0,
    costMultiplier: 1.13,
    cycleDurationMs: 60000, // 60s
    managerName: 'سي المهدي',
    managerRole: 'رئيس مجلس الإدارة',
    managerAvatar: '💼',
    managerCost: 120000.0,
  }
];

export const TUNISIAN_EVENTS = [
  {
    id: 'canicule',
    title: '☀️ شهيلي يكوي 48°C !',
    description: 'الشمس عمودية والناس عطشانة ! المشروبات والقهاوي تخدم دز تخطف.',
    durationMs: 30000,
    multipliers: { kahwa: 3.0, louage: 0.5 }
  },
  {
    id: 'derby',
    title: '⚽ ليلة الدربي الكبير !',
    description: 'العاصمة مقلوبة والقهوة مبلعة ولاد الحومة ! القهاوي والفريكاسي يدخلو ذهب.',
    durationMs: 40000,
    multipliers: { kahwa: 2.5, lac2_lounge: 2.0 }
  },
  {
    id: 'mariages',
    title: '💐 موسم الأعراس والوطية !',
    description: 'الزغاريت تعلّي والحلو يتفرّق ! المشاميم والبقلاوة مطلوبين بالصف.',
    durationMs: 35000,
    multipliers: { machmoum: 3.0, makroudh: 2.5 }
  },
  {
    id: 'embouteillage',
    title: '🚗 سركيلاسيون باب سعدون واقْفة !',
    description: 'التكاسي تبلوكات واللواجات واقفين ! الكيوسك يبيع للواقفين في الكارتاجة.',
    durationMs: 25000,
    multipliers: { fricasse: 2.5, louage: 0.3 }
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
    this.dinars = 10.0; // Don de départ (pour acheter le 1er kiosque fricassé à 10 DT)
    this.prestigePoints = 0; // Ma3rouf / Réputation
    this.lastTimestamp = Date.now();

    // Événement actif
    this.activeEvent = null; // { event: TUNISIAN_EVENTS[i], endsAt: timestamp }
    this.nextEventCheck = Date.now() + 15000; // Premier check après 15s

    // Google Ads Rewarded Boost (ex: x2 pendant 4 heures)
    this.adBoostEndsAt = 0;

    if (initialState) {
      this.loadState(initialState);
    }
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
