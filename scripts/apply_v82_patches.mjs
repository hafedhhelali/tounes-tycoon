import fs from 'fs';

console.log('=== CREATING COMPREHENSIVE PATCH V82 ===');

// =========================================================================
// 1. ENGINE.JS : INDEPENDENT CITY BUSINESS PROGRESSION + CITY SPECIALTIES
// =========================================================================
let engineCode = fs.readFileSync('c:/Projects/tounes-tycoon/engine.js', 'utf8');

// In TycoonEngine constructor, initialize cityBusinesses map
const ctorAnchor = `    this.businesses = BUSINESS_CONFIGS.map(cfg => ({
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
      managers: cfg.managers
    }));`;

const newCtorCode = `    this.BUSINESS_CONFIGS = BUSINESS_CONFIGS;
    this.cityBusinesses = {}; // Independent progression per city: { [cityId]: businessesArray }
    this.initCityBusinesses('tunis');
    this.businesses = this.cityBusinesses['tunis'];`;

if (engineCode.includes(ctorAnchor)) {
  engineCode = engineCode.replace(ctorAnchor, newCtorCode);
  console.log('✔ Engine constructor patched with cityBusinesses');
}

// Add initCityBusinesses helper method and update switchCity/unlockCity
const helperMethods = `  initCityBusinesses(cityId) {
    if (!this.cityBusinesses[cityId]) {
      this.cityBusinesses[cityId] = this.BUSINESS_CONFIGS.map(cfg => ({
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
        managers: cfg.managers
      }));
    }
    return this.cityBusinesses[cityId];
  }

  switchCity(cityId) {
    const city = this.getCityById(cityId);
    if (!city) return false;
    this.currentCityId = city.id;
    this.currentZoneId = city.id;
    this.initCityBusinesses(city.id);
    this.businesses = this.cityBusinesses[city.id];
    return true;
  }
`;

// Insert helperMethods before getCities()
engineCode = engineCode.replace(
  '  // --- 14 CITIES PROGRESSION & VILLES TUNISIENNES ---',
  `${helperMethods}\n  // --- 14 CITIES PROGRESSION & VILLES TUNISIENNES ---`
);

// In unlockCity, call switchCity when changing city
const oldUnlockCity = `  unlockCity(cityId) {
    const city = this.getCityById(cityId);
    if (!city) return false;

    // Déjà débloquée -> simple voyage / basculement
    if (this.unlockedCityIds.includes(city.id)) {
      this.currentCityId = city.id;
      this.currentZoneId = city.id;
      return true;
    }

    // Vérification stricte des critères
    if (!this.checkCityUnlockCriteria(city)) return false;

    // Prélèvement du coût d'ouverture si > 0
    if (city.costDinars > 0) {
      this.dinars -= city.costDinars;
    }

    this.unlockedCityIds.push(city.id);
    this.currentCityId = city.id;
    this.currentZoneId = city.id;
    return true;
  }`;

const newUnlockCity = `  unlockCity(cityId) {
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
    this.switchCity(city.id);
    return true;
  }`;

engineCode = engineCode.replace(oldUnlockCity, newUnlockCity);
console.log('✔ unlockCity & switchCity hooked up');

// In exportState, serialize cityBusinesses
const exportAnchor = `      businesses: this.businesses.map(b => ({
        id: b.id,
        level: b.level,
        hiredManagersCount: b.hiredManagersCount ?? (b.hasManager ? 1 : 0),
        hasManager: b.hasManager,
        progressMs: b.progressMs,
        isProducing: b.isProducing
      }))`;

const newExportCode = `      businesses: this.businesses.map(b => ({
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
      )`;

engineCode = engineCode.replace(exportAnchor, newExportCode);
console.log('✔ exportState patched with cityBusinesses');

// In loadState, deserialize cityBusinesses
const loadAnchor = `    if (Array.isArray(state.businesses)) {
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
    }`;

const newLoadCode = `    this.cityBusinesses = {};
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
    }`;

engineCode = engineCode.replace(loadAnchor, newLoadCode);
console.log('✔ loadState patched with cityBusinesses');

// In checkCityUnlockCriteria, check criteria against ALL unlocked cities (empire-wide)
// so a player who levelled up businesses in Tunis can unlock Bizerte, Nabeul, etc.
engineCode = engineCode.replace(
  'const qualified = this.businesses.filter(b => (b.level || 0) >= minLevel).length;',
  `const allEmpireBusinesses = Object.values(this.cityBusinesses).flat().concat(this.businesses);
      const qualified = allEmpireBusinesses.filter(b => (b.level || 0) >= minLevel).length;`
);

// Fix Nabeul specialty: attariya in Nabeul should NEVER be called pottery!
// Attariya is grocery. Pottery belongs to artisanal craft shop or market.
engineCode = engineCode.replace(
  "nabeul_hammamet: {\n        attariya: { name: 'فخار وخزف نابل التقليدي', icon: '🏺', tagline: 'جرار، أواني خزفية ومزهريات قلالين نابل العريقة' },",
  "nabeul_hammamet: {\n        attariya: { name: 'عطريّة وزهر نابل الأصيل', icon: '🏪', tagline: 'بهارات نابلية فاوحة، ماء زهر مقطّر، فلفل شايح وهريسة دياري' },"
);
engineCode = engineCode.replace(
  "djerba_holding: {\n        attariya: { name: 'فخار قلالة وصناعات جربة التقليدية', icon: '🏺', tagline: 'أواني فخار قلالة، فليج وسعف المظلات وصياغة الفضة' },",
  "djerba_holding: {\n        attariya: { name: 'عطريّة حومة السوق العتيقة', icon: '🏪', tagline: 'توابل جربية نادرة، زيتون معتّق، سميد وخيرات الجزيرة' },"
);
engineCode = engineCode.replace(
  "kairouan: {\n        patisserie: { name: 'مقروض القيروان الملكي بالسمن', icon: '🍯', tagline: 'مقروض بالسمن الحر، التمر المعسل وجلجلان باب الجلادين' },\n        attariya: { name: 'زربية القيروان والصناعات التقليدية', icon: '🧵', tagline: 'زرابي صوفية عقدة عقدة، نحاس مطروق وبخور القيروان' }\n      }",
  "kairouan: {\n        patisserie: { name: 'مقروض القيروان الملكي بالسمن', icon: '🍯', tagline: 'مقروض بالسمن الحر، التمر المعسل وجلجلان باب الجلادين' },\n        attariya: { name: 'عطريّة رحبة الصوف القيروانية', icon: '🏪', tagline: 'حمص، عطورات وبخور، حكك هريسة وزيت زيتون عقارب' }\n      }"
);

fs.writeFileSync('c:/Projects/tounes-tycoon/engine.js', engineCode, 'utf8');
console.log('✔ engine.js fully updated');

// =========================================================================
// 2. STORE_ANIMATOR.JS : BROUETTE KASKROUT + PAN & ZOOM MAP + ARRIVAL EFFECT
// =========================================================================
let animCode = fs.readFileSync('c:/Projects/tounes-tycoon/store_animator.js', 'utf8');

// A. In drawBuilding: specialize kaskrout as a street vendor cart (brouette/charette)
const oldBuildingUnlocked = `    // Cas 2 : Commerce actif - Façade architecturale évolutive tunisienne`;

const cartDrawingCode = `    // Cas 2A : نصبة كسكروت عياري (Brouette / Charrette ambulante traditionnelle avec parasol et roues)
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

      // Badge d'entrée "ادخل" placé au-dessus du comptoir de la brouette
      const enterW = 58;
      const enterH = 19;
      const enterX = cartX + (cartW - enterW) / 2;
      const enterY = boxY - 24;

      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 8;
      ctx.fillStyle = 'rgba(6, 78, 59, 0.95)';
      ctx.beginPath();
      ctx.roundRect(enterX, enterY, enterW, enterH, 6);
      ctx.fill();
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#fef08a';
      ctx.font = '900 10.5px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ادخل 🚪', cartX + cartW / 2, enterY + 13);

      this.interactiveHitboxes.push({
        x: cartX,
        y: y,
        w: cartW,
        h: bHeight,
        action: 'inspect',
        bizId: b.id
      });

      ctx.restore();
      return;
    }

    // Cas 2 : Commerce actif - Façade architecturale évolutive tunisienne`;

animCode = animCode.replace(oldBuildingUnlocked, cartDrawingCode);
console.log('✔ kaskrout specialized as street vendor cart');

// B. In TunisiaMapEngine : Add interactive pan & zoom gestures, arrival effect and locked explanation
const oldMapConstructor = `    // Caravan transport animation for seamless travel
    this.caravan = null;`;

const newMapConstructor = `    // Caravan transport animation for seamless travel
    this.caravan = null;

    // Pan & Zoom interactifs pour exploration fluide
    this.panX = 0;
    this.panY = 0;
    this.zoom = 1.0;
    this.isPanning = false;
    this.startPanX = 0;
    this.startPanY = 0;
    this.lastTouchDist = 0;

    // Effet d'arrivée dans la ville (onde de choc dorée & flash cinématique)
    this.arrivalEffect = null;`;

animCode = animCode.replace(oldMapConstructor, newMapConstructor);

// Add event handlers in TunisiaMapEngine constructor
const oldListeners = `    this.canvas.addEventListener('click', this.handleClick);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('resize', this.onWindowResize);`;

const newListeners = `    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handleWheel = this.handleWheel.bind(this);

    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    this.canvas.addEventListener('pointermove', this.handlePointerMove);
    this.canvas.addEventListener('pointerup', this.handlePointerUp);
    this.canvas.addEventListener('pointercancel', this.handlePointerUp);
    this.canvas.addEventListener('wheel', this.handleWheel, { passive: false });
    this.canvas.addEventListener('click', this.handleClick);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('resize', this.onWindowResize);`;

animCode = animCode.replace(oldListeners, newListeners);

// Add pan/zoom methods in TunisiaMapEngine
const panMethods = `  handleWheel(e) {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    this.zoom = Math.max(0.85, Math.min(2.4, this.zoom * zoomFactor));
  }

  handlePointerDown(e) {
    this.isPanning = true;
    this.startPanX = e.clientX - this.panX;
    this.startPanY = e.clientY - this.panY;
    this.hasMovedPan = false;
  }

  handlePointerMove(e) {
    if (!this.isPanning) return;
    const newPanX = e.clientX - this.startPanX;
    const newPanY = e.clientY - this.startPanY;
    if (Math.hypot(newPanX - this.panX, newPanY - this.panY) > 5) {
      this.hasMovedPan = true;
    }
    const maxPanX = (this.width * this.zoom * this.scale) * 0.45;
    const maxPanY = (this.height * this.zoom * this.scale) * 0.45;
    this.panX = Math.max(-maxPanX, Math.min(maxPanX, newPanX));
    this.panY = Math.max(-maxPanY, Math.min(maxPanY, newPanY));
  }

  handlePointerUp(e) {
    this.isPanning = false;
  }
`;

animCode = animCode.replace('  start() {', `${panMethods}\n  start() {`);

// In render of TunisiaMapEngine, apply panX, panY, zoom transform
const oldStepCtx = `    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    // Centrage avec respect du ratio d'aspect (letterboxing propre)
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale, this.scale);`;

const newStepCtx = `    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    // Centrage avec respect du ratio d'aspect et pan/zoom
    ctx.translate(this.offsetX + this.panX, this.offsetY + this.panY);
    ctx.scale(this.scale * this.zoom, this.scale * this.zoom);`;

animCode = animCode.replace(oldStepCtx, newStepCtx);

// In handleClick, take pan and zoom into account
const oldClickTransform = `    // Transformation coordonnées écran -> virtuelles (viewBox 440 x 580)
    const x = (clientX - this.offsetX) / this.scale;
    const y = (clientY - this.offsetY) / this.scale;`;

const newClickTransform = `    if (this.hasMovedPan) return; // Évite de cliquer si c'était un pan/scroll
    // Transformation coordonnées écran -> virtuelles (viewBox 440 x 580) avec pan & zoom
    const x = (clientX - this.offsetX - this.panX) / (this.scale * this.zoom);
    const y = (clientY - this.offsetY - this.panY) / (this.scale * this.zoom);`;

animCode = animCode.replace(oldClickTransform, newClickTransform);

// In drawCaravanAnimation, trigger arrival effect when progress reaches 1.0
const oldArrivalTrigger = `    if (progress >= 1.0) {
      const arrivedCity = this.caravan.targetCity || to;
      this.caravan = null;
      if (this.onTravel) this.onTravel(arrivedCity);
    }`;

const newArrivalTrigger = `    if (progress >= 1.0) {
      const arrivedCity = this.caravan.targetCity || to;
      this.caravan = null;

      // Déclencher l'effet cinématique d'arrivée dans la ville
      this.arrivalEffect = {
        city: arrivedCity,
        startTime: performance.now(),
        duration: 1200 // 1.2s de célébration visuelle avant ouverture de la ville
      };

      if (this.onTravel) {
        setTimeout(() => {
          this.onTravel(arrivedCity);
          this.arrivalEffect = null;
        }, 1100);
      }
    }`;

animCode = animCode.replace(oldArrivalTrigger, newArrivalTrigger);

// Render arrival effect in step(now)
const oldStepCaravan = `    // 5. Animation de caravane de voyage en cours
    this.drawCaravanAnimation(ctx, now);

    // 6. Carte flottante de la ville sélectionnée
    this.drawSelectedCityOverlay(ctx);`;

const newStepCaravan = `    // 5. Animation de caravane de voyage en cours
    this.drawCaravanAnimation(ctx, now);

    // 5B. Effet cinématique d'arrivée dans la ville
    if (this.arrivalEffect) {
      this.drawArrivalEffect(ctx, now);
    }

    // 6. Carte flottante de la ville sélectionnée
    this.drawSelectedCityOverlay(ctx);`;

animCode = animCode.replace(oldStepCaravan, newStepCaravan);

// Add drawArrivalEffect method
const arrivalEffectMethod = `  drawArrivalEffect(ctx, now) {
    const elapsed = now - this.arrivalEffect.startTime;
    const progress = Math.min(1.0, elapsed / this.arrivalEffect.duration);
    const city = this.arrivalEffect.city;

    ctx.save();

    // 1. Onde de choc circulaire dorée et cyan expansive
    const maxR = 90;
    const curR = 15 + progress * maxR;
    const alpha = Math.max(0, 1 - progress);

    ctx.strokeStyle = \`rgba(251, 191, 36, \${alpha})\`;
    ctx.lineWidth = 4 * (1 - progress * 0.5);
    ctx.beginPath();
    ctx.arc(city.x, city.y, curR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = \`rgba(56, 189, 248, \${alpha * 0.8})\`;
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
      ctx.fillStyle = p % 2 === 0 ? \`rgba(254, 240, 138, \${alpha})\` : \`rgba(52, 211, 153, \${alpha})\`;
      ctx.beginPath();
      ctx.arc(px, py, 3.5 * (1 - progress * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Bannière triomphale d'entrée dans la ville
    const bannerW = 200;
    const bannerH = 44;
    const bannerX = city.x - bannerW / 2;
    const bannerY = city.y - 65 - Math.sin(progress * Math.PI) * 10;

    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 16;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
    ctx.beginPath();
    ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 10);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#fef08a';
    ctx.font = '900 13px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(\`🎉 مرحباً بك في \${city.name} ! 🇹🇳\`, city.x, bannerY + 20);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '800 10px "Cairo", sans-serif';
    ctx.fillText('جاري فتح شوارع ومشاريع المدينة...', city.x, bannerY + 36);

    ctx.restore();
  }
`;

animCode = animCode.replace('  drawSelectedCityOverlay(ctx) {', `${arrivalEffectMethod}\n  drawSelectedCityOverlay(ctx) {`);

// In drawSelectedCityOverlay: make locked explanation super clean and elegant
const oldLockedCard = `    } else {
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnW, btnH, 8);
      ctx.fill();

      ctx.fillStyle = '#cbd5e1';
      ctx.textAlign = 'center';
      ctx.font = '900 9.5px "Cairo", sans-serif';
      ctx.fillText('🔒 ' + Math.round(pct * 100) + '% جاهز', btnX + btnW / 2, btnY + 19);
    }`;

const newLockedCard = `    } else {
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
      const critText = engineCity && engineCity.criteriaDesc ? engineCity.criteriaDesc : \`يتطلب \${c.reqDinars || 0} د.ت\`;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '800 8px "Cairo", sans-serif';
      ctx.fillText(critText.slice(0, 24), btnX - 20 + (btnW + 20) / 2, btnY + 25);
    }`;

animCode = animCode.replace(oldLockedCard, newLockedCard);

fs.writeFileSync('c:/Projects/tounes-tycoon/store_animator.js', animCode, 'utf8');
console.log('✔ store_animator.js fully updated');

// =========================================================================
// 3. INDEX.HTML : CLEAN TRANSITION FROM MAP TO STREET UPON ARRIVAL
// =========================================================================
let indexCode = fs.readFileSync('c:/Projects/tounes-tycoon/index.html', 'utf8');

const oldTravelCallback = `        tunisiaMap = new TunisiaMapEngine(mapCanvas, engine, {
          onTravel: (city) => {
            applyZoneTheme();
            renderZonesUI();
            if (window.soundFX && window.soundFX.playCoin) window.soundFX.playCoin();
            showFeedbackToast(\`🚗 مرحباً بك في \${city.name} ! تم تفعيل البونيس الجهوي بنجاح.\`);
          },`;

const newTravelCallback = `        tunisiaMap = new TunisiaMapEngine(mapCanvas, engine, {
          onTravel: (city) => {
            // Effet d'arrivée terminé -> fermeture de la map et basculement automatique vers la rue de la nouvelle ville
            applyZoneTheme();
            renderZonesUI();
            renderDOM();
            updateSynergiesUI();
            if (quartierEngine) {
              quartierEngine.buildZoneLayout(city.id);
            }
            if (window.soundFX && window.soundFX.playCoin) window.soundFX.playCoin();
            soundEngine.playEventFanfare();
            showFeedbackToast(\`🎉 وصلت بالسلامة إلى \${city.name} ! الشوارع والمشاريع مفتوحة للاستثمار 🇹🇳\`);
            // Basculer vers l'onglet rue
            switchTab('businesses');
          },`;

indexCode = indexCode.replace(oldTravelCallback, newTravelCallback);

fs.writeFileSync('c:/Projects/tounes-tycoon/index.html', indexCode, 'utf8');
console.log('✔ index.html fully updated');

console.log('=== ALL COMPREHENSIVE PATCHES SUCCESSFULLY APPLIED ===');
