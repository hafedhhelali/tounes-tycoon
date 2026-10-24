/**
 * store_animator.js
 * Moteur d'Animation Graphique Canvas 2D 60 FPS Haute Définition pour Tounes Tycoon.
 * Simulation visuelle cutaway vivante et détaillée des commerces tunisiens.
 * © EOLabs 2026. Pur JavaScript, zéro dépendance, gestion DPR fluide, zéro fuite mémoire.
 */

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

    // Simulation entities
    this.customers = [];
    this.particles = [];
    this.moneyPuffs = [];

    // Interaction clickable regions
    this.clickZones = [];

    this.onHireClick = null;
    this.onUpgradeClick = null;

    // Émotes & répertoires d'articles authentiques et spécifiques pour CHAQUE projet
    this.orderIcons = {
      kaskrout: ['🥖', '🥪', '🌶️', '🥤'],
      fricasse: ['🥟', '🍩', '🫒', '🥚'],
      kahwa: ['☕', '🍵', '♠️', '🍏'],
      attariya: ['🍞', '🥛', '🧀', '📲'],
      patisserie: ['🍯', '🥐', '🎂', '🧁'],
      taxi_collectif: ['🚖', '🏁', '🚕', '🛣️'],
      superette: ['🛒', '🍫', '🧃', '🧼'],
      supermarche: ['🥩', '📦', '🛒', '🧺'],
      salon_de_the: ['🍹', '🍸', '🍰', '🕶️'],
      restaurant: ['🍗', '🥘', '🥗', '🍖'],
      agence_voyages: ['✈️', '🎫', '🏝️', '🧳'],
      hotel: ['🛎️', '🍸', '🛏️', '🏊'],
      centre_commercial: ['🛍️', '👗', '👟', '🎮'],
      usine_conserves: ['🥫', '🐟', '🍅', '📦'],
      showroom_auto: ['🚗', '🚘', '🔑', '🏎️'],
      promoteur_immobilier: ['🏢', '🏗️', '📐', '🏡'],
      tayaran_el_ghzela: ['✈️', '🛫', '💺', '🌍'],
      default: ['🛒', '✨', '🪙', '📦']
    };

    this.happyReactions = ['😋', '⭐', '🥰', '👌', '❤️', '👏', '🔥'];
    this.avatarsPool = ['🚶‍♂️', '🧕', '🧔', '👴', '👩‍💻', '👨‍💼', '🧓', '🧑‍🎓'];

    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.canvas.addEventListener('click', this.handleCanvasClick);
  }

  setCallbacks({ onHire, onUpgrade }) {
    this.onHireClick = onHire;
    this.onUpgradeClick = onUpgrade;
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : { width: 360, height: 200 };
    this.width = Math.max(300, Math.floor(rect.width));
    this.height = 200;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.5);

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
  }

  start(bizId) {
    this.stop();
    this.bizId = bizId;
    this.customers = [];
    this.particles = [];
    this.moneyPuffs = [];
    this.spawnTimer = 0.5;
    this.resize();
    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    this.animId = requestAnimationFrame(this.loop);
  }

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.customers = [];
    this.particles = [];
    this.moneyPuffs = [];
    this.clickZones = [];
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
    return this.engine.businesses.find(b => b.id === this.bizId);
  }

  getOrderIcon() {
    const list = this.orderIcons[this.bizId] || this.orderIcons.default;
    return list[Math.floor(Math.random() * list.length)];
  }

  spawnCustomer() {
    const customer = {
      id: Math.random(),
      x: this.width + 25,
      y: 154,
      targetX: 68 + Math.random() * 18,
      state: 'walking_in', // walking_in, paying, walking_out
      avatar: this.avatarsPool[Math.floor(Math.random() * this.avatarsPool.length)],
      orderIcon: this.getOrderIcon(),
      reaction: null,
      payDuration: 0.9,
      payTimer: 0,
      walkCycle: Math.random() * Math.PI * 2
    };
    this.customers.push(customer);
  }

  triggerPayment(customer, isProducing) {
    const biz = this.getBiz();
    const cycleRevenue = biz ? this.engine.getRevenue(biz, Date.now()) : 0;
    const gainText = cycleRevenue > 0 ? `+${cycleRevenue.toFixed(1)} DT` : '+د.ت';

    // Money float puff
    this.moneyPuffs.push({
      x: customer.x - 10,
      y: customer.y - 45,
      vy: -35,
      text: `✨ ${gainText} 🪙`,
      life: 0.9,
      maxLife: 0.9,
      alpha: 1.0
    });

    // Golden sparkles / coin particles
    const count = isProducing ? 14 : 7;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const speed = 35 + Math.random() * 55;
      this.particles.push({
        x: 48,
        y: 135,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        color: Math.random() > 0.3 ? '#fbbf24' : '#f59e0b',
        radius: 1.5 + Math.random() * 2,
        life: 0.6 + Math.random() * 0.3,
        maxLife: 0.8,
        isSparkle: true
      });
    }
  }

  handleCanvasClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    for (const zone of this.clickZones) {
      if (
        clickX >= zone.x &&
        clickX <= zone.x + zone.width &&
        clickY >= zone.y &&
        clickY <= zone.y + zone.height
      ) {
        if (zone.type === 'hire_cashier' || zone.type === 'hire_worker') {
          if (this.onHireClick) this.onHireClick(this.bizId, zone.slotIndex);
        }
        break;
      }
    }
  }

  // --- RENDU D'ARRIÈRE-PLAN TUNISIEN DÉTAILLÉ & ARCHITECTURE DU COMMERCE ---
  drawBackdrop(ctx, bizId, now) {
    const w = this.width;
    const h = this.height;

    // 1. Fond mural avec dégradé d'ambiance
    let wallGrad = ctx.createLinearGradient(0, 0, 0, h - 54);
    if (bizId === 'kahwa') {
      wallGrad.addColorStop(0, '#1c1917');
      wallGrad.addColorStop(0.6, '#292524');
      wallGrad.addColorStop(1, '#1c1917');
    } else if (bizId === 'kaskrout' || bizId === 'fricasse') {
      wallGrad.addColorStop(0, '#1e293b');
      wallGrad.addColorStop(0.7, '#0f172a');
      wallGrad.addColorStop(1, '#020617');
    } else if (bizId === 'patisserie') {
      wallGrad.addColorStop(0, '#312e81');
      wallGrad.addColorStop(0.7, '#1e1b4b');
      wallGrad.addColorStop(1, '#0f172a');
    } else if (bizId === 'attariya') {
      wallGrad.addColorStop(0, '#0f291e');
      wallGrad.addColorStop(0.7, '#064e3b');
      wallGrad.addColorStop(1, '#022c22');
    } else if (bizId === 'taxi_collectif') {
      wallGrad.addColorStop(0, '#172554');
      wallGrad.addColorStop(0.6, '#1e3a8a');
      wallGrad.addColorStop(1, '#0f172a');
    } else {
      wallGrad.addColorStop(0, '#1e293b');
      wallGrad.addColorStop(1, '#090d16');
    }
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, w, h - 54);

    // 2. Frise ou Zellige tunisien en haut de mur
    ctx.save();
    ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
    ctx.fillRect(0, 0, w, 16);
    ctx.fillStyle = '#fbbf24';
    ctx.font = '10px monospace';
    for (let x = 6; x < w; x += 22) {
      ctx.fillText('◆', x, 12);
    }
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 16.5);
    ctx.lineTo(w, 16.5);
    ctx.stroke();
    ctx.restore();

    // 3. Décoration de fond spécifique par commerce
    this.drawStoreProps(ctx, bizId, now, w, h);

    // 4. Sol tunisien soigné (Damier / Pavés / Zellige vernis)
    const floorY = h - 54;
    const floorH = 54;
    let floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
    floorGrad.addColorStop(0, '#27272a');
    floorGrad.addColorStop(1, '#09090b');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, w, floorH);

    // Bordure dorée délimitant le comptoir/sol
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, floorY + 1);
    ctx.lineTo(w, floorY + 1);
    ctx.stroke();

    // Lignes de carrelage en perspective
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let x = -10; x < w + 60; x += 38) {
      ctx.beginPath();
      ctx.moveTo(x, floorY);
      ctx.lineTo(x - 22, h);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(0, floorY + 22);
    ctx.lineTo(w, floorY + 22);
    ctx.moveTo(0, floorY + 40);
    ctx.lineTo(w, floorY + 40);
    ctx.stroke();
  }

  // Éléments architecturaux et accessoires caractéristiques
  drawStoreProps(ctx, bizId, now, w, h) {
    ctx.save();
    const timeSec = now / 1000;

    if (bizId === 'kahwa') {
      // Étagères de verres à thé dorés et kawanen
      ctx.fillStyle = '#78350f';
      ctx.fillRect(100, 48, w - 120, 6);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(100, 84, w - 120, 6);
      ctx.font = '16px serif';
      for (let x = 115; x < w - 30; x += 32) {
        ctx.fillText('🍵', x, 46);
        ctx.fillText('☕', x, 82);
      }
      // Horloge murale tunisienne
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(62, 52, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#fef08a';
      ctx.font = '9px sans-serif';
      ctx.fillText('🕐', 56, 56);
    } else if (bizId === 'kaskrout' || bizId === 'fricasse') {
      // Étagères de baguettes croustillantes & bocaux d'harissa
      ctx.fillStyle = '#854d0e';
      ctx.fillRect(110, 52, w - 130, 6);
      ctx.fillStyle = '#a16207';
      ctx.fillRect(110, 88, w - 130, 6);
      ctx.font = '16px serif';
      for (let x = 120; x < w - 25; x += 34) {
        ctx.fillText('🥖', x, 50);
        ctx.fillText('🌶️', x, 86);
      }
      // Ardoise menu
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(50, 36, 44, 46);
      ctx.strokeStyle = '#ca8a04';
      ctx.strokeRect(50, 36, 44, 46);
      ctx.fillStyle = '#fde047';
      ctx.font = '8px sans-serif';
      ctx.fillText('عياري', 58, 52);
      ctx.fillText('حار 🔥', 58, 66);
    } else if (bizId === 'patisserie') {
      // Vitrine à gâteaux et cloches dorées
      ctx.fillStyle = '#581c87';
      ctx.fillRect(110, 52, w - 130, 6);
      ctx.fillStyle = '#6b21a8';
      ctx.fillRect(110, 88, w - 130, 6);
      ctx.font = '16px serif';
      for (let x = 122; x < w - 25; x += 36) {
        ctx.fillText('🍯', x, 50);
        ctx.fillText('🥐', x, 86);
      }
      // Lustre suspendu avec lueur
      const glow = Math.sin(timeSec * 2) * 2;
      ctx.strokeStyle = '#eab308';
      ctx.beginPath();
      ctx.moveTo(70, 16);
      ctx.lineTo(70, 36);
      ctx.stroke();
      ctx.font = '18px serif';
      ctx.fillText('✨', 61, 48 + glow);
    } else if (bizId === 'attariya') {
      // Bocaux et boîtes empilées
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(100, 50, w - 120, 6);
      ctx.fillRect(100, 86, w - 120, 6);
      ctx.font = '16px serif';
      for (let x = 112; x < w - 25; x += 32) {
        ctx.fillText('🥫', x, 48);
        ctx.fillText('🧀', x, 84);
      }
      // Carnet d'ardoise suspendu
      ctx.font = '16px serif';
      ctx.fillText('📖', 58, 58);
    } else if (bizId === 'taxi_collectif') {
      // Panneaux routiers & banderole station
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(40, 32, w - 80, 22);
      ctx.strokeStyle = '#60a5fa';
      ctx.strokeRect(40, 32, w - 80, 22);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🚖 محطّة التاكسي الجماعي - باب عليوة', w / 2, 47);
      ctx.textAlign = 'left';
    } else if (bizId === 'centre_commercial') {
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(40, 32, w - 80, 22);
      ctx.strokeStyle = '#a855f7';
      ctx.strokeRect(40, 32, w - 80, 22);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🛍️ المركز التجاري ومحلات الموضة', w / 2, 47);
      ctx.textAlign = 'left';
    } else if (bizId === 'usine_conserves') {
      ctx.fillStyle = '#3f3f46';
      ctx.fillRect(110, 52, w - 130, 6);
      ctx.fillStyle = '#52525b';
      ctx.fillRect(110, 88, w - 130, 6);
      ctx.font = '16px serif';
      for (let x = 120; x < w - 25; x += 32) {
        ctx.fillText('🥫', x, 50);
        ctx.fillText('🐟', x, 86);
      }
    } else if (bizId === 'showroom_auto') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(40, 32, w - 80, 22);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(40, 32, w - 80, 22);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🏎️ قاعة عرض السيارات الفاخرة', w / 2, 47);
      ctx.textAlign = 'left';
    } else if (bizId === 'promoteur_immobilier') {
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(40, 32, w - 80, 22);
      ctx.strokeStyle = '#34d399';
      ctx.strokeRect(40, 32, w - 80, 22);
      ctx.fillStyle = '#ecfdf5';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🏢 الشركة العقارية - اللجّ الأزرق', w / 2, 47);
      ctx.textAlign = 'left';
    } else if (bizId === 'tayaran_el_ghzela') {
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(40, 32, w - 80, 22);
      ctx.strokeStyle = '#f87171';
      ctx.strokeRect(40, 32, w - 80, 22);
      ctx.fillStyle = '#fef2f2';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🛫 الخطوط التونسية - طيران الغزالة', w / 2, 47);
      ctx.textAlign = 'left';
    } else {
      // Décor générique chaleureux
      ctx.fillStyle = '#334155';
      ctx.fillRect(110, 60, w - 130, 6);
      ctx.font = '16px serif';
      for (let x = 120; x < w - 30; x += 36) {
        ctx.fillText('📦', x, 56);
      }
    }
    ctx.restore();
  }

  // --- POSTE DE LA CAISSE (COMPTOIR VERNIS + CAISSIER + MACHINE) ---
  drawCashierCounter(ctx, detail, isBusy, now) {
    const timeSec = now / 1000;
    const counterX = 14;
    const counterY = 110;
    const deskW = 76;
    const deskH = 46;

    // 1. Caisse Enregistreuse / TPE
    ctx.save();
    const bounce = isBusy ? Math.sin(timeSec * 8) * 2 : 0;
    ctx.font = '28px sans-serif';
    ctx.fillText('📠', counterX + 22, counterY + bounce);

    // 2. Meuble Comptoir en bois vernis tunisien
    const woodGrad = ctx.createLinearGradient(counterX, counterY + 12, counterX, counterY + 12 + deskH);
    woodGrad.addColorStop(0, '#b45309');
    woodGrad.addColorStop(0.5, '#92400e');
    woodGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = woodGrad;
    ctx.beginPath();
    ctx.roundRect(counterX, counterY + 12, deskW, deskH, [8, 8, 4, 4]);
    ctx.fill();

    // Bordure dorée du comptoir
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Plaque dorée 'الكاسة'
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('الكاسة', counterX + deskW / 2, counterY + 38);

    // 3. Caissier (Derrière le comptoir)
    const cashierSlot = detail.staffSlots && detail.staffSlots[0];
    const cashierX = counterX + 22;
    const cashierY = counterY - 2;

    if (cashierSlot && cashierSlot.hired) {
      // Animation tête du caissier
      const bob = isBusy ? Math.sin(timeSec * 7) * 3 : Math.sin(timeSec * 2) * 1.5;
      ctx.font = '30px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👨‍💼', cashierX + 16, cashierY + bob);

      // Bulle de statut au-dessus
      const statusIcon = isBusy ? '✨' : '💤';
      ctx.font = '14px sans-serif';
      ctx.fillText(statusIcon, cashierX + 16, cashierY - 26 + (isBusy ? -Math.abs(Math.sin(timeSec * 6) * 4) : 0));
    } else {
      // Emplacement de recrutement cliquable pour la caisse
      this.drawHireButton(ctx, counterX + 10, counterY - 42, 56, 40, 'كاسيي', 0, 'hire_cashier');
    }
    ctx.restore();
  }

  // --- POSTES DE TRAVAIL DES EMPLOYÉS (MACHINES & OUVRIERS) ---
  drawWorkstations(ctx, detail, isBusy, now) {
    if (!detail.staffSlots) return;
    const timeSec = now / 1000;
    const startX = 104;
    const baseY = 148;
    const spacing = 58;

    detail.staffSlots.slice(1).forEach((slot, idx) => {
      const stationX = startX + idx * spacing;
      if (stationX > this.width - 40) return;

      ctx.save();

      // 1. Machine ou poste thématique au sol
      this.drawMachineProp(ctx, this.bizId, stationX, baseY, isBusy, timeSec);

      if (slot.hired) {
        // 2. Ouvrier animé
        const bob = isBusy ? Math.sin(timeSec * 7 + idx) * 3.5 : Math.sin(timeSec * 2 + idx) * 1.5;
        const tilt = isBusy ? Math.sin(timeSec * 7 + idx) * 0.08 : 0;

        ctx.translate(stationX + 20, baseY - 16 + bob);
        ctx.rotate(tilt);
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(slot.icon || '👨‍🍳', 0, 0);
        ctx.rotate(-tilt);
        ctx.translate(-(stationX + 20), -(baseY - 16 + bob));

        // Titre rôle
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.beginPath();
        ctx.roundRect(stationX + 2, baseY - 6, 36, 14, 4);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 8.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText((slot.role || 'عامل').slice(0, 6), stationX + 20, baseY + 4);

        // Effet actif : vapeur, friture, étincelles
        const effIcon = isBusy ? '♨️' : '💤';
        ctx.font = '14px sans-serif';
        ctx.fillText(effIcon, stationX + 20, baseY - 40 + (isBusy ? -Math.abs(Math.sin(timeSec * 5 + idx) * 5) : 0));
      } else {
        // Bouton de recrutement interactif sur le poste
        this.drawHireButton(ctx, stationX, baseY - 50, 44, 48, 'انتداب', idx + 1, 'hire_worker');
      }

      ctx.restore();
    });
  }

  // Machines et accessoires dynamiques par métier
  drawMachineProp(ctx, bizId, x, y, isBusy, timeSec) {
    ctx.save();
    if (bizId === 'kahwa') {
      // Machine à Espresso chromée avec manomètres
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x + 4, y - 26, 32, 26);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 4, y - 26, 32, 26);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '14px sans-serif';
      ctx.fillText('☕', x + 12, y - 8);
    } else if (bizId === 'kaskrout') {
      // Grill à sandwichs / plancha
      ctx.fillStyle = '#475569';
      ctx.fillRect(x + 4, y - 18, 32, 18);
      ctx.fillStyle = isBusy ? '#ef4444' : '#64748b';
      ctx.fillRect(x + 8, y - 14, 24, 4);
    } else if (bizId === 'fricasse') {
      // Bassine à friture d'huile bouillante
      ctx.fillStyle = '#713f12';
      ctx.beginPath();
      ctx.arc(x + 20, y - 8, 14, Math.PI, 0, false);
      ctx.fill();
      ctx.fillStyle = isBusy ? '#eab308' : '#ca8a04';
      ctx.fillRect(x + 10, y - 12, 20, 4);
    } else if (bizId === 'patisserie') {
      // Four rotatif doré
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x + 4, y - 28, 32, 28);
      ctx.strokeStyle = '#fbbf24';
      ctx.strokeRect(x + 4, y - 28, 32, 28);
      ctx.fillStyle = isBusy ? '#f59e0b' : '#451a03';
      ctx.fillRect(x + 10, y - 22, 20, 16);
    } else {
      // Plan de travail standard
      ctx.fillStyle = '#334155';
      ctx.fillRect(x + 6, y - 18, 28, 18);
      ctx.strokeStyle = '#64748b';
      ctx.strokeRect(x + 6, y - 18, 28, 18);
    }
    ctx.restore();
  }

  // Dessin d'un bouton de recrutement propre dans le canvas
  drawHireButton(ctx, x, y, width, height, label, slotIndex, type) {
    this.clickZones.push({ x, y, width, height, slotIndex, type });

    ctx.save();
    // Fond pointillé accueillant
    ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 8);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);

    // Icône + et texte
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('➕', x + width / 2, y + height / 2 - 2);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText(label, x + width / 2, y + height - 6);
    ctx.restore();
  }

  // --- CLIENTS VIVANTS AVEC BULLES DE COMMANDE ET DÉPLACEMENT ---
  drawCustomers(ctx, now) {
    const timeSec = now / 1000;

    for (const c of this.customers) {
      ctx.save();

      // Ombre portée au sol
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(c.x + 12, c.y + 4, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rebond organique pendant la marche
      const isWalking = c.state === 'walking_in' || c.state === 'walking_out';
      const bounce = isWalking ? Math.abs(Math.sin(c.walkCycle * 6)) * 4 : 0;
      const tilt = isWalking ? Math.sin(c.walkCycle * 6) * 0.05 : 0;

      // Dessin de l'avatar
      ctx.translate(c.x + 12, c.y - 12 - bounce);
      ctx.rotate(tilt);
      ctx.font = '26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(c.avatar, 0, 0);
      ctx.rotate(-tilt);
      ctx.translate(-(c.x + 12), -(c.y - 12 - bounce));

      // Bulle de pensée / commande au-dessus de la tête
      const bubbleX = c.x + 12;
      const bubbleY = c.y - 42 - bounce;
      const bubbleIcon = c.reaction ? c.reaction : c.orderIcon;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(bubbleX - 14, bubbleY - 14, 28, 24, 8);
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Pointe de bulle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(bubbleX - 3, bubbleY + 10);
      ctx.lineTo(bubbleX + 3, bubbleY + 10);
      ctx.lineTo(bubbleX, bubbleY + 14);
      ctx.closePath();
      ctx.fill();

      // Émote dans la bulle
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(bubbleIcon, bubbleX, bubbleY + 3);

      ctx.restore();
    }
  }

  // --- PARTICULES (FUMÉE VAPEUR, PIÈCES D'OR, ÉTINCELLES) ---
  drawParticles(ctx) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Liasses / Jaillissement de monnaie textuel
    for (const m of this.moneyPuffs) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, m.life / m.maxLife);
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.textAlign = 'center';
      ctx.fillText(m.text, m.x, m.y);
      ctx.restore();
    }
  }

  // --- BOUCLE D'ANIMATION 60 FPS ---
  loop(now) {
    if (!this.lastTime) this.lastTime = now;
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    const biz = this.getBiz();
    const detail = this.engine.getBusinessDetail ? this.engine.getBusinessDetail(this.bizId) : null;
    const isProducing = biz && (biz.isProducing || biz.hasManager || biz.progressMs > 0);

    // 1. Spawner de clients
    this.spawnTimer += dt;
    const spawnThreshold = isProducing ? 1.6 : 3.2;
    if (this.spawnTimer > spawnThreshold && this.customers.length < 5) {
      this.spawnCustomer();
      this.spawnTimer = 0;
    }

    // 2. Mise à jour de la physique des clients
    for (let i = this.customers.length - 1; i >= 0; i--) {
      const c = this.customers[i];
      c.walkCycle += dt;

      if (c.state === 'walking_in') {
        const speed = isProducing ? 85 : 55;
        c.x -= speed * dt;
        if (c.x <= c.targetX) {
          c.x = c.targetX;
          c.state = 'paying';
          this.triggerPayment(c, isProducing);
        }
      } else if (c.state === 'paying') {
        c.payTimer += dt;
        if (c.payTimer >= c.payDuration) {
          c.state = 'walking_out';
          c.reaction = this.happyReactions[Math.floor(Math.random() * this.happyReactions.length)];
        }
      } else if (c.state === 'walking_out') {
        c.x -= 75 * dt;
        if (c.x < -40) {
          this.customers.splice(i, 1);
          continue;
        }
      }
    }

    // 3. Particules d'ambiance et vapeur active
    if (isProducing && Math.random() < 0.35) {
      // Vapeur de café ou fumée de cuisson
      const sourceX = 110 + Math.random() * (this.width - 150);
      this.particles.push({
        x: sourceX,
        y: 120,
        vx: Math.random() * 8 - 4,
        vy: -20 - Math.random() * 25,
        color: 'rgba(255, 255, 255, 0.35)',
        radius: 2 + Math.random() * 3,
        life: 0.9,
        maxLife: 0.9,
        isSparkle: false
      });
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

    // 4. Dessin complet de la frame Canvas
    this.clickZones = [];
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.drawBackdrop(this.ctx, this.bizId, now);

    if (detail) {
      this.drawCashierCounter(this.ctx, detail, isProducing, now);
      this.drawWorkstations(this.ctx, detail, isProducing, now);
    }

    this.drawCustomers(this.ctx, now);
    this.drawParticles(this.ctx);

    this.animId = requestAnimationFrame(this.loop);
  }
}

/**
 * QuartierAnimator
 * Moteur Panoramique Canvas 2D 60 FPS du Quartier Tunisien Vivant pour Tounes Tycoon (Landscape).
 * Gère les transitions cinématiques de quartiers, les évolutions visuelles de paliers (25, 50, 100, 200),
 * les animations de véhicules, piétons, fumée, drapeaux et bulles de gains.
 */
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
    this.clouds = [];
    this.floatingCoins = [];
    this.smokePuffs = [];
    this.palms = [];
    this.seagulls = [];
    this.interactiveHitboxes = [];

    this.bizTemplates = {
      kaskrout: { id: 'kaskrout', width: 145, height: 115, style: 'sandwich_stall', color: '#f59e0b', roofColor: '#dc2626' },
      fricasse: { id: 'fricasse', width: 140, height: 118, style: 'fricasse_stand', color: '#f97316', roofColor: '#b45309' },
      kahwa: { id: 'kahwa', width: 170, height: 132, style: 'cafe_terrasse', color: '#eab308', roofColor: '#1e3a8a' },
      attariya: { id: 'attariya', width: 155, height: 128, style: 'attariya_shop', color: '#10b981', roofColor: '#047857' },
      patisserie: { id: 'patisserie', width: 165, height: 138, style: 'patisserie_dorée', color: '#fbbf24', roofColor: '#d97706' },
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
      tayaran_el_ghzela: { id: 'tayaran_el_ghzela', width: 230, height: 205, style: 'airline_headquarters', color: '#f1f5f9', roofColor: '#e11d48' }
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

  setCallbacks({ onInspect, onUpgrade, onCollect, onHudAction, onSwitchZone }) {
    if (onInspect) this.onInspectBiz = onInspect;
    if (onUpgrade) this.onUpgradeBiz = onUpgrade;
    if (onCollect) this.onCollectBiz = onCollect;
    if (onHudAction) this.onHudAction = onHudAction;
    if (onSwitchZone) this.onSwitchZone = onSwitchZone;
  }

  buildZoneLayout(zoneId) {
    const zoneSpecs = {
      bab_souika: [
        { type: 'house', style: 'medina', name: 'دار بن عاشور', width: 115, height: 118, wallColor: '#fef3c7', doorColor: '#2563eb' },
        { type: 'biz', id: 'kaskrout' },
        { type: 'crossroad', streetName: 'نهج الباشا', width: 120, nextZoneId: 'la_goulette', nextZoneLabel: 'حلق الوادي ⚓' },
        { type: 'biz', id: 'fricasse' },
        { type: 'house', style: 'medina', name: 'دار العربي', width: 120, height: 125, wallColor: '#fffbeb', doorColor: '#eab308' },
        { type: 'biz', id: 'kahwa' },
        { type: 'crossroad', streetName: 'بطحاء باب سويقة', width: 125, nextZoneId: 'la_goulette', nextZoneLabel: 'حلق الوادي ⚓' },
        { type: 'biz', id: 'attariya' },
        { type: 'house', style: 'medina', name: 'دار سيدي محرز', width: 115, height: 120, wallColor: '#f8fafc', doorColor: '#0284c7' }
      ],
      la_goulette: [
        { type: 'house', style: 'goulette', name: 'فيلا سيدي بوسعيد', width: 125, height: 130, wallColor: '#f8fafc', doorColor: '#0284c7' },
        { type: 'biz', id: 'patisserie' },
        { type: 'crossroad', streetName: 'شارع فرحات حشاد', width: 125, nextZoneId: 'lac_2', nextZoneLabel: 'البحيرة 2 🏙️' },
        { type: 'biz', id: 'taxi_collectif' },
        { type: 'house', style: 'goulette', name: 'دار الكورنيش', width: 125, height: 126, wallColor: '#f0f9ff', doorColor: '#2563eb' },
        { type: 'biz', id: 'superette' },
        { type: 'crossroad', streetName: 'مفترق الكرم والبحيرة', width: 130, nextZoneId: 'lac_2', nextZoneLabel: 'البحيرة 2 🏙️' },
        { type: 'house', style: 'goulette', name: 'دار البحر', width: 120, height: 122, wallColor: '#ffffff', doorColor: '#0369a1' }
      ],
      lac_2: [
        { type: 'house', style: 'lac', name: 'إقامة البحيرة بلازا', width: 130, height: 162, wallColor: '#e2e8f0', doorColor: '#0ea5e9' },
        { type: 'biz', id: 'supermarche' },
        { type: 'crossroad', streetName: 'جادة البحيرة 2', width: 130, nextZoneId: 'hammamet', nextZoneLabel: 'الحمامات 🏖️' },
        { type: 'biz', id: 'salon_de_the' },
        { type: 'house', style: 'lac', name: 'عمارة السفارات', width: 130, height: 168, wallColor: '#cbd5e1', doorColor: '#38bdf8' },
        { type: 'biz', id: 'restaurant' },
        { type: 'crossroad', streetName: 'مفترق لاك سنتر', width: 130, nextZoneId: 'hammamet', nextZoneLabel: 'الحمامات 🏖️' },
        { type: 'biz', id: 'agence_voyages' },
        { type: 'house', style: 'lac', name: 'برج الياسمين', width: 125, height: 158, wallColor: '#f1f5f9', doorColor: '#0284c7' }
      ],
      hammamet: [
        { type: 'house', style: 'hammamet', name: 'فيلا الياسمين', width: 135, height: 138, wallColor: '#fffbeb', doorColor: '#d97706' },
        { type: 'biz', id: 'hotel' },
        { type: 'crossroad', streetName: 'شارع المارينا', width: 135, nextZoneId: 'djerba_holding', nextZoneLabel: 'تونس الدولية 👑' },
        { type: 'biz', id: 'centre_commercial' },
        { type: 'house', style: 'hammamet', name: 'رياض قمرت', width: 135, height: 142, wallColor: '#fef3c7', doorColor: '#059669' },
        { type: 'biz', id: 'usine_conserves' },
        { type: 'crossroad', streetName: 'مفترق الحمامات الجنوبية', width: 135, nextZoneId: 'djerba_holding', nextZoneLabel: 'تونس الدولية 👑' },
        { type: 'house', style: 'hammamet', name: 'دار الفلّ والياسمين', width: 130, height: 134, wallColor: '#ffffff', doorColor: '#0284c7' }
      ],
      djerba_holding: [
        { type: 'house', style: 'djerba', name: 'حوش جربة الكبير', width: 140, height: 148, wallColor: '#f8fafc', doorColor: '#0284c7' },
        { type: 'biz', id: 'showroom_auto' },
        { type: 'crossroad', streetName: 'ساحة قرطاج الدولية', width: 135, nextZoneId: 'bab_souika', nextZoneLabel: 'باب سويقة 🕌' },
        { type: 'biz', id: 'promoteur_immobilier' },
        { type: 'house', style: 'djerba', name: 'قصر الأغالبة', width: 145, height: 155, wallColor: '#fef3c7', doorColor: '#b45309' },
        { type: 'biz', id: 'tayaran_el_ghzela' },
        { type: 'crossroad', streetName: 'مفترق المطار الدولي', width: 135, nextZoneId: 'bab_souika', nextZoneLabel: 'باب سويقة 🕌' },
        { type: 'house', style: 'djerba', name: 'فيلا النخيل', width: 135, height: 142, wallColor: '#ffffff', doorColor: '#2563eb' }
      ]
    };

    const rawItems = zoneSpecs[zoneId] || zoneSpecs.bab_souika;
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
      { x: 120, speed: 95, dir: 1, type: 'taxi_collectif' },
      { x: 520, speed: 112, dir: 1, type: 'taxi_citadin' },
      { x: 920, speed: 92, dir: -1, type: 'louage' },
      { x: 1280, speed: 124, dir: 1, type: 'citadine_rouge' },
      { x: 1580, speed: 105, dir: -1, type: 'taxi_collectif' }
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
      this.pedestrians.push({
        x: 50 + Math.random() * Math.max(300, this.worldWidth - 100),
        yOffset: (Math.random() - 0.5) * 14,
        speed: (26 + Math.random() * 28) * (Math.random() > 0.5 ? 1 : -1),
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
  }

  transitionToZone(zoneId, zoneName) {
    const changed = this.currentZoneId !== zoneId || this.streetLayout.length === 0;
    this.currentZoneId = zoneId;
    this.transitionBannerText = zoneName || 'حيّ جديد';
    const zoneIcons = {
      bab_souika: '🕌',
      la_goulette: '⚓',
      lac_2: '🏙️',
      hammamet: '🏖️',
      djerba_holding: '👑'
    };
    const zoneSubtitles = {
      bab_souika: 'قلب العاصمة التونسية وأصل الحرفة والتجارة',
      la_goulette: 'نسمة البحر وحركية الكورنيش والتاكسي الجماعي',
      lac_2: 'الأبراج الزجاجية والمشاريع العصرية الكبرى',
      hammamet: 'السياحة الفاخرة والنزل العالمية والمولات',
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
      const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
      this.lastTime = timestamp;
      this.update(dt, timestamp);
      this.render(timestamp);
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
    this.startX = e.clientX;
    this.startCamX = this.cameraX;
    this.hasDraggedSignificantly = false;
  }

  handlePointerMove(e) {
    if (!this.isDragging) return;
    const delta = e.clientX - this.startX;
    if (Math.abs(delta) > 6) {
      this.hasDraggedSignificantly = true;
    }
    this.targetCameraX = this.startCamX - delta;
    this.targetCameraX = Math.max(0, Math.min(this.targetCameraX, this.worldWidth - this.width));
  }

  handlePointerUp(e) {
    if (!this.isDragging) return;
    this.isDragging = false;

    if (!this.hasDraggedSignificantly) {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

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
    if (action === 'inspect' && this.onInspectBiz) {
      this.onInspectBiz(bizId);
    } else if (action === 'upgrade' && this.onUpgradeBiz) {
      this.onUpgradeBiz(bizId);
    } else if (action === 'collect' && this.onCollectBiz) {
      this.onCollectBiz(bizId);
    } else if (action === 'switch_zone' && this.onSwitchZone) {
      this.onSwitchZone(bizId);
    } else if (action.startsWith('hud_') && this.onHudAction) {
      this.onHudAction(action);
    }
  }

  update(dt, timestamp) {
    this.cameraX += (this.targetCameraX - this.cameraX) * Math.min(1, dt * 10);

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

    this.seagulls.forEach(s => {
      s.x += s.speed * dt;
      s.wingPhase += dt * 8;
      if (s.x > this.worldWidth + 100) s.x = -80;
    });

    this.taxis.forEach(t => {
      t.x += t.speed * t.dir * dt;
      if (t.dir > 0 && t.x > this.worldWidth + 120) t.x = -100;
      if (t.dir < 0 && t.x < -120) t.x = this.worldWidth + 100;
    });

    this.pedestrians.forEach(p => {
      p.x += p.speed * dt;
      if (p.x < 30) { p.x = 30; p.speed *= -1; }
      if (p.x > this.worldWidth - 30) { p.x = this.worldWidth - 30; p.speed *= -1; }

      p.visitTimer -= dt;
      if (p.visitTimer <= 0) {
        p.visitTimer = 5 + Math.random() * 8;
        const tunisianQuips = ['بنينة ! 🤤', 'عزّ الطلة 👌', 'تبارك الله 🔥', 'صحة ! ☕', 'ملا جو 🇹🇳', 'الكاسة تعمرت 💰'];
        p.bubbleText = tunisianQuips[Math.floor(Math.random() * tunisianQuips.length)];
        p.bubbleTimer = 2.2;
      }
      if (p.bubbleTimer > 0) {
        p.bubbleTimer -= dt;
        if (p.bubbleTimer <= 0) p.bubbleText = null;
      }
    });

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
  }

  render(timestamp) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const camX = this.cameraX;
    const groundY = Math.max(195, Math.min(255, h - 55));

    this.interactiveHitboxes = [];
    ctx.clearRect(0, 0, w, h);

    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    if (this.currentZoneId === 'la_goulette') {
      skyGrad.addColorStop(0, '#0c4a6e');
      skyGrad.addColorStop(0.5, '#0284c7');
      skyGrad.addColorStop(1, '#38bdf8');
    } else if (this.currentZoneId === 'lac_2') {
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(0.5, '#1e1b4b');
      skyGrad.addColorStop(1, '#4338ca');
    } else if (this.currentZoneId === 'hammamet') {
      skyGrad.addColorStop(0, '#1e1b4b');
      skyGrad.addColorStop(0.5, '#701a75');
      skyGrad.addColorStop(1, '#f59e0b');
    } else {
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(0.4, '#1e1b4b');
      skyGrad.addColorStop(0.75, '#431407');
      skyGrad.addColorStop(1, '#b45309');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    for (let i = 0; i < 35; i++) {
      const sx = ((i * 137.5) % w);
      const sy = ((i * 73.1) % (h * 0.45));
      const blink = Math.sin(timestamp * 0.003 + i) * 0.5 + 0.5;
      ctx.globalAlpha = 0.2 + blink * 0.6;
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }
    ctx.globalAlpha = 1.0;

    this.drawSkylineBackground(ctx, camX, w, h, groundY - 10);

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

    this.pedestrians.forEach(p => {
      const screenX = p.x - camX;
      if (screenX > -50 && screenX < w + 50) {
        this.drawPedestrian(ctx, screenX, groundY + 12 + p.yOffset * 0.6, p, timestamp);
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

  drawSkylineBackground(ctx, camX, w, h, groundY = 245) {
    ctx.save();

    // Lune en croissant doré & halo céleste
    const moonX = w - 95 - (camX * 0.03);
    const moonY = 38;
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 4, moonX, moonY, 38);
    moonGlow.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
    moonGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 38, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = this.currentZoneId === 'la_goulette' ? '#0c4a6e' : '#0f172a';
    ctx.beginPath();
    ctx.arc(moonX - 4, moonY - 3, 10, 0, Math.PI * 2);
    ctx.fill();

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
    const biz = this.engine.businesses.find(item => item.id === b.id);
    const isUnlocked = biz && biz.level > 0;
    const isProducing = biz && (biz.isProducing || biz.hasManager || biz.progressMs > 0);
    const maxAllowedH = Math.max(110, groundY - 42);
    const bHeight = Math.min(b.height, maxAllowedH);
    const y = groundY - bHeight;
    const level = biz ? biz.level : 0;

    ctx.save();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(x + b.width / 2, groundY, b.width * 0.55, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    if (!isUnlocked) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.fillRect(x, y + 20, b.width, bHeight - 20);
      ctx.strokeRect(x, y + 20, b.width, bHeight - 20);

      ctx.fillStyle = '#f59e0b';
      ctx.font = '900 13px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(biz ? biz.icon : '🚧', x + b.width / 2, y + 52);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '700 11px "Cairo", sans-serif';
      ctx.fillText(biz ? biz.name : 'مشروع جديد', x + b.width / 2, y + 72);

      const btnW = Math.min(b.width - 20, 110);
      const btnH = 26;
      const btnX = x + (b.width - btnW) / 2;
      const btnY = y + bHeight - 28;

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 8);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 11px "Cairo", sans-serif';
      ctx.fillText('🔑 افتح المحلّ', btnX + btnW / 2, btnY + 17);

      this.interactiveHitboxes.push({
        x: btnX,
        y: btnY,
        w: btnW,
        h: btnH,
        action: 'upgrade',
        bizId: b.id
      });

      ctx.restore();
      return;
    }

    let tierBorder = 'rgba(255, 255, 255, 0.2)';
    let tierBorderWidth = 2;
    let hasGoldAura = false;
    let hasNeonSign = false;

    if (level >= 200) {
      tierBorder = '#f59e0b';
      tierBorderWidth = 3.5;
      hasGoldAura = true;
      hasNeonSign = true;
    } else if (level >= 100) {
      tierBorder = '#38bdf8';
      tierBorderWidth = 3;
      hasNeonSign = true;
    } else if (level >= 50) {
      tierBorder = '#a855f7';
      tierBorderWidth = 2.5;
    } else if (level >= 25) {
      tierBorder = '#10b981';
      tierBorderWidth = 2.2;
    }

    if (hasGoldAura) {
      ctx.save();
      const pulse = Math.sin(timestamp * 0.005) * 5 + 8;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = pulse;
    }

    const grad = ctx.createLinearGradient(x, y, x, groundY);
    grad.addColorStop(0, b.color);
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.strokeStyle = tierBorder;
    ctx.lineWidth = tierBorderWidth;
    ctx.beginPath();
    ctx.roundRect(x, y + 16, b.width, bHeight - 16, [8, 8, 0, 0]);
    ctx.fill();
    ctx.stroke();

    if (hasGoldAura) ctx.restore();

    ctx.fillStyle = b.roofColor;
    ctx.beginPath();
    ctx.moveTo(x - 6, y + 18);
    ctx.lineTo(x + b.width + 6, y + 18);
    ctx.lineTo(x + b.width, y + 2);
    ctx.lineTo(x, y + 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    for (let rx = x; rx < x + b.width; rx += 16) {
      ctx.fillRect(rx, y + 4, 8, 14);
    }

    this.drawTunisianFlag(ctx, x + b.width - 24, y - 10, timestamp);

    ctx.save();
    if (hasNeonSign) {
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.roundRect(x + 10, y + 22, b.width - 20, 22, 6);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#fef08a';
    ctx.font = '900 11px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${biz.icon} ${biz.name}`, x + b.width / 2, y + 37);

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(x + 6, y + 18, 26, 15, 4);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.font = '900 9px "Cairo", sans-serif';
    ctx.fillText(`L${level}`, x + 19, y + 29);

    const winY = y + 48;
    const winH = Math.max(26, bHeight - 86);
    ctx.fillStyle = isProducing ? 'rgba(254, 240, 138, 0.28)' : 'rgba(30, 41, 59, 0.4)';
    ctx.beginPath();
    ctx.roundRect(x + 12, winY, b.width - 24, winH, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();

    const iconCenterY = winY + winH / 2 + 5;
    ctx.font = '15px serif';
    if (b.id === 'kaskrout') {
      ctx.fillText('🥖', x + 24, iconCenterY);
      ctx.fillText('👨‍🍳', x + b.width / 2, iconCenterY);
      ctx.fillText('🥪', x + b.width - 24, iconCenterY);
    } else if (b.id === 'kahwa') {
      ctx.fillText('☕', x + 22, iconCenterY);
      ctx.fillText('🃏', x + b.width / 2, iconCenterY);
      ctx.fillText('👴', x + b.width - 24, iconCenterY);
    } else if (b.id === 'taxi_collectif') {
      ctx.fillText('🚖', x + 25, iconCenterY);
      ctx.fillText('🏁', x + b.width / 2, iconCenterY);
      ctx.fillText('🕶️', x + b.width - 25, iconCenterY);
    } else {
      ctx.fillText(biz.icon, x + b.width / 2, iconCenterY);
    }

    const barW = b.width - 24;
    const barH = 5;
    const barX = x + 12;
    const barY = groundY - 36;
    const pct = Math.min(1, (biz.progressMs || 0) / (biz.cycleDurationMs || 1000));

    ctx.fillStyle = '#090d16';
    ctx.fillRect(barX, barY, barW, barH);
    if (pct > 0) {
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(barX, barY, barW * pct, barH);
    }

    const btnW = (b.width - 28) / 2;
    const btnH = 22;
    const btnInspectX = x + 10;
    const btnUpgradeX = x + 14 + btnW;
    const btnY = groundY - 26;

    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.roundRect(btnInspectX, btnY, btnW, btnH, 6);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 10px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏪 ادخل', btnInspectX + btnW / 2, btnY + 15);

    const canAfford = this.engine.dinars >= this.engine.getCost(biz);
    ctx.fillStyle = canAfford ? '#10b981' : '#475569';
    ctx.beginPath();
    ctx.roundRect(btnUpgradeX, btnY, btnW, btnH, 6);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 10px "Cairo", sans-serif';
    ctx.fillText(`⬆️ L${biz.level + 1}`, btnUpgradeX + btnW / 2, btnY + 15);

    this.interactiveHitboxes.push({
      x: btnInspectX,
      y: btnY,
      w: btnW,
      h: btnH,
      action: 'inspect',
      bizId: b.id
    });

    this.interactiveHitboxes.push({
      x: btnUpgradeX,
      y: btnY,
      w: btnW,
      h: btnH,
      action: 'upgrade',
      bizId: b.id
    });

    this.interactiveHitboxes.push({
      x: x,
      y: y,
      w: b.width,
      h: bHeight - 28,
      action: 'inspect',
      bizId: b.id
    });

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

    // Nom de la maison & petit chat tunisien sur le toit / seuil
    ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
    ctx.beginPath();
    ctx.roundRect(x + 12, y + 18, w - 24, 15, 4);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '800 9.5px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🏡 ${hItem.name}`, x + w / 2, y + 29);

    // Petit chat ou jasmin animé
    const catBob = Math.sin(timestamp * 0.004 + x) * 1.5;
    ctx.font = '12px serif';
    ctx.fillText('🐈', x + w - 16, groundY - 4 + catBob * 0.3);

    ctx.restore();
  }

  drawCrossroad(ctx, cItem, x, groundY, h, timestamp) {
    const w = cItem.width || 125;
    const roadY = groundY + 20;

    ctx.save();

    // 1. Perspective de la rue perpendiculaire avec façades lointaines illuminées
    const backTopY = Math.max(82, groundY - 98);
    const topW = w * 0.46;
    const topX = x + (w - topW) / 2;

    // Bâtiments de fond de ruelle
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(topX - 10, backTopY - 22, topW * 0.55, 24);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(topX + topW * 0.42, backTopY - 30, topW * 0.65, 32);
    // Petites fenêtres éclairées au fond
    ctx.fillStyle = 'rgba(254, 240, 138, 0.65)';
    ctx.fillRect(topX - 4, backTopY - 16, 4, 5);
    ctx.fillRect(topX + 4, backTopY - 16, 4, 5);
    ctx.fillRect(topX + topW * 0.52, backTopY - 24, 4, 5);
    ctx.fillRect(topX + topW * 0.72, backTopY - 24, 4, 5);

    // Chaussée de la ruelle en perspective
    const alleyGrad = ctx.createLinearGradient(0, backTopY, 0, roadY);
    alleyGrad.addColorStop(0, '#090d16');
    alleyGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = alleyGrad;
    ctx.beginPath();
    ctx.moveTo(topX, backTopY);
    ctx.lineTo(topX + topW, backTopY);
    ctx.lineTo(x + w, roadY);
    ctx.lineTo(x, roadY);
    ctx.closePath();
    ctx.fill();

    // Trottoirs latéraux en perspective (3D curb)
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(topX - 6, backTopY);
    ctx.lineTo(topX, backTopY);
    ctx.lineTo(x + 8, roadY);
    ctx.lineTo(x - 4, roadY);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(topX + topW, backTopY);
    ctx.lineTo(topX + topW + 6, backTopY);
    ctx.lineTo(x + w + 4, roadY);
    ctx.lineTo(x + w - 8, roadY);
    ctx.closePath();
    ctx.fill();

    // Bordures jaunes et noires de sécurité
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(topX, backTopY);
    ctx.lineTo(x + 6, roadY);
    ctx.moveTo(topX + topW, backTopY);
    ctx.lineTo(x + w - 6, roadY);
    ctx.stroke();

    // Ligne médiane pointillée de la rue secondaire
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([7, 7]);
    ctx.beginPath();
    ctx.moveTo(x + w / 2, backTopY + 8);
    ctx.lineTo(x + w / 2, roadY - 14);
    ctx.stroke();
    ctx.setLineDash([]);

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

    // 4. Plaque de rue tunisienne émaillée (bleue & bordure blanche)
    const signW = Math.min(w - 14, 110);
    const signH = 20;
    const signX = x + (w - signW) / 2 + 4;
    const signY = groundY - 84;

    ctx.fillStyle = '#1e3a8a';
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(signX, signY, signW, signH, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 9.5px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🪧 ${cItem.streetName}`, signX + signW / 2, signY + 14);

    // 5. Panneau directionnel cliquable vers le quartier suivant !
    if (cItem.nextZoneId && cItem.nextZoneLabel) {
      const dirW = Math.min(w - 8, 116);
      const dirH = 24;
      const dirX = x + (w - dirW) / 2 + 4;
      const dirY = groundY - 58;

      const signGrad = ctx.createLinearGradient(dirX, dirY, dirX, dirY + dirH);
      signGrad.addColorStop(0, '#10b981');
      signGrad.addColorStop(1, '#047857');
      ctx.fillStyle = signGrad;
      ctx.strokeStyle = '#a7f3d0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(dirX, dirY, dirW, dirH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 10px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`⬅️ ${cItem.nextZoneLabel}`, dirX + dirW / 2, dirY + 16);

      this.interactiveHitboxes.push({
        x: dirX,
        y: dirY,
        w: dirW,
        h: dirH,
        action: 'switch_zone',
        bizId: cItem.nextZoneId
      });
    }

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

    if (t.type === 'taxi_collectif' || t.type === 'louage') {
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

  drawPedestrian(ctx, x, y, p, timestamp) {
    ctx.save();
    const walkCycle = timestamp * 0.01 + (p.phase || 0) + p.x * 0.08;
    const stride = Math.sin(walkCycle) * 4.5;
    const bounce = Math.abs(Math.cos(walkCycle)) * 1.8;
    const dir = p.speed >= 0 ? 1 : -1;

    // Ombre portée au sol
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    ctx.beginPath();
    ctx.ellipse(x, y + 6, 7, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(x, y - bounce);
    if (dir < 0) ctx.scale(-1, 1);

    // Jambes animées en marche
    ctx.strokeStyle = p.pants || '#1e293b';
    ctx.lineWidth = 3;
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

    // Bras oscillant + accessoire tunisien (Couffin, Sac, Café)
    ctx.strokeStyle = p.coat || '#0284c7';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(stride * 0.6, -5);
    ctx.stroke();

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
    const r = 16; // Rayon des petites icônes rondes 3D (32x32px)
    const topY = 23;

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
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Reflet spéculaire supérieur (effet bijou / verre bombé)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 7, r * 0.62, r * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();

      // Icône centrale
      ctx.font = '15px serif';
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
        ctx.arc(cx + 11, cy - 11, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 8px "Cairo", sans-serif';
        ctx.fillText(badgeText, cx + 11, cy - 10.5);
      }
    };

    // 1. Petites icônes d'offres 3D en haut à droite DANS le ciel de l'image
    const rightIcons = [
      {
        action: 'hud_boost',
        icon: '🚀',
        sub: o.adBoostActive ? 'x2' : '',
        bg: o.adBoostActive ? '#059669' : '#0284c7',
        border: o.adBoostActive ? '#6ee7b7' : '#7dd3fc',
        badgeBg: '#10b981'
      },
      {
        action: 'hud_cash',
        icon: '🎁',
        sub: '+',
        bg: '#0369a1',
        border: '#38bdf8',
        badgeBg: '#f59e0b'
      },
      {
        action: 'hud_prestige',
        icon: '👑',
        sub: o.canPrestige ? '!' : '',
        bg: o.canPrestige ? '#d97706' : '#334155',
        border: '#fde047',
        badgeBg: '#ef4444'
      },
      {
        action: 'hud_wheel',
        icon: '🎡',
        sub: o.wheelReady ? '!' : '',
        bg: o.wheelReady ? '#e11d48' : '#881337',
        border: '#fda4af',
        badgeBg: '#10b981'
      }
    ];

    let rightX = w - 24;
    rightIcons.forEach(item => {
      draw3DOrbIcon(rightX, topY, item.icon, item.bg, item.border, item.sub, item.badgeBg);

      this.interactiveHitboxes.push({
        x: rightX - r - 4,
        y: topY - r - 4,
        w: (r + 4) * 2,
        h: (r + 4) * 2,
        action: item.action,
        bizId: null
      });

      rightX -= (r * 2 + 8);
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

    let leftX = 24;
    leftAlerts.forEach((a, idx) => {
      const cy = topY + Math.sin(timestamp * 0.008 + idx) * 2.5;

      // Halo lumineux autour de l'alerte
      ctx.fillStyle = a.border;
      ctx.globalAlpha = 0.25 + (Math.sin(timestamp * 0.01) * 0.15);
      ctx.beginPath();
      ctx.arc(leftX, cy, r + 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;

      draw3DOrbIcon(leftX, cy, a.icon, a.bg, a.border, a.dot, '#f59e0b');

      this.interactiveHitboxes.push({
        x: leftX - r - 4,
        y: topY - r - 4,
        w: (r + 4) * 2,
        h: (r + 4) * 2,
        action: a.action,
        bizId: null
      });

      leftX += (r * 2 + 10);
    });

    ctx.restore();
  }
}

