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
  startBGM() {
    if (this.bgmTimer || this.muted) return;
    this.init();

    // Rythme lounge doux 60 BPM (1 battement = 1000ms, step = 500ms)
    // Progression harmonique apaisante : Dm9 -> G13 -> Cmaj9 -> Am9
    const bpm = 60;
    const stepDuration = 60 / bpm / 2; // 500ms par temps
    let bgmStep = 0;

    const chords = [
      {
        bass: 73.42, // D2
        nylon: [146.83, 220.00, 261.63, 329.63], // D3, A3, C4, E4 (Dm9)
        melody: [329.63, 392.00, 440.00, 329.63]
      },
      {
        bass: 98.00, // G2
        nylon: [146.83, 196.00, 246.94, 329.63], // D3, G3, B3, E4 (G13)
        melody: [293.66, 329.63, 392.00, 293.66]
      },
      {
        bass: 65.41, // C2
        nylon: [130.81, 196.00, 246.94, 293.66], // C3, G3, B3, D4 (Cmaj9)
        melody: [246.94, 293.66, 329.63, 246.94]
      },
      {
        bass: 110.00, // A2
        nylon: [164.81, 220.00, 261.63, 329.63], // E3, A3, C4, E4 (Am9)
        melody: [261.63, 293.66, 329.63, 220.00]
      }
    ];

    // Synthèse Rhodes feutré / Guitare nylon acoustique sans aucun sifflement strident
    const playLoungeVoice = (freq, time, duration, peakGain, isBass = false) => {
      if (!freq || this.muted || !this.ctx) return;

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      // Forme d'onde sine / triangle douce, sans harmoniques agressives
      osc.type = isBass ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      // Filtre passe-bas chaleureux : coupe les aigus grinçants
      filter.type = 'lowpass';
      const cutoff = isBass ? 160 : 420;
      filter.frequency.setValueAtTime(cutoff, time);
      filter.frequency.exponentialRampToValueAtTime(Math.max(60, cutoff * 0.4), time + duration);

      // Enveloppe ADSR feutrée (attaque douce ~30ms, extinction progressive)
      gain.gain.setValueAtTime(0.00001, time);
      gain.gain.linearRampToValueAtTime(peakGain, time + (isBass ? 0.08 : 0.035));
      gain.gain.exponentialRampToValueAtTime(0.00001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + duration + 0.05);
    };

    let nextNoteTime = this.ctx.currentTime + 0.1;
    this.bgmTimer = setInterval(() => {
      if (this.muted || !this.ctx) return;
      while (nextNoteTime < this.ctx.currentTime + 0.35) {
        const chordIdx = Math.floor(bgmStep / 8) % chords.length;
        const pos = bgmStep % 8;
        const chord = chords[chordIdx];

        // 1. Basse feutrée ronde sur les temps 0 et 4
        if (pos === 0) {
          playLoungeVoice(chord.bass, nextNoteTime, stepDuration * 3.8, 0.035, true);
        } else if (pos === 4) {
          playLoungeVoice(chord.bass * 1.5, nextNoteTime, stepDuration * 2.5, 0.022, true);
        }

        // 2. Arpège nylon délicat
        if (pos === 1 || pos === 3 || pos === 5 || pos === 7) {
          const noteIndex = Math.floor(pos / 2) % chord.nylon.length;
          playLoungeVoice(chord.nylon[noteIndex], nextNoteTime, stepDuration * 1.6, 0.016, false);
        }

        // 3. Touche mélodique Rhodes en sourdine
        if (pos === 2 || pos === 6) {
          const melNote = chord.melody[(pos === 2 ? 0 : 2) % chord.melody.length];
          playLoungeVoice(melNote, nextNoteTime, stepDuration * 2.2, 0.012, false);
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

