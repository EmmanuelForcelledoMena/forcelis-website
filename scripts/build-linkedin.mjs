/**
 * Genera los recursos de la página de empresa en LinkedIn, en `brand/linkedin/`,
 * con la marca del rebranding de noviembre de 2026:
 *
 *   logo-dark-400.png              símbolo sobre negro
 *   logo-light-400.png             símbolo sobre blanco cálido
 *   cover-1512x256.png             portada de página, medida exacta de LinkedIn
 *   cover-3024x512.png             la misma a 2×
 *   banner-personal-1584x396.png   portada de perfil personal
 *
 *     npm run build:brand && npm run build:linkedin
 *
 * No dibuja nada propio: compone los SVG de `public/brand/`, que genera
 * `scripts/build-brand.mjs` desde los vectores del PDF de marca. Sin texto
 * además del logotipo —que ya va a trazos—, así que no depende de ninguna
 * fuente instalada.
 *
 * Dos restricciones de LinkedIn: en escritorio el logotipo de la página se
 * superpone a la esquina inferior izquierda de la portada, y en móvil la
 * portada se recorta por los lados. Por eso el logotipo va centrado y la
 * esquina inferior izquierda queda libre.
 */
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const outDir = join(root, 'brand/linkedin');
mkdirSync(outDir, { recursive: true });

const NEGRO = '#191919';
const BLANCO = '#F6F4F3';

const leer = (f) => readFileSync(join(root, 'public/brand', f), 'utf8');
const logo = leer('logo-horizontal.svg');
const patron = leer('patron.svg');

const viewBox = (svg) => /viewBox="([^"]+)"/.exec(svg)[1].split(' ').map(Number);
const interior = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const [, , LOGO_W, LOGO_H] = viewBox(logo);
const [, , PAT_W, PAT_H] = viewBox(patron);
const paths = [...logo.matchAll(/<path fill="([^"]+)" d="([^"]+)"\/>/g)].map((m) => ({ fill: m[1], d: m[2] }));
const barras = paths.slice(0, 3).map((p) => `<path fill="${p.fill}" d="${p.d}"/>`).join('');
const palabra = (color) => `<path fill="${color}" d="${paths[3].d}"/>`;
const SIMBOLO_W = 71.28;

const write = async (svg, file, resize) => {
  let img = sharp(Buffer.from(svg), { density: 300 });
  if (resize) img = img.resize(resize.w, resize.h);
  await img.png({ compressionLevel: 9 }).toFile(join(outDir, file));
  console.log('escrito', join('brand/linkedin', file));
};

// ---------------------------------------------------------------- logotipos
// Cuadrado a sangre: LinkedIn recorta sus propias esquinas.
const tile = (bg) => {
  const s = 220 / LOGO_H;
  const x = (400 - SIMBOLO_W * s) / 2;
  const y = (400 - LOGO_H * s) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="${bg}"/>
  <g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s.toFixed(4)})">${barras}</g>
</svg>`;
};
await write(tile(NEGRO), 'logo-dark-400.png', { w: 400, h: 400 });
await write(tile(BLANCO), 'logo-light-400.png', { w: 400, h: 400 });

// ------------------------------------------------------------------ portadas
// Negro, logotipo centrado en blanco con el símbolo en sus rojos, y una franja
// del patrón abajo.
const cover = (w, h, alto, franja) => {
  const s = alto / LOGO_H;
  const x = (w - LOGO_W * s) / 2;
  const y = (h - franja - LOGO_H * s) / 2;
  const ps = (franja * 4) / PAT_H;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <pattern id="p" patternUnits="userSpaceOnUse" width="${(PAT_W * ps).toFixed(2)}" height="${(PAT_H * ps).toFixed(2)}">
      <g transform="scale(${ps.toFixed(4)})">${interior(patron)}</g>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="${NEGRO}"/>
  <g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${s.toFixed(4)})">${barras}${palabra(BLANCO)}</g>
  <rect y="${h - franja}" width="${w}" height="${franja}" fill="url(#p)"/>
</svg>`;
};

const page = cover(1512, 256, 104, 14);
await write(page, 'cover-1512x256.png', { w: 1512, h: 256 });
await write(page, 'cover-3024x512.png', { w: 3024, h: 512 });
await write(cover(1584, 396, 150, 18), 'banner-personal-1584x396.png', { w: 1584, h: 396 });
