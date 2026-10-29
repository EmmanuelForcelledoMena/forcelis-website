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
import { negocio, type Plan, type Servicio } from './negocio';
import { path, type Lang } from '../i18n/routes';

/**
 * Las intenciones del formulario. Son las opciones de «¿Qué buscas?».
 *
 * `demo` es quien quiere ver el producto sin decir todavía si asesora empresas
 * o tiene una. Antes esa persona caía en `asesor` desde cualquier página, y una
 * empresa que pedía una demostración llegaba etiquetada como despacho.
 */
export const TIPOS = [
  'demo',
  'asesor',
  'fundador',
  'individual',
  'enterprise',
  'diagnostico',
  'monitoreo',
  'servicio',
] as const;
export type Tipo = (typeof TIPOS)[number];

/** Planes que se pueden pedir desde una tarjeta. Viajan en `?plan=`. */
export const PLANES_SOLICITABLES = negocio.planes.map((p) => p.id);

/** Servicios que se pueden pedir desde su tarjeta. Viajan en `?servicio=`. */
export const SERVICIOS_SOLICITABLES = negocio.servicios.map((s) => s.id);

/**
 * Formulario de contacto con la intención ya marcada y, si viene de una
 * tarjeta, el plan. El plan no es una compra: es el dato que la persona ya
 * eligió y que no tiene que volver a escribir en el mensaje.
 */
export function contacto(tipo: Tipo, lang: Lang, plan?: Plan['id']): string {
  return `${path('contact', lang)}?tipo=${tipo}${plan ? `&plan=${plan}` : ''}`;
}

/** Solicitar un servicio profesional desde su tarjeta. */
export function contratarServicio(id: Servicio['id'], lang: Lang): string {
  return `${path('contact', lang)}?tipo=servicio&servicio=${id}`;
}

/**
 * «Solicitar una demostración». Lleva a la agenda si hay liga, y si no, al
 * formulario con la intención de la página: `demo` por omisión, `asesor` en
 * las páginas de asesores, donde la respuesta se adapta a una cartera.
 */
export function agenda(lang: Lang, tipo: Tipo = 'demo'): string {
  return negocio.url_agenda || contacto(tipo, lang);
}

/** Solicitar un plan desde su tarjeta. Cae al formulario si no hay registro abierto. */
export function solicitarPlan(plan: Plan['id'], lang: Lang): string {
  if (plan === 'individual') return negocio.url_registro || contacto('individual', lang, plan);
  if (plan === 'enterprise') return contacto('enterprise', lang, plan);
  return contacto('asesor', lang, plan);
}

/** «Solicitar acceso», del plan Individual. Cae al formulario si no hay registro abierto. */
export function registro(lang: Lang): string {
  return solicitarPlan('individual', lang);
}

/** Si la liga sale del sitio, el enlace necesita `rel` y `target` propios. */
export function esExterno(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
