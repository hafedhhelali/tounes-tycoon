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

    // Simulation entities
    this.customers = [];
    this.particles = [];
    this.moneyPuffs = [];
    this.steamWisps = [];

    // Interaction clickable regions
    this.clickZones = [];

    this.onHireClick = null;
    this.onUpgradeClick = null;
    this.onServeClick = null;

    // Émotes & répertoires d'articles authentiques et spécifiques pour CHAQUE projet
    this.orderIcons = {
      kaskrout: ['🥖', '🥪', '🌶️', '🥤'],
      fricasse: ['🥟', '🍩', '🫒', '🥚'],
      kahwa: ['☕', '🍵', '♠️', '🍏'],
      attariya: ['🍞', '🥛', '🧀', '🫒', '🥫', '🧼', '🥚', '🧂'],
      patisserie: ['🍯', '🥐', '🎂', '🧁'],
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
      default: ['🛒', '✨', '🪙', '📦']
    };

    this.happyReactions = ['😋', '⭐', '🥰', '👌', '❤️', '👏', '🔥'];
    this.avatarsPool = ['🚶‍♂️', '🧕', '🧔', '👴', '👩‍💻', '👨‍💼', '🧓', '🧑‍🎓'];

    this.handleCanvasClick = this.handleCanvasClick.bind(this);
    this.onWindowResize = () => this.resize();
    this.canvas.addEventListener('click', this.handleCanvasClick);
  }

  setCallbacks({ onHire, onUpgrade, onServe }) {
    this.onHireClick = onHire;
    this.onUpgradeClick = onUpgrade;
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
    this.steamWisps = [];
    this.spawnTimer = 0.5;
    this.resize();
    this.resizeTimer = setTimeout(() => this.resize(), 300);
    if (typeof window !== 'undefined') if (typeof window !== 'undefined') window.addEventListener('resize', this.onWindowResize);
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
    if (typeof window !== 'undefined') if (typeof window !== 'undefined') window.removeEventListener('resize', this.onWindowResize);
    this.customers = [];
    this.particles = [];
    this.moneyPuffs = [];
    this.steamWisps = [];
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
    if (cycleRevenue > 0) {
      this.engine.dinars += cycleRevenue;
      this.engine.totalDinarsEarned += cycleRevenue;
      this.engine.lifetimeDinarsEarned = (this.engine.lifetimeDinarsEarned || 0) + cycleRevenue;
      if (this.engine.currentCityId) {
        if (!this.engine.cityBalances) this.engine.cityBalances = {};
        this.engine.cityBalances[this.engine.currentCityId] = this.engine.dinars;
      }
    }
    const gainText = cycleRevenue > 0 ? ('+' + cycleRevenue.toFixed(1) + ' DT') : '+د.ت';

    // Money float puff
    this.moneyPuffs.push({
      x: customer.x - 10,
      y: customer.y - 45,
      vy: -35,
      text: '✨ ' + gainText + ' 🪙',
      life: 0.9,
      maxLife: 0.9,
      alpha: 1.0
    });

    // Golden sparkles / coin shower particles
    const count = isProducing ? 16 : 8;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
      const speed = 40 + Math.random() * 60;
      this.particles.push({
        x: 48,
        y: 135,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 22,
        color: Math.random() > 0.3 ? '#fbbf24' : '#f59e0b',
        radius: 1.8 + Math.random() * 2.2,
        life: 0.7 + Math.random() * 0.3,
        maxLife: 0.8,
        isSparkle: true
      });
    }
  }

  handleCanvasClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const ratio = rect.width > 0 ? this.width / rect.width : 1;
    const clickX = (event.clientX - rect.left) * ratio;
    const clickY = (event.clientY - rect.top) * ratio;

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
          // Affichage bulle informative sur l'employé au tap
          this.moneyPuffs.push({
            x: zone.x + zone.width / 2,
            y: zone.y - 12,
            vy: -25,
            text: `👤 ${zone.name} : ${zone.role}`,
            life: 1.4,
            maxLife: 1.4,
            alpha: 1
          });
        }
        return;
      }
    }

    // Tap dans la scène = servir et encaisser directement
    const biz = this.getBiz();
    if (biz && biz.level > 0) {
      const rev = this.engine.getRevenue(biz, Date.now());
      if (rev > 0) {
        this.engine.dinars += rev;
        this.engine.totalDinarsEarned += rev;
        this.engine.lifetimeDinarsEarned = (this.engine.lifetimeDinarsEarned || 0) + rev;
        if (this.engine.currentCityId) {
          if (!this.engine.cityBalances) this.engine.cityBalances = {};
          this.engine.cityBalances[this.engine.currentCityId] = this.engine.dinars;
        }
      }
      const puffText = rev > 0 ? `+${rev.toFixed(1)} د.ت 🪙` : '🪙';
      this.moneyPuffs.push({ x: clickX, y: clickY - 10, vy: -40, text: puffText, life: 0.8, maxLife: 0.8, alpha: 1 });
    } else {
      this.moneyPuffs.push({ x: clickX, y: clickY - 10, vy: -40, text: '🪙', life: 0.7, maxLife: 0.7, alpha: 1 });
    }
    if (this.onServeClick) this.onServeClick(this.bizId);
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
    } else if (bizId === 'patisserie') {
      wallGrad.addColorStop(0, '#38203f');
      wallGrad.addColorStop(0.6, '#24132a');
      wallGrad.addColorStop(1, '#150a1a');
    } else if (bizId === 'attariya') {
      wallGrad.addColorStop(0, '#102e23');
      wallGrad.addColorStop(0.6, '#0b2019');
      wallGrad.addColorStop(1, '#05130e');
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
  }

  // --- ACCESSOIRES DE FOND RICHES SELON LE MÉTIER ---
  drawStoreProps(ctx, bizId, now, w, h) {
    ctx.save();
    const timeSec = now / 1000;

    if (bizId === 'kahwa') {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(95, 46, w - 115, 6);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(95, 82, w - 115, 6);
      ctx.font = '16px serif';
      for (let x = 110; x < w - 30; x += 32) {
        ctx.fillText('🍵', x, 44);
        ctx.fillText('☕', x, 80);
      }
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(58, 50, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('🕐', 51, 54);

      // Table de Chkobba & Chicha traditionnelle
      const tableX = w - 86;
      const tableY = 34;
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(tableX, tableY, 74, 46);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(tableX, tableY, 74, 46);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 9px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('طرح شكبة 🃏', tableX + 37, tableY + 14);
      ctx.font = '11px sans-serif';
      ctx.fillText('♠️♥️ 🍵 شيشة 💨', tableX + 37, tableY + 30);
      ctx.fillStyle = '#fde047';
      ctx.font = '8px "Cairo", sans-serif';
      ctx.fillText('تاي منعنع بالبندق', tableX + 37, tableY + 41);
      ctx.textAlign = 'left';
    } else if (bizId === 'kaskrout' || bizId === 'fricasse') {
      // Étagères d'ingrédients authentiques (baguettes de pain chaud, thon, olives, fromage)
      ctx.fillStyle = '#854d0e';
      ctx.fillRect(105, 50, w - 125, 6);
      ctx.fillStyle = '#a16207';
      ctx.fillRect(105, 86, w - 125, 6);
      ctx.font = '16px serif';
      for (let x = 118; x < w - 25; x += 34) {
        ctx.fillText('🥖', x, 48);
        ctx.fillText('🥚', x, 84);
      }

      // Ardoise menu suspendue au mur du fond (calée haut pour zéro chevauchement avec le caissier)
      const menuTitle = bizId === 'fricasse' ? 'فريكاسي وبمبلوني' : 'كسكروت عياري';
      const menuL1 = bizId === 'fricasse' ? 'بمبلوني سخون 🍩' : 'تنّ وزيتون 🫒';
      const menuL2 = bizId === 'fricasse' ? 'عسل وسكّر ✨' : 'عظام مروبة ✨';

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(40, 18, 54, 40);
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(40, 18, 54, 40);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 8.5px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(menuTitle, 67, 30);
      ctx.font = '7.5px sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(menuL1, 67, 42);
      ctx.fillStyle = '#34d399';
      ctx.fillText(menuL2, 67, 53);
      ctx.textAlign = 'left';

      // Bocaux et ingrédients nobles (olives, câpres, huile d'olive)
      ctx.font = '14px serif';
      ctx.fillText('🫒', w - 40, 44);
      ctx.fillText('🥫', w - 40, 60);
      ctx.fillText('🥖', w - 40, 76);
    } else if (bizId === 'patisserie') {
      ctx.fillStyle = '#581c87';
      ctx.fillRect(105, 50, w - 125, 6);
      ctx.fillStyle = '#6b21a8';
      ctx.fillRect(105, 86, w - 125, 6);
      ctx.font = '16px serif';
      for (let x = 118; x < w - 25; x += 34) {
        ctx.fillText('🍯', x, 48);
        ctx.fillText('🥐', x, 84);
      }
      const glow = Math.sin(timeSec * 2) * 2;
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(68, 18);
      ctx.lineTo(68, 38);
      ctx.stroke();
      ctx.font = '20px serif';
      ctx.fillText('✨', 57, 50 + glow);
    } else if (bizId === 'attariya') {
      // Étagères d'épicerie tunisienne authentique garnies de produits variés du quotidien
      ctx.fillStyle = '#78350f';
      ctx.fillRect(96, 44, w - 116, 5);
      ctx.fillRect(96, 78, w - 116, 5);

      // Étagère du haut : harissa diari, conserves de thon, café, semoule/couscous, sucre
      const topItems = ['🥫', '🌶️', '☕', '🌾', '🧂', '🧀'];
      let topIdx = 0;
      for (let x = 104; x < w - 32; x += 28) {
        ctx.font = '15px serif';
        ctx.fillText(topItems[topIdx % topItems.length], x, 42);
        topIdx++;
      }

      // Étagère du bas : bouteilles d'huile d'olive, packs de lait carton, savon vert Akhdhar, eau minérale
      const botItems = ['🫒', '📦', '🧼', '🧀', '🫒', '📦'];
      let botIdx = 0;
      for (let x = 104; x < w - 32; x += 28) {
        ctx.font = '15px serif';
        ctx.fillText(botItems[botIdx % botItems.length], x, 76);
        botIdx++;
      }

      // Coin produits frais / pain baguette
      ctx.font = '15px serif';
      ctx.fillText('🥖', 76, 48);
      ctx.fillText('🥚', 76, 76);

      // Étagère latérale de produits d'épicerie authentiques
      const slateX = w - 82;
      const slateY = 24;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(slateX, slateY + 24, 70, 5);
      ctx.fillRect(slateX, slateY + 50, 70, 5);
      ctx.font = '15px serif';
      ctx.fillText('🫒', slateX + 6, slateY + 20);
      ctx.fillText('🥫', slateX + 28, slateY + 20);
      ctx.fillText('🧀', slateX + 50, slateY + 20);
      ctx.fillText('🧂', slateX + 6, slateY + 46);
      ctx.fillText('🍯', slateX + 28, slateY + 46);
      ctx.fillText('☕', slateX + 50, slateY + 46);

      // Bocaux et produits variés
      ctx.font = '15px serif';
      ctx.fillText('🫒', slateX - 22, 38);
      ctx.fillText('🧀', slateX - 22, 60);
      ctx.fillText('🥫', slateX - 22, 82);
    } else if (bizId === 'usine_conserves') {
      ctx.fillStyle = '#334155';
      ctx.fillRect(105, 48, w - 125, 6);
      ctx.fillRect(105, 84, w - 125, 6);
      ctx.font = '16px serif';
      for (let x = 118; x < w - 25; x += 32) {
        ctx.fillText('🥫', x, 46);
        ctx.fillText('🫒', x, 82);
      }
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(60, 50, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.font = '12px sans-serif';
      ctx.fillText('⚙️', 54, 54);
    } else if (bizId === 'tayaran_el_ghzela' || bizId === 'showroom_auto' || bizId === 'promoteur_immobilier') {
      const glassW = w - 120;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(100, 32, glassW, 60);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(100, 32, glassW, 60);

      ctx.font = '20px serif';
      const planeX = 110 + ((timeSec * 30) % (glassW - 30));
      ctx.fillText('🛫', planeX, 72);
      ctx.font = '14px serif';
      ctx.fillText('☁️', 120, 50);
      ctx.fillText('☁️', glassW + 50, 48);

      // Écran d'affichage des vols calé avec précision sans débordement
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(8, 38, 76, 38);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(8, 38, 76, 38);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('✈ TUNIS', 12, 49);
      ctx.fillText('✈ PARIS', 12, 60);
      ctx.fillText('✈ DUBAI', 12, 71);
    } else if (bizId === 'taxi_collectif') {
      // Panneau indicateur des lignes de louage et taxi collectif (محطة النقل)
      const boardW = Math.min(180, w - 120);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(100, 30, boardW, 64);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(100, 30, boardW, 64);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 8.5px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🚖 محطة التاكسي الجماعي واللواج', 100 + boardW / 2, 44);

      ctx.font = 'bold 7.5px monospace';
      ctx.fillStyle = '#34d399';
      ctx.fillText('▶ تونس - أريانة [مكتمل]', 100 + boardW / 2, 58);
      ctx.fillText('▶ حلق الوادي - المرسى [طيران]', 100 + boardW / 2, 70);
      ctx.fillStyle = '#fde047';
      ctx.fillText('▶ خط بنزرت السريع [يعبّي]', 100 + boardW / 2, 82);
      ctx.textAlign = 'left';

      // Horloge ronde de station
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(58, 50, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.font = '11px sans-serif';
      ctx.fillText('🕒', 52, 54);
    } else {
      ctx.fillStyle = '#334155';
      ctx.fillRect(100, 56, w - 120, 6);
      ctx.font = '16px serif';
      for (let x = 112; x < w - 25; x += 34) {
        ctx.fillText('📦', x, 52);
      }
    }
    ctx.restore();
  }

  // --- POSTE DE LA CAISSE (COMPTOIR VERNIS + CAISSIER + MACHINE) ---
  drawCashierCounter(ctx, detail, isBusy, now) {
    const timeSec = now / 1000;
    const counterX = 14;
    const counterY = 106;
    const deskW = 92;
    const deskH = 50;

    ctx.save();
    const bounce = isBusy ? Math.sin(timeSec * 8) * 2 : 0;
    const counterBiz = this.getBiz();



    // 1. Étagères murales d'arrière-boutique (DESSINÉES EN PREMIER au fond du mur)
    const currentBiz = this.getBiz();
    const currentBizId = currentBiz ? currentBiz.id : '';
    ctx.save();
    if (currentBizId === 'taxi_collectif') {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(counterX, 44, deskW, 34);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(counterX, 44, deskW, 34);
      ctx.font = '13px serif';
      const taxiRack = ['🔑', '🎫', '🚖', '🛣️'];
      taxiRack.forEach((item, i) => ctx.fillText(item, counterX + 8 + i * 22, 66));
    } else {
      for (let sIdx = 0; sIdx < 2; sIdx++) {
        const shelfY = 44 + sIdx * 22;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.fillRect(counterX - 4, shelfY + 4, deskW + 8, 3);
        const shelfGrad = ctx.createLinearGradient(counterX - 4, shelfY, counterX - 4, shelfY + 5);
        shelfGrad.addColorStop(0, '#92400e');
        shelfGrad.addColorStop(1, '#451a03');
        ctx.fillStyle = shelfGrad;
        ctx.fillRect(counterX - 4, shelfY, deskW + 8, 5);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1;
        ctx.strokeRect(counterX - 4, shelfY, deskW + 8, 5);
        ctx.font = '12px serif';
        const shelfGoods = ['🥫', '🫒', '🍯', '🧂', '📦'];
        shelfGoods.forEach((g, gIdx) => ctx.fillText(g, counterX + 6 + gIdx * 18, shelfY - 3));
      }
    }
    ctx.restore();

    // 2. Caissier debout au sol derrière le comptoir (Z-index intermédiaire, calé au sol)
    const cashierSlot = detail.staffSlots && detail.staffSlots[0];
    const cashierX = counterX + 22;
    const cashierFootY = 148; // Calé au sol réel pour éviter qu'il flotte

    if (cashierSlot && cashierSlot.hired) {
      this.drawWorker(ctx, cashierX + 16, cashierFootY, 0, isBusy, timeSec);

      this.clickZones.push({
        x: cashierX,
        y: cashierFootY - 50,
        width: 36,
        height: 50,
        type: 'employee_info',
        name: cashierSlot.name,
        role: cashierSlot.role
      });

      // Icône de métier centrée au-dessus de la tête, sans emoji endormi '💤'
      const iconToDraw = isBusy ? (cashierSlot.icon || '⚡') : (cashierSlot.icon || '👔');
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      const iconBounce = isBusy ? -Math.abs(Math.sin(timeSec * 6) * 4) : 0;
      ctx.fillText(iconToDraw, cashierX + 16, cashierFootY - 52 + iconBounce);
    } else {
      this.drawHireButton(ctx, counterX + 6, counterY - 44, 66, 52, 'خدّم', 0, 'hire_cashier', cashierSlot ? cashierSlot.cost : null, now);
    }

    // 2. Meuble Comptoir au PREMIER PLAN (cache le bas du corps de l'employé)
    const woodGrad = ctx.createLinearGradient(counterX, counterY + 12, counterX, counterY + 12 + deskH);
    woodGrad.addColorStop(0, '#d97706');
    woodGrad.addColorStop(0.3, '#b45309');
    woodGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = woodGrad;
    ctx.beginPath();
    ctx.roundRect(counterX, counterY + 12, deskW, deskH, [8, 8, 4, 4]);
    ctx.fill();

    // Dessus en marbre poli Kadhel crème
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(counterX - 2, counterY + 10, deskW + 4, 5);

    // Bordure dorée du comptoir
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(counterX, counterY + 12, deskW, deskH);

    // Caisse enregistreuse moderne tunisienne (Pos tactile dorée et écran dynamique)
    const regX = counterX + deskW - 40;
    const regY = counterY - 6;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(regX, regY, 34, 22, 4);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Écran LED lumineux avec reflet et clignotement
    ctx.fillStyle = '#022c22';
    ctx.fillRect(regX + 3, regY + 3, 28, 8);
    ctx.fillStyle = '#34d399';
    ctx.font = '900 6.5px monospace';
    ctx.textAlign = 'right';
    const dynCash = counterBiz ? (this.engine.getRevenue(counterBiz, now) || 0).toFixed(1) : '0.0';
    ctx.fillText(dynCash + ' DT', regX + 29, regY + 9);

    // Clavier tactile rétroéclairé
    ctx.fillStyle = '#fbbf24';
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 4; col++) {
        ctx.fillRect(regX + 4 + col * 6.5, regY + 13 + row * 3.8, 5, 2.8);
      }
    }

    // Tiroir-caisse avec fente et serrure dorée ouvragée
    ctx.fillStyle = '#b45309';
    ctx.fillRect(counterX + 16, counterY + 28, deskW - 32, 14);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(counterX + 16, counterY + 28, deskW - 32, 14);
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(counterX + deskW / 2, counterY + 35, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // --- POSTES DE TRAVAIL DES EMPLOYÉS (MACHINES & OUVRIERS) ---
  drawWorkstations(ctx, detail, isBusy, now) {
    if (!detail.staffSlots) return;
    const timeSec = now / 1000;
    const startX = 104;
    const baseY = 148;
    const spacing = 62;

    detail.staffSlots.slice(1).forEach((slot, idx) => {
      const stationX = startX + idx * spacing;
      if (stationX > this.width - 40) return;

      ctx.save();

      // 1. Machine ou poste thématique au sol
      this.drawMachineProp(ctx, this.bizId, stationX, baseY, isBusy, timeSec, slot);

      if (slot.hired) {
        this.drawWorker(ctx, stationX + 22, baseY, idx + 1, isBusy, timeSec);

        // Hitbox ouvrier pour affichage rôle au clic
        this.clickZones.push({
          x: stationX + 4,
          y: baseY - 50,
          width: 36,
          height: 54,
          type: 'employee_info',
          name: slot.name,
          role: slot.role
        });

        const effIcon = isBusy ? (slot.icon || '⚡') : (slot.icon || '👔');
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'center';
        const effBounce = isBusy ? -Math.abs(Math.sin(timeSec * 5 + idx) * 5) : 0;
        ctx.fillText(effIcon, stationX + 22, baseY - 54 + effBounce);
      } else {
        this.drawHireButton(ctx, stationX + 2, baseY - 56, 48, 54, 'خدّم', idx + 1, 'hire_worker', slot.cost, now);
      }

      ctx.restore();
    });
  }

  // --- DESSIN DES MACHINES ET ANIMATIONS ÉLÉVÉES SELON LE MÉTIER ---
  drawMachineProp(ctx, bizId, x, y, isBusy, timeSec, slot) {
    ctx.save();

    // 1. TRADITIONAL FOOD / LABLABI / KASKROUT : marmite fumante, découpe de baguette, louche en mouvement
    if (bizId === 'kaskrout' || bizId === 'fricasse' || bizId === 'restaurant') {
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

    // 2. CAFÉ ARBI : Zazoua en cuivre sur كانون فخار مع جمر مشتعل ورغوة التاي
    else if (bizId === 'kahwa' || bizId === 'salon_de_the') {
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

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(x + 18, y - 19, 2.5, 0, Math.PI * 2);
      ctx.arc(x + 26, y - 19, 2, 0, Math.PI * 2);
      ctx.fill();

      const zazX = x + 18;
      const zazY = y - 28;
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.moveTo(zazX, zazY + 10);
      ctx.lineTo(zazX + 10, zazY + 10);
      ctx.lineTo(zazX + 8, zazY);
      ctx.lineTo(zazX + 2, zazY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.stroke();

      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(zazX + 2, zazY + 3);
      ctx.lineTo(zazX - 7, zazY - 4);
      ctx.stroke();

      ctx.fillStyle = 'rgba(254, 240, 138, 0.7)';
      ctx.fillRect(x + 32, y - 12, 6, 10);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 32, y - 14, 6, 2.5);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(x + 34, y - 15, 2, 2);
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
  drawWorker(ctx, x, footY, seed, isBusy, timeSec) {
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

    // 9. Yeux expressifs avec pupilles et sourcils
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1.5, -41, 1.6, 1.8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2.2, -41, 0.7, 0.7); // Reflet oculaire

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
  // Étiquette de rôle complète
  drawRoleTag(ctx, cx, y, role) {
    if (!role) return;
    ctx.save();
    ctx.font = 'bold 8px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    const textW = ctx.measureText(role).width;
    const pad = 6;
    const rw = textW + pad * 2;
    const rh = 13;
    const rx = cx - rw / 2;
    const ry = y - rh / 2;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(rx, ry, rw, rh, 4);
    ctx.fill();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.fillText(role, cx, ry + 9.5);
    ctx.restore();
  }

  // Dessin d'un bouton de recrutement très lisible
  drawHireButton(ctx, x, y, width, height, label, slotIndex, type, cost = null, now = 0) {
    ctx.save();
    const canAfford = cost === null || (this.engine.dinars >= cost);
    const pulse = Math.sin(now * 0.006) * 0.15 + 0.85;

    if (canAfford) {
      ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
      ctx.shadowBlur = 8 * pulse;
    }

    const grad = ctx.createLinearGradient(x, y, x, y + height);
    if (canAfford) {
      grad.addColorStop(0, '#f59e0b');
      grad.addColorStop(1, '#b45309');
    } else {
      grad.addColorStop(0, '#475569');
      grad.addColorStop(1, '#1e293b');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 8);
    ctx.fill();

    ctx.strokeStyle = canAfford ? '#fef08a' : '#64748b';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 11px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('➕ ' + label, x + width / 2, y + 18);

    if (cost !== null) {
      ctx.fillStyle = canAfford ? '#fef08a' : '#94a3b8';
      ctx.font = 'bold 9px "Cairo", sans-serif';
      ctx.fillText(this.formatNumber(cost) + ' DT', x + width / 2, y + 33);
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

  // --- CLIENTS VIVANTS AVEC BULLES DE COMMANDE ET DÉPLACEMENT ---
  drawCustomers(ctx, now) {
    for (const c of this.customers) {
      ctx.save();
      // Ombre portée au sol
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(c.x + 12, c.y + 4, 11, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      const isWalking = c.state === 'walking_in' || c.state === 'walking_out';
      const bounce = isWalking ? Math.abs(Math.sin(c.walkCycle * 6)) * 3 : 0;
      const tilt = isWalking ? Math.sin(c.walkCycle * 6) * 0.06 : 0;

      ctx.save();
      ctx.translate(c.x + 12, c.y - 6 - bounce);
      ctx.rotate(tilt);

      // Personnage vectoriel élégant (Corps, Vêtements tunisiens, Chéchia ou Coiffure)
      const seed = Math.floor(Math.abs(c.id * 1000));
      const styles = [
        { robe: '#1e3a8a', coat: '#2563eb', skin: '#fcd34d', hat: 'chechia' },
        { robe: '#065f46', coat: '#059669', skin: '#f59e0b', hat: 'tarbouch' },
        { robe: '#7c2d12', coat: '#d97706', skin: '#fde68a', hat: 'hijab' },
        { robe: '#0f172a', coat: '#334155', skin: '#fcd34d', hat: 'hair' }
      ];
      const st = styles[seed % styles.length];

      // Jambes animées
      const stride = isWalking ? Math.sin(c.walkCycle * 6) * 4 : 0;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-3, 0);
      ctx.lineTo(-3 - stride * 0.6, 9);
      ctx.moveTo(3, 0);
      ctx.lineTo(3 + stride * 0.6, 9);
      ctx.stroke();

      // Djellaba / Veste élégante
      ctx.fillStyle = st.coat;
      ctx.beginPath();
      ctx.roundRect(-7, -18, 14, 18, [4, 4, 2, 2]);
      ctx.fill();
      ctx.fillStyle = st.robe;
      ctx.fillRect(-2, -18, 4, 18);

      // Bras tenant l'article acheté ou un couffin
      ctx.strokeStyle = st.coat;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-5, -14);
      ctx.lineTo(-8, -4);
      ctx.moveTo(5, -14);
      ctx.lineTo(8, -4);
      ctx.stroke();

      // Simulation d'article pris en main lors du départ (سرفيس وأخذ السلعة)
      if (c.state === 'walking_out' && c.orderIcon) {
        ctx.save();
        ctx.font = '11px serif';
        ctx.textAlign = 'center';
        ctx.fillText(c.orderIcon, 9, -2);
        ctx.restore();
      }

      // Tête & Visage
      ctx.fillStyle = st.skin;
      ctx.beginPath();
      ctx.arc(0, -24, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Chéchia rouge tunisienne ou couvre-chef soigné
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

      // Yeux expressifs
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-2.5, -25, 1.5, 1.5);
      ctx.fillRect(1.5, -25, 1.5, 1.5);
      // Sourire
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, -22, 2.5, 0.2, Math.PI - 0.2);
      ctx.stroke();

      ctx.restore();

      // Bulle de commande / réaction compacte et élégante PLACÉE AU-DESSUS DE LA TÊTE (ZÉRO MASQUAGE DU VISAGE)
      const bubbleX = c.x + 12;
      const bubbleY = c.y - 52 - bounce; // Dégage complètement la tête et la chéchia
      const bubbleIcon = c.reaction ? c.reaction : c.orderIcon;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
      ctx.beginPath();
      ctx.roundRect(bubbleX - 10, bubbleY - 9, 20, 17, 5);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Petite pointe de bulle pointant vers le sommet de la tête
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(bubbleX - 2.5, bubbleY + 8);
      ctx.lineTo(bubbleX + 2.5, bubbleY + 8);
      ctx.lineTo(bubbleX, bubbleY + 12);
      ctx.closePath();
      ctx.fill();

      ctx.font = '10.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(bubbleIcon, bubbleX, bubbleY);

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

    for (const m of this.moneyPuffs) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, m.life / m.maxLife);
      ctx.font = 'bold 13px "Cairo", sans-serif';
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.textAlign = 'center';
      ctx.fillText(m.text, m.x, m.y);
      ctx.restore();
    }
  }

  // --- AMBIANCE CRÉATIVE : lanternes tunisiennes, rayons de lumière, poussière dorée ---
  drawAmbience(ctx, now, isProducing) {
    const w = this.width;
    const h = this.height;
    const t = now / 1000;

    const signBiz = this.getBiz();
    if (signBiz) {
      const signW = Math.min(260, Math.max(190, w * 0.55));
      const sx = (w - signW) / 2;
      const flicker = 0.88 + 0.12 * Math.sin(t * 7) * Math.sin(t * 3.1);
      ctx.save();
      ctx.shadowColor = 'rgba(251, 191, 36, ' + (0.8 * flicker) + ')';
      ctx.shadowBlur = 14;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = 'rgba(251, 191, 36, ' + flicker + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(sx, 22, signW, 28, 14);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fef08a';

      const signFullName = (signBiz.icon ? (signBiz.icon + ' ') : '') + signBiz.name;
      let sFont = 12;
      ctx.font = '900 ' + sFont + 'px "Cairo", sans-serif';
      let sWidth = ctx.measureText(signFullName).width;
      if (sWidth > signW - 20) {
        sFont = Math.max(8.5, Math.floor((signW - 22) / sWidth * sFont));
        ctx.font = '900 ' + sFont + 'px "Cairo", sans-serif';
      }
      ctx.textAlign = 'center';
      ctx.fillText(signFullName, w / 2, 40);
      ctx.restore();
    }

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
      const glow = ctx.createRadialGradient(0, len + 6, 1, 0, len + 6, isProducing ? 28 : 20);
      glow.addColorStop(0, 'rgba(253, 186, 116, 0.6)');
      glow.addColorStop(1, 'rgba(253, 186, 116, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(-30, len - 24, 60, 60);
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

  // --- BOUCLE D'ANIMATION 60 FPS ---
  step(now) {
    if (!this.lastTime) this.lastTime = now;
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    const biz = this.getBiz();
    const detail = this.engine.getBusinessDetail ? this.engine.getBusinessDetail(this.bizId) : null;
    const isProducing = biz && (biz.isProducing || biz.hasManager || biz.progressMs > 0);

    // 1. Spawner de حرفاء (rythme posé, naturel et gratifiant)
    this.spawnTimer += dt;
    const spawnThreshold = isProducing ? 2.6 : 4.8;
    if (this.spawnTimer > spawnThreshold && this.customers.length < 4) {
      this.spawnCustomer();
      this.spawnTimer = 0;
    }

    // 2. Mise à jour de la physique des حرفاء
    for (let i = this.customers.length - 1; i >= 0; i--) {
      const c = this.customers[i];
      c.walkCycle += dt;

      if (c.state === 'walking_in') {
        const speed = isProducing ? 58 : 42;
        c.x -= speed * dt;
        if (c.x <= c.targetX) {
          c.x = c.targetX;
          c.state = 'paying';
          this.triggerPayment(c, isProducing);
        }
      } else if (c.state === 'paying') {
        const hasStaff = biz && (biz.hasManager || (biz.hiredManagersCount && biz.hiredManagersCount > 0));
        c.payTimer += dt;

        if (hasStaff || biz.isProducing) {
          // Personnel présent ou clic manuel : servi avec succès !
          if (c.payTimer >= c.payDuration) {
            c.state = 'walking_out';
            c.reaction = this.happyReactions[Math.floor(Math.random() * this.happyReactions.length)];
          }
        } else {
          // Pas de personnel recruté : le client attend 2.2s puis sort fâché
          if (c.payTimer > 2.2) {
            c.state = 'walking_out';
            c.reaction = '😡';
            c.isAngry = true;
            // Particule fumée de colère
            this.particles.push({
              x: c.x,
              y: c.y - 30,
              vx: 0,
              vy: -15,
              color: '#ef4444',
              radius: 4,
              life: 0.6,
              maxLife: 0.6,
              alpha: 1.0
            });
          }
        }
      } else if (c.state === 'walking_out') {
        c.x -= 52 * dt;
        if (c.x < -40) {
          this.customers.splice(i, 1);
          continue;
        }
      }
    }

    // 3. Particules d'ambiance et vapeur active
    if (isProducing && Math.random() < 0.4) {
      const sourceX = 110 + Math.random() * (this.width - 150);
      this.particles.push({
        x: sourceX,
        y: 120,
        vx: Math.random() * 8 - 4,
        vy: -22 - Math.random() * 25,
        color: 'rgba(255, 255, 255, 0.38)',
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
    this.drawAmbience(this.ctx, now, !!isProducing);

    if (detail) {
      this.drawCashierCounter(this.ctx, detail, isProducing, now);
      this.drawWorkstations(this.ctx, detail, isProducing, now);
    }

    this.drawCustomers(this.ctx, now);
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

    this.bizTemplates = {
      kaskrout: { id: 'kaskrout', width: 155, height: 120, style: 'sandwich_stall', color: '#f59e0b', roofColor: '#dc2626' },
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
        signText: 'مارشي فواكه البحر والسمك 🦐'
      },
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

  setCallbacks({ onInspect, onUpgrade, onCollect, onHudAction, onSwitchZone, onOpenMap }) {
    if (onOpenMap) this.onOpenMap = onOpenMap;
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
        { type: 'garden', name: 'حديقة الياسمين والزيتون', width: 95 },
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

    // Mappings alias villes tunisiennes <-> zones
    zoneSpecs.tunis = zoneSpecs.bab_souika;
    zoneSpecs.bizerte = [
      { type: 'house', style: 'goulette', name: 'فيلا سيدي سالم الكورنيش', width: 125, height: 130, wallColor: '#f8fafc', doorColor: '#0284c7' },
      { type: 'biz', id: 'fricasse' },
      { type: 'crossroad', streetName: 'قنال بنزert والميناء العتيق', width: 125, nextZoneId: 'lac_2', nextZoneLabel: 'الحمامات' },
      { type: 'biz', id: 'patisserie' },
      { type: 'house', style: 'goulette', name: 'دار الكورنيش العتيق', width: 125, height: 126, wallColor: '#f0f9ff', doorColor: '#2563eb' },
      { type: 'biz', id: 'taxi_collectif' },
      { type: 'crossroad', streetName: 'جسر بنزرت المتحرك', width: 130, nextZoneId: 'lac_2', nextZoneLabel: 'الحمامات' },
      { type: 'biz', id: 'superette' },
      { type: 'house', style: 'goulette', name: 'دار حوت المنارة', width: 120, height: 122, wallColor: '#ffffff', doorColor: '#0369a1' }
    ];
    zoneSpecs.la_goulette = zoneSpecs.bizerte;
    zoneSpecs.nabeul_hammamet = zoneSpecs.hammamet;
    zoneSpecs.beja = [
      { type: 'house', style: 'medina', name: 'قصر القمح الباجي', width: 125, height: 125, wallColor: '#fef3c7', doorColor: '#059669' },
      { type: 'biz', id: 'fricasse' },
      { type: 'crossroad', streetName: 'طريق الشمال الغربي', width: 125, nextZoneId: 'le_kef', nextZoneLabel: 'الكاف' },
      { type: 'biz', id: 'attariya' },
      { type: 'house', style: 'medina', name: 'دار الجبن والخيرات', width: 120, height: 120, wallColor: '#fffbeb', doorColor: '#eab308' },
      { type: 'biz', id: 'patisserie' },
      { type: 'crossroad', streetName: 'ساحة الشهداء بباجة', width: 130, nextZoneId: 'tunis', nextZoneLabel: 'تونس' }
    ];
    zoneSpecs.le_kef = [
      { type: 'house', style: 'medina', name: 'دار سيدي بومخلوف', width: 130, height: 135, wallColor: '#f8fafc', doorColor: '#0284c7' },
      { type: 'biz', id: 'kahwa' },
      { type: 'crossroad', streetName: 'طريق القصبة العالية', width: 125, nextZoneId: 'kairouan', nextZoneLabel: 'القيروان' },
      { type: 'biz', id: 'attariya' },
      { type: 'house', style: 'medina', name: 'دار الجبل والكرم', width: 125, height: 125, wallColor: '#fef3c7', doorColor: '#78350f' },
      { type: 'biz', id: 'taxi_collectif' },
      { type: 'crossroad', streetName: 'نهج برنوس الكاف', width: 130, nextZoneId: 'beja', nextZoneLabel: 'باجة' }
    ];
    zoneSpecs.sousse = [
      { type: 'house', style: 'goulette', name: 'فيلا مرسى القنطاوي', width: 135, height: 140, wallColor: '#f0f9ff', doorColor: '#0284c7' },
      { type: 'biz', id: 'salon_de_the' },
      { type: 'crossroad', streetName: 'كورنيش بوجعفر', width: 130, nextZoneId: 'monastir_mahdia', nextZoneLabel: 'المنستير' },
      { type: 'biz', id: 'hotel' },
      { type: 'house', style: 'goulette', name: 'إقامة جوهرة الساحل', width: 130, height: 142, wallColor: '#ffffff', doorColor: '#38bdf8' },
      { type: 'biz', id: 'restaurant' },
      { type: 'crossroad', streetName: 'مفترق سهلول', width: 130, nextZoneId: 'tunis', nextZoneLabel: 'تونس' }
    ];
    zoneSpecs.monastir_mahdia = [
      { type: 'house', style: 'goulette', name: 'برج الرباط البحري', width: 135, height: 145, wallColor: '#f8fafc', doorColor: '#0369a1' },
      { type: 'biz', id: 'patisserie' },
      { type: 'crossroad', streetName: 'مارينا المنستير', width: 130, nextZoneId: 'sfax', nextZoneLabel: 'صفاقس' },
      { type: 'biz', id: 'fruits_de_mer' },
      { type: 'biz', id: 'hotel' },
      { type: 'house', style: 'goulette', name: 'دار سقيفة الفاطميين', width: 130, height: 135, wallColor: '#fef3c7', doorColor: '#b45309' },
      { type: 'biz', id: 'centre_commercial' },
      { type: 'crossroad', streetName: 'طريق المهدية الكحلة', width: 130, nextZoneId: 'sousse', nextZoneLabel: 'سوسة' }
    ];
    zoneSpecs.kairouan = [
      { type: 'house', style: 'medina', name: 'دار الأغالبة المعتّقة', width: 135, height: 140, wallColor: '#fef3c7', doorColor: '#059669' },
      { type: 'biz', id: 'patisserie' },
      { type: 'crossroad', streetName: 'ساحة فسقية الأغالبة', width: 130, nextZoneId: 'sfax', nextZoneLabel: 'صفاقس' },
      { type: 'biz', id: 'attariya' },
      { type: 'house', style: 'medina', name: 'قصر الزربية القيروانية', width: 130, height: 135, wallColor: '#fffbeb', doorColor: '#d97706' },
      { type: 'biz', id: 'kahwa' },
      { type: 'crossroad', streetName: 'نهج جامع عقبة', width: 130, nextZoneId: 'tunis', nextZoneLabel: 'تونس' }
    ];
    zoneSpecs.sfax = [
      { type: 'house', style: 'medina', name: 'عمارة برج النار', width: 135, height: 155, wallColor: '#f8fafc', doorColor: '#0284c7' },
      { type: 'biz', id: 'supermarche' },
      { type: 'crossroad', streetName: 'ساحة باب الديوان', width: 130, nextZoneId: 'gabes', nextZoneLabel: 'قابس' },
      { type: 'biz', id: 'fruits_de_mer' },
      { type: 'biz', id: 'usine_conserves' },
      { type: 'house', style: 'medina', name: 'دار الزيتونة المباركة', width: 135, height: 140, wallColor: '#fef3c7', doorColor: '#16a34a' },
      { type: 'biz', id: 'showroom_auto' },
      { type: 'crossroad', streetName: 'طريق تنيور والمهدية', width: 130, nextZoneId: 'kairouan', nextZoneLabel: 'القيروان' }
    ];
    zoneSpecs.gafsa = [
      { type: 'house', style: 'medina', name: 'دار البركة الرومانية', width: 130, height: 135, wallColor: '#fef3c7', doorColor: '#d97706' },
      { type: 'biz', id: 'taxi_collectif' },
      { type: 'crossroad', streetName: 'شارع الحوض المنجمي', width: 130, nextZoneId: 'tozeur', nextZoneLabel: 'توزر' },
      { type: 'biz', id: 'superette' },
      { type: 'house', style: 'medina', name: 'واحة قفصة الجبلية', width: 125, height: 128, wallColor: '#fffbeb', doorColor: '#059669' },
      { type: 'biz', id: 'attariya' },
      { type: 'crossroad', streetName: 'مفترق المتلوي', width: 130, nextZoneId: 'kairouan', nextZoneLabel: 'القيروان' }
    ];
    zoneSpecs.tozeur = [
      { type: 'house', style: 'djerba', name: 'قصر دقلة النور والواحات', width: 135, height: 140, wallColor: '#fef3c7', doorColor: '#b45309' },
      { type: 'biz', id: 'agence_voyages' },
      { type: 'crossroad', streetName: 'طريق الشبيكة وتمغزة', width: 130, nextZoneId: 'gafsa', nextZoneLabel: 'قفصة' },
      { type: 'biz', id: 'hotel' },
      { type: 'house', style: 'djerba', name: 'رياض شط الجريد', width: 135, height: 142, wallColor: '#fffbeb', doorColor: '#d97706' },
      { type: 'biz', id: 'salon_de_the' },
      { type: 'crossroad', streetName: 'جادة النخيل الذهبي', width: 130, nextZoneId: 'gabes', nextZoneLabel: 'قابس' }
    ];
    zoneSpecs.gabes = [
      { type: 'house', style: 'goulette', name: 'فيلا الواحة البحرية', width: 130, height: 138, wallColor: '#f0f9ff', doorColor: '#0284c7' },
      { type: 'biz', id: 'attariya' },
      { type: 'crossroad', streetName: 'سوق جارة للحناء', width: 130, nextZoneId: 'medenine_zarzis', nextZoneLabel: 'مدنين' },
      { type: 'biz', id: 'usine_conserves' },
      { type: 'house', style: 'goulette', name: 'دار خليج قابس', width: 130, height: 135, wallColor: '#f8fafc', doorColor: '#059669' },
      { type: 'biz', id: 'supermarche' },
      { type: 'crossroad', streetName: 'مفترق ميناء قابس التجاري', width: 130, nextZoneId: 'sfax', nextZoneLabel: 'صفاقس' }
    ];
    zoneSpecs.medenine_zarzis = [
      { type: 'house', style: 'djerba', name: 'قصر الغرفة التاريخي', width: 135, height: 145, wallColor: '#fef3c7', doorColor: '#b45309' },
      { type: 'biz', id: 'restaurant' },
      { type: 'crossroad', streetName: 'طريق القصور وجرجيس', width: 130, nextZoneId: 'djerba_holding', nextZoneLabel: 'جربة' },
      { type: 'biz', id: 'agence_voyages' },
      { type: 'house', style: 'djerba', name: 'إقامة مرسى جرجيس', width: 135, height: 140, wallColor: '#ffffff', doorColor: '#0284c7' },
      { type: 'biz', id: 'showroom_auto' },
      { type: 'crossroad', streetName: 'مفترق بن قردان الدولي', width: 130, nextZoneId: 'gabes', nextZoneLabel: 'قابس' }
    ];

    const rawItems = zoneSpecs[zoneId] || zoneSpecs.bab_souika;

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
      } else if (item.type === 'garden' || item.type === 'service_station' || item.type === 'bank_branch') {
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
      this.pedestrians.push({
        x: 50 + Math.random() * Math.max(300, this.worldWidth - 100),
        yOffset: (Math.random() - 0.5) * 14,
        speed: (18 + Math.random() * 18) * (Math.random() > 0.5 ? 1 : -1),
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
      monastir_mahdia: 'رباط المنستير وسقيفة المهدية الكحلة والحوت الشامي',
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

        const tunisianQuips = [
          'بنينة تشره ! 🤤',
          'عزّ الطلة والسرفيس 👌',
          'تبارك الله على الصنعة 🔥',
          'صحة وبشفا يا معلّم ! ☕',
          'ملا جو وملا حومة 🇹🇳',
          'الكاسة تصبّ في الخير 💰',
          'سلعة طازة وريحة تفحفح 🌿',
          'سيرفيس مريڤل والخدمة نظيفة 👏'
        ];
        p.bubbleText = (p.carriedItem ? (p.carriedItem + ' ') : '') + tunisianQuips[Math.floor(Math.random() * tunisianQuips.length)];
        p.bubbleTimer = 2.4;
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

    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    const z = this.currentZoneId;
    if (z === 'la_goulette' || z === 'bizerte' || z === 'monastir_mahdia') {
      skyGrad.addColorStop(0, '#0c4a6e');
      skyGrad.addColorStop(0.5, '#0284c7');
      skyGrad.addColorStop(1, '#38bdf8');
    } else if (z === 'lac_2' || z === 'sousse' || z === 'sfax') {
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(0.5, '#1e1b4b');
      skyGrad.addColorStop(1, '#4338ca');
    } else if (z === 'hammamet' || z === 'nabeul_hammamet' || z === 'tozeur' || z === 'djerba_holding') {
      skyGrad.addColorStop(0, '#1e1b4b');
      skyGrad.addColorStop(0.5, '#701a75');
      skyGrad.addColorStop(1, '#f59e0b');
    } else if (z === 'gafsa' || z === 'gabes' || z === 'medenine_zarzis' || z === 'le_kef') {
      skyGrad.addColorStop(0, '#1c1917');
      skyGrad.addColorStop(0.5, '#78350f');
      skyGrad.addColorStop(1, '#d97706');
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
        } else if (item.type === 'garden') {
          this.drawGarden(ctx, item, screenX, groundY, timestamp);
        } else if (item.type === 'service_station') {
          this.drawServiceStation(ctx, item, screenX, groundY, timestamp);
        } else if (item.type === 'bank_branch') {
          this.drawBankBranch(ctx, item, screenX, groundY, timestamp);
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
      ctx.fillText(biz ? biz.name : 'مشروع للبيع', x + b.width / 2, y + 68);

      const unlockCost = biz ? this.engine.getCost(biz) : 0;
      const canAfford = this.engine.dinars >= unlockCost;

      ctx.fillStyle = canAfford ? '#34d399' : '#f59e0b';
      ctx.font = '800 9.5px "Cairo", sans-serif';
      ctx.fillText(unlockCost > 0 ? ('ثمن الأصل: ' + unlockCost.toLocaleString() + ' د.ت') : 'جاهز للفتح', x + b.width / 2, y + 84);

      const btnW = Math.min(b.width - 20, 118);
      const btnH = 26;
      const btnX = x + (b.width - btnW) / 2;
      const btnY = y + bHeight - 28;

      ctx.fillStyle = canAfford ? '#10b981' : 'rgba(51, 65, 85, 0.9)';
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 8);
      ctx.fill();
      ctx.strokeStyle = canAfford ? '#34d399' : '#64748b';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 11px "Cairo", sans-serif';
      ctx.fillText(canAfford ? '🔑 اشري المحلّ' : '🔍 تفاصيل الأصل', btnX + btnW / 2, btnY + 17);

      // Clic tactile optimisé : le bouton déclenche l'achat/détail, le reste du bâtiment permet la collecte/tapped wage
      this.interactiveHitboxes.push({
        x: btnX - 6,
        y: btnY - 6,
        w: btnW + 12,
        h: btnH + 12,
        action: 'upgrade',
        bizId: b.id
      });
      this.interactiveHitboxes.push({
        x: x,
        y: y + 20,
        w: b.width,
        h: bHeight - 20,
        action: 'collect',
        bizId: b.id
      });

      ctx.restore();
      return;
    }

    // Cas 2A : نصبة كسكروت عياري (Brouette / Charrette ambulante traditionnelle avec parasol et roues)
    if (b.id === 'kaskrout') {
      const cartW = b.width;
      const cartH = bHeight;
      const cartX = x;
      const cartY = y + 10;

      // 1. Roues en bois cerclées de fer (2 grandes roues de brouette)
      const wheelR = 15;
      const wheelY = groundY - 14;
      const wheelX1 = cartX + 26;
      const wheelX2 = cartX + cartW - 26;

      ctx.save();
      for (const wx of [wheelX1, wheelX2]) {
        // Ombre de roue
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.ellipse(wx, groundY - 2, wheelR * 0.9, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Jante en bois d'olivier
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 3.5;
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(wx, wheelY, wheelR, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Rayons de la roue
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        for (let sp = 0; sp < 6; sp++) {
          const spAngle = (sp * Math.PI / 3) + (timestamp * 0.001);
          ctx.beginPath();
          ctx.moveTo(wx, wheelY);
          ctx.lineTo(wx + Math.cos(spAngle) * wheelR, wheelY + Math.sin(spAngle) * wheelR);
          ctx.stroke();
        }
        // Moyeu central
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(wx, wheelY, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Châssis & caisse de la brouette en bois authentique (عربة متنقلة)
      const boxW = cartW - 14;
      const boxH = 46;
      const boxX = cartX + 7;
      const boxY = wheelY - boxH + 6;

      const woodGrad = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxH);
      woodGrad.addColorStop(0, '#f59e0b');
      woodGrad.addColorStop(0.5, '#d97706');
      woodGrad.addColorStop(1, '#92400e');
      ctx.fillStyle = woodGrad;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, [6, 6, 2, 2]);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Poignées de la brouette en bois (Bras de traction)
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(boxX, boxY + 18);
      ctx.lineTo(boxX - 16, boxY + 12);
      ctx.stroke();

      // Panneau de la نصبة
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(boxX + 16, boxY + 12, boxW - 32, 22);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(boxX + 16, boxY + 12, boxW - 32, 22);
      ctx.fillStyle = '#fef08a';
      ctx.font = '900 10.5px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🥖 كسكروت عياري 🥚', boxX + boxW / 2, boxY + 26);

      // 3. Vitrine en verre transparent exposant les œufs durs, le thon et les baguettes
      const glassW = boxW - 10;
      const glassH = 28;
      const glassX = boxX + 5;
      const glassY = boxY - glassH;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(glassX, glassY, glassW, glassH);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(glassX, glassY, glassW, glassH);

      // Ingrédients visibles sous la vitrine
      ctx.font = '13px serif';
      ctx.textAlign = 'center';
      ctx.fillText('🥚 🥚 🥚', glassX + glassW * 0.25, glassY + 18);
      ctx.fillText('🥖 🥖', glassX + glassW * 0.55, glassY + 18);
      ctx.fillText('🥫 🌶️', glassX + glassW * 0.85, glassY + 18);

      // 4. Grand Parasol bicolore rouge et blanc au-dessus de la brouette (مظلة النصبة)
      const poleX = cartX + cartW / 2;
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(poleX, glassY);
      ctx.lineTo(poleX, y - 8);
      ctx.stroke();

      const umbrellaY = y - 8;
      const umbrellaW = cartW * 0.88;
      const uLeft = poleX - umbrellaW / 2;
      const uRight = poleX + umbrellaW / 2;

      // Toile du parasol courbée
      ctx.beginPath();
      ctx.moveTo(uLeft, umbrellaY + 12);
      ctx.quadraticCurveTo(poleX, umbrellaY - 14, uRight, umbrellaY + 12);
      ctx.closePath();
      ctx.fillStyle = '#dc2626'; // Rouge vif
      ctx.fill();

      // Rayures blanches du parasol
      ctx.fillStyle = '#f8fafc';
      for (let s = 1; s < 5; s += 2) {
        const sx1 = uLeft + (umbrellaW / 6) * s;
        const sx2 = sx1 + (umbrellaW / 6);
        ctx.beginPath();
        ctx.moveTo(sx1, umbrellaY + 10);
        ctx.lineTo(poleX, umbrellaY - 12);
        ctx.lineTo(sx2, umbrellaY + 10);
        ctx.closePath();
        ctx.fill();
      }

      // Indicateur discret et élégant de visite au-dessus du comptoir
      const enterW = 46;
      const enterH = 16;
      const enterX = cartX + (cartW - enterW) / 2;
      const enterY = boxY - 20;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.beginPath();
      ctx.roundRect(enterX, enterY, enterW, enterH, 4);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = '800 8.5px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('زيارة 🏪', cartX + cartW / 2, enterY + 11.5);

      this.interactiveHitboxes.push({
        x: cartX,
        y: y,
        w: cartW,
        h: bHeight,
        action: 'collect',
        bizId: b.id
      });
      // Seul le bouton ciblé "زيارة" déclenche l'entrée dans le projet
      this.interactiveHitboxes.push({
        x: enterX,
        y: enterY,
        w: enterW,
        h: enterH,
        action: 'inspect',
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
    ctx.fillText(fullName, signX + signW / 2, signY + 16);

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

    // 2. Hitbox porte sculptée (enregistrée EN DERNIER pour être prioritaire au clic ciblé sur la porte)
    this.interactiveHitboxes.push({
      x: doorX - 2,
      y: doorY - 4,
      w: doorW + 4,
      h: doorH + 6,
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
    const h = 90;
    const y = groundY - h;
    ctx.save();
    // Façade vitrée moderne bancaire
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, [6, 6, 0, 0]);
    ctx.fill();
    ctx.stroke();

    // Enseigne Banque
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(x + 6, y + 8, w - 12, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 10px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏦 وكالة بنكية وطنية', x + w / 2, y + 22);

    // Distributeur automatique DAB / GAB
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 16, groundY - 42, 24, 42);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x + 20, groundY - 36, 16, 12);
    ctx.fillStyle = '#fef08a';
    ctx.font = '700 7px "Cairo", sans-serif';
    ctx.fillText('DAB', x + 28, groundY - 27);
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

    // 1. Bouton Carte de Tunisie en haut à droite (Agrandie, royale, pulsante et enrichie)
    const mapBtnR = 30; // Bouton large bien visible
    const mapBtnX = w - 42;
    const mapBtnY = topY + 6;
    const mapPulse = Math.sin(timestamp * 0.006) * 4 + 8;

    ctx.save();
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = mapPulse;

    // Halo circulaire externe pulsant doré avec double anneau
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(mapBtnX, mapBtnY, mapBtnR + 4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(mapBtnX, mapBtnY, mapBtnR + 1.5, 0, Math.PI * 2);
    ctx.stroke();

    // Dégradé royal bleu nuit / azur lumineux
    const mapGrad = ctx.createRadialGradient(mapBtnX - 8, mapBtnY - 8, 4, mapBtnX, mapBtnY, mapBtnR);
    mapGrad.addColorStop(0, '#7dd3fc');
    mapGrad.addColorStop(0.3, '#0284c7');
    mapGrad.addColorStop(0.8, '#0369a1');
    mapGrad.addColorStop(1, '#082f49');
    ctx.fillStyle = mapGrad;
    ctx.beginPath();
    ctx.arc(mapBtnX, mapBtnY, mapBtnR, 0, Math.PI * 2);
    ctx.fill();

    // Reflet de verre supérieur
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.ellipse(mapBtnX, mapBtnY - 12, mapBtnR * 0.7, mapBtnR * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();

    // Icône Map 3D
    ctx.font = '26px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🗺️', mapBtnX, mapBtnY - 2);

    // Ruban textuel 'خريطة تونس' sous le bouton
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(mapBtnX - 34, mapBtnY + 18, 68, 17, 5);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = '#fef08a';
    ctx.font = '900 10px "Cairo", sans-serif';
    ctx.fillText('خريطة تونس 🇹🇳', mapBtnX, mapBtnY + 27);
    ctx.restore();

    this.interactiveHitboxes.push({
      x: mapBtnX - mapBtnR - 12,
      y: mapBtnY - mapBtnR - 10,
      w: (mapBtnR + 12) * 2,
      h: (mapBtnR + 22) * 2,
      action: 'hud_map',
      bizId: null
    });

    // Bouton Boost Turbo x2 à côté
    const boostX = mapBtnX - 74;
    draw3DOrbIcon(boostX, topY, '🚀', o.adBoostActive ? '#059669' : '#0284c7', o.adBoostActive ? '#6ee7b7' : '#7dd3fc', o.adBoostActive ? 'x2' : '', '#10b981');
    this.interactiveHitboxes.push({
      x: boostX - r - 8,
      y: topY - r - 8,
      w: (r + 8) * 2,
      h: (r + 8) * 2,
      action: 'hud_boost',
      bizId: null
    });

    // Bouton Guide de démarrage rapide ❓ à côté du boost
    const guideX = boostX - 52;
    draw3DOrbIcon(guideX, topY, '❓', '#0369a1', '#38bdf8', '', '#38bdf8');
    this.interactiveHitboxes.push({
      x: guideX - r - 8,
      y: topY - r - 8,
      w: (r + 8) * 2,
      h: (r + 8) * 2,
      action: 'hud_guide',
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
    this.width = 440;
    this.height = 580;
    this.scale = 1;

    // Selected city for floating details card
    this.selectedCityId = null;
    this.hoverCityId = null;

    // Caravan transport animation for seamless travel
    this.caravan = null;

    // Pan & Zoom interactifs pour exploration fluide
    this.panY = 0;
    this.targetPanY = 0;
    this.maxPanY = 240; // Défilement généreux pour couvrir tout le territoire du Nord aux frontières Sud
    this.pointerVelocityY = 0;
    this.lastPointerTime = 0;
    this.lastPointerY = 0;

    // Effet d'arrivée dans la ville (onde de choc dorée & flash cinématique)
    this.arrivalEffect = null;

    // Les 14 Villes Géographiques de Tunisie avec coordonnées réelles et alignées sur TUNISIAN_CITIES (engine.js)
    this.cities = [
      {
        id: 'tunis',
        name: 'تونس',
        fullName: 'تونس',
        icon: '🕌',
        x: 240,
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
        x: 210,
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
        x: 308,
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
        x: 140,
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
        x: 115,
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
        x: 288,
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
        x: 312,
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
        x: 215,
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
        x: 180,
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
        x: 48,
        y: 120,
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
        x: 395,
        y: 540,
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
        x: 282,
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
        x: 145,
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
        x: 95,
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
        x: 235,
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
        x: 260,
        y: 465,
        tagline: 'قصور مدنين، بحر جرجيس والزيتون الروماني العريق',
        reqDinars: 60000000,
        bonusDesc: 'الموانئ والتجارة المغاربية الجنوبية (x2)',
        themeClass: 'zone-medenine'
      },
      {
        id: 'djerba_holding',
        name: 'جربة',
        fullName: 'جربة',
        icon: '👑',
        x: 330,
        y: 440,
        tagline: 'جزيرة الأحلام ومقر الهولدينغ التونسي الوطني الدولي الشامل',
        reqDinars: 150000000,
        bonusDesc: 'مضاعف الهولدينغ الوطني الشامل لجميع المداخيل (x5) !',
        themeClass: 'zone-djerba'
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
      { from: 'medenine_zarzis', to: 'djerba_holding', name: 'Voie Romaine El Kantara' }
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
    this.isPanning = true;
    if (this.canvas.setPointerCapture && e.pointerId !== undefined) {
      try { this.canvas.setPointerCapture(e.pointerId); } catch (_) {}
    }
    this.startPanY = e.clientY;
    this.startPanX = e.clientX;
    this.lastPointerY = e.clientY;
    this.lastPointerTime = performance.now();
    this.pointerVelocityY = 0;
    this.startOriginPanY = this.panY || 0;
    this.targetPanY = this.panY || 0;
    this.hasDraggedMap = false;
  }

  handlePointerMove(e) {
    if (!this.isPanning) return;
    const now = performance.now();
    const dt = Math.max(0.005, (now - (this.lastPointerTime || now)) / 1000);
    const dy = (e.clientY - this.startPanY) / (this.scale || 1);
    const instantDy = (e.clientY - (this.lastPointerY || e.clientY)) / (this.scale || 1);

    const currentVelY = instantDy / dt;
    this.pointerVelocityY = (this.pointerVelocityY || 0) * 0.4 + currentVelY * 0.6;
    this.lastPointerY = e.clientY;
    this.lastPointerTime = now;

    const dragDist = Math.hypot(e.clientX - (this.startPanX || e.clientX), e.clientY - this.startPanY);
    if (dragDist > 7) {
      this.hasDraggedMap = true;
    }
    this.panY = Math.max(-this.maxPanY, Math.min(80, this.startOriginPanY + dy));
    this.targetPanY = this.panY;
  }

  handlePointerUp(e) {
    if (!this.isPanning) return;
    this.isPanning = false;
    if (this.canvas.releasePointerCapture && e.pointerId !== undefined) {
      try { this.canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    }

    // Si aucun glissement significatif, déclencher handleClick pour interaction tactile réactive
    if (!this.hasDraggedMap) {
      this.handleClick(e);
      return;
    }

    // Fling / Inertie dynamique verticale soyeuse
    if (Math.abs(this.pointerVelocityY || 0) > 30) {
      const flingDist = (this.pointerVelocityY || 0) * 0.35;
      this.targetPanY = Math.max(-this.maxPanY, Math.min(80, (this.panY || 0) + flingDist));
    }
  }

  handleWheel(e) {
    const delta = (e.deltaY || e.deltaX) * 0.45;
    this.targetPanY = Math.max(-this.maxPanY, Math.min(80, (this.targetPanY || 0) - delta));
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const rect = this.canvas.getBoundingClientRect();
    let cssW = (parent && parent.clientWidth) || rect.width || (typeof window !== 'undefined' ? window.innerWidth : 440);
    let cssH = (parent && parent.clientHeight) || rect.height || (typeof window !== 'undefined' ? 560 : 560);
    
    cssW = Math.max(320, cssW);
    cssH = Math.max(480, cssH);

    this.width = 460;
    this.height = 760;
    this.dpr = Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, 2.5);

    this.canvas.width = Math.floor(cssW * this.dpr);
    this.canvas.height = Math.floor(cssH * this.dpr);
    this.canvas.style.width = cssW + 'px';
    this.canvas.style.height = cssH + 'px';

    // Uniform fit scale
    const scaleX = cssW / this.width;
    const scaleY = cssH / this.height;
    this.scale = Math.min(scaleX, scaleY);
    if (!this.scale || isNaN(this.scale) || this.scale <= 0) this.scale = 1;

    this.offsetX = Math.max(0, (cssW - this.width * this.scale) / 2);
    this.offsetY = Math.max(0, (cssH - this.height * this.scale) / 2);
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

    const scale = Math.max(0.001, this.scale || 1);
    const screenX = (clientX - (this.offsetX || 0)) / scale;
    const screenY = (clientY - (this.offsetY || 0)) / scale;
    const mapY = screenY - (this.panY || 0);

    // 1. Détection de clic sur la carte Popover en bas (coordonnées écran fixes)
    if (this.selectedCityId) {
      const cardW = this.width - 32;
      const cardH = 92;
      const cardX = 16;
      const cardY = this.height - cardH - 12;
      const btnW = 120;
      const btnH = 40;
      const btnX = cardX + 12;
      const btnY = cardY + 44;

      if (screenX >= btnX - 8 && screenX <= btnX + btnW + 8 && screenY >= btnY - 8 && screenY <= btnY + btnH + 8) {
        const c = this.cities.find(item => item.id === this.selectedCityId);
        if (c && (this.isCityUnlocked(c) || this.canUnlockCity(c)) && c.id !== this.getActiveCity().id) {
          this.travelTo(c.id);
        }
        return;
      }
    }

    // 2. Détection de clic sur les nœuds de villes (coordonnées carte défilée mapY)
    for (const c of this.cities) {
      const dist = Math.hypot(screenX - c.x, mapY - c.y);
      if (dist <= 42) {
        // Si la ville n'était pas sélectionnée, la sélectionner
        if (this.selectedCityId !== c.id) {
          this.selectedCityId = c.id;
          if (this.onSelect) this.onSelect(c);
        } else {
          // Si déjà sélectionnée et accessible, déclencher le voyage directement
          if ((this.isCityUnlocked(c) || this.canUnlockCity(c)) && c.id !== this.getActiveCity().id) {
            this.travelTo(c.id);
          }
        }
        return;
      }
    }
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const x = (clientX - this.offsetX) / this.scale;
    const y = ((clientY - this.offsetY) / this.scale) - (this.panY || 0);

    let hovered = null;
    for (const c of this.cities) {
      if (Math.hypot(x - c.x, y - c.y) <= 24) {
        hovered = c.id;
        break;
      }
    }
    this.hoverCityId = hovered;
    this.canvas.style.cursor = hovered ? 'pointer' : 'default';
  }

  step(now) {
    const dt = Math.min((now - (this.lastTime || now)) / 1000, 0.1);
    this.lastTime = now;
    const t = now / 1000;

    // Lissage du défilement vertical panY
    if (this.targetPanY !== undefined) {
      this.panY = (this.panY || 0) + ((this.targetPanY || 0) - (this.panY || 0)) * Math.min(1, dt * 10);
    }

    const ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Appliquer le facteur DPR et l'échelle uniforme avec centrage et défilement vertical
    ctx.scale(this.dpr, this.dpr);
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale, this.scale);

    ctx.save();
    ctx.translate(0, this.panY || 0);

    // 1. Fond Méditerranée avec reflets d'eau et grille nautique
    this.drawSeaBackground(ctx, t);

    // 1B. Pays voisins limitrophes (Algérie à l'Ouest, Libye au Sud-Est)
    this.drawNeighboringCountries(ctx, t);

    // 2. Silhouette Vectorielle Réelle de la Tunisie (Côtes, Reliefs & Chott el Djerid)
    this.drawTunisiaLandmass(ctx, t);

    // 3. Réseau des Autoroutes & Voies Commerciales Dorées animées
    this.drawHighwaysNetwork(ctx, dt, t);

    // 4. Les 14 Nœuds de Villes avec Statuts et Pulsations
    this.drawCityNodes(ctx, t);

    // 5. Animation de caravane de voyage en cours
    this.drawCaravanAnimation(ctx, now);

    // 5B. Effet cinématique d'arrivée dans la ville
    if (this.arrivalEffect) {
      this.drawArrivalEffect(ctx, now);
    }
    ctx.restore();

    // 6. Carte flottante de la ville sélectionnée (fixée en bas, hors scroll panY)
    this.drawSelectedCityOverlay(ctx);
  }

  drawSeaBackground(ctx, t) {
    const seaGrad = ctx.createLinearGradient(0, 0, this.width, this.height);
    seaGrad.addColorStop(0, '#041527');
    seaGrad.addColorStop(0.35, '#0a2540');
    seaGrad.addColorStop(0.7, '#071f36');
    seaGrad.addColorStop(1, '#030c18');
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Ondulations nautiques avec reflets bioluminescents
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
    ctx.lineWidth = 1.4;
    for (let wave = 0; wave < 8; wave++) {
      const wy = 45 + wave * 72 + Math.sin(t * 0.8 + wave * 1.2) * 5;
      ctx.beginPath();
      ctx.moveTo(10, wy);
      ctx.bezierCurveTo(this.width * 0.35, wy - 8, this.width * 0.65, wy + 8, this.width - 10, wy);
      ctx.stroke();
    }

    // Vagues et brise marine animées sans aucun quadrillage ni carreaux
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1.2;
    for (let wave = 0; wave < 6; wave++) {
      const wy = 60 + wave * 90 + Math.sin(t * 0.001 + wave) * 6;
      ctx.beginPath();
      ctx.moveTo(10, wy);
      ctx.bezierCurveTo(this.width * 0.35, wy - 10, this.width * 0.65, wy + 10, this.width - 10, wy);
      ctx.stroke();
    }

    // Ondulations marines subtiles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 6; i++) {
      const waveX = (i * 75 + t * 14) % this.width;
      const waveY = 80 + i * 65 + Math.sin(t + i) * 6;
      ctx.fillRect(waveX, waveY, 32, 1.5);
    }
  }

  drawNeighboringCountries(ctx, t) {
    ctx.save();

    // 1. ALGÉRIE (الجزائر - Frontière Ouest)
    ctx.fillStyle = '#172522';
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.28)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(95, 70);
    ctx.lineTo(82, 110);
    ctx.lineTo(80, 170);
    ctx.lineTo(75, 215);
    ctx.lineTo(90, 270);
    ctx.lineTo(95, 325);
    ctx.lineTo(80, 360);
    ctx.lineTo(60, 390);
    ctx.lineTo(65, 405);
    ctx.lineTo(150, 490);
    ctx.lineTo(180, 535);
    ctx.lineTo(170, 720);
    ctx.lineTo(0, 720);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Mention Algérie subtile
    ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.font = '900 13px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('الجزائر 🇩🇿', 38, 260);

    // 2. LIBYE (ليبيا - Frontière Sud-Est)
    ctx.fillStyle = '#221e18';
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.28)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(325, 485);
    ctx.lineTo(460, 510);
    ctx.lineTo(460, 720);
    ctx.lineTo(230, 720);
    ctx.lineTo(230, 545);
    ctx.lineTo(290, 515);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Mention Libye subtile
    ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.font = '900 13px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ليبيا 🇱🇾', 390, 580);

    // Frontières en pointillés
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(95, 70);
    ctx.lineTo(82, 110);
    ctx.lineTo(80, 170);
    ctx.lineTo(75, 215);
    ctx.lineTo(90, 270);
    ctx.lineTo(95, 325);
    ctx.lineTo(80, 360);
    ctx.lineTo(60, 390);
    ctx.lineTo(65, 405);
    ctx.lineTo(150, 490);
    ctx.lineTo(180, 535);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(325, 485);
    ctx.lineTo(290, 515);
    ctx.lineTo(230, 545);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
  }

  drawTunisiaLandmass(ctx, t) {
    ctx.save();

    // Ombre portée de la masse continentale
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;

    // Dégradé topographique réaliste (Verts du Nord -> Sahelo-steppes -> Sables dorés du Sahara)
    const landGrad = ctx.createLinearGradient(0, 40, 0, 560);
    landGrad.addColorStop(0, '#1c4d32'); // Nord verdoyant (Bizerte, Kroumirie)
    landGrad.addColorStop(0.22, '#285a3c'); // Plaines de la Medjerda
    landGrad.addColorStop(0.42, '#525a34'); // Sahel et Centre (Sousse, Kairouan)
    landGrad.addColorStop(0.65, '#785b30'); // Steppes et Sfax
    landGrad.addColorStop(0.85, '#92632b'); // Sud et Chotts
    landGrad.addColorStop(1.0, '#b4732a'); // Sahara et dunes de Tataouine

    // Tracé fidèle des côtes et frontières de la Tunisie
    ctx.fillStyle = landGrad;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();

    const coastline = [
      [95, 70], [145, 55], [198, 40], [230, 65], [236, 100], [260, 110], [320, 92], [330, 115],
      [295, 145], [275, 165], [268, 190], [280, 215], [305, 235], [315, 265], [300, 288],
      [275, 320], [245, 355], [228, 395], [248, 410], [270, 425], [310, 465], [325, 485],
      [290, 515], [230, 545], [180, 535], [150, 490], [65, 405], [60, 390], [80, 360],
      [95, 325], [90, 270], [75, 215], [80, 170], [82, 110], [95, 70]
    ];

    coastline.forEach((pt, idx) => {
      if (idx === 0) ctx.moveTo(pt[0], pt[1]);
      else ctx.lineTo(pt[0], pt[1]);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;

    // ÎLE DE DJERBA (جزيرة جربة - Découpage insulaire fidèle)
    ctx.fillStyle = '#b4732a';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(312, 424);
    ctx.lineTo(338, 422);
    ctx.lineTo(348, 436);
    ctx.lineTo(334, 452);
    ctx.lineTo(314, 448);
    ctx.lineTo(306, 436);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Île de La Galite (أرخبيل جالطة - Nord de Bizerte / Tabarka)
    ctx.fillStyle = '#285a3c';
    ctx.beginPath();
    ctx.ellipse(140, 26, 7, 3.5, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Îles Zembra et Zembretta (جزيرة زمبرة وزمبرتا - Golfe de Tunis)
    ctx.fillStyle = '#285a3c';
    ctx.beginPath();
    ctx.ellipse(282, 80, 5, 3, 0.5, 0, Math.PI * 2);
    ctx.ellipse(289, 75, 2.5, 1.8, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Archipel des Kerkennah (جزر قرقنة)
    ctx.fillStyle = '#655734';
    ctx.beginPath();
    ctx.ellipse(320, 312, 12, 4, 0.4, 0, Math.PI * 2);
    ctx.ellipse(334, 304, 10, 3.5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Îles Kuriat (جزر قوريا - Monastir)
    ctx.fillStyle = '#525a34';
    ctx.beginPath();
    ctx.ellipse(336, 230, 4, 2.5, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // CHOTT EL DJERID (شط الجريد - Étendue saline scintillante)
    ctx.fillStyle = 'rgba(207, 250, 254, 0.55)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(85, 402);
    ctx.lineTo(145, 392);
    ctx.lineTo(178, 408);
    ctx.lineTo(155, 424);
    ctx.lineTo(95, 428);
    ctx.lineTo(75, 414);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Reflets de sel étincelant sur le Chott
    ctx.fillStyle = '#ffffff';
    const shimmer = Math.sin(t * 3) * 0.4 + 0.6;
    ctx.globalAlpha = shimmer;
    ctx.fillText('✨', 115, 414);
    ctx.globalAlpha = 1.0;

    ctx.restore();
  }

  drawHighwaysNetwork(ctx, dt, t) {
    ctx.save();

    // 1. Tracé des autoroutes dorées élégantes
    // Base avec lueur dorée
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 4;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const h of this.highways) {
      const c1 = this.cities.find(c => c.id === h.from);
      const c2 = this.cities.find(c => c.id === h.to);
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
      const c1 = this.cities.find(c => c.id === h.from);
      const c2 = this.cities.find(c => c.id === h.to);
      if (!c1 || !c2) continue;

      ctx.beginPath();
      ctx.moveTo(c1.x, c1.y);
      ctx.lineTo(c2.x, c2.y);
      ctx.stroke();
    }

    // 3. Particules de caravanes commerciales animées
    for (const p of this.tradeParticles) {
      p.progress = (p.progress + dt * p.speed) % 1.0;
      const c1 = this.cities.find(c => c.id === p.highway.from);
      const c2 = this.cities.find(c => c.id === p.highway.to);
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
        if (isNext) {
          const pctText = Math.round(this.getCityUnlockProgress(c) * 100) + '%';
          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 8.5px "Cairo", sans-serif';
          ctx.fillText('🔓 ' + pctText, c.x, c.y + pinRadius + 12);
        } else {
          // Mention élégante discrète pour les villes verrouillées
          ctx.fillStyle = '#94a3b8';
          ctx.font = '800 7.5px "Cairo", sans-serif';
          ctx.fillText('🔒 مقفلة', c.x, c.y + pinRadius + 11);
        }
      }

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

    // 3. Faisceau de phares avant illuminant la route en direction de la destination
    ctx.save();
    ctx.translate(curX, curY);
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

    // Voiture tunisienne stylisée
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚗', 0, 0);
    ctx.restore();

    // 4. Bulle d'ambiance de voyage animée au-dessus du convoi
    const bubbleY = curY - 26;
    const kmPct = Math.min(100, Math.round(progress * 100));
    ctx.shadowBlur = 6;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(curX - 44, bubbleY - 10, 88, 20, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = '900 9.5px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`في الطريق إلى ${this.caravan.targetCity.name.slice(0, 8)} (${kmPct}%)`, curX, bubbleY + 3);

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
    ctx.fillText(`🎉 مرحباً بك في ${city.name} ! 🇹🇳`, city.x, bannerY + 20);

    ctx.fillStyle = isNewCity ? '#34d399' : '#38bdf8';
    ctx.font = '900 11px "Cairo", sans-serif';
    if (isNewCity) {
      ctx.fillText(`⭐ ارتقيت إلى المستوى ${curLvl} في الإمبراطورية !`, city.x, bannerY + 35);
    } else {
      ctx.fillText(`🚗 رحلة موفقة عبر شبكة الطرقات السريعة`, city.x, bannerY + 35);
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 9.5px "Cairo", sans-serif';
    ctx.fillText(isNewCity ? 'شوارع ومشاريع جديدة جاهزة للاستثمار' : 'استأنف أعمالك ومشاريعك في المدينة', city.x, bannerY + 47);

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

    // Boîte Popover en bas de la carte
    const cardW = this.width - 32;
    const cardH = 92;
    const cardX = 16;
    const cardY = this.height - cardH - 12;

    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 18;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 12);
    ctx.fill();

    ctx.strokeStyle = isActive ? '#10b981' : (isUnlocked ? '#38bdf8' : '#f59e0b');
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Titre et icône avec numéro de niveau de ville
    ctx.font = '22px sans-serif';
    ctx.fillText(c.icon, cardX + cardW - 28, cardY + 30);

    const cityIndex = this.cities.findIndex(item => item.id === c.id) + 1;

    ctx.textAlign = 'right';
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 13px "Cairo", sans-serif';
    ctx.fillText(`${c.fullName} (محطّة ${cityIndex})`, cardX + cardW - 40, cardY + 24);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 9.5px "Cairo", sans-serif';
    ctx.fillText(c.tagline.slice(0, 48), cardX + cardW - 12, cardY + 42);

    // Boni de production
    ctx.fillStyle = '#38bdf8';
    ctx.font = '800 10px "Cairo", sans-serif';
    ctx.fillText('🎁 ' + c.bonusDesc, cardX + cardW - 12, cardY + 60);

    // Bouton d'action à gauche
    const btnW = 105;
    const btnH = 30;
    const btnX = cardX + 12;
    const btnY = cardY + 48;

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
      // Mention élégante des critères de déblocage avec cadenas doré
      ctx.fillStyle = 'rgba(51, 65, 85, 0.85)';
      ctx.beginPath();
      ctx.roundRect(btnX - 20, btnY, btnW + 20, btnH, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.textAlign = 'center';
      ctx.font = '900 9.5px "Cairo", sans-serif';
      ctx.fillText('🔒 مقفلة (' + Math.round(pct * 100) + '%)', btnX - 20 + (btnW + 20) / 2, btnY + 14);

      // Critère explicite
      const engineCity = this.engine.getCityById ? this.engine.getCityById(c.id) : null;
      const critText = engineCity && engineCity.criteriaDesc ? engineCity.criteriaDesc : `يتطلب ${c.reqDinars || 0} د.ت`;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '800 8px "Cairo", sans-serif';
      ctx.fillText(critText.slice(0, 24), btnX - 20 + (btnW + 20) / 2, btnY + 25);
    }

    ctx.restore();
  }
}
