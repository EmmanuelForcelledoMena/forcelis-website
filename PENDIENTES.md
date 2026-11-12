# Pendientes que solo tú puedes resolver

Cada punto dice qué falta, qué hace el sitio mientras tanto y dónde se pone el
dato cuando lo tengas. Ninguno está marcado como «TODO» en lo publicado: el
sitio funciona sin ellos. Cuando agregues un dato al repositorio, cualquier
sesión nueva puede integrarlo con estas instrucciones.

## Datos para el sitio

| Pendiente | Qué hace el sitio mientras tanto | Dónde va |
|---|---|---|
| **Foto del fundador** | Nosotros y About se muestran sin foto, solo con el texto | `src/assets/equipo/emmanuel.jpg` (retrato 4:5, unos 1200×1500). Aparece sola en las dos páginas |
| **URL de LinkedIn** | No se enlaza LinkedIn en Nosotros, About ni Contacto | `url_linkedin` en `src/config/negocio.ts` |
| **Correo de contacto del negocio** | No se publica ningún correo; el contacto es por el calendario y el formulario | Variable `PUBLIC_CONTACT_EMAIL` en GitHub (Settings → Secrets and variables → Actions → Variables) + descomentar su línea en `.github/workflows/deploy.yml`. Que sea de rol (`contacto@…`), no personal |
| **Entregables con la marca del asesor** | Precios y Para asesores dicen «por confirmar» y la pregunta frecuente dice que está en verificación | Confirmar si el producto ya lo hace. Si sí: cambiar los textos «por confirmar» en `src/locales/es/pricing.json` y la respuesta en `src/locales/es/advisors.json` |
| **Licencias de Futura y Gotham** | Se usan Jost y Montserrat, sus sustitutos libres; las pilas ya ponen Futura y Gotham primero | Si compras las licencias web: poner los `.woff2` en `public/fonts/` y declarar sus `@font-face` en `src/styles/global.css`. Para que el logotipo use Futura, apuntar `FUENTE_LOGO` en `scripts/build-brand.mjs` a su archivo y correr `npm run build:brand` |
| **Precio del Proyecto de Franquicia** | Se muestra «Cotización» | `src/config/negocio.ts`, servicio `franquicia` (y la lista aprobada en `scripts/check-precios.mjs`) |
| **Enlace de agenda** | Ya está puesto (Google Calendar) | `url_agenda` en `src/config/negocio.ts`, por si cambia |
| **Fotos de cabecera** (opcional) | Las cabeceras oscuras llevan el símbolo de la marca; las claras, la franja del patrón | `src/assets/heroes/<pagina>.jpg` (ver su README). Solo fotos propias o con licencia, nunca datos inventados |

## Comprobar tú mismo

| Pendiente | Por qué |
|---|---|
| **Un envío real de cada formulario** | Verifiqué en producción que los dos formularios arman el envío con el `tipo` correcto (y la campaña UTM), pero interceptándolo en el navegador: **no mandé ningún mensaje real** para no llenar tu bandeja ni enviar datos a Web3Forms sin tu permiso. Llena una vez `/es/contacto/?tipo=prueba` y otra `/en/contact/`, y revisa que los dos correos lleguen con su tipo |
| **La cuenta de Web3Forms** | Que el correo de destino configurado ahí sea el que quieres para las solicitudes |

## Seguridad y cuentas

| Pendiente | Por qué | Cómo |
|---|---|---|
| **Crear el repositorio privado `forcelis-private` en GitHub** | Los documentos internos se sacaron de este repositorio público y viven solo en tu disco (`Code/forcelis-private/`, sincronizado por OneDrive). Desde esta sesión no había `gh` ni sesión de GitHub para crearlo | Desde esa carpeta: `gh repo create EmmanuelForcelledoMena/forcelis-private --private --source . --push` |
| **Ocultar tu correo en los commits** | Tu correo personal aparece como autor en los commits hechos desde tu cuenta, y GitHub lo muestra | GitHub → Settings → Emails → «Keep my email addresses private» y «Block command line pushes that expose my email». Después: `git config --global user.email "<tu-id>+EmmanuelForcelledoMena@users.noreply.github.com"` |
| **(Opcional) Reescribir el historial** | Solo si quieres borrar del historial la mención del correo en un mensaje de commit antiguo. Ver `CHANGELOG-rebranding.md`, sección 1: no se hizo porque no resuelve los metadatos de autor y no había dónde respaldar | 1) `git clone --mirror` a una carpeta aparte y súbela al repositorio privado. 2) `pip install git-filter-repo`. 3) `git filter-repo --replace-message <archivo-con-reemplazos>`. 4) `git push --force --all && git push --force --tags`. 5) Verificar que Pages publique |
| **Ramas viejas en el remoto** | Quedan ramas de sesiones anteriores (`claude/sharp-knuth-dlgq8m`, `deps/npm-audit-fix-lockfile`, `etapa-a/responsive-accesibilidad`, `saas/oferta-precios-y-conversion`, `reestructura-cfdi`, `auditoria-producto-local`, `giro-consultoria`). No publican nada, pero tienen la versión anterior del sitio | Borrarlas desde GitHub cuando ya no las necesites. No las borré: no eran mías de decidir |
| **Credenciales a rotar** | **Ninguna.** No se encontró ninguna credencial en el repositorio ni en su historial | — |

## Legal

| Pendiente | Estado |
|---|---|
| **Datos de la sociedad** (denominación social, domicilio, número de registro) | Sin ellos, el aviso de privacidad y los términos no pueden decir con precisión quién es el responsable. Los textos ya cubren la consultoría, la plataforma y la oferta gratuita; falta esa identificación |
| **Ley aplicable** | La cláusula «se rigen por las leyes de los Estados Unidos Mexicanos» y la referencia a derechos ARCO vienen del sitio anterior y suponen ley mexicana. Confírmalo con el abogado según dónde esté constituida la sociedad y cámbialo en `src/locales/*/legal.json` |
| **Revisión por un abogado** | De los dos legales en ambos idiomas, y de las condiciones de la oferta de lanzamiento, antes de cobrar el primer servicio |
| **Analítica** | Antes de poner un `ga4_id` (u otro) en `negocio.ts`, actualizar «Cookies y analítica» del aviso de privacidad, que hoy dice que no hay ningún servicio activo |
