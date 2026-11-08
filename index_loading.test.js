/**
 * Tounes Tycoon - App Loading & Zero-Blank-Screen Regression Test
 * © EOLabs 2026.
 * 
 * Ce test vérifie que :
 * 1. Tous les fichiers de modules (engine, store_animator, motion_engine, audio, ads) compilent et s'importent sans SyntaxError.
 * 2. Le script principal de index.html s'exécute de bout en bout sans lever d'exception (ni écran blanc, ni freeze du chargement).
 * 3. L'initialisation fonctionne avec stockage vide (nouveau joueur) et avec sauvegarde existante.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

import { TycoonEngine, BUSINESS_CONFIGS, CITY_BUSINESS_MAP } from './engine.js';
import { soundEngine } from './audio.js';
import { AdsService } from './ads_service.js';
import {
  CanvasStoreEngine,
  QuartierAnimator,
  TunisiaMapEngine,
  DomCoinPool,
  triggerTactileSquash,
  SpringSimulator,
  exponentialDecay,
  Easing,
  PixiGpuEngine
} from './store_animator.js';

test('All core game modules import cleanly without syntax or linking errors', () => {
  assert.ok(TycoonEngine);
  assert.ok(BUSINESS_CONFIGS);
  assert.ok(CITY_BUSINESS_MAP);
  assert.ok(soundEngine);
  assert.ok(AdsService);
  assert.ok(CanvasStoreEngine);
  assert.ok(QuartierAnimator);
  assert.ok(TunisiaMapEngine);
  assert.ok(DomCoinPool);
  assert.ok(triggerTactileSquash);
  assert.ok(SpringSimulator);
  assert.ok(exponentialDecay);
  assert.ok(Easing);
  assert.ok(PixiGpuEngine);
});

function createMockElement(tag = 'DIV', id = '') {
  return {
    id,
    tagName: tag.toUpperCase(),
    style: {},
    classList: {
      _classes: new Set(),
      add(...c) { c.forEach(x => this._classes.add(x)); },
      remove(...c) { c.forEach(x => this._classes.delete(x)); },
      toggle(c, force) {
        if (force === undefined) {
          if (this._classes.has(c)) this._classes.delete(c);
          else this._classes.add(c);
        } else if (force) this._classes.add(c);
        else this._classes.delete(c);
      },
      contains(c) { return this._classes.has(c); }
    },
    dataset: {},
    children: [],
    parentElement: null,
    parentNode: null,
    innerHTML: '',
    innerText: '',
    value: '',
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: () => createMockElement('DIV'),
    querySelectorAll: () => [],
    appendChild(child) {
      this.children.push(child);
      child.parentElement = this;
      child.parentNode = this;
      return child;
    },
    removeChild: () => {},
    setAttribute: () => {},
    getAttribute: () => null,
    getContext: () => ({
      canvas: { width: 800, height: 400 },
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} }),
      measureText: () => ({ width: 50 }),
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      arcTo: () => {},
      ellipse: () => {},
      rect: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      clearRect: () => {},
      fill: () => {},
      stroke: () => {},
      fillText: () => {},
      strokeText: () => {},
      setLineDash: () => {},
      getLineDash: () => [],
      drawImage: () => {},
      roundRect: () => {},
      transform: () => {},
      setTransform: () => {},
      resetTransform: () => {},
      scale: () => {},
      rotate: () => {},
      translate: () => {},
      clip: () => {}
    }),
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 400 }),
    focus: () => {},
    click: () => {}
  };
}

function runIndexScriptWithMockStorage(initialData = null) {
  const html = fs.readFileSync('index.html', 'utf8');
  const match = /<script type="module">([\s\S]*?)<\/script>/i.exec(html);
  assert.ok(match, 'index.html must contain a <script type="module">');

  const domElements = new Map();
  const idRegex = /\bid=["']([^"']+)["']/g;
  let m;
  while ((m = idRegex.exec(html)) !== null) {
    domElements.set(m[1], createMockElement('DIV', m[1]));
  }

  const mockStorage = new Map();
  if (initialData) {
    mockStorage.set('tounes_tycoon_save', JSON.stringify(initialData));
  }

  const localStorage = {
    getItem: (k) => mockStorage.get(k) || null,
    setItem: (k, v) => mockStorage.set(k, String(v)),
    removeItem: (k) => mockStorage.delete(k),
    clear: () => mockStorage.clear()
  };

  const windowMock = {
    devicePixelRatio: 2,
    addEventListener: () => {},
    removeEventListener: () => {},
    localStorage,
    document: {
      body: createMockElement('BODY'),
      getElementById: (id) => domElements.get(id) || null,
      querySelector: () => createMockElement('DIV'),
      querySelectorAll: () => [],
      createElement: (tag) => createMockElement(tag),
      addEventListener: () => {},
      removeEventListener: () => {}
    },
    performance: {
      now: () => Date.now()
    },
    requestAnimationFrame: () => 1,
    cancelAnimationFrame: () => {},
    setTimeout: () => 1,
    clearTimeout: () => {},
    setInterval: () => 1,
    clearInterval: () => {},
    Capacitor: {
      Plugins: {
        App: {
          addListener: () => {},
          removeAllListeners: () => {},
          exitApp: () => {}
        }
      }
    }
  };
  windowMock.window = windowMock;
  windowMock.document.defaultView = windowMock;
  globalThis.window = windowMock;
  globalThis.document = windowMock.document;
  globalThis.requestAnimationFrame = windowMock.requestAnimationFrame;
  globalThis.cancelAnimationFrame = windowMock.cancelAnimationFrame;

  let code = match[1];
  code = code.replace(/import\s*\{[^}]*\}\s*from\s*['"][^'"]*['"];?/g, '');
  code = code.replace(/import\(['"][^'"]*['"]\)/g, 'Promise.resolve({ DAILY_LOGIN_REWARDS: [] })');

  const context = vm.createContext({
    ...windowMock,
    window: windowMock,
    document: windowMock.document,
    localStorage: windowMock.localStorage,
    performance: windowMock.performance,
    requestAnimationFrame: windowMock.requestAnimationFrame,
    cancelAnimationFrame: windowMock.cancelAnimationFrame,
    setTimeout: windowMock.setTimeout,
    clearTimeout: windowMock.clearTimeout,
    setInterval: windowMock.setInterval,
    clearInterval: windowMock.clearInterval,
    TycoonEngine,
    soundEngine,
    AdsService,
    CanvasStoreEngine,
    QuartierAnimator,
    TunisiaMapEngine,
    DomCoinPool,
    triggerTactileSquash,
    PixiGpuEngine,
    console
  });

  vm.runInContext(code, context);
}

test('index.html boots cleanly with fresh new game (zero save state, no blank screen)', () => {
  assert.doesNotThrow(() => {
    runIndexScriptWithMockStorage(null);
  });
});

test('index.html boots cleanly with existing saved empire state (persistence check)', () => {
  assert.doesNotThrow(() => {
    runIndexScriptWithMockStorage({
      empireName: 'امبراطورية عزيز',
      dinars: 150000,
      currentCityId: 'tunis',
      unlockedCityIds: ['tunis', 'bizerte'],
      businesses: [
        { id: 'kaskrout', level: 25 },
        { id: 'bar_cha3bi', level: 5 },
        { id: 'boite_de_nuit', level: 1 }
      ]
    });
  });
});
