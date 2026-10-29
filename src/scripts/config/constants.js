export const FOCUS_DEFAULT_MIN = 25;
export const BREAK_DEFAULT_MIN = 5;
export const TICK_MS = 200;
/** Circonferenza dell'anello SVG (r = 120). */
export const RING_CIRCUMFERENCE = 754;
/** Volume sotto cui uno slider viene considerato spento. */
export const VOLUME_SNAP = 0.04;
/** Intervallo tra due tuoni: MIN + random * RANGE (ms). */
export const THUNDER_MIN_MS = 6000;
export const THUNDER_RANGE_MS = 9000;
/** Percorso dell'audio della pioggia, relativo a questo progetto. */
export const RAIN_AUDIO_URL = new URL('../../assets/audio/rain.mp3', import.meta.url);
