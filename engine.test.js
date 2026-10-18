import test from 'node:test';
import assert from 'node:assert/strict';
import { TycoonEngine } from './engine.js';

test('Initial state & first business purchase', () => {
  const engine = new TycoonEngine();
  assert.equal(engine.dinars, 10.0);

  const bought = engine.buyBusiness('fricasse');
  assert.equal(bought, true);
  assert.equal(engine.dinars, 0.0); // 10.0 - 10.0 = 0.0
  assert.equal(engine.businesses[0].level, 1);
});

test('Manual production tap completes cycle and adds dinars', () => {
  const t0 = 1000000;
  const engine = new TycoonEngine();
  engine.lastTimestamp = t0;
  engine.buyBusiness('fricasse');

  engine.startProduction('fricasse');
  assert.equal(engine.businesses[0].isProducing, true);

  // Avance de 400ms (cycle = 800ms, non terminé)
  engine.update(t0 + 400);
  assert.equal(engine.dinars, 0.0);
  assert.equal(engine.businesses[0].isProducing, true);

  // Avance de 450ms (total 850ms >= 800ms, terminé)
  engine.update(t0 + 850);
  assert.equal(engine.dinars, 1.5); // +1.5 DT
  assert.equal(engine.businesses[0].isProducing, false);
});

test('Manager automation and offline progress calculation without timer drift', () => {
  const t0 = 1000000;
  const engine = new TycoonEngine();
  engine.lastTimestamp = t0;
  engine.buyBusiness('fricasse');
  
  // Embauche du gérant 3am Salah (50 TND)
  engine.dinars = 60.0;
  const hired = engine.hireManager('fricasse');
  assert.equal(hired, true);
  assert.equal(engine.dinars, 10.0);
  assert.equal(engine.businesses[0].hasManager, true);

  // Simulation coupure de 80s (80000ms / 800ms = 100 cycles x 1.5 DT = 150 DT)
  const offlineRevenue = engine.processOfflineProgress(t0 + 80000);
  assert.equal(offlineRevenue, 150.0);
  assert.equal(engine.dinars, 160.0);
});

test('Random events apply business multipliers and expire cleanly', () => {
  const t0 = 1000000;
  const engine = new TycoonEngine();
  engine.lastTimestamp = t0;
  engine.dinars = 100.0;
  engine.buyBusiness('kahwa'); // baseRevenue = 10 DT

  // Sans événement
  assert.equal(engine.getRevenue(engine.businesses[1]), 10.0);

  // Déclenchement de l'événement Canicule (multiplicateur x3 sur kahwa)
  engine.activeEvent = {
    event: {
      id: 'canicule',
      title: 'Canicule 48°C',
      durationMs: 30000,
      multipliers: { kahwa: 3.0 }
    },
    endsAt: t0 + 30000
  };

  assert.equal(engine.getRevenue(engine.businesses[1]), 30.0);

  // Après expiration (t0 + 35000ms), l'événement s'annule et le multiplicateur retombe à 1
  engine.update(t0 + 35000);
  assert.equal(engine.activeEvent, null);
  assert.equal(engine.getRevenue(engine.businesses[1]), 10.0);
});

test('Ad rewarded boost doubles production revenue', () => {
  const t0 = 1000000;
  const engine = new TycoonEngine();
  engine.lastTimestamp = t0;
  engine.dinars = 100.0;
  engine.buyBusiness('kahwa'); // baseRevenue = 10 DT

  // Sans boost pub
  assert.equal(engine.isAdBoostActive(t0), false);
  assert.equal(engine.getRevenue(engine.businesses[1], t0), 10.0);

  // Activation d'un boost de 4h (14 400 000 ms) via AdMob Rewarded
  engine.addAdBoost(4 * 3600 * 1000, t0);
  assert.equal(engine.isAdBoostActive(t0 + 1000), true);
  assert.equal(engine.getRevenue(engine.businesses[1], t0 + 1000), 20.0); // 10 * 2 = 20 DT

  // Expiration du boost après 4h + 1s
  const tExpired = t0 + (4 * 3600 * 1000) + 1000;
  assert.equal(engine.isAdBoostActive(tExpired), false);
  assert.equal(engine.getRevenue(engine.businesses[1], tExpired), 10.0);
});

test('Ad rewarded cash grants instant dinars', () => {
  const engine = new TycoonEngine();
  engine.dinars = 20.0;
  engine.buyBusiness('fricasse'); // coût = 10.0 DT, reste 10.0 DT

  const reward = engine.claimAdCashReward();
  assert.ok(reward >= 5.0);
  assert.equal(engine.dinars, 10.0 + reward);
});

test('Quests can be achieved and claimed with title upgrades', () => {
  const engine = new TycoonEngine();
  assert.equal(engine.playerTitle, 'مواطن يلوّج على مشروع');

  // Pas de quête validée au début
  assert.equal(engine.checkQuests().length, 0);

  // Achat du premier kiosque -> déclenche la quête first_kiosk
  engine.buyBusiness('fricasse');
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




