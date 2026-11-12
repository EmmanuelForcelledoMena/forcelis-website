// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { NOINDEX_PAGES, allPaths } from './src/i18n/routes.ts';

/** Rutas que no entran al sitemap porque se sirven con `noindex`. */
const excluidas = allPaths()
  .filter((p) => NOINDEX_PAGES.includes(p.key))
  .map((p) => p.path);

// En GitHub Pages no hay redirecciones de servidor (ver `redirects` abajo).
const redirects = {
  // --- Español ------------------------------------------------------------
  // La página de asesores se renombró con la nueva línea de negocio.
  '/es/contadores-y-consultores/': '/es/para-asesores/',
  // Lo que vendían estas páginas ahora son los servicios de consultoría.
  '/es/para-empresas/': '/es/servicios/',
  '/es/industrias/': '/es/servicios/',
  '/es/soluciones/': '/es/servicios/',
  // El Diagnóstico Empresarial es hoy el Diagnóstico de Negocio.
  '/es/diagnostico-empresarial/': '/es/servicios/#diagnostico',

  // --- Inglés -------------------------------------------------------------
  // El inglés es la línea internacional: portada, Servicios, About y
  // Contacto. Todo lo demás de la etapa anterior cae en la portada.
  '/en/accountants-and-advisors/': '/en/',
  '/en/for-businesses/': '/en/',
  '/en/business-diagnostic/': '/en/',
  '/en/expansion-study/': '/en/',
  '/en/platform/': '/en/',
  '/en/pricing/': '/en/',
  '/en/industries/': '/en/',
  '/en/solutions/': '/en/',
};

// El sitio se sirve desde el apex con dominio propio, no desde
// usuario.github.io/repo, así que `base` es la raíz. Si algún día se publicara
// en la URL de proyecto de GitHub Pages habría que fijar `base: '/forcelis-website'`
// y todas las rutas construidas con `ruta()` seguirían funcionando.
export default defineConfig({
  site: 'https://forcelis-group.com',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      // Los dos idiomas llevan prefijo: /es/ y /en/. La URL es la única
      // fuente de verdad del idioma.
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  // En GitHub Pages no hay redirecciones de servidor: Astro genera para cada
  // ruta una página con `meta refresh`, canónica al destino, `noindex` y un
  // enlace visible. Es lo máximo que puede hacer un sitio estático, y conserva
  // el enlace para quien lo tenga guardado o publicado en algún lado.
  //
  // Ninguna URL publicada antes del rebranding termina en un 404: las que
  // salieron del sitio caen en la página que hoy cubre lo mismo.
  redirects,
  integrations: [
    sitemap({
      // Sin `i18n`: el sitemap ya no agrupa páginas por idioma, porque casi
      // ninguna es traducción de otra. Los `hreflang` que sí son ciertos
      // (privacidad y términos) van en el `<head>` de cada página.
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
        if (pathname in redirects) return false;
        return !excluidas.some((ruta) => pathname === ruta);
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'auto' },
});
