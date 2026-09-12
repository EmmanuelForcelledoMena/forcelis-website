/**
 * Genera `public/og-image.png` (1200x630) y `public/apple-touch-icon.png`.
 *
 * La tarjeta es lo que se ve cuando alguien comparte el sitio en LinkedIn,
 * WhatsApp o Slack. Es un script y no un SVG servido tal cual porque ninguna de
 * esas plataformas renderiza SVG en `og:image`: pasan el archivo por su propio
 * redimensionador y un SVG sale en blanco. El PNG resultante se versiona en el
 * repo; esto solo se vuelve a correr si cambia la marca:
 *
 *     npm run build:og
 *
 * Las tipografías van incrustadas como data URI: el renderizador de SVG no
 * tiene acceso a la red y, sin incrustarlas, caería a la fuente por defecto del
 * sistema — que en otra máquina es otra fuente. Con la variable incrustada
 * resuelve un solo peso de forma fiable, así que todo el texto de cada familia
 * usa ese peso.
 *
 * El glifo de la F es el mismo de `src/components/Wordmark.astro` y de
 * `public/favicon.svg`. Cambiarlo es cambiar los tres.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const font = (file) =>
  readFileSync(join(root, 'public/fonts', file)).toString('base64');
const montserrat = font('montserrat-latin-wght-normal.woff2');
const inter = font('inter-latin-wght-normal.woff2');

// Paleta del manual de marca.
const INK = '#1a1a1a';
const GROUND = '#f7f6f4';
const TAUPE = '#c7c3a9';
const GRAY = '#5a5a5a';

// Glifo F: tres barras. `s` escala; `x`,`y` desplazan.
const glyph = (fill, x, y, s) => `
  <g transform="translate(${x} ${y}) scale(${s})" fill="${fill}">
    <path d="M26 8H62L58 20H22Z"/>
    <path d="M20 26H47L43 38H16Z"/>
    <path d="M14 44H32L28 56H10Z"/>
  </g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>
      @font-face {
        font-family: 'Montserrat Embedded';
        font-weight: 100 900;
        src: url(data:font/woff2;base64,${montserrat}) format('woff2');
      }
      @font-face {
        font-family: 'Inter Embedded';
        font-weight: 100 900;
        src: url(data:font/woff2;base64,${inter}) format('woff2');
      }
      .display { font-family: 'Montserrat Embedded', sans-serif; font-weight: 600; }
      .body    { font-family: 'Inter Embedded', sans-serif; font-weight: 500; }
    </style>
  </defs>

  <rect width="1200" height="630" fill="${INK}"/>

  <!-- lockup horizontal, en taupe sobre tinta como marca el manual -->
  ${glyph(TAUPE, 88, 76, 1.05)}
  <text class="display" x="172" y="106" font-size="30" letter-spacing="8" fill="${GROUND}">FORCELIS</text>
  <text class="display" x="174" y="132" font-size="14" letter-spacing="7" fill="${TAUPE}">GROUP</text>

  <rect x="88" y="252" width="64" height="4" fill="${TAUPE}"/>

  <text class="display" x="88" y="346" font-size="68" letter-spacing="-1.5" fill="${GROUND}">Turn business data</text>
  <text class="display" x="88" y="428" font-size="68" letter-spacing="-1.5" fill="${GROUND}">into <tspan fill="${TAUPE}">better decisions.</tspan></text>

  <text class="body" x="88" y="500" font-size="24" letter-spacing="2" fill="${TAUPE}">FINANCIAL &amp; OPERATIONAL INTELLIGENCE</text>

  <text class="body" x="88" y="568" font-size="19" letter-spacing="1" fill="${GRAY}">forcelis-group.com</text>
</svg>`;

const out = join(root, 'public/og-image.png');
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
console.log('escrito', out);

// Icono para la pantalla de inicio en iOS: la versión "App icon (light)" del
// manual, glifo en tinta sobre cuadrado taupe. Safari no acepta el favicon SVG
// para esto, así que se rasteriza a 180x180. Sin esquinas redondeadas: iOS las
// recorta él mismo con su máscara.
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="180" height="180">
  <rect width="64" height="64" fill="${TAUPE}"/>
  ${glyph(INK, 0, 0, 1)}
</svg>`;

const iconOut = join(root, 'public/apple-touch-icon.png');
await sharp(Buffer.from(icon)).resize(180, 180).png({ compressionLevel: 9 }).toFile(iconOut);
console.log('escrito', iconOut);

// ---------------------------------------------------------------------------
// Favicons de respaldo: PNG a 16/32/48/180 y un favicon.ico.
//
// El SVG adaptativo (`public/favicon.svg`) es el que usan Chrome, Edge y
// Firefox. Safari no pinta SVG en la pestaña y los navegadores antiguos piden
// `/favicon.ico` a ciegas: sin estos archivos, en esos casos sale el icono
// gris genérico y parece que la empresa no tiene logotipo.
//
// Se rasteriza la variante OSCURA (tinta con la F en taupe): tiene borde
// definido sobre una barra de pestañas clara y el glifo se lee sobre una
// oscura, así que es la que funciona en los dos casos sin media query.
//
// El .ico se arma a mano: es un contenedor trivial (cabecera + directorio +
// los PNG tal cual) y sharp no lo escribe. Formato ICO con PNG incrustado es
// válido desde Windows Vista y lo entienden todos los navegadores.
// ---------------------------------------------------------------------------
const darkIcon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <rect width="64" height="64" rx="12" fill="${INK}"/>
  ${glyph(TAUPE, 0, 0, 1)}
</svg>`;

const pngAt = (size) =>
  sharp(Buffer.from(darkIcon(size))).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

for (const size of [16, 32, 48]) {
  const file = join(root, `public/favicon-${size}.png`);
  await sharp(await pngAt(size)).toFile(file);
  console.log('escrito', file);
}

const icoSizes = [16, 32, 48];
const pngs = await Promise.all(icoSizes.map(pngAt));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reservado
header.writeUInt16LE(1, 2); // tipo: 1 = icono
header.writeUInt16LE(pngs.length, 4);
const dir = Buffer.alloc(16 * pngs.length);
let offset = 6 + dir.length;
pngs.forEach((png, i) => {
  const size = icoSizes[i];
  const e = i * 16;
  dir.writeUInt8(size === 256 ? 0 : size, e); // ancho (0 = 256)
  dir.writeUInt8(size === 256 ? 0 : size, e + 1); // alto
  dir.writeUInt8(0, e + 2); // paleta
  dir.writeUInt8(0, e + 3); // reservado
  dir.writeUInt16LE(1, e + 4); // planos
  dir.writeUInt16LE(32, e + 6); // bits por píxel
  dir.writeUInt32LE(png.length, e + 8);
  dir.writeUInt32LE(offset, e + 12);
  offset += png.length;
});
const icoOut = join(root, 'public/favicon.ico');
writeFileSync(icoOut, Buffer.concat([header, dir, ...pngs]));
console.log('escrito', icoOut);
