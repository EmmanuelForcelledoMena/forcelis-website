/**
 * Rutas del sitio.
 *
 * Desde el rebranding de noviembre de 2026 el sitio NO es una traducción
 * espejo. Hay tres líneas de negocio y cada una vive en su idioma:
 *
 *   Consultoría México        /es/                 dueños de pequeños negocios
 *   Plataforma para asesores  /es/para-asesores/,  contadores y consultores
 *                             /es/precios/, /es/plataforma/
 *   Consultoría internacional /en/                 empresas que entran a México
 *
 * Por eso el mapa de slugs es PARCIAL: una página puede existir en un idioma y
 * no en el otro. `path()` falla en la build si se le pide una página que no
 * existe en ese idioma — un enlace roto es un error de compilación, no un 404
 * en producción.
 *
 * La URL es la única fuente de verdad del idioma.
 */

export const LANGS = ['es', 'en'] as const;
export type Lang = (typeof LANGS)[number];

/** El idioma de la audiencia principal. La raíz `/` lleva aquí. */
export const DEFAULT_LANG: Lang = 'es';

export const LANG_META: Record<
  Lang,
  { label: string; short: string; hreflang: string; ogLocale: string }
> = {
  es: { label: 'Español', short: 'ES', hreflang: 'es-MX', ogLocale: 'es_MX' },
  en: { label: 'English', short: 'EN', hreflang: 'en', ogLocale: 'en_US' },
};

export type PageKey =
  | 'home'
  | 'services'
  | 'expansion'
  | 'advisors'
  | 'pricing'
  | 'platform'
  | 'about'
  | 'contact'
  | 'thanks'
  | 'privacy'
  | 'terms';

export const SLUGS: Record<PageKey, Partial<Record<Lang, string>>> = {
  home: { es: '', en: '' },
  services: { es: 'servicios', en: 'services' },
  expansion: { es: 'estudio-de-expansion' },
  advisors: { es: 'para-asesores' },
  pricing: { es: 'precios' },
  platform: { es: 'plataforma' },
  about: { es: 'nosotros', en: 'about' },
  contact: { es: 'contacto', en: 'contact' },
  thanks: { es: 'gracias', en: 'thank-you' },
  privacy: { es: 'privacidad', en: 'privacy' },
  terms: { es: 'terminos', en: 'terms' },
};

/** ¿Existe esta página en este idioma? */
export function hasPage(key: PageKey, lang: Lang): boolean {
  return SLUGS[key][lang] !== undefined;
}

/** Ruta absoluta de una página en un idioma, siempre con barra final. */
export function path(key: PageKey, lang: Lang): string {
  const slug = SLUGS[key][lang];
  if (slug === undefined) {
    throw new Error(`La página «${key}» no existe en «${lang}»`);
  }
  return slug ? `/${lang}/${slug}/` : `/${lang}/`;
}

/** Todas las rutas publicadas, para el sitemap y las comprobaciones. */
export function allPaths(): { key: PageKey; lang: Lang; path: string }[] {
  return (Object.keys(SLUGS) as PageKey[]).flatMap((key) =>
    LANGS.filter((lang) => hasPage(key, lang)).map((lang) => ({ key, lang, path: path(key, lang) })),
  );
}

/** El otro idioma. */
export function otherLangs(lang: Lang): Lang[] {
  return LANGS.filter((l) => l !== lang);
}

/**
 * Menú principal de cada idioma, en orden. El botón («Agenda una llamada» /
 * «Book a call») no está aquí: lo pinta `Nav.astro` siempre.
 */
export const NAV_PAGES: Record<Lang, PageKey[]> = {
  es: ['services', 'expansion', 'advisors', 'about'],
  en: ['services', 'about'],
};

/**
 * Páginas que pertenecen a la línea de asesores. Llevan el estilo oscuro y
 * tecnológico que la marca permite para esa audiencia; las de dueños de
 * negocio van en blanco cálido.
 */
export const ADVISOR_PAGES: PageKey[] = ['advisors', 'pricing', 'platform'];

/**
 * Páginas que SÍ son la misma página en los dos idiomas: solo entre estas se
 * anuncia `hreflang`. La portada, Servicios, Nosotros y Contacto existen en
 * los dos idiomas pero le hablan a clientes distintos —un dueño de negocio en
 * México y una empresa extranjera—, así que anunciarlas como traducción le
 * diría al buscador algo falso.
 */
export const EQUIVALENT_PAGES: PageKey[] = ['privacy', 'terms'];

/**
 * Páginas que no se indexan. Solo el acuse del formulario: el resto de lo que
 * se publica es contenido vigente. La MISMA lista alimenta la etiqueta
 * `robots` y el filtro del sitemap.
 */
export const NOINDEX_PAGES: PageKey[] = ['thanks'];

export function isNoindex(key: PageKey): boolean {
  return NOINDEX_PAGES.includes(key);
}
