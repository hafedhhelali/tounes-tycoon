import fs from 'fs';

console.log('=== CREATING COMPREHENSIVE PATCH V83 (Kaskrout single cart, sell mechanics, park replacement, balanced economy) ===');

// =========================================================================
// 1. ENGINE.JS : Kaskrout uniquely in Tunis, Sell Business, Balanced Economy
// =========================================================================
let engineCode = fs.readFileSync('c:/Projects/tounes-tycoon/engine.js', 'utf8');

// A. In initCityBusinesses:
// If cityId !== 'tunis', kaskrout is NOT included in the city's businesses!
const oldInitCity = `  initCityBusinesses(cityId) {
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
  }`;

const newInitCity = `  initCityBusinesses(cityId) {
    if (!this.cityBusinesses[cityId]) {
      // نصبة كسكروت عياري : UNE SEULE, DANS la ville de départ ('tunis')
      // Dans les autres villes, le premier commerce est le fricassé/bambalouni ou pâtisserie
      const configs = this.BUSINESS_CONFIGS.filter(cfg => {
        if (cfg.id === 'kaskrout' && cityId !== 'tunis') return false;
        return true;
      });

      this.cityBusinesses[cityId] = configs.map(cfg => ({
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
        managers: cfg.managers,
        isSold: false
      }));
    }
    return this.cityBusinesses[cityId];
  }`;

engineCode = engineCode.replace(oldInitCity, newInitCity);
console.log('✔ initCityBusinesses patched: kaskrout only in Tunis');

// B. Add sellBusiness method in TycoonEngine
const sellBusinessMethod = `  // Vente du fonds de commerce : rembourse 70% de l'investissement cumulé
  // Si c'est la نصبة كسكروت, elle disparaît définitivement et devient un parc public verdoyant
  sellBusiness(bizId) {
    const biz = this.businesses.find(b => b.id === bizId);
    if (!biz || biz.level === 0 || biz.isSold) return null;

    // Calcul de la valeur de revente (70% de la valeur cumulée investie)
    let totalInvested = 0;
    for (let lvl = 0; lvl < biz.level; lvl++) {
      totalInvested += biz.baseCost * Math.pow(biz.costMultiplier, lvl);
    }
    const resaleValue = Math.floor(Math.max(biz.baseCost * 0.7, totalInvested * 0.7) * 100) / 100;

    this.dinars += resaleValue;
    biz.level = 0;
    biz.isProducing = false;
    biz.progressMs = 0;
    biz.hasManager = false;
    biz.hiredManagersCount = 0;

    if (biz.id === 'kaskrout') {
      biz.isSold = true;
      if (!this.soldBusinesses) this.soldBusinesses = [];
      if (!this.soldBusinesses.includes('kaskrout')) {
        this.soldBusinesses.push('kaskrout');
      }
    }

    return { resaleValue, isKaskroutPark: biz.id === 'kaskrout' };
  }
`;

engineCode = engineCode.replace('  buyBusiness(id) {', `${sellBusinessMethod}\n  buyBusiness(id) {`);
console.log('✔ sellBusiness method added');

// C. In exportState and loadState, serialize/deserialize soldBusinesses
engineCode = engineCode.replace(
  'unlockedCityIds: this.unlockedCityIds || [\'tunis\'],',
  'unlockedCityIds: this.unlockedCityIds || [\'tunis\'],\n      soldBusinesses: this.soldBusinesses || [],'
);
engineCode = engineCode.replace(
  'this.purchasedUpgrades = Array.isArray(state.purchasedUpgrades) ? state.purchasedUpgrades : [];',
  'this.soldBusinesses = Array.isArray(state.soldBusinesses) ? state.soldBusinesses : [];\n    this.purchasedUpgrades = Array.isArray(state.purchasedUpgrades) ? state.purchasedUpgrades : [];'
);

// D. Équilibrage des gains pour éviter les sommes astronomiques irréalistes
// Lissage logarithmique doux quand les gains dépassent 10 millions DT par cycle
const oldRevenueCalc = `    return business.baseRevenue * business.level * prestigeMultiplier * eventMultiplier * adMultiplier * staffMultiplier * comboMultiplier * luckySpeedMultiplier * zoneMultiplier * upgradeMultiplier * milestoneMultiplier;`;

const newRevenueCalc = `    const rawRevenue = business.baseRevenue * business.level * prestigeMultiplier * eventMultiplier * adMultiplier * staffMultiplier * comboMultiplier * luckySpeedMultiplier * zoneMultiplier * upgradeMultiplier * milestoneMultiplier;

    // Équilibrage macro-économique tunisien : au-delà de 5 millions DT / cycle,
    // amortissement d'échelle (loi des rendements décroissants réaliste)
    if (rawRevenue > 5000000) {
      const excess = rawRevenue - 5000000;
      return 5000000 + Math.pow(excess, 0.85);
    }
    return rawRevenue;`;

engineCode = engineCode.replace(oldRevenueCalc, newRevenueCalc);
console.log('✔ Revenue calculation calibrated against astronomical hyperinflation');

fs.writeFileSync('c:/Projects/tounes-tycoon/engine.js', engineCode, 'utf8');
console.log('✔ engine.js written');

// =========================================================================
// 2. STORE_ANIMATOR.JS : Transformation de Kaskrout vendue en Parc Verdoyant
// =========================================================================
let animCode = fs.readFileSync('c:/Projects/tounes-tycoon/store_animator.js', 'utf8');

// In drawBuilding, check if biz.isSold (or engine.soldBusinesses includes 'kaskrout'):
// If sold, render a beautiful Tunisian public park with fountain, bench and olive trees
const parkRenderingCode = `    // Cas 0 : نصبة كسكروت عياري تمّ بيعها -> تحوّلت إلى حديقة عمومية خضراء جميلة ونافورة
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
`;

animCode = animCode.replace(
  '    // Cas 1 : Commerce non encore débloqué',
  `${parkRenderingCode}\n    // Cas 1 : Commerce non encore débloqué`
);
console.log('✔ parkRenderingCode inserted into drawBuilding');

fs.writeFileSync('c:/Projects/tounes-tycoon/store_animator.js', animCode, 'utf8');
console.log('✔ store_animator.js written');

// =========================================================================
// 3. INDEX.HTML : Bouton "بيع المشروع" dans la fenêtre de détails
// =========================================================================
let indexCode = fs.readFileSync('c:/Projects/tounes-tycoon/index.html', 'utf8');

// Insert a Sell button in biz-hud-top next to the close button
const oldCloseBtn = `<button class="biz-close-btn" id="closeBizDetailBtn" aria-label="Fermer">✕</button>`;

const newHeaderBtns = `<button id="sellBizBtn" style="background: rgba(220, 38, 38, 0.85); border: 1px solid #ef4444; border-radius: 8px; color: #ffffff; font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 11px; padding: 4px 10px; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: transform 0.15s ease;" title="بيع الأصل التجاري واسترجاع 70% من الفلوس">
          <span>🏷️</span><span>بيع المحلّ</span>
        </button>
        <button class="biz-close-btn" id="closeBizDetailBtn" aria-label="Fermer">✕</button>`;

if (indexCode.includes(oldCloseBtn)) {
  indexCode = indexCode.replace(oldCloseBtn, newHeaderBtns);
  console.log('✔ sellBizBtn inserted into biz-hud-top');
}

// Hook up sellBizBtn click handler in openBizDetailModalUI
const oldUpgradeHook = `      if (bizDetailQuickUpgradeBtn) {
        bizDetailQuickUpgradeBtn.onclick = () => {
          if (engine.buyBusiness(biz.id)) {
            soundEngine.playCoin();
            renderBizDetailContent();
            renderDOM();
            updateSynergiesUI();
          } else {
            const manque = Math.max(0, engine.getCost(biz) - engine.dinars);
            triggerBalanceAlert(\`ناقصك \${formatCurrencyPlain(manque)} فلوس باش تطوّر المشروع ! 💰\`);
          }
        };
      }`;

const newSellAndUpgradeHook = `      if (bizDetailQuickUpgradeBtn) {
        bizDetailQuickUpgradeBtn.onclick = () => {
          if (engine.buyBusiness(biz.id)) {
            soundEngine.playCoin();
            renderBizDetailContent();
            renderDOM();
            updateSynergiesUI();
          } else {
            const manque = Math.max(0, engine.getCost(biz) - engine.dinars);
            triggerBalanceAlert(\`ناقصك \${formatCurrencyPlain(manque)} فلوس باش تطوّر المشروع ! 💰\`);
          }
        };
      }

      const sellBizBtn = document.getElementById('sellBizBtn');
      if (sellBizBtn) {
        // Cacher le bouton si le projet est niveau 0 ou déjà vendu
        if (!biz || biz.level === 0 || biz.isSold) {
          sellBizBtn.style.display = 'none';
        } else {
          sellBizBtn.style.display = 'flex';
          sellBizBtn.onclick = () => {
            const confirmMsg = biz.id === 'kaskrout'
              ? 'هل أنت متأكد من بيع نصبة الكسكروت ؟ ستختفي للأبد وتتحول إلى منتزه عمومي جميل ! 🌳'
              : \`هل أنت متأكد من بيع أصل \${biz.name} ؟ ستسترجع 70% من قيمة استثمارك وتغلق المحل.\`;

            if (confirm(confirmMsg)) {
              const res = engine.sellBusiness(biz.id);
              if (res) {
                soundEngine.playEventFanfare();
                if (bizDetailModal) bizDetailModal.classList.remove('active');
                if (storeSimulation) storeSimulation.stop();
                renderDOM();
                updateSynergiesUI();
                showFeedbackToast(\`🏷️ تم بيع المشروع بنجاح واسترجاع +\${formatCurrencyPlain(res.resaleValue)} إلى رصيدك !\`);
              }
            }
          };
        }
      }`;

indexCode = indexCode.replace(oldUpgradeHook, newSellAndUpgradeHook);
console.log('✔ sellBizBtn logic hooked into index.html');

fs.writeFileSync('c:/Projects/tounes-tycoon/index.html', indexCode, 'utf8');
console.log('✔ index.html updated');

console.log('=== ALL COMPREHENSIVE PATCHES V83 APPLIED ===');
