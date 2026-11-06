/**
 * Carga de diccionarios.
 *
 * Un archivo JSON por página. La alternativa —un único `translations.json`
 * gigante— hace que cualquier cambio de copy toque el mismo archivo y que
 * revisar una traducción exija leerlo entero.
 *
 * ---------------------------------------------------------------------------
 * EL INGLÉS ESTÁ EN PAUSA desde el giro a consultoría del 2026-11-06.
 *
 * Los JSON de `src/locales/en/` siguen en el repositorio, intactos: son la
 * traducción de la etapa de software y el punto de partida para cuando haya
 * clientes fuera de México. Lo que ya no ocurre es que se rendericen: no hay
 * rutas `/en/`, y las URL viejas redirigen a su equivalente en español
 * (`astro.config.mjs`).
 *
 * Por eso el tipo de retorno de `t()` se ancla ahora al ESPAÑOL y no al
 * inglés: el español es el idioma que se mantiene, y anclarlo al que está
 * congelado haría fallar la compilación en cuanto una página nueva —el
 * Estudio de Expansión, por ejemplo— tenga una clave que el inglés no conoce.
 *
 * Para retomar el inglés: traducir los JSON que falten, volver a anclar el
 * tipo a `en`, recrear las páginas bajo `src/pages/en/` y quitar las
 * redirecciones. El `Lang` y el mapa de rutas nunca dejaron de soportarlo.
 * ---------------------------------------------------------------------------
 */
import type { Lang } from './routes';


import esCommon from '../locales/es/common.json';
import esHome from '../locales/es/home.json';
import esAdvisors from '../locales/es/advisors.json';
import esBusiness from '../locales/es/business.json';
import esPricing from '../locales/es/pricing.json';
import esServices from '../locales/es/services.json';
import esExpansion from '../locales/es/expansion.json';
import esThanks from '../locales/es/thanks.json';
import esPlatform from '../locales/es/platform.json';
import esDiagnostic from '../locales/es/diagnostic.json';
import esIndustries from '../locales/es/industries.json';
import esAbout from '../locales/es/about.json';
import esContact from '../locales/es/contact.json';
import esLegal from '../locales/es/legal.json';

const DICTIONARIES = {
  common: esCommon,
  home: esHome,
  advisors: esAdvisors,
  business: esBusiness,
  pricing: esPricing,
  services: esServices,
  expansion: esExpansion,
  thanks: esThanks,
  platform: esPlatform,
  diagnostic: esDiagnostic,
  industries: esIndustries,
  about: esAbout,
  contact: esContact,
  legal: esLegal,
} as const;

type Namespace = keyof typeof DICTIONARIES;

/** Diccionario de una página en un idioma. `t(lang, 'home').hero.title`. */
export function t<N extends Namespace>(_lang: Lang, ns: N): (typeof DICTIONARIES)[N] {
  // `_lang` se conserva en la firma a propósito, aunque hoy no se use: todas
  // las páginas ya la pasan, y el día que vuelva el inglés esto es una línea.
  return DICTIONARIES[ns];
}

/** Atajo para el diccionario común, que lo usan todas las páginas. */
export function common(lang: Lang) {
  return t(lang, 'common');
}
