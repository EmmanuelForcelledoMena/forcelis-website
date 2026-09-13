# Forcelis Group — sitio web

Sitio corporativo bilingüe (inglés y español) de **Forcelis Group**, estático y
publicado en GitHub Pages sobre el dominio `forcelis-group.com`.

Nueve páginas por idioma: portada, soluciones, plataforma, diagnóstico
empresarial, industrias, nosotros, contacto, aviso de privacidad y términos.

---

## Arranque

```bash
npm install
```

```bash
npm run dev
```

`http://localhost:4321` — la raíz reenvía a `/en/` o a `/es/` según la
preferencia guardada y, si no hay ninguna, según el idioma del navegador.

```bash
npm run build     # genera dist/
npm run preview   # sirve dist/ como lo hará GitHub Pages
npm run check     # tipos de TypeScript y de las plantillas Astro
```

`npm run check` tiene que salir en **0 errores, 0 avisos, 0 sugerencias** antes
de subir nada: es lo que atrapa que una traducción perdió una clave.

---

## Estructura

```
src/
├── i18n/
│   ├── routes.ts     mapa página → slug por idioma; lo usa el selector de idioma
│   └── index.ts      carga de diccionarios, con el tipo anclado al inglés
├── locales/
│   ├── en/           un JSON por página
│   └── es/           mismas claves, mismo orden
├── components/
│   ├── pages/        el cuerpo de cada página, compartido por los dos idiomas
│   └── *.astro       navegación, pie, tarjetas, tablero, diagramas, formulario
├── layouts/Base.astro  <head> completo: SEO, hreflang, Open Graph, JSON-LD
├── pages/
│   ├── index.astro   raíz: reenvía a un idioma
│   ├── 404.astro     bilingüe, porque GitHub Pages sirve una sola para todo
│   ├── en/*.astro    slugs en inglés
│   └── es/*.astro    slugs en español
└── styles/global.css tokens de color y tipografía

public/               CNAME, favicons, og-image.png, tipografías Montserrat e Inter
src/assets/heroes/    fotografía de cabecera por página (ver su README)
src/assets/industries/ fotografía por sector (ver su README)
scripts/build-og.mjs  regenera og-image.png, apple-touch-icon.png y los favicons
```

### Las dos reglas de este repositorio

**1. Inglés y español no son dos sitios.** Son dos versiones localizadas del
mismo. La maquetación vive una sola vez en `src/components/pages/`; lo único que
cambia es el diccionario que recibe. Si te encuentras copiando una plantilla
para cambiarle el texto, algo se hizo mal.

**2. Ningún texto vive en una plantilla.** Todo el copy está en
`src/locales/`. Un texto escrito directamente en un `.astro` es un texto que
existe en un idioma y no en el otro, y eso no falla: simplemente sale en inglés
en la versión en español.

### Agregar una página

1. Añade la clave a `PageKey` y su par de slugs a `SLUGS`, en `src/i18n/routes.ts`.
2. Crea `src/locales/en/<pagina>.json` y `src/locales/es/<pagina>.json`.
3. Regístralos en `DICTIONARIES`, en `src/i18n/index.ts`.
4. Crea el cuerpo en `src/components/pages/<Pagina>Page.astro`.
5. Crea los dos archivos de ruta: `src/pages/en/<slug-en>.astro` y
   `src/pages/es/<slug-es>.astro`, cada uno de tres líneas.

El selector de idioma, el `hreflang`, el canónico y el sitemap salen solos del
paso 1. Si la agregas a `NAV_PAGES` también aparece en la navegación.

### Traducir

Los dos JSON de una página tienen **las mismas claves**. El tipo de retorno de
`t()` está anclado al inglés a propósito: si al español le falta una clave, el
error sale en `npm run check` y no en producción con un hueco en la pantalla.

El español es de México y no una traducción literal. «Turn business data into
better decisions» es «Convierte los datos de tu empresa en mejores decisiones»,
no «Convierte datos de negocio en mejores decisiones».

---

## Variables de entorno

Copia `.env.example` a `.env`. Ninguna es secreta: Astro solo expone las que
llevan prefijo `PUBLIC_`, y todas terminan en el HTML publicado.

| Variable | Para qué | ¿Obligatoria? |
|---|---|---|
| `PUBLIC_FORM_ENDPOINT` | Destino del formulario de contacto | **Sí, antes de publicar** |
| `PUBLIC_FORM_ACCESS_KEY` | Clave del formulario cuando el proveedor la pide en el cuerpo del envío (Web3Forms). Vacía con Formspree, que la lleva en la URL | Según el proveedor |
| `PUBLIC_CONTACT_EMAIL` | Correo publicado en contacto y en el aviso de privacidad. **Desactivada en el workflow**: ver abajo | No |
| `PUBLIC_GA_ID` | Google Analytics | No |
| `PUBLIC_CLARITY_ID` | Microsoft Clarity | No |

**Sin `PUBLIC_FORM_ENDPOINT` el formulario no envía nada** y lo dice en pantalla,
con el botón deshabilitado. Es a propósito: un formulario que parece funcionar y
descarta el mensaje es peor que no tener formulario.

**`PUBLIC_CONTACT_EMAIL` no se inyecta en la build** —está comentada en
`.github/workflows/deploy.yml`, con el motivo escrito ahí—, así que el sitio no
publica ningún correo: la página de contacto omite el bloque y el aviso de
privacidad enlaza el formulario como vía para ejercer derechos. Para volver a
publicar uno, que sea de rol (`contacto@`, no personal): descomentar la línea
del workflow y definir la variable.

En GitHub, estas variables se definen en **Settings → Secrets and variables →
Actions → Variables** (pestaña *Variables*, no *Secrets*). El workflow las
inyecta en la build.

---

## Despliegue

### Paso 1 — Crear el repositorio y subirlo

```bash
git init
git add .
git commit -m "Sitio corporativo bilingüe de Forcelis Group"
git branch -M main
git remote add origin https://github.com/EmmanuelForcelledoMena/forcelis-website.git
git push -u origin main
```

El repositorio tiene que ser **público** si la cuenta es del plan gratuito:
GitHub Pages no publica repositorios privados sin plan de pago.

### Paso 2 — Habilitar Pages

**Settings → Pages → Build and deployment → Source: GitHub Actions.**

No elijas «Deploy from a branch». El workflow de `.github/workflows/deploy.yml`
compila y publica solo, en cada push a `main`.

Con esto el sitio ya vive en
`https://emmanuelforcelledomena.github.io/forcelis-website/` — pero con las
rutas rotas, porque `astro.config.mjs` está configurado para servirse desde la
raíz de un dominio propio. Es esperado; se arregla en el paso 4.

### Paso 3 — DNS en GoDaddy

**Este paso va ANTES que el paso 4. No los inviertas.**

GoDaddy → **Mis productos** → `forcelis-group.com` → **DNS** → **Administrar
zonas DNS**.

| Tipo | Nombre | Valor | TTL |
|---|---|---|---|
| A | `@` | `185.199.108.153` | 600 |
| A | `@` | `185.199.109.153` | 600 |
| A | `@` | `185.199.110.153` | 600 |
| A | `@` | `185.199.111.153` | 600 |
| CNAME | `www` | `emmanuelforcelledomena.github.io` | 600 |

Dos detalles que cuestan una tarde:

- GoDaddy trae de fábrica un registro `A` en `@` apuntando a su página de
  estacionamiento. **Hay que borrarlo o editarlo**, no dejarlo conviviendo con
  los cuatro nuevos: si se queda, una de cada cinco visitas cae en el parking.
- El valor del CNAME termina en `.github.io` **sin** el nombre del repositorio y
  sin `https://`.

Comprobar la propagación antes de seguir:

```bash
nslookup forcelis-group.com
```

```bash
nslookup www.forcelis-group.com
```

El apex tiene que devolver las cuatro IP de arriba. Puede tardar de unos minutos
a unas horas.

### Paso 4 — Dominio propio en GitHub

Solo cuando el paso 3 ya resuelve:

**Settings → Pages → Custom domain** → escribir `forcelis-group.com` (sin
`https://`, sin `www`) → **Save**.

> **Esto ya salió mal una vez, en el sitio del portafolio.** Escribir un dominio
> en esa casilla antes de que el DNS apunte a GitHub tumba el sitio: GitHub
> acepta el valor, escribe el archivo `CNAME` y redirige con un 301 permanente a
> un dominio que no resuelve. Deja de servirse todo, incluida la URL
> `*.github.io`, y el 301 se queda cacheado en los navegadores que ya pasaron por
> ahí. Se arregla borrando el dominio de la casilla, pero es una hora perdida.

El archivo `public/CNAME` ya está en el repositorio con el valor correcto, así
que GitHub lo va a encontrar y solo tiene que verificarlo. Espera a que aparezca
**«DNS check successful»**.

### Paso 5 — HTTPS

En cuanto GitHub emita el certificado —hasta una hora— marca **Enforce HTTPS**
en esa misma pantalla. Antes de eso la casilla aparece deshabilitada; no es un
error, es que el certificado todavía no existe.

### Paso 6 — Verificación del dominio (opcional, recomendado)

Evita que otra cuenta reclame el dominio en Pages:

1. **Settings de la cuenta** (no del repositorio) → **Pages** → **Verified
   domains** → agregar `forcelis-group.com`.
2. GitHub genera un registro `TXT` con nombre `_github-pages-challenge-emmanuelforcelledomena`.
3. Agregarlo en GoDaddy con el valor exacto que dé GitHub.
4. Confirmar en GitHub cuando propague.

---

## Antes de publicar

- [ ] `npm run check` — 0 errores, 0 avisos, 0 sugerencias
- [ ] `npm run build && npm run preview` — recorrer las dos versiones
- [ ] `PUBLIC_FORM_ENDPOINT` configurada y **probada con un envío real**
- [ ] Aviso de privacidad y términos revisados por alguien de legal
- [ ] Si activaste analítica, actualizar el apartado «Cookies y analítica» del
      aviso de privacidad: hoy afirma que no hay ningún servicio activo

---

## Decisiones que conviene conocer antes de tocar el código

**La paleta y la tipografía vienen del manual de marca.** Seis colores —fondo
`#f7f6f4`, taupe `#c7c3a9`, tinta `#1a1a1a`, gris `#5a5a5a`, rojo `#c02626` y
rojo oscuro `#8b1e1e`— y dos familias: Montserrat para titulares y la marca
denominativa, Inter para el texto. Los grises de tarjeta y línea son derivados.
Todo está en `src/styles/global.css`, con el contraste de cada par medido y
anotado. Dos reglas salen de esas medidas y no se negocian:

- **El rojo es texto solo sobre claro.** Da 5.5:1 sobre el fondo (AA) — por eso
  el remate del titular del hero puede ir en rojo — pero **2.94:1 sobre tinta**,
  que falla incluso como texto grande. Sobre superficies oscuras el acento es el
  **taupe** (9.8:1), que es también lo que hace el logotipo en su versión oscura.
  Por lo mismo, los botones son rojos sobre claro y taupe sobre tinta.
- **El taupe no es texto sobre claro** (1.65:1): ahí solo es relleno.

El gris del manual da 6.4:1 sobre fondo: AA, no AAA. Es una decisión de marca
tomada a sabiendas; la paleta anterior, heredada del producto, estaba en 7:1.

**El logotipo vive en tres archivos** y cambiarlo es cambiar los tres:
`src/components/Wordmark.astro` (lockup de la barra y el pie),
`public/favicon.svg` y `scripts/build-og.mjs` (tarjeta social e icono de iOS,
regenerados con `npm run build:og`). El glifo está redibujado en vectores a
partir del manual; los ajustes respecto a él son de espaciado. Los recursos
para la página de LinkedIn (logotipo, portada, textos de cada campo) están en
`brand/linkedin/` y se regeneran con `npm run build:linkedin`.

**Nada depende de JavaScript para poder leerse.** La animación de entrada se
apaga sola si el observador del navegador no responde en dos segundos; el panel
del score ya trae escritos el número y el ancho finales antes de animarse; el
formulario funciona con un POST normal si el script no carga. Es la diferencia
entre una animación y una página en blanco.

**Las cifras de los tableros son inventadas, van etiquetadas y cuadran entre
sí.** Las doce barras de la gráfica del hero suman los 184.2M del indicador de
ingresos, y la media de la línea de margen es el 31.6% de su tarjeta. Si cambias
una, cambia la otra: el público de este sitio son personas que trabajan con
números y notan un tablero que no cuadra.

**La página de plataforma separa lo que funciona de lo que no.** La columna
«Disponible hoy» solo lista capacidades que están corriendo en el producto. Lo
que está construido pero apagado —el benchmark sectorial, el copiloto— vive en
«En desarrollo». Antes de mover algo de columna, verifícalo en el repositorio de
la plataforma; esa distinción es la mitad de la credibilidad de la página.

**Sin logotipos de clientes, sin años de experiencia, sin premios.** Forcelis es
una empresa nueva y el sitio lo dice en la página «Nosotros». La confianza la
construyen el método y el producto, que están descritos con suficiente detalle
para poder evaluarlos.

---

## Stack

Astro 5 · TypeScript en modo estricto · Tailwind CSS 4 · sin framework de
componentes en el cliente.

Todo el JavaScript que llega al navegador son tres bloques cortos: el menú
móvil, el revelado al hacer scroll y el envío del formulario. No hay biblioteca
de animación, no hay biblioteca de gráficas —el tablero es SVG generado en la
build— y no hay peticiones a dominios de terceros: Montserrat e Inter se sirven
desde el propio sitio.
