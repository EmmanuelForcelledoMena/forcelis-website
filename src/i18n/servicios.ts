/**
 * El catálogo de servicios, ya con sus palabras y sus importes.
 *
 * Es la única pieza que junta las dos mitades: el dinero sale de
 * `negocio.ts` y el texto de `services.json`, y nada de lo uno se escribe en
 * lo otro. Lo usan la página de Servicios y la portada, y tiene que decir lo
 * mismo en las dos.
 *
 * Solo existe en español: los servicios de la línea internacional son otros
 * y viven en `en/services.json`.
 *
 * El orden es el de la página: primero las dos puertas de entrada —los dos
 * diagnósticos—, después lo que se contrata a partir de ellos.
 */
import { negocio, precioServicio, type Servicio } from '../config/negocio';
import { es } from './index';

export type IdServicio = Servicio['id'];

export const ORDEN_SERVICIOS: IdServicio[] = [
  'diagnostico',
  'expansion',
  'mercado',
  'sesion',
  'acompanamiento',
  'franquicia',
];

/**
 * Las dos puertas de entrada del recorrido comercial. Se marcan en la página
 * para que un dueño sepa por dónde empezar sin leer los seis.
 */
export const PUERTAS_DE_ENTRADA: IdServicio[] = ['diagnostico', 'expansion'];

export interface ServicioResuelto {
  id: IdServicio;
  nombre: string;
  paraQuien: string;
  incluye: string;
  entregable: string;
  duracion: string;
  nota: string;
  /** Importe ya formateado, o la palabra «Se cotiza» cuando no se publica. */
  precio: string;
  /** La unidad, cuando el importe la necesita: «al mes», «por sesión». */
  unidad: string;
  /** Solo el Acompañamiento: un importe por perfil de cliente. */
  tramos: { etiqueta: string; importe: string }[];
  esPuertaDeEntrada: boolean;
}

export function serviciosResueltos(): ServicioResuelto[] {
  const s = es('services');
  const lang = 'es';

  return ORDEN_SERVICIOS.map((id) => {
    const config = negocio.servicios.find((x) => x.id === id)!;
    const texto = s.items[id];
    const importe = precioServicio(config, lang);

    // La unidad solo se imprime cuando aclara algo. En un proyecto a precio
    // cerrado, «por proyecto» es ruido: ya se entiende que es un pago único.
    const unidad =
      config.cobro === 'sesion'
        ? s.labels.perSession
        : config.cobro === 'mes'
          ? s.labels.perMonth
          : '';

    return {
      id,
      nombre: texto.name,
      paraQuien: texto.forWhom,
      incluye: texto.includes,
      entregable: texto.deliverable,
      duracion: texto.duration,
      nota: texto.note,
      precio: importe ? importe.texto : s.labels.quote,
      unidad: importe ? unidad : '',
      tramos:
        importe?.tramos?.map((tr) => ({
          etiqueta: s.tiers[tr.id as keyof typeof s.tiers],
          importe: tr.texto ?? s.labels.quote,
        })) ?? [],
      esPuertaDeEntrada: PUERTAS_DE_ENTRADA.includes(id),
    };
  });
}
