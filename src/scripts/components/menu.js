import { $, $$, clamp } from '../utils/dom.js';
import { VOLUME_SNAP } from '../config/constants.js';

/**
 * Menu espandibile: slider di durata e slider verticali dei suoni.
 * @param {{onDuration:(mode:string,min:number)=>void, onVolume:(name:string,value:number)=>void}} hooks
 */
export function initMenu({ onDuration, onVolume }) {
  const menu = $('#menu');

  $('#burger').addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#menu') && !e.target.closest('#burger')) menu.classList.remove('open');
  });

  $('#focus').addEventListener('input', (e) => {
    $('#fv').textContent = e.target.value + ' min';
    onDuration('focus', +e.target.value);
  });
  $('#brk').addEventListener('input', (e) => {
    $('#bv').textContent = e.target.value + ' min';
    onDuration('break', +e.target.value);
  });

  const volumes = {};
  $$('.vs').forEach((el) => {
    const name = el.dataset.s;
    volumes[name] = 0;

    const apply = (value) => {
      const v = value < VOLUME_SNAP ? 0 : clamp(value);
      volumes[name] = v;
      $('.fill', el).style.height = v * 100 + '%';
      onVolume(name, v);
    };
    const fromPointer = (e) => {
      const r = el.getBoundingClientRect();
      apply(clamp(1 - (e.clientY - r.top) / r.height));
    };

    let dragging = false;
    el.addEventListener('pointerdown', (e) => {
      el.setPointerCapture(e.pointerId);
      dragging = true;
      fromPointer(e);
    });
    el.addEventListener('pointermove', (e) => dragging && fromPointer(e));
    el.addEventListener('pointerup', () => (dragging = false));
    el.addEventListener('pointercancel', () => (dragging = false));
    el.addEventListener('keydown', (e) => {
      const step = e.key === 'ArrowUp' ? 0.1 : e.key === 'ArrowDown' ? -0.1 : 0;
      if (step) apply(volumes[name] + step);
    });
  });
}
