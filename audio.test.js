import test from 'node:test';
import assert from 'node:assert/strict';
import { soundEngine } from './audio.js';

test('Sons : méthodes clés présentes (banque incluse) et dégradé headless sans crash', () => {
  ['playCoin', 'playCashRegister', 'playBankVault', 'playUpgrade', 'playWheelTick', 'playWorkSound']
    .forEach(m => assert.equal(typeof soundEngine[m], 'function', `${m} doit exister`));

  // Headless (pas de Web Audio) : aucun throw, muted ou non
  assert.doesNotThrow(() => {
    soundEngine.playBankVault();
    soundEngine.playCoin();
    soundEngine.playCashRegister();
  });
});

test('SFX bus réverb : cible fallback propre si init non initialisé', () => {
  assert.equal(typeof soundEngine.sfxTarget, 'object');
});
