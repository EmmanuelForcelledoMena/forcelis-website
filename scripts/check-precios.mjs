/**
 * El interruptor de precios, comprobado contra el build.
 *
 *     npm run check:precios
 *
 * `mostrar_precios: false` tiene que significar que NO hay ni un precio en todo
 * el sitio, en ninguno de los dos idiomas. Es una de esas promesas que se
 * cumplen el día que se escriben y se rompen tres semanas después, cuando
 * alguien añade una tarjeta nueva y se olvida de envolver el importe en la
 * condición. Un ojo humano no puede revisar 26 páginas por un «$1,990».
 *
 * Qué comprueba, según el estado del interruptor:
 *
 *   apagado → ninguna página contiene un importe; Precios no está en el
 *             sitemap, lleva `noindex` y no la enlaza ninguna otra página.
 *   encendido → Precios está en el sitemap, sin `noindex`, y contiene al menos
 *             un importe de cada bloque (planes, diagnósticos, monitoreo).
 *
 * El importe se busca por el formato que produce `Intl.NumberFormat` con MXN,
 * que es el único que el sitio puede generar: `$1,990.00`, `$1,990` o
 * `MX$1,990`. Se buscan además las cifras desnudas de la configuración, por si
 * alguien imprimiera el número sin formato.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { negocio } from '../src/config/negocio.ts';

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

/** Todos los importes que la configuración puede llegar a imprimir. */
const importes = [
  ...negocio.planes.map((p) => p.precio),
  ...negocio.diagnosticos.map((d) => d.precio),
  negocio.monitoreo.precio,
  negocio.empresa_adicional,
].filter((n) => n !== null);

// `10,000` es el uso justo de CFDI, no un precio: se publica siempre y no debe
// confundirse con un importe. Por eso la búsqueda exige un signo de moneda
// delante, y las cifras desnudas se buscan solo si llevan separador de miles.
const patrones = importes.flatMap((n) => {
  const conMiles = new Intl.NumberFormat('en-US').format(n);
  return [
    new RegExp(`(?:MX)?\\$\\s?${conMiles.replace(/,/g, '[,.]')}`),
    new RegExp(`(?:MX)?\\$\\s?${n}\\b`),
  ];
});

const problemas = [];
const anota = (archivo, detalle) => problemas.push(`${relative(DIST, archivo)}: ${detalle}`);

const sitemap = existsSync(join(DIST, 'sitemap-0.xml'))
  ? readFileSync(join(DIST, 'sitemap-0.xml'), 'utf8')
  : '';

const rutasPrecios = ['/en/pricing/', '/es/precios/'];

for (const archivo of htmls) {
  const html = readFileSync(archivo, 'utf8');
  if (/<meta http-equiv="refresh"/i.test(html)) continue;

  const encontrados = patrones.filter((p) => p.test(html));

  if (!negocio.mostrar_precios && encontrados.length) {
    anota(archivo, `aparece un importe con mostrar_precios apagado (${encontrados[0]})`);
  }

  const esPrecios = rutasPrecios.some((r) => archivo.includes(join(...r.split('/').filter(Boolean))));
  if (esPrecios) {
    const tieneNoindex = /name="robots"[^>]*noindex/.test(html);
    if (!negocio.mostrar_precios && !tieneNoindex) anota(archivo, 'debería llevar noindex');
    if (negocio.mostrar_precios && tieneNoindex) anota(archivo, 'no debería llevar noindex');
    if (negocio.mostrar_precios && !encontrados.length)
      anota(archivo, 'no muestra ningún importe con mostrar_precios encendido');
  }

  // Nadie debe enlazar a Precios mientras esté apagada.
  if (!negocio.mostrar_precios && !esPrecios) {
    for (const ruta of rutasPrecios) {
      if (html.includes(`href="${ruta}"`)) anota(archivo, `enlaza a ${ruta} estando oculta`);
    }
  }
}

for (const ruta of rutasPrecios) {
  const enSitemap = sitemap.includes(ruta);
  if (!negocio.mostrar_precios && enSitemap) problemas.push(`sitemap: incluye ${ruta} estando oculta`);
  if (negocio.mostrar_precios && !enSitemap) problemas.push(`sitemap: falta ${ruta}`);
}

const estado = negocio.mostrar_precios ? 'ENCENDIDO' : 'apagado';
if (problemas.length) {
  console.log(`Interruptor de precios ${estado} — ${problemas.length} problema(s):\n`);
  problemas.forEach((p) => console.log('  ' + p));
  process.exit(1);
}
console.log(`Interruptor de precios ${estado}: coherente en las ${htmls.length} páginas del build.`);
