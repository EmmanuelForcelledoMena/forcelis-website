/**
 * Carga de diccionarios.
 *
 * Un archivo JSON por página y por idioma. La alternativa —un único
 * `translations.json` gigante— hace que cualquier cambio de copy toque el mismo
 * archivo y que revisar una traducción exija leerlo entero.
 *
 * El tipo de retorno se ancla al inglés a propósito: si el JSON en español
 * pierde una clave, el error sale al compilar la página que la usa y no en
 * producción con un `undefined` impreso en la pantalla.
 */
import type { Lang } from './routes';

import enCommon from '../locales/en/common.json';
import enHome from '../locales/en/home.json';
import enSolutions from '../locales/en/solutions.json';
import enPlatform from '../locales/en/platform.json';
import enDiagnostic from '../locales/en/diagnostic.json';
import enIndustries from '../locales/en/industries.json';
import enAbout from '../locales/en/about.json';
import enContact from '../locales/en/contact.json';
import enLegal from '../locales/en/legal.json';

import esCommon from '../locales/es/common.json';
import esHome from '../locales/es/home.json';
import esSolutions from '../locales/es/solutions.json';
import esPlatform from '../locales/es/platform.json';
import esDiagnostic from '../locales/es/diagnostic.json';
import esIndustries from '../locales/es/industries.json';
import esAbout from '../locales/es/about.json';
import esContact from '../locales/es/contact.json';
import esLegal from '../locales/es/legal.json';

const DICTIONARIES = {
  en: {
    common: enCommon,
    home: enHome,
    solutions: enSolutions,
    platform: enPlatform,
    diagnostic: enDiagnostic,
    industries: enIndustries,
    about: enAbout,
    contact: enContact,
    legal: enLegal,
  },
  es: {
    common: esCommon,
    home: esHome,
    solutions: esSolutions,
    platform: esPlatform,
    diagnostic: esDiagnostic,
    industries: esIndustries,
    about: esAbout,
    contact: esContact,
    legal: esLegal,
  },
} as const;

type Namespace = keyof (typeof DICTIONARIES)['en'];

/** Diccionario de una página en un idioma. `t(lang, 'home').hero.title`. */
export function t<N extends Namespace>(lang: Lang, ns: N): (typeof DICTIONARIES)['en'][N] {
  return DICTIONARIES[lang][ns] as (typeof DICTIONARIES)['en'][N];
}

/** Atajo para el diccionario común, que lo usan todas las páginas. */
export function common(lang: Lang) {
  return t(lang, 'common');
}
