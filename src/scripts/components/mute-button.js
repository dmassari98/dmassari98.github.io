import { $ } from '../utils/dom.js';

const ICON_ON = '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>';
const ICON_OFF = '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>';

/** Pulsante muto/smuto in basso a destra. */
export function initMuteButton({ isMuted, setMuted }) {
  const button = $('#mute');
  const icon = $('#muteIcon');

  function render() {
    icon.innerHTML = isMuted() ? ICON_OFF : ICON_ON;
    button.setAttribute('aria-label', isMuted() ? 'Riattiva suoni' : 'Muta suoni');
  }
  button.addEventListener('click', () => {
    setMuted(!isMuted());
    render();
  });
  render();
}
