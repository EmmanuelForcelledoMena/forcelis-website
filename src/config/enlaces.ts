/**
 * Resolución de las ligas de conversión.
 *
 * Cada botón de «agenda» tiene dos destinos posibles: la liga externa de
 * `negocio.ts` si está configurada, y el formulario de contacto con su
 * `?tipo=` si no. Esa decisión se toma AQUÍ y en ningún otro sitio, para que
 * ninguna plantilla publique un `href=""` —que el navegador interpreta como
 * «recargar esta página» y es la peor forma de romper un botón: no parece
 * roto—.
 *
 * El `?tipo=` preselecciona la opción correcta en el formulario, viaja en el
 * envío y llega a la página de gracias, donde se dispara la conversión. Así se
 * sabe de dónde vino cada solicitud.
 */
import { negocio, type Plan, type Servicio } from './negocio';
import { path, type Lang } from '../i18n/routes';

/**
 * Las intenciones del formulario en español. Son las opciones de «¿Qué
 * buscas?», y los valores que aceptan los enlaces `?tipo=`.
 *
 *   diagnostico  Diagnóstico de Negocio
 *   expansion    Estudio de Expansión (y, después, Proyecto de Franquicia)
 *   mercado      Estudio de Mercado
 *   asesor       contador o consultor interesado en la plataforma
 *   prueba       los 3 meses gratis del plan Profesional
 *   otro         sesión, acompañamiento o cualquier otra cosa
 */
export const TIPOS_ES = ['diagnostico', 'expansion', 'mercado', 'asesor', 'prueba', 'otro'] as const;

/** En inglés hay una sola línea: todo lo que llega es de la consultoría internacional. */
export const TIPOS_EN = ['internacional'] as const;

export const TIPOS = [...TIPOS_ES, ...TIPOS_EN] as const;
export type Tipo = (typeof TIPOS)[number];

/** Planes que se pueden pedir desde una tarjeta. Viajan en `?plan=`. */
export const PLANES_SOLICITABLES = negocio.planes.map((p) => p.id);

/** Servicios que se pueden pedir desde su tarjeta. Viajan en `?servicio=`. */
export const SERVICIOS_SOLICITABLES = negocio.servicios.map((s) => s.id);

/** Formulario de contacto con la intención ya marcada y, si viene de una tarjeta, el plan. */
export function contacto(tipo: Tipo, lang: Lang, plan?: Plan['id']): string {
  return `${path('contact', lang)}?tipo=${tipo}${plan ? `&plan=${plan}` : ''}`;
}

/**
 * Solicitar un servicio desde su tarjeta. Los tres estudios tienen su propio
 * `tipo`; el resto entra como `otro` con el servicio marcado.
 */
export function contratarServicio(id: Servicio['id'], lang: Lang): string {
  const propio: Partial<Record<Servicio['id'], Tipo>> = {
    diagnostico: 'diagnostico',
    expansion: 'expansion',
    franquicia: 'expansion',
    mercado: 'mercado',
  };
  return `${path('contact', lang)}?tipo=${propio[id] ?? 'otro'}&servicio=${id}`;
}

/**
 * «Agenda una llamada». Lleva a la agenda si hay liga, y si no, al formulario
 * con la intención de la página.
 */
export function agenda(lang: Lang, tipo?: Tipo): string {
  return negocio.url_agenda || contacto(tipo ?? (lang === 'en' ? 'internacional' : 'otro'), lang);
}

/** Solicitar un plan desde su tarjeta. */
export function solicitarPlan(plan: Plan['id'], lang: Lang): string {
  return contacto('asesor', lang, plan);
}

/** «Quiero mis 3 meses gratis». */
export function pedirPrueba(): string {
  return contacto('prueba', 'es');
}

/** Si la liga sale del sitio, el enlace necesita `rel` y `target` propios. */
export function esExterno(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
