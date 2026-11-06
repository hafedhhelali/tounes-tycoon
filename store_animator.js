/**
 * store_animator.js
 * Moteur d'Animation Graphique Canvas 2D 60 FPS Haute Définition pour Tounes Tycoon.
 * Simulation visuelle cutaway vivante et détaillée des commerces tunisiens.
 * Moteur Cartographique Vectoriel de la Tunisie (14 Villes Géographiques & Routes Commerciales).
 * © EOLabs 2026. Pur JavaScript, zéro dépendance, gestion DPR fluide, 60 FPS garanti.
 */

// Polyfill Canvas roundRect pour garantir 100% de compatibilité mobile & WebView
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    if (!radii) radii = 0;
    let r = typeof radii === 'number' ? radii : (Array.isArray(radii) ? radii[0] || 0 : 0);
    r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
}

export class CanvasStoreEngine {
  constructor(canvasEl, engineRef) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.engine = engineRef;
    this.bizId = null;
    this.animId = null;
    this.lastTime = 0;
    this.spawnTimer = 0;
    this.dpr = 1;
    this.width = 340;
    this.height = 200;

    // Simulation entities (bounded pools — zero memory leak)
    this.customers = [];
    this.particles = [];
    this.moneyPuffs = [];
    this.conveyorItems = [];
    this.tapRipples = [];
    this.counterStock = 2;
    this.doorSwing = 0;
    this.conveyorTimer = 0;
    this.lastProgressMs = 0;
    this.cachedDetail = null;
    this.cachedDetailKey = '';
    this.waiter = { x: 118, y: 136, targetX: 140, carryingIcon: '☕', busy: false };
    this.bankVipClient = null;

    // Interaction clickable regions
    this.clickZones = [];

    this.onHireClick = null;
    this.onServeClick = null;

    // Émotes & répertoires d'articles authentiques et spécifiques pour CHAQUE projet
    this.orderIcons = {
      kaskrout: ['🥖', '🥪', '🌶️', '🥤'],
      fricasse: ['🥟', '🍩', '🫒', '🥚'],
      kahwa: ['☕', '🍵', '♠️', '🍏'],
      attariya: ['🍞', '🥛', '🧀', '🫒', '🥫', '🧼', '🥚', '🧂'],
      fruits_de_mer: ['🐟', '🦐', '🦑', '🦀', '🐟'],
      patisserie: ['🍯', '🥐', '🎂', '🧁'],
      produits_laitiers: ['🧀', '🥛', '🧈', '🍶'],
      boucherie: ['🥩', '🔪', '🍖', '🍗'],
      librairie: ['📚', '📖', '✏️', '📰'],
      tobacco_kiosk: ['🚬', '📰', '💧', '🎟️'],
      vente_vetements: ['👕', '👗', '🧥', '👖'],
      vente_montres: ['⌚', '🕰️', '💎', '✨'],
      croisiere_mer: ['⛵', '⚓', '🛥️', '🌊'],
      salle_de_jeux: ['🎮', '🕹️', '🎱', '🎧'],
      emballage_dattes: ['🌴', '📦', '🍯', '✨'],
      taxi_collectif: ['🚖', '🏁', '🚕', '🛣️'],
      superette: ['🛒', '🍫', '🧃', '🧼'],
      supermarche: ['🥩', '📦', '🛒', '🧺'],
      salon_de_the: ['🍹', '🍸', '🍰', '🕶️'],
      restaurant: ['🍗', '🥘', '🥗', '🍖'],
      agence_voyages: ['✈️', '🎫', '🏝️', '🧳'],
      hotel: ['🛎️', '🍸', '🛏️', '🏊'],
      centre_commercial: ['🛍️', '👗', '👟', '🎮'],
      usine_conserves: ['🥫', '🐟', '🍅', '🫒'],
      showroom_auto: ['🚗', '🚘', '🔑', '🏎️'],
      promoteur_immobilier: ['🏢', '🏗️', '📐', '🏡'],
      tayaran_el_ghzela: ['✈️', '🛫', '💺', '🌍'],
      boulangerie_artisanale: ['🥖', '🍞', '🥐', '🥯', '🥨'],
      artisanat_poterie: ['🏺', '🥣', '🏺', '🎨', '🪔'],
      huilerie_olive: ['🫒', '🧴', '🫒', '🌿', '🥫'],
      centre_thalasso: ['🫧', '💆', '🧖', '🌸', '🧴'],
      default: ['🛒', '✨', '🪙', '📦']
    };

    this.happyReactions = ['😋', '⭐', '🥰', '👌', '❤️', '👏', '🔥'];

    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.onWindowResize = () => this.resize();
    this.canvas.addEventListener('click', this.handleCanvasClick);
  }

  setCallbacks({ onHire, onServe }) {
    this.onHireClick = onHire;
    this.onServeClick = onServe;
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const cssW = Math.max(300, parent ? parent.clientWidth : 360);
    const cssH = Math.max(180, parent ? parent.clientHeight : 200);
    this.logicalH = 200;
    this.scale = cssH / this.logicalH;
    this.width = Math.max(300, Math.floor(cssW / this.scale));
    this.height = this.logicalH;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.5);

    this.canvas.width = Math.floor(cssW * this.dpr);
    this.canvas.height = Math.floor(cssH * this.dpr);
    this.canvas.style.width = cssW + 'px';
    this.canvas.style.height = cssH + 'px';

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr * this.scale, this.dpr * this.scale);
  }

  start(bizId) {
    this.stop();
    this.bizId = bizId;
    this.customers = [];
    this.particles = [];
    this.moneyPuffs = [];
    this.conveyorItems = [];
    this.tapRipples = [];
    this.counterStock = 2;
    this.doorSwing = 0;
    this.conveyorTimer = 0;
    this.cachedDetail = null;
    this.cachedDetailKey = '';
    this.waiter = { x: 118, y: 136, targetX: 140, carryingIcon: bizId === 'salon_de_the' ? '🍹' : '☕', busy: false };
    const biz = this.getBiz();
    this.lastProgressMs = biz ? (biz.progressMs || 0) : 0;
    this.spawnTimer = 0.8;
    this.resize();
    if (bizId === 'bank_branch') {
      this.doorSwing = 1.0;
      this.bankVipClient = {
        x: this.width - 26,
        y: 154,
        targetX: 148,
        state: 'entering',
        walkCycle: 0,
        timer: 0
      };
    } else {
      this.bankVipClient = null;
      // Pré-remplissage immédiat pour un commerce vivant dès la première seconde
      this.spawnCustomer();
      if (this.customers.length > 0) {
        const firstCust = this.customers[0];
        firstCust.x = firstCust.stationX;
        firstCust.state = 'doing_activity';
        firstCust.activityTimer = 0.5;
      }
      this.spawnCustomer();
    }
    this.resizeTimer = setTimeout(() => this.resize(), 300);
    if (typeof window !== 'undefined') window.addEventListener('resize', this.onWindowResize);
    this.lastTime = performance.now();
    this.loop = (now) => {
      try {
        this.step(now);
      } catch (err) {
        console.error('CanvasStoreEngine frame error', err);
      }
      this.animId = requestAnimationFrame(this.loop);
    };
    this.animId = requestAnimationFrame(this.loop);
  }

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    clearTimeout(this.resizeTimer);
    if (typeof window !== 'undefined') window.removeEventListener('resize', this.onWindowResize);
    this.customers = [];
    this.particles = [];
    this.moneyPuffs = [];
    this.conveyorItems = [];
    this.tapRipples = [];
    this.clickZones = [];
    this.cachedDetail = null;
    this.cachedDetailKey = '';
    if (this.ctx && this.width && this.height) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  destroy() {
    this.stop();
    if (this.canvas) {
      this.canvas.removeEventListener('click', this.handleCanvasClick);
    }
  }

  getBiz() {
    if (this.bizId === 'tobacco_kiosk') {
      return {
        id: 'tobacco_kiosk',
        name: 'كشك الدخّان والوقيد',
        icon: '🚬',
        level: 10,
        hasManager: true,
        hiredManagersCount: 1,
        isProducing: true,
        cycleDurationMs: 3600,
        progressMs: Date.now() % 3600
      };
    }
    if (this.bizId === 'bank_branch') {
      return {
        id: 'bank_branch',
        name: 'البنك الشعبي',
        icon: '🏦',
        level: 25,
        hasManager: true,
        hiredManagersCount: 1,
        isProducing: true,
        cycleDurationMs: 4500,
        progressMs: Date.now() % 4500
      };
    }
    return this.engine.businesses.find(b => b.id === this.bizId);
  }

  getBizArchetype(bizId = this.bizId) {
    if (bizId === 'bank_branch') return 'bank_branch';
    if (bizId === 'tobacco_kiosk') return 'tobacco_kiosk';
    if (bizId === 'supermarche' || bizId === 'superette') return 'supermarket_checkout';
    if (bizId === 'salle_de_jeux') return 'arcade_billiard';
    if (bizId === 'kahwa') return 'kahwa_counter';
    if (bizId === 'salon_de_the' || bizId === 'restaurant') return 'tea_lounge';
    if (bizId === 'boulangerie_artisanale') return 'boulangerie_oven';
    if (bizId === 'artisanat_poterie') return 'pottery_workshop';
    if (bizId === 'huilerie_olive') return 'olive_press';
    if (bizId === 'centre_thalasso') return 'thalasso_spa';
    if (['croisiere_mer', 'agence_voyages', 'hotel', 'tayaran_el_ghzela', 'showroom_auto', 'promoteur_immobilier'].includes(bizId)) {
      return 'agency_desks';
    }
    if (['kaskrout', 'fricasse'].includes(bizId)) return 'food_counter';
    if (['usine_conserves', 'emballage_dattes'].includes(bizId)) return 'industrial_belt';
    return 'retail_shop';
  }

  getActivitySlotX(archetype, slotIndex) {
    const rightBound = Math.max(210, this.width - 44);
    if (archetype === 'boulangerie_oven' || archetype === 'pottery_workshop' || archetype === 'olive_press') {
      const span = Math.max(88, rightBound - 120);
      return 120 + (slotIndex % 4) * (span / 3);
    }
    if (archetype === 'thalasso_spa') {
      const span = Math.max(110, rightBound - 116);
      return 116 + (slotIndex % 4) * (span / 3);
    }
    if (archetype === 'kahwa_counter') {
      // 5 tabourets devant le comptoir de café ergonomique
      const span = Math.max(96, rightBound - 114);
      return 114 + (slotIndex % 5) * (span / 4);
    }
    if (archetype === 'tea_lounge') {
      // 5 tables pour salon de thé et restaurant avec chaises/fauteuils où les clients s'assoient
      const span = Math.max(116, rightBound - 116);
      return 116 + (slotIndex % 5) * (span / 4);
    }
    if (archetype === 'agency_desks') {
      // 2 bureaux : Bureau 1 (Manager) et Bureau 2 (Assistant) avec ordinateurs
      const desk1X = 112;
      const desk2X = Math.min(rightBound - 12, 198);
      return (slotIndex % 2 === 0) ? desk1X : desk2X;
    }
    if (archetype === 'supermarket_checkout') {
      // Magasin général: jusqu'à 3 caisses. Supérette: max 2 caisses
      const biz = this.getBiz();
      const isSuperette = (biz ? biz.id : this.bizId) === 'superette';
      const maxLanes = isSuperette ? 2 : 3;
      const openLanes = Math.min(maxLanes, Math.max(1, biz ? (biz.hiredManagersCount || 1) : 1));
      const laneIdx = slotIndex % openLanes;
      return 48 + laneIdx * (isSuperette ? 88 : 74);
    }
    if (archetype === 'tobacco_kiosk') {
      // Guichet de tabac : 1 seul employé, file ergonomique devant le guichet
      return 134 + (slotIndex % 3) * 24;
    }
    if (archetype === 'arcade_billiard') {
      // 5 postes : [0,1] autour de la table de billard, [2,3,4] devant les consoles avec écrans
      const span = Math.max(88, rightBound - 120);
      return 120 + (slotIndex % 5) * (span / 4);
    }
    if (archetype === 'food_counter') {
      const span = Math.max(76, rightBound - 120);
      return 120 + (slotIndex % 4) * (span / 3);
    }
    // retail_shop : rayon / vitrine avant passage en caisse
    const span = Math.max(72, rightBound - 126);
    return 126 + (slotIndex % 3) * (span / 2);
  }

  getStoreTier(biz) {
    const lvl = biz ? (biz.level || 1) : 1;
    if (lvl >= 100) return { tier: 5, name: 'VIP ملكي', color: '#f43f5e', border: '#fde047', neon: '#38bdf8', carpet: ['#991b1b', '#fbbf24'] };
    if (lvl >= 50)  return { tier: 4, name: 'ذهبي فاخر', color: '#f59e0b', border: '#fef08a', neon: '#facc15', carpet: ['#7f1d1d', '#f59e0b'] };
    if (lvl >= 25)  return { tier: 3, name: 'تيربو نيون', color: '#a855f7', border: '#e9d5ff', neon: '#c084fc', carpet: ['#1e1b4b', '#a855f7'] };
    if (lvl >= 10)  return { tier: 2, name: 'حرفي ممتاز', color: '#10b981', border: '#a7f3d0', neon: '#34d399', carpet: ['#064e3b', '#10b981'] };
    return                 { tier: 1, name: 'محلّ أصيل', color: '#64748b', border: '#cbd5e1', neon: null,      carpet: null };
  }

  getCycleProgressRatio(biz) {
    if (!biz || !biz.cycleDurationMs || biz.cycleDurationMs <= 0) return 0;
    if (biz.hasManager || biz.isProducing) {
      return Math.min(1, Math.max(0, (biz.progressMs || 0) / biz.cycleDurationMs));
    }
    return 0;
  }

  drawRadialGauge(ctx, cx, cy, r, ratio, color, label) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.beginPath();
    ctx.arc(cx, cy, r + 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    const clamped = Math.min(1, Math.max(0.04, ratio));
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamped);
    ctx.stroke();

    if (label) {
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 7.5px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, cx, cy + 0.5);
    }
    ctx.restore();
  }

  pushParticle(p) {
    if (this.particles.length >= 42) this.particles.shift();
    this.particles.push(p);
  }

  pushMoneyPuff(m) {
    if (this.moneyPuffs.length >= 14) this.moneyPuffs.shift();
    this.moneyPuffs.push(m);
  }

  getOrderIcon() {
    const list = this.orderIcons[this.bizId] || this.orderIcons.default;
    return list[Math.floor(Math.random() * list.length)];
  }

  spawnCustomer() {
    const archetype = this.getBizArchetype(this.bizId);
    if (archetype === 'bank_branch') return;
    const maxActive = (archetype === 'kahwa_counter' || archetype === 'tea_lounge' || archetype === 'thalasso_spa') ? 5 : (archetype === 'supermarket_checkout' || archetype === 'tobacco_kiosk' ? 3 : 4);
    const activeCustomers = this.customers.filter(c => c.state !== 'walking_out');
    if (activeCustomers.length >= maxActive) return;

    // Trouver un slot de station libre pour éviter toute superposition
    const usedSlots = new Set(activeCustomers.map(c => c.stationSlot));
    let slotIdx = 0;
    for (let s = 0; s < maxActive; s++) {
      if (!usedSlots.has(s)) {
        slotIdx = s;
        break;
      }
    }
    const stationX = this.getActivitySlotX(archetype, slotIdx);

    let activityType = 'browsing';
    let activityDuration = 1.25;
    let ticketIcon = null;
    let hasCart = false;
    let isSeated = false;
    let needsWaiterService = false;

    let groupSize = 1;
    if (archetype === 'arcade_billiard') {
      activityType = slotIdx < 2 ? 'billiard' : 'console';
      activityDuration = 2.4;
    } else if (archetype === 'kahwa_counter') {
      activityType = 'drinking';
      activityDuration = 2.1;
      needsWaiterService = true;
      isSeated = true; // Assis sur les tabourets devant le comptoir
    } else if (archetype === 'tea_lounge') {
      activityType = this.bizId === 'restaurant' ? 'eating' : 'drinking';
      activityDuration = this.bizId === 'restaurant' ? 2.5 : 2.2;
      isSeated = true;
      needsWaiterService = true;
    } else if (archetype === 'agency_desks') {
      activityType = 'ordering_desk';
      activityDuration = 1.55;
      ticketIcon = '📄'; // Partent avec des papiers / contrats / billets !
      groupSize = 1 + Math.floor(Math.random() * 5); // 1 à 5 personnes par réservation
    } else if (archetype === 'supermarket_checkout') {
      activityType = 'checkout_cart';
      activityDuration = 0.6;
      hasCart = true;
    } else if (archetype === 'tobacco_kiosk') {
      activityType = 'ordering_tobacco';
      activityDuration = 0.9;
    } else if (archetype === 'food_counter') {
      activityType = 'eating';
      activityDuration = 1.5;
    } else if (archetype === 'boulangerie_oven') {
      activityType = 'buying_bread';
      activityDuration = 1.35;
      ticketIcon = '🥖';
    } else if (archetype === 'pottery_workshop') {
      activityType = 'viewing_pottery';
      activityDuration = 1.75;
      ticketIcon = '🏺';
    } else if (archetype === 'olive_press') {
      activityType = 'sampling_oil';
      activityDuration = 1.6;
      ticketIcon = '🫒';
    } else if (archetype === 'thalasso_spa') {
      activityType = 'relaxing_spa';
      activityDuration = 2.4;
      isSeated = true;
      ticketIcon = '💆';
    }

    const evolvedUnit = this.getEvolvedUnitPrice(this.bizId);
    const basketMultiplier = 0.55 + Math.random() * 1.65 + (slotIdx % 3) * 0.35;
    const basketTotal = Math.max(1.2, Math.round(evolvedUnit * basketMultiplier * 10) / 10);

    const customer = {
      id: Math.random(),
      x: this.width - 18,
      y: 154,
      stationSlot: slotIdx,
      stationX,
      targetX: stationX,
      archetype,
      activityType,
      activityDuration,
      activityTimer: 0,
      steamTimer: 0,
      groupSize,
      hasCart,
      isSeated,
      basketTotal,
      needsWaiterService,
      servedByWaiter: !needsWaiterService,
      waitServiceTimer: 0,
      state: 'walking_in',
      orderIcon: archetype === 'kahwa_counter'
        ? (slotIdx % 2 === 0 ? '☕' : '🍵')
        : (archetype === 'tea_lounge'
            ? (this.bizId === 'restaurant'
                ? ['🍲', '🍛', '🍗', '🥩', '🥘', '🥗'][slotIdx % 6]
                : ['🍹', '🍸', '☕', '🍰', '🧋'][slotIdx % 5])
            : this.getOrderIcon()),
      ticketIcon,
      isSmoking: archetype === 'kahwa_counter' ? (Math.random() < 0.45) : false,
      talkPhase: Math.random() * Math.PI * 2,
      hasChicha: (this.bizId === 'salon_de_the') && (slotIdx % 2 === 0 || Math.random() < 0.6),
      reaction: null,
      payDuration: (archetype === 'kahwa_counter' || archetype === 'tea_lounge' || archetype === 'tobacco_kiosk') ? 0.55 : 0.75,
      payTimer: 0,
      waitTimer: 0,
      hasBag: false,
      walkCycle: Math.random() * Math.PI * 2
    };
    this.doorSwing = 1.0;
    this.customers.push(customer);
  }

  getUnitBasePrice(bizId) {
    const UNIT_PRICES = {
      kahwa: 1.8,
      tobacco_kiosk: 10.0,
      boucherie: 30.0,
      croisiere_mer: 100.0,
      agence_voyages: 500.0,
      fricasse: 1.2,
      taxi_collectif: 2.0,
      kaskrout: 3.5,
      salon_de_the: 4.5,
      salle_de_jeux: 5.0,
      attariya: 6.5,
      librairie: 6.5,
      emballage_dattes: 12.0,
      patisserie: 14.0,
      produits_laitiers: 16.0,
      superette: 18.0,
      usine_conserves: 18.0,
      fruits_de_mer: 22.0,
      restaurant: 28.0,
      vente_vetements: 45.0,
      supermarche: 65.0,
      centre_commercial: 75.0,
      vente_montres: 85.0,
      showroom_auto: 120.0,
      promoteur_immobilier: 140.0,
      hotel: 160.0,
      tayaran_el_ghzela: 450.0,
      boulangerie_artisanale: 1.5,
      artisanat_poterie: 18.0,
      huilerie_olive: 35.0,
      centre_thalasso: 90.0
    };
    return UNIT_PRICES[bizId] || 10.0;
  }

  getEvolvedUnitPrice(bizId) {
    const biz = this.getBiz();
    const lvl = biz && biz.level > 0 ? biz.level : 1;
    const base = this.getUnitBasePrice(bizId);
    // Évolution douce (+1.5% par niveau) pour des prix cohérents avec la montée en niveau
    return base * (1 + (lvl - 1) * 0.015);
  }

  formatEvolvedPrice(price) {
    if (price == null || isNaN(price)) return '0.00';
    if (price < 10) return price.toFixed(2);
    if (price < 100) return price.toFixed(1);
    if (price < 1000) return Math.round(price).toString();
    if (price < 100000) return Math.round(price).toLocaleString('fr-FR');
    if (price < 1000000) return (price / 1000).toFixed(1) + 'k';
    return (price / 1000000).toFixed(1) + 'M';
  }

  drawPOSTerminal(ctx, x, y, w, h, priceText, isBusy = false, isOpen = true) {
    ctx.save();
    const timeSec = (typeof performance !== 'undefined' ? performance.now() : Date.now()) * 0.001;
    // Pied de support inclinable sur socle noir
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + w / 2 - 2, y + h - 1, 4, 6);
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h + 5, 7, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Boîtier POS haute finition biseauté
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 3.5);
    ctx.fill();
    ctx.strokeStyle = isBusy ? '#10b981' : (isOpen ? '#38bdf8' : '#475569');
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Écran OLED rétroéclairé vert émeraude
    const scrX = x + 2.5;
    const scrY = y + 2.5;
    const scrW = w - 5;
    const scrH = Math.min(10, h - 8);

    ctx.fillStyle = '#022c22';
    ctx.fillRect(scrX, scrY, scrW, scrH);
    ctx.strokeStyle = isOpen ? '#10b981' : '#475569';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(scrX, scrY, scrW, scrH);

    // Laser de scan animé
    if (isOpen && isBusy) {
      const scanX = scrX + 2 + Math.abs(Math.sin((timeSec || Date.now() * 0.005) * 6)) * (scrW - 4);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.85)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(scanX, scrY + 1);
      ctx.lineTo(scanX, scrY + scrH - 1);
      ctx.stroke();
    }

    // AFFICHEUR CLIENT DÉDIÉ SUR MÂT (ÉLÉVATION PRO, ZÉRO DÉBORDEMENT, TRÈS LISIBLE)
    if (isOpen && priceText) {
      const poleX = x + w - 4;
      const poleY1 = y;
      const poleY2 = y - 10;
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(poleX, poleY1);
      ctx.lineTo(poleX, poleY2);
      ctx.stroke();

      const podW = 40;
      const podH = 13;
      const podX = poleX - podW + 6;
      const podY = poleY2 - podH + 2;

      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.roundRect(podX, podY, podW, podH, 3);
      ctx.fill();
      ctx.strokeStyle = isBusy ? '#10b981' : '#38bdf8';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.rect(podX + 1, podY + 1, podW - 2, podH - 2);
      ctx.clip();
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 7.5px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(priceText, podX + podW / 2, podY + podH / 2);
      ctx.restore();
    } else {
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 5.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('مغلقة 🔒', scrX + scrW / 2, scrY + scrH / 2);
    }

    // Clavier à micro-touches rétroéclairées & contactless
    const keyY = scrY + scrH + 2;
    const keyH = (y + h) - keyY - 2;
    if (keyH >= 3) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(scrX, keyY, scrW, keyH);
      ctx.fillStyle = '#64748b';
      for (let k = 0; k < 4; k++) {
        ctx.fillRect(scrX + 1.5 + (k % 2) * 5, keyY + 1 + Math.floor(k / 2) * 2, 3.5, 1.2);
      }
      ctx.fillStyle = isOpen ? '#38bdf8' : '#475569';
      ctx.beginPath();
      ctx.arc(scrX + scrW - 3, keyY + keyH / 2, 1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  triggerPayment(customer, isProducing) {
    const biz = this.getBiz();
    const isPerPersonBiz = (this.bizId === 'croisiere_mer' || this.bizId === 'agence_voyages');
    const groupSize = (customer && customer.groupSize) ? customer.groupSize : 1;
    const finalPrice = this.getEvolvedUnitPrice(this.bizId) * (isPerPersonBiz ? groupSize : 1);
    const formattedPrice = this.formatEvolvedPrice(finalPrice);
    const gainText = isPerPersonBiz
      ? `👥${groupSize} • +${formattedPrice} د.ت`
      : `+${formattedPrice} د.ت`;

    this.registerFlash = 1.0;
    const archetype = this.getBizArchetype(this.bizId);
    if (archetype === 'industrial_belt' || archetype === 'retail_shop' || archetype === 'food_counter') {
      this.counterStock = Math.max(0, (this.counterStock || 1) - 1);
    }

    if (typeof window !== 'undefined' && window.soundEngine) {
      if (window.soundEngine.playWorkSound) {
        window.soundEngine.playWorkSound(this.bizId);
      } else if (window.soundEngine.playCoin) {
        window.soundEngine.playCoin();
      }
    }

    const px = customer ? (customer.x + 8) : 76;
    const py = customer ? (customer.y - 44) : 104;
    // Limiter le nombre de puffs simultanés pour zéro chevauchement de texte
    if (this.moneyPuffs.length >= 2) {
      this.moneyPuffs.shift();
    }
    this.pushMoneyPuff({
      x: px,
      y: py,
      vy: -28,
      text: gainText,
      life: 0.85,
      maxLife: 0.85
    });

    const count = isProducing ? 14 : 8;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const speed = 38 + Math.random() * 58;
      this.pushParticle({
        x: 64,
        y: 122,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 22,
        color: Math.random() > 0.3 ? '#fbbf24' : '#34d399',
        radius: 1.8 + Math.random() * 2.1,
        life: 0.65 + Math.random() * 0.25,
        maxLife: 0.85,
        isSparkle: true
      });
    }
  }

  handleCanvasClick(event) {
    if (event) {
      if (typeof event.preventDefault === 'function') event.preventDefault();
      if (typeof event.stopPropagation === 'function') event.stopPropagation();
    }
    const rect = this.canvas.getBoundingClientRect();
    const ratioX = rect.width > 0 ? this.width / rect.width : 1;
    const ratioY = rect.height > 0 ? this.height / rect.height : 1;
    const clickX = (event.clientX - rect.left) * ratioX;
    const clickY = (event.clientY - rect.top) * ratioY;

    // 1. Onde de choc Tycoon au point de tap
    if (this.tapRipples.length >= 6) this.tapRipples.shift();
    this.tapRipples.push({ x: clickX, y: clickY, r: 4, maxR: 28, life: 0.38, maxLife: 0.38 });

    for (const zone of this.clickZones) {
      if (
        clickX >= zone.x &&
        clickX <= zone.x + zone.width &&
        clickY >= zone.y &&
        clickY <= zone.y + zone.height
      ) {
        if (zone.type === 'hire_cashier' || zone.type === 'hire_worker') {
          if (this.onHireClick) this.onHireClick(this.bizId, zone.slotIndex);
        } else if (zone.type === 'employee_info') {
          this.pushMoneyPuff({
            x: zone.x + zone.width / 2,
            y: zone.y - 12,
            vy: -25,
            text: `👤 ${zone.name} : ${zone.role}`,
            life: 1.3,
            maxLife: 1.3
          });
        }
        return;
      }
    }

    // 2. Tap dans la scène = démarrer le cycle de production si à l'arrêt ; toute accélération passe par PUB
    const biz = this.getBiz();
    if (biz && biz.level > 0) {
      const wasRunning = biz.hasManager || biz.isProducing;
      if (!wasRunning) {
        if (this.onServeClick) {
          this.onServeClick(this.bizId);
        } else if (this.engine.startProduction) {
          this.engine.startProduction(this.bizId);
        }
      }
      const archetype = this.getBizArchetype(this.bizId);
      if (archetype === 'industrial_belt' && this.conveyorItems.length < 6) {
        this.conveyorItems.push({
          x: Math.min(this.width - 55, Math.max(125, clickX)),
          y: 135,
          targetX: 90,
          icon: this.getOrderIcon(),
          speed: 95
        });
      }
      const label = !wasRunning
        ? `⚡ انطلق الإنتاج (${Math.round((biz.cycleDurationMs || 1000) / 1000)}s)`
        : `🎬 للتسريع x2 انزل على زرّ التيربو (إشهار)`;
      this.pushMoneyPuff({ x: clickX, y: clickY - 10, vy: -38, text: label, life: 0.85, maxLife: 0.85 });
    }
  }

  // --- RENDU D'ARRIÈRE-PLAN TUNISIEN DÉTAILLÉ & ARCHITECTURE EN PERSPECTIVE ---
  drawBackdrop(ctx, bizId, now) {
    const w = this.width;
    const h = this.height;

    // 1. Fond mural d'ambiance avec dégradé chaud et perspective de pièce
    let wallGrad = ctx.createLinearGradient(0, 0, 0, h - 54);
    if (bizId === 'kahwa') {
      wallGrad.addColorStop(0, '#261a12');
      wallGrad.addColorStop(0.6, '#3a271d');
      wallGrad.addColorStop(1, '#1b120c');
    } else if (bizId === 'kaskrout' || bizId === 'fricasse') {
      wallGrad.addColorStop(0, '#1c2833');
      wallGrad.addColorStop(0.6, '#131e29');
      wallGrad.addColorStop(1, '#0c141c');
    } else if (bizId === 'fruits_de_mer' || bizId === 'croisiere_mer') {
      wallGrad.addColorStop(0, '#0c4a6e');
      wallGrad.addColorStop(0.6, '#0369a1');
      wallGrad.addColorStop(1, '#082f49');
    } else if (bizId === 'librairie') {
      wallGrad.addColorStop(0, '#1e293b');
      wallGrad.addColorStop(0.6, '#0f172a');
      wallGrad.addColorStop(1, '#020617');
    } else if (bizId === 'boucherie') {
      wallGrad.addColorStop(0, '#450a0a');
      wallGrad.addColorStop(0.6, '#7f1d1d');
      wallGrad.addColorStop(1, '#1c0505');
    } else if (bizId === 'produits_laitiers') {
      wallGrad.addColorStop(0, '#14532d');
      wallGrad.addColorStop(0.6, '#166534');
      wallGrad.addColorStop(1, '#052e16');
    } else if (bizId === 'vente_vetements') {
      wallGrad.addColorStop(0, '#4a044e');
      wallGrad.addColorStop(0.6, '#701a75');
      wallGrad.addColorStop(1, '#2e0238');
    } else if (bizId === 'vente_montres') {
      wallGrad.addColorStop(0, '#1e1b4b');
      wallGrad.addColorStop(0.6, '#312e81');
      wallGrad.addColorStop(1, '#0f0d28');
    } else if (bizId === 'salle_de_jeux') {
      wallGrad.addColorStop(0, '#09090b');
      wallGrad.addColorStop(0.6, '#18181b');
      wallGrad.addColorStop(1, '#030712');
    } else if (bizId === 'emballage_dattes') {
      wallGrad.addColorStop(0, '#431407');
      wallGrad.addColorStop(0.6, '#7c2d12');
      wallGrad.addColorStop(1, '#1a0502');
    } else if (bizId === 'tobacco_kiosk') {
      wallGrad.addColorStop(0, '#500724');
      wallGrad.addColorStop(0.6, '#831843');
      wallGrad.addColorStop(1, '#250210');
    } else if (bizId === 'patisserie') {
      wallGrad.addColorStop(0, '#38203f');
      wallGrad.addColorStop(0.6, '#24132a');
      wallGrad.addColorStop(1, '#150a1a');
    } else if (bizId === 'attariya') {
      wallGrad.addColorStop(0, '#102e23');
      wallGrad.addColorStop(0.6, '#0b2019');
      wallGrad.addColorStop(1, '#05130e');
    } else if (bizId === 'boulangerie_artisanale') {
      wallGrad.addColorStop(0, '#451a03');
      wallGrad.addColorStop(0.6, '#78350f');
      wallGrad.addColorStop(1, '#270e02');
    } else if (bizId === 'artisanat_poterie') {
      wallGrad.addColorStop(0, '#431407');
      wallGrad.addColorStop(0.6, '#9a3412');
      wallGrad.addColorStop(1, '#1c0702');
    } else if (bizId === 'huilerie_olive') {
      wallGrad.addColorStop(0, '#14532d');
      wallGrad.addColorStop(0.6, '#365314');
      wallGrad.addColorStop(1, '#0a2608');
    } else if (bizId === 'centre_thalasso') {
      wallGrad.addColorStop(0, '#083344');
      wallGrad.addColorStop(0.6, '#0e7490');
      wallGrad.addColorStop(1, '#041f2a');
    } else if (bizId === 'tayaran_el_ghzela' || bizId === 'showroom_auto' || bizId === 'promoteur_immobilier') {
      wallGrad.addColorStop(0, '#0f172a');
      wallGrad.addColorStop(0.6, '#1e293b');
      wallGrad.addColorStop(1, '#090e17');
    } else {
      wallGrad.addColorStop(0, '#1f2937');
      wallGrad.addColorStop(0.6, '#111827');
      wallGrad.addColorStop(1, '#0b0f19');
    }
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, w, h - 54);

    // 2. Frise supérieure sculptée en plâtre ciselé / Zellige (نقش حديدة وتزويق تونسي)
    ctx.save();
    ctx.fillStyle = 'rgba(251, 191, 36, 0.18)';
    ctx.fillRect(0, 0, w, 18);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 18);
    ctx.lineTo(w, 18);
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = '10px monospace';
    for (let x = 6; x < w; x += 22) {
      ctx.fillText('❖', x, 13);
    }
    ctx.restore();

    // 3. Grands Arcs Tunisiens en relief (أقواس حدوة الحصان الأندلسية) sur le mur du fond
    ctx.save();
    const archW = Math.min(100, (w - 60) / 3);
    const archCount = Math.max(2, Math.floor((w - 40) / archW));
    for (let i = 0; i < archCount; i++) {
      const ax = 20 + i * (archW + 14);
      const ay = 24;
      const aw = archW;
      const ah = h - 84;

      // Niche en retrait avec ombre
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.beginPath();
      ctx.moveTo(ax, ay + ah);
      ctx.lineTo(ax, ay + 30);
      ctx.bezierCurveTo(ax, ay, ax + aw, ay, ax + aw, ay + 30);
      ctx.lineTo(ax + aw, ay + ah);
      ctx.closePath();
      ctx.fill();

      // Arc en pierre de Kadhel sculpté
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
    ctx.restore();

    // 4. Décoration de fond spécifique par commerce
    this.drawStoreProps(ctx, bizId, now, w, h);

    // 5. Sol tunisien soigné en perspective avec dalles de zellige vernis
    const floorY = h - 54;
    const floorH = 54;
    let floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
    floorGrad.addColorStop(0, '#22252a');
    floorGrad.addColorStop(0.3, '#1a1d22');
    floorGrad.addColorStop(1, '#0b0d10');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, w, floorH);

    // Bordure en marbre poli Kadhel / frise dorée
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, floorY + 1.5);
    ctx.lineTo(w, floorY + 1.5);
    ctx.stroke();

    // Perspective des carreaux de zellige (damier)
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = -20; x < w + 80; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, floorY);
      ctx.lineTo(x - 28, h);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(0, floorY + 16);
    ctx.lineTo(w, floorY + 16);
    ctx.moveTo(0, floorY + 34);
    ctx.lineTo(w, floorY + 34);
    ctx.stroke();

    // Reflets de lumière sur le carrelage
    ctx.fillStyle = 'rgba(251, 191, 36, 0.03)';
    ctx.fillRect(0, floorY, w, 20);
    ctx.restore();

    // 6. Tapis VIP & Néons Architecturaux selon le palier Tycoon (Tier 2..5)
    const biz = this.getBiz();
    const tier = this.getStoreTier(biz);
    if (tier.carpet) {
      ctx.save();
      const cX = 92;
      const cY = h - 31;
      const cW = Math.max(80, w - 122);
      const cH = 18;
      ctx.fillStyle = tier.carpet[0];
      ctx.beginPath();
      ctx.roundRect(cX, cY, cW, cH, 3);
      ctx.fill();
      ctx.strokeStyle = tier.carpet[1];
      ctx.lineWidth = 1.6;
      ctx.strokeRect(cX + 2, cY + 2, cW - 4, cH - 4);
      // Franges dorées du tapis VIP
      ctx.fillStyle = tier.carpet[1];
      for (let fy = cY + 2; fy < cY + cH - 1; fy += 3.5) {
        ctx.fillRect(cX - 3, fy, 3, 1.5);
        ctx.fillRect(cX + cW, fy, 3, 1.5);
      }
      ctx.restore();
    }
    if (tier.neon) {
      ctx.save();
      ctx.strokeStyle = tier.neon;
      ctx.shadowColor = tier.neon;
      ctx.shadowBlur = 7;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(12, 19.5);
      ctx.lineTo(w - 12, 19.5);
      ctx.stroke();
      ctx.restore();
    }

    // 7. Porte d'entrée vitrée battante avec clochette dorée à droite
    this.drawEntranceDoor(ctx, now, w, h);
  }

  drawEntranceDoor(ctx, now, w, h) {
    ctx.save();
    const doorX = w - 26;
    const doorY = h - 120;
    const doorW = 22;
    const doorH = 70;
    const swing = this.doorSwing || 0;

    // Cadre de porte en bois de cèdre & laiton
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(doorX, doorY, doorW, doorH);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2.2;
    ctx.strokeRect(doorX, doorY, doorW, doorH);

    // Battant vitré animé en perspective lors du passage d'un client
    const openScaleX = 1 - swing * 0.42;
    ctx.save();
    ctx.translate(doorX + doorW, doorY);
    ctx.scale(openScaleX, 1);
    const glassGrad = ctx.createLinearGradient(-doorW, 0, 0, doorH);
    glassGrad.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
    glassGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.14)');
    glassGrad.addColorStop(1, 'rgba(14, 165, 233, 0.25)');
    ctx.fillStyle = glassGrad;
    ctx.fillRect(-doorW + 2, 2, doorW - 4, doorH - 4);

    // Reflet diagonal sur la vitre
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.beginPath();
    ctx.moveTo(-doorW + 4, 10);
    ctx.lineTo(-4, 24);
    ctx.lineTo(-4, 34);
    ctx.lineTo(-doorW + 4, 20);
    ctx.closePath();
    ctx.fill();

    // Poignée en laiton
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-doorW + 4, doorH * 0.52, 2.5, 9);
    ctx.restore();

    // Plaque lumineuse "مفتوح" (Ouvert) + Clochette de boutique
    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    ctx.roundRect(doorX - 3, doorY - 12, doorW + 4, 10, 3);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 6.5px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('مفتوح', doorX + doorW / 2 - 1, doorY - 4.5);

    // Clochette dorée qui tinte à l'ouverture
    if (swing > 0.08) {
      const bellAngle = Math.sin(now * 0.045) * 0.35 * swing;
      ctx.save();
      ctx.translate(doorX + 4, doorY + 7);
      ctx.rotate(bellAngle);
      ctx.font = '9px sans-serif';
      ctx.fillText('🔔', 0, 3);
      ctx.restore();
    }
    ctx.restore();
  }

  // --- ACCESSOIRES DE FOND RICHES SELON LE MÉTIER (DÉCOR HAUT DE GAMME SANS ÉTAGÈRES MOCHES) ---
  drawStoreProps(ctx, bizId, now, w, h) {
    ctx.save();
    const timeSec = now / 1000;

    // 1. SALON DE THÉ : Décor lounge luxueux, ZÉRO étagères, grands lustres dorés, miroir baroque, plantes vertes
    if (bizId === 'salon_de_the') {
      // Lustres en cristal et laiton suspendus
      for (const lx of [145, Math.min(w - 65, 265)]) {
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, 24);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(lx, 26, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '11px serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨', lx, 30);
        const glow = ctx.createRadialGradient(lx, 28, 2, lx, 28, 34);
        glow.addColorStop(0, 'rgba(253, 224, 71, 0.22)');
        glow.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(lx, 28, 34, 0, Math.PI * 2);
        ctx.fill();
      }

      // Grand miroir baroque doré sur le mur
      const mx = (w - 70) / 2 + 50;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(mx - 30, 32, 60, 42, 14);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(mx - 26, 36, 52, 34);
      ctx.font = '12px serif';
      ctx.fillStyle = '#fde047';
      ctx.textAlign = 'center';
      ctx.fillText('🪞', mx, 57);

      // Belles plantes d'intérieur en pot doré
      ctx.font = '15px serif';
      ctx.fillText('🪴', w - 40, 78);
      ctx.fillText('🌿', 108, 78);
    }

    // 2. RESTAURANT : Ambiance gastronomique feutrée, suspensions cuivre martelé, tableaux culinaires, faïences peintes
    else if (bizId === 'restaurant') {
      // Suspensions lumineuses chaleureuses
      for (const rx of [140, Math.min(w - 70, 255)]) {
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(rx, 0);
        ctx.lineTo(rx, 22);
        ctx.stroke();
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(rx, 24, 6.5, Math.PI, 0, true);
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1;
        ctx.stroke();
        const rGlow = ctx.createRadialGradient(rx, 26, 1, rx, 26, 28);
        rGlow.addColorStop(0, 'rgba(251, 191, 36, 0.22)');
        rGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = rGlow;
        ctx.beginPath();
        ctx.arc(rx, 26, 28, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cadre gastronomique central en bois noble
      const frameX = (w - 70) / 2 + 50;
      ctx.fillStyle = '#451a03';
      ctx.fillRect(frameX - 28, 34, 56, 38);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(frameX - 28, 34, 56, 38);
      ctx.font = '13px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🍲', frameX - 11, 57);
      ctx.fillText('🥘', frameX + 11, 57);

      // Assiettes décoratives en zellige aux murs
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(106, 52, 8.5, 0, Math.PI * 2);
      ctx.arc(w - 42, 52, 8.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Olivier d'ornement en pot
      ctx.font = '15px serif';
      ctx.fillText('🪴', w - 42, 80);
    }

    // 3. PÂTISSERIE : Niche centrale élégante avec moulures dorées, pièces montées d'apparat
    else if (bizId === 'patisserie') {
      const px = (w - 70) / 2 + 50;
      ctx.fillStyle = 'rgba(76, 29, 149, 0.25)';
      ctx.beginPath();
      ctx.roundRect(px - 44, 30, 88, 52, 8);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Pièces montées et gâteaux de cérémonie au mur
      ctx.font = '16px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎂', px, 54);
      ctx.font = '12px serif';
      ctx.fillText('🧁', px - 24, 66);
      ctx.fillText('🍓', px + 24, 66);

      // Appliques murales dorées
      for (const lx of [108, w - 42]) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = '11px serif';
        ctx.fillText('✨', lx, 46);
        ctx.fillText('🍯', lx, 72);
      }
    }

    // 4. LIBRAIRIE : Bibliothèque d'acajou majestueuse, volumes reliés cuir et or, globe et lampe banquier
    else if (bizId === 'librairie') {
      const libW = w - 130;
      const libX = 104;
      ctx.fillStyle = '#271206';
      ctx.fillRect(libX, 30, libW, 58);
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(libX, 30, libW, 58);

      // Corniche supérieure sculptée
      ctx.fillStyle = '#451a03';
      ctx.fillRect(libX - 2, 28, libW + 4, 4.5);

      // Rayon intermédiaire en chêne
      ctx.fillStyle = '#78350f';
      ctx.fillRect(libX, 58, libW, 3.5);

      // Livres rangés serrés aux reliures riches
      const bookColors = ['#991b1b', '#1e3a8a', '#14532d', '#78350f', '#581c87', '#b45309', '#0f766e', '#831843'];
      let bIdx = 0;
      for (let bx = libX + 6; bx < libX + libW - 30; bx += 7) {
        ctx.fillStyle = bookColors[bIdx % bookColors.length];
        const bh = 17 + (bIdx % 3) * 3;
        ctx.fillRect(bx, 58 - bh, 5.5, bh);
        bIdx++;
      }
      for (let bx = libX + 6; bx < libX + libW - 14; bx += 7) {
        ctx.fillStyle = bookColors[(bIdx + 2) % bookColors.length];
        const bh = 18 + (bIdx % 4) * 2;
        ctx.fillRect(bx, 88 - bh, 5.5, bh);
        bIdx++;
      }

      ctx.font = '12px serif';
      ctx.fillText('🌍', libX + libW - 22, 50);
      ctx.fillText('📖', libX + libW - 10, 52);
    }

    // 5. SALLE DE JEUX : Esports Arena avec néon RGB dynamique, écusson gamer et ambiance sombre
    else if (bizId === 'salle_de_jeux') {
      ctx.save();
      const rgbShift = Math.sin(timeSec * 3);
      ctx.strokeStyle = rgbShift > 0 ? '#06b6d4' : '#d946ef';
      ctx.shadowColor = rgbShift > 0 ? '#06b6d4' : '#d946ef';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(104, 32);
      ctx.lineTo(w - 36, 32);
      ctx.stroke();
      ctx.restore();

      const gx = (w - 70) / 2 + 50;
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.roundRect(gx - 26, 38, 52, 34, 5);
      ctx.fill();
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.font = '14px serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡', gx, 60);
    }

    // 6. CAFÉ POPULAIRE : Horloge murale, carrelage et Kanoun
    else if (bizId === 'kahwa') {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(104, 48, w - 130, 4);
      ctx.font = '13px serif';
      for (let x = 114; x < w - 36; x += 36) {
        ctx.fillText('🍵', x, 44);
      }
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(54, 48, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.font = '10px sans-serif';
      ctx.fillText('🕐', 48, 52);
    }

    // 7. KASKROUT / FRICASSÉ : Pain chaud et ardoise traditionnelle
    else if (bizId === 'kaskrout' || bizId === 'fricasse') {
      ctx.fillStyle = '#854d0e';
      ctx.fillRect(105, 52, w - 130, 4);
      ctx.font = '13px serif';
      for (let x = 118; x < w - 34; x += 36) {
        ctx.fillText('🥖', x, 48);
        ctx.fillText(bizId === 'fricasse' ? '🍩' : '🫒', x, 78);
      }
    }

    // 8. BOUCHERIE : Faïence blanche bouchère, tringle inox avec crochets et viande
    else if (bizId === 'boucherie') {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(104, 42, w - 130, 42);
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(104, 42, w - 130, 42);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(106, 50, w - 134, 3);
      const meatItems = ['🥩', '🔪', '🍖', '🍗'];
      meatItems.forEach((m, idx) => {
        if (118 + idx * 36 < w - 38) {
          ctx.font = '13px serif';
          ctx.fillText(m, 118 + idx * 36, 74);
        }
      });
    }

    // 9. POISSONNERIE (FRUITS DE MER) : Mosaïque marine et étalage glacé
    else if (bizId === 'fruits_de_mer') {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(104, 46, w - 130, 4);
      const fishItems = ['🐟', '🦐', '🦑', '🦀'];
      fishItems.forEach((f, idx) => {
        if (114 + idx * 34 < w - 34) {
          ctx.font = '13px serif';
          ctx.fillText(f, 114 + idx * 34, 44);
        }
      });
    }

    // 10. PRODUITS LAITIERS : Vitrine réfrigérée et meules de fromage
    else if (bizId === 'produits_laitiers') {
      ctx.fillStyle = '#15803d';
      ctx.fillRect(104, 46, w - 130, 4);
      const dairyItems = ['🧀', '🥛', '🧈', '🍶'];
      dairyItems.forEach((d, idx) => {
        if (114 + idx * 34 < w - 34) {
          ctx.font = '13px serif';
          ctx.fillText(d, 114 + idx * 34, 44);
        }
      });
    }

    // 11. ÉPICERIE (عطّار الحومة) : Étagères riches en arrière-plan avec produits tunisiens très diversifiés
    else if (bizId === 'attariya') {
      const shX = 104;
      const shW = w - 128;
      const shelves = [
        { y: 38, items: ['🥫', '🍅', '🫒', '🍯', '🧂', '🫙', '🥫', '🫒'] },
        { y: 56, items: ['🥛', '🧈', '🧀', '🥚', '🌾', '🍞', '🥛', '🧀'] },
        { y: 74, items: ['💧', '🧃', '🥤', '🧼', '☕', '🍵', '💧', '🧃'] }
      ];
      shelves.forEach((sh) => {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(shX, sh.y, shW, 4);
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1;
        ctx.strokeRect(shX, sh.y, shW, 4);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(shX, sh.y + 3, shW, 1);

        ctx.font = '11px serif';
        for (let ix = 0; ix < sh.items.length; ix++) {
          const itemX = shX + 6 + ix * 22;
          if (itemX + 16 <= shX + shW) {
            ctx.fillText(sh.items[ix], itemX, sh.y - 2);
          }
        }
      });
    }

    // 12. BOUTIQUE DE VÊTEMENTS (محلّ الملابس) : Disposition harmonieuse rabaissée et ancrée au sol
    else if (bizId === 'vente_vetements') {
      const floorY = h - 54;
      const shX = 104;
      const shW = w - 128;

      // A. Étagère murale haute avec vêtements pliés (alignée au-dessus)
      const shelfY = floorY - 64;
      ctx.fillStyle = '#4a044e';
      ctx.fillRect(shX, shelfY, shW, 4);
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 1;
      ctx.strokeRect(shX, shelfY, shW, 4);

      // Équerres murales en laiton sous l'étagère
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.2;
      for (let eqX = shX + 16; eqX < shX + shW; eqX += 45) {
        ctx.beginPath();
        ctx.moveTo(eqX, shelfY + 4);
        ctx.lineTo(eqX, shelfY + 12);
        ctx.lineTo(eqX + 8, shelfY + 4);
        ctx.stroke();
      }

      const foldedClothes = ['👕', '👖', '👗', '🧥', '👚', '👕', '👖'];
      ctx.font = '11px serif';
      foldedClothes.forEach((fc, idx) => {
        const cx = shX + 8 + idx * 22;
        if (cx + 18 <= shX + shW) {
          ctx.fillText(fc, cx, shelfY - 2);
        }
      });

      // B. Portant métallique sur roulettes (ancré directement au sol floorY)
      const rackX = shX + 8;
      const rackW = Math.min(68, shW * 0.44);
      const rackTopY = floorY - 44;

      ctx.save();
      // Barre supérieure du portant
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(rackX, rackTopY);
      ctx.lineTo(rackX + rackW, rackTopY);
      // Montants verticaux descendant jusqu'au sol
      ctx.moveTo(rackX + 4, rackTopY);
      ctx.lineTo(rackX + 4, floorY - 2);
      ctx.moveTo(rackX + rackW - 4, rackTopY);
      ctx.lineTo(rackX + rackW - 4, floorY - 2);
      // Barre basse de renfort
      ctx.moveTo(rackX + 2, floorY - 6);
      ctx.lineTo(rackX + rackW - 2, floorY - 6);
      ctx.stroke();

      // Roulettes chromées au niveau du sol
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(rackX + 4, floorY - 2, 2.5, 0, Math.PI * 2);
      ctx.arc(rackX + rackW - 4, floorY - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Cintres suspendus à la barre
      const hangers = ['🧥', '👗', '👔', '👘'];
      ctx.font = '12px serif';
      hangers.forEach((hItem, hIdx) => {
        ctx.fillText(hItem, rackX + 8 + hIdx * 15, rackTopY + 18);
      });
      ctx.restore();

      // C. Mannequin de couture / vitrine (posé fermement sur le sol)
      const manX = shX + rackW + 24;
      if (manX + 22 < w - 24) {
        ctx.save();
        // Socle chromé posé sur le sol floorY
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.ellipse(manX + 10, floorY - 1, 11, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Tige métallique verticale
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(manX + 10, floorY - 28);
        ctx.lineTo(manX + 10, floorY - 1);
        ctx.stroke();

        // Buste en velours
        const busteY = floorY - 48;
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.roundRect(manX + 3, busteY, 14, 20, [5, 5, 2, 2]);
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = '14px serif';
        ctx.fillText('👗', manX + 3, busteY + 16);
        ctx.restore();
      }

      // D. Miroir d'essayage ovale sur pied (posé au sol)
      const mirX = shX + shW - 24;
      if (mirX > manX + 30) {
        ctx.save();
        // Pieds du miroir au sol
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(mirX + 8, floorY - 1);
        ctx.lineTo(mirX + 4, floorY - 14);
        ctx.moveTo(mirX + 8, floorY - 1);
        ctx.lineTo(mirX + 12, floorY - 14);
        ctx.stroke();

        // Miroir ovale
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.ellipse(mirX + 8, floorY - 32, 8, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Reflet brillant spéculaire sur la glace
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(mirX + 4, floorY - 40);
        ctx.lineTo(mirX + 10, floorY - 24);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 13. CONDITIONNEMENT & VENTE DE DATTES (دڤلة النور الجريدية) : Étagères avec caisses de dattes Tozeur
    else if (bizId === 'emballage_dattes') {
      const shX = 104;
      const shW = w - 128;
      [40, 62].forEach((sy) => {
        ctx.fillStyle = '#451a03';
        ctx.fillRect(shX, sy, shW, 4);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1;
        ctx.strokeRect(shX, sy, shW, 4);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(shX, sy + 3, shW, 1.2);
      });
      const dateCrates = ['🌴', '📦', '🍯', '📦', '🌴', '📦'];
      ctx.font = '12px serif';
      dateCrates.forEach((dc, idx) => {
        const dx = shX + 8 + idx * 24;
        if (dx + 18 <= shX + shW) {
          ctx.fillText(dc, dx, 38);
          ctx.fillText(idx % 2 === 0 ? '📦' : '🌴', dx, 60);
        }
      });
      // Panonceau d'origine
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.beginPath();
      ctx.roundRect(shX + shW - 64, 72, 60, 16, 4);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 7px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('دڤلة توزر ⭐', shX + shW - 34, 83);
    }

    // 14. HORLOGERIE & BIJOUX
    else if (bizId === 'vente_montres') {
      ctx.fillStyle = '#312e81';
      ctx.fillRect(104, 46, w - 130, 4);
      const luxItems = ['⌚', '🕰️', '💎', '✨'];
      luxItems.forEach((c, idx) => {
        if (114 + idx * 34 < w - 34) {
          ctx.font = '13px serif';
          ctx.fillText(c, 114 + idx * 34, 44);
        }
      });
    }

    // 15. AGENCES & CROISIÈRES & BANQUE : Horloge de direction discrète
    else if (bizId === 'croisiere_mer' || bizId === 'agence_voyages' || bizId === 'hotel' || bizId === 'bank_branch') {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(38, 46, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.font = '9px sans-serif';
      ctx.fillText('🕒', 33, 49);
    }

    // 16. SUPERMARCHÉ & SUPÉRETTE : Gérés intégralement dans drawCashierCounter
    else if (bizId === 'supermarche' || bizId === 'superette') {
      // Décor géré dans drawCashierCounter
    }

    // 14. TABAC : Kiosque compact
    else if (bizId === 'tobacco_kiosk') {
      ctx.fillStyle = '#831843';
      ctx.fillRect(28, 52, 108, 4);
      const tobItems = ['🚬', '📰', '💧', '🎟️'];
      tobItems.forEach((ti, idx) => {
        ctx.font = '12px serif';
        ctx.fillText(ti, 36 + idx * 24, 49);
      });
    }

    // 15. DÉFAUT ÉPURÉ
    else {
      ctx.fillStyle = '#334155';
      ctx.fillRect(104, 52, w - 130, 4);
      ctx.font = '13px serif';
      for (let x = 116; x < w - 34; x += 36) {
        ctx.fillText('📦', x, 48);
      }
    }
    ctx.restore();
  }

  // --- POSTE DE LA CAISSE / BUREAUX / GUICHETS SELON L'ARCHÉTYPE DU PROJET ---
  // Chaque projet compte AU MOINS 1 travailleur actif dès le départ + ZÉRO texte encombrant/chevauchant.
  drawCashierCounter(ctx, detail, isBusy, now) {
    const timeSec = now / 1000;
    const currentBiz = this.getBiz();
    const currentBizId = currentBiz ? currentBiz.id : this.bizId;
    const archetype = this.getBizArchetype(currentBizId);
    const tier = this.getStoreTier(currentBiz);
    const cycleRatio = this.getCycleProgressRatio(currentBiz);

    // A. CROISIÈRES & AGENCE DE VOYAGES (`agency_desks`) :
    // Zéro marchandise exposée. Deux bureaux (Manager actif dès le début + Assistant quand recruté).
    if (archetype === 'agency_desks') {
      ctx.save();
      const slots = (detail && detail.staffSlots) ? detail.staffSlots : [];
      const hiredCount = currentBiz ? (currentBiz.hiredManagersCount || (currentBiz.hasManager ? 1 : 0)) : 0;
      const totalDesks = Math.max(1, Math.min(3, slots.length || 2));
      const deskW = totalDesks === 3 ? 66 : 76;
      const spacing = totalDesks === 3 ? 72 : 98;
      const startX = totalDesks === 3 ? 46 : 64;
      const deskConfigs = [];
      for (let dIdx = 0; dIdx < totalDesks; dIdx++) {
        deskConfigs.push({
          x: startX + dIdx * spacing,
          y: 126,
          w: deskW,
          h: 28,
          icon: dIdx === 0 ? '💻' : (dIdx === 1 ? '🖥️' : '📊'),
          slotIdx: dIdx,
          slot: slots[dIdx]
        });
      }

      // Décor mural minimaliste sans texte lourd (icônes exécutives)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
      ctx.beginPath();
      ctx.roundRect(96, 48, 112, 22, 6);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.font = '12px serif';
      ctx.textAlign = 'center';
      ctx.fillText(currentBizId === 'croisiere_mer' ? '⚓   🛥️   🧭' : '✈️   🌍   🎫', 152, 63);

      deskConfigs.forEach((d, idx) => {
        const isWorkerPresent = (idx === 0) || (d.slot && d.slot.hired) || (hiredCount >= 1);
        const isDeskActive = isWorkerPresent && (isBusy || idx === 0);

        // Fauteuil de direction derrière le bureau
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(d.x + 24, d.y - 38, 28, 30, 6);
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Travailleur présent dès le départ au Bureau 1, et au Bureau 2 dès recrutement
        if (isWorkerPresent) {
          this.drawWorker(ctx, d.x + 38, d.y + 4, idx, true, timeSec);
          this.clickZones.push({
            x: d.x + 18,
            y: d.y - 46,
            width: 40,
            height: 48,
            type: 'employee_info',
            name: (d.slot && d.slot.name) ? d.slot.name : (idx === 0 ? 'مكلّف الحجوزات' : 'مساعد الحجوزات'),
            role: (d.slot && d.slot.role) ? d.slot.role : 'عون قار'
          });
        }

        // Bureau exécutif en bois noble (hauteur ergonomique 28px)
        const deskGrad = ctx.createLinearGradient(d.x, d.y, d.x, d.y + d.h);
        deskGrad.addColorStop(0, '#1e3a8a');
        deskGrad.addColorStop(0.4, '#1e293b');
        deskGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = deskGrad;
        ctx.beginPath();
        ctx.roundRect(d.x, d.y, d.w, d.h, [5, 5, 3, 3]);
        ctx.fill();
        ctx.strokeStyle = isWorkerPresent ? '#38bdf8' : '#475569';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(d.x - 1, d.y - 2, d.w + 2, 3.5);

        // Ordinateur de bureau + dossiers papiers 📄
        const monX = d.x + 10;
        const monY = d.y - 16;
        ctx.fillStyle = '#090d16';
        ctx.beginPath();
        ctx.roundRect(monX, monY, 24, 15, 2.5);
        ctx.fill();
        ctx.strokeStyle = isWorkerPresent ? '#34d399' : '#64748b';
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.fillStyle = '#64748b';
        ctx.fillRect(monX + 9, monY + 15, 6, 3);
        ctx.fillStyle = isWorkerPresent ? '#10b981' : '#38bdf8';
        ctx.fillRect(monX + 3, monY + 4, 14, 2);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(monX + 3, monY + 8, 18 * (isDeskActive ? Math.max(0.25, cycleRatio) : 0.4), 2);

        ctx.font = '10px serif';
        ctx.textAlign = 'center';
        ctx.fillText('📄', d.x + d.w - 16, d.y - 4);
        ctx.fillText('🖨️', d.x + d.w - 28, d.y - 4);

        if (isWorkerPresent) {
          const evolvedPrice = this.getEvolvedUnitPrice(currentBizId);
          const priceText = this.formatEvolvedPrice(evolvedPrice) + ' DT';
          ctx.save();
          ctx.beginPath();
          ctx.rect(monX + 1, monY + 1, 22, 13);
          ctx.clip();
          let fs = 5.5;
          ctx.font = `bold ${fs}px monospace`;
          let tw = ctx.measureText(priceText).width;
          if (tw > 20) {
            fs = Math.max(3.8, fs * (20 / tw));
            ctx.font = `bold ${fs}px monospace`;
          }
          ctx.fillStyle = '#34d399';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(priceText, monX + 12, monY + 7.5);
          ctx.restore();
          this.drawRadialGauge(ctx, d.x + d.w - 12, d.y - 22, 6, Math.max(0.15, cycleRatio), '#10b981', '✓');
        } else if (d.slot && !d.slot.hired) {
          // Place libre UNIQUEMENT si un manager réel est prévu pour ce poste
          const isNext = (idx === hiredCount);
          if (isNext) {
            this.drawHireButton(ctx, d.x + 6, d.y - 42, d.w - 12, 34, 'مساعد', idx, 'hire_worker', d.slot.cost, now);
          } else {
            ctx.fillStyle = '#64748b';
            ctx.font = 'bold 7.5px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('مغلق 🔒', d.x + d.w / 2, d.y - 12);
          }
        }

        // Badge compact d'état du bureau
        ctx.fillStyle = isWorkerPresent ? '#34d399' : '#94a3b8';
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText(isWorkerPresent ? `${d.icon} #${idx + 1}` : `🔒 #${idx + 1}`, d.x + d.w / 2, d.y + 17);
      });

      ctx.restore();
      return;
    }

    // B. SUPERMARCHÉ & SUPÉRETTE (`supermarket_checkout`) :
    // Supermarché : 3 caisses max, rayons d'hypermarché en arrière-plan, ZÉRO numéro sur les caisses.
    // Supérette : 2 caisses max, rayonnage moderne de proximité avec produits diversifiés.
    if (archetype === 'supermarket_checkout') {
      ctx.save();
      const slots = (detail && detail.staffSlots) ? detail.staffSlots : [];
      const hiredCount = currentBiz ? (currentBiz.hiredManagersCount || (currentBiz.hasManager ? 1 : 0)) : 0;
      const isSuperette = currentBizId === 'superette';
      const maxLanes = Math.min(3, Math.max(1, slots.length || (isSuperette ? 2 : 3)));

      // Rayons d'arrière-plan propres et réalistes
      if (isSuperette) {
        // Supérette : 3 rayons gondoles modernes de proximité avec liserés de prix et produits variés
        const ry1 = 40;
        const ry2 = 60;
        const ry3 = 80;
        const shW = this.width - 50;
        [ry1, ry2, ry3].forEach((ry) => {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(22, ry, shW, 4.5);
          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 1;
          ctx.strokeRect(22, ry, shW, 4.5);
          ctx.fillStyle = '#34d399';
          ctx.fillRect(22, ry + 3.5, shW, 1.2);
        });

        const supRow1 = ['🧃', '🥤', '💧', '🥛', '🧋', '🧃', '🥤', '💧', '🥛'];
        const supRow2 = ['🍫', '🍪', '🥖', '🥫', '🍿', '🥐', '🍯', '🍫', '🍪'];
        const supRow3 = ['🧀', '🧈', '🥣', '🥚', '🥫', '🧼', '🧀', '🧈', '🥣'];
        ctx.font = '11px serif';
        for (let ix = 28, i = 0; ix < this.width - 48; ix += 25, i++) {
          ctx.fillText(supRow1[i % supRow1.length], ix, ry1 - 2);
          ctx.fillText(supRow2[i % supRow2.length], ix, ry2 - 2);
          ctx.fillText(supRow3[i % supRow3.length], ix, ry3 - 2);
        }
        ctx.font = '13px serif';
        ctx.fillText('🍊', 8, ry1 - 1);
        ctx.fillText('🍌', 8, ry2 - 1);
        ctx.fillText('🍎', 8, ry3 - 1);
      } else {
        // Magasin Général / Supermarché : 3 grands linéaires d'hypermarché avec têtes de gondole et catégories
        const shelfItems = [
          ['🥤', '🧃', '💧', '🧋', '🥤', '🧃', '💧', '🧋'],
          ['🥫', '🫒', '🧂', '🥫', '🥫', '🫒', '🧂', '🥫'],
          ['🧀', '🥛', '🧈', '🥣', '🧀', '🥛', '🧈', '🥣']
        ];
        for (let r = 0; r < 3; r++) {
          const ry = 42 + r * 18;
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(20, ry, this.width - 50, 4);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 0.7;
          ctx.strokeRect(20, ry, this.width - 50, 4);

          ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.fillRect(20, ry + 3, this.width - 50, 1.5);

          const rowItems = shelfItems[r];
          ctx.font = '10px serif';
          for (let ix = 28, i = 0; ix < this.width - 48; ix += 24, i++) {
            ctx.fillText(rowItems[i % rowItems.length], ix, ry - 2);
          }
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fillRect(30, 24, this.width - 70, 2);
      }

      // Caisses ergonomiques (2 pour supérette, 3 pour supermarché)
      const laneSpacing = isSuperette ? 88 : 74;
      const lw = isSuperette ? 76 : 68;
      const lh = 26;

      for (let cIdx = 0; cIdx < maxLanes; cIdx++) {
        const lx = 18 + cIdx * laneSpacing;
        const ly = 128;
        const slot = slots[cIdx];
        const isHired = slot ? slot.hired : (cIdx < hiredCount);
        const isLaneOpen = (cIdx === 0) || isHired;

        if (isLaneOpen) {
          this.drawWorker(ctx, lx + 22, ly + 4, cIdx, true, timeSec);
          this.clickZones.push({
            x: lx + 4,
            y: ly - 44,
            width: 36,
            height: 46,
            type: 'employee_info',
            name: (slot && slot.name) ? slot.name : `كاشير`,
            role: (slot && slot.role) ? slot.role : 'عون قار'
          });
        }

        ctx.fillStyle = isLaneOpen ? '#0f172a' : 'rgba(15, 23, 42, 0.55)';
        ctx.beginPath();
        ctx.roundRect(lx, ly, lw, lh, 5);
        ctx.fill();
        ctx.strokeStyle = isLaneOpen ? '#10b981' : '#475569';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(lx + 4, ly + 2, lw - 26, 6);
        if (isLaneOpen) {
          const scanShift = (timeSec * 28) % 12;
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(lx + 8 + scanShift, ly + 2);
          ctx.lineTo(lx + 8 + scanShift, ly + 8);
          ctx.stroke();
        }

        // Écran caisse enregistreuse POS ergonomique avec prix dynamique par panier client
        const evolvedUnit = this.getEvolvedUnitPrice(currentBizId);
        // Le prix varie selon chaque caisse et chaque panier client (achats authentiques diversifiés)
        const custAtLane = this.customers.find(c => c.stationSlot === cIdx && (c.state === 'waiting_service' || c.state === 'doing_activity' || c.state === 'paying'));
        const laneAmount = custAtLane && custAtLane.basketTotal
          ? custAtLane.basketTotal
          : Math.max(1.8, Math.round(evolvedUnit * (0.65 + cIdx * 0.45) * 10) / 10);
        const lanePriceStr = this.formatEvolvedPrice(laneAmount) + ' DT';

        if (isLaneOpen) {
          this.drawPOSTerminal(ctx, lx + lw - 25, ly - 14, 23, 16, lanePriceStr, isLaneOpen, true);
        } else if (slot && !slot.hired) {
          // Place libre : silhouette fantôme + bouton d'intedab au niveau de la caisse vide
          this.drawPOSTerminal(ctx, lx + lw - 25, ly - 14, 23, 16, '', false, false);
          const isNext = (cIdx === hiredCount);
          if (isNext) {
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.beginPath();
            ctx.roundRect(lx + 4, ly - 46, lw - 8, 44, 6);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.setLineDash([3, 3]);
            ctx.strokeRect(lx + 4, ly - 46, lw - 8, 44);
            ctx.restore();

            this.drawHireButton(ctx, lx + 2, ly - 42, lw - 4, 34, 'كاشير', cIdx, 'hire_cashier', slot.cost, now);
          } else {
            ctx.fillStyle = '#64748b';
            ctx.font = 'bold 7.5px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('مغلقة 🔒', lx + lw / 2, ly - 12);
          }
        } else {
          this.drawPOSTerminal(ctx, lx + lw - 25, ly - 14, 23, 16, '', false, false);
        }

        // Indicateur LED discret
        ctx.fillStyle = isLaneOpen ? '#10b981' : '#475569';
        ctx.beginPath();
        ctx.arc(lx + lw / 2, ly + 18, 3.5, 0, Math.PI * 2);
        ctx.fill();
        if (isLaneOpen) {
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      ctx.restore();
      return;
    }

    // C. GUICHET DE TABAC (`tobacco_kiosk`) : Kiosque réaliste avec armoire à cigarettes et caisse
    if (archetype === 'tobacco_kiosk') {
      ctx.save();
      const kx = 34;
      const ky = 120;
      const kw = 98;
      const kh = 34;

      // 1. Armoire murale de paquets de cigarettes en arrière-plan
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(kx + 2, 44, kw - 4, 38, 4);
      ctx.fill();
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // En-tête Gamreg
      ctx.fillStyle = '#9f1239';
      ctx.fillRect(kx + 4, 46, kw - 8, 8);
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 6.5px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🚭 قمريڨ تونس • Kiosque', kx + kw / 2, 52.5);

      // Rangées de paquets de cigarettes
      const packColors = ['#dc2626', '#2563eb', '#16a34a', '#d97706', '#9333ea'];
      for (let r = 0; r < 2; r++) {
        const ry = 58 + r * 11;
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(kx + 6, ry + 8, kw - 12, 1.5);
        for (let p = 0; p < 6; p++) {
          const px = kx + 8 + p * 14;
          ctx.fillStyle = packColors[(p + r) % packColors.length];
          ctx.beginPath();
          ctx.roundRect(px, ry, 10, 8, 1);
          ctx.fill();
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(px + 2, ry + 2, 6, 2);
        }
      }

      // 2. Caissier unique en poste
      this.drawWorker(ctx, kx + 36, ky + 8, 3, true, timeSec);

      // 3. Comptoir du Kiosque avec finition bois rouge bordeaux
      const kGrad = ctx.createLinearGradient(kx, ky, kx, ky + kh);
      kGrad.addColorStop(0, '#9f1239');
      kGrad.addColorStop(0.35, '#881337');
      kGrad.addColorStop(1, '#4c0519');
      ctx.fillStyle = kGrad;
      ctx.beginPath();
      ctx.roundRect(kx, ky, kw, kh, [6, 6, 3, 3]);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Tablette supérieure
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(kx - 1, ky - 2, kw + 2, 3.5);

      // Présentoir journaux & briquets
      ctx.font = '10px serif';
      ctx.textAlign = 'center';
      ctx.fillText('📰', kx + 12, ky - 4);
      ctx.fillText('💧', kx + 28, ky - 4);
      ctx.fillText('⚡', kx + 44, ky - 4);

      // 4. Caisse enregistreuse ergonomique du Kiosque
      const regX = kx + kw - 34;
      const regY = ky - 14;
      const evolvedTobaccoPrice = this.getEvolvedUnitPrice('tobacco_kiosk');
      this.drawPOSTerminal(ctx, regX, regY, 28, 18, this.formatEvolvedPrice(evolvedTobaccoPrice) + ' DT', true, true);

      ctx.restore();
      return;
    }

    // D. BANQUE (`bank_branch`) : Guichet réaliste de prestige, banquier haute visibilité & comptoir marbre
    if (archetype === 'bank_branch') {
      ctx.save();
      const bx = 24;
      const by = 118;
      const bw = 116;
      const bh = 38;

      // 1. Tapis rouge d'honneur menant de l'entrée au guichet
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(bx + bw - 4, by + 12, this.width - (bx + bw), 20);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(bx + bw - 4, by + 11, this.width - (bx + bw), 1.5);
      ctx.fillRect(bx + bw - 4, by + 31, this.width - (bx + bw), 1.5);

      // Logo bancaire officiel en médaillon doré au mur
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(216, 68, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.2;
      ctx.stroke();
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🏛️', 216, 73);

      const isAccepted = this.bankVipClient && this.bankVipClient.state === 'accepted';

      // Éclairage zénithal chaleureux et lumineux focalisé sur l'agent banquier
      const spotGrad = ctx.createRadialGradient(bx + 58, by - 26, 6, bx + 58, by - 26, 65);
      spotGrad.addColorStop(0, 'rgba(254, 240, 138, 0.28)');
      spotGrad.addColorStop(0.6, 'rgba(254, 240, 138, 0.08)');
      spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.ellipse(bx + 58, by - 22, 54, 48, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Banquier professionnel actif derrière le guichet - POSITION PARFAITEMENT DÉGAGÉE ET VISIBLE
      this.drawWorker(ctx, bx + 58, by - 2, 0, true, timeSec);

      // Compteuse de billets automatique à côté du banquier avec billets animés
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(bx + 8, by - 14, 22, 16);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx + 8, by - 14, 22, 16);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(bx + 11, by - 8, 16, 2);
      ctx.font = '9px serif';
      ctx.fillText('💵', bx + 19, by - 4);

      // Lampe de banquier classique verte et laiton
      ctx.fillStyle = '#065f46';
      ctx.beginPath();
      ctx.roundRect(bx + bw - 26, by - 16, 16, 6, 2);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(bx + bw - 19, by - 10, 2, 10);

      // 3. Vitres latérales blindées sécurisées avec large baie centrale 100% ouverte pour visibilité maximale
      ctx.fillStyle = 'rgba(224, 242, 254, 0.08)';
      ctx.fillRect(bx + 2, by - 44, 16, 44);
      ctx.fillRect(bx + bw - 18, by - 44, 16, 44);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(bx + 2, by - 44, 16, 44);
      ctx.strokeRect(bx + bw - 18, by - 44, 16, 44);

      // Traverse haute avec arche de guichet moderne
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(bx + 2, by - 48, bw - 4, 8, 3);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Passe-documents en laiton brossé poli
      ctx.fillStyle = '#090d16';
      ctx.fillRect(bx + 40, by - 3, 36, 6);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(bx + 40, by - 3, 36, 6);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(bx + 44, by - 1, 28, 2);

      // 4. Comptoir en marbre bleu nuit et or
      const bGrad = ctx.createLinearGradient(bx, by, bx, by + bh);
      bGrad.addColorStop(0, '#0284c7');
      bGrad.addColorStop(0.35, '#0369a1');
      bGrad.addColorStop(1, '#0b1329');
      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, [6, 6, 3, 3]);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Tablette supérieure en marbre blanc veiné
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(bx - 1, by - 2, bw + 2, 4);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(bx - 1, by + 1.5, bw + 2, 1);

      // Enseigne lumineuse LED du guichet
      ctx.fillStyle = isAccepted ? '#064e3b' : 'rgba(15, 23, 42, 0.92)';
      ctx.beginPath();
      ctx.roundRect(bx + 18, by - 60, 80, 14, 4);
      ctx.fill();
      ctx.strokeStyle = isAccepted ? '#10b981' : '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.fillStyle = isAccepted ? '#34d399' : '#7dd3fc';
      ctx.font = 'bold 8px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(isAccepted ? '✓ جاري المعاملة' : '🏛️ الوكالة البنكية • الشباك 1', bx + 58, by - 50);

      // 5. Client VIP arrivant avec mallette de documents
      if (this.bankVipClient) {
        const vc = this.bankVipClient;
        const walking = vc.state === 'entering';
        const bounce = walking ? Math.abs(Math.sin(vc.walkCycle * 7)) * 2.5 : 0;
        ctx.save();
        ctx.translate(vc.x, vc.y - 6 - bounce);
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.ellipse(0, 10, 11, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.roundRect(-7, -18, 14, 18, 4);
        ctx.fill();
        ctx.font = '10px serif';
        ctx.fillText('💼', -12, -3);
        ctx.fillStyle = '#fcd34d';
        ctx.beginPath();
        ctx.arc(0, -24, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(0, -26.5, 6.5, Math.PI, 0);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
      return;
    }

    // E. COMPTOIR CAISSE ERGONOMIQUE STANDARD (Hauteur 36px + Travailleur TOUJOURS présent dès le début !)
    const counterX = 14;
    const counterY = 118;
    const deskW = 84;
    const deskH = 36;

    ctx.save();

    // 1. Décor mural d'arrière-boutique spécifique et élégant (ZÉRO étagères moches génériques)
    ctx.save();
    if (currentBizId === 'patisserie') {
      ctx.fillStyle = '#381630';
      ctx.beginPath();
      ctx.roundRect(counterX + 4, 46, deskW - 8, 36, 4);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.font = '14px serif';
      ctx.fillText('🎂', counterX + 16, 70);
      ctx.fillText('✨', counterX + deskW - 32, 70);
    } else if (currentBizId === 'librairie') {
      ctx.fillStyle = '#271206';
      ctx.beginPath();
      ctx.roundRect(counterX, 46, deskW, 38, 3);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.font = '13px serif';
      ctx.fillText('📕', counterX + 8, 64);
      ctx.fillText('📗', counterX + 26, 64);
      ctx.fillText('📘', counterX + 44, 64);
      ctx.fillText('📙', counterX + 62, 64);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(counterX + 4, 76, deskW - 8, 2);
    } else if (currentBizId === 'boucherie') {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(counterX, 48, deskW, 34);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(counterX, 48, deskW, 34);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(counterX + 4, 56, deskW - 8, 3);
      ctx.font = '13px serif';
      ctx.fillText('🥩', counterX + 14, 76);
      ctx.fillText('🍗', counterX + 48, 76);
    } else if (currentBizId === 'salon_de_the' || currentBizId === 'restaurant') {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.beginPath();
      ctx.ellipse(counterX + deskW / 2, 64, 26, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.font = '13px serif';
      ctx.textAlign = 'center';
      ctx.fillText(currentBizId === 'restaurant' ? '🍷' : '☕', counterX + deskW / 2, 68);
    } else if (currentBizId === 'salle_de_jeux') {
      ctx.fillStyle = '#09090b';
      ctx.beginPath();
      ctx.roundRect(counterX + 6, 48, deskW - 12, 34, 4);
      ctx.fill();
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.font = '15px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🎮', counterX + deskW / 2, 70);
    } else if (currentBizId === 'attariya') {
      // Calendrier mural éphéméride tunisien au-dessus de la caisse (روزنامة حائطية)
      const calX = counterX + deskW / 2 - 13;
      const calY = 46;
      const calW = 26;
      const calH = 34;

      // Cordon d'attache rouge et clou doré
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(calX + calW / 2, calY);
      ctx.lineTo(calX + calW / 2, calY - 6);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(calX + calW / 2, calY - 6, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // En-tête doré du calendrier
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.roundRect(calX, calY, calW, 9, [3, 3, 0, 0]);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 6.5px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('2026', calX + calW / 2, calY + 7);

      // Feuillet blanc éphéméride
      ctx.fillStyle = '#fdfbf7';
      ctx.beginPath();
      ctx.roundRect(calX, calY + 9, calW, calH - 9, [0, 0, 3, 3]);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(calX, calY + 9, calW, calH - 9);

      // Mois en rouge
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 5.5px "Cairo", sans-serif';
      ctx.fillText('نوفمبر', calX + calW / 2, calY + 16);

      // Grand chiffre du jour
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('5', calX + calW / 2, calY + 26);

      // Nom du jour en arabe
      ctx.fillStyle = '#475569';
      ctx.font = '5px "Cairo", sans-serif';
      ctx.fillText('الخميس', calX + calW / 2, calY + 32);
    } else if (currentBizId === 'kaskrout' || currentBizId === 'fricasse') {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(counterX, 50, deskW, 34);
      ctx.font = '13px serif';
      ctx.fillText('🥖', counterX + 12, 72);
      ctx.fillText('🥚', counterX + 36, 72);
      ctx.fillText('🫒', counterX + 60, 72);
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(counterX + 6, 50, deskW - 12, 30, 4);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.stroke();
      const defIcons = this.orderIcons[currentBizId] || this.orderIcons.default;
      ctx.font = '12px serif';
      ctx.textAlign = 'center';
      ctx.fillText(defIcons[0] || '✨', counterX + deskW / 2, 70);
    }
    ctx.restore();

    // 2. Travailleur / Caissier TOUJOURS en poste derrière le comptoir dès le Niveau 1 !
    const cashierSlot = detail && detail.staffSlots && detail.staffSlots[0];
    const cashierX = counterX + 10;
    const cashierFootY = 138;

    this.drawWorker(ctx, cashierX + 16, cashierFootY, 0, true, timeSec);
    this.clickZones.push({
      x: cashierX,
      y: cashierFootY - 50,
      width: 36,
      height: 50,
      type: 'employee_info',
      name: (cashierSlot && cashierSlot.name) ? cashierSlot.name : 'عون الكاسة',
      role: (cashierSlot && cashierSlot.role) ? cashierSlot.role : 'عون قار'
    });

    // 3. Meuble Comptoir ou Vitrine bombée de Pâtisserie au PREMIER PLAN
    if (currentBizId === 'patisserie') {
      // Vitrine réfrigérée de boulangerie/pâtisserie en bas avec étalages gourmands
      const vitW = deskW + 8;
      const vitH = deskH + 2;
      const vitX = counterX - 2;
      const vitY = counterY + 6;

      ctx.fillStyle = '#2e1029';
      ctx.beginPath();
      ctx.roundRect(vitX, vitY, vitW, vitH, [6, 6, 3, 3]);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.fillStyle = 'rgba(240, 249, 255, 0.18)';
      ctx.fillRect(vitX + 3, vitY + 3, vitW - 6, vitH - 8);

      // Étage 1 : Gâteaux fins & tartes
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(vitX + 4, vitY + 12, vitW - 8, 1);
      ctx.font = '8px serif';
      ctx.textAlign = 'center';
      const cakes = ['🍰', '🧁', '🍓', '🍫'];
      for (let ci = 0; ci < cakes.length; ci++) {
        ctx.fillText(cakes[ci], vitX + 10 + ci * 18, vitY + 10);
      }

      // Étage 2 : Croissants & Baklawa dorée
      const pastries = ['🥐', '🍯', '🥯', '🍩'];
      for (let pi = 0; pi < pastries.length; pi++) {
        ctx.fillText(pastries[pi], vitX + 10 + pi * 18, vitY + 23);
      }

      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(vitX - 1, vitY - 1, vitW + 2, 3);
    } else {
      const woodGrad = ctx.createLinearGradient(counterX, counterY + 10, counterX, counterY + 10 + deskH);
      if (tier.tier >= 4) {
        woodGrad.addColorStop(0, '#f59e0b');
        woodGrad.addColorStop(0.35, '#b45309');
        woodGrad.addColorStop(1, '#451a03');
      } else {
        woodGrad.addColorStop(0, '#d97706');
        woodGrad.addColorStop(0.3, '#b45309');
        woodGrad.addColorStop(1, '#78350f');
      }
      ctx.fillStyle = woodGrad;
      ctx.beginPath();
      ctx.roundRect(counterX, counterY + 10, deskW, deskH, [7, 7, 4, 4]);
      ctx.fill();

      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(counterX - 2, counterY + 8, deskW + 4, 4);

      ctx.strokeStyle = tier.border || '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(counterX, counterY + 10, deskW, deskH);
    }

    // 4. Accessoire spécialisé & présentoir sur la table du comptoir
    const trayX = counterX + 5;
    const trayY = counterY - 4;
    if (currentBizId === 'attariya') {
      // Balance traditionnelle en laiton de l'épicier (ميزان عطّار)
      ctx.fillStyle = '#b45309';
      ctx.fillRect(trayX + 14, trayY + 2, 3, 10);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(trayX + 4, trayY + 3);
      ctx.lineTo(trayX + 27, trayY + 3);
      ctx.stroke();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(trayX + 7, trayY + 8, 4.5, 0, Math.PI);
      ctx.arc(trayX + 24, trayY + 8, 4.5, 0, Math.PI);
      ctx.fill();
    } else if (currentBizId === 'emballage_dattes') {
      // Coffret de dattes Deglet Nour Tozeur dorées sur le comptoir
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.roundRect(trayX + 2, trayY, 28, 11, 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.font = '8px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌴 📦', trayX + 16, trayY + 8.5);
    } else if (currentBizId === 'vente_vetements') {
      // Sacs shopping boutique de luxe sur le comptoir
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.roundRect(trayX + 4, trayY, 12, 11, 2);
      ctx.fill();
      ctx.fillStyle = '#831843';
      ctx.beginPath();
      ctx.roundRect(trayX + 18, trayY + 2, 11, 9, 2);
      ctx.fill();
      ctx.font = '7px serif';
      ctx.fillText('🛍️', trayX + 10, trayY + 8);
    } else {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.84)';
      ctx.beginPath();
      ctx.roundRect(trayX, trayY, 32, 11, 3);
      ctx.fill();
      ctx.strokeStyle = isBusy ? '#34d399' : '#fbbf24';
      ctx.lineWidth = 1;
      ctx.stroke();

      const stockIcons = this.orderIcons[currentBizId] || this.orderIcons.default;
      const visibleStock = Math.min(3, Math.max(1, this.counterStock || 1));
      ctx.font = '8.5px serif';
      for (let s = 0; s < visibleStock; s++) {
        ctx.fillText(stockIcons[s % stockIcons.length], trayX + 3 + s * 9, trayY + 9);
      }
    }

    // 5. Caisse enregistreuse moderne et ergonomique POS à droite du comptoir
    const regSpring = (this.registerFlash || 0) * Math.sin(timeSec * 30) * 1.5;
    const regW = 34;
    const regH = 22;
    const regX = counterX + deskW - 38;
    const regY = counterY - 10 - Math.abs(regSpring);

    if (this.registerFlash > 0) {
      this.registerFlash = Math.max(0, this.registerFlash - 0.04);
    }

    const evolvedUnit = this.getEvolvedUnitPrice(currentBizId);
    const activePayingCust = this.customers.find(c => c.state === 'paying' || c.state === 'queued');
    const basketFactor = activePayingCust ? (0.75 + ((activePayingCust.talkPhase * 7) % 5) * 0.22) : 1.0;
    const counterAmount = evolvedUnit * basketFactor;
    const displayPrice = this.formatEvolvedPrice(counterAmount) + ' DT';

    this.drawPOSTerminal(ctx, regX, regY, regW, regH, displayPrice, isBusy, true);

    // Fente ticket de caisse avec reçu blanc imprimé
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(regX + regW / 2 - 3, regY - 3, 6, 4);

    if (currentBiz && currentBiz.level > 0) {
      const gaugeColor = currentBiz.hasManager ? '#10b981' : '#fbbf24';
      // Indicateur de cycle placé à gauche de la caisse pour ne JAMAIS masquer l'afficheur prix
      const gaugeX = regX - 12;
      const gaugeY = counterY + 6;
      this.drawRadialGauge(ctx, gaugeX, gaugeY, 6.5, isBusy ? cycleRatio : 1, gaugeColor, '✓');
    }

    // Double poignée dorée et serrure sur le tiroir-caisse
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.roundRect(counterX + 12, counterY + 20, deskW - 24, 12, 3);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(counterX + deskW / 2, counterY + 26, 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(counterX + 22, counterY + 25, 8, 2);
    ctx.fillRect(counterX + deskW - 30, counterY + 25, 8, 2);
    ctx.restore();
  }

  // --- POSTES DE TRAVAIL DES EMPLOYÉS (ZÉRO GROS BOUTON TEXTE FLOTTANT) ---
  drawWorkstations(ctx, detail, isBusy, now) {
    if (!detail || !detail.staffSlots) return;
    const archetype = this.getBizArchetype(this.bizId);
    if (['agency_desks', 'supermarket_checkout', 'tobacco_kiosk', 'bank_branch'].includes(archetype)) {
      return;
    }

    const timeSec = now / 1000;
    const startX = 114;
    const baseY = 148;
    const spacing = 64;
    const biz = this.getBiz();
    const baseRatio = this.getCycleProgressRatio(biz);

    // 1. Scène centrale métier
    this.drawCentralActionShowcase(ctx, this.bizId, timeSec, isBusy);

    // 2. CAS CAFÉ (`kahwa_counter`) & SALON DE THÉ (`tea_lounge`) :
    // Serveur (`سرباي`) toujours actif pour servir les boissons aux clients !
    if (archetype === 'kahwa_counter' || archetype === 'tea_lounge') {
      const waiterSlot = detail.staffSlots[1];
      const machineX = 108;
      this.drawMachineProp(ctx, this.bizId, machineX, baseY + 2, isBusy, timeSec);

      const wx = this.waiter ? this.waiter.x : 138;
      const wy = archetype === 'tea_lounge' ? 142 : 136;
      this.drawWorker(ctx, wx, wy, 1, true, timeSec, true);

      ctx.save();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(wx + 11, wy - 20, 7.5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '9.5px serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.waiter ? this.waiter.carryingIcon : '☕', wx + 11, wy - 22);
      ctx.restore();

      if (waiterSlot) {
        this.clickZones.push({
          x: wx - 16,
          y: wy - 48,
          width: 34,
          height: 48,
          type: 'employee_info',
          name: waiterSlot.name,
          role: waiterSlot.role
        });
      }
      return;
    }

    // 2.B CAS POISSONNERIE / MARCHÉ DE FRUITS DE MER (`fruits_de_mer`) :
    // Caisses garnies de poissons frais et fruits de mer + Assistant ambulant qui bouge et donne les commandes
    if (this.bizId === 'fruits_de_mer') {
      const crateY = baseY - 2;
      const crateConfigs = [
        { x: 132, item: '🐟', label: '18 DT', color: '#0284c7' },
        { x: 168, item: '🦐', label: '32 DT', color: '#ea580c' },
        { x: 204, item: '🦑', label: '24 DT', color: '#0369a1' },
        { x: 240, item: '🦀', label: '15 DT', color: '#b91c1c' }
      ];

      // Étal en inox sur tréteaux marins
      ctx.fillStyle = '#334155';
      ctx.fillRect(128, crateY + 12, 150, 4);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(132, crateY + 16, 4, 10);
      ctx.fillRect(270, crateY + 16, 4, 10);

      crateConfigs.forEach(c => {
        // Caisse de marée en bois de pêcheur avec rebords
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.roundRect(c.x, crateY - 5, 33, 18, 2);
        ctx.fill();
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Lit de glace pilée étincelante
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(c.x + 2, crateY - 3, 29, 8);

        // Poissons et fruits de mer frais
        ctx.font = '11.5px serif';
        ctx.textAlign = 'center';
        ctx.fillText(c.item, c.x + 11, crateY + 4);
        ctx.font = '9px serif';
        ctx.fillText(c.item === '🦐' ? '🍋' : c.item, c.x + 23, crateY + 4);

        // Étiquette ardoise prix à la craie
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(c.x + 4, crateY + 7, 25, 6);
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 5.5px monospace';
        ctx.fillText(c.label, c.x + 16.5, crateY + 12);
      });

      // Assistant poissonnier qui bouge entre les caisses et donne les commandes
      if (!this.fishmonger) {
        this.fishmonger = {
          x: 140,
          y: 138,
          targetX: 168,
          crateIdx: 0,
          state: 'moving_to_crate',
          timer: 1.2,
          heldItem: '🐟',
          walkCycle: 0
        };
      }

      const fm = this.fishmonger;
      const isGiving = fm.state === 'giving_order';
      const isPicking = fm.state === 'picking';

      ctx.save();
      if (isPicking) {
        ctx.save();
        ctx.translate(fm.x, fm.y);
        ctx.rotate(-0.12);
        this.drawWorker(ctx, 0, 0, 2, true, timeSec, true);
        ctx.restore();
      } else {
        this.drawWorker(ctx, fm.x, fm.y, 2, true, timeSec, true);
      }

      // Plateau ou sachet de poissons frais en main
      if (fm.state === 'moving_to_counter' || isGiving) {
        ctx.save();
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.roundRect(fm.x - 14, fm.y - 18, 14, 7, 1.5);
        ctx.fill();
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.font = '10px serif';
        ctx.textAlign = 'center';
        ctx.fillText(fm.heldItem || '🐟', fm.x - 7, fm.y - 12);
        if (isGiving) {
          ctx.font = '8.5px serif';
          ctx.fillText('✨', fm.x - 16, fm.y - 20);
        }
        ctx.restore();
      }
      ctx.restore();

      this.clickZones.push({
        x: fm.x - 16,
        y: fm.y - 48,
        width: 32,
        height: 50,
        type: 'employee_info',
        name: 'عون مارشي الحوت',
        role: 'موزّع وفارز الأسماك'
      });
      return;
    }

    // 3. Autres commerces : postes d'artisans / ouvriers (Tables DEVANT les commerçants, zéro pieds visibles)
    detail.staffSlots.slice(1).forEach((slot, idx) => {
      const stationX = startX + idx * spacing;
      if (stationX > this.width - 42) return;

      ctx.save();
      // Le travailleur est dessiné EN ARRIÈRE-PLAN de sa table de travail, sans pieds sous la table
      if (slot.hired) {
        this.drawWorker(ctx, stationX + 22, baseY - 2, idx + 1, isBusy, timeSec, false);
        this.clickZones.push({
          x: stationX + 4,
          y: baseY - 50,
          width: 36,
          height: 54,
          type: 'employee_info',
          name: slot.name,
          role: slot.role
        });
        const workerRatio = isBusy ? ((baseRatio + idx * 0.28) % 1) : 0.25;
        this.drawRadialGauge(ctx, stationX + 22, baseY - 52, 6.5, workerRatio, '#10b981', '✓');
      } else {
        // Place libre : silhouette fantôme + bouton d'intedab au niveau du poste vide UNIQUEMENT pour le prochain recrutable
        const isNext = (idx + 1 === detail.hiredCount);
        if (isNext) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.beginPath();
          ctx.roundRect(stationX + 4, baseY - 46, 44, 46, 6);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.setLineDash([3, 3]);
          ctx.strokeRect(stationX + 4, baseY - 46, 44, 46);
          ctx.setLineDash([]);
          this.drawHireButton(ctx, stationX + 2, baseY - 42, 48, 34, 'عون', idx + 1, 'hire_worker', slot.cost, now);
        } else {
          ctx.fillStyle = '#64748b';
          ctx.font = 'bold 7.5px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('مغلق 🔒', stationX + 26, baseY - 12);
        }
      }

      // La machine / table de travail est dessinée AU PREMIER PLAN DEVANT le commerçant
      this.drawMachineProp(ctx, this.bizId, stationX, baseY + 4, isBusy, timeSec);
      ctx.restore();
    });
  }

  // --- SCÈNE D'ACTIVITÉ CENTRALE SPÉCIFIQUE À CHAQUE MÉTIER TYCOON ---
  drawCentralActionShowcase(ctx, bizId, timeSec, isBusy) {
    ctx.save();
    const archetype = this.getBizArchetype(bizId);
    const leftX = 104;
    const rightX = Math.max(210, this.width - 38);
    const zoneW = rightX - leftX;

    // 1. SALLE DE JEUX & BILLARD : Grande Table de Billard 2.5D animée + Bornes Console AVEC VRAIS ÉCRANS DÉDIÉS
    if (archetype === 'arcade_billiard') {
      const poolX = leftX + 4;
      const poolY = 129;
      const poolW = Math.min(94, zoneW * 0.44);
      const poolH = 22;

      ctx.fillStyle = '#271206';
      ctx.fillRect(poolX + 6, poolY + poolH - 2, 7, 10);
      ctx.fillRect(poolX + poolW - 13, poolY + poolH - 2, 7, 10);

      ctx.fillStyle = '#7c2d12';
      ctx.beginPath();
      ctx.roundRect(poolX, poolY, poolW, poolH, 4);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const feltGrad = ctx.createLinearGradient(poolX, poolY, poolX + poolW, poolY + poolH);
      feltGrad.addColorStop(0, '#059669');
      feltGrad.addColorStop(0.5, '#10b981');
      feltGrad.addColorStop(1, '#047857');
      ctx.fillStyle = feltGrad;
      ctx.fillRect(poolX + 4, poolY + 3, poolW - 8, poolH - 6);

      ctx.fillStyle = '#090d16';
      const pockets = [
        [poolX + 4, poolY + 3], [poolX + poolW / 2, poolY + 2.5], [poolX + poolW - 4, poolY + 3],
        [poolX + 4, poolY + poolH - 3], [poolX + poolW / 2, poolY + poolH - 2.5], [poolX + poolW - 4, poolY + poolH - 3]
      ];
      for (const [px, py] of pockets) {
        ctx.beginPath();
        ctx.arc(px, py, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }

      const balls = [
        { color: '#ffffff', speedX: 2.8, speedY: 1.9, phase: 0 },
        { color: '#ef4444', speedX: 2.1, speedY: 2.5, phase: 1.4 },
        { color: '#facc15', speedX: 1.7, speedY: 2.2, phase: 2.8 },
        { color: '#3b82f6', speedX: 2.4, speedY: 1.5, phase: 4.1 },
        { color: '#111827', speedX: 1.9, speedY: 2.7, phase: 5.2 }
      ];
      const innerW = (poolW - 18) / 2;
      const innerH = (poolH - 11) / 2;
      const centerPoolX = poolX + poolW / 2;
      const centerPoolY = poolY + poolH / 2;
      balls.forEach(b => {
        const bx = centerPoolX + Math.sin(timeSec * b.speedX + b.phase) * innerW;
        const by = centerPoolY + Math.cos(timeSec * b.speedY + b.phase) * innerH;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.arc(bx, by, 2.1, 0, Math.PI * 2);
        ctx.fill();
      });

      // DISPOSITION DES CONSOLES AVEC 3 POSTES DÉDIÉS ET ESPACE PARFAITEMENT GÉRÉ
      const startConsoleX = 186;
      const rightLim = Math.max(startConsoleX + 80, this.width - 18);
      const availableW = rightLim - startConsoleX;
      const numStations = 3;
      const stW = Math.max(30, Math.floor((availableW - 8) / numStations));

      const gameScreens = [
        { icon: '⚽', bg: '#14532d', glow: '#22c55e', name: 'FIFA' },
        { icon: '🏎️', bg: '#7f1d1d', glow: '#ef4444', name: 'RACE' },
        { icon: '🥊', bg: '#3b0764', glow: '#a855f7', name: 'FIGHT' }
      ];

      for (let s = 0; s < numStations; s++) {
        const csX = startConsoleX + s * (stW + 4);
        if (csX + stW > this.width - 10) break;
        const scrW = stW - 2;
        const scrH = 20;
        const scrY = 108;

        // Écran 16:9 fixé au mur avec halo néon gaming
        ctx.save();
        ctx.fillStyle = '#09090b';
        ctx.beginPath();
        ctx.roundRect(csX, scrY, scrW, scrH, 3);
        ctx.fill();
        ctx.strokeStyle = gameScreens[s % 3].glow;
        ctx.lineWidth = 1.3;
        ctx.stroke();

        // Affichage dynamique du jeu sur l'écran
        ctx.fillStyle = gameScreens[s % 3].bg;
        ctx.fillRect(csX + 2, scrY + 2, scrW - 4, scrH - 4);
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        const bob = Math.sin(timeSec * 7 + s) * 1.2;
        ctx.fillText(gameScreens[s % 3].icon, csX + scrW / 2, scrY + scrH / 2 + 3 + bob);

        // Support écran et meuble console bas
        ctx.fillStyle = '#27272a';
        ctx.fillRect(csX + scrW / 2 - 2, scrY + scrH, 4, 6);
        ctx.fillRect(csX + 2, scrY + scrH + 6, scrW - 4, 8);

        // Diode lumineuse console
        ctx.fillStyle = gameScreens[s % 3].glow;
        ctx.fillRect(csX + scrW / 2 - 5, scrY + scrH + 9, 10, 1.6);
        ctx.restore();
      }

      ctx.restore();
      return;
    }

    // 2. CAFÉ POPULAIRE (`kahwa_counter`) : Comptoir à hauteur ergonomique (barY=141, h=10) + 5 tabourets
    if (archetype === 'kahwa_counter') {
      const barY = 141;
      const barW = Math.max(100, zoneW - 6);

      const barGrad = ctx.createLinearGradient(leftX, barY, leftX, barY + 10);
      barGrad.addColorStop(0, '#b45309');
      barGrad.addColorStop(0.5, '#78350f');
      barGrad.addColorStop(1, '#451a03');
      ctx.fillStyle = barGrad;
      ctx.beginPath();
      ctx.roundRect(leftX, barY, barW, 10, 3);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      for (let s = 0; s < 5; s++) {
        const sx = this.getActivitySlotX('kahwa_counter', s) + 12;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(sx - 1.5, barY + 9, 3, 8);
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.ellipse(sx, barY + 9, 6, 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.ellipse(sx, barY + 2, 4, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      return;
    }

    // 3. SALON DE THÉ & RESTAURANT (`tea_lounge`) : Dossiers de fauteuils velours / chaises en arrière-plan
    // (Les tables, plats gastronomiques et chichas sont dessinés au 1er plan devant les clients dans drawForegroundFurniture)
    if (archetype === 'tea_lounge') {
      const isResto = bizId === 'restaurant';
      for (let tIdx = 0; tIdx < 5; tIdx++) {
        const tx = this.getActivitySlotX('tea_lounge', tIdx) + 12;
        const ty = 145;

        if (isResto) {
          // Restaurant gastronomique : 2 chaises en bois noble et velours par table (gauche et droite)
          [-14, 14].forEach(dx => {
            ctx.fillStyle = '#451a03';
            ctx.beginPath();
            ctx.roundRect(tx + dx - 8, ty - 18, 16, 18, 3);
            ctx.fill();
            ctx.strokeStyle = '#b45309';
            ctx.lineWidth = 1.1;
            ctx.stroke();
            // Dossier rembourré rouge bordeaux
            ctx.fillStyle = '#7f1d1d';
            ctx.fillRect(tx + dx - 5.5, ty - 16, 11, 10);
          });
        } else {
          // Salon de thé : Fauteuils lounge velours confortables
          ctx.fillStyle = '#831843';
          ctx.beginPath();
          ctx.roundRect(tx - 11, ty - 16, 22, 16, 5);
          ctx.fill();
          ctx.strokeStyle = '#f472b6';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      ctx.restore();
      return;
    }

    // 4. USINES & CONDITIONNEMENT (Conserverie, Dattes) : Rail de convoyage motorisé 2.5D
    if (archetype === 'industrial_belt') {
      const beltLeft = 96;
      const beltRight = Math.max(175, this.width - 46);
      const beltW = beltRight - beltLeft;
      const beltY = 136;
      const beltH = 7;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(beltLeft, beltY, beltW, beltH, 3);
      ctx.fill();
      ctx.strokeStyle = isBusy ? '#38bdf8' : '#475569';
      ctx.lineWidth = 1.1;
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(beltLeft + 2, beltY + 1, beltW - 4, beltH - 2, 2);
      ctx.clip();
      const shift = isBusy ? ((timeSec * 42) % 14) : 0;
      ctx.strokeStyle = isBusy ? 'rgba(52, 211, 153, 0.65)' : 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = 1.4;
      for (let rx = beltLeft - 10; rx < beltRight + 14; rx += 14) {
        const cx = rx - shift;
        ctx.beginPath();
        ctx.moveTo(cx + 4, beltY + 1.5);
        ctx.lineTo(cx, beltY + beltH / 2);
        ctx.lineTo(cx + 4, beltY + beltH - 1.5);
        ctx.stroke();
      }
      ctx.restore();

      for (const item of this.conveyorItems) {
        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(item.x, beltY - 1, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1;
        ctx.stroke();

        const bob = Math.sin(timeSec * 12 + item.x * 0.1) * 1.2;
        ctx.font = '12.5px serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.icon, item.x, beltY - 4 + bob);
        ctx.restore();
      }
      ctx.restore();
      return;
    }

    // 4.A BOULANGERIE ARTISANALE : Four traditionnel en briques réfractaires avec voûte, flammes & pelle à tabouna
    if (archetype === 'boulangerie_oven') {
      const ovenX = leftX + 8;
      const ovenY = 96;
      const ovenW = Math.min(108, zoneW * 0.46);
      const ovenH = 50;

      // Corps du grand four en briques voûté
      const ovenGrad = ctx.createLinearGradient(ovenX, ovenY, ovenX, ovenY + ovenH);
      ovenGrad.addColorStop(0, '#78350f');
      ovenGrad.addColorStop(0.5, '#451a03');
      ovenGrad.addColorStop(1, '#270e02');
      ctx.fillStyle = ovenGrad;
      ctx.beginPath();
      ctx.roundRect(ovenX, ovenY, ovenW, ovenH, [16, 16, 4, 4]);
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Briques réfractaires décoratives
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
      ctx.lineWidth = 0.8;
      for (let by = ovenY + 6; by < ovenY + ovenH - 4; by += 8) {
        ctx.beginPath();
        ctx.moveTo(ovenX + 4, by);
        ctx.lineTo(ovenX + ovenW - 4, by);
        ctx.stroke();
      }

      // Bouche du four (voûte noire incandescente avec braises et flammes)
      const mouthW = ovenW * 0.54;
      const mouthH = 26;
      const mouthX = ovenX + (ovenW - mouthW) / 2;
      const mouthY = ovenY + ovenH - mouthH - 2;
      ctx.fillStyle = '#0f0502';
      ctx.beginPath();
      ctx.roundRect(mouthX, mouthY, mouthW, mouthH, [12, 12, 2, 2]);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Braises & flammes rougeoyantes animées
      const flameShift = isBusy ? Math.sin(timeSec * 8) * 2 : 0;
      const flameGrad = ctx.createRadialGradient(mouthX + mouthW / 2, mouthY + mouthH - 4, 2, mouthX + mouthW / 2, mouthY + mouthH - 6, mouthW * 0.5);
      flameGrad.addColorStop(0, '#fef08a');
      flameGrad.addColorStop(0.3, '#f59e0b');
      flameGrad.addColorStop(0.7, '#dc2626');
      flameGrad.addColorStop(1, 'rgba(127, 29, 29, 0)');
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.ellipse(mouthX + mouthW / 2, mouthY + mouthH - 6, mouthW * 0.44 + flameShift, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pelle en bois de boulanger qui glisse du pain
      const peelX = mouthX + mouthW * 0.45;
      const peelY = mouthY + mouthH - 8;
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(peelX + 22, peelY + 4);
      ctx.lineTo(peelX - 10, peelY - 1);
      ctx.stroke();
      ctx.fillStyle = '#d97706';
      ctx.fillRect(peelX - 14, peelY - 4, 12, 6);

      // Baguette dorée croustillante sur la pelle
      ctx.font = '10px serif';
      ctx.fillText('🥖', peelX - 8, peelY - 1);

      // Étagère de pains et tabouna chauds à droite du four
      const shelfX = ovenX + ovenW + 8;
      const shelfW = Math.max(70, zoneW - ovenW - 14);
      const shelfY = 120;
      ctx.fillStyle = '#451a03';
      ctx.fillRect(shelfX, shelfY, shelfW, 4);
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1;
      ctx.strokeRect(shelfX, shelfY, shelfW, 4);

      ctx.font = '11px serif';
      ctx.textAlign = 'center';
      const breads = ['🥖', '🫓', '🥐', '🥖'];
      breads.forEach((b, i) => {
        const bx = shelfX + 12 + i * 16;
        if (bx < shelfX + shelfW - 4) {
          ctx.fillText(b, bx, shelfY - 2);
        }
      });

      // Panier d'osier au sol
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.roundRect(shelfX + 8, 138, 28, 12, [2, 2, 6, 6]);
      ctx.fill();
      ctx.font = '9px serif';
      ctx.fillText('🥖🫓', shelfX + 22, 136);

      ctx.restore();
      return;
    }

    // 4.B ATELIER D'ARTISANAT & POTERIE : Tour de potier rotatif + étagères de céramiques peintes zellige
    if (archetype === 'pottery_workshop') {
      const wheelX = leftX + 28;
      const wheelY = 138;

      // Base du tour de potier
      ctx.fillStyle = '#334155';
      ctx.fillRect(wheelX - 14, wheelY + 4, 28, 8);
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(wheelX, wheelY + 12, 18, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Plateau circulaire tournant du potier
      const rot = (timeSec * 5) % (Math.PI * 2);
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.ellipse(wheelX, wheelY + 2, 16, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Motte d'argile en cours de modelage avec ondulation réaliste
      const clayH = 14 + Math.sin(rot * 2) * 1.5;
      const clayGrad = ctx.createLinearGradient(wheelX - 8, wheelY - clayH, wheelX + 8, wheelY);
      clayGrad.addColorStop(0, '#c2410c');
      clayGrad.addColorStop(0.5, '#9a3412');
      clayGrad.addColorStop(1, '#7c2d12');
      ctx.fillStyle = clayGrad;
      ctx.beginPath();
      ctx.roundRect(wheelX - 7, wheelY - clayH + 2, 14, clayH, [5, 5, 2, 2]);
      ctx.fill();

      // Étagère d'exposition de céramiques peintes nabeuliennes zellige bleu cobalt & or
      const shelfX = wheelX + 28;
      const shelfW = Math.max(90, zoneW - 64);
      const shelfY1 = 112;
      const shelfY2 = 132;

      [shelfY1, shelfY2].forEach((sy, rowIdx) => {
        ctx.fillStyle = '#451a03';
        ctx.fillRect(shelfX, sy, shelfW, 3.5);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 0.8;
        ctx.strokeRect(shelfX, sy, shelfW, 3.5);

        const items = rowIdx === 0 ? ['🏺', '🍶', '🥣', '🏺'] : ['🥣', '🏺', '🍶', '🏺'];
        ctx.font = '11px serif';
        ctx.textAlign = 'center';
        items.forEach((it, i) => {
          const ix = shelfX + 12 + i * 22;
          if (ix < shelfX + shelfW - 6) {
            ctx.fillText(it, ix, sy - 2);
          }
        });
      });

      // Petite étoile d'éclat zellige
      if (isBusy) {
        ctx.font = '8px serif';
        ctx.fillText('✨', shelfX + 22, shelfY1 - 10);
      }

      ctx.restore();
      return;
    }

    // 4.C MAÂSERA / HUILERIE D'OLIVE : Meule circulaire tournante en granit + écoulement d'huile dorée
    if (archetype === 'olive_press') {
      const millX = leftX + 26;
      const millY = 132;

      // Grande cuve en pierre de taille circulaire
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(millX, millY + 10, 24, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Meule en granit qui tourne
      const angle = (timeSec * 2.2) % (Math.PI * 2);
      const wheelOffset = Math.sin(angle) * 12;
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.ellipse(millX + wheelOffset, millY - 2, 9, 14, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Pivot et axe en bois d'olivier
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(millX, millY - 14);
      ctx.lineTo(millX, millY + 10);
      ctx.stroke();

      // Presse hydraulique & goulotte d'huile dorée luminescente
      const pressX = millX + 34;
      const pressW = Math.max(90, zoneW - 68);
      const pressY = 122;

      // Cuve inox de réception d'huile
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(pressX + 6, pressY + 4, 34, 18, 3);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Filet d'huile d'olive dorée qui coule en continu
      const flowAlpha = 0.75 + Math.sin(timeSec * 10) * 0.2;
      ctx.strokeStyle = `rgba(250, 204, 21, ${flowAlpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pressX + 23, pressY - 4);
      ctx.lineTo(pressX + 23, pressY + 12);
      ctx.stroke();

      // Huile d'olive pure dans la cuve avec reflets
      ctx.fillStyle = '#eab308';
      ctx.fillRect(pressX + 9, pressY + 13, 28, 7);

      // Bonbonnes en verre traditionnelles et jarres d'huile (دبوزة ماجل)
      ctx.font = '12px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🫒', pressX + 48, pressY + 14);
      ctx.fillText('🏺', pressX + 64, pressY + 14);
      ctx.fillText('🫒', pressX + 80, pressY + 14);

      ctx.restore();
      return;
    }

    // 4.D CENTRE DE THALASSOTHÉRAPIE : Bassin d'eau de mer chauffée turquoise, brume & transats teck
    if (archetype === 'thalasso_spa') {
      const poolX = leftX + 8;
      const poolY = 126;
      const poolW = Math.min(130, zoneW * 0.58);
      const poolH = 24;

      // Rebord du bassin en marbre blanc de Carrare / Thala
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(poolX, poolY, poolW, poolH, 6);
      ctx.fill();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Eau de mer turquoise chauffée avec ondulations translucides
      const seaGrad = ctx.createLinearGradient(poolX, poolY + 2, poolX, poolY + poolH);
      seaGrad.addColorStop(0, '#06b6d4');
      seaGrad.addColorStop(0.5, '#0891b2');
      seaGrad.addColorStop(1, '#0e7490');
      ctx.fillStyle = seaGrad;
      ctx.beginPath();
      ctx.roundRect(poolX + 3, poolY + 3, poolW - 6, poolH - 5, 4);
      ctx.fill();

      // Ondulations caustiques douces
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1;
      for (let wx = poolX + 8; wx < poolX + poolW - 10; wx += 16) {
        const cx = wx + Math.sin(timeSec * 3 + wx * 0.1) * 3;
        ctx.beginPath();
        ctx.arc(cx, poolY + 9, 4, 0, Math.PI);
        ctx.stroke();
      }

      // Pétales de jasmin et fleurs flottant à la surface
      ctx.font = '9px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌸', poolX + 16, poolY + 12);
      ctx.fillText('💮', poolX + poolW * 0.45, poolY + 10);
      ctx.fillText('🌸', poolX + poolW - 20, poolY + 14);

      // Particules de brume / vapeur thermale tiède relaxante
      if (isBusy) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
        for (let i = 0; i < 4; i++) {
          const sx = poolX + 14 + i * 26 + Math.sin(timeSec * 2 + i) * 4;
          const sy = poolY - 2 - ((timeSec * 14 + i * 8) % 12);
          ctx.beginPath();
          ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Transat de relaxation en bois de teck avec serviette cyan roulée
      const deckX = poolX + poolW + 6;
      const deckW = Math.max(52, zoneW - poolW - 12);
      const deckY = 132;
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.roundRect(deckX, deckY, deckW, 6, 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(deckX + 4, deckY - 4, 16, 5, 2);
      ctx.fill();
      ctx.font = '10px serif';
      ctx.fillText('💆', deckX + deckW / 2, deckY - 2);

      ctx.restore();
      return;
    }

    // 5. RESTAURATION & BOUTIQUES (`food_counter` & `retail_shop`) : Vitrine / Comptoir d'Exposition éclairé
    const displayX = leftX + 6;
    const displayY = 135;
    const displayW = Math.max(92, zoneW - 14);
    ctx.fillStyle = archetype === 'food_counter' ? 'rgba(124, 45, 18, 0.85)' : 'rgba(15, 23, 42, 0.82)';
    ctx.beginPath();
    ctx.roundRect(displayX, displayY, displayW, 12, 4);
    ctx.fill();
    ctx.strokeStyle = archetype === 'food_counter' ? '#f97316' : '#fbbf24';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    const icons = this.orderIcons[bizId] || this.orderIcons.default;
    const itemCount = Math.min(5, Math.max(3, Math.floor(displayW / 28)));
    ctx.font = '10.5px serif';
    ctx.textAlign = 'center';
    for (let i = 0; i < itemCount; i++) {
      const ix = displayX + (displayW / (itemCount + 1)) * (i + 1);
      const bob = isBusy ? Math.sin(timeSec * 5 + i) * 1.2 : 0;
      ctx.fillText(icons[i % icons.length], ix, displayY + 9 + bob);
    }

    ctx.restore();
  }

  // --- DESSIN DES MACHINES ET ANIMATIONS ÉLÉVÉES SELON LE MÉTIER ---
  drawMachineProp(ctx, bizId, x, y, isBusy, timeSec) {
    ctx.save();

    // 1. TRADITIONAL FOOD / LABLABI / KASKROUT : marmite fumante, découpe de baguette, louche en mouvement
    if (bizId === 'kaskrout' || bizId === 'fricasse') {
      ctx.fillStyle = '#334155';
      ctx.fillRect(x + 4, y - 20, 36, 20);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 4, y - 20, 36, 20);

      // Flammes de cuisson bleues et jaunes sous la marmite
      if (isBusy) {
        ctx.fillStyle = Math.sin(timeSec * 15) > 0 ? '#38bdf8' : '#f59e0b';
        ctx.fillRect(x + 8, y - 2, 8, 2);
        ctx.fillRect(x + 22, y - 2, 8, 2);
      }

      // Marmite en cuivre traditionnelle (قدرة نحاس)
      const potGrad = ctx.createLinearGradient(x + 6, y - 32, x + 38, y - 20);
      potGrad.addColorStop(0, '#b45309');
      potGrad.addColorStop(0.5, '#d97706');
      potGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = potGrad;
      ctx.beginPath();
      ctx.arc(x + 22, y - 18, 13, 0, Math.PI, false);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Poignées de la marmite
      ctx.strokeStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(x + 8, y - 22, 3, 0, Math.PI * 2);
      ctx.arc(x + 36, y - 22, 3, 0, Math.PI * 2);
      ctx.stroke();

      // Louche en cuivre (غراف نحاس) avec mouvement animé de service
      const ladleAngle = isBusy ? Math.sin(timeSec * 4) * 0.35 : 0.1;
      ctx.save();
      ctx.translate(x + 22, y - 26);
      ctx.rotate(ladleAngle);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(8, -12);
      ctx.stroke();
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(0, 2, 4, 0, Math.PI);
      ctx.fill();
      ctx.restore();

      // Planche à découper avec baguette de pain
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x + 2, y - 6, 14, 4);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(x + 4, y - 8, 10, 3);
    }

    // 1B. RESTAURANT : Passe-plats inox du chef avec cloche dorée fumante et tajine chaud
    else if (bizId === 'restaurant') {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x + 2, y - 18, 40, 18);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(x + 2, y - 18, 40, 18);

      // Cloche dorée de service gastronomique
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(x + 16, y - 18, 8, Math.PI, 0);
      ctx.fill();
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(x + 16, y - 26, 2, 0, Math.PI * 2);
      ctx.fill();

      // Tajine tunisien chaud fumant
      ctx.font = '11px serif';
      ctx.fillText('🍲', x + 25, y - 16);
      if (isBusy) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.arc(x + 28, y - 24 - (timeSec * 8 % 6), 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. SALON DE THÉ : Machine expresso italienne chromée & shaker cocktail moderne
    else if (bizId === 'salon_de_the') {
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(x + 4, y - 24, 34, 24, 3);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Finition inox chromé
      ctx.fillStyle = '#64748b';
      ctx.fillRect(x + 8, y - 20, 26, 6);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(x + 12, y - 12, 4, 3);
      ctx.fillRect(x + 24, y - 12, 4, 3);

      // Tasse et verre cocktail
      ctx.font = '9.5px serif';
      ctx.fillText('🍹', x + 10, y - 4);
      ctx.fillText('☕', x + 24, y - 4);
    }

    // 2B. CAFÉ ARBI : Zazoua en cuivre sur كانون فخار مع جمر مشتعل ورغوة التاي وجدول صب التاي المنعنع
    else if (bizId === 'kahwa') {
      ctx.fillStyle = '#9a3412';
      ctx.beginPath();
      ctx.moveTo(x + 8, y - 1);
      ctx.lineTo(x + 36, y - 1);
      ctx.lineTo(x + 32, y - 18);
      ctx.lineTo(x + 12, y - 18);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const glow = Math.sin(timeSec * 6) * 0.2 + 0.8;
      ctx.fillStyle = 'rgba(239, 68, 68, ' + glow + ')';
      ctx.beginPath();
      ctx.arc(x + 22, y - 18, 9, 0, Math.PI, true);
      ctx.fill();

      // Braises crépitantes animées
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(x + 18, y - 19, 2.5, 0, Math.PI * 2);
      ctx.arc(x + 26, y - 19, 2, 0, Math.PI * 2);
      ctx.fill();

      // Théière / Zazoua inclinée versant le thé à la menthe en hauteur (التشحيرة التونسية)
      const pourTilt = isBusy ? Math.sin(timeSec * 4) * 0.25 + 0.35 : 0;
      const zazX = x + 16;
      const zazY = y - 30 - (isBusy ? Math.abs(Math.sin(timeSec * 4)) * 6 : 0);

      ctx.save();
      ctx.translate(zazX + 5, zazY + 5);
      ctx.rotate(pourTilt);
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.moveTo(-5, 5);
      ctx.lineTo(5, 5);
      ctx.lineTo(3, -5);
      ctx.lineTo(-3, -5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.stroke();

      // Manche en bois
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-3, -2);
      ctx.lineTo(-11, -8);
      ctx.stroke();
      ctx.restore();

      // Jet de thé ambré parabolique coulant dans le verre lors du service
      if (isBusy) {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(zazX + 10, zazY + 4);
        ctx.quadraticCurveTo(x + 35, zazY + 6, x + 35, y - 12);
        ctx.stroke();
      }

      // Verre de thé avec mousse blanche et feuille de menthe fraîche
      ctx.fillStyle = 'rgba(217, 119, 6, 0.85)';
      ctx.fillRect(x + 32, y - 12, 6, 10);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 32, y - 14.5, 6, 2.5);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(x + 34, y - 16, 2.5, 2.5);
    }

    // POISSONNERIE / MARÉE (FRUITS DE MER) : Étal de glace pilée scintillante, poissons sautillants et citron
    else if (bizId === 'fruits_de_mer' || bizId === 'croisiere_mer') {
      // Bac réfrigéré inox & glace pilée
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(x + 2, y - 16, 40, 16);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 2, y - 16, 40, 16);

      // Lit de glace pilée cristalline
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.moveTo(x + 3, y - 16);
      ctx.lineTo(x + 12, y - 21);
      ctx.lineTo(x + 22, y - 18);
      ctx.lineTo(x + 32, y - 22);
      ctx.lineTo(x + 41, y - 16);
      ctx.closePath();
      ctx.fill();

      // Poissons frais & crevettes animés avec reflets d'eau
      const fishHop = isBusy ? Math.abs(Math.sin(timeSec * 7)) * 4 : 0;
      ctx.font = '13px serif';
      ctx.fillText('🐟', x + 6, y - 18 - fishHop);
      ctx.fillText('🦐', x + 22, y - 17 - (isBusy ? Math.abs(Math.cos(timeSec * 7)) * 3 : 0));
      if (isBusy) {
        ctx.fillStyle = '#7dd3fc';
        ctx.beginPath();
        ctx.arc(x + 18, y - 26 - (timeSec * 15 % 8), 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // BOUCHERIE TRADITIONNELLE : Billot de bois massif, couperet animé et pièces de viande
    else if (bizId === 'boucherie') {
      // Billot en bois d'olivier épais
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x + 4, y - 18, 36, 18);
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 4, y - 18, 36, 18);

      // Pièce de viande rouge sur le billot
      ctx.font = '13px serif';
      ctx.fillText('🥩', x + 8, y - 18);

      // Couperet de boucher animé en cadence (تقصيص اللحم)
      const chopAngle = isBusy ? Math.sin(timeSec * 9) * 0.45 : -0.2;
      ctx.save();
      ctx.translate(x + 28, y - 22);
      ctx.rotate(chopAngle);
      ctx.font = '14px serif';
      ctx.fillText('🔪', -6, 0);
      ctx.restore();
    }

    // LIBRAIRIE & PAPETERIE : Presse/Reliure, pile de livres qui s'empilent et plume calligraphique
    else if (bizId === 'librairie') {
      ctx.fillStyle = '#451a03';
      ctx.fillRect(x + 4, y - 16, 36, 16);
      ctx.strokeStyle = '#d97706';
      ctx.strokeRect(x + 4, y - 16, 36, 16);

      const bookFloat = isBusy ? Math.sin(timeSec * 6) * 2.5 : 0;
      ctx.font = '13px serif';
      ctx.fillText('📚', x + 6, y - 17);
      ctx.fillText('📖', x + 21, y - 19 + bookFloat);
      if (isBusy) {
        ctx.font = '11px serif';
        ctx.fillText('✏️', x + 24 + Math.cos(timeSec * 8) * 3, y - 27);
      }
    }

    // PRODUITS LAITIERS & FROMAGERIE (BÉJA) : Baratte à lait, meules de fromage dorées et pot de crème
    else if (bizId === 'produits_laitiers') {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x + 4, y - 16, 36, 16);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(x + 4, y - 16, 36, 16);

      const churnMove = isBusy ? Math.sin(timeSec * 8) * 3 : 0;
      ctx.font = '13px serif';
      ctx.fillText('🧀', x + 6, y - 17);
      ctx.fillText('🥛', x + 22, y - 17 + churnMove);
    }

    // BOUTIQUE DE MODE & VÊTEMENTS : Mannequin de couture, ciseaux de tailleur et étoffes
    else if (bizId === 'vente_vetements') {
      ctx.fillStyle = '#4a044e';
      ctx.fillRect(x + 4, y - 16, 36, 16);
      ctx.strokeStyle = '#f472b6';
      ctx.strokeRect(x + 4, y - 16, 36, 16);

      const dressSway = isBusy ? Math.sin(timeSec * 5) * 0.12 : 0;
      ctx.save();
      ctx.translate(x + 15, y - 22);
      ctx.rotate(dressSway);
      ctx.font = '15px serif';
      ctx.fillText('👗', -7, 4);
      ctx.restore();
      ctx.font = '12px serif';
      ctx.fillText('👕', x + 24, y - 18);
    }

    // HORLOGERIE & BIJOUTERIE : Vitrine blindée illuminée, montres suisses et éclats de diamant rotatifs
    else if (bizId === 'vente_montres') {
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(x + 4, y - 18, 36, 18);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 4, y - 18, 36, 18);

      ctx.font = '13px serif';
      ctx.fillText('⌚', x + 7, y - 19);
      ctx.fillText('💎', x + 22, y - 19);

      // Éclat stellaire tournant sur le diamant
      const sparkScale = 0.7 + Math.sin(timeSec * 9) * 0.35;
      ctx.save();
      ctx.translate(x + 28, y - 27);
      ctx.scale(sparkScale, sparkScale);
      ctx.font = '10px sans-serif';
      ctx.fillText('✨', -5, 4);
      ctx.restore();
    }

    // SALLE DE JEUX / GAMING ARENA : Borne d'arcade néon clignotante et manettes vibrantes
    else if (bizId === 'salle_de_jeux') {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(x + 4, y - 22, 36, 22);
      ctx.strokeStyle = (Math.floor(timeSec * 6) % 2 === 0) ? '#a855f7' : '#06b6d4';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(x + 4, y - 22, 36, 22);

      const padShake = isBusy ? Math.sin(timeSec * 16) * 2 : 0;
      ctx.font = '14px serif';
      ctx.fillText('🕹️', x + 7, y - 6);
      ctx.fillText('🎮', x + 21 + padShake, y - 20);
    }

    // CONDITIONNEMENT DE DATTES (DEGLET NOUR) : Tapis roulant doré et régimes de dattes
    else if (bizId === 'emballage_dattes') {
      ctx.fillStyle = '#431407';
      ctx.fillRect(x + 4, y - 16, 36, 16);
      ctx.strokeStyle = '#f59e0b';
      ctx.strokeRect(x + 4, y - 16, 36, 16);

      const beltShift = isBusy ? (timeSec * 14) % 8 : 0;
      ctx.font = '13px serif';
      ctx.fillText('🌴', x + 6, y - 18);
      ctx.fillText('📦', x + 18 + beltShift * 0.8, y - 17);
    }

    // HÔTEL / AGENCE DE VOYAGES / SUPERMARCHÉ
    else if (bizId === 'hotel' || bizId === 'agence_voyages' || bizId === 'superette' || bizId === 'supermarche') {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x + 4, y - 18, 36, 18);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 4, y - 18, 36, 18);

      const icon1 = bizId === 'hotel' ? '🛎️' : (bizId === 'agence_voyages' ? '✈️' : '🛒');
      const icon2 = bizId === 'hotel' ? '🔑' : (bizId === 'agence_voyages' ? '🎫' : '🧺');
      const bob = isBusy ? Math.abs(Math.sin(timeSec * 6)) * 3 : 0;
      ctx.font = '13px serif';
      ctx.fillText(icon1, x + 7, y - 19 - bob);
      ctx.fillText(icon2, x + 22, y - 19);
    }

    // 3. OLIVE OIL MILL (SFAX) : Meules en pierre rotatives et filet d'huile dorée
    else if (bizId === 'usine_conserves') {
      ctx.fillStyle = '#475569';
      ctx.fillRect(x + 4, y - 12, 36, 12);
      ctx.strokeStyle = '#94a3b8';
      ctx.strokeRect(x + 4, y - 12, 36, 12);

      const millAngle = (timeSec * (isBusy ? 2.5 : 0.6)) % (Math.PI * 2);
      const stoneGrad = ctx.createLinearGradient(x + 10, y - 32, x + 34, y - 12);
      stoneGrad.addColorStop(0, '#94a3b8');
      stoneGrad.addColorStop(0.5, '#64748b');
      stoneGrad.addColorStop(1, '#334155');
      ctx.fillStyle = stoneGrad;

      ctx.save();
      ctx.translate(x + 22, y - 22);
      ctx.scale(1, 0.55);
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.rotate(millAngle);
      ctx.strokeStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(12, 0);
      ctx.moveTo(0, -12);
      ctx.lineTo(0, 12);
      ctx.stroke();
      ctx.restore();

      if (isBusy) {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x + 34, y - 14);
        ctx.lineTo(x + 34, y - 3);
        ctx.stroke();
      }

      ctx.fillStyle = '#c2410c';
      ctx.beginPath();
      ctx.arc(x + 34, y - 2, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3.5. ATTARIYA / GROCER : Comptoir de découpe et balance mécanique tunisienne vintage
    else if (bizId === 'attariya') {
      ctx.fillStyle = '#334155';
      ctx.fillRect(x + 4, y - 16, 36, 16);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 4, y - 16, 36, 16);

      // Mât central de la balance
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 22, y - 16);
      ctx.lineTo(x + 22, y - 28);
      ctx.stroke();

      // Fléau oscillant de la balance (حركة الميزان أثناء الوزن)
      const balanceTilt = isBusy ? Math.sin(timeSec * 5) * 0.18 : 0.05;
      ctx.save();
      ctx.translate(x + 22, y - 28);
      ctx.rotate(balanceTilt);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-11, 0);
      ctx.lineTo(11, 0);
      ctx.stroke();

      // Plateaux de pesée en laiton
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-11, 0); ctx.lineTo(-11, 6);
      ctx.moveTo(11, 0); ctx.lineTo(11, 6);
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(-11, 6, 4, 0, Math.PI);
      ctx.arc(11, 6, 4, 0, Math.PI);
      ctx.fill();
      ctx.restore();

      // Poids en fonte (عيار النحاس) et meule de fromage Sicilien / Ricotta
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 6, y - 20, 5, 4);
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(x + 32, y - 20, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.stroke();
    }

    // 4. BAKERY / MAKROUDH (KAIROUAN) : Pâtisserie, façonnage de pâte et éclat de miel
    else if (bizId === 'patisserie') {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(x + 4, y - 18, 36, 18);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 4, y - 18, 36, 18);

      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.moveTo(x + 12, y - 22);
      ctx.lineTo(x + 18, y - 25);
      ctx.lineTo(x + 24, y - 22);
      ctx.lineTo(x + 18, y - 19);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.stroke();

      const stampY = y - 28 + (isBusy ? Math.sin(timeSec * 6) * 4 : 0);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(x + 15, stampY, 6, 8);
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(x + 18, stampY, 3, 0, Math.PI * 2);
      ctx.fill();

      const honeyGlow = Math.sin(timeSec * 8) * 0.4 + 0.6;
      ctx.fillStyle = 'rgba(251, 191, 36, ' + honeyGlow + ')';
      ctx.font = '10px sans-serif';
      ctx.fillText('✨', x + 26, y - 24);
    }

    // 5. HOLDING HEADQUARTERS / AIR FALCON / SHOWROOM : Ticker boursier, radar & table de conférence
    else if (bizId === 'tayaran_el_ghzela' || bizId === 'showroom_auto' || bizId === 'promoteur_immobilier' || bizId === 'centre_commercial') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 4, y - 26, 36, 26);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 4, y - 26, 36, 26);

      const radarSweep = (timeSec * 3) % (Math.PI * 2);
      ctx.fillStyle = '#022c22';
      ctx.beginPath();
      ctx.arc(x + 22, y - 13, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.strokeStyle = '#34d399';
      ctx.beginPath();
      ctx.moveTo(x + 22, y - 13);
      ctx.lineTo(x + 22 + Math.cos(radarSweep) * 8, y - 13 + Math.sin(radarSweep) * 8);
      ctx.stroke();

      ctx.fillStyle = '#090d16';
      ctx.fillRect(x + 2, y - 36, 40, 9);
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 7px monospace';
      ctx.fillText('بورصة تونس 📈', x + 2, y - 29);
    }

    else if (bizId === 'boulangerie_artisanale') {
      ctx.fillStyle = '#451a03';
      ctx.fillRect(x + 4, y - 18, 36, 18);
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(x + 4, y - 18, 36, 18);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillRect(x + 8, y - 16, 24, 4);
      ctx.font = '9px serif';
      ctx.fillText('🥖', x + 12, y - 5);
      ctx.fillText('🫓', x + 24, y - 5);
    }
    else if (bizId === 'artisanat_poterie') {
      ctx.fillStyle = '#334155';
      ctx.fillRect(x + 4, y - 18, 36, 18);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(x + 4, y - 18, 36, 18);
      ctx.font = '9.5px serif';
      ctx.fillText('🏺', x + 12, y - 5);
      ctx.fillText('🥣', x + 24, y - 5);
    }
    else if (bizId === 'huilerie_olive') {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x + 4, y - 18, 36, 18);
      ctx.strokeStyle = '#65a30d';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(x + 4, y - 18, 36, 18);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(x + 8, y - 14, 8, 12);
      ctx.font = '9.5px serif';
      ctx.fillText('🫒', x + 24, y - 5);
    }
    else if (bizId === 'centre_thalasso') {
      ctx.fillStyle = '#083344';
      ctx.fillRect(x + 4, y - 18, 36, 18);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(x + 4, y - 18, 36, 18);
      ctx.font = '9.5px serif';
      ctx.fillText('🫧', x + 12, y - 5);
      ctx.fillText('💆', x + 24, y - 5);
    }
    else if (bizId === 'taxi_collectif') {
      // Poste de dispatching / tableau de bord avec pneu de secours et radio
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x + 4, y - 16, 36, 16);
      ctx.strokeStyle = '#64748b';
      ctx.strokeRect(x + 4, y - 16, 36, 16);
      ctx.font = '14px serif';
      ctx.fillText('🛞', x + 6, y - 3);
      ctx.font = '12px serif';
      ctx.fillText('📋', x + 24, y - 4);
    }

    // Décor par défaut
    else {
      ctx.fillStyle = '#334155';
      ctx.fillRect(x + 6, y - 18, 32, 18);
      ctx.strokeStyle = '#64748b';
      ctx.strokeRect(x + 6, y - 18, 32, 18);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '12px sans-serif';
      ctx.fillText('📦', x + 16, y - 5);
    }

    ctx.restore();
  }

  // --- PERSONNAGE VECTORIEL ULTRA-RÉALISTE : employé animé ---
  drawWorker(ctx, x, footY, seed, isBusy, timeSec, showLegs = false) {
    const palettes = [
      { coat: '#1e3a8a', pants: '#1e293b', skin: '#fcd34d', skinShadow: '#f59e0b', apron: '#f8fafc', shoes: '#0f172a' },
      { coat: '#065f46', pants: '#0f172a', skin: '#f59e0b', skinShadow: '#d97706', apron: '#fef3c7', shoes: '#1e293b' },
      { coat: '#581c87', pants: '#312e81', skin: '#fde68a', skinShadow: '#f59e0b', apron: '#f8fafc', shoes: '#090d16' },
      { coat: '#991b1b', pants: '#1e293b', skin: '#fcd34d', skinShadow: '#ea580c', apron: '#fff7ed', shoes: '#0f172a' }
    ];
    const pal = palettes[seed % palettes.length];
    const phase = timeSec * (isBusy ? 7 : 2.2) + seed * 1.3;
    const bob = Math.sin(phase) * (isBusy ? 1.6 : 0.7);

    ctx.save();
    ctx.translate(x, footY);

    // Zéro pieds visibles sous les tables : uniquement pour les employés qui se déplacent à pied dans la boutique !
    if (showLegs) {
      // 1. Ombre douce diffuse réaliste au sol
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 1, 13, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Chaussures tunisiennes détaillées
      ctx.fillStyle = pal.shoes;
      ctx.beginPath();
      ctx.roundRect(-8, -4, 7, 4.5, [2, 3, 2, 2]);
      ctx.roundRect(1, -4, 7, 4.5, [2, 3, 2, 2]);
      ctx.fill();

      // Semelles contrastées
      ctx.fillStyle = '#334155';
      ctx.fillRect(-8, -0.5, 7, 1);
      ctx.fillRect(1, -0.5, 7, 1);

      // 3. Pantalon avec pliure anatomique
      ctx.fillStyle = pal.pants;
      ctx.beginPath();
      ctx.roundRect(-7, -15, 6, 12, 1);
      ctx.roundRect(1, -15, 6, 12, 1);
      ctx.fill();
    }

    ctx.translate(0, bob);

    // 4. Bras arrière articulé (Épaule -> Coude -> Poignet)
    const armSwing = isBusy ? Math.sin(phase * 1.5) : Math.sin(phase) * 0.15;
    ctx.strokeStyle = pal.coat;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4.2;
    ctx.beginPath();
    ctx.moveTo(-7, -29);
    ctx.lineTo(-11, -21 + armSwing * 3);
    ctx.lineTo(-13, -15 + armSwing * 4);
    ctx.stroke();

    // Main arrière
    ctx.fillStyle = pal.skin;
    ctx.beginPath();
    ctx.arc(-13, -14 + armSwing * 4, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 5. Buste cintré (Veste professionnelle + Col de chemise + Tablier)
    ctx.fillStyle = pal.coat;
    ctx.beginPath();
    ctx.roundRect(-9, -32, 18, 19, [4, 4, 2, 2]);
    ctx.fill();

    // Col de chemise blanc visible
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-3, -32);
    ctx.lineTo(0, -28);
    ctx.lineTo(3, -32);
    ctx.closePath();
    ctx.fill();

    // Tablier de commerçant avec attaches
    ctx.fillStyle = pal.apron;
    ctx.beginPath();
    ctx.roundRect(-6.5, -28, 13, 15, [2, 2, 3, 3]);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Poche avant du tablier avec stylo
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.beginPath();
    ctx.roundRect(-4, -20, 8, 6, 1.5);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, -22, 1.5, 4);

    // 6. Bras avant actif avec animation dynamique
    const handX = 11 + (isBusy ? Math.sin(phase * 1.5 + 1.2) * 4 : 0);
    const handY = -21 - (isBusy ? Math.abs(Math.sin(phase * 1.5)) * 6 : Math.sin(phase) * 0.8);
    ctx.strokeStyle = pal.coat;
    ctx.lineWidth = 4.2;
    ctx.beginPath();
    ctx.moveTo(7, -29);
    ctx.lineTo(9, -23);
    ctx.lineTo(handX, handY);
    ctx.stroke();

    // Main avant
    ctx.fillStyle = pal.skin;
    ctx.beginPath();
    ctx.arc(handX, handY, 2.7, 0, Math.PI * 2);
    ctx.fill();

    // 7. Cou et tête réaliste
    ctx.fillStyle = pal.skinShadow;
    ctx.fillRect(-2.5, -34, 5, 3);
    ctx.fillStyle = pal.skin;
    ctx.beginPath();
    ctx.ellipse(0, -39.5, 6.8, 7.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Oreilles avec relief
    ctx.fillStyle = pal.skinShadow;
    ctx.beginPath();
    ctx.arc(-6.5, -39.5, 1.8, 0, Math.PI * 2);
    ctx.arc(6.5, -39.5, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // 8. Chéchia rouge tunisienne authentique brodée avec gland soyeux
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, -42.8, 6.4, Math.PI, 0, false);
    ctx.fill();
    // Bordure feutrine de la chéchia
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(-6.2, -43.2, 12.4, 2);

    // Gland/Kabbous noir tunisien oscillant avec l'action
    const kabbousSway = isBusy ? Math.sin(phase * 1.8) * 3 : Math.sin(phase) * 1.2;
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, -44.5);
    ctx.quadraticCurveTo(-2 + kabbousSway * 0.5, -43, -4 + kabbousSway, -39.5);
    ctx.stroke();

    // 9. Yeux expressifs avec clignement naturel (Blinking State Machine) et sourcils
    const isBlinking = ((timeSec + seed * 0.7) % 3.8) < 0.14;
    if (isBlinking) {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(1.2, -40.2);
      ctx.lineTo(3.4, -40.2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(1.5, -41, 1.6, 1.8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(2.2, -41, 0.7, 0.7); // Reflet oculaire
    }

    // Sourcils fins
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0.8, -42.5);
    ctx.lineTo(3.8, -42.2);
    ctx.stroke();

    // Sourire chaleureux tunisien
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(1.5, -37.5, 2.2, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // 10. Effet de concentration / brillance de savoir-faire lors de la production
    if (isBusy) {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.9)';
      ctx.font = '8px sans-serif';
      ctx.fillText('✨', 8, -46 + Math.sin(phase * 2) * 2);
    }

    ctx.restore();
  }

  // Dessin d'un bouton de recrutement très lisible au niveau de la place libre
  drawHireButton(ctx, x, y, width, height, label, slotIndex, type, cost = null, now = 0) {
    ctx.save();
    const totalAvail = (this.engine.dinars || 0) + (this.engine.bankBalance || 0);
    const canAfford = cost === null || (totalAvail >= cost);
    const pulse = Math.sin(now * 0.006) * 0.15 + 0.85;

    if (canAfford) {
      ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';
      ctx.shadowBlur = 6 * pulse;
    }

    const grad = ctx.createLinearGradient(x, y, x, y + height);
    if (canAfford) {
      grad.addColorStop(0, '#10b981');
      grad.addColorStop(1, '#047857');
    } else {
      grad.addColorStop(0, '#334155');
      grad.addColorStop(1, '#0f172a');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 6);
    ctx.fill();

    ctx.strokeStyle = canAfford ? '#34d399' : '#64748b';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8.5px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('➕ ' + label, x + width / 2, y + (height < 36 ? 12 : 14));

    if (cost !== null) {
      ctx.fillStyle = canAfford ? '#fef08a' : '#94a3b8';
      ctx.font = 'bold 7.5px monospace';
      ctx.fillText(this.formatNumber(cost) + ' DT', x + width / 2, y + (height < 36 ? 24 : 27));
    }

    this.clickZones.push({
      x,
      y,
      width,
      height,
      slotIndex,
      type
    });

    ctx.restore();
  }

  formatNumber(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return '' + Math.round(n);
  }

  // --- CLIENTS VIVANTS AVEC ACTIONS MÉTIER (CHARIOT SUPERMARCHÉ, CAFÉ, SALON DE THÉ ASSIS, BUREAUX AGENCE, BILLARD) ---
  drawCustomers(ctx) {
    const styles = [
      { robe: '#1e3a8a', coat: '#2563eb', skin: '#fcd34d', hat: 'chechia' },
      { robe: '#065f46', coat: '#059669', skin: '#f59e0b', hat: 'tarbouch' },
      { robe: '#7c2d12', coat: '#d97706', skin: '#fde68a', hat: 'hijab' },
      { robe: '#0f172a', coat: '#334155', skin: '#fcd34d', hat: 'hair' }
    ];

    for (const c of this.customers) {
      ctx.save();
      const seatedNow = c.isSeated && (c.state === 'waiting_service' || c.state === 'doing_activity');
      const isWalking = !seatedNow && (c.state === 'walking_in' || c.state === 'walking_out' || (c.state === 'queued' && Math.abs(c.x - c.targetX) > 1.5));
      const bounce = isWalking ? Math.abs(Math.sin(c.walkCycle * 6)) * 2.6 : 0;
      const isBilliard = c.state === 'doing_activity' && c.activityType === 'billiard';
      const tilt = isWalking ? Math.sin(c.walkCycle * 6) * 0.05 : (isBilliard ? -0.14 : 0);
      const baseFootY = seatedNow ? (c.y - 8) : c.y;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
      ctx.beginPath();
      ctx.ellipse(c.x + 12, baseFootY + 4, 10, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(c.x + 12, baseFootY - 6 - bounce);
      if (c.state === 'walking_out') {
        ctx.scale(-1, 1);
      }
      ctx.rotate(tilt);

      const seed = Math.floor(Math.abs(c.id * 1000));
      const st = styles[seed % styles.length];

      // Jambes animées (pliées si assis au salon de thé)
      const stride = isWalking ? Math.sin(c.walkCycle * 6) * 4 : 0;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (seatedNow) {
        ctx.moveTo(-3, 0);
        ctx.lineTo(-6, 5);
        ctx.lineTo(-6, 9);
        ctx.moveTo(3, 0);
        ctx.lineTo(0, 5);
        ctx.lineTo(0, 9);
      } else {
        ctx.moveTo(-3, 0);
        ctx.lineTo(-3 - stride * 0.6, 9);
        ctx.moveTo(3, 0);
        ctx.lineTo(3 + stride * 0.6, 9);
      }
      ctx.stroke();

      // Djellaba / Veste élégante
      ctx.fillStyle = st.coat;
      ctx.beginPath();
      ctx.roundRect(-7, -18, 14, 18, [4, 4, 2, 2]);
      ctx.fill();
      ctx.fillStyle = st.robe;
      ctx.fillRect(-2, -18, 4, 18);

      // Chariot de Supermarché 2.5D poussé par le client (`supermarket_checkout`)
      if (c.hasCart) {
        ctx.save();
        // Mains sur la barre du chariot
        ctx.strokeStyle = st.coat;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-5, -13);
        ctx.lineTo(-11, -10);
        ctx.stroke();

        // Panier métallique grillagé du chariot
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(-10, -11);
        ctx.lineTo(-12, -2);
        ctx.lineTo(-24, -2);
        ctx.lineTo(-26, -11);
        ctx.closePath();
        ctx.stroke();
        // Poignée rouge du chariot
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-11, -13, 3, 2.5);
        // Articles dans le chariot
        ctx.font = '8px serif';
        ctx.fillText('🧃', -23, -4);
        ctx.fillText('🥖', -17, -4);
        // Roulettes du chariot
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(-14, 6, 2, 0, Math.PI * 2);
        ctx.arc(-22, 6, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (c.state === 'doing_activity' && c.activityType === 'billiard') {
        const cueStroke = Math.sin(c.walkCycle * 11) * 4.5;
        ctx.strokeStyle = st.coat;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-5, -14);
        ctx.lineTo(-10, -8);
        ctx.moveTo(5, -14);
        ctx.lineTo(4 + cueStroke * 0.5, -7);
        ctx.stroke();
        ctx.save();
        ctx.strokeStyle = '#fde68a';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(6 + cueStroke, -6);
        ctx.lineTo(-18 + cueStroke, -11);
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(-18 + cueStroke, -11, 1.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (c.state === 'doing_activity' && c.activityType === 'console') {
        const padVib = Math.sin(c.walkCycle * 18) * 1.5;
        ctx.strokeStyle = st.coat;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-5, -14);
        ctx.lineTo(-7, -9 + padVib);
        ctx.moveTo(5, -14);
        ctx.lineTo(-2, -9 - padVib);
        ctx.stroke();
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎮', -5, -7 + padVib);
      } else if (c.state === 'doing_activity' && c.activityType === 'drinking') {
        const isKahwa = c.archetype === 'kahwa_counter';
        const sip = Math.max(0, Math.sin(c.activityTimer * 3.8 + seed));
        const cupY = -9 - sip * 11;
        const cupX = -8 + sip * 3;

        if (isKahwa && c.isSmoking) {
          // --- CLIENT DU CAFÉ QUI FUME UNE CIGARETTE ---
          const puffCycle = (c.activityTimer * 1.8 + seed);
          const isPuffing = Math.sin(puffCycle) > 0.6; // porte la cigarette aux lèvres
          const cigHandX = isPuffing ? -2 : -8;
          const cigHandY = isPuffing ? -21 : -9;

          // Bras gauche tenant la cigarette
          ctx.strokeStyle = st.coat;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(-5, -14);
          ctx.lineTo(cigHandX, cigHandY);
          // Bras droit posé sur le comptoir ou tenant la tasse
          ctx.moveTo(5, -14);
          ctx.lineTo(6, -6);
          ctx.stroke();

          // Cigarette fine blanche
          ctx.save();
          ctx.strokeStyle = '#f8fafc';
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(cigHandX, cigHandY);
          ctx.lineTo(cigHandX - 6, cigHandY - 2.5);
          ctx.stroke();

          // Filtre marron/doré
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(cigHandX, cigHandY);
          ctx.lineTo(cigHandX - 2, cigHandY - 0.8);
          ctx.stroke();

          // Braise ardente rouge/orange vif incandescent
          const emberPulse = isPuffing ? 1.6 : (0.9 + Math.sin(c.activityTimer * 12) * 0.3);
          ctx.fillStyle = isPuffing ? '#ef4444' : '#f97316';
          ctx.beginPath();
          ctx.arc(cigHandX - 6.5, cigHandY - 2.7, emberPulse, 0, Math.PI * 2);
          ctx.fill();

          // Volutes de fumée montantes et sinueuses
          const smokeRise = ((c.activityTimer * 18 + seed * 5) % 22);
          const smokeAlpha = Math.max(0, 0.5 - smokeRise / 24);
          ctx.fillStyle = `rgba(226, 232, 240, ${smokeAlpha})`;
          ctx.beginPath();
          ctx.arc(cigHandX - 7 + Math.sin(smokeRise * 0.4) * 3, cigHandY - 5 - smokeRise, 1.8 + smokeRise * 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Tasse de café posée sur le bar devant lui
          ctx.font = '9.5px serif';
          ctx.textAlign = 'center';
          ctx.fillText(c.orderIcon || '☕', 7, -5);
        } else if (isKahwa) {
          // --- CLIENT DU CAFÉ EN DISCUSSION AVEC SON VOISIN ---
          const talkCycle = (c.talkPhase || 0) + c.activityTimer * 3.2;
          const isGesticulating = Math.sin(talkCycle * 0.8) > -0.2;
          const gestureY = isGesticulating ? -8 + Math.sin(talkCycle * 3) * 4 : -5;
          const gestureX = isGesticulating ? 9 + Math.sin(talkCycle * 2) * 3 : 7;

          ctx.strokeStyle = st.coat;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          // Bras gauche buvant la gorgée de café
          ctx.moveTo(-5, -14);
          ctx.lineTo(cupX, cupY);
          // Bras droit gesticulant en discussion vivante
          ctx.moveTo(5, -14);
          ctx.lineTo(gestureX, gestureY);
          ctx.stroke();

          ctx.font = '9.5px serif';
          ctx.textAlign = 'center';
          ctx.fillText(c.orderIcon || '☕', cupX - 1, cupY + 2);
        } else {
          // Salon de thé ou autre
          ctx.strokeStyle = st.coat;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(-5, -14);
          ctx.lineTo(cupX, cupY);
          ctx.moveTo(5, -14);
          ctx.lineTo(7, -5);
          ctx.stroke();
          ctx.font = '9.5px serif';
          ctx.textAlign = 'center';
          ctx.fillText(c.orderIcon || '☕', cupX - 1, cupY + 2);
        }
      } else if (c.state === 'doing_activity' && c.activityType === 'eating') {
        const bite = Math.max(0, Math.sin(c.activityTimer * 4.2 + seed));
        const foodY = -8 - bite * 10;
        ctx.strokeStyle = st.coat;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-5, -14);
        ctx.lineTo(-7, foodY);
        ctx.moveTo(5, -14);
        ctx.lineTo(7, -5);
        ctx.stroke();
        ctx.font = '9.5px serif';
        ctx.textAlign = 'center';
        ctx.fillText(c.orderIcon || '🥪', -8, foodY + 2);
      } else if (c.state === 'doing_activity' && c.activityType === 'ordering_desk') {
        ctx.strokeStyle = st.coat;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-5, -14);
        ctx.lineTo(-9, -10);
        ctx.moveTo(5, -14);
        ctx.lineTo(7, -5);
        ctx.stroke();
        ctx.font = '8.5px serif';
        ctx.textAlign = 'center';
        ctx.fillText('📄', -10, -8);
      } else {
        ctx.strokeStyle = st.coat;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-5, -14);
        ctx.lineTo(-8, -4);
        ctx.moveTo(5, -14);
        ctx.lineTo(8, -4);
        ctx.stroke();
      }

      // Accessoire tenu à la sortie :
      // - Agences (Croisières / Voyages) : partent avec des papiers / contrats 📄
      // - Boutiques / Alimentation / Usines : cabas
      if (c.state === 'walking_out' && !c.hasCart) {
        if (c.ticketIcon) {
          ctx.save();
          ctx.font = '10.5px serif';
          ctx.textAlign = 'center';
          ctx.fillText(c.ticketIcon, -10, -4);
          ctx.restore();
        } else if (c.hasBag) {
          ctx.save();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(-8, -4, 3, Math.PI, 0);
          ctx.stroke();
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.roundRect(-12, -4, 8, 9, 1.5);
          ctx.fill();
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 0.8;
          ctx.stroke();
          if (c.orderIcon) {
            ctx.font = '8.5px serif';
            ctx.textAlign = 'center';
            ctx.fillText(c.orderIcon, -8, -4);
          }
          ctx.restore();
        }
      }

      // Tête & Visage
      ctx.fillStyle = st.skin;
      ctx.beginPath();
      ctx.arc(0, -24, 6.5, 0, Math.PI * 2);
      ctx.fill();

      if (st.hat === 'chechia') {
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(0, -26.5, 6.5, Math.PI, 0);
        ctx.fill();
        ctx.strokeStyle = '#090d16';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-2, -28.5);
        ctx.lineTo(-4.5, -25);
        ctx.stroke();
      } else if (st.hat === 'hijab') {
        ctx.fillStyle = st.coat;
        ctx.beginPath();
        ctx.arc(0, -24.5, 7.5, Math.PI * 0.7, Math.PI * 2.15);
        ctx.fill();
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, -26.5, 6.5, Math.PI * 0.8, Math.PI * 2.1);
        ctx.fill();
      }

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-2.5, -25, 1.5, 1.5);
      ctx.fillRect(1.5, -25, 1.5, 1.5);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, -22, 2.5, 0.2, Math.PI - 0.2);
      ctx.stroke();

      ctx.restore();

      // Zéro icône/bulle sur la tête des clients : animation naturelle et réaliste
      if (c.state === 'paying') {
        const payRatio = Math.min(1, c.payTimer / Math.max(0.1, c.payDuration));
        this.drawRadialGauge(ctx, c.x + 12, baseFootY - 36 - bounce, 5, payRatio, '#10b981', '✓');
      }

      ctx.restore();
    }
  }

  // --- MOBILIER & TABLES AU PREMIER PLAN (DEVANT LES CLIENTS ASSIS) ---
  getArchetype(bizId = this.bizId) {
    return this.getBizArchetype(bizId);
  }

  drawForegroundFurniture(ctx, bizId, now) {
    const archetype = this.getBizArchetype(bizId);
    if (archetype !== 'tea_lounge') return;

    const isResto = bizId === 'restaurant';
    ctx.save();

    for (let tIdx = 0; tIdx < 5; tIdx++) {
      const tx = this.getActivitySlotX('tea_lounge', tIdx) + 12;
      const ty = 145;

      if (isResto) {
        // Table gastronomique pour 2 personnes (42px de large)
        // Double pied en fer forgé travaillé
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(tx - 12, ty, 3, 9);
        ctx.fillRect(tx + 9, ty, 3, 9);
        ctx.beginPath();
        ctx.ellipse(tx - 10.5, ty + 9, 5, 2, 0, 0, Math.PI * 2);
        ctx.ellipse(tx + 10.5, ty + 9, 5, 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Nappe ivoire/blanche raffinée avec liseré or
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(tx - 21, ty - 3, 42, 8, [2, 2, 4, 4]);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // 2 Couverts complets pour 2 personnes (gauche et droite)
        // Assiette gauche
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.ellipse(tx - 12, ty, 5.5, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        // Couverts gauche & verre
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(tx - 19, ty - 1, 1, 4);
        ctx.fillRect(tx - 5, ty - 1, 1, 4);
        ctx.font = '7.5px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🍷', tx - 12, ty - 4);

        // Assiette droite
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.ellipse(tx + 12, ty, 5.5, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        // Couverts droite & verre
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(tx + 5, ty - 1, 1, 4);
        ctx.fillRect(tx + 18, ty - 1, 1, 4);
        ctx.font = '7.5px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🍷', tx + 12, ty - 4);

        // Centre de table : Bougie d'ambiance ou fleur
        ctx.font = '8px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🕯️', tx, ty - 2);

        // Client assis à cette table
        const seatedCust = this.customers.find(c => c.stationSlot === tIdx && (c.state === 'waiting_service' || c.state === 'doing_activity'));
        if (seatedCust) {
          const dishes = ['🍲', '🥘', '🍛', '🍗', '🐟'];
          const dish = seatedCust.orderIcon || dishes[tIdx % dishes.length];
          // Les deux assiettes sont garnies pour les 2 convives !
          ctx.font = '9.5px serif';
          ctx.fillText(dish, tx - 12, ty - 1);
          ctx.fillText(dish, tx + 12, ty - 1);

          // Vapeur chaude sur les deux plats
          const steamLift = ((now * 0.015 + tIdx * 4) % 14);
          const steamAlpha = Math.max(0, 0.45 - steamLift / 16);
          ctx.fillStyle = `rgba(255, 255, 255, ${steamAlpha})`;
          [-12, 12].forEach(dx => {
            ctx.beginPath();
            ctx.arc(tx + dx + Math.sin(steamLift * 0.5) * 2, ty - 4 - steamLift, 1.4 + steamLift * 0.1, 0, Math.PI * 2);
            ctx.fill();
          });

          // Second convive attablé en face (duo complice)
          ctx.save();
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.roundRect(tx + 7, ty - 16, 12, 15, 3);
          ctx.fill();
          ctx.fillStyle = '#fde68a';
          ctx.beginPath();
          ctx.arc(tx + 13, ty - 19, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      } else {
        // Salon de thé : table ronde en marbre blanc veiné avec cerclage doré brillant
        // Pied central de table en laiton doré poli ou bois noble
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(tx - 1.5, ty, 3, 9);
        ctx.beginPath();
        ctx.ellipse(tx, ty + 9, 6, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.ellipse(tx, ty, 13, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Reflet poli sur marbre
        ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
        ctx.beginPath();
        ctx.ellipse(tx - 2, ty - 1, 8, 2.5, -0.2, 0, Math.PI * 2);
        ctx.fill();

        const seatedCust = this.customers.find(c => c.stationSlot === tIdx && (c.state === 'waiting_service' || c.state === 'doing_activity'));
        if (seatedCust) {
          const drinks = ['🍵', '☕', '🍹', '🧃', '🍰'];
          const item = seatedCust.orderIcon || drinks[tIdx % drinks.length];
          ctx.font = '10px serif';
          ctx.fillText(item, tx - 2, ty - 2);
        } else {
          ctx.font = '8px serif';
          ctx.fillText('🌸', tx, ty - 2);
        }

        // --- CHICHA TUNISIENNE MAJESTUEUSE (`شيشة معسّل`) ---
        if (seatedCust && seatedCust.hasChicha) {
          const shX = tx + 13;
          const shY = ty + 7;

          // Ombre de la chicha au sol
          ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
          ctx.beginPath();
          ctx.ellipse(shX, shY + 3, 5, 1.8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Vase tulipe en verre bleuté / ambre soufflé avec liseré doré
          ctx.fillStyle = (tIdx % 2 === 0) ? '#0284c7' : '#ea580c';
          ctx.beginPath();
          ctx.ellipse(shX, shY - 1, 4.5, 4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Reflet d'eau dans le vase
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.beginPath();
          ctx.arc(shX - 1.5, shY - 2, 1, 0, Math.PI * 2);
          ctx.fill();

          // Tige en laiton doré ciselé
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(shX - 1, shY - 17, 2, 14);
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 0.6;
          ctx.strokeRect(shX - 1, shY - 17, 2, 14);

          // Plateau pare-cendres circulaire en laiton
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.ellipse(shX, shY - 14, 4.5, 1.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Foyer en terre cuite
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.roundRect(shX - 2.5, shY - 19, 5, 3.5, 1);
          ctx.fill();

          // Feuille alu + Braise de charbon ardent incandescent
          const glow = 0.65 + Math.sin(now * 0.007 + tIdx) * 0.35;
          ctx.fillStyle = `rgba(239, 68, 68, ${glow})`;
          ctx.beginPath();
          ctx.arc(shX, shY - 19.5, 1.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(shX - 0.7, shY - 20, 1.4, 1);

          // Tuyau souple (marrach) brodé reliant la chicha à la main du client
          ctx.strokeStyle = (tIdx % 2 === 0) ? '#dc2626' : '#1e3a8a';
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(shX - 2, shY - 7);
          ctx.bezierCurveTo(shX - 7, shY + 2, tx + 7, ty + 2, tx + 3, ty - 6);
          ctx.stroke();

          // Embout en bois précieux dans la main
          ctx.fillStyle = '#78350f';
          ctx.fillRect(tx + 2, ty - 8, 2.2, 3);

          // Volutes de fumée de chicha blanche vaporeuse expirées vers le haut
          const chichaPuff = ((now * 0.012 + tIdx * 3.5) % 24);
          const pAlpha = Math.max(0, 0.5 - chichaPuff / 26);
          if (pAlpha > 0.05) {
            ctx.fillStyle = `rgba(241, 245, 249, ${pAlpha})`;
            ctx.beginPath();
            ctx.arc(tx + 2 + Math.sin(chichaPuff * 0.4) * 3, ty - 22 - chichaPuff * 0.8, 2.2 + chichaPuff * 0.18, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    ctx.restore();
  }

  // --- PARTICULES, ONDES DE TAP & GAIN FLOTTANT COMPACT ---
  drawParticles(ctx) {
    for (const r of this.tapRipples) {
      ctx.save();
      const alpha = Math.max(0, r.life / r.maxLife);
      ctx.strokeStyle = `rgba(251, 191, 36, ${alpha * 0.85})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (const m of this.moneyPuffs) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, m.life / m.maxLife);
      ctx.font = 'bold 9.5px "Cairo", sans-serif';
      const tw = ctx.measureText(m.text).width + 10;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.beginPath();
      ctx.roundRect(m.x - tw / 2, m.y - 10, tw, 15, 6);
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#34d399';
      ctx.textAlign = 'center';
      ctx.fillText(m.text, m.x, m.y + 0.5);
      ctx.restore();
    }
  }

  // --- AMBIANCE CRÉATIVE ÉPURÉE (ZÉRO ENSEIGNE GÉANTE EN HAUT DU CANVAS) ---
  drawAmbience(ctx, now, isProducing) {
    const w = this.width;
    const h = this.height;
    const t = now / 1000;

    const count = Math.max(3, Math.floor(w / 130));
    for (let i = 0; i < count; i++) {
      const lx = (w / count) * (i + 0.5);
      const swing = Math.sin(t * 1.3 + i * 1.7) * 0.12;
      const len = 22 + (i % 2) * 10;
      ctx.save();
      ctx.translate(lx, 18);
      ctx.rotate(swing);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, len);
      ctx.stroke();

      const beamAlpha = isProducing ? (0.12 + 0.04 * Math.sin(t * 4 + i)) : 0.06;
      const beamGrad = ctx.createLinearGradient(0, len + 10, 0, len + 115);
      beamGrad.addColorStop(0, `rgba(253, 224, 71, ${beamAlpha})`);
      beamGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(-6, len + 10);
      ctx.lineTo(-34, len + 115);
      ctx.lineTo(34, len + 115);
      ctx.lineTo(6, len + 10);
      ctx.closePath();
      ctx.fill();

      const glow = ctx.createRadialGradient(0, len + 6, 1, 0, len + 6, isProducing ? 32 : 22);
      glow.addColorStop(0, 'rgba(253, 186, 116, 0.65)');
      glow.addColorStop(1, 'rgba(253, 186, 116, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(-32, len - 26, 64, 64);
      ctx.fillStyle = i % 2 ? '#dc2626' : '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(-5, len, 10, 13, 3);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.5)';
    for (let i = 0; i < 14; i++) {
      const px = (i * 97 + t * (6 + (i % 4) * 2)) % w;
      const py = 24 + ((i * 53 + Math.sin(t + i) * 8) % (h - 90));
      ctx.globalAlpha = 0.25 + 0.25 * Math.sin(t * 2 + i);
      ctx.beginPath();
      ctx.arc(px, Math.abs(py), 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawVignette(ctx) {
    const w = this.width;
    const h = this.height;
    const g = ctx.createRadialGradient(w / 2, h / 2, h * 0.55, w / 2, h / 2, Math.max(w, h) * 0.75);
    g.addColorStop(0, 'rgba(0, 0, 0, 0)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  // --- BOUCLE D'ANIMATION 60 FPS SYNCHRONISÉE AVEC LE MOTEUR TYCOON ---
  step(now) {
    if (!this.lastTime) this.lastTime = now;
    const dt = Math.max(0.001, Math.min((now - this.lastTime) / 1000, 0.1));
    this.lastTime = now;

    const biz = this.getBiz();
    const detailKey = biz ? `${biz.id}_${biz.level}_${biz.hiredManagersCount || 0}_${biz.hasManager ? 1 : 0}` : '';
    if (!this.cachedDetail || this.cachedDetailKey !== detailKey) {
      this.cachedDetail = (this.engine && this.engine.getBusinessDetail) ? this.engine.getBusinessDetail(this.bizId) : null;
      if (!this.cachedDetail && (this.bizId === 'tobacco_kiosk' || this.bizId === 'bank_branch')) {
        this.cachedDetail = { id: this.bizId, staffSlots: [{ name: 'عون الشباك', role: 'عون قار', hired: true }] };
      }
      this.cachedDetailKey = detailKey;
    }
    const detail = this.cachedDetail;
    const isProducing = Boolean(biz && biz.level > 0 && (biz.isProducing || biz.hasManager || biz.progressMs > 0));
    const archetype = this.getBizArchetype(this.bizId);

    // Animation de fermeture souple de la porte battante
    if (this.doorSwing > 0) {
      this.doorSwing = Math.max(0, this.doorSwing - dt * 2.2);
    }

    // 0. Animation continue des clients à la Banque (`bank_branch`)
    if (archetype === 'bank_branch') {
      if (!this.bankVipClient) {
        this.bankVipClient = { x: this.width - 26, y: 154, targetX: 148, state: 'entering', walkCycle: 0, timer: 0 };
      }
      const vc = this.bankVipClient;
      vc.walkCycle += dt;
      if (vc.state === 'entering') {
        vc.x = Math.max(vc.targetX, vc.x - 72 * dt);
        if (vc.x <= vc.targetX + 0.5) {
          vc.x = vc.targetX;
          vc.state = 'at_window';
          vc.timer = 0;
          this.pushMoneyPuff({
            x: vc.x - 10,
            y: vc.y - 54,
            vy: -22,
            text: '🏦 مرحباً بك في الشباك ✓',
            life: 1.4,
            maxLife: 1.4
          });
        }
      } else if (vc.state === 'at_window') {
        vc.timer += dt;
        if (vc.timer > 2.0) {
          vc.state = 'leaving';
          this.pushMoneyPuff({
            x: vc.x - 8,
            y: vc.y - 48,
            vy: -20,
            text: '✓ سحب وقبض ناجح 💼',
            life: 1.2,
            maxLife: 1.2
          });
        }
      } else if (vc.state === 'leaving') {
        vc.x += 68 * dt;
        if (vc.x > this.width + 16) {
          this.doorSwing = 1.0;
          vc.x = this.width - 26;
          vc.state = 'entering';
          vc.timer = 0;
        }
      }
    }

    // Détection de complétion d'un cycle réel de production dans engine.js
    const curProgress = biz ? (biz.progressMs || 0) : 0;
    const cycleWrapped = isProducing && curProgress < this.lastProgressMs;
    this.lastProgressMs = curProgress;
    if (cycleWrapped && archetype !== 'bank_branch') {
      const payingCust = this.customers.find(c => c.state === 'paying');
      this.triggerPayment(payingCust || null, true);
    }

    // 1. Flux de production physique sur le tapis roulant (UNIQUEMENT pour les usines `industrial_belt`)
    if (archetype === 'industrial_belt') {
      if (isProducing) {
        this.conveyorTimer += dt;
        if (this.conveyorTimer >= 0.95 && this.conveyorItems.length < 6) {
          this.conveyorTimer = 0;
          const hiredCount = biz ? Math.max(1, biz.hiredManagersCount || 1) : 1;
          const sourceIdx = Math.floor(Math.random() * Math.min(3, hiredCount));
          const spawnX = Math.min(this.width - 52, 134 + sourceIdx * 64);
          this.conveyorItems.push({
            x: spawnX,
            y: 135,
            targetX: 92,
            icon: this.getOrderIcon(),
            speed: 58 + Math.min(35, (biz.level || 1) * 0.4)
          });
        }
      }
      for (let i = this.conveyorItems.length - 1; i >= 0; i--) {
        const item = this.conveyorItems[i];
        item.x -= item.speed * dt;
        if (item.x <= item.targetX) {
          this.counterStock = Math.min(4, (this.counterStock || 0) + 1);
          this.conveyorItems.splice(i, 1);
        }
      }
    } else if (this.conveyorItems.length > 0) {
      this.conveyorItems.length = 0;
    }

    // 2. Spawner de clients
    if (archetype !== 'bank_branch') {
      const maxActive = (archetype === 'kahwa_counter' || archetype === 'tea_lounge' || archetype === 'thalasso_spa') ? 5 : (archetype === 'supermarket_checkout' || archetype === 'tobacco_kiosk' ? 3 : 4);
      const maxTotal = maxActive + 2;
      this.spawnTimer += dt;
      const spawnThreshold = isProducing ? (archetype === 'kahwa_counter' || archetype === 'tea_lounge' || archetype === 'tobacco_kiosk' ? 1.15 : 1.45) : 1.95;
      const activeInStore = this.customers.filter(c => c.state !== 'walking_out').length;
      if (this.spawnTimer > spawnThreshold && activeInStore < maxActive && this.customers.length < maxTotal) {
        this.spawnCustomer();
        this.spawnTimer = 0;
      }
    }

    // 2.b Animation du Serveur (`سرباي`) qui amène les boissons ou plats aux clients (Café, Salon de thé & Restaurant)
    if ((archetype === 'kahwa_counter' || archetype === 'tea_lounge') && this.waiter) {
      const waitingCust = this.customers.find(c => c.state === 'waiting_service');
      if (waitingCust) {
        this.waiter.targetX = waitingCust.x + 6;
        this.waiter.carryingIcon = waitingCust.orderIcon || (this.bizId === 'restaurant' ? '🍲' : (archetype === 'tea_lounge' ? '🍹' : '☕'));
        const wSpeed = 96;
        if (Math.abs(this.waiter.x - this.waiter.targetX) > 2) {
          this.waiter.x += Math.sign(this.waiter.targetX - this.waiter.x) * wSpeed * dt;
        } else {
          this.waiter.x = this.waiter.targetX;
          waitingCust.servedByWaiter = true;
          waitingCust.state = 'doing_activity';
          waitingCust.activityTimer = 0;
        }
      } else {
        // Retour vers la machine espresso / kanoun
        const homeX = 122;
        if (Math.abs(this.waiter.x - homeX) > 2) {
          this.waiter.x += Math.sign(homeX - this.waiter.x) * 58 * dt;
        }
      }
    }

    // 2.c Animation de l'Assistant Poissonnier (`fruits_de_mer`) qui bouge entre les caisses et donne les commandes
    if (this.bizId === 'fruits_de_mer') {
      if (!this.fishmonger) {
        this.fishmonger = {
          x: 140,
          y: 138,
          targetX: 168,
          crateIdx: 0,
          state: 'moving_to_crate',
          timer: 1.2,
          heldItem: '🐟',
          walkCycle: 0
        };
      }
      const fm = this.fishmonger;
      const crateXPositions = [148, 184, 220, 256];
      const crateFish = ['🐟', '🦐', '🦑', '🦀'];

      if (fm.state === 'moving_to_crate') {
        const target = crateXPositions[fm.crateIdx % crateXPositions.length];
        const dist = target - fm.x;
        if (Math.abs(dist) > 2) {
          fm.walkCycle += dt * 8;
          fm.x += Math.sign(dist) * 65 * dt;
        } else {
          fm.x = target;
          fm.state = 'picking';
          fm.timer = 1.0;
        }
      } else if (fm.state === 'picking') {
        fm.timer -= dt;
        if (fm.timer <= 0) {
          fm.heldItem = crateFish[fm.crateIdx % crateFish.length];
          fm.state = 'moving_to_counter';
        }
      } else if (fm.state === 'moving_to_counter') {
        const counterTarget = 106;
        const dist = counterTarget - fm.x;
        if (Math.abs(dist) > 2) {
          fm.walkCycle += dt * 8;
          fm.x += Math.sign(dist) * 72 * dt;
        } else {
          fm.x = counterTarget;
          fm.state = 'giving_order';
          fm.timer = 1.3;
        }
      } else if (fm.state === 'giving_order') {
        fm.timer -= dt;
        if (fm.timer <= 0) {
          fm.crateIdx = (fm.crateIdx + 1) % crateXPositions.length;
          fm.state = 'moving_to_crate';
        }
      }
    }

    // 3. File d'attente à la caisse (pour les commerces avec caisse à gauche)
    const directPayAtStation = ['agency_desks', 'supermarket_checkout', 'tobacco_kiosk'].includes(archetype);
    if (!directPayAtStation) {
      const cashierQueue = this.customers
        .filter(c => c.state === 'queued' || c.state === 'paying')
        .sort((a, b) => a.x - b.x);
      cashierQueue.forEach((c, qIdx) => {
        c.targetX = 88 + qIdx * 20;
        c.queueIndex = qIdx;
      });
    }

    for (let i = this.customers.length - 1; i >= 0; i--) {
      const c = this.customers[i];
      c.walkCycle += dt;

      if (c.state === 'walking_in') {
        const speed = isProducing ? 82 : 68;
        if (c.x > c.stationX + 1) {
          c.x = Math.max(c.stationX, c.x - speed * dt);
        } else {
          c.x = c.stationX;
          if (c.needsWaiterService && !c.servedByWaiter) {
            c.state = 'waiting_service';
            c.waitServiceTimer = 0;
          } else {
            c.state = 'doing_activity';
            c.activityTimer = 0;
          }
        }
      } else if (c.state === 'waiting_service') {
        c.waitServiceTimer = (c.waitServiceTimer || 0) + dt;
        if (c.waitServiceTimer > 1.2) {
          c.servedByWaiter = true;
          c.state = 'doing_activity';
          c.activityTimer = 0;
        }
      } else if (c.state === 'doing_activity') {
        c.activityTimer += dt;
        if (c.activityType === 'drinking') {
          c.steamTimer = (c.steamTimer || 0) + dt;
          if (c.steamTimer >= 0.75) {
            c.steamTimer = 0;
            this.pushParticle({
              x: c.x + 6,
              y: c.y - 24,
              vx: Math.random() * 4 - 2,
              vy: -16 - Math.random() * 8,
              color: 'rgba(255, 255, 255, 0.45)',
              radius: 1.8,
              life: 0.65,
              maxLife: 0.65,
              isSparkle: false
            });
          }
        }
        if (c.activityTimer >= c.activityDuration) {
          if (directPayAtStation) {
            c.state = 'paying';
            c.payTimer = 0;
          } else {
            c.state = 'queued';
          }
        }
      } else if (c.state === 'queued') {
        const speed = isProducing ? 66 : 50;
        if (c.x > c.targetX + 1.5) {
          c.x = Math.max(c.targetX, c.x - speed * dt);
        } else if (c.x < c.targetX - 1.5) {
          c.x = Math.min(c.targetX, c.x + speed * dt);
        } else {
          c.x = c.targetX;
          if (c.queueIndex === 0) {
            c.state = 'paying';
          }
        }
      } else if (c.state === 'paying') {
        // Chaque projet ouvert dispose d'au moins 1 travailleur actif dès le départ : encaissement fluide garanti !
        c.payTimer += dt;
        if (c.payTimer >= c.payDuration) {
          this.triggerPayment(c, isProducing);
          c.hasBag = (archetype === 'retail_shop' || archetype === 'food_counter' || archetype === 'industrial_belt');
          c.state = 'walking_out';
          c.reaction = this.happyReactions[Math.floor(Math.random() * this.happyReactions.length)];
        }
      } else if (c.state === 'walking_out') {
        c.x += 76 * dt;
        if (Math.abs(c.x - (this.width - 28)) < 8) {
          this.doorSwing = 1.0;
        }
        if (c.x > this.width + 16) {
          this.customers.splice(i, 1);
          continue;
        }
      }
    }

    // 4. Particules d'ambiance et vapeur active
    if (biz && biz.level > 0 && Math.random() < 0.35 && this.particles.length < 32) {
      const sourceX = 110 + Math.random() * (this.width - 150);
      const isHotFood = ['kaskrout', 'fricasse', 'kahwa', 'salon_de_the', 'restaurant', 'patisserie'].includes(this.bizId);
      this.pushParticle({
        x: sourceX,
        y: 128,
        vx: Math.random() * 8 - 4,
        vy: -22 - Math.random() * 20,
        color: isHotFood ? 'rgba(255, 255, 255, 0.42)' : 'rgba(251, 191, 36, 0.45)',
        radius: isHotFood ? (2 + Math.random() * 2.5) : (1.5 + Math.random() * 1.5),
        life: 0.9,
        maxLife: 0.9,
        isSparkle: !isHotFood
      });
    }

    // Mise à jour ondes de tap
    for (let i = this.tapRipples.length - 1; i >= 0; i--) {
      const r = this.tapRipples[i];
      r.life -= dt;
      r.r += (r.maxR - r.r) * Math.min(1, dt * 12);
      if (r.life <= 0) this.tapRipples.splice(i, 1);
    }

    // Mise à jour particules
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (!p.isSparkle) p.radius += dt * 3;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    // Mise à jour puffs monnaie
    for (let i = this.moneyPuffs.length - 1; i >= 0; i--) {
      const m = this.moneyPuffs[i];
      m.life -= dt;
      m.y += m.vy * dt;
      if (m.life <= 0) this.moneyPuffs.splice(i, 1);
    }

    // 5. Dessin complet de la frame Canvas
    this.clickZones = [];
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.drawBackdrop(this.ctx, this.bizId, now);
    this.drawAmbience(this.ctx, now, isProducing);

    if (detail) {
      this.drawCashierCounter(this.ctx, detail, isProducing, now);
      this.drawWorkstations(this.ctx, detail, isProducing, now);
    }

    this.drawCustomers(this.ctx);
    this.drawForegroundFurniture(this.ctx, this.bizId, now);
    this.drawParticles(this.ctx);
    this.drawVignette(this.ctx);
  }
}


export class QuartierAnimator {
  constructor(canvasEl, engineRef) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.engine = engineRef;

    this.animId = null;
    this.lastTime = 0;
    this.dpr = window.devicePixelRatio || 1;
    this.width = 800;
    this.height = 360;

    // Scrolling caméra horizontal panoramique
    this.cameraX = 0;
    this.targetCameraX = 0;
    this.worldWidth = 3850;

    // Transitions cinématiques de quartier
    this.currentZoneId = 'bab_souika';
    this.transitionAlpha = 0;
    this.transitionBannerText = '';
    this.transitionTimer = 0;

    // Callbacks
    this.onInspectBiz = null;
    this.onUpgradeBiz = null;
    this.onCollectBiz = null;
    this.onHudAction = null;
    this.onSwitchZone = null;

    // Alertes & Offres actives passées par le HUD principal pour rendu 100% dans le Canvas
    this.hudOffers = {
      adBoostText: 'طافي',
      adBoostActive: false,
      adCashText: '+30',
      prestigeText: 'x1.0',
      canPrestige: false,
      wheelReady: false,
      hasQuest: false,
      questTitle: '',
      hasEvent: false,
      eventTitle: '',
      eventTimer: '',
      hasDilemma: false,
      dilemmaTitle: '',
      hasLuckyDrop: false,
      luckyDropIcon: '🎁'
    };

    // Entities
    this.pedestrians = [];
    this.taxis = [];
    this.cats = [];
    this.clouds = [];
    this.floatingCoins = [];
    this.smokePuffs = [];
    this.palms = [];
    this.seagulls = [];
    this.interactiveHitboxes = [];

    // Cycle Ciel Atmosphérique 240s
    this.skyCycleDuration = 240;

    // سحابة البركة والذهب (Golden Fortune Cloud)
    this.goldenCloud = {
      x: -160,
      y: 42,
      speed: 26,
      width: 105,
      height: 48,
      claimed: false
    };

    // موكب الفرقة الشعبية والمهرجان التونسي (Tabbal, Mezoued, Derbouka & Folk Dancer)
    this.folkTroupe = {
      x: -320,
      speed: 28,
      dir: 1,
      active: true,
      troupers: [
        { role: 'tabbal', name: 'الطبّال', instrument: '🥁', hat: '#dc2626', robe: '#fef08a' },
        { role: 'mezoued', name: 'المزوادي', instrument: '🎺', hat: '#b91c1c', robe: '#ffffff' },
        { role: 'derbouka', name: 'الدربوكة', instrument: '🪘', hat: '#dc2626', robe: '#38bdf8' },
        { role: 'danseur', name: 'رقّاص', instrument: '🕺', hat: '#991b1b', robe: '#34d399' }
      ]
    };

    // Météo dynamique de quartier (Pluie, Parapluies, Course & Flaques d'eau)
    this.isRaining = false;
    this.rainTimer = 22; // cycle météo en secondes
    this.rainIntensity = 0; // 0 = soleil, 1 = averse
    this.puddles = [190, 480, 840, 1260, 1690, 2180, 2680, 3200]; // Coordonnées monde des flaques sur l'asphalte
    this.splashes = []; // Jaillissements d'eau soulevés par les roues des véhicules
    this.rainDrops = [];
    for (let r = 0; r < 90; r++) {
      this.rainDrops.push({
        x: Math.random() * 850,
        y: Math.random() * 380,
        speed: 420 + Math.random() * 260,
        len: 12 + Math.random() * 12
      });
    }

    this.bizTemplates = {
      kaskrout: { id: 'kaskrout', width: 140, height: 75, style: 'sandwich_stall', color: '#f59e0b', roofColor: '#dc2626' },
      fricasse: { id: 'fricasse', width: 155, height: 122, style: 'fricasse_stand', color: '#f97316', roofColor: '#b45309' },
      kahwa: { id: 'kahwa', width: 170, height: 132, style: 'cafe_terrasse', color: '#eab308', roofColor: '#1e3a8a' },
      attariya: { id: 'attariya', width: 155, height: 128, style: 'attariya_shop', color: '#10b981', roofColor: '#047857' },
      fruits_de_mer: {
        id: 'fruits_de_mer',
        width: 170,
        height: 150,
        style: 'fish_market',
        color: '#f0fdfa',
        roof: 'dome',
        wallColor: '#f0fdfa',
        roofColor: '#0284c7',
        doorColor: '#0f766e',
        canopy: ['#0284c7', '#38bdf8', '#0f766e'],
        decor: 'fish',
        signColor: '#0284c7',
        signText: 'مارشي الحوت وفواكه البحر 🦐'
      },
        patisserie: { id: 'patisserie', width: 165, height: 138, style: 'patisserie_dorée', color: '#fbbf24', roofColor: '#d97706' },
      produits_laitiers: { id: 'produits_laitiers', width: 160, height: 132, style: 'fromagerie_beja', color: '#fef08a', roofColor: '#16a34a' },
      boucherie: { id: 'boucherie', width: 165, height: 136, style: 'boucherie_viande', color: '#fca5a5', roofColor: '#991b1b' },
      librairie: { id: 'librairie', width: 165, height: 138, style: 'librairie_livres', color: '#bae6fd', roofColor: '#0369a1' },
      vente_vetements: { id: 'vente_vetements', width: 175, height: 144, style: 'boutique_vetements', color: '#fbcfe8', roofColor: '#be185d' },
      vente_montres: { id: 'vente_montres', width: 170, height: 142, style: 'horlogerie_suisse', color: '#fef08a', roofColor: '#ca8a04' },
      croisiere_mer: { id: 'croisiere_mer', width: 195, height: 160, style: 'croisiere_port', color: '#e0f2fe', roofColor: '#0284c7' },
      salle_de_jeux: { id: 'salle_de_jeux', width: 175, height: 142, style: 'gaming_room', color: '#c7d2fe', roofColor: '#4338ca' },
      emballage_dattes: { id: 'emballage_dattes', width: 190, height: 154, style: 'dattes_factory', color: '#fed7aa', roofColor: '#c2410c' },
      taxi_collectif: { id: 'taxi_collectif', width: 185, height: 120, style: 'taxi_station', color: '#facc15', roofColor: '#1f2937' },
      superette: { id: 'superette', width: 170, height: 138, style: 'superette_modern', color: '#06b6d4', roofColor: '#0e7490' },
      supermarche: { id: 'supermarche', width: 190, height: 152, style: 'supermarket_mall', color: '#3b82f6', roofColor: '#1d4ed8' },
      salon_de_the: { id: 'salon_de_the', width: 175, height: 146, style: 'lounge_tea', color: '#ec4899', roofColor: '#831843' },
      restaurant: { id: 'restaurant', width: 180, height: 155, style: 'restaurant_chami', color: '#ef4444', roofColor: '#991b1b' },
      agence_voyages: { id: 'agence_voyages', width: 170, height: 142, style: 'travel_agency', color: '#38bdf8', roofColor: '#0284c7' },
      hotel: { id: 'hotel', width: 205, height: 182, style: 'luxury_hotel', color: '#a855f7', roofColor: '#6b21a8' },
      centre_commercial: { id: 'centre_commercial', width: 215, height: 188, style: 'grand_mall', color: '#6366f1', roofColor: '#4338ca' },
      usine_conserves: { id: 'usine_conserves', width: 190, height: 155, style: 'harissa_factory', color: '#f43f5e', roofColor: '#be123c' },
      showroom_auto: { id: 'showroom_auto', width: 200, height: 162, style: 'auto_palace', color: '#e2e8f0', roofColor: '#334155' },
      promoteur_immobilier: { id: 'promoteur_immobilier', width: 210, height: 198, style: 'real_estate_tower', color: '#38bdf8', roofColor: '#0369a1' },
      tayaran_el_ghzela: { id: 'tayaran_el_ghzela', width: 230, height: 205, style: 'airline_headquarters', color: '#f1f5f9', roofColor: '#e11d48' },
      boulangerie_artisanale: { id: 'boulangerie_artisanale', width: 175, height: 140, style: 'boulangerie_oven', color: '#fef3c7', roofColor: '#b45309' },
      artisanat_poterie: { id: 'artisanat_poterie', width: 170, height: 138, style: 'pottery_workshop', color: '#fed7aa', roofColor: '#0284c7' },
      huilerie_olive: { id: 'huilerie_olive', width: 195, height: 156, style: 'olive_press', color: '#ecfccb', roofColor: '#3f6212' },
      centre_thalasso: { id: 'centre_thalasso', width: 220, height: 188, style: 'thalasso_spa', color: '#e0f2fe', roofColor: '#0891b2' }
    };

    this.buildingsConfig = [];
    this.streetLayout = [];
    this.buildZoneLayout(this.currentZoneId);
    this.initWorld();

    this.isDragging = false;
    this.startX = 0;
    this.startCamX = 0;
    this.hasDraggedSignificantly = false;

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handleWheel = this.handleWheel.bind(this);

    this.bindEvents();
    this.resize();
  }

  setCallbacks({ onInspect, onUpgrade, onCollect, onHudAction, onSwitchZone, onOpenMap, onOpenBank, onOpenPolice, onOpenTobacco }) {
    if (onOpenMap) this.onOpenMap = onOpenMap;
    if (onInspect) this.onInspectBiz = onInspect;
    if (onUpgrade) this.onUpgradeBiz = onUpgrade;
    if (onCollect) this.onCollectBiz = onCollect;
    if (onHudAction) this.onHudAction = onHudAction;
    if (onSwitchZone) this.onSwitchZone = onSwitchZone;
    if (onOpenBank) this.onOpenBank = onOpenBank;
    if (onOpenPolice) this.onOpenPolice = onOpenPolice;
    if (onOpenTobacco) this.onOpenTobacco = onOpenTobacco;
  }

  buildZoneLayout(zoneId) {
    const zoneSpecs = {
      bab_souika: [
        { type: 'house', style: 'medina', name: 'دار بن عاشور', width: 115, height: 118, wallColor: '#fef3c7', doorColor: '#2563eb' },
        { type: 'biz', id: 'kaskrout' },
        { type: 'monument_square', name: 'ساحة الساعة والنافورة والحديقة', width: 165 },
        { type: 'crossroad', streetName: 'نهج الباشا', width: 120, nextZoneId: 'la_goulette', nextZoneLabel: 'بنزرت' },
        { type: 'biz', id: 'fricasse' },
        { type: 'house', style: 'medina', name: 'دار العربي', width: 120, height: 125, wallColor: '#fffbeb', doorColor: '#eab308' },
        { type: 'biz', id: 'kahwa' },
        { type: 'crossroad', streetName: 'بطحاء باب سويقة', width: 125, nextZoneId: 'la_goulette', nextZoneLabel: 'بنزرت' },
        { type: 'biz', id: 'attariya' },
        { type: 'house', style: 'medina', name: 'دار سيدي محرز', width: 115, height: 120, wallColor: '#f8fafc', doorColor: '#0284c7' }
      ],
      la_goulette: [
        { type: 'house', style: 'goulette', name: 'فيلا سيدي بوسعيد', width: 125, height: 130, wallColor: '#f8fafc', doorColor: '#0284c7' },
        { type: 'biz', id: 'patisserie' },
        { type: 'crossroad', streetName: 'شارع فرحات حشاد', width: 125, nextZoneId: 'lac_2', nextZoneLabel: 'الحمامات' },
        { type: 'biz', id: 'taxi_collectif' },
        { type: 'house', style: 'goulette', name: 'دار الكورنيش', width: 125, height: 126, wallColor: '#f0f9ff', doorColor: '#2563eb' },
        { type: 'biz', id: 'superette' },
        { type: 'crossroad', streetName: 'مفترق الكرم والبحيرة', width: 130, nextZoneId: 'lac_2', nextZoneLabel: 'الحمامات' },
        { type: 'house', style: 'goulette', name: 'دار البحر', width: 120, height: 122, wallColor: '#ffffff', doorColor: '#0369a1' }
      ],
      lac_2: [
        { type: 'house', style: 'lac', name: 'إقامة البحيرة بلازا', width: 130, height: 162, wallColor: '#e2e8f0', doorColor: '#0ea5e9' },
        { type: 'biz', id: 'supermarche' },
        { type: 'crossroad', streetName: 'جادة البحيرة 2', width: 130, nextZoneId: 'hammamet', nextZoneLabel: 'سوسة' },
        { type: 'biz', id: 'salon_de_the' },
        { type: 'house', style: 'lac', name: 'عمارة السفارات', width: 130, height: 168, wallColor: '#cbd5e1', doorColor: '#38bdf8' },
        { type: 'biz', id: 'restaurant' },
        { type: 'crossroad', streetName: 'مفترق لاك سنتر', width: 130, nextZoneId: 'hammamet', nextZoneLabel: 'سوسة' },
        { type: 'biz', id: 'agence_voyages' },
        { type: 'house', style: 'lac', name: 'برج الياسمين', width: 125, height: 158, wallColor: '#f1f5f9', doorColor: '#0284c7' }
      ],
      hammamet: [
        { type: 'house', style: 'hammamet', name: 'فيلا الياسمين', width: 135, height: 138, wallColor: '#fffbeb', doorColor: '#d97706' },
        { type: 'biz', id: 'hotel' },
        { type: 'crossroad', streetName: 'شارع المارينا', width: 135, nextZoneId: 'djerba_holding', nextZoneLabel: 'جربة' },
        { type: 'biz', id: 'centre_commercial' },
        { type: 'house', style: 'hammamet', name: 'رياض قمرت', width: 135, height: 142, wallColor: '#fef3c7', doorColor: '#059669' },
        { type: 'biz', id: 'usine_conserves' },
        { type: 'crossroad', streetName: 'مفترق الحمامات الجنوبية', width: 135, nextZoneId: 'djerba_holding', nextZoneLabel: 'جربة' },
        { type: 'house', style: 'hammamet', name: 'دار الفلّ والياسمين', width: 130, height: 134, wallColor: '#ffffff', doorColor: '#0284c7' }
      ],
      djerba_holding: [
        { type: 'house', style: 'djerba', name: 'حوش جربة الكبير', width: 140, height: 148, wallColor: '#f8fafc', doorColor: '#0284c7' },
        { type: 'biz', id: 'showroom_auto' },
        { type: 'crossroad', streetName: 'ساحة قرطاج الدولية', width: 135, nextZoneId: 'bab_souika', nextZoneLabel: 'تونس' },
        { type: 'biz', id: 'fruits_de_mer' },
        { type: 'biz', id: 'promoteur_immobilier' },
        { type: 'house', style: 'djerba', name: 'قصر الأغالبة', width: 145, height: 155, wallColor: '#fef3c7', doorColor: '#b45309' },
        { type: 'biz', id: 'tayaran_el_ghzela' },
        { type: 'crossroad', streetName: 'مفترق المطار الدولي', width: 135, nextZoneId: 'bab_souika', nextZoneLabel: 'تونس' },
        { type: 'house', style: 'djerba', name: 'فيلا النخيل', width: 135, height: 142, wallColor: '#ffffff', doorColor: '#2563eb' }
      ]
    };

    // Mappings alias villes tunisiennes <-> zones (100% alignés avec CITY_BUSINESS_MAP dans engine.js)
    zoneSpecs.tunis = [
      { type: 'house', style: 'medina', name: 'دار بن عاشور', width: 115, height: 118, wallColor: '#fef3c7', doorColor: '#2563eb' },
      { type: 'biz', id: 'kaskrout' },
      { type: 'biz', id: 'fricasse' },
      { type: 'monument_square', name: 'ساحة الساعة والنافورة والحديقة', width: 165 },
      { type: 'crossroad', streetName: 'نهج الباشا', width: 120, nextZoneId: 'bizerte', nextZoneLabel: 'بنزرت' },
      { type: 'biz', id: 'kahwa' },
      { type: 'biz', id: 'boulangerie_artisanale' },
      { type: 'house', style: 'medina', name: 'دار العربي', width: 120, height: 125, wallColor: '#fffbeb', doorColor: '#eab308' },
      { type: 'biz', id: 'superette' },
      { type: 'crossroad', streetName: 'بطحاء باب سويقة', width: 125, nextZoneId: 'bizerte', nextZoneLabel: 'بنزرت' },
      { type: 'biz', id: 'supermarche' },
      { type: 'biz', id: 'agence_voyages' },
      { type: 'house', style: 'medina', name: 'دار سيدي محرز', width: 115, height: 120, wallColor: '#f8fafc', doorColor: '#0284c7' }
    ];
    zoneSpecs.bab_souika = zoneSpecs.tunis;

    zoneSpecs.sousse = [
      { type: 'house', style: 'goulette', name: 'قصر الرباط السوسي', width: 130, height: 140, wallColor: '#f8fafc', doorColor: '#0284c7' },
      { type: 'biz', id: 'salon_de_the' },
      { type: 'crossroad', streetName: 'كورنيش بوجعفر', width: 130, nextZoneId: 'monastir_mahdia', nextZoneLabel: 'المنستير' },
      { type: 'biz', id: 'hotel' },
      { type: 'biz', id: 'centre_thalasso' },
      { type: 'house', style: 'goulette', name: 'دار القنطاوي', width: 130, height: 135, wallColor: '#fffbeb', doorColor: '#059669' },
      { type: 'biz', id: 'restaurant' },
      { type: 'crossroad', streetName: 'باب بحر سوسة', width: 130, nextZoneId: 'monastir_mahdia', nextZoneLabel: 'المنستير' },
      { type: 'biz', id: 'supermarche' }
    ];

    zoneSpecs.annaba = [
      { type: 'house', style: 'goulette', name: 'قصر بونة العتيق', width: 135, height: 145, wallColor: '#f8fafc', doorColor: '#059669' },
      { type: 'biz', id: 'fruits_de_mer' },
      { type: 'crossroad', streetName: 'كورنيش عنابة', width: 130, nextZoneId: 'tripoli', nextZoneLabel: 'طرابلس' },
      { type: 'biz', id: 'supermarche' },
      { type: 'house', style: 'goulette', name: 'فيلا سرايدي', width: 130, height: 138, wallColor: '#fef3c7', doorColor: '#0284c7' },
      { type: 'biz', id: 'usine_conserves' },
      { type: 'crossroad', streetName: 'ساحة الثورة', width: 130, nextZoneId: 'tripoli', nextZoneLabel: 'طرابلس' },
      { type: 'biz', id: 'agence_voyages' }
    ];

    zoneSpecs.tripoli = [
      { type: 'house', style: 'medina', name: 'السرايا الحمراء', width: 140, height: 150, wallColor: '#fef3c7', doorColor: '#b45309' },
      { type: 'biz', id: 'showroom_auto' },
      { type: 'crossroad', streetName: 'ميدان الشهداء', width: 135, nextZoneId: 'djerba_holding', nextZoneLabel: 'جربة' },
      { type: 'biz', id: 'supermarche' },
      { type: 'house', style: 'medina', name: 'قصر المدينة القديمة', width: 135, height: 142, wallColor: '#fffbeb', doorColor: '#d97706' },
      { type: 'biz', id: 'promoteur_immobilier' },
      { type: 'crossroad', streetName: 'قوس ماركوس أوريليوس', width: 135, nextZoneId: 'djerba_holding', nextZoneLabel: 'جربة' },
      { type: 'biz', id: 'hotel' }
    ];

    zoneSpecs.bizerte = [
      { type: 'house', style: 'goulette', name: 'فيلا سيدي سالم الكورنيش', width: 125, height: 130, wallColor: '#f8fafc', doorColor: '#0284c7' },
      { type: 'biz', id: 'fruits_de_mer' },
      { type: 'crossroad', streetName: 'قنال بنزرت والميناء العتيق', width: 125, nextZoneId: 'nabeul_hammamet', nextZoneLabel: 'نابل' },
      { type: 'biz', id: 'attariya' },
      { type: 'house', style: 'goulette', name: 'دار الكورنيش العتيق', width: 125, height: 126, wallColor: '#f0f9ff', doorColor: '#2563eb' },
      { type: 'biz', id: 'supermarche' },
      { type: 'crossroad', streetName: 'جسر بنزرت المتحرك', width: 130, nextZoneId: 'nabeul_hammamet', nextZoneLabel: 'نابل' },
      { type: 'biz', id: 'librairie' },
      { type: 'house', style: 'goulette', name: 'دار حوت المنارة', width: 120, height: 122, wallColor: '#ffffff', doorColor: '#0369a1' }
    ];
    zoneSpecs.la_goulette = zoneSpecs.bizerte;

    zoneSpecs.nabeul_hammamet = [
      { type: 'house', style: 'hammamet', name: 'فيلا ياسمين نابل', width: 130, height: 135, wallColor: '#fffbeb', doorColor: '#d97706' },
      { type: 'biz', id: 'librairie' },
      { type: 'biz', id: 'artisanat_poterie' },
      { type: 'crossroad', streetName: 'شارع الحبيب بورقيبة نابل', width: 125, nextZoneId: 'kairouan', nextZoneLabel: 'القيروان' },
      { type: 'biz', id: 'superette' },
      { type: 'house', style: 'hammamet', name: 'دار الفخار والزهر', width: 125, height: 130, wallColor: '#fef3c7', doorColor: '#059669' },
      { type: 'biz', id: 'kahwa' },
      { type: 'biz', id: 'centre_thalasso' },
      { type: 'crossroad', streetName: 'مفترق الحمامات السياحي', width: 130, nextZoneId: 'kairouan', nextZoneLabel: 'القيروان' },
      { type: 'biz', id: 'croisiere_mer' }
    ];
    zoneSpecs.lac_2 = zoneSpecs.nabeul_hammamet;

    zoneSpecs.kairouan = [
      { type: 'house', style: 'medina', name: 'دار الأغالبة المعتّقة', width: 135, height: 140, wallColor: '#fef3c7', doorColor: '#059669' },
      { type: 'biz', id: 'kahwa' },
      { type: 'crossroad', streetName: 'ساحة فسقية الأغالبة', width: 130, nextZoneId: 'sbeitla', nextZoneLabel: 'سبيطلة' },
      { type: 'biz', id: 'patisserie' },
      { type: 'biz', id: 'boulangerie_artisanale' },
      { type: 'house', style: 'medina', name: 'قصر الزربية القيروانية', width: 130, height: 135, wallColor: '#fffbeb', doorColor: '#d97706' },
      { type: 'biz', id: 'superette' },
      { type: 'biz', id: 'vente_vetements' },
      { type: 'crossroad', streetName: 'نهج جامع عقبة', width: 130, nextZoneId: 'sbeitla', nextZoneLabel: 'سبيطلة' },
      { type: 'biz', id: 'salle_de_jeux' }
    ];

    zoneSpecs.sbeitla = [
      { type: 'house', style: 'medina', name: 'قصر الكابيتول الروماني', width: 135, height: 145, wallColor: '#fef3c7', doorColor: '#b45309' },
      { type: 'biz', id: 'kahwa' },
      { type: 'crossroad', streetName: 'طريق الآثار والمعابد الثلاثة', width: 130, nextZoneId: 'sfax', nextZoneLabel: 'صفاقس' },
      { type: 'biz', id: 'superette' },
      { type: 'biz', id: 'salle_de_jeux' },
      { type: 'house', style: 'medina', name: 'دار الزيتون العريق', width: 130, height: 135, wallColor: '#fffbeb', doorColor: '#16a34a' },
      { type: 'biz', id: 'vente_vetements' },
      { type: 'crossroad', streetName: 'ساحة سفيطلة التاريخية', width: 130, nextZoneId: 'sfax', nextZoneLabel: 'صفاقس' },
      { type: 'biz', id: 'librairie' },
      { type: 'biz', id: 'attariya' }
    ];

    zoneSpecs.sfax = [
      { type: 'house', style: 'medina', name: 'عمارة برج النار', width: 135, height: 155, wallColor: '#f8fafc', doorColor: '#0284c7' },
      { type: 'biz', id: 'fruits_de_mer' },
      { type: 'biz', id: 'huilerie_olive' },
      { type: 'crossroad', streetName: 'ساحة باب الديوان', width: 130, nextZoneId: 'djerba_holding', nextZoneLabel: 'جربة' },
      { type: 'biz', id: 'librairie' },
      { type: 'biz', id: 'vente_vetements' },
      { type: 'house', style: 'medina', name: 'دار الزيتونة المباركة', width: 135, height: 140, wallColor: '#fef3c7', doorColor: '#16a34a' },
      { type: 'biz', id: 'kahwa' },
      { type: 'biz', id: 'salon_de_the' },
      { type: 'crossroad', streetName: 'طريق تنيور وقرمدة', width: 130, nextZoneId: 'djerba_holding', nextZoneLabel: 'جربة' },
      { type: 'biz', id: 'superette' }
    ];

    zoneSpecs.djerba_holding = [
      { type: 'house', style: 'djerba', name: 'حوش جربة الكبير', width: 140, height: 148, wallColor: '#f8fafc', doorColor: '#0284c7' },
      { type: 'biz', id: 'kahwa' },
      { type: 'biz', id: 'artisanat_poterie' },
      { type: 'crossroad', streetName: 'ساحة حومة السوق', width: 135, nextZoneId: 'gabes', nextZoneLabel: 'قابس' },
      { type: 'biz', id: 'fruits_de_mer' },
      { type: 'biz', id: 'hotel' },
      { type: 'biz', id: 'centre_thalasso' },
      { type: 'house', style: 'djerba', name: 'قصر ميدون', width: 145, height: 155, wallColor: '#fef3c7', doorColor: '#b45309' },
      { type: 'biz', id: 'salon_de_the' },
      { type: 'crossroad', streetName: 'مفترق المنطقة السياحية', width: 135, nextZoneId: 'gabes', nextZoneLabel: 'قابس' },
      { type: 'biz', id: 'superette' },
      { type: 'biz', id: 'croisiere_mer' }
    ];

    zoneSpecs.gabes = [
      { type: 'house', style: 'goulette', name: 'فيلا الواحة البحرية', width: 130, height: 138, wallColor: '#f0f9ff', doorColor: '#0284c7' },
      { type: 'biz', id: 'usine_conserves' },
      { type: 'crossroad', streetName: 'سوق جارة للحناء', width: 130, nextZoneId: 'gafsa', nextZoneLabel: 'قفصة' },
      { type: 'biz', id: 'superette' },
      { type: 'biz', id: 'kahwa' },
      { type: 'house', style: 'goulette', name: 'دار خليج قابس', width: 130, height: 135, wallColor: '#f8fafc', doorColor: '#059669' },
      { type: 'biz', id: 'attariya' },
      { type: 'biz', id: 'vente_vetements' },
      { type: 'crossroad', streetName: 'مفترق ميناء قابس التجاري', width: 130, nextZoneId: 'gafsa', nextZoneLabel: 'قفصة' },
      { type: 'biz', id: 'fricasse' }
    ];

    zoneSpecs.gafsa = [
      { type: 'house', style: 'medina', name: 'دار البركة الرومانية', width: 130, height: 135, wallColor: '#fef3c7', doorColor: '#d97706' },
      { type: 'biz', id: 'emballage_dattes' },
      { type: 'crossroad', streetName: 'شارع الحوض المنجمي', width: 130, nextZoneId: 'tozeur', nextZoneLabel: 'توزر' },
      { type: 'biz', id: 'attariya' },
      { type: 'house', style: 'medina', name: 'واحة قفصة الجبلية', width: 125, height: 128, wallColor: '#fffbeb', doorColor: '#059669' },
      { type: 'biz', id: 'hotel' },
      { type: 'biz', id: 'vente_vetements' },
      { type: 'crossroad', streetName: 'مفترق المتلوي', width: 130, nextZoneId: 'tozeur', nextZoneLabel: 'توزر' },
      { type: 'biz', id: 'kahwa' }
    ];

    zoneSpecs.tozeur = [
      { type: 'house', style: 'djerba', name: 'قصر دقلة النور والواحات', width: 135, height: 140, wallColor: '#fef3c7', doorColor: '#b45309' },
      { type: 'biz', id: 'hotel' },
      { type: 'crossroad', streetName: 'طريق الشبيكة وتمغزة', width: 130, nextZoneId: 'beja', nextZoneLabel: 'باجة' },
      { type: 'biz', id: 'salon_de_the' },
      { type: 'biz', id: 'kahwa' },
      { type: 'house', style: 'djerba', name: 'رياض شط الجريد', width: 135, height: 142, wallColor: '#fffbeb', doorColor: '#d97706' },
      { type: 'biz', id: 'attariya' },
      { type: 'biz', id: 'superette' },
      { type: 'crossroad', streetName: 'جادة النخيل الذهبي', width: 130, nextZoneId: 'beja', nextZoneLabel: 'باجة' },
      { type: 'biz', id: 'salle_de_jeux' },
      { type: 'biz', id: 'fricasse' }
    ];

    zoneSpecs.beja = [
      { type: 'house', style: 'medina', name: 'قصر القمح الباجي', width: 125, height: 125, wallColor: '#fef3c7', doorColor: '#059669' },
      { type: 'biz', id: 'produits_laitiers' },
      { type: 'biz', id: 'boulangerie_artisanale' },
      { type: 'crossroad', streetName: 'طريق الشمال الغربي', width: 125, nextZoneId: 'le_kef', nextZoneLabel: 'الكاف' },
      { type: 'biz', id: 'boucherie' },
      { type: 'biz', id: 'kahwa' },
      { type: 'house', style: 'medina', name: 'دار الجبن والخيرات', width: 120, height: 120, wallColor: '#fffbeb', doorColor: '#eab308' },
      { type: 'biz', id: 'attariya' },
      { type: 'biz', id: 'superette' },
      { type: 'crossroad', streetName: 'ساحة الشهداء بباجة', width: 130, nextZoneId: 'le_kef', nextZoneLabel: 'الكاف' },
      { type: 'biz', id: 'fricasse' }
    ];

    zoneSpecs.le_kef = [
      { type: 'house', style: 'medina', name: 'دار سيدي بومخلوف', width: 130, height: 135, wallColor: '#f8fafc', doorColor: '#0284c7' },
      { type: 'biz', id: 'boucherie' },
      { type: 'crossroad', streetName: 'طريق القصبة العالية', width: 125, nextZoneId: 'monastir_mahdia', nextZoneLabel: 'المنستير' },
      { type: 'biz', id: 'produits_laitiers' },
      { type: 'biz', id: 'superette' },
      { type: 'house', style: 'medina', name: 'دار الجبل والكرم', width: 125, height: 125, wallColor: '#fef3c7', doorColor: '#78350f' },
      { type: 'biz', id: 'kahwa' },
      { type: 'biz', id: 'patisserie' },
      { type: 'crossroad', streetName: 'نهج برنوس الكاف', width: 130, nextZoneId: 'monastir_mahdia', nextZoneLabel: 'المنستير' },
      { type: 'biz', id: 'salle_de_jeux' }
    ];

    zoneSpecs.monastir_mahdia = [
      { type: 'house', style: 'goulette', name: 'برج الرباط البحري', width: 135, height: 145, wallColor: '#f8fafc', doorColor: '#0369a1' },
      { type: 'biz', id: 'hotel' },
      { type: 'biz', id: 'huilerie_olive' },
      { type: 'crossroad', streetName: 'مارينا المنستير', width: 130, nextZoneId: 'medenine_zarzis', nextZoneLabel: 'مدنين' },
      { type: 'biz', id: 'salon_de_the' },
      { type: 'biz', id: 'superette' },
      { type: 'house', style: 'goulette', name: 'دار سقيفة الفاطميين', width: 130, height: 135, wallColor: '#fef3c7', doorColor: '#b45309' },
      { type: 'biz', id: 'supermarche' },
      { type: 'biz', id: 'patisserie' },
      { type: 'crossroad', streetName: 'طريق المهدية الكحلة', width: 130, nextZoneId: 'medenine_zarzis', nextZoneLabel: 'مدنين' },
      { type: 'biz', id: 'vente_vetements' },
      { type: 'biz', id: 'librairie' },
      { type: 'biz', id: 'croisiere_mer' }
    ];

    zoneSpecs.tataouine = [
      { type: 'house', style: 'djerba', name: 'قصر أولاد دباب الصحراوي', width: 135, height: 145, wallColor: '#fef3c7', doorColor: '#b45309' },
      { type: 'biz', id: 'hotel' },
      { type: 'crossroad', streetName: 'طريق القصور الصحراوية وغيلان', width: 130, nextZoneId: 'medenine_zarzis', nextZoneLabel: 'مدنين' },
      { type: 'biz', id: 'vente_vetements' },
      { type: 'biz', id: 'vente_montres' },
      { type: 'house', style: 'djerba', name: 'دار شنني والدويرات العريقة', width: 130, height: 140, wallColor: '#fffbeb', doorColor: '#d97706' },
      { type: 'biz', id: 'attariya' },
      { type: 'crossroad', streetName: 'ساحة الديناصورات بتطاوين', width: 130, nextZoneId: 'medenine_zarzis', nextZoneLabel: 'مدنين' },
      { type: 'biz', id: 'supermarche' }
    ];

    zoneSpecs.medenine_zarzis = [
      { type: 'house', style: 'djerba', name: 'قصر الغرفة التاريخي', width: 135, height: 145, wallColor: '#fef3c7', doorColor: '#b45309' },
      { type: 'biz', id: 'vente_vetements' },
      { type: 'crossroad', streetName: 'طريق القصور وجرجيس', width: 130, nextZoneId: 'tunis', nextZoneLabel: 'تونس' },
      { type: 'biz', id: 'attariya' },
      { type: 'biz', id: 'superette' },
      { type: 'house', style: 'djerba', name: 'إقامة مرسى جرجيس', width: 135, height: 140, wallColor: '#ffffff', doorColor: '#0284c7' },
      { type: 'biz', id: 'fricasse' },
      { type: 'biz', id: 'patisserie' },
      { type: 'crossroad', streetName: 'مفترق بن قردان الدولي', width: 130, nextZoneId: 'tunis', nextZoneLabel: 'تونس' },
      { type: 'biz', id: 'salle_de_jeux' }
    ];

    let rawItems = zoneSpecs[zoneId] || zoneSpecs.bab_souika;

    // Insertion automatique et garantie d'une Banque, d'un Monument Square (Horloge/Statue + Fontaine + Jardin), d'un Poste de Police et d'un Guichet de Tabac dans chaque ville
    const hasBank = rawItems.some(it => it.type === 'bank_branch');
    const hasMonument = rawItems.some(it => it.type === 'monument_square');
    const hasPolice = rawItems.some(it => it.type === 'police_station');
    const hasTobacco = rawItems.some(it => it.type === 'tobacco_kiosk');
    if (!hasBank || !hasMonument || !hasPolice || !hasTobacco) {
      const augmented = [];
      let bankInserted = hasBank;
      let monumentInserted = hasMonument;
      let tobaccoInserted = hasTobacco;
      let policeInserted = hasPolice;
      rawItems.forEach((it, idx) => {
        augmented.push(it);
        // Insérer la banque après le 1er élément
        if (!bankInserted && idx === 1) {
          augmented.push({ type: 'bank_branch', width: 135 });
          bankInserted = true;
        }
        // Insérer la ساحة الساعة والنافورة والحديقة (Monument Square) après le 2ème élément
        if (!monumentInserted && idx === 2) {
          augmented.push({ type: 'monument_square', width: 155, name: 'ساحة الساعة والنافورة' });
          monumentInserted = true;
        }
        // Insérer le guichet de tabac (قمريڨ ومكتب التبغ والوقيد) après le 4ème élément
        if (!tobaccoInserted && idx === 4) {
          augmented.push({ type: 'tobacco_kiosk', width: 125 });
          tobaccoInserted = true;
        }
        // Insérer le poste de police après le 6ème élément
        if (!policeInserted && idx === 6) {
          augmented.push({ type: 'police_station', width: 135 });
          policeInserted = true;
        }
      });
      if (!bankInserted) augmented.push({ type: 'bank_branch', width: 135 });
      if (!monumentInserted) augmented.push({ type: 'monument_square', width: 155, name: 'ساحة الساعة والنافورة' });
      if (!tobaccoInserted) augmented.push({ type: 'tobacco_kiosk', width: 125 });
      if (!policeInserted) augmented.push({ type: 'police_station', width: 135 });
      rawItems = augmented;
    }

    // Quartier précédent (cyclique) pour permettre la navigation dans les deux sens
    const zoneOrder = ['bab_souika', 'la_goulette', 'lac_2', 'hammamet', 'djerba_holding'];
    const zoneLabels = {
      bab_souika: 'تونس',
      la_goulette: 'بنزرت',
      lac_2: 'الحمامات',
      hammamet: 'سوسة',
      djerba_holding: 'جربة'
    };
    const zIdx = Math.max(0, zoneOrder.indexOf(zoneId));
    const prevId = zoneOrder[(zIdx - 1 + zoneOrder.length) % zoneOrder.length];
    rawItems.forEach(item => {
      if (item.type === 'crossroad') {
        item.prevZoneId = prevId;
        item.prevZoneLabel = zoneLabels[prevId];
      }
    });
    this.streetLayout = [];
    this.buildingsConfig = [];

    let curX = 55;
    rawItems.forEach(item => {
      if (item.type === 'biz') {
        const tpl = this.bizTemplates[item.id];
        if (tpl) {
          const entry = { ...tpl, type: 'biz', x: curX };
          this.streetLayout.push(entry);
          this.buildingsConfig.push(entry);
          curX += tpl.width + 26;
        }
      } else if (item.type === 'house') {
        const entry = { ...item, x: curX };
        this.streetLayout.push(entry);
        curX += item.width + 24;
      } else if (item.type === 'crossroad') {
        const entry = { ...item, x: curX };
        this.streetLayout.push(entry);
        curX += item.width + 24;
      } else if (item.type === 'garden' || item.type === 'monument_square' || item.type === 'service_station' || item.type === 'bank_branch' || item.type === 'police_station' || item.type === 'tobacco_kiosk') {
        const entry = { ...item, x: curX };
        this.streetLayout.push(entry);
        curX += item.width + 24;
      } else {
        const entry = { ...item, x: curX };
        this.streetLayout.push(entry);
        curX += (item.width || 120) + 24;
      }
    });

    this.worldWidth = Math.max(1200, curX + 60);
  }

  updateHudOffers(data) {
    Object.assign(this.hudOffers, data);
  }

  bindEvents() {
    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('pointercancel', this.handlePointerUp);
    this.canvas.addEventListener('wheel', this.handleWheel, { passive: true });
    window.addEventListener('resize', () => this.resize());
  }

  unbindEvents() {
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerUp);
    this.canvas.removeEventListener('wheel', this.handleWheel);
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 800;
    this.height = rect.height || 360;
    this.dpr = window.devicePixelRatio || 1;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  initWorld() {
    this.clouds = [
      { x: 80, y: 35, speed: 8, scale: 1.1 },
      { x: 450, y: 50, speed: 6, scale: 0.85 },
      { x: 850, y: 28, speed: 10, scale: 1.25 },
      { x: 1250, y: 45, speed: 7, scale: 0.95 }
    ];

    this.palms = [];
    for (let x = 35; x < this.worldWidth; x += 210 + Math.random() * 40) {
      this.palms.push({
        x: x,
        height: 75 + Math.random() * 25,
        lean: (Math.random() - 0.5) * 8,
        swayPhase: Math.random() * Math.PI * 2
      });
    }

    this.taxis = [
      { x: 120, speed: 68, dir: 1, type: 'taxi_collectif' },
      { x: 520, speed: 76, dir: 1, type: 'taxi_citadin' },
      { x: 920, speed: 64, dir: -1, type: 'louage' },
      { x: 1280, speed: 82, dir: 1, type: 'citadine_rouge' },
      { x: 1580, speed: 70, dir: -1, type: 'taxi_collectif' }
    ];

    const charStyles = [
      { coat: '#dc2626', pants: '#1e293b', skin: '#fcd34d', hat: 'chechia', prop: 'bag' },
      { coat: '#0284c7', pants: '#0f172a', skin: '#fde68a', hat: 'hijab', prop: 'couffin' },
      { coat: '#059669', pants: '#1e293b', skin: '#f59e0b', hat: 'hair', prop: 'coffee' },
      { coat: '#7c3aed', pants: '#334155', skin: '#fcd34d', hat: 'chechia', prop: 'none' },
      { coat: '#d97706', pants: '#0f172a', skin: '#fde68a', hat: 'cap', prop: 'bag' },
      { coat: '#e11d48', pants: '#1e293b', skin: '#fcd34d', hat: 'hijab', prop: 'couffin' },
      { coat: '#2563eb', pants: '#0f172a', skin: '#f59e0b', hat: 'hair', prop: 'none' }
    ];
    this.pedestrians = [];
    for (let i = 0; i < 18; i++) {
      const style = charStyles[i % charStyles.length];
      const baseSpd = (18 + Math.random() * 18) * (Math.random() > 0.5 ? 1 : -1);
      this.pedestrians.push({
        x: 50 + Math.random() * Math.max(300, this.worldWidth - 100),
        yOffset: (Math.random() - 0.5) * 14,
        speed: baseSpd,
        baseSpeed: baseSpd,
        hasUmbrella: (i % 2 === 0), // 50% ont un parapluie
        umbrellaColor: ['#ef4444', '#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][i % 6],
        coat: style.coat,
        pants: style.pants,
        skin: style.skin,
        hat: style.hat,
        prop: style.prop,
        phase: Math.random() * Math.PI * 2,
        bubbleText: null,
        bubbleTimer: 0,
        visitTimer: 3 + Math.random() * 6
      });
    }

    this.seagulls = [
      { x: 250, y: 40, speed: 28, wingPhase: 0 },
      { x: 900, y: 55, speed: 22, wingPhase: 1 }
    ];

    // Petits chats tunisiens de quartier qui se baladent
    this.cats = [
      { x: 180, speed: 12, dir: 1, color: '#f59e0b', earColor: '#ea580c' },
      { x: 620, speed: 14, dir: -1, color: '#ffffff', earColor: '#e2e8f0' },
      { x: 1100, speed: 10, dir: 1, color: '#0f172a', earColor: '#334155' },
      { x: 1650, speed: 15, dir: -1, color: '#f97316', earColor: '#c2410c' }
    ];
  }

  transitionToZone(zoneId, zoneName) {
    const changed = this.currentZoneId !== zoneId || this.streetLayout.length === 0;
    this.currentZoneId = zoneId;
    this.transitionBannerText = zoneName || 'حيّ جديد';
    const zoneIcons = {
      bab_souika: '🕌',
      tunis: '🕌',
      la_goulette: '⚓',
      bizerte: '⛵',
      lac_2: '🏙️',
      hammamet: '🏖️',
      nabeul_hammamet: '🏖️',
      beja: '🧀',
      le_kef: '🏰',
      sousse: '💎',
      monastir_mahdia: '⚓',
      kairouan: '🕌',
      sfax: '🏭',
      gafsa: '⛏️',
      tozeur: '🌴',
      gabes: '🌊',
      medenine_zarzis: '🏺',
      sbeitla: '🏛️',
      annaba: '🇩🇿',
      tripoli: '🇱🇾',
      djerba_holding: '👑'
    };
    const zoneSubtitles = {
      bab_souika: 'قلب العاصمة التونسية وأصل الحرفة والتجارة',
      tunis: 'قلب العاصمة التونسية وأصل الحرفة والتجارة',
      la_goulette: 'نسمة البحر وحركية الكورنيش والتاكسي الجماعي',
      bizerte: 'قنال بنزرت العتيق وميناء الصيد والخيرات',
      lac_2: 'الأبراج الزجاجية والمشاريع العصرية الكبرى',
      hammamet: 'السياحة الفاخرة والنزل العالمية والمولات',
      nabeul_hammamet: 'الفخار وزهر نابل وياسمين الحمامات',
      beja: 'قمح وسمن ومخارق وزلابية وجبن باجة المعتّق',
      le_kef: 'القصبة العالية وسيدي بومخلوف وبرنوس الجبل',
      sousse: 'جوهرة الساحل وبوجعفر ومشاريع القنطاوي الراقية',
      monastir_mahdia: 'رباط المنستير وسقيفة المهدية الكحلة والحوت الأزرق',
      kairouan: 'عاصمة الأغالبة ومقروض القيروان والزرابي الفاخرة',
      sfax: 'عاصمة الجنوب والصناعات الكبرى وباب الديوان العريق',
      gafsa: 'الحوض المنجمي والبركة الرومانية وواحات الجنوب',
      tozeur: 'بلاد دقلة النور والواحات الصحراوية والشبيكة',
      gabes: 'واحة الحناء البحرية وسوق جارة والموانئ التجارية',
      medenine_zarzis: 'قصور مدنين وتجارة جرجيس وبوابة الصحراء',
      sbeitla: 'عاصمة الكابيتول الروماني والمعابد الأثرية الخالدة',
      annaba: 'ميناء بونة التجاري والتبادل المغاربي الجزائري',
      tripoli: 'عروس البحر وأسواق التجارة والعبور الدولي الليبي',
      djerba_holding: 'قمة الاستثمار الدولي وأسطول طيران الغزالة'
    };
    this.transitionZoneIcon = zoneIcons[zoneId] || '🇹🇳';
    this.transitionSubtitle = zoneSubtitles[zoneId] || 'أجواء جديدة وتوسّع استثماري تونسي';
    this.transitionAlpha = 1.0;
    this.transitionTimer = 1.5;

    if (changed) {
      this.buildZoneLayout(zoneId);
      this.initWorld();
      this.cameraX = 0;
      this.targetCameraX = 0;
    }
  }



  start() {
    if (this.animId) return;
    this.lastTime = performance.now();
    const loop = (timestamp) => {
      try {
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
        this.lastTime = timestamp;
        this.update(dt, timestamp);
        this.render(timestamp);
      } catch (err) {
        console.error('QuartierAnimator frame error', err);
      }
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  focusBusiness(bizId) {
    const bConf = this.buildingsConfig.find(b => b.id === bizId);
    if (!bConf) return;
    const targetX = bConf.x + bConf.width / 2 - this.width / 2;
    this.targetCameraX = Math.max(0, Math.min(targetX, this.worldWidth - this.width));
  }

  handlePointerDown(e) {
    this.isDragging = true;
    if (this.canvas.setPointerCapture && e.pointerId !== undefined) {
      try { this.canvas.setPointerCapture(e.pointerId); } catch (_) {}
    }
    this.startX = e.clientX;
    this.lastPointerX = e.clientX;
    this.lastPointerTime = performance.now();
    this.pointerVelocity = 0;
    this.startCamX = this.cameraX;
    this.targetCameraX = this.cameraX;
    this.hasDraggedSignificantly = false;
  }

  handlePointerMove(e) {
    if (!this.isDragging) return;
    const now = performance.now();
    const dt = Math.max(0.005, (now - (this.lastPointerTime || now)) / 1000);
    const deltaX = e.clientX - this.startX;
    const instantDelta = e.clientX - (this.lastPointerX || e.clientX);
    
    // Vélocité pondérée réactive
    const currentVel = -instantDelta / dt;
    this.pointerVelocity = (this.pointerVelocity || 0) * 0.4 + currentVel * 0.6;
    this.lastPointerX = e.clientX;
    this.lastPointerTime = now;

    if (Math.abs(deltaX) > 4) {
      this.hasDraggedSignificantly = true;
    }
    this.cameraX = Math.max(0, Math.min(this.startCamX - deltaX, this.worldWidth - this.width));
    this.targetCameraX = this.cameraX;
  }

  handlePointerUp(e) {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (this.canvas.releasePointerCapture && e.pointerId !== undefined) {
      try { this.canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    }

    // Fling / Inertie dynamique ultra-fluide et naturelle
    if (Math.abs(this.pointerVelocity || 0) > 30) {
      const flingDist = (this.pointerVelocity || 0) * 0.45;
      this.targetCameraX = Math.max(0, Math.min(this.cameraX + flingDist, this.worldWidth - this.width));
    }

    if (!this.hasDraggedSignificantly) {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = rect.width > 0 ? (this.width / rect.width) : 1;
      const scaleY = rect.height > 0 ? (this.height / rect.height) : 1;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      for (let i = this.interactiveHitboxes.length - 1; i >= 0; i--) {
        const box = this.interactiveHitboxes[i];
        if (
          clickX >= box.x &&
          clickX <= box.x + box.w &&
          clickY >= box.y &&
          clickY <= box.y + box.h
        ) {
          this.triggerAction(box.action, box.bizId);
          break;
        }
      }
    }
  }

  handleWheel(e) {
    this.targetCameraX += e.deltaY || e.deltaX;
    this.targetCameraX = Math.max(0, Math.min(this.targetCameraX, this.worldWidth - this.width));
  }

  triggerAction(action, bizId) {
    if (action === 'open_map' || action === 'switch_zone') {
      if (this.onOpenMap) {
        this.onOpenMap(bizId);
      } else if (this.onSwitchZone) {
        this.onSwitchZone(bizId);
      }
    } else if (action === 'inspect' && this.onInspectBiz) {
      this.onInspectBiz(bizId);
    } else if (action === 'upgrade' && this.onUpgradeBiz) {
      this.onUpgradeBiz(bizId);
    } else if (action === 'collect' && this.onCollectBiz) {
      this.onCollectBiz(bizId);
    } else if (action === 'open_bank' && this.onOpenBank) {
      this.onOpenBank();
    } else if (action === 'open_police' && this.onOpenPolice) {
      this.onOpenPolice();
    } else if (action === 'open_tobacco' && this.onOpenTobacco) {
      this.onOpenTobacco();
    } else if (action === 'open_tobacco') {
      // Action par défaut : petit pourboire / تفتوفة سريعة من القمريڨ
      if (this.onHudAction) this.onHudAction('hud_tobacco');
    } else if (action === 'claim_golden_cloud') {
      if (this.goldenCloud && !this.goldenCloud.claimed) {
        this.goldenCloud.claimed = true;
        const startX = this.goldenCloud.x + 50;
        const startY = this.goldenCloud.y + 20;
        for (let i = 0; i < 24; i++) {
          const angle = (Math.PI * 2 * i) / 24;
          const spd = 35 + Math.random() * 55;
          this.smokePuffs.push({
            x: startX,
            y: startY,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd - 30,
            color: '#fbbf24',
            radius: 2.8 + Math.random() * 2.5,
            alpha: 1.0
          });
        }
        if (this.onHudAction) {
          this.onHudAction('claim_golden_cloud');
        }
      }
    } else if (action === 'fountain_wish') {
      if (typeof window !== 'undefined' && window.soundEngine) {
        if (window.soundEngine.playFountainWish) {
          window.soundEngine.playFountainWish();
        } else if (window.soundEngine.playCoin) {
          window.soundEngine.playCoin();
        }
      }
      if (typeof window !== 'undefined' && window.showFeedbackToast) {
        window.showFeedbackToast('🪙 رميت دينار في النافورة وتمنيت البركة والتوفيق ! ✨', '⛲');
      }
    } else if (action.startsWith('hud_') && this.onHudAction) {
      this.onHudAction(action);
    }
  }

  triggerPolicePatrol() {
    // Spawn immédiat à proximité directe de la caméra pour apparition sous 0.3s
    const dir = Math.random() > 0.5 ? 1 : -1;
    // Si roule vers la droite, démarre juste à gauche de la caméra ; sinon juste à droite
    const startX = dir > 0 ? (this.cameraX - 60) : (this.cameraX + this.width + 60);
    this.taxis.push({
      x: startX,
      speed: 240, // Vitesse d'intervention d'urgence sportive
      dir: dir,
      type: 'police_patrol',
      isOneShot: true
    });
  }

  update(dt, timestamp) {
    this.cameraX += (this.targetCameraX - this.cameraX) * Math.min(1, dt * 10);

    // --- GESTION CYCLE MÉTÉO (PLUIE & SOLEIL) ---
    this.rainTimer -= dt;
    if (this.rainTimer <= 0) {
      this.isRaining = !this.isRaining;
      this.rainTimer = this.isRaining ? 20 : 28;
    }
    const targetRain = this.isRaining ? 1.0 : 0.0;
    this.rainIntensity += (targetRain - this.rainIntensity) * Math.min(1, dt * 1.5);

    // Mise à jour gouttes de pluie en diagonale
    if (this.rainIntensity > 0.05) {
      for (const d of this.rainDrops) {
        d.y += d.speed * dt;
        d.x -= d.speed * 0.22 * dt;
        if (d.y > this.height) {
          d.y = -15;
          d.x = Math.random() * (this.width + 160);
        }
      }
    }

    if (this.transitionTimer > 0) {
      this.transitionTimer -= dt;
      if (this.transitionTimer <= 0) {
        this.transitionAlpha = 0;
      } else {
        this.transitionAlpha = Math.min(1, this.transitionTimer);
      }
    }

    this.clouds.forEach(c => {
      c.x += c.speed * dt;
      if (c.x > this.worldWidth + 120) c.x = -150;
    });

    // Progression de la سحابة البركة والذهب
    if (this.goldenCloud) {
      this.goldenCloud.x += this.goldenCloud.speed * dt;
      if (this.goldenCloud.x > this.worldWidth + 200) {
        this.goldenCloud.x = -180;
        this.goldenCloud.y = 35 + (Math.sin(timestamp * 0.001) * 15);
        this.goldenCloud.claimed = false;
      }
    }

    // Déplacement du موكب الفرقة الشعبية
    if (this.folkTroupe && this.folkTroupe.active) {
      this.folkTroupe.x += this.folkTroupe.speed * this.folkTroupe.dir * dt;
      if (this.folkTroupe.dir > 0 && this.folkTroupe.x > this.worldWidth + 300) {
        this.folkTroupe.dir = -1;
        this.folkTroupe.x = this.worldWidth + 280;
      } else if (this.folkTroupe.dir < 0 && this.folkTroupe.x < -300) {
        this.folkTroupe.dir = 1;
        this.folkTroupe.x = -280;
      }
    }

    this.seagulls.forEach(s => {
      s.x += s.speed * dt;
      s.wingPhase += dt * 8;
      if (s.x > this.worldWidth + 100) s.x = -80;
    });

    this.taxis.forEach((t, idx) => {
      t.x += t.speed * t.dir * dt;
      if (t.isOneShot) {
        if (t.dir > 0 && t.x > this.worldWidth + 120) this.taxis.splice(idx, 1);
        if (t.dir < 0 && t.x < -120) this.taxis.splice(idx, 1);
      } else {
        if (t.dir > 0 && t.x > this.worldWidth + 120) t.x = -100;
        if (t.dir < 0 && t.x < -120) t.x = this.worldWidth + 100;
      }

      // Véhicule traversant une flaque d'eau sur l'asphalte -> JAILLISSEMENTS D'EAU ÉPIQUES !
      if (this.rainIntensity > 0.15) {
        for (const px of this.puddles) {
          if (Math.abs(t.x - px) < 28) {
            if (Math.random() < 0.45) {
              const dir = t.dir || 1;
              for (let k = 0; k < 3; k++) {
                this.splashes.push({
                  x: t.x + (Math.random() - 0.5) * 32,
                  y: 255 + 40,
                  vx: (dir * 42 + (Math.random() - 0.5) * 55),
                  vy: -35 - Math.random() * 42,
                  radius: 1.6 + Math.random() * 2.2,
                  life: 0.45,
                  maxLife: 0.45
                });
              }
            }
          }
        }
      }
    });

    // Mise à jour particules d'éclaboussures
    for (let si = this.splashes.length - 1; si >= 0; si--) {
      const sp = this.splashes[si];
      sp.life -= dt;
      sp.x += sp.vx * dt;
      sp.y += sp.vy * dt;
      sp.vy += 180 * dt; // gravité
      if (sp.life <= 0) this.splashes.splice(si, 1);
    }

    this.pedestrians.forEach(p => {
      // Vitesse et comportement sous la pluie
      if (this.rainIntensity > 0.25) {
        if (!p.hasUmbrella) {
          // CEUX SANS PARAPLUIE SE METTENT À COURIR VITE !
          const dir = (p.baseSpeed || p.speed) >= 0 ? 1 : -1;
          p.speed = dir * Math.abs(p.baseSpeed || 20) * 2.3;
          if (!p.bubbleText && Math.random() < 0.02) {
            const rainQuips = ['يا لطيف صبّت ! 🌧️', 'جري جري ! 💨', 'مطر حيّة ! 🏃'];
            p.bubbleText = rainQuips[Math.floor(Math.random() * rainQuips.length)];
            p.bubbleTimer = 2.4;
          }
        } else {
          // Marche normale tranquille avec parapluie
          const dir = (p.baseSpeed || p.speed) >= 0 ? 1 : -1;
          p.speed = dir * Math.abs(p.baseSpeed || 20);
        }
      } else {
        const dir = (p.baseSpeed || p.speed) >= 0 ? 1 : -1;
        p.speed = dir * Math.abs(p.baseSpeed || 20);
      }

      p.x += p.speed * dt;
      if (p.x < 30) { p.x = 30; if (p.baseSpeed) p.baseSpeed *= -1; p.speed *= -1; }
      if (p.x > this.worldWidth - 30) { p.x = this.worldWidth - 30; if (p.baseSpeed) p.baseSpeed *= -1; p.speed *= -1; }

      p.visitTimer -= dt;
      if (p.visitTimer <= 0) {
        p.visitTimer = 5 + Math.random() * 8;
        // Détecter si le piéton passe devant un commerce actif
        let nearbyBiz = null;
        const layoutList = this.streetLayout || this.buildingLayout || [];
        for (const item of layoutList) {
          if (item.type === 'biz') {
            const bizX = item.x + item.width / 2;
            if (Math.abs(p.x - bizX) < item.width / 2 + 15) {
              nearbyBiz = item;
              break;
            }
          }
        }

        // Articles authentiques selon le commerce devant lequel le piéton passe
        const bizArticles = {
          kahwa: ['☕', '🍵', '🍏'],
          kaskrout: ['🥖', '🥪', '🥤'],
          fricasse: ['🥟', '🍩', '🥤'],
          attariya: ['🍞', '🥛', '🥫', '🧀'],
          patisserie: ['🍯', '🥐', '🧁'],
          restaurant: ['🍗', '🥘', '🍖'],
          superette: ['🛒', '🍫', '🧃'],
          supermarche: ['🧺', '🥩', '📦'],
          salon_de_the: ['🍹', '🍸', '🍰'],
          usine_conserves: ['🥫', '🫒'],
          default: ['🛍️', '📦', '✨']
        };

        if (nearbyBiz) {
          const artList = bizArticles[nearbyBiz.id] || bizArticles.default;
          p.carriedItem = artList[Math.floor(Math.random() * artList.length)];
          p.carriedTimer = 6.0;
        }

        // RÈGLE D'OR : Les piétons ne parlent JAMAIS par beau temps (réduction du bruit visuel)
        // Ils ne s'expriment en bulles QUE sous la pluie lorsqu'ils courent pour s'abriter
        if (this.rainIntensity <= 0.25) {
          p.bubbleText = null;
        }
      }
      if (p.carriedTimer > 0) {
        p.carriedTimer -= dt;
        if (p.carriedTimer <= 0) p.carriedItem = null;
      }
      if (p.bubbleTimer > 0) {
        p.bubbleTimer -= dt;
        if (p.bubbleTimer <= 0) p.bubbleText = null;
      }
    });

    this.cats.forEach(c => {
      c.x += c.speed * c.dir * dt;
      if (c.x < 20) { c.x = 20; c.dir = 1; }
      if (c.x > this.worldWidth - 20) { c.x = this.worldWidth - 20; c.dir = -1; }
    });

    // Animation vivante du client qui commande et paye à la brouette Kaskrout Ayari
    const kaskroutItem = (this.streetLayout || []).find(it => it.id === 'kaskrout');
    if (kaskroutItem) {
      if (!this.kaskroutOrder) {
        this.kaskroutOrder = {
          state: 'idle',
          timer: 1.5,
          customerX: kItem => kItem.x + 125,
          currentCustomerX: kaskroutItem.x + 125,
          customerSpeed: 42,
          customerWalkCycle: 0,
          customerBubble: null,
          sellerBubble: null,
          carriedSandwich: false
        };
      }
      const ko = this.kaskroutOrder;
      const standStopX = kaskroutItem.x + kaskroutItem.width - 10;

      if (ko.state === 'idle') {
        ko.timer -= dt;
        if (ko.timer <= 0) {
          ko.state = 'approaching';
          ko.currentCustomerX = standStopX + 75;
          ko.carriedSandwich = false;
          ko.customerBubble = null;
          ko.sellerBubble = null;
        }
      } else if (ko.state === 'approaching') {
        const dist = standStopX - ko.currentCustomerX;
        if (Math.abs(dist) > 2) {
          ko.customerWalkCycle += dt * 8;
          ko.currentCustomerX += Math.sign(dist) * ko.customerSpeed * dt;
        } else {
          ko.currentCustomerX = standStopX;
          ko.state = 'ordering';
          ko.timer = 1.6;
          ko.customerBubble = '🥖 كسكروت عياري حار عيشك !';
        }
      } else if (ko.state === 'ordering') {
        ko.timer -= dt;
        if (ko.timer <= 0) {
          ko.state = 'preparing';
          ko.timer = 1.7;
          ko.customerBubble = '😋';
          ko.sellerBubble = 'حاضر يا باهي ! 🔥';
        }
      } else if (ko.state === 'preparing') {
        ko.timer -= dt;
        if (ko.timer <= 0) {
          ko.state = 'paying';
          ko.timer = 1.5;
          ko.customerBubble = '🪙 3.5 DT';
          ko.sellerBubble = '🥖 تفضّل كسكروتك !';
          ko.carriedSandwich = true;
          this.floatingCoins.push({
            x: kaskroutItem.x + 55,
            y: this.height - 120,
            text: '+3.5 DT',
            alpha: 1.0,
            vy: -24
          });
        }
      } else if (ko.state === 'paying') {
        ko.timer -= dt;
        if (ko.timer <= 0) {
          ko.state = 'leaving';
          ko.customerBubble = 'صحّة لينا ! بنّة عالمية 👌';
          ko.sellerBubble = null;
        }
      } else if (ko.state === 'leaving') {
        ko.customerWalkCycle += dt * 8;
        ko.currentCustomerX -= ko.customerSpeed * dt;
        if (ko.currentCustomerX < standStopX - 85) {
          ko.state = 'idle';
          ko.timer = 3.0 + Math.random() * 3.5;
          ko.customerBubble = null;
          ko.carriedSandwich = false;
        }
      }
    }

    // Animation vivante du guichet de tabac (piéton s'arrête au guichet, commande, paie et s'en va)
    const tobaccoItem = (this.streetLayout || []).find(it => it.type === 'tobacco_kiosk');
    if (tobaccoItem) {
      if (!this.tobaccoOrder) {
        this.tobaccoOrder = {
          state: 'idle',
          timer: 2.0,
          currentCustomerX: tobaccoItem.x + tobaccoItem.width / 2 + 80,
          customerSpeed: 38,
          customerWalkCycle: 0,
          customerBubble: null,
          sellerBubble: null,
          carriedPack: false
        };
      }
      const to = this.tobaccoOrder;
      const counterStopX = tobaccoItem.x + tobaccoItem.width / 2 + 18;

      if (to.state === 'idle') {
        to.timer -= dt;
        if (to.timer <= 0) {
          to.state = 'approaching';
          to.currentCustomerX = counterStopX + 65;
          to.carriedPack = false;
          to.customerBubble = null;
          to.sellerBubble = null;
        }
      } else if (to.state === 'approaching') {
        const dist = counterStopX - to.currentCustomerX;
        if (Math.abs(dist) > 2) {
          to.customerWalkCycle += dt * 8;
          to.currentCustomerX += Math.sign(dist) * to.customerSpeed * dt;
        } else {
          to.currentCustomerX = counterStopX;
          to.state = 'ordering';
          to.timer = 1.7;
          to.customerBubble = 'باكو 20 مارص عيشك 🚬';
        }
      } else if (to.state === 'ordering') {
        to.timer -= dt;
        if (to.timer <= 0) {
          to.state = 'serving';
          to.timer = 1.5;
          to.customerBubble = null;
          to.sellerBubble = 'تفضّل يا باهي ! 👌';
        }
      } else if (to.state === 'serving') {
        to.timer -= dt;
        if (to.timer <= 0) {
          to.state = 'paying';
          to.timer = 1.5;
          to.customerBubble = '🪙 4.5 DT';
          to.sellerBubble = null;
          to.carriedPack = true;
          this.floatingCoins.push({
            x: tobaccoItem.x + tobaccoItem.width / 2,
            y: this.height - 110,
            text: '+4.5 DT',
            alpha: 1.0,
            vy: -22
          });
        }
      } else if (to.state === 'paying') {
        to.timer -= dt;
        if (to.timer <= 0) {
          to.state = 'leaving';
          to.customerBubble = 'يعطيك الصحة ✨';
          to.sellerBubble = null;
        }
      } else if (to.state === 'leaving') {
        to.customerWalkCycle += dt * 8;
        to.currentCustomerX += to.customerSpeed * dt;
        if (to.currentCustomerX > counterStopX + 85) {
          to.state = 'idle';
          to.timer = 3.5 + Math.random() * 4.0;
          to.customerBubble = null;
          to.carriedPack = false;
        }
      }
    }

    if (Math.random() < dt * 10) {
      this.smokePuffs.push({
        x: 120 + (Math.random() - 0.5) * 16,
        y: 205,
        vx: (Math.random() - 0.5) * 10,
        vy: -24 - Math.random() * 18,
        radius: 4,
        alpha: 0.75,
        color: '#f8fafc'
      });
      this.smokePuffs.push({
        x: 460 + (Math.random() - 0.5) * 18,
        y: 195,
        vx: 8 + (Math.random() - 0.5) * 8,
        vy: -18 - Math.random() * 14,
        radius: 3.5,
        alpha: 0.6,
        color: '#e2e8f0'
      });
      this.smokePuffs.push({
        x: 2780,
        y: 170,
        vx: 12 + Math.random() * 8,
        vy: -32 - Math.random() * 14,
        radius: 6,
        alpha: 0.7,
        color: '#cbd5e1'
      });
    }

    for (let i = this.smokePuffs.length - 1; i >= 0; i--) {
      const sp = this.smokePuffs[i];
      sp.x += sp.vx * dt;
      sp.y += sp.vy * dt;
      sp.radius += dt * 6;
      sp.alpha -= dt * 0.7;
      if (sp.alpha <= 0) this.smokePuffs.splice(i, 1);
    }

    for (let i = this.floatingCoins.length - 1; i >= 0; i--) {
      const c = this.floatingCoins[i];
      c.y += c.vy * dt;
      c.alpha -= dt * 1.2;
      if (c.alpha <= 0) this.floatingCoins.splice(i, 1);
    }

  }

  spawnGainBubble(bizId, text) {
    const bConf = this.buildingsConfig.find(b => b.id === bizId);
    if (!bConf) return;
    this.floatingCoins.push({
      x: bConf.x + bConf.width / 2,
      y: 200 - bConf.height - 15,
      vy: -45,
      text: text || '+د.ت',
      alpha: 1.0
    });

    // Particules festives dorées si c'est une montée de palier
    if (text && (text.includes('L25') || text.includes('L50') || text.includes('L100') || text.includes('L200'))) {
      const centerX = bConf.x + bConf.width / 2;
      const centerY = 200 - bConf.height / 2;
      for (let p = 0; p < 18; p++) {
        const angle = (Math.PI * 2 * p) / 18;
        const spd = 30 + Math.random() * 45;
        this.smokePuffs.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 20,
          color: Math.random() > 0.4 ? '#fbbf24' : '#38bdf8',
          radius: 2.5 + Math.random() * 2.5,
          alpha: 1.0
        });
      }
    }
  }

  render(timestamp) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const camX = this.cameraX;
    const groundY = Math.max(195, Math.min(255, h - 55));

    this.interactiveHitboxes = [];
    ctx.clearRect(0, 0, w, h);

    // --- CYCLE CIEL PROGRESSIF (Jour / Coucher de Soleil Doré / Nuit Étoilée / Aube) ---
    const cycleSec = this.skyCycleDuration || 240;
    const skyPhase = ((timestamp * 0.001) % cycleSec) / cycleSec; // 0 à 1
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);

    let starAlphaFactor = 0;
    if (skyPhase < 0.42) {
      // 1. Jour Méditerranéen Ensoleillé (bleu azur limpide et ciel radieux)
      skyGrad.addColorStop(0, '#0284c7');
      skyGrad.addColorStop(0.55, '#38bdf8');
      skyGrad.addColorStop(1, '#bae6fd');
      starAlphaFactor = 0;
    } else if (skyPhase < 0.65) {
      // 2. Golden Hour Magique (coucher de soleil ambré d'or, pourpre et rose crépusculaire)
      skyGrad.addColorStop(0, '#3b0764');
      skyGrad.addColorStop(0.45, '#b45309');
      skyGrad.addColorStop(0.8, '#f97316');
      skyGrad.addColorStop(1, '#fde68a');
      starAlphaFactor = ((skyPhase - 0.42) / 0.23) * 0.4;
    } else if (skyPhase < 0.90) {
      // 3. Nuit Étoilée Sidi Bou Saïd (bleu nuit profond, indigo et mystère)
      skyGrad.addColorStop(0, '#030712');
      skyGrad.addColorStop(0.5, '#0f172a');
      skyGrad.addColorStop(1, '#1e1b4b');
      starAlphaFactor = 0.85;
    } else {
      // 4. Aube Dorée / Lever de Soleil (éveil doux et lumière renaissante)
      skyGrad.addColorStop(0, '#0c4a6e');
      skyGrad.addColorStop(0.45, '#7c2d12');
      skyGrad.addColorStop(0.8, '#fb923c');
      skyGrad.addColorStop(1, '#fef08a');
      starAlphaFactor = (1 - (skyPhase - 0.9) / 0.1) * 0.45;
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Étoiles scintillantes actives la nuit et à la tombée du jour
    if (starAlphaFactor > 0.05) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      for (let i = 0; i < 35; i++) {
        const sx = ((i * 137.5) % w);
        const sy = ((i * 73.1) % (h * 0.45));
        const blink = Math.sin(timestamp * 0.003 + i) * 0.5 + 0.5;
        ctx.globalAlpha = starAlphaFactor * (0.25 + blink * 0.75);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }
      ctx.globalAlpha = 1.0;
    }

    this.drawSkylineBackground(ctx, camX, w, h, groundY - 10, skyPhase);

    // سحابة البركة والذهب الكريمة
    if (this.goldenCloud) {
      const gcScreenX = this.goldenCloud.x - camX * 0.3;
      if (gcScreenX > -130 && gcScreenX < w + 130) {
        this.drawGoldenCloud(ctx, gcScreenX, this.goldenCloud.y, timestamp, this.goldenCloud.claimed);
      }
    }

    ctx.fillStyle = 'rgba(254, 243, 199, 0.22)';
    this.clouds.forEach(c => {
      const screenX = c.x - camX * 0.3;
      if (screenX > -150 && screenX < w + 150) {
        this.drawCloud(ctx, screenX, c.y, c.scale);
      }
    });

    this.seagulls.forEach(s => {
      const screenX = s.x - camX * 0.5;
      if (screenX > -50 && screenX < w + 50) {
        this.drawSeagull(ctx, screenX, s.y, s.wingPhase);
      }
    });

    this.palms.forEach(p => {
      const screenX = p.x - camX;
      if (screenX > -60 && screenX < w + 60) {
        this.drawPalmTree(ctx, screenX, groundY - 12, p, timestamp);
      }
    });

    this.drawBoulevardStreet(ctx, camX, w, h, groundY);

    this.streetLayout.forEach(item => {
      const screenX = item.x - camX;
      if (screenX + item.width > -60 && screenX < w + 60) {
        if (item.type === 'biz') {
          this.drawBuilding(ctx, item, screenX, groundY, timestamp);
        } else if (item.type === 'house') {
          this.drawHouse(ctx, item, screenX, groundY, timestamp);
        } else if (item.type === 'crossroad') {
          this.drawCrossroad(ctx, item, screenX, groundY, h, timestamp);
        } else if (item.type === 'garden') {
          this.drawGarden(ctx, item, screenX, groundY, timestamp);
        } else if (item.type === 'monument_square') {
          this.drawMonumentSquare(ctx, item, screenX, groundY, timestamp);
        } else if (item.type === 'service_station') {
          this.drawServiceStation(ctx, item, screenX, groundY, timestamp);
        } else if (item.type === 'bank_branch') {
          this.drawBankBranch(ctx, item, screenX, groundY, timestamp);
        } else if (item.type === 'police_station') {
          this.drawPoliceStation(ctx, item, screenX, groundY, timestamp);
        } else if (item.type === 'tobacco_kiosk') {
          this.drawTobaccoKiosk(ctx, item, screenX, groundY, timestamp);
        }
      }
    });

    this.smokePuffs.forEach(sp => {
      const screenX = sp.x - camX;
      if (screenX > -30 && screenX < w + 30) {
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = Math.max(0, sp.alpha);
        ctx.beginPath();
        ctx.arc(screenX, sp.y, sp.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1.0;

    this.taxis.forEach(t => {
      const screenX = t.x - camX;
      if (screenX > -100 && screenX < w + 100) {
        this.drawVehicle(ctx, screenX, groundY + 42, t, timestamp);
      }
    });

    // Jaillissements d'eau soulevés par les roues des véhicules
    this.splashes.forEach(sp => {
      const screenX = sp.x - camX;
      if (screenX > -30 && screenX < w + 30) {
        ctx.save();
        const alpha = Math.max(0, sp.life / sp.maxLife);
        ctx.fillStyle = `rgba(186, 230, 253, ${alpha * 0.85})`;
        ctx.beginPath();
        ctx.arc(screenX, sp.y, sp.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    // موكب الفرقة الشعبية والمهرجان
    this.drawFolkTroupe(ctx, camX, groundY + 10, timestamp);

    this.pedestrians.forEach(p => {
      const screenX = p.x - camX;
      if (screenX > -50 && screenX < w + 50) {
        this.drawPedestrian(ctx, screenX, groundY + 12 + p.yOffset * 0.6, p, timestamp);
      }
    });

    this.cats.forEach(c => {
      const screenX = c.x - camX;
      if (screenX > -30 && screenX < w + 30) {
        this.drawCat(ctx, screenX, groundY + 14, c, timestamp);
      }
    });

    this.floatingCoins.forEach(fc => {
      const screenX = fc.x - camX;
      if (screenX > -50 && screenX < w + 50) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, fc.alpha);
        ctx.fillStyle = '#fbbf24';
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 3;
        ctx.font = '900 15px "Cairo", sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeText(fc.text, screenX, fc.y);
        ctx.fillText(fc.text, screenX, fc.y);
        ctx.restore();
      }
    });

    // Rideau de pluie fine en diagonale
    if (this.rainIntensity > 0.05) {
      ctx.save();
      ctx.strokeStyle = `rgba(186, 230, 253, ${this.rainIntensity * 0.62})`;
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (const drop of this.rainDrops) {
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 3.5, drop.y + drop.len);
      }
      ctx.stroke();
      ctx.restore();
    }

    this.drawMinimapTrack(ctx, w, h);
    this.drawInCanvasOffersHUD(ctx, w, h, timestamp);

    if (this.transitionAlpha > 0) {
      ctx.save();
      const progress = Math.max(0, Math.min(1, 1 - (this.transitionTimer / 1.5)));
      const fadeAlpha = Math.sin(Math.min(1, this.transitionAlpha) * Math.PI * 0.5);

      // Rideau cinématique royal avec halo central
      const radGrad = ctx.createRadialGradient(w / 2, h / 2, 15, w / 2, h / 2, Math.max(w, h) * 0.7);
      radGrad.addColorStop(0, `rgba(30, 27, 75, ${fadeAlpha * 0.88})`);
      radGrad.addColorStop(1, `rgba(2, 6, 23, ${fadeAlpha * 0.96})`);
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, w, h);

      // Bandes cinématiques dorées haut et bas qui glissent
      const barSlide = (1 - Math.abs(progress - 0.5) * 2);
      ctx.fillStyle = `rgba(245, 158, 11, ${fadeAlpha * 0.85})`;
      ctx.fillRect(0, h / 2 - 58, w * Math.min(1, progress * 2.2), 2.5);
      ctx.fillRect(w * (1 - Math.min(1, progress * 2.2)), h / 2 + 54, w * Math.min(1, progress * 2.2), 2.5);

      // Médaillon royal du quartier au centre
      const scaleAnim = 0.85 + Math.sin(progress * Math.PI) * 0.18;
      ctx.translate(w / 2, h / 2);
      ctx.scale(scaleAnim, scaleAnim);
      ctx.globalAlpha = fadeAlpha;

      // Écusson / Cartouche de quartier
      const boxW = Math.min(w - 40, 380);
      const boxH = 92;
      const boxGrad = ctx.createLinearGradient(0, -boxH / 2, 0, boxH / 2);
      boxGrad.addColorStop(0, 'rgba(30, 41, 59, 0.96)');
      boxGrad.addColorStop(1, 'rgba(15, 23, 42, 0.98)');
      ctx.fillStyle = boxGrad;
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 18);
      ctx.fill();
      ctx.stroke();

      // Icône du quartier dans un cercle d'or
      ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
      ctx.beginPath();
      ctx.arc(0, -18, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '20px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.transitionZoneIcon || '🇹🇳', 0, -17);

      // Titre du quartier
      ctx.fillStyle = '#fef08a';
      ctx.font = '900 18px "Cairo", sans-serif';
      ctx.fillText(`✨ ${this.transitionBannerText} ✨`, 0, 12);

      // Sous-titre d'ambiance
      ctx.fillStyle = '#38bdf8';
      ctx.font = '700 11.5px "Cairo", sans-serif';
      ctx.fillText(this.transitionSubtitle || 'أجواء جديدة وتوسّع استثماري تونسي', 0, 33);

      ctx.restore();
    }
  }

  drawSkylineBackground(ctx, camX, w, h, groundY = 245, skyPhase = 0) {
    ctx.save();

    if (skyPhase < 0.62) {
      // Soleil doré radieux de jour ou soleil couchant ambré
      const isGoldenHour = skyPhase >= 0.42;
      const sunX = w - 105 - (camX * 0.03);
      const sunY = isGoldenHour ? (55 + (skyPhase - 0.42) * 200) : 40;

      // Halo solaire
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, isGoldenHour ? 46 : 55);
      sunGlow.addColorStop(0, isGoldenHour ? 'rgba(251, 146, 60, 0.55)' : 'rgba(254, 240, 138, 0.5)');
      sunGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, isGoldenHour ? 46 : 55, 0, Math.PI * 2);
      ctx.fill();

      // Disque solaire
      ctx.fillStyle = isGoldenHour ? '#f97316' : '#fef08a';
      ctx.beginPath();
      ctx.arc(sunX, sunY, isGoldenHour ? 15 : 13, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Lune en croissant doré & halo céleste de nuit
      const moonX = w - 95 - (camX * 0.03);
      const moonY = 38;
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 4, moonX, moonY, 38);
      moonGlow.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
      moonGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 38, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(moonX - 4, moonY - 3, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Collines lointaines en parallaxe douce (Sidi Bou Saïd / Boukornine)
    ctx.fillStyle = '#1e1b4b';
    ctx.globalAlpha = 0.55;
    const hillX = 200 - camX * 0.12;
    ctx.beginPath();
    ctx.moveTo(hillX - 280, groundY);
    ctx.quadraticCurveTo(hillX, groundY - 105, hillX + 360, groundY);
    ctx.quadraticCurveTo(hillX + 580, groundY - 85, hillX + 860, groundY);
    ctx.fill();

    // Silhouettes architecturales tunisiennes (Minarets, Coupoles, Horloge Habib Bourguiba)
    for (let x = -80; x < this.worldWidth; x += 380) {
      const sx = x - camX * 0.2;
      if (sx > -120 && sx < w + 120) {
        ctx.fillStyle = '#1e1b4b';
        ctx.globalAlpha = 0.65;

        // Mosquée à coupole et minaret
        ctx.fillRect(sx + 48, groundY - 98, 22, 98);
        ctx.beginPath();
        ctx.moveTo(sx + 44, groundY - 98);
        ctx.lineTo(sx + 59, groundY - 126);
        ctx.lineTo(sx + 74, groundY - 98);
        ctx.fill();

        // Coupole adjacente
        ctx.beginPath();
        ctx.arc(sx + 95, groundY - 45, 22, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(sx + 73, groundY - 45, 44, 45);

        // Tour de l'Horloge illuminée
        ctx.fillRect(sx + 235, groundY - 112, 22, 112);
        ctx.beginPath();
        ctx.moveTo(sx + 232, groundY - 112);
        ctx.lineTo(sx + 246, groundY - 134);
        ctx.lineTo(sx + 260, groundY - 112);
        ctx.fill();

        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(sx + 246, groundY - 92, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fef08a';
        ctx.fill();
      }
    }
    ctx.restore();
  }

  drawGoldenCloud(ctx, x, y, timestamp, claimed = false) {
    ctx.save();
    if (claimed) {
      // Brume dorée scintillante évanescente
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(x + 45, y + 15, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    const hover = Math.sin(timestamp * 0.003) * 3;
    const cy = y + hover;

    // Halo céleste doré radieux
    const glow = ctx.createRadialGradient(x + 45, cy + 18, 8, x + 45, cy + 18, 65);
    glow.addColorStop(0, 'rgba(254, 240, 138, 0.55)');
    glow.addColorStop(0.5, 'rgba(245, 158, 11, 0.25)');
    glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x + 45, cy + 18, 65, 0, Math.PI * 2);
    ctx.fill();

    // Volume du nuage en dégradé or ambré
    const cloudGrad = ctx.createLinearGradient(x, cy, x, cy + 35);
    cloudGrad.addColorStop(0, '#ffffff');
    cloudGrad.addColorStop(0.3, '#fef08a');
    cloudGrad.addColorStop(0.7, '#f59e0b');
    cloudGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = cloudGrad;

    ctx.beginPath();
    ctx.arc(x + 20, cy + 22, 16, 0, Math.PI * 2);
    ctx.arc(x + 42, cy + 14, 22, 0, Math.PI * 2);
    ctx.arc(x + 65, cy + 18, 18, 0, Math.PI * 2);
    ctx.arc(x + 84, cy + 24, 14, 0, Math.PI * 2);
    ctx.fill();

    // Pièce d'or tournoyante au centre
    const coinY = cy + 16 + Math.sin(timestamp * 0.008) * 3;
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(x + 50, coinY, 7.5, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Étincelles scintillantes ✨
    const spPhase = timestamp * 0.005;
    ctx.fillStyle = '#fef08a';
    ctx.font = '10px sans-serif';
    ctx.fillText('✨', x + 5 + Math.sin(spPhase) * 4, cy + 6);
    ctx.fillText('⭐', x + 82 + Math.cos(spPhase) * 4, cy + 8);

    // Écusson interactif clair : هدية كاش مجانية عند النقر
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(x + 2, cy + 34, 96, 17, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = '900 10px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎁 كاش هدية (انقر!)', x + 50, cy + 46);

    // Enregistrement de la hitbox cliquable
    this.interactiveHitboxes.push({
      x: x + 2,
      y: cy,
      w: 96,
      h: 54,
      action: 'claim_golden_cloud'
    });

    ctx.restore();
  }

  drawFolkTroupe(ctx, camX, groundY, timestamp) {
    if (!this.folkTroupe || !this.folkTroupe.active) return;
    const startX = this.folkTroupe.x - camX;
    if (startX < -180 || startX > this.width + 180) return;

    ctx.save();
    const dir = this.folkTroupe.dir || 1;
    const tMembers = this.folkTroupe.troupers;

    // Musiciens marchant en cortège
    tMembers.forEach((m, idx) => {
      const mx = startX + idx * 36 * dir;
      const walkBounce = Math.abs(Math.sin(timestamp * 0.009 + idx)) * 3;
      const my = groundY - walkBounce;

      // Ombre portée
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(mx, groundY + 2, 8, 2.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Corps / Jebba tunisienne
      ctx.fillStyle = m.robe;
      ctx.beginPath();
      ctx.roundRect(mx - 6, my - 16, 12, 16, 4);
      ctx.fill();

      // Chéchia rouge tunisienne
      ctx.fillStyle = m.hat;
      ctx.beginPath();
      ctx.roundRect(mx - 4, my - 23, 8, 5, 2);
      ctx.fill();
      // Kabbous (gland noir)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(mx + (dir > 0 ? 3 : -4), my - 21, 2, 4);

      // Tête
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(mx, my - 17, 3.8, 0, Math.PI * 2);
      ctx.fill();

      // Instrument
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      const instY = my - 10 + Math.sin(timestamp * 0.012 + idx) * 2;
      ctx.fillText(m.instrument, mx + (dir * 7), instY);
    });

    // Notes de musique au-dessus de la troupe
    const midX = startX + 54 * dir;
    const noteY = groundY - 36 + Math.sin(timestamp * 0.007) * 4;
    ctx.font = '10.5px sans-serif';
    ctx.fillText('🎵', midX - 25, noteY);
    ctx.fillText('🎶', midX + 25, noteY - 6);

    // Petite bulle d'ambiance festive
    ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(midX - 44, groundY - 48, 88, 15, 7);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 9px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('موكب الفرقة الشعبية 🇹🇳', midX, groundY - 37.5);

    ctx.restore();
  }

  drawCloud(ctx, x, y, scale) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 18 * scale, 0, Math.PI * 2);
    ctx.arc(x + 20 * scale, y - 6 * scale, 24 * scale, 0, Math.PI * 2);
    ctx.arc(x + 44 * scale, y, 16 * scale, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawSeagull(ctx, x, y, phase) {
    ctx.save();
    const wing = Math.sin(phase) * 5;
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 8, y + wing);
    ctx.quadraticCurveTo(x - 4, y - 4, x, y);
    ctx.quadraticCurveTo(x + 4, y - 4, x + 8, y + wing);
    ctx.stroke();
    ctx.restore();
  }

  drawPalmTree(ctx, x, groundY, p, timestamp) {
    ctx.save();
    const sway = Math.sin(timestamp * 0.002 + p.swayPhase) * 4;

    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 5.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.quadraticCurveTo(x + p.lean, groundY - p.height * 0.5, x + p.lean + sway, groundY - p.height);
    ctx.stroke();

    const topX = x + p.lean + sway;
    const topY = groundY - p.height;
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 3;

    const leaves = [-0.9, -0.6, -0.2, 0.2, 0.6, 0.9];
    leaves.forEach(angle => {
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      const endX = topX + Math.sin(angle) * 32;
      const endY = topY - Math.cos(angle) * 14 + 18;
      ctx.quadraticCurveTo(topX + Math.sin(angle) * 18, topY - 12, endX, endY);
      ctx.stroke();
    });
    ctx.restore();
  }

  drawBuilding(ctx, b, x, groundY, timestamp) {
    const biz = this.engine.getOrEnsureBusiness
      ? this.engine.getOrEnsureBusiness(b.id)
      : this.engine.businesses.find(item => item.id === b.id);
    const isUnlocked = biz && biz.level > 0;
    const isProducing = biz && (biz.isProducing || biz.hasManager || biz.progressMs > 0);
    const maxAllowedH = Math.max(110, groundY - 42);
    const bHeight = Math.min(b.height, maxAllowedH);
    const y = groundY - bHeight;
    const level = biz ? biz.level : 0;

    ctx.save();

    // Ombre au sol réaliste
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(x + b.width / 2, groundY, b.width * 0.55, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cas 0 : نصبة كسكروت عياري تمّ بيعها -> تحوّلت إلى حديقة عمومية خضراء جميلة ونافورة
    const isKaskroutSold = (b.id === 'kaskrout') && ((biz && biz.isSold) || (this.engine.soldBusinesses && this.engine.soldBusinesses.includes('kaskrout')));
    if (isKaskroutSold) {
      const parkW = b.width;
      const parkX = x;

      ctx.save();
      // 1. Pelouse verdoyante
      const grassGrad = ctx.createLinearGradient(parkX, groundY - 18, parkX, groundY);
      grassGrad.addColorStop(0, '#16a34a');
      grassGrad.addColorStop(1, '#15803d');
      ctx.fillStyle = grassGrad;
      ctx.beginPath();
      ctx.roundRect(parkX, groundY - 16, parkW, 16, [6, 6, 0, 0]);
      ctx.fill();

      // 2. Grand olivier ombragé
      const treeX = parkX + 32;
      const treeY = groundY - 16;
      ctx.fillStyle = '#78350f';
      ctx.fillRect(treeX - 4, treeY - 42, 8, 42);
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.arc(treeX, treeY - 50, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(treeX - 8, treeY - 56, 16, 0, Math.PI * 2);
      ctx.arc(treeX + 10, treeY - 52, 14, 0, Math.PI * 2);
      ctx.fill();

      // 3. Fontaine tunisienne en faïence bleue et blanche zellige au centre
      const fX = parkX + parkW / 2 + 10;
      const fY = groundY - 16;
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.ellipse(fX, fY - 4, 22, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Eau animée
      ctx.fillStyle = '#38bdf8';
      const fJetH = 14 + Math.sin(timestamp * 0.008) * 4;
      ctx.beginPath();
      ctx.moveTo(fX, fY - 6);
      ctx.lineTo(fX - 4, fY - 6 - fJetH);
      ctx.lineTo(fX + 4, fY - 6 - fJetH);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(fX, fY - 6 - fJetH, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 4. Banc public en fer forgé
      const benchX = parkX + parkW - 36;
      const benchY = groundY - 16;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(benchX - 12, benchY - 8);
      ctx.lineTo(benchX + 12, benchY - 8);
      ctx.moveTo(benchX - 12, benchY - 8);
      ctx.lineTo(benchX - 12, benchY - 16);
      ctx.stroke();

      // Panneau commémoratif du parc
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(parkX + 10, y + 20, parkW - 20, 24, 6);
      ctx.fill();
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#86efac';
      ctx.font = '900 9.5px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌳 منتزه باب سويقة الأخضر (مكان النصبة سابقاً) ⛲', parkX + parkW / 2, y + 36);

      ctx.restore();
      return;
    }

    // Cas 1 : Commerce non encore débloqué
    if (!isUnlocked) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.fillRect(x, y + 20, b.width, bHeight - 20);
      ctx.strokeRect(x, y + 20, b.width, bHeight - 20);

      // Arche en pierre fermée
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.beginPath();
      ctx.arc(x + b.width / 2, y + 46, 20, Math.PI, 0, false);
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.font = '900 16px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(biz ? biz.icon : '🏪', x + b.width / 2, y + 50);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '900 11.5px "Cairo", sans-serif';
      ctx.fillText(biz ? biz.name : 'مشروع للبيع', x + b.width / 2, y + 68, b.width - 14);

      const unlockCost = biz ? this.engine.getCost(biz) : 0;
      const totalLiquid = (this.engine.dinars || 0) + (this.engine.bankBalance || 0);
      const canAfford = totalLiquid >= unlockCost;
      const manque = Math.max(0, Math.ceil(unlockCost - totalLiquid));

      ctx.fillStyle = canAfford ? '#34d399' : '#f59e0b';
      ctx.font = '800 9px "Cairo", sans-serif';
      ctx.fillText(
        unlockCost > 0
          ? (canAfford ? ('السعر: ' + unlockCost.toLocaleString() + ' د.ت ✓') : ('🔒 مقفول • ' + unlockCost.toLocaleString() + ' د.ت'))
          : 'حاضر للحلّان',
        x + b.width / 2,
        y + 84,
        b.width - 12
      );

      const btnW = Math.min(b.width - 14, 122);
      const btnH = 26;
      const btnX = x + (b.width - btnW) / 2;
      const btnY = y + bHeight - 28;

      ctx.fillStyle = canAfford ? '#10b981' : 'rgba(127, 29, 29, 0.92)';
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 8);
      ctx.fill();
      ctx.strokeStyle = canAfford ? '#34d399' : '#f87171';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 9.5px "Cairo", sans-serif';
      ctx.fillText(
        canAfford ? '🔑 اشري المحلّ' : ('⚠️ ناقصك ' + manque.toLocaleString() + ' د.ت'),
        btnX + btnW / 2,
        btnY + 17,
        btnW - 8
      );

      // Clic tactile sur tout le bâtiment verrouillé : achète si fonds suffisants, sinon explique pourquoi c'est verrouillé
      this.interactiveHitboxes.push({
        x: x,
        y: y,
        w: b.width,
        h: bHeight,
        action: 'upgrade',
        bizId: b.id
      });

      ctx.restore();
      return;
    }

    // Cas 2A : نصبة كسكروت عياري (Brouette abaissée, vendeur authentique et client qui commande, paye et repart)
    if (b.id === 'kaskrout') {
      const cartW = 126;
      const cartX = x;
      const timeSec = (timestamp || performance.now()) / 1000;
      const ko = this.kaskroutOrder || { state: 'idle' };

      ctx.save();

      // 1. LE VENDEUR DE KASKROUT AYARI (الشاف عياري) - Positionné fièrement DERRIÈRE la brouette
      const sellerX = cartX + 42;
      const sellerY = groundY - 2;
      const isPreparing = ko.state === 'preparing';
      const isPaying = ko.state === 'paying';

      // Ombre du vendeur au sol
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(sellerX, groundY - 1, 9, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Buste et bras du chef
      ctx.save();
      ctx.translate(sellerX, sellerY - 22);

      // Tablier blanc de chef tunisien
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(-8, -10, 16, 20, 2);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Col rouge vif
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(-3, -10);
      ctx.lineTo(0, -6);
      ctx.lineTo(3, -10);
      ctx.fill();

      // Tête et visage expressif
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, -17, 7, 0, Math.PI * 2);
      ctx.fill();

      // Moustache tunisienne soignée
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-4, -14, 8, 2);

      // Chéchia rouge tunisienne emblématique (الشاشية التونسية)
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.roundRect(-6, -24, 12, 6, [3, 3, 0, 0]);
      ctx.fill();
      // Gland noir de la chéchia (الكبوس)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(4, -22, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Yeux
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-3, -18, 1.5, 1.5);
      ctx.fillRect(1.5, -18, 1.5, 1.5);

      // Bras et gestuelle dynamique
      const cutBob = isPreparing ? Math.sin(timeSec * 16) * 3 : 0;
      if (isPreparing) {
        // Couteau de chef tranchant la baguette
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(6, -6 + cutBob);
        ctx.lineTo(13, -2 + cutBob);
        ctx.stroke();
        // Baguette tenue en main
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.roundRect(-10, -5 - cutBob, 8, 4, 2);
        ctx.fill();
      } else if (isPaying) {
        // Mains tendues avec le kaskrout enveloppé
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(4, -8, 12, 6, 2);
        ctx.fill();
        ctx.fillStyle = '#d97706';
        ctx.fillRect(6, -7, 8, 4);
      } else {
        // Bras au repos sur le comptoir
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-9, -4, 4, 8);
        ctx.fillRect(5, -4, 4, 8);
      }
      ctx.restore();

      // Bulle de dialogue du vendeur
      if (ko.sellerBubble) {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.beginPath();
        ctx.roundRect(sellerX - 32, groundY - 58, 64, 15, 4);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 7.5px "Cairo", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ko.sellerBubble, sellerX, groundY - 48);
        ctx.restore();
      }

      // 2. LA BROUETTE TRADITIONNELLE ABAISSÉE (نصبة العياري)
      const wheelR = 10;
      const wheelY = groundY - 10;
      const wheelX1 = cartX + 22;
      const wheelX2 = cartX + cartW - 24;

      // Roues en bois cerclées d'acier (posées sur le sol)
      for (const wx of [wheelX1, wheelX2]) {
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(wx, groundY - 1, wheelR * 0.9, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2.5;
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(wx, wheelY, wheelR, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.2;
        for (let sp = 0; sp < 6; sp++) {
          const spAngle = (sp * Math.PI / 3) + (timestamp * 0.0005);
          ctx.beginPath();
          ctx.moveTo(wx, wheelY);
          ctx.lineTo(wx + Math.cos(spAngle) * wheelR, wheelY + Math.sin(spAngle) * wheelR);
          ctx.stroke();
        }
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(wx, wheelY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Béquille de stabilisation de la brouette
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cartX + 6, groundY - 26);
      ctx.lineTo(cartX + 2, groundY - 1);
      ctx.stroke();

      // Caisse en bois de la brouette (châssis compact abaissé)
      const boxW = cartW - 14;
      const boxH = 22;
      const boxX = cartX + 7;
      const boxY = groundY - 30;

      const woodGrad = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxH);
      woodGrad.addColorStop(0, '#f59e0b');
      woodGrad.addColorStop(0.5, '#d97706');
      woodGrad.addColorStop(1, '#92400e');
      ctx.fillStyle = woodGrad;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, [4, 4, 2, 2]);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Poignée / Bras de traction en bois de la brouette
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(boxX, boxY + 10);
      ctx.lineTo(boxX - 12, boxY + 6);
      ctx.stroke();

      // Enseigne calligraphiée peinte sur la caisse
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(boxX + 12, boxY + 4, boxW - 24, 14);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1;
      ctx.strokeRect(boxX + 12, boxY + 4, boxW - 24, 14);
      ctx.fillStyle = '#fef08a';
      ctx.font = '900 8px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🥖 كسكروت عياري 🥚', boxX + boxW / 2, boxY + 14);

      // Vitrine transparente basse sur la caisse
      const glassW = boxW - 10;
      const glassH = 13;
      const glassX = boxX + 5;
      const glassY = boxY - glassH;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.fillRect(glassX, glassY, glassW, glassH);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1;
      ctx.strokeRect(glassX, glassY, glassW, glassH);

      // Ingrédients délicieux visibles : œufs durs, baguettes croustillantes, piments rouges
      ctx.font = '9px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🥚🥚', glassX + glassW * 0.22, glassY + 9.5);
      ctx.fillText('🥖🥖', glassX + glassW * 0.52, glassY + 9.5);
      ctx.fillText('🌶️🥫', glassX + glassW * 0.82, glassY + 9.5);

      // Parasol bicolore rouge et blanc abaissé (مظلة النصبة)
      const poleX = cartX + cartW / 2;
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(poleX, glassY);
      ctx.lineTo(poleX, groundY - 60);
      ctx.stroke();

      const umbrellaY = groundY - 60;
      const umbrellaW = cartW * 0.84;
      const uLeft = poleX - umbrellaW / 2;
      const uRight = poleX + umbrellaW / 2;

      // Toile du parasol rouge
      ctx.beginPath();
      ctx.moveTo(uLeft, umbrellaY + 9);
      ctx.quadraticCurveTo(poleX, umbrellaY - 11, uRight, umbrellaY + 9);
      ctx.closePath();
      ctx.fillStyle = '#dc2626';
      ctx.fill();

      // Rayures blanches du parasol
      ctx.fillStyle = '#f8fafc';
      for (let s = 1; s < 5; s += 2) {
        const sx1 = uLeft + (umbrellaW / 6) * s;
        const sx2 = sx1 + (umbrellaW / 6);
        ctx.beginPath();
        ctx.moveTo(sx1, umbrellaY + 8);
        ctx.lineTo(poleX, umbrellaY - 10);
        ctx.lineTo(sx2, umbrellaY + 8);
        ctx.closePath();
        ctx.fill();
      }

      // 3. LE PASSAGER SUR RUE QUI S'ARRÊTE, COMMANDE, PAYE ET S'EN VA
      if (ko.currentCustomerX) {
        const custScreenX = ko.currentCustomerX;
        const custY = groundY + 1;
        const walkBob = Math.sin(ko.customerWalkCycle || 0) * 2;

        // Ombre du client
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(custScreenX, groundY + 1, 9, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(custScreenX, custY + walkBob);

        // Pantalon
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-4, -12, 3.5, 11);
        ctx.fillRect(0.5, -12, 3.5, 11);

        // Veste / Chemise
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.roundRect(-6, -23, 12, 12, 2);
        ctx.fill();

        // Tête
        ctx.fillStyle = '#fcd34d';
        ctx.beginPath();
        ctx.arc(0, -28, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Cheveux / Casquette
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, -30, 5, Math.PI, 0);
        ctx.fill();

        // Si le client a récupéré son kaskrout : il le tient fièrement en main !
        if (ko.carriedSandwich) {
          ctx.fillStyle = '#d97706';
          ctx.font = '11px serif';
          ctx.textAlign = 'center';
          ctx.fillText('🥖', -9, -15);
        } else if (ko.state === 'paying') {
          // Main tendue avec dinars
          ctx.font = '9px sans-serif';
          ctx.fillText('🪙', -8, -15);
        }

        ctx.restore();

        // Bulle de dialogue du client
        if (ko.customerBubble) {
          ctx.save();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.beginPath();
          ctx.roundRect(custScreenX - 38, groundY - 44, 76, 14, 4);
          ctx.fill();
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 7px "Cairo", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(ko.customerBubble, custScreenX, groundY - 35);
          ctx.restore();
        }
      }

      // Hitbox interactive pour collecter la recette en cliquant sur la brouette (AUCUN bouton visiter inutile)
      this.interactiveHitboxes.push({
        x: cartX,
        y: groundY - 65,
        w: cartW,
        h: 68,
        action: 'collect',
        bizId: b.id
      });

      ctx.restore();
      return;
    }

    // Cas 2 : Commerce actif - Façade architecturale évolutive tunisienne
    let tierBorder = 'rgba(255, 255, 255, 0.2)';
    let tierBorderWidth = 2;
    let hasGoldAura = false;
    let hasNeonSign = false;

    let tierThemeColor = '#3b82f6';
    if (level >= 200) {
      tierBorder = '#f59e0b';
      tierBorderWidth = 4;
      hasGoldAura = true;
      hasNeonSign = true;
      tierThemeColor = '#fbbf24';
    } else if (level >= 100) {
      tierBorder = '#38bdf8';
      tierBorderWidth = 3.2;
      hasNeonSign = true;
      tierThemeColor = '#38bdf8';
    } else if (level >= 50) {
      tierBorder = '#a855f7';
      tierBorderWidth = 2.8;
      tierThemeColor = '#c084fc';
    } else if (level >= 25) {
      tierBorder = '#10b981';
      tierBorderWidth = 2.4;
      tierThemeColor = '#34d399';
    }

    if (hasGoldAura) {
      ctx.save();
      const pulse = Math.sin(timestamp * 0.005) * 5 + 8;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = pulse;
    }

    // Corps de façade en pierre blanchie ou aux teintes traditionnelles
    const grad = ctx.createLinearGradient(x, y, x, groundY);
    grad.addColorStop(0, b.color || '#f8fafc');
    grad.addColorStop(0.7, '#f1f5f9');
    grad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = grad;
    ctx.strokeStyle = tierBorder;
    ctx.lineWidth = tierBorderWidth;
    ctx.beginPath();
    ctx.roundRect(x, y + 16, b.width, bHeight - 16, [8, 8, 0, 0]);
    ctx.fill();
    ctx.stroke();

    if (hasGoldAura) ctx.restore();

    // Toit traditionnel : tuiles ou créneaux de médina (شرفات أندلسية)
    ctx.fillStyle = b.roofColor || '#0284c7';
    ctx.beginPath();
    ctx.moveTo(x - 6, y + 18);
    ctx.lineTo(x + b.width + 6, y + 18);
    ctx.lineTo(x + b.width, y + 2);
    ctx.lineTo(x, y + 2);
    ctx.closePath();
    ctx.fill();

    // Créneaux tunisiens dentelés blancs
    ctx.fillStyle = '#ffffff';
    for (let rx = x; rx < x + b.width; rx += 16) {
      ctx.fillRect(rx, y + 4, 8, 14);
    }

    // Drapeau retiré selon la directive utilisateur

    // Enseigne du magasin avec badge de niveau TRÈS VISIBLE et contrasté
    const signW = b.width - 16;
    const signH = 24;
    const signX = x + 8;
    const signY = y + 22;

    // Fond enseigne
    ctx.save();
    if (hasNeonSign) {
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
    }
    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.beginPath();
    ctx.roundRect(signX, signY, signW, signH, 6);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Badge Niveau DÉDIÉ au coin supérieur gauche du toit avec styling évolutif par palier
    const lvlW = 34;
    const lvlH = 17;
    const lvlX = x + 8;
    const lvlY = y - 5;
    ctx.save();
    ctx.fillStyle = level >= 200 ? '#78350f' : level >= 100 ? '#0369a1' : level >= 50 ? '#581c87' : level >= 25 ? '#065f46' : '#0284c7';
    ctx.beginPath();
    ctx.roundRect(lvlX, lvlY, lvlW, lvlH, 5);
    ctx.fill();
    ctx.strokeStyle = tierBorder;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 9.5px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    const tierIcon = level >= 200 ? '👑' : level >= 100 ? '💎' : level >= 50 ? '⭐' : level >= 25 ? '⚡' : '';
    ctx.fillText(`${tierIcon} L${level}`, lvlX + lvlW / 2, lvlY + 12);
    ctx.restore();

    // L'enseigne utilise TOUTE la largeur disponible sans coupure de texte
    ctx.fillStyle = '#fef08a';
    ctx.textAlign = 'center';
    const fullName = (biz.icon ? (biz.icon + ' ') : '') + biz.name;
    // Ajustement dynamique de taille de police pour afficher TOUT le texte sans déborder
    let fontSize = 10.5;
    ctx.font = '900 ' + fontSize + 'px "Cairo", sans-serif';
    let textWidth = ctx.measureText(fullName).width;
    if (textWidth > signW - 10) {
      fontSize = Math.max(8, Math.floor((signW - 12) / textWidth * fontSize));
      ctx.font = '900 ' + fontSize + 'px "Cairo", sans-serif';
    }
    ctx.fillText(fullName, signX + signW / 2, signY + 16, signW - 8);

    // --- PORTE TRADITIONNELLE ÉLÉGANTE ET BIEN PROPORTIONNÉE ---
    const doorW = Math.min(36, b.width * 0.32);
    const doorH = Math.min(42, Math.max(34, bHeight * 0.38));
    const doorX = x + (b.width - doorW) / 2;
    const doorY = groundY - doorH;

    // 1. Encadrement noble en pierre de Kadhel sculptée (طاق حجري تونسي أصيل)
    ctx.save();
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(doorX + doorW / 2, doorY + doorW / 2, doorW / 2 + 3, Math.PI, 0, false);
    ctx.lineTo(doorX + doorW + 3, doorY + doorH);
    ctx.lineTo(doorX - 3, doorY + doorH);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Claveaux discrets de l'arc (نقشة الحجارة)
    ctx.strokeStyle = 'rgba(180, 83, 9, 0.4)';
    ctx.lineWidth = 1;
    for (let a = Math.PI * 0.15; a <= Math.PI * 0.85; a += 0.3) {
      const cosA = Math.cos(a);
      const sinA = Math.sin(a);
      const cx = doorX + doorW / 2;
      const cy = doorY + doorW / 2;
      ctx.beginPath();
      ctx.moveTo(cx - cosA * (doorW / 2), cy - sinA * (doorW / 2));
      ctx.lineTo(cx - cosA * (doorW / 2 + 3), cy - sinA * (doorW / 2 + 3));
      ctx.stroke();
    }
    ctx.restore();

    // 2. Vantail de la porte en bois peint (Bleu Sidi Bou Saïd / Ocre / Vert Médina)
    let doorColor = '#1d4ed8'; // Bleu Sidi Bou Saïd par défaut
    if (b.id === 'kaskrout' || b.id === 'fricasse') doorColor = '#eab308'; // Ocre jaune chaleureux
    else if (b.id === 'patisserie' || b.id === 'attariya') doorColor = '#059669'; // Vert émeraude médina
    else if (b.id === 'tayaran_el_ghzela' || b.id === 'showroom_auto') doorColor = '#1e293b'; // Noir / Bleu marine luxueux

    ctx.fillStyle = doorColor;
    ctx.beginPath();
    ctx.arc(doorX + doorW / 2, doorY + doorW / 2, doorW / 2, Math.PI, 0, false);
    ctx.lineTo(doorX + doorW, doorY + doorH);
    ctx.lineTo(doorX, doorY + doorH);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Ligne centrale de battant
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.moveTo(doorX + doorW / 2, doorY + 2);
    ctx.lineTo(doorX + doorW / 2, doorY + doorH);
    ctx.stroke();

    // 3. Clous de cuivre noircis et dorés en motif authentique (سروة ونجمة وهلال بالمسامير)
    ctx.fillStyle = '#fbbf24';
    const nailPattern = [
      { dx: 0.5, dy: 0.28 },
      { dx: 0.35, dy: 0.45 }, { dx: 0.65, dy: 0.45 },
      { dx: 0.5, dy: 0.55 },
      { dx: 0.3, dy: 0.7 }, { dx: 0.7, dy: 0.7 },
      { dx: 0.5, dy: 0.82 }
    ];
    for (const np of nailPattern) {
      ctx.beginPath();
      ctx.arc(doorX + doorW * np.dx, doorY + doorH * np.dy, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Deux heurtoirs en cuivre forgé (خوّاصة نحاسية مدوّرة)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(doorX + doorW * 0.35, doorY + doorH * 0.6, 3, 0, Math.PI * 2);
    ctx.arc(doorX + doorW * 0.65, doorY + doorH * 0.6, 3, 0, Math.PI * 2);
    ctx.stroke();

    // 3B. Vitrines de devanture avec reflets spéculaires brillants
    const sideSpace = (b.width - doorW) / 2;
    if (sideSpace >= 20) {
      const winW = Math.min(22, sideSpace - 4);
      const winH = Math.min(26, doorH * 0.72);
      const winY = doorY + (doorH - winH) * 0.45;
      const winPositions = [doorX - winW - 3, doorX + doorW + 3];

      winPositions.forEach((wx) => {
        ctx.save();
        ctx.fillStyle = doorColor;
        ctx.fillRect(wx - 1.5, winY - 1.5, winW + 3, winH + 3);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1;
        ctx.strokeRect(wx - 1.5, winY - 1.5, winW + 3, winH + 3);

        const isNightNow = this.skyPhase >= 0.52;
        ctx.fillStyle = (isProducing || isNightNow) ? '#fef08a' : '#0284c7';
        ctx.fillRect(wx, winY, winW, winH);

        const glossGrad = ctx.createLinearGradient(wx, winY, wx + winW, winY + winH);
        glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
        glossGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.15)');
        glossGrad.addColorStop(0.36, 'rgba(255, 255, 255, 0)');
        glossGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0)');
        glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0.22)');
        ctx.fillStyle = glossGrad;
        ctx.fillRect(wx, winY, winW, winH);

        ctx.strokeStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(wx + winW / 2, winY);
        ctx.lineTo(wx + winW / 2, winY + winH);
        ctx.moveTo(wx, winY + winH / 2);
        ctx.lineTo(wx + winW, winY + winH / 2);
        ctx.stroke();
        ctx.restore();
      });
    }

    // 3C. Tente de soleil rayée (auvent) au-dessus de la porte
    const awningW = Math.min(b.width - 8, doorW + 44);
    const awningX = x + (b.width - awningW) / 2;
    const awningY = doorY - 7;
    const awningH = 8.5;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.fillRect(awningX, awningY + awningH, awningW, 3);

    const stripeCount = Math.max(5, Math.floor(awningW / 8));
    const stripeW = awningW / stripeCount;
    for (let si = 0; si < stripeCount; si++) {
      ctx.fillStyle = si % 2 === 0 ? (b.color === '#e11d48' ? '#b91c1c' : '#dc2626') : '#ffffff';
      ctx.fillRect(awningX + si * stripeW, awningY, stripeW, awningH);
      ctx.beginPath();
      ctx.arc(awningX + si * stripeW + stripeW / 2, awningY + awningH, stripeW / 2, 0, Math.PI);
      ctx.fill();
    }
    ctx.restore();

    // 3D. Lanterne de nuit chaleureuse à l'entrée
    if (this.skyPhase >= 0.48) {
      const lanternPositions = [doorX - 5, doorX + doorW + 5];
      lanternPositions.forEach(lx => {
        ctx.save();
        const glow = ctx.createRadialGradient(lx, doorY + 6, 2, lx, doorY + 6, 24);
        glow.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
        glow.addColorStop(0.6, 'rgba(251, 146, 60, 0.22)');
        glow.addColorStop(1, 'rgba(251, 146, 60, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(lx, doorY + 6, 24, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(lx, doorY + 6, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      });
    }

    // 4. Balcon en fer forgé / Moucharabieh à l'étage supérieur (uniquement si espace suffisant)
    const balcY = y + 54;
    if (doorY - balcY >= 28 && bHeight >= 135) {
      const balcW = Math.min(b.width - 26, 68);
      const balcX = x + (b.width - balcW) / 2;
      const balcH = 14;

      // Volets médina en bois ouverts
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(balcX + 4, balcY - 12, 10, 16);
      ctx.fillRect(balcX + balcW - 14, balcY - 12, 10, 16);

      // Fenêtre éclairée
      ctx.fillStyle = isProducing ? '#fef08a' : 'rgba(15, 23, 42, 0.6)';
      ctx.fillRect(balcX + 16, balcY - 12, balcW - 32, 16);

      // Garde-corps galbé en fer forgé noir (حديد زلابية)
      ctx.strokeStyle = '#090d16';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(balcX, balcY, balcW, balcH);
      for (let bx = balcX + 4; bx < balcX + balcW; bx += 8) {
        ctx.beginPath();
        ctx.moveTo(bx, balcY);
        ctx.lineTo(bx, balcY + balcH);
        ctx.stroke();
      }
    }

    // Barre de progression du cycle de production : affichée UNIQUEMENT si personnel recruté (hasPersonnel)
    const hasPersonnel = Boolean(biz.hasManager || (biz.hiredManagersCount && biz.hiredManagersCount > 0));

    if (hasPersonnel) {
      const barW = Math.min(b.width - 20, 85);
      const barH = 6;
      const barX = x + (b.width - barW) / 2;
      const barY = y - 10;
      const pct = Math.min(1, Math.max(0, (biz.progressMs || 0) / (biz.cycleDurationMs || 1000)));

      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.beginPath();
      ctx.roundRect(barX - 2, barY - 2, barW + 4, barH + 4, 4);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      if (pct > 0) {
        const fillW = Math.max(4, barW * pct);
        const fillGrad = ctx.createLinearGradient(barX, barY, barX + fillW, barY);
        fillGrad.addColorStop(0, '#10b981');
        fillGrad.addColorStop(1, '#34d399');
        ctx.fillStyle = fillGrad;
        ctx.beginPath();
        ctx.roundRect(barX, barY, fillW, barH, 3);
        ctx.fill();
      }
      ctx.restore();
    } else {
      // Pas de recrutement -> Bulle d'alerte animée invitant impérativement au recrutement
      const tipY = y - 12 + Math.sin(timestamp * 0.007) * 4;
      const tipW = 86;
      const tipX = x + (b.width - tipW) / 2;
      ctx.save();
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 6;
      ctx.fillStyle = 'rgba(185, 28, 28, 0.92)';
      ctx.beginPath();
      ctx.roundRect(tipX, tipY, tipW, 18, 5);
      ctx.fill();
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 9px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👔 يلزمك خدّامة !', tipX + tipW / 2, tipY + 12.5);
      ctx.restore();
    }

    // Interaction épurée et authentique :
    // 1. Clic sur la porte tunisienne cloutée -> Entrer dans le projet
    const canAfford = this.engine.dinars >= this.engine.getCost(biz);
    const doorInteractW = doorW + 16;
    const doorInteractH = doorH + 20;
    const doorInteractX = doorX - 8;
    const doorInteractY = doorY - 10;

    // Heurtoir et poignée dorée intégrés (interaction directe sur la façade et la porte)
    ctx.save();
    // Cloutage traditionnel tunisien et anneau de heurtoir
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(doorX + doorW / 2, doorY + doorH * 0.45, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(doorX + doorW / 2, doorY + doorH * 0.45 + 3, 3.5, 0, Math.PI);
    ctx.stroke();
    ctx.restore();

    // Seuil et heurtoir discrets : porte pour visiter/inspecter l'intérieur, façade pour servir et encaisser
    // 1. Hitbox façade complète = servir et encaisser dans le quartier (SANS ouvrir de modale)
    this.interactiveHitboxes.push({
      x: x,
      y: y,
      w: b.width,
      h: bHeight,
      action: 'collect',
      bizId: b.id
    });

    // 2. Hitbox porte sculptée : UNIQUEMENT active si le projet est acheté (level > 0)
    if (level > 0) {
      this.interactiveHitboxes.push({
        x: doorX - 2,
        y: doorY - 4,
        w: doorW + 4,
        h: doorH + 6,
        action: 'inspect',
        bizId: b.id
      });
    }

    ctx.restore();
  }


  drawHouse(ctx, hItem, x, groundY, timestamp) {
    const maxAllowedH = Math.max(95, groundY - 46);
    const bHeight = Math.min(hItem.height || 120, maxAllowedH);
    const y = groundY - bHeight;
    const w = hItem.width || 120;

    ctx.save();

    // Ombre au sol
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, groundY, w * 0.52, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Façade de la maison tunisienne
    ctx.fillStyle = hItem.wallColor || '#fef3c7';
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y + 14, w, bHeight - 14, [6, 6, 0, 0]);
    ctx.fill();
    ctx.stroke();

    // Toiture selon le style du quartier
    if (hItem.style === 'medina' || hItem.style === 'djerba') {
      // Coupole blanche traditionnelle + créneaux
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x + w / 2, y + 16, 22, Math.PI, 0);
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.stroke();

      ctx.fillStyle = hItem.doorColor || '#0284c7';
      ctx.fillRect(x - 2, y + 12, w + 4, 5);
    } else if (hItem.style === 'lac') {
      // Immeuble résidentiel moderne en verre & balcons
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x - 3, y + 10, w + 6, 7);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(x + 6, y + 12, w - 12, 2);
    } else {
      // Villa côtière Sidi Bou Saïd / Hammamet avec frise bleue ou tuiles
      ctx.fillStyle = hItem.doorColor || '#0284c7';
      ctx.beginPath();
      ctx.moveTo(x - 4, y + 16);
      ctx.lineTo(x + w + 4, y + 16);
      ctx.lineTo(x + w, y + 6);
      ctx.lineTo(x, y + 6);
      ctx.closePath();
      ctx.fill();
    }

    // Fenêtres / Moucharabieh à l'étage
    const winY = y + 36;
    const winW = 24;
    const winH = 26;
    const winPositions = [x + 16, x + w - 16 - winW];

    winPositions.forEach(wx => {
      ctx.fillStyle = hItem.style === 'lac' ? 'rgba(56, 189, 248, 0.35)' : (hItem.doorColor || '#2563eb');
      ctx.beginPath();
      ctx.roundRect(wx, winY, winW, winH, [10, 10, 2, 2]);
      ctx.fill();

      // Grille fer forgé / Moucharabieh
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(wx + 3, winY + 4, winW - 6, winH - 6);

      // Balcon fleuri (Bougainvillier / Jasmin)
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(wx + 6, winY + winH, 5, 0, Math.PI * 2);
      ctx.arc(wx + winW - 6, winY + winH, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(wx + 5, winY + winH - 2, 2.5, 0, Math.PI * 2);
      ctx.arc(wx + winW - 5, winY + winH - 1, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Porte d'entrée tunisienne arquée ("Bab Arbi" clouté)
    const doorW = 32;
    const doorH = 44;
    const doorX = x + (w - doorW) / 2;
    const doorY = groundY - doorH;

    // Encadrement en pierre / marbre
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.roundRect(doorX - 4, doorY - 4, doorW + 8, doorH + 4, [18, 18, 0, 0]);
    ctx.fill();

    // Porte colorée
    ctx.fillStyle = hItem.doorColor || '#2563eb';
    ctx.beginPath();
    ctx.roundRect(doorX, doorY, doorW, doorH, [15, 15, 0, 0]);
    ctx.fill();

    // Clous noirs traditionnels & heurtoir (Khalkhal)
    ctx.fillStyle = '#0f172a';
    for (let dy = doorY + 10; dy < groundY - 6; dy += 8) {
      ctx.fillRect(doorX + 4, dy, 2, 2);
      ctx.fillRect(doorX + doorW - 6, dy, 2, 2);
    }
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(doorX + doorW / 2 - 5, doorY + 22, 3, 0, Math.PI * 2);
    ctx.arc(doorX + doorW / 2 + 5, doorY + 22, 3, 0, Math.PI * 2);
    ctx.stroke();

    // Pas d'enseigne de texte sur les maisons (façades épurées et authentiques)
    // Antenne parabolique tunisienne réaliste sur le toit (présente sur la plupart des toits tunisiens)
    if (hItem.hasDish !== false && (x % 3 === 0 || hItem.style === 'medina' || hItem.style === 'goulette')) {
      ctx.save();
      const dishX = x + w - 24;
      const dishY = y + 8;
      // Support métallique
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(dishX, dishY + 8);
      ctx.lineTo(dishX + 6, dishY);
      ctx.stroke();
      // Parabole orientée
      ctx.fillStyle = '#cbd5e1';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(dishX + 6, dishY, 9, 5, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Tête LNB
      ctx.strokeStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(dishX + 6, dishY);
      ctx.lineTo(dishX + 2, dishY - 4);
      ctx.stroke();
      ctx.restore();
    }

    // Petit chat ou jasmin animé
    const catBob = Math.sin(timestamp * 0.004 + x) * 1.5;
    ctx.font = '12px serif';
    ctx.fillText('🐈', x + w - 16, groundY - 4 + catBob * 0.3);

    ctx.restore();
  }


  drawGarden(ctx, gItem, x, groundY, timestamp) {
    const w = gItem.width || 95;
    ctx.save();
    // Pelouse / Gazon fleuri
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.roundRect(x, groundY - 14, w, 14, [4, 4, 0, 0]);
    ctx.fill();

    // Palmiers et oliviers
    const treeX = x + w / 2;
    const treeY = groundY - 14;
    // Tronc d'olivier
    ctx.fillStyle = '#78350f';
    ctx.fillRect(treeX - 4, treeY - 38, 8, 38);
    // Feuillage rond luxuriant
    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.arc(treeX, treeY - 44, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(treeX - 6, treeY - 48, 14, 0, Math.PI * 2);
    ctx.arc(treeX + 8, treeY - 46, 12, 0, Math.PI * 2);
    ctx.fill();

    // Fleurs et jasmins
    const flowers = [x + 12, x + 32, x + w - 28, x + w - 12];
    flowers.forEach((fx, idx) => {
      ctx.fillStyle = idx % 2 === 0 ? '#fbcfe8' : '#fef08a';
      ctx.beginPath();
      ctx.arc(fx, groundY - 8, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // --- SQUARE / JARDIN PUBLIC AVEC TOUR DE L'HORLOGE / STATUE ET FONTAINE D'EAU VIVE ANIMÉE ---
  drawMonumentSquare(ctx, mItem, x, groundY, timestamp) {
    const w = mItem.width || 155;
    const timeSec = (timestamp || performance.now()) / 1000;
    ctx.save();

    // 1. ESPLANADE & SQUARE PUBLIC (JARDIN)
    // Pavage en marbre clair et bordures en pierre taillée
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x, groundY - 6, w, 10);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x, groundY - 8, w, 2);

    // Dalles décoratives en calades
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    for (let px = x + 10; px < x + w; px += 20) {
      ctx.beginPath();
      ctx.moveTo(px, groundY - 8);
      ctx.lineTo(px, groundY + 4);
      ctx.stroke();
    }

    // Parterres de pelouse verte taillée
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.roundRect(x + 4, groundY - 14, 26, 7, [3, 3, 0, 0]);
    ctx.roundRect(x + w - 30, groundY - 14, 26, 7, [3, 3, 0, 0]);
    ctx.fill();

    // Buissons de jasmin & fleurs tunisiennes
    const gardenFlowers = [
      { fx: x + 8, color: '#fbcfe8' },
      { fx: x + 17, color: '#ffffff' },
      { fx: x + 25, color: '#fef08a' },
      { fx: x + w - 26, color: '#ffffff' },
      { fx: x + w - 18, color: '#fbcfe8' },
      { fx: x + w - 10, color: '#fef08a' }
    ];
    gardenFlowers.forEach(f => {
      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.arc(f.fx, groundY - 14, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Banc public en fer forgé et bois tunisien
    const benchX = x + 6;
    const benchY = groundY - 16;
    ctx.fillStyle = '#78350f';
    ctx.fillRect(benchX, benchY, 22, 3); // Assise
    ctx.fillRect(benchX, benchY - 5, 22, 2.5); // Dossier
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(benchX + 2, benchY + 3, 2, 6); // Pieds
    ctx.fillRect(benchX + 18, benchY + 3, 2, 6);
    // Petit chat de la médina qui se prélasse sur le banc
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🐱', benchX + 11, benchY - 1);

    // Lampadaire classique en fer forgé
    const lampX = x + w - 16;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(lampX - 1.5, groundY - 48, 3, 42); // Mât
    // Lanterne octogonale chaleureuse
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(lampX, groundY - 48, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
    ctx.beginPath();
    ctx.arc(lampX, groundY - 48, 9, 0, Math.PI * 2);
    ctx.fill();

    // 2. TOUR DE L'HORLOGE & STATUE MONUMENTALE
    const towerX = x + 38;
    const towerW = 28;
    const towerBaseY = groundY - 8;

    // Socle à degrés en pierre de Chemtou
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(towerX - 4, towerBaseY - 12, towerW + 8, 12, [2, 2, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#92400e';
    ctx.fillRect(towerX - 2, towerBaseY - 18, towerW + 4, 6);

    // Fût de la tour (pierres dorées et motifs zelliges)
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(towerX, towerBaseY - 68, towerW, 50);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.strokeRect(towerX, towerBaseY - 68, towerW, 50);

    // Lignes géométriques décoratives
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
    for (let ty = towerBaseY - 64; ty < towerBaseY - 24; ty += 8) {
      ctx.beginPath();
      ctx.moveTo(towerX + 2, ty);
      ctx.lineTo(towerX + towerW - 2, ty);
      ctx.stroke();
    }

    // Arcades mauresques en relief
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(towerX + towerW / 2, towerBaseY - 32, 5, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(towerX + towerW / 2 - 5, towerBaseY - 32, 10, 10);

    // Couronnement de la tour : chambre de l'horloge
    const clockRoomY = towerBaseY - 84;
    ctx.fillStyle = '#b45309';
    ctx.fillRect(towerX - 2, clockRoomY, towerW + 4, 16);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(towerX - 2, clockRoomY, towerW + 4, 16);

    // Grand Cadran de l'Horloge lumineux
    const clockCenterX = towerX + towerW / 2;
    const clockCenterY = clockRoomY + 8;
    const clockRadius = 7.5;
    ctx.fillStyle = '#fffbeb';
    ctx.beginPath();
    ctx.arc(clockCenterX, clockCenterY, clockRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Index des points cardinaux
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(clockCenterX - 0.5, clockCenterY - clockRadius + 1, 1, 2);
    ctx.fillRect(clockCenterX - 0.5, clockCenterY + clockRadius - 3, 1, 2);
    ctx.fillRect(clockCenterX - clockRadius + 1, clockCenterY - 0.5, 2, 1);
    ctx.fillRect(clockCenterX + clockRadius - 3, clockCenterY - 0.5, 2, 1);

    // Aiguilles de l'horloge animées en temps réel
    const realDate = new Date();
    const hours = realDate.getHours() % 12 + realDate.getMinutes() / 60;
    const minutes = realDate.getMinutes() + realDate.getSeconds() / 60;
    const hourAngle = (hours / 12) * Math.PI * 2 - Math.PI / 2;
    const minAngle = (minutes / 60) * Math.PI * 2 - Math.PI / 2;

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    // Aiguille des heures
    ctx.beginPath();
    ctx.moveTo(clockCenterX, clockCenterY);
    ctx.lineTo(clockCenterX + Math.cos(hourAngle) * 3.8, clockCenterY + Math.sin(hourAngle) * 3.8);
    ctx.stroke();
    // Aiguille des minutes
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(clockCenterX, clockCenterY);
    ctx.lineTo(clockCenterX + Math.cos(minAngle) * 5.2, clockCenterY + Math.sin(minAngle) * 5.2);
    ctx.stroke();

    // Toit pyramidal en tuiles vernissées vertes tunisiennes
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.moveTo(towerX - 3, clockRoomY);
    ctx.lineTo(clockCenterX, clockRoomY - 13);
    ctx.lineTo(towerX + towerW + 3, clockRoomY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Flèche dorée sommée d'une statue / croissant étincelant
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(clockCenterX, clockRoomY - 13);
    ctx.lineTo(clockCenterX, clockRoomY - 21);
    ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌙', clockCenterX, clockRoomY - 20);

    // 3. FONTAINE D'EAU VIVE JAILLISSANTE ANIMÉE
    const fX = x + 98;
    const fW = 46;
    const fCenterY = groundY - 6;

    // Grand bassin en marbre avec rebord mouluré
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.ellipse(fX + fW / 2, fCenterY, fW / 2 + 2, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(fX + fW / 2, fCenterY, fW / 2, 7.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Miroir d'eau turquoise
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(fX + fW / 2, fCenterY, fW / 2 - 3, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ondulations concentriques à la surface de l'eau
    const waveRadius = 4 + (Math.sin(timeSec * 3) + 1) * 6;
    ctx.strokeStyle = 'rgba(224, 242, 254, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(fX + fW / 2, fCenterY, Math.min(fW / 2 - 4, waveRadius), Math.min(4.5, waveRadius * 0.35), 0, 0, Math.PI * 2);
    ctx.stroke();

    // Colonne centrale de la fontaine
    const colX = fX + fW / 2;
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(colX - 4, fCenterY - 16, 8, 16);
    // Vasque intermédiaire
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.ellipse(colX, fCenterY - 16, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Vasque supérieure
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(colX - 2.5, fCenterY - 26, 5, 10);
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(colX, fCenterY - 26, 7, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Jet d'eau vertical jaillissant animé (physique d'eau vivante)
    const jetHeight = 18 + Math.sin(timeSec * 5) * 3;
    const jetTopY = fCenterY - 26 - jetHeight;

    // Gerbe principale jaillissante
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(colX, fCenterY - 26);
    ctx.lineTo(colX, jetTopY);
    ctx.stroke();

    // Cascades paraboliques retombantes
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.7)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(colX, jetTopY + 2);
    ctx.quadraticCurveTo(colX - 10, jetTopY + 8, colX - 14, fCenterY - 16);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(colX, jetTopY + 2);
    ctx.quadraticCurveTo(colX + 10, jetTopY + 8, colX + 14, fCenterY - 16);
    ctx.stroke();

    // Débordements de la vasque vers le grand bassin
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.6)';
    ctx.beginPath();
    ctx.moveTo(colX - 10, fCenterY - 15);
    ctx.quadraticCurveTo(colX - 16, fCenterY - 6, colX - 15, fCenterY - 1);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(colX + 10, fCenterY - 15);
    ctx.quadraticCurveTo(colX + 16, fCenterY - 6, colX + 15, fCenterY - 1);
    ctx.stroke();

    // Gouttelettes et embruns étincelants au soleil
    const drops = [
      { dx: -3, dy: -4, speed: 7 },
      { dx: 4, dy: -2, speed: 8 },
      { dx: -7, dy: 6, speed: 6 },
      { dx: 8, dy: 7, speed: 9 },
      { dx: 0, dy: -6, speed: 10 }
    ];
    drops.forEach(d => {
      const dropY = jetTopY + ((timeSec * d.speed * 4) % 24);
      const dropX = colX + d.dx * ((dropY - jetTopY) / 14);
      if (dropY < fCenterY - 2) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(dropX, dropY, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Écusson / Inscription sous l'esplanade
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 7px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⛲ ساحة الساعة والنافورة', x + w / 2, groundY + 12);

    // Hitbox interactive pour faire un vœu dans la fontaine
    this.interactiveHitboxes.push({
      x: fX,
      y: fCenterY - 36,
      w: fW,
      h: 46,
      action: 'fountain_wish',
      bizId: null
    });

    ctx.restore();
  }

  drawServiceStation(ctx, sItem, x, groundY, timestamp) {
    const w = sItem.width || 130;
    const h = 76;
    const y = groundY - h;
    ctx.save();
    // Auvent station Agil / Shell
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.fillRect(x, y, w, 18);
    ctx.strokeRect(x, y, w, 18);

    // Enseigne lumineuse Station
    ctx.fillStyle = '#fbbf24';
    ctx.font = '900 10px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⛽ محطة خدمات وتوزيع الوقود', x + w / 2, y + 13);

    // Piliers de l'auvent
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x + 10, y + 18, 8, h - 18);
    ctx.fillRect(x + w - 18, y + 18, 8, h - 18);

    // Pompe à essence moderne
    const pumpX = x + w / 2 - 14;
    const pumpY = groundY - 34;
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(pumpX, pumpY, 28, 34, 4);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(pumpX + 4, pumpY + 4, 20, 10);
    ctx.fillStyle = '#10b981';
    ctx.font = '900 8px monospace';
    ctx.fillText('2.450', pumpX + 14, pumpY + 12);
    ctx.restore();
  }

  drawBankBranch(ctx, bItem, x, groundY, timestamp) {
    const w = bItem.width || 135;
    const h = 95;
    const y = groundY - h;
    ctx.save();
    // Façade vitrée moderne bancaire avec pilastres dorés
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, [6, 6, 0, 0]);
    ctx.fill();
    ctx.stroke();

    // Enseigne lumineuse Banque
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(x + 6, y + 8, w - 12, 22);
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(x + 6, y + 8, w - 12, 22);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 10.5px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏦 البنك الشعبي', x + w / 2, y + 23);

    // Vitrines et baies vitrées sécurisées
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.fillRect(x + 12, y + 36, w - 24, 22);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.strokeRect(x + 12, y + 36, w - 24, 22);

    // Porte d'entrée sécurisée / Guichet central avec bouton interactif
    const doorW = 42;
    const doorH = 32;
    const doorX = x + (w - doorW) / 2;
    const doorY = groundY - doorH;
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(doorX, doorY, doorW, doorH, [4, 4, 0, 0]);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = '900 8.5px "Cairo", sans-serif';
    ctx.fillText('ادخل 🚪', doorX + doorW / 2, doorY + 18);

    // Distributeur automatique DAB / GAB
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 8, groundY - 38, 22, 38);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 11, groundY - 33, 16, 10);
    ctx.fillStyle = '#fef08a';
    ctx.font = '700 6.5px "Cairo", sans-serif';
    ctx.fillText('DAB', x + 19, groundY - 25);

    // Enregistrement de la hitbox cliquable pour entrer dans la banque
    this.interactiveHitboxes.push({
      x: x,
      y: y,
      w: w,
      h: h,
      action: 'open_bank',
      bizId: null
    });

    ctx.restore();
  }

  drawPoliceStation(ctx, pItem, x, groundY, timestamp) {
    const w = pItem.width || 135;
    const h = 95;
    const y = groundY - h;
    ctx.save();

    // Façade officielle bleu nuit et pierre de sécurité
    ctx.fillStyle = '#0b1329';
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, [6, 6, 0, 0]);
    ctx.fill();
    ctx.stroke();

    // Gyrophare de police clignotant sur le toit (Rouge / Bleu alternatif réaliste)
    const sirenX = x + w / 2;
    const sirenY = y - 7;
    const isBlueCycle = Math.floor(timestamp / 240) % 2 === 0;
    const sirenColor = isBlueCycle ? '#38bdf8' : '#ef4444';
    ctx.fillStyle = sirenColor;
    ctx.shadowColor = sirenColor;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(sirenX, sirenY, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Enseigne officielle Poste de Police
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(x + 6, y + 8, w - 12, 22);
    ctx.strokeStyle = '#60a5fa';
    ctx.strokeRect(x + 6, y + 8, w - 12, 22);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 10px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👮 مركز الأمن والشرطة', x + w / 2, y + 23);

    // Fenêtres à barreaux sécurisées et caméra de surveillance
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 12, y + 36, 32, 18);
    ctx.fillRect(x + w - 44, y + 36, 32, 18);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    for (let bx = x + 18; bx < x + 42; bx += 8) {
      ctx.beginPath();
      ctx.moveTo(bx, y + 36);
      ctx.lineTo(bx, y + 54);
      ctx.stroke();
    }
    for (let bx = x + w - 38; bx < x + w - 14; bx += 8) {
      ctx.beginPath();
      ctx.moveTo(bx, y + 36);
      ctx.lineTo(bx, y + 54);
      ctx.stroke();
    }

    // Caméra de sécurité
    ctx.font = '10px sans-serif';
    ctx.fillText('📹', x + 16, y + 30);

    // Porte blindée centrale avec badge
    const doorW = 40;
    const doorH = 34;
    const doorX = x + (w - doorW) / 2;
    const doorY = groundY - doorH;
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.roundRect(doorX, doorY, doorW, doorH, [4, 4, 0, 0]);
    ctx.fill();
    ctx.strokeStyle = '#60a5fa';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 8.5px "Cairo", sans-serif';
    ctx.fillText('دورية 🚓', doorX + doorW / 2, doorY + 20);

    // Enregistrement de la hitbox cliquable pour interaction commissariat
    this.interactiveHitboxes.push({
      x: x,
      y: y,
      w: w,
      h: h,
      action: 'open_police',
      bizId: null
    });

    ctx.restore();
  }

  drawTobaccoKiosk(ctx, tItem, x, groundY, timestamp) {
    const w = tItem.width || 125;
    const h = 88;
    const y = groundY - h;
    ctx.save();

    // Façade officielle bordeaux & blanc d'un guichet / bureau de tabac tunisien (قمريڨ ومكتب التبغ والوقيد)
    ctx.fillStyle = '#831843';
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, [6, 6, 0, 0]);
    ctx.fill();
    ctx.stroke();

    // Toit / Auvent rayé bordeaux et or
    ctx.fillStyle = '#be123c';
    ctx.fillRect(x - 2, y, w + 4, 15);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x - 2, y, w + 4, 15);

    // Enseigne officielle Guichet de Tabac & الوقيد (taille calibrée pour zéro débordement)
    ctx.fillStyle = '#fbbf24';
    ctx.font = '900 8.5px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🚬 قمريڨ • بيع التبغ والوقيد', x + w / 2, y + 10.5);

    // Vitrine avec paquets de cigarettes, tabac et timbres fiscaux
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#fda4af';
    ctx.lineWidth = 1;
    ctx.fillRect(x + 10, y + 21, w - 20, 36);
    ctx.strokeRect(x + 10, y + 21, w - 20, 36);

    // Articles en rayon (Cigarettes 20 Mars, Cristal, Timbres fiscaux)
    ctx.font = '11px sans-serif';
    ctx.fillText('🚬', x + 24, y + 36);
    ctx.fillText('🔥', x + w / 2, y + 36);
    ctx.fillText('🎟️', x + w - 24, y + 36);

    ctx.fillStyle = '#fde047';
    ctx.font = '800 7px "Cairo", sans-serif';
    ctx.fillText('20 مارص • كريستال • طوابع جبائية', x + w / 2, y + 50);

    // Guichet de vente ouvert en bas
    const counterW = 46;
    const counterH = 26;
    const counterX = x + (w - counterW) / 2;
    const counterY = groundY - counterH;

    // Buraliste visible derrière la vitre du guichet
    const sellerX = counterX + counterW / 2;
    const sellerY = counterY - 2;
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(sellerX - 7, sellerY - 14, 14, 14, 3);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(sellerX, sellerY - 18, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(sellerX, sellerY - 20, 5, Math.PI, 0);
    ctx.fill();

    const to = this.tobaccoOrder;
    if (to && to.sellerBubble) {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.beginPath();
      ctx.roundRect(sellerX - 35, sellerY - 40, 70, 15, 4);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(to.sellerBubble, sellerX, sellerY - 29);
      ctx.restore();
    }

    ctx.fillStyle = '#9f1239';
    ctx.fillRect(counterX, counterY, counterW, counterH);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(counterX, counterY, counterW, counterH);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 8px "Cairo", sans-serif';
    ctx.fillText('شباك البيع 🪙', counterX + counterW / 2, counterY + 16);

    // Client piéton au guichet (s'arrête, commande, paie et s'en va)
    if (to && to.state !== 'idle') {
      const custScreenX = to.currentCustomerX - this.cameraX;
      if (custScreenX > -40 && custScreenX < this.width + 40) {
        ctx.save();
        const walkBounce = (to.state === 'approaching' || to.state === 'leaving') ? Math.abs(Math.sin(to.customerWalkCycle)) * 2 : 0;
        ctx.translate(custScreenX, groundY - walkBounce);

        // Ombre
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 7, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Corps
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.roundRect(-5, -22, 10, 15, 2.5);
        ctx.fill();

        // Jambes
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-4, -7, 3, 7);
        ctx.fillRect(1, -7, 3, 7);

        // Tête
        ctx.fillStyle = '#fde68a';
        ctx.beginPath();
        ctx.arc(0, -27, 5, 0, Math.PI * 2);
        ctx.fill();

        // Paquet en main si servi
        if (to.carriedPack) {
          ctx.font = '10px serif';
          ctx.textAlign = 'center';
          ctx.fillText('🚬', 6, -14);
        } else if (to.state === 'paying') {
          ctx.font = '8.5px serif';
          ctx.fillText('🪙', -6, -14);
        }
        ctx.restore();

        // Bulle client
        if (to.customerBubble) {
          ctx.save();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.beginPath();
          ctx.roundRect(custScreenX - 38, groundY - 45, 76, 14, 4);
          ctx.fill();
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 7px "Cairo", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(to.customerBubble, custScreenX, groundY - 35);
          ctx.restore();
        }
      }
    }

    // Hitbox cliquable pour interaction guichet de tabac
    this.interactiveHitboxes.push({
      x: x,
      y: y,
      w: w,
      h: h,
      action: 'open_tobacco',
      bizId: null
    });

    ctx.restore();
  }

  drawCrossroad(ctx, cItem, x, groundY, h, timestamp) {
    const w = cItem.width || 135;
    const roadY = groundY + 20;

    ctx.save();

    // 1. Perspective de la route royale / autoroute menant aux autres villes tunisiennes
    const backTopY = Math.max(76, groundY - 110);
    const topW = w * 0.52;
    const topX = x + (w - topW) / 2;

    // Collines ou paysages tunisiens au loin (silhouettes d'oliviers et minaret)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(topX + topW * 0.3, backTopY + 2, 22, Math.PI, 0, false);
    ctx.arc(topX + topW * 0.7, backTopY + 2, 28, Math.PI, 0, false);
    ctx.fill();

    // Petit minaret tunisien lointain à l'horizon
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(topX + topW * 0.48, backTopY - 26, 7, 26);
    ctx.beginPath();
    ctx.moveTo(topX + topW * 0.48 - 1, backTopY - 26);
    ctx.lineTo(topX + topW * 0.48 + 3.5, backTopY - 33);
    ctx.lineTo(topX + topW * 0.48 + 8, backTopY - 26);
    ctx.closePath();
    ctx.fill();
    // Lanterne du minaret dorée
    ctx.fillStyle = '#fde047';
    ctx.fillRect(topX + topW * 0.48 + 2, backTopY - 24, 3, 3);

    // Chaussée royale d'autoroute en perspective avec asphalte moderne et reflets dorés
    const alleyGrad = ctx.createLinearGradient(0, backTopY, 0, roadY);
    alleyGrad.addColorStop(0, '#0c1322');
    alleyGrad.addColorStop(0.5, '#1e293b');
    alleyGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = alleyGrad;
    ctx.beginPath();
    ctx.moveTo(topX, backTopY);
    ctx.lineTo(topX + topW, backTopY);
    ctx.lineTo(x + w, roadY);
    ctx.lineTo(x, roadY);
    ctx.closePath();
    ctx.fill();

    // Trottoirs latéraux et glissières de sécurité en pierre taillée Kadhel
    const curbGrad = ctx.createLinearGradient(x, 0, x + w, 0);
    curbGrad.addColorStop(0, '#78350f');
    curbGrad.addColorStop(0.5, '#b45309');
    curbGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = curbGrad;
    ctx.beginPath();
    ctx.moveTo(topX - 6, backTopY);
    ctx.lineTo(topX, backTopY);
    ctx.lineTo(x + 10, roadY);
    ctx.lineTo(x - 4, roadY);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(topX + topW, backTopY);
    ctx.lineTo(topX + topW + 6, backTopY);
    ctx.lineTo(x + w + 4, roadY);
    ctx.lineTo(x + w - 10, roadY);
    ctx.closePath();
    ctx.fill();

    // Lignes de guidage dorées lumineuses sur l'autoroute
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(topX, backTopY);
    ctx.lineTo(x + 8, roadY);
    ctx.moveTo(topX + topW, backTopY);
    ctx.lineTo(x + w - 8, roadY);
    ctx.stroke();

    // Ligne centrale lumineuse avec tirets animés de route
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
    ctx.lineWidth = 2.2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(x + w / 2, backTopY + 4);
    ctx.lineTo(x + w / 2, roadY - 10);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arche monumentale supprimée selon la demande explicite de l'utilisateur.
    // Vue dégagée sur l'horizon et les paysages tunisiens au loin.

    // Lampadaire tunisien à halo chaud au coin du carrefour
    const lampX = x + w - 12;
    const lampTopY = groundY - 64;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lampX, groundY + 2);
    ctx.lineTo(lampX, lampTopY);
    ctx.arc(lampX - 6, lampTopY, 6, 0, Math.PI, true);
    ctx.stroke();

    const lampGlow = ctx.createRadialGradient(lampX - 12, lampTopY + 2, 2, lampX - 12, lampTopY + 2, 24);
    lampGlow.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
    lampGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = lampGlow;
    ctx.beginPath();
    ctx.arc(lampX - 12, lampTopY + 2, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(lampX - 12, lampTopY + 2, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // 2. Passages piétons 3D bicolores (Zebra crossing horizontal & vertical)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    for (let zx = x + 12; zx < x + w - 14; zx += 14) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
      ctx.fillRect(zx + 1, groundY + 4, 8, 13);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      ctx.fillRect(zx, groundY + 3, 8, 13);
    }

    const boulevardH = Math.max(36, h - roadY);
    for (let zy = roadY + 4; zy < roadY + boulevardH - 6; zy += 10) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
      ctx.fillRect(x + 7, zy + 1, 18, 5);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(x + 6, zy, 18, 5);
    }

    // 3. Feu tricolore animé (🚦) avec halos lumineux
    const poleX = x + 14;
    const poleBottomY = groundY + 4;
    const poleTopY = groundY - 68;

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(poleX, poleBottomY);
    ctx.lineTo(poleX, poleTopY);
    ctx.stroke();

    ctx.fillStyle = '#090d16';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(poleX - 7, poleTopY - 6, 14, 34, 4);
    ctx.fill();
    ctx.stroke();

    const lightCycle = Math.floor(timestamp / 2000) % 3;
    const activeColors = ['#ef4444', '#facc15', '#10b981'];
    const dimColors = ['#450a0a', '#422006', '#064e3b'];
    const activeIdx = lightCycle === 2 ? 0 : lightCycle === 1 ? 1 : 2;

    for (let idx = 0; idx < 3; idx++) {
      const ly = poleTopY + 1 + idx * 10;
      if (idx === activeIdx) {
        ctx.save();
        ctx.shadowColor = activeColors[idx];
        ctx.shadowBlur = 8;
        ctx.fillStyle = activeColors[idx];
        ctx.beginPath();
        ctx.arc(poleX, ly, 3.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = dimColors[idx];
        ctx.beginPath();
        ctx.arc(poleX, ly, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Route nationale continue vers l'horizon (navigation street fluide sans bouton obstructif)
    ctx.restore();
  }

  drawTunisianFlag(ctx, x, y, timestamp) {
    ctx.save();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + 26);
    ctx.lineTo(x, y);
    ctx.stroke();

    const wave = Math.sin(timestamp * 0.006 + x) * 2.5;

    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 10, y + wave, x + 20, y);
    ctx.lineTo(x + 20, y + 12);
    ctx.quadraticCurveTo(x + 10, y + 12 + wave, x, y + 12);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + 10, y + 6 + wave * 0.5, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.arc(x + 10.5, y + 6 + wave * 0.5, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + 11.2, y + 6 + wave * 0.5, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawBoulevardStreet(ctx, camX, w, h, curbY = 255) {
    const roadY = curbY + 20;

    ctx.fillStyle = '#334155';
    ctx.fillRect(0, curbY, w, 20);

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    for (let px = - (camX % 20); px < w; px += 20) {
      ctx.beginPath();
      ctx.moveTo(px, curbY);
      ctx.lineTo(px, roadY);
      ctx.stroke();
    }

    for (let bx = - (camX % 30); bx < w; bx += 30) {
      ctx.fillStyle = ((Math.floor((bx + camX) / 30)) % 2 === 0) ? '#facc15' : '#1e293b';
      ctx.fillRect(bx, roadY - 4, 30, 4);
    }

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, roadY, w, Math.max(40, h - roadY));

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 18]);
    ctx.lineDashOffset = -camX;
    ctx.beginPath();
    ctx.moveTo(0, roadY + 22);
    ctx.lineTo(w, roadY + 22);
    ctx.stroke();
    ctx.setLineDash([]);

    // --- FLAQUES D'EAU SUR L'ASPHALTE AVEC REFLETS & ONDULATIONS DE PLUIE ---
    if (this.rainIntensity > 0.05) {
      for (const px of this.puddles) {
        const screenX = px - camX;
        if (screenX > -70 && screenX < w + 70) {
          const puddleAlpha = Math.min(0.72, this.rainIntensity * 0.7);
          ctx.save();
          // Fond d'eau sombre avec reflet du ciel
          ctx.fillStyle = `rgba(30, 58, 138, ${puddleAlpha * 0.48})`;
          ctx.beginPath();
          ctx.ellipse(screenX, roadY + 22, 28, 6.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Reflet bleu ciel brillant au centre de la flaque
          ctx.fillStyle = `rgba(56, 189, 248, ${puddleAlpha * 0.35})`;
          ctx.beginPath();
          ctx.ellipse(screenX - 3, roadY + 21, 20, 4, -0.05, 0, Math.PI * 2);
          ctx.fill();

          // Bordure mouillée scintillante
          ctx.strokeStyle = `rgba(186, 230, 253, ${puddleAlpha * 0.55})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();

          // Anneaux d'ondulation concentriques causés par les gouttes de pluie
          const rippleNow = (performance.now() * 0.015 + px);
          const r1 = (rippleNow % 16);
          const r1Alpha = Math.max(0, 1 - r1 / 16) * puddleAlpha;
          ctx.strokeStyle = `rgba(255, 255, 255, ${r1Alpha * 0.75})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.ellipse(screenX - 5, roadY + 22, r1, r1 * 0.28, 0, 0, Math.PI * 2);
          ctx.stroke();

          const r2 = ((rippleNow + 8) % 16);
          const r2Alpha = Math.max(0, 1 - r2 / 16) * puddleAlpha;
          ctx.strokeStyle = `rgba(255, 255, 255, ${r2Alpha * 0.65})`;
          ctx.beginPath();
          ctx.ellipse(screenX + 7, roadY + 23, r2, r2 * 0.26, 0, 0, Math.PI * 2);
          ctx.stroke();

          ctx.restore();
        }
      }
    }
  }

  drawVehicle(ctx, x, y, t, timestamp) {
    ctx.save();
    const bob = Math.sin(timestamp * 0.018 + x * 0.1) * 0.8;
    const isRight = t.dir > 0;
    const vW = (t.type === 'taxi_collectif' || t.type === 'louage') ? 62 : 50;

    // Ombre portée sous le véhicule
    ctx.fillStyle = 'rgba(0, 0, 0, 0.52)';
    ctx.beginPath();
    ctx.ellipse(x + vW / 2, y + 2, vW * 0.48, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Orientation automatique selon la direction de circulation
    ctx.translate(x + vW / 2, y + bob);
    if (!isRight) ctx.scale(-1, 1);
    ctx.translate(-vW / 2, 0);

    if (t.type === 'police_patrol') {
      // Voiture de Police Nationale Tunisienne (Blanche avec bandes bleues et gyrophare clignotant)
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 1.4;

      // Bas de caisse blanc
      ctx.beginPath();
      ctx.roundRect(0, -15, 52, 11, [3, 6, 2, 2]);
      ctx.fill();
      ctx.stroke();

      // Bande latérale bleue de la police tunisienne
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(0, -10, 52, 4);

      // Inscription "POLICE" ou symbole
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 6px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('POLICE 🇹🇳', 26, -7);

      // Habitacle profilé
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(9, -15);
      ctx.lineTo(15, -23);
      ctx.lineTo(35, -23);
      ctx.lineTo(43, -15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Gyrophare bicolore clignotant d'urgence (Rouge / Bleu alternatif rapide)
      const flashFast = Math.floor(timestamp / 100) % 2 === 0;
      ctx.fillStyle = flashFast ? '#ef4444' : '#38bdf8';
      ctx.shadowColor = flashFast ? '#ef4444' : '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.fillRect(23, -28, 8, 5);
      ctx.shadowBlur = 0;

      // Vitres teintées
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(13, -21, 10, 6);
      ctx.fillRect(26, -21, 12, 6);
    } else if (t.type === 'taxi_collectif' || t.type === 'louage') {
      const isLouage = t.type === 'louage';
      // Carrosserie minibus (Jaune Taxi Collectif ou Blanc Louage)
      ctx.fillStyle = isLouage ? '#f8fafc' : '#facc15';
      ctx.strokeStyle = isLouage ? '#cbd5e1' : '#ca8a04';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(0, -24, 62, 19, [5, 8, 3, 3]);
      ctx.fill();
      ctx.stroke();

      // Bande latérale officielle (Bleue pour Taxi Collectif, Rouge pour Louage)
      ctx.fillStyle = isLouage ? '#dc2626' : '#2563eb';
      ctx.fillRect(1, -13, 60, 4);

      // Galerie de toit + enseigne lumineuse
      ctx.fillStyle = '#334155';
      ctx.fillRect(12, -26, 28, 2);
      ctx.fillStyle = isLouage ? '#2563eb' : '#ef4444';
      ctx.beginPath();
      ctx.roundRect(22, -30, 16, 5, 2);
      ctx.fill();

      // Vitres passagers teintées avec reflets
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(6, -22, 13, 8);
      ctx.fillRect(22, -22, 14, 8);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(39, -22, 16, 8);
    } else {
      // Berline (Taxi individuel jaune tunisien ou Citadine rouge)
      const isRed = t.type === 'citadine_rouge';
      ctx.fillStyle = isRed ? '#e11d48' : '#eab308';
      ctx.strokeStyle = isRed ? '#9f1239' : '#a16207';
      ctx.lineWidth = 1.2;

      // Bas de caisse
      ctx.beginPath();
      ctx.roundRect(0, -14, 50, 10, [3, 5, 2, 2]);
      ctx.fill();
      ctx.stroke();

      // Habitacle profilé
      ctx.beginPath();
      ctx.moveTo(8, -14);
      ctx.lineTo(14, -22);
      ctx.lineTo(34, -22);
      ctx.lineTo(41, -14);
      ctx.closePath();
      ctx.fill();

      // Lumineux "TAXI" sur le toit du taxi individuel
      if (!isRed) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(21, -26, 9, 4);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(23, -25, 5, 2);
      }

      // Vitres
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(11, -14);
      ctx.lineTo(15, -20);
      ctx.lineTo(24, -20);
      ctx.lineTo(24, -14);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(26, -14);
      ctx.lineTo(26, -20);
      ctx.lineTo(33, -20);
      ctx.lineTo(39, -14);
      ctx.fill();
    }

    // Pare-chocs chromés
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-1, -7, 4, 3);
    ctx.fillRect(vW - 3, -7, 4, 3);

    // Faisceau de phare avant & feu arrière
    const beamGrad = ctx.createLinearGradient(vW, -10, vW + 28, -6);
    beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.55)');
    beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(vW, -12);
    ctx.lineTo(vW + 28, -17);
    ctx.lineTo(vW + 28, -3);
    ctx.lineTo(vW, -7);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.fillRect(vW - 2, -12, 3, 4);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(0, -12, 2.5, 4);

    // Roues avec jantes métalliques en rotation
    const wheelPositions = [12, vW - 13];
    const wheelAngle = (timestamp * 0.015) % (Math.PI * 2);
    wheelPositions.forEach(wx => {
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(wx, -3, 5.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(wx, -3, 2.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(wx - Math.cos(wheelAngle) * 2.5, -3 - Math.sin(wheelAngle) * 2.5);
      ctx.lineTo(wx + Math.cos(wheelAngle) * 2.5, -3 + Math.sin(wheelAngle) * 2.5);
      ctx.stroke();
    });

    ctx.restore();
  }

  drawCat(ctx, x, y, c, timestamp) {
    ctx.save();
    const bob = Math.sin(timestamp * 0.015 + x * 0.2) * 1.2;
    ctx.translate(x, y + bob);
    if (c.dir < 0) ctx.scale(-1, 1);

    // Ombre sous le chat
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 3, 7, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Corps du chat
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tête
    ctx.beginPath();
    ctx.arc(5, -2, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Oreilles pointues
    ctx.fillStyle = c.earColor;
    ctx.beginPath();
    ctx.moveTo(3.5, -5);
    ctx.lineTo(5, -8);
    ctx.lineTo(6.5, -5);
    ctx.closePath();
    ctx.fill();

    // Queue ondulante
    const tailWave = Math.sin(timestamp * 0.008 + x) * 2.5;
    ctx.strokeStyle = c.color;
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.quadraticCurveTo(-9, -4 + tailWave, -11, -8);
    ctx.stroke();

    ctx.restore();
  }

  drawPedestrian(ctx, x, y, p, timestamp) {
    ctx.save();
    const isRainingNow = this.rainIntensity > 0.25;
    const isRunning = isRainingNow && !p.hasUmbrella;

    const cycleRate = isRunning ? 0.024 : 0.01;
    const walkCycle = timestamp * cycleRate + (p.phase || 0) + p.x * 0.08;
    const stride = Math.sin(walkCycle) * (isRunning ? 7.5 : 4.5);
    const bounce = Math.abs(Math.cos(walkCycle)) * (isRunning ? 3.0 : 1.8);
    const dir = p.speed >= 0 ? 1 : -1;

    // Ombre portée au sol
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    ctx.beginPath();
    ctx.ellipse(x, y + 6, isRunning ? 9 : 7, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(x, y - bounce);
    if (dir < 0) ctx.scale(-1, 1);

    // Si le piéton court sous la pluie sans parapluie : corps penché en avant !
    if (isRunning) {
      ctx.rotate(0.24);
    }

    // Jambes animées en marche / course
    ctx.strokeStyle = p.pants || '#1e293b';
    ctx.lineWidth = isRunning ? 3.2 : 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-1, -4);
    ctx.lineTo(-1 - stride * 0.7, 5);
    ctx.moveTo(1, -4);
    ctx.lineTo(1 + stride * 0.7, 5);
    ctx.stroke();

    // Buste / Tunique / Veste
    ctx.fillStyle = p.coat || '#0284c7';
    ctx.beginPath();
    ctx.roundRect(-4.5, -14, 9, 11, 3.5);
    ctx.fill();

    // Bras oscillant ou protection sous la pluie
    ctx.strokeStyle = p.coat || '#0284c7';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    if (isRunning) {
      // Bras levés au-dessus de la tête pour tenter de s'abriter sous l'averse !
      ctx.moveTo(-3, -12);
      ctx.lineTo(-2, -22);
      ctx.lineTo(3, -21);
      ctx.stroke();
    } else if (isRainingNow && p.hasUmbrella) {
      // Bras levé tenant le mât du parapluie
      const uPoleX = stride * 0.35 + 2;
      ctx.moveTo(0, -12);
      ctx.lineTo(uPoleX, -16);
      ctx.stroke();

      // Mât du parapluie
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(uPoleX, -10);
      ctx.lineTo(uPoleX, -28);
      ctx.stroke();

      // Dôme du parapluie coloré déployé au-dessus de la tête
      ctx.save();
      const uX = uPoleX;
      const uY = -28;
      ctx.fillStyle = p.umbrellaColor || '#ef4444';
      ctx.beginPath();
      ctx.arc(uX, uY, 15, Math.PI, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // Baleines fines du dôme
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(uX, uY - 15);
      ctx.lineTo(uX - 8, uY);
      ctx.moveTo(uX, uY - 15);
      ctx.lineTo(uX + 8, uY);
      ctx.stroke();

      // Pointe dorée du parapluie au sommet
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(uX - 1, uY - 18, 2, 3.5);
      ctx.restore();
    } else {
      ctx.moveTo(0, -12);
      ctx.lineTo(stride * 0.6, -5);
      ctx.stroke();
    }

    if (p.prop === 'couffin') {
      // Couffin tunisien en osier tressé
      ctx.fillStyle = '#eab308';
      ctx.strokeStyle = '#a16207';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(stride * 0.6 - 4, -4);
      ctx.lineTo(stride * 0.6 + 4, -4);
      ctx.lineTo(stride * 0.6 + 3, 2);
      ctx.lineTo(stride * 0.6 - 3, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (p.prop === 'bag') {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(stride * 0.6 - 2.5, -4, 5, 5.5);
    }

    // Article pris au vol dans un des commerces traversés
    if (p.carriedItem) {
      ctx.font = '11px serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.carriedItem, stride * 0.6 + 6, -3);
    }

    // Tête
    ctx.fillStyle = p.skin || '#fcd34d';
    ctx.beginPath();
    ctx.arc(0, -18, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Coiffure / Chéchia rouge / Foulard / Casquette
    if (p.hat === 'chechia') {
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(0, -19.5, 4.5, Math.PI, 0);
      ctx.fill();
      // Gland noir de la chéchia
      ctx.strokeStyle = '#090d16';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-2, -22);
      ctx.lineTo(-4.5, -19);
      ctx.stroke();
    } else if (p.hat === 'hijab') {
      ctx.fillStyle = p.coat || '#e11d48';
      ctx.beginPath();
      ctx.arc(-0.5, -18.2, 4.8, Math.PI * 0.65, Math.PI * 2.15);
      ctx.fill();
    } else if (p.hat === 'cap') {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(0, -19.5, 4.5, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(1, -20, 5.5, 1.5);
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-0.5, -19.5, 4.5, Math.PI * 0.85, Math.PI * 2.05);
      ctx.fill();
    }

    // Oeil expressif
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1.8, -18.8, 1.3, 1.3);

    ctx.restore();

    // Bulle de dialogue tunisienne
    if (p.bubbleText) {
      ctx.font = '900 10.5px "Cairo", sans-serif';
      const textW = ctx.measureText(p.bubbleText).width;
      const bW = textW + 14;
      const bH = 19;
      const bX = x - bW / 2;
      const bY = y - 41;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(bX, bY, bW, bH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x - 3, bY + bH);
      ctx.lineTo(x + 3, bY + bH);
      ctx.lineTo(x, bY + bH + 4);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.fillText(p.bubbleText, x, bY + 13);
    }

    ctx.restore();
  }

  drawMinimapTrack(ctx, w, h) {
    const trackW = 160;
    const trackH = 4;
    const trackX = (w - trackW) / 2;
    const trackY = h - 10;

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.roundRect(trackX, trackY, trackW, trackH, 2);
    ctx.fill();

    const visibleRatio = w / this.worldWidth;
    const thumbW = Math.max(20, trackW * visibleRatio);
    const progress = this.cameraX / (this.worldWidth - w);
    const thumbX = trackX + progress * (trackW - thumbW);

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.roundRect(thumbX, trackY - 1, thumbW, trackH + 2, 3);
    ctx.fill();
    ctx.restore();
  }

  drawInCanvasOffersHUD(ctx, w, h, timestamp) {
    const o = this.hudOffers;
    const r = 24; // Rayon généreux et hautement tactile (48x48px)
    const topY = 32;

    ctx.save();

    const draw3DOrbIcon = (cx, cy, icon, baseColor, borderColor, badgeText, badgeBg) => {
      // Ombre portée
      ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
      ctx.beginPath();
      ctx.arc(cx, cy + 2.5, r, 0, Math.PI * 2);
      ctx.fill();

      // Dégradé radial métallique / verre 3D
      const orbGrad = ctx.createRadialGradient(cx - 5, cy - 5, 2, cx, cy, r);
      orbGrad.addColorStop(0, borderColor);
      orbGrad.addColorStop(0.35, baseColor);
      orbGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = orbGrad;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Reflet spéculaire supérieur (effet bijou / verre bombé)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 9, r * 0.65, r * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Icône centrale
      ctx.font = '22px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(icon, cx, cy + 1);

      // Pastille de notification
      if (badgeText) {
        ctx.fillStyle = badgeBg || '#ef4444';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx + 14, cy - 14, 8.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 9.5px "Cairo", sans-serif';
        ctx.fillText(badgeText, cx + 14, cy - 13.5);
      }
    };

    // 1. Bulle Carte de Tunisie en haut à droite (Bulle royale, ultra-visible et pulsante)
    const mapBtnR = 28;
    const mapBtnX = w - 44;
    const mapBtnY = topY + 6;
    const mapPulse = Math.sin(timestamp * 0.005) * 5 + 10;

    ctx.save();
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = mapPulse;

    // Halo circulaire externe pulsant doré avec double anneau lumineux
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(mapBtnX, mapBtnY, mapBtnR + 3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(mapBtnX, mapBtnY, mapBtnR + 1, 0, Math.PI * 2);
    ctx.stroke();

    // Dégradé royal bleu saphir / azur lumineux
    const mapGrad = ctx.createRadialGradient(mapBtnX - 8, mapBtnY - 8, 3, mapBtnX, mapBtnY, mapBtnR);
    mapGrad.addColorStop(0, '#bae6fd');
    mapGrad.addColorStop(0.3, '#38bdf8');
    mapGrad.addColorStop(0.7, '#0284c7');
    mapGrad.addColorStop(1, '#082f49');
    ctx.fillStyle = mapGrad;
    ctx.beginPath();
    ctx.arc(mapBtnX, mapBtnY, mapBtnR, 0, Math.PI * 2);
    ctx.fill();

    // Reflet spéculaire supérieur (effet verre bombé 3D)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.ellipse(mapBtnX, mapBtnY - 10, mapBtnR * 0.65, mapBtnR * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();

    // Icône Map 3D
    ctx.font = '26px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🗺️', mapBtnX, mapBtnY - 1);

    // Ruban textuel 'خريطة تونس' sous la bulle
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(mapBtnX - 35, mapBtnY + 18, 70, 17, 6);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = '#fef08a';
    ctx.font = '900 10.5px "Cairo", sans-serif';
    ctx.fillText('خريطة تونس 🇹🇳', mapBtnX, mapBtnY + 27);
    ctx.restore();

    this.interactiveHitboxes.push({
      x: mapBtnX - mapBtnR - 10,
      y: mapBtnY - mapBtnR - 8,
      w: (mapBtnR + 10) * 2,
      h: (mapBtnR + 24) * 2,
      action: 'hud_map',
      bizId: null
    });

    // Bouton Boost Turbo x2 à côté (uniquement via PUB)
    const boostX = mapBtnX - 74;
    draw3DOrbIcon(boostX, topY, '🚀', o.adBoostActive ? '#059669' : '#0284c7', o.adBoostActive ? '#6ee7b7' : '#7dd3fc', o.adBoostActive ? 'x2' : '🎬', '#10b981');
    this.interactiveHitboxes.push({
      x: boostX - r - 8,
      y: topY - r - 8,
      w: (r + 8) * 2,
      h: (r + 8) * 2,
      action: 'hud_boost',
      bizId: null
    });

    // 2. Petites icônes d'alertes 3D animées en haut à gauche DANS le ciel de l'image
    const leftAlerts = [];
    if (o.hasQuest) {
      leftAlerts.push({ action: 'hud_quest', icon: '🎯', bg: '#059669', border: '#6ee7b7', dot: '!' });
    }
    if (o.hasEvent) {
      leftAlerts.push({ action: 'hud_event', icon: '🃏', bg: '#dc2626', border: '#fca5a5', dot: '🔥' });
    }
    if (o.hasDilemma) {
      leftAlerts.push({ action: 'hud_dilemma', icon: '⚖️', bg: '#7e22ce', border: '#d8b4fe', dot: '!' });
    }
    if (o.hasLuckyDrop) {
      leftAlerts.push({ action: 'hud_luckydrop', icon: o.luckyDropIcon || '🎁', bg: '#d97706', border: '#fef08a', dot: '✨' });
    }

    let leftX = 30;
    leftAlerts.forEach((a, idx) => {
      const cy = topY + Math.sin(timestamp * 0.008 + idx) * 2.5;

      // Halo lumineux autour de l'alerte
      ctx.fillStyle = a.border;
      ctx.globalAlpha = 0.25 + (Math.sin(timestamp * 0.01) * 0.15);
      ctx.beginPath();
      ctx.arc(leftX, cy, r + 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;

      draw3DOrbIcon(leftX, cy, a.icon, a.bg, a.border, a.dot, '#f59e0b');

      this.interactiveHitboxes.push({
        x: leftX - r - 6,
        y: topY - r - 6,
        w: (r + 6) * 2,
        h: (r + 6) * 2,
        action: a.action,
        bizId: null
      });

      leftX += (r * 2 + 14);
    });

    ctx.restore();
  }
}



// Implementation of TunisiaMapEngine
export class TunisiaMapEngine {
  constructor(canvasEl, engineRef, options = {}) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.engine = engineRef;
    this.options = options;
    this.onTravel = options.onTravel || null;
    this.onSelect = options.onSelect || null;

    this.animId = null;
    this.lastTime = 0;
    this.dpr = 1;
    this.width = 1040;
    this.height = 760;
    this.scale = 1;

    // Selected city for floating details card
    this.selectedCityId = null;
    this.hoverCityId = null;

    // Caravan transport animation for seamless travel
    this.caravan = null;

    // Pan & Zoom interactifs 2D pour exploration fluide de toute l'Afrique du Nord (Maroc/Mauritanie -> Tunisie -> Libye/Égypte)
    this.panX = -130;
    this.targetPanX = -130;
    this.minPanX = 280;
    this.maxPanX = 720;
    this.panY = 0;
    this.targetPanY = 0;
    this.maxPanY = 320;
    this.zoom = 1.0;
    this.targetZoom = 1.0;
    this.minZoom = 0.55;
    this.maxZoom = 2.6;
    this.pointerVelocityX = 0;
    this.pointerVelocityY = 0;
    this.lastPointerTime = 0;
    this.lastPointerX = 0;
    this.lastPointerY = 0;
    this.pointers = new Map();
    this.initialPinchDist = null;
    this.initialPinchZoom = 1;

    // Effet d'arrivée dans la ville (onde de choc dorée & flash cinématique)
    this.arrivalEffect = null;

    // Les 18 Villes Jouables centrées sur la Tunisie et connectées au Maghreb
    this.cities = [
      {
        id: 'tunis',
        name: 'تونس',
        fullName: 'تونس العاصمة',
        icon: '🕌',
        x: 440,
        y: 115,
        tagline: 'نقطة البداية، أصل التجارة، نصبة كسكروت وفريكاسي في قلب المدينة العربي',
        reqDinars: 0,
        bonusDesc: 'مشاريع العاصمة : كسكروت، فريكاسي، قهوة (+25%)',
        themeClass: 'zone-bab-souika'
      },
      {
        id: 'bizerte',
        name: 'بنزرت',
        fullName: 'بنزرت',
        icon: '⛵',
        x: 410,
        y: 60,
        tagline: 'قنال بنزرت، الحوت المشوي، الكورنيش العتيق وحركة الميناء',
        reqDinars: 2500,
        bonusDesc: 'مشاريع بنزرت والميناء (+25%)',
        themeClass: 'zone-bizerte'
      },
      {
        id: 'nabeul_hammamet',
        name: 'نابل',
        fullName: 'نابل',
        icon: '🏖️',
        x: 508,
        y: 135,
        tagline: 'الفخار، ياسمين الحمامات، زهر نابل والنزل السياحية الفاخرة',
        reqDinars: 8000,
        bonusDesc: 'سياحة الحمامات وحلويات نابل (+30%)',
        themeClass: 'zone-hammamet'
      },
      {
        id: 'beja',
        name: 'باجة',
        fullName: 'باجة',
        icon: '🧀',
        x: 340,
        y: 110,
        tagline: 'مطماطة الشمال، قمح وسمن، مخارق وزلابية وجبن باجة المعتّق',
        reqDinars: 22000,
        bonusDesc: 'الخيرات والمخبوزات الباجية (+30%)',
        themeClass: 'zone-beja'
      },
      {
        id: 'le_kef',
        name: 'الكاف',
        fullName: 'الكاف',
        icon: '🏰',
        x: 315,
        y: 180,
        tagline: 'القصبة العالية، سيدي بومخلوف، برنوس الجبل والتجارة العريقة',
        reqDinars: 60000,
        bonusDesc: 'مشاريع الجبل والقصبة (+35%)',
        themeClass: 'zone-le-kef'
      },
      {
        id: 'sousse',
        name: 'سوسة',
        fullName: 'سوسة',
        icon: '💎',
        x: 488,
        y: 215,
        tagline: 'بوجعفر، القنطاوي، التجارة البحرية وصالونات الشاي العصرية',
        reqDinars: 150000,
        bonusDesc: 'صالونات سوسة والمطاعم الفاخرة (+35%)',
        themeClass: 'zone-sousse'
      },
      {
        id: 'monastir_mahdia',
        name: 'المنستير',
        fullName: 'المنستير',
        icon: '⚓',
        x: 512,
        y: 238,
        tagline: 'رباط المنستير، سقيفة المهدية الكحلة والحوت الشامي الأزرق',
        reqDinars: 350000,
        bonusDesc: 'مشاريع الساحل والنزل الكبرى (+40%)',
        themeClass: 'zone-monastir'
      },
      {
        id: 'kairouan',
        name: 'القيروان',
        fullName: 'القيروان',
        icon: '🕌',
        x: 415,
        y: 230,
        tagline: 'فسقية الأغالبة، مقروض القيروان والزرابي الصوفية الفاخرة',
        reqDinars: 800000,
        bonusDesc: 'حلويات القيروان والحرف التقليدية (+40%)',
        themeClass: 'zone-kairouan'
      },
      {
        id: 'sbeitla',
        name: 'سبيطلة',
        fullName: 'سبيطلة',
        icon: '🏛️',
        x: 380,
        y: 285,
        tagline: 'عاصمة سفيطلة الرومانية، المعابد الثلاثة، الكابيتول التاريخي وزيت الزيتون العريق',
        reqDinars: 600000,
        bonusDesc: 'الآثار والتجارة الفلاحية الرومانية (+40%)',
        themeClass: 'zone-sbeitla'
      },
      {
        id: 'annaba',
        name: 'عنابة',
        fullName: 'عنابة (الجزائر)',
        icon: '🇩🇿',
        x: 275,
        y: 115,
        tagline: 'بونة الجزائرية، الميناء التجاري العريق، الفولاذ وسوق التبادل الحدودي المغاربي',
        reqDinars: 80000000,
        bonusDesc: 'التجارة المغاربية والاستيراد والتصدير مع الجزائر (x2.5)',
        themeClass: 'zone-annaba'
      },
      {
        id: 'tripoli',
        name: 'طرابلس',
        fullName: 'طرابلس (ليبيا)',
        icon: '🇱🇾',
        x: 645,
        y: 340,
        tagline: 'عروس البحر، باب البحر، أسواق الذهب والتجارة والعبور الدولي المغاربي',
        reqDinars: 120000000,
        bonusDesc: 'التجارة والعبور الدولي مع ليبيا الشقيقة (x3)',
        themeClass: 'zone-tripoli'
      },
      {
        id: 'sfax',
        name: 'صفاقس',
        fullName: 'صفاقس',
        icon: '🏭',
        x: 482,
        y: 320,
        tagline: 'باب الديوان، الزيتونة المباركة، الصناعات الكبرى والخدمة الحارة',
        reqDinars: 2000000,
        bonusDesc: 'الصناعات الصفاقسية والتجارة الكبرى (+50%)',
        themeClass: 'zone-sfax'
      },
      {
        id: 'gafsa',
        name: 'قفصة',
        fullName: 'قفصة',
        icon: '⛏️',
        x: 345,
        y: 345,
        tagline: 'الحوض المنجمي، البركة الرومانية ونخيل قفصة الجبلي التاريخي',
        reqDinars: 4500000,
        bonusDesc: 'نقل قفصة وتجارتها المركزية (+50%)',
        themeClass: 'zone-gafsa'
      },
      {
        id: 'tozeur',
        name: 'توزر',
        fullName: 'توزر',
        icon: '🌴',
        x: 295,
        y: 400,
        tagline: 'دقلة النور، الشبيكة وتامغزة، والواحات الصحراوية العالمية',
        reqDinars: 10000000,
        bonusDesc: 'سياحة الصحراء ووكالات الأسفار (+60%)',
        themeClass: 'zone-tozeur'
      },
      {
        id: 'gabes',
        name: 'قابس',
        fullName: 'قابس',
        icon: '🌊',
        x: 435,
        y: 400,
        tagline: 'الحناء الجبسية، واحة قابس الشاطئية والموانئ التجارية الجنوبية',
        reqDinars: 25000000,
        bonusDesc: 'سوق قابس والمجمعات الصناعية (+75%)',
        themeClass: 'zone-gabes'
      },
      {
        id: 'medenine_zarzis',
        name: 'مدنين',
        fullName: 'مدنين',
        icon: '🏺',
        x: 460,
        y: 465,
        tagline: 'قصور مدنين، بحر جرجيس والزيتون الروماني العريق',
        reqDinars: 60000000,
        bonusDesc: 'الموانئ والتجارة المغاربية الجنوبية (x2)',
        themeClass: 'zone-medenine'
      },
      {
        id: 'tataouine',
        name: 'تطاوين',
        fullName: 'تطاوين',
        icon: '🏰',
        x: 430,
        y: 515,
        tagline: 'قصور تطاوين الصحراوية، الديناصورات وقرماسة، عاصمة الجنوب الأشم',
        reqDinars: 45000000,
        bonusDesc: 'سياحة القصور وتجارة تطاوين (+80%)',
        themeClass: 'zone-tataouine'
      },
      {
        id: 'djerba_holding',
        name: 'جربة',
        fullName: 'جربة',
        icon: '👑',
        x: 530,
        y: 440,
        tagline: 'جزيرة الأحلام ومقر الهولدينغ التونسي الوطني الدولي الشامل',
        reqDinars: 150000000,
        bonusDesc: 'مضاعف الهولدينغ الوطني الشامل لجميع المداخيل (x5) !',
        themeClass: 'zone-djerba'
      }
    ];

    // Les 6 Grandes Capitales d'Afrique du Nord (Algérie, Maroc, Libye, Égypte, Mauritanie, Tunisie)
    this.regionalCapitals = [
      {
        id: 'cap_tunis',
        name: 'تونس العاصمة',
        country: 'الجمهورية التونسية',
        flag: '🇹🇳',
        icon: '🏛️',
        x: 440,
        y: 115,
        tagline: 'عاصمة الجمهورية التونسية، قلب الإمبراطورية التجارية الوطنية وملتقى الحضارات الإقليمية',
        isPlayable: true,
        playableId: 'tunis'
      },
      {
        id: 'cap_alger',
        name: 'الجزائر العاصمة',
        country: 'الجمهورية الجزائرية',
        flag: '🇩🇿',
        icon: '🏛️',
        x: 235,
        y: 125,
        tagline: 'عاصمة الجمهورية الجزائرية الديمقراطية الشعبية، البهجة، ميناء الجزائر العريق والتجارة الاستراتيجية المغاربية',
        bonusDesc: 'شراكة تجارية مغاربية كبرى واستيراد مواد أولية وصناعات كبرى (x2.5)'
      },
      {
        id: 'cap_rabat',
        name: 'الرباط',
        country: 'المغرب',
        flag: '🇲🇦',
        icon: '👑',
        x: 85,
        y: 165,
        tagline: 'عاصمة المملكة المغربية الشريفة، صومعة حسان، بوابة المحيط الأطلسي والتجارة العالمية',
        bonusDesc: 'خط تجاري بحري عبر مضيق جبل طارق وأسواق الموانئ الأطلسية (x3)'
      },
      {
        id: 'cap_tripoli',
        name: 'طرابلس',
        country: 'ليبيا',
        flag: '🇱🇾',
        icon: '🏛️',
        x: 645,
        y: 340,
        tagline: 'عاصمة دولة ليبيا الشقيقة، عروس البحر وسوق التجارة الإقليمية ومعبر رأس جدير الدولي',
        isPlayable: true,
        playableId: 'tripoli',
        bonusDesc: 'شريان التجارة المشتركة والعبور الدولي السريع (x3)'
      },
      {
        id: 'cap_cairo',
        name: 'القاهرة',
        country: 'مصر',
        flag: '🇪🇬',
        icon: '🕌',
        x: 900,
        y: 285,
        tagline: 'عاصمة جمهورية مصر العربية، قاهرة المعز، أهرامات الجيزة، مهد النيل وقناة السويس شريان الملاحة الدولية',
        bonusDesc: 'طريق التجارة البحرية وقناة السويس نحو أسواق الشرق الأوسط والخليج (x4)'
      },
      {
        id: 'cap_nouakchott',
        name: 'نواكشوط',
        country: 'موريتانيا',
        flag: '🇲🇷',
        icon: '🏜️',
        x: 65,
        y: 560,
        tagline: 'عاصمة الجمهورية الإسلامية الموريتانية، منارة بلاد شنقيط وقوافل المحيط والصحراء الإفريقية الكبرى',
        bonusDesc: 'طريق القوافل الصحراوية والتجارة الإفريقية والأطلسية (x3.5)'
      }
    ];

    // Réseau des Autoroutes & Voies Commerciales Dorées (Golden Highway Network)
    this.highways = [
      { from: 'bizerte', to: 'tunis', name: 'A4' },
      { from: 'beja', to: 'tunis', name: 'A3' },
      { from: 'le_kef', to: 'beja', name: 'GP5' },
      { from: 'tunis', to: 'nabeul_hammamet', name: 'A1 Cap Bon' },
      { from: 'tunis', to: 'kairouan', name: 'RN3' },
      { from: 'tunis', to: 'sousse', name: 'A1 Nord' },
      { from: 'sousse', to: 'monastir_mahdia', name: 'C57 Sahel' },
      { from: 'sousse', to: 'kairouan', name: 'GP2' },
      { from: 'le_kef', to: 'kairouan', name: 'GP12' },
      { from: 'kairouan', to: 'sfax', name: 'A1 Centre' },
      { from: 'sousse', to: 'sfax', name: 'A1 Côtière' },
      { from: 'annaba', to: 'beja', name: 'الطريق المغاربي A3 Ouest' },
      { from: 'annaba', to: 'le_kef', name: 'طريق الحدود الجزائرية GP17' },
      { from: 'kairouan', to: 'sbeitla', name: 'GP3 سفيطلة' },
      { from: 'sbeitla', to: 'gafsa', name: 'GP12 الوسط الغربي' },
      { from: 'medenine_zarzis', to: 'tripoli', name: 'الطريق الساحلي المغاربي رأس جدير' },
      { from: 'kairouan', to: 'gafsa', name: 'GP3' },
      { from: 'gafsa', to: 'tozeur', name: 'GP16 Oasis' },
      { from: 'gafsa', to: 'gabes', name: 'GP15' },
      { from: 'sfax', to: 'gabes', name: 'A1 Sud' },
      { from: 'gabes', to: 'medenine_zarzis', name: 'A1 Sud' },
      { from: 'medenine_zarzis', to: 'tataouine', name: 'GP19 القصور' },
      { from: 'tataouine', to: 'djerba_holding', name: 'طريق أجيم وبوغارطة' },
      { from: 'medenine_zarzis', to: 'djerba_holding', name: 'Voie Romaine El Kantara' },
      { from: 'annaba', to: 'cap_alger', name: 'الطريق السيار المغاربي A1 شرق-غرب' },
      { from: 'cap_alger', to: 'cap_rabat', name: 'الطريق الدولي نحو المغرب الشقيق' },
      { from: 'cap_rabat', to: 'cap_nouakchott', name: 'طريق المحيط الأطلسي وقوافل موريتانيا' },
      { from: 'tripoli', to: 'cap_cairo', name: 'الطريق الساحلي نحو مصر وبوابة الشرق' }
    ];

    // Particules de caravanes commerciales en mouvement le long des autoroutes
    this.tradeParticles = [];
    for (let i = 0; i < 28; i++) {
      const h = this.highways[i % this.highways.length];
      this.tradeParticles.push({
        highway: h,
        progress: Math.random(),
        speed: 0.12 + Math.random() * 0.16,
        color: i % 3 === 0 ? '#fbbf24' : (i % 3 === 1 ? '#f59e0b' : '#38bdf8')
      });
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.onWindowResize = () => this.resize();

    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('pointercancel', this.handlePointerUp);
    this.canvas.addEventListener('wheel', this.handleWheel, { passive: true });
    this.canvas.addEventListener('click', this.handleClick);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    if (typeof window !== 'undefined') window.addEventListener('resize', this.onWindowResize);

    this.resize();
    this.start();
  }

  handlePointerDown(e) {
    if (!this.pointers) this.pointers = new Map();
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (this.canvas.setPointerCapture && e.pointerId !== undefined) {
      try { this.canvas.setPointerCapture(e.pointerId); } catch (_) {}
    }

    if (this.pointers.size === 2) {
      this.isPanning = false;
      const pts = Array.from(this.pointers.values());
      this.initialPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      this.initialPinchZoom = this.zoom || 1;
      return;
    }

    this.isPanning = true;
    this.startPanY = e.clientY;
    this.startPanX = e.clientX;
    this.lastPointerY = e.clientY;
    this.lastPointerX = e.clientX;
    this.lastPointerTime = performance.now();
    this.pointerVelocityY = 0;
    this.pointerVelocityX = 0;
    this.startOriginPanY = this.panY || 0;
    this.startOriginPanX = this.panX || 0;
    this.targetPanY = this.panY || 0;
    this.targetPanX = this.panX || 0;
    this.hasDraggedMap = false;
  }

  handlePointerMove(e) {
    if (this.pointers && this.pointers.has(e.pointerId)) {
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (this.pointers && this.pointers.size === 2 && this.initialPinchDist) {
      const pts = Array.from(this.pointers.values());
      const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const ratio = currentDist / this.initialPinchDist;
      this.targetZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.initialPinchZoom * ratio));
      this.hasDraggedMap = true;
      return;
    }

    if (!this.isPanning) return;
    const now = performance.now();
    const dt = Math.max(0.005, (now - (this.lastPointerTime || now)) / 1000);
    const effScale = Math.max(0.001, (this.scale || 1) * (this.zoom || 1));
    const dy = (e.clientY - this.startPanY) / effScale;
    const dx = (e.clientX - this.startPanX) / effScale;
    const instantDy = (e.clientY - (this.lastPointerY || e.clientY)) / effScale;
    const instantDx = (e.clientX - (this.lastPointerX || e.clientX)) / effScale;

    const currentVelY = instantDy / dt;
    const currentVelX = instantDx / dt;
    this.pointerVelocityY = (this.pointerVelocityY || 0) * 0.4 + currentVelY * 0.6;
    this.pointerVelocityX = (this.pointerVelocityX || 0) * 0.4 + currentVelX * 0.6;
    this.lastPointerY = e.clientY;
    this.lastPointerX = e.clientX;
    this.lastPointerTime = now;

    const dragDist = Math.hypot(e.clientX - this.startPanX, e.clientY - this.startPanY);
    if (dragDist > 6) {
      this.hasDraggedMap = true;
    }
    this.panY = Math.max(-this.maxPanY, Math.min(180, this.startOriginPanY + dy));
    this.panX = Math.max(-this.maxPanX, Math.min(this.minPanX, this.startOriginPanX + dx));
    this.targetPanY = this.panY;
    this.targetPanX = this.panX;
  }

  handlePointerUp(e) {
    if (this.pointers) this.pointers.delete(e.pointerId);
    if (this.pointers && this.pointers.size < 2) {
      this.initialPinchDist = null;
    }

    if (!this.isPanning) return;
    this.isPanning = false;
    if (this.canvas.releasePointerCapture && e.pointerId !== undefined) {
      try { this.canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    }

    if (!this.hasDraggedMap) {
      this.handleClick(e);
      return;
    }

    // Fling / Inertie dynamique 2D
    if (Math.abs(this.pointerVelocityY || 0) > 30) {
      const flingDistY = (this.pointerVelocityY || 0) * 0.35;
      this.targetPanY = Math.max(-this.maxPanY, Math.min(180, (this.panY || 0) + flingDistY));
    }
    if (Math.abs(this.pointerVelocityX || 0) > 30) {
      const flingDistX = (this.pointerVelocityX || 0) * 0.35;
      this.targetPanX = Math.max(-this.maxPanX, Math.min(this.minPanX, (this.panX || 0) + flingDistX));
    }
  }

  handleWheel(e) {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.16 : -0.16;
    this.targetZoom = Math.max(this.minZoom, Math.min(this.maxZoom, (this.targetZoom || 1) + zoomDelta));
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const rect = this.canvas.getBoundingClientRect();
    let cssW = (parent && parent.clientWidth) || rect.width || (typeof window !== 'undefined' ? window.innerWidth : 440);
    let cssH = (parent && parent.clientHeight) || rect.height || (typeof window !== 'undefined' ? 680 : 680);
    
    cssW = Math.max(320, cssW);
    cssH = Math.max(520, cssH);

    this.width = 1040;
    this.height = 760;
    this.dpr = Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, 2.5);

    this.canvas.width = Math.floor(cssW * this.dpr);
    this.canvas.height = Math.floor(cssH * this.dpr);
    this.canvas.style.width = cssW + 'px';
    this.canvas.style.height = cssH + 'px';

    // Échelle équilibrée pour visibilité claire du Maghreb et centrage direct sur la Tunisie
    this.scale = Math.max(0.72, Math.min(1.3, Math.min(cssW / 520, cssH / 660)));
    this.offsetX = Math.max(0, (cssW - 520 * this.scale) / 2);
    this.offsetY = Math.max(0, (cssH - 660 * this.scale) / 2);
  }

  start() {
    this.stop();
    this.lastTime = performance.now();
    this.loop = (now) => {
      try {
        this.step(now);
      } catch (err) {
        console.error('TunisiaMapEngine frame error', err);
      }
      this.animId = requestAnimationFrame(this.loop);
    };
    this.animId = requestAnimationFrame(this.loop);
  }

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  destroy() {
    this.stop();
    if (typeof window !== 'undefined') window.removeEventListener('resize', this.onWindowResize);
    if (this.canvas) {
      this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
      this.canvas.removeEventListener('click', this.handleClick);
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('wheel', this.handleWheel);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('pointermove', this.handlePointerMove);
      window.removeEventListener('pointerup', this.handlePointerUp);
      window.removeEventListener('pointercancel', this.handlePointerUp);
    }
  }

  // Obtenir la ville active actuelle du joueur
  getActiveCity() {
    const currentZone = this.engine.getCurrentZone ? this.engine.getCurrentZone() : null;
    const currentId = (currentZone && currentZone.id) || this.engine.currentCityId || this.engine.currentZoneId || 'tunis';
    let found = this.cities.find(c => c.id === currentId);
    if (!found) {
      // Mappings de compatibilité historique
      if (currentId === 'bab_souika') found = this.cities.find(c => c.id === 'tunis');
      else if (currentId === 'la_goulette') found = this.cities.find(c => c.id === 'bizerte');
      else if (currentId === 'lac_2') found = this.cities.find(c => c.id === 'nabeul_hammamet');
      else if (currentId === 'hammamet') found = this.cities.find(c => c.id === 'sousse');
      else if (currentId === 'djerba_holding') found = this.cities.find(c => c.id === 'djerba_holding');
    }
    return found || this.cities[0];
  }

  isCityUnlocked(city) {
    if (this.engine.unlockedCityIds && this.engine.unlockedCityIds.includes(city.id)) {
      return true;
    }
    return false;
  }

  canUnlockCity(city) {
    if (this.isCityUnlocked(city)) return true;
    if (this.engine.checkCityUnlockCriteria) {
      return this.engine.checkCityUnlockCriteria(city.id);
    }
    const totalDinars = Math.max(this.engine.lifetimeDinarsEarned || 0, this.engine.dinars || 0, this.engine.totalDinarsEarned || 0);
    return totalDinars >= city.reqDinars;
  }

  getNextCityToUnlock() {
    return this.cities.find(c => !this.isCityUnlocked(c)) || null;
  }

  getCityUnlockProgress(city) {
    if (this.isCityUnlocked(city)) return 1.0;
    const totalDinars = Math.max(this.engine.lifetimeDinarsEarned || 0, this.engine.dinars || 0, this.engine.totalDinarsEarned || 0);
    if (city.reqDinars <= 0) return 1.0;
    return Math.min(0.99, Math.max(0, totalDinars / city.reqDinars));
  }

  // Algorithme de navigation par autoroutes (BFS shortest path)
  findRoute(startId, endId) {
    if (startId === endId) return [startId];
    const adj = {};
    for (const h of this.highways) {
      if (!adj[h.from]) adj[h.from] = [];
      if (!adj[h.to]) adj[h.to] = [];
      adj[h.from].push(h.to);
      adj[h.to].push(h.from);
    }
    const queue = [[startId]];
    const visited = new Set([startId]);
    while (queue.length > 0) {
      const path = queue.shift();
      const curr = path[path.length - 1];
      if (curr === endId) return path;
      for (const neighbor of (adj[curr] || [])) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }
    return [startId, endId];
  }

  // Déplacement ou déblocage direct d'une ville
  travelTo(cityId) {
    const city = this.cities.find(c => c.id === cityId);
    if (!city) return false;

    const isUnlocked = this.isCityUnlocked(city);
    const canUnlock = this.canUnlockCity(city);

    if (!isUnlocked && !canUnlock) return false;

    const isFirstTimeUnlock = !isUnlocked && canUnlock;

    // Déclencher déblocage si nécessaire
    if (isFirstTimeUnlock) {
      if (this.engine.unlockCity) {
        this.engine.unlockCity(city.id);
      } else if (this.engine.unlockZone) {
        this.engine.unlockZone(city.id);
      }
    }

    const fromCity = this.getActiveCity();
    const cityPathIds = this.findRoute(fromCity.id, city.id);
    const waypoints = cityPathIds.map(id => this.cities.find(c => c.id === id)).filter(Boolean);

    this.caravan = {
      from: fromCity,
      to: city,
      targetCity: city,
      waypoints: waypoints,
      isNewCity: isFirstTimeUnlock,
      startTime: performance.now(),
      duration: Math.max(1400, (waypoints.length - 1) * 850) // Durée nerveuse et dynamique
    };

    if (this.engine.switchCity) {
      this.engine.switchCity(city.id);
    } else {
      this.engine.currentCityId = city.id;
      this.engine.currentZoneId = city.id;
    }

    // Déclencher klaxon ou son de départ
    if (typeof window !== 'undefined' && window.soundEngine && window.soundEngine.playHorn) {
      window.soundEngine.playHorn();
    } else if (typeof window !== 'undefined' && window.soundFX && window.soundFX.playCoin) {
      window.soundFX.playCoin();
    }
    return true;
  }

  handleClick(e) {
    if (this.caravan || this.arrivalEffect) return; // Bloquer les clics pendant le trajet et la célébration d'arrivée
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const baseScale = Math.max(0.001, this.scale || 1);
    const currentZoom = this.zoom || 1;
    const totalScale = baseScale * currentZoom;

    // 1. Détection de clic sur les éléments de l'interface HUD (coordonnées écran fixes)
    const hudX = (clientX - (this.offsetX || 0)) / baseScale;
    const hudY = (clientY - (this.offsetY || 0)) / baseScale;
    const vpW = this.canvas.width / (this.dpr * baseScale);
    const vpH = this.canvas.height / (this.dpr * baseScale);

    // Boutons de Zoom à droite
    const btnSize = 34;
    const btnX = vpW - btnSize - 12;
    // Bouton Zoom Plus (+)
    if (hudX >= btnX && hudX <= btnX + btnSize && hudY >= 48 && hudY <= 48 + btnSize) {
      this.targetZoom = Math.min(this.maxZoom, (this.targetZoom || 1) + 0.35);
      if (typeof window !== 'undefined' && window.soundEngine && window.soundEngine.playTap) window.soundEngine.playTap();
      return;
    }
    // Bouton Centrage Tunisie (🇹🇳)
    if (hudX >= btnX && hudX <= btnX + btnSize && hudY >= 88 && hudY <= 88 + btnSize) {
      this.targetZoom = 1.0;
      this.targetPanX = -130;
      this.targetPanY = 0;
      if (typeof window !== 'undefined' && window.soundEngine && window.soundEngine.playTap) window.soundEngine.playTap();
      return;
    }
    // Bouton Zoom Moins (-)
    if (hudX >= btnX && hudX <= btnX + btnSize && hudY >= 128 && hudY <= 128 + btnSize) {
      this.targetZoom = Math.max(this.minZoom, (this.targetZoom || 1) - 0.35);
      if (typeof window !== 'undefined' && window.soundEngine && window.soundEngine.playTap) window.soundEngine.playTap();
      return;
    }

    // Pilules de navigation rapide vers les pays en haut (y: 10 à 38)
    if (hudY >= 8 && hudY <= 42) {
      const pills = [
        { id: 'tn', name: 'تونس', flag: '🇹🇳', x: -130, y: 0, zoom: 1.15 },
        { id: 'dz', name: 'الجزائر', flag: '🇩🇿', x: 60, y: 20, zoom: 1.1 },
        { id: 'ma', name: 'المغرب', flag: '🇲🇦', x: 220, y: 0, zoom: 1.1 },
        { id: 'ly', name: 'ليبيا', flag: '🇱🇾', x: -280, y: -140, zoom: 1.05 },
        { id: 'eg', name: 'مصر', flag: '🇪🇬', x: -540, y: -140, zoom: 1.05 },
        { id: 'mr', name: 'موريتانيا', flag: '🇲🇷', x: 240, y: -280, zoom: 1.05 }
      ];
      const pillW = Math.min(62, Math.floor((vpW - 24) / pills.length));
      const totalW = pillW * pills.length;
      const startX = Math.max(10, Math.floor((vpW - totalW) / 2));
      for (let i = 0; i < pills.length; i++) {
        const px = startX + i * pillW;
        if (hudX >= px && hudX <= px + pillW) {
          const p = pills[i];
          this.targetPanX = p.x;
          this.targetPanY = p.y;
          this.targetZoom = p.zoom;
          if (typeof window !== 'undefined' && window.soundEngine && window.soundEngine.playTap) window.soundEngine.playTap();
          return;
        }
      }
    }

    // 2. Détection de clic sur la carte Popover en bas
    if (this.selectedCityId) {
      const cardW = Math.min(420, vpW - 24);
      const cardH = 110;
      const cardX = Math.max(12, (vpW - cardW) / 2);
      const cardY = vpH - cardH - 12;

      if (hudX >= cardX && hudX <= cardX + cardW && hudY >= cardY && hudY <= cardY + cardH) {
        const c = this.cities.find(item => item.id === this.selectedCityId);
        if (c && (this.isCityUnlocked(c) || this.canUnlockCity(c)) && c.id !== this.getActiveCity().id) {
          this.travelTo(c.id);
        } else if (c && !this.isCityUnlocked(c) && !this.canUnlockCity(c)) {
          const diag = this.engine.getCityLockDiagnosis ? this.engine.getCityLockDiagnosis(c.id) : c.tagline;
          if (typeof window !== 'undefined' && window.soundEngine && window.soundEngine.playBuzzer) {
            window.soundEngine.playBuzzer();
          }
          if (typeof window !== 'undefined' && window.showRewardModalUI) {
            window.showRewardModalUI('🔒', `ولاية ${c.name} مقفلة !`, `علاش ما تنجمش تسافر لـ ${c.name} توا :`, `⚠️ ${diag}`);
          } else if (typeof window !== 'undefined' && window.showFeedbackToast) {
            window.showFeedbackToast(`🔒 ${c.name} مقفلة : ${diag}`, '🔒');
          }
        }
        return;
      }
    }

    // 3. Détection de clic sur les nœuds de la carte (coordonnées monde 2D prenant en compte le zoom et le pan)
    const mapScreenX = (clientX - (this.offsetX || 0)) / totalScale;
    const mapScreenY = (clientY - (this.offsetY || 0)) / totalScale;
    const mapX = mapScreenX - (this.panX || 0);
    const mapY = mapScreenY - (this.panY || 0);

    for (const c of this.cities) {
      const dist = Math.hypot(mapX - c.x, mapY - c.y);
      if (dist <= 42) {
        const isUnlocked = this.isCityUnlocked(c);
        const canUnlock = this.canUnlockCity(c);
        const diag = this.engine.getCityLockDiagnosis ? this.engine.getCityLockDiagnosis(c.id) : c.tagline;

        if (!isUnlocked && !canUnlock) {
          if (typeof window !== 'undefined' && window.soundEngine && window.soundEngine.playBuzzer) {
            window.soundEngine.playBuzzer();
          }
          if (typeof window !== 'undefined' && window.showFeedbackToast) {
            window.showFeedbackToast(`🔒 ${c.name} مقفلة : ${diag}`, '🔒');
          }
          if (this.selectedCityId === c.id && typeof window !== 'undefined' && window.showRewardModalUI) {
            window.showRewardModalUI('🔒', `ولاية ${c.name} مقفلة !`, `الشروط اللازمة باش تحلّ ${c.name} :`, `⚠️ ${diag}`);
          }
        }

        this.selectedCityId = c.id;
        if (this.onSelect) this.onSelect(c);

        if ((isUnlocked || canUnlock) && c.id !== this.getActiveCity().id) {
          this.travelTo(c.id);
        }
        return;
      }
    }

    // 4. Détection de clic sur les 6 Grandes Capitales régionales d'Afrique du Nord
    for (const cap of (this.regionalCapitals || [])) {
      const dist = Math.hypot(mapX - cap.x, mapY - cap.y);
      if (dist <= 38) {
        if (cap.playableId) {
          const matchC = this.cities.find(c => c.id === cap.playableId);
          if (matchC) {
            this.selectedCityId = matchC.id;
            if (this.onSelect) this.onSelect(matchC);
            if ((this.isCityUnlocked(matchC) || this.canUnlockCity(matchC)) && matchC.id !== this.getActiveCity().id) {
              this.travelTo(matchC.id);
            }
            return;
          }
        }

        if (typeof window !== 'undefined' && window.soundEngine && window.soundEngine.playCelebrationChord) {
          window.soundEngine.playCelebrationChord();
        } else if (typeof window !== 'undefined' && window.soundFX && window.soundFX.playCoin) {
          window.soundFX.playCoin();
        }
        if (typeof window !== 'undefined' && window.showRewardModalUI) {
          window.showRewardModalUI(cap.flag, `${cap.name} - ${cap.country}`, cap.tagline, `🌍 شريان التجارة الإقليمية : ${cap.bonusDesc}`);
        } else if (typeof window !== 'undefined' && window.showFeedbackToast) {
          window.showFeedbackToast(`${cap.flag} ${cap.name}: ${cap.bonusDesc}`, '🌍');
        }
        return;
      }
    }
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const baseScale = Math.max(0.001, this.scale || 1);
    const currentZoom = this.zoom || 1;
    const totalScale = baseScale * currentZoom;

    // Survol HUD
    const hudX = (clientX - (this.offsetX || 0)) / baseScale;
    const hudY = (clientY - (this.offsetY || 0)) / baseScale;
    const vpW = this.canvas.width / (this.dpr * baseScale);
    const btnSize = 34;
    const btnX = vpW - btnSize - 12;

    const isHoverZoom = (hudX >= btnX && hudX <= btnX + btnSize && hudY >= 48 && hudY <= 170);
    const isHoverPill = (hudY >= 8 && hudY <= 42 && hudX >= 10 && hudX <= vpW - 10);

    if (isHoverZoom || isHoverPill) {
      this.canvas.style.cursor = 'pointer';
      return;
    }

    const mapScreenX = (clientX - (this.offsetX || 0)) / totalScale;
    const mapScreenY = (clientY - (this.offsetY || 0)) / totalScale;
    const x = mapScreenX - (this.panX || 0);
    const y = mapScreenY - (this.panY || 0);

    let hovered = null;
    for (const c of this.cities) {
      if (Math.hypot(x - c.x, y - c.y) <= 24) {
        hovered = c.id;
        break;
      }
    }
    if (!hovered && this.regionalCapitals) {
      for (const cap of this.regionalCapitals) {
        if (Math.hypot(x - cap.x, y - cap.y) <= 24) {
          hovered = cap.id;
          break;
        }
      }
    }
    this.hoverCityId = hovered;
    this.canvas.style.cursor = hovered ? 'pointer' : 'default';
  }

  step(now) {
    const dt = Math.min((now - (this.lastTime || now)) / 1000, 0.1);
    this.lastTime = now;
    const t = now / 1000;

    // Lissage du défilement 2D (panY et panX) et du zoom
    if (this.targetPanY !== undefined) {
      this.panY = (this.panY || 0) + ((this.targetPanY || 0) - (this.panY || 0)) * Math.min(1, dt * 10);
    }
    if (this.targetPanX !== undefined) {
      this.panX = (this.panX || 0) + ((this.targetPanX || 0) - (this.panX || 0)) * Math.min(1, dt * 10);
    }
    if (this.targetZoom !== undefined) {
      this.zoom = (this.zoom || 1) + ((this.targetZoom || 1) - (this.zoom || 1)) * Math.min(1, dt * 10);
    }

    const ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const currentZoom = this.zoom || 1;
    ctx.scale(this.dpr, this.dpr);
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale * currentZoom, this.scale * currentZoom);

    ctx.save();
    ctx.translate(this.panX || 0, this.panY || 0);

    // 1. Fond Mer Méditerranée & Océan Atlantique avec reflets bioluminescents & coordonnées
    this.drawSeaBackground(ctx, t);

    // 2. Silhouette Vectorielle Réelle des Pays du Grand Maghreb & Égypte
    this.drawNeighboringCountries(ctx, t);

    // 3. Silhouette Vectorielle Haute Définition de la Tunisie
    this.drawTunisiaLandmass(ctx, t);

    // 4. Réseau des Autoroutes & Voies Commerciales Dorées animées
    this.drawHighwaysNetwork(ctx, dt, t);

    // 5. Les Nœuds de Villes et Capitales Maghrébines avec Statuts et Pulsations
    this.drawCityNodes(ctx, t);

    // 6. Animation de caravane de voyage en cours
    this.drawCaravanAnimation(ctx, now);

    // 7. Effet cinématique d'arrivée dans la ville
    if (this.arrivalEffect) {
      this.drawArrivalEffect(ctx, now);
    }
    ctx.restore();

    // 8. Commandes HUD tactiles (Zoom in, Zoom out, Reset, Pills pays)
    this.drawMapHUD(ctx);

    // 9. Carte flottante de la ville sélectionnée (fixée en bas)
    this.drawSelectedCityOverlay(ctx);
  }

  drawMapHUD(ctx) {
    const baseScale = Math.max(0.001, this.scale || 1);
    const vpW = this.canvas.width / (this.dpr * baseScale);
    const vpH = this.canvas.height / (this.dpr * baseScale);

    ctx.save();

    // 1. Barre supérieure : Pilules de saut rapide vers chaque pays
    const pills = [
      { id: 'tn', name: 'تونس', flag: '🇹🇳' },
      { id: 'dz', name: 'الجزائر', flag: '🇩🇿' },
      { id: 'ma', name: 'المغرب', flag: '🇲🇦' },
      { id: 'ly', name: 'ليبيا', flag: '🇱🇾' },
      { id: 'eg', name: 'مصر', flag: '🇪🇬' },
      { id: 'mr', name: 'موريتانيا', flag: '🇲🇷' }
    ];
    const pillW = Math.min(62, Math.floor((vpW - 24) / pills.length));
    const pillH = 26;
    const totalW = pillW * pills.length;
    const startX = Math.max(10, Math.floor((vpW - totalW) / 2));
    const pillY = 10;

    for (let i = 0; i < pills.length; i++) {
      const p = pills[i];
      const px = startX + i * pillW;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.beginPath();
      ctx.roundRect(px + 2, pillY, pillW - 4, pillH, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = '900 10.5px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${p.flag} ${p.name}`, px + pillW / 2, pillY + pillH / 2);
    }

    // 2. Boutons de Zoom flottants sur le côté droit
    const btnSize = 34;
    const btnX = vpW - btnSize - 12;
    const zoomBtns = [
      { id: 'plus', icon: '➕', y: 48 },
      { id: 'reset', icon: '🇹🇳', y: 88 },
      { id: 'minus', icon: '➖', y: 128 }
    ];

    for (const zb of zoomBtns) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.roundRect(btnX, zb.y, btnSize, btnSize, 10);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(zb.icon, btnX + btnSize / 2, zb.y + btnSize / 2);
    }

    // Indicateur de zoom textuel
    const zoomPct = Math.round((this.zoom || 1) * 100);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.beginPath();
    ctx.roundRect(btnX - 8, 168, btnSize + 16, 16, 5);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.font = '900 9px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${zoomPct}%`, btnX + btnSize / 2, 179);

    ctx.restore();
  }

  drawSeaBackground(ctx, t) {
    // Fond océanique riche avec dégradé radial et abyssal
    const seaGrad = ctx.createRadialGradient(this.width * 0.5, this.height * 0.4, 60, this.width * 0.5, this.height * 0.5, this.width * 0.75);
    seaGrad.addColorStop(0, '#0a2542');
    seaGrad.addColorStop(0.35, '#071c35');
    seaGrad.addColorStop(0.7, '#051427');
    seaGrad.addColorStop(1, '#020b15');
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Coordonnées cartographiques / Graticule nautique subtil
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);

    // Lignes de latitude
    const latitudes = [
      { y: 70, label: '37° N (بنزرت والرأس الأبيض)' },
      { y: 220, label: '35° N (سوسة والساحل)' },
      { y: 390, label: '33° N (قابس وجربة)' },
      { y: 540, label: '31° N (الصحراء الكبرى)' }
    ];
    for (const lat of latitudes) {
      ctx.beginPath();
      ctx.moveTo(10, lat.y);
      ctx.lineTo(this.width - 10, lat.y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.font = '700 8.5px "Cairo", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(lat.label, 14, lat.y - 3);
    }

    // Lignes de longitude
    const longitudes = [
      { x: 80, label: '0° Greenwich' },
      { x: 260, label: '5° E (الجزائر)' },
      { x: 470, label: '10° E (تونس العاصمة)' },
      { x: 670, label: '15° E (طرابلس)' },
      { x: 900, label: '30° E (القاهرة والنيل)' }
    ];
    for (const lon of longitudes) {
      ctx.beginPath();
      ctx.moveTo(lon.x, 10);
      ctx.lineTo(lon.x, this.height - 10);
      ctx.stroke();

      ctx.fillStyle = 'rgba(148, 163, 184, 0.22)';
      ctx.font = '700 8px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(lon.label, lon.x, this.height - 12);
    }
    ctx.setLineDash([]);
    ctx.restore();

    // Ondulations marines avec reflets bioluminescents
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 1.3;
    for (let wave = 0; wave < 10; wave++) {
      const wy = 40 + wave * 68 + Math.sin(t * 0.9 + wave * 1.3) * 5;
      ctx.beginPath();
      ctx.moveTo(15, wy);
      ctx.bezierCurveTo(this.width * 0.35, wy - 9, this.width * 0.65, wy + 9, this.width - 15, wy);
      ctx.stroke();
    }
    ctx.restore();

    // Mention des espaces maritimes en calligraphie dorée / azur
    ctx.save();
    ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.font = '900 13px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('البحر الأبيض المتوسط 🌊 (Mare Nostrum)', 650, 72);
    ctx.fillText('المحيط الأطلسي 🌊', 65, 395);
    ctx.font = '800 10px "Cairo", sans-serif';
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.fillText('خليج قابس 🐬', 530, 345);
    ctx.fillText('خليج تونس ⛵', 485, 68);
    ctx.fillText('خليج سرت ⚓', 660, 440);

    // Rose des vents dorée majestueuse au Nord-Ouest
    const roseX = 85;
    const roseY = 55;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(roseX, roseY, 20, 0, Math.PI * 2);
    ctx.stroke();

    // Étoile à 8 branches
    const points = 8;
    for (let i = 0; i < points; i++) {
      const a = (i * Math.PI) / 4;
      const r = i % 2 === 0 ? 24 : 14;
      const px = roseX + Math.cos(a) * r;
      const py = roseY + Math.sin(a) * r;
      ctx.beginPath();
      ctx.moveTo(roseX, roseY);
      ctx.lineTo(px, py);
      ctx.strokeStyle = i % 2 === 0 ? '#f59e0b' : 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = i % 2 === 0 ? 2 : 1;
      ctx.stroke();
    }

    ctx.fillStyle = '#fef08a';
    ctx.font = '900 11px "Cairo", sans-serif';
    ctx.fillText('N', roseX, roseY - 26);
    ctx.fillText('🧭', roseX, roseY + 4);
    ctx.restore();
  }

  drawNeighboringCountries(ctx, t) {
    ctx.save();

    // --- HALO LUMINEUX DES CÔTES (AQUAMARINE SHELF GLOW) ---
    // Donne l'effet de haut-fond turquoise et de relief insulaire luxueux
    ctx.shadowColor = 'rgba(56, 189, 248, 0.55)';
    ctx.shadowBlur = 14;

    // 1. MAROC 🇲🇦 (المملكة المغربية - الأطلسي، الريف وجبال الأطلس)
    const moroccoGrad = ctx.createLinearGradient(10, 80, 160, 390);
    moroccoGrad.addColorStop(0, '#1d3e2b'); // Rif et détroit
    moroccoGrad.addColorStop(0.4, '#244b34'); // Plaines atlantiques
    moroccoGrad.addColorStop(0.7, '#42371e'); // Haut Atlas
    moroccoGrad.addColorStop(1, '#2f2416'); // Désert
    ctx.fillStyle = moroccoGrad;
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(10, 110);
    ctx.lineTo(45, 95);
    ctx.lineTo(80, 85); // Détroit de Gibraltar
    ctx.lineTo(130, 92);
    ctx.lineTo(155, 125);
    ctx.lineTo(145, 230);
    ctx.lineTo(140, 360);
    ctx.lineTo(15, 385);
    ctx.lineTo(10, 260);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Crêtes des montagnes de l'Atlas marocain
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(70, 110);
    ctx.lineTo(110, 160);
    ctx.lineTo(125, 240);
    ctx.stroke();

    // Médaillon national Maroc
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(35, 215, 105, 23, 7);
    ctx.fill();
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 1.3;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 11.5px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('المملكة المغربية 🇲🇦', 87, 231);

    // 2. MAURITANIE 🇲🇷 (الجمهورية الإسلامية الموريتانية - شنقيط والمحيط الأطلسي)
    const maurGrad = ctx.createLinearGradient(10, 390, 180, 750);
    maurGrad.addColorStop(0, '#382a17');
    maurGrad.addColorStop(0.5, '#2c2214');
    maurGrad.addColorStop(1, '#1e170e');
    ctx.fillStyle = maurGrad;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(10, 390);
    ctx.lineTo(140, 365);
    ctx.lineTo(195, 415);
    ctx.lineTo(200, 750);
    ctx.lineTo(10, 750);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dunes de sable de Mauritanie
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
    ctx.lineWidth = 1.2;
    for (let d = 0; d < 4; d++) {
      ctx.beginPath();
      ctx.arc(60 + d * 30, 480 + d * 55, 35, 0.3, Math.PI - 0.3);
      ctx.stroke();
    }

    // Médaillon national Mauritanie
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(32, 625, 95, 23, 7);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.3;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 11.5px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('موريتانيا 🇲🇷', 79, 641);

    // 3. ALGÉRIE 🇩🇿 (الجمهورية الجزائرية - البهجة، الأطلس والصحراء الشاسعة)
    const algeriaGrad = ctx.createLinearGradient(155, 80, 370, 750);
    algeriaGrad.addColorStop(0, '#1c3e2b'); // Tell et Méditerranée
    algeriaGrad.addColorStop(0.25, '#244d34'); // Hauts Plateaux
    algeriaGrad.addColorStop(0.65, '#3a2d19'); // Sahara septentrional
    algeriaGrad.addColorStop(1, '#241b10'); // Grand Sud
    ctx.fillStyle = algeriaGrad;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(155, 125);
    ctx.lineTo(190, 85); // Baie d'Oran
    ctx.lineTo(235, 80); // Tipaza
    ctx.lineTo(260, 78); // Baie d'Alger
    ctx.lineTo(295, 70); // Frontière tunisienne Tabarka
    ctx.lineTo(282, 110);
    ctx.lineTo(280, 170);
    ctx.lineTo(275, 215);
    ctx.lineTo(290, 270);
    ctx.lineTo(295, 325);
    ctx.lineTo(280, 360);
    ctx.lineTo(260, 390);
    ctx.lineTo(265, 405);
    ctx.lineTo(350, 490);
    ctx.lineTo(380, 535);
    ctx.lineTo(370, 750);
    ctx.lineTo(200, 750);
    ctx.lineTo(195, 415);
    ctx.lineTo(140, 360);
    ctx.lineTo(145, 230);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Relief de l'Atlas tellien et saharien
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.3)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(180, 105);
    ctx.lineTo(240, 100);
    ctx.lineTo(270, 95);
    ctx.stroke();

    // Chott Melrhir (lac salé algérien face au Chott el Djerid)
    ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
    ctx.beginPath();
    ctx.ellipse(225, 365, 28, 12, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Médaillon national Algérie
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(175, 335, 118, 24, 7);
    ctx.fill();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 12px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('الجمهورية الجزائرية 🇩🇿', 234, 351);

    // 4. LIBYE 🇱🇾 (دولة ليبيا - طرابلس، خليج سرت والجبل الأخضر)
    const libyaGrad = ctx.createLinearGradient(430, 440, 750, 750);
    libyaGrad.addColorStop(0, '#312519');
    libyaGrad.addColorStop(0.3, '#3a2b1b');
    libyaGrad.addColorStop(0.7, '#2a1f13');
    libyaGrad.addColorStop(1, '#1c140c');
    ctx.fillStyle = libyaGrad;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(525, 485); // Ras Jedir
    ctx.lineTo(580, 440); // Tripoli
    ctx.lineTo(630, 430); // Misrata
    ctx.lineTo(670, 450); // Arc de Syrte
    ctx.lineTo(715, 440); // Benghazi
    ctx.lineTo(750, 470);
    ctx.lineTo(750, 750);
    ctx.lineTo(430, 750);
    ctx.lineTo(430, 545);
    ctx.lineTo(490, 515);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Oasis et massif du Jebel Akhdar libyen
    ctx.fillStyle = 'rgba(74, 222, 128, 0.2)';
    ctx.beginPath();
    ctx.ellipse(710, 460, 24, 14, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Médaillon national Libye
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(580, 535, 95, 24, 7);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 12px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('دولة ليبيا 🇱🇾', 627, 551);

    // 5. ÉGYPTE 🇪🇬 (جمهورية مصر العربية - القاهرة، النيل العظيم والأهرامات)
    const egyptGrad = ctx.createLinearGradient(750, 420, 1030, 750);
    egyptGrad.addColorStop(0, '#36231c');
    egyptGrad.addColorStop(0.4, '#2d1c16');
    egyptGrad.addColorStop(1, '#1c110d');
    ctx.fillStyle = egyptGrad;
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(750, 470);
    ctx.lineTo(815, 435); // Alexandrie
    ctx.lineTo(875, 410); // Delta du Nil Ouest
    ctx.lineTo(925, 410); // Delta du Nil Est
    ctx.lineTo(965, 425); // Port-Saïd & Canal de Suez
    ctx.lineTo(1030, 415); // Sinaï
    ctx.lineTo(1030, 750);
    ctx.lineTo(750, 750);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // DELTA DU NIL VERT ÉMERAUDE (دلتا النيل الخضراء الخصبة)
    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.moveTo(890, 445); // Apex à Alexandrie / Le Caire
    ctx.lineTo(875, 410);
    ctx.lineTo(925, 410);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // LE FLEUVE DU NIL ÉCLATANT (شريان نهر النيل الأزرق)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(898, 445);
    ctx.bezierCurveTo(905, 480, 892, 530, 902, 590);
    ctx.bezierCurveTo(915, 640, 900, 680, 908, 740);
    ctx.stroke();

    // Reflet cyan au cœur du Nil
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // LES 3 GRANDES PYRAMIDES DE GIZEH 🔺🔺🔺 (أهرامات الجيزة الخالدة)
    const pyrX = 878;
    const pyrY = 460;
    // Grande Pyramide
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(pyrX, pyrY);
    ctx.lineTo(pyrX - 9, pyrY + 12);
    ctx.lineTo(pyrX + 9, pyrY + 12);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(pyrX, pyrY);
    ctx.lineTo(pyrX + 9, pyrY + 12);
    ctx.lineTo(pyrX, pyrY + 12);
    ctx.closePath();
    ctx.fill();
    // Deuxième Pyramide
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(pyrX + 13, pyrY + 4);
    ctx.lineTo(pyrX + 6, pyrY + 14);
    ctx.lineTo(pyrX + 20, pyrY + 14);
    ctx.closePath();
    ctx.fill();

    // Médaillon national Égypte
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(830, 485, 126, 24, 7);
    ctx.fill();
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 12px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('جمهورية مصر العربية 🇪🇬', 893, 501);

    // Frontières régionales en pointillés dorés
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.65)';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([4, 4]);

    // Frontière Maroc - Algérie
    ctx.beginPath();
    ctx.moveTo(155, 125);
    ctx.lineTo(145, 230);
    ctx.lineTo(140, 360);
    ctx.lineTo(195, 415);
    ctx.stroke();

    // Frontière Libye - Égypte
    ctx.beginPath();
    ctx.moveTo(750, 470);
    ctx.lineTo(750, 750);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  drawTunisiaLandmass(ctx, t) {
    ctx.save();
    const ox = 200; // Décalage pour centrer la Tunisie dans la carte élargie du Grand Maghreb

    // Ombre portée et lueur côtière aquamarine de la Tunisie
    ctx.shadowColor = 'rgba(56, 189, 248, 0.65)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 2;

    // Dégradé topographique réaliste (Verts du Nord -> Sahelo-steppes -> Sables dorés du Sahara)
    const landGrad = ctx.createLinearGradient(ox + 20, 40, ox + 20, 560);
    landGrad.addColorStop(0, '#1c5d38'); // Nord verdoyant (Bizerte, Kroumirie)
    landGrad.addColorStop(0.22, '#286a42'); // Plaines de la Medjerda
    landGrad.addColorStop(0.42, '#526b34'); // Sahel et Centre (Sousse, Kairouan)
    landGrad.addColorStop(0.65, '#82632b'); // Steppes et Sfax
    landGrad.addColorStop(0.85, '#a16c27'); // Sud et Chotts
    landGrad.addColorStop(1.0, '#c77e26'); // Sahara et dunes de Tataouine

    // Tracé fidèle des côtes et frontières de la Tunisie
    ctx.fillStyle = landGrad;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.2;
    ctx.beginPath();

    const coastline = [
      [95, 70], [145, 55], [198, 40], [230, 65], [236, 100], [260, 110], [320, 92], [330, 115],
      [295, 145], [275, 165], [268, 190], [280, 215], [305, 235], [315, 265], [300, 288],
      [275, 320], [245, 355], [228, 395], [248, 410], [270, 425], [310, 465], [325, 485],
      [290, 515], [230, 545], [180, 535], [150, 490], [65, 405], [60, 390], [80, 360],
      [95, 325], [90, 270], [75, 215], [80, 170], [82, 110], [95, 70]
    ];

    coastline.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt[0] + ox, pt[1]);
      else ctx.lineTo(pt[0] + ox, pt[1]);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;

    // ÎLE DE DJERBA (جزيرة جربة - Découpage insulaire fidèle)
    ctx.fillStyle = '#b4732a';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(312 + ox, 424);
    ctx.lineTo(338 + ox, 422);
    ctx.lineTo(348 + ox, 436);
    ctx.lineTo(334 + ox, 452);
    ctx.lineTo(314 + ox, 448);
    ctx.lineTo(306 + ox, 436);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Chaussée romaine d'El Kantara reliant Djerba à Zarzis
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(314 + ox, 448);
    ctx.lineTo(270 + ox, 425);
    ctx.stroke();

    // Île de La Galite (أرخبيل جالطة - Nord de Bizerte / Tabarka)
    ctx.fillStyle = '#286a42';
    ctx.beginPath();
    ctx.ellipse(140 + ox, 26, 7, 3.5, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Îles Zembra et Zembretta (جزيرة زمبرة وزمبرتا - Golfe de Tunis)
    ctx.fillStyle = '#286a42';
    ctx.beginPath();
    ctx.ellipse(282 + ox, 80, 5, 3, 0.5, 0, Math.PI * 2);
    ctx.ellipse(289 + ox, 75, 2.5, 1.8, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Archipel des Kerkennah (جزر قرقنة)
    ctx.fillStyle = '#6e5d32';
    ctx.beginPath();
    ctx.ellipse(320 + ox, 312, 12, 4, 0.4, 0, Math.PI * 2);
    ctx.ellipse(334 + ox, 304, 10, 3.5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Îles Kuriat (جزر قوريا - Monastir)
    ctx.fillStyle = '#526b34';
    ctx.beginPath();
    ctx.ellipse(336 + ox, 230, 4, 2.5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // CHOTT EL DJERID (شط الجريد - Étendue saline scintillante)
    ctx.fillStyle = 'rgba(207, 250, 254, 0.65)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(85 + ox, 402);
    ctx.lineTo(145 + ox, 392);
    ctx.lineTo(178 + ox, 408);
    ctx.lineTo(155 + ox, 424);
    ctx.lineTo(95 + ox, 428);
    ctx.lineTo(75 + ox, 414);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Reflets de sel étincelant sur le Chott
    ctx.fillStyle = '#ffffff';
    const shimmer = Math.sin(t * 3) * 0.4 + 0.6;
    ctx.globalAlpha = shimmer;
    ctx.fillText('✨', 115 + ox, 414);
    ctx.globalAlpha = 1.0;

    ctx.restore();
  }

  drawHighwaysNetwork(ctx, dt, t) {
    ctx.save();
    const findNode = (id) => this.cities.find(c => c.id === id) || (this.regionalCapitals && this.regionalCapitals.find(c => c.id === id));

    // 1. Tracé des autoroutes dorées élégantes
    // Base avec lueur dorée
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 4;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const h of this.highways) {
      const c1 = findNode(h.from);
      const c2 = findNode(h.to);
      if (!c1 || !c2) continue;

      ctx.beginPath();
      ctx.moveTo(c1.x, c1.y);
      ctx.lineTo(c2.x, c2.y);
      ctx.stroke();
    }

    // 2. Ligne centrale ruban néon ambre
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.6;
    for (const h of this.highways) {
      const c1 = findNode(h.from);
      const c2 = findNode(h.to);
      if (!c1 || !c2) continue;

      ctx.beginPath();
      ctx.moveTo(c1.x, c1.y);
      ctx.lineTo(c2.x, c2.y);
      ctx.stroke();
    }

    // 3. Particules de caravanes commerciales animées
    for (const p of this.tradeParticles) {
      p.progress = (p.progress + dt * p.speed) % 1.0;
      const c1 = findNode(p.highway.from);
      const c2 = findNode(p.highway.to);
      if (!c1 || !c2) continue;

      const px = c1.x + (c2.x - c1.x) * p.progress;
      const py = c1.y + (c2.y - c1.y) * p.progress;

      ctx.fillStyle = p.color;
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  formatMapCompact(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(n % 1e3 === 0 ? 0 : 1) + 'K';
    return '' + n;
  }

  drawCityNodes(ctx, t) {
    const activeCity = this.getActiveCity();
    const nextCity = this.getNextCityToUnlock();

    for (const c of this.cities) {
      const isActive = activeCity && activeCity.id === c.id;
      const isUnlocked = this.isCityUnlocked(c);
      const isNext = nextCity && nextCity.id === c.id;
      const isHovered = this.hoverCityId === c.id;

      ctx.save();

      // Rayon d'onde radar pulsante pour la ville active
      if (isActive) {
        const pulse1 = (t * 22) % 32;
        const pulseAlpha1 = Math.max(0, 1 - pulse1 / 32);
        ctx.strokeStyle = 'rgba(16, 185, 129, ' + pulseAlpha1 + ')';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 14 + pulse1, 0, Math.PI * 2);
        ctx.stroke();

        const pulse2 = ((t * 22) + 16) % 32;
        const pulseAlpha2 = Math.max(0, 1 - pulse2 / 32);
        ctx.strokeStyle = 'rgba(245, 158, 11, ' + pulseAlpha2 + ')';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 14 + pulse2, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Nœud Pin de la ville
      const pinRadius = isActive ? 16 : (isHovered ? 15 : 13);

      // Ombre du Pin
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.beginPath();
      ctx.ellipse(c.x, c.y + pinRadius + 2, pinRadius * 0.8, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Corps du Pin selon le statut
      if (isActive) {
        ctx.fillStyle = '#10b981'; // Vert éclatant
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2.8;
      } else if (isUnlocked) {
        ctx.fillStyle = '#0284c7'; // Bleu ciel méditerranéen
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
      } else if (isNext) {
        ctx.fillStyle = '#d97706'; // Ambre doré en cours
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.2;
      } else {
        ctx.fillStyle = '#334155'; // Gris métallique verrouillé
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
      }

      ctx.beginPath();
      ctx.arc(c.x, c.y, pinRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Arc de progression circulaire pour la prochaine ville à débloquer
      if (isNext && !isUnlocked) {
        const pct = this.getCityUnlockProgress(c);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(c.x, c.y, pinRadius + 3, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct, false);
        ctx.stroke();
      }

      // Émote / Symbole au centre du Pin
      ctx.font = (isActive ? '14px' : '12px') + ' sans-serif';
      ctx.textAlign = 'center';
      let pinEmoji = c.icon;
      if (!isUnlocked && !isNext) pinEmoji = '🔒';
      ctx.fillText(pinEmoji, c.x, c.y + 4.5);

      // Étiquette du nom de la ville
      const isCurCity = isActive;
      ctx.font = isCurCity ? '900 13.5px "Cairo", sans-serif' : '900 11.5px "Cairo", sans-serif';
      const nameW = ctx.measureText(c.name).width;

      ctx.fillStyle = isCurCity ? 'rgba(6, 78, 59, 0.98)' : 'rgba(15, 23, 42, 0.88)';
      ctx.beginPath();
      const badgeH = isCurCity ? 19 : 15;
      const badgeOffset = isCurCity ? 20 : 16;
      ctx.roundRect(c.x - nameW / 2 - 7, c.y - pinRadius - badgeOffset, nameW + 14, badgeH, 5);
      ctx.fill();
      ctx.strokeStyle = isCurCity ? '#10b981' : (isUnlocked ? '#38bdf8' : '#64748b');
      ctx.lineWidth = isCurCity ? 1.8 : 1;
      ctx.stroke();

      ctx.fillStyle = isCurCity ? '#fef08a' : (isUnlocked ? '#f8fafc' : '#94a3b8');
      ctx.fillText(c.name, c.x, c.y - pinRadius - (isCurCity ? 5.5 : 4.5));

      // Badge pour la ville active avec niveau joueur
      if (isActive) {
        const pLvl = this.engine.getPlayerLevel ? this.engine.getPlayerLevel() : (this.engine.playerLevel || 1);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 9px "Cairo", sans-serif';
        ctx.fillText('⭐ مستوى ' + pLvl, c.x, c.y + pinRadius + 12);
      } else if (!isUnlocked) {
        const engC = this.engine.getCityById ? this.engine.getCityById(c.id) : null;
        let shortLockReason = '🔒 مقفلة';
        if (engC) {
          if (engC.minPrestige > 0 && (this.engine.prestigeLevel || 0) < engC.minPrestige) {
            shortLockReason = `🔒 برستيج ${engC.minPrestige}`;
          } else if (engC.reqBizLevel && engC.reqBizLevel.minLevel) {
            shortLockReason = `🔒 ${engC.reqBizLevel.count}xL${engC.reqBizLevel.minLevel}`;
          } else if (engC.reqManagers > 0) {
            shortLockReason = `🔒 ${engC.reqManagers} معلّم`;
          } else if (engC.costDinars > 0) {
            shortLockReason = `🔒 ${this.formatMapCompact(engC.costDinars)} د.ت`;
          }
        }
        ctx.fillStyle = isNext ? '#fde047' : '#fca5a5';
        ctx.font = '800 7.5px "Cairo", sans-serif';
        ctx.fillText(shortLockReason, c.x, c.y + pinRadius + 11.5);
      }

      ctx.restore();
    }

    // Nœuds des 6 Grandes Capitales Régionales d'Afrique du Nord (Algérie, Maroc, Libye, Égypte, Mauritanie, Tunisie)
    for (const cap of (this.regionalCapitals || [])) {
      const isHovered = this.hoverCityId === cap.id;
      const isTunis = cap.id === 'cap_tunis';

      // Pour Tunis (déjà représentée dans cities), ajouter la couronne royale de capitale
      if (isTunis) {
        ctx.save();
        ctx.fillStyle = '#fbbf24';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('👑', cap.x, cap.y - 28);
        ctx.restore();
        continue;
      }

      ctx.save();

      // Halo pulsant doré autour de la capitale internationale
      const capPulse = (t * 18) % 24;
      const capAlpha = Math.max(0, 0.7 - capPulse / 24);
      ctx.strokeStyle = `rgba(251, 191, 36, ${capAlpha})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(cap.x, cap.y, 16 + capPulse, 0, Math.PI * 2);
      ctx.stroke();

      // Pin doré de la capitale
      const pinR = isHovered ? 18 : 16;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 10;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.ellipse(cap.x, cap.y + pinR + 2, pinR * 0.8, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Fond du Pin doré avec bordure ambre
      const capGrad = ctx.createRadialGradient(cap.x - 3, cap.y - 3, 2, cap.x, cap.y, pinR);
      capGrad.addColorStop(0, '#fef08a');
      capGrad.addColorStop(0.6, '#f59e0b');
      capGrad.addColorStop(1, '#b45309');
      ctx.fillStyle = capGrad;
      ctx.beginPath();
      ctx.arc(cap.x, cap.y, pinR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Émoji drapeau
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cap.flag, cap.x, cap.y);

      // Étiquette du nom de la capitale
      ctx.textBaseline = 'alphabetic';
      ctx.font = '900 12px "Cairo", sans-serif';
      const capLbl = `🏛️ ${cap.name}`;
      const lblW = ctx.measureText(capLbl).width;
      const bH = 18;
      const bY = cap.y - pinR - 19;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.beginPath();
      ctx.roundRect(cap.x - lblW / 2 - 8, bY, lblW + 16, bH, 6);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.fillText(capLbl, cap.x, bY + 13);

      // Sous-titre pays
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '800 8.5px "Cairo", sans-serif';
      ctx.fillText(cap.country, cap.x, cap.y + pinR + 12);

      ctx.restore();
    }
  }

  drawCaravanAnimation(ctx, now) {
    if (!this.caravan) return;
    const elapsed = now - this.caravan.startTime;
    const progress = Math.min(1.0, elapsed / this.caravan.duration);

    const waypoints = this.caravan.waypoints && this.caravan.waypoints.length >= 2 
      ? this.caravan.waypoints 
      : [this.caravan.from, this.caravan.to];

    // Calcul du segment actif le long des autoroutes
    const totalSegments = waypoints.length - 1;
    const scaledProgress = progress * totalSegments;
    const segIdx = Math.min(totalSegments - 1, Math.floor(scaledProgress));
    const segProgress = Math.min(1.0, scaledProgress - segIdx);

    const segFrom = waypoints[segIdx];
    const segTo = waypoints[segIdx + 1];

    // Trajectoire fluide interpolée sur l'autoroute courante
    const curX = segFrom.x + (segTo.x - segFrom.x) * segProgress;
    const curY = segFrom.y + (segTo.y - segFrom.y) * segProgress;

    // Angle de la route pour orienter la voiture
    const angle = Math.atan2(segTo.y - segFrom.y, segTo.x - segFrom.x);

    ctx.save();

    // 1. Traînée lumineuse d'accélération dorée (Golden Speed Trail)
    const trailLen = 8;
    for (let k = 1; k <= trailLen; k++) {
      const trailProgress = Math.max(0, segProgress - (k * 0.02));
      const tx = segFrom.x + (segTo.x - segFrom.x) * trailProgress;
      const ty = segFrom.y + (segTo.y - segFrom.y) * trailProgress;
      ctx.fillStyle = `rgba(251, 191, 36, ${(trailLen - k) / trailLen * 0.45})`;
      ctx.beginPath();
      ctx.arc(tx, ty, 6 - k * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Halo d'énergie autour du véhicule
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(curX, curY, 11, 0, Math.PI * 2);
    ctx.fill();

    // 3. Faisceau de phares avant et véhicule
    ctx.save();
    ctx.translate(curX, curY);

    // Orientation naturelle du véhicule :
    // L'émoji 🚗 roule naturellement vers la gauche dans les polices standards.
    // Si la voiture roule vers la droite (dx > 0), on applique un flip horizontal (scale(-1, 1)).
    // Pour éviter que la voiture se retrouve sur le toit (à l'envers) lors des trajets Sud/Nord ou Nord/Sud,
    // on ne la fait jamais pivoter la tête en bas.
    const dx = segTo.x - segFrom.x;
    const dy = segTo.y - segFrom.y;
    const goingEast = dx >= 0;

    // Phares illuminant la route en direction du déplacement
    ctx.save();
    ctx.rotate(angle);
    const beamGrad = ctx.createRadialGradient(8, 0, 2, 40, 0, 30);
    beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.7)');
    beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(8, -4);
    ctx.lineTo(46, -18);
    ctx.lineTo(46, 18);
    ctx.lineTo(8, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Rendu de la voiture toujours à l'endroit (tête en haut, roues sur la route)
    ctx.save();
    // Légère inclinaison selon la pente de la route sans jamais retourner le véhicule
    const pitch = Math.max(-0.35, Math.min(0.35, Math.atan2(dy, Math.abs(dx) || 1)));
    ctx.rotate(goingEast ? -pitch : pitch);
    if (goingEast) {
      ctx.scale(-1, 1); // Flip pour orienter l'avant de 🚗 vers l'Est
    }
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚗', 0, 0);
    ctx.restore();

    ctx.restore();

    // 4. Bulle d'ambiance de voyage animée au-dessus du convoi
    const bubbleY = curY - 26;
    const kmPct = Math.min(100, Math.round(progress * 100));
    const cleanCityName = (this.caravan.targetCity.name || '').split(' (')[0];
    const caravanTxt = `في الثنيّة لـ ${cleanCityName} (${kmPct}%)`;
    ctx.font = '900 9.5px "Cairo", sans-serif';
    const bubbleW = Math.max(92, Math.min(160, Math.ceil(ctx.measureText(caravanTxt).width + 18)));
    ctx.shadowBlur = 6;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(curX - bubbleW / 2, bubbleY - 10, bubbleW, 20, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.textAlign = 'center';
    ctx.fillText(caravanTxt, curX, bubbleY + 3, bubbleW - 10);

    ctx.restore();

    if (progress >= 0.999 || elapsed >= this.caravan.duration) {
      const arrivedCity = this.caravan.targetCity || waypoints[waypoints.length - 1];
      const isNewCity = this.caravan.isNewCity || false;
      this.caravan = null;

      // Déclencher l'effet cinématique d'arrivée dans la ville cible (choc doré + bannière)
      this.arrivalEffect = {
        city: arrivedCity,
        isNewCity: isNewCity,
        startTime: now,
        duration: 1200
      };

      // Son de triomphe/arrivée
      try {
        if (typeof window !== 'undefined' && window.soundEngine && window.soundEngine.playEventFanfare) {
          window.soundEngine.playEventFanfare();
        } else if (typeof window !== 'undefined' && window.soundFX && window.soundFX.playCoin) {
          window.soundFX.playCoin();
        }
      } catch (_) {}
    }
  }

  drawArrivalEffect(ctx, now) {
    if (!this.arrivalEffect) return;
    const elapsed = now - this.arrivalEffect.startTime;
    const progress = Math.min(1.0, elapsed / this.arrivalEffect.duration);
    const city = this.arrivalEffect.city;

    ctx.save();

    // 1. Onde de choc circulaire dorée et cyan expansive
    const maxR = 90;
    const curR = 15 + progress * maxR;
    const alpha = Math.max(0, 1 - progress);

    ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`;
    ctx.lineWidth = 4 * (1 - progress * 0.5);
    ctx.beginPath();
    ctx.arc(city.x, city.y, curR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.8})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(city.x, city.y, curR * 0.75, 0, Math.PI * 2);
    ctx.stroke();

    // 2. Particules d'étincelles festives jaillissantes
    for (let p = 0; p < 12; p++) {
      const angle = (p * Math.PI / 6) + progress * 2;
      const dist = progress * 70;
      const px = city.x + Math.cos(angle) * dist;
      const py = city.y + Math.sin(angle) * dist;
      ctx.fillStyle = p % 2 === 0 ? `rgba(254, 240, 138, ${alpha})` : `rgba(52, 211, 153, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, 3.5 * (1 - progress * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Bannière triomphale d'entrée dans la ville & montée de niveau
    const bannerW = 230;
    const bannerH = 52;
    const bannerX = city.x - bannerW / 2;
    const bannerY = city.y - 72 - Math.sin(progress * Math.PI) * 12;

    const bannerGrad = ctx.createLinearGradient(bannerX, bannerY, bannerX, bannerY + bannerH);
    bannerGrad.addColorStop(0, 'rgba(15, 23, 42, 0.98)');
    bannerGrad.addColorStop(1, 'rgba(30, 41, 59, 0.98)');

    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 20;
    ctx.fillStyle = bannerGrad;
    ctx.beginPath();
    ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 12);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.shadowBlur = 0;

    const isNewCity = this.arrivalEffect.isNewCity || false;
    const curLvl = this.engine.getPlayerLevel ? this.engine.getPlayerLevel() : (this.engine.playerLevel || 1);

    ctx.fillStyle = '#fef08a';
    ctx.font = '900 13.5px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🎉 مرحبا بيك في ${city.name} ! 🇹🇳`, city.x, bannerY + 20, bannerW - 16);

    ctx.fillStyle = isNewCity ? '#34d399' : '#38bdf8';
    ctx.font = '900 11px "Cairo", sans-serif';
    if (isNewCity) {
      ctx.fillText(`⭐ طلعت للمستوى ${curLvl} في الإمبراطورية !`, city.x, bannerY + 35, bannerW - 16);
    } else {
      ctx.fillText(`🚗 وصلت بالسلامة عبر الأوتوروت`, city.x, bannerY + 35, bannerW - 16);
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 9.5px "Cairo", sans-serif';
    ctx.fillText(isNewCity ? 'حوانت ومشاريع جديدة تستنّى فيك' : 'كمّل خدمتك وتجارتك في البلاد', city.x, bannerY + 47, bannerW - 16);

    ctx.restore();

    if (progress >= 0.999 || elapsed >= this.arrivalEffect.duration) {
      const arrivedCity = this.arrivalEffect.city;
      const isNew = this.arrivalEffect.isNewCity;
      this.arrivalEffect = null;
      if (this.onTravel) {
        try {
          this.onTravel(arrivedCity, isNew);
        } catch (err) {
          console.error('onTravel error', err);
        }
      }
    }
  }

  drawSelectedCityOverlay(ctx) {
    if (!this.selectedCityId) return;
    const c = this.cities.find(item => item.id === this.selectedCityId);
    if (!c) return;

    const isActive = this.getActiveCity().id === c.id;
    const isUnlocked = this.isCityUnlocked(c);
    const pct = this.getCityUnlockProgress(c);

    ctx.save();

    // Boîte Popover en bas de la carte, centrée sur la largeur visible
    const scale = Math.max(0.001, this.scale || 1);
    const vpW = this.canvas.width / (this.dpr * scale);
    const vpH = this.canvas.height / (this.dpr * scale);
    const cardW = Math.min(420, vpW - 24);
    const cardH = 110;
    const cardX = Math.max(12, (vpW - cardW) / 2);
    const cardY = vpH - cardH - 12;

    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 18;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 12);
    ctx.fill();

    ctx.strokeStyle = isActive ? '#10b981' : (isUnlocked ? '#38bdf8' : '#ef4444');
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Titre et icône avec numéro de niveau de ville
    ctx.font = '22px sans-serif';
    ctx.fillText(c.icon, cardX + cardW - 28, cardY + 26);

    const cityIndex = this.cities.findIndex(item => item.id === c.id) + 1;

    ctx.textAlign = 'right';
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 13px "Cairo", sans-serif';
    ctx.fillText(`${c.fullName} (محطّة ${cityIndex})`, cardX + cardW - 40, cardY + 22, cardW - 54);

    // Tagline complète sans coupure de mot (.slice supprimé) + auto-scale ergonomique
    ctx.fillStyle = '#94a3b8';
    const maxTaglineW = cardW - 24;
    let tagFont = 9.5;
    ctx.font = `700 ${tagFont}px "Cairo", sans-serif`;
    const tagMeasured = ctx.measureText(c.tagline).width;
    if (tagMeasured > maxTaglineW) {
      tagFont = Math.max(7.5, Math.floor((maxTaglineW / tagMeasured) * tagFont * 10) / 10);
      ctx.font = `700 ${tagFont}px "Cairo", sans-serif`;
    }
    ctx.fillText(c.tagline, cardX + cardW - 12, cardY + 38, maxTaglineW);

    // Bouton d'action à gauche
    const btnW = 105;
    const btnH = 30;
    const btnX = cardX + 12;
    const btnY = cardY + 46;

    // Boni de production (borné à droite du bouton d'action pour éviter toute collision)
    ctx.fillStyle = '#38bdf8';
    const bonusTxt = '🎁 ' + c.bonusDesc;
    const maxBonusW = Math.max(110, cardW - btnW - 32);
    let bonusFont = 10;
    ctx.font = `800 ${bonusFont}px "Cairo", sans-serif`;
    const bonusMeasured = ctx.measureText(bonusTxt).width;
    if (bonusMeasured > maxBonusW) {
      bonusFont = Math.max(7.5, Math.floor((maxBonusW / bonusMeasured) * bonusFont * 10) / 10);
      ctx.font = `800 ${bonusFont}px "Cairo", sans-serif`;
    }
    ctx.fillText(bonusTxt, cardX + cardW - 12, cardY + 58, maxBonusW);

    const canUnlock = this.canUnlockCity(c);
    if (isActive) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 8);
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.textAlign = 'center';
      ctx.font = '900 10.5px "Cairo", sans-serif';
      ctx.fillText('أنت هنا حالياً 🇹🇳', btnX + btnW / 2, btnY + 19);
    } else if (isUnlocked) {
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 8);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = '900 10.5px "Cairo", sans-serif';
      ctx.fillText('🚀 سافر الآن', btnX + btnW / 2, btnY + 19);
    } else if (canUnlock) {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 8);
      ctx.fill();
      ctx.strokeStyle = '#34d399';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = '900 10px "Cairo", sans-serif';
      ctx.fillText('✨ افتح الولاية', btnX + btnW / 2, btnY + 19);
    } else {
      // Bouton cadenas rouge/ambre à gauche
      ctx.fillStyle = 'rgba(127, 29, 29, 0.85)';
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 8);
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.font = '900 10px "Cairo", sans-serif';
      ctx.fillText('🔒 مقفلة (' + Math.round(pct * 100) + '%)', btnX + btnW / 2, btnY + 19);

      // BANDEAU PLEINE LARGEUR EN BAS DE LA CARTE EXPLIQUANT POURQUOI LA VILLE EST BLOQUÉE
      const reasonBoxX = cardX + 10;
      const reasonBoxY = cardY + 80;
      const reasonBoxW = cardW - 20;
      const reasonBoxH = 23;

      ctx.fillStyle = 'rgba(153, 27, 27, 0.35)';
      ctx.beginPath();
      ctx.roundRect(reasonBoxX, reasonBoxY, reasonBoxW, reasonBoxH, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(248, 113, 113, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const diagText = this.engine.getCityLockDiagnosis ? this.engine.getCityLockDiagnosis(c.id) : (c.criteriaDesc || `يتطلب ${c.reqDinars || 0} د.ت`);
      const fullReason = `⚠️ علاش مقفولة : ${diagText}`;
      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      let rFont = 10;
      ctx.font = `900 ${rFont}px "Cairo", sans-serif`;
      const mW = ctx.measureText(fullReason).width;
      if (mW > reasonBoxW - 12) {
        rFont = Math.max(7.5, Math.floor((reasonBoxW - 14) / mW * rFont * 10) / 10);
        ctx.font = `900 ${rFont}px "Cairo", sans-serif`;
      }
      ctx.fillText(fullReason, cardX + cardW / 2, reasonBoxY + 15, reasonBoxW - 10);
    }

    ctx.restore();
  }
}

// Export aliases for backwards compatibility with test harnesses and components
export const TunisianVectorMapEngine = TunisiaMapEngine;
export const PanoramicStreetCanvas = QuartierAnimator;



