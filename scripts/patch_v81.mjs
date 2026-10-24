import fs from 'fs';

console.log('=== STARTING PATCH V81 & ZERO PARASITE MEMORY LEAK ===');

// 1. PATCH ENGINE.JS
let engineContent = fs.readFileSync('c:/Projects/tounes-tycoon/engine.js', 'utf8');

// A. TUNISIAN_CITIES: strictly single city names
engineContent = engineContent.replace("name: 'تونس العاصمة'", "name: 'تونس'");
engineContent = engineContent.replace("name: 'نابل / الحمامات'", "name: 'نابل'");
engineContent = engineContent.replace("name: 'سوسة جوهرة الساحل'", "name: 'سوسة'");
engineContent = engineContent.replace("name: 'المنستير / المهدية'", "name: 'المنستير'");
engineContent = engineContent.replace("name: 'القيروان عاصمة الأغالبة'", "name: 'القيروان'");
engineContent = engineContent.replace("name: 'صفاقس عاصمة الجنوب والهمّة'", "name: 'صفاقس'");
engineContent = engineContent.replace("name: 'توزر والجريد'", "name: 'توزر'");
engineContent = engineContent.replace("name: 'قابس بوابة الصحراء والبحر'", "name: 'قابس'");
engineContent = engineContent.replace("name: 'مدنين / جرجيس'", "name: 'مدنين'");
engineContent = engineContent.replace("name: 'جربة / الهولدينغ الوطني'", "name: 'جربة'");

// B. Diversifier les descriptions et produits
engineContent = engineContent.replace(
  "tagline: 'كابوسين قارحة، دخان الكوانين وطرح شكبة للصباح، هوني وين تصنع الصفقات !'",
  "tagline: 'تاي منعنع بالبندق، شيشة تفاح بالمعسل والجمر، وطرح شكبة كارطة للصباح !'"
);
engineContent = engineContent.replace(
  "tagline: 'من حكّة الطماطم لخيط الصوف، السلعة مكدسة والكرني شاهد على ثقة ولاد الحومة.'",
  "tagline: 'كسكسي، هريسة دياري، زيت زيتونة، حكك تن ومعجون، وشكارة السميد حاضرة.'"
);

fs.writeFileSync('c:/Projects/tounes-tycoon/engine.js', engineContent, 'utf8');
console.log('✔ engine.js patched successfully');

// 2. PATCH ENGINE.TEST.JS
let testContent = fs.readFileSync('c:/Projects/tounes-tycoon/engine.test.js', 'utf8');
testContent = testContent.replace("assert.equal(currentCity.name, 'تونس العاصمة');", "assert.equal(currentCity.name, 'تونس');");
fs.writeFileSync('c:/Projects/tounes-tycoon/engine.test.js', testContent, 'utf8');
console.log('✔ engine.test.js patched successfully');

// 3. PATCH STORE_ANIMATOR.JS
let animContent = fs.readFileSync('c:/Projects/tounes-tycoon/store_animator.js', 'utf8');

// A. Supprimer la station service et l'agence bancaire dans buildZoneLayout
animContent = animContent.replace(
  "        { type: 'service_station', name: 'عجيل تونس', width: 130 },\n",
  ""
);
animContent = animContent.replace(
  "        { type: 'bank_branch', name: 'بنك الإسكان والتنمية', width: 135 },\n",
  ""
);

// B. Supprimer la grille nautique de carreaux dans drawSeaBackground
const seaOld = `    // Lignes de bathymétrie & méridiens nautiques discrets
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 40; x < this.width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 40; y < this.height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }`;

const seaNew = `    // Vagues et brise marine animées sans aucun quadrillage ni carreaux
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1.2;
    for (let wave = 0; wave < 6; wave++) {
      const wy = 60 + wave * 90 + Math.sin(t * 0.001 + wave) * 6;
      ctx.beginPath();
      ctx.moveTo(10, wy);
      ctx.bezierCurveTo(this.width * 0.35, wy - 10, this.width * 0.65, wy + 10, this.width - 10, wy);
      ctx.stroke();
    }`;

if (animContent.includes(seaOld)) {
  animContent = animContent.replace(seaOld, seaNew);
  console.log('✔ sea grid removed from store_animator.js');
} else {
  console.log('⚠ seaOld pattern not found, trying regex');
  animContent = animContent.replace(
    /\/\/ Lignes de bathymétrie[\s\S]*?for \(let y = 40; y < this\.height; y \+= 60\) \{[\s\S]*?\}/,
    seaNew
  );
}

// C. Remonter le bouton "افتح خريطة تونس" et supprimer "تحب تسافر ؟"
const oldCrossBtn = `    // 4 & 5. Portique autoroutier 3D avec bouton interactif « تحب تسافر ؟ افتح الخريطة 🗺️ »
    const dirW = Math.min(w - 8, 126);
    const dirH = 32;
    const dirX = x + (w - dirW) / 2;
    const dirY = groundY - 38;

    ctx.save();
    // Halo lumineux pulsé invitant au voyage
    const travelPulse = Math.sin(timestamp * 0.005) * 3 + 4;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = travelPulse;

    // Effet 3D : ombre portée biseautée
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.roundRect(dirX + 2, dirY + 3, dirW, dirH, 8);
    ctx.fill();

    // Dégradé royal autoroutier bleu méditerranée / cyan 3D
    const signGrad = ctx.createLinearGradient(dirX, dirY, dirX, dirY + dirH);
    signGrad.addColorStop(0, '#0284c7');
    signGrad.addColorStop(0.5, '#0369a1');
    signGrad.addColorStop(1, '#075985');
    ctx.fillStyle = signGrad;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(dirX, dirY, dirW, dirH, 8);
    ctx.fill();
    ctx.stroke();

    // Reflet supérieur vitré
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.fillRect(dirX + 3, dirY + 2, dirW - 6, 4);

    // Titre accrocheur et clair : invitation à voyager vers la carte de Tunisie
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 10.5px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🗺️ تحب تسافر ؟', dirX + dirW / 2, dirY + 14);

    ctx.fillStyle = '#fef08a';
    ctx.font = '800 9px "Cairo", sans-serif';
    ctx.fillText('افتح خريطة تونس 🚗', dirX + dirW / 2, dirY + 26);
    ctx.restore();`;

const newCrossBtn = `    // 4 & 5. Panneau autoroutier surélevé : Bouton unique clair "افتح خريطة تونس"
    const dirW = Math.min(w - 6, 134);
    const dirH = 34;
    const dirX = x + (w - dirW) / 2;
    const dirY = groundY - 62; // Remonté bien au-dessus de la route

    ctx.save();
    const travelPulse = Math.sin(timestamp * 0.005) * 4 + 5;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = travelPulse;

    // Ombre 3D
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.roundRect(dirX + 2, dirY + 3, dirW, dirH, 10);
    ctx.fill();

    // Fond cyan / azur vibrant
    const signGrad = ctx.createLinearGradient(dirX, dirY, dirX, dirY + dirH);
    signGrad.addColorStop(0, '#0284c7');
    signGrad.addColorStop(0.5, '#0369a1');
    signGrad.addColorStop(1, '#075985');
    ctx.fillStyle = signGrad;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(dirX, dirY, dirW, dirH, 10);
    ctx.fill();
    ctx.stroke();

    // Reflet vitré supérieur
    ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
    ctx.fillRect(dirX + 4, dirY + 2, dirW - 8, 4);

    // Texte unique centré et lisible
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fef08a';
    ctx.font = '900 12px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('افتح خريطة تونس 🚗', dirX + dirW / 2, dirY + 22);
    ctx.restore();`;

if (animContent.includes(oldCrossBtn)) {
  animContent = animContent.replace(oldCrossBtn, newCrossBtn);
  console.log('✔ crossroad travel button updated');
} else {
  console.log('⚠ oldCrossBtn not exact match, replacing via regex');
  animContent = animContent.replace(
    /\/\/ 4 & 5\. Portique autoroutier[\s\S]*?ctx\.fillText\('افتح خريطة تونس 🚗'[\s\S]*?ctx\.restore\(\);/,
    newCrossBtn
  );
}

// D. Placer le badge "ادخل 🚪" AU DESSUS du linteau de la porte et non sur la porte
const oldEnterBadge = `    const enterBadgeW = 54;
    const enterBadgeH = 18;
    const enterBadgeX = doorX + (doorW - enterBadgeW) / 2;
    const enterBadgeY = doorY + (doorH - enterBadgeH) / 2;`;

const newEnterBadge = `    const enterBadgeW = 58;
    const enterBadgeH = 19;
    const enterBadgeX = doorX + (doorW - enterBadgeW) / 2;
    const enterBadgeY = doorY - enterBadgeH - 5; // Placée strictement AU-DESSUS du linteau de la porte`;

if (animContent.includes(oldEnterBadge)) {
  animContent = animContent.replace(oldEnterBadge, newEnterBadge);
  console.log('✔ enter badge moved above door');
}

// E. Déplacer "كرني الثقة" loin du gérant et enrichir l'épicerie et le café
const oldAttariyaProps = `      // Casier d'œufs et baguettes au mur
      ctx.font = '13px serif';
      ctx.fillText('🥚', 84, 50);
      ctx.fillText('🥖', 84, 76);

      // Tableau des prix / Carnet de crédit traditionnel (الكرني المفتوح)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(44, 34, 48, 48);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(44, 34, 48, 48);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 8.5px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('عطريّة الحومة', 68, 47);
      ctx.fillStyle = '#fde047';
      ctx.font = '8px sans-serif';
      ctx.fillText('كرني الثقة 📖', 68, 60);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('سلعة دياري 🌿', 68, 73);
      ctx.textAlign = 'left';

      // Bocaux d'olives et bouteilles d'huile
      ctx.font = '14px serif';
      ctx.fillText('🫒', w - 38, 44);
      ctx.fillText('🧀', w - 38, 64);
      ctx.fillText('🧂', w - 38, 84);`;

const newAttariyaProps = `      // Étagères diversifiées : couscous, harissa, thon, savon, huile
      ctx.font = '15px serif';
      ctx.fillText('🌶️', 84, 48); // Harissa دياري
      ctx.fillText('🥖', 84, 76); // Pain baguette

      // Tableau des prix & Carnet de crédit sur le mur droit (jamais masqué par moula el hanout)
      const slateX = w - 82;
      const slateY = 24;
      ctx.fillStyle = '#091512';
      ctx.fillRect(slateX, slateY, 68, 52);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(slateX, slateY, 68, 52);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 8.5px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('عطريّة الحومة', slateX + 34, slateY + 14);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 8.5px "Cairo", sans-serif';
      ctx.fillText('كرني الثقة 📖', slateX + 34, slateY + 28);
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px "Cairo", sans-serif';
      ctx.fillText('سلعة دياري 🌿', slateX + 34, slateY + 42);
      ctx.textAlign = 'left';

      // Bocaux et produits variés
      ctx.font = '15px serif';
      ctx.fillText('🫒', slateX - 22, 38);
      ctx.fillText('🧀', slateX - 22, 60);
      ctx.fillText('🥫', slateX - 22, 82);`;

if (animContent.includes(oldAttariyaProps)) {
  animContent = animContent.replace(oldAttariyaProps, newAttariyaProps);
  console.log('✔ attariya props & slate moved to the right');
}

// F. Enrichir le café (9ahwa) avec chicha animée, thé et cartes chkobba
const oldKahwaProps = `      ctx.fillStyle = '#1c1917';
      ctx.fillRect(w - 74, 38, 52, 38);
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(w - 74, 38, 52, 38);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 8px "Cairo", sans-serif';
      ctx.fillText('طرح شكبة', w - 66, 52);
      ctx.font = '11px sans-serif';
      ctx.fillText('♠️♥️', w - 60, 68);`;

const newKahwaProps = `      // Table de Chkobba & Chicha traditionnelle
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
      ctx.textAlign = 'left';`;

if (animContent.includes(oldKahwaProps)) {
  animContent = animContent.replace(oldKahwaProps, newKahwaProps);
  console.log('✔ kahwa props enriched with chicha, tea and chkobba');
}

// G. Réduire les icônes d'offres HUD dans le ciel à 2 boutons essentiels et agrandir le bouton carte
const oldHudRightIcons = `    // 1. Petites icônes d'offres 3D en haut à droite DANS le ciel de l'image
    const rightIcons = [
      {
        action: 'hud_map',
        icon: '🗺️',
        sub: 'خريطة',
        bg: '#047857',
        border: '#34d399',
        badgeBg: '#10b981'
      },
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
    ];`;

const newHudRightIcons = `    // 1. HUD du ciel épuré : 2 boutons essentiels (Carte Tunisie agrandie + Boost x2)
    const rightIcons = [
      {
        action: 'hud_map',
        icon: '🗺️',
        sub: 'تونس',
        bg: '#047857',
        border: '#34d399',
        badgeBg: '#10b981'
      },
      {
        action: 'hud_boost',
        icon: '🚀',
        sub: o.adBoostActive ? 'x2' : '',
        bg: o.adBoostActive ? '#059669' : '#0284c7',
        border: o.adBoostActive ? '#6ee7b7' : '#7dd3fc',
        badgeBg: '#10b981'
      }
    ];`;

if (animContent.includes(oldHudRightIcons)) {
  animContent = animContent.replace(oldHudRightIcons, newHudRightIcons);
  console.log('✔ hud offers cleaned and reduced to 2 essential buttons');
}

fs.writeFileSync('c:/Projects/tounes-tycoon/store_animator.js', animContent, 'utf8');
console.log('✔ store_animator.js written');

// 4. PATCH INDEX.HTML
let indexContent = fs.readFileSync('c:/Projects/tounes-tycoon/index.html', 'utf8');

// A. Remplacer les textes de غلة خدمتك وانت غاطس / اقبض الصابة par مداخيل فترة الغياب
indexContent = indexContent.replace(
  "showRewardModalUI('☕', 'على سلامتكم ! يا مرحبا بيك نوّرت', 'هذي غلّة خدمتك وإنت غاطس :', `+${formatCurrency(offlineGain)}`);",
  "showRewardModalUI('☕', 'على سلامتكم ! يا مرحبا بيك نوّرت', 'مداخيل فترة الغياب مسجّلة في كاستك :', `+${formatCurrency(offlineGain)}`);"
);
indexContent = indexContent.replace(
  '<button class="modal-btn" id="modalCloseBtn" style="padding: 8px;">اقبض الصّابة 💰</button>',
  '<button class="modal-btn" id="modalCloseBtn" style="padding: 8px;">اقبض مداخيلك 💰</button>'
);

// B. Styliser le solde (balance-hero) pour être grand, lisible, fond net et contraste élevé
const oldBalanceCss = `    /* SOLDE COMPACT HUD */
    .balance-hero {
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.35);
      border-radius: 10px;
      padding: 2px 8px;
    }
    .balance-label {
      font-size: 10px;
      font-weight: 800;
      color: var(--text-muted);
    }
    .balance-val {
      font-size: 15px;
      font-weight: 900;
      color: var(--gold);
      text-shadow: 0 0 12px rgba(251, 191, 36, 0.6);
      letter-spacing: -0.3px;
      transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
    }`;

const newBalanceCss = `    /* SOLDE HUD PRO - GRAND CONTRASTE & LISIBILITÉ PARFAITE */
    .balance-hero {
      display: flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 100%);
      border: 1.5px solid #f59e0b;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(254, 240, 138, 0.2);
      border-radius: 12px;
      padding: 4px 12px;
      min-width: 140px;
      justify-content: center;
    }
    .balance-label {
      font-size: 11px;
      font-weight: 900;
      color: #94a3b8;
    }
    .balance-val {
      font-size: 16.5px;
      font-weight: 900;
      color: #fbbf24;
      text-shadow: 0 0 14px rgba(251, 191, 36, 0.65);
      letter-spacing: -0.3px;
      direction: ltr;
      display: inline-block;
      transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
    }`;

if (indexContent.includes(oldBalanceCss)) {
  indexContent = indexContent.replace(oldBalanceCss, newBalanceCss);
  console.log('✔ balance-hero CSS upgraded');
}

// C. ZERO PARASITE MEMORY LEAK & CLEAN BACKGROUND PAUSE
// Cacher la liste de carreaux sous la carte pour contemplation pure de la Tunisie
indexContent = indexContent.replace(
  '<div id="zonesListContainer" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 8px; margin-top: 10px;"></div>',
  '<div id="zonesListContainer" style="display: none !important;"></div>'
);

// Arrêter proprement les boucles et timers quand l'app passe en background ou se ferme
const oldVisibility = `    // Coupure immédiate du son lors de la mise en veille ou sortie de l'application
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        soundEngine.stopBGM();
        if (soundEngine.ctx && soundEngine.ctx.state === 'running') {
          soundEngine.ctx.suspend();
        }
      } else if (!soundEngine.muted) {
        soundEngine.init();
        soundEngine.startBGM();
      }
    });

    window.addEventListener('pagehide', () => {
      soundEngine.stopBGM();
    });

    if (confirmExitAppBtn) {
      confirmExitAppBtn.onclick = () => {
        // Sauvegarde avant de quitter
        localStorage.setItem('tounes_tycoon_save', JSON.stringify(engine.exportState()));
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
          window.Capacitor.Plugins.App.exitApp();
        } else {
          // Mode PWA / Web : fermer la fenêtre ou recharger au calme
          try { window.close(); } catch(e) {}
          if (exitAppModal) exitAppModal.classList.remove('active');
        }
      };
    }`;

const newVisibility = `    // GESTION DU CYCLE DE VIE ZÉRO-PARASITE : SAUVEGARDE & SUSPENSION TOTALE
    let isAppPaused = false;
    let mainTickRafId = null;

    function pauseAllEngines() {
      if (isAppPaused) return;
      isAppPaused = true;

      // 1. Sauvegarde immédiate sans perte de données
      try {
        localStorage.setItem('tounes_tycoon_save', JSON.stringify(engine.exportState()));
      } catch (e) {
        console.error('Save error on pause', e);
      }

      // 2. Arrêt de tous les moteurs audio
      soundEngine.stopBGM();
      if (soundEngine.ctx && soundEngine.ctx.state === 'running') {
        soundEngine.ctx.suspend().catch(() => {});
      }

      // 3. Arrêt complet des animations Canvas (Quartier, Store, Carte)
      if (quartierEngine && typeof quartierEngine.stop === 'function') {
        quartierEngine.stop();
      }
      if (storeSimulation && typeof storeSimulation.stop === 'function') {
        storeSimulation.stop();
      }
      if (tunisiaMap && typeof tunisiaMap.stop === 'function') {
        tunisiaMap.stop();
      }

      // 4. Arrêt de la boucle tick principale pour consommation CPU = 0%
      if (mainTickRafId) {
        cancelAnimationFrame(mainTickRafId);
        mainTickRafId = null;
      }
    }

    function resumeAllEngines() {
      if (!isAppPaused) return;
      isAppPaused = false;

      // 1. Reprise audio si activé
      if (!soundEngine.muted) {
        soundEngine.init();
        soundEngine.startBGM();
      }

      // 2. Relance des Canvas actifs
      if (activeTab === 'businesses' && quartierEngine && typeof quartierEngine.start === 'function') {
        quartierEngine.start();
      }
      if (activeTab === 'zones' && tunisiaMap && typeof tunisiaMap.start === 'function') {
        tunisiaMap.start();
      }

      // 3. Relance de la boucle tick principale
      lastTickTime = performance.now();
      if (!mainTickRafId) {
        mainTickRafId = requestAnimationFrame(tick);
      }
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pauseAllEngines();
      } else {
        resumeAllEngines();
      }
    });

    window.addEventListener('pagehide', () => {
      pauseAllEngines();
    });

    window.addEventListener('beforeunload', () => {
      pauseAllEngines();
    });

    // Écoute du cycle de vie Capacitor natif pour mobile Android
    if (window.Capacitor?.Plugins?.App) {
      window.Capacitor.Plugins.App.addListener('appStateChange', (state) => {
        if (!state.isActive) {
          pauseAllEngines();
        } else {
          resumeAllEngines();
        }
      });
    }

    if (confirmExitAppBtn) {
      confirmExitAppBtn.onclick = () => {
        // Sauvegarde impérative avant sortie
        pauseAllEngines();
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
          window.Capacitor.Plugins.App.exitApp();
        } else {
          try { window.close(); } catch(e) {}
          if (exitAppModal) exitAppModal.classList.remove('active');
        }
      };
    }`;

if (indexContent.includes(oldVisibility)) {
  indexContent = indexContent.replace(oldVisibility, newVisibility);
  console.log('✔ zero-parasite memory leak lifecycle handlers installed in index.html');
}

// D. Raccorder mainTickRafId dans la fonction tick
indexContent = indexContent.replace(
  `    function tick() {
      try {
        tickStep();
      } catch (err) {
        console.error('tick error', err);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);`,
  `    function tick() {
      if (isAppPaused) return;
      try {
        tickStep();
      } catch (err) {
        console.error('tick error', err);
      }
      mainTickRafId = requestAnimationFrame(tick);
    }
    mainTickRafId = requestAnimationFrame(tick);`
);

fs.writeFileSync('c:/Projects/tounes-tycoon/index.html', indexContent, 'utf8');
console.log('✔ index.html updated successfully');

console.log('=== ALL PATCHES APPLIED ===');
