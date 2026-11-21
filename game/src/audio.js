// audio.js — all sounds are WebAudio oscillator synth, no audio files.
export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.ready = false;
  }

  ensure() {
    if (this.ready) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.ready = true;
    } catch (e) {
      this.ready = false;
    }
  }

  resume() {
    this.ensure();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  tone(freq, dur, type, gain, when) {
    if (this.muted || !this.ctx) return;
    const t0 = this.ctx.currentTime + (when || 0);
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain || 0.12, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  clickTick() {
    this.resume();
    this.tone(660, 0.06, 'triangle', 0.06);
  }

  foundChime() {
    this.resume();
    this.tone(523.25, 0.14, 'sine', 0.14);
    this.tone(659.25, 0.14, 'sine', 0.14, 0.08);
    this.tone(783.99, 0.22, 'sine', 0.16, 0.16);
  }

  wrongBuzz() {
    this.resume();
    this.tone(160, 0.22, 'sawtooth', 0.1);
    this.tone(110, 0.28, 'sawtooth', 0.09, 0.05);
  }

  hintDing() {
    this.resume();
    this.tone(880, 0.12, 'sine', 0.1);
    this.tone(1174.66, 0.18, 'sine', 0.1, 0.09);
  }

  winArpeggio() {
    this.resume();
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    notes.forEach((f, i) => this.tone(f, 0.24, 'triangle', 0.13, i * 0.11));
  }

  loseTone() {
    this.resume();
    this.tone(392, 0.25, 'triangle', 0.1);
    this.tone(311.13, 0.3, 'triangle', 0.1, 0.2);
    this.tone(233.08, 0.45, 'triangle', 0.1, 0.42);
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}
