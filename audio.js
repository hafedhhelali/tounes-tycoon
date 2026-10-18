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

    // Musique simple et douce : arpège calme (Am - F - C - G) + basse chaude, sans percussion.
    const bpm = 76;
    const stepDuration = 60 / bpm / 2; // croche
    let bgmStep = 0;

    const chords = [
      { bass: 110.00, arp: [220.00, 261.63, 329.63] },
      { bass: 87.31, arp: [174.61, 220.00, 261.63] },
      { bass: 130.81, arp: [261.63, 329.63, 392.00] },
      { bass: 98.00, arp: [196.00, 246.94, 293.66] }
    ];
    const arpOrder = [0, 1, 2, 1, 2, 1, 0, 1];

    const playSoft = (freq, time, duration, peak, type, cutoff) => {
      if (!freq || this.muted || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, time);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(cutoff, time);
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(peak, time + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + duration + 0.05);
    };

    let nextNoteTime = this.ctx.currentTime + 0.05;
    this.bgmTimer = setInterval(() => {
      if (this.muted || !this.ctx) return;
      while (nextNoteTime < this.ctx.currentTime + 0.25) {
        const bar = Math.floor(bgmStep / 8) % chords.length;
        const pos = bgmStep % 8;
        const chord = chords[bar];
        if (pos === 0) playSoft(chord.bass, nextNoteTime, stepDuration * 7, 0.07, 'sine', 300);
        playSoft(chord.arp[arpOrder[pos]], nextNoteTime, stepDuration * 2.5, 0.035, 'triangle', 1400);
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
