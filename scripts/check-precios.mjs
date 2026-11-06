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
 *   apagado → ninguna página contiene un importe de la suscripción.
 *   encendido → la página de Precios muestra al menos uno.
 *
 * En los DOS casos, la página de Precios se sirve con `noindex` y fuera del
 * sitemap, y nadie la enlaza. Eso ya no depende del interruptor: depende de
 * que el sitio dejara de vender software en el giro del 2026-11-06, y lo
 * decide `NOINDEX_PAGES` en `src/i18n/routes.ts`. El interruptor solo gobierna
 * si se imprimen o no los importes dentro de esa página retirada.
 *
 * Los precios de CONSULTORÍA —los seis servicios— no pasan por aquí: están
 * publicados siempre, porque son la oferta.
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
  ...negocio.servicios.map((s) => s.precio),
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

const rutasPrecios = ['/es/precios/'];

for (const archivo of htmls) {
  const html = readFileSync(archivo, 'utf8');
  if (/<meta http-equiv="refresh"/i.test(html)) continue;

  const encontrados = patrones.filter((p) => p.test(html));

  if (!negocio.mostrar_precios && encontrados.length) {
    anota(archivo, `aparece un importe con mostrar_precios apagado (${encontrados[0]})`);
  }

  const esPrecios = rutasPrecios.some((r) => archivo.includes(join(...r.split('/').filter(Boolean))));
  if (esPrecios) {
    // Retirada: siempre `noindex`, con o sin importes dentro.
    if (!/name="robots"[^>]*noindex/.test(html)) anota(archivo, 'debería llevar noindex');
    if (negocio.mostrar_precios && !encontrados.length)
      anota(archivo, 'no muestra ningún importe con mostrar_precios encendido');
  }

  // Ninguna página VIVA debe enlazar a Precios. Que una página retirada
  // enlace a otra retirada da igual: a ninguna de las dos se llega si no es
  // tecleando su URL, y reescribir sus enlaces solo serviría para tocar
  // páginas congeladas. Se reconocen por su propio `noindex`.
  const estaRetirada = /name="robots"[^>]*noindex/.test(html);
  if (!esPrecios && !estaRetirada) {
    for (const ruta of rutasPrecios) {
      // Sin cerrar la comilla: también cuenta un enlace con ancla o parámetros.
      if (html.includes(`href="${ruta}`)) anota(archivo, `enlaza a ${ruta}, que está retirada`);
    }
  }
}

for (const ruta of rutasPrecios) {
  if (sitemap.includes(ruta)) problemas.push(`sitemap: incluye ${ruta}, que está retirada`);
}

const estado = negocio.mostrar_precios ? 'ENCENDIDO' : 'apagado';
if (problemas.length) {
  console.log(`Interruptor de precios ${estado} — ${problemas.length} problema(s):\n`);
  problemas.forEach((p) => console.log('  ' + p));
  process.exit(1);
}
console.log(`Interruptor de precios ${estado}: coherente en las ${htmls.length} páginas del build.`);
