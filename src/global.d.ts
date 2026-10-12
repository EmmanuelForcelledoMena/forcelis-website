/**
 * Lo que el sitio cuelga de `window`.
 *
 * `forcelisEvento` lo define `CookieNotice.astro` y existe SIEMPRE, con o sin
 * consentimiento: cuando no lo hay, no hace nada. Está declarada opcional de
 * todos modos porque el script que la define se ejecuta al final del documento
 * y un `<script>` anterior podría llamarla antes de tiempo; con `?.` en el sitio
 * de llamada, ese caso es inofensivo en vez de un error en consola.
 */
declare global {
  interface Window {
    forcelisEvento?: (nombre: string, datos?: Record<string, unknown>) => void;
    /** Google Analytics / Google Ads. La carga `CookieNotice.astro`. */
    gtag?: (...args: unknown[]) => void;
    /** Meta Pixel. La carga `CookieNotice.astro`. */
    fbq?: (...args: unknown[]) => void;
    /** Bandera interna del cargador de Meta Pixel; la pone su propio fragmento. */
    _fbq?: unknown;
    dataLayer?: unknown[];
  }
}

export {};
