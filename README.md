# Forcelis Group — sitio web

Sitio de **Forcelis**, estático y publicado en GitHub Pages sobre el dominio
`forcelis-group.com`.

Desde el rebranding de noviembre de 2026 el sitio se organiza en **tres líneas
de negocio**, cada una en su idioma:

| Línea | Cliente | Dónde vive |
|---|---|---|
| Consultoría México | Pequeños negocios y PyMEs mexicanas | `/es/`, `/es/servicios/`, `/es/estudio-de-expansion/` |
| Plataforma para asesores | Contadores, despachos y consultores | `/es/para-asesores/`, `/es/precios/`, `/es/plataforma/` |
| Consultoría internacional | Empresas extranjeras que entran a México | `/en/`, `/en/services/`, `/en/about/`, `/en/contact/` |

**El inglés no es una traducción del español.** Le habla a otro cliente, con
otros servicios y otros precios. Lo único que comparten los dos idiomas es la
barra, el pie, el formulario, la página de gracias y los legales.

Forcelis no hace contabilidad ni declaraciones, y eso se dice en el pie de
todas las páginas.

El registro del rebranding está en [`CHANGELOG-rebranding.md`](CHANGELOG-rebranding.md)
y lo que falta por resolver en [`PENDIENTES.md`](PENDIENTES.md).

---

## Arranque

```bash
npm install
```

```bash
npm run dev
```

`http://localhost:4321` — la raíz reenvía a `/es/` (o a `/en/` si la persona
eligió el inglés con el selector).

```bash
npm run build          # genera dist/
npm run preview        # sirve dist/ como lo hará GitHub Pages
npm run check          # tipos de TypeScript y de las plantillas Astro
npm run i18n:check     # paridad de los diccionarios compartidos y texto del otro idioma
npm run test:calc      # los casos de la calculadora de margen y de la oferta
npm run audit          # revisa dist/: enlaces, URL viejas, encabezados, alt, textos prohibidos
npm run check:precios  # precios de negocio.ts contra lo aprobado y contra el build
npm run build:brand    # regenera símbolo, logotipos, patrón, favicon y og-image
npm run build:linkedin # regenera los recursos de LinkedIn
```

Las seis primeras de golpe, en el orden correcto:

```bash
npm run verify
```

`npm run check` tiene que salir en **0 errores, 0 avisos, 0 sugerencias** antes
de subir nada.

---

## Estructura

```
src/
├── config/
│   ├── negocio.ts    PRECIOS, oferta de lanzamiento, ligas e IDs — archivo único
│   └── enlaces.ts    resuelve los botones de agenda y contacto, con su `?tipo=`
├── i18n/
│   ├── routes.ts     páginas por idioma, menús, páginas equivalentes (hreflang)
│   ├── index.ts      diccionarios: t() para los compartidos, es()/en() para los propios
│   └── servicios.ts  el catálogo de consultoría con sus importes ya resueltos
├── locales/
│   ├── es/           un JSON por página en español
│   └── en/           un JSON por página en inglés (common, contact, thanks y legal
│                     tienen la misma forma que en español)
├── components/
│   ├── pages/        el cuerpo de cada página
│   └── *.astro       barra, pie, logotipo, cabecera, tarjetas, diagramas, formulario
├── layouts/Base.astro  <head> completo: SEO, hreflang, Open Graph, JSON-LD
├── pages/
│   ├── index.astro   raíz: reenvía a /es/
│   ├── 404.astro     bilingüe, porque GitHub Pages sirve una sola para todo
│   ├── es/*.astro    rutas en español
│   └── en/*.astro    rutas en inglés
└── styles/global.css paleta de marca (--fc-*), tokens del sitio y tipografía

public/brand/         simbolo.svg, logo-horizontal.svg, logo-horizontal-blanco.svg, patron.svg
public/fonts/         Jost y Montserrat, servidas desde el propio dominio
public/               CNAME, favicons, og-image.png
src/assets/heroes/    fotografía de cabecera por página (opcional, ver su README)
src/assets/equipo/    foto del fundador (opcional, ver su README)
brand/linkedin/       recursos para la página de empresa en LinkedIn
docs/capturas-rebranding/  capturas del sitio en producción a 375, 768 y 1280 px
```

### Las reglas de este repositorio

**1. Ningún precio fuera de `negocio.ts`.** Ni en una plantilla ni en un
diccionario. `npm run check:precios` falla si una página publica un importe que
no sale de ese archivo, y también si el archivo deja de coincidir con la lista
aprobada (que vive en el propio script: cambiar un precio es una decisión en
dos sitios, nunca un dedazo en uno).

**2. Ningún texto vive en una plantilla.** Todo el copy está en
`src/locales/`. Las cifras de la oferta («3 meses», «50 asesores») se escriben
en el texto como `{months}` y `{n}` y las rellena la página desde `negocio.ts`.

**3. Nada inventado.** Ni clientes, ni testimonios, ni cifras. Todo tablero o
reporte de ejemplo lleva la etiqueta «Datos ilustrativos». Si falta un dato que
solo tiene el dueño (foto, LinkedIn, correo), la página funciona sin él y el
pendiente va a `PENDIENTES.md`; nunca un «TODO» publicado. `npm run audit`
busca esos marcadores en el build.

### Agregar una página

1. Añade la clave a `PageKey` y su slug a `SLUGS` en `src/i18n/routes.ts`, solo
   en el idioma o idiomas donde exista.
2. Crea su JSON en `src/locales/<idioma>/` y regístralo en `src/i18n/index.ts`.
3. Crea el cuerpo en `src/components/pages/` y la ruta en `src/pages/<idioma>/`.
4. Si debe ir en el menú, añádela a `NAV_PAGES[idioma]`. Si es la misma página
   en los dos idiomas (una traducción de verdad), añádela a `EQUIVALENT_PAGES`
   para que lleve `hreflang`.

`path()` falla en la build si se le pide una página que no existe en ese idioma:
un enlace roto es un error de compilación.

### Retirar una página

No se borra la URL: se añade a `redirects` en `astro.config.mjs`, apuntando a la
página que hoy cubre lo mismo. Astro genera el reenvío (meta refresh + canónica
+ enlace visible) y `npm run audit` avisa si algún enlace interno sigue
apuntando a la URL vieja.

---

## Precios y oferta

Todo el dinero del sitio vive en `src/config/negocio.ts`: los seis servicios de
consultoría (pesos más IVA), los planes de la plataforma y la empresa adicional,
la oferta de lanzamiento (`oferta_lanzamiento`: plan, meses gratis, cupo y el
descuento posterior) y los servicios internacionales (dólares).

`mostrar_precios: false` apaga los importes de la plataforma (planes y
calculadora) en todas las páginas; los servicios de consultoría se siguen
mostrando porque su precio es parte de la oferta.

Los demás valores del mismo archivo:

| Clave | Qué hace si está vacía |
|---|---|
| `url_agenda` | «Agenda una llamada» cae al formulario de contacto con su `?tipo=` |
| `url_linkedin` | No se enlaza LinkedIn en Nosotros ni en Contacto |
| `url_app` | No se muestra el enlace «Entrar» en la barra |
| `ga4_id`, `meta_pixel_id`, `google_ads_id` | Ese script no se carga, y si los tres están vacíos no sale el banner de cookies |

---

## Anuncios y medición

**Ningún script de tercero se carga sin consentimiento.** El banner de
`CookieNotice.astro` tiene rechazo por omisión y dos botones del mismo peso;
hasta que alguien pulsa «Aceptar» no se pide nada a ningún dominio externo,
Google Analytics incluido. Es lo que exigen las normas de protección de datos
más estrictas que le aplican a un sitio con visitantes de varios países.

**Antes de poner un identificador de analítica hay que actualizar el aviso de
privacidad**, que hoy dice que no hay ningún servicio activo. Esa frase deja de
ser cierta en cuanto `ga4_id` tenga valor.

La campaña viaja **por la URL, no por el navegador**: los `utm_*` de la URL de
llegada se copian a los enlaces internos y a la liga de agenda (`Base.astro`),
y el formulario los lee de su propia URL hacia campos ocultos. No se guarda
nada, así que un prospecto que rechaza las cookies llega igual con su campaña.

Los eventos que se registran —solo con consentimiento— son `agenda_click` al
pulsar el botón de la barra y `generate_lead` al aterrizar en Gracias, este
último con el `tipo` de solicitud como parámetro.

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

- [ ] `npm run verify` — las seis comprobaciones, sin hallazgos
- [ ] `npm run preview` — recorrer las tres líneas (consultoría, asesores, inglés)
- [ ] `PUBLIC_FORM_ENDPOINT` configurada y **probada con un envío real de cada
      uno de los tipos** (diagnostico, expansion, mercado, asesor, prueba,
      internacional), comprobando que el correo llega con su tipo y
      sus `utm_*`
- [ ] Aviso de privacidad y términos revisados por alguien de legal
- [ ] **Antes de poner un identificador de analítica**, actualizar el apartado
      «Cookies y analítica» del aviso de privacidad: hoy afirma que no hay
      ningún servicio activo, y deja de ser cierto en cuanto `ga4_id` tenga
      valor

---

## Decisiones que conviene conocer antes de tocar el código

**Un estilo por audiencia.** Las páginas para dueños de negocio en México van
en blanco cálido, texto negro y rojo de acento: cercanas, no corporativas. Las
de asesores (Para asesores, Precios, Plataforma) y toda la versión en inglés
abren con una cabecera negra con el símbolo en rojo, más tecnológica. Lo decide
la prop `tone` de `PageHero.astro` y `Cta.astro`.

**La marca sale de un solo lugar.** Los cinco colores están en `:root` de
`src/styles/global.css` como `--fc-vino`, `--fc-rojo`, `--fc-negro`,
`--fc-blanco` y `--fc-arena`, y el tema de Tailwind los lee de ahí. El símbolo y
el logotipo salen de los vectores del PDF de marca y los genera
`scripts/build-brand.mjs`; `Wordmark.astro` lee los trazos del SVG generado, así
que cambiar la marca es correr ese script.

**Reglas de contraste, medidas y no negociables:**

- Texto blanco sobre rojo (6.3:1) y negro sobre blanco o arena: sí.
- **Rojo y vino sobre negro: nunca como texto** (2.5:1 y 1.7:1). Sobre fondo
  oscuro el acento de texto es la arena (8.8:1); el rojo solo va en el símbolo
  o en formas grandes que no son texto.
- Rojo sobre blanco, solo en títulos grandes. El texto pequeño de acento sobre
  claro va en vino (9.5:1).
- La arena no es texto sobre claro (1.9:1): solo superficie o separador.

**El patrón es un detalle.** Las barras diagonales van como franja fina
(`franja-marca`): bajo las cabeceras claras, sobre el pie y en los cierres.
Nunca como fondo detrás de texto.

**Tipografía con la licencia en espera.** Las pilas son
`"Futura", "Jost"` y `"Gotham", "Montserrat"`. Jost y Montserrat se sirven desde
el propio dominio; si se compran las licencias de Futura y Gotham, se añaden sus
`@font-face` en `global.css` y no cambia nada más.

**Nada depende de JavaScript para poder leerse.** La animación de entrada se
apaga sola si el observador del navegador no responde en dos segundos; el panel
del score ya trae escritos el número y el ancho finales antes de animarse; el
formulario funciona con un POST normal si el script no carga.

**La página de plataforma separa lo que funciona de lo que no.** Lo que está en
«Qué incluye» y en las capacidades técnicas está corriendo en el producto. La
«Hoja de ruta» lista solo lo que está en desarrollo, con su etiqueta. Antes de
mover algo de lista, verifícalo en el repositorio de la plataforma.

**La marca propia del asesor está «por confirmar».** Mientras no se verifique en
el producto, ninguna página promete que los entregables salen con la marca del
asesor.

---

## Stack

Astro 5 · TypeScript en modo estricto · Tailwind CSS 4 · sin framework de
componentes en el cliente.

Todo el JavaScript que llega al navegador son bloques cortos: el menú móvil, el
revelado al hacer scroll, la calculadora de margen y el envío del formulario. No
hay biblioteca de animación ni de gráficas —los tableros son SVG generados en la
build— y no hay peticiones a dominios de terceros: las tipografías se sirven
desde el propio sitio.
