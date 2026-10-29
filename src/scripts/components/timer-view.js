import { $ } from '../utils/dom.js';
import { formatTime } from '../utils/format.js';
import { RING_CIRCUMFERENCE } from '../config/constants.js';

const els = {
  time: $('#time'),
  prog: $('#prog'),
  mode: $('#mode'),
  start: $('#start'),
};

export function renderTimer(state) {
  const seconds = Math.max(0, Math.ceil(state.remaining));
  els.time.textContent = formatTime(seconds);
  els.prog.style.strokeDashoffset = RING_CIRCUMFERENCE * (1 - state.remaining / state.total);
  els.mode.textContent = state.mode === 'focus' ? 'Focus' : 'Pausa';
  els.start.textContent = state.running ? 'Pausa' : 'Avvia';
  document.body.classList.toggle('break', state.mode === 'break');
  document.title = (state.running ? formatTime(seconds) + ' · ' : '') + 'Pomodoro';
}
