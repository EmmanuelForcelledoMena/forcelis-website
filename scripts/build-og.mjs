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
import { readFileSync } from 'node:fs';
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
