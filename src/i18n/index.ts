/**
 * Carga de diccionarios.
 *
 * Un archivo JSON por página y por idioma, en `src/locales/<idioma>/`.
 *
 * Desde el rebranding el inglés NO es una traducción del español: es otra
 * línea de negocio, con otras páginas y otro contenido. Por eso hay dos tipos
 * de diccionario:
 *
 *  - COMPARTIDOS (`common`, `contact`, `thanks`, `legal`): los usan componentes
 *    que se pintan en los dos idiomas —la barra, el pie, el formulario, los
 *    legales— y tienen que tener la misma forma en los dos. Se piden con
 *    `t(lang, ns)`. El tipo es el del español y el inglés se comprueba contra
 *    él aquí mismo: si a `en/contact.json` le falta una clave, no compila.
 *
 *  - PROPIOS de cada idioma: las páginas de cada línea. Se piden con `es(ns)`
 *    o `en(ns)`, y cada uno tiene su propia forma.
 */
import type { Lang } from './routes';

import esCommon from '../locales/es/common.json';
import esContact from '../locales/es/contact.json';
import esThanks from '../locales/es/thanks.json';
import esLegal from '../locales/es/legal.json';
import esHome from '../locales/es/home.json';
import esServices from '../locales/es/services.json';
import esExpansion from '../locales/es/expansion.json';
import esAdvisors from '../locales/es/advisors.json';
import esPricing from '../locales/es/pricing.json';
import esPlatform from '../locales/es/platform.json';
import esAbout from '../locales/es/about.json';

import enCommon from '../locales/en/common.json';
import enContact from '../locales/en/contact.json';
import enThanks from '../locales/en/thanks.json';
import enLegal from '../locales/en/legal.json';
import enHome from '../locales/en/home.json';
import enServices from '../locales/en/services.json';
import enAbout from '../locales/en/about.json';

const SHARED_ES = {
  common: esCommon,
  contact: esContact,
  thanks: esThanks,
  legal: esLegal,
};

type Shared = typeof SHARED_ES;
type SharedNs = keyof Shared;

// La anotación es la comprobación: el inglés tiene que tener la forma del
// español en todo lo compartido.
const SHARED_EN: Shared = {
  common: enCommon,
  contact: enContact,
  thanks: enThanks,
  legal: enLegal,
};

const ES = {
  ...SHARED_ES,
  home: esHome,
  services: esServices,
  expansion: esExpansion,
  advisors: esAdvisors,
  pricing: esPricing,
  platform: esPlatform,
  about: esAbout,
};

const EN = {
  ...SHARED_EN,
  home: enHome,
  services: enServices,
  about: enAbout,
};

/** Diccionario compartido en un idioma: `t(lang, 'common').nav.cta`. */
export function t<N extends SharedNs>(lang: Lang, ns: N): Shared[N] {
  return (lang === 'en' ? SHARED_EN : SHARED_ES)[ns];
}

/** Diccionario de una página en español. */
export function es<N extends keyof typeof ES>(ns: N): (typeof ES)[N] {
  return ES[ns];
}

/** Diccionario de una página en inglés. */
export function en<N extends keyof typeof EN>(ns: N): (typeof EN)[N] {
  return EN[ns];
}

/** Atajo para el diccionario común, que lo usan todas las páginas. */
export function common(lang: Lang) {
  return t(lang, 'common');
}
