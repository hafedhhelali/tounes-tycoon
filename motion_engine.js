/**
 * motion_engine.js
 * Moteur de Micro-Animations & Cinématique Fluide 60 FPS Mobile pour Tounes Tycoon.
 * Physique de ressorts (Springs), Easing élastique, Trajectoires paraboliques & Pool de particules.
 * © EOLabs 2026. Zéro dépendance, zéro fuite mémoire, optimisé mobile & GPU WebView.
 */

// --- 1. FONCTIONS D'ATTÉNUATION (EASING CURVES) HAUTE PRÉCISION ---
export const Easing = {
  linear: t => t,
  easeOutQuad: t => t * (2 - t),
  easeInQuad: t => t * t,
  easeInOutQuad: t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeOutCubic: t => (--t) * t * t + 1,
  easeInCubic: t => t * t * t,
  easeInOutCubic: t => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeOutBack: (t, s = 1.70158) => {
    t -= 1;
    return t * t * ((s + 1) * t + s) + 1;
  },
  easeOutElastic: (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    const p = 0.3;
    const s = p / 4;
    return Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p) + 1;
  },
  easeOutBounce: (t) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
};

// --- 2. LISSAGE EXPONENTIEL CRITIQUE (SMOOTH DAMP & DECAY INDÉPENDANTS DU FRAMERATE) ---
export function exponentialDecay(current, target, decayRate, dt) {
  return current + (target - current) * (1 - Math.exp(-decayRate * dt));
}

// --- 3. SYSTÈME DE RESSORTS PHYSIQUES (SPRING SIMULATOR) ---
export class SpringSimulator {
  constructor({ tension = 180, friction = 22, mass = 1 } = {}) {
    this.tension = tension;
    this.friction = friction;
    this.mass = mass;
  }

  // Intégration Euler semi-implicite insensible aux variations de dt
  step(state, target, dt) {
    const clampedDt = Math.min(dt, 0.033);
    const force = -this.tension * (state.x - target) - this.friction * state.v;
    const accel = force / this.mass;
    state.v += accel * clampedDt;
    state.x += state.v * clampedDt;
    const atRest = Math.abs(state.v) < 0.001 && Math.abs(state.x - target) < 0.001;
    if (atRest) {
      state.x = target;
      state.v = 0;
    }
    return atRest;
  }
}

// --- 4. SQUASH & STRETCH TACTILE POUR ÉLÉMENTS DOM ---
export function triggerTactileSquash(element, scaleX = 1.08, scaleY = 0.92) {
  if (!element || !element.style) return;
  try {
    element.style.transition = 'transform 0.07s cubic-bezier(0.2, 0.9, 0.3, 1.3)';
    element.style.transform = `scale3d(${scaleX}, ${scaleY}, 1)`;

    setTimeout(() => {
      if (!element || !element.style) return;
      element.style.transition = 'transform 0.22s cubic-bezier(0.18, 1.25, 0.32, 1.2)';
      element.style.transform = `scale3d(${scaleY}, ${scaleX}, 1)`;
      setTimeout(() => {
        if (!element || !element.style) return;
        element.style.transition = 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)';
        element.style.transform = 'scale3d(1, 1, 1)';
      }, 110);
    }, 70);
  } catch (e) {}
}

// --- 5. POOL DOM HAUTE PERFORMANCE COMPOSITEUR GPU (WAAPI) ---
export class DomCoinPool {
  constructor(size = 24) {
    this.pool = [];
    if (typeof document === 'undefined' || !document.body) return;
    try {
      let container = document.getElementById('dom-fx-overlay');
      if (!container) {
        container = document.createElement('div');
        container.id = 'dom-fx-overlay';
        container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99999;overflow:hidden;';
        document.body.appendChild(container);
      }
      this.container = container;

      for (let i = 0; i < size; i++) {
        const el = document.createElement('div');
        el.innerText = '🪙';
        el.style.cssText = 'position:absolute;top:0;left:0;font-size:22px;will-change:transform,opacity;opacity:0;pointer-events:none;';
        this.container.appendChild(el);
        this.pool.push({ el, busy: false });
      }
    } catch (e) {}
  }

  spawnBurst(startX, startY, targetEl, count = 7) {
    if (!this.pool || this.pool.length === 0) return false;
    const rect = targetEl && typeof targetEl.getBoundingClientRect === 'function'
      ? targetEl.getBoundingClientRect()
      : { left: (typeof window !== 'undefined' ? window.innerWidth : 400) / 2, top: 32, width: 20, height: 20 };
    const destX = rect.left + rect.width / 2;
    const destY = rect.top + rect.height / 2;

    const available = this.pool.filter(p => !p.busy).slice(0, count);
    if (available.length === 0) return false;

    const testEl = available[0].el;
    const hasWaapi = testEl && typeof testEl.animate === 'function';
    if (!hasWaapi) return false;

    available.forEach((p, idx) => {
      p.busy = true;
      p.el.style.opacity = '1';
      const angle = (Math.PI * 0.55) + Math.random() * (Math.PI * 0.9);
      const force = 80 + Math.random() * 85;
      const midX = startX + Math.cos(angle) * force;
      const midY = startY - Math.sin(angle) * force - 30;

      try {
        const anim = p.el.animate([
          { transform: `translate3d(${startX}px, ${startY}px, 0) scale(0.6)`, opacity: 1 },
          { transform: `translate3d(${midX}px, ${midY}px, 0) scale(1.35) rotate(${idx * 50}deg)`, opacity: 1, offset: 0.35 },
          { transform: `translate3d(${destX}px, ${destY}px, 0) scale(0.85) rotate(720deg)`, opacity: 0.95, offset: 0.92 },
          { transform: `translate3d(${destX}px, ${destY}px, 0) scale(0.2)`, opacity: 0 }
        ], {
          duration: 520 + Math.random() * 140,
          easing: 'cubic-bezier(0.18, 0.85, 0.25, 1)'
        });

        anim.onfinish = () => {
          p.busy = false;
          p.el.style.opacity = '0';
          if (idx === 0 && targetEl && targetEl.classList) {
            targetEl.classList.remove('bump');
            void targetEl.offsetWidth;
            targetEl.classList.add('bump');
          }
        };
      } catch (err) {
        p.busy = false;
        p.el.style.opacity = '0';
      }
    });
    return true;
  }
}
