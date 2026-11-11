import test from 'node:test';
import assert from 'node:assert/strict';
import { TunisiaMapEngine } from './store_animator.js';

function createMockCanvas(width = 800, height = 600, dpr = 2) {
  const listeners = {};
  const style = { cursor: 'default' };
  const ctx = {
    setTransform: () => {},
    clearRect: () => {},
    save: () => {},
    restore: () => {},
    scale: () => {},
    translate: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    bezierCurveTo: () => {},
    arc: () => {},
    ellipse: () => {},
    roundRect: () => {},
    fill: () => {},
    stroke: () => {},
    fillRect: () => {},
    drawImage: () => {},
    measureText: (txt) => ({ width: (txt || '').length * 8 }),
    fillText: () => {},
    createRadialGradient: () => ({ addColorStop: () => {} }),
    createLinearGradient: () => ({ addColorStop: () => {} }),
    setLineDash: () => {},
    shadowColor: '',
    shadowBlur: 0,
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: '',
    textBaseline: '',
    globalAlpha: 1
  };

  const canvas = {
    width: width * dpr,
    height: height * dpr,
    style,
    getContext: () => ctx,
    getBoundingClientRect: () => ({
      left: 0,
      top: 0,
      width,
      height
    }),
    addEventListener: (type, fn) => {
      listeners[type] = fn;
    },
    removeEventListener: (type) => {
      delete listeners[type];
    },
    dispatchEvent: (type, e) => {
      if (listeners[type]) listeners[type](e);
    }
  };

  return { canvas, ctx, listeners };
}

function createMockEngine(activeCityId = 'tunis') {
  let activeId = activeCityId;
  return {
    getActiveCity: () => ({ id: activeId, name: 'تونس العاصمة', x: 500, y: 150 }),
    setActiveCity: (id) => { activeId = id; },
    switchCity: (id) => { activeId = id; },
    unlockedCityIds: ['tunis', 'bizerte'],
    getUnlockedCities: () => ['tunis', 'bizerte'],
    canUnlockCity: (c) => c.id === 'nabeul',
    isCityUnlocked: (c) => c.id === 'tunis' || c.id === 'bizerte',
    getCityLockDiagnosis: (id) => `شرط فتح ${id}`,
    dinars: 100000,
    cash: 100000
  };
}

test('TunisiaMapEngine: initialisation et onOpen nettoie toute caravane résiduelle', () => {
  const { canvas } = createMockCanvas(400, 700);
  const engine = createMockEngine('tunis');
  const map = new TunisiaMapEngine(canvas, engine);
  map.caravan = { startTime: 0, duration: 2000 };
  map.arrivalEffect = { startTime: 0, duration: 1500 };

  map.onOpen();

  assert.equal(map.caravan, null, 'caravan doit être nulle après onOpen');
  assert.equal(map.arrivalEffect, null, 'arrivalEffect doit être nul après onOpen');
  assert.equal(map.selectedCityId, 'tunis');
});

test('TunisiaMapEngine: clics sur les boutons HUD de zoom (+ / 🇹🇳 / -)', () => {
  const { canvas } = createMockCanvas(400, 700, 1);
  const engine = createMockEngine('tunis');
  const map = new TunisiaMapEngine(canvas, engine);
  map.onOpen();

  const vpW = 400;
  const btnSize = 34;
  const btnX = vpW - btnSize - 12; // 354

  // Zoom Plus (+) à (btnX + 10, 48 + 10)
  const initialZoom = map.targetZoom || 1;
  map.handleClick({ clientX: btnX + 10, clientY: 58 });
  assert.ok(map.targetZoom > initialZoom, 'Zoom doit augmenter après clic sur +');

  // Zoom Moins (-) à (btnX + 10, 128 + 10)
  const zoomed = map.targetZoom;
  map.handleClick({ clientX: btnX + 10, clientY: 138 });
  assert.ok(map.targetZoom < zoomed, 'Zoom doit diminuer après clic sur -');

  // Bouton Centrage Tunisie (🇹🇳) à (btnX + 10, 88 + 10)
  map.handleClick({ clientX: btnX + 10, clientY: 98 });
  assert.equal(map.targetZoom, 1.25, 'Zoom centré Tunisie doit être 1.25');
});

test('TunisiaMapEngine: clic sur les pilules de navigation de pays', () => {
  const { canvas } = createMockCanvas(400, 700, 1);
  const engine = createMockEngine('tunis');
  const map = new TunisiaMapEngine(canvas, engine);
  map.onOpen();

  const vpW = 400;
  const pillW = Math.min(62, Math.floor((vpW - 24) / 6)); // 62
  const totalW = pillW * 6; // 372
  const startX = Math.floor((vpW - totalW) / 2); // 14

  // Clic sur l'Algérie (index 1)
  const dzX = startX + 1 * pillW + 10;
  map.handleClick({ clientX: dzX, clientY: 20 });
  assert.equal(map.targetPanX, 60, 'targetPanX pour Algérie doit être 60');
  assert.equal(map.targetPanY, 20, 'targetPanY pour Algérie doit être 20');

  // Clic sur le Maroc (index 2)
  const maX = startX + 2 * pillW + 10;
  map.handleClick({ clientX: maX, clientY: 20 });
  assert.equal(map.targetPanX, 220, 'targetPanX pour Maroc doit être 220');
});

test('TunisiaMapEngine: clic sur la carte Popover en bas', () => {
  const { canvas } = createMockCanvas(400, 700, 1);
  let travelCalledWith = null;
  const engine = createMockEngine('tunis');
  const map = new TunisiaMapEngine(canvas, engine, {
    onTravel: (c) => { travelCalledWith = c.id; }
  });
  map.onOpen();

  const vpW = 400;
  const vpH = 700;
  const cardW = Math.min(420, vpW - 24);
  const cardH = 110;
  const cardX = (vpW - cardW) / 2;
  const cardY = vpH - cardH - 12;

  // 1. Clic sur la ville active (tunis) -> appelle onTravel avec ville active pour retour rue
  map.selectedCityId = 'tunis';
  map.handleClick({ clientX: cardX + 50, clientY: cardY + 50 });
  assert.equal(travelCalledWith, 'tunis', 'Clic sur la carte de la ville active doit appeler onTravel');

  // 2. Clic sur une ville débloquée (bizerte) -> voyage déclenché
  travelCalledWith = null;
  map.selectedCityId = 'bizerte';
  map.handleClick({ clientX: cardX + 50, clientY: cardY + 50 });
  assert.ok(map.caravan, 'La caravane doit être initialisée');
  assert.equal(map.caravan.to.id, 'bizerte', 'Clic sur ville débloquée doit déclencher travelTo');
});

test('TunisiaMapEngine: clic sur un nœud de ville de la carte', () => {
  const { canvas } = createMockCanvas(400, 700, 1);
  let selectedCity = null;
  const engine = createMockEngine('tunis');
  const map = new TunisiaMapEngine(canvas, engine, {
    onSelect: (c) => { selectedCity = c.id; }
  });
  map.onOpen();

  // Test de clic sur Bizerte (coordonnées monde de bizerte)
  const bizerte = map.cities.find(c => c.id === 'bizerte');
  assert.ok(bizerte, 'Bizerte doit exister dans les villes');

  // Convertir monde -> écran avec scale, zoom, pan, offset
  const totalScale = map.scale * map.zoom;
  const clientX = (bizerte.x + map.panX) * totalScale + map.offsetX;
  const clientY = (bizerte.y + map.panY) * totalScale + map.offsetY;

  map.handleClick({ clientX, clientY });
  assert.equal(selectedCity, 'bizerte', 'Bizerte doit être sélectionnée');
  assert.ok(map.caravan, 'La caravane doit être lancée');
  assert.equal(map.caravan.to.id, 'bizerte', 'Bizerte doit être la destination');
});

test('TunisiaMapEngine: glissement drag > 16px ne déclenche PAS le clic', () => {
  const { canvas } = createMockCanvas(400, 700, 1);
  let clicked = false;
  const engine = createMockEngine('tunis');
  const map = new TunisiaMapEngine(canvas, engine);
  map.onOpen();
  map.handleClick = () => { clicked = true; };

  // Pointer down
  map.handlePointerDown({ clientX: 100, clientY: 100 });
  // Pointer move > 16px
  map.handlePointerMove({ clientX: 130, clientY: 130 });
  assert.equal(map.hasDraggedMap, true, 'hasDraggedMap doit être vrai');

  // Pointer up
  map.handlePointerUp({ clientX: 130, clientY: 130 });
  assert.equal(clicked, false, 'Le clic ne doit pas être appelé lors d un drag');
});

test('TunisiaMapEngine: step() dessine sans erreur et sépare le monde et le HUD', () => {
  const { canvas } = createMockCanvas(400, 700, 2);
  const engine = createMockEngine('tunis');
  const map = new TunisiaMapEngine(canvas, engine);
  map.onOpen();

  // Exécution de 5 frames successives
  for (let f = 0; f < 5; f++) {
    assert.doesNotThrow(() => {
      map.step(f * 16.6);
    });
  }
});
