/**
 * Precio de cada servicio profesional, ya con sus palabras.
 *
 * Lo usan Precios (la tabla resumen) y Servicios (las tarjetas), y tiene que
 * decir lo mismo en las dos: el importe sale de `negocio.ts`, la forma de
 * leerlo —precio fijo, «desde», pago único, al mes— del diccionario.
 */
import { negocio, diagnostico, servicio, precio } from '../config/negocio';
import { t } from './index';
import type { Lang } from './routes';

export type IdServicio =
  | 'diagnostico'
  | 'sesion'
  | 'acompanamiento'
  | 'proyecto'
  | 'monitoreo'
  | 'gestionado';

/** El orden del catálogo, por modalidad de contratación. */
export const ORDEN_SERVICIOS: IdServicio[] = [
  'diagnostico',
  'sesion',
  'acompanamiento',
  'proyecto',
  'monitoreo',
  'gestionado',
];

export interface PrecioServicio {
  importe: string;
  unidad: string;
}

export function preciosServicios(lang: Lang): Record<IdServicio, PrecioServicio[]> {
  const s = t(lang, 'services');
  const conMoneda = (valor: number) => `${precio(valor, lang)} ${negocio.moneda}`;
  const cobro = { sesion: s.labels.perSession, mes: s.labels.perMonth, proyecto: s.labels.perProject };
  const nuevo = (id: 'sesion' | 'acompanamiento' | 'proyecto' | 'gestionado'): PrecioServicio[] => {
    const sv = servicio(id);
    const importe = conMoneda(sv.precio);
    return [
      {
        importe: sv.tipo_precio === 'desde' ? s.labels.from.replace('{price}', importe) : importe,
        unidad: cobro[sv.cobro],
      },
    ];
  };
  return {
    diagnostico: [
      // «Pago único» ya lo dice la modalidad del servicio; aquí basta el paquete.
      { importe: conMoneda(diagnostico('esencial').precio), unidad: s.items.diagnostico.esencial },
      { importe: conMoneda(diagnostico('completo').precio), unidad: s.items.diagnostico.completo },
    ],
    sesion: nuevo('sesion'),
    acompanamiento: nuevo('acompanamiento'),
    proyecto: nuevo('proyecto'),
    monitoreo: [{ importe: conMoneda(negocio.monitoreo.precio), unidad: s.labels.perMonth }],
    gestionado: nuevo('gestionado'),
  };
}
