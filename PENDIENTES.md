# Pendientes que solo tú puedes resolver

Cada punto dice qué falta, qué hace el sitio mientras tanto y dónde se pone el
dato cuando lo tengas. Ninguno está marcado como «TODO» en lo publicado: el
sitio funciona sin ellos.

## Datos para el sitio

| Pendiente | Qué hace el sitio mientras tanto | Dónde va |
|---|---|---|
| **Foto del fundador** | Nosotros se muestra sin foto, solo con el texto | `src/assets/equipo/emmanuel.jpg` (retrato 4:5, ~1200×1500) |
| **URL de LinkedIn** | No se pinta el enlace | `url_linkedin` en `src/config/negocio.ts` |
| **Correo de contacto del negocio** | No se publica ningún correo; el contacto es por formulario y agenda | Variable `PUBLIC_CONTACT_EMAIL` en GitHub + descomentar su línea en `.github/workflows/deploy.yml`. Que sea de rol (`contacto@…`), no personal |
| **Entregables con la marca del asesor** | Se dice «por confirmar» en Precios y en Para asesores | Confirmar si el producto ya lo hace; si sí, cambiar `marca_propia` en `src/config/negocio.ts` |
| **Licencias de Futura y Gotham** | Se usan Jost y Montserrat, que son los sustitutos libres | Si compras las licencias web: poner los `.woff2` en `public/fonts/` y declarar sus `@font-face` en `src/styles/global.css`. Las pilas de fuentes ya ponen Futura y Gotham primero |
| **Precio del Proyecto de Franquicia** | Se muestra «Cotización» | `src/config/negocio.ts`, servicio `franquicia` |

## Seguridad y cuentas

| Pendiente | Por qué | Cómo |
|---|---|---|
| **Crear el repositorio privado `forcelis-private` en GitHub** | Los documentos internos se sacaron de este repositorio público y viven solo en tu disco (`Code/forcelis-private/`, sincronizado por OneDrive) | Desde esa carpeta: `gh repo create EmmanuelForcelledoMena/forcelis-private --private --source . --push` |
| **Ocultar tu correo en los commits** | Tu correo personal aparece como autor en los commits hechos desde tu cuenta, y GitHub lo muestra | GitHub → Settings → Emails → «Keep my email addresses private» y «Block command line pushes that expose my email». Después: `git config --global user.email "<tu-id>+EmmanuelForcelledoMena@users.noreply.github.com"` |
| **(Opcional) Reescribir el historial** | Solo si quieres borrar del historial la mención del correo en un mensaje de commit antiguo. Ver la explicación en `CHANGELOG-rebranding.md`: no se hizo porque no resuelve los metadatos de autor y no había dónde respaldar | 1) `git clone --mirror` a una carpeta aparte y súbela al repositorio privado. 2) `pip install git-filter-repo`. 3) `git filter-repo --replace-message <archivo-con-reemplazos>`. 4) `git push --force --all && git push --force --tags`. 5) Verificar que Pages publique |
| **Credenciales a rotar** | **Ninguna.** No se encontró ninguna credencial en el repositorio ni en su historial | — |

## Legal

| Pendiente | Estado |
|---|---|
| **Datos de la sociedad** (denominación social, domicilio registrado, número de registro) | Sin ellos, el aviso de privacidad y los términos no pueden decir con precisión quién es el responsable ni qué ley aplica. Los textos ya describen la consultoría, la plataforma y la oferta gratuita; falta esa identificación |
| **Revisión por un abogado** | Antes de cobrar el primer servicio |
