/**
 * Resolución de las ligas de conversión.
 *
 * Cada botón de «agenda» o «registro» tiene dos destinos posibles: la liga
 * externa de `negocio.ts` si está configurada, y el formulario de contacto con
 * su `?tipo=` si no. Esa decisión se toma AQUÍ y en ningún otro sitio, para que
 * no haya una plantilla que resuelva el caso vacío de otra manera —o que
 * publique un `href=""`, que el navegador interpreta como «recargar esta
 * página» y es la peor forma de romper un botón: no parece roto.
 *
 * El `?tipo=` preselecciona la opción correcta en el formulario y viaja hasta
 * la página de gracias, donde se dispara la conversión.
 */
import { negocio } from './negocio';
import { path, type Lang } from '../i18n/routes';

/** Las cinco intenciones del formulario. Son las opciones de «¿Qué buscas?». */
export const TIPOS = ['asesor', 'fundador', 'individual', 'diagnostico', 'monitoreo'] as const;
export type Tipo = (typeof TIPOS)[number];

/** Formulario de contacto con la intención ya marcada. */
export function contacto(tipo: Tipo, lang: Lang): string {
  return `${path('contact', lang)}?tipo=${tipo}`;
}

/** «Agenda una llamada». Cae al formulario como asesor si no hay liga de agenda. */
export function agenda(lang: Lang): string {
  return negocio.url_agenda || contacto('asesor', lang);
}

/** «Lo quiero», del plan Individual. Cae al formulario si no hay registro abierto. */
export function registro(lang: Lang): string {
  return negocio.url_registro || contacto('individual', lang);
}

/** Si la liga sale del sitio, el enlace necesita `rel` y `target` propios. */
export function esExterno(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
