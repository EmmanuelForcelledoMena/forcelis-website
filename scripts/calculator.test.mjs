/**
 * Casos de la calculadora de margen.
 *
 *     npm run test:calc
 *
 * La calculadora es la única pieza del sitio que hace aritmética con el dinero
 * del cliente, y se equivoca en silencio: un plan mal elegido justo en el
 * umbral —31 empresas, 74 empresas— se ve perfectamente razonable en pantalla.
 * Por eso los casos están escritos aquí, con los números aprobados, y corren en
 * la misma orden que la auditoría.
 *
 * Importa `negocio.ts` TAL CUAL, con el borrado de tipos nativo de Node
 * (`--experimental-strip-types`). No hay una segunda copia de la fórmula ni de
 * los precios que pueda desincronizarse: si alguien cambia una mensualidad en
 * la configuración y rompe un umbral, esto falla.
 */
import { strict as assert } from 'node:assert';
import { negocio, planRecomendado } from '../src/config/negocio.ts';

/** Lo que enseña la calculadora para unas entradas dadas. */
function resultado(N, n, p, fundador = false) {
  const { plan, costo } = planRecomendado(N);
  const costoFinal = fundador ? costo * negocio.fundadores.descuento : costo;
  const ingreso = n * p;
  return { plan: plan.id, costo: costoFinal, ingreso, margen: ingreso - costoFinal };
}

// N, n, p, plan esperado, costo, ingreso, margen
const casos = [
  [5, 2, 500, 'profesional', 799, 1000, 201],
  [10, 4, 500, 'profesional', 799, 2000, 1201],
  [30, 10, 500, 'profesional', 1979, 5000, 3021],
  [31, 10, 500, 'despacho', 1990, 5000, 3010],
  [40, 15, 500, 'despacho', 1990, 7500, 5510],
  [73, 30, 500, 'despacho', 3937, 15000, 11063],
  [74, 30, 500, 'firma', 3990, 15000, 11010],
];

let fallos = 0;

const comprobar = (etiqueta, obtenido, esperado) => {
  try {
    assert.deepEqual(obtenido, esperado);
    console.log(`  ok    ${etiqueta}`);
  } catch {
    console.log(
      `  FALLA ${etiqueta}\n` +
        `        esperado ${esperado.plan} · costo ${esperado.costo} · margen ${esperado.margen}\n` +
        `        obtenido ${obtenido.plan} · costo ${obtenido.costo} · margen ${obtenido.margen}`,
    );
    fallos++;
  }
};

for (const [N, n, p, plan, costo, ingreso, margen] of casos) {
  comprobar(`N=${N} n=${n} p=${p}`, resultado(N, n, p), { plan, costo, ingreso, margen });
}

comprobar('N=40 n=15 p=500 con precio de fundador', resultado(40, 15, 500, true), {
  plan: 'despacho',
  costo: 995,
  ingreso: 7500,
  margen: 6505,
});

if (fallos) {
  console.log(`\n${fallos} caso(s) fallando.`);
  process.exit(1);
}
console.log(`\nLos ${casos.length + 1} casos pasan.`);
