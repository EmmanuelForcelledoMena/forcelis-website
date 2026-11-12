/**
 * Genera todos los recursos de marca a partir de UNA geometría:
 *
 *   public/brand/simbolo.svg                 el símbolo solo
 *   public/brand/logo-horizontal.svg         símbolo + FORCELIS, para fondos claros
 *   public/brand/logo-horizontal-blanco.svg  todo en blanco, para fondos oscuros o foto
 *   public/brand/patron.svg                  barras diagonales (rojo, vino, arena)
 *   public/favicon.svg, favicon-16/32/48.png, favicon.ico, apple-touch-icon.png
 *   public/og-image.png                      1200×630, fondo negro, símbolo y logotipo
 *
 *     npm run build:brand
 *
 * DE DÓNDE SALE LA GEOMETRÍA. Las coordenadas del símbolo se leyeron de los
 * vectores del PDF de marca (página 1, «Logo mark»), con la lista de operadores
 * de pdf.js: son los vértices exactos que exportó Illustrator, pasados a un
 * sistema con el eje Y hacia abajo. No es un redibujo.
 *
 * Los colores también salen del PDF: la barra izquierda es #C63030 —un rojo más
 * claro que el de la paleta, presente solo en el símbolo—, la central #A92928
 * (`--fc-rojo`) y la derecha #772014 (`--fc-vino`). Las etiquetas del PDF
 * dicen #BEB7A4 en todos los colores por error; los valores son los de los
 * rellenos, no los de las etiquetas.
 *
 * EL LOGOTIPO. «FORCELIS» va en Futura en el PDF. Futura es de pago, así que se
 * dibuja con Jost 500 —su sustituto libre— y se convierte a trazos: el SVG no
 * depende de ninguna fuente instalada y se ve igual en cualquier sitio. La caja
 * del texto se ajusta a la medida del PDF (posición, alto de mayúsculas y
 * ancho), así que la proporción símbolo/texto es la del original.
 *
 * Si algún día se compra Futura, basta con apuntar `FUENTE_LOGO` a su archivo
 * y volver a correr esto: el ajuste a la caja es automático.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import opentype from 'opentype.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const brandDir = join(root, 'public/brand');
mkdirSync(brandDir, { recursive: true });

// --- Paleta (la misma de `src/styles/global.css`) ---------------------------
const VINO = '#772014';
const ROJO = '#A92928';
const ROJO_CLARO = '#C63030'; // solo en la barra izquierda del símbolo
const NEGRO = '#191919';
const BLANCO = '#F6F4F3';
const ARENA = '#BEB7A4';

// --- Símbolo ----------------------------------------------------------------
// Caja: 71.28 × 86.35. Tres barras con lados verticales y bordes superior e
// inferior inclinados; la central remata en pico.
const SIMBOLO_W = 71.28;
const SIMBOLO_H = 86.35;
const BARRAS = [
  { fill: ROJO_CLARO, d: 'M0 86.35L17.9 74.96V12.3L0 23.69Z' },
  { fill: ROJO, d: 'M26.69 69.36L44.59 57.97V4.68L37.24 0L26.69 6.71Z' },
  { fill: VINO, d: 'M53.38 52.38L71.28 41.3V21.67L53.38 10.27Z' },
];

/** Las tres barras como `<path>`. `mono` pinta las tres de un color. */
const barras = (mono) =>
  BARRAS.map((b) => `<path fill="${mono ?? b.fill}" d="${b.d}"/>`).join('');

// --- Logotipo «FORCELIS», a trazos -------------------------------------------
// Caja del texto medida en el PDF, en las unidades del símbolo: empieza en
// x = 97.76, ocupa 154.6 de ancho, y va de y = 20.26 (alto de mayúsculas) a
// y = 45.44 (línea base más el rebase de la O, la C y la S).
const FUENTE_LOGO = join(root, 'node_modules/@fontsource/jost/files/jost-latin-500-normal.woff');
const CAJA = { x: 97.76, y: 20.26, w: 154.6, h: 25.18 };

const cargar = (file) => {
  const buf = readFileSync(file);
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const jost = cargar(FUENTE_LOGO);

/**
 * Trazo de un texto ajustado a una caja: primero la altura (tamaño de fuente),
 * después el ancho (interletrado). Devuelve el `d` del path.
 */
function textoEnCaja(font, texto, caja) {
  const medir = (size, tracking) => font.getPath(texto, 0, 0, size, { tracking }).getBoundingBox();
  const b0 = medir(100, 0);
  const size = (100 * caja.h) / (b0.y2 - b0.y1);
  // El ancho crece de forma lineal con el interletrado: (n-1) huecos.
  const sin = medir(size, 0);
  const extra = caja.w - (sin.x2 - sin.x1);
  const tracking = ((extra / (texto.length - 1)) / size) * 1000;
  const b = medir(size, tracking);
  const path = font.getPath(texto, caja.x - b.x1, caja.y - b.y1, size, { tracking });
  return { d: path.toPathData(2), size, tracking };
}

const logo = textoEnCaja(jost, 'FORCELIS', CAJA);
const LOGO_W = +(CAJA.x + CAJA.w).toFixed(2);

/** Texto suelto a trazos (para la tarjeta social), alineado por la izquierda. */
function texto(font, str, x, baseline, size, tracking = 0) {
  return font.getPath(str, x, baseline, size, { tracking }).toPathData(2);
}
function anchoTexto(font, str, size, tracking = 0) {
  const b = font.getPath(str, 0, 0, size, { tracking }).getBoundingBox();
  return b.x2 - b.x1;
}

// --- Archivos SVG de marca ---------------------------------------------------
const cabecera = (w, h, titulo) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${titulo}">`;

const simboloSvg = `${cabecera(SIMBOLO_W, SIMBOLO_H, 'Forcelis')}${barras()}</svg>\n`;

const logoSvg = (simboloMono, textoColor) =>
  `${cabecera(LOGO_W, SIMBOLO_H, 'Forcelis')}${barras(simboloMono)}<path fill="${textoColor}" d="${logo.d}"/></svg>\n`;

writeFileSync(join(brandDir, 'simbolo.svg'), simboloSvg);
writeFileSync(join(brandDir, 'logo-horizontal.svg'), logoSvg(undefined, NEGRO));
writeFileSync(join(brandDir, 'logo-horizontal-blanco.svg'), logoSvg(BLANCO, BLANCO));

// --- Patrón -----------------------------------------------------------------
// Las barras del símbolo en rejilla: mismo ancho (17.9), mismo paso (26.69) y
// misma inclinación (0.636). Cada columna sube lo que sube la diagonal en un
// paso, así los huecos blancos forman líneas diagonales continuas, como en la
// hoja de marca. Colores en una secuencia fija —no aleatoria— para que el
// archivo sea reproducible.
const PENDIENTE = 0.6364;
const PASO = 26.69;
const ANCHO = 17.9;
const SUBE = PASO * PENDIENTE; // 16.99
const PERIODO = SUBE * 4; // 4 columnas y el patrón vuelve a cuadrar
const LARGO = PERIODO - 8;
const COLUMNAS = 12;
const FILAS = 3;
const SECUENCIA = [ROJO, ARENA, VINO, ARENA, ROJO, VINO, VINO, ARENA, ROJO, ARENA, VINO, ROJO];
const PATRON_W = +(PASO * COLUMNAS).toFixed(2);
const PATRON_H = +(PERIODO * FILAS).toFixed(2);

function barra(x, yInferior) {
  // Paralelogramo: lados verticales, bordes con la pendiente del símbolo.
  const p = [
    [x, yInferior],
    [x + ANCHO, yInferior - ANCHO * PENDIENTE],
    [x + ANCHO, yInferior - ANCHO * PENDIENTE - LARGO],
    [x, yInferior - LARGO],
  ];
  return `M${p.map(([a, b]) => `${a.toFixed(2)} ${b.toFixed(2)}`).join('L')}Z`;
}

let patron = '';
for (let c = 0; c < COLUMNAS; c++) {
  const x = c * PASO;
  // Se dibujan filas de más por arriba y por abajo: el recorte del viewBox deja
  // el mosaico continuo en los bordes. El color depende de (columna, fila mód.
  // FILAS), así que el archivo también empalma consigo mismo como mosaico.
  for (let k = 0; k <= FILAS + 2; k++) {
    const y = k * PERIODO - (c % 4) * SUBE;
    const color = SECUENCIA[(c * 5 + (k % FILAS) * 7) % SECUENCIA.length];
    patron += `<path fill="${color}" d="${barra(x, y)}"/>`;
  }
}
const patronSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PATRON_W} ${PATRON_H}" aria-hidden="true">${patron}</svg>\n`;
writeFileSync(join(brandDir, 'patron.svg'), patronSvg);

// --- Favicon ----------------------------------------------------------------
// El símbolo solo, centrado en un cuadrado. En SVG va sin fondo: el rojo se lee
// sobre pestañas claras y oscuras. Los PNG y el .ico, igual.
const lado = SIMBOLO_H + 6;
const cuadrado = (fondo, radio = 0) => {
  const dx = (lado - SIMBOLO_W) / 2;
  const fondoRect = fondo ? `<rect width="${lado}" height="${lado}" rx="${radio}" fill="${fondo}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}">${fondoRect}<g transform="translate(${dx.toFixed(2)} 3)">${barras()}</g></svg>`;
};
writeFileSync(join(root, 'public/favicon.svg'), cuadrado(null) + '\n');

const png = (svg, size) =>
  sharp(Buffer.from(svg), { density: 600 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

const icoSizes = [16, 32, 48];
const pngs = [];
for (const size of icoSizes) {
  const buf = await png(cuadrado(null), size);
  pngs.push(buf);
  writeFileSync(join(root, `public/favicon-${size}.png`), buf);
}

// .ico armado a mano: cabecera + directorio + los PNG tal cual (válido desde
// Windows Vista y en todos los navegadores). sharp no escribe .ico.
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
const dir = Buffer.alloc(16 * pngs.length);
let offset = 6 + dir.length;
pngs.forEach((buf, i) => {
  const e = i * 16;
  dir.writeUInt8(icoSizes[i], e);
  dir.writeUInt8(icoSizes[i], e + 1);
  dir.writeUInt16LE(1, e + 4);
  dir.writeUInt16LE(32, e + 6);
  dir.writeUInt32LE(buf.length, e + 8);
  dir.writeUInt32LE(offset, e + 12);
  offset += buf.length;
});
writeFileSync(join(root, 'public/favicon.ico'), Buffer.concat([header, dir, ...pngs]));

// iOS no acepta transparencia en el icono de inicio: negro de marca, sin
// esquinas (iOS aplica su propia máscara) y con aire alrededor del símbolo.
const touch = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect width="180" height="180" fill="${NEGRO}"/><g transform="translate(${(90 - SIMBOLO_W * 0.55).toFixed(2)} ${(90 - SIMBOLO_H * 0.55).toFixed(2)}) scale(1.1)">${barras()}</g></svg>`;
await sharp(Buffer.from(touch)).png({ compressionLevel: 9 }).toFile(join(root, 'public/apple-touch-icon.png'));

// --- Tarjeta para redes (og-image) ------------------------------------------
// Fondo negro, logotipo en blanco con el símbolo en sus colores (como el botón
// negro de la hoja de marca), una franja del patrón abajo y el dominio. Sin
// frase: la misma imagen sirve para la página en español y en inglés.
const OG_W = 1200;
const OG_H = 630;
const escala = 3.2;
const logoAncho = LOGO_W * escala;
const logoX = (OG_W - logoAncho) / 2;
const logoY = 150;
const dominio = 'forcelis-group.com';
const jost400 = cargar(join(root, 'node_modules/@fontsource/jost/files/jost-latin-400-normal.woff'));
const domSize = 28;
const domTracking = 80;
const domX = logoX + CAJA.x * escala;
const franja = 44;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}" viewBox="0 0 ${OG_W} ${OG_H}">
  <defs>
    <pattern id="p" patternUnits="userSpaceOnUse" width="${PATRON_W / 2}" height="${PATRON_H / 2}">
      <g transform="scale(0.5)">${patron}</g>
    </pattern>
  </defs>
  <rect width="${OG_W}" height="${OG_H}" fill="${NEGRO}"/>
  <g transform="translate(${logoX.toFixed(2)} ${logoY}) scale(${escala})">${barras()}<path fill="${BLANCO}" d="${logo.d}"/></g>
  <path fill="${ARENA}" d="${texto(jost400, dominio, domX, logoY + 66 * escala, domSize, domTracking)}"/>
  <rect y="${OG_H - franja}" width="${OG_W}" height="${franja}" fill="url(#p)"/>
</svg>`;
await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(join(root, 'public/og-image.png'));

console.log(
  `marca: logotipo Jost 500 a ${logo.size.toFixed(2)} u, interletrado ${logo.tracking.toFixed(0)}/1000 em; ` +
    `logo ${LOGO_W}×${SIMBOLO_H}; patrón ${PATRON_W}×${PATRON_H}`,
);
