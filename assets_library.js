/**
 * assets_library.js — Tounes Tycoon Graphic Assets Engine
 * © EOLabs 2026 beta
 *
 * Moteur graphique vectoriel procédural 2D ultra-léger et autonome.
 * Style Chibi Tycoon Kairosoft / Habbo Hotel à la sauce tunisienne.
 * Zéro dépendance réseau, cache dynamique OffscreenCanvas pour 60 FPS garantis.
 */

var globalScope = typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this);
(function (global) {
  'use strict';

  // 1. PALETTES OFFICIELLES TUNISIENNES (Charte Art Director)
  const PALETTE = {
    // Bleu Sidi Bou Saïd
    blueDark: '#092C4C',
    blueBase: '#0F4C81',
    blueLight: '#1E88E5',
    bluePale: '#E4EDF5',

    // Rouge Chéchia & Carmin Punique
    redDark: '#8A0A16',
    redBase: '#E70013',
    redLight: '#FF4A5A',

    // Marbre de Kadhel & Chaux
    white: '#FFFFFF',
    kadhelBase: '#F4EFE6',
    kadhelShadow: '#DDD5C7',

    // Or Hafside & Sable du Sahara
    goldBase: '#D4AF37',
    sandWarm: '#E5A93C',
    sandShadow: '#B87326',

    // Céramique Zellige & Oasis
    greenBase: '#0D8F68',
    greenDark: '#06523B',
    greenPale: '#E6F7F2',

    // Ferronnerie d'art & Contours
    ironDark: '#1E2530',
    ironNail: '#475569',
    asphalt: '#1e293b'
  };

  // 2. GESTIONNAIRE DE CACHE OPTIMISÉ (OffscreenCanvas rasterization)
  class SpriteCache {
    constructor() {
      this.cache = new Map();
      this.hasOffscreen = typeof OffscreenCanvas !== 'undefined';
    }

    get(key, width, height, renderFn) {
      if (this.cache.has(key)) {
        return this.cache.get(key);
      }
      let cvs;
      if (this.hasOffscreen) {
        cvs = new OffscreenCanvas(width, height);
      } else if (typeof document !== 'undefined') {
        cvs = document.createElement('canvas');
        cvs.width = width;
        cvs.height = height;
      } else {
        return null;
      }
      const ctx = cvs.getContext('2d');
      renderFn(ctx, width, height);
      this.cache.set(key, cvs);
      return cvs;
    }

    clear() {
      this.cache.clear();
    }
  }

  const spriteCache = new SpriteCache();

  // 3. PRIMITIVES ARCHITECTURALES ET DÉCORS
  const Primitives = {
    // Arc outrepassé mauresque (fer à cheval)
    drawMoorishArch(ctx, x, y, w, h, strokeColor, fillColor) {
      ctx.save();
      ctx.fillStyle = fillColor || 'transparent';
      ctx.strokeStyle = strokeColor || PALETTE.ironDark;
      ctx.lineWidth = Math.max(1.5, w * 0.04);
      ctx.beginPath();
      ctx.moveTo(x, y + h);
      ctx.lineTo(x, y + h * 0.4);
      ctx.bezierCurveTo(x - w * 0.1, y + h * 0.18, x + w * 0.18, y - h * 0.06, x + w * 0.5, y);
      ctx.bezierCurveTo(x + w * 0.82, y - h * 0.06, x + w * 1.1, y + h * 0.18, x + w, y + h * 0.4);
      ctx.lineTo(x + w, y + h);
      ctx.closePath();
      if (fillColor) ctx.fill();
      if (strokeColor) ctx.stroke();
      ctx.restore();
    },

    // Motif Zellige tunisien Qallaline
    drawZelligeTile(ctx, x, y, size) {
      ctx.save();
      ctx.fillStyle = PALETTE.kadhelBase;
      ctx.fillRect(x, y, size, size);
      ctx.strokeStyle = PALETTE.blueBase;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, size, size);

      // Étoile à 4 pointes au centre
      ctx.fillStyle = PALETTE.blueBase;
      ctx.beginPath();
      ctx.moveTo(x + size / 2, y + 2);
      ctx.lineTo(x + size - 2, y + size / 2);
      ctx.lineTo(x + size / 2, y + size - 2);
      ctx.lineTo(x + 2, y + size / 2);
      ctx.closePath();
      ctx.fill();

      // Cœur d'or
      ctx.fillStyle = PALETTE.goldBase;
      ctx.fillRect(x + size / 2 - 1.5, y + size / 2 - 1.5, 3, 3);
      ctx.restore();
    },

    // Porte cloutée tunisienne traditionnelle (باب عربي مرصّع)
    drawAuthenticDoor(ctx, x, y, w, h, doorColor, isHighlighted = false) {
      ctx.save();
      // Cadre de pierre Kadhel
      this.drawMoorishArch(ctx, x - 3, y - 3, w + 6, h + 3, PALETTE.sandWarm, PALETTE.kadhelBase);

      // Vantail de la porte
      this.drawMoorishArch(ctx, x, y, w, h, PALETTE.ironDark, doorColor || PALETTE.blueBase);

      // Ligne centrale de battant
      ctx.strokeStyle = PALETTE.ironDark;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(x + w / 2, y + 4);
      ctx.lineTo(x + w / 2, y + h);
      ctx.stroke();

      // Motifs de clous dorés (Croissant et étoile)
      ctx.fillStyle = PALETTE.goldBase;
      const nailPositions = [
        { dx: 0.5, dy: 0.28 },
        { dx: 0.35, dy: 0.44 }, { dx: 0.65, dy: 0.44 },
        { dx: 0.5, dy: 0.54 },
        { dx: 0.3, dy: 0.72 }, { dx: 0.7, dy: 0.72 },
        { dx: 0.5, dy: 0.85 }
      ];
      nailPositions.forEach(p => {
        ctx.beginPath();
        ctx.arc(x + w * p.dx, y + h * p.dy, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // Heurtoirs en fer forgé
      ctx.strokeStyle = PALETTE.goldBase;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x + w * 0.35, y + h * 0.6, 3.2, 0, Math.PI * 2);
      ctx.arc(x + w * 0.65, y + h * 0.6, 3.2, 0, Math.PI * 2);
      ctx.stroke();

      // Gravure discrète
      ctx.fillStyle = PALETTE.kadhelBase;
      ctx.font = '900 8px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🚪 ادخل', x + w / 2, y + h - 8);

      if (isHighlighted) {
        ctx.strokeStyle = PALETTE.goldBase;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();
    },

    // Chéchia rouge tunisienne à gland noir
    drawChechia(ctx, x, y, radius) {
      ctx.save();
      // Corps de la chéchia en feutre écarlate
      ctx.fillStyle = PALETTE.redBase;
      ctx.beginPath();
      ctx.ellipse(x, y, radius, radius * 0.65, 0, Math.PI, 0, false);
      ctx.fill();

      // Ombrage inférieur
      ctx.fillStyle = PALETTE.redDark;
      ctx.beginPath();
      ctx.ellipse(x, y, radius, radius * 0.22, 0, 0, Math.PI);
      ctx.fill();

      // Gland de soie noire (كبّوس)
      ctx.strokeStyle = PALETTE.ironDark;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y - radius * 0.6);
      ctx.quadraticCurveTo(x + radius * 0.8, y - radius * 0.2, x + radius * 0.7, y + radius * 0.2);
      ctx.stroke();

      // Pompon
      ctx.fillStyle = PALETTE.ironDark;
      ctx.beginPath();
      ctx.arc(x + radius * 0.7, y + radius * 0.2, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },

    // Machmoum de jasmin à l'oreille
    drawMachmoum(ctx, x, y) {
      ctx.save();
      // Brin vert
      ctx.strokeStyle = PALETTE.greenBase;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 2, y - 5);
      ctx.stroke();

      // Fleurs blanches de jasmin
      ctx.fillStyle = PALETTE.white;
      ctx.beginPath();
      ctx.arc(x + 1, y - 5, 2, 0, Math.PI * 2);
      ctx.arc(x + 3, y - 4, 1.8, 0, Math.PI * 2);
      ctx.arc(x + 1, y - 7, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  // 4. MOTEUR DE PERSONNAGES CHIBI (MODULAR PUPPET)
  const Characters = {
    drawCitizen(ctx, x, footY, options = {}) {
      const {
        gender = 'male', // 'male' | 'female'
        role = 'citizen', // 'citizen' | 'merchant' | 'waiter' | 'vip'
        skin = '#fcd34d',
        outfitColor = null,
        hasChechia = true,
        hasMachmoum = false,
        isWalking = false,
        timeSec = 0
      } = options;

      ctx.save();
      const bounce = isWalking ? Math.sin(timeSec * 10) * 2 : 0;
      const legSwing = isWalking ? Math.sin(timeSec * 10) * 4 : 0;

      // Ombre portée au sol
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(x, footY, 9, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // 1. Chaussures / Balghas (بلغة تونسية)
      const balghaColor = role === 'vip' ? PALETTE.goldBase : PALETTE.sandWarm;
      ctx.fillStyle = balghaColor;
      ctx.fillRect(x - 6 - legSwing * 0.4, footY - 3, 5, 3);
      ctx.fillRect(x + 1 + legSwing * 0.4, footY - 3, 5, 3);

      // 2. Corps / Tenue (Jebba en soie, tablier ou costume)
      const bodyY = footY - 18 - bounce;
      let coatColor = outfitColor;
      if (!coatColor) {
        if (role === 'merchant') coatColor = PALETTE.greenBase;
        else if (role === 'waiter') coatColor = PALETTE.blueBase;
        else if (role === 'vip') coatColor = PALETTE.blueDark;
        else coatColor = gender === 'female' ? '#ec4899' : PALETTE.kadhelBase;
      }

      ctx.fillStyle = coatColor;
      ctx.beginPath();
      ctx.roundRect(x - 7, bodyY, 14, 16, [4, 4, 1, 1]);
      ctx.fill();
      ctx.strokeStyle = PALETTE.ironDark;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Tablier de maître artisan ou serveur
      if (role === 'waiter' || role === 'merchant') {
        ctx.fillStyle = PALETTE.white;
        ctx.fillRect(x - 5, bodyY + 4, 10, 11);
      }

      // Collerette dorée de Jebba
      if (role === 'citizen' || role === 'vip') {
        ctx.strokeStyle = PALETTE.goldBase;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x - 3, bodyY);
        ctx.lineTo(x, bodyY + 4);
        ctx.lineTo(x + 3, bodyY);
        ctx.stroke();
      }

      // 3. Tête Chibi
      const headY = bodyY - 11;
      ctx.fillStyle = skin;
      ctx.beginPath();
      ctx.arc(x, headY, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = PALETTE.ironDark;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Yeux expressifs
      ctx.fillStyle = PALETTE.ironDark;
      ctx.fillRect(x - 3.5, headY - 1, 2, 2.5);
      ctx.fillRect(x + 1.5, headY - 1, 2, 2.5);

      // Reflet blanc dans les yeux
      ctx.fillStyle = PALETTE.white;
      ctx.fillRect(x - 3, headY - 1, 1, 1);
      ctx.fillRect(x + 2, headY - 1, 1, 1);

      // Sourire
      ctx.strokeStyle = PALETTE.redDark;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(x, headY + 2.5, 2.5, 0, Math.PI);
      ctx.stroke();

      // 4. Couvre-chef (Chéchia ou Hijab / Cheveux)
      if (hasChechia) {
        Primitives.drawChechia(ctx, x, headY - 4.5, 6.5);
      } else if (gender === 'female') {
        ctx.fillStyle = PALETTE.blueBase;
        ctx.beginPath();
        ctx.arc(x, headY - 2, 8, Math.PI, Math.PI * 2);
        ctx.fill();
      }

      // Machmoum à l'oreille
      if (hasMachmoum) {
        Primitives.drawMachmoum(ctx, x + 5, headY - 2);
      }

      ctx.restore();
    }
  };

  // 5. FLOTTE DE VÉHICULES TUNISIENS
  const Vehicles = {
    // Taxi collectif ou individuel jaune tunisien
    drawTaxi(ctx, x, groundY, isMoving = false, timeSec = 0) {
      ctx.save();
      const bounce = isMoving ? Math.sin(timeSec * 16) * 1 : 0;
      const y = groundY - 22 + bounce;

      // Ombre sous le véhicule
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(x + 36, groundY - 2, 38, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Carrosserie jaune vif
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = PALETTE.ironDark;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x, y + 8, 72, 16, [4, 6, 2, 2]);
      ctx.fill();
      ctx.stroke();

      // Habitacle & vitres
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.roundRect(x + 14, y, 42, 11, [4, 4, 0, 0]);
      ctx.fill();
      ctx.stroke();

      // Séparation des vitres
      ctx.strokeStyle = PALETTE.ironDark;
      ctx.beginPath();
      ctx.moveTo(x + 35, y);
      ctx.lineTo(x + 35, y + 10);
      ctx.stroke();

      // Lanterneau lumineux sur le toit (TAXI)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(x + 30, y - 5, 12, 5, 2);
      ctx.fill();
      ctx.strokeStyle = PALETTE.redBase;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = PALETTE.redBase;
      ctx.font = '900 4px sans-serif';
      ctx.fillText('TAXI', x + 31.5, y - 1);

      // Phares
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(x + 68, y + 10, 3, 5);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x + 1, y + 10, 3, 5);

      // Roues
      const wheelSpin = isMoving ? (timeSec * 20) % (Math.PI * 2) : 0;
      [x + 16, x + 56].forEach(wx => {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(wx, groundY - 3, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(wx, groundY - 3, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    },

    // Louage blanc à bande rouge (inter-gouvernorats) ou bleue (régionale)
    drawLouage(ctx, x, groundY, stripColor = '#dc2626', isMoving = false, timeSec = 0) {
      ctx.save();
      const bounce = isMoving ? Math.sin(timeSec * 14) * 1 : 0;
      const y = groundY - 26 + bounce;

      // Ombre
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(x + 42, groundY - 2, 44, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Carrosserie fourgon blanc
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = PALETTE.ironDark;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x, y + 5, 84, 22, [4, 8, 2, 2]);
      ctx.fill();
      ctx.stroke();

      // Vitres latérales
      ctx.fillStyle = '#bae6fd';
      for (let vx = x + 12; vx < x + 72; vx += 16) {
        ctx.fillRect(vx, y + 8, 12, 8);
        ctx.strokeRect(vx, y + 8, 12, 8);
      }

      // Bande réglementaire rouge ou bleue du Louage
      ctx.fillStyle = stripColor;
      ctx.fillRect(x + 2, y + 18, 80, 5);

      // Roues
      [x + 18, x + 66].forEach(wx => {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(wx, groundY - 4, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(wx, groundY - 4, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    }
  };

  // 6. MOTEUR FX DE PARTICULES À ZÉRO ALLOCATION (Object Pool)
  class FXEngine {
    constructor(maxParticles = 60) {
      this.pool = [];
      for (let i = 0; i < maxParticles; i++) {
        this.pool.push({
          active: false,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          alpha: 1,
          size: 4,
          color: '#ffffff',
          type: 'sparkle', // 'sparkle' | 'steam' | 'confetti'
          life: 0,
          maxLife: 1
        });
      }
    }

    spawn(type, x, y, options = {}) {
      const p = this.pool.find(item => !item.active);
      if (!p) return;
      p.active = true;
      p.type = type;
      p.x = x;
      p.y = y;
      p.life = 0;
      p.maxLife = options.maxLife || 1.2;
      p.alpha = 1;
      p.size = options.size || (type === 'steam' ? 6 : 4);
      p.color = options.color || (type === 'sparkle' ? PALETTE.goldBase : PALETTE.white);
      p.vx = (Math.random() - 0.5) * (options.spreadX || 20);
      p.vy = options.vy || (type === 'steam' ? -25 : -35);
    }

    update(dt) {
      this.pool.forEach(p => {
        if (!p.active) return;
        p.life += dt;
        if (p.life >= p.maxLife) {
          p.active = false;
          return;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const progress = p.life / p.maxLife;
        p.alpha = 1 - progress;
        if (p.type === 'steam') p.size += dt * 6;
      });
    }

    render(ctx) {
      this.pool.forEach(p => {
        if (!p.active || p.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.type === 'steam') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'sparkle') {
          // Étoile à 4 pointes scintillante
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - p.size);
          ctx.lineTo(p.x + p.size * 0.4, p.y);
          ctx.lineTo(p.x + p.size, p.y);
          ctx.lineTo(p.x + p.size * 0.4, p.y + p.size * 0.4);
          ctx.lineTo(p.x, p.y + p.size);
          ctx.lineTo(p.x - p.size * 0.4, p.y + p.size * 0.4);
          ctx.lineTo(p.x - p.size, p.y);
          ctx.lineTo(p.x - p.size * 0.4, p.y);
          ctx.closePath();
          ctx.fill();
        } else if (p.type === 'confetti') {
          ctx.fillRect(p.x, p.y, p.size, p.size * 1.5);
        }
        ctx.restore();
      });
    }
  }

  // EXPORT GLOBAL DU MODULE
  const AssetsLibrary = {
    PALETTE,
    Primitives,
    Characters,
    Vehicles,
    FXEngine,
    spriteCache
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AssetsLibrary;
  }
  if (typeof global !== 'undefined') {
    global.AssetsLibrary = AssetsLibrary;
  }

})(globalScope);

export const PALETTE = globalScope.AssetsLibrary.PALETTE;
export const Primitives = globalScope.AssetsLibrary.Primitives;
export const Characters = globalScope.AssetsLibrary.Characters;
export const Vehicles = globalScope.AssetsLibrary.Vehicles;
export const FXEngine = globalScope.AssetsLibrary.FXEngine;
export const spriteCache = globalScope.AssetsLibrary.spriteCache;
export default globalScope.AssetsLibrary;
