import { FOCUS_DEFAULT_MIN, BREAK_DEFAULT_MIN, TICK_MS } from '../config/constants.js';

/**
 * Logica del timer (nessun accesso al DOM).
 * @param {{onChange:(state:object)=>void, onComplete:(finishedMode:string)=>void}} hooks
 */
export function createTimer({ onChange, onComplete }) {
  const s = {
    mode: 'focus',
    running: false,
    remaining: FOCUS_DEFAULT_MIN * 60,
    end: 0,
    focus: FOCUS_DEFAULT_MIN,
    brk: BREAK_DEFAULT_MIN,
  };
  const total = () => (s.mode === 'focus' ? s.focus : s.brk) * 60;
  const emit = () => onChange({ ...s, total: total() });

  function setMode(mode, autoStart) {
    s.mode = mode;
    s.remaining = total();
    s.running = autoStart;
    if (autoStart) s.end = Date.now() + s.remaining * 1000;
    emit();
  }

  setInterval(() => {
    if (!s.running) return;
    s.remaining = (s.end - Date.now()) / 1000;
    if (s.remaining <= 0) {
      const finished = s.mode;
      onComplete(finished);
      // Dopo il focus parte la pausa; dopo la pausa il focus attende l'avvio.
      setMode(finished === 'focus' ? 'break' : 'focus', finished === 'focus');
      return;
    }
    emit();
  }, TICK_MS);

  return {
    emit,
    toggle() {
      if (s.running) {
        s.running = false;
      } else {
        s.running = true;
        s.end = Date.now() + s.remaining * 1000;
      }
      emit();
    },
    reset() {
      s.running = false;
      s.remaining = total();
      emit();
    },
    skip() {
      setMode(s.mode === 'focus' ? 'break' : 'focus', false);
    },
    setDuration(mode, minutes) {
      s[mode === 'focus' ? 'focus' : 'brk'] = minutes;
      if (s.mode === mode && !s.running) s.remaining = total();
      emit();
    },
  };
}
