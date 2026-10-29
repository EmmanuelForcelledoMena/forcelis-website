/**
 * Configuración comercial del sitio. ARCHIVO ÚNICO.
 *
 * Aquí viven **todos** los precios, los interruptores, las ligas externas y los
 * identificadores de analítica. Ni una cifra de dinero ni una URL de agenda o
 * registro puede escribirse en una plantilla ni en un diccionario: si la
 * encuentras ahí, está mal y hay que traerla a este archivo.
 *
 * Lo que NO vive aquí es el texto. Los nombres de los planes, para quién es
 * cada uno y qué incluye cada diagnóstico están en `src/locales/*&#47;pricing.json`,
 * indexados por el mismo `id` que usas abajo. Es la regla 2 del repositorio
 * —ningún texto fuera de los diccionarios— y además es lo que permite que
 * «Despacho» sea «Practice» en inglés sin duplicar el precio.
 *
 * Los nombres de las claves están en español y con guion bajo a propósito,
 * iguales a como se especificaron: quien venga a cambiar `mostrar_precios` lo
 * busca por ese nombre exacto.
 *
 * ---------------------------------------------------------------------------
 * PARA ACTIVAR LOS PRECIOS
 *
 *   `mostrar_precios: true`, `npm run build`, listo. No hay que tocar nada más.
 *
 * Con `false` (el valor de hoy): no aparece ningún precio en ninguna página de
 * ninguno de los dos idiomas, la página de Precios sale del menú y del sitemap
 * y se sirve con `noindex`, y la calculadora de margen no se muestra.
 * ---------------------------------------------------------------------------
 */

export interface Plan {
  id: 'individual' | 'profesional' | 'despacho' | 'firma' | 'enterprise';
  /** Empresas incluidas en la mensualidad. `null` = se cotiza (Enterprise). */
  empresas: number | null;
  /** Mensualidad en `moneda`. `null` = se muestra «Cotización». */
  precio: number | null;
  /**
   * Los entregables salen con la marca del asesor. `null` = no se publica:
   * se define en la cotización (Enterprise, hasta que se confirme).
   */
  marca_propia: boolean | null;
  /** Se le pueden sumar empresas sueltas a `empresa_adicional` cada una. */
  admite_adicionales: boolean;
  /** Entra en la calculadora de margen. Individual y Enterprise no. */
  en_calculadora: boolean;
}

export interface Diagnostico {
  id: 'esencial' | 'completo' | 'asesores';
  precio: number;
}

/**
 * Servicio profesional que se contrata aparte de cualquier plan.
 *
 * `tipo_precio` decide cómo se lee el importe: `fijo` es el precio exacto,
 * `desde` es el mínimo de un servicio que se cotiza por alcance. `cobro` dice
 * qué paga el cliente con ese importe: una sesión, un mes o un proyecto.
 */
export interface Servicio {
  id: 'sesion' | 'acompanamiento' | 'proyecto' | 'gestionado';
  precio: number;
  tipo_precio: 'fijo' | 'desde';
  cobro: 'sesion' | 'mes' | 'proyecto';
}

export const negocio = {
  // ----------------------------------------------------------- interruptores
  mostrar_precios: true,
  /** Prueba de 14 días con una empresa. Encender solo cuando la plataforma la permita. */
  prueba_disponible: false,

  // ------------------------------------------------------------------- ligas
  // Vacías, cada botón cae al formulario de contacto con su `?tipo=`. Nunca se
  // publica una liga rota ni un botón que no lleva a ningún lado.
  url_agenda: '',
  url_registro: '',
  /** Enlace «Entrar» a la plataforma. Vacío = no se muestra en la barra. */
  url_app: '',

  // --------------------------------------------------------------- analítica
  // Cada script se carga SOLO si su identificador tiene valor Y la persona
  // aceptó las cookies. Vacíos, el sitio no habla con ningún tercero.
  ga4_id: '',
  meta_pixel_id: '',
  google_ads_id: '',
  google_ads_conversion_label: '',

  // ------------------------------------------------------------------ dinero
  moneda: 'MXN',
  /** Mensualidad por cada empresa que pase de las incluidas en el plan. */
  empresa_adicional: 59,
  uso_justo_cfdi_por_empresa_mes: 10000,

  planes: [
    { id: 'individual',  empresas: 1,    precio: 299,  marca_propia: false, admite_adicionales: false, en_calculadora: false },
    { id: 'profesional', empresas: 10,   precio: 799,  marca_propia: true,  admite_adicionales: true,  en_calculadora: true },
    { id: 'despacho',    empresas: 40,   precio: 1990, marca_propia: true,  admite_adicionales: true,  en_calculadora: true },
    { id: 'firma',       empresas: 100,  precio: 3990, marca_propia: true,  admite_adicionales: true,  en_calculadora: true },
    // Enterprise sustituye a Volumen: se cotiza y no tiene capacidad fija. Es
    // una modalidad de contratación, no un plan con funciones distintas. La
    // marca propia queda en `null` (no se promete) hasta que el negocio
    // confirme que se incluye.
    { id: 'enterprise',  empresas: null, precio: null, marca_propia: null,  admite_adicionales: false, en_calculadora: false },
  ] as const satisfies readonly Plan[],

  diagnosticos: [
    { id: 'esencial', precio: 9900 },
    { id: 'completo', precio: 19900 },
    { id: 'asesores', precio: 3900 },
  ] as const satisfies readonly Diagnostico[],

  monitoreo: { precio: 3900 },

  /**
   * Servicios profesionales nuevos, con los precios de referencia que fijó el
   * negocio para el catálogo. El alcance de cada uno se acuerda por escrito
   * antes de empezar; lo que todavía no está definido no se publica.
   * El Diagnóstico y el Monitoreo siguen arriba, con sus propios precios.
   *
   * PENDIENTE DE APROBACIÓN (la página dice «según la propuesta» mientras tanto):
   * - acompanamiento: sesiones al mes, duración, canales, entregables, límites.
   * - gestionado: entregables, frecuencia, capacidad, tiempos de respuesta,
   *   renovación.
   */
  servicios: [
    { id: 'sesion',         precio: 3500,  tipo_precio: 'fijo',  cobro: 'sesion' },
    { id: 'acompanamiento', precio: 7500,  tipo_precio: 'fijo',  cobro: 'mes' },
    { id: 'proyecto',       precio: 18000, tipo_precio: 'desde', cobro: 'proyecto' },
    { id: 'gestionado',     precio: 15000, tipo_precio: 'desde', cobro: 'mes' },
  ] as const satisfies readonly Servicio[],

  fundadores: {
    cupo: 10,
    /** 0.5 = la mitad. */
    descuento: 0.5,
    meses: 6,
  },
} as const;

// ---------------------------------------------------------------------------
// Ayudas
// ---------------------------------------------------------------------------

/** Un plan por su id. Lanza si no existe: un id mal escrito es un error de build. */
export function plan(id: Plan['id']): Plan {
  const found = negocio.planes.find((p) => p.id === id);
  if (!found) throw new Error(`Plan desconocido: ${id}`);
  return found;
}

/** Un servicio por su id. */
export function servicio(id: Servicio['id']): Servicio {
  const found = negocio.servicios.find((x) => x.id === id);
  if (!found) throw new Error(`Servicio desconocido: ${id}`);
  return found;
}

/** Un diagnóstico por su id. */
export function diagnostico(id: Diagnostico['id']): Diagnostico {
  const found = negocio.diagnosticos.find((d) => d.id === id);
  if (!found) throw new Error(`Diagnóstico desconocido: ${id}`);
  return found;
}

/**
 * Cifra con formato de moneda y SIN decimales: los precios de la lista son
 * cantidades redondas y «$1,990.00» solo añade ruido. El separador de miles
 * cambia con el idioma, que es la razón de pasar `lang`.
 */
export function precio(valor: number, lang: 'en' | 'es'): string {
  return new Intl.NumberFormat(lang === 'es' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency: negocio.moneda,
    // `narrowSymbol`: en inglés, el símbolo por omisión de MXN es «MX$», y
    // junto al «MXN» que el sitio escribe al lado salía la moneda dos veces.
    // Solo cambia la presentación, no el importe.
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(valor);
}

/**
 * Planes que entran en la calculadora, en el orden en que están declarados:
 * de menos a más empresas incluidas. El orden importa — ver `planRecomendado`.
 */
export const planesCalculadora = negocio.planes.filter((p) => p.en_calculadora);

/**
 * Plan más barato para administrar `empresas` empresas, y su costo mensual.
 *
 * costo = mensualidad + max(0, empresas − incluidas) × empresa_adicional
 *
 * En empate gana el que incluye más empresas: con 31 empresas, Profesional
 * cuesta 2,038 y Despacho 1,990, así que gana Despacho; si costaran lo mismo,
 * ganaría Despacho igual por incluir 40 contra 10. Lo cubren las pruebas de
 * `scripts/calculator.test.mjs`.
 */
export function planRecomendado(empresas: number): { plan: Plan; costo: number } {
  let mejor: { plan: Plan; costo: number } | null = null;
  for (const p of planesCalculadora) {
    const incluidas = p.empresas ?? 0;
    const base = p.precio ?? 0;
    const costo = base + Math.max(0, empresas - incluidas) * negocio.empresa_adicional;
    // `<=` y no `<`: la lista va de menos a más empresas incluidas, así que al
    // empatar el costo se queda el último evaluado, que es el que incluye más.
    if (!mejor || costo <= mejor.costo) mejor = { plan: p, costo };
  }
  return mejor!;
}
