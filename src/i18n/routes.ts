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
import { negocio } from '../config/negocio';

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
 * El Diagnóstico Empresarial NO está aquí: dejó de ser una entrada de menú y se
 * alcanza desde el hero de «Para empresas», que es donde tiene público. El
 * botón de la barra es «Agenda una llamada», que va al cliente principal —los
 * asesores—, y Contacto va como enlace secundario junto a ese botón.
 *
 * Precios aparece solo cuando hay precios que mostrar. Con los precios
 * apagados, la página existe pero no se enlaza, no se indexa y no entra al
 * sitemap: es la misma condición en los tres sitios, leída de la misma
 * variable.
 */
export const NAV_PAGES: PageKey[] = [
  'advisors',
  'business',
  'platform',
  ...(negocio.mostrar_precios ? (['pricing'] as PageKey[]) : []),
  'services',
  'about',
];

/**
 * Páginas que no deben indexarse. Gracias no es contenido —es el acuse de un
 * envío— y Precios solo se oculta mientras los precios estén apagados.
 *
 * La MISMA lista alimenta la etiqueta `robots` del `<head>` y el filtro del
 * sitemap, para que no puedan contradecirse: un sitemap que anuncia una URL
 * marcada `noindex` es una señal contradictoria y los buscadores la reportan.
 */
export const NOINDEX_PAGES: PageKey[] = [
  'thanks',
  ...(negocio.mostrar_precios ? [] : (['pricing'] as PageKey[])),
];

export function isNoindex(key: PageKey): boolean {
  return NOINDEX_PAGES.includes(key);
}
