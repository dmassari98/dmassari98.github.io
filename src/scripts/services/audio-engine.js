import { RAIN_AUDIO_URL } from '../config/constants.js';

/** Volume massimo di ciascun suono (lo slider va da 0 a 1 su questa base). */
const BASE_VOLUME = { rain: 0.9, wind: 0.5, thunder: 1 };

let ctx, master, brownNoise, rainBuffer;
let muted = false;
const buses = {};

export function ensureAudio() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
    brownNoise = createBrownNoise();
  }
  if (ctx.state === 'suspended') ctx.resume();
}

function createBrownNoise() {
  const len = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const x = Math.random() * 2 - 1;
    last = (last + 0.02 * x) / 1.02;
    data[i] = last * 3.5;
  }
  return buf;
}

function loopSource(buffer) {
  const s = ctx.createBufferSource();
  s.buffer = buffer;
  s.loop = true;
  s.start(ctx.currentTime + Math.random());
  return s;
}

function loadRain() {
  rainBuffer ??= fetch(RAIN_AUDIO_URL)
    .then((r) => r.arrayBuffer())
    .then((data) => ctx.decodeAudioData(data));
  return rainBuffer;
}

/** Costruisce il grafo audio di ciascun suono, collegato al suo bus. */
const builders = {
  rain(out) {
    loadRain().then((buf) => {
      const s = ctx.createBufferSource();
      s.buffer = buf;
      s.loop = true;
      s.connect(out);
      s.start();
    });
  },
  wind(out) {
    const bp = ctx.createBiquadFilter();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const level = ctx.createGain();
    bp.type = 'bandpass';
    bp.frequency.value = 450;
    bp.Q.value = 0.8;
    lfo.frequency.value = 0.12;
    lfoGain.gain.value = 250;
    lfo.connect(lfoGain);
    lfoGain.connect(bp.frequency);
    lfo.start();
    level.gain.value = 2.2;
    loopSource(brownNoise).connect(bp);
    bp.connect(level);
    level.connect(out);
  },
  thunder() {
    /* Il bus esiste solo per ricevere i rombi generati da playRumble(). */
  },
};

export function setVolume(name, value) {
  ensureAudio();
  if (!buses[name]) {
    const bus = ctx.createGain();
    bus.gain.value = 0;
    bus.connect(master);
    buses[name] = bus;
    builders[name](bus);
  }
  const gain = buses[name].gain;
  gain.cancelScheduledValues(ctx.currentTime);
  gain.setTargetAtTime(value * BASE_VOLUME[name], ctx.currentTime, 0.15);
}

export function setMuted(value) {
  muted = value;
  if (master) master.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.15);
}
export const isMuted = () => muted;

export function playRumble() {
  if (!ctx || !buses.thunder) return;
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  const lp = ctx.createBiquadFilter();
  const env = ctx.createGain();
  src.buffer = brownNoise;
  src.loop = true;
  lp.type = 'lowpass';
  lp.frequency.value = 160;
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(1.6, t + 0.5);
  env.gain.setTargetAtTime(0, t + 0.9, 1.1);
  src.connect(lp);
  lp.connect(env);
  env.connect(buses.thunder);
  src.start(t, Math.random() * 2);
  src.stop(t + 6);
}

/** Campanellina di fine timer. */
export function playBell() {
  ensureAudio();
  const t = ctx.currentTime;
  [[880, 0.22], [1760, 0.09], [2637, 0.05]].forEach(([freq, vol], i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.8 - i * 0.5);
    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + 3);
  });
}
