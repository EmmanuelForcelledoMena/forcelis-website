/**
 * Genera los recursos de la página de empresa en LinkedIn, en `brand/linkedin/`:
 *
 *   logo-dark-800.png / logo-dark-300.png    logotipo: tinta con la F en taupe
 *   logo-light-800.png / logo-light-300.png  logotipo: taupe con la F en tinta
 *   cover-2256x382.png                       portada de página (1128×191 a 2×)
 *   cover-1128x191.png                       portada de página, tamaño nominal
 *   banner-personal-1584x396.png             portada de perfil personal
 *
 *     npm run build:linkedin
 *
 * Medidas de LinkedIn: logotipo 300×300 (cuadrado; se sube a 800 para que no
 * pixele en pantallas densas), portada de página 1128×191, portada de perfil
 * 1584×396. Se acepta PNG hasta 8 MB.
 *
 * Dos restricciones de composición que no son de marca sino de LinkedIn:
 *
 *  - En escritorio el logotipo se superpone a la esquina inferior izquierda
 *    de la portada; en móvil la portada se recorta por los lados y queda el
 *    tercio central. Por eso todo el texto va centrado y dentro del 60 % central
 *    del ancho, y la esquina inferior izquierda queda vacía.
 *  - El logotipo se muestra a 48 px en el feed: es el glifo solo, sin
 *    denominación, como el favicon. El nombre lo pone LinkedIn al lado.
 *
 * Misma técnica que `build-og.mjs`: SVG con las fuentes incrustadas, pasado
 * por sharp. El glifo de la F es el de `src/components/Wordmark.astro`.
 */
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const outDir = join(root, 'brand/linkedin');
mkdirSync(outDir, { recursive: true });

const font = (file) =>
  readFileSync(join(root, 'public/fonts', file)).toString('base64');
const montserrat = font('montserrat-latin-wght-normal.woff2');
const inter = font('inter-latin-wght-normal.woff2');

const INK = '#1a1a1a';
const GROUND = '#f7f6f4';
const TAUPE = '#c7c3a9';
const GRAY = '#8a8a8a'; // gris levantado: el del manual (#5a5a5a) da 2.4:1 sobre tinta

const fonts = `
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
  </style>`;

const glyph = (fill, x, y, s, opacity = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})" fill="${fill}" opacity="${opacity}">
    <path d="M26 8H62L58 20H22Z"/>
    <path d="M20 26H47L43 38H16Z"/>
    <path d="M14 44H32L28 56H10Z"/>
  </g>`;

const write = async (svg, file, resize) => {
  let img = sharp(Buffer.from(svg));
  if (resize) img = img.resize(resize.w, resize.h);
  await img.png({ compressionLevel: 9 }).toFile(join(outDir, file));
  console.log('escrito', join('brand/linkedin', file));
};

// ---------------------------------------------------------------- logotipos
// Cuadrado a sangre, sin esquinas redondeadas: LinkedIn recorta el suyo.
const tile = (bg, fg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="800" height="800">
  <rect width="64" height="64" fill="${bg}"/>
  ${glyph(fg, 0, 0, 1)}
</svg>`;

await write(tile(INK, TAUPE), 'logo-dark-800.png');
await write(tile(INK, TAUPE), 'logo-dark-300.png', { w: 300, h: 300 });
await write(tile(TAUPE, INK), 'logo-light-800.png');
await write(tile(TAUPE, INK), 'logo-light-300.png', { w: 300, h: 300 });

// ------------------------------------------------------------------ portadas
// Una sola composición parametrizada por el lienzo: antetítulo en taupe,
// titular en dos líneas con el remate en taupe (el rojo no pasa el contraste
// sobre tinta), dominio abajo, y el glifo como marca de agua a la derecha.
const cover = ({ w, h, tag, head, domain, mark }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>${fonts}</defs>
  <rect width="${w}" height="${h}" fill="${INK}"/>
  ${glyph(TAUPE, mark.x, mark.y, mark.s, 0.09)}
  <g text-anchor="middle">
    <text class="body" x="${w / 2}" y="${tag.y}" font-size="${tag.size}" letter-spacing="${tag.ls}" fill="${TAUPE}">FINANCIAL &amp; OPERATIONAL INTELLIGENCE</text>
    <text class="display" x="${w / 2}" y="${head.y1}" font-size="${head.size}" letter-spacing="-0.5" fill="${GROUND}">Turn business data into</text>
    <text class="display" x="${w / 2}" y="${head.y2}" font-size="${head.size}" letter-spacing="-0.5" fill="${TAUPE}">better decisions.</text>
    <text class="body" x="${w / 2}" y="${domain.y}" font-size="${domain.size}" letter-spacing="1" fill="${GRAY}">forcelis-group.com</text>
  </g>
</svg>`;

// Portada de página: se dibuja en el espacio nominal 1128×191 y se rasteriza
// a 2× para pantallas densas. LinkedIn la reduce él mismo.
const page = cover({
  w: 1128,
  h: 191,
  tag: { y: 50, size: 10, ls: 3 },
  head: { y1: 98, y2: 138, size: 33 },
  domain: { y: 172, size: 11 },
  mark: { x: 940, y: -4, s: 3.4 },
});
await write(page, 'cover-2256x382.png', { w: 2256, h: 382 });
await write(page, 'cover-1128x191.png');

// Portada de perfil personal (1584×396). La foto de perfil ocupa la esquina
// inferior izquierda; la composición centrada la esquiva igual.
const personal = cover({
  w: 1584,
  h: 396,
  tag: { y: 106, size: 15, ls: 5 },
  head: { y1: 200, y2: 268, size: 58 },
  domain: { y: 338, size: 17 },
  mark: { x: 1300, y: -8, s: 6.3 },
});
await write(personal, 'banner-personal-1584x396.png');
