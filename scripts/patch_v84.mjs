import fs from 'fs';

// --- 1. PATCH index.html ---
let html = fs.readFileSync('c:/Projects/tounes-tycoon/index.html', 'utf8');

// A. Titre de la carte : strictly 'خريطة تونس 🇹🇳'
html = html.replace(
  /<div style="font-weight: 900; font-size: 14\.5px; color: #f8fafc; line-height: 1\.4;">خريطة الجمهورية التونسية والاستثمار الوطني<\/div>\s*<div style="font-size: 11px; color: #94a3b8; line-height: 1\.4;">14 مدينة كبرى، مسالك تجارية ذهبية وبونيس جهوي لكل ولاية<\/div>/,
  '<div style="font-weight: 900; font-size: 15px; color: #f8fafc; line-height: 1.4;">خريطة تونس 🇹🇳</div>'
);

// B. Supprimer bouton sellBizBtn du DOM
html = html.replace(/<button id="sellBizBtn"[\s\S]*?<\/button>\s*/, '');

// C. Fiabiliser switchTab('zones')
html = html.replace(
  /if \(tabName === 'zones'\) \{\s*renderZonesUI\(\);\s*initTunisiaMap\(\);\s*setTimeout\(\(\) => \{ if \(tunisiaMap\) tunisiaMap\.resize\(\); \}, 60\);\s*\}/,
  `if (tabName === 'zones') {
        renderZonesUI();
        initTunisiaMap();
        requestAnimationFrame(() => {
          if (tunisiaMap) {
            tunisiaMap.resize();
            tunisiaMap.start();
          }
        });
      }`
);

// D. Supprimer sellBizBtn handler dans openBizDetailModalUI
html = html.replace(/const sellBizBtn = document\.getElementById\('sellBizBtn'\);[\s\S]*?\}\s*\}\s*\n\s*\/\/ 1\. Staff Slots/, '// 1. Staff Slots');

// E. QuartierAnimator onUpgrade : si biz.level === 0 et solde insuffisant, ouvrir la modale pour voir les détails
html = html.replace(
  /const manque = Math\.max\(0, engine\.getCost\(biz\) - engine\.dinars\);\s*triggerBalanceAlert\(`ناقصك \$\{formatCurrencyPlain\(manque\)\} فلوس باش تطوّر المشروع ! 💰`\);/,
  `const manque = Math.max(0, engine.getCost(biz) - engine.dinars);
              triggerBalanceAlert(\`ناقصك \${formatCurrencyPlain(manque)} فلوس باش تفتح المشروع ! 💰\`);
              if (biz.level === 0) {
                openBizDetailModalUI(biz.id);
              }`
);

fs.writeFileSync('c:/Projects/tounes-tycoon/index.html', html, 'utf8');
console.log('index.html patched.');

// --- 2. PATCH store_animator.js ---
let js = fs.readFileSync('c:/Projects/tounes-tycoon/store_animator.js', 'utf8');

// A. QuartierAnimator locked building : vrai nom, vrai coût, vraie icône, clic sur tout le bâtiment
const lockedTarget = `      ctx.fillStyle = '#f59e0b';
      ctx.font = '900 14px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(biz ? biz.icon : '🚧', x + b.width / 2, y + 54);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '700 11px "Cairo", sans-serif';
      ctx.fillText(biz ? biz.name : 'مشروع جديد', x + b.width / 2, y + 74);

      const btnW = Math.min(b.width - 20, 114);
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
      });`;

const lockedReplacement = `      ctx.fillStyle = '#f59e0b';
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

      // Clic sur tout le bâtiment pour achat ou inspection
      this.interactiveHitboxes.push({
        x: x,
        y: y + 20,
        w: b.width,
        h: bHeight - 20,
        action: 'upgrade',
        bizId: b.id
      });`;

if (js.includes(lockedTarget)) {
  js = js.replace(lockedTarget, lockedReplacement);
  console.log('QuartierAnimator locked building replaced.');
} else {
  console.warn('lockedTarget not matched.');
}

// B. CanvasStoreEngine : Employé DERRIÈRE le comptoir + Caisse enregistreuse dorée soignée + Plaque redondante supprimée + Titre tête supprimé
const cashierTarget = `    // Plaque dorée gravée au nom du commerce
    const bizRef = this.getBiz();
    ctx.fillStyle = '#fef08a';
    ctx.font = '900 8.5px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    const fullPlateName = bizRef ? bizRef.name : '';
    let plateFont = 8.5;
    ctx.font = '900 ' + plateFont + 'px "Cairo", sans-serif';
    let pWidth = ctx.measureText(fullPlateName).width;
    if (pWidth > deskW - 14) {
      plateFont = Math.max(6.5, Math.floor((deskW - 16) / pWidth * plateFont));
      ctx.font = '900 ' + plateFont + 'px "Cairo", sans-serif';
    }
    ctx.fillText(fullPlateName, counterX + deskW / 2, counterY + 38);

    // Icône du projet sur le comptoir
    ctx.font = '20px sans-serif';
    ctx.fillText(counterBiz ? counterBiz.icon : '🏪', counterX + deskW - 16, counterY + 2 + bounce);

    // 2. Responsable du poste (derrière le comptoir)
    const cashierSlot = detail.staffSlots && detail.staffSlots[0];
    const cashierX = counterX + 22;
    const cashierY = counterY - 2;

    if (cashierSlot && cashierSlot.hired) {
      this.drawWorker(ctx, cashierX + 16, counterY + 16, 0, isBusy, timeSec);
      this.drawRoleTag(ctx, cashierX + 16, counterY - 32, cashierSlot.role);

      const statusIcon = isBusy ? '✨' : '💤';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(statusIcon, cashierX + 44, cashierY - 18 + (isBusy ? -Math.abs(Math.sin(timeSec * 6) * 4) : 0));
    } else {
      this.drawHireButton(ctx, counterX + 6, counterY - 44, 66, 52, 'خدّم', 0, 'hire_cashier', cashierSlot ? cashierSlot.cost : null, now);
    }`;

const cashierReplacement = `    // 1. Responsable du poste (physiquement DERRIÈRE le comptoir, dessiné en PREMIER)
    const cashierSlot = detail.staffSlots && detail.staffSlots[0];
    const cashierX = counterX + 22;
    const cashierY = counterY - 2;

    if (cashierSlot && cashierSlot.hired) {
      // Dessin de l'employé calé à l'arrière du comptoir
      this.drawWorker(ctx, cashierX + 16, counterY + 10, 0, isBusy, timeSec);

      // Hitbox pour afficher le rôle au tap
      this.clickZones.push({
        x: cashierX,
        y: counterY - 40,
        width: 36,
        height: 50,
        type: 'employee_info',
        name: cashierSlot.name,
        role: cashierSlot.role
      });

      const statusIcon = isBusy ? '✨' : '💤';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(statusIcon, cashierX + 44, cashierY - 18 + (isBusy ? -Math.abs(Math.sin(timeSec * 6) * 4) : 0));
    } else {
      this.drawHireButton(ctx, counterX + 6, counterY - 44, 66, 52, 'خدّم', 0, 'hire_cashier', cashierSlot ? cashierSlot.cost : null, now);
    }

    // 2. Meuble Comptoir au PREMIER PLAN (cache le bas du corps de l'employé)
    const woodGrad = ctx.createLinearGradient(counterX, counterY + 12, counterX, counterY + 12 + deskH);
    woodGrad.addColorStop(0, '#b45309');
    woodGrad.addColorStop(0.4, '#92400e');
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

    // Caisse enregistreuse moderne tunisienne (Pos / caisse tactile dorée)
    const regX = counterX + deskW - 38;
    const regY = counterY - 4;
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(regX, regY, 32, 20, 3);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Écran LED vert
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(regX + 3, regY + 3, 26, 7);
    ctx.fillStyle = '#34d399';
    ctx.font = '900 6px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('0.00 DT', regX + 27, regY + 8.5);

    // Touches du clavier doré
    ctx.fillStyle = '#f59e0b';
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 4; col++) {
        ctx.fillRect(regX + 4 + col * 6, regY + 12 + row * 3.5, 4.5, 2.5);
      }
    }

    // Tiroir-caisse avec serrure
    ctx.fillStyle = '#d97706';
    ctx.fillRect(counterX + 16, counterY + 28, deskW - 32, 14);
    ctx.strokeStyle = '#fbbf24';
    ctx.strokeRect(counterX + 16, counterY + 28, deskW - 32, 14);
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(counterX + deskW / 2, counterY + 35, 2.5, 0, Math.PI * 2);
    ctx.fill();`;

// Retirer le premier bloc woodGrad du dessus de drawCashierCounter
js = js.replace(
  /    \/\/ 1\. Meuble Comptoir en bois vernis d'olivier et marbre Kadhel[\s\S]*?\/\/ Tiroir-caisse avec clochette en cuivre[\s\S]*?ctx\.fill\(\);/,
  ''
);

if (js.includes(cashierTarget)) {
  js = js.replace(cashierTarget, cashierReplacement);
  console.log('Cashier counter replaced.');
} else {
  console.warn('cashierTarget not matched.');
}

// C. Supprimer drawRoleTag systématique au-dessus des ouvriers dans drawWorkstations et ajouter clickZone
const wsTarget = `      if (slot.hired) {
        this.drawWorker(ctx, stationX + 22, baseY, idx + 1, isBusy, timeSec);
        this.drawRoleTag(ctx, stationX + 22, baseY + 4, slot.role);

        const effIcon = isBusy ? (slot.icon || '⚡') : '💤';`;

const wsReplacement = `      if (slot.hired) {
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

        const effIcon = isBusy ? (slot.icon || '⚡') : '💤';`;

if (js.includes(wsTarget)) {
  js = js.replace(wsTarget, wsReplacement);
  console.log('Workstations drawRoleTag removed.');
} else {
  console.warn('wsTarget not matched.');
}

// D. Gérer le clic sur 'employee_info' dans handleCanvasClick
const clickTarget = `    for (const zone of this.clickZones) {
      if (
        clickX >= zone.x &&
        clickX <= zone.x + zone.width &&
        clickY >= zone.y &&
        clickY <= zone.y + zone.height
      ) {
        if (zone.type === 'hire_cashier' || zone.type === 'hire_worker') {
          if (this.onHireClick) this.onHireClick(this.bizId, zone.slotIndex);
        }
        return;
      }
    }`;

const clickReplacement = `    for (const zone of this.clickZones) {
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
            text: \`👤 \${zone.name} : \${zone.role}\`,
            life: 1.4,
            maxLife: 1.4,
            alpha: 1
          });
        }
        return;
      }
    }`;

if (js.includes(clickTarget)) {
  js = js.replace(clickTarget, clickReplacement);
  console.log('handleCanvasClick employee_info added.');
} else {
  console.warn('clickTarget not matched.');
}

// E. Épicerie (attariya) : étagères diversifiées réalistes sans verres de lait isolés
const attariyaTarget = `    } else if (bizId === 'attariya') {
      // Étagères d'épicerie tunisienne bien garnies (سبيكة حكك، حليب، ياغورت، سكر وزيت)
      ctx.fillStyle = '#78350f';
      ctx.fillRect(100, 44, w - 120, 5);
      ctx.fillRect(100, 78, w - 120, 5);
      ctx.font = '15px serif';
      for (let x = 112; x < w - 30; x += 32) {
        ctx.fillText('🥫', x, 42);
        ctx.fillText('🥛', x, 76);
      }
      // Étagères diversifiées : couscous, harissa, thon, savon, huile
      ctx.font = '15px serif';
      ctx.fillText('🌶️', 84, 48); // Harissa دياري
      ctx.fillText('🥖', 84, 76); // Pain baguette`;

const attariyaReplacement = `    } else if (bizId === 'attariya') {
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
      ctx.fillText('🥚', 76, 76);`;

if (js.includes(attariyaTarget)) {
  js = js.replace(attariyaTarget, attariyaReplacement);
  console.log('Attariya shelves replaced with realistic grocery goods.');
} else {
  console.warn('attariyaTarget not matched.');
}

// F. Villes verrouillées sur la carte de Tunisie : mention élégante ergonomique avec cadenas doré
const lockedPinTarget = `      } else if (isNext && !isUnlocked) {
        const pctText = Math.round(this.getCityUnlockProgress(c) * 100) + '%';
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 8.5px "Cairo", sans-serif';
        ctx.fillText('🔓 ' + pctText, c.x, c.y + pinRadius + 12);
      }`;

const lockedPinReplacement = `      } else if (!isUnlocked) {
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
      }`;

if (js.includes(lockedPinTarget)) {
  js = js.replace(lockedPinTarget, lockedPinReplacement);
  console.log('Locked cities pin mention added.');
} else {
  console.warn('lockedPinTarget not matched.');
}

fs.writeFileSync('c:/Projects/tounes-tycoon/store_animator.js', js, 'utf8');
console.log('store_animator.js patched.');
