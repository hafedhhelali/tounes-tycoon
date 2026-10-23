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







