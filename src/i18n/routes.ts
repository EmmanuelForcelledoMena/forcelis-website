/**
 * Rutas bilingües.
 *
 * La URL es la única fuente de verdad del idioma. Este archivo es el mapa entre
 * una PÁGINA —un concepto estable— y su slug en cada idioma. El selector de
 * idioma no redirige a la portada: traduce la ruta actual, y solo puede hacerlo
 * porque la página sabe qué clave es.
 *
 * Los slugs en español están traducidos a propósito (`/es/para-empresas/`, no
 * `/es/for-businesses/`): el mercado inicial es México y la URL es contenido
 * indexable. El coste es este mapa, que es una tabla.
 */

export const LANGS = ['en', 'es'] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = 'en';

export const LANG_META: Record<
  Lang,
  { label: string; short: string; hreflang: string; ogLocale: string }
> = {
  en: { label: 'English', short: 'EN', hreflang: 'en-US', ogLocale: 'en_US' },
  es: { label: 'Español', short: 'ES', hreflang: 'es-MX', ogLocale: 'es_MX' },
};

export type PageKey =
  | 'home'
  | 'advisors'
  | 'business'
  | 'platform'
  | 'pricing'
  | 'services'
  | 'expansion'
  | 'diagnostic'
  | 'industries'
  | 'about'
  | 'contact'
  | 'thanks'
  | 'privacy'
  | 'terms';

export const SLUGS: Record<PageKey, Record<Lang, string>> = {
  home: { en: '', es: '' },
  advisors: { en: 'accountants-and-advisors', es: 'contadores-y-consultores' },
  business: { en: 'for-businesses', es: 'para-empresas' },
  platform: { en: 'platform', es: 'plataforma' },
  pricing: { en: 'pricing', es: 'precios' },
  services: { en: 'services', es: 'servicios' },
  // Solo español: el Estudio de Expansión nace con el giro a consultoría y la
  // versión en inglés está en pausa. El slug en inglés existe porque el mapa
  // es un `Record` completo, pero no hay página que lo sirva.
  expansion: { en: 'expansion-study', es: 'estudio-de-expansion' },
  diagnostic: { en: 'business-diagnostic', es: 'diagnostico-empresarial' },
  industries: { en: 'industries', es: 'industrias' },
  about: { en: 'about', es: 'nosotros' },
  contact: { en: 'contact', es: 'contacto' },
  thanks: { en: 'thank-you', es: 'gracias' },
  privacy: { en: 'privacy', es: 'privacidad' },
  terms: { en: 'terms', es: 'terminos' },
};

/** Ruta absoluta de una página en un idioma, siempre con barra final. */
export function path(key: PageKey, lang: Lang): string {
  const slug = SLUGS[key][lang];
  return slug ? `/${lang}/${slug}/` : `/${lang}/`;
}

/** El otro idioma. Con dos idiomas es un `find`; con tres seguiría valiendo. */
export function otherLangs(lang: Lang): Lang[] {
  return LANGS.filter((l) => l !== lang);
}

/**
 * Enlaces de texto de la navegación principal, en orden.
 *
 * Desde el giro del 2026-11-06 el sitio le habla a dueños de pequeños
 * negocios, no a contadores que compran software. El menú son tres entradas y
 * un botón: Servicios, el Estudio de Expansión —que es la puerta de entrada
 * de quien ya piensa en crecer— y Nosotros, porque a un consultor se le
 * contrata por quién es.
 *
 * Lo que vendía la suscripción —Para contadores, Para empresas, Plataforma,
 * Precios e Industrias— NO se borra: sigue publicado y servido, pero sale del
 * menú y del índice (ver `NOINDEX_PAGES`). Si el giro no funciona, volver es
 * editar estas dos listas.
 */
export const NAV_PAGES: PageKey[] = ['services', 'expansion', 'about'];

/**
 * Páginas que no deben indexarse.
 *
 * Tres grupos, y conviene no mezclarlos al editar:
 *
 *  1. `thanks` — es el acuse de un envío, nunca fue contenido.
 *  2. Las páginas de la etapa de software. Siguen publicadas porque la
 *     decisión fue no borrar nada, pero un prospecto que llegue a «Para
 *     contadores» desde Google leería una oferta que ya no existe, y la
 *     portada le dice que Forcelis no vende software. Dejarlas indexadas es
 *     contradecirse en público.
 *  3. Todo lo que quede en inglés, porque esa versión está en pausa y no se
 *     está manteniendo. Eso lo resuelve `Base.astro` por idioma, no esta
 *     lista.
 *
 * La MISMA lista alimenta la etiqueta `robots` del `<head>` y el filtro del
 * sitemap, para que no puedan contradecirse.
 */
export const NOINDEX_PAGES: PageKey[] = [
  'thanks',
  'advisors',
  'business',
  'platform',
  'pricing',
  'industries',
];

export function isNoindex(key: PageKey): boolean {
  return NOINDEX_PAGES.includes(key);
}
