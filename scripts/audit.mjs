/**
 * Auditoría del sitio construido.
 *
 *     npm run build && npm run audit
 *
 * Revisa `dist/` y no el código fuente, que es la única forma de comprobar lo
 * que de verdad se sirve: un enlace lo arma `path()` a partir del mapa de rutas,
 * y si ese mapa se desincroniza de los archivos de página el error solo existe
 * en la salida.
 *
 * Lo que verifica, y por qué cada cosa:
 *
 * - **Enlaces internos.** Que cada `href` interno corresponda a un archivo del
 *   build. Un slug traducido mal escrito da un 404 silencioso en un solo idioma.
 * - **Jerarquía de encabezados.** Un salto de `h2` a `h4` rompe la navegación
 *   por encabezados de un lector de pantalla.
 * - **Nombres accesibles.** Imágenes sin `alt`, SVG con `role="img"` sin
 *   etiqueta, controles de formulario sin ninguna etiqueta asociada.
 * - **Metadatos.** `description`, `canonical` y `lang` en cada página, y ningún
 *   `<title>` repetido entre dos URL.
 *
 * Sale con código 1 si encuentra algo, para que sirva en un hook o en CI.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';

if (!existsSync(DIST)) {
  console.error('No existe dist/. Corre `npm run build` antes.');
  process.exit(1);
}

const htmls = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (full.endsWith('.html')) htmls.push(full);
  }
})(DIST);

const problems = [];
const note = (file, kind, detail) => problems.push({ file: relative(DIST, file), kind, detail });

for (const file of htmls) {
  const html = readFileSync(file, 'utf8');

  // --- enlaces internos que no resuelven a un archivo del build ---------------
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = m[1];
    if (href.startsWith('//')) continue;
    const candidates = [
      join(DIST, href),
      join(DIST, href, 'index.html'),
      join(DIST, href.replace(/\/$/, '') + '.html'),
    ];
    if (!candidates.some((c) => existsSync(c))) note(file, 'enlace roto', href);
  }

  // --- jerarquía de encabezados ---------------------------------------------
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  const h1s = levels.filter((l) => l === 1).length;
  if (h1s !== 1) note(file, 'h1', `hay ${h1s}, debe haber exactamente 1`);
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1)
      note(file, 'salto de encabezado', `h${levels[i - 1]} -> h${levels[i]}`);
  }

  // --- nombres accesibles ----------------------------------------------------
  for (const m of html.matchAll(/<img(?![^>]*\salt=)[^>]*>/g))
    note(file, 'img sin alt', m[0].slice(0, 60));

  for (const m of html.matchAll(/<svg[^>]*role="img"[^>]*>/g))
    if (!/aria-label=|aria-labelledby=/.test(m[0]))
      note(file, 'svg role=img sin nombre', m[0].slice(0, 60));

  // Etiquetas envolventes: `<label><input ...> Texto</label>` es una asociación
  // implícita, tan válida como `for`. Se recogen primero los id que viven dentro
  // de un `<label>` — comprobarlo con una sola expresión por control daba
  // falsos positivos con el espacio en blanco entre las etiquetas.
  const wrappedIds = new Set();
  for (const m of html.matchAll(/<label\b[^>]*>([\s\S]*?)<\/label>/g))
    for (const inner of m[1].matchAll(/\bid="([^"]+)"/g)) wrappedIds.add(inner[1]);

  for (const m of html.matchAll(/<(input|select|textarea)([^>]*)>/g)) {
    const attrs = m[2];
    if (/type="(hidden|submit|button)"/.test(attrs)) continue;
    const id = attrs.match(/id="([^"]+)"/)?.[1];
    const labelled = /aria-label=|aria-labelledby=/.test(attrs);
    const hasFor = id && new RegExp(`<label[^>]*for="${id}"`).test(html);
    if (!labelled && !hasFor && !(id && wrappedIds.has(id)))
      note(file, 'control sin etiqueta', (id || m[0]).slice(0, 60));
  }

  // --- metadatos -------------------------------------------------------------
  if (!/<html[^>]*lang="[^"]+"/.test(html)) note(file, 'sin lang', '');
  if (!/<meta name="description"/.test(html)) note(file, 'sin description', '');
  if (!/rel="canonical"/.test(html) && !file.includes('404'))
    note(file, 'sin canonical', '');
}

// --- títulos duplicados entre páginas ---------------------------------------
const seen = new Map();
for (const file of htmls) {
  const title = readFileSync(file, 'utf8').match(/<title>([^<]*)<\/title>/)?.[1];
  if (!title) continue;
  if (seen.has(title)) note(file, 'title duplicado', `igual que ${relative(DIST, seen.get(title))}`);
  else seen.set(title, file);
}

console.log(`Páginas revisadas: ${htmls.length}`);

if (!problems.length) {
  console.log('Sin hallazgos.');
  process.exit(0);
}

const byKind = {};
for (const p of problems) (byKind[p.kind] ??= []).push(p);
for (const [kind, list] of Object.entries(byKind)) {
  console.log(`\n## ${kind} (${list.length})`);
  list.slice(0, 10).forEach((p) => console.log(`  ${p.file} :: ${p.detail}`));
  if (list.length > 10) console.log(`  ... y ${list.length - 10} más`);
}
process.exit(1);
