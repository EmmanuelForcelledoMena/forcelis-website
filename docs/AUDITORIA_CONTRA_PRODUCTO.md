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
