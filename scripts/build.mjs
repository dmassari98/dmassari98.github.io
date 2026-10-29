// Copia src/ in dist/ (nessuna dipendenza). Uso: node scripts/build.mjs [--clean]
import { rmSync, cpSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const src = fileURLToPath(new URL('src/', root));
const dist = fileURLToPath(new URL('dist/', root));

rmSync(dist, { recursive: true, force: true });
if (process.argv.includes('--clean')) {
  console.log('dist/ rimossa');
} else {
  cpSync(src, dist, { recursive: true });
  console.log('Build completata: dist/');
}
