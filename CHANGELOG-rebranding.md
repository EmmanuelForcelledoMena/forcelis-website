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

## 2. Plan

1. ~~Respaldo y limpieza~~ (arriba).
2. Marca: símbolo y logotipo en SVG, favicon, imagen para redes, tokens de color
   y tipografía (Jost + Montserrat como sustitutos de Futura y Gotham).
3. Arquitectura: tres líneas de negocio, menú nuevo en cada idioma,
   redirecciones de las URL que salen.
4. Contenido en español: portada, Servicios, Estudio de Expansión, Para
   asesores, Precios, Plataforma, Nosotros, Contacto, pie.
5. Contenido en inglés: línea internacional (no traducción).
6. Legales ajustados a consultoría + plataforma + oferta gratuita.
7. Ciclo de revisión en producción a 375, 768 y 1280 px hasta cumplir la lista.

---

## 3. Decisiones tomadas

(Se van anotando conforme se toman.)

- **Símbolo extraído de los vectores del PDF**, no redibujado: vértices exactos
  leídos con pdf.js. La barra izquierda es `#C63030`, un rojo que no está en la
  tabla de la paleta pero sí en el PDF; se respeta tal cual.
- **Recursos de marca en `public/brand/`** y no en `assets/brand/`: en Astro,
  `public/` es lo que se sirve, así los SVG tienen URL propia
  (`/brand/logo-horizontal.svg`, etc.).
- **Logotipo a trazos con Jost 500** ajustado a la caja medida en el PDF (mismo
  alto de mayúsculas, ancho y separación del símbolo). Si se compra Futura, se
  cambia una ruta en `scripts/build-brand.mjs` y se vuelve a generar.
- **Fuentes servidas desde el propio dominio** (no desde Google Fonts): ninguna
  IP de visitante sale a terceros. Mismo criterio que ya tenía el sitio.
- **`og-image.png` sin frase**: fondo negro, logotipo y dominio, con una franja
  del patrón. Sirve igual para la página en español y en inglés.
- **Un solo generador** (`npm run build:brand`) para símbolo, logotipos,
  patrón, favicon (SVG, PNG, ICO), icono de iOS e imagen para redes; sustituye
  a `scripts/build-og.mjs`, que dibujaba la marca anterior.
- **Historial de git no reescrito**: ver sección 1.
