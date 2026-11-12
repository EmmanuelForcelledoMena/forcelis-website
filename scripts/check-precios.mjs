/**
 * Precios: un solo archivo, y el build no publica ninguno que no salga de él.
 *
 *     npm run check:precios
 *
 * Tres comprobaciones:
 *
 *  1. La configuración (`src/config/negocio.ts`) coincide con la lista de
 *     precios aprobada en el encargo del rebranding (noviembre de 2026). Si
 *     alguien cambia un precio a propósito, cambia también la tabla de abajo:
 *     así un cambio de precio siempre es una decisión explícita en dos sitios
 *     y nunca un dedazo en uno.
 *
 *  2. Ninguna página publicada muestra un importe que NO esté en la
 *     configuración. Si aparece «$4,500» en una plantilla, alguien escribió un
 *     precio a mano fuera del archivo único.
 *
 *  3. Con `mostrar_precios: false` no se imprime ningún importe de la
 *     plataforma (planes y empresa adicional) en ninguna página.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { negocio } from '../src/config/negocio.ts';

const problemas = [];

// --- 1. Configuración contra la lista aprobada ---------------------------------
const APROBADO = {
  planes: { individual: 299, profesional: 799, despacho: 1990, firma: 3990, enterprise: null },
  empresas: { individual: 1, profesional: 10, despacho: 40, firma: 100, enterprise: null },
  empresa_adicional: 59,
  uso_justo_cfdi_por_empresa_mes: 10000,
  servicios: {
    diagnostico: [6900, 9900],
    expansion: [18000, 25000],
    mercado: [9900, 19900],
    sesion: 3500,
    acompanamiento: { pequeno: 3900, expansion: null },
    franquicia: null,
  },
  oferta_lanzamiento: { plan: 'profesional', meses_gratis: 3, cupo: 50, descuento_despues: 0.5, meses_descuento: 3 },
  servicios_internacionales: { snapshot: 1500, entry: null, site: null, retainer: null },
};

const igual = (etiqueta, obtenido, esperado) => {
  if (JSON.stringify(obtenido) !== JSON.stringify(esperado)) {
    problemas.push(`configuración: ${etiqueta} es ${JSON.stringify(obtenido)}, lo aprobado es ${JSON.stringify(esperado)}`);
  }
};

for (const p of negocio.planes) {
  igual(`plan ${p.id}`, p.precio, APROBADO.planes[p.id]);
  igual(`empresas del plan ${p.id}`, p.empresas, APROBADO.empresas[p.id]);
}
igual('empresa_adicional', negocio.empresa_adicional, APROBADO.empresa_adicional);
igual('uso justo', negocio.uso_justo_cfdi_por_empresa_mes, APROBADO.uso_justo_cfdi_por_empresa_mes);
for (const s of negocio.servicios) {
  const valor =
    s.tipo_precio === 'fijo'
      ? s.precio
      : s.tipo_precio === 'rango'
        ? [s.desde, s.hasta]
        : s.tipo_precio === 'tramos'
          ? Object.fromEntries(s.tramos.map((t) => [t.id, t.precio]))
          : null;
  igual(`servicio ${s.id}`, valor, APROBADO.servicios[s.id]);
}
igual('oferta de lanzamiento', negocio.oferta_lanzamiento, APROBADO.oferta_lanzamiento);
for (const s of negocio.servicios_internacionales) {
  igual(`servicio internacional ${s.id}`, s.tipo_precio === 'desde' ? s.desde : null, APROBADO.servicios_internacionales[s.id]);
}

// --- 2 y 3. El build -------------------------------------------------------------
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

const plataforma = [...negocio.planes.map((p) => p.precio), negocio.empresa_adicional].filter((n) => n !== null);
const consultoria = negocio.servicios.flatMap((s) => [
  s.precio,
  s.desde,
  s.hasta,
  ...(s.tramos ?? []).map((t) => t.precio),
]);
const internacional = negocio.servicios_internacionales.map((s) => s.desde);
const permitidos = new Set([...plataforma, ...consultoria, ...internacional].filter((n) => typeof n === 'number'));

const aNumero = (txt) => Number(txt.replace(/[,\s]/g, ''));

for (const archivo of htmls) {
  let html = readFileSync(archivo, 'utf8');
  if (/<meta http-equiv="refresh"/i.test(html)) continue;
  // Los datos de la calculadora viajan en un JSON para el navegador; no son
  // texto publicado.
  html = html.replace(/<script[\s\S]*?<\/script>/g, '');
  const ruta = relative(DIST, archivo).replace(/\\/g, '/');

  // Importes en pesos: «$6,900», «MX$6,900». Importes en dólares: «USD 1,500».
  const encontrados = [
    ...[...html.matchAll(/(?:MX)?\$\s?(\d{1,3}(?:,\d{3})+|\d+)(?![\d,])/g)].map((m) => aNumero(m[1])),
    ...[...html.matchAll(/USD\s?(\d{1,3}(?:,\d{3})+|\d+)/g)].map((m) => aNumero(m[1])),
  ];
  for (const n of encontrados) {
    if (!permitidos.has(n)) problemas.push(`${ruta}: muestra el importe ${n}, que no está en negocio.ts`);
  }

  if (!negocio.mostrar_precios) {
    for (const n of encontrados) {
      if (plataforma.includes(n)) problemas.push(`${ruta}: muestra ${n} con mostrar_precios apagado`);
    }
  }
}

const estado = negocio.mostrar_precios ? 'encendido' : 'apagado';
if (problemas.length) {
  console.log(`Precios (interruptor ${estado}) — ${problemas.length} problema(s):\n`);
  problemas.forEach((p) => console.log('  ' + p));
  process.exit(1);
}
console.log(`Precios: la configuración coincide con lo aprobado y las ${htmls.length} páginas solo muestran importes de negocio.ts (interruptor ${estado}).`);
