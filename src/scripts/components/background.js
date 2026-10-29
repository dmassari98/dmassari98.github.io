import { $ } from '../utils/dom.js';

const SPEED = 0.6;

/** Sfondo animato: pioggia su canvas + lampi delicati. */
export function initBackground() {
  const canvas = $('#rain');
  const ctx = canvas.getContext('2d');
  const flashEl = $('#flash');
  let raining = false;
  let W, H, drops = [];

  function resize() {
    const dpr = devicePixelRatio || 1;
    W = innerWidth;
    H = innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.floor(Math.min(220, Math.floor(W / 5)) * 0.35);
    drops = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      len: 10 + Math.random() * 16,
      v: 12 + Math.random() * 10,
      a: 0.25 + Math.random() * 0.35,
    }));
  }
  addEventListener('resize', resize);
  resize();

  (function frame() {
    ctx.clearRect(0, 0, W, H);
    if (raining) {
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      for (const d of drops) {
        ctx.strokeStyle = `rgba(235,242,250,${d.a})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.len * 0.15, d.y + d.len);
        ctx.stroke();
        d.y += d.v * SPEED;
        d.x -= d.v * SPEED * 0.15;
        if (d.y > H) {
          d.y = -20;
          d.x = Math.random() * (W + 100);
        }
      }
    }
    requestAnimationFrame(frame);
  })();

  return {
    setRaining(value) {
      raining = value;
      document.body.classList.toggle('rain', value);
    },
    /** @param {number} intensity 0..1 (volume dello slider dei tuoni) */
    flash(intensity) {
      const q = 0.4 + 0.6 * intensity;
      flashEl.animate(
        [{ opacity: 0 }, { opacity: 0.22 * q }, { opacity: 0.05 * q }, { opacity: 0.16 * q }, { opacity: 0 }],
        { duration: 1100, easing: 'ease-out' },
      );
    },
  };
}
