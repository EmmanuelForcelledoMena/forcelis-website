/**
 * Rutas bilingües.
 *
 * La URL es la única fuente de verdad del idioma (Sección 54 del brief). Este
 * archivo es el mapa entre una PÁGINA —un concepto estable— y su slug en cada
 * idioma. El selector de idioma no redirige a la portada: traduce la ruta
 * actual, y solo puede hacerlo porque la página sabe qué clave es.
 *
 * Los slugs en español están traducidos a propósito (`/es/soluciones/`, no
 * `/es/solutions/`): el mercado inicial es México y la URL es contenido
 * indexable. El coste es este mapa, que es una tabla de nueve líneas.
 */

export const LANGS = ['en', 'es'] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = 'en';

export const LANG_META: Record<
  Lang,
  { label: string; short: string; hreflang: string; ogLocale: string }
> = {
  en: { label: 'English', short: 'EN', hreflang: 'en', ogLocale: 'en_US' },
  es: { label: 'Español', short: 'ES', hreflang: 'es-MX', ogLocale: 'es_MX' },
};

export type PageKey =
  | 'home'
  | 'solutions'
  | 'platform'
  | 'diagnostic'
  | 'industries'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms';

export const SLUGS: Record<PageKey, Record<Lang, string>> = {
  home: { en: '', es: '' },
  solutions: { en: 'solutions', es: 'soluciones' },
  platform: { en: 'platform', es: 'plataforma' },
  diagnostic: { en: 'business-diagnostic', es: 'diagnostico-empresarial' },
  industries: { en: 'industries', es: 'industrias' },
  about: { en: 'about', es: 'nosotros' },
  contact: { en: 'contact', es: 'contacto' },
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

/** Las páginas que aparecen en la navegación principal, en orden. */
export const NAV_PAGES: PageKey[] = [
  'solutions',
  'platform',
  'diagnostic',
  'industries',
  'about',
  'contact',
];
