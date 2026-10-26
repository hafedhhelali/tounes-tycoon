import test from 'node:test';
import assert from 'node:assert/strict';
import { TycoonEngine } from './engine.js';

test('Initial state & first business purchase', () => {
  const engine = new TycoonEngine();
  assert.equal(engine.dinars, 5.0);

  const bought = engine.buyBusiness('kaskrout');
  assert.equal(bought, true);
  assert.equal(engine.dinars, 0.0); // 5.0 - 5.0 = 0.0
  assert.equal(engine.businesses[0].level, 1);
});

test('Manual production tap completes cycle and adds dinars', () => {
  const t0 = 1000000;
  const engine = new TycoonEngine();
  engine.lastTimestamp = t0;
  engine.buyBusiness('kaskrout');

  engine.startProduction('kaskrout');
  assert.equal(engine.businesses[0].isProducing, true);

  // Avance de 300ms (cycle = 600ms, non terminé)
  engine.update(t0 + 300);
  assert.equal(engine.dinars, 0.0);
  assert.equal(engine.businesses[0].isProducing, true);

  // Avance de 350ms (total 650ms >= 600ms, terminé)
  engine.update(t0 + 650);
  assert.equal(engine.dinars, 0.8); // +0.8 DT
  assert.equal(engine.businesses[0].isProducing, false);
});

test('Manager automation and offline progress calculation without timer drift', () => {
  const t0 = 1000000;
  const engine = new TycoonEngine();
  engine.lastTimestamp = t0;
  engine.buyBusiness('kaskrout');
  
  // Embauche du gérant 3am Sadok (25 TND)
  engine.dinars = 35.0;
  const hired = engine.hireManager('kaskrout');
  assert.ok(hired);
  assert.equal(engine.dinars, 10.0);
  assert.equal(engine.businesses[0].hasManager, true);

  // Simulation coupure de 60s (60000ms / 600ms = 100 cycles x 0.8 DT = 80 DT)
  const offlineRevenue = engine.processOfflineProgress(t0 + 60000);
  assert.equal(offlineRevenue, 80.0);
  assert.equal(engine.dinars, 90.0);
});

test('Random events apply business multipliers and expire cleanly', () => {
  const t0 = 1000000;
  const engine = new TycoonEngine();
  engine.lastTimestamp = t0;
  engine.dinars = 150.0;
  engine.buyBusiness('kahwa'); // baseRevenue = 14 DT

  // Sans événement
  const kahwaBiz = engine.businesses.find(b => b.id === 'kahwa');
  assert.equal(engine.getRevenue(kahwaBiz), 14.0);

  // Déclenchement de l'événement Canicule (multiplicateur x2 sur kahwa)
  engine.activeEvent = {
    event: {
      id: 'chheli',
      title: 'Canicule 48°C',
      durationMs: 30000,
      multipliers: { kahwa: 2.0 }
    },
    endsAt: t0 + 30000
  };

  assert.equal(engine.getRevenue(kahwaBiz), 28.0);

  // Après expiration (t0 + 35000ms), l'événement s'annule et le multiplicateur retombe à 1
  engine.update(t0 + 35000);
  assert.equal(engine.activeEvent, null);
  assert.equal(engine.getRevenue(kahwaBiz), 14.0);
});

test('Ad rewarded boost doubles production revenue', () => {
  const t0 = 1000000;
  const engine = new TycoonEngine();
  engine.lastTimestamp = t0;
  engine.dinars = 150.0;
  engine.buyBusiness('kahwa'); // baseRevenue = 14 DT

  const kahwaBiz = engine.businesses.find(b => b.id === 'kahwa');

  // Sans boost pub
  assert.equal(engine.isAdBoostActive(t0), false);
  assert.equal(engine.getRevenue(kahwaBiz, t0), 14.0);

  // Activation d'un boost de 4h (14 400 000 ms) via AdMob Rewarded
  engine.addAdBoost(4 * 3600 * 1000, t0);
  assert.equal(engine.isAdBoostActive(t0 + 1000), true);
  assert.equal(engine.getRevenue(kahwaBiz, t0 + 1000), 28.0); // 14 * 2 = 28 DT

  // Expiration du boost après 4h + 1s
  const tExpired = t0 + (4 * 3600 * 1000) + 1000;
  assert.equal(engine.isAdBoostActive(tExpired), false);
  assert.equal(engine.getRevenue(kahwaBiz, tExpired), 14.0);
});

test('Ad rewarded cash grants instant dinars', () => {
  const engine = new TycoonEngine();
  engine.dinars = 20.0;
  engine.buyBusiness('kaskrout'); // coût = 5.0 DT, reste 15.0 DT

  const reward = engine.claimAdCashReward();
  assert.ok(reward >= 5.0);
  assert.equal(engine.dinars, 15.0 + reward);
});

test('Quests can be achieved and claimed with title upgrades', () => {
  const engine = new TycoonEngine();
  assert.equal(engine.playerTitle, 'مواطن يلوّج على مشروع');

  // Pas de quête validée au début
  assert.equal(engine.checkQuests().length, 0);

  // Achat du premier kiosque -> déclenche la quête first_kiosk
  engine.buyBusiness('kaskrout');
  const claimable = engine.checkQuests();
  assert.equal(claimable.length, 1);
  assert.equal(claimable[0].id, 'first_kiosk');

  // Réclamation de la quête
  const claimed = engine.claimQuest('first_kiosk');
  assert.ok(claimed);
  assert.equal(engine.dinars, 5.0); // 0 + 5 DT
  assert.equal(engine.playerTitle, 'تاجر مبتدئ');
  assert.equal(engine.checkQuests().length, 0);
});

test('Tunisian business combos trigger synergies and multiply revenue', () => {
  const engine = new TycoonEngine();
  engine.dinars = 1000.0;

  // Achat du kiosque كسكروت عياري seul
  engine.buyBusiness('kaskrout');
  const kaskroutBiz = engine.businesses.find(b => b.id === 'kaskrout');
  assert.equal(engine.getActiveCombos().length, 0);
  assert.equal(engine.getRevenue(kaskroutBiz), 0.8);

  // Achat du فريكاسي -> Débloque le combo 'سلسلة الماكلة التونسية' (x2)
  engine.buyBusiness('fricasse');
  const combos = engine.getActiveCombos();
  assert.equal(combos.length, 1);
  assert.equal(combos[0].id, 'combo_street_food');
  assert.equal(engine.isComboActive('combo_street_food'), true);

  // Le revenu de kaskrout est multiplié par 2
  assert.equal(engine.getRevenue(kaskroutBiz), 1.6);
});

test('Floating lucky drop awards instant cash and turbo speed boost', () => {
  const t0 = 1000000;
  const engine = new TycoonEngine();
  engine.lastTimestamp = t0;
  engine.dinars = 100.0;
  engine.buyBusiness('kaskrout');

  // Lucky drop cash (formule révisée : min 2.0 DT ou 15s de production)
  const initialDinars = engine.dinars;
  const cashDrop = engine.claimLuckyDrop('cash', t0);
  assert.equal(cashDrop.type, 'cash');
  assert.ok(cashDrop.amount >= 2.0);
  assert.equal(engine.dinars, initialDinars + cashDrop.amount);

  // Lucky drop speed boost (30s)
  const speedDrop = engine.claimLuckyDrop('speed', t0);
  assert.equal(speedDrop.type, 'speed');
  assert.equal(engine.isSpeedBoostActive(t0 + 5000), true);
  assert.equal(engine.isSpeedBoostActive(t0 + 35000), false);
});

test('Prestige ascension resets businesses and awards permanent multiplier', () => {
  const engine = new TycoonEngine();
  engine.dinars = 150000.0;
  engine.totalDinarsEarned = 150000.0;
  engine.buyBusiness('kaskrout');
  engine.buyBusiness('fricasse');
  assert.equal(engine.canPrestige(), true);

  const pendingPoints = engine.calculatePendingPrestigePoints();
  assert.ok(pendingPoints >= 3);

  const prestigeResult = engine.executePrestige();
  assert.ok(prestigeResult);
  assert.equal(engine.prestigeLevel, 1);
  assert.ok(engine.prestigePoints >= 3);
  assert.ok(engine.getPrestigeMultiplier() > 1.0);
  // Reset des commerces à 0
  assert.equal(engine.businesses[0].level, 0);
  assert.equal(engine.dinars, 5.0);
  assert.equal(engine.playerTitle, 'ولد حومة مستثمر');
});

test('Profile stats, empire name customization, serialization and hard reset', () => {
  const engine = new TycoonEngine();

  // 1. Valeurs par défaut du profil
  assert.equal(engine.empireName, 'إمبراطورية تونس للخدمات');
  let stats = engine.getProfileStats();
  assert.equal(stats.empireName, 'إمبراطورية تونس للخدمات');
  assert.equal(stats.playerTitle, 'مواطن يلوّج على مشروع');
  assert.equal(stats.empireLevel, 1);
  assert.equal(stats.overallProgressPct, 0);
  assert.equal(stats.unlockedBusinessesCount, 0);
  assert.equal(stats.totalManagersHired, 0);
  assert.equal(stats.prestigeCount, 0);
  assert.equal(stats.prestigePoints, 0);
  assert.equal(stats.lifetimeDinars, 5.0);
  assert.equal(stats.currentDinars, 5.0);
  assert.ok(stats.totalPlayTimeSeconds >= 0);

  // 2. Personnalisation du nom d'empire
  assert.equal(engine.setEmpireName(''), false); // Vide rejeté
  assert.equal(engine.setEmpireName('   '), false); // Espaces seuls rejetés
  assert.equal(engine.setEmpireName('a'.repeat(33)), false); // > 32 caractères rejeté
  assert.equal(engine.setEmpireName(123), false); // Non-string rejeté

  assert.equal(engine.setEmpireName('  مجمع قرطاج الاستثماري  '), true);
  assert.equal(engine.empireName, 'مجمع قرطاج الاستثماري');

  // 3. Évolution des métriques
  engine.dinars = 1000.0;
  engine.buyBusiness('kaskrout');
  engine.hireManager('kaskrout');
  engine.buyBusiness('fricasse');

  stats = engine.getProfileStats();
  assert.equal(stats.empireName, 'مجمع قرطاج الاستثماري');
  assert.equal(stats.unlockedBusinessesCount, 2);
  assert.equal(stats.totalManagersHired, 1);
  assert.ok(stats.empireLevel > 1);
  assert.ok(stats.overallProgressPct > 0);

  // 4. Export / Import d'état
  const savedState = engine.exportState();
  assert.equal(savedState.empireName, 'مجمع قرطاج الاستثماري');

  const newEngine = new TycoonEngine(savedState);
  assert.equal(newEngine.empireName, 'مجمع قرطاج الاستثماري');
  assert.equal(newEngine.businesses[0].level, 1);
  assert.equal(newEngine.businesses[0].hasManager, true);

  // 5. Hard Reset
  engine.resetGame();
  assert.equal(engine.empireName, 'إمبراطورية تونس للخدمات');
  assert.equal(engine.dinars, 5.0);
  assert.equal(engine.businesses[0].level, 0);
  assert.equal(engine.businesses[0].hasManager, false);
  assert.equal(engine.prestigePoints, 0);
  assert.equal(engine.prestigeLevel, 0);

  const resetStats = engine.getProfileStats();
  assert.equal(resetStats.unlockedBusinessesCount, 0);
  assert.equal(resetStats.totalManagersHired, 0);
  assert.equal(resetStats.empireLevel, 1);
  assert.equal(resetStats.overallProgressPct, 0);
});

test('getBusinessDetail returns complete inner breakdown for immersive view', () => {
  const engine = new TycoonEngine();
  engine.dinars = 100.0;
  engine.buyBusiness('kaskrout');

  const detail = engine.getBusinessDetail('kaskrout');
  assert.ok(detail);
  assert.equal(detail.id, 'kaskrout');
  assert.equal(detail.name, 'نصبة كسكروت عياري');
  assert.equal(detail.icon, '🥖');
  assert.equal(detail.level, 1);
  assert.equal(detail.cycleDurationMs, 600);
  assert.ok(detail.revenuePerCycle > 0);
  assert.ok(detail.dinarsPerSecond > 0);

  // Recette décomposée
  assert.ok(Array.isArray(detail.recipeBreakdown));
  assert.ok(detail.recipeBreakdown.length >= 3);
  const totalShare = detail.recipeBreakdown.reduce((sum, r) => sum + r.sharePct, 0);
  assert.equal(totalShare, 100);

  // Postes employés
  assert.ok(Array.isArray(detail.staffSlots));
  assert.ok(detail.staffSlots.length >= 1);
  assert.equal(detail.staffSlots[0].hired, false);

  // Simulation d'activité
  assert.ok(detail.customersPerMinute > 0);
  assert.ok(detail.satisfactionPct >= 70 && detail.satisfactionPct <= 100);
  assert.ok(['متوسط', 'قوي', 'شاعل'].includes(detail.crowdLevel));
});

test('Tunisian 14 cities progression: listing, retrieval and initial state', () => {
  const engine = new TycoonEngine();
  const cities = engine.getCities();
  assert.equal(cities.length, 18);

  // Ville de départ : Tunis
  assert.equal(engine.currentCityId, 'tunis');
  assert.equal(engine.currentZoneId, 'tunis');
  assert.deepEqual(engine.unlockedCityIds, ['tunis']);

  const currentCity = engine.getCurrentCity();
  assert.equal(currentCity.id, 'tunis');
  assert.equal(currentCity.name, 'تونس');

  // getCityById
  const bizerte = engine.getCityById('bizerte');
  assert.ok(bizerte);
  assert.equal(bizerte.name, 'بنزرت');
  assert.equal(bizerte.costDinars, 2500);

  const nonExistent = engine.getCityById('mars');
  assert.equal(nonExistent, null);
});

test('City unlock criteria: Bizerte (2,500 DT + 1 biz L10)', () => {
  const engine = new TycoonEngine();

  // Critère non rempli au départ
  assert.equal(engine.checkCityUnlockCriteria('bizerte'), false);
  assert.equal(engine.unlockCity('bizerte'), false);

  // Assez d'argent mais pas de biz L10
  engine.dinars = 3000;
  assert.equal(engine.checkCityUnlockCriteria('bizerte'), false);
  assert.equal(engine.unlockCity('bizerte'), false);

  // Niveau 10 atteint sur un commerce
  engine.businesses[0].level = 10;
  assert.equal(engine.checkCityUnlockCriteria('bizerte'), true);

  // Déblocage réussi : prélèvement de 2,500 DT et passage à Bizerte
  const unlocked = engine.unlockCity('bizerte');
  assert.equal(unlocked, true);
  assert.equal(engine.dinars, 500); // 3000 - 2500 = 500
  assert.equal(engine.currentCityId, 'bizerte');
  assert.equal(engine.currentZoneId, 'bizerte');
  assert.ok(engine.unlockedCityIds.includes('bizerte'));

  // Re-voyage sans prélèvement
  const reenter = engine.unlockCity('bizerte');
  assert.equal(reenter, true);
  assert.equal(engine.dinars, 500);
});

test('City unlock criteria: Nabeul/Hammamet (8,000 DT + 1 manager)', () => {
  const engine = new TycoonEngine();
  engine.dinars = 10000;
  assert.equal(engine.unlockCity('nabeul_hammamet'), false);

  // Embauche d'un manager
  engine.businesses[0].hasManager = true;
  engine.businesses[0].hiredManagersCount = 1;
  assert.equal(engine.checkCityUnlockCriteria('nabeul_hammamet'), true);

  assert.equal(engine.unlockCity('nabeul_hammamet'), true);
  assert.equal(engine.dinars, 2000); // 10000 - 8000 = 2000
  assert.equal(engine.currentCityId, 'nabeul_hammamet');
});

test('City unlock criteria: Béja (22,000 DT + 2 biz L20)', () => {
  const engine = new TycoonEngine();
  engine.dinars = 30000;
  engine.businesses[0].level = 20;
  assert.equal(engine.unlockCity('beja'), false); // seulement 1 biz L20

  engine.businesses[1].level = 20;
  assert.equal(engine.checkCityUnlockCriteria('beja'), true);
  assert.equal(engine.unlockCity('beja'), true);
  assert.equal(engine.dinars, 8000); // 30000 - 22000 = 8000
  assert.equal(engine.currentCityId, 'beja');
});

test('City unlock criteria: Le Kef (60,000 DT + 50k total dinars)', () => {
  const engine = new TycoonEngine();
  engine.dinars = 70000;
  engine.lifetimeDinarsEarned = 10000;
  engine.totalDinarsEarned = 10000;
  assert.equal(engine.unlockCity('le_kef'), false);

  engine.lifetimeDinarsEarned = 60000;
  assert.equal(engine.checkCityUnlockCriteria('le_kef'), true);
  assert.equal(engine.unlockCity('le_kef'), true);
  assert.equal(engine.dinars, 10000);
  assert.equal(engine.currentCityId, 'le_kef');
});

test('City unlock criteria: Sousse (150,000 DT + Prestige 1)', () => {
  const engine = new TycoonEngine();
  engine.dinars = 200000;
  assert.equal(engine.unlockCity('sousse'), false);

  engine.prestigeLevel = 1;
  assert.equal(engine.checkCityUnlockCriteria('sousse'), true);
  assert.equal(engine.unlockCity('sousse'), true);
  assert.equal(engine.dinars, 50000);
  assert.equal(engine.currentCityId, 'sousse');
});

test('City unlock criteria: Monastir/Mahdia, Kairouan, Sfax, Gafsa, Tozeur, Gabes, Médenine', () => {
  const engine = new TycoonEngine();

  // Monastir (350k + 5 managers)
  engine.dinars = 400000;
  for (let i = 0; i < Math.min(5, engine.businesses.length); i++) {
    engine.businesses[i].hasManager = true;
    engine.businesses[i].hiredManagersCount = 1;
  }
  // S'il y a d'autres villes débloquées ou commerces
  const allBiz = Object.values(engine.cityBusinesses).flat();
  let assigned = 0;
  for (const b of allBiz) {
    b.hasManager = true;
    b.hiredManagersCount = 1;
    assigned++;
    if (assigned >= 5) break;
  }
  assert.equal(engine.unlockCity('monastir_mahdia'), true);

  // Kairouan (800k + 4 biz L35)
  engine.dinars = 900000;
  for (let i = 0; i < 4; i++) {
    engine.businesses[i].level = 35;
  }
  assert.equal(engine.unlockCity('kairouan'), true);

  // Sfax (2,000,000 DT + Prestige 2)
  engine.dinars = 2500000;
  engine.prestigeLevel = 2;
  assert.equal(engine.unlockCity('sfax'), true);

  // Gafsa (4,500,000 DT)
  engine.dinars = 5000000;
  assert.equal(engine.unlockCity('gafsa'), true);

  // Tozeur (10,000,000 DT + 1 biz L100)
  engine.dinars = 11000000;
  engine.businesses[0].level = 100;
  assert.equal(engine.unlockCity('tozeur'), true);

  // Gabès (25,000,000 DT + 10 managers)
  engine.dinars = 26000000;
  const currentEmpireBiz = Object.values(engine.cityBusinesses).flat();
  for (let i = 0; i < Math.min(10, currentEmpireBiz.length); i++) {
    currentEmpireBiz[i].hasManager = true;
    currentEmpireBiz[i].hiredManagersCount = 1;
  }
  assert.equal(engine.unlockCity('gabes'), true);

  // Médenine (60,000,000 DT + Prestige 3)
  engine.dinars = 70000000;
  engine.prestigeLevel = 3;
  assert.equal(engine.unlockCity('medenine_zarzis'), true);
});

test('Djerba / Holding National: Legend title requirement + Holding Status x5 multiplier', () => {
  const engine = new TycoonEngine();
  engine.dinars = 200000000;
  engine.prestigeLevel = 5;
  assert.equal(engine.unlockCity('djerba_holding'), false);

  // Atteinte du titre Légende (Prestige 10)
  engine.prestigeLevel = 10;
  engine.updatePlayerPrestigeTitle();
  assert.equal(engine.playerTitle, 'إمبراطور تونس الكبير');
  assert.equal(engine.checkCityUnlockCriteria('djerba_holding'), true);

  const unlocked = engine.unlockCity('djerba_holding');
  assert.equal(unlocked, true);
  assert.equal(engine.dinars, 50000000); // 200M - 150M = 50M
  assert.equal(engine.currentCityId, 'djerba_holding');

  // Holding Status multiplier x5 sur tous les commerces
  engine.businesses[0].level = 1; // kaskrout baseRevenue = 0.8
  const baseRevenue = engine.businesses[0].baseRevenue;
  const holdingMultiplier = engine.getZoneMultiplier(engine.businesses[0].id);
  assert.equal(holdingMultiplier, 5.0);
  assert.ok(engine.getRevenue(engine.businesses[0]) >= baseRevenue * 5.0);
});

test('Backward compatibility with legacy zones and saves', () => {
  // 1. Map legacy zone IDs
  const engine = new TycoonEngine();
  assert.equal(engine.unlockZone('bab_souika'), true);
  assert.equal(engine.currentCityId, 'tunis');
  assert.equal(engine.currentZoneId, 'tunis');

  // 2. Load legacy save state containing currentZoneId: 'bab_souika'
  const legacyState = {
    dinars: 1000,
    currentZoneId: 'bab_souika',
    businesses: [{ id: 'kaskrout', level: 5 }]
  };
  const restoredEngine = new TycoonEngine(legacyState);
  assert.equal(restoredEngine.currentZoneId, 'tunis');
  assert.equal(restoredEngine.currentCityId, 'tunis');
  assert.deepEqual(restoredEngine.unlockedCityIds, ['tunis']);
  assert.equal(restoredEngine.businesses[0].level, 5);

  // 3. Export includes both currentZoneId and currentCityId
  const exported = restoredEngine.exportState();
  assert.equal(exported.currentZoneId, 'tunis');
  assert.equal(exported.currentCityId, 'tunis');
  assert.ok(Array.isArray(exported.unlockedCityIds));
});

test('Expenses & charges system calculates realistic corporate deductions', () => {
  const engine = new TycoonEngine();
  engine.dinars = 500.0;
  engine.buyBusiness('kaskrout'); // level 1
  engine.buyBusiness('fricasse'); // level 1

  // 1. Calcul de la décomposition des charges
  const breakdown = engine.calculateExpensesBreakdown(100.0);
  assert.equal(breakdown.salaries, 4.0); // 4%
  assert.equal(breakdown.maintenance, 3.0); // 3%
  assert.equal(breakdown.utilities, 2.5); // 2.5%
  assert.equal(breakdown.taxes, 2.5); // 2.5%
  assert.equal(breakdown.total, 12.0); // 12% au total
  assert.equal(breakdown.effectiveRatePct, 12);

  // 2. Résumé pour affichage dans le panneau financier
  const summary = engine.getCurrentExpensesSummary();
  assert.ok(summary.grossMinute > 0);
  assert.ok(summary.totalCycle > 0);
  assert.equal(summary.effectiveRatePct, 12);

  // 3. Déduction périodique (60s)
  const initialDinars = engine.dinars;
  const t0 = 1000000;
  engine.lastExpensesDeductionAt = t0;
  engine.lastTimestamp = t0;

  // À t0 + 65s, un cycle périodique de dépenses se déclenche
  engine.update(t0 + 65000);
  assert.ok(engine.totalExpensesPaid > 0);
  assert.ok(engine.lastExpensesBreakdown.total > 0);
  assert.ok(engine.dinars > 0); // Le joueur n'est jamais bloqué à 0
});

test('Bank account: deposits, withdrawals and double balance management (souyoula / rassid fel banka)', () => {
  const engine = new TycoonEngine();
  engine.dinars = 1000;
  assert.equal(engine.bankBalance, 0);

  // Dépôt de 400 DT
  const dep = engine.depositToBank(400);
  assert.equal(dep.success, true);
  assert.equal(engine.dinars, 600);
  assert.equal(engine.bankBalance, 400);
  assert.equal(engine.getTotalFortune(), 1000);

  // Retrait de 150 DT
  const withdr = engine.withdrawFromBank(150);
  assert.equal(withdr.success, true);
  assert.equal(engine.dinars, 750);
  assert.equal(engine.bankBalance, 250);
  assert.equal(engine.getTotalFortune(), 1000);

  // Dépôt invalide (montant > solde disponible)
  assert.equal(engine.depositToBank(9999), false);
  // Retrait invalide (montant > solde en banque)
  assert.equal(engine.withdrawFromBank(9999), false);
});








