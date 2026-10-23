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

    // Émotes & répertoires thématiques tunisiens
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
