import { $, $$ } from '../utils/dom.js';
import { PALETTES } from '../config/palettes.js';

const gradient = (a, b) => `linear-gradient(160deg,${a},${b})`;

/** Selettore del gradiente di sfondo (6 chiari + 6 scuri). */
export function initPalette() {
  const panel = $('#pal');
  const button = $('#grad');

  PALETTES.forEach((p, i) => {
    const sw = document.createElement('button');
    sw.className = 'sw';
    sw.style.background = gradient(p.from, p.to);
    sw.setAttribute('aria-label', `Sfondo ${p.theme === 'light' ? 'chiaro' : 'scuro'} ${(i % 6) + 1}`);
    sw.addEventListener('click', () => apply(i));
    panel.appendChild(sw);
  });

  function apply(i) {
    const { from, to, theme } = PALETTES[i];
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.setProperty('--bg1', from);
    root.style.setProperty('--bg2', to);
    button.style.background = gradient(from, to);
    $$('.sw').forEach((s, j) => s.classList.toggle('sel', j === i));
  }

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#pal')) panel.classList.remove('open');
  });

  // Parte dal tema preferito dal dispositivo.
  const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
  apply(PALETTES.findIndex((p) => p.theme === (prefersDark ? 'dark' : 'light')));
}
