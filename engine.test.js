import test from 'node:test';
import assert from 'node:assert/strict';
import { TycoonEngine } from './engine.js';

test('Initial state & first business purchase', () => {
  const engine = new TycoonEngine();
  assert.equal(engine.dinars, 4.0);

  const bought = engine.buyBusiness('fricasse');
  assert.equal(bought, true);
  assert.equal(engine.dinars, 0.0);
  assert.equal(engine.businesses[0].level, 1);
});

test('Manual production tap completes cycle and adds dinars', () => {
  const t0 = 1000000;
  const engine = new TycoonEngine();
  engine.lastTimestamp = t0;
  engine.buyBusiness('fricasse');

  engine.startProduction('fricasse');
  assert.equal(engine.businesses[0].isProducing, true);

  // Avance de 300ms (cycle = 600ms, non terminé)
  engine.update(t0 + 300);
  assert.equal(engine.dinars, 0.0);
  assert.equal(engine.businesses[0].isProducing, true);

  // Avance de 350ms (total 650ms >= 600ms, terminé)
  engine.update(t0 + 650);
  assert.equal(engine.dinars, 1.0);
  assert.equal(engine.businesses[0].isProducing, false);
});

test('Manager automation and offline progress calculation without timer drift', () => {
  const t0 = 1000000;
  const engine = new TycoonEngine();
  engine.lastTimestamp = t0;
  engine.buyBusiness('fricasse');
  
  // Simulation de fonds pour embaucher le manager 3am Salah (100 TND)
  engine.dinars = 150.0;
  const hired = engine.hireManager('fricasse');
  assert.equal(hired, true);
  assert.equal(engine.dinars, 50.0);
  assert.equal(engine.businesses[0].hasManager, true);

  // Simulation d'une coupure / sortie de l'application pendant 60 secondes (60 000 ms)
  // Cycle = 600ms -> 100 cycles = 100 TND générés
  const offlineRevenue = engine.processOfflineProgress(t0 + 60000);
  assert.equal(offlineRevenue, 100.0);
  assert.equal(engine.dinars, 150.0);
});

test('Random events apply business multipliers and expire cleanly', () => {
  const t0 = 1000000;
  const engine = new TycoonEngine();
  engine.lastTimestamp = t0;
  engine.dinars = 1000.0;
  engine.buyBusiness('kahwa'); // baseRevenue = 20 DT

  // Sans événement
  assert.equal(engine.getRevenue(engine.businesses[1]), 20.0);

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

  assert.equal(engine.getRevenue(engine.businesses[1]), 60.0);

  // Après expiration (t0 + 35000ms), l'événement s'annule et le multiplicateur retombe à 1
  engine.update(t0 + 35000);
  assert.equal(engine.activeEvent, null);
  assert.equal(engine.getRevenue(engine.businesses[1]), 20.0);
});

test('Ad rewarded boost doubles production revenue', () => {
  const t0 = 1000000;
  const engine = new TycoonEngine();
  engine.lastTimestamp = t0;
  engine.dinars = 1000.0;
  engine.buyBusiness('kahwa'); // baseRevenue = 20 DT

  // Sans boost pub
  assert.equal(engine.isAdBoostActive(t0), false);
  assert.equal(engine.getRevenue(engine.businesses[1], t0), 20.0);

  // Activation d'un boost de 4h (14 400 000 ms) via AdMob Rewarded
  engine.addAdBoost(4 * 3600 * 1000, t0);
  assert.equal(engine.isAdBoostActive(t0 + 1000), true);
  assert.equal(engine.getRevenue(engine.businesses[1], t0 + 1000), 40.0); // 20 * 2 = 40 DT

  // Expiration du boost après 4h + 1s
  const tExpired = t0 + (4 * 3600 * 1000) + 1000;
  assert.equal(engine.isAdBoostActive(tExpired), false);
  assert.equal(engine.getRevenue(engine.businesses[1], tExpired), 20.0);
});

test('Ad rewarded cash grants instant dinars', () => {
  const engine = new TycoonEngine();
  engine.dinars = 10.0;
  engine.buyBusiness('fricasse'); // 1 DT par 0.6s -> ~1.66 DT/s

  const reward = engine.claimAdCashReward();
  assert.ok(reward >= 25.0);
  assert.equal(engine.dinars, 6.0 + reward);
});



