/* c-nav.js — barra inferior común (auto-inyectada) para
   cursocatolico.com · wikitolica.com · buscadorcatolico.com
   No requiere HTML: crea su propio nodo y lo añade como último hijo
   de <html> (fuera de <body>) para no heredar zoom/overflow/filter. */
(() => {
  if (window.__cNav) return;
  window.__cNav = 1;

  function start() {
    const SITES = [
      ['cursocatolico.com',    '🎓', 'Curso<br>Católico'],
      ['wikitolica.com',       '📖', 'Enciclopedia<br>Católica'],
      ['buscadorcatolico.com', '🔍', 'Buscador<br>Católico'],
    ];
    const host = location.hostname;

    const getAmazonDomain = () => {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const lang = navigator.language.toLowerCase();
      if (tz === 'Europe/Madrid' && lang.startsWith('es')) return '.es';
      if ((tz.startsWith('America/Mexico') || tz === 'America/Cancun') && lang.startsWith('es')) return '.com.mx';
      return '.com';
    };

    const isMassDay = () => {
      const d = new Date(), day = d.getDay(), date = d.getDate(), m = d.getMonth();
      return day === 0 || [[1,0],[6,0],[19,2],[25,6],[15,7],[1,10],[8,11],[25,11]].some(([dt, mo]) => dt === date && mo === m);
    };

    const links = SITES.map(([domain, icon, label]) =>
      `<a href="https://www.${domain}"${host.includes(domain) ? ' class="active"' : ''}><span class="i" aria-hidden="true">${icon}</span><span class="l">${label}</span></a>`
    ).join('');

    const lastSlot = isMassDay()
      ? `<a style="cursor:default;pointer-events:none;color:#aaa"><span class="i" aria-hidden="true">⛪</span><span class="l">Hoy es<br>Precepto</span></a>`
      : `<a href="https://www.amazon${getAmazonDomain()}/dp/B0F5X1L52T?binding=paperback" rel="external nofollow noopener" target="_blank"><span class="i" aria-hidden="true">📚</span><span class="l">Nuestros<br>Libros</span></a>`;

    const el = document.createElement('div');
    el.id = 'c-nav';
    document.documentElement.appendChild(el);
    const root = el.attachShadow({ mode: 'closed' });

    root.innerHTML = `<style>
:host{all:initial;contain:layout style paint;--cn-bg:#141414;--cn-hover:#3a3a3a;position:fixed;bottom:calc(9px + env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);display:flex;gap:8px;padding:10px max(12px,env(safe-area-inset-left)) 10px max(12px,env(safe-area-inset-right));background:var(--cn-bg);border-radius:16px;z-index:990;font:16px system-ui,sans-serif;line-height:1.4;flex-wrap:wrap;justify-content:center;border:solid 1px rgba(255,255,255,.08);outline:0 !important;-webkit-text-size-adjust:100%;text-size-adjust:100%;letter-spacing:normal;word-spacing:normal;font-kerning:normal;font-feature-settings:normal;font-variant:normal;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
@media(prefers-color-scheme:dark){:host{--cn-bg:#262626;--cn-hover:#454545;border-color:rgba(255,255,255,.14)}}
*{box-sizing:border-box;outline:0 !important;font-family:system-ui,sans-serif;font-weight:400;-webkit-text-size-adjust:100%;text-size-adjust:100%;letter-spacing:normal;word-spacing:normal;font-kerning:normal;font-feature-settings:normal;font-variant:normal;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
a{display:flex;align-items:center;justify-content:center;gap:8px;padding:8px 12px;border-radius:12px;flex:1 1 auto;min-width:0;max-width:150px;color:#fff;text-decoration:none;transition:.2s ease}
a.active{background:var(--cn-hover)}
@media(hover:hover){a:hover{background:var(--cn-hover)}}
a:focus-visible{outline:2px solid #fff !important;outline-offset:-2px}
.i{font-size:24px;line-height:1;flex-shrink:0}
.l{font-size:12px;font-weight:500;line-height:1.15;white-space:normal;overflow-wrap:break-word;text-align:center;font-family:system-ui,sans-serif}
@media(max-width:480px){:host{padding:2px;padding-left:max(2px,env(safe-area-inset-left));padding-right:max(2px,env(safe-area-inset-right));gap:2px}a{padding:4px 6px;flex-direction:column;max-width:none;min-width:0}.l{font-size:10px}}
@media(min-width:481px) and (max-width:700px){:host{padding:6px 8px;gap:7px}a{padding:6px 10px;flex-direction:column}.l{font-size:11px}}
</style>${links}<a href="https://www.custodioanimae.com" target="_blank"><span class="i" aria-hidden="true">🎮</span><span class="l">Juego<br>Bíblico</span></a>${lastSlot}`;

    const fit = () => {
      const cw = document.documentElement.clientWidth;
      el.style.width = Math.max(280, Math.min(cw - 32, 740)) + 'px';
    };
    fit();
    window.addEventListener('resize', fit, { passive: true });
    window.addEventListener('orientationchange', fit, { passive: true });
    if (window.visualViewport) window.visualViewport.addEventListener('resize', fit, { passive: true });
  }

  document.body ? start() : document.addEventListener('DOMContentLoaded', start);
})();