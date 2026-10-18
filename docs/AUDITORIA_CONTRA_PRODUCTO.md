# Auditoría del sitio contra el producto

**Fecha:** 2026-10-16. **Producto revisado:** el repositorio `Forcelis`, rama
`comercial/fase-1`, verificado en su código y sus pruebas, no de memoria.

**Regla:** el sitio no anuncia como disponible nada que no exista. Lo que está
a medias se marca «beta» o «en desarrollo».

**Nada de esto está publicado.** Los cambios están en un commit local, sin
*push*. GitHub Pages solo publica lo que se sube.

---

## 1. Afirmaciones corregidas en este commit

| Página y clave | Decía | Por qué no se sostenía | Ahora dice |
|---|---|---|---|
| Plataforma, `meta.description` | «conecta la información de tu ERP, contabilidad, CFDI, ventas, compras, inventario y bancos» | No hay conectores. ERP, inventario y hojas de cálculo no tienen por dónde entrar | Lee CFDI, contabilidad electrónica del SAT y estados de cuenta bancarios |
| Plataforma, diagrama (`architecture.sources`, `steps`, `diagramAlt`) | Ocho sistemas, entre ellos ERP, inventario y hojas de cálculo; el primer paso, «Conectar» | Ídem | Cuatro fuentes reales: CFDI, complementos de pago, contabilidad electrónica y bancos (beta). El primer paso es «Importar» |
| Plataforma, `status.steps[0]` | «facturas, auxiliares, inventario, ventas» | Los auxiliares, el inventario y las ventas fuera del CFDI no se leen hoy | CFDI, contabilidad electrónica y estados de cuenta |
| Plataforma, `status.steps[2]` | «Cinco motores: margen, concentración, inflación de insumos, cobranza, pronóstico» | La misma página trae otra lista de cinco en otra sección | La lista sin número: margen, precios, concentración, insumos, cobranza y pronóstico |
| Plataforma, `status.today[1]` y Asesores, `includes.items[0]` | Ingesta «con nómina» | La nómina se excluye por omisión porque trae datos personales de los empleados (`fiscal/ingesta.py`) | Lo dice así: solo si se activa |
| Inicio, `hero.priorities` | «La cartera crece más rápido que las ventas», «Rotación de inventario por debajo del objetivo» | Ninguna regla produce la primera; la segunda necesita datos de inventario que no se pueden subir | Tres hallazgos que sí produce el motor (`config/reglas/`) |
| Diagnóstico, `findings.items[0]` y `[2]` | Las mismas dos | Ídem | «Se cobra mucho después de lo que se paga» y «Tus insumos suben más que la inflación», que existen como reglas |
| Diagnóstico, `inputs.items` | «Balanza o auxiliares»; inventario y ventas como insumos | Los auxiliares no se leen; inventario y ventas no tienen carga | Balanza en XML; inventario y ventas, «(en desarrollo)» |
| Precios, `diagnostics.items.completo` (página oculta) | «análisis operativo y de inventario» | El inventario no se puede analizar sin poder subirlo | Estados y razones desde la balanza; el inventario, «en desarrollo» |

### Añadido, porque existe y no se decía

- **Contabilidad electrónica del SAT:** catálogo, balanza y pólizas (Anexo 24,
  1.3), estados y razones con la cuenta de cada cifra. Se dice que la
  compatibilidad con cada sistema contable **todavía no se afirma**.
- **Estados de cuenta bancarios (beta):** CSV o TXT, revisión antes de
  guardar y conciliación con CFDI que confirma la persona. Se dice que está
  probado solo con datos de prueba.
- El contador de capacidades pasa a «11 capacidades, una de ellas en beta».

**Verificado:** `npm run verify` en verde (tipos, paridad es/en, calculadora,
build de 26 páginas, auditoría sin hallazgos y precios apagados coherentes en
las 28 páginas).

---

## 2. Lo que sigue pendiente y pide una decisión tuya

1. **Las seis secciones del informe** (Diagnóstico, `deliverables`). En
   octubre ya se señaló que el Word no las trae en ese orden. **No lo
   reverifiqué contra el Word actual**: hay que generar uno y comparar.
2. **El Diagnóstico Completo** promete más que el Esencial. Con el inventario
   en desarrollo, lo que añade hoy son los estados y razones desde la
   balanza. ¿Se mantiene como producto, cambia o se pausa?
3. **La IVA y la DIOT existen en el producto** (pantalla Fiscal, con el aviso
   de que no es una declaración), y el sitio no las menciona. El pie dice que
   Forcelis no hace declaraciones. Anunciarlas es decisión comercial.
4. **Lo que el sitio debe terminar incluyendo:**

   | Pieza | Estado |
   |---|---|
   | Propuesta de valor, funcionalidades y casos de uso (empresas y asesores) | Existe y está corregida |
   | Preguntas frecuentes | Solo en la página de asesores (`FaqList`). Falta una general |
   | Precios | Existe, oculta (`mostrar_precios: false`), hasta validarlos |
   | Contacto | Existe (Web3Forms) |
   | Registro e inicio de sesión | Preparados en `negocio.ts` (`url_registro`, `url_app`), **vacíos**: no hay nada desplegado y el alta libre sigue cerrada (D3) |
   | Demo | Se pide por el formulario. Falta `url_agenda`, que vas a pasar tú |
   | Términos y privacidad | Existen. **Bloqueados por los datos legales** (Estonia, `README.md`) |
   | Onboarding | Vive en el producto (pasada 11 de UX), no en el sitio |

5. **Prueba de 14 días:** `prueba_disponible: false`. El producto ya tiene el
   ciclo de prueba, pero el alta libre sigue cerrada. No se enciende hasta
   que haya alta libre, correo y pasarela (D3).

---

## 3. Matriz del 2026-10-18: afirmación → funcionalidad → prueba → estado

**Producto revisado:** `Forcelis`, rama `comercial/fase-1` en `cda7b65`. Cada
fila se verificó en el código y en sus pruebas, no de memoria. Las pruebas son
de datos sintéticos: **SUPPORTED quiere decir que existe y está probado, no que
se haya verificado con datos reales de un cliente** (ninguna lo está).

Estados: **SUPPORTED** (existe y tiene prueba), **PARTIAL** (existe una parte, o
existe sin prueba dedicada), **NOT IMPLEMENTED** (no existe).

### Lo que el sitio dice que hace

| Afirmación del sitio (clave) | Funcionalidad en el producto | Prueba | Estado |
|---|---|---|---|
| Ingesta de CFDI emitidos, recibidos, complementos de pago y retenciones; la nómina, solo si se activa (`platform.status.today[1]`, `advisors.includes`) | `fiscal/ingesta.py`, retenciones | `test_ingesta_zip.py`, `test_retenciones.py`, `test_analitica.py` | SUPPORTED |
| Aguanta duplicados, XML corruptos, unidades no normalizables | Ingesta y curación | `test_ingesta_zip.py`, `test_curacion.py` | SUPPORTED |
| Catálogo gerencial: el mismo artículo entre proveedores y periodos | `analitica/curacion.py` | `test_curacion.py` | SUPPORTED |
| Motores: precios, concentración y fuga, inflación de insumos, pulso, pronóstico | `analitica/` | `test_analitica.py`, `test_inflacion.py`, `test_invariantes_analisis.py` | SUPPORTED |
| «Cuatro clientes al 25 % dan un HHI de 0.25 exacto» (`platform.principles`) | `analitica/concentracion.py` | `test_analitica.py` | SUPPORTED |
| Cobranza real desde los complementos, con antigüedad por cobrar y por pagar | `analitica/cobranza.py`, `gerencial.py` | `test_analitica.py`, `test_gerencial.py` | SUPPORTED |
| Estado de resultados gerencial comparable periodo contra periodo | `analitica/gerencial.py` | `test_gerencial.py` | SUPPORTED |
| Contabilidad electrónica 1.3: catálogo, balanza y pólizas, validación, cruce, estados y razones con su cuenta | `contabilidad/` | `test_contabilidad_xml_sat.py`, `test_contabilidad_polizas_sat.py`, `test_contabilidad_estados_sat.py` | SUPPORTED. Compatibilidad con cada sistema contable: **no se afirma** (sin muestras reales) |
| **Nuevo en el sitio:** conciliación de cada CFDI con las pólizas que lo citan; auxiliar por cuenta | CE-3B/CE-3E, `contabilidad/auxiliar.py` | `test_contabilidad_conciliacion_web.py`, `test_contabilidad_auxiliar.py` | SUPPORTED |
| Estados de cuenta bancarios (beta), conciliación con CFDI; **nuevo:** contra las pólizas y hoja en Excel | `bancos/` | `test_bancos_*.py` (siete archivos) | SUPPORTED, en beta: sin layouts de bancos reales |
| **Nuevo en el sitio:** inteligencia financiera (beta): 19 indicadores, diagnósticos, traza hasta el CFDI, solo lectura | `app/inteligencia/` | `test_inteligencia_*.py` (104 pruebas) | SUPPORTED, en beta: umbrales sin aprobar (D19) |
| Tableros interactivos con un motor propio | `static/graficas.js` | `test_graficas_js.py`, `test_accesibilidad.py` | SUPPORTED |
| Entregables en Word, HTML y Excel | `exportes/` | `test_exporte_estados.py`, `test_comercial_marca.py` | SUPPORTED |
| Multiempresa con la marca del asesor; marca desde Profesional; Profesional 10 empresas; Individual sin adicionales; uso justo de 10 000 CFDI | `comercial/`, `config/comercial/catalogo_inicial.yaml` | `test_comercial_marca.py`, `test_comercial_uso_justo.py`, `test_comercial_derechos.py` | SUPPORTED |
| Segundo factor, secretos cifrados, códigos de un solo uso | `auth/mfa` | `test_mfa.py` | SUPPORTED |
| **Nuevo en el sitio:** equipo con tres roles que administra el dueño | `auth/equipo.py` | `test_equipo.py` | SUPPORTED |
| Aislamiento en cuatro capas, la última en PostgreSQL | Filtro por inquilino, propiedad, autorización, RLS | `test_aislamiento_tenant.py`, `test_cuarta_capa.py`, `test_rls_escrituras.py` | SUPPORTED |
| Ningún número lo genera un modelo de lenguaje | `copiloto/` solo redacta y está apagado; la inteligencia lee | `test_copiloto_en_pantalla.py`, `test_guardia_privacidad.py`, `test_inteligencia_lectura.py` | SUPPORTED |
| Lo que falta se reporta, no se inventa | Toda la analítica | `test_business_score.py`, `test_inteligencia_indicadores.py` | SUPPORTED |
| Nunca credenciales del SAT ni del banco | No existe ningún campo para la e.firma, la CIEC ni el banco | Inspección de las plantillas; **sin prueba dedicada** | PARTIAL (cierto; falta la prueba) |
| Business Score de cinco dimensiones, 12 meses contra los 12 anteriores | `analitica/business_score.py`, `config/business_score.yaml` | `test_business_score.py` | SUPPORTED |
| La lógica sectorial vive en configuración | `config/sectores/` | `test_analitica.py` | SUPPORTED |
| Diagnóstico: las seis secciones del informe en ese orden | Entregable Word | **No reverificado** contra el Word actual (pendiente desde el 2026-10-16) | PARTIAL |
| Diagnóstico Completo: estados y razones desde la balanza | `estados_sat`, `inteligencia` | Las de contabilidad | SUPPORTED (página de precios oculta) |

### Corregido en este commit, porque no se sostenía

| Página y clave | Decía | Estado antes | Ahora dice |
|---|---|---|---|
| Diagnóstico, `analysis.areas[1].items[3]` | Rentabilidad por cliente | NOT IMPLEMENTED: no hay costo por cliente | Ingreso y cobranza por cliente |
| Diagnóstico, `analysis.areas[2].items[0]` y `deliverables.items[2]` | Inventario | PARTIAL: solo los días de inventario desde la balanza | Días de inventario (desde la balanza) |
| Industrias, manufactura | Inventario y producción en proceso | NOT IMPLEMENTED | Días de inventario desde la balanza (producción en proceso, en desarrollo) |
| Industrias, distribución | Rotación de inventario por artículo | NOT IMPLEMENTED: necesita una fuente que no se puede subir | (en desarrollo) |
| Industrias, distribución | Precio de compra contra precio de lista | NOT IMPLEMENTED: no se leen listas de precios | Saltos en el precio de compra por proveedor (existe: `anomalias.saltos_precio_proveedor`) |
| Industrias, distribución | Días de cartera por segmento | PARTIAL: existe por cliente | Días de cartera por cliente |
| Industrias, B2B | Rentabilidad por cliente | NOT IMPLEMENTED | Ingreso por cliente y su tendencia |
| Industrias, importación | Costo puesto en almacén; exposición cambiaria; inventario contra tiempo de entrega | NOT IMPLEMENTED | Los tres, (en desarrollo) |
| Industrias, servicios | Rentabilidad por cliente y por proyecto | NOT IMPLEMENTED | (en desarrollo) |
| Inicio y Plataforma | «Conectar la información», «la plataforma conecta», «Forcelis los conecta» | Ambiguo: sugiere conectores, que no hay | «Reunir», «reúne», «los lee» |

### Existe en el producto y el sitio lo calla (decisión tuya)

- **IVA y DIOT** (pantalla Fiscal). El pie dice que Forcelis no presenta
  declaraciones, y es cierto: el producto lo dice en la pantalla. Anunciarlas es
  decisión comercial (pendiente desde el 2026-10-16).
- **Hallazgos de calidad del dato y posibles duplicados** (pantalla Calidad).
  Se mencionan solo como «inconsistencias de datos» en el Diagnóstico.

### Lo que no cambia y conviene saber

- Las etiquetas de los sectores (por ejemplo «Utilización» en servicios,
  «Costo en almacén» en importación) describen las palancas del sector, no
  funciones del producto; lo que el producto mira está en los puntos de cada
  tarjeta, que ahora dicen qué está en desarrollo.
- «Nosotros» describe la experiencia de la empresa (finanzas, operaciones,
  cadena de suministro), no funciones de la plataforma.

**Verificado:** `npm run verify` en verde:
- tipos y paridad es/en;
- calculadora;
- build de 26 páginas;
- auditoría de 28 páginas sin hallazgos;
- precios apagados coherentes.

**Nada publicado:** commit local, sin *push*.
