/**
 * Tounes Tycoon - Core Idle Game Engine
 * © EOLabs 2026. Pur JavaScript, zéro dépendance, zéro dérive de timer.
 */

export const BUSINESS_CONFIGS = [
  {
    id: 'fricasse',
    name: 'Kiosque Fricassé & Bambalouni',
    arabicName: 'فريكاسي و بمبلوني',
    icon: '🥪',
    baseCost: 4.0, // en Dinars (TND)
    baseRevenue: 1.0,
    costMultiplier: 1.07,
    cycleDurationMs: 600, // 0.6s
    managerName: '3am Salah',
    managerRole: 'Chef Tablier',
    managerAvatar: '👨‍🍳',
    managerCost: 100.0,
  },
  {
    id: 'kahwa',
    name: '9ahwa Cha3biya (Direct / Express)',
    arabicName: 'قهوة شعبية و تاي بالنعناع',
    icon: '☕',
    baseCost: 60.0,
    baseRevenue: 20.0,
    costMultiplier: 1.15,
    cycleDurationMs: 3000, // 3s
    managerName: 'Naceur Garçon',
    managerRole: 'Plateau Turbo',
    managerAvatar: '🤵',
    managerCost: 1000.0,
  },
  {
    id: 'machmoum',
    name: 'Parfumerie & Machmoum Jasmin',
    arabicName: 'مشموم و عطر الفل',
    icon: '🌸',
    baseCost: 720.0,
    baseRevenue: 90.0,
    costMultiplier: 1.14,
    cycleDurationMs: 6000, // 6s
    managerName: 'Chikha Latifa',
    managerRole: 'Reine du Jasmin',
    managerAvatar: '🧕',
    managerCost: 12000.0,
  },
  {
    id: 'louage',
    name: 'Station Louage & Taxi Collectif',
    arabicName: 'محطة اللواج و التاكسي الجماعي',
    icon: '🚐',
    baseCost: 8640.0,
    baseRevenue: 720.0,
    costMultiplier: 1.13,
    cycleDurationMs: 12000, // 12s
    managerName: 'Chokri Taxi',
    managerRole: 'Pilote Grand Confort',
    managerAvatar: '🕶️',
    managerCost: 100000.0,
  },
  {
    id: 'makroudh',
    name: 'Pâtisserie Makroudh & Baklawa',
    arabicName: 'حلويات المقروض و البقلاوة',
    icon: '🍯',
    baseCost: 103680.0,
    baseRevenue: 4320.0,
    costMultiplier: 1.12,
    cycleDurationMs: 24000, // 24s
    managerName: 'Hadj Amor',
    managerRole: 'Maître Artisan',
    managerAvatar: '👳',
    managerCost: 1200000.0,
  },
  {
    id: 'lac2_lounge',
    name: 'Salon de Thé VIP Lac 2',
    arabicName: 'صالون شاي فخم ضفاف البحيرة',
    icon: '✨',
    baseCost: 1244160.0,
    baseRevenue: 25920.0,
    costMultiplier: 1.11,
    cycleDurationMs: 96000, // 96s
    managerName: 'Si Mehdi',
    managerRole: 'Directeur Général',
    managerAvatar: '💼',
    managerCost: 10000000.0,
  }
];

export const TUNISIAN_EVENTS = [
  {
    id: 'canicule',
    title: 'Canicule 48°C (Chhili)',
    description: 'Chaleur suffocante ! Les gens se ruent sur les boissons fraîches au café, mais les chauffeurs de louage sont K.O.',
    durationMs: 30000, // 30 secondes
    multipliers: { kahwa: 3.0, louage: 0.5 }
  },
  {
    id: 'derby',
    title: 'Soir de Grand Derby',
    description: 'Ambiance folle ! Les cafés et salons sont bondés de supporters.',
    durationMs: 40000,
    multipliers: { kahwa: 2.5, lac2_lounge: 2.0 }
  },
  {
    id: 'mariages',
    title: 'Saison des Mariages (Outia & Fêtes)',
    description: 'Besoins massifs en pâtisseries et fleurs de jasmin.',
    durationMs: 35000,
    multipliers: { machmoum: 3.0, makroudh: 2.5 }
  },
  {
    id: 'embouteillage',
    title: 'Embouteillage Beb Saadoun',
    description: 'Tout est bloqué ! Les gens achètent des fricassés en attendant.',
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
    this.dinars = 4.0; // Don de départ (pour acheter le 1er fricassé)
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

  // Google Ads Rewarded Cash : offre 10 minutes de production instantanée (ou min 20 TND)
  claimAdCashReward(now = Date.now()) {
    let totalPerSecond = 0;
    for (const biz of this.businesses) {
      if (biz.level > 0) {
        totalPerSecond += (this.getRevenue(biz, now) / (biz.cycleDurationMs / 1000));
      }
    }
    // 10 minutes (600s) de revenus cumulés, avec minimum garanti de 25 DT
    const cashReward = Math.max(25.0, Math.floor(totalPerSecond * 600));
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
