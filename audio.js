/**
 * Tounes Tycoon - Moteur Audio Procédural Polyphonique
 * © EOLabs 2026. Pur Web Audio API - Zéro asset lourd, zéro latence, zéro fuite mémoire.
 * Composition polyphonique tunisienne authentique : Maqam Bayati & Rast (Oud, Ney, Kanoun & Darbouka).
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmTimer = null;
    this.activeNodes = new Set();
  }

  init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        try {
          // Bus Master avec Compresseur dynamique de studio pour empêcher toute distorsion
          this.masterCompressor = this.ctx.createDynamicsCompressor();
          this.masterCompressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
          this.masterCompressor.knee.setValueAtTime(24, this.ctx.currentTime);
          this.masterCompressor.ratio.setValueAtTime(6, this.ctx.currentTime);
          this.masterCompressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
          this.masterCompressor.release.setValueAtTime(0.2, this.ctx.currentTime);

          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(0.95, this.ctx.currentTime);

          this.masterGain.connect(this.masterCompressor);
          this.masterCompressor.connect(this.ctx.destination);
        } catch (_) {}
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      try { this.ctx.resume(); } catch (_) {}
    }
  }

  get destination() {
    return this.masterGain || (this.ctx ? this.ctx.destination : null);
  }

  // Enregistrement et libération automatique des nœuds audio pour garantir zéro fuite mémoire
  registerNode(node, stopTime = null) {
    if (!node) return;
    this.activeNodes.add(node);
    if (stopTime && this.ctx) {
      const cleanupDelay = Math.max(0.1, (stopTime - this.ctx.currentTime) + 0.1) * 1000;
      setTimeout(() => {
        try { node.disconnect(); } catch (_) {}
        this.activeNodes.delete(node);
      }, cleanupDelay);
    }
  }

  // 1. Tintement cristallin doré de pièces de Dinars (double éclat harmonique cuivre & or)
  playCoin() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    [1046.50, 1318.51, 2093.00].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + (i * 0.038);

      osc.type = i === 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.35, t + 0.08);

      gain.gain.setValueAtTime(i === 0 ? 0.14 : 0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.destination);

      osc.start(t);
      osc.stop(t + 0.18);
      this.registerNode(osc, t + 0.18);
      this.registerNode(gain, t + 0.18);
    });
  }

  // 2. Caisse enregistreuse de prestige (Tiroir mécanique vintage + carillon aigu)
  playCashRegister() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // A. Bruit mécanique d'ouverture de tiroir (glissière métallique et roulement)
    const osc1 = this.ctx.createOscillator();
    const filter1 = this.ctx.createBiquadFilter();
    const gain1 = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(360, now);
    osc1.frequency.exponentialRampToValueAtTime(95, now + 0.065);

    filter1.type = 'lowpass';
    filter1.frequency.setValueAtTime(650, now);

    gain1.gain.setValueAtTime(0.19, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(this.destination);

    osc1.start(now);
    osc1.stop(now + 0.07);
    this.registerNode(osc1, now + 0.07);

    // B. Carillon "Cha-Ching" aigu et scintillant
    [1567.98, 2093.00, 2637.02].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + 0.05 + idx * 0.035;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);

      osc.connect(gain);
      gain.connect(this.destination);

      osc.start(t);
      osc.stop(t + 0.28);
      this.registerNode(osc, t + 0.28);
    });
  }

  // 3. Verre de thé tunisien à la menthe (tasse fine cristalline)
  playTeaCup() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    [2489.02, 3135.96, 4186.01].forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + idx * 0.045;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.exponentialRampToValueAtTime(f * 1.15, t + 0.04);

      gain.gain.setValueAtTime(0.13, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.destination);

      osc.start(t);
      osc.stop(t + 0.15);
      this.registerNode(osc, t + 0.15);
    });
  }

  // 4. Son contextuel par type de commerce
  playWorkSound(bizId) {
    if (this.muted) return;
    this.init();
    if (bizId === 'kahwa' || bizId === 'salon_de_the') {
      this.playCoffeeSteam();
      this.playTeaCup();
    } else if (bizId === 'kaskrout' || bizId === 'fricasse' || bizId === 'restaurant') {
      this.playSizzle();
      this.playCoin();
    } else if (bizId === 'taxi_collectif' || bizId === 'showroom_auto') {
      this.playHorn();
    } else if (bizId === 'police_station') {
      this.playPoliceSiren();
    } else {
      this.playCashRegister();
    }
  }

  // Vapeur de café chaud / thé zzaouia
  playCoffeeSteam() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.16);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.frequency.linearRampToValueAtTime(1600, now + 0.16);
    filter.Q.setValueAtTime(3.8, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.destination);

    noise.start(now);
    noise.stop(now + 0.16);
    this.registerNode(noise, now + 0.16);
  }

  // Gril frémissant pour sandwichs et street-food
  playSizzle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.14);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (0.8 + 0.2 * Math.sin(i * 0.05));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3200, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.destination);

    noise.start(now);
    noise.stop(now + 0.14);
    this.registerNode(noise, now + 0.14);
  }

  // Clic tactile haptique UI (boutons, onglets, navigation)
  playTap() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

    osc.connect(gain);
    gain.connect(this.destination);

    osc.start(now);
    osc.stop(now + 0.038);
    this.registerNode(osc, now + 0.038);
  }

  // Vœu de prospérité dans la fontaine (pièce + clapotis d'eau)
  playFountainWish() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // A. Tintement aigu de la pièce
    this.playCoin();

    // B. Éclaboussure d'eau étincelante
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.05));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now + 0.05);
    filter.frequency.exponentialRampToValueAtTime(600, now + 0.22);
    filter.Q.setValueAtTime(3.2, now + 0.05);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.setValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.destination);

    noise.start(now + 0.05);
    noise.stop(now + 0.24);
    this.registerNode(noise, now + 0.24);
  }

  // Fanfare d'ascension de niveau royal (arpeggio 5 notes carillonnées)
  playLevelUp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50]; // C5, E5, G5, B5, C6
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.065;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.destination);

      osc.start(t);
      osc.stop(t + 0.35);
      this.registerNode(osc, t + 0.35);
    });
  }

  // 5. Klaxon tunisien classique (Louage / Taxi 504)
  playHorn() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    [440, 554.37].forEach(f => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now);
      osc.frequency.linearRampToValueAtTime(f * 1.02, now + 0.18);

      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.destination);

      osc.start(now);
      osc.stop(now + 0.2);
      this.registerNode(osc, now + 0.2);
    });
  }

  // 6. Sirène de police municipale
  playPoliceSiren() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.linearRampToValueAtTime(920, now + 0.25);
    osc.frequency.linearRampToValueAtTime(620, now + 0.5);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);

    osc.connect(gain);
    gain.connect(this.destination);

    osc.start(now);
    osc.stop(now + 0.52);
    this.registerNode(osc, now + 0.52);
  }

  // 7. Amélioration de niveau d'un commerce (Arpège ascendant triomphal en Maqam Rast)
  playUpgrade() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Do (523Hz), Ré (587Hz), Mi-demi-bémol (622Hz), Sol (784Hz), Do aigu (1046Hz)
    [523.25, 587.33, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + (idx * 0.045);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

      osc.connect(gain);
      gain.connect(this.destination);

      osc.start(t);
      osc.stop(t + 0.16);
      this.registerNode(osc, t + 0.16);
    });
  }

  // 8. Fanfare festive pour quête ou palier (Accords polyphoniques royaux)
  playEventFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const chords = [
      { t: 0, notes: [392.00, 523.25, 659.25] },
      { t: 0.12, notes: [440.00, 587.33, 698.46] },
      { t: 0.25, notes: [523.25, 659.25, 783.99, 1046.50] }
    ];

    chords.forEach(c => {
      c.notes.forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + c.t;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.11, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.destination);

        osc.start(t);
        osc.stop(t + 0.35);
        this.registerNode(osc, t + 0.35);
      });
    });
  }

  // 9. Grande fanfare de jalon Prestige (Célébration impériale tunisienne)
  playMilestoneFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    this.playEventFanfare();
    setTimeout(() => {
      this.playDarbouka(true);
    }, 200);
  }

  // 10. Fanfare frénétique Joujma Time (Roulement Darbouka + cascade d'accords Maqam)
  playJoujmaFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // A. Rafale rythmique Darbouka (Dum - Tak - Tak - Dum - Tak)
    [0.0, 0.08, 0.16, 0.24, 0.32].forEach((tOff, i) => {
      setTimeout(() => {
        if (!this.muted) this.playDarbouka(i === 0 || i === 3);
      }, tOff * 1000);
    });

    // B. Arpège ascendant triomphant (Do - Ré - Mi - Sol - La - Do aigu)
    const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    scale.forEach((freq, idx) => {
      const t = now + (idx * 0.055);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, t + 0.15);

      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.destination);

      osc.start(t);
      osc.stop(t + 0.22);
      this.registerNode(osc, t + 0.22);
    });
  }

  // 11. Récompense VIP de rue (Carillon double doré + scintillement)
  playVipReward() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    [1318.51, 1567.98, 2093.00, 2637.02].forEach((freq, i) => {
      const t = now + (i * 0.045);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, t + 0.12);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.destination);

      osc.start(t);
      osc.stop(t + 0.22);
      this.registerNode(osc, t + 0.22);
    });
  }

  // 12. Tic-tac de la Roue de la fortune
  playWheelTick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.025);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);

    osc.connect(gain);
    gain.connect(this.destination);

    osc.start(now);
    osc.stop(now + 0.028);
    this.registerNode(osc, now + 0.028);
  }

  // 11. Réussite d'un dilemme moral
  playDilemmaSuccess() {
    this.playUpgrade();
  }

  // 12. Buzzer de refus ou manque de fonds
  playBuzzer() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.15);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.destination);

    osc.start(now);
    osc.stop(now + 0.16);
    this.registerNode(osc, now + 0.16);
  }

  // 13. Percussion Darbouka tunisienne (Doum rond ou Tak claqué)
  playDarbouka(accent = false) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (accent) {
      // Tak claqué aigu et vibrant (bord de Darbouka)
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(300, now);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.destination);

      osc.start(now);
      osc.stop(now + 0.07);
      this.registerNode(osc, now + 0.07);
    } else {
      // Doum profond et résonant (centre de la peau de chèvre)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(48, now + 0.09);

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.destination);

      osc.start(now);
      osc.stop(now + 0.12);
      this.registerNode(osc, now + 0.12);
    }
  }

  // 14. COMPOSITEUR POLYPHONIQUE TUNISIEN (Oud, Ney, Kanoun & Darbouka en Maqam Bayati/Rast)
  startBGM() {
    if (this.bgmTimer || this.muted) return;
    this.init();
    if (!this.ctx) return;

    const bpm = 74;
    const stepDuration = 60 / bpm / 2; // ~405ms par croche (rythme Malfouf 2/4)
    let bgmStep = 0;

    // Orchestration harmonique tunisienne : 4 cycles d'accords Maqam Bayati & Rast
    const score = [
      // 1. Accord de base : Ré Maqam Bayati (D-Bayati)
      {
        bass: 73.42, // Ré (D2)
        oud: [146.83, 220.00, 293.66, 349.23], // Ré3, La3, Ré4, Fa4
        kanoun: [349.23, 392.00, 440.00, 523.25, 587.33], // Fa4, Sol4, La4, Do5, Ré5
        neyLead: 293.66 // Ré4
      },
      // 2. Accord de transition : Fa Majeur tunisien (F)
      {
        bass: 87.31, // Fa (F2)
        oud: [174.61, 220.00, 261.63, 349.23], // Fa3, La3, Do4, Fa4
        kanoun: [440.00, 523.25, 587.33, 659.25, 698.46], // La4, Do5, Ré5, Mi5, Fa5
        neyLead: 349.23 // Fa4
      },
      // 3. Cadence Sol (G-Bayati)
      {
        bass: 98.00, // Sol (G2)
        oud: [196.00, 246.94, 293.66, 392.00], // Sol3, Si-demi-bémol3, Ré4, Sol4
        kanoun: [392.00, 440.00, 523.25, 587.33, 440.00], // Sol4, La4, Do5, Ré5, La4
        neyLead: 392.00 // Sol4
      },
      // 4. Résolution La / Ré (A -> D)
      {
        bass: 110.00, // La (A2)
        oud: [220.00, 261.63, 329.63, 440.00], // La3, Do4, Mi4, La4
        kanoun: [523.25, 440.00, 392.00, 349.23, 293.66], // Do5, La4, Sol4, Fa4, Ré4
        neyLead: 440.00 // La4
      }
    ];

    // Synthèse instrumentale Oud tunisien (luth acoustique chaud à cordes pincées)
    const playOud = (freq, time, duration, peakGain = 0.024) => {
      if (!freq || this.muted || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(520, time);
      filter.frequency.exponentialRampToValueAtTime(140, time + duration);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(peakGain, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.destination);

      osc.start(time);
      osc.stop(time + duration + 0.04);
      this.registerNode(osc, time + duration + 0.04);
    };

    // Synthèse instrumentale Kanoun oriental (arpèges soyeux résonants)
    const playKanoun = (freq, time, duration, peakGain = 0.014) => {
      if (!freq || this.muted || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.25, time);
      filter.Q.setValueAtTime(2.8, time);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(peakGain, time + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.destination);

      osc.start(time);
      osc.stop(time + duration + 0.04);
      this.registerNode(osc, time + duration + 0.04);
    };

    // Synthèse instrumentale Ney mélodique solo (flûte de roseau avec vibrato LFO)
    const playNey = (freq, time, duration, peakGain = 0.018) => {
      if (!freq || this.muted || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      // Vibrato doux oriental (5.2 Hz)
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(5.2, time);
      lfoGain.gain.setValueAtTime(freq * 0.018, time);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 2.2, time);
      filter.Q.setValueAtTime(2.0, time);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(peakGain, time + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.destination);

      lfo.start(time);
      osc.start(time);
      lfo.stop(time + duration + 0.05);
      osc.stop(time + duration + 0.05);
      this.registerNode(osc, time + duration + 0.05);
      this.registerNode(lfo, time + duration + 0.05);
    };

    // Rythme procédural Darbouka intégré à la partition
    const playBgmDarbouka = (isDoum, time) => {
      if (this.muted || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (isDoum) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(96, time);
        osc.frequency.exponentialRampToValueAtTime(46, time + 0.08);
        gain.gain.setValueAtTime(0.022, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.1);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, time);
        osc.frequency.exponentialRampToValueAtTime(140, time + 0.04);
        gain.gain.setValueAtTime(0.015, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.055);
      }

      osc.connect(gain);
      gain.connect(this.destination);

      osc.start(time);
      osc.stop(time + (isDoum ? 0.1 : 0.06));
      this.registerNode(osc, time + (isDoum ? 0.1 : 0.06));
    };

    // Planificateur d'horloge audio absolue (zéro dérive temporelle)
    let nextNoteTime = this.ctx.currentTime + 0.08;
    this.bgmTimer = setInterval(() => {
      if (this.muted || !this.ctx) return;
      while (nextNoteTime < this.ctx.currentTime + 0.38) {
        const chordIdx = Math.floor(bgmStep / 8) % score.length;
        const pos = bgmStep % 8;
        const bar = score[chordIdx];

        // Voix 1 : Bourdon de l'Oud sur temps forts (0 et 4)
        if (pos === 0) {
          playOud(bar.bass, nextNoteTime, stepDuration * 3.6, 0.028);
        } else if (pos === 4) {
          playOud(bar.bass * 1.5, nextNoteTime, stepDuration * 2.2, 0.018);
        }

        // Voix 2 : Corde pincée d'Oud (contrepoint rythmique)
        if (pos === 1 || pos === 3 || pos === 6) {
          const oIdx = (pos === 1 ? 0 : pos === 3 ? 1 : 2) % bar.oud.length;
          playOud(bar.oud[oIdx], nextNoteTime, stepDuration * 1.8, 0.016);
        }

        // Voix 3 : Kanoun étincelant (ornementations en cascade)
        if (pos === 2 || pos === 5 || pos === 7) {
          const kIdx = (pos === 2 ? 0 : pos === 5 ? 2 : 4) % bar.kanoun.length;
          playKanoun(bar.kanoun[kIdx], nextNoteTime, stepDuration * 1.4, 0.012);
        }

        // Voix 4 : Ney solo chantant (mélodie expressive sur temps 0 et 4)
        if (pos === 0 || pos === 4) {
          playNey(bar.neyLead * (pos === 4 ? 1.12 : 1.0), nextNoteTime, stepDuration * 3.2, 0.015);
        }

        // Voix 5 : Rythme Malfouf tunisien (Doum sur 0, Tak sur 2 et 3)
        if (pos === 0) {
          playBgmDarbouka(true, nextNoteTime);
        } else if (pos === 2 || pos === 3) {
          playBgmDarbouka(false, nextNoteTime);
        }

        nextNoteTime += stepDuration;
        bgmStep++;
      }
    }, 60);
  }

  // Arrêt propre du BGM et déconnexion complète
  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    for (const node of this.activeNodes) {
      try { node.disconnect(); } catch (_) {}
    }
    this.activeNodes.clear();
    if (this.ctx && this.ctx.state === 'running') {
      try { this.ctx.suspend(); } catch (_) {}
    }
  }

  // 15. Carte de chkobba tunisienne (bruissement réaliste)
  playCardFlip() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.045);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

    osc.connect(gain);
    gain.connect(this.destination);

    osc.start(now);
    osc.stop(now + 0.055);
    this.registerNode(osc, now + 0.055);
  }

  // 16. Victoire Chkobba (Célébration festive tunisienne)
  playChkobbaWin() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Coup de darbouka triomphal
    this.playDarbouka(true);

    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + (idx * 0.055);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.16, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);

      osc.connect(gain);
      gain.connect(this.destination);

      osc.start(t);
      osc.stop(t + 0.14);
      this.registerNode(osc, t + 0.14);
    });
  }

  // Bascule Muet / Actif
  toggleSound() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
    return !this.muted;
  }
}

export const soundEngine = new SoundEngine();
