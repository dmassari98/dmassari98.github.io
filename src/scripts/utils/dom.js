export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
export const clamp = (x, min = 0, max = 1) => Math.min(max, Math.max(min, x));
