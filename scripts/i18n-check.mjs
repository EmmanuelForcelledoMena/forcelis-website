/**
 * Comprobación de diccionarios.
 *
 *     npm run i18n:check
 *
 * Desde el rebranding el español y el inglés NO son traducciones uno del otro:
 * son líneas de negocio distintas. Así que aquí se comprueban dos cosas
 * distintas:
 *
 *  1. PARIDAD de los diccionarios COMPARTIDOS (`common`, `contact`, `thanks`,
 *     `legal`): los usan componentes que se pintan en los dos idiomas —la
 *     barra, el pie, el formulario, los legales—, así que cada clave tiene que
 *     existir en los dos, con el mismo tipo y, en los arreglos, la misma
 *     longitud. TypeScript lo vigila también, pero no detecta un arreglo más
 *     corto ni una clave que sobra.
 *
 *  2. IDIOMA de cada página publicada (sobre `dist/`, si existe): ninguna
 *     página en español puede llevar frases de la plantilla en inglés y al
 *     revés. Se buscan las frases fijas de cada idioma —botones y
 *     encabezados— fuera de los elementos marcados con otro `lang`.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = 'src/locales';
const COMPARTIDOS = ['common.json', 'contact.json', 'thanks.json', 'legal.json'];
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
        console.log(`${file} ${trail}.${key}: falta en inglés`);
        problems++;
      }
    }
  }
}

for (const file of COMPARTIDOS) {
  const en = JSON.parse(readFileSync(join(root, 'en', file), 'utf8'));
  const es = JSON.parse(readFileSync(join(root, 'es', file), 'utf8'));
  compare(en, es, '', file);
}

// --- Idioma de las páginas publicadas -----------------------------------------
// Frases que solo existen en la plantilla de un idioma. Si aparecen en una
// página del otro, algo se coló.
const DELATORAS = {
  es: ['Book a call', 'Skip to main content', 'Privacy notice', 'Terms of service', 'Illustrative data'],
  en: ['Agenda una llamada', 'Ir al contenido principal', 'Aviso de privacidad', 'Datos ilustrativos', 'Servicios'],
};

if (existsSync('dist')) {
  const htmls = [];
  (function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (full.endsWith('.html')) htmls.push(full);
    }
  })('dist');

  for (const archivo of htmls) {
    const ruta = relative('dist', archivo).replace(/\\/g, '/');
    const lang = ruta.startsWith('es/') ? 'es' : ruta.startsWith('en/') ? 'en' : null;
    if (!lang) continue;
    let html = readFileSync(archivo, 'utf8');
    if (/<meta http-equiv="refresh"/i.test(html)) continue;
    // Fuera lo que está marcado como del otro idioma (el selector y su nota),
    // los scripts y los comentarios.
    html = html
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<(?!html\b)([a-z]+)\b[^>]*\slang="(en|es-MX|es)"[^>]*>[\s\S]*?<\/\1>/g, '');
    for (const frase of DELATORAS[lang]) {
      if (html.includes(frase)) {
        console.log(`${ruta}: contiene «${frase}», que es del otro idioma`);
        problems++;
      }
    }
  }
}

if (problems) {
  console.log(`\n${problems} problema(s).`);
  process.exit(1);
}
console.log('Diccionarios compartidos en paridad' + (existsSync('dist') ? ' y páginas sin texto del otro idioma.' : '.'));
