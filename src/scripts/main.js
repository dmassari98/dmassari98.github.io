import { $ } from './utils/dom.js';
import { createTimer } from './components/timer.js';
import { renderTimer } from './components/timer-view.js';
import { initMenu } from './components/menu.js';
import { initPalette } from './components/palette.js';
import { initMuteButton } from './components/mute-button.js';
import { initBackground } from './components/background.js';
import { createThunder } from './services/thunder.js';
import { ensureAudio, setVolume, setMuted, isMuted, playBell, playRumble } from './services/audio-engine.js';

const volumes = { rain: 0, thunder: 0, wind: 0 };

const background = initBackground();
const thunder = createThunder({
  flash: (intensity) => background.flash(intensity),
  rumble: playRumble,
  getIntensity: () => volumes.thunder,
});

const timer = createTimer({
  onChange: renderTimer,
  onComplete: playBell,
});

$('#start').addEventListener('click', () => {
  ensureAudio();
  timer.toggle();
});
$('#reset').addEventListener('click', () => timer.reset());
$('#skip').addEventListener('click', () => timer.skip());

initMenu({
  onDuration: (mode, minutes) => timer.setDuration(mode, minutes),
  onVolume(name, value) {
    const wasOn = volumes[name] > 0;
    volumes[name] = value;
    setVolume(name, value);
    if (name === 'rain') background.setRaining(value > 0);
    if (name === 'thunder') {
      if (!wasOn && value > 0) thunder.start();
      if (value === 0) thunder.stop();
    }
  },
});
initPalette();
initMuteButton({
  isMuted,
  setMuted: (value) => {
    ensureAudio();
    setMuted(value);
  },
});

timer.emit();
