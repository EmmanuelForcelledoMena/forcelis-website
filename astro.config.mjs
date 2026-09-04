// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

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
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es-MX' } },
      // Fuera la raíz. `/` es una página de reenvío sin contenido propio, y
      // dejarla dentro producía DOS entradas `hreflang="en"` en cada grupo —la
      // raíz y `/en/`—, que es una anotación ambigua: ante dos candidatos para
      // el mismo idioma, el buscador descarta el bloque entero.
      filter: (page) => new URL(page).pathname !== '/',
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'auto' },
});
