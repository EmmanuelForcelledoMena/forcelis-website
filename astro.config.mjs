// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { LANGS, NOINDEX_PAGES, path } from './src/i18n/routes.ts';

/** Rutas que no entran al sitemap porque se sirven con `noindex`. */
const excluidas = NOINDEX_PAGES.flatMap((key) => LANGS.map((lang) => path(key, lang)));

// El sitio se sirve desde el apex con dominio propio, no desde
// usuario.github.io/repo, así que `base` es la raíz. Si algún día se publicara
// en la URL de proyecto de GitHub Pages habría que fijar `base: '/forcelis-website'`
// y todas las rutas construidas con `ruta()` seguirían funcionando.
export default defineConfig({
  site: 'https://forcelis-group.com',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      // Ambos idiomas llevan prefijo: /en/ y /es/. Ninguno es "el de verdad"
      // y la URL es la única fuente de verdad del idioma (Sección 54).
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  // Soluciones se retiró y su contenido vive ahora en «Para empresas». En
  // GitHub Pages no hay redirecciones de servidor, así que Astro genera para
  // cada una de estas rutas una página con `meta refresh`, canónica al destino,
  // `noindex` y un enlace visible por si el refresco no corre. Es lo máximo que
  // se puede hacer en un sitio estático, y conserva el enlace para quien lo
  // tenga guardado o lo haya publicado en algún lado.
  redirects: {
    '/es/soluciones/': '/es/para-empresas/',
    '/en/solutions/': '/en/for-businesses/',
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es-MX' } },
      // Fuera la raíz. `/` es una página de reenvío sin contenido propio, y
      // dejarla dentro producía DOS entradas `hreflang="en"` en cada grupo —la
      // raíz y `/en/`—, que es una anotación ambigua: ante dos candidatos para
      // el mismo idioma, el buscador descarta el bloque entero.
      //
      // Fuera también lo que lleva `noindex`. La lista de exclusión NO se
      // escribe aquí: se deriva de `NOINDEX_PAGES` en `src/i18n/routes.ts`, que
      // es la misma que decide la etiqueta `robots` del `<head>`. Anunciar en
      // el sitemap una URL marcada `noindex` es una señal contradictoria, y
      // mantener dos listas a mano garantiza que acaben diciendo cosas
      // distintas.
      filter: (page) => {
        const { pathname } = new URL(page);
        if (pathname === '/') return false;
        return !excluidas.some((ruta) => pathname === ruta);
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'auto' },
});
