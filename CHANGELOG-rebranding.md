# Rebranding de forcelis-group.com — registro de trabajo

Inicio: 2026-11-11. Respaldo del estado anterior: etiqueta `pre-rebranding-2026`
(apunta a `44cefe1`, lo que estaba publicado antes de empezar).

Para volver al sitio anterior completo:

    git checkout main && git reset --hard pre-rebranding-2026 && git push --force origin main

---

## 0. Inventario de URL antes del cambio

Tecnología: **Astro 5** (sitio estático), Tailwind 4, diccionarios JSON por
idioma en `src/locales/`, mapa de rutas en `src/i18n/routes.ts`, precios en
`src/config/negocio.ts`. Despliegue: GitHub Actions → GitHub Pages en cada push
a `main`. Formulario: Web3Forms.

| URL | Estado antes |
|---|---|
| `/` | Reenvío a `/en/` o `/es/` según idioma del navegador |
| `/es/` | Portada SaaS «inteligencia financiera desde tus CFDI» |
| `/es/contadores-y-consultores/` | Página para asesores (suscripción) |
| `/es/para-empresas/` | Plan Individual + Diagnóstico + Monitoreo |
| `/es/plataforma/` | Detalle técnico de la plataforma |
| `/es/precios/` | Planes de suscripción (publicados) + servicios profesionales |
| `/es/servicios/` | Catálogo de servicios profesionales (etapa SaaS) |
| `/es/diagnostico-empresarial/` | Diagnóstico Empresarial |
| `/es/industrias/` | Sectores |
| `/es/nosotros/` | Nosotros (empresa) |
| `/es/contacto/`, `/es/gracias/` | Formulario y acuse |
| `/es/privacidad/`, `/es/terminos/` | Legales |
| `/es/soluciones/` | Reenvío a `/es/para-empresas/` |
| `/en/*` | Traducción completa de lo anterior (13 páginas) + `/en/solutions/` reenvío |

---

## 1. Limpieza de información sensible

Escaneados: todos los archivos del árbol actual y **el historial completo de
todas las ramas** (`git log --all -p`), buscando credenciales, archivos
sensibles por extensión, correos, teléfonos, RFC/CURP, menciones a empleadores
y documentos internos.

### Qué se encontró

| Tipo | Hallazgo | Acción |
|---|---|---|
| Credenciales (API keys, tokens, `.env`, llaves) | **Ninguna**, ni en archivos ni en el historial | — |
| Clave del formulario (Web3Forms) | No está en el repositorio: vive en las Variables de GitHub | — (ver nota abajo) |
| Correo de persona en el contenido de archivos | Ninguno | — |
| Correo de persona en un **mensaje** de commit | Uno, en un commit antiguo | Ver «Historial» |
| Correo personal en los **metadatos de autor** | En los commits hechos desde tu cuenta | Ver PENDIENTES |
| Mención de empleador | **Ninguna** en archivos ni en historial | — |
| Documentos internos | Auditoría del sitio contra el producto; notas de configuración de LinkedIn (con referencias a la constitución de la empresa) | Movidos al repositorio privado local y eliminados de aquí |
| Comentario del workflow | Mencionaba el prefijo del correo personal | Reescrito sin el dato |
| Archivos de datos de clientes / CFDI | Ninguno | — |
| Metadatos de imágenes | Las imágenes del repositorio las genera `sharp` desde código; no llevan autor ni rutas | — |

**Nota sobre la clave de Web3Forms:** es una clave pública por diseño — viaja en
el HTML del formulario en cada carga de página. No es un secreto y no hace falta
rotarla por estar expuesta; lo está siempre.

### Dónde quedaron los documentos movidos

Carpeta `Code/forcelis-private/` (hermana de este repositorio, fuera de él), con
su propio Git y sin remoto: no se pudo crear el repositorio privado en GitHub
desde esta sesión porque no hay `gh` instalado ni sesión autenticada. El README
de esa carpeta trae el comando exacto para subirlo. Ver PENDIENTES.

### Historial: decisión de NO reescribirlo

La instrucción era reescribir el historial si había credenciales o datos
personales en commits anteriores. Lo que hay es: un correo en un mensaje de
commit, tu correo en los metadatos de autor y tres líneas que mencionan el país
de constitución en dos documentos internos. **Ninguna credencial.**

Se decidió no reescribirlo, por tres razones:

1. **No resuelve lo que pretende.** El correo de los metadatos de autor está en
   todos tus commits y GitHub lo muestra en cada uno; quitar una mención de un
   mensaje deja la otra en cuarenta lugares. Reescribir autores en todo el
   historial rompe además la asociación de los commits con tu cuenta.
2. **No hay dónde poner el respaldo.** El procedimiento pide un espejo en un
   repositorio privado antes de forzar el push, y ese repositorio no se puede
   crear desde aquí (ver arriba). Forzar un push sobre el repositorio que
   publica el sitio, con el único respaldo en un disco local, es el tipo de
   riesgo que no se corre por tres líneas.
3. **Afecta a otras ramas vivas.** Hay ramas de otras sesiones en el remoto;
   reescribir cambia todos los identificadores de commit y las deja
   divergentes.

Si aun así se quiere hacer, los pasos están en PENDIENTES.

---


## 2. Plan (cumplido)

1. Respaldo y limpieza (sección 1).
2. Marca: símbolo y logotipo en SVG, favicon, imagen para redes, tokens de
   color y tipografía.
3. Arquitectura: tres líneas de negocio, menú por idioma, redirecciones.
4. Contenido en español.
5. Contenido en inglés: línea internacional, no traducción.
6. Legales para consultoría, plataforma y oferta gratuita.
7. Revisión en producción a 375, 768 y 1280 px hasta cumplir la lista.

Publicado en `main` en dos commits: `5e06703` (rebranding completo) y
`aa4aac7` (ajustes tras la revisión en producción). La rama de trabajo
`giro-consultoria` quedó igual a `main`.

---

## 3. Qué cambió en cada página

### Marca (todas las páginas)

- Paleta de la hoja de marca como tokens en `:root`: `--fc-vino #772014`,
  `--fc-rojo #A92928`, `--fc-negro #191919`, `--fc-blanco #F6F4F3`,
  `--fc-arena #BEB7A4`. El tema de Tailwind los lee de ahí.
- Tipografía: `--fc-font-titulos: "Futura", "Jost", sans-serif` y
  `--fc-font-texto: "Gotham", "Montserrat", sans-serif`. Títulos en peso medio
  y con poco interletrado. Se retiró Inter.
- Logotipo nuevo en la barra y el pie (símbolo + FORCELIS), favicon con el
  símbolo, `og-image.png` nueva (negro, logotipo, dominio, franja del patrón),
  icono de iOS y recursos de LinkedIn regenerados.
- Botones rojos con texto blanco (principal) y contorno negro (secundario), con
  esquinas suaves; tarjetas con el mismo radio en todo el sitio.
- Franja del patrón bajo las cabeceras claras, sobre el pie y en los cierres.
- Barra: menú por idioma y botón «Agenda una llamada» / «Book a call», que abre
  el calendario. Selector de idioma ES → `/es/`, EN → `/en/`, con la nota
  «English: for companies entering Mexico» (y «Español: para negocios en
  México» en las páginas en inglés).
- Pie: columnas por línea de negocio y el texto legal de la sección 3.8.

### Español

| Página | Cambios |
|---|---|
| `/es/` | Reescrita (3.1): encabezado claro con una vista previa de reporte marcada «Datos ilustrativos», para quién es, el problema, «Dos formas de empezar» (Diagnóstico desde $6,900 y Expansión desde $18,000, ambos desde `negocio.ts`), cómo trabajamos, por qué Forcelis, franja oscura para asesores con los 3 meses gratis, cierre |
| `/es/servicios/` | Reescrita (3.2): recorrido Llamada → Diagnóstico / Expansión / Mercado → Acompañamiento, con la rama del Estudio de Expansión al Proyecto de Franquicia; los dos diagnósticos destacados; seis tarjetas con ancla (`#diagnostico`, `#expansion`, `#mercado`, `#sesion`, `#acompanamiento`, `#franquicia`) en el orden pedido; nota al pie |
| `/es/estudio-de-expansion/` | Reescrita (3.3): las cuatro preguntas, qué necesitamos (con «Nunca pedimos tu e.firma ni contraseñas del SAT o del banco»), qué recibes con duración y precio, los tres veredictos con su siguiente paso y la vista previa del reporte con el panel de calificación, marcada «Datos ilustrativos» |
| `/es/para-asesores/` | Nueva, a partir de la de contadores (3.4): oferta destacada arriba, para quién, cómo funciona, qué incluye (solo lo construido), calculadora con la línea de los meses gratis, planes, cómo se conecta con la consultoría, preguntas (la de la marca propia sigue diciendo que está en verificación) y enlaces a Precios y Plataforma |
| `/es/precios/` | Actualizada (3.5): oferta de lanzamiento arriba (3 meses gratis del Profesional para los primeros 50, qué se pide a cambio, qué pasa al terminar, botón a `/es/contacto/?tipo=prueba`), planes sin cambio de precio, comparación, notas de empresa adicional y uso justo, enlace a Servicios. Fuera «No hay plan gratis» y el Programa Fundadores |
| `/es/plataforma/` | Contenido técnico conservado; cabecera oscura, gráfica en negro y rojo, esquinas de marca y cierre hacia Precios y Para asesores |
| `/es/nosotros/` | Reescrita (3.6): sin empleadores, idiomas, principios en primera persona, foto y LinkedIn solo si existen |
| `/es/contacto/` | Simplificada (3.7): calendario arriba; formulario con nombre, correo, negocio, giro, sucursales, ciudad y qué quieres lograr, y el `tipo` preseleccionado desde la URL |
| `/es/gracias/` | Mensaje según el `tipo` recibido |
| `/es/privacidad/`, `/es/terminos/` | Revisados para cubrir consultoría, plataforma, benchmark con autorización firmada y la oferta de lanzamiento |

### Inglés (línea internacional)

| Página | Cambios |
|---|---|
| `/en/` | Nueva (4.1): market entry for Mexico, tres puntos de prueba, a quién ayudamos, resumen de servicios, cierre |
| `/en/services/` | Nueva (4.2): Mexico Market Snapshot desde USD 1,500 y tres servicios que se cotizan, con la nota de alcance |
| `/en/about/` | Nueva (4.3): misma plantilla que Nosotros, orientada a empresas extranjeras |
| `/en/contact/` | Nueva (4.4): nombre, correo, empresa, país, industria y qué estás evaluando en México; `tipo=internacional` |
| `/en/thank-you/`, `/en/privacy/`, `/en/terms/` | Acuse y legales en inglés |

### Redirecciones (meta refresh + canónica + enlace visible)

| URL vieja | Ahora |
|---|---|
| `/es/contadores-y-consultores/` | `/es/para-asesores/` |
| `/es/diagnostico-empresarial/` | `/es/servicios/#diagnostico` |
| `/es/para-empresas/`, `/es/industrias/`, `/es/soluciones/` | `/es/servicios/` |
| `/en/accountants-and-advisors/`, `/en/for-businesses/`, `/en/business-diagnostic/`, `/en/expansion-study/`, `/en/platform/`, `/en/pricing/`, `/en/industries/`, `/en/solutions/` | `/en/` |

---

## 4. Decisiones tomadas

### Marca

- **Símbolo extraído de los vectores del PDF**, no redibujado: vértices exactos
  leídos con pdf.js. La barra izquierda es `#C63030`, un rojo que no está en la
  tabla de la paleta pero sí en el PDF; se respeta tal cual.
- **Recursos de marca en `public/brand/`** y no en `assets/brand/`: en Astro,
  `public/` es lo que se sirve, así los SVG tienen URL propia
  (`/brand/logo-horizontal.svg`, etc.).
- **Logotipo a trazos con Jost 500**, ajustado a la caja medida en el PDF (mismo
  alto de mayúsculas, ancho y separación del símbolo). Si se compra Futura, se
  cambia una ruta en `scripts/build-brand.mjs` y se vuelve a generar.
- **`logo-horizontal-blanco.svg` es todo blanco** (como la tarjeta degradada de
  la hoja de marca), para fondos rojos o foto. En las secciones negras del sitio
  el logotipo lleva el símbolo en sus rojos y la palabra en blanco, como el
  botón negro de la hoja de marca.
- **Fuentes servidas desde el propio dominio**, no desde Google Fonts: ninguna
  IP de visitante sale a terceros y no hay un dominio externo en el primer
  pintado. `font-display: swap` en las dos.
- **`og-image.png` sin frase**: fondo negro, logotipo y dominio, con una franja
  del patrón. Sirve igual para español e inglés.
- **Un solo generador** (`npm run build:brand`) para símbolo, logotipos,
  patrón, favicon (SVG, PNG, ICO), icono de iOS e imagen para redes. Sustituye
  a `scripts/build-og.mjs`, que dibujaba la marca anterior.
- **Las imágenes de los mockups del PDF no se usan en el sitio.** Todas muestran
  datos de ejemplo o textos de la marca anterior («Data-driven insights…») como
  si fueran reales, o son fotos de banco. Se tomó de ellas el estilo: cabecera
  oscura con las barras rojas, tarjeta de ingresos con línea roja, indicador
  circular. Las vistas previas del sitio están dibujadas en código y llevan
  «Datos ilustrativos».

### Estilo

- **Blanco cálido para dueños de negocio; oscuro para asesores e inglés.** Las
  páginas de la consultoría México abren con cabecera clara y el remate del
  titular en rojo (texto grande, permitido). Para asesores, Precios, Plataforma
  y todo `/en/` abren en negro con el símbolo en rojo; ahí el acento de texto
  es la arena. La única franja oscura en la portada en español es la de
  asesores, para que se note que es otra audiencia.
- **Ningún texto rojo ni vino sobre negro.** Comprobado en producción con un
  análisis de contraste de cada texto de cada página, además de Lighthouse.

### Arquitectura y contenido

- **Las rutas son parciales por idioma**: `/es/` y `/en/` ya no son espejo.
  `hreflang` solo entre privacidad y términos, que sí son traducción; la
  portada, Servicios, Nosotros y Contacto existen en los dos idiomas pero le
  hablan a clientes distintos.
- **Privacidad, términos y gracias existen en inglés** aunque la sección 2 pedía
  redirigir «el resto de páginas `/en/`»: el formulario en inglés necesita un
  aviso de privacidad que la persona pueda leer, y el acuse del envío.
- **Páginas retiradas**: sus URL redirigen y su código se eliminó del árbol
  actual (Para empresas, Diagnóstico Empresarial, Industrias y las versiones
  inglesas de la etapa anterior). Ninguna URL publicada da 404; el contenido
  anterior completo está en la etiqueta `pre-rebranding-2026`.
- **Precios en `src/config/negocio.ts`**, el archivo único que ya tenía el
  sitio (el encargo sugería `data/precios.json`; en este proyecto el archivo
  único ya existía y está tipado). `npm run check:precios` compara ese archivo
  con la lista aprobada y falla si alguna página muestra un importe que no sale
  de él.
- **Acompañamiento de Crecimiento**: el tramo de expansión, franquicia o rescate
  pasó de $7,500 a «Cotización», como pide la tabla 3.2.
- **La sesión de consultoría** muestra $3,500 sin unidad («por sesión» sobraba
  junto a «1 día»).
- **Cifras de la oferta en el texto como plantillas** (`{months}`, `{n}`,
  `{plan}`): cambiar `oferta_lanzamiento` en `negocio.ts` cambia todos los
  textos que la mencionan.
- **La calculadora de margen** muestra una línea aparte para los meses gratis:
  con hasta 10 empresas (las que incluye el Profesional) el margen de esos meses
  es todo el ingreso. Con más empresas no calcula nada para esos meses, porque
  la oferta no dice cómo se cobrarían las empresas extra y suponerlo sería
  inventar condiciones.
- **Formulario**: el `tipo` es un selector visible en español (diagnostico,
  expansion, mercado, asesor, prueba, otro) que se marca solo desde la URL; en
  inglés va oculto y fijo (`internacional`). Se conserva Web3Forms.
- **Nosotros**: se quitó la mención a «una empresa global de comercio
  electrónico». No nombraba a nadie, pero apuntaba al empleo actual.
- **Raíz `/`**: lleva a `/es/`. Solo quien eligió el inglés con el selector
  vuelve a `/en/`; ya no se adivina por el idioma del navegador.
- **El README** describía el sitio anterior (inglés como traducción, Inter,
  `build:og`); se actualizó. También se quitaron de él y de un comentario del
  código dos frases que mencionaban el domicilio de la sociedad.
- **Historial de git no reescrito**: ver sección 1.

---

## 5. Verificación en producción

Todo medido sobre `https://forcelis-group.com` después del último despliegue.

| Criterio | Resultado |
|---|---|
| Páginas de la sección 2 con marca y menú nuevos | 18 páginas más la raíz, todas responden 200 |
| URL viejas | Las 13 redirigen a su página nueva; ningún enlace interno apunta a ellas (`npm run audit`) |
| Enlaces internos rotos | 0 |
| Menú viejo, «No hay plan gratis», «Programa Fundadores», «Lorem ipsum», nombres ficticios, «TODO» | 0 (`npm run audit` los busca en el texto de cada página) |
| Precios | Coinciden con el encargo y salen solo de `negocio.ts` (`npm run check:precios`) |
| Oferta de 3 meses gratis | En Precios, Para asesores y la franja de la portada, sin requisitos de uso |
| Contraste AA | Lighthouse 100 en accesibilidad en las 13 páginas medidas; análisis propio de cada texto sin ningún caso por debajo de AA ni rojo o vino sobre negro |
| 375, 768 y 1280 px | 36 capturas de página completa, 0 px de desplazamiento horizontal en todas |
| Consola del navegador | 0 errores en las 36 cargas |
| Lighthouse móvil, portada en español | Rendimiento 93 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100 |
| Formularios | Español con `tipo` desde la URL y campaña UTM; inglés con `tipo=internacional`. Verificado interceptando el envío en el navegador, **sin mandar ningún mensaje real** (ver PENDIENTES) |
| `og-image.png`, favicon, `sitemap.xml` | Nuevos; el sitemap lista las 16 páginas indexables y excluye gracias y las redirecciones |
| Repositorio | Sin credenciales; documentos internos fuera (ver sección 1) |

Capturas finales: `docs/capturas-rebranding/` (`<página>-<ancho>.png`).
