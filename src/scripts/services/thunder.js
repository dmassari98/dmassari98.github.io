import { THUNDER_MIN_MS, THUNDER_RANGE_MS } from '../config/constants.js';

/**
 * Pianifica tuoni casuali: lampo delicato + rombo con leggero ritardo.
 * @param {{flash:(intensity:number)=>void, rumble:()=>void, getIntensity:()=>number}} deps
 */
export function createThunder({ flash, rumble, getIntensity }) {
  let timer = null;
  let first = null;

  function strike() {
    flash(getIntensity());
    setTimeout(rumble, 350);
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      strike();
      schedule();
    }, THUNDER_MIN_MS + Math.random() * THUNDER_RANGE_MS);
  }

  return {
    start() {
      first = setTimeout(strike, 1200);
      schedule();
    },
    stop() {
      clearTimeout(first);
      clearTimeout(timer);
    },
  };
}
