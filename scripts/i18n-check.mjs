/**
 * Paridad de diccionarios: cada clave del inglés existe en el español, con el
 * mismo tipo y —en los arreglos— la misma longitud.
 *
 *     npm run i18n:check
 *
 * El tipo de `t()` está anclado al inglés, y un `as` no detecta una clave que
 * falte en español: TypeScript lo acepta como cast y el fallo aparece en
 * producción como `undefined` impreso. Este script lo detecta antes.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = 'src/locales';
let problems = 0;

const kind = (v) => (Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v);

function compare(en, es, trail, file) {
  if (kind(en) !== kind(es)) {
    console.log(`${file} ${trail}: en=${kind(en)} es=${kind(es)}`);
    problems++;
    return;
  }
  if (Array.isArray(en)) {
    if (en.length !== es.length) {
      console.log(`${file} ${trail}: en tiene ${en.length} elementos, es tiene ${es.length}`);
      problems++;
    }
    en.forEach((v, i) => i < es.length && compare(v, es[i], `${trail}[${i}]`, file));
    return;
  }
  if (kind(en) === 'object') {
    for (const key of Object.keys(en)) {
      if (!(key in es)) {
        console.log(`${file} ${trail}.${key}: falta en español`);
        problems++;
      } else compare(en[key], es[key], `${trail}.${key}`, file);
    }
    for (const key of Object.keys(es)) {
      if (!(key in en)) {
        console.log(`${file} ${trail}.${key}: sobra en español (no existe en inglés)`);
        problems++;
      }
    }
  }
}

for (const file of readdirSync(join(root, 'en')).filter((f) => f.endsWith('.json'))) {
  const en = JSON.parse(readFileSync(join(root, 'en', file), 'utf8'));
  const es = JSON.parse(readFileSync(join(root, 'es', file), 'utf8'));
  compare(en, es, '', file);
}

if (problems) {
  console.log(`\n${problems} diferencia(s).`);
  process.exit(1);
}
console.log('Diccionarios en paridad.');
