import test from 'node:test';
import assert from 'node:assert/strict';
import { AdsService, AdPolicy } from './ads_service.js';

test('Publicité désactivée (ADS_ENABLED = false) : récompense accordée sans aucun affichage', async () => {
  assert.equal(AdPolicy.ADS_ENABLED, false, 'packaging v152 : aucune pub');
  const service = new AdsService();
  assert.equal(await service.initialize(), true);

  const watched = await service.showRewardedBoost('تيربو تجريبي 🧪');
  assert.equal(watched, true, 'boutons "watched ?" fonctionnent sans pub');
  assert.equal(service.isShowingAd, false, 'aucun lecteur publicitaire ouvert');
});

test('Architecture prête : politiques de boost cohérentes pour réactivation AdMob', () => {
  assert.equal(AdPolicy.BOOST_DURATION_MS, 4 * 60 * 60 * 1000);
  assert.equal(AdPolicy.MAX_BOOST_MS, 24 * 60 * 60 * 1000);
  assert.equal(typeof AdsService.prototype.showRewardedBoost, 'function');
  assert.equal(typeof AdsService.prototype.showRewardedOfflineMultiplier, 'function');
});
