/**
 * Tounes Tycoon - Moteur Audio Procédural
 * © EOLabs 2026. Pur Web Audio API - Zéro asset lourd, zéro latence.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Tintement de pièces de Dinars
  playCoin() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Tintement du verre de thé à la cuillère
  playTeaCup() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(2800, now + 0.04);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Double coup de klaxon de Louage / Taxi Collectif (Tut Tut !)
  playHorn() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;

    const playBeep = (startTime) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, startTime); // A4
      osc.frequency.setValueAtTime(466.16, startTime + 0.05); // Bb4

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.12);
    };

    playBeep(now);
    playBeep(now + 0.15);
  }

  // Sirène de Police tunisienne réaliste à deux tons (Pin-Pon Pin-Pon !)
  playPoliceSiren() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;

    // Deux tonalités alternées (La 440 Hz et Ré 587 Hz)
    const tones = [
      { f: 587.33, dur: 0.22 }, // Re5
      { f: 440.00, dur: 0.22 }, // La4
      { f: 587.33, dur: 0.22 }, // Re5
      { f: 440.00, dur: 0.22 }  // La4
    ];

    let t = now;
    tones.forEach((tone) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(tone.f, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + tone.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + tone.dur);

      t += tone.dur;
    });
  }

  // Son de déblocage / Achat de niveau
  playUpgrade() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;

    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + (idx * 0.05);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.08);
    });
  }

  // Fanfare d'événement
  playEventFanfare() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;

    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + (idx * 0.08);

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.15);
    });
  }

  // Célébration Milestone Majestueux (Feux d'artifice sonores)
  playMilestoneFanfare() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + (i * 0.06);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  // Son de Roue de la fortune (Roue qui tourne - tic tic tic)
  playWheelTick() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  // Son de validation de décision de dilemme
  playDilemmaSuccess() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    [440, 660].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + (i * 0.07);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    });
  }

  // Son d'erreur / Solde insuffisant (Buzzer doux)
  playBuzzer() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.18);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // Son de tambour darbouka / derbouka au tap de mini-jeu
  playDarbouka(accent = false) {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = accent ? 220 : 130;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);

    gain.gain.setValueAtTime(accent ? 0.35 : 0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Musique d'ambiance feutrée, type lounge méditerranéen relaxant (Guitare nylon & Rhodes doux)
    // Musique tunisienne classique authentique (Malouf traditionnel - Maqam Bayati / Rast sans copyright)
  // Simulation procédurale d'Oud tunisien (عود تونسي) et de Kanoun doux (قانون)
  startBGM() {
    if (this.bgmTimer || this.muted) return;
    this.init();

    // Rythme de Malouf tunisien apaisant (Dukah / Samai 72 BPM)
    const bpm = 72;
    const stepDuration = 60 / bpm / 2; // ~416ms
    let bgmStep = 0;

    // Gamme Maqam Bayati / Rast tunisien traditionnel : D, E-half-flat (~155Hz), F, G, A, Bb, C, D
    // Fréquences harmoniques de l'Oud et du Kanoun tunisien
    const maloufChords = [
      {
        bass: 73.42, // Ré (D2)
        oud: [146.83, 220.00, 293.66, 349.23], // D3, A3, D4, F4
        kanoun: [349.23, 392.00, 440.00, 523.25, 587.33] // F4, G4, A4, C5, D5
      },
      {
        bass: 87.31, // Fa (F2)
        oud: [174.61, 220.00, 261.63, 349.23], // F3, A3, C4, F4
        kanoun: [440.00, 523.25, 587.33, 659.25, 698.46] // A4, C5, D5, E5, F5
      },
      {
        bass: 98.00, // Sol (G2)
        oud: [196.00, 246.94, 293.66, 392.00], // G3, B3, D4, G4
        kanoun: [392.00, 440.00, 523.25, 587.33, 440.00] // G4, A4, C5, D5, A4
      },
      {
        bass: 110.00, // La (A2)
        oud: [220.00, 261.63, 329.63, 440.00], // A3, C4, E4, A4
        kanoun: [523.25, 440.00, 392.00, 349.23, 293.66] // C5, A4, G4, F4, D4
      }
    ];

    // Synthèse instrumentale Oud tunisien feutré (corde pincée résonante et boisée)
    const playOudNote = (freq, time, duration, peakGain = 0.025) => {
      if (!freq || this.muted || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(480, time);
      filter.frequency.exponentialRampToValueAtTime(140, time + duration);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(peakGain, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + duration + 0.05);
    };

    // Synthèse Kanoun oriental subtil (arpège métallique soyeux)
    const playKanounNote = (freq, time, duration, peakGain = 0.015) => {
      if (!freq || this.muted || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.2, time);
      filter.Q.setValueAtTime(3.0, time);

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(peakGain, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + duration + 0.05);
    };

    let nextNoteTime = this.ctx.currentTime + 0.08;
    this.bgmTimer = setInterval(() => {
      if (this.muted || !this.ctx) return;
      while (nextNoteTime < this.ctx.currentTime + 0.35) {
        const chordIdx = Math.floor(bgmStep / 8) % maloufChords.length;
        const pos = bgmStep % 8;
        const chord = maloufChords[chordIdx];

        // Bourdon de l'Oud (قرارة العود) sur les temps 0 et 4
        if (pos === 0) {
          playOudNote(chord.bass, nextNoteTime, stepDuration * 3.5, 0.032);
        } else if (pos === 4) {
          playOudNote(chord.bass * 1.5, nextNoteTime, stepDuration * 2.2, 0.02);
        }

        // Pincements de cordes d'Oud traditionnels
        if (pos === 1 || pos === 3 || pos === 6) {
          const oudIdx = (pos === 1 ? 0 : pos === 3 ? 1 : 2) % chord.oud.length;
          playOudNote(chord.oud[oudIdx], nextNoteTime, stepDuration * 1.8, 0.018);
        }

        // Répétitions et ornementations douces de Kanoun (زخرفة القانون)
        if (pos === 2 || pos === 5 || pos === 7) {
          const kIdx = (pos === 2 ? 0 : pos === 5 ? 2 : 4) % chord.kanoun.length;
          playKanounNote(chord.kanoun[kIdx], nextNoteTime, stepDuration * 1.4, 0.012);
        }

        nextNoteTime += stepDuration;
        bgmStep++;
      }
    }, 60);
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.ctx && this.ctx.state === 'running') {
      try { this.ctx.suspend(); } catch(e) {}
    }
  }

  // Son de carte de chkobba
  playCardFlip() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Son de réussite Chkobba !
  playChkobbaWin() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = now + (idx * 0.06);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.12);
    });
  }

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

