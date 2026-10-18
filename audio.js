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

  // Musique d'ambiance procédurale (Mélodie orientale douce en boucle)
  startBGM() {
    if (this.bgmTimer || this.muted) return;
    this.init();

    const bpm = 114;
    const stepDuration = 60 / bpm / 4; // 16ème note (~131ms)
    let bgmStep = 0;

    const notes = {
      D3: 146.83,
      Ed3: 159.00,
      F3: 174.61,
      G3: 196.00,
      A3: 220.00,
      Bb3: 233.08,
      C4: 261.63,
      D4: 293.66,
      Ed4: 318.00,
      F4: 349.23,
      G4: 392.00,
      A4: 440.00
    };

    const melodyPattern = [
      notes.D4, null, notes.Ed4, notes.F4,
      notes.G4, notes.F4, notes.Ed4, notes.D4,
      notes.Ed4, notes.D4, notes.C4, notes.D4,
      notes.A3, null, notes.D4, null,
      notes.F4, notes.G4, notes.A4, notes.G4,
      notes.F4, notes.Ed4, notes.D4, notes.Ed4,
      notes.F4, notes.Ed4, notes.D4, notes.C4,
      notes.D4, null, notes.D4, null
    ];

    const percPattern = [
      'D', null, 'T', 'T', null, 'D', 'T', null,
      'D', 'T', 'T', null, 'T', 'D', 'T', 'T',
      'D', null, 'T', 'T', null, 'D', 'T', null,
      'D', 'T', 'T', 'T', 'D', 'D', 'T', null
    ];

    const bassPattern = [
      notes.D3, null, null, null, notes.A3 / 2, null, null, null,
      notes.D3, null, null, null, notes.A3 / 2, null, notes.D3, null,
      notes.D3, null, null, null, notes.A3 / 2, null, null, null,
      notes.G3 / 2, null, notes.A3 / 2, null, notes.D3, null, null, null
    ];

    const playPerc = (type, time) => {
      if (!type || this.muted || !this.ctx) return;
      if (type === 'D') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, time);
        osc.frequency.exponentialRampToValueAtTime(55, time + 0.12);
        gain.gain.setValueAtTime(0.35, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.25);
      } else if (type === 'T') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, time);
        osc.frequency.exponentialRampToValueAtTime(1800, time + 0.04);
        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 0.07);
      }
    };

    const playMelodyNote = (freq, time, duration) => {
      if (!freq || this.muted || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const sub = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      sub.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      sub.frequency.setValueAtTime(freq * 0.5, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1150, time);
      filter.Q.setValueAtTime(1.8, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.06, time + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.95);

      osc.connect(filter);
      sub.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      sub.start(time);
      osc.stop(time + duration);
      sub.stop(time + duration);
    };

    const playBassNote = (freq, time, duration) => {
      if (!freq || this.muted || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.08, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + duration);
    };

    let nextNoteTime = this.ctx.currentTime + 0.05;
    this.bgmTimer = setInterval(() => {
      if (this.muted || !this.ctx) return;
      while (nextNoteTime < this.ctx.currentTime + 0.25) {
        const curStep = bgmStep % 32;
        playPerc(percPattern[curStep], nextNoteTime);
        if (bassPattern[curStep]) {
          playBassNote(bassPattern[curStep], nextNoteTime, stepDuration * 2.2);
        }
        if (melodyPattern[curStep]) {
          playMelodyNote(melodyPattern[curStep], nextNoteTime, stepDuration * 1.8);
        }
        nextNoteTime += stepDuration;
        bgmStep++;
      }
    }, 50);
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
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
