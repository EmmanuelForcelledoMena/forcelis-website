/**
 * Genera `public/og-image.png` (1200x630), la tarjeta que se ve cuando alguien
 * comparte el sitio en LinkedIn, WhatsApp o Slack.
 *
 * Es un script y no un SVG servido tal cual porque ninguna de esas plataformas
 * renderiza SVG en `og:image`: pasan el archivo por su propio redimensionador y
 * un SVG sale en blanco. El PNG resultante se versiona en el repo; esto solo se
 * vuelve a correr si cambia la marca:
 *
 *     node scripts/build-og.mjs
 *
 * La tipografía es la Inter variable del propio sitio, incrustada como data URI:
 * el renderizador de SVG no tiene acceso a la red y, sin incrustarla, caería a
 * la fuente por defecto del sistema — que en otra máquina es otra fuente.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const fontData = readFileSync(join(root, 'public/fonts/inter-latin-wght-normal.woff2')).toString(
  'base64',
);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>
      @font-face {
        font-family: 'Inter Embedded';
        font-weight: 100 900;
        src: url(data:font/woff2;base64,${fontData}) format('woff2');
      }
      /* Cada estilo repite la familia y el peso. Con la variable de Inter
         incrustada, el renderizador SVG resuelve unos pesos y otros no —el
         primer intento sacó la firma y el dominio en una serif del sistema—,
         así que aquí todo el texto usa el MISMO peso que sí resuelve. */
      text { font-family: 'Inter Embedded', sans-serif; font-weight: 600; }
    </style>
  </defs>

  <rect width="1200" height="630" fill="#201e1d"/>

  <g transform="translate(88, 84)">
    <rect x="0"  y="12" width="9" height="16" fill="#f8f4f4"/>
    <rect x="15" y="6"  width="9" height="22" fill="#f8f4f4"/>
    <rect x="30" y="0"  width="9" height="28" fill="#ec3013"/>
    <text x="58" y="23" font-size="26" letter-spacing="4" fill="#f8f4f4">FORCELIS</text>
    <text x="215" y="23" font-size="17" letter-spacing="6" fill="#878383">GROUP</text>
  </g>

  <rect x="88" y="240" width="72" height="4" fill="#ec3013"/>

  <text x="88" y="336" font-size="74" letter-spacing="-2.5" fill="#f8f4f4">Turn business data</text>
  <text x="88" y="422" font-size="74" letter-spacing="-2.5" fill="#f8f4f4">into better decisions.</text>

  <text x="88" y="492" font-size="26" fill="#d7d3d3">Financial &amp; Operational Intelligence</text>

  <text x="88" y="566" font-size="20" letter-spacing="1" fill="#878383">forcelis-group.com</text>
</svg>`;

const out = join(root, 'public/og-image.png');
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
console.log('escrito', out);

// Icono para la pantalla de inicio en iOS. Safari no acepta el favicon SVG
// para esto, así que el mismo glifo se rasteriza a 180x180.
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="180" height="180">
  <rect width="32" height="32" fill="#201e1d"/>
  <rect x="6" y="19" width="5" height="7" fill="#f8f4f4"/>
  <rect x="13.5" y="14" width="5" height="12" fill="#f8f4f4"/>
  <rect x="21" y="6" width="5" height="20" fill="#ec3013"/>
</svg>`;

const iconOut = join(root, 'public/apple-touch-icon.png');
await sharp(Buffer.from(icon)).resize(180, 180).png({ compressionLevel: 9 }).toFile(iconOut);
console.log('escrito', iconOut);
